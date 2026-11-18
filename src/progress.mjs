import {day,cardState} from './model.mjs';

export function learningProgress(state,words,{now=Date.now(),days=7,batch=''}={}) {
  const undone=new Set(state.events.filter(e=>e.type==='undo').map(e=>e.target));
  const grades=state.events.filter(e=>e.type==='grade'&&!undone.has(e.eventId));
  const source=new Map(words.map(w=>[w.id,w.date])),groups=new Map(),first=new Map();
  for(const w of words){
    if(!groups.has(w.date))groups.set(w.date,{date:w.date,total:0,started:0,remaining:0,due:0,answers:0,newCount:0,reviewCount:0,lastStudiedAt:null});
    const row=groups.get(w.date),card=cardState(state,w.id).state;
    row.total++;if(card.reps)row.started++;else row.remaining++;
    if(card.reps&&Date.parse(card.due)<=now)row.due++;
  }
  const start=day(now-(days-1)*86400000),end=day(now),daily=new Map(),unique=new Set(),counts={1:0,2:0,3:0};
  let answers=0,newCount=0,reviewCount=0,unmatchedAnswers=0;
  const dateCache=new Map();
  const eventDay=at=>{const key=Math.floor((at+8*3600000)/86400000);if(!dateCache.has(key))dateCache.set(key,day(at));return dateCache.get(key);};
  for(const event of grades){
    const isNew=!first.has(event.cardId);if(isNew)first.set(event.cardId,event.eventId);
    const sourceDate=source.get(event.cardId),group=groups.get(sourceDate),date=eventDay(event.at);
    if(group){group.answers++;group.lastStudiedAt=Math.max(group.lastStudiedAt??0,event.at);}
    if(date<start||date>end)continue;
    if(group){if(isNew)group.newCount++;else group.reviewCount++;}
    if(batch&&sourceDate!==batch)continue;
    if(!sourceDate)unmatchedAnswers++;
    if(!daily.has(date))daily.set(date,{date,newCount:0,reviewCount:0,answers:0,ids:new Set()});
    const row=daily.get(date);row.answers++;row.ids.add(event.cardId);answers++;unique.add(event.cardId);counts[event.rating]++;
    if(isNew){row.newCount++;newCount++;}else{row.reviewCount++;reviewCount++;}
  }
  return {answers,newCount,reviewCount,words:unique.size,counts,unmatchedAnswers,
    daily:[...daily.values()].map(({ids,...row})=>({...row,words:ids.size})).sort((a,b)=>b.date.localeCompare(a.date)),
    batches:[...groups.values()].sort((a,b)=>b.date.localeCompare(a.date))};
}
