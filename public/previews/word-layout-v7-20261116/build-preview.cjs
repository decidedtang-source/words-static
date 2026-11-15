const fs=require('fs');
const path=require('path');
const {pathToFileURL}=require('url');
const assert=require('assert/strict');
const {chromium}=require('@playwright/test');
(async()=>{
 const data=JSON.parse(fs.readFileSync(path.join(__dirname,'data.json'),'utf8'));
 let fragment=fs.readFileSync(path.join(__dirname,'template.html'),'utf8').replace('__WORDS_DATA__',JSON.stringify(data).replace(/</g,'\\u003c'));
 const edge='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
 const executablePath=process.env.CHROMIUM_PATH||(fs.existsSync('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe')?'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe':undefined);
 const browser=await chromium.launch({executablePath});
 try{
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setContent(fragment);
  await page.locator('.word-head h2').waitFor();
  const initialArticle=await page.locator('.article').innerHTML();
  fragment=fragment.replace('<article class="article"></article>',()=>'<article class="article">'+initialArticle+'</article>');
  const html='<!doctype html>\n<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>词条排版预览 · 本地独立版 v7</title><style>html{color-scheme:light}body{margin:0;padding:18px;background:#f5f6f2;color:#20372e;font-family:system-ui,sans-serif}.version{margin:0 0 12px;color:#526258;font-size:14px}</style></head><body><p class="version">本地独立版 v7 · 无需联网 · 2026-11-16</p>'+fragment+'<noscript><p>脚本已禁用，当前仍可阅读 scope 示例；词条切换需启用 JavaScript。</p></noscript></body></html>';
  const output=path.join(__dirname,'index.html');
  fs.writeFileSync(output,html);
  await page.goto(pathToFileURL(output).href);
  assert.equal(await page.locator('.word-head h2').innerText(),'scope');
  for(const [i,word] of data.entries()){
   await page.locator('#wl-word').selectOption(String(i));
   assert.equal(await page.locator('.word-head h2').innerText(),word.word);
   await page.locator('#wl-view').selectOption('top-source');
   assert.equal(await page.locator('#wl-top-source').getAttribute('open'),'');
   await page.locator('#wl-view').selectOption('bridge');
   assert.ok(await page.locator('#wl-bridge').isVisible());
  }
  await page.locator('#wl-word').selectOption('1');
  await page.setViewportSize({width:1000,height:1000});
  const offline=await browser.newContext({javaScriptEnabled:false,offline:true});
  const staticPage=await offline.newPage();await staticPage.goto(pathToFileURL(output).href);
  assert.equal(await staticPage.locator('.word-head h2').innerText(),'scope');
  assert.ok((await staticPage.locator('.article').innerText()).includes('Bridge'));
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({output,browser:executablePath,words:3,jsErrors:errors,noJavaScriptOfflineBody:'PASS',iframes:await page.locator('iframe').count()}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});