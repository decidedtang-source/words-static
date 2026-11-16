const text=v=>typeof v==='string'&&v.trim().length>0;
export function produce({selection:s,senses,sources}){
 if(!text(s.general)||!s.senses?.length)throw Error('Missing learning senses');
 const sourceIds=new Set(sources.map(x=>x.sourceId));
 const rows=s.senses.map(x=>{
  const original=senses.find(y=>y.senseId===x.senseId),e=x.examples?.[0];
  if(!original||![x.title,original.meaning?.definitionEn,e?.en,e?.zh].every(text))throw Error('Missing learning definition/example text');
  if(!x.evidenceRefs?.length||!x.evidenceRefs.every(r=>sourceIds.has(r.sourceId)))throw Error('Missing learning source reference');
  return {title:x.title,en:original.meaning.definitionEn,meta:x.usageLabels.join(' · '),example:e.en,zh:e.zh,credit:e.credit||(e.origin==='original'?'原创教学例句':'来源例句'),url:e.sourceRef?.url||x.evidenceRefs[0].url||'https://en-word.net/'};
 });
 return {status:'ready',data:{general:s.general,senses:rows,note:s.usageTip||s.reason,retrieved:'2026-11-16',retrieval:'versioned source cache',learningSource:'词义见各项来源；中文整理／例句来源分别标注'},provenance:{sourceIds:[...sourceIds],selectionVersion:s.version}};
}
