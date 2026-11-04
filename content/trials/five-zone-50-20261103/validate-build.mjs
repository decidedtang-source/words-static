// One-off V3.1 trial packaging; deliberately outside the production publisher.
import {readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const dir=dirname(fileURLToPath(import.meta.url));
const root=resolve(dir,'../../..');
const read=p=>JSON.parse(readFileSync(resolve(dir,p),'utf8'));
const hash=v=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const write=(p,v)=>writeFileSync(resolve(dir,p),typeof v==='string'?v:JSON.stringify(v,null,2)+'\n');
const selection=read('selection.json');
assertBaseVocabulary();
function assertBaseVocabulary(){
 const actual=hash(readFileSync(resolve(root,selection.sourcePath),'utf8'));
 if(actual!==selection.baseVocabularySha256)throw Error('Public vocabulary changed since selection; reselect/review before packaging');
}
const selected=new Map(selection.cards.map(w=>[w.id,w]));
const rows=[1,2,3].flatMap(n=>read(`part-${n}.json`));
const errors=[],warnings=[];
const assert=(test,message)=>{if(!test)errors.push(message)};
const titles=['先记住，再联系','句法与概念','辨析与英文邻居','这句话在做什么','工作中可以这样说'];
assert(rows.length===50,'Expected 50 rows');
assert(new Set(rows.map(x=>x.cardId)).size===50,'Duplicate cardIds');
const seenTexts=new Map();
for(const r of rows){
 const w=selected.get(r.cardId),label=r.cardId;
 assert(!!w,`${label}: outside selection`);if(!w)continue;
 assert(r.term===w.term,`${label}: changed target`);
 assert(r.context===w.example || w.examples?.some(e=>e.en===r.context),`${label}: context must be existing public example`);
 for(const key of ['contextZh','gloss','pos','definitionEn','definitionZh','contextTakeaway','bridgeText','writer'])assert(typeof r[key]==='string'&&r[key].trim().length>0,`${label}: missing ${key}`);
 assert(['source_summary','compositional'].includes(r.glossKind),`${label}: glossKind`);
 assert(Array.isArray(r.sources)&&r.sources.length>0,`${label}: sources absent`);
 const sourceIds=new Set((r.sources||[]).map(s=>s.id));
 assert(sourceIds.size===r.sources?.length,`${label}: duplicate source IDs`);
 for(const s of r.sources||[]){
  let u;try{u=new URL(s.url)}catch{errors.push(`${label}: invalid URL`)}
  assert(u?.protocol==='https:',`${label}: source must use https`);
  assert(!/notion\.(so|site)|localhost|127\.0\.0\.1/.test(u?.hostname||''),`${label}: private source URL`);
  for(const key of ['id','title','publisher','section','summaryZh','useAssessment'])assert(typeof s[key]==='string'&&s[key].trim(),`${label}: source ${key}`);
  assert(['full_page','partial','index_excerpt'].includes(s.retrievalStatus),`${label}: unsupported retrieval status`);
  assert(s.accessedAt==='2026-11-03',`${label}: access date`);
  assert(Array.isArray(s.supportedClaims)&&s.supportedClaims.length>0,`${label}: source claims missing`);
 }
 assert(r.groups?.length===5,`${label}: groups count`);
 for(const [i,g] of (r.groups||[]).entries()){
  assert(g.id===`g${i+1}`&&g.title===titles[i],`${label}: group identity ${i}`);
  assert(typeof g.text==='string'&&g.text.trim().length>=25,`${label}: empty/insufficient group ${i}`);
  assert(Array.isArray(g.sourceIds)&&g.sourceIds.length>0&&g.sourceIds.every(id=>sourceIds.has(id)),`${label}: unresolved source reference ${i}`);
  if(seenTexts.has(g.text))errors.push(`${label}: duplicated paragraph with ${seenTexts.get(g.text)}`);else seenTexts.set(g.text,`${label}/g${i+1}`);
  if(g.text.length>500)warnings.push(`${label}/g${i+1}: long paragraph ${g.text.length}`);
 }
 assert(!/(?:sk-[a-zA-Z0-9]{20}|gh[pousr]_[a-zA-Z0-9]{20}|[A-Z]:[\\/]|notion\.so)/.test(JSON.stringify(r)),`${label}: possible private data`);
}
if(errors.length){console.error(JSON.stringify({errors,warnings},null,2));process.exit(1)}
const entries=selection.cards.map(w=>rows.find(r=>r.cardId===w.id)).map(r=>({
 ...r,contextKind:'existing_public_learning_example',templateVersion:selection.version,
 contentRevision:1,contentHash:hash({...r,sources:undefined}),sourceEvidenceHash:hash(r.sources),
 stageCoverage:{Memory:'g1',SemanticConnection:'g1',Syntax:'g2',Concept:'g2',Contrast:'g3',EnglishNeighbors:'g3',LanguageGame:'g4',PragmaticAction:'g4',WorkplaceUse:'g5'},
 reviewStatus:'PENDING'
}));
const receipts=[];
for(const n of [1,2,3])if(existsSync(resolve(dir,`review-${n}.json`)))receipts.push(...read(`review-${n}.json`).entries);
for(const r of receipts)assert(selected.has(r.cardId),`Unknown review cardId: ${r.cardId}`);
for(const e of entries){
 const receipt=receipts.find(r=>r.cardId===e.cardId);
 if(receipt){
  assert(receipts.filter(r=>r.cardId===e.cardId).length===1,`${e.cardId}: duplicate review receipt`);
  assert(receipt.contentHash===e.contentHash&&receipt.sourceEvidenceHash===e.sourceEvidenceHash,`${e.cardId}: stale review hash`);
  assert(typeof receipt.reviewer==='string'&&receipt.reviewer.trim().length>0&&receipt.reviewer!==e.writer,`${e.cardId}: missing or same reviewer`);
  assert(Array.isArray(receipt.sourceChecks)&&receipt.sourceChecks.length>0,`${e.cardId}: missing independent source checks`);
  assert(['accuracy','readability','explanation','transfer','efficiency'].every(k=>typeof receipt.reasons?.[k]==='string'&&receipt.reasons[k].trim().length>0),`${e.cardId}: missing score reasons`);
  assert(['APPROVE','REVISE','QUARANTINE'].includes(receipt.decision),`${e.cardId}: review decision`);
  if(receipt.decision==='APPROVE'){
   const weights={accuracy:25,readability:20,explanation:25,transfer:20,efficiency:10};
   const scores=receipt.scores||{};
   assert(Object.keys(weights).every(k=>Number.isInteger(scores[k])&&scores[k]>=3&&scores[k]<=5),`${e.cardId}: score range`);
   const score=Object.entries(weights).reduce((sum,[k,w])=>sum+(scores[k]||0)/5*w,0);
   assert(scores.accuracy>=4&&score>=80,`${e.cardId}: score gate failed`);
   assert(receipt.hardGates==='PASS',`${e.cardId}: hard gates`);
   e.reviewStatus='APPROVE';e.reviewReceipt=receipt;e.score=score;
  }else{e.reviewStatus=receipt.decision;e.reviewReceipt=receipt;}
 }
}
if(errors.length){console.error(JSON.stringify({errors},null,2));process.exit(1)}
const batch={schema:'five-zone-trial/1',batchId:selection.batchId,baseCommit:selection.baseCommit,templateVersion:selection.version,productionImportAllowed:false,entries};
write('batch.json',batch);
// Sources below are original paraphrases, NOT licensed OEWN entries or quoted dictionary definitions.
const cards=entries.map(r=>{
 const w=structuredClone(selected.get(r.cardId));
 const titleSource=r.sources[0];
 const sense={id:`trial:${r.cardId}:current`,glossZh:r.definitionZh,definitionEn:r.definitionEn};
 const entry={lemma:r.term,pos:r.pos,senses:[sense],source:'来源支持的教学转述'};
 return {w,a:{context:{text:r.context,kind:'existing_public_learning_example'},displayGroups:r.groups.map(g=>({...g,sources:g.sourceIds.map(id=>{const s=r.sources.find(s=>s.id===id);return [s.title,s.url]})}))},
  p:{displayGloss:r.gloss,focused:[{entry,sense}],allEntries:[entry],contextTakeaway:r.contextTakeaway},
  x:{short:r.gloss,cue:'当前用法',b:r.bridgeText,quote:'',source:`释义为原创教学转述，依据 ${titleSource.publisher}；来源见下方五区。`,url:titleSource.url,c:[]}
 };
});
let html=readFileSync(resolve(root,'docs/codex/v3/five-zone-v3.1/preview.html'),'utf8');
const frozenLayout=html.replace(/const cards=.*?;let index=0/s,'__CONTENT__');
html=html.replace(/const cards=.*?;let index=0/s,'const cards='+JSON.stringify(cards).replace(/</g,'\\u003c')+';let index=0');
const old='OEWN 2025 已选义项，不代表完整词典；中文为教学摘要。';
if(!html.includes(old))throw Error('Unexpected frozen source attribution');
html=html.replace(old,'本批仅展示已核对的当前义；中英文均为原创教学转述，不是词典原文或完整词典。');
html=html.replace('https://github.com/decidedtang-source/words-static/blob/feature/words-static-p1-p3/public/licenses/LICENSE.md','README.md');
html=html.replace('来源与许可</a>','本批范围与来源说明</a>');
const normalizedLayout=html.replace(/const cards=.*?;let index=0/s,'__CONTENT__')
 .replace('本批仅展示已核对的当前义；中英文均为原创教学转述，不是词典原文或完整词典。',old)
 .replace('href="README.md"','href="https://github.com/decidedtang-source/words-static/blob/feature/words-static-p1-p3/public/licenses/LICENSE.md"')
 .replace('本批范围与来源说明</a>','来源与许可</a>');
if(normalizedLayout!==frozenLayout)throw Error('Undeclared layout/template change');
write('preview.html',html);
mkdirSync(resolve(dir,'evidence'),{recursive:true});
write('evidence/validation.json',{date:'2026-11-03',count:entries.length,errors,warnings,uniqueSources:new Set(entries.flatMap(e=>e.sources.map(s=>s.url))).size,sourceUses:entries.reduce((n,e)=>n+e.sources.length,0),retrievalStatusCounts:entries.flatMap(e=>e.sources).reduce((a,s)=>(a[s.retrievalStatus]=(a[s.retrievalStatus]||0)+1,a),{}),reviewStatus:entries.reduce((a,e)=>(a[e.reviewStatus]=(a[e.reviewStatus]||0)+1,a),{}),batchSha256:hash(JSON.stringify(batch,null,2)+'\n'),previewSha256:hash(html),frozenLayoutSha256:hash(frozenLayout),normalizedTrialLayoutSha256:hash(normalizedLayout),allowedTemplateTextChanges:['source attribution label','source explanation URL','source explanation link label'],productionActivated:false});
console.log(JSON.stringify({count:entries.length,reviewed:entries.filter(e=>e.reviewStatus==='APPROVE').length,warnings,preview:resolve(dir,'preview.html')}));
