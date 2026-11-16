import fs from 'node:fs';
import path from 'node:path';
import {root,read,loadBundles,produceAll,mergeModules,sha,registry} from './system.mjs';
import {renderAndCheck} from './render.mjs';
import {validateReceipts} from './prepare-inputs.mjs';
import {verifyFreeze} from './freeze.mjs';
const [command,run,editsFile,outputArg]=process.argv.slice(2);
if(!['check','build'].includes(command)||!run||!editsFile)throw Error('Usage: node scripts/modules/cli.mjs check|build INPUT_RUN EDITS_JSON [NEW_OUTPUT]');
const bundles=loadBundles(path.resolve(run)),edits=read(path.resolve(editsFile));
validateReceipts(edits);
const outputs=await produceAll(bundles,edits),words=mergeModules(outputs);
const pending=Object.values(outputs).filter(o=>o.moduleId!=='analysis').flatMap(o=>o.records.filter(r=>!['ready','interface_only'].includes(r.status)).map(r=>({moduleId:o.moduleId,entryId:r.entryId,status:r.status})));
const report={systemVersion:registry().version,scope:registry().scope,selected:words.length,structurePass:true,frontFlowComplete:pending.length===0,fullSystemComplete:false,analysis:'pending_build',pending,contentQuality:'not_scored',published:false};
if(command==='build'){
 verifyFreeze();
 if(!outputArg)throw Error('NEW_OUTPUT required');const out=path.resolve(outputArg),parent=path.join(root,'content','module-runs');
 if(!out.startsWith(parent+path.sep)||fs.existsSync(out))throw Error('Output must be a new directory under content/module-runs');
 fs.mkdirSync(out,{recursive:true});
 for(const [id,data]of Object.entries(outputs)){fs.mkdirSync(out+'/'+id);fs.writeFileSync(out+'/'+id+'/records.json',JSON.stringify(data,null,2)+'\n');}
 const page=await renderAndCheck(words,out);Object.assign(report,page,{previewReady:page.pagePass,frontProductionComplete:page.pagePass&&report.frontFlowComplete});
 fs.writeFileSync(out+'/report.json',JSON.stringify(report,null,2)+'\n');
 fs.writeFileSync(out+'/assembly.lock.json',JSON.stringify({systemVersion:registry().version,registrySHA:sha(registry()),inputRun:path.relative(root,path.resolve(run)).replaceAll('\\','/'),editsPath:path.relative(root,path.resolve(editsFile)).replaceAll('\\','/'),editsSHA:sha(edits),moduleHashes:Object.fromEntries(Object.entries(outputs).map(([id,o])=>[id,o.outputHash])),htmlSHA:page.htmlSHA},null,2)+'\n');
 console.log(JSON.stringify({output:out,selected:words.length,pagePass:page.pagePass,frontProductionComplete:report.frontProductionComplete,pending},null,2));if(!page.pagePass)process.exitCode=1;
}else console.log(JSON.stringify(report,null,2));
