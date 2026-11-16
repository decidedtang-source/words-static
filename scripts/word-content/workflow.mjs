import crypto from 'node:crypto';import fs from 'node:fs';import path from 'node:path';
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
export const fingerprintInput=v=>crypto.createHash('sha256').update(JSON.stringify(canonical(v))).digest('hex');
export const hashArtifact=fingerprintInput;
export const contentQaIds=['Q-H01','Q-S01','Q-S03','Q-N01','Q-D01','Q-D02','Q-L01','Q-L03','Q-L04','Q-Y01','Q-Y03','Q-C01','Q-C02','Q-C03','Q-C04','Q-B01','Q-B02','Q-B04','Q-B05','Q-A01','Q-A02','Q-A03','Q-A04','Q-A05'];
export function checkRunGate(f,a,hold){const reasons=[];if(hold)reasons.push('hold');if(!f.freezeId||!f.planVersion||!f.authorization?.quote)reasons.push('freeze/approval');if(a.freezeId!==f.freezeId||!a.entryIds?.length||!f.authorization?.scope?.includes('trial-24-then-26'))reasons.push('scope');return {allow:!reasons.length,reasons};}
export function transition(item,event,e){
 if(item.state==='accepted')throw Error('accepted immutable');
 const next={...item};
 if(event==='reviewed'){
  if(item.state!=='drafted')throw Error('review requires current draft');
  if(!e.reviewer||e.reviewer===item.author)throw Error('independent reviewer required');
  if(e.scope!=='full_package')throw Error('full_package review required');
  if(e.inputHash!==item.inputHash||e.artifactHash!==item.artifactHash)throw Error('review hash mismatch');
  if(e.verdict!=='pass'||!e.checks?.length||e.checks.some(c=>!['pass','not_applicable'].includes(c.result)))throw Error('complete review required');
  if(contentQaIds.some(id=>!e.checks.some(c=>c.qaId===id&&c.observation&&c.evidencePaths?.length)))throw Error('QA coverage incomplete');
  next.reviewRefs=[e.reviewId];
 }else if(event==='accepted'){if(!e.ownerAcceptance||!e.designPass||!e.engineeringPass||item.state!=='reviewed')throw Error('user acceptance and gates required');}
 else if(event==='drafted'){
  if(item.state!=='evidence_ready'&&item.state!=='needs_revision'&&item.state!=='reviewed')throw Error('evidence required');
  if(item.state!=='evidence_ready'){if(item.revisionAttempts>=2)throw Error('revision limit');next.revisionAttempts=(item.revisionAttempts||0)+1;}
  if(!e.inputHash||!e.artifactHash)throw Error('draft hashes required');Object.assign(next,{inputHash:e.inputHash,artifactHash:e.artifactHash,reviewRefs:[],reviewPaths:[],...(e.inputPath?{inputPath:e.inputPath}:{}),...(e.artifactPath?{artifactPath:e.artifactPath}:{})});
 }else if(event==='evidence_ready'){if(item.state!=='queued'||!e.sourcesVerified)throw Error('source gate');}
 else if(!['needs_revision','blocked_evidence','rejected'].includes(event))throw Error('unknown transition');
 else if(event==='needs_revision'&&!['drafted','reviewed'].includes(item.state))throw Error('only existing draft can need revision');
 if(event==='reviewed'&&e.reviewPath)next.reviewPaths=[e.reviewPath];
 return {...next,state:event};
}
export function writeRevision(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});const temp=file+'.'+crypto.randomUUID()+'.tmp';fs.writeFileSync(temp,JSON.stringify(value,null,2)+'\n',{flag:'wx'});try{fs.linkSync(temp,file);}catch(e){if(e.code==='EEXIST')throw Error('revision exists');throw e;}finally{fs.unlinkSync(temp);}}
export function resumeRun(manifest){for(const i of manifest.itemStates||[]){if(['drafted','reviewed','accepted'].includes(i.state)&&(!i.artifactPath||!i.inputPath))throw Error('resume missing artifacts');if(i.artifactPath&&i.artifactHash!==hashArtifact(JSON.parse(fs.readFileSync(i.artifactPath,'utf8'))))throw Error('resume artifact hash mismatch');if(i.inputPath&&i.inputHash!==fingerprintInput(JSON.parse(fs.readFileSync(i.inputPath,'utf8'))))throw Error('resume input hash mismatch');if(i.state==='reviewed')verifyStoredReview(i);}return structuredClone(manifest);}
export function affectedItems(id,version,index){return index.filter(i=>i.dependencies?.some(d=>d.id===id&&d.version===version)).map(i=>i.entryId);}
export function verifyStoredReview(i){if(!i.reviewPaths?.length)throw Error('missing review files');const valid=i.reviewPaths.some(p=>{const r=JSON.parse(fs.readFileSync(p,'utf8'));try{transition({...i,state:'drafted'},'reviewed',r);return true;}catch{return false;}});if(!valid)throw Error('no valid full review');}
export function sealCandidate(m){if(!m.itemStates?.length)throw Error('candidate count');if(m.itemStates.some(i=>i.state!=='reviewed'||!i.reviewRefs?.length))throw Error('full review required');if(m.phase==='expansion'&&!m.calibrationPassed)throw Error('calibration required');const n=m.phase==='calibration'?24:50;if(m.itemStates.length!==n||new Set(m.itemStates.map(i=>i.entryId)).size!==n)throw Error('candidate count');if(!m.designPass||!m.engineeringPass)throw Error('design/engineering gates');resumeRun(m);return {...m,candidateLock:fingerprintInput(m),accepted:false,published:false};}
export function persistTransition(dir,entryId,event,evidence){
 const lock=path.join(dir,'.state.lock');let fd;try{fd=fs.openSync(lock,'wx');const file=path.join(dir,'manifest.json'),m=JSON.parse(fs.readFileSync(file,'utf8'));const index=m.itemStates.findIndex(i=>i.entryId===entryId);if(index<0)throw Error('unknown entry');const before=m.itemStates[index],after=transition(before,event,evidence);m.itemStates[index]=after;
 const journal={entryId,event,evidence,before,after,manifestHash:fingerprintInput(m)};writeRevision(path.join(dir,'journal',Date.now()+'-'+crypto.randomUUID()+'.json'),journal);const temp=file+'.tmp';fs.writeFileSync(temp,JSON.stringify(m,null,2)+'\n');fs.renameSync(temp,file);return after;
 }finally{if(fd!==undefined){fs.closeSync(fd);fs.unlinkSync(lock);}}
}
