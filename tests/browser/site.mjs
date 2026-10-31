import http from 'node:http';import {readFileSync} from 'node:fs';
import {loadReviewedRelease} from '../../scripts/build-reviewed-batch.mjs';
export async function startSite(initial=loadReviewedRelease()){
 let release=initial,mode='normal';
 const server=http.createServer((req,res)=>{
  const path=new URL(req.url,'http://localhost').pathname.replace(/^\/words-static\//,'');
  const file=path===''?'index.html':path;
  if(!/^(index\.html|app\.js|styles\.css|vocabulary\.json|content-manifest\.json|(?:vocabulary|analysis|catalog)\.[a-f0-9]{64}\.json|licenses\/[A-Za-z_.]+)$/.test(file)){res.writeHead(404).end();return;}
  if(file==='content-manifest.json'&&mode==='offline'){res.writeHead(503).end();return;}
  if(file==='content-manifest.json'&&mode==='stalled'){res.writeHead(200,{'Content-Type':'application/json'});res.flushHeaders();return;}
  res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.json')?'application/json':file.endsWith('.css')?'text/css':'text/html');
  try{if(file==='content-manifest.json')res.end(JSON.stringify(release.contentManifest||release.manifest));else if(file==='vocabulary.json')res.end(JSON.stringify(release.vocabulary));else if(Object.hasOwn(release.files,file))res.end(mode==='corrupt'?'{}':release.files[file]);else res.end(readFileSync('dist/'+file));}catch{res.writeHead(404).end();}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));return {server,url:`http://127.0.0.1:${server.address().port}/words-static/`,setRelease(value){release=value;},setMode(value){mode=value;},close:()=>new Promise(r=>server.close(r))};
}
export const executablePath=process.env.CHROMIUM_PATH||undefined;
export const snapshot=page=>page.evaluate(()=>new Promise((resolve,reject)=>{const r=indexedDB.open('words-static-v1',1);r.onsuccess=()=>{const db=r.result,q=db.transaction('state').objectStore('state').get('current');q.onsuccess=()=>{resolve(q.result||null);db.close()};q.onerror=reject}}));
