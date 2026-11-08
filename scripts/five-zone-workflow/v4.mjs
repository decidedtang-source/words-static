import {fingerprint} from './core.mjs';
export const V4_RULE='dictionary-bridge-five/4';
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const formatIpa=s=>s?'/'+String(s).replace(/^\/+|\/+$/g,'')+'/':'';
const text=x=>typeof x==='string'&&/[\p{L}\p{N}]/u.test(x);
const url=u=>{try{const x=new URL(u);return x.protocol==='https:'&&!x.username&&!x.password}catch{return false}};
export function validateCard(c){const errors=[],ok=(x,s)=>{if(!x)errors.push(s)};
 for(const k of ['cardId','term','writer'])ok(text(c[k]),'missing '+k);
 ok(c.word?.id===c.cardId&&c.word?.term===c.term,'word identity');for(const k of ['pos','gloss','chunk'])ok(text(c.word?.[k]),'word '+k);
 ok(Array.isArray(c.word?.examples)&&c.word.examples.length>0&&c.word.examples.every(e=>text(e.en)&&text(e.zh)),'word examples');
 const d=c.dictionary,ss=d?.senses||[];ok(d?.cardId===c.cardId&&d?.term===c.term,'dictionary identity');ok(d?.context===c.context?.text&&text(c.context?.text),'context');
 ok(ss.length&&new Set(ss.map(s=>s.id)).size===ss.length,'sense identity');ok(ss.some(s=>s.id===d?.contextSenseId),'context sense');
 for(const s of ss){for(const k of ['id','pos','meaning','usage'])ok(text(s[k]),'sense '+k);ok(text(s.example?.en)&&text(s.example?.zh),'example');ok(s.sourceUrls?.length&&s.sourceUrls.every(url),'source URL');}
 ok(text(c.bridge?.text)&&text(c.bridge?.reason)&&['semantic','transparent','lexicalized'].includes(c.bridge?.mode),'bridge');ok(!ss.some(s=>s.meaning===c.bridge?.text)&&c.bridge?.text!==c.scenario,'bridge duplicates definition/scenario');
 ok(c.groups?.length===5&&c.groups.every((g,i)=>g.id==='g'+(i+1)&&text(g.title)&&text(g.text)),'five zones');ok(new Set(c.groups?.map(g=>g.text)).size===5,'duplicate zones');
 ok(text(c.scenario)&&Array.isArray(c.exploration)&&c.exploration.length>0,'B/C missing');
 for(const g of c.groups||[])ok((g.sources||[]).every(([,u])=>url(u)),'zone URL');for(const [,t,u] of c.exploration||[])ok(text(t)&&url(u),'exploration URL');return errors;}
export function validateReview(c,r){const errors=[];if(!r)return ['missing independent review'];
 if(r.ruleVersion!=='dictionary-v4/1'||!text(r.transferCheck))errors.push('review rule/transfer evidence');
 if(r.cardId!==c.cardId||!text(r.reviewer)||r.reviewer===c.writer)errors.push('review identity');if(r.fingerprint!==fingerprint(c))errors.push('stale review');
 for(const k of ['A','B','C','D','E'])if(!Number.isInteger(r.scores?.[k])||r.scores[k]<4||r.scores[k]>5||!text(r.reasons?.[k]))errors.push('quality '+k);
 if(r.decision!=='PASS'||!Array.isArray(r.issues)||r.issues.some(x=>x.blocking))errors.push('review blocked');return errors;}
export function renderDictionary(c){const d=c.dictionary;
 const row=s=>'<article data-learner-sense="'+esc(s.id)+'"><small>'+esc(s.pos)+'</small><p><strong>'+esc(s.meaning)+'</strong>'+(s.id===d.contextSenseId?' <span class="current">当前用法</span>':'')+'</p><details class="sense-details"><summary>用法、例句与来源</summary><p>'+esc(s.usage)+'</p><p lang="en">'+esc(s.example.en)+'</p><p>'+esc(s.example.zh)+'</p><p class="source">原创中文概述及自编例句 · '+s.sourceUrls.map((u,i)=>'<a href="'+esc(u)+'" target="_blank" rel="noopener">核对来源 '+(i+1)+'</a>').join(' · ')+'</p></details></article>';
 const core=d.senses.filter(s=>!s.extended||s.id===d.contextSenseId),extra=d.senses.filter(s=>s.extended&&s.id!==d.contextSenseId);
 const raw=c.legacyDictionaryHtml?.split('<h3>来源词典原文</h3>')[1]||'';
 return '<section class="dictionary"><h2>词典 · 常用义与用法</h2>'+core.map(row).join('')+(extra.length?'<details><summary>更多常用及专业义（'+extra.length+'）</summary>'+extra.map(row).join('')+'</details>':'')+'<details data-source-inventory><summary>完整来源词典与收录范围</summary>'+(raw||'<p>本补充示范为原创学习释义，未另行收录完整许可词典原文。逐义来源见上方，不宣称穷尽所有词典。</p>')+'</details></section>';}
