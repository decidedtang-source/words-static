import test from 'node:test';
import assert from 'node:assert/strict';
import {matchesLemma,selectPronunciation,fetchCached,bindAI} from '../scripts/modules/automation/core.mjs';
import {parseCambridge,parseArticle,parseEtymonlineHTML} from '../scripts/modules/automation/html.mjs';
import {chromium} from '@playwright/test';
import {root,read,sha,loadBundles} from '../scripts/modules/system.mjs';
import {makeTasks,importReplies} from '../scripts/modules/automation/tasks.mjs';
import {produceModules} from '../scripts/modules/automation/assemble.mjs';
import {produce as dictionary} from '../word-page/modules/dictionary/produce.mjs';
import * as collection from '../scripts/modules/automation/collect.mjs';
import * as tasksModule from '../scripts/modules/automation/tasks.mjs';
test('source examples match target lemma rather than another synset member',()=>{
 assert.equal(matchesLemma('the sole object of her trip','objective'),false);
 assert.equal(matchesLemma('an objective appraisal','objective'),true);
 assert.equal(matchesLemma('He allocated more time.','allocate'),true);
 assert.equal(matchesLemma('This account is closed.','account for'),false);
});
test('pronunciation preserves variant and POS instead of picking unrelated entry',()=>{
 const p=selectPronunciation([{lemma:'delegate',pos:'noun',pronunciations:[{ipa:'N',variety:'US'}]},{lemma:'delegate',pos:'verb',pronunciations:[{ipa:'V',variety:'US'}]}],'delegate','v.');
 assert.equal(p.ipa,'V');assert.equal(p.variety,'US');
});
test('403 retains verified cache without falsifying retrieval time',async()=>{
 const old={url:'https://example.org/word',body:'saved',rawSHA:'bad',retrievedAt:'old'};
 await assert.rejects(()=>fetchCached(old.url,old,true,async()=>new Response('blocked',{status:403})),/cache hash/);
 const {sha}=await import('../scripts/modules/system.mjs');old.rawSHA=sha(old.body);
 const r=await fetchCached(old.url,old,true,async()=>new Response('blocked',{status:403}));
 assert.equal(r.source.retrievedAt,'old');assert.equal(r.attempt.status,403);assert.equal(r.cacheUsed,true);
});
test('AI import binds candidate ids, immutable source English and task hash',()=>{
 const task={entryId:'one',inputHash:'current',senses:[{senseId:'s',candidates:[{id:'c',en:'Source English.',sourceId:'s1'}]}]};
 const reply={entryId:'one',inputHash:'current',selections:[{senseId:'s',candidateId:'c',zh:'来源译文'}]};
 assert.equal(bindAI(task,reply).examples[0].en,'Source English.');
 assert.throws(()=>bindAI(task,{...reply,inputHash:'old'}),/identity/);
 assert.throws(()=>bindAI(task,{...reply,selections:[{senseId:'s',candidateId:'other',zh:'译文'}]}),/candidate/);
 assert.throws(()=>bindAI(task,{...reply,selections:[{...reply.selections[0],en:'AI changed text'}]}),/English/);
});
test('HTML extraction separates example text, pronunciation variants and article quote identity',async()=>{
 const browser=await chromium.launch({executablePath:process.env.LOCALAPPDATA+'/ms-playwright/chromium-1234/chrome-win64/chrome.exe'});
 try{const page=await browser.newPage();const html='<script>window.unwanted=true</script><div class="entry-body__el"><span class="headword"><span class="hw">capacity</span></span><span class="pos">noun</span><span class="us dpron-i"><span class="ipa">IPA</span><audio><source src="/media/english/test.mp3"></audio></span><div class="def-block"><div class="def">an amount</div><div class="examp">at capacity <span class="eg">The tank has capacity.</span></div></div></div>';
 const c=await parseCambridge(page,html,'https://dictionary.cambridge.org/dictionary/english/capacity');assert.equal(c.entries[0].senses[0].examples[0].en,'The tank has capacity.');assert.equal(c.entries[0].pronunciations[0].variety,'US');assert.equal(await page.evaluate(()=>window.unwanted),undefined);
 const ph=await parseCambridge(page,'<div class="entry-body__el"><h2 class="headword">account for <span class="obj">something</span></h2><span class="pos">phrasal verb</span><div class="def-block"><p class="def">to explain</p><span class="examp">How do you account for this?</span></div></div>','https://dictionary.cambridge.org/dictionary/english/account-for');assert.equal(ph.entries[0].lemma,'account for');assert.equal(ph.entries[0].senses[0].examples[0].en,'How do you account for this?');
 const a=await parseArticle(page,'<article><p>One actual sentence.</p></article>','https://example.org','Different sentence');assert.equal(a.quoteFound,false);
 const h=await parseEtymonlineHTML(page,'<h2>capacity(n.)</h2><p>Own history.</p><h2>Entries linking to capacity</h2><p>Other entry.</p>','capacity');assert.equal(h.text,'Own history.');
 }finally{await browser.close();}
});
test('AI task revalidation detects modified candidates even when reply repeats the old hash',()=>{
 const bundles=loadBundles(root+'/content/enrichment/v10/runs/r2-50-20261116').slice(0,1);
 const edits=read(root+'/content/module-inputs/front-50-20261116/edits.json'),old=edits[bundles[0].snapshot.entryId];
 const c={oewn:{rows:[],manifest:{}},cambridge:{},history:Object.fromEntries(old.history.cards.map(card=>[card.lemma,{summary:card.summary,receipt:card.receipt,sourceText:'synthetic history fixture'}])),scenarios:{},audio:{}};
 const tasks=makeTasks(bundles,c),replies=tasks.map(t=>({entryId:t.entryId,inputHash:t.inputHash,selections:t.senses.map(s=>({senseId:s.senseId,candidateId:s.candidates.at(-1).id,zh:s.candidates.at(-1).zh}))}));
 assert.equal(Object.keys(importReplies(bundles,c,tasks,replies).entries).length,1);
 tasks[0].senses[0].candidates[0].en='Modified English';
 assert.throws(()=>importReplies(bundles,c,tasks,replies),/Stale or modified/);
});
test('V2 assembly preserves dictionary and rejects missing entry inputs',async()=>{
 const bundles=loadBundles(root+'/content/enrichment/v10/runs/r2-50-20261116').slice(0,2),input=read(root+'/content/module-inputs/front-auto-50-20261116/inputs.json');
 input.entries=Object.fromEntries(bundles.map(b=>[b.snapshot.entryId,input.entries[b.snapshot.entryId]]));
 const result=await produceModules(bundles,input);
 for(let i=0;i<bundles.length;i++)assert.equal(sha(result.outputs.dictionary.records[i].data),sha(dictionary(bundles[i]).data));
 assert.equal(result.words[1].senses[1].example,input.entries[bundles[1].snapshot.entryId].examples[1].en);
 assert.equal(result.words[0].analysisStatus,'pending_build');
 const changed=structuredClone(bundles);changed[0].snapshot.quote='A different context.';changed[0].context.quote=changed[0].snapshot.quote;changed[0].context.quoteSHA=sha(changed[0].context.quote);
 await assert.rejects(()=>produceModules(changed,input),/Bundle identity/);
 delete input.entries[bundles[0].snapshot.entryId];await assert.rejects(()=>produceModules(bundles,input),/entry set mismatch/);
});
test('GB-only dictionary entries keep their matching recording eligible for collection',()=>{
 assert.deepEqual(collection.audioURLs({entry:{entries:[{pronunciations:[{ipa:'x',variety:'GB',audioURL:'https://dictionary.cambridge.org/media/english/test.mp3'}]}]}}),['https://dictionary.cambridge.org/media/english/test.mp3']);
});
test('identical example text retains the preferred licensed source',()=>{
 const result=tasksModule.preferredCandidates([{en:'same',origin:'licensed_source',provider:'WordNet'},{en:'same',origin:'source_short_quote',provider:'Cambridge',score:3}]);
 assert.equal(result.length,1);assert.equal(result[0].provider,'WordNet');
});
test('HTTP 200 landing page cannot replace a validated cached entry',async()=>{
 const old={url:'https://example.org/word',body:'valid entry',rawSHA:sha('valid entry'),retrievedAt:'old'};
 const r=await fetchCached(old.url,old,true,async()=>new Response('landing page',{status:200}),body=>body.includes('valid entry'));
 assert.equal(r.source.body,'valid entry');assert.equal(r.source.retrievedAt,'old');assert.equal(r.attempt.validation,'rejected');
 const replay=await fetchCached(old.url,r.source,false,()=>{throw Error('Should use cache');});assert.equal(replay.source.body,'valid entry');
});
