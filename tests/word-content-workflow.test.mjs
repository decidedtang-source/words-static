import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {checkRunGate,fingerprintInput,hashArtifact,transition,resumeRun,writeRevision,sealCandidate} from '../scripts/word-content/workflow.mjs';
test('sync alone denied; current hold overrides authorization',()=>{
 assert.equal(checkRunGate({synced:true},{},false).allow,false);
 const f={freezeId:'f',planVersion:'p',authorization:{quote:'approve',scope:['trial-24-then-26']}};
 assert.equal(checkRunGate(f,{freezeId:'f',entryIds:['e']},true).allow,false);
 assert.equal(checkRunGate(f,{freezeId:'f',entryIds:['e']},false).allow,true);
});
test('canonical fingerprints preserve arrays and ignore only recorded timestamps',()=>{
 assert.equal(fingerprintInput({b:2,a:1}),fingerprintInput({a:1,b:2}));
 assert.notEqual(fingerprintInput({a:[1,2]}),fingerprintInput({a:[2,1]}));
});
test('review binds actual input and draft, requires independent full package scope',()=>{
 const item={state:'drafted',revisionAttempts:0,inputHash:'i',artifactHash:'a',author:'writer'};
 assert.throws(()=>transition(item,'reviewed',{reviewer:'writer',scope:'full_package',inputHash:'i',artifactHash:'a',verdict:'pass'}),/independent/);
 assert.throws(()=>transition(item,'reviewed',{reviewer:'reviewer',scope:'authoring',inputHash:'i',artifactHash:'a',verdict:'pass'}),/full_package/);
 assert.throws(()=>transition(item,'reviewed',{reviewer:'reviewer',scope:'full_package',inputHash:'i',artifactHash:'old',verdict:'pass'}),/hash/);
 assert.throws(()=>transition(item,'accepted',{}),/acceptance/);
});
test('blocked resume remains blocked; third revision rejected; accepted cannot mutate',()=>{
 assert.equal(resumeRun({itemStates:[{state:'blocked_evidence'}]}).itemStates[0].state,'blocked_evidence');
 assert.throws(()=>transition({state:'needs_revision',revisionAttempts:2},'drafted',{}),/limit/);
 assert.throws(()=>transition({state:'accepted'},'drafted',{}),/immutable/);
});
test('same input changed draft invalidates review; durable revisions never overwrite',()=>{
 const d=fs.mkdtempSync(path.join(os.tmpdir(),'words-r2-'));const p=path.join(d,'e','r0.json');
 writeRevision(p,{a:1});assert.throws(()=>writeRevision(p,{a:2}),/exists/);assert.equal(JSON.parse(fs.readFileSync(p)).a,1);
 assert.notEqual(hashArtifact({text:'one'}),hashArtifact({text:'two'}));
 const revised=transition({state:'reviewed',revisionAttempts:0,reviewRefs:['old'],artifactHash:'old'},'drafted',{artifactHash:'new',inputHash:'i'});
 assert.deepEqual(revised.reviewRefs,[]);assert.equal(revised.revisionAttempts,1);
});
test('candidate sealing rejects missing reviews and expansion before calibration',()=>{
 assert.throws(()=>sealCandidate({itemStates:[],phase:'calibration'}),/count/);
 assert.throws(()=>sealCandidate({itemStates:[{state:'drafted'}]}),/review/);
 assert.throws(()=>sealCandidate({itemStates:[{state:'reviewed',reviewRefs:['r']}],phase:'expansion',calibrationPassed:false}),/calibration/);
});
test('one arbitrary checkbox cannot authorize a complete package',()=>{
 const i={state:'drafted',author:'a',inputHash:'i',artifactHash:'a'};
 assert.throws(()=>transition(i,'reviewed',{reviewId:'r',reviewer:'b',scope:'full_package',inputHash:'i',artifactHash:'a',verdict:'pass',checks:[{qaId:'random',result:'pass'}]}),/QA coverage/);
});
