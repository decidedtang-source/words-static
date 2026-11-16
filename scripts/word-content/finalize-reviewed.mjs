import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
import {verifyRun} from './prepare-run.mjs';import {verifyCalibration,reviewedBundles} from './trial-io.mjs';import {sealCandidate,writeEquivalent} from './workflow.mjs';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
export function finalizeReviewed(dir){
 const {s,root}=verifyRun(dir),calibration=verifyCalibration(dir),ids=[...s.calibration,...s.expansion];reviewedBundles(dir,ids);
 const out=path.join(dir,'candidate-all'),lock=read(out+'/candidate-lock.json'),engineering=read(out+'/engineering.json'),design=read(out+'/design.json'),manifest=read(dir+'/manifest.json');
 if(lock.phase!=='all'||lock.entryIds.length!==50||ids.some(id=>!lock.entryIds.includes(id)))throw Error('candidate selection mismatch');
 if(sha(out+'/index.html')!==lock.htmlSHA||design.htmlSHA!==lock.htmlSHA||engineering.htmlSHA!==lock.htmlSHA)throw Error('candidate HTML changed');
 for(const [p,h]of Object.entries(lock.files))if(sha(path.join(root,p))!==h)throw Error('candidate dependency changed '+p);
 for(const [p,h]of Object.entries(lock.distributionFiles))if(sha(path.join(out,p))!==h)throw Error('distribution changed '+p);
 if(engineering.status!=='pass'||engineering.observations.length!==200||engineering.observations.some(o=>o.status!=='pass')||design.status!=='pass'||!design.baselineFilesUnchanged||design.checks.length!==48)throw Error('candidate QA incomplete');
 const renderCases=new Set(engineering.observations.map(o=>o.width+':'+o.index));for(const width of [320,390,768,1440])for(let i=0;i<50;i++)if(!renderCases.has(width+':'+i))throw Error('missing render case');
 const designCases=new Set(design.checks.filter(o=>o.audioKeyboardStartStopEndError==='pass'&&o.bridgeReturn==='pass'&&o.deep==='pass'&&o.layoutShift===0).map(o=>o.width+':'+o.colorScheme+':'+o.index));for(const width of [320,390,768,1440])for(const theme of ['light','dark'])for(const i of ['0','5','10','20','39','47'])if(!designCases.has(width+':'+theme+':'+i))throw Error('missing design case');
 if(design.entryChecks.length!==50||ids.some(id=>!design.entryChecks.some(e=>e.entryId===id&&e.quoteAndTranslation==='pass'&&e.previewToggle==='pass'&&e.legacyContextAlias==='pass')))throw Error('missing entry design check');
 for(const p of lock.packages){const i=manifest.itemStates.find(i=>i.entryId===p.entryId);if(!i||i.inputHash!==p.inputHash||i.artifactHash!==p.artifactHash||JSON.stringify(i.reviewRefs)!==JSON.stringify(p.reviewRefs))throw Error('candidate package changed');}
 if(lock.packages.length!==50)throw Error('candidate package count');
 const sealed=sealCandidate({...manifest,phase:'expansion',calibrationPassed:Boolean(calibration.candidateLock),designPass:true,engineeringPass:true});
 const receipt={...sealed,qaEvidence:{design:{path:path.resolve(out+'/design.json'),sha256:sha(out+'/design.json')},engineering:{path:path.resolve(out+'/engineering.json'),sha256:sha(out+'/engineering.json')}},renderLockSHA:sha(out+'/candidate-lock.json'),counts:{selected:50,drafted:50,fullPackageReviewed:50,accepted:0,published:0},scope:'isolated trial; not learner acceptance or publication'};
 writeEquivalent(dir+'/final-candidate.json',receipt);return receipt.counts;
}
if(process.argv[1]?.endsWith('finalize-reviewed.mjs'))console.log(JSON.stringify(finalizeReviewed(process.argv[2])));
