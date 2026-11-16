import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {root,read,sha} from '../system.mjs';
import {verifyFreeze as verifyV1} from '../freeze.mjs';
export const inputPath='content/module-inputs/front-auto-50-20261116/inputs.json';
export const lockPath='config/module-system/front-v2.lock.json';
const fingerprint=p=>sha(fs.readFileSync(root+'/'+p,'utf8').replace(/^\uFEFF/,'').replace(/\r\n/g,'\n'));
const walk=dir=>fs.readdirSync(root+'/'+dir,{withFileTypes:true}).flatMap(f=>f.isDirectory()?walk(dir+'/'+f.name):[dir+'/'+f.name]);
export function verifyV2(){
 const base=verifyV1(),lock=read(root+'/'+lockPath);
 const changed=Object.entries(lock.files).filter(([p,h])=>!fs.existsSync(root+'/'+p)||fingerprint(p)!==h).map(([p])=>p);
 if(changed.length)throw Error('V2 frozen files changed: '+changed.join(', '));
 return {version:lock.version,files:Object.keys(lock.files).length,baseFiles:base.files,lockHash:sha(lock)};
}
export function createFreeze(){
 verifyV1();
 const files=[...walk('scripts/modules/automation'),'word-page/system.registry.v2.json',...walk('word-page/modules').filter(f=>/v2/.test(f)),inputPath,'tests/module-automation.test.mjs','docs/roadmap/v10/FRONT_AUTOMATION_V2_GUIDE.md','config/module-system/front-v1.lock.json'];
 const lock={version:'front-system-2.0.0',base:'front-system-1.0.0',scope:{dictionary:'unchanged',analysis:'pending_build'},inputPath,files:Object.fromEntries(files.sort().map(p=>[p,fingerprint(p)]))};
 fs.writeFileSync(root+'/'+lockPath,JSON.stringify(lock,null,2)+'\n',{flag:'wx'});return verifyV2();
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(process.argv[2]==='create'?createFreeze():verifyV2()));
