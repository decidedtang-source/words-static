// Run after npm ci; this checks the isolated prototype, not the production app.
import {createRequire} from 'node:module';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const require=createRequire(process.env.PREVIEW_PACKAGE_JSON||new URL('../../../../package.json',import.meta.url));
const {chromium}=require('playwright');
const dir=dirname(fileURLToPath(import.meta.url)),data=JSON.parse(readFileSync(join(dir,'PREVIEW-CONTENT.json'),'utf8'));
mkdirSync(join(dir,'screenshots'),{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(process.env.LOCALAPPDATA+'/ms-playwright/chromium-1234/chrome-win64/chrome.exe')});
const results=[],errors=[],external=[];let storageWrites=0;
try{
 for(const width of [320,390,768,1024,1440]){
  const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage();
  await page.addInitScript(()=>{window.__copied=[];window.__writes=0;Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>window.__copied.push(text)}});indexedDB.open=()=>{window.__writes++;throw Error('Unexpected DB access')};Storage.prototype.setItem=()=>{window.__writes++;throw Error('Unexpected storage write')};});
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))external.push(r.url())});
  for(const c of data.cases){
   await page.goto(pathToFileURL(join(dir,'preview.html')).href+'#'+c.id);
   for(const mode of ['lookup','front','revealed']){
    await page.selectOption('#mode',mode);
    assert.equal(await page.locator('h1').innerText(),c.target);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${c.id}/${width}/${mode}: overflow`);
    if(mode==='front'){
     assert.equal(await page.locator('[data-sense]').count(),0);assert.equal(await page.locator('[data-group]').count(),0);
     assert.equal(await page.locator('#content').innerText().then(t=>t.includes(c.meaning)),false);
    }else{
     assert.equal(await page.locator('[data-sense]').count(),c.dictionaryEntries.reduce((n,e)=>n+e.senses.length,0));
     assert.equal(await page.locator('[data-group]').count(),5);assert.equal(await page.locator('details,dialog').count(),0);
     for(const e of c.dictionaryEntries)for(const s of e.senses)assert.ok((await page.locator('#dictionary').innerText()).includes(s.definitionEn));
     await page.locator('[data-copy="copyOriginal"]').click();await page.locator('[data-copy="copyDeep"]').click();
     assert.deepEqual(await page.evaluate(()=>window.__copied.slice(-2)),[c.copyOriginal,c.copyDeep]);
    }
    await page.evaluate(()=>scrollTo(0,0));
    if(!process.env.PREVIEW_SKIP_SCREENSHOTS&&[390,1440].includes(width))await page.screenshot({path:join(dir,'screenshots',`${c.id}-${width}-${mode}.jpg`),fullPage:mode==='lookup',type:'jpeg',quality:65});
    results.push({case:c.id,width,mode,result:'PASS'});
   }
   await page.selectOption('#mode','front');await page.click('#reveal');assert.equal(await page.inputValue('#mode'),'revealed');assert.equal(await page.locator('[data-group]').count(),5);
  }
  storageWrites+=await page.evaluate(()=>window.__writes);await context.close();
 }
 // Clipboard failure: verify complete manual payload, with no model/network call.
 const p=await browser.newPage();await p.addInitScript(()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw Error('denied')}}})});await p.goto(pathToFileURL(join(dir,'preview.html')).href+'#F');await p.click('[data-copy="copyDeep"]');assert.equal(await p.locator('textarea').inputValue(),data.cases[5].copyDeep);await p.close();
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);assert.equal(storageWrites,0);
 const report={scope:'ISOLATED_PROTOTYPE_ONLY',candidateSha256:createHash('sha256').update(readFileSync(join(dir,'PREVIEW-CONTENT.json'))).digest('hex'),browser:browser.version(),states:results.length,results,pageErrors:errors,externalRequests:external,storageWrites,copyFailureFallback:'PASS',oneReveal:'PASS',productionRegression:'NOT_RUN',ownerUat:'PENDING'};
 writeFileSync(join(dir,'preview-checks.json'),JSON.stringify(report,null,2)+'\n');
 let md='# 手机与桌面页面预览\n\n独立规划样机，非正式网页发布。每组提供直接查词的完整长页、背诵正面与一次揭晓后的900px视口实拍。揭晓内容与查词完整长页一致，底部评分仅示意。桌面1440px，手机390px；更窄320px等结构检查见 PREVIEW-QA。\n';
 for(const c of data.cases){md+=`\n## ${c.id} · ${c.target}\n\n`;for(const mode of ['lookup','front','revealed'])md+=`### ${{lookup:'直接查词',front:'背诵正面',revealed:'一次揭晓后'}[mode]}\n\n[桌面原图](screenshots/${c.id}-1440-${mode}.jpg) · [手机原图](screenshots/${c.id}-390-${mode}.jpg)\n\n![${c.id} ${mode} desktop](screenshots/${c.id}-1440-${mode}.jpg)\n\n![${c.id} ${mode} mobile](screenshots/${c.id}-390-${mode}.jpg)\n`;}
 writeFileSync(join(dir,'SCREENSHOTS.md'),md);console.log(JSON.stringify({states:results.length,screenshots:36,browser:browser.version(),errors,storageWrites,externalRequests:external.length}));
}finally{await browser.close()}
