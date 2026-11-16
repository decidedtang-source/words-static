import {validateEntity,validateReferences} from './contracts.mjs';import {fingerprintInput} from './workflow.mjs';
export function buildGenerationInput(snapshot,evidence,prompt,practices){if(!snapshot.id||!snapshot.example||!snapshot.quoteSHA)throw Error('snapshot required');if(!evidence.length||!prompt.hash)throw Error('evidence/prompt required');const input={snapshot,evidence,promptHash:prompt.hash,practices};return {...input,inputHash:fingerprintInput(input)};}
export function resolveBridgePlan(context,anchors,evidence){if(context.location==='unresolved')throw Error('unresolved meaning');if(!evidence.length)throw Error('evidence required');return {location:context.location,anchorRefs:anchors,targetRefs:context.senseRefs||[],strategyDecision:'author_and_independent_review_required'};}
export function validateDraft(d,input){const errors=[];if(d.context?.quote!==input.snapshot.example)errors.push('original quote mismatch');if(d.context?.entryId!==input.snapshot.id)errors.push('entry identity mismatch');
 for(const [key,kind]of Object.entries({context:'ContextUse',selection:'LearningSelection',bridge:'BridgeRecord',analysis:'AnalysisRecord',inventory:'SenseInventory',history:'HistoryRecord'}))errors.push(...validateEntity(kind,d[key]).errors.map(e=>key+': '+e));
 for(const s of d.senses||[])errors.push(...validateEntity('Sense',s).errors);errors.push(...validateReferences(d).missingRefs.map(id=>'missing sense '+id));
 if(d.analysis?.promptHash!==input.promptHash)errors.push('promptHash mismatch');
 return {valid:!errors.length,errors};}
