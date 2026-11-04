import {fingerprint} from './core.mjs';
export const LEARNER_RULE='learner-dictionary/1';
export const learnerFingerprint=card=>fingerprint({ruleVersion:LEARNER_RULE,card});
const text=x=>typeof x==='string'&&/[\p{L}\p{N}]/u.test(x);
export function checkLearner(card,review){
 const errors=[],ok=(x,m)=>{if(!x)errors.push(m)};
 ok(text(card.writer)&&text(card.term)&&text(card.cardId),'identity/writer missing');
 ok(Array.isArray(card.sources)&&card.sources.length>0&&card.sources.every(u=>{try{const url=new URL(u);return url.protocol==='https:'&&!!url.hostname&&!url.username&&!url.password}catch{return false}}),'invalid rendered source URL');
 const ids=(card.senses||[]).map(s=>s.id);ok(ids.length>0&&new Set(ids).size===ids.length,'senses missing/duplicate');
 ok(ids.includes(card.contextSenseId)&&text(card.context)&&text(card.bridgeText),'context binding missing');
 for(const s of card.senses||[]){for(const k of ['pos','meaning','usage'])ok(text(s[k]),s.id+' missing '+k);ok(text(s.example?.en)&&text(s.example?.zh)&&s.example?.kind==='authored_example',s.id+' example/translation missing');ok(s.sourceUrls?.length&&s.sourceUrls.every(u=>card.sources.includes(u)&&/^https:\/\//.test(u)),s.id+' source missing')}
 if(errors.length)return {status:'EVIDENCE_GAP',errors};
 if(!review)return {status:'REVIEW',errors:['Independent learner review pending']};
 ok(review.cardId===card.cardId&&review.ruleVersion===LEARNER_RULE,'review identity/rule');ok(text(review.reviewer)&&review.reviewer!==card.writer,'reviewer not independent');ok(review.fingerprint===learnerFingerprint(card),'stale learner review');
 for(const k of ['standaloneDefinition','primaryPosCovered','commonMeaningsCovered','usableExamples','grammarReviewed','bridgeAlignment'])ok(review.qualityChecks?.[k]==='PASS','quality gap '+k);
 ok(Array.isArray(review.knownGaps)&&review.knownGaps.length===0,'unresolved common usage gap');
 for(const id of ids){const rs=(review.senseChecks||[]).filter(x=>x.id===id);ok(rs.length===1&&rs[0].verdict==='PASS'&&text(rs[0].note)&&card.senses.find(s=>s.id===id).sourceUrls.includes(rs[0].sourceUrl),id+' not independently supported')}
 ok(review.senseChecks?.length===ids.length,'reviewed sense coverage differs');
 let score=0;for(const [k,w] of Object.entries({accuracy:30,completion:30,readability:25,increment:15})){const n=review.scores?.[k];ok(Number.isInteger(n)&&n>=3&&n<=4,k+' below gate');ok(text(review.reasons?.[k]),k+' reason missing');score+=(Number.isInteger(n)?n:0)*w/4;}
 ok(review.decision==='PASS'&&Array.isArray(review.issues)&&!review.issues.some(x=>x.blocking),'review blocked');
 return {status:errors.length?'REVISE':'CANDIDATE',errors,module:{id:'additionalSenses',label:'词典义项',score,scores:review.scores,reasons:review.reasons,issues:review.issues}};
}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderLearner(card){
 return '<article data-learner-dictionary="'+esc(card.cardId)+'"><h3>'+esc(card.term)+' · 常用义与用法</h3><p class="source">根据学习词典核对整理；释义为本项目中文概述，例句及译文为自编。下方保留许可来源的英语原文。</p>'+card.senses.map((s,i)=>'<p data-learner-sense="'+esc(s.id)+'"><strong>'+(i+1)+'. '+esc(s.meaning)+'</strong><br><small>'+esc(s.pos)+'</small><br>用法：'+esc(s.usage)+'<br><span class="en" lang="en">'+esc(s.example.en)+'</span><br>'+esc(s.example.zh)+'</p>').join('')+'<p class="source">查阅来源：'+card.sources.map((u,i)=>'<a target="_blank" rel="noopener" href="'+esc(u)+'">'+(u.includes('oxford')?'Oxford':u.includes('cambridge')?'Cambridge':'词典')+' '+(i+1)+'</a>').join(' · ')+'</p></article><h3>来源词典原文</h3>';
}
