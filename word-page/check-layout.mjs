import {chromium} from '@playwright/test';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {root} from './manage.mjs';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
try{
 const before=await browser.newPage(),after=await browser.newPage(),errors=[];
 after.on('pageerror',e=>errors.push(e.message));
 await before.goto(pathToFileURL(path.resolve(root,'../public/previews/word-layout-v7-20261116/index.html')).href);
 await after.goto(pathToFileURL(path.resolve(root,'../public/previews/word-layout-v8-20261116/index.html')).href);
 let layouts=0,pixels=0;
 for(const width of [320,390,768,1280])for(const device of ['phone','tablet','desktop'])for(const word of ['0','1','2']){
  for(const page of [before,after]){await page.setViewportSize({width,height:900});await page.selectOption('#wl-device',device);await page.selectOption('#wl-word',word);}
  const normalize=s=>s.replace(/ class=""/g,'').replace(/>\s+</g,'><').trim();
  assert.equal(normalize(await after.locator('.frame').innerHTML()),normalize(await before.locator('.frame').innerHTML()));
  assert.ok(await after.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if(width===390&&device==='phone'){assert.ok((await after.locator('.frame').screenshot()).equals(await before.locator('.frame').screenshot()),'pixel equality');pixels++;}
  await after.selectOption('#wl-view','context');assert.equal(await after.inputValue('#wl-view'),'source');
  await after.selectOption('#wl-view','bridge');assert.equal(await after.locator('#wl-bridge-history').evaluate(e=>e.open),false);
  await after.locator('#wl-bridge-history summary').click();assert.equal(await after.locator('#wl-bridge-history').evaluate(e=>e.open),true);
  assert.equal(await after.locator('.analysis-piece').count(),5);layouts++;
 }
 assert.deepEqual(errors,[]);console.log(JSON.stringify({layouts,pixelIdenticalWordScreens:pixels,errors}));
}finally{await browser.close();}
