import test from 'node:test';import assert from 'node:assert/strict';
import {normalizeSource,mapSense,assessCoverage,checkEvidenceBindings} from '../scripts/word-content/source-adapters.mjs';
test('403 and indexed excerpt cannot supply full entry coverage',()=>{
 assert.throws(()=>normalizeSource({status:403},{}),/403/);
 const s=normalizeSource({id:'s',title:'Dictionary',url:'https://example.org',version:'1',claims:['sense-one']},{accessMode:'indexed_excerpt',rights:'short quotations only'});
 assert.equal(assessCoverage(s,['sense-one'],'complete').valid,false);
 assert.equal(assessCoverage(s,['unknown']).valid,false);
 assert.equal(assessCoverage(s,['sense-one']).valid,true);
});
test('upstream source edits invalidate a formerly bound sense before rendering',()=>{
 const b={senses:[{senseId:'s',definitionOrigin:'licensed_verbatim',meaning:{definitionEn:'old'},sourceRefs:[{sourceId:'oewn-2025'}]}]};
 assert.throws(()=>checkEvidenceBindings(b,{rows:[{entries:[{senses:[{sourceSenseId:'s',definitions:['new']}]}]}]},{records:[]}),/source changed/);
});
test('source locator required and components do not prove technical whole expression',()=>{
 assert.throws(()=>mapSense({id:'s'},null),/locator/);
 const s=normalizeSource({id:'s',title:'Component',url:'https://example.org',version:'1',claims:['component']},{accessMode:'page',rights:'paraphrase',claimScope:'component'});
 assert.equal(assessCoverage(s,['component'],'technical_whole').valid,false);
});
