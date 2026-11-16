import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {root,read,loadBundles,sha} from '../system.mjs';
import {validateReceipts} from '../prepare-inputs.mjs';
import {produce as originalDictionary} from '../../../word-page/modules/dictionary/produce.mjs';
import {produceModules} from './assemble.mjs';
import {renderV2} from './render.mjs';
import {verifyV2,inputPath} from './freeze.mjs';
export async function build(run,out){
 const freeze=verifyV2(),bundles=loadBundles(run),inputs=read(root+'/'+inputPath);
 if(fs.existsSync(out)&&!fs.existsSync(out+'/automation-v2.json'))throw Error('Use a new V2 output directory');
 validateReceipts(Object.fromEntries(Object.entries(inputs.entries).map(([id,a])=>[id,a.edits])));
 const {outputs,words}=await produceModules(bundles,inputs);
 const dictionaryUnchanged=outputs.dictionary.records.every((r,i)=>sha(r.data)===sha(originalDictionary(bundles[i]).data));
 if(!dictionaryUnchanged)throw Error('Full dictionary changed');
 const replay=await produceModules(bundles,inputs),reproducible=sha(outputs)===sha(replay.outputs);
 if(!reproducible)throw Error('Module replay changed');
 const examples=Object.values(inputs.entries).flatMap(a=>a.examples),pronunciations=Object.values(inputs.entries).map(a=>a.pronunciation);
 const coverage={entries:words.length,examples:examples.length,exampleOrigins:Object.fromEntries([...new Set(examples.map(e=>e.origin))].map(k=>[k,examples.filter(e=>e.origin===k).length])),pronunciationProviders:Object.fromEntries([...new Set(pronunciations.map(p=>p.provider))].map(k=>[k,pronunciations.filter(p=>p.provider===k).length])),sourceAudio:pronunciations.filter(p=>p.audio).length,systemTTS:pronunciations.filter(p=>!p.audio).length,...inputs.sourceCoverage};
 fs.mkdirSync(out,{recursive:true});fs.writeFileSync(out+'/automation-v2.json',JSON.stringify({version:freeze.version,freeze},null,2));
 for(const [id,data]of Object.entries(outputs)){fs.mkdirSync(out+'/modules/'+id,{recursive:true});fs.writeFileSync(out+'/modules/'+id+'/output.json',JSON.stringify(data,null,2));}
 const browser=await renderV2(words,out),report={version:freeze.version,pass:browser.pagePass&&dictionaryUnchanged&&reproducible,coverage,dictionaryUnchanged,reproducible,freeze,...browser};
 fs.writeFileSync(out+'/report.json',JSON.stringify(report,null,2)+'\n');
 fs.writeFileSync(out+'/assembly.lock.json',JSON.stringify({version:freeze.version,inputHash:sha(inputs),registryHash:sha(read(root+'/word-page/system.registry.v2.json')),modules:Object.fromEntries(Object.entries(outputs).map(([k,v])=>[k,v.outputHash])),htmlSHA:browser.htmlSHA},null,2)+'\n');
 if(!report.pass)throw Error('Page checks failed; see '+out+'/report.json');return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const r=await build(path.resolve(process.argv[2]),path.resolve(process.argv[3]));console.log(JSON.stringify({pass:r.pass,coverage:r.coverage,checks:r.checks.length}));}
