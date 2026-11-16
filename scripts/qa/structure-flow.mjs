import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
const fingerprint=v=>sha(JSON.stringify(canonical(v)));
const text=v=>typeof v==='string'&&v.trim().length>0;
export const policy=read(root+'/config/qa/structure-flow-v1.json');
function acquisitionTask(b,records,dir){
 const entryId=b.snapshot?.entryId,matches=records.filter(r=>r.entryId===entryId&&r.module==='history');
 const task={entryId,module:'history',status:'unrecorded',complete:false,detail:'缺少获取记录；不能从现有摘要倒填成功。'};
 if(!matches.length)return task;if(matches.length!==1)return {...task,status:'invalid_record',detail:'本词有重复获取回执，请指定当前版本。'};
 const r=matches[0];task.status=r.status;task.detail=r.error||r.reason||'';
 if(['not_attempted','fetch_failed','parse_failed'].includes(r.status))return task;
 if(!['ready','no_entry'].includes(r.status))return {...task,status:'invalid_record',detail:'未知获取状态'};
 try{
  if(!text(r.artifactPath)||!text(r.artifactSHA)||!text(r.url)||!text(r.fetchedAt)||Number.isNaN(Date.parse(r.fetchedAt)))throw Error('缺保存位置/哈希/来源/时间');
  if(new URL(r.url).hostname!=='www.etymonline.com'&&new URL(r.url).hostname!=='etymonline.com')throw Error('本次普通词史固定来源不是Etymonline');
  const bytes=fs.readFileSync(path.resolve(dir,r.artifactPath));if(sha(bytes)!==r.artifactSHA)throw Error('保存资料哈希不一致');
  const e=JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/,''));if(e.entryId!==entryId||e.sourceId!==r.sourceId||e.url!==r.url||!text(e.text))throw Error('保存资料身份或提取文本不完整');
  if(r.status==='no_entry'){if(!text(r.reason))throw Error('缺无匹配条目原因');return {...task,complete:true,detail:r.reason};}
  if(!text(b.history?.summary)||b.historyURL!==r.url||!b.history.sourceRefs?.some(s=>s.sourceId===r.sourceId&&s.url===r.url))throw Error('资料或显示来源未传入本词历史模块');
  return {...task,complete:true,detail:'获取、保存、解析、模块引用均存在。'};
 }catch(e){return {...task,status:'incomplete',detail:e.message};}
}
export function checkBundle(b,records=[],dir='.'){
 const checks=[],check=(id,ok,detail)=>checks.push({id,pass:Boolean(ok),detail});
 check('S01',text(b.snapshot?.entryId)&&text(b.snapshot?.term)&&text(b.snapshot?.quote)&&[b.context,b.selection,b.bridge,b.analysis].every(m=>m?.entryId===b.snapshot.entryId)&&text(b.context?.contextId)&&b.bridge?.contextId===b.context.contextId&&b.analysis?.contextId===b.context.contextId&&b.history?.lexicalEntryId===b.inventory?.lexicalEntryId&&text(b.history?.lexicalEntryId)&&b.snapshot.quote===b.context?.quote&&sha(b.context.quote)===b.context.quoteSHA,'词条/模块/上下文身份及原句对应');
 try{
  const required=[b.snapshot,b.selection,b.inventory,b.history,b.context,b.bridge,b.analysis];
  const learning=Array.isArray(b.selection?.senses)&&b.selection.senses.length>0&&b.selection.senses.every(s=>text(s.senseId)&&text(s.title)&&typeof s.explanationZh==='string'&&Array.isArray(s.usageLabels)&&s.evidenceRefs?.length&&s.examples?.length&&s.examples.every(e=>text(e.en)&&text(e.zh)));
  const analysis=Array.isArray(b.analysis?.blocks)&&b.analysis.blocks.length>0&&b.analysis.blocks.every(x=>text(x.blockId)&&text(x.text)&&Array.isArray(x.dimensions))&&Array.isArray(b.analysis.workplaceUse)&&b.analysis.workplaceUse.length>0&&b.analysis.workplaceUse.every(u=>text(u.en)&&text(u.zh)&&text(u.whenToUse));
  check('S02',required.every(x=>x&&typeof x==='object')&&learning&&analysis&&text(b.selection.general)&&text(b.context.meaning)&&text(b.context.translation)&&text(b.context.quoteType)&&typeof b.history.summary==='string'&&text(b.bridge.semanticText),'九模块需要的显示数据存在；不评判篇幅、语气、论证或辅助qualifiers');
  const senses=new Set((b.senses||[]).map(s=>s.senseId)),sources=new Set((b.sources||[]).map(s=>s.sourceId)),practices=new Set((b.practices||[]).map(p=>p.practiceId));
  const senseRefs=[...(b.selection.selectedSenseIds||[]),...b.selection.senses.map(s=>s.senseId),...(b.inventory.senseIds||[]),...(b.context.senseRefs||[]),...(b.bridge.anchorRefs||[]),...(b.bridge.targetRefs||[])];
  const sourceRefs=[...(b.senses||[]).flatMap(s=>s.sourceRefs||[]),...(b.history.sourceRefs||[]),...(b.history.claims||[]).flatMap(c=>c.sourceRefs||[]),...(b.bridge.evidenceRefs||[]),...b.selection.senses.flatMap(s=>[...(s.evidenceRefs||[]),...(s.examples||[]).map(e=>e.sourceRef).filter(Boolean)]),...(b.analysis.blocks||[]).flatMap(x=>x.sourceRefs||[]),...(b.practices||[]).flatMap(p=>p.sourceRefs||[]),...(b.context.expressionExplanation?.componentRefs||[]),...(b.context.expressionExplanation?.wholeExpressionRefs||[])];
  check('S03',Array.isArray(b.senses)&&b.senses.length>0&&senses.size===b.senses.length&&b.senses.every(s=>text(s.lexicalEntryId)&&text(s.meaning?.glossZh)&&text(s.meaning?.definitionEn))&&senseRefs.every(id=>senses.has(id))&&sourceRefs.every(r=>sources.has(r.sourceId))&&(b.analysis.practiceRefs||[]).every(r=>practices.has(r.practiceId)),'义项/来源/实践引用可解析');
 }catch(e){check('S02',false,'结构无法读取：'+e.message);}
 const tasks=[acquisitionTask(b,records,dir)];return {entryId:b.snapshot?.entryId||null,structurePass:checks.every(c=>c.pass),flowComplete:tasks.every(t=>t.complete),checks,tasks};
}
export function checkRun(dir){
 dir=path.resolve(dir);const m=read(dir+'/manifest.json'),entries=[],checks=[],bundles=[];
 let records=[];if(fs.existsSync(dir+'/acquisition.json')){const a=read(dir+'/acquisition.json');if(!Array.isArray(a.records))throw Error('acquisition.records must be an array');records=a.records;}
 const ids=m.entryIds||m.itemStates.map(i=>i.entryId);checks.push({id:'S01',pass:ids.length>0&&new Set(ids).size===ids.length&&m.itemStates.length===ids.length&&new Set(m.itemStates.map(i=>i.entryId)).size===ids.length&&m.itemStates.every(i=>ids.includes(i.entryId)),detail:'选中词与逐条记录对账'});
 for(const i of m.itemStates){try{
  const b=read(path.resolve(dir,i.artifactPath)),input=read(path.resolve(dir,i.inputPath));bundles.push(b);const result=checkBundle(b,records,dir);
  const bound=i.entryId===b.snapshot?.entryId&&i.artifactHash===fingerprint(b)&&i.inputHash===fingerprint(input)&&fingerprint(input.snapshot)===fingerprint(b.snapshot);
  result.checks.push({id:'P01',pass:bound,detail:'实际输入/稿件与登记版本一致；不读取语义审核证书'});result.structurePass=result.structurePass&&bound;entries.push(result);
 }catch(e){entries.push({entryId:i.entryId,structurePass:false,flowComplete:false,checks:[{id:'P01',pass:false,detail:e.message}],tasks:[]});}}
 const tasks=entries.flatMap(e=>e.tasks),structurePass=checks.every(c=>c.pass)&&entries.every(e=>e.structurePass),flowComplete=entries.every(e=>e.flowComplete);
 return {qaVersion:policy.version,structurePass,flowComplete,previewReady:false,productionComplete:false,pageStatus:'not_run',contentQuality:'not_scored',accepted:false,published:false,checks,entries,counts:{selected:ids.length,packages:bundles.length,structurePassed:entries.filter(e=>e.structurePass).length,historyReady:tasks.filter(t=>t.status==='ready'&&t.complete).length,historyNoEntry:tasks.filter(t=>t.status==='no_entry'&&t.complete).length,historyPending:entries.length-tasks.filter(t=>t.complete).length}};
}
