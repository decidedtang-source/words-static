import test from 'node:test';import assert from 'node:assert/strict';
import {empty,grade,undo} from '../src/model.mjs';
import {studyFeedback,feedbackMarkup} from '../src/study-feedback.mjs';
const words=Array.from({length:8},(_,i)=>({id:'w'+i,date:i<3?'A':'B'})),now=Date.parse('2026-11-18T12:00:00+08:00');
test('feedback follows target and source scope without mutating learning or counting read marks',()=>{
 const s=empty();s.settings.target=2;s.marks.w0=true;
 assert.equal(studyFeedback(s,words,{now}).pendingNew,2);
 s.settings.target=6;assert.equal(studyFeedback(s,words,{now,batch:'A'}).pendingNew,3);
 assert.equal(studyFeedback(s,words,{now,batch:['A','B']}).pendingNew,6);
 s.settings.target=null;const before=JSON.stringify(s),p=studyFeedback(s,words,{now,batch:'B'});assert.equal(p.pendingNew,5);assert.equal(p.started,0);assert.equal(p.newPlan,5);assert.equal(JSON.stringify(s),before);
});
test('today progress uses unique words, global new allowance, undo, Taipei day and distinct reviews',()=>{
 const s=empty();s.settings.target=3;
 grade(s,{eventId:'old',cardId:'w0',rating:1,at:now-86400000,version:0});
 grade(s,{eventId:'a',cardId:'w3',rating:1,at:now-120000,version:0});
 grade(s,{eventId:'b',cardId:'w3',rating:3,at:now-1000,version:1});
 grade(s,{eventId:'c',cardId:'w0',rating:3,at:now,version:1});
 let p=studyFeedback(s,words,{now:now+1,batch:'A'});assert.equal(p.todayWords,1);assert.equal(p.todayNew,0);assert.equal(p.todayReview,1);assert.equal(p.pendingNew,2);assert.equal(p.globalNew,1);
 p=studyFeedback(s,words,{now:now+1});assert.equal(p.todayWords,2);assert.equal(p.todayNew,1);assert.equal(p.todayReview,1);assert.equal(p.newPlan,3);
 undo(s,'u',now+1000);p=studyFeedback(s,words,{now:now+1001});assert.equal(p.todayWords,1);assert.equal(p.pendingReview,1);
 const next=studyFeedback(s,words,{now:Date.parse('2026-11-19T00:00:01+08:00')});assert.equal(next.todayNew,0);assert.equal(next.todayWords,0);assert.equal(next.started,2);
 s.settings.target=0;p=studyFeedback(s,words,{now});assert.equal(p.pendingNew,0);assert.equal(p.pendingReview,1);
});

test('zero allocation without activity is not celebrated as completed learning',()=>{const s=empty();s.settings.target=0;const html=feedbackMarkup(studyFeedback(s,words,{now}));assert.doesNotMatch(html,/当前任务已完成/);assert.match(html,/当前没有待学任务/);});
