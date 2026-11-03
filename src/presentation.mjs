import schema from '../schemas/presentation.schema.json' with {type:'json'};
import {checkSchema} from '../scripts/schema-check.mjs';
export function resolvePresentation({card,analysis,catalog}){
 const allEntries=(catalog?.entries||[]).filter(e=>analysis?.dictionaryEntryIds?.includes(e.id));
 const fallback={status:'legacy',displayGloss:card?.gloss||card?.meaning||'',glossKind:null,contextTakeaway:'',focused:[],allEntries,diagnostic:'本句词典义项待核'};
 if(!analysis?.presentation)return fallback;
 const p=analysis.presentation,errors=[];checkSchema(p,schema,'presentation',errors);
 if(analysis.cardId!==card?.id||analysis.targetText!==card?.term)errors.push('Identity mismatch');
 const focused=[],seen=new Set();if(!errors.length)for(const ref of p.contextSenseRefs){const key=ref.entryId+'\0'+ref.senseId,entry=allEntries.find(e=>e.id===ref.entryId),sense=entry?.senses.find(s=>s.id===ref.senseId);if(!sense||seen.has(key))errors.push('Missing or duplicate sense');else focused.push({entry,sense,role:ref.role});seen.add(key)}
 if(errors.length)return {...fallback,status:'unavailable',diagnostic:'当前义项绑定不可用，未自动替换'};
 return {status:'reviewed',displayGloss:p.displayGloss,glossKind:p.glossKind,contextTakeaway:p.contextTakeaway,focused,allEntries,diagnostic:''};
}
