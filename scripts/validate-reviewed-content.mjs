import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import batchSchema from '../schemas/reviewed-batch.schema.json' with {type:'json'};
import receiptSchema from '../schemas/content-review.schema.json' with {type:'json'};
import {checkSchema} from './schema-check.mjs';
import {STAGES} from '../src/analysis.mjs';
export const jsonBytes=value=>Buffer.from(JSON.stringify(value,null,2)+'\n');
export const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const safeText=value=>{if(typeof value==='string'&&(/<\/?[a-z]|javascript:|https?:\/\/|notion\.so|notion\.site|\bBearer\s|\bsk-[A-Za-z0-9]{12}/i.test(value)))throw Error('Unsafe/private text');if(value&&typeof value==='object')for(const v of Object.values(value))safeText(v);};
export function validateReviewedContent({projectionBytes,receipt,sourceManifest,baseManifest}){
 const errors=[],check=(condition,message)=>{if(!condition)errors.push(message)};let projection;
 try{
  check(projectionBytes.byteLength<=500*1024,'Projection exceeds 500KiB');
  const text=new TextDecoder('utf-8',{fatal:true}).decode(projectionBytes);projection=JSON.parse(text);
  check(Buffer.from(projectionBytes).equals(jsonBytes(projection)),'Projection must be canonical UTF-8 LF bytes');
  checkSchema(projection,batchSchema,'projection',errors);checkSchema(receipt,receiptSchema,'receipt',errors);
  if(errors.length)return {ok:false,errors,coverage:null};
  safeText(projection);
  const candidateHash=sha256(projectionBytes);
  check(candidateHash===receipt.candidateHash&&candidateHash===baseManifest.reviewedProjectionHash,'Stale candidate hash');
  check(projection.batchId===baseManifest.batchId&&projection.baseContentHash===baseManifest.baseContentHash,'Base/batch mismatch');
  check(receipt.sourceSnapshotHash===sourceManifest.snapshotHash&&receipt.sourceSnapshotHash===baseManifest.sourceSnapshotHash,'Source snapshot mismatch');
  check(receipt.sourceManifestHash===sha256(jsonBytes(sourceManifest))&&receipt.sourceManifestHash===baseManifest.sourceManifestHash,'Source manifest changed');
  check(receipt.rulesVersion===baseManifest.rulesVersion,'Rules mismatch');
  check(receipt.writerId===baseManifest.writerId&&receipt.writerId!==receipt.reviewerId,'Writer and reviewer must differ');
  check(!/example-only|placeholder|not.started|template/i.test(receipt.reviewId),'Template is not a review');
  check(receipt.verdict==='APPROVE'&&receipt.privacy==='PASS'&&receipt.rights==='PASS','Review does not approve');
  check(sourceManifest.license==='CC BY 4.0 + Princeton WordNet notice','Unsupported source rights');
  const entries=new Map(sourceManifest.entries.map(e=>[e.id,e])),publicEntries=new Map();
  for(const e of projection.dictionaryEntries){
   check(!publicEntries.has(e.id),'Duplicate dictionary entry');publicEntries.set(e.id,e);
   const source=entries.get(e.id);check(!!source,'Unknown source entry');if(!source)continue;
   for(const key of ['lemma','pos','sourceEntryId','release','source'])check(e[key]===source[key],'Source '+key+' mismatch');
   const seen=new Set();for(const s of e.senses){const original=source.senses.find(x=>x.id===s.id);check(!seen.has(s.id),'Duplicate source sense');seen.add(s.id);check(!!original&&s.definitionEn===original.definitionEn&&equal(s.sourceExamples,original.sourceExamples),'Source sense mismatch');}
  }
  const operations=baseManifest.operations||[],opMap=new Map(operations.map(o=>[o.cardId,o]));
  check(opMap.size===operations.length&&new Set(operations.map(o=>o.selectionId)).size===operations.length,'Duplicate operation/selection');
  const existing=new Map((baseManifest.existingCards||[]).map(w=>[w.id,w])),cards=new Map();
  for(const c of projection.cards){
   check(!cards.has(c.id),'Duplicate card');cards.set(c.id,c);
   const op=opMap.get(c.id);check(!!op&&['add','revise'].includes(op.operation),'Card not in selection allowlist');
   check(c.explanation===c.meaning&&c.examples[0].en===c.example,'Legacy card equality');
   check(c.examples.length===c.exampleKinds.length&&new Set(c.examples.map(e=>e.en)).size===c.examples.length,'Example count/duplicates');
   check(c.exampleKinds.every(k=>k==='generated_example'),'Original quotation requires a separately approved provenance workflow');
   if(op?.operation==='add')check(!existing.has(c.id),'Existing ID cannot be added');
   if(op?.operation==='revise')check(existing.get(c.id)?.term===c.term&&op.semanticChange===false,'Changed recall target needs new identity');
  }
  const analyses=new Map();
  for(const a of projection.analysis){
   check(!analyses.has(a.cardId),'Duplicate analysis');analyses.set(a.cardId,a);
   const op=opMap.get(a.cardId),c=cards.get(a.cardId)||existing.get(a.cardId);check(!!op&&op.operation!=='withdraw'&&!!c,'Unselected analysis');
   check(a.targetText===c?.term,'Analysis target mismatch');
   check(a.context.kind==='generated_example','Unverified original context');
   check(a.copyPayload.displayText===a.targetText&&equal(a.copyPayload.context,a.context),'Copy target/context mismatch');
   check(a.dictionaryEntryIds.every(id=>publicEntries.has(id))&&new Set(a.dictionaryEntryIds).size===a.dictionaryEntryIds.length,'Missing/duplicate dictionary reference');
   const groups=new Set(a.displayGroups.map(g=>g.id));check(groups.size===a.displayGroups.length,'Duplicate display group');
   for(const stage of STAGES){const evidence=a.stageEvidence[stage],verdict=receipt.stages[a.cardId]?.[stage];
    check(evidence.refs.every(ref=>ref==='dictionaryEntryIds'||groups.has(ref)),'Invalid stage reference');
    if(evidence.applicability==='NOT_APPLICABLE')check(!!evidence.reason?.trim()&&verdict==='NOT_APPLICABLE_WITH_REASON','N/A requires reason and review');
    else check(evidence.refs.length>0&&verdict==='PASS','Missing/failed applicable stage');
   }
  }
  for(const op of operations){check(typeof op.selectionId==='string'&&/^[A-Za-z0-9_-]{1,100}$/.test(op.selectionId),'Invalid public selection token');check(op.semanticChange===false,'Semantic change requires new card');check(['add','revise','analysis-only','withdraw'].includes(op.operation),'Unknown operation');
   if(op.operation==='withdraw'){check(existing.has(op.cardId)&&!cards.has(op.cardId)&&!analyses.has(op.cardId),'Invalid withdrawal');}
   else{check(analyses.has(op.cardId),'Missing analysis');if(op.operation==='analysis-only')check(existing.has(op.cardId)&&!cards.has(op.cardId),'Invalid analysis-only operation');}
  }
  check(Object.keys(receipt.stages).length===analyses.size,'Receipt contains unselected stage reviews');
 }catch(e){errors.push(e.message)}
 return {ok:errors.length===0,errors,coverage:errors.length?null:{dictionary:projection.analysis.length,analysis:projection.analysis.length,copy:projection.analysis.length}};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const [projection,receipt,source,manifest]=process.argv.slice(2);
 if(!manifest)throw Error('Usage: validate-reviewed-content.mjs projection.json receipt.json source.json manifest.json');
 const read=p=>JSON.parse(readFileSync(p,'utf8'));
 const result=validateReviewedContent({projectionBytes:readFileSync(projection),receipt:read(receipt),sourceManifest:read(source),baseManifest:read(manifest)});
 console.log(JSON.stringify(result));if(!result.ok)process.exitCode=1;
}
