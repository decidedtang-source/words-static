import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
export const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
export const sha=v=>crypto.createHash('sha256').update(typeof v==='string'?v:JSON.stringify(canonical(v))).digest('hex');
export function loadBundles(dir){
 const m=read(path.join(dir,'manifest.json'));
 return m.itemStates.map(i=>{
  const relative=i.artifactPath.replaceAll('\\','/').replace(/\/+/g,'/').split('/entries/')[1];
  if(!relative||relative.split('/').includes('..'))throw Error('Invalid bundle path');
  const b=read(path.join(dir,'entries',relative));
  if(b.snapshot.entryId!==i.entryId||sha(b)!==i.artifactHash)throw Error('Bundle identity/hash mismatch '+i.entryId);
  return b;
 });
}
export const registry=()=>read(root+'/word-page/system.registry.json');
export async function produceAll(bundles,edits,options={}){
 const output={},specs=registry().modules,needed=new Set();
 function include(id){const s=specs.find(s=>s.id===id);if(!s)throw Error('Unknown target module');if(needed.has(id))return;needed.add(id);s.dependencies.forEach(include);}
 if(options.target)include(options.target);else specs.forEach(s=>needed.add(s.id));
 for(const spec of specs.filter(s=>needed.has(s.id))){
  const dir=root+'/word-page/modules/'+spec.id,producer=await import(pathToFileURL(dir+'/produce.mjs'));
  const records=bundles.map(b=>{
   const entryId=b.snapshot.entryId,contextId=b.context.contextId;
   if(b.context.entryId!==entryId||b.context.quote!==b.snapshot.quote||sha(b.context.quote)!==b.context.quoteSHA)throw Error('Input identity mismatch '+entryId);
   const input=Object.fromEntries(spec.inputs.map(k=>[k,b[k]??null]));
   const edit=edits[entryId]?.[spec.id]??null;
   const result=producer.produce(input,edit);
   return {entryId,contextId,inputHash:sha({input,edit}),...result};
  });
  output[spec.id]={moduleId:spec.id,version:spec.version,producerHash:sha(fs.readFileSync(dir+'/produce.mjs','utf8').replace(/\r\n/g,'\n')),contractHash:sha(read(dir+'/production.json')),dependencies:Object.fromEntries(spec.dependencies.map(dep=>[dep,output[dep].outputHash])),entryIds:records.map(r=>r.entryId),records,outputHash:sha(records)};
 }
 if(!options.target)mergeModules(output);return output;
}
export function mergeModules(output){
 const specs=registry().modules,ids=specs.map(s=>s.id),first=output[ids[0]];
 if(!first||Object.keys(output).sort().join()!==[...ids].sort().join())throw Error('Missing/unknown module');
 const keys=first.records.map(r=>r.entryId+'|'+r.contextId);
 if(!keys.length||new Set(keys).size!==keys.length)throw Error('Duplicate/missing identity');
 const words=keys.map(()=>({})),owners={};
 for(const spec of specs){
  const o=output[spec.id];
  const dir=root+'/word-page/modules/'+spec.id,contract=read(dir+'/production.json');
  if(sha(contract)!==sha(spec))throw Error('Registry/contract mismatch '+spec.id);
  if(o.contractHash!==sha(contract)||o.producerHash!==sha(fs.readFileSync(dir+'/produce.mjs','utf8').replace(/\r\n/g,'\n')))throw Error('Stale module fingerprint '+spec.id);
  if(o.moduleId!==spec.id||o.version!==spec.version)throw Error('Module version mismatch');
  if(o.outputHash!==sha(o.records))throw Error('Module output hash mismatch '+spec.id);
  if(Object.keys(o.dependencies).sort().join()!==[...spec.dependencies].sort().join()||spec.dependencies.some(d=>o.dependencies[d]!==output[d].outputHash))throw Error('Stale dependency '+spec.id);
  if(JSON.stringify(o.records.map(r=>r.entryId+'|'+r.contextId))!==JSON.stringify(keys)||JSON.stringify(o.entryIds)!==JSON.stringify(o.records.map(r=>r.entryId)))throw Error('Module identity mismatch');
  for(const field of spec.fields){if(owners[field])throw Error('Duplicate field owner '+field);owners[field]=spec.id;}
  o.records.forEach((r,i)=>{
   if(Object.keys(r.data).sort().join()!==[...spec.fields].sort().join())throw Error('Field ownership mismatch '+spec.id);
   for(const field of spec.fields)if(r.data[field]===undefined)throw Error('Missing field '+field);
   Object.assign(words[i],r.data,{entryId:r.entryId,contextId:r.contextId});
  });
 }
 return words;
}
