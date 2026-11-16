import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import {chromium} from '@playwright/test';import {policy,sha} from './structure-flow.mjs';import {toLegacyReadingProjection} from '../word-content/reading-adapter.mjs';
export function assertProjection(data,bundles){const expected=bundles.map(b=>toLegacyReadingProjection(b.snapshot,b.context,b,{structureOnly:true}));assert.deepEqual(data,expected,'page projection differs from current bundles');}
export async function checkPage(file,bundles){
 const expectedIds=bundles.map(b=>b.snapshot.entryId);
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(process.env.LOCALAPPDATA+'/ms-playwright/chromium-1234/chrome-win64/chrome.exe')});const checks=[],errors=[];
 try{
  const p=await browser.newPage({viewport:{width:390,height:900}});p.on('pageerror',e=>errors.push(e.message));
  await p.addInitScript(()=>{window.SpeechSynthesisUtterance=function(t){this.text=t;};Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[{lang:'en-US',localService:true}],cancel(){},speak(u){window.qaUtterance=u;u.onstart();}}});});
  await p.goto(pathToFileURL(path.resolve(file)).href);const data=JSON.parse(await p.locator('#wl-data').textContent());assert.deepEqual(data.map(w=>w.entryId),expectedIds,'page IDs/order');assertProjection(data,bundles);
  for(let i=0;i<expectedIds.length;i++){
   await p.selectOption('#wl-word',String(i));
   for(const selector of policy.moduleOrder)assert.equal(await p.locator('.article '+selector).count(),1,'module '+selector);
   const ordered=await p.evaluate(selectors=>selectors.every((s,i)=>!i||Boolean(document.querySelector(selectors[i-1]).compareDocumentPosition(document.querySelector(s))&Node.DOCUMENT_POSITION_FOLLOWING)),policy.moduleOrder);assert.ok(ordered,'module order');
   assert.equal(await p.locator('#wl-bridge #wl-bridge-history').count(),1);assert.equal(await p.locator('#wl-history #wl-bridge-history').count(),0);
   for(const id of ['dictionary','top-source']){assert.equal(await p.locator('#wl-'+id).evaluate(e=>e.open),false);await p.selectOption('#wl-view',id);assert.equal(await p.locator('#wl-'+id).evaluate(e=>e.open),true);}
   const targets=await p.locator('[data-go]').evaluateAll(es=>[...new Set(es.map(e=>e.dataset.go))]);for(const target of targets){await p.evaluate(t=>document.querySelector('[data-go="'+CSS.escape(t)+'"]').click(),target);assert.equal(await p.locator('#wl-'+(target==='context'?'source':target)).count(),1);}
   assert.equal(await p.locator('#wl-source blockquote .english').textContent(),data[i].quote);checks.push({id:'L01/L02',entryId:expectedIds[i],pass:true});
  }
  // Layout/audio behavior is shared: use the longest text entry at each width.
  const longest=data.reduce((best,w,i)=>JSON.stringify(w).length>JSON.stringify(data[best]).length?i:best,0);
  for(const width of policy.pageWidths){await p.setViewportSize({width,height:900});await p.selectOption('#wl-device',width>=1000?'desktop':width>=700?'tablet':'phone');await p.selectOption('#wl-word',String(longest));const box=()=>p.locator('.word-head').evaluate(e=>{const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height];});const before=await box();await p.locator('[data-pronounce]').click();assert.equal(await p.locator('[data-pronounce]').getAttribute('aria-pressed'),'true');await p.evaluate(()=>window.qaUtterance.onend());assert.deepEqual(await box(),before);for(const view of ['dictionary','bridge','deep']){await p.selectOption('#wl-view',view);assert.ok(await p.locator('.reader').evaluate(e=>e.scrollWidth<=e.clientWidth+1));}checks.push({id:'L03',width,entryId:expectedIds[longest],pass:true});}
  assert.deepEqual(errors,[]);
  return {pass:true,htmlSHA:sha(fs.readFileSync(file)),checks,audio:'simulated control lifecycle; not listening quality',contentQuality:'not_scored'};
 }catch(e){return {pass:false,htmlSHA:sha(fs.readFileSync(file)),checks,error:e.message,contentQuality:'not_scored'};}finally{await browser.close();}
}
