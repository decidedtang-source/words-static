import {fsrs,generatorParameters} from 'ts-fsrs';
// Original published FSRS-6 configuration. Historical event replay must not
// inherit future library defaults or the user's current retention preference.
const weights=[.212,1.2931,2.3065,8.2956,6.4133,.8334,3.0194,.001,1.8722,.1666,.796,1.4835,.0614,.2629,1.6483,.6014,1.8729,.5425,.0912,.0658,.1542];
const engines=new Map();
export function reviewSettings(s){return s.settings.review??{retention:.9,order:'risk'}}
export function validReview(p){return p&&[.85,.9,.95].includes(p.retention)&&['risk','due'].includes(p.order)}
export function reviewEngine(policy){
 const retention=policy===undefined ? .9 : policy?.retention;
 if(policy!==undefined&&(policy?.version!==1||![.85,.9,.95].includes(retention)))throw Error('不支持的复习策略记录');
 if(!engines.has(retention))engines.set(retention,fsrs(generatorParameters({w:[...weights],request_retention:retention,maximum_interval:36500,enable_fuzz:false,enable_short_term:true,learning_steps:['1m','10m'],relearning_steps:['1m','10m']})));
 return engines.get(retention);
}
export function recallProbability(card,now){return reviewEngine().retrievability(card,new Date(now))}
export function reviewOutcomes(s,now=Date.now()){
 const undone=new Set(s.events.filter(e=>e.type==='undo').map(e=>e.target)),last=new Map();let reviews=0,recalled=0;
 for(const e of s.events){if(e.type!=='grade'||undone.has(e.eventId)||e.at>now)continue;const previous=last.get(e.cardId);last.set(e.cardId,e.at);
  if(previous!==undefined&&e.at-previous>=86400000&&e.at>=now-30*86400000){reviews++;if(e.rating>1)recalled++}
 }
 return {reviews,recalled,rate:reviews?recalled/reviews:null};
}
