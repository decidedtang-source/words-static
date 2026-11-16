import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {root,read,sha} from '../system.mjs';
export async function produceModules(bundles,inputs){
 const registry=read(root+'/word-page/system.registry.v2.json'),outputs={};
 if(Object.keys(inputs.entries).length!==bundles.length)throw Error('Input entry set mismatch');
 for(const spec of registry.modules){
  const contract=read(root+'/word-page/modules/'+spec.id+'/production'+(spec.version==='2.0.0'?'-v2':'')+'.json');
  const {producer:producerPath,...expected}=spec;if(sha(contract)!==sha(expected))throw Error('Module contract mismatch '+spec.id);
  const producer=await import(pathToFileURL(root+'/'+spec.producer));
  const records=bundles.map(b=>{
   const a=inputs.entries[b.snapshot.entryId];if(!a||b.context.entryId!==b.snapshot.entryId||b.context.quote!==b.snapshot.quote||sha(b.context.quote)!==b.context.quoteSHA)throw Error('Context identity mismatch');
   if(a.bundleHash!==sha(b))throw Error('Bundle identity changed; prepare a new AI task');
   const input=Object.fromEntries(spec.inputs.map(k=>[k,b[k]??null]));
   if(spec.id==='headword')input.automation={pronunciation:a.pronunciation};
   if(spec.id==='learning')input.automation={examples:a.examples,taskHash:a.taskHash};
   const edit=a.edits[spec.id]??null,result=producer.produce(input,edit);
   if(Object.keys(result.data).sort().join()!==[...spec.fields].sort().join())throw Error('Field owner mismatch '+spec.id);
   return {entryId:b.snapshot.entryId,contextId:b.context.contextId,inputHash:sha({input,edit}),...result};
  });
  outputs[spec.id]={moduleId:spec.id,version:spec.version,producerHash:sha(fs.readFileSync(root+'/'+spec.producer,'utf8').replace(/\r\n/g,'\n')),dependencies:Object.fromEntries(spec.dependencies.map(d=>[d,outputs[d].outputHash])),records,outputHash:sha(records)};
 }
 const words=bundles.map((b,i)=>Object.assign({entryId:b.snapshot.entryId},...registry.modules.map(s=>outputs[s.id].records[i].data)));
 const seen=new Set();for(const s of registry.modules)for(const f of s.fields){if(seen.has(f))throw Error('Duplicate field owner');seen.add(f);}
 return {outputs,words};
}
