import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {root,read,sha,loadBundles} from '../system.mjs';
import {matchesLemma,selectPronunciation,bindAI} from './core.mjs';
const pos=p=>({'n.':'noun','v.':'verb','adj.':'adjective','adv.':'adverb','conj.':'conjunction','phrasal verb':'verb',n:'noun',v:'verb',a:'adjective',s:'adjective',r:'adverb'}[p]||p);
const tokens=s=>new Set(s.toLowerCase().match(/[a-z]{3,}/g)||[]);
const overlap=(a,b)=>[...tokens(a)].filter(t=>tokens(b).has(t)).length;
const wordCount=s=>(s.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g)||[]).length;
export function preferredCandidates(candidates){
 const ordered=[...candidates].sort((a,b)=>(a.origin==='licensed_source'?-100:-(a.score||0))-(b.origin==='licensed_source'?-100:-(b.score||0))),seen=new Set();
 return ordered.filter(c=>{if(seen.has(c.en))return false;seen.add(c.en);return true;}).slice(0,8);
}
export function makeTasks(bundles,collected){
 const sourceSenses=new Map(collected.oewn.rows.flatMap(r=>r.entries.flatMap(e=>e.senses.map(s=>[s.sourceSenseId,{...s,entry:e}]))));
 const previous=read(root+'/content/module-inputs/front-50-20261116/edits.json');
 return bundles.map(b=>{
  const senses=b.selection.senses.map(selected=>{
   const sense=b.senses.find(s=>s.senseId===selected.senseId),lemma=sense.lexicalEntryId.slice(4),o=sourceSenses.get(sense.senseId),candidates=[];
   if(o)for(const en of o.examples.filter(en=>matchesLemma(en,lemma)))candidates.push({id:'oewn:'+sha([sense.senseId,en]).slice(0,16),en,origin:'licensed_source',provider:'Open English Wordnet 2025',sourceId:'oewn-2025',url:'https://en-word.net/',locator:o.entry.sourceEntryId+'/'+sense.senseId,sourceHash:collected.oewn.manifest.sha256,lemma});
   const cam=collected.cambridge[lemma];
   if(cam?.status==='ready')for(const e of cam.entries.filter(e=>pos(e.pos)===pos(sense.pos)))for(const s of e.senses)for(const example of s.examples.filter(x=>matchesLemma(x.en,lemma)&&wordCount(x.en)<=25))candidates.push({id:'cambridge:'+sha([cam.url,example.id,example.en]).slice(0,16),en:example.en,origin:'source_short_quote',provider:'Cambridge Dictionary',sourceId:'cambridge:'+lemma,url:cam.url,locator:s.id+'/'+example.id,definition:s.definition,sourceHash:cam.sourceHash,lemma,score:overlap(s.definition,sense.meaning.definitionEn)});
   const unique=preferredCandidates(candidates);
   const original=selected.examples[0];unique.push({id:'original:'+sha([sense.senseId,original.en]).slice(0,16),en:original.en,zh:original.zh,origin:'original',provider:'原创教学补充',sourceId:'original-library',url:null,lemma});
   return {senseId:sense.senseId,lemma,title:selected.title,definition:sense.meaning.definitionEn,candidates:unique};
  });
  const historySources=previous[b.snapshot.entryId].history.cards.map(card=>{const h=collected.history[card.lemma];return {lemma:card.lemma,scope:card.scope,summary:h.summary,text:h.sourceText,receipt:h.receipt,refreshPending:h.newSource||null};});
  const task={entryId:b.snapshot.entryId,contextId:b.context.contextId,term:b.snapshot.term,quote:b.context.quote,quoteType:b.context.quoteType,senses,previousEditorial:{scenario:previous[b.snapshot.entryId].scenario,bridge:previous[b.snapshot.entryId].bridge},historyRefs:previous[b.snapshot.entryId].history.refs,historySources,scenarioSource:collected.scenarios[b.snapshot.entryId]};
  task.bundleHash=sha(b);return {...task,inputHash:sha(task)};
 });
}
export function sourcePronunciation(b,c){
 const cam=c.cambridge[b.snapshot.term],cp=cam?.sourceScope==='whole_entry'?selectPronunciation(cam.entries||[],b.snapshot.term,b.snapshot.originalPOS):null;
 if(cp)return {...cp,provider:'Cambridge Dictionary',url:cam.url,sourceHash:cam.sourceHash,audio:c.audio[cp.audioURL]?.status==='ready'?c.audio[cp.audioURL]:null};
 const rows=c.oewn.rows.flatMap(r=>r.entries).map(e=>({lemma:e.lemma,pos:pos(e.lexicalPos),pronunciations:(e.pronunciation||[]).map(p=>({ipa:p.value,variety:p.variety}))}));
 const op=selectPronunciation(rows,b.snapshot.term,b.snapshot.originalPOS);
 if(op)return {...op,provider:'Open English Wordnet 2025',url:'https://en-word.net/',sourceHash:c.oewn.manifest.sha256,audio:null};
 return {ipa:b.verifiedIPA||b.snapshot.originalIPA||'音标待补',variety:'US',provider:b.verifiedIPA?'既有核实音标':'原词库音标',url:null,audio:null};
}
export function importReplies(bundles,collected,tasks,replies){
 if(sha(tasks)!==sha(makeTasks(bundles,collected)))throw Error('Stale or modified AI task sources; prepare tasks again');
 if(replies.length!==tasks.length||new Set(replies.map(r=>r.entryId)).size!==tasks.length)throw Error('AI reply entry set mismatch');
 const previous=read(root+'/content/module-inputs/front-50-20261116/edits.json'),entries={},quotes={};
 for(const task of tasks){
  const b=bundles.find(b=>b.snapshot.entryId===task.entryId),reply=replies.find(r=>r.entryId===task.entryId);if(!reply)throw Error('Missing AI reply');
  const result=bindAI(task,reply);
  result.examples=result.examples.map(({definition,score,...example})=>example);
  for(const e of result.examples.filter(e=>e.origin==='source_short_quote')){
   quotes[e.url]??=new Set();quotes[e.url].add(e.en);
   if([...quotes[e.url]].reduce((n,t)=>n+wordCount(t),0)>25)throw Error('Source short-quote budget exceeded '+e.url);
  }
  const old=previous[task.entryId];
  const editorial=reply.editorial||task.previousEditorial;
  if(!editorial.scenario?.meaning?.trim()||!editorial.bridge?.modern?.trim()||!editorial.bridge?.history?.trim())throw Error('Missing AI editorial fields');
  const pronunciation=sourcePronunciation(b,collected);
  if(pronunciation.audio&&(pronunciation.audio.url!==pronunciation.audioURL||sha(pronunciation.audio.base64)!==pronunciation.audio.base64SHA))throw Error('Audio identity/hash mismatch');
  const {text:rawArticle,excerpt:rawExcerpt,...scenarioSource}=collected.scenarios[task.entryId]||{};
  entries[task.entryId]={bundleHash:task.bundleHash,taskHash:task.inputHash,pronunciation,examples:result.examples,edits:{...old,scenario:{...editorial.scenario,sentenceExplanation:editorial.scenario.sentenceExplanation||b.context.meaning},bridge:editorial.bridge},scenarioSource,ai:{executor:'current_assistant',mode:'structured_task_reply',sourceEnglishEditable:false,editorialMode:reply.editorial?'updated':'retained_existing',version:'2.0.0'}};
 }
 return {version:'front-inputs-2.0.0',entries,sourceCoverage:{cambridgeReady:Object.values(collected.cambridge).filter(c=>c.status==='ready').length,historyUnits:Object.keys(collected.history).length,historyRefreshAvailable:Object.values(collected.history).filter(c=>c.status==='refresh_available').length,scenarioURLs:Object.values(collected.scenarios).filter(s=>s.url).length}};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const [command,run,cache,dest]=process.argv.slice(2),collected=read(cache+'/collected.json'),bundles=loadBundles(run).filter(b=>collected.entryIds.includes(b.snapshot.entryId));
 if(command==='prepare'){const tasks=makeTasks(bundles,collected);fs.writeFileSync(cache+'/ai-tasks.json',JSON.stringify(tasks,null,2));console.log('Prepared '+tasks.length+' AI tasks');}
 else if(command==='import'){const inputs=importReplies(bundles,collected,read(cache+'/ai-tasks.json'),read(cache+'/ai-replies.json'));fs.mkdirSync(dest,{recursive:true});fs.writeFileSync(dest+'/inputs.json',JSON.stringify(inputs,null,2));console.log('Imported '+Object.keys(inputs.entries).length+' AI replies');}
 else throw Error('Expected prepare or import');
}
