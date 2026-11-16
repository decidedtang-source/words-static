export function normalizeSource(raw,capability){
 if(raw.status>=400)throw Error('Source access '+raw.status);
 if(!capability.rights||!['page','indexed_excerpt','licensed_snapshot','user_material'].includes(capability.accessMode))throw Error('Source rights/accessMode required');
 if(!raw.id||!raw.title||!raw.version||!raw.url)throw Error('Source identity required');
 return {schemaVersion:1,sourceId:raw.id,version:raw.version,title:raw.title,url:raw.url,accessMode:capability.accessMode,retrievedAt:new Date().toISOString(),coverage:capability.accessMode==='indexed_excerpt'?'partial':(raw.coverage||'partial'),rights:capability.rights,limitations:raw.limitations||[],claims:raw.claims||[],claimScope:capability.claimScope||'entry',sourceDate:raw.sourceDate||null};
}
export function mapSense(entry,locator){if(!locator)throw Error('sense locator required');const sense=entry.senses?.find(s=>s.sourceSenseId===locator||s.id===locator);if(!sense)throw Error('sense locator not found');return {sourceId:entry.id,locator,sense};}
export function assessCoverage(source,claims,requested='partial'){
 const missing=claims.filter(c=>!source.claims.includes(c));const full=requested!=='complete'||source.coverage==='complete'&&source.accessMode!=='indexed_excerpt';
 const whole=requested!=='technical_whole'||source.claimScope==='whole';return {valid:!missing.length&&full&&whole,missing,full,whole};
}
export function checkEvidenceBindings(bundle,oewn,web){
 for(const sense of bundle.senses||[]){if(sense.definitionOrigin==='licensed_verbatim'){const actual=oewn.rows.flatMap(r=>r.entries).flatMap(e=>e.senses).find(s=>s.sourceSenseId===sense.senseId);if(!actual||actual.definitions.join('; ')!==sense.meaning.definitionEn)throw Error('source changed '+sense.senseId);}else if(sense.definitionOrigin==='short_quote'){const ref=sense.sourceRefs[0],record=web.records.find(r=>r.id===ref.sourceId);if(!record||record.quote!==sense.meaning.definitionEn)throw Error('source changed '+sense.senseId);}}
 const refs=[...(bundle.senses||[]).flatMap(s=>s.sourceRefs),...(bundle.history?.sourceRefs||[]),...(bundle.bridge?.evidenceRefs||[])];
 for(const ref of refs.filter(r=>r.sourceId!=='oewn-2025')){const record=web.records.find(r=>r.id===ref.sourceId);if(!record||record.claim!==ref.supportedClaim||record.locator!==ref.locator||record.url!==ref.url)throw Error('source changed '+ref.sourceId);}
 return true;
}
