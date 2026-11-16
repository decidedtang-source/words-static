import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {loadBundles,produceAll,mergeModules,sha,root} from '../scripts/modules/system.mjs';
import {parseSnapshot,fetchHistory} from '../scripts/modules/history-source.mjs';
import {toLegacyReadingProjection} from '../scripts/word-content/reading-adapter.mjs';
import {produce as produceHistory} from '../word-page/modules/history/produce.mjs';
import {phraseHistory,validateReceipts} from '../scripts/modules/prepare-inputs.mjs';
import {read} from '../scripts/modules/system.mjs';
const bundles=()=>loadBundles(root+'/content/enrichment/v10/runs/r2-50-20261116').slice(0,2);
test('independent records retain dictionary, original quote and pending analysis without old prose',async()=>{
 const b=bundles(),outputs=await produceAll(b,{}),w=mergeModules(outputs);
 const old=toLegacyReadingProjection(b[1].snapshot,b[1].context,b[1],{structureOnly:true});
 assert.deepEqual(w[1].inventorySenses,old.inventorySenses);
 assert.equal(w[1].quote,b[1].snapshot.quote);
 assert.equal(w[1].analysisStatus,'pending_build');assert.equal(w[1].analysisBlocks,undefined);
 assert.equal(outputs.analysis.records[0].status,'pending_build');
 assert.deepEqual(await produceAll(b,{}),outputs);
});
test('assembly rejects tampered output, missing module, stale dependency and wrong identity',async()=>{
 const o=await produceAll(bundles(),{});
 const x=structuredClone(o);x.history.records[0].data.history='tampered';assert.throws(()=>mergeModules(x),/hash/);
 const y=structuredClone(o);delete y.history;assert.throws(()=>mergeModules(y),/module/);
 const z=structuredClone(o);z.bridge.dependencies.history='old';assert.throws(()=>mergeModules(z),/dependency/);
 const a=structuredClone(o);a.history.records[0].entryId='wrong';a.history.outputHash=sha(a.history.records);assert.throws(()=>mergeModules(a),/identity/);
});
test('module input hashing does not include excluded analysis or unrelated history',async()=>{
 const b=bundles(),o=await produceAll(b,{});b[0].analysis.blocks[0].text='CHANGED';b[0].history.summary='OLD';
 const p=await produceAll(b,{});assert.deepEqual(p,o);
});
test('parser excludes related entries and fails on wrong identity or absent text',()=>{
 const raw='https://www.etymonline.com/word/capacity\nL8: # Origin and history of capacity\nL11: ## capacity(n.)\nL13: early 15c., ability to hold.\nL17: ## Entries linking to capacity\nL21: ## capacitance(n.)\nL23: unrelated';
 const p=parseSnapshot(raw,'capacity');assert.equal(p.text,'early 15c., ability to hold.');assert.equal(p.coverage,'entry_section');
 assert.throws(()=>parseSnapshot(raw,'objective'),/identity/);
 assert.throws(()=>parseSnapshot('Internal Error','capacity'),/identity|missing/);
});
test('source request records HTTP failure without pretending no entry',async()=>{
 const r=await fetchHistory('capacity',async()=>new Response('Forbidden',{status:403}));
 assert.equal(r.status,'fetch_failed');assert.match(r.error,/403/);
});
test('phrase history shares words while keeping fixed expression slots independent',()=>{
 assert.deepEqual(phraseHistory['verification method'].components,['verification','method']);
 assert.deepEqual(phraseHistory['validation method'].components,['validation','method']);
 assert.deepEqual(phraseHistory['trade-off'].whole,['trade-off']);
 assert.equal(phraseHistory['not necessarily'].kind,'fixed_expression');
});
test('history cannot accept a card whose declared unit reference differs',()=>{
 assert.throws(()=>produceHistory({snapshot:{}},{refs:[{unitId:'a',version:'1'}],cards:[{unitId:'b',version:'1',summary:'text',receipt:{status:'ready',url:'https://www.etymonline.com/word/b',textSHA:'abc'}}]}),/reference/);
});
test('learning requires actual sense and bilingual example text',async()=>{
 const b=bundles();b[0].selection.senses=[];await assert.rejects(()=>produceAll(b,{}),/learning/i);
 const c=bundles();c[0].selection.senses[0].examples[0].zh='';await assert.rejects(()=>produceAll(c,{}),/learning/i);
});
test('every shared-source receipt is checked, not just the first file',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'words-history-test-'));
 const cache=dir+'/local-evidence/front-sources';fs.mkdirSync(cache,{recursive:true});
 const raw='https://www.etymonline.com/word/capacity\n# Origin and history of capacity\n## capacity(n.)\nearly 15c.\n## Entries linking to capacity';
 const receipt={status:'ready',lemma:'capacity',artifactPath:'local-evidence/front-sources/web.txt',rawSHA:sha(raw),textSHA:sha('early 15c.'),url:'https://www.etymonline.com/word/capacity',fetchedAt:'2026-11-16T00:00:00Z'};
 fs.writeFileSync(cache+'/web.txt',raw);
 try{const card={unitId:'etym:capacity',lemma:'capacity',receipt};const edits={a:{history:{cards:[card,structuredClone(card)]}}};validateReceipts(edits,dir);for(const field of ['rawSHA','textSHA','url']){const copy=structuredClone(edits);copy.a.history.cards[1].receipt[field]='bad';assert.throws(()=>validateReceipts(copy,dir),/hash|identity/);}}
 finally{fs.unlinkSync(cache+'/web.txt');fs.rmdirSync(cache);fs.rmdirSync(dir+'/local-evidence');fs.rmdirSync(dir);}
});
test('assembly rejects stale producer and contract hashes',async()=>{
 const o=await produceAll(bundles(),{});
 for(const field of ['producerHash','contractHash']){const x=structuredClone(o);x.history[field]='stale';assert.throws(()=>mergeModules(x),/fingerprint/);}
});
test('a history-only run does not require or rebuild learning and analysis',async()=>{
 const b=bundles();b[0].selection=null;b[0].analysis=null;
 const o=await produceAll(b,{}, {target:'history'});assert.deepEqual(Object.keys(o),['history']);
});
