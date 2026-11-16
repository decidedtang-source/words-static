import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {checkRunGate,fingerprintInput,writeRevision} from './workflow.mjs';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export function verifyRun(dir){const f=JSON.parse(fs.readFileSync(dir+'/authorization.json')),s=JSON.parse(fs.readFileSync(dir+'/selected.json'));const ids=[...s.calibration,...s.expansion];const gate=checkRunGate(f,{freezeId:f.freezeId,entryIds:ids},f.hold);if(!gate.allow)throw Error(gate.reasons.join(';'));
 const root=path.resolve(dir,'../../../../..');const plan=path.join(root,'docs/roadmap/v10/full-plan-r2');
 if(sha(fs.readFileSync(dir+'/selected.json'))!==f.selectionSHA)throw Error('selection frozen hash');
 if(sha(fs.readFileSync(plan+'/plan-manifest.json'))!==f.planManifestSHA)throw Error('plan manifest hash');
 for(const file of f.planFiles)if(sha(fs.readFileSync(path.join(plan,file.path)))!==file.sha256)throw Error('plan file hash '+file.path);
 const baseline=JSON.parse(fs.readFileSync(dir+'/baseline-manifest.json'));if(sha(fs.readFileSync(root+'/public/vocabulary.json'))!==baseline.vocabularySHA)throw Error('vocabulary changed');
 for(const w of s.snapshots)if(sha(Buffer.from(w.example))!==w.quoteSHA)throw Error('quote changed');
 return {f,s,ids,root};}
export function prepareRun(dir){const {f,s,ids}=verifyRun(dir);
 if(ids.length!==50||new Set(ids).size!==50||s.calibration.length!==24)throw Error('sample mismatch');
 const manifest={schemaVersion:1,batchId:'r2-50-20261116',planFreezeId:f.freezeId,runAuthorizationRef:'authorization.json',entryIds:ids,itemStates:ids.map(entryId=>({entryId,contextId:entryId+'-context',revision:0,state:'queued',inputHash:null,artifactHash:null,reviewRefs:[],blockers:[],revisionAttempts:0,author:'root assistant'})),dependencies:{selectionHash:fingerprintInput(s)},moduleLocks:{},metrics:{cost:null,costReason:'tool/model billing not available per entry'},phase:'calibration',calibrationPassed:false};
 if(fs.existsSync(dir+'/manifest.json'))throw Error('run exists; resume explicitly');writeRevision(dir+'/manifest.json',manifest);return manifest;}
if(process.argv[1]?.endsWith('prepare-run.mjs'))console.log(JSON.stringify(prepareRun(process.argv[2])));
