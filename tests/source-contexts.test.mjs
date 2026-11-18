import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {enrichVocabulary} from '../scripts/enrich-vocabulary.mjs';
import {contextSourceMarkup} from '../src/source-context.mjs';
const data=JSON.parse(readFileSync('public/vocabulary.json','utf8'));
test('every published card has purpose-specific context and explicit example provenance',()=>{
 assert.equal(data.words.length,1875);let reading=0,work=0;
 for(const w of data.words){assert.ok(w.context?.scene,w.id);assert.ok(w.explanation.trim(),w.id);
  if(w.context.kind==='reading'){reading++;assert.ok(w.context.focus,w.id);assert.match(w.context.source.url,/^https:\/\/paulkrugman\.substack\.com\/p\//);assert.ok(w.context.source.title);assert.ok(['public-text','public-preview','public-transcript'].includes(w.context.source.access));assert.equal(w.examples[0].origin,'reading-original');assert.notEqual(w.explanation,w.meaning)}
  else {work++;assert.equal(w.context.kind,'workplace');assert.equal(w.context.source,null);assert.equal(w.examples[0].origin,'workplace-original')}
  assert.equal(w.example,w.examples[0].en);assert.ok(w.examples.every(e=>e.origin&&e.en&&e.zh));
 }
 assert.equal(reading,375);assert.equal(work,1500);
});
test('reading senses and primary examples no longer inherit workplace defaults',()=>{
 const word=id=>data.words.find(w=>w.id===id);
 assert.match(word('V20261012-119').explanation,/劳动者/);assert.doesNotMatch(word('V20261012-119').examples[0].en,/purchasing/);
 assert.match(word('V20261027-117').examples[0].en,/candidate/);
 assert.match(word('V20261028-101').examples[0].en,/election/);
 assert.equal(word('V20261025-101').context.source.access,'public-preview');
 assert.match(word('V20261029-118').explanation,/数字准入/);
});
test('article qualifiers, dates and contextual collocations are not replaced by workplace assumptions',()=>{
 const word=id=>data.words.find(w=>w.id===id);
 assert.doesNotMatch(word('V20261027-116').meaning,/公开承认/);
 assert.match(word('V20261027-116').examples[0].en,/Internal messages/);
 assert.match(word('V20261027-122').examples[0].en,/rejects/);
 assert.match(word('V20261016-123').examples[0].en,/subtitle/);
 assert.equal(word('V20261016-123').context.source.date,'2026-10-15');
 for(const id of ['V20261012-107','V20261012-119','V20261015-112','V20261017-113','V20261028-101'])assert.doesNotMatch(word(id).chunk,/supplier|team|lot|batch|deadline/);
 assert.match(word('V20261018-120').context.focus,/养老金/);
 assert.match(word('V20261028-119').examples[0].en,/consume/);
 assert.match(word('V20261012-122').explanation,/此前/);
 assert.match(word('V20261014-123').examples[0].en,/reducing extreme wealth/);
 assert.equal(word('V20261017-120').editorialNote,undefined);
 assert.match(word('V20261023-102').examples[0].en,/pull the plug on/);
 assert.match(word('V20261023-111').examples[0].en,/be emboldened to/);
 assert.match(word('V20261024-121').explanation,/less/);
});
test('primary reading examples retain the source argument rather than its rejected alternative',()=>{
 const word=id=>data.words.find(w=>w.id===id);
 assert.match(word('V20261012-114').examples[0].en,/not plausible/);
 assert.match(word('V20261027-111').examples[0].en,/disputes/);
 assert.match(word('V20261027-124').context.focus,/俄乌/);
 assert.match(word('V20261022-115').examples[0].en,/Families have not yet/);
});
test('published context output matches its editable source and generic purposes are not called workplace',()=>{
 const entries=new Map();for(const batch of data.batches)for(const [id,e]of Object.entries(JSON.parse(readFileSync('content/'+batch.date+'.json','utf8'))))entries.set(id,e);
 const rebuilt=enrichVocabulary({...data,words:data.words.map(w=>({...w,example:entries.get(w.id).originalExample}))});
 assert.deepEqual(rebuilt,data);
 assert.match(contextSourceMarkup({context:{kind:'domain',scene:'biology',source:null}}),/指定学习/);
 assert.doesNotMatch(contextSourceMarkup({context:{kind:'domain',scene:'biology',source:null}}),/工作/);
});
