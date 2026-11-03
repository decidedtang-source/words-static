// Complete current-input verification; old acceptance is invalidated before any work.
import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync,existsSync,unlinkSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {fingerprint} from './core.mjs';
const here=dirname(fileURLToPath(import.meta.url));
const dir=resolve(process.argv[2]||'content/trials/five-zone-calibration-20261103');
const acceptance=resolve(dir,'evidence/acceptance.json');
if(existsSync(acceptance))unlinkSync(acceptance);
for(const [script,args] of [['run.mjs',[dir,'--validate-only','--build']],['check-preview.mjs',[dir]]]){
 const run=spawnSync(process.execPath,[resolve(here,script),...args],{stdio:'inherit'});
 if(run.status!==0)process.exit(run.status||1);
}
const read=p=>JSON.parse(readFileSync(resolve(dir,p),'utf8'));
writeFileSync(acceptance,JSON.stringify({status:'READY_FOR_OWNER_REVIEW',content:'PASS',function:'PASS',productionActivated:false,previewHash:fingerprint(readFileSync(resolve(dir,'preview.html'),'utf8')),wholeReportHash:fingerprint(read('whole-card-report.json')),buildHash:fingerprint(read('evidence/build.json')),browserHash:fingerprint(read('evidence/browser.json'))},null,2)+'\n');
