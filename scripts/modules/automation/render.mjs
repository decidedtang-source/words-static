import fs from 'node:fs';
import {chromium} from '@playwright/test';
import {root,sha} from '../system.mjs';
import {makeHTML} from '../render.mjs';
const source=p=>fs.readFileSync(root+'/'+p,'utf8').replace(/\r\n/g,'\n');
export function makeV2HTML(words){
 let html=makeHTML(words);
 html=html.replace(source('word-page/modules/learning/view-front.html'),source('word-page/modules/learning/view-v2-auto.html'));
 html=html.replace(source('word-page/modules/headword/behavior.js'),source('word-page/modules/headword/behavior-v2.js'));
 html=html.replace('<span>${escape(w.ipa)}</span>','<span title="${escape(w.ipaSource)}">${escape(w.ipa)}</span>');
 html=html.replace('（系统美式英语语音）','');
 html=html.replace('button.disabled=!speechAvailable;','button.disabled=!(w.audioData||speechAvailable);button.title=w.audioData?\'Cambridge词典发音\':\'系统英语发音\';');
 html=html.replace('if(!speechAvailable)root.querySelector','if(!w.audioData&&!speechAvailable)root.querySelector');
 return html.replaceAll('50词前部模块试读','50词 · 自动资料接入 V2');
}
export async function renderV2(words,out){
 let html=makeV2HTML(words);const checks=[],errors=[];
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||process.env.LOCALAPPDATA+'/ms-playwright/chromium-1234/chrome-win64/chrome.exe'});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push(e.message));
  await page.setContent(html);await page.locator('.word-head h2').waitFor();
  const pageInitial=await page.locator('.article').innerHTML();
  html=html.replace('<article class="article"></article>',()=>'<article class="article">'+pageInitial+'</article>');
  const ids=['wl-top-source','wl-top','wl-dictionary','wl-common','wl-history','wl-source','wl-bridge','wl-deep'];
  for(let i=0;i<words.length;i++){
   await page.selectOption('#wl-word',String(i));
   const actual=await page.evaluate(ids=>({order:ids.every((id,i)=>document.querySelectorAll('#'+id).length===1&&(!i||Boolean(document.getElementById(ids[i-1]).compareDocumentPosition(document.getElementById(id))&Node.DOCUMENT_POSITION_FOLLOWING))),examples:[...document.querySelectorAll('#wl-common .sense .english')].map(e=>e.textContent),head:document.querySelector('.word-head h2').textContent,quote:document.querySelector('#wl-source .english').textContent,folded:['wl-dictionary','wl-top-source','wl-bridge-history'].every(id=>!document.getElementById(id).open),pending:document.querySelector('#wl-deep').textContent.includes('待搭建'),links:[...document.querySelectorAll('[data-go]')].every(e=>document.getElementById('wl-'+(e.dataset.go==='context'?'source':e.dataset.go)))}),ids);
   checks.push({entryId:words[i].entryId,kind:'content_and_layout',pass:actual.order&&actual.folded&&actual.pending&&actual.links&&actual.head===words[i].word&&actual.quote===words[i].quote&&JSON.stringify(actual.examples)===JSON.stringify(words[i].senses.map(s=>s.example))});
  }
  const longest=words.map((w,i)=>[JSON.stringify({...w,audioData:null}).length,i]).sort((a,b)=>b[0]-a[0])[0][1];await page.selectOption('#wl-word',String(longest));
  for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});await page.selectOption('#wl-device',width>=1000?'desktop':width>=700?'tablet':'phone');const pass=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1&&document.querySelector('.reader').scrollWidth<=document.querySelector('.reader').clientWidth+1);checks.push({kind:'viewport',width,pass});}
  await page.selectOption('#wl-view','deep');const deep=await page.locator('#wl-deep').evaluate(e=>{const b=e.getBoundingClientRect(),r=e.closest('.reader').getBoundingClientRect();return b.top<r.bottom&&b.bottom>r.top;});await page.selectOption('#wl-view','top');checks.push({kind:'navigation',pass:deep&&await page.locator('.reader').evaluate(e=>e.scrollTop===0)});
  const audioIndex=words.findIndex(w=>w.audioData);if(audioIndex>=0){
   await page.evaluate(()=>{window.Audio=class {constructor(src){window.lastSourceAudio=src;}play(){this.onplaying?.();return Promise.resolve();}pause(){}};});
   await page.selectOption('#wl-word',String(audioIndex));const before=await page.locator('#wl-top').boundingBox();await page.click('[data-pronounce]');const after=await page.locator('#wl-top').boundingBox();
   checks.push({kind:'source_audio_control_simulated',pass:before.height===after.height&&await page.locator('[data-pronounce]').getAttribute('aria-pressed')==='true'&&await page.evaluate(()=>window.lastSourceAudio.startsWith('data:audio/'))});await page.click('[data-pronounce]');
  }
  const offline=await browser.newContext({javaScriptEnabled:false});const p=await offline.newPage();await p.setContent(html);checks.push({kind:'no_javascript_initial_content',pass:await p.locator('.word-head h2').count()===1});await offline.close();
  fs.mkdirSync(out,{recursive:true});fs.writeFileSync(out+'/index.html',html);
  await page.setViewportSize({width:390,height:844});await page.selectOption('#wl-device','phone');await page.selectOption('#wl-word',String(Math.min(1,words.length-1)));await page.screenshot({path:out+'/mobile-preview.png',fullPage:true});
  await page.addStyleTag({content:'#words-layout-review .reader{height:auto!important;overflow:visible!important;padding-bottom:24px}#words-layout-review .bottom-nav{display:none!important}'});await page.screenshot({path:out+'/capacity-mobile-full.png',fullPage:true});
  return {pagePass:errors.length===0&&checks.every(c=>c.pass),htmlSHA:sha(html),checks,errors,audioValidation:'source file downloaded; control simulated; physical speaker not tested'};
 }finally{await browser.close();}
}
