import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
export const root=path.dirname(fileURLToPath(import.meta.url));
const read=(file)=>fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const json=file=>JSON.parse(read(file));
const hash=value=>crypto.createHash('sha256').update(typeof value==='string'?value:JSON.stringify(value)).digest('hex');
export function loadPage(base=root){
 const registry=json(path.join(base,'registry.json')),modules={};
 for(const entry of registry.modules){
  if(!/^[a-z-]+$/.test(entry.id)||modules[entry.id])throw Error('Invalid/duplicate module id');
  const dir=path.join(base,'modules',entry.id),optional=name=>fs.existsSync(path.join(dir,name))?read(path.join(dir,name)):'';
  modules[entry.id]={contract:json(path.join(dir,'interface.json')),content:json(path.join(dir,'content.json')),view:read(path.join(dir,'view.html')),behavior:optional('behavior.js'),footer:optional('footer.html'),sidebar:optional('sidebar.html'),bottom:optional('bottom.html'),process:read(path.join(dir,'PROCESS.md'))};
 }
 return {registry,modules,shell:read(path.join(base,'shell.html')),theme:read(path.join(base,'theme.css')),sources:json(path.join(base,'sources.json')),engine:[read(path.join(base,'manage.mjs')),read(path.join(base,'build.mjs'))]};
}
export function validateModules(p){
 const ids=p.registry.wordIds,owners={};
 if(!ids.length||new Set(ids).size!==ids.length)throw Error('Duplicate/missing word IDs');
 for(const [id,m]of Object.entries(p.modules)){
  if(m.contract.id!==id)throw Error('Contract id mismatch: '+id);
  for(const dep of m.contract.dependencies)if(!p.modules[dep]||dep===id)throw Error('Invalid dependency: '+id);
  for(const field of Object.keys(m.contract.fields)){if(owners[field])throw Error('Duplicate field owner: '+field);owners[field]=id;}
  if(JSON.stringify(Object.keys(m.content).sort())!==JSON.stringify([...ids].sort()))throw Error('Word set mismatch: '+id);
  for(const word of ids){
   const row=m.content[word];
   for(const key of Object.keys(row))if(!(key in m.contract.fields))throw Error('unexpected field: '+id+'.'+key);
   for(const [key,type]of Object.entries(m.contract.fields)){
    const value=row[key];const ok=type==='array'?Array.isArray(value):type==='nullable-string'?(typeof value==='string'||value===null):type==='string'&&typeof value==='string';
    if(!ok)throw Error('Invalid '+id+'.'+word+'.'+key);
    if(key==='senses'){
     if(!value.length)throw Error('Empty senses');
     for(const sense of value)for(const f of ['title','en','example','zh','meta','credit','url'])if(typeof sense[f]!=='string'||!sense[f])throw Error('Invalid sense '+f);
    }
   }
  }
 }
 const visiting=new Set(),done=new Set();
 function visit(id){if(visiting.has(id))throw Error('Cyclic dependency');if(done.has(id))return;visiting.add(id);p.modules[id].contract.dependencies.forEach(visit);visiting.delete(id);done.add(id);}
 Object.keys(p.modules).forEach(visit);
 return ids.map(id=>{const w=Object.assign({},...Object.values(p.modules).map(m=>m.content[id]));if(w.word!==id)throw Error('Headword identity mismatch');return w;});
}
export function affectedModules(p,id){
 const affected=new Set([id]);let added=true;
 while(added){added=false;for(const [key,m]of Object.entries(p.modules))if(!affected.has(key)&&m.contract.dependencies.some(d=>affected.has(d))){affected.add(key);added=true;}}
 return [...affected].filter(x=>x!==id);
}
export function makeLock(p){
 validateModules(p);const modules={};
 for(const entry of p.registry.modules){const m=p.modules[entry.id];modules[entry.id]={versions:{content:entry.contentVersion,view:entry.viewVersion,process:entry.processVersion,interface:m.contract.version},hashes:{content:hash(m.content),view:hash([m.view,m.behavior,m.footer,m.sidebar,m.bottom]),process:hash(m.process),interface:hash(m.contract)}};}
 for(const [id,m]of Object.entries(p.modules))modules[id].inputs=Object.fromEntries(m.contract.dependencies.map(dep=>[dep,{content:modules[dep].hashes.content,interface:modules[dep].hashes.interface}]));
 return {release:p.registry.release,registry:hash(p.registry),shared:{version:p.registry.sharedVersion,hash:hash([p.shell,p.theme,p.sources,p.engine])},modules};
}
export function checkLock(p,lock){
 const current=makeLock(p),changes=[];
 for(const [id,m]of Object.entries(current.modules)){
  for(const part of Object.keys(m.hashes))if(m.hashes[part]!==lock.modules[id]?.hashes[part])changes.push(id+':'+part);
  if(JSON.stringify(m.inputs)!==JSON.stringify(lock.modules[id]?.inputs))changes.push(id+':inputs-review');
 }
 for(const id of Object.keys(lock.modules))if(!current.modules[id])changes.push(id+':removed');
 if(current.shared.hash!==lock.shared.hash)changes.push('shared');
 if(current.registry!==lock.registry)changes.push('registry');
 return changes;
}
export function assemble(p){
 const words=validateModules(p);
 const template=p.shell.replace(/@@(VIEW|BEHAVIOR|FOOTER|SIDEBAR|BOTTOM):([a-z-]+)@@/g,(_,kind,id)=>{if(!p.modules[id])throw Error('Unknown view module '+id);return p.modules[id][{VIEW:'view',BEHAVIOR:'behavior',FOOTER:'footer',SIDEBAR:'sidebar',BOTTOM:'bottom'}[kind]];}).replace('@@THEME@@',p.theme);
 if(template.includes('@@'))throw Error('Unresolved assembly placeholder');
 return {words,template};
}
export function verifyGenerated(base=root){
 const p=loadPage(base),lock=json(path.join(base,'release.lock.json')),changes=checkLock(p,lock);
 if(changes.length)throw Error('Unfrozen module changes: '+changes.join(', '));
 const output=path.resolve(base,'../public/previews',p.registry.release);
 if(JSON.stringify(json(path.join(output,'release.lock.json')))!==JSON.stringify(lock))throw Error('Generated module lock is stale');
 const artifact=json(path.join(output,'artifact.json'));
 if(artifact.htmlSha256!==hash(read(path.join(output,'index.html'))))throw Error('Generated HTML hash mismatch');
 if(artifact.lockSha256!==hash(lock))throw Error('Generated artifact dependency mismatch');
 return output;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const p=loadPage(),file=path.join(root,'release.lock.json'),old=fs.existsSync(file)?json(file):null;
 const changes=old?checkLock(p,old):['initial'];
 if(process.argv[2]==='freeze'){
  const next=makeLock(p);
  if(old){
   if(changes.length&&old.release===next.release)throw Error('Use a new release name before freezing changes');
   for(const change of changes){const [id,part]=change.split(':');if(next.modules[id]?.hashes[part]&&old.modules[id]?.versions[part]===next.modules[id].versions[part])throw Error('Bump '+id+' '+part+' version first');}
   if(changes.includes('shared')&&old.shared.version===next.shared.version)throw Error('Bump sharedVersion first');
  }
  fs.writeFileSync(file,JSON.stringify(next,null,2)+'\n');console.log('Locked '+next.release);
 }else if(process.argv[2]==='impact'){
  const id=process.argv[3];if(!p.modules[id])throw Error('Unknown module');console.log(JSON.stringify({module:id,review:affectedModules(p,id)},null,2));
 }else{
  console.log(JSON.stringify({release:p.registry.release,changes},null,2));if(changes.length)process.exitCode=1;
 }
}
