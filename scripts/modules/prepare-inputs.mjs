import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {root,read,loadBundles,sha} from './system.mjs';
import {importSnapshots,parseSnapshot} from './history-source.mjs';
export const phraseHistory={
 'provided that':{kind:'fixed_expression',components:['provided'],whole:[],note:'条件连接表达；当前来源为核心连接词provided条目'},
 'not necessarily':{kind:'fixed_expression',components:['necessarily'],whole:[],note:'固定否定表达；当前保存实义副词历史'},
 'verification method':{kind:'phrase',components:['verification','method'],whole:[]},
 'validation method':{kind:'phrase',components:['validation','method'],whole:[]},
 'working definition':{kind:'collocation',components:['working','definition'],whole:[]},
 'frame the issue':{kind:'construction',components:['frame','issue'],whole:[]},
 'account for':{kind:'fixed_expression',components:['account'],whole:[],note:'整体短语义单独管理；当前词史依据account条目'},
 'lead in the polls':{kind:'construction',components:['lead','poll'],whole:[]},
 'inflation shock':{kind:'collocation',components:['inflation','shock'],whole:[]},
 'handover':{kind:'compound',components:['hand'],whole:[],note:'handover整词读取失败；当前引用hand资料'},
 'trade-off':{kind:'fixed_expression',components:[],whole:['trade-off']},
 'sign-off':{kind:'fixed_expression',components:[],whole:['sign-off']}
};
export function prepareInputs(run,dir,cache){
 const b=loadBundles(run),front=read(dir+'/front-editorial.json'),editorial=read(dir+'/history-editorial.json');
 const sources=importSnapshots(cache,Object.keys(editorial.summaries));
 const library={version:'1.0.0',units:Object.fromEntries(Object.entries(editorial.summaries).map(([lemma,summary])=>{const {text,...receipt}=sources[lemma];return [lemma,{id:'etym:'+lemma,version:'1.0.0',lemma,summary,receipt:{...receipt,artifactPath:receipt.artifactPath?'local-evidence/front-sources/'+receipt.artifactPath:null}}];}))};
 const relations={},edits={};
 for(const x of b){
  const id=x.snapshot.entryId,term=x.snapshot.term,rel=phraseHistory[term]||{kind:'word',components:[],whole:[term]};
  relations[id]={term,...rel,wholeHistoryStatus:rel.whole.length?'sourced':rel.kind==='compound'?'fetch_failed':'not_acquired',coverage:rel.whole.length?'whole_entry':'component_history'};
  const cards=[...rel.whole.map(lemma=>({lemma,scope:'whole_entry'})),...rel.components.map(lemma=>({lemma,scope:'component_history'}))].map(ref=>{
   const unit=library.units[ref.lemma];if(!unit)throw Error('Missing history unit '+ref.lemma);
   return {...ref,unitId:unit.id,version:unit.version,summary:unit.summary,receipt:unit.receipt};
  });
  const e=front.entries[term];if(!e)throw Error('Missing front edit '+term);
  edits[id]={...e,history:{refs:cards.map(c=>({unitId:c.unitId,version:c.version,scope:c.scope})),cards,scope:relations[id].coverage,kind:rel.kind,wholeHistoryStatus:relations[id].wholeHistoryStatus}};
 }
 for(const [name,value]of Object.entries({'history-library.json':library,'history-relations.json':{version:'1.0.0',entries:relations},'edits.json':edits}))fs.writeFileSync(dir+'/'+name,JSON.stringify(value,null,2)+'\n');
 return {entries:b.length,units:Object.keys(library.units).length,readyUnits:Object.values(sources).filter(s=>s.status==='ready').length};
}
export function validateReceipts(edits,base=root){
 const cache=new Map();
 for(const edit of Object.values(edits))for(const card of edit.history?.cards||[]){
  const r=card.receipt;if(r.status!=='ready')continue;
  if(!r.artifactPath||!r.artifactPath.startsWith('local-evidence/front-sources/')||r.artifactPath.split('/').includes('..'))throw Error('Invalid source path');
  if(!cache.has(r.artifactPath)){const raw=fs.readFileSync(path.join(base,r.artifactPath),'utf8');cache.set(r.artifactPath,{raw,hash:sha(raw)});}
  const source=cache.get(r.artifactPath);
  if(source.hash!==r.rawSHA)throw Error('Source snapshot hash mismatch');
  if(r.lemma!==card.lemma||card.unitId!=='etym:'+card.lemma||r.url!=='https://www.etymonline.com/word/'+encodeURIComponent(card.lemma)||!r.fetchedAt||Number.isNaN(Date.parse(r.fetchedAt)))throw Error('Source identity mismatch');
  const parsed=source.raw.split(/-{40,}/).flatMap(raw=>{try{return [parseSnapshot(raw,card.lemma)];}catch{return [];}});
  if(!parsed.some(p=>sha(p.text)===r.textSHA))throw Error('Source parsed text hash mismatch');
 }
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(prepareInputs(path.resolve(process.argv[2]),path.resolve(process.argv[3]),path.resolve(process.argv[4]))));
