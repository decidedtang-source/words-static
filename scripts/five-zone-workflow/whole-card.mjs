import {fingerprint} from './core.mjs';
export const WHOLE_RULE='whole-card/1';
export const MODULES=['headword','currentSense','directExplanation','etymology','context','additionalSenses','examples','copyPayload'];
export const wholeFingerprint=(entry,supplement,zoneReview)=>fingerprint({entry,supplement,zoneReview});
export function checkWholeCard(e,s,z,r){
 const errors=[],modules=[];const ok=(v,msg)=>{if(!v)errors.push(msg)},text=x=>typeof x==='string'&&x.trim();
 if(!s)return {status:'EVIDENCE_GAP',errors:['Whole-card supplement missing'],modules};
 ok(s.cardId===e.cardId,'supplement identity mismatch');
 ok(text(s.writer),'supplement writer missing');
 for(const k of ['ipa','pos','chunk','ipaNote'])ok(text(s.headword?.[k]),`headword ${k} missing`);
 ok(Array.isArray(s.examples)&&s.examples.length>0&&s.examples.every(x=>text(x.en)&&text(x.zh)&&text(x.kind)),'examples incomplete');
 const sources=Array.isArray(s.sources)?s.sources:[],ids=new Set(sources.map(x=>x.id));
 ok(sources.length&&ids.size===sources.length,'supplement sources missing/duplicate');
 for(const src of sources){for(const k of ['id','title','section','evidence'])ok(text(src[k]),`source ${src.id} ${k} missing`);let u;try{u=new URL(src.url)}catch{}ok(u?.protocol==='https:','source URL invalid');ok(['full_page','partial','index_excerpt'].includes(src.retrievalStatus),'evidence unavailable')}
 for(const kind of ['modern_connection','historical_fact','current_use'])ok(s.etymology?.some(x=>x.kind===kind&&text(x.title)&&text(x.text)&&ids.has(x.sourceId)),`etymology ${kind} missing/unverified`);
 ok(Array.isArray(s.etymology)&&s.etymology.every(x=>ids.has(x.sourceId)&&text(x.text)&&text(x.title)),'etymology source unresolved');
 if(errors.length)return {status:'EVIDENCE_GAP',errors,modules};
 if(!r)return {status:'REVIEW',errors:['Whole-card independent review pending'],modules};
 ok(r.cardId===e.cardId&&r.ruleVersion===WHOLE_RULE,'whole review identity/rule');
 ok(text(r.reviewer)&&r.reviewer!==s.writer&&r.reviewer!==e.writer,'whole reviewer not independent');
 ok(r.fingerprint===wholeFingerprint(e,s,z),'stale whole-card receipt');
 for(const id of ids){const checks=(r.sourceChecks||[]).filter(c=>c.sourceId===id);ok(checks.length===1&&checks[0].verdict==='SUPPORTED'&&text(checks[0].note),`source ${id} not independently checked`)}
 ok(r.modules?.length===MODULES.length,'whole module count');
 for(const id of MODULES){const all=(r.modules||[]).filter(m=>m.id===id),m=all[0];ok(all.length===1&&m?.decision==='PASS',`module ${id} missing/failed`);let score=0;
  for(const [key,w] of Object.entries({accuracy:30,completion:30,readability:25,increment:15})){const n=m?.scores?.[key];ok(Number.isInteger(n)&&n>=3&&n<=4,`${id}/${key} below gate`);ok(text(m?.reasons?.[key]),`${id}/${key} reason missing`);score+=(Number.isInteger(n)?n:0)/4*w;}
  ok(Array.isArray(m?.issues)&&!m.issues.some(x=>x.blocking),`${id} unresolved issue`);modules.push({id,score,scores:m?.scores,reasons:m?.reasons,issues:m?.issues});
 }
 return {status:errors.length?'REVISE':'CANDIDATE',errors,modules};
}
