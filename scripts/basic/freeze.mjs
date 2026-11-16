import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {root,read,sha} from '../modules/system.mjs';
import {verifyV2} from '../modules/automation/freeze.mjs';
export const lockPath=root+'/config/module-system/basic-v1.lock.json';
const hash=p=>sha(fs.readFileSync(root+'/'+p,'utf8').replace(/\r\n/g,'\n'));
export function freeze(create=false){
 verifyV2();const paths=[...fs.readdirSync(root+'/scripts/basic').map(f=>'scripts/basic/'+f),'config/qa/basic-release-v1.json','content/basic-release-20261117/roster.json','docs/roadmap/v10/BASIC_RELEASE_100_PLAN_20261117.md','tests/basic-release.test.mjs','public/vocabulary.json'];
 if(create)fs.writeFileSync(lockPath,JSON.stringify({version:'basic-release-1.0.0',authorization:'Owner 2026-11-17: remove context disclosure; freeze as official release; trial 100 words',files:Object.fromEntries(paths.sort().map(p=>[p,hash(p)]))},null,2),{flag:'wx'});
 const lock=read(lockPath),changed=Object.entries(lock.files).filter(([p,h])=>!fs.existsSync(root+'/'+p)||hash(p)!==h).map(([p])=>p);
 if(changed.length)throw Error('Basic workflow changed: '+changed.join(', '));return {version:lock.version,files:Object.keys(lock.files).length,hash:sha(lock)};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(freeze(process.argv[2]==='create')));
