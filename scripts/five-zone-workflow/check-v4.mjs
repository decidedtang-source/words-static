import {chromium} from '@playwright/test';import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import {fingerprint} from './core.mjs';
const dir=path.resolve('content/trials/dictionary-v4-50-20261109'),cards=JSON.parse(fs.readFileSync(path.join(dir,'cards.json'))),before=JSON.parse(fs.readFileSync(path.join(dir,'before.json')));
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||undefined}),page=await browser.newPage(),errors=[],checks=[];page.on('pageerror',e=>errors.push(e.message));
try{await page.goto(pathToFileURL(path.join(dir,'preview.html')).href);
 for(const [device,width,height] of [['desktop',1440,900],['large-desktop',1512,982],['phone',390,844],['small-phone',320,568],['phone-landscape',844,390],['tablet',820,1180]]){
 await page.setViewportSize({width,height});
 for(let i=0;i<cards.length;i++){const c=cards[i];await page.evaluate(i=>choose(i),i);
 assert.equal(await page.locator('h1').textContent(),c.term);assert.equal(await page.locator('.group').count(),5);assert.equal(await page.locator('.semantic-bridge p').textContent(),c.bridge.text);
 assert.ok(!(await page.locator('.meta').textContent()).includes('//'),'double IPA slashes');
 assert.equal(await page.locator('.current').count(),1);assert.equal(await page.locator('.current').locator('..').locator('..').getAttribute('data-learner-sense'),c.dictionary.contextSenseId);
 assert.equal(await page.locator('[data-source-inventory]').evaluate(n=>n.open),false);
 assert.equal(await page.locator('.dictionary + .semantic-bridge + .section-heading + .groups').count(),1);
 assert.equal(await page.locator('[data-learner-sense]').count(),c.dictionary.senses.length);
 const raw=before[i].p.dictionaryHtml?.split('<h3>来源词典原文</h3>')[1]||'';
 if(raw){const expected=await page.evaluate(raw=>{const x=document.createElement('div');x.innerHTML=raw;return x.textContent},raw);assert.equal(await page.locator('[data-source-inventory]').evaluate(n=>{const x=n.cloneNode(true);x.querySelector('summary').remove();return x.textContent}),expected);}
 for(const selector of ['[data-source-inventory]','#scenario','#exploration']){await page.locator(selector+'>summary').click();assert.equal(await page.locator(selector).evaluate(n=>n.open),true);}
 await page.locator('.sense-details').first().locator('summary').click();assert.equal(await page.locator('.sense-details').first().evaluate(n=>n.open),true);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,device+'/'+c.term+' overflow');
 for(const reject of [false,true]){await page.evaluate(reject=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{if(reject)throw Error('denied');window.__copied=text}}}),reject);
 for(const kind of ['raw','deep']){await page.locator('[data-copy='+kind+']').click();const actual=reject?await page.locator('.status textarea').inputValue():await page.evaluate(()=>window.__copied);if(kind==='raw')assert.equal(actual,c.term);else{assert.ok(actual.startsWith('【深析】'+c.term));assert.ok(actual.includes(c.context.text));}}}
 checks.push({device,term:c.term,cardId:c.cardId,dictionary:true,currentSense:true,sourceInventoryPreserved:true,bridge:true,fiveZones:true,copySuccessAndFallback:true,overflow:false});
 }
 }
 await page.locator('#search').fill('align');assert.equal(await page.locator('nav button').count(),1);assert.equal(await page.locator('h1').textContent(),'align');await page.locator('#search').fill('原住民');assert.ok(await page.locator('nav button').count()>0);await page.locator('#search').fill('zzzz-no-result');assert.equal(await page.locator('nav button').count(),0);assert.equal(await page.locator('select').isDisabled(),true);await page.locator('#search').fill('');assert.equal(await page.locator('nav button').count(),52);
 for(const [name,width,height] of [['desktop',1440,900],['phone',390,844]]){await page.setViewportSize({width,height});await page.evaluate(i=>choose(i),cards.findIndex(c=>c.term==='align'));await page.screenshot({path:path.join(dir,'evidence',name+'.png'),fullPage:true});}
 await page.goto(pathToFileURL(path.join(dir,'SOURCE-NOTICE.html')).href);const hrefs=await page.locator('a').evaluateAll(ns=>ns.map(n=>n.getAttribute('href')));for(const href of hrefs.filter(u=>!u.startsWith('https:')))assert.ok(fs.existsSync(path.join(dir,href)),'missing local source link '+href);
 assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>localStorage.length),0);
 fs.writeFileSync(path.join(dir,'evidence/browser.json'),JSON.stringify({checks,errors,search:true,engine:'Chromium',realDevice:false,clipboard:'mocked success and rejection',previewHash:fingerprint(fs.readFileSync(path.join(dir,'preview.html'),'utf8')),productionActivated:false},null,2));console.log({checks:checks.length,errors});
}finally{await browser.close()}
