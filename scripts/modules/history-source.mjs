import fs from 'node:fs';
import path from 'node:path';
import {sha} from './system.mjs';
export function parseSnapshot(raw,lemma){
 const clean=raw.replace(/^L\d+:\s?/gm,'');
 const start=clean.indexOf('# Origin and history of '+lemma+'\n');
 if(start<0||!clean.includes('https://www.etymonline.com/word/'+encodeURIComponent(lemma)))throw Error('Source identity missing/mismatch');
 const part=clean.slice(start),end=part.indexOf('## Entries linking to ');
 const scope=end<0?part:part.slice(0,end);
 const lines=scope.split('\n'),paragraphs=[];let active=false;
 for(const line of lines){
  if(line.startsWith('## ')){active=line.toLowerCase().startsWith('## '+lemma.toLowerCase()+'(');continue;}
  if(!active||!line.trim()||line.startsWith('【')||line.startsWith('>')||line==='* * *')continue;
  paragraphs.push(line.replace(/【\d+†([^】]+)】/g,'$1'));
 }
 if(!paragraphs.length)throw Error('Source text missing');
 return {lemma,text:paragraphs.join('\n'),coverage:end<0?'entry_excerpt':'entry_section',parserVersion:'1.0.0'};
}
export async function fetchHistory(lemma,fetcher=fetch){
 const url='https://www.etymonline.com/word/'+encodeURIComponent(lemma),fetchedAt=new Date().toISOString();
 try{
  const r=await fetcher(url,{headers:{'User-Agent':'WordsResearch/1.0 (personal vocabulary study)'},signal:AbortSignal.timeout(20000)});
  if(!r.ok)return {url,fetchedAt,transport:'direct_http',status:'fetch_failed',error:'HTTP '+r.status};
  const raw=await r.text();
  // Direct HTML is saved for a dedicated HTML parser, never mistaken for web-tool text.
  return {url,fetchedAt,transport:'direct_http',status:'parse_pending',raw,rawSHA:sha(raw)};
 }catch(e){return {url,fetchedAt,transport:'direct_http',status:'fetch_failed',error:e.message};}
}
export function importSnapshots(dir,terms){
 const files=fs.readdirSync(dir).filter(f=>/^web.*\.txt$/.test(f)).sort(),parts=files.flatMap(file=>fs.readFileSync(path.join(dir,file),'utf8').split(/-{40,}/).map(raw=>({file,raw})));
 return Object.fromEntries(terms.map(lemma=>{
  const url='https://www.etymonline.com/word/'+encodeURIComponent(lemma),matches=parts.filter(p=>p.raw.includes(url));
  const parsed=matches.flatMap(p=>{try{return [{...p,...parseSnapshot(p.raw,lemma)}];}catch{return [];}}).sort((a,b)=>b.text.length-a.text.length);
  if(!parsed.length)return [lemma,{url,lemma,status:'fetch_failed',transport:'web_tool_snapshot',error:matches.length?'读取失败或没有可提取的目标条目':'未取得来源快照'}];
  const p=parsed[0];return [lemma,{url,lemma,status:'ready',transport:'web_tool_snapshot',fetchedAt:fs.statSync(path.join(dir,p.file)).mtime.toISOString(),artifactPath:p.file,rawSHA:sha(fs.readFileSync(path.join(dir,p.file),'utf8')),textSHA:sha(p.text),coverage:p.coverage,parserVersion:p.parserVersion,text:p.text}];
 }));
}
