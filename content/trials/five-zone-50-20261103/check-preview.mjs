import {chromium} from '@playwright/test';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const dir=dirname(fileURLToPath(import.meta.url));
const batch=JSON.parse(readFileSync(resolve(dir,'batch.json'),'utf8'));
const executablePath=process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const browser=await chromium.launch(executablePath?{executablePath}:{});
const page=await browser.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(pathToFileURL(resolve(dir,'preview.html')).href);
 const checks=[];
 for(const [device,width,height] of [['windows-viewport',1440,810],['mac-viewport',1512,982],['phone-portrait',390,844],['phone-landscape',844,390],['tablet-portrait',820,1180],['tablet-landscape',1180,820]]){
  await page.setViewportSize({width,height});
  for(let index=0;index<batch.entries.length;index++){
   await page.evaluate(i=>choose(i),index);
   const state=await page.evaluate(()=>{
    const a=document.querySelector('.bridge'),b=document.querySelector('.context'),c=document.querySelector('#entry>details'),s=document.querySelector('.senses');
    return {term:document.querySelector('h1').textContent,gloss:document.querySelector('.gloss').textContent,definitionEn:s.querySelector('.en').textContent,definitionZh:s.querySelector('strong').textContent,context:b.querySelector('.sentence').textContent,takeaway:b.querySelector('.takeaway').textContent,bridge:a.querySelector('#bridge-content > p').textContent,order:s?.nextElementSibling===a&&a.nextElementSibling===b&&b.nextElementSibling===c,groups:[...document.querySelectorAll('.group')].map(g=>({text:g.querySelector('p').textContent,links:[...g.querySelectorAll('a')].map(a=>a.href)})),overflow:document.documentElement.scrollWidth>innerWidth,depthDisabled:document.querySelector('#depth').disabled};
   });
   const row=batch.entries[index];
   if(state.term!==row.term||!state.order||state.overflow||state.groups.length!==5||!state.depthDisabled)throw Error(`layout: ${device}/${row.cardId}`);
   if(state.gloss!==row.gloss||state.definitionEn!==row.definitionEn||state.definitionZh!==row.definitionZh||state.context!==row.context||state.takeaway!==row.contextTakeaway||state.bridge!==row.bridgeText)throw Error(`front content: ${row.cardId}`);
   if(state.groups.some((g,i)=>g.text!==row.groups[i].text||g.links.length!==row.groups[i].sourceIds.length||g.links.some((url,j)=>url!==new URL(row.sources.find(s=>s.id===row.groups[i].sourceIds[j]).url).href)))throw Error(`content or source URL: ${row.cardId}`);
   await page.locator('#entry>details>summary').click();
   if(!await page.locator('#entry>details').evaluate(e=>e.open))throw Error('expand');
   await page.locator('#entry>details>summary').click();
   if(await page.locator('#entry>details').evaluate(e=>e.open))throw Error('collapse');
   checks.push({device,width,height,cardId:row.cardId,pass:true});
  }
 }
 if(errors.length)throw Error(errors.join('\n'));
 mkdirSync(resolve(dir,'evidence'),{recursive:true});
 writeFileSync(resolve(dir,'evidence/browser.json'),JSON.stringify({date:'2026-11-03',engine:'Chromium',checks,pageErrors:errors,copyPayloadVerified:false,realDeviceVerified:false,fsrsVerified:false,productionActivated:false},null,2)+'\n');
 await page.setViewportSize({width:1440,height:900});await page.evaluate(()=>choose(0));
 await page.screenshot({path:resolve(dir,'evidence/desktop.png'),fullPage:true});
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:resolve(dir,'evidence/phone.png'),fullPage:true});
 console.log(`PASS: ${checks.length} viewport/card combinations; exact 250 paragraphs and source links, senses/ABC, expansion, no overflow/page errors.`);
}finally{await browser.close()}
