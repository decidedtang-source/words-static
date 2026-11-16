import {sha} from '../system.mjs';
const norm=s=>String(s||'').toLowerCase().replace(/[’]/g,"'").replace(/[-–]/g,' ').replace(/\s+/g,' ').trim();
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export function matchesLemma(sentence,lemma){
 const words=norm(lemma).split(' '),base=words[0];
 const forms=[base,base+'s',base+'es',base+'d',base+'ed',base.replace(/e$/,'')+'ing',base.replace(/y$/,'ies')];
 const tail=words.slice(1).map(escape).join(' ');
 return new RegExp('(^|[^a-z])(?:'+[...new Set(forms)].map(escape).join('|')+')'+(tail?' '+tail:'')+'([^a-z]|$)','i').test(norm(sentence));
}
export function selectPronunciation(entries,lemma,pos){
 const desired=({'n.':'noun','v.':'verb','adj.':'adjective','adv.':'adverb','conj.':'conjunction','n':'noun','v':'verb','a':'adjective','s':'adjective','r':'adverb'})[pos]||pos;
 const rows=entries.filter(e=>norm(e.lemma)===norm(lemma)&&(!desired||e.pos===desired)).flatMap(e=>e.pronunciations||[]).filter(p=>p.ipa);
 return rows.find(p=>p.variety==='US')||rows.find(p=>p.variety==='GB')||rows[0]||null;
}
export async function fetchCached(url,previous,refresh=false,fetcher=fetch,accept=null){
 if(previous&&(previous.url!==url||sha(previous.body)!==previous.rawSHA))throw Error('Source cache hash/identity mismatch');
 if(previous&&!refresh)return {source:previous,cacheUsed:true,attempt:{status:'not_requested'}};
 try{
  const r=await fetcher(url,{signal:AbortSignal.timeout(20000)});
  const attempt={url,status:r.status,attemptedAt:new Date().toISOString()};
  if(!r.ok)return {source:previous||null,cacheUsed:Boolean(previous),attempt};
  const body=await r.text();
  if(accept&&!await accept(body))return {source:previous||null,cacheUsed:Boolean(previous),attempt:{...attempt,validation:'rejected'}};
  return {source:{url,finalURL:r.url||url,body,rawSHA:sha(body),retrievedAt:attempt.attemptedAt,transport:'direct_http'},cacheUsed:false,attempt};
 }catch(e){return {source:previous||null,cacheUsed:Boolean(previous),attempt:{url,status:'fetch_failed',error:e.message,attemptedAt:new Date().toISOString()}};}
}
export function bindAI(task,reply){
 if(reply.entryId!==task.entryId||reply.inputHash!==task.inputHash)throw Error('AI task identity/hash mismatch');
 if(reply.selections.length!==task.senses.length||new Set(reply.selections.map(s=>s.senseId)).size!==task.senses.length)throw Error('AI sense set mismatch');
 const examples=task.senses.map(s=>{
  const selected=reply.selections.find(x=>x.senseId===s.senseId);
  if(!selected||Object.hasOwn(selected,'en'))throw Error('AI cannot replace source English');
  const candidate=s.candidates.find(c=>c.id===selected.candidateId);
  if(!candidate)throw Error('Unknown source candidate');
  if(typeof selected.zh!=='string'||!selected.zh.trim())throw Error('Translation missing');
  return {...candidate,senseId:s.senseId,zh:selected.zh,translationOrigin:'ai_editorial',selectionReason:selected.reason||''};
 });
 return {entryId:task.entryId,taskHash:task.inputHash,examples};
}
