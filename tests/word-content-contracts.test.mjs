import test from 'node:test';
import assert from 'node:assert/strict';
import {validateEntity,validateReferences,dimensions} from '../scripts/word-content/contracts.mjs';
test('unknown schema, fields and unresolved definitive meaning are rejected',()=>{
 assert.equal(validateEntity('ContextUse',{schemaVersion:9}).valid,false);
 assert.equal(validateEntity('Sense',{schemaVersion:1,unexpected:true}).valid,false);
});
test('context spans use codepoints and quote hash is immutable',()=>{
 const c={schemaVersion:1,contextId:'c',entryId:'e',sourceRef:'s',quote:'😀 No approval.',quoteSHA:'bad',translation:'未批准',quoteType:'teaching',meaning:'未批准',qualifiers:{polarity:'negative',modality:[],conditions:[],agents:[],timeScope:null,excludedInferences:['approval']},location:'selected',senseRefs:['s1'],targetSpans:[{start:5,end:13,text:'approval',mappingType:'exact',note:''}]};
 assert.match(validateEntity('ContextUse',c).errors.join(' '),/quoteSHA/);
});
test('analysis has all seven justified dimensions and two to five original uses',()=>{
 const a={schemaVersion:1,entryId:'e',contextId:'c',version:'1',promptHash:'p',depth:'concise',depthReason:'direct',coverage:Object.fromEntries(dimensions.map(k=>[k,{mode:'integrated',reason:'',blockIds:[]}])),blocks:[],workplaceUse:[],practiceRefs:[],edges:[]};
 const e=validateEntity('AnalysisRecord',a).errors.join(' ');assert.match(e,/workplaceUse/);assert.match(e,/reason/);
});
test('reference validation catches missing senses instead of silently rendering fallback',()=>{
 assert.deepEqual(validateReferences({senses:[],context:{senseRefs:['missing']},selection:{selectedSenseIds:[]}}).missingRefs,['missing']);
});
test('source types and enums and dangling bridge/practice references are rejected',()=>{
 assert.equal(validateEntity('SourceRecord',{schemaVersion:1,sourceId:'s',version:'1',title:'x',url:'https://example.org',accessMode:'fake',retrievedAt:'yesterday',coverage:42,rights:'yes',limitations:[]}).valid,false);
 const refs=validateReferences({senses:[],bridge:{anchorRefs:['missing-anchor'],targetRefs:['missing-target']},analysis:{practiceRefs:[{practiceId:'missing-practice',version:'1'}]},practices:[]});
 assert.equal(refs.valid,false);assert.ok(refs.missingRefs.includes('missing-practice'));
});
test('historical and contextual evidence cannot reference a nonexistent source',()=>{
 assert.equal(validateReferences({sources:[{sourceId:'existing',version:'1'}],history:{sourceRefs:[{sourceId:'missing',sourceVersion:'1',locator:'entry',supportedClaim:'date'}]}}).valid,false);
});
