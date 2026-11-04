import {chromium} from '@playwright/test';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const learnerMode=process.argv.includes('--learner');
const dir=resolve(process.argv[2]||'content/trials/dictionary-full-50-20261104'),base=resolve(learnerMode?'content/trials/dictionary-full-50-20261104':'content/trials/whole-card-50-20261103');
const read=n=>JSON.parse(readFileSync(resolve(dir,n),'utf8')),cards=read('dictionary.json').cards;
const learners=learnerMode?read('learner.json').cards:[];
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||undefined}),page=await browser.newPage(),old=await browser.newPage(),errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));old.on('pageerror',e=>errors.push(e.message));
const outside=()=>{const root=document.querySelector('#entry').cloneNode(true);root.querySelector('details').remove();return root.outerHTML};
try{
 await page.goto(pathToFileURL(resolve(dir,'preview.html')).href);await old.goto(pathToFileURL(resolve(base,'preview.html')).href);
 for(const [device,width,height] of [['windows',1440,810],['mac',1512,982],['phone-portrait',390,844],['phone-landscape',844,390],['tablet-portrait',820,1180],['tablet-landscape',1180,820]]){
  await page.setViewportSize({width,height});await old.setViewportSize({width,height});
  for(let i=0;i<cards.length;i++){
   const c=cards[i],senses=c.entries.flatMap(e=>e.senses);await page.evaluate(i=>choose(i),i);await old.evaluate(i=>choose(i),i);
   if(await page.evaluate(outside)!==await old.evaluate(outside))throw Error('Non-dictionary DOM differs '+c.term);
   const summary=page.locator('#entry>details>summary');if(await summary.textContent()!==(learnerMode?'词典义项 · 常用义与用法':`词典义项 · ${senses.length} 个义项`))throw Error('Title/count '+c.term);
   if(learnerMode){if(!await page.locator('#entry>details').evaluate(x=>x.open&&x.nextElementSibling.matches('section.bridge')))throw Error('Dictionary default open/order');await summary.click();if(await page.locator('#entry>details').evaluate(x=>x.open))throw Error('Collapse');}
   await summary.click();if(!await page.locator('#entry>details').evaluate(x=>x.open))throw Error('Expansion');
   const shown=await page.locator('[data-dictionary-sense]').evaluateAll(nodes=>nodes.map(n=>({id:n.dataset.dictionarySense,text:n.textContent,heading:n.querySelector('strong').textContent})));
   if(shown.length!==senses.length)throw Error('Sense count '+c.term);
   if(learnerMode){
    const learner=learners[i];if(learner.cardId!==c.cardId)throw Error('Learner identity');
    const rows=await page.locator('[data-learner-sense]').evaluateAll(ns=>ns.map(n=>({id:n.dataset.learnerSense,text:n.textContent})));
    if(rows.length!==learner.senses.length)throw Error('Common sense count '+c.term);
    for(let j=0;j<rows.length;j++){const s=learner.senses[j],row=rows[j];if(row.id!==s.id||[s.meaning,s.pos,s.usage,s.example.en,s.example.zh].some(v=>!row.text.includes(v)))throw Error('Learner text missing '+c.term+'/'+s.id)}
    const links=await page.locator('[data-learner-dictionary] a').evaluateAll(ns=>ns.map(n=>n.href));if(JSON.stringify(links)!==JSON.stringify(learner.sources))throw Error('Learner sources');
   }
   for(let j=0;j<senses.length;j++){
    const s=senses[j],n=shown[j],raw=[...s.definitions,...s.examples.map(x=>typeof x==='string'?x:x.text),...s.lexicalExamples,...s.usageFrames,...(s.labels||[]),...(s.sourceDomains||[]).flatMap(d=>d.labels),...(s.usageLabels||[]).map(d=>d.label)];
    if(n.id!==s.id||n.heading!==`${s.number}. ${s.glossZh}`||raw.some(t=>!n.text.includes(t)))throw Error('Source field missing '+c.term+'/'+s.id);
   }
   const articles=page.locator('[data-dictionary-entry]');if(await articles.count()!==c.entries.length)throw Error('POS count');
   for(let j=0;j<c.entries.length;j++){
    const e=c.entries[j],text=await articles.nth(j).textContent(),hrefs=await articles.nth(j).locator('a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href'))),expected=e.sourceId==='oewn-2025'?'https://en-word.net/lemma/'+encodeURIComponent(e.lemma):e.url;
    if(!hrefs.includes(expected)||[...(e.forms||[]),...(e.pronunciation||[]).map(p=>p.value),...(e.alternativeForms||[])].some(s=>!text.includes(s)))throw Error('Entry metadata missing '+c.term);
   }
   if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Expanded overflow '+device+'/'+c.term);
   await summary.click();await page.locator('#depth').click();await old.locator('#depth').click();if(await page.evaluate(outside)!==await old.evaluate(outside))throw Error('Etymology changed');await page.locator('#depth').click();await old.locator('#depth').click();
   for(const reject of [false,true]){
    await page.evaluate(reject=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{if(reject)throw Error('denied');window.__copied=text}}}),reject);
    const buttons=page.locator('[data-copy]');if(await buttons.count()!==4)throw Error('Copy button count');
    for(let j=0;j<4;j++){const b=buttons.nth(j),expected=(await b.getAttribute('data-copy')==='deep'?'【深析】':'')+c.term;await b.click();if(reject){if(await page.locator('.status textarea').inputValue()!==expected)throw Error('Copy fallback')}else if(await page.evaluate(()=>window.__copied)!==expected)throw Error('Copy text')}
   }
   checks.push({device,width,height,cardId:c.cardId,term:c.term,senses:senses.length,learnerMeanings:learnerMode?learners[i].senses.length:undefined,allSourceFields:true,unchangedOtherSections:true,copyAndEtymology:true,pass:true});
  }
 }
 mkdirSync(resolve(dir,'evidence'),{recursive:true});
 for(const [name,width,height] of [['desktop',1440,900],['phone',390,844]]){await page.setViewportSize({width,height});await page.evaluate(i=>choose(i),learnerMode?2:1);if(!learnerMode)await page.locator('#entry>details>summary').click();await page.locator('#entry>details').scrollIntoViewIfNeeded();await page.screenshot({path:resolve(dir,'evidence/'+name+'.png')});}
 await page.goto(pathToFileURL(resolve(dir,'scores.html')).href);if(await page.locator('tbody>tr').count()!==50||await page.locator('details').count()!==50)throw Error('Score count');
 const headings=await page.locator('thead').textContent();if(!headings.includes('词典义项')||headings.includes('更多义项'))throw Error('Score label');
 for(let i=0;i<50;i++){const d=page.locator('details').nth(i);if(await d.locator('section').count()!==13)throw Error('Score modules');}
 await page.goto(pathToFileURL(resolve(dir,'SOURCE-NOTICE.html')).href);if(!(await page.locator('body').textContent()).includes('CC BY-SA 4.0'))throw Error('License notice');
 if(errors.length)throw Error(errors.join('\n'));writeFileSync(resolve(dir,'evidence/browser.json'),JSON.stringify({checks,errors,scorePage:true,sourceNotice:true,engine:'Chromium',realDevice:false,productionActivated:false},null,2)+'\n');console.log({passed:checks.length,errors});
}finally{await browser.close()}
