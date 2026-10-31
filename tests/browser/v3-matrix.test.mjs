import test from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';
import {startSite,executablePath,snapshot} from './site.mjs';
import {loadReviewedRelease} from '../../scripts/build-reviewed-batch.mjs';
import {createContentBundle} from '../../scripts/content-bundle.mjs';
const views=[['windows',1440,810],['mac',1440,900],['phone-portrait',390,844],['phone-landscape',844,390],['tablet-portrait',820,1180],['tablet-landscape',1180,820]];
test('V3 five reviewed cards across six viewports and three modes (90 cells)',async()=>{
 const release=loadReviewedRelease(),site=await startSite(),browser=await chromium.launch({executablePath});const evidence=[];mkdirSync('local-evidence/v3',{recursive:true});
 try{for(const [device,width,height] of views){for(const a of Object.values(release.analysis.entries)){
  const word=release.vocabulary.words.find(w=>w.id===a.cardId);site.setRelease(createContentBundle({vocabulary:{...release.vocabulary,words:[word]},analysis:release.analysis,catalog:release.catalog}));
  const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const check=async mode=>{assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),device+'/'+a.cardId+'/'+mode);evidence.push({device,width,height,cardId:a.cardId,mode,status:'PASS'})};
  await page.goto(site.url);await page.getByRole('button',{name:'开始学习',exact:true}).click();await page.getByRole('button',{name:'显示释义',exact:true}).waitFor();assert.equal(await page.locator('[data-focused-sense],[data-lexical-tools],.definition,[data-group]').count(),0);await check('front');
  await page.getByRole('button',{name:'显示释义',exact:true}).click();await page.locator('.focused-senses').waitFor();assert.equal(await page.locator('[data-focused-sense]').count(),a.presentation.contextSenseRefs.length);assert.equal(await page.locator('.definition').textContent(),a.presentation.displayGloss);
  const summary=page.locator('.more-dictionary > summary');await summary.focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.more-dictionary').evaluate(e=>e.open),true);await check('expanded');evidence.pop();await page.keyboard.press('Space');assert.equal(await page.locator('.more-dictionary').evaluate(e=>e.open),false);
  for(const name of ['不认识','模糊','认识']){const button=page.getByRole('button',{name,exact:true});await button.scrollIntoViewIfNeeded();assert.ok(await button.evaluate(e=>{const r=e.getBoundingClientRect();return r.y>=0&&r.bottom<=innerHeight&&e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))}),device+' grade visible')}
  await check('revealed');await page.goto(site.url+'#entry?card='+a.cardId);await page.locator('.definition').waitFor();assert.equal(await page.locator('[data-group]').count(),5);assert.equal(await page.locator('[data-lexical-tools]').count(),2);assert.equal(await page.locator('.more-dictionary[open]').count(),0);
  assert.ok(await page.evaluate(()=>{const root=document.querySelector('.entry-content');const nodes=['.meaning-block','.focused-senses','.entry-context','.more-dictionary','.analysis-grid'].map(s=>root.querySelector(s));return nodes.every((n,i)=>!i||Boolean(nodes[i-1].compareDocumentPosition(n)&Node.DOCUMENT_POSITION_FOLLOWING))}));await check('lookup');
  if(a.cardId==='V20261029-005'){await page.screenshot({path:'local-evidence/v3/'+device+'.png',fullPage:true});await page.setViewportSize({width:Math.max(320,Math.floor(width/2)),height:Math.floor(height/2)});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),device+' zoom');}
  assert.equal(await snapshot(page),null);assert.deepEqual(errors,[]);await context.close();
 }}assert.equal(evidence.length,90);writeFileSync('local-evidence/v3/matrix.json',JSON.stringify(evidence,null,2)+'\n');}finally{await browser.close();await site.close()}
});
