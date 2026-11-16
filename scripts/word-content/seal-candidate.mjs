import fs from 'node:fs';import {sealCandidate,writeRevision} from './workflow.mjs';
export function sealRun(dir,output){const m=JSON.parse(fs.readFileSync(dir+'/manifest.json'));const sealed=sealCandidate(m);writeRevision(output,sealed);return sealed;}
if(process.argv[1]?.endsWith('seal-candidate.mjs'))console.log(sealRun(process.argv[2],process.argv[3]).candidateLock);
