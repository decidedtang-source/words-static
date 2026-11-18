import {day,queue} from './model.mjs';

export function studyFeedback(state,words,{now=Date.now(),batch='',extra=0}={}){
 const dates=Array.isArray(batch)?batch:batch?[batch]:[],selected=words.filter(w=>!dates.length||dates.includes(w.date)),ids=new Set(selected.map(w=>w.id));
 const undone=new Set(state.events.filter(e=>e.type==='undo').map(e=>e.target)),first=new Map(),todayIds=new Set(),newIds=new Set(),allNew=new Set(),today=day(now),days=new Map();
 const eventDay=at=>{const key=Math.floor((at+28800000)/86400000);if(!days.has(key))days.set(key,day(at));return days.get(key)};
 for(const e of state.events){if(e.type!=='grade'||undone.has(e.eventId))continue;const fresh=!first.has(e.cardId);if(fresh)first.set(e.cardId,e.at);if(eventDay(e.at)!==today)continue;if(fresh)allNew.add(e.cardId);if(ids.has(e.cardId)){todayIds.add(e.cardId);if(fresh)newIds.add(e.cardId)}}
 const pending=queue(state,words,{now,batch,extra}),pendingNew=pending.filter(w=>!w.state.reps).length,pendingReview=pending.length-pendingNew,started=selected.filter(w=>state.cards[w.id]?.state.reps>0).length;
 return {total:selected.length,started,unstarted:selected.length-started,todayWords:todayIds.size,todayNew:newIds.size,todayReview:todayIds.size-newIds.size,globalNew:allNew.size,pendingNew,pendingReview,pending:pending.length,newPlan:newIds.size+pendingNew,target:state.settings.target};
}

export function feedbackMarkup(p,{compact=false}={}){
 const plan=p.newPlan?`<label for="${compact?'study':'today'}-new-progress">本范围今日新词：<strong>${p.todayNew} / ${p.newPlan}</strong> 词 · ${Math.round(p.todayNew/p.newPlan*100)}%</label><progress id="${compact?'study':'today'}-new-progress" max="${p.newPlan}" value="${p.todayNew}"></progress>`:'<p>本范围当前没有待学新词任务。</p>';
 const encouragement=p.pending===0?(p.todayWords?'当前任务已完成，可以休息一下；稍后有到期词再来巩固。':'当前没有待学任务。可调整范围或新词目标，稍后有到期词再来复习。'):p.todayWords?`今天已练习 ${p.todayWords} 个不同的词，继续完成剩余 ${p.pending} 词。`:`从第 1 个词开始，完成一个就能看到进度。`;
 return `${compact?'':`<div class="metrics"><div class="metric"><strong data-feedback="pending">${p.pending}</strong><span>待学</span><small>新词 ${p.pendingNew} · 到期复习 ${p.pendingReview}</small></div><div class="metric"><strong data-feedback="todayWords">${p.todayWords}</strong><span>今日已学</span><small>新学 ${p.todayNew} · 复习 ${p.todayReview}</small></div><div class="metric"><strong data-feedback="started">${p.started}</strong><span>累计已学</span><small>共 ${p.total} · 未学 ${p.unstarted}</small></div></div>`}<div class="goal-feedback">${plan}<p class="hint">全日期今日新学 ${p.globalNew} / ${p.target===null?'不限量':p.target} · 当前待学：新词 <span data-feedback="pendingNew">${p.pendingNew}</span> / 到期复习 <span data-feedback="pendingReview">${p.pendingReview}</span></p><p class="goal-encouragement" role="status">${encouragement}</p>${compact?`<p class="hint">本范围累计已开始 ${p.started} / ${p.total} 词</p>`:'<p class="hint">今日已学按词去重，累计已开始不代表掌握。新词计划按当前范围及每日剩余额度更新；到期复习单独计算。</p>'}</div>`;
}
