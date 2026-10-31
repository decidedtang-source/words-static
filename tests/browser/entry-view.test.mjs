import test from 'node:test';import assert from 'node:assert/strict';import {chromium} from '@playwright/test';import {mkdirSync,readFileSync} from 'node:fs';
import {startSite,executablePath,snapshot} from './site.mjs';import {loadReviewedRelease} from '../../scripts/build-reviewed-batch.mjs';import {createContentBundle} from '../../scripts/content-bundle.mjs';
const asRelease=b=>({...b,contentManifest:b.manifest});
test('five reviewed production entries render direct dictionary and full compact analysis at mobile and desktop sizes',async()=>{
 const release=loadReviewedRelease(),site=await startSite(release),browser=await chromium.launch({executablePath});
 try{const page=await browser.newPage();mkdirSync('local-evidence/p1-p3',{recursive:true});for(const width of [320,390,768,1024,1440]){
  await page.setViewportSize({width,height:900});for(const a of Object.values(release.analysis.entries)){
   await page.goto(site.url+'#entry?card='+a.cardId);await page.locator('[data-group]').first().waitFor();
   assert.equal(await page.locator('[data-group]').count(),5);assert.equal(await page.locator('details,dialog').count(),0);
   const senses=release.catalog.entries.filter(e=>a.dictionaryEntryIds.includes(e.id)).reduce((n,e)=>n+e.senses.length,0);assert.equal(await page.locator('[data-sense]').count(),senses);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),a.cardId+'/'+width);
   if([390,1440].includes(width))await page.screenshot({path:`local-evidence/p1-p3/${a.cardId}-${width}.png`,fullPage:true});
  }
 }assert.equal(await snapshot(page),null);
 // The sixth engineering sample is test-only and explicitly unreviewed; never in active content.
 const example=JSON.parse(readFileSync('docs/codex/review-2026-10-31/PREVIEW-CONTENT.json','utf8')).cases.find(c=>c.id==='E');
 const word={id:'engineering-test-only',term:example.target,meaning:example.meaning,example:example.context,examples:[],date:'2026-10-31'};
 const fixture=createContentBundle({vocabulary:{words:[word],batches:[],updated:word.date},catalog:{entries:example.dictionaryEntries}});site.setRelease(fixture);
 await page.goto(site.url+'#today');await page.reload();await page.goto(site.url+'#entry?card='+word.id);await page.getByText(/全流程简析待审/).waitFor();assert.equal(await page.locator('[data-group]').count(),0);
 }finally{await browser.close();await site.close()}
});
test('new revisions and withdrawn cards block pending grades, corrupted bundles keep old content, offline uses fixed content',async()=>{
 const release=loadReviewedRelease(),site=await startSite(release),browser=await chromium.launch({executablePath});
 try{const page=await browser.newPage();await page.addInitScript(()=>{AbortSignal.timeout=undefined});await page.goto(site.url);await page.getByRole('button',{name:'开始学习',exact:true}).click();await page.getByRole('button',{name:'显示释义',exact:true}).click();const id=await page.locator('[data-entry]').getAttribute('data-entry');
 const revised=structuredClone(release.analysis);revised.entries[id].memoryGloss='本次更新：班次';const next=createContentBundle({vocabulary:release.vocabulary,analysis:revised,catalog:release.catalog,previous:release.contentManifest});site.setRelease(next);
 await page.getByRole('button',{name:'认识',exact:true}).click();await page.getByRole('button',{name:'显示释义',exact:true}).waitFor();assert.equal(await snapshot(page),null);
 await page.getByRole('button',{name:'显示释义',exact:true}).click();await page.getByText('本次更新：班次',{exact:true}).waitFor();
 site.setMode('offline');await page.getByRole('button',{name:'认识',exact:true}).click();await page.getByRole('button',{name:'显示释义',exact:true}).waitFor();assert.equal((await snapshot(page)).events.length,1);
 site.setMode('normal');await page.getByRole('button',{name:'显示释义',exact:true}).click();const id2=await page.locator('[data-entry]').getAttribute('data-entry');
 const withdrawn=createContentBundle({vocabulary:release.vocabulary,analysis:revised,catalog:release.catalog,previous:next.manifest,retiredIds:[id2]});site.setRelease(withdrawn);site.setMode('corrupt');
 await page.getByRole('button',{name:'认识',exact:true}).click();await page.getByText(/新内容未能完整加载/).waitFor();assert.equal((await snapshot(page)).events.length,1);
 site.setMode('normal');await page.getByRole('button',{name:'认识',exact:true}).click();await page.getByText(/此词卡已撤回/).waitFor();assert.equal((await snapshot(page)).events.length,1);
 await page.goto(site.url+'#entry?card='+id2);await page.getByText(/此词卡已撤回或当前内容不可用/).waitFor();assert.equal(await page.locator('[data-sense]').count(),0);
 const withHistoryRetired=createContentBundle({vocabulary:release.vocabulary,analysis:revised,catalog:release.catalog,previous:withdrawn.manifest,retiredIds:[id,id2]});site.setRelease(withHistoryRetired);await page.reload();await page.goto(site.url+'#stats');await page.getByText('此词卡已撤回/当前内容不可用：'+id,{exact:true}).waitFor();assert.equal((await snapshot(page)).events.length,1);
 }finally{await browser.close();await site.close()}
});

