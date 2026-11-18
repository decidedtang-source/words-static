import test from 'node:test';
import assert from 'node:assert/strict';
import {empty,grade,queue,validate,merge,undo} from '../src/model.mjs';
import {learningProgress} from '../src/progress.mjs';
const words=Array.from({length:300},(_,i)=>({id:`w${i}`,date:i<150?'2026-10-28':'2026-10-29'}));
const at=Date.parse('2026-11-16T12:00:00+08:00');

test('unlimited and large targets include every eligible new word; zero retains due reviews',()=>{
  const s=empty();s.settings.target=null;
  assert.equal(queue(s,words,{now:at}).length,300);
  s.settings.target=250;assert.equal(queue(s,words,{now:at}).length,250);
  grade(s,{eventId:'g0',cardId:'w0',rating:1,at,version:0});
  s.settings.target=0;assert.deepEqual(queue(s,words,{now:at+60000}).map(w=>w.id),['w0']);
  s.settings.target=null;const all=queue(s,words,{now:at+60000});assert.equal(all.length,300);assert.equal(all[0].id,'w0');
  assert.equal(queue(s,words,{now:at+60000,batch:['2026-10-28','2026-10-29']}).length,300);
  assert.equal(queue(s,words,{now:at+60000,batch:['2026-10-29']}).length,150);
  assert.equal(queue(s,words,{now:at+60000,batch:[]}).length,300);
});

test('unlimited and large targets round-trip safely through backup and explicit preference merge',()=>{
  const s=empty();s.settings.target=null;
  assert.equal(validate(JSON.parse(JSON.stringify(s))).settings.target,null);
  assert.equal(merge(empty(),s,{preferences:'incoming'}).settings.target,null);
  assert.equal(merge(empty(),s,{preferences:'local'}).settings.target,20);
  s.settings.target=1000;assert.equal(validate(s).settings.target,1000);
  for(const target of [-1,1.5,'100',Infinity,Number.MAX_SAFE_INTEGER+1])assert.throws(()=>validate({...s,settings:{target}}));
});

test('progress distinguishes source dates and study dates, repeats, read marks and undo',()=>{
  const s=empty();s.settings.target=null;s.marks.w2=true;
  grade(s,{eventId:'a',cardId:'w0',rating:3,at,version:0});
  grade(s,{eventId:'b',cardId:'w150',rating:1,at:at+60000,version:0});
  grade(s,{eventId:'c',cardId:'w0',rating:2,at:at+86400000,version:1});
  grade(s,{eventId:'d',cardId:'w151',rating:3,at:at+86400000+1000,version:0});
  undo(s,'u',at+86400000+2000);
  const p=learningProgress(s,words,{now:at+86400000+3000,days:7});
  assert.equal(p.answers,3);assert.equal(p.newCount,2);assert.equal(p.reviewCount,1);assert.equal(p.words,2);
  assert.deepEqual(p.daily.map(r=>[r.date,r.newCount,r.reviewCount,r.words,r.answers]),[['2026-11-17',0,1,1,1],['2026-11-16',2,0,2,2]]);
  const batch=p.batches.find(b=>b.date==='2026-10-29');
  assert.equal(batch.total,150);assert.equal(batch.started,1);assert.equal(batch.remaining,149);assert.equal(batch.due,1);
  assert.equal(p.batches.find(b=>b.date==='2026-10-28').started,1,'read marks do not count as learning');
  const today=learningProgress(s,words,{now:at+86400000+3000,days:1,batch:'2026-10-28'});
  assert.equal(today.answers,1);assert.equal(today.newCount,0);assert.equal(today.reviewCount,1);
  const tomorrow=learningProgress(s,words,{now:at+2*86400000,days:1});assert.equal(tomorrow.answers,0);assert.equal(tomorrow.batches.find(b=>b.date==='2026-10-28').started,1);
});

test('activity uses Taipei midnight rather than UTC date and can show an entire long history',()=>{
  const s=empty(),before=Date.parse('2026-11-16T15:59:00Z');
  grade(s,{eventId:'before',cardId:'w0',rating:1,at:before,version:0});
  grade(s,{eventId:'after',cardId:'w0',rating:3,at:before+120000,version:1});
  const p=learningProgress(s,words,{now:before+180000,days:1});
  assert.equal(p.daily[0].date,'2026-11-17');assert.equal(p.newCount,0);assert.equal(p.reviewCount,1);
});
