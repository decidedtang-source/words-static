import {produce as previous} from './produce.mjs';
export function produce(input){
 const result=previous(input),a=input.automation;
 result.data.senses=result.data.senses.map((row,i)=>{
  const id=input.selection.senses[i].senseId,e=a.examples.find(e=>e.senseId===id);
  if(!e?.en||!e.zh)throw Error('Missing sourced learning example '+id);
  return {...row,definitionSourceURL:row.url,example:e.en,zh:e.zh,credit:e.origin==='original'?'原创教学补充':e.provider+' · 来源用例',exampleOrigin:e.origin,exampleSourceURL:e.url,exampleSourceId:e.id,translationOrigin:'AI中文整理'};
 });
 result.provenance={...result.provenance,aiTaskHash:a.taskHash,examples:a.examples.map(e=>({senseId:e.senseId,candidateId:e.id,origin:e.origin,url:e.url,locator:e.locator||null,sourceHash:e.sourceHash||null}))};return result;
}
