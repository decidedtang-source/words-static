// Agent-assisted workflow: research/writing/review are explicit artifacts, never simulated by this CLI.
import {readFileSync,writeFileSync,existsSync,mkdirSync,renameSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {RULE,fingerprint,runBatch,additionalEntries} from './core.mjs';
import {checkWholeCard,WHOLE_RULE} from './whole-card.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const dir=resolve(process.argv[2]||'content/trials/five-zone-calibration-20261103');
const limitArg=process.argv.find(a=>a.startsWith('--limit='));
const limit=limitArg?Number(limitArg.split('=')[1]):Infinity;
if(!(limit>0))throw Error('limit must be positive');
const read=p=>JSON.parse(readFileSync(resolve(dir,p),'utf8'));
const write=(p,x)=>{const path=resolve(dir,p);mkdirSync(dirname(path),{recursive:true});writeFileSync(path+'.tmp',typeof x==='string'?x:JSON.stringify(x,null,2)+'\n');renameSync(path+'.tmp',path)};
const entries=read('entries.json'),receipts=existsSync(resolve(dir,'reviews.json'))?read('reviews.json'):[];
let state=existsSync(resolve(dir,'state.json'))?read('state.json'):{};
// Validate duplicate IDs before incremental checkpointing.
runBatch(entries,receipts,{},0);
let processed=0;const transitions=[];
for(const entry of entries){
 if(processed>=limit)break;
 const next=runBatch([entry],receipts.filter(r=>r.cardId===entry.cardId),state);
 const old=state.entries?.[entry.cardId];
 state={ruleVersion:RULE,productionImportAllowed:false,entries:{...state.entries,...next.entries}};
 const current=state.entries[entry.cardId];
 if(old?.key!==current.key)transitions.push({cardId:entry.cardId,from:old?.status||'NOT_STARTED',to:current.status,key:current.key});
 write('state.json',state);processed++;
}
const selected=new Set(entries.map(e=>e.cardId));state.entries=Object.fromEntries(Object.entries(state.entries).filter(([id])=>selected.has(id)));write('state.json',state);
// Invalidate even unprocessed rows before displaying a partial run's results.
for(const e of entries.slice(processed)){
 const r=receipts.find(r=>r.cardId===e.cardId),key=fingerprint({rule:RULE,entry:e,receipt:r||null});
 if(state.entries[e.cardId]?.key!==key)state.entries[e.cardId]={status:'NOT_STARTED',errors:['Current input or review changed; processing pending'],zones:[]};
}
write('state.json',state);
const history=existsSync(resolve(dir,'history.json'))?read('history.json'):[];
write('history.json',[...history,{at:new Date().toISOString(),processed,transitions}]);
const result={ruleVersion:RULE,processed,total:entries.length,complete:processed===entries.length,productionImportAllowed:false,counts:{},cards:entries.map(e=>({cardId:e.cardId,term:e.term,...(state.entries[e.cardId]||{status:'NOT_STARTED'})}))};
for(const [i,c] of result.cards.entries()){
 const e=entries[i],r=receipts.find(x=>x.cardId===e.cardId),current=r?.fingerprint===fingerprint(e)&&r?.ruleVersion===RULE;
 c.completeness={structuralTeachingItems:{filled:e.groups.reduce((n,g)=>n+['anchor','explanation','example','boundary'].filter(k=>typeof g.requirements?.[k]==='string'&&g.requirements[k].trim()).length,0),required:20},independentlyAcceptedZones:{accepted:current?(r.zones||[]).filter(z=>z.requirementsVerdict==='PASS'&&Object.values(z.scores||{}).length===4&&Object.values(z.scores).every(s=>s>=3&&s<=4)).length:0,required:5},evidenceClaims:{accepted:current?(r.sourceChecks||[]).filter(s=>s.verdict==='SUPPORTED'&&e.claims.some(c=>c.id===s.claimId)).length:0,required:e.claims.length}};
}
for(const c of result.cards)result.counts[c.status]=(result.counts[c.status]||0)+1;
write('report.json',result);
const zonesOnly=process.argv.includes('--zones-only');
if(zonesOnly&&process.argv.includes('--build'))throw Error('Partial zone-only checks cannot build a complete page');
const supplements=existsSync(resolve(dir,'whole-card-supplement.json'))?read('whole-card-supplement.json'):[];
const wholeReviews=existsSync(resolve(dir,'whole-card-reviews.json'))?read('whole-card-reviews.json'):[];
for(const list of [supplements,wholeReviews])if(new Set(list.map(x=>x.cardId)).size!==list.length)throw Error('Duplicate whole-card artifact ID');
const whole={ruleVersion:WHOLE_RULE,productionActivated:false,cards:entries.map(e=>{
 const checked=checkWholeCard(e,supplements.find(s=>s.cardId===e.cardId),receipts.find(r=>r.cardId===e.cardId),wholeReviews.find(r=>r.cardId===e.cardId));
 const zone=result.cards.find(c=>c.cardId===e.cardId);return {cardId:e.cardId,term:e.term,...checked,zoneStatus:zone.status,status:zone.status==='CANDIDATE'?checked.status:zone.status};
})};
if(!zonesOnly)write('whole-card-report.json',whole);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let md=`# 五词逐区评分\n\n规则 ${RULE}；独立编辑判断，不代表实测学习成绩。不发布。\n\n|词条|01|02|03|04|05|加权总分|状态|\n|---|---:|---:|---:|---:|---:|---:|---|\n`;
for(const c of result.cards)md+=`|${c.term}|${Array.from({length:5},(_,i)=>c.zones?.[i]?.score??'未评').join('|')}|${c.total??'未评'}|${c.status}|\n`;
for(const c of result.cards){md+=`\n## ${c.term}\n\n${c.errors?.join('；')||'当前门禁无未解决问题'}\n`;for(const z of c.zones||[])md+=`\n### ${z.id} — ${z.score}\n\n`+Object.keys(z.scores||{}).map(k=>`- ${k}: ${z.scores[k]}/4 — ${z.reasons[k]}`).join('\n')+'\n'+(z.issues||[]).map(x=>`- 改进建议：${typeof x==='string'?x:x.message}`).join('\n')+'\n';}
if(!zonesOnly){md='# 整页分区 QA（后五区只是其中一部分）\n\n'+whole.cards.map(c=>`- ${c.term}: ${c.status}；${c.errors.join('；')||'整页内容模块已审，页面功能另见browser证据'}`).join('\n')+'\n\n'+whole.cards.map(c=>`## ${c.term}：前区、例句和复制负载\n\n`+c.modules.map(m=>`### ${m.id} — ${m.score}\n\n`+Object.keys(m.scores||{}).map(k=>`- ${k}: ${m.scores[k]}/4 — ${m.reasons[k]}`).join('\n')).join('\n\n')).join('\n\n')+'\n\n'+md;}
write('SCORES.md',md);
write('scores.html','<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>五词逐区评分</title><style>body{max-width:1000px;margin:30px auto;padding:16px;font:16px/1.8 system-ui}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit}</style><h1>五词逐区评分</h1><p><a href="preview.html">返回完整学习页面</a> · 独立编辑审核，非实测学习成绩</p><pre>'+esc(md)+'</pre>');
if(process.argv.includes('--build')){
 if(!result.complete||whole.cards.some(c=>c.status!=='CANDIDATE'))throw Error('Build blocked: every whole-card module must pass');
 const selection=JSON.parse(readFileSync(resolve(root,'content/trials/five-zone-50-20261103/selection.json'),'utf8'));
 const original=new Map(selection.cards.map(w=>[w.id,w]));
 const cards=entries.map(e=>{
  const w=structuredClone(original.get(e.cardId));if(!w||w.term!==e.term||w.example!==e.context)throw Error('Original identity/context mismatch');
  const s=supplements.find(s=>s.cardId===e.cardId);
  w.pos=s.headword.pos;w.ipa=s.headword.ipa;w.chunk=s.headword.chunk;w.examples=[{en:e.context,zh:e.contextZh},...s.examples.filter(x=>x.en!==e.context)];
  const focused=e.focusedEntries||[{entry:e.dictionaryEntries[0],sense:e.dictionaryEntries[0].senses[0]}];
  return {w,a:{context:{text:e.context,kind:'existing_public_learning_example'},displayGroups:e.groups.map(g=>({...g,sources:g.sourceIds.map(id=>{const s=e.sources.find(s=>s.id===id);return [s.title,s.url]})}))},p:{displayGloss:e.gloss,focused,allEntries:additionalEntries(e),contextTakeaway:e.contextTakeaway},x:{short:e.gloss,cue:'当前用法',b:e.bridgeText,quote:'',source:'原创教学转述；当前义、拆词义及讲解依据见本页来源与本批研究记录。',url:'research.md',c:s.etymology.map(x=>[x.title,x.text,s.sources.find(source=>source.id===x.sourceId).url])}};
 });
 const frozen=readFileSync(resolve(root,'docs/codex/v3/five-zone-v3.1/preview.html'),'utf8');
 const replaceData=s=>s.replace(/const cards=.*?;let index=0/s,'__CONTENT__');
 let html=frozen.replace(/const cards=.*?;let index=0/s,'const cards='+JSON.stringify(cards).replace(/</g,'\\u003c')+';let index=0');
 const changes=[['OEWN 2025 已选义项，不代表完整词典；中文为教学摘要。','已核验的相关义项；中英文为原创教学转述，不是完整词典或词典原文。'],['https://github.com/decidedtang-source/words-static/blob/feature/words-static-p1-p3/public/licenses/LICENSE.md','research.md'],['来源与许可</a>','本批来源与范围</a>']];
 for(const [from,to] of changes){if(!html.includes(from))throw Error('Frozen attribution changed');html=html.replace(from,to)}
 let normalized=replaceData(html);for(const [from,to] of changes)normalized=normalized.replace(to,from);
 if(replaceData(normalized)!==replaceData(frozen))throw Error('Frozen layout changed');
 write('preview.html',html);write('evidence/build.json',{ruleVersion:WHOLE_RULE,count:cards.length,layoutUnchanged:true,frozenLayoutHash:fingerprint(replaceData(frozen)),normalizedLayoutHash:fingerprint(replaceData(normalized)),allowedTextChanges:changes,entryHashes:entries.map(e=>({cardId:e.cardId,hash:fingerprint(e)})),wholeCardHashes:wholeReviews.map(r=>({cardId:r.cardId,fingerprint:r.fingerprint,receiptHash:fingerprint(r)})),renderedCardsHash:fingerprint(cards),productionActivated:false});
}
console.log(JSON.stringify({scope:zonesOnly?'five-zones-only':'whole-card',processed,counts:(zonesOnly?result.cards:whole.cards).reduce((a,c)=>(a[c.status]=(a[c.status]||0)+1,a),{}),complete:result.complete,productionActivated:false}));
if(process.argv.includes('--validate-only')&&(!result.complete||(zonesOnly?result.cards:whole.cards).some(c=>c.status!=='CANDIDATE')))process.exitCode=1;
