import fs from 'node:fs';
import {chromium} from '@playwright/test';
import {root,read,sha} from '../modules/system.mjs';
import {freeze} from './freeze.mjs';
import {makeBasic,verifyWords} from './render.mjs';
import {validateReceipts} from '../modules/prepare-inputs.mjs';
const frozen=freeze(),roster=read(root+'/content/basic-release-20261117/roster.json'),vocabulary=read(root+'/public/vocabulary.json').words;
const original=fs.readFileSync(root+'/content/module-runs/front-auto-50-20261116/index.html','utf8'),base=JSON.parse(original.match(/id="wl-data">([\s\S]*?)<\/script>/)[1]);
const additions=read(root+'/content/basic-release-20261117/additions.json');
validateReceipts(read(root+'/content/module-inputs/front-50-20261116/edits.json'));
const collected=read(root+'/local-evidence/basic100/collected.json');
const source=vocabulary.filter(w=>[...roster.baseIds,...roster.extraIds].includes(w.id));
const extras=roster.extraIds.map(id=>{
 const s=source.find(w=>w.id===id),a=additions.entries[id];if(!a||a.sourceInputHash!==sha(s))throw Error('Source vocabulary changed '+id);
 if(a.cambridge){const raw=read(root+'/local-evidence/basic100/cambridge-'+s.term+'.json');if(sha(raw.body)!==a.cambridge.sourceHash||raw.url!==a.cambridge.url||!collected[id]?.candidates.some(c=>c.id===a.cambridge.candidateId&&c.definition===a.cambridge.definitionEn)||collected[id].sourceHash!==a.cambridge.sourceHash||a.learning.some(l=>l.en!==a.cambridge.definitionEn||l.definitionSourceURL!==a.cambridge.url))throw Error('Dictionary source mismatch '+id);}
 for(const h of a.history){if(!h.artifactPath.startsWith('local-evidence/basic100/')||h.artifactPath.split('/').includes('..'))throw Error('History path mismatch');const raw=fs.readFileSync(root+'/'+h.artifactPath,'utf8');if(sha(raw)!==h.rawSHA||h.url!=='https://www.etymonline.com/word/'+encodeURIComponent(h.lemma||s.term)||!raw.includes(h.url)||(h.lemma&&h.lemma!==s.term&&h.scope!=='component_history'))throw Error('History source changed '+id);}
 const learning=a.learning;
 return {entryId:id,word:s.term,ipa:s.ipa,pos:s.pos,ipaSource:'原词库音标',pronunciationLang:'en-US',audioData:null,audioSourceURL:null,general:learning.map(x=>x.title).join('；'),senses:learning,note:s.chunk,meaning:a.meaning||s.gloss,keyMeaning:a.meaning||s.gloss,highlightTerm:a.meaning||s.gloss,quote:s.example,translation:s.examples[0].zh,sourceLabel:'原词库教学材料 · '+s.date,sourceDate:s.date,sourceUrl:null,quoteType:'原词库教学例句；非外部作者逐字引文',sentenceExplanation:s.explanation||s.meaning,history:a.history.map(h=>h.summary).join('\n'),historyUrl:a.history[0].url,historyScope:a.history.some(h=>h.scope==='component_history')?'component_history':'whole_entry',historyCards:a.history.map(h=>({label:(h.scope==='component_history'?'组成词 · ':'词条 · ')+(h.lemma||s.term),summary:h.summary,url:h.url,status:'ready'})),historyEvidence:a.history.map(({summary,...receipt})=>receipt)};
});
const words=[...roster.baseIds.map(id=>base.find(w=>w.entryId===id)),...extras],qa=verifyWords(words,source,100);if(!qa.pass)throw Error(JSON.stringify(qa));
let html=makeBasic(words);if(html!==makeBasic(words))throw Error('Non-reproducible rendering');
const config=read(root+'/config/qa/basic-release-v1.json'),out=root+'/public/releases/basic-v1-20261117';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||process.env.LOCALAPPDATA+'/ms-playwright/chromium-1234/chrome-win64/chrome.exe'}),checks=[],errors=[];
try{
 const page=await browser.newPage({viewport:{width:390,height:844},colorScheme:'light'});page.on('pageerror',e=>errors.push(e.message));await page.setContent(html);
 const initial=await page.locator('.article').innerHTML();html=html.replace('<article class="article"></article>',()=>'<article class="article">'+initial+'</article>');
 for(let i=0;i<words.length;i++){
  await page.selectOption('#wl-word',String(i));
  const state=await page.evaluate(c=>({required:c.requiredSelectors.every((s,i)=>document.querySelectorAll(s).length===1&&(!i||Boolean(document.querySelector(c.requiredSelectors[i-1]).compareDocumentPosition(document.querySelector(s))&Node.DOCUMENT_POSITION_FOLLOWING))),removed:c.forbiddenSelectors.every(s=>!document.querySelector(s)),links:[...document.querySelectorAll('[data-go]')].every(e=>document.getElementById('wl-'+(e.dataset.go==='context'?'source':e.dataset.go))),quote:document.querySelector('#wl-source .english').textContent,examples:[...document.querySelectorAll('#wl-common .english')].map(e=>e.textContent)}),config);
  checks.push({entryId:words[i].entryId,pass:state.required&&state.removed&&state.links&&state.quote===words[i].quote&&JSON.stringify(state.examples)===JSON.stringify(words[i].senses.map(s=>s.example))});
 }
 for(const width of config.pageWidths){await page.setViewportSize({width,height:900});await page.selectOption('#wl-device',width>=1000?'desktop':width>=700?'tablet':'phone');for(let i=0;i<words.length;i++){await page.selectOption('#wl-word',String(i));if(!await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1&&document.querySelector('.reader').scrollWidth<=document.querySelector('.reader').clientWidth+1))throw Error('Overflow '+width+' '+words[i].word);}}
 await page.selectOption('#wl-view','source');const moved=await page.locator('.reader').evaluate(e=>e.scrollTop>0);await page.selectOption('#wl-view','top');checks.push({kind:'navigation',pass:moved&&await page.locator('.reader').evaluate(e=>e.scrollTop===0)});
 await page.setViewportSize({width:390,height:844});await page.selectOption('#wl-device','phone');await page.selectOption('#wl-word','1');await page.screenshot({path:out+'/mobile.png',fullPage:true});
 fs.writeFileSync(out+'/index.html',html);
 const report={version:frozen.version,acceptedBaseline:true,trialEntries:100,qaVersion:config.version,pass:qa.pass&&checks.every(c=>c.pass)&&errors.length===0,checks,errors,qa,viewportChecks:400,contentHash:sha(words),htmlSHA:sha(html),workflowLock:frozen.hash,coverage:{retainedV2:50,newEntries:50,newCambridgeDefinitions:extras.filter(w=>w.senses.some(s=>s.definitionSourceURL?.includes('cambridge'))).length,historyReady:words.filter(w=>w.historyCards.length).length,sourceAudio:words.filter(w=>w.audioData).length},published:false};
 fs.writeFileSync(out+'/qa-report.json',JSON.stringify(report,null,2));fs.writeFileSync(out+'/release.lock.json',JSON.stringify({version:frozen.version,inputHash:sha(additions),rosterHash:sha(roster),contentHash:sha(words),htmlSHA:sha(html),workflowLock:frozen.hash},null,2));
 if(!report.pass)throw Error('QA failed');console.log(JSON.stringify({pass:report.pass,coverage:report.coverage,checks:checks.length}));
}finally{await browser.close();}
