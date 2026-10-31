import test from 'node:test';import assert from 'node:assert/strict';import {chromium} from '@playwright/test';
import {startSite,executablePath,snapshot} from './site.mjs';
test('direct dictionary, exact bookmarks, copy fallback, return and asynchronous imports preserve progress',async()=>{
 const site=await startSite(),browser=await chromium.launch({executablePath});
 try{
  const context=await browser.newContext({viewport:{width:390,height:750},acceptDownloads:true});
  await context.addInitScript(()=>{window.copied=[];Object.defineProperty(navigator,'clipboard',{value:{writeText(text){window.copied.push(text);return window.rejectClipboard?Promise.reject(Error('denied')):Promise.resolve()}}})});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(site.url);
  await page.getByRole('button',{name:'开始学习',exact:true}).click();const term=await page.locator('.word').textContent();assert.equal(await page.locator('[data-sense]').count(),0);
  await page.getByRole('button',{name:'显示释义',exact:true}).click();assert.ok(await page.locator('[data-sense]').count()>0);assert.equal(await page.locator('[data-group]').count(),5);assert.equal(await page.locator('dialog,.study details').count(),0);
  await page.getByRole('button',{name:'复制深析',exact:true}).click();assert.match(await page.evaluate(()=>copied.at(-1)),/^【深析】/);
  const empty=await snapshot(page);await page.goto(site.url+'#dictionary?q=working%20definition');await page.locator('[data-card="V20261029-005"]').click();await page.locator('.entry-title').waitFor();await page.keyboard.press('3');assert.deepEqual(await snapshot(page),empty);
  assert.equal(await page.locator('[data-group]').count(),5);assert.equal(await page.locator('[data-sense]').count(),6);
  const working=page.locator('.dictionary-entry').filter({has:page.getByRole('heading',{name:'working · 形容词 adj.',exact:true})});await working.getByRole('button',{name:'收藏这个词条',exact:true}).click();await working.getByRole('button',{name:'已收藏，排期未改变',exact:true}).waitFor();
  await page.evaluate(()=>window.rejectClipboard=true);await page.getByRole('button',{name:'复制原文',exact:true}).click();await page.getByLabel('手工复制文本').waitFor();assert.equal(await page.getByLabel('手工复制文本').inputValue(),'working definition');
  await page.getByRole('button',{name:'返回原页面',exact:true}).click();await page.locator('[data-dictionary-search]').waitFor();await page.goBack();await page.getByRole('button',{name:'认识',exact:true}).waitFor();assert.equal(await page.locator('.word').textContent(),term);await page.getByRole('button',{name:'认识',exact:true}).click();await page.getByRole('button',{name:'显示释义',exact:true}).waitFor();const before=await snapshot(page);assert.equal(before.events.length,1);
  await page.goto(site.url+'#entry?term=lead');await page.locator('.entry-title').waitFor();const metal=page.locator('.dictionary-entry').filter({hasText:'铅（金属元素）'});await metal.getByRole('button',{name:'收藏这个词条'}).click();await metal.getByText('已收藏，排期未改变',{exact:true}).waitFor();
  await page.goto(site.url+'#dictionary');await page.locator('summary').filter({hasText:'我的收藏与备份'}).click();await page.locator('[data-saved]').getByRole('button',{name:/lead · 名词 · 铅/}).click();await page.locator('.entry-title').waitFor();assert.equal(await page.locator('.dictionary-entry').count(),1);
  await page.getByRole('button',{name:'返回原页面'}).click();await page.locator('summary').filter({hasText:'我的收藏与备份'}).click();
  await page.evaluate(()=>{const original=File.prototype.text;File.prototype.text=function(){return this.name==='old.json'?new Promise(resolve=>setTimeout(()=>original.call(this).then(resolve),700)):original.call(this)}});
  const input=page.locator('[data-import]'),make=(name,label)=>({name,mimeType:'application/json',buffer:Buffer.from(JSON.stringify({schema:1,items:[{kind:'card',id:'test-race',label,query:'test'}]}))});
  await input.setInputFiles(make('old.json','OLDER'));await input.setInputFiles(make('new.json','NEWER'));await page.getByRole('button',{name:'NEWER · 词卡',exact:true}).waitFor();await page.waitForTimeout(850);assert.equal(await page.getByRole('button',{name:'OLDER · 词卡',exact:true}).count(),0);
  await input.setInputFiles(make('old.json','LEAVING'));await page.goto(site.url+'#today');await page.waitForTimeout(850);await page.goto(site.url+'#dictionary');await page.locator('summary').filter({hasText:'我的收藏与备份'}).click();assert.equal(await page.getByRole('button',{name:'LEAVING · 词卡',exact:true}).count(),0);assert.deepEqual(await snapshot(page),before);
  const download=page.waitForEvent('download');await page.getByRole('button',{name:'导出收藏',exact:true}).click();const file=await (await download).path();const other=await browser.newPage();await other.goto(site.url+'#dictionary');await other.locator('summary').filter({hasText:'我的收藏与备份'}).click();await other.locator('[data-import]').setInputFiles(file);await other.locator('[data-saved]').getByRole('button',{name:/lead · 名词 · 铅/}).waitFor();assert.equal(await snapshot(other),null);
  for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:850});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))}assert.deepEqual(errors,[]);
 }finally{await browser.close();await site.close()}
});
