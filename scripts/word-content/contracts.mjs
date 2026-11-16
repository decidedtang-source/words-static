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
const optional={EntrySnapshot:['originalIPA','originalMeaning'],SourceRecord:['claimScope','claims','sourceDate','evidencePath'],Sense:['sourceSenseId','usageLabels'],ContextUse:['senseRefs','targetSpans','expressionExplanation','context'],BridgeRecord:['historyLink','historyClaimRefs','returnTargets']};
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
 if(kind==='Sense'&&(!v.meaning?.definitionEn||!v.meaning?.glossZh||!v.meaning?.glossOrigin))errors.push('meaning structure');
 if(kind==='ContextUse'){
  if(typeof v.quote==='string'&&hash(v.quote)!==v.quoteSHA)errors.push('quoteSHA mismatch');
  for(const s of v.targetSpans||[])if([...v.quote].slice(s.start,s.end).join('')!==s.text)errors.push('targetSpans mismatch');
  if(v.location==='unresolved'&&v.meaning)errors.push('unresolved cannot have definitive meaning');
  if(!(v.senseRefs?.length||v.expressionExplanation))errors.push('senseRefs or expressionExplanation required');
  for(const k of ['modality','conditions','agents','excludedInferences'])if(!Array.isArray(v.qualifiers?.[k]))errors.push('qualifiers '+k);
  if(v.expressionExplanation?.kind==='technical'&&!v.expressionExplanation.wholeExpressionRefs?.length)errors.push('technical whole evidence required');
 }
 if(kind==='LearningSelection')for(const s of v.senses||[]){if(!s.senseId||!s.title||!s.examples?.length||!s.evidenceRefs?.length)errors.push('learning sense incomplete');for(const e of s.examples||[])if(!e.en||!e.zh||!['licensed','short_quote','original'].includes(e.origin))errors.push('example origin/translation');}
 if(kind==='AnalysisRecord'){
  if(!Array.isArray(v.workplaceUse)||v.workplaceUse.length<2||v.workplaceUse.length>5)errors.push('workplaceUse 2..5');
  for(const use of v.workplaceUse||[])if(!use.en||!use.zh||!use.whenToUse||use.origin!=='original')errors.push('workplaceUse content');
  for(const k of dimensions){const c=v.coverage?.[k];if(!c||!['expanded','integrated','not_needed'].includes(c.mode))errors.push('coverage '+k);else{if(c.mode!=='expanded'&&!c.reason)errors.push('reason '+k);if(c.mode!=='not_needed'&&(!c.blockIds?.length||c.blockIds.some(id=>!v.blocks?.some(b=>b.blockId===id))))errors.push('block references '+k);}}
  if(Object.keys(v.coverage||{}).some(k=>!dimensions.includes(k)))errors.push('unknown coverage dimension');
 }
 if(kind==='BridgeRecord'&&(!v.semanticText||!v.boundary||!v.targetRefs?.length||!v.strategies?.length))errors.push('Bridge anchors/target/boundary');
 if(kind==='ReviewRecord'&&(!v.checks?.length||!['pass','fail','blocked'].includes(v.verdict)))errors.push('review checks/verdict');
 return {valid:!errors.length,errors};
}
export function validateReferences(b){const ids=new Set((b.senses||[]).map(s=>s.senseId));const missingRefs=[...new Set([...(b.context?.senseRefs||[]),...(b.selection?.selectedSenseIds||[])].filter(id=>!ids.has(id)))];return {valid:!missingRefs.length,missingRefs};}
export function assertEntity(kind,v){const r=validateEntity(kind,v);if(!r.valid)throw Error(kind+': '+r.errors.join('; '));return v;}
