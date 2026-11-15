import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {chromium} from '@playwright/test';
import {loadPage,assemble,checkLock,root} from './manage.mjs';
const p=loadPage(),lock=JSON.parse(await fs.readFile(path.join(root,'release.lock.json'),'utf8'));
const changes=checkLock(p,lock);if(changes.length)throw Error('Unfrozen module changes: '+changes.join(', '));
const {words,template}=assemble(p);
let fragment=template.replace('__WORDS_DATA__',JSON.stringify(words).replace(/</g,'\\u003c'));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setContent(fragment);await page.locator('.word-head h2').waitFor();
 if(errors.length)throw Error(errors.join('\n'));
 const initial=await page.locator('.article').innerHTML();fragment=fragment.replace('<article class="article"></article>',()=>'<article class="article">'+initial+'</article>');
 const output=path.resolve(root,'../public/previews',p.registry.release);await fs.mkdir(output,{recursive:true});
 const html='<!doctype html>\n<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>词条排版预览 · 模块版 v9</title><style>html{color-scheme:light}body{margin:0;padding:18px;background:#f5f6f2;color:#20372e;font-family:system-ui,sans-serif}.version{margin:0 0 12px;color:#526258;font-size:14px}</style></head><body><p class="version">模块版 v9 · 2026-11-16</p>'+fragment+'<noscript><p>脚本已禁用，当前仍可阅读 scope 示例；词条切换需启用 JavaScript。</p></noscript></body></html>';
 await fs.writeFile(path.join(output,'index.html'),html);await fs.copyFile(path.join(root,'release.lock.json'),path.join(output,'release.lock.json'));
 const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
 await fs.writeFile(path.join(output,'artifact.json'),JSON.stringify({htmlSha256:hash(html.replace(/\r\n/g,'\n')),lockSha256:hash(JSON.stringify(lock))},null,2)+'\n');
 console.log(JSON.stringify({output,modules:p.registry.modules.length,words:words.length,errors}));
}finally{await browser.close();}
