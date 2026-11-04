import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync,existsSync,unlinkSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {fingerprint} from './core.mjs';
const here=dirname(fileURLToPath(import.meta.url)),dir=resolve(process.argv[2]||'content/trials/dictionary-full-50-20261104'),acceptance=resolve(dir,'evidence/acceptance.json');
if(existsSync(acceptance))unlinkSync(acceptance);
for(const name of ['build-full-dictionary.mjs','check-full-dictionary.mjs']){const r=spawnSync(process.execPath,[resolve(here,name),dir],{stdio:'inherit'});if(r.status!==0)process.exit(r.status||1)}
const read=p=>JSON.parse(readFileSync(resolve(dir,p),'utf8'));
writeFileSync(acceptance,JSON.stringify({status:'READY_FOR_OWNER_REVIEW',content:'PASS',function:'PASS',ruleVersion:'whole-card/2',dictionaryRule:'dictionary-full/1',productionActivated:false,previewHash:fingerprint(readFileSync(resolve(dir,'preview.html'),'utf8')),wholeReportHash:fingerprint(read('whole-card-report.json')),buildHash:fingerprint(read('evidence/build.json')),browserHash:fingerprint(read('evidence/browser.json'))},null,2)+'\n');
