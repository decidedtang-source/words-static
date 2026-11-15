import {chromium} from '@playwright/test';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';import path from 'node:path';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
try{
 const p=await browser.newPage({viewport:{width:390,height:850}});
 await p.addInitScript(()=>{
  window.SpeechSynthesisUtterance=function(text){this.text=text;};
  Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[{lang:'en-US',localService:true}],cancel(){},speak(u){window.utterance=u;u.onstart();}}});
 });
 await p.goto(pathToFileURL(path.resolve('public/previews/'+(process.argv[2]||'word-layout-v9-20261116')+'/index.html')).href);
 const boxes=()=>p.evaluate(()=>['.word-head','.overview','#wl-common'].map(s=>{const r=document.querySelector(s).getBoundingClientRect();return [r.x,r.y,r.width,r.height];}));
 for(const width of [320,390,768])for(const word of ['0','1','2']){
  await p.setViewportSize({width,height:850});await p.selectOption('#wl-word',word);const before=await boxes();
  await p.locator('[data-pronounce]').click();assert.deepEqual(await boxes(),before,'Playback must not shift layout');
  assert.notEqual(await p.locator('.audio-wave').first().evaluate(e=>getComputedStyle(e).animationName),'none');
  await p.evaluate(()=>utterance.onend());assert.deepEqual(await boxes(),before);
  await p.locator('[data-pronounce]').click();await p.evaluate(()=>utterance.onerror());assert.deepEqual(await boxes(),before);
 }
 await p.emulateMedia({reducedMotion:'reduce'});await p.locator('[data-pronounce]').click();
 assert.equal(await p.locator('.audio-wave').first().evaluate(e=>getComputedStyle(e).animationName),'none');
 console.log('PASS: 9 word/width combinations, zero layout shift on play/end/error, wave animation and reduced-motion');
}finally{await browser.close();}
