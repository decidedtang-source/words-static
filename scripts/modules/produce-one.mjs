import fs from 'node:fs';
import path from 'node:path';
import {root,read,loadBundles,produceAll} from './system.mjs';
import {validateReceipts} from './prepare-inputs.mjs';
import {verifyFreeze} from './freeze.mjs';
const [id,input,editsFile,output]=process.argv.slice(2);
if(!id||!input||!editsFile||!output)throw Error('Usage: node scripts/modules/produce-one.mjs MODULE RUN EDITS_JSON NEW_OUTPUT');
verifyFreeze();
const out=path.resolve(output);
if(!out.startsWith(path.join(root,'content','module-runs')+path.sep)||fs.existsSync(out))throw Error('Use new output under content/module-runs');
const edits=read(path.resolve(editsFile));
// Validate history evidence only when this module actually needs it.
if(['history','bridge','analysis'].includes(id))validateReceipts(edits);
const outputs=await produceAll(loadBundles(path.resolve(input)),edits,{target:id});
fs.mkdirSync(out,{recursive:true});
for(const [name,records]of Object.entries(outputs))fs.writeFileSync(out+'/'+name+'.json',JSON.stringify(records,null,2)+'\n');
console.log(JSON.stringify({target:id,produced:Object.keys(outputs),output:out}));
