import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {setCatalog,lookup,cardLexical,validateCatalog,bookmarkKey,validateBookmarks} from '../src/lexical.mjs';
import {copyOriginal,buildDeepAnalysisCopy} from '../src/copy.mjs';
setCatalog(JSON.parse(readFileSync('dictionary/catalog.json','utf8')));
const vocabulary=JSON.parse(readFileSync('public/vocabulary.json','utf8'));
test('dictionary evidence separates Chinese senses, phrase context and old card identities',()=>{
 assert.equal(validateCatalog(),true);assert.ok(lookup('working').length);const w=lookup('working')[0];assert.ok(w.senses.some(s=>s.glossZh.includes('暂定')));assert.ok(w.senses.some(s=>s.glossZh.includes('运转')));
 assert.equal(cardLexical({term:'working definition'}).foundation[0].senseId,'working%5:00:02:operative:00');assert.equal(cardLexical({term:'working hypothesis'}).foundation[0].senseId,'working%5:00:00:impermanent:00');
 const card=vocabulary.words.find(w=>w.term==='working definition'),detail=cardLexical(card);assert.match(detail.bridge,/不等于/);assert.equal(detail.components[0],'working');assert.equal(card.id,'V20261029-005');assert.equal(lookup('not-a-real-dictionary-word').length,0);
 assert.ok(lookup('frame').some(e=>e.pos==='n'));assert.ok(lookup('frame').some(e=>e.pos==='v'));assert.equal(lookup('lead').filter(e=>e.pos==='n').length,2);
 assert.equal(cardLexical({id:'x',term:'working capital'}),null);assert.match(cardLexical(vocabulary.words.find(w=>w.term==='outcome framing')).bridge,/名词/);
});
test('copy keeps exact target and separates generated context from quotations',()=>{
 assert.equal(copyOriginal('  framing\n'), '  framing\n');assert.equal(buildDeepAnalysisCopy({displayText:'working definition',context:{text:'Example.',kind:'generated_example'},shareClass:'public'}).text,'【深析】working definition\n学习例句：Example.');
 assert.equal(buildDeepAnalysisCopy({displayText:'x',context:{text:'secret'},shareClass:'unknown'}).text,'【深析】x');assert.throws(()=>copyOriginal(' '.repeat(4)));assert.throws(()=>copyOriginal('x'.repeat(4001)));
});
test('bookmark namespaces cannot merge dictionary entries with source cards; invalid backups fail',()=>{
 assert.notEqual(bookmarkKey({kind:'card',id:'working'}),bookmarkKey({kind:'lexeme',id:'working'}));
 assert.throws(()=>validateBookmarks({schema:1,items:[{kind:'card',id:'x',label:'x',query:'x',unexpected:true}]}));
 assert.throws(()=>validateBookmarks({schema:1,items:[{kind:'card',id:'x',label:'x',query:'x'},{kind:'card',id:'x',label:'x',query:'x'}]}));
});
