import test from 'node:test';import assert from 'node:assert/strict';
import {buildReviewedBatch} from '../scripts/build-reviewed-batch.mjs';
import {fixture,hash,bytes} from './reviewed-fixture.mjs';
const args=f=>({baseVocabulary:f.base,baseVocabularyBytes:bytes(f.base),baseAnalysis:{schema:1,entries:{}},baseCatalog:{schema:1,source:{},entries:[]},manifest:f.baseManifest,approvedProjection:bytes(f.projection),receipt:f.receipt,sourceManifest:f.sourceManifest});
test('allowlisted batch adds only chosen cards and rerunning same base produces identical bytes',()=>{const f=fixture(),a=buildReviewedBatch(args(f)),b=buildReviewedBatch(args(f));assert.equal(a.vocabulary.words.length,1);assert.equal(a.vocabulary.words[0].id,'NEW-001');assert.equal(a.vocabulary.batches[0].count,1);assert.deepEqual(a,b);assert.equal(a.coverage.total,1)});
test('stale bases, stolen existing ID and invalid receipt fail without mutating inputs',()=>{for(const mutate of [a=>a.baseVocabulary.words.push({id:'NEW-001',term:'other'}),a=>a.receipt.candidateHash='f'.repeat(64),a=>a.baseAnalysis.entries.bad={},a=>a.manifest.operations=[]]){const a=args(fixture());mutate(a);const before=structuredClone(a.baseVocabulary);assert.throws(()=>buildReviewedBatch(a));assert.deepEqual(a.baseVocabulary,before)}});
test('same spelling can be separate selected identity; old card bytes and withdrawal history survive',()=>{const f=fixture();f.base.words=[{...f.projection.cards[0],id:'OLD-001'}];f.projection.baseContentHash=f.baseManifest.baseContentHash=hash(bytes(f.base));f.baseManifest.reviewedProjectionHash=f.receipt.candidateHash=hash(bytes(f.projection));const a=buildReviewedBatch(args(f));assert.deepEqual(a.vocabulary.words[0],f.base.words[0]);assert.equal(a.vocabulary.words.length,2);assert.equal(new Set(a.vocabulary.words.map(w=>w.id)).size,2)});
test('withdrawal retires identity without removing the old card or requiring a made-up analysis',()=>{const f=fixture(),old=f.projection.cards[0];f.base.words=[old];f.projection.cards=[];f.projection.analysis=[];f.receipt.stages={};f.baseManifest.operations=[{cardId:old.id,operation:'withdraw',selectionId:'withdraw-001',semanticChange:false}];f.baseManifest.baseContentHash=f.projection.baseContentHash=hash(bytes(f.base));f.baseManifest.reviewedProjectionHash=f.receipt.candidateHash=hash(bytes(f.projection));const r=buildReviewedBatch(args(f));assert.deepEqual(r.vocabulary.words,[old]);assert.deepEqual(r.contentManifest.retiredIds,['NEW-001']);assert.deepEqual(r.analysis.entries,{})});

// Exercise the actual command in an isolated repo-shaped fixture, including repeat runs.
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join,resolve} from 'node:path';import {spawnSync} from 'node:child_process';
import {loadReviewedRelease} from '../scripts/build-reviewed-batch.mjs';
test('second-batch CLI replays explicit predecessors for add revise and withdraw',()=>{
 for(const operation of ['add','revise','withdraw']){
  const root=mkdtempSync(join(tmpdir(),'words-batch-'));try{
   const write=(path,value)=>writeFileSync(join(root,path),bytes(value));for(const dir of ['public','dictionary','content/manifests','content/reviewed','content/reviews','content/sources'])mkdirSync(join(root,dir),{recursive:true});
   const first=fixture(),a=buildReviewedBatch(args(first));write('public/vocabulary.json',first.base);write('public/analysis.json',{schema:1,entries:{}});write('dictionary/catalog.json',{schema:1,source:{},entries:[]});
   const second=fixture();second.projection.batchId=second.baseManifest.batchId='second';second.baseManifest.baseContentHash=second.projection.baseContentHash=hash(bytes(a.vocabulary));second.baseManifest.baseAnalysisHash=hash(bytes(a.analysis));second.baseManifest.baseCatalogHash=hash(bytes(a.catalog));
   second.baseManifest.operations[0].operation=operation;
   if(operation==='add'){second.projection.cards[0].id=second.projection.analysis[0].cardId=second.baseManifest.operations[0].cardId='NEW-002';second.receipt.stages['NEW-002']=second.receipt.stages['NEW-001'];delete second.receipt.stages['NEW-001'];}
   if(operation==='revise'){second.projection.cards[0].gloss='轮班';second.projection.analysis[0].memoryGloss='轮班';}
   if(operation==='withdraw'){second.projection.cards=[];second.projection.analysis=[];second.receipt.stages={};}
   second.baseManifest.reviewedProjectionHash=second.receipt.candidateHash=hash(bytes(second.projection));
   for(const [name,f]of [['first',first],['second',second]]){f.baseManifest.projectionPath=`content/reviewed/${name}.json`;f.baseManifest.receiptPath=`content/reviews/${name}.json`;f.baseManifest.sourcePath=`content/sources/${name}.json`;write(`content/manifests/${name}.json`,f.baseManifest);write(f.baseManifest.projectionPath,f.projection);write(f.baseManifest.receiptPath,f.receipt);write(f.baseManifest.sourcePath,f.sourceManifest);}
   write('content/active-batches.json',{manifests:['content/manifests/first.json','content/manifests/second.json']});const expected=loadReviewedRelease(root);
   for(let i=0;i<2;i++){const run=spawnSync(process.execPath,[resolve('scripts/build-reviewed-batch.mjs'),'--manifest','content/manifests/second.json','--out','staging'],{cwd:root,encoding:'utf8'});assert.equal(run.status,0,run.stderr);assert.deepEqual(JSON.parse(readFileSync(join(root,'staging/content-manifest.json'),'utf8')),expected.contentManifest);}
  }finally{rmSync(root,{recursive:true,force:true})}
 }
});
