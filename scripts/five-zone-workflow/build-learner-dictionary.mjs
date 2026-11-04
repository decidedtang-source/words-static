import {readFileSync,writeFileSync,mkdirSync,existsSync,unlinkSync,copyFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
import {fingerprint} from './core.mjs';import {assertBaseline,checkDictionaryReview} from './full-dictionary.mjs';import {checkLearner,renderLearner,LEARNER_RULE} from './learner-dictionary.mjs';import {renderScoreReport} from './report-html.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..'),dir=resolve(process.argv[2]||'content/trials/dictionary-learner-50-20261104'),base=resolve(root,'content/trials/dictionary-full-50-20261104');
const read=(n,d=dir)=>JSON.parse(readFileSync(resolve(d,n),'utf8')),write=(n,x)=>{mkdirSync(dirname(resolve(dir,n)),{recursive:true});writeFileSync(resolve(dir,n),typeof x==='string'?x:JSON.stringify(x,null,2)+'\n')};
for(const n of ['preview.html','evidence/acceptance.json'])if(existsSync(resolve(dir,n)))unlinkSync(resolve(dir,n));
const lock=read('baseline-lock.json');assertBaseline(Object.fromEntries(Object.keys(lock.hashes).map(n=>[n,readFileSync(resolve(base,n),'utf8')])),lock);
const inheritedLock=read('baseline-lock.json',base),original=resolve(root,inheritedLock.base);assertBaseline(Object.fromEntries(Object.keys(inheritedLock.hashes).map(n=>[n,readFileSync(resolve(original,n),'utf8')])),inheritedLock);
const data=read('learner.json'),reviews=existsSync(resolve(dir,'learner-reviews.json'))?read('learner-reviews.json'):[],source=read('source-snapshot.json',base),wiki=read('wiktionary-snapshot.json',base),dictionary=read('dictionary.json',base),rawReviews=read('dictionary-reviews.json',base);
const report=read('whole-card-report.json',base),zones=read('report.json',base),baseHtml=readFileSync(resolve(base,'preview.html'),'utf8'),cards=JSON.parse(baseHtml.match(/const cards=(.*?);let index=0/s)[1]);
if(data.ruleVersion!==LEARNER_RULE||data.cards.length!==50||new Set(data.cards.map(c=>c.cardId)).size!==50||new Set(reviews.map(r=>r.cardId)).size!==reviews.length||reviews.some(r=>!data.cards.some(c=>c.cardId===r.cardId)))throw Error('Batch identity/duplicates');
report.ruleVersion='whole-card/3';report.learnerRule=LEARNER_RULE;
for(const [i,c] of data.cards.entries()){
 const old=cards[i];if(c.cardId!==old.w.id||c.term!==old.w.term||c.context!==old.a.context.text||c.bridgeText!==old.x.b)throw Error('Inherited identity/context/Bridge changed');
 const raw=checkDictionaryReview(dictionary.cards[i],source,wiki,rawReviews.find(r=>r.cardId===c.cardId));if(raw.status!=='CANDIDATE')throw Error('Raw source gate failed');
 const checked=checkLearner(c,reviews.find(r=>r.cardId===c.cardId)),r=report.cards.find(r=>r.cardId===c.cardId);if(r.status!=='CANDIDATE')throw Error('Inherited report not accepted');
 r.status=checked.status;r.errors=checked.errors;r.modules=r.modules.filter(m=>m.id!=='additionalSenses').concat(checked.module?[checked.module]:[]);
 old.p.dictionaryHtml=renderLearner(c)+old.p.dictionaryHtml;
}
write('whole-card-report.json',report);write('report.json',zones);write('scores.html',renderScoreReport(report,zones).replaceAll('更多义项','词典义项'));
if(report.cards.some(c=>c.status!=='CANDIDATE'))throw Error('Independent learner quality gate pending/failed');
const oldTitle="词典义项 · '+p.dictionaryCount+' 个义项",newTitle='词典义项 · 常用义与用法';if(!baseHtml.includes(oldTitle))throw Error('Title slot missing');
const html=baseHtml.replace(oldTitle,newTitle).replace(/const cards=.*?;let index=0/s,()=>'const cards='+JSON.stringify(cards).replace(/</g,'\\u003c')+';let index=0');
const normalized=s=>s.replace(/const cards=.*?;let index=0/s,'__DATA__');if(normalized(html.replace(newTitle,oldTitle))!==normalized(baseHtml))throw Error('Frozen layout changed');
// Owner 2026-11-05: dictionary first, expanded by default; retain manual collapse.
const dictionarySlot="<details><summary>"+newTitle+"</summary>'+p.dictionaryHtml+'</details>";
if(html.split(dictionarySlot).length!==2)throw Error('Dictionary slot must be unique');
const arrangedHtml=html.replace(dictionarySlot,'').replace('<section class="bridge">',dictionarySlot.replace('<details>','<details open>')+'<section class="bridge">');
write('preview.html',arrangedHtml);
for(const file of ['dictionary.json','source-snapshot.json','wiktionary-snapshot.json','dictionary-reviews.json','OEWN-LICENSE.md','WNDB_License.txt'])copyFileSync(resolve(base,file),resolve(dir,file));
for(const file of ['research-1.md','research-2.md','research-3.md'])copyFileSync(resolve(original,file),resolve(dir,file));
const notice=readFileSync(resolve(base,'SOURCE-NOTICE.html'),'utf8').replace('<h1>词典来源与收录范围</h1>','<h1>词典来源与收录范围</h1><p>新版先展示按成熟学习词典核对的常用释义与用法，中文概述和双语例句由本项目编写，并非商业词典原文。每个词附查阅链接；独立审核同时检查常用义覆盖和Bridge对应关系。下面185条许可来源义项继续逐字保留。此候选尚未冻结为最终完整基线。</p>');write('SOURCE-NOTICE.html',notice);
write('evidence/build.json',{ruleVersion:'whole-card/3',learnerRule:LEARNER_RULE,baseCommit:'52d7ac994a87e2166368b2e373bbab5885cb772d',cards:50,learnerMeanings:data.cards.reduce((n,c)=>n+c.senses.length,0),preservedSourceSenses:185,layoutUnchanged:false,ownerLayoutChange:'2026-11-05: dictionary before Bridge, open by default',cssUnchanged:arrangedHtml.match(/<style>.*?<\/style>/s)?.[0]===baseHtml.match(/<style>.*?<\/style>/s)?.[0],previewHash:fingerprint(arrangedHtml),learnerHash:fingerprint(data),reviewHash:fingerprint(reviews),baselineLockHash:fingerprint(lock),productionActivated:false});
console.log({cards:50,learnerMeanings:data.cards.reduce((n,c)=>n+c.senses.length,0),preservedSourceSenses:185,content:'CANDIDATE',browser:'PENDING'});
