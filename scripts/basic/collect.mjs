import fs from 'node:fs';
import {chromium} from '@playwright/test';
import {root,read,sha} from '../modules/system.mjs';
import {fetchCached} from '../modules/automation/core.mjs';
import {parseCambridge} from '../modules/automation/html.mjs';
import {freeze} from './freeze.mjs';
freeze();
const dir=root+'/local-evidence/basic100';fs.mkdirSync(dir,{recursive:true});
const roster=read(root+'/content/basic-release-20261117/roster.json'),source=read(root+'/public/vocabulary.json').words.filter(w=>roster.extraIds.includes(w.id));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||process.env.LOCALAPPDATA+'/ms-playwright/chromium-1234/chrome-win64/chrome.exe'});
const results={};let cursor=0;
try{await Promise.all(Array.from({length:3},async()=>{
 const page=await browser.newPage();
 while(cursor<source.length){const w=source[cursor++],url='https://dictionary.cambridge.org/dictionary/english/'+w.term.replaceAll(' ','-'),file=dir+'/cambridge-'+w.term+'.json';
  const previous=fs.existsSync(file)?read(file):null;
  const r=await fetchCached(url,previous,false,fetch,async body=>(await parseCambridge(page,body,url)).entries.some(e=>e.lemma.toLowerCase()===w.term.toLowerCase()));
  if(r.source&&!r.cacheUsed)fs.writeFileSync(file,JSON.stringify(r.source));
  const parsed=r.source?await parseCambridge(page,r.source.body,url):{entries:[]};parsed.entries=parsed.entries.filter(e=>e.lemma.toLowerCase()===w.term.toLowerCase());
  const pos=({'n.':'noun','v.':'verb','adj.':'adjective','adv.':'adverb'})[w.pos];
  const candidates=parsed.entries.filter(e=>!pos||e.pos===pos).flatMap(e=>e.senses.map(s=>({...s,pos:e.pos,pronunciations:e.pronunciations})));
  results[w.id]={term:w.term,url,status:candidates.length?'ready':'source_pending',sourceHash:r.source?.rawSHA||null,retrievedAt:r.source?.retrievedAt||null,candidates,attempt:r.attempt};
  console.log(w.term+': '+results[w.id].status);
 }
}));}finally{await browser.close();}
fs.writeFileSync(dir+'/collected.json',JSON.stringify(results,null,2));
console.log('Collected '+Object.keys(results).length+' entries');
