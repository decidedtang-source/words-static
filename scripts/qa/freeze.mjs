import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import crypto from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const hashFile=p=>crypto.createHash('sha256').update(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n')).digest('hex');
export function writeFreeze(base,files,output,metadata){const lock={...metadata,hashMode:'UTF-8 text normalized to LF',files:Object.fromEntries([...new Set(files)].sort().map(p=>[p,hashFile(path.join(base,p))]))};fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(lock,null,2)+'\n',{flag:'wx'});return lock;}
export function verifyFreeze(base=root,file){let expectedVersion;if(!file){const current=JSON.parse(fs.readFileSync(path.join(base,'config/qa/current.json'),'utf8'));file=path.join(base,current.freeze);expectedVersion=current.version;}const lock=JSON.parse(fs.readFileSync(file,'utf8'));if(expectedVersion&&lock.version!==expectedVersion)throw Error('QA current/freeze version mismatch');for(const [p,h]of Object.entries(lock.files))if(hashFile(path.join(base,p))!==h)throw Error('QA frozen file changed: '+p);return {valid:true,version:lock.version,files:Object.keys(lock.files).length};}
function filesUnder(rel){return fs.readdirSync(path.join(root,rel),{withFileTypes:true}).flatMap(e=>e.isDirectory()?filesUnder(rel+'/'+e.name):[rel+'/'+e.name]);}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 if(process.argv[2]==='create'){
  const files=[...filesUnder('scripts/qa'),...filesUnder('word-page'),'scripts/word-content/reading-adapter.mjs','scripts/word-content/contracts.mjs','config/qa/current.json','config/qa/structure-flow-v1.1.json','package.json',...fs.readdirSync(root+'/tests').filter(n=>n.startsWith('qa-')&&n.endsWith('.mjs')).map(n=>'tests/'+n),'docs/roadmap/v10/QA_STRUCTURE_FLOW_V1_PLAN.md','docs/roadmap/v10/QA_CONTENT_QUALITY_CORRECTION_20261116.md','docs/roadmap/v10/QA_STRUCTURE_FLOW_V1_GUIDE.md','docs/roadmap/v10/QA_CONTENT_AMOUNT_V1_1.md'];
  writeFreeze(root,files,root+'/config/qa/freezes/structure-flow-v1.1.json',{version:'structure-flow-v1.1',status:'frozen',authorization:'规划好之后更新并冻结新的qa系统',scope:'structure/workflow and basic content amount; no semantic scoring; dictionary unchanged; no deployment',createdAt:new Date().toISOString()});
 }
 console.log(JSON.stringify(verifyFreeze()));
}
