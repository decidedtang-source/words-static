import {fsrs,generatorParameters,createEmptyCard} from 'ts-fsrs';
const engine=fsrs(generatorParameters({request_retention:.9,maximum_interval:36500,enable_fuzz:false,learning_steps:['1m','10m'],relearning_steps:['1m','10m']}));
const clone=x=>JSON.parse(JSON.stringify(x));
const check=(ok,message='记录格式无效')=>{if(!ok)throw Error(message)};
const validId=s=>typeof s==='string'&&/^[A-Za-z0-9:_-]{1,100}$/.test(s)&&!['__proto__','constructor','prototype'].includes(s);
export const day=at=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(at));
export const empty=()=>({schema:1,cards:{},events:[],marks:{},settings:{target:20}});
export const cardState=(s,id)=>s.cards[id]||{version:0,state:clone(createEmptyCard(new Date(0)))};
function index(s){return {byId:new Map(s.events.map(e=>[e.eventId,e])),undone:new Set(s.events.filter(e=>e.type==='undo').map(e=>e.target)),before:new Map()}}
function replay(events){const state=empty(),context=index(state);for(const event of events)apply(state,event,context);return {state,context}}
function apply(s,event,context=index(s)){
 check(event&&validId(event.eventId)&&validId(event.cardId)&&Number.isSafeInteger(event.at)&&event.at>=0&&event.at<=Date.now()+86400000&&Number.isInteger(event.version)&&event.version>=0);
 const existing=context.byId.get(event.eventId);if(existing){check(JSON.stringify(existing)===JSON.stringify(event),'同一记录编号内容冲突');return}
 const current=cardState(s,event.cardId);check(current.version===event.version,'另一标签页或另一份记录已更新这个词，请重新载入');let next;
 if(event.type==='grade'){
  context.before.set(event.eventId,clone(current.state));
  check([1,2,3].includes(event.rating));const state={...current.state,due:new Date(current.state.due)};if(state.last_review)state.last_review=new Date(state.last_review);next=clone(engine.next(state,new Date(event.at),event.rating).card);
 }else if(event.type==='undo'){
  check(validId(event.target));const target=context.byId.get(event.target);check(target?.type==='grade'&&target.cardId===event.cardId&&target.version+1===current.version&&event.at>=target.at&&event.at-target.at<=60000,'无法撤销此记录');
  check(!context.undone.has(event.target),'已经撤销');next=clone(context.before.get(target.eventId));context.undone.add(event.target);
 }else throw Error('未知记录类型');
 s.cards[event.cardId]={version:current.version+1,state:next};s.events.push(clone(event));context.byId.set(event.eventId,event);
}
export function grade(s,p){apply(s,{type:'grade',eventId:p.eventId,cardId:p.cardId,rating:p.rating,at:p.at,version:p.version});return s}
export function undo(s,eventId,at=Date.now(),expected=null){const undone=new Set(s.events.filter(e=>e.type==='undo').map(e=>e.target));const target=s.events.findLast(e=>e.type==='grade'&&!undone.has(e.eventId));check(target,'没有可撤销的评分');if(expected)check(target.eventId===expected.target&&cardState(s,target.cardId).version===expected.version,'记录已更新，请刷新后再撤销');const context=replay(s.events).context;apply(s,{type:'undo',eventId,cardId:target.cardId,target:target.eventId,at,version:cardState(s,target.cardId).version},context);return s}
export function validate(raw){
 check(raw?.schema===1&&Array.isArray(raw.events)&&raw.events.length<=100000&&raw.cards&&raw.marks&&raw.settings);check(Number.isInteger(raw.settings.target)&&raw.settings.target>=0&&raw.settings.target<=125);
 const result=replay(raw.events).state;result.settings.target=raw.settings.target;
 for(const [id,value] of Object.entries(raw.marks)){check(validId(id)&&typeof value==='boolean');result.marks[id]=value}
 check(JSON.stringify(result.cards)===JSON.stringify(raw.cards),'备份状态与学习记录不一致');return result;
}
export function merge(local,incoming,{preferences='reject'}={}){check(['reject','incoming','local'].includes(preferences));const a=validate(local),b=validate(incoming),context=replay(a.events).context;for(const event of b.events)apply(a,event,context);
 if(preferences==='reject'){check(a.settings.target===b.settings.target,'每日目标不同，请选择使用哪份设置');for(const [id,value] of Object.entries(b.marks)){check(!(id in a.marks)||a.marks[id]===value,'已读标记冲突，请选择使用哪份设置');a.marks[id]=value}}
 else if(preferences==='incoming'){a.marks={...a.marks,...b.marks};a.settings=clone(b.settings)}else a.marks={...b.marks,...a.marks};return a}
export function stats(s,now=Date.now(),days=7){const undone=new Set(s.events.filter(e=>e.type==='undo').map(e=>e.target));const all=s.events.filter(e=>e.type==='grade'&&!undone.has(e.eventId));const first=new Map();for(const e of all)if(!first.has(e.cardId))first.set(e.cardId,e.eventId);const start=day(now-(days-1)*86400000),end=day(now);const rows=all.filter(e=>day(e.at)>=start&&day(e.at)<=end);const counts={1:0,2:0,3:0},daily={};for(const e of rows){counts[e.rating]++;daily[day(e.at)]=(daily[day(e.at)]||0)+1}return {answers:rows.length,words:new Set(rows.map(e=>e.cardId)).size,newCount:rows.filter(e=>first.get(e.cardId)===e.eventId).length,counts,daily}}
export function queue(s,words,{now=Date.now(),batch='',extra=0}={}){const learned=stats(s,now,1).newCount;let remaining=Math.max(0,s.settings.target+extra-learned);return words.filter(w=>!batch||w.date===batch).map(w=>({...w,...cardState(s,w.id)})).sort((a,b)=>{const rank=x=>!x.state.reps?2:[1,3].includes(x.state.state)?0:1;return rank(a)-rank(b)||(!a.state.reps?b.date.localeCompare(a.date):Date.parse(a.state.due)-Date.parse(b.state.due))||a.id.localeCompare(b.id)}).filter(w=>!w.state.reps?remaining-->0:Date.parse(w.state.due)<=now)}
