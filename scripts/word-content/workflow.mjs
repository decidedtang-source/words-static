import crypto from 'node:crypto';import fs from 'node:fs';import path from 'node:path';
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
export const fingerprintInput=v=>crypto.createHash('sha256').update(JSON.stringify(canonical(v))).digest('hex');
export const hashArtifact=fingerprintInput;
export function checkRunGate(f,a,hold){const reasons=[];if(hold)reasons.push('hold');if(!f.freezeId||!f.planVersion||!f.authorization?.quote)reasons.push('freeze/approval');if(a.freezeId!==f.freezeId||!a.entryIds?.length||!f.authorization?.scope?.includes('trial-24-then-26'))reasons.push('scope');return {allow:!reasons.length,reasons};}
export function transition(item,event,e){
 if(item.state==='accepted')throw Error('accepted immutable');
 const next={...item};
 if(event==='reviewed'){
  if(item.state!=='drafted'&&item.state!=='needs_revision')throw Error('review requires draft');
  if(!e.reviewer||e.reviewer===item.author)throw Error('independent reviewer required');
  if(e.scope!=='full_package')throw Error('full_package review required');
  if(e.inputHash!==item.inputHash||e.artifactHash!==item.artifactHash)throw Error('review hash mismatch');
  if(e.verdict!=='pass'||!e.checks?.length||e.checks.some(c=>!['pass','not_applicable'].includes(c.result)))throw Error('complete review required');
  next.reviewRefs=[e.reviewId];
 }else if(event==='accepted'){if(!e.ownerAcceptance||!e.designPass||!e.engineeringPass||item.state!=='reviewed')throw Error('user acceptance and gates required');}
 else if(event==='drafted'){
  if(item.state!=='evidence_ready'&&item.state!=='needs_revision'&&item.state!=='reviewed')throw Error('evidence required');
  if(item.state!=='evidence_ready'){if(item.revisionAttempts>=2)throw Error('revision limit');next.revisionAttempts=(item.revisionAttempts||0)+1;}
  if(!e.inputHash||!e.artifactHash)throw Error('draft hashes required');Object.assign(next,{inputHash:e.inputHash,artifactHash:e.artifactHash,reviewRefs:[]});
 }else if(event==='evidence_ready'){if(item.state!=='queued'||!e.sourcesVerified)throw Error('source gate');}
 else if(!['needs_revision','blocked_evidence','rejected'].includes(event))throw Error('unknown transition');
 return {...next,state:event};
}
export function writeRevision(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});const temp=file+'.'+crypto.randomUUID()+'.tmp';fs.writeFileSync(temp,JSON.stringify(value,null,2)+'\n',{flag:'wx'});try{fs.linkSync(temp,file);}catch(e){if(e.code==='EEXIST')throw Error('revision exists');throw e;}finally{fs.unlinkSync(temp);}}
export function resumeRun(manifest){for(const i of manifest.itemStates||[])if(i.artifactPath&&i.artifactHash!==hashArtifact(JSON.parse(fs.readFileSync(i.artifactPath,'utf8'))))throw Error('resume artifact hash mismatch');return structuredClone(manifest);}
export function affectedItems(id,version,index){return index.filter(i=>i.dependencies?.some(d=>d.id===id&&d.version===version)).map(i=>i.entryId);}
export function sealCandidate(m){if(m.itemStates.some(i=>i.state!=='reviewed'||!i.reviewRefs?.length))throw Error('full review required');if(m.phase==='expansion'&&!m.calibrationPassed)throw Error('calibration required');return {...m,candidateLock:fingerprintInput(m),accepted:false,published:false};}
