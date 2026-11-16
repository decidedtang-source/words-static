import fs from 'node:fs';
import {chromium} from '@playwright/test';
import {loadPage,assemble} from '../../word-page/manage.mjs';
import {root,sha} from './system.mjs';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function makeHTML(words){
 const p=loadPage();
 for(const id of ['dictionary','learning','scenario','bridge','history','analysis']){
  const file=root+'/word-page/modules/'+id+'/view-front.html';
  if(fs.existsSync(file))p.modules[id].view=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
 }
 let template=assemble(p).template;
 template=template.replace('data-go="common">↑ 回看相关通用义项','data-go="${escape(w.bridgeTarget)}">↑ 回看相关义项');
 template=template.replace("if(id==='dictionary'||id==='top-source')el.open=true;","if(id==='dictionary'||id==='top-source')el.open=true;const parentDetails=el.closest('details');if(parentDetails)parentDetails.open=true;");
 template=template.replace("link(w.sourceUrl,w.sourceLabel)+' · '+w.sourceDate","link(w.sourceUrl,w.sourceLabel)+(w.sourceDate?' · '+w.sourceDate:'')");
 template=template.replace(/<select id="wl-word">[\s\S]*?<\/select>/,`<select id="wl-word">${words.map((w,i)=>`<option value="${i}">${esc(w.word)}</option>`).join('')}</select>`);
 template=template.replace('__WORDS_DATA__',()=>JSON.stringify(words).replace(/</g,'\\u003c'));
 return '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>WORDS · 50词前部模块试读</title><style>html{color-scheme:light}body{margin:0;padding:12px;background:#f5f6f2;color:#20372e;font-family:system-ui,sans-serif}.version{font-size:13px;color:#526258}*{box-sizing:border-box}</style></head><body><p class="version">50词前部模块试读 · 七步分析待搭建</p>'+template+'</body></html>';
}
export async function renderAndCheck(words,output){
 let html=makeHTML(words);
 const executablePath=process.env.CHROMIUM_PATH||process.env.LOCALAPPDATA+'/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
 const browser=await chromium.launch({executablePath});
 const checks=[],errors=[];
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push(e.message));
  await page.setContent(html);await page.locator('.word-head h2').waitFor();
  const initial=await page.locator('.article').innerHTML();
  html=html.replace('<article class="article"></article>',()=>'<article class="article">'+initial+'</article>');
  const order=['wl-top-source','wl-top','wl-dictionary','wl-common','wl-history','wl-source','wl-bridge','wl-deep'];
  for(let i=0;i<words.length;i++){
   await page.selectOption('#wl-word',String(i));
   const state=await page.evaluate(ids=>({order:ids.map(id=>document.getElementById(id)).every((el,j,a)=>el&&(!j||Boolean(a[j-1].compareDocumentPosition(el)&Node.DOCUMENT_POSITION_FOLLOWING))),head:document.querySelector('.word-head h2').textContent,quote:document.querySelector('#wl-source .english').textContent,pending:document.querySelector('#wl-deep').textContent.includes('待搭建'),folded:['wl-top-source','wl-dictionary','wl-bridge-history'].every(id=>!document.getElementById(id).open),unique:ids.every(id=>document.querySelectorAll('#'+id).length===1)}),order);
   checks.push({entryId:words[i].entryId,pass:state.order&&state.unique&&state.folded&&state.pending&&state.head===words[i].word&&state.quote===words[i].quote,kind:'entry_layout'});
  }
  const longest=words.map((w,i)=>[JSON.stringify(w).length,i]).sort((a,b)=>b[0]-a[0])[0][1];await page.selectOption('#wl-word',String(longest));
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:900});await page.selectOption('#wl-device',width>=1000?'desktop':width>=700?'tablet':'phone');
   // Bridge intentionally extends 8px beyond article into the reader padding.
   const fits=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1&&[...document.querySelectorAll('.reader')].every(e=>e.scrollWidth<=e.clientWidth+1));
   checks.push({kind:'viewport',width,pass:fits});
  }
  await page.selectOption('#wl-view','deep');const deep=await page.locator('#wl-deep').evaluate(el=>{const r=el.closest('.reader').getBoundingClientRect(),b=el.getBoundingClientRect();return b.top<r.bottom&&b.bottom>r.top;});
  await page.selectOption('#wl-view','top');const top=await page.locator('.reader').evaluate(el=>el.scrollTop===0);checks.push({kind:'navigation',pass:deep&&top});
  await page.setViewportSize({width:390,height:844});await page.selectOption('#wl-device','phone');await page.selectOption('#wl-word','1');
  fs.mkdirSync(output,{recursive:true});fs.writeFileSync(output+'/index.html',html);
  await page.screenshot({path:output+'/mobile-preview.png',fullPage:true});
  const offline=await browser.newContext({javaScriptEnabled:false});const offlinePage=await offline.newPage();await offlinePage.setContent(html);checks.push({kind:'javascript_disabled',pass:await offlinePage.locator('.word-head h2').count()===1});await offline.close();
  return {pagePass:!errors.length&&checks.every(c=>c.pass),htmlSHA:sha(html),checks,errors};
 }finally{await browser.close();}
}
