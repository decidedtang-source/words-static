import {createHash} from 'node:crypto';
export const dimensions=['syntax','concept','contrast','languageGame','englishNeighbors','pragmaticAction','workplaceUse'];
const schemas={
 EntrySnapshot:['entryId','term','quote','batch','originalFileSHA','quoteSHA'],
 LexicalEntry:['lexicalEntryId','lemma','expressionType','language'],
 SourceRecord:['sourceId','version','title','url','accessMode','retrievedAt','coverage','rights','limitations'],
 Sense:['senseId','lexicalEntryId','pos','meaning','sourceRefs','version'],
 SenseInventory:['inventoryId','version','lexicalEntryId','sources','senseIds','coverageStatus'],
 LearningSelection:['entryId','version','inventoryRefs','selectedSenseIds','reason','general','senses'],
 ContextUse:['contextId','entryId','sourceRef','quote','quoteSHA','translation','quoteType','meaning','qualifiers','location'],
 HistoryRecord:['lexicalEntryId','version','summary','claims','sourceRefs','limitations'],
 BridgeRecord:['entryId','contextId','version','location','strategies','anchorRefs','targetRefs','semanticText','boundary','evidenceRefs'],
 PracticeCard:['practiceId','version','activity','goal','roles','evidenceCriteria','questions','responses','boundaries','sourceRefs'],
 AnalysisRecord:['entryId','contextId','version','promptHash','depth','depthReason','coverage','blocks','workplaceUse','practiceRefs','edges'],
 ReviewRecord:['reviewId','reviewer','role','scope','inputHash','artifactHash','checks','verdict','issues','time'],
 CandidateManifest:['batchId','planFreezeId','runAuthorizationRef','entryIds','itemStates','dependencies','moduleLocks','metrics']
};
const optional={EntrySnapshot:['originalIPA','originalMeaning','originalPOS'],SourceRecord:['claimScope','claims','sourceDate','evidencePath'],Sense:['sourceSenseId','usageLabels'],ContextUse:['senseRefs','targetSpans','expressionExplanation','context','sourceLabel','sourceURL','sourceDate'],BridgeRecord:['historyLink','historyClaimRefs','returnTargets']};
const arrays=new Set(['expressionType','limitations','sourceRefs','sources','senseIds','inventoryRefs','selectedSenseIds','senses','claims','strategies','anchorRefs','targetRefs','evidenceRefs','roles','questions','responses','boundaries','blocks','workplaceUse','practiceRefs','edges','checks','issues','entryIds','itemStates']);
const objects=new Set(['meaning','qualifiers','coverage','evidenceCriteria','dependencies','moduleLocks','metrics']);
const hash=s=>createHash('sha256').update(s).digest('hex');
export function validateEntity(kind,v){
 const errors=[];const need=schemas[kind];if(!need)return {valid:false,errors:['unknown kind']};
 if(!v||v.schemaVersion!==1)errors.push('unknown schemaVersion');
 if(!v||typeof v!=='object')return {valid:false,errors};
 const allowed=new Set(['schemaVersion',...need,...(optional[kind]||[])]);
 for(const k of Object.keys(v))if(!allowed.has(k))errors.push('unknown field '+k);
 for(const k of need){if(v[k]===undefined||v[k]===null){errors.push('missing '+k);continue;}
  if(arrays.has(k)&&!Array.isArray(v[k]))errors.push('array '+k);
  else if(!arrays.has(k)&&!objects.has(k)&&typeof v[k]!=='string')errors.push('string '+k);
 }
 const objectKeys=[...(kind==='Sense'?['meaning']:[]),...(kind==='ContextUse'?['qualifiers']:[]),...(kind==='AnalysisRecord'?['coverage']:[]),...(kind==='PracticeCard'?['evidenceCriteria']:[]),...(kind==='CandidateManifest'?['dependencies','moduleLocks','metrics']:[])];
 for(const k of objectKeys)if(!v[k]||typeof v[k]!=='object'||Array.isArray(v[k]))errors.push('object '+k);
 if(kind!=='Sense'&&'meaning'in v&&typeof v.meaning!=='string')errors.push('string meaning');
 if(errors.length)return {valid:false,errors};
 if(kind==='SourceRecord'){
  if(!['page','indexed_excerpt','licensed_snapshot','user_material'].includes(v.accessMode))errors.push('accessMode enum');
  if(!['complete','partial'].includes(v.coverage))errors.push('coverage enum');
  if(!/^\d{4}-\d\d-\d\dT.*(?:Z|[+-]\d\d:\d\d)$/.test(v.retrievedAt||''))errors.push('retrievedAt ISO timestamp');
  if(v.accessMode==='indexed_excerpt'&&v.coverage==='complete')errors.push('excerpt cannot be complete');
 }
 const refs=kind==='Sense'?v.sourceRefs:kind==='BridgeRecord'?v.evidenceRefs:kind==='HistoryRecord'?v.sourceRefs:[];
 if(Array.isArray(refs))for(const ref of refs)if(!ref||!ref.sourceId||!ref.sourceVersion||!ref.locator||!ref.supportedClaim)errors.push('EvidenceRef incomplete');
 if(kind==='Sense'&&(!v.meaning?.definitionEn||!v.meaning?.glossZh||!v.meaning?.glossOrigin))errors.push('meaning structure');
 if(kind==='ContextUse'){
  if(typeof v.quote==='string'&&hash(v.quote)!==v.quoteSHA)errors.push('quoteSHA mismatch');
  for(const s of v.targetSpans||[])if([...v.quote].slice(s.start,s.end).join('')!==s.text)errors.push('targetSpans mismatch');
  if(v.location==='unresolved'&&v.meaning)errors.push('unresolved cannot have definitive meaning');
  if(!(v.senseRefs?.length||v.expressionExplanation))errors.push('senseRefs or expressionExplanation required');
  for(const k of ['modality','conditions','agents','excludedInferences'])if(!Array.isArray(v.qualifiers?.[k]))errors.push('qualifiers '+k);
  if(v.expressionExplanation?.kind==='technical'&&!v.expressionExplanation.wholeExpressionRefs?.length)errors.push('technical whole evidence required');
  if(!['affirmative','negative','mixed'].includes(v.qualifiers?.polarity))errors.push('polarity enum');
 }
 if(kind==='LearningSelection')for(const s of v.senses||[]){if(!s.senseId||!s.title||!s.examples?.length||!s.evidenceRefs?.length)errors.push('learning sense incomplete');for(const e of s.examples||[])if(!e.en||!e.zh||!['licensed','short_quote','original'].includes(e.origin))errors.push('example origin/translation');}
 if(kind==='AnalysisRecord'){
  if(!Array.isArray(v.workplaceUse)||v.workplaceUse.length<2||v.workplaceUse.length>5)errors.push('workplaceUse 2..5');
  for(const use of Array.isArray(v.workplaceUse)?v.workplaceUse:[])if(!use.en||!use.zh||!use.whenToUse||use.origin!=='original')errors.push('workplaceUse content');
  for(const b of Array.isArray(v.blocks)?v.blocks:[])if(!b.blockId||!b.text||!Array.isArray(b.dimensions)||b.dimensions.some(k=>!dimensions.includes(k))||!Array.isArray(b.sourceRefs))errors.push('block structure');
  for(const e of Array.isArray(v.edges)?v.edges:[])if(!['collocation','contrast','required-evidence','role','typical-follow-up','condition'].includes(e.type)||!e.targetId||!e.targetVersion||!e.explanation)errors.push('edge structure');
  for(const k of dimensions){const c=v.coverage?.[k];if(!c||!['expanded','integrated','not_needed'].includes(c.mode))errors.push('coverage '+k);else{if(c.mode!=='expanded'&&!c.reason)errors.push('reason '+k);if(c.mode!=='not_needed'&&(!c.blockIds?.length||c.blockIds.some(id=>!v.blocks?.some(b=>b.blockId===id))))errors.push('block references '+k);}}
  if(Object.keys(v.coverage||{}).some(k=>!dimensions.includes(k)))errors.push('unknown coverage dimension');
 }
 if(kind==='BridgeRecord'&&(!v.semanticText||!v.boundary||!v.targetRefs?.length||!v.strategies?.length))errors.push('Bridge anchors/target/boundary');
 if(kind==='ReviewRecord'&&(!v.checks?.length||!['pass','fail','blocked'].includes(v.verdict)))errors.push('review checks/verdict');
 return {valid:!errors.length,errors};
}
export function validateReferences(b){
 const ids=new Set((b.senses||[]).map(s=>s.senseId)),missing=[];
 for(const id of [...(b.context?.senseRefs||[]),...(b.selection?.selectedSenseIds||[]),...(b.inventory?.senseIds||[]),...(b.bridge?.anchorRefs||[]),...(b.bridge?.targetRefs||[])])if(!ids.has(id))missing.push(id);
 for(const ref of b.selection?.inventoryRefs||[])if((typeof ref==='string'?ref:ref.inventoryId)!==b.inventory?.inventoryId)missing.push(typeof ref==='string'?ref:ref.inventoryId);
 for(const ref of b.analysis?.practiceRefs||[])if(!b.practices?.some(p=>p.practiceId===ref.practiceId&&p.version===ref.version))missing.push(ref.practiceId);
 const claims=new Set((b.history?.claims||[]).map(c=>c.claimId));for(const id of [...(b.bridge?.historyClaimRefs||[]),...(b.bridge?.historyLink?.claimRefs||[])])if(!claims.has(id))missing.push(id);
 if(b.sources){const all=[...(b.senses||[]).flatMap(s=>s.sourceRefs||[]),...(b.bridge?.evidenceRefs||[]),...(b.history?.sourceRefs||[]),...(b.history?.claims||[]).flatMap(c=>c.sourceRefs||[]),...(b.selection?.senses||[]).flatMap(s=>[...(s.evidenceRefs||[]),...(s.examples||[]).map(e=>e.sourceRef).filter(Boolean)]),...(b.analysis?.blocks||[]).flatMap(s=>s.sourceRefs||[]),...(b.practices||[]).flatMap(p=>p.sourceRefs||[])];for(const ref of all)if(!b.sources.some(s=>s.sourceId===ref.sourceId&&s.version===ref.sourceVersion))missing.push(ref.sourceId);
  for(const id of [...(b.inventory?.sources||[]),...(b.context?.sourceRef?[b.context.sourceRef]:[])])if(!b.sources.some(s=>s.sourceId===(typeof id==='string'?id:id.sourceId)))missing.push(typeof id==='string'?id:id.sourceId);
 }
 for(const e of b.analysis?.edges||[])if(!b.senses?.some(s=>s.senseId===e.targetId&&s.version===e.targetVersion)&&!b.practices?.some(p=>p.practiceId===e.targetId&&p.version===e.targetVersion))missing.push(e.targetId);
 const missingRefs=[...new Set(missing)];return {valid:!missingRefs.length,missingRefs};}
export function assertEntity(kind,v){const r=validateEntity(kind,v);if(!r.valid)throw Error(kind+': '+r.errors.join('; '));return v;}
