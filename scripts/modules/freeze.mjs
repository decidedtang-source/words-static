import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {root,sha,read} from './system.mjs';
const lockfile=root+'/config/module-system/front-v1.lock.json';
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(d=>d.isDirectory()?files(path.join(dir,d.name)):[path.join(dir,d.name)]);}
const fingerprint=f=>sha(fs.readFileSync(f,'utf8').replace(/^\uFEFF/,'').replace(/\r\n/g,'\n'));
export function verifyFreeze(){
 const lock=read(lockfile),changed=Object.entries(lock.files).filter(([f,h])=>!fs.existsSync(root+'/'+f)||fingerprint(root+'/'+f)!==h).map(([f])=>f);
 if(changed.length)throw Error('Unfrozen module-system changes: '+changed.join(', '));
 return {version:lock.version,files:Object.keys(lock.files).length,changed};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
if(process.argv[2]==='create'){
 const paths=[...files(root+'/scripts/modules'),...files(root+'/word-page'),...files(root+'/content/module-inputs/front-50-20261116'),root+'/tests/module-system.test.mjs',root+'/docs/roadmap/v10/MODULAR_FRONT_SYSTEM_PLAN.md',root+'/docs/roadmap/v10/MODULAR_FRONT_SYSTEM_GUIDE.md'];
 fs.mkdirSync(path.dirname(lockfile),{recursive:true});fs.writeFileSync(lockfile,JSON.stringify({version:'front-system-1.0.0',scope:{analysis:'pending_build',dictionary:'interface_only'},files:Object.fromEntries(paths.sort().map(f=>[path.relative(root,f).replaceAll('\\','/'),fingerprint(f)]))},null,2)+'\n',{flag:'wx'});console.log('Created '+lockfile);
}else{
 console.log(JSON.stringify(verifyFreeze()));
}
}
