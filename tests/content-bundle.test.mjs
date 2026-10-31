import test from 'node:test';import assert from 'node:assert/strict';
import {createContentBundle} from '../scripts/content-bundle.mjs';
import {loadContentBundle,createBundleController,fetchContent} from '../src/content-bundle.mjs';
import {fixture} from './reviewed-fixture.mjs';
function sample(){const f=fixture();return {vocabulary:{...f.base,words:f.projection.cards},analysis:{schema:1,entries:{'NEW-001':f.projection.analysis[0]}},catalog:{schema:1,entries:f.projection.dictionaryEntries,source:{name:'Open English Wordnet 2025'}}}}
function fetcher(bundle){return async url=>{const path=new URL(url,'https://test/').pathname.split('/').at(-1);const bytes=path==='content-manifest.json'?Buffer.from(JSON.stringify(bundle.manifest)):bundle.files[path];return new Response(bytes||'missing',{status:bytes?200:404})}}
test('content bundle binds all assets, all old cards and revisions across source changes',async()=>{const input=sample(),a=createContentBundle(input);const loaded=await loadContentBundle('https://test/content-manifest.json',{fetcher:fetcher(a)});assert.equal(loaded.vocabulary.words[0].id,'NEW-001');assert.equal(loaded.revisions['NEW-001'],1);const b=createContentBundle({...input,previous:a.manifest});assert.equal(b.manifest.releaseId,a.manifest.releaseId);input.catalog.entries[0].senses[0].glossZh='当班时段';const c=createContentBundle({...input,previous:a.manifest});assert.equal(c.manifest.revisions['NEW-001'],2);assert.equal(c.analysis.entries['NEW-001'].contentRevision,2)});
test('bundle rejects altered asset, missing file and foreign-origin paths',async()=>{const b=createContentBundle(sample());const key=b.manifest.assets.analysis.path;b.files[key]=Buffer.from('{}');await assert.rejects(loadContentBundle('https://test/content-manifest.json',{fetcher:fetcher(b)}),/hash/i);delete b.files[key];await assert.rejects(loadContentBundle('https://test/content-manifest.json',{fetcher:fetcher(b)}),/404/);b.manifest.assets.analysis.path='https://other.example/analysis.json';await assert.rejects(loadContentBundle('https://test/content-manifest.json',{fetcher:fetcher(b)}),/path/i)});
test('failed refresh keeps prior complete bundle; late refresh cannot replace newer result',async()=>{const a=createContentBundle(sample()),first=await loadContentBundle('https://test/content-manifest.json',{fetcher:fetcher(a)});let complete;const slow=new Promise(r=>complete=r);let count=0;const control=createBundleController(first,()=>++count===1?slow:Promise.resolve({...first,releaseId:'new'}));const request=control.refresh();await control.refresh();complete({...first,releaseId:'late'});await request;assert.equal(control.current.releaseId,'new');const failed=createBundleController(first,async()=>{throw Error('offline')});await assert.rejects(failed.refresh(),/offline/);assert.equal(failed.current,first)});

test('late old response cannot clear a newer failed update barrier',async()=>{
 let finish,count=0;const gate=new Promise(r=>finish=r),initial={releaseId:'old'};
 const control=createBundleController(initial,async(previous,context)=>{if(++count===1){await gate;return previous}context.markPending();throw Error('missing asset')});
 const late=control.refresh();await assert.rejects(control.refresh(),/missing asset/);finish();await late;
 assert.equal(control.pending,true);assert.equal(control.current,initial);
});
test('fetch deadline includes response body even after immediate headers',async()=>{
 let signal;const fetcher=async(url,options)=>{signal=options.signal;return new Response(new ReadableStream({start(){}}))};
 const result=await Promise.race([fetchContent('https://test/',{},fetcher,20).then(()=> 'resolved',()=> 'timeout'),new Promise(r=>setTimeout(()=>r('hung'),100))]);
 assert.equal(result,'timeout');assert.equal(signal.aborted,true);
});
