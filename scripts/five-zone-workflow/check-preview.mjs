import {chromium} from '@playwright/test';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {additionalEntries} from './core.mjs';
const dir=resolve(process.argv[2]||'content/trials/five-zone-calibration-20261103');
const entries=JSON.parse(readFileSync(resolve(dir,'entries.json'),'utf8'));
const supplements=JSON.parse(readFileSync(resolve(dir,'whole-card-supplement.json'),'utf8'));
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||undefined});
const page=await browser.newPage(),errors=[],checks=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(pathToFileURL(resolve(dir,'preview.html')).href);
 for(const [device,width,height] of [['windows',1440,810],['mac',1512,982],['phone-portrait',390,844],['phone-landscape',844,390],['tablet-portrait',820,1180],['tablet-landscape',1180,820]]){
  await page.setViewportSize({width,height});
  for(let i=0;i<entries.length;i++){
   await page.evaluate(i=>choose(i),i);
   const s=await page.evaluate(()=>{
    const a=document.querySelector('.bridge'),b=document.querySelector('.context'),c=document.querySelector('#entry>details'),s=document.querySelector('.senses');
    return {term:document.querySelector('h1').textContent,meta:document.querySelector('.meta').textContent,order:s.nextElementSibling===a&&a.nextElementSibling===b&&b.nextElementSibling===c,
     focused:[...s.querySelectorAll('.sense strong')].map(x=>x.textContent),dictionary:[...c.querySelectorAll('article strong')].map(x=>x.textContent),
     groups:[...document.querySelectorAll('.group>p')].map(x=>x.textContent),context:b.querySelector('.sentence').textContent,contextZh:b.querySelector('.zh').textContent,
     overflow:document.documentElement.scrollWidth>innerWidth,bridge:document.querySelector('#bridge-content>p').textContent};
   });
   const e=entries[i],supp=supplements.find(x=>x.cardId===e.cardId),expected=(e.focusedEntries||[{sense:e.dictionaryEntries[0].senses[0]}]).map(f=>f.sense.glossZh);
   if(s.term!==e.term||!s.meta.startsWith(supp.headword.pos)||!s.meta.includes(supp.headword.ipa)||!s.order||s.overflow||s.context!==e.context||s.contextZh!==e.contextZh||s.bridge!==e.bridgeText||JSON.stringify(s.focused)!==JSON.stringify(expected)||JSON.stringify(s.dictionary)!==JSON.stringify(additionalEntries(e).flatMap(x=>x.senses.map(s=>s.glossZh)))||JSON.stringify(s.groups)!==JSON.stringify(e.groups.map(g=>g.text)))throw Error(`${device}/${e.term}: content/layout mismatch`);
   if(!(await page.locator('.chunk').innerText()).includes(supp.headword.chunk))throw Error('chunk mismatch');
   const ex=await page.locator('.example').evaluateAll(nodes=>nodes.map(n=>({en:n.querySelector('p[lang=en]').textContent,zh:n.querySelector('.zh').textContent})));
   if(JSON.stringify(ex)!==JSON.stringify(supp.examples.filter(x=>x.en!==e.context).map(x=>({en:x.en,zh:x.zh}))))throw Error('example mismatch');
   await page.locator('#depth').click();
   const depth=await page.locator('.deeper').evaluate(n=>({text:[...n.querySelectorAll('p')].map(x=>x.textContent),links:[...n.querySelectorAll('a')].map(x=>x.href)}));
   if(JSON.stringify(depth.text)!==JSON.stringify(supp.etymology.map(x=>x.text))||JSON.stringify(depth.links)!==JSON.stringify(supp.etymology.map(x=>supp.sources.find(s=>s.id===x.sourceId).url)))throw Error('etymology mismatch');
   if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('etymology overflow');
   await page.locator('#depth').click();if(await page.locator('#depth').getAttribute('aria-pressed')!=='false')throw Error('return direct failed');
   await page.locator('#entry>details>summary').click();if(!await page.locator('#entry>details').evaluate(x=>x.open))throw Error('expand failed');
   await page.locator('#entry>details>summary').click();
   // Controlled clipboard success/rejection verifies the frozen prototype's exact behavior.
   for(const reject of [false,true]){
    await page.evaluate(reject=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{if(reject)throw Error('denied');window.__copied=text;}}}),reject);
    const buttons=page.locator('[data-copy]');if(await buttons.count()!==4)throw Error('copy button count');
    for(let j=0;j<4;j++){const button=buttons.nth(j),expected=(await button.getAttribute('data-copy')==='deep'?'【深析】':'')+e.term;await button.click();
     if(reject){if(await page.locator('.status textarea').inputValue()!==expected)throw Error('copy fallback mismatch')}
     else if(await page.evaluate(()=>window.__copied)!==expected)throw Error('copy payload mismatch');
    }
   }
   checks.push({device,width,height,term:e.term,pass:true,etymologyToggle:true,examples:true,copySuccessAndDenial:true});
  }
 }
 mkdirSync(resolve(dir,'evidence'),{recursive:true});
 await page.setViewportSize({width:1440,height:810});await page.evaluate(()=>choose(2));await page.screenshot({path:resolve(dir,'evidence/desktop.png'),fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:resolve(dir,'evidence/phone.png'),fullPage:true});
 await page.goto(pathToFileURL(resolve(dir,'scores.html')).href);if(await page.locator('body').innerText().then(s=>!entries.every(e=>s.includes(e.term))))throw Error('score page missing entries');
 if(errors.length)throw Error(errors.join('\n'));
 writeFileSync(resolve(dir,'evidence/browser.json'),JSON.stringify({checks,errors,scorePage:true,engine:'Chromium',realDevice:false,productionActivated:false},null,2)+'\n');
 console.log(JSON.stringify({passed:checks.length,scorePage:true,errors}));
}finally{await browser.close()}
