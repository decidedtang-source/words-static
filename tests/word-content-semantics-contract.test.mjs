import test from 'node:test';import assert from 'node:assert/strict';
import {buildGenerationInput,validateDraft,resolveBridgePlan} from '../scripts/word-content/semantics.mjs';
test('source and practice versions bind input; depth does not choose bridge strategy',()=>{
 const c={location:'outside_selection',senseRefs:['s2']},anchors=['s1'],evidence=[{id:'s2',version:'1'}];
 assert.deepEqual(resolveBridgePlan(c,anchors,evidence),resolveBridgePlan({...c,depth:'deep'},anchors,evidence));
 assert.throws(()=>resolveBridgePlan({location:'unresolved'},anchors,evidence),/unresolved/);
 assert.throws(()=>buildGenerationInput({},[],{hash:'h'},[]),/snapshot/);
});
test('quote modification and weak technical evidence block draft',()=>{
 const input={snapshot:{example:'Original.',id:'e'},promptHash:'p'};
 const errors=validateDraft({context:{quote:'Changed.'}},input).errors;assert.ok(errors.some(e=>e.includes('original quote')));
});
