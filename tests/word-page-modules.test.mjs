import test from 'node:test';
import assert from 'node:assert/strict';
import {loadPage,validateModules,makeLock,checkLock,affectedModules,verifyGenerated} from '../word-page/manage.mjs';

test('module contracts assemble all existing word fields and preserve source ownership',()=>{
 const p=loadPage();const words=validateModules(p);
 assert.equal(p.registry.modules.length,9);assert.deepEqual(words.map(w=>w.word),['scope','leverage','absorb']);
 assert.equal(words[2].senses.length,3);assert.ok(words[0].bridgeHistory);
 const bad=structuredClone(p);bad.modules.learning.content.scope.word='other';
 assert.throws(()=>validateModules(bad),/unexpected field/);
 const badType=structuredClone(p);badType.modules.learning.content.scope.senses='wrong';
 assert.throws(()=>validateModules(badType),/senses/);
 const badSense=structuredClone(p);delete badSense.modules.learning.content.scope.senses[0].url;
 assert.throws(()=>validateModules(badSense),/url/);
});
test('committed generated page matches the locked module assembly',()=>{
 assert.ok(verifyGenerated().endsWith(loadPage().registry.release));
});
test('locks detect a module edit and identify downstream review without changing unrelated modules',()=>{
 const p=loadPage(),lock=makeLock(p);
 assert.deepEqual(checkLock(p,lock),[]);
 const changed=structuredClone(p);changed.modules.scenario.content.scope.quote+=' changed';
 const changes=checkLock(changed,lock);assert.ok(changes.includes('scenario:content'));
 const affected=affectedModules(p,'scenario');
 assert.ok(affected.includes('bridge')&&affected.includes('analysis')&&affected.includes('source-preview'));
 assert.ok(!affected.includes('headword'));
 const speech=structuredClone(p);speech.modules.headword.view+='\n';
 assert.deepEqual(checkLock(speech,lock),['headword:view']);
});
