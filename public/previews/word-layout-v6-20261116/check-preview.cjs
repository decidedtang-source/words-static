const {chromium}=require('@playwright/test');
const {pathToFileURL}=require('url');
const path=require('path'),assert=require('assert/strict');
(async()=>{
 const fs=require('fs');const executablePath=process.env.CHROMIUM_PATH||(fs.existsSync('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe')?'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe':undefined);
 const browser=await chromium.launch({executablePath});
 try{
 const page=await browser.newPage();let count=0;const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.join(__dirname,'index.html')).href);
 for(const width of [320,390,768,1280])for(const device of ['phone','tablet','desktop'])for(const word of ['0','1','2']){
  await page.setViewportSize({width,height:900});await page.selectOption('#wl-device',device);await page.selectOption('#wl-word',word);
  assert.equal(await page.locator('.analysis-piece').count(),5);
  assert.equal(await page.locator('#wl-context').count(),0);
  assert.equal(await page.locator('#wl-bridge-history').evaluate(e=>e.open),false);
  const checks=await page.evaluate(()=>{
   const ids=[...document.querySelector('.article').children].map(e=>e.id);
   return {first:ids[0],order:ids.indexOf('wl-common')<ids.indexOf('wl-history')&&ids.indexOf('wl-history')<ids.indexOf('wl-source')&&ids.indexOf('wl-source')<ids.indexOf('wl-bridge'),overflow:document.documentElement.scrollWidth>innerWidth,readerOverflow:document.querySelector('.reader').scrollWidth>document.querySelector('.reader').clientWidth};
  });
  assert.equal(checks.first,'wl-top-source');assert.ok(checks.order);assert.ok(!checks.overflow&&!checks.readerOverflow);
  await page.selectOption('#wl-view','context');assert.equal(await page.inputValue('#wl-view'),'source');
  await page.selectOption('#wl-view','bridge');await page.locator('#wl-bridge-history summary').click();assert.ok(await page.locator('#wl-bridge-history').evaluate(e=>e.open));
  await page.locator('#wl-bridge-history [data-go="history"]').click();assert.equal(await page.inputValue('#wl-view'),'history');
  count++;
 }
 assert.deepEqual(errors,[]);console.log(JSON.stringify({layouts:count,errors,structure:'PASS',foldAndNavigation:'PASS',overflow:'NONE'}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
