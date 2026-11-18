import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {readFileSync,mkdirSync} from 'node:fs';
import {chromium} from '@playwright/test';
import {empty,grade,undo,day,validate} from '../../src/model.mjs';

test('unlimited targets, combined source dates, historical progress and backup preserve scheduling',async()=>{
  const data=JSON.parse(readFileSync('public/vocabulary.json','utf8'));
  const a=data.words[0],b=data.words.find(w=>w.date!==a.date),c=data.words.find(w=>w.date===b.date&&w.id!==b.id);
  const now=Date.now(),at=now-2*86400000,state=empty();
  grade(state,{eventId:'history-a',cardId:a.id,rating:3,at,version:0});
  grade(state,{eventId:'history-b',cardId:b.id,rating:1,at:at+1000,version:0});
  grade(state,{eventId:'history-review',cardId:a.id,rating:3,at:at+86400000,version:1});
  grade(state,{eventId:'history-undone',cardId:c.id,rating:3,at:at+86400000+1000,version:0});
  undo(state,'history-undo',at+86400000+2000);state.marks[c.id]=true;
  const schedule=JSON.stringify(state.cards);
  const server=http.createServer((req,res)=>{
    const file=new URL(req.url,'http://localhost').pathname.split('/').at(-1)||'index.html';
    if(!['index.html','app.js','styles.css','vocabulary.json'].includes(file)){res.writeHead(404);res.end();return;}
    res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.json')?'application/json':'text/html');res.end(readFileSync('dist/'+file));
  });await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const url=process.env.MULTIDAY_LIVE_URL||`http://127.0.0.1:${server.address().port}/`;
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(process.env.LOCALAPPDATA+'/ms-playwright/chromium-1234/chrome-win64/chrome.exe')});
  try{
    const page=await browser.newPage({viewport:{width:390,height:750}});page.setDefaultNavigationTimeout(60000);
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(url+'#backup');
    await page.getByLabel('选择记录文件').setInputFiles({name:'old-progress.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(state))});
    await page.getByRole('button',{name:'确认合并记录',exact:true}).click();await page.getByText('记录已合并，已有记录不会重复计数。',{exact:true}).waitFor();
    await page.getByLabel('每日新词目标',{exact:true}).fill('500');await page.getByRole('button',{name:'保存目标',exact:true}).click();
    await page.getByText('每日目标已保存',{exact:true}).waitFor();await page.reload();assert.equal(await page.getByLabel('每日新词目标',{exact:true}).inputValue(),'500');
    await page.getByLabel('每日新词不限量',{exact:true}).check();await page.getByRole('button',{name:'保存目标',exact:true}).click();await page.getByText('每日目标已保存',{exact:true}).waitFor();
    await page.reload();assert.equal(await page.getByLabel('每日新词不限量',{exact:true}).isChecked(),true);assert.equal(await page.getByLabel('每日新词目标',{exact:true}).isDisabled(),true);
    const download=page.waitForEvent('download');await page.getByRole('button',{name:'导出学习记录',exact:true}).click();
    const stream=await (await download).createReadStream(),chunks=[];for await(const chunk of stream)chunks.push(chunk);
    const exported=JSON.parse(Buffer.concat(chunks).toString('utf8'));
    assert.equal(exported.settings.target,null);assert.equal(JSON.stringify(exported.cards),schedule);assert.deepEqual(validate(exported),exported);
    const imported=await browser.newPage();await imported.goto(url+'#backup');
    await imported.getByLabel('选择记录文件').setInputFiles({name:'unlimited-progress.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(exported))});
    await imported.getByRole('button',{name:'确认合并记录',exact:true}).click();await imported.getByText('记录已合并，已有记录不会重复计数。',{exact:true}).waitFor();
    assert.equal(await imported.getByLabel('每日新词不限量',{exact:true}).isChecked(),true,'import immediately updates target controls');
    assert.equal(await imported.getByLabel('每日新词目标',{exact:true}).isDisabled(),true);
    await imported.getByRole('button',{name:'保存目标',exact:true}).click();await imported.getByText('每日目标已保存',{exact:true}).waitFor();await imported.reload();
    assert.equal(await imported.getByLabel('每日新词不限量',{exact:true}).isChecked(),true,'saving imported target retains unlimited');
    const saveErrors=[];imported.on('pageerror',e=>saveErrors.push(e.message));
    await imported.evaluate(()=>{
      const open=indexedDB.open.bind(indexedDB);let first=true;
      indexedDB.open=(...args)=>{if(!first)return open(...args);first=false;const request={};window.failPendingSave=()=>request.onerror();return request;};
      document.querySelector('#target-form').requestSubmit();location.hash='today';
    });
    await imported.getByRole('heading',{name:'今天学一点',exact:true}).waitFor();await imported.evaluate(()=>window.failPendingSave());
    await imported.evaluate(()=>new Promise(resolve=>setTimeout(resolve,0)));assert.deepEqual(saveErrors,[],'failed save after navigation has no stale-DOM error');await imported.close();
    await page.goto(url+'#stats?36500');await page.getByTestId('answer-count').waitFor();
    assert.equal(await page.getByTestId('answer-count').textContent(),'3');assert.equal(await page.getByTestId('new-count').textContent(),'2');assert.equal(await page.getByTestId('review-count').textContent(),'1');
    for(const date of [a.date,b.date])assert.match(await page.locator(`[data-batch-progress="${date}"] [data-batch-started]`).textContent(),/^1 \/ /);
    assert.deepEqual(await page.locator(`[data-study-date="${day(at)}"] td`).allTextContents(),[day(at),'2','0','2','2']);
    assert.deepEqual(await page.locator(`[data-study-date="${day(at+86400000)}"] td`).allTextContents(),[day(at+86400000),'0','1','1','1']);
    await page.getByLabel('按词表日期查看',{exact:true}).selectOption(a.date);await page.waitForURL(/batch=/);await page.getByTestId('answer-count').waitFor();
    assert.equal(await page.getByTestId('answer-count').textContent(),'2');assert.equal(await page.locator('[data-batch-progress]').count(),1);
    mkdirSync('local-evidence',{recursive:true});await page.screenshot({path:'local-evidence/multiday-progress-mobile.png',fullPage:true});
    for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:750});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`);}
    await page.goto(url+'#today');await page.setViewportSize({width:320,height:750});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'unlimited metric fits mobile');await page.getByText('组合多个日期学习',{exact:true}).click();
    await page.locator(`[data-study-batch="${a.date}"]`).check();await page.locator(`[data-study-batch="${b.date}"]`).check();
    await page.getByRole('button',{name:'开始学习',exact:true}).click();await page.getByRole('button',{name:'显示释义',exact:true}).waitFor();
    assert.match(await page.locator('.study-topline .muted').textContent(),new RegExp(`${a.date}|${b.date}`));
    await page.getByRole('button',{name:'显示释义',exact:true}).click();await page.getByRole('button',{name:'认识',exact:true}).click();await page.getByRole('button',{name:'显示释义',exact:true}).waitFor();
    assert.match(await page.locator('.study-topline .muted').textContent(),new RegExp(`${a.date}|${b.date}`));
    await page.goto(url+'#stats?36500');await page.getByTestId('answer-count').waitFor();assert.equal(await page.getByTestId('answer-count').textContent(),'4');
    assert.deepEqual(errors,[]);
  }finally{await browser.close();await new Promise(r=>server.close(r));}
});
