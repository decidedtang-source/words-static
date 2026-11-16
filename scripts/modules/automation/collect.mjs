import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {chromium} from '@playwright/test';
import {root,read,sha,loadBundles} from '../system.mjs';
import {fetchCached} from './core.mjs';
import {parseCambridge,parseArticle,parseEtymonlineHTML} from './html.mjs';
import {parseSnapshot} from '../history-source.mjs';
const clean=s=>s.toLowerCase().replace(/[’]/g,"'").replace(/[- ]+/g,' ').trim();
export const cambridgeURL=lemma=>'https://dictionary.cambridge.org/dictionary/english/'+({'provided that':'provided','not necessarily':'necessarily'}[lemma]||lemma.replaceAll(' ','-'));
export const audioURLs=cambridge=>[...new Set(Object.values(cambridge).flatMap(s=>(s.entries||[]).flatMap(e=>e.pronunciations.filter(p=>p.ipa&&['US','GB'].includes(p.variety)).map(p=>p.audioURL))).filter(Boolean))];
async function queue(items,fn,limit=3){let cursor=0;await Promise.all(Array.from({length:limit},async()=>{while(cursor<items.length){const i=cursor++;await fn(items[i],i);}}));}
export async function collect({run,cache,refresh=false,limit=Infinity}){
 fs.mkdirSync(cache,{recursive:true});const bundles=loadBundles(run).slice(0,limit),attempts=[];
 const lexical=read(root+'/content/enrichment/v10/sources/oewn-selected-2025.json');
 const snapshot=process.env.WORDS_OEWN_SNAPSHOT||'D:/WordsV2LexicalWork/20261031-t0-t8/snapshot-oewn-2025';
 let oewn=lexical;
 if(fs.existsSync(snapshot+'/dictionary.sqlite')){
  const manifest=read(snapshot+'/manifest.json'),file=fs.readFileSync(snapshot+'/dictionary.sqlite');
  if(crypto.createHash('sha256').update(file).digest('hex')!==manifest.sha256)throw Error('WordNet snapshot hash mismatch');
  const {DatabaseSync}=await import('node:sqlite'),db=new DatabaseSync(snapshot+'/dictionary.sqlite',{readOnly:true});
  try{const terms=[...new Set(bundles.flatMap(b=>[b.snapshot.term,...b.senses.map(s=>s.lexicalEntryId.slice(4))]))];oewn={manifest,sourcePath:'verified local licensed snapshot',rows:terms.map(term=>({term,entries:db.prepare('SELECT content FROM entries WHERE lower(lemma)=lower(?)').all(term).map(r=>JSON.parse(r.content))}))};}finally{db.close();}
 }
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||process.env.LOCALAPPDATA+'/ms-playwright/chromium-1234/chrome-win64/chrome.exe'});
 const page=await browser.newPage(),cambridge={},history={},scenarios={};
 async function get(url,accept=null){
  const file=cache+'/http-'+sha(url).slice(0,20)+'.json',previous=fs.existsSync(file)?read(file):null;
  const r=await fetchCached(url,previous,refresh,fetch,accept);attempts.push({...r.attempt,url,cacheUsed:r.cacheUsed});
  if(r.source&&!r.cacheUsed)fs.writeFileSync(file,JSON.stringify(r.source));return r;
 }
 try{
  const lemmas=[...new Set(bundles.flatMap(b=>[b.snapshot.term,...b.selection.senses.map(s=>b.senses.find(x=>x.senseId===s.senseId).lexicalEntryId.slice(4))]))];
  await queue(lemmas,async lemma=>{
   const url=cambridgeURL(lemma),expected=({'provided that':'provided','not necessarily':'necessarily'}[lemma]||lemma);
   const r=await get(url,async body=>(await parseCambridge(page,body,url)).entries.some(e=>clean(e.lemma)===clean(expected)));
   if(!r.source){cambridge[lemma]={status:'fetch_failed',url,attempt:r.attempt};return;}
   const parsed=await parseCambridge(page,r.source.body,url);
   parsed.entries=parsed.entries.filter(e=>clean(e.lemma)===clean(expected));
   cambridge[lemma]={...parsed,status:parsed.entries.length?'ready':'no_matching_entry',sourceHash:r.source.rawSHA,retrievedAt:r.source.retrievedAt,transport:r.source.transport,sourceScope:expected===lemma?'whole_entry':'component',cacheUsed:r.cacheUsed};
   console.log('Cambridge '+lemma+': '+cambridge[lemma].status);
  });
  const existing=read(root+'/content/module-inputs/front-50-20261116/history-library.json');
  const relations=read(root+'/content/module-inputs/front-50-20261116/history-relations.json');
  const historyLemmas=[...new Set(bundles.flatMap(b=>{const r=relations.entries[b.snapshot.entryId];return [...r.whole,...r.components];}))];
  await queue(historyLemmas,async lemma=>{
   const unit=existing.units[lemma],r=unit.receipt;
   const raw=fs.readFileSync(root+'/'+r.artifactPath,'utf8');if(sha(raw)!==r.rawSHA)throw Error('History cache changed '+lemma);
   const part=raw.split(/-{40,}/).flatMap(p=>{try{return [parseSnapshot(p,lemma)];}catch{return [];}}).find(p=>sha(p.text)===r.textSHA);
   if(!part)throw Error('History extraction changed '+lemma);
   let result={...unit,sourceText:part.text,status:'cached',attempt:null};
   if(refresh){const network=await get(r.url);result.attempt=network.attempt;
    if(network.source){const parsed=await parseEtymonlineHTML(page,network.source.body,lemma);if(parsed.status==='ready')result={...result,status:'refresh_available',newSource:{...parsed,url:r.url,sourceHash:network.source.rawSHA,retrievedAt:network.source.retrievedAt}};}
   }
   // Existing AI summary stays bound to its original source. A changed source becomes a new AI task, never an automatic re-attribution.
   history[lemma]=result;
  });
  await queue(bundles,async b=>{
   const url=b.context.sourceURL;if(!url){scenarios[b.snapshot.entryId]={status:'teaching_material',quote:b.context.quote,sourceURL:null};return;}
   const r=await get(url);scenarios[b.snapshot.entryId]=r.source?{...await parseArticle(page,r.source.body,url,b.context.quote),sourceHash:r.source.rawSHA,retrievedAt:r.source.retrievedAt,status:'fetched'}:{url,status:'fetch_failed',attempt:r.attempt};
  });
  const audio={};
  const urls=audioURLs(cambridge);
  await queue(urls,async url=>{
   if(!url.startsWith('https://dictionary.cambridge.org/media/english/'))return;
   const file=cache+'/audio-'+sha(url).slice(0,20)+'.json';if(fs.existsSync(file)){const saved=read(file);if(sha(saved.base64)!==saved.base64SHA)throw Error('Audio cache hash mismatch');audio[url]=saved;return;}
   try{const r=await fetch(url,{signal:AbortSignal.timeout(15000)});if(!r.ok){audio[url]={status:'fetch_failed',httpStatus:r.status};return;}const mime=r.headers.get('content-type')||'';if(!mime.startsWith('audio/')){audio[url]={status:'invalid_media',mime};return;}const base64=Buffer.from(await r.arrayBuffer()).toString('base64');audio[url]={status:'ready',url,mime,base64,base64SHA:sha(base64)};fs.writeFileSync(file,JSON.stringify(audio[url]));}catch(e){audio[url]={status:'fetch_failed',error:e.message};}
  });
  const data={version:'front-collection-2.0.0',entryIds:bundles.map(b=>b.snapshot.entryId),oewn,cambridge,history,scenarios,audio,attempts};
  fs.writeFileSync(cache+'/collected.json',JSON.stringify(data,null,2));return data;
 }finally{await browser.close();}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const result=await collect({run:path.resolve(process.argv[2]),cache:path.resolve(process.argv[3]),refresh:process.argv.includes('--refresh'),limit:Number(process.argv.find(a=>a.startsWith('--limit='))?.split('=')[1]||Infinity)});
 console.log(JSON.stringify({entries:result.entryIds.length,cambridgeReady:Object.values(result.cambridge).filter(s=>s.status==='ready').length,audioReady:Object.values(result.audio).filter(s=>s.status==='ready').length,history:Object.keys(result.history).length}));
}
