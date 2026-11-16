import test from 'node:test';import assert from 'node:assert/strict';
import {loadPage,assemble} from '../word-page/manage.mjs';
import {toLegacyReadingProjection,toV10AnalysisProjection,assembleCandidate} from '../scripts/word-content/reading-adapter.mjs';
test('original three entries and all first eight views preserve baseline exactly',()=>{
 const p=loadPage(),before=assemble(p),after=assembleCandidate(p,[]);
 assert.deepEqual(after.words,before.words);assert.equal(after.template,before.template);
});
test('missing dependencies fail rather than fabricate generic meaning',()=>{
 assert.throws(()=>toLegacyReadingProjection({id:'e',term:'word'},{},{}),/missing/);
 assert.throws(()=>toV10AnalysisProjection({}),/Analysis/);
});
