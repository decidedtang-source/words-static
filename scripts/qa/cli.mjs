import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {checkRun,root} from './structure-flow.mjs';import {verifyFreeze} from './freeze.mjs';import {checkPage} from './page.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
export function reserveOutput(output){const p=path.resolve(output);for(const folder of ['content','word-page','public','src','config','scripts']){const protectedPath=path.resolve(root,folder),rel=path.relative(protectedPath,p);if(rel===''||(!rel.startsWith('..'+path.sep)&&rel!=='..'&&!path.isAbsolute(rel)))throw Error('protected output path');}if(fs.existsSync(p))throw Error('output exists; choose a new revision directory');fs.mkdirSync(p,{recursive:true});return p;}
export function combineResults(report,page){const previewReady=report.structurePass&&page?.pass===true;return {...report,page,pageStatus:page?'checked':'not_run',previewReady,productionComplete:previewReady&&report.flowComplete&&report.contentAmountPass===true,accepted:false,published:false};}
export async function execute(command,dir,argument){verifyFreeze();const r=checkRun(dir);if(command==='check')return r;const m=read(path.resolve(dir,'manifest.json')),bundles=m.itemStates.map(i=>read(path.resolve(dir,i.artifactPath)));
 if(command==='page'){if(!argument)throw Error('page requires HTML path');return combineResults(r,await checkPage(argument,bundles));}
 if(command==='preview'){
  if(!r.structurePass)return combineResults(r,null);if(!argument)throw Error('preview requires new output directory');
  const output=reserveOutput(argument);
  // Legacy renderer only; deliberately no reviewedBundles / semantic reviewer gate.
  const {renderCandidate}=await import('../../word-page/check-v10-conformance.mjs');await renderCandidate(bundles,output,{structureOnly:true});
  const result=combineResults(r,await checkPage(output+'/index.html',bundles));fs.writeFileSync(output+'/qa-report.json',JSON.stringify(result,null,2));fs.writeFileSync(output+'/README.md','# 结构与流程QA预览\n\n本页没有重新生成内容。资料步骤待补见qa-report.json；结构通过不代表教学质量已审定，不代表发布。\n');return {...result,output};
 }
 throw Error('usage: check RUN | page RUN HTML | preview RUN NEW_OUTPUT');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{const r=await execute(process.argv[2],process.argv[3],process.argv[4]);console.log(JSON.stringify(r,null,2));if(!r.structurePass||r.page?.pass===false)process.exitCode=1;}catch(e){console.error(e.message);process.exitCode=1;}}
