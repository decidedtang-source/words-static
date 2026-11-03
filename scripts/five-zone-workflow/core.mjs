import {createHash} from 'node:crypto';
export const RULE='five-zone/2';
const weights={accuracy:30,completion:30,readability:25,increment:15};
const zoneWeights=[15,20,20,25,20];
const titles=['先记住，再联系','句法与概念','辨析与英文邻居','这句话在做什么','工作中可以这样说'];
const nonempty=x=>typeof x==='string'&&x.trim().length>0;
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
export const fingerprint=x=>createHash('sha256').update(JSON.stringify(canonical(x))).digest('hex');
export function additionalEntries(e){
 const focused=e.focusedEntries||[{sense:e.dictionaryEntries[0].senses[0]}],visible=new Set(focused.map(f=>f.sense.id));
 return e.dictionaryEntries.map(entry=>({...entry,senses:entry.senses.filter(s=>!visible.has(s.id))})).filter(entry=>entry.senses.length);
}
export function validateEntry(e){
 const errors=[];const check=(ok,msg)=>{if(!ok)errors.push(msg)};
 for(const k of ['cardId','term','context','contextZh','gloss','pos','definitionEn','definitionZh','contextTakeaway','bridgeText','writer'])check(nonempty(e[k]),`missing ${k}`);
 check(e.bridgeText!==e.definitionZh&&e.bridgeText!==e.gloss,'bridge duplicates definition');
 const sources=Array.isArray(e.sources)?e.sources:[],claims=Array.isArray(e.claims)?e.claims:[],groups=Array.isArray(e.groups)?e.groups:[];
 const sourceIds=new Set(sources.map(s=>s.id)),claimIds=new Set(claims.map(c=>c.id));
 check(sources.length>0&&sourceIds.size===sources.length,'missing/duplicate sources');
 check(claims.length>0&&claimIds.size===claims.length,'missing/duplicate claims');
 for(const s of sources){
  for(const k of ['id','title','section','evidence'])check(nonempty(s[k]),`source ${s.id}: missing ${k}`);
  let url;try{url=new URL(s.url)}catch{}check(url?.protocol==='https:'&&!/^(localhost|127\.)|notion\.(so|site)$/.test(url?.hostname||''),`source ${s.id}: URL`);
  check(['full_page','partial','index_excerpt'].includes(s.retrievalStatus),`source ${s.id}: unavailable evidence`);
 }
 for(const c of claims){
  check(nonempty(c.id)&&nonempty(c.text)&&nonempty(c.evidenceNote),`claim ${c.id}: incomplete`);
  check(['source_fact','teaching_inference','authored_example'].includes(c.kind),`claim ${c.id}: kind`);
  check(Array.isArray(c.sourceIds)&&c.sourceIds.every(id=>sourceIds.has(id))&&(c.kind!=='source_fact'||c.sourceIds.length>0),`claim ${c.id}: source missing`);
 }
 check(groups.length===5,'expected five zones');
 check(new Set(groups.map(g=>g.text)).size===groups.length,'duplicate zone body');
 groups.forEach((g,i)=>{
  check(g.id===`g${i+1}`&&nonempty(g.text)&&g.title===titles[i],`zone ${i+1}: identity/body`);
  for(const k of ['anchor','explanation','example','boundary'])check(nonempty(g.requirements?.[k])&&/[\p{L}\p{N}]/u.test(g.requirements[k]),`${g.id}: missing teaching task ${k}`);
  check(Array.isArray(g.sourceIds)&&g.sourceIds.length>0&&g.sourceIds.every(id=>sourceIds.has(id)),`${g.id}: source reference`);
  check(Array.isArray(g.claimIds)&&g.claimIds.length>0&&g.claimIds.every(id=>claimIds.has(id)),`${g.id}: claim reference`);
 });
 const entries=Array.isArray(e.dictionaryEntries)?e.dictionaryEntries:[];check(entries.length>0,'dictionary missing');
 const seen=new Set(),senseIds=new Set();
 for(const entry of entries){
  check(nonempty(entry.lemma)&&nonempty(entry.pos)&&entry.senses?.length>0,'dictionary entry incomplete');
  for(const s of entry.senses||[]){
   check(nonempty(s.id)&&!senseIds.has(s.id),'duplicate/missing sense id');senseIds.add(s.id);
   const key=`${entry.lemma}|${s.definitionEn?.trim().toLowerCase()}|${s.glossZh?.trim()}`;
   check(!seen.has(key),'duplicate dictionary sense');seen.add(key);
   check(nonempty(s.definitionEn)&&nonempty(s.glossZh)&&Array.isArray(s.sourceIds)&&s.sourceIds.length>0&&s.sourceIds.every(id=>sourceIds.has(id)),`sense ${s.id}: content/source missing`);
  }
 }
 if(e.focusedEntries!==undefined){
  check(Array.isArray(e.focusedEntries)&&e.focusedEntries.length>0,'focused senses missing');
  for(const f of Array.isArray(e.focusedEntries)?e.focusedEntries:[]){
   const entry=entries.find(x=>x.lemma===f.entry?.lemma&&x.pos===f.entry?.pos);
   check(!!entry&&entry.senses.some(s=>fingerprint(s)===fingerprint(f.sense)), 'focused sense outside reviewed dictionary');
  }
 }
 return errors;
}
export function reviewEntry(e,r){
 const errors=validateEntry(e),zones=[];
 if(errors.length)return {status:'EVIDENCE_GAP',errors,zones};
 if(!r)return {status:'REVIEW',errors:['independent review pending'],zones};
 const check=(ok,msg)=>{if(!ok)errors.push(msg)};
 check(r.cardId===e.cardId&&r.ruleVersion===RULE,'review identity/rule mismatch');
 check(nonempty(r.reviewer)&&r.reviewer!==e.writer,'independent reviewer required');
 check(r.fingerprint===fingerprint(e),'stale review fingerprint');
 check(r.hardGates==='PASS','hard gate failed');
 check(r.front?.decision==='PASS'&&nonempty(r.front?.reason),'front incomplete/unreviewed');
 for(const c of e.claims){const checks=(r.sourceChecks||[]).filter(s=>s.claimId===c.id);check(checks.length===1&&checks[0].verdict==='SUPPORTED'&&nonempty(checks[0].note),`claim ${c.id}: support unconfirmed`)}
 check(Array.isArray(r.zones)&&r.zones.length===5,'five zone reviews required');
 e.groups.forEach((g,i)=>{
  const z=r.zones?.[i];check(z?.id===g.id,`${g.id}: review missing/order`);
  const score=Object.entries(weights).reduce((n,[k,w])=>n+(Number.isInteger(z?.scores?.[k])?z.scores[k]:0)/4*w,0);
  for(const k of Object.keys(weights)){check(Number.isInteger(z?.scores?.[k])&&z.scores[k]>=3&&z.scores[k]<=4,`${g.id}: ${k} below gate`);check(nonempty(z?.reasons?.[k]),`${g.id}: ${k} rationale missing`)}
  check(z?.requirementsVerdict==='PASS'&&score>=75,`${g.id}: teaching requirements failed`);
  check(Array.isArray(z?.issues)&&!z.issues.some(x=>x.blocking),`${g.id}: unresolved blocking issue`);
  zones.push({id:g.id,score,scores:z?.scores,reasons:z?.reasons,issues:z?.issues});
 });
 return {status:errors.length?'REVISE':'CANDIDATE',errors,zones,total:zones.reduce((n,z,i)=>n+z.score*zoneWeights[i]/100,0)};
}
export function runBatch(entries,receipts,previous={},limit=Infinity){
 if(new Set(entries.map(e=>e.cardId)).size!==entries.length)throw Error('duplicate input cardId');
 if(new Set(receipts.map(e=>e.cardId)).size!==receipts.length)throw Error('duplicate review cardId');
 const state={ruleVersion:RULE,productionImportAllowed:false,entries:{}};let processed=0;
 for(const e of entries){
  if(processed>=limit)break;
  const r=receipts.find(r=>r.cardId===e.cardId),key=fingerprint({rule:RULE,entry:e,receipt:r||null}),old=previous.entries?.[e.cardId];
  state.entries[e.cardId]=old?.key===key?{...old,reused:true}:{...reviewEntry(e,r),key,reused:false};processed++;
 }
 return state;
}
export function reviewCoverage(e,r){
 const audited=reviewEntry(e,r);
 // Identity, provenance, source and front failures invalidate the shared approval foundation.
 if(audited.errors.some(error=>!/^g[1-5]:/.test(error)))return {zones:0,claims:0};
 const zones=audited.zones.filter(z=>!audited.errors.some(error=>error.startsWith(z.id+':'))).length;
 const claims=e.claims.filter(c=>{const checks=(r?.sourceChecks||[]).filter(s=>s.claimId===c.id);return checks.length===1&&checks[0].verdict==='SUPPORTED'&&nonempty(checks[0].note)}).length;
 return {zones,claims};
}
