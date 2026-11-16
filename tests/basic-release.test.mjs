import test from 'node:test';
import assert from 'node:assert/strict';
import {makeBasic,verifyWords} from '../scripts/basic/render.mjs';
import {read} from '../scripts/modules/system.mjs';
import fs from 'node:fs';
const html=fs.readFileSync('content/module-runs/front-auto-50-20261116/index.html','utf8');
const old=JSON.parse(html.match(/id="wl-data">([\s\S]*?)<\/script>/)[1]);
test('basic template preserves source/example fields and removes retired rendered modules',()=>{
 const result=makeBasic(old.slice(0,2));
 assert.ok(!result.includes('<summary>查看必要上下文</summary>'));
 for(const id of ['wl-bridge','wl-dictionary','wl-deep'])assert.ok(!result.includes('id="'+id+'"'));
 for(const word of old.slice(0,2))assert.ok(result.includes(word.quote));
 const data=JSON.parse(result.match(/id="wl-data">([\s\S]*?)<\/script>/)[1]);
 assert.ok(!('bridge' in data[0]));assert.equal(data[0].senses.length,old[0].senses.length);
});
test('basic QA requires exact roster, original quote and bilingual learning material',()=>{
 const words=old.slice(0,2),source=words.map(w=>({id:w.entryId,example:w.quote}));
 assert.equal(verifyWords(words,source,2).pass,true);
 const wrong=structuredClone(words);wrong[0].quote='changed';assert.equal(verifyWords(wrong,source,2).pass,false);
 assert.equal(verifyWords([words[0],words[0]],source,2).pass,false);
 const missing=structuredClone(words);missing[0].senses[0].zh='';assert.equal(verifyWords(missing,source,2).pass,false);
});
