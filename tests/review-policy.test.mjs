import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {empty,grade,undo,validate,merge,queue,reviewSettings,reviewOutcomes} from '../src/model.mjs';
const legacy=JSON.parse(readFileSync(new URL('./fixtures/review-legacy.json',import.meta.url)));
test('legacy replay is unchanged; future policy survives settings changes, retries, merge and undo',()=>{
 assert.deepEqual(validate(legacy),legacy);
 const s=structuredClone(legacy),before=structuredClone(s.cards.legacy.state),at=Date.UTC(2026,10,8);
 s.settings.review={retention:.95,order:'risk'};
 const p={eventId:'modern',cardId:'legacy',version:3,rating:3,at};grade(s,p);
 assert.deepEqual(s.events.at(-1).policy,{version:1,retention:.95});
 const high=structuredClone(s);s.settings.review.retention=.85;grade(s,p);
 assert.equal(s.events.length,4);assert.deepEqual(validate(s),s);
 const low=structuredClone(legacy);low.settings.review={retention:.85,order:'due'};grade(low,p);
 assert.ok(Date.parse(low.cards.legacy.state.due)>Date.parse(high.cards.legacy.state.due));
 assert.throws(()=>merge(s,high));assert.equal(merge(s,high,{preferences:'incoming'}).settings.review.retention,.95);
 undo(s,'undo-modern',at+1000);assert.deepEqual(s.cards.legacy.state,before);assert.deepEqual(validate(s),s);
 for(const value of [{retention:.1,order:'risk'},{retention:.9,order:'bad'}])assert.throws(()=>validate({...s,settings:{target:20,review:value}}));
 const broken=structuredClone(high);broken.events.at(-1).policy.version=99;assert.throws(()=>validate(broken));
});
test('risk order prioritizes fragile due reviews, preserves learning, due filter, scope and unlimited',()=>{
 const s=empty(),now=Date.UTC(2026,10,15),words=['strong','fragile','learning','future','new'].map(id=>({id,date:'2026-11-01'}));
 const card=(stability,due,state=2)=>({version:1,state:{...legacy.cards.legacy.state,stability,state,reps:3,last_review:new Date(now-5*86400000).toISOString(),due:new Date(due).toISOString()}});
 s.cards={strong:card(30,now-86400000),fragile:card(1,now-1000),learning:card(1,now-500,1),future:card(.1,now+1000)};
 s.settings.target=null;assert.deepEqual(reviewSettings(s),{retention:.9,order:'risk'});
 assert.deepEqual(queue(s,words,{now}).map(w=>w.id),['learning','fragile','strong','new']);
 s.settings.review={retention:.9,order:'due'};assert.deepEqual(queue(s,words,{now}).map(w=>w.id),['learning','strong','fragile','new']);
 assert.equal(queue(s,words,{now,batch:'other'}).length,0);s.settings.target=0;assert.equal(queue(s,words,{now}).length,3);
});
test('delayed recall feedback excludes first exposures, short practice and undone grades',()=>{
 const s=empty(),at=Date.UTC(2026,10,1);let version=0;
 for(const [i,hours,rating] of [[0,0,3],[1,1,3],[2,25,2],[3,50,1]])grade(s,{eventId:'r'+i,cardId:'word',version:version++,rating,at:at+hours*3600000});
 assert.deepEqual(reviewOutcomes(s,at+50*3600000),{reviews:2,recalled:1,rate:.5});
 undo(s,'undo-r3',at+50*3600000+1000);assert.deepEqual(reviewOutcomes(s,at+50*3600000),{reviews:1,recalled:1,rate:1});
 assert.equal(reviewOutcomes(empty(),at).rate,null);
});
test('equivalent review preferences merge regardless of JSON key order',()=>{
 const a=empty(),b=empty();a.settings.review={retention:.9,order:'risk'};b.settings.review={order:'risk',retention:.9};
 assert.deepEqual(merge(a,b).settings.review,a.settings.review);
});
test('data-safe rollback to original behavior preserves high-retention history and undo',()=>{
 const s=structuredClone(legacy),at=Date.UTC(2026,10,8);s.settings.review={retention:.95,order:'risk'};
 grade(s,{eventId:'high',cardId:'legacy',version:3,rating:3,at});const before=structuredClone(s.cards);
 s.settings.review={retention:.9,order:'due'};assert.deepEqual(validate(s).cards,before);
 grade(s,{eventId:'back-to-original',cardId:'legacy',version:4,rating:3,at:at+86400000});
 assert.deepEqual(s.events.at(-1).policy,{version:1,retention:.9});assert.deepEqual(validate(s),s);
 undo(s,'undo-rollback',at+86401000);assert.deepEqual(s.cards.legacy.state,before.legacy.state);assert.deepEqual(validate(s),s);
});