test('late old manifest never re-enables grading after a known incomplete withdrawal',async()=>{
 const release=loadReviewedRelease(),site=await startSite(release),browser=await chromium.launch({executablePath});
 try{const page=await browser.newPage();await page.goto(site.url);await page.getByRole('button',{name:'开始学习',exact:true}).click();await page.getByRole('button',{name:'显示释义',exact:true}).click();const id=await page.locator('[data-entry]').getAttribute('data-entry');
 let held,arrive;const heldReady=new Promise(r=>arrive=r);await page.route('**/content-manifest.json',async route=>{if(!held){held=route;arrive()}else await route.continue()});
 await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));await heldReady;
 const next=createContentBundle({vocabulary:release.vocabulary,analysis:release.analysis,catalog:release.catalog,previous:release.contentManifest,retiredIds:[id]});site.setRelease(next);site.setMode('corrupt');
 await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));await page.getByText(/新内容未能完整加载/).waitFor();
 await held.fulfill({status:200,contentType:'application/json',body:JSON.stringify(release.contentManifest)});await page.waitForTimeout(100);site.setMode('offline');
 await page.getByRole('button',{name:'认识',exact:true}).click();await page.waitForTimeout(100);assert.equal(await snapshot(page),null);
 }finally{await browser.close();await site.close()}
});

test('same revision content rollback requires another reveal before grading',async()=>{
 const release=loadReviewedRelease(),site=await startSite(release),browser=await chromium.launch({executablePath});
 try{const page=await browser.newPage();const id='V20261029-005';
 // Narrow test queue to the existing reviewed card, preserving its actual revision and render hash.
 const start=createContentBundle({vocabulary:{...release.vocabulary,words:release.vocabulary.words.filter(w=>w.id===id)},analysis:release.analysis,catalog:release.catalog});site.setRelease(start);
 await page.goto(site.url);await page.getByRole('button',{name:'开始学习',exact:true}).click();await page.getByRole('button',{name:'显示释义',exact:true}).click();
 const rollback=loadReviewedRelease(process.cwd(),[]);assert.equal(start.manifest.revisions[id],rollback.contentManifest.revisions[id]);assert.notEqual(start.manifest.renderHashes[id],rollback.contentManifest.renderHashes[id]);site.setRelease(rollback);
 await page.getByRole('button',{name:'认识',exact:true}).click();await page.waitForTimeout(100);assert.equal(await snapshot(page),null);await page.getByRole('button',{name:'显示释义',exact:true}).waitFor();
 }finally{await browser.close();await site.close()}
});

test('accepted withdrawal removes detail and expanded library content without navigation',async()=>{
 const release=loadReviewedRelease(),site=await startSite(release),browser=await chromium.launch({executablePath});
 try{const page=await browser.newPage();const id='WS20261031-001';const withdrawn=createContentBundle({vocabulary:release.vocabulary,analysis:release.analysis,catalog:release.catalog,previous:release.contentManifest,retiredIds:[id]});
 for(const route of ['#entry?card='+id,'#library?q=shift']){
  site.setRelease(release);await page.goto(site.url+route);await page.reload();if(route.startsWith('#library'))await page.locator('details').filter({has:page.locator(`[data-entry="${id}"]`)}).locator('summary').click();await page.locator(`[data-entry="${id}"] [data-group]`).first().waitFor();
  site.setRelease(withdrawn);const loaded=page.waitForResponse(r=>r.url().includes(withdrawn.manifest.assets.catalog.path));await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));await loaded;await page.waitForTimeout(100);
  assert.equal(await page.locator(`[data-entry="${id}"]`).count(),0);assert.equal(await page.locator(`[data-lexical-tools="${id}"]`).count(),0);
  if(route.startsWith('#entry'))await page.getByText(/此词卡已撤回或当前内容不可用/).waitFor();
 }
 }finally{await browser.close();await site.close()}
});

test('stalled manifest body times out and releases grading controls with the fixed loaded bundle',async()=>{
 const site=await startSite(),browser=await chromium.launch({executablePath});try{const page=await browser.newPage();await page.goto(site.url);await page.getByRole('button',{name:'开始学习',exact:true}).click();await page.getByRole('button',{name:'显示释义',exact:true}).click();site.setMode('stalled');await page.getByRole('button',{name:'认识',exact:true}).click();const reveal=page.getByRole('button',{name:'显示释义',exact:true});await reveal.waitFor({timeout:10000});assert.equal(await reveal.isEnabled(),true);assert.equal((await snapshot(page)).events.length,1);}finally{await browser.close();site.server.closeAllConnections();await site.close()}
});
