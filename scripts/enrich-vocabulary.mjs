import {readFileSync} from 'node:fs';import {join} from 'node:path';
export function enrichVocabulary(data,contentDirectory='content'){
 const sources=JSON.parse(readFileSync(join(contentDirectory,'context-sources.json'),'utf8'));
 const annotations=new Map();
 for(const batch of data.batches){const file=JSON.parse(readFileSync(join(contentDirectory,batch.date+'.json'),'utf8'));if(!file||Array.isArray(file)||typeof file!=='object')throw Error('Invalid editorial batch '+batch.date);for(const [id,entry] of Object.entries(file)){if(annotations.has(id))throw Error('Duplicate editorial ID '+id);annotations.set(id,entry)}}
 if(annotations.size!==data.words.length)throw Error('Editorial coverage must match all source entries');
 const words=data.words.map(w=>{const entry=annotations.get(w.id);if(!entry||typeof entry.gloss!=='string'||!entry.gloss.trim()||entry.gloss.length>40)throw Error('Missing/long gloss '+w.id);if(!Array.isArray(entry.examples)||entry.examples.length<2||entry.originalExample!==w.example)throw Error('Original source example must remain traceable '+w.id);const seen=new Set();const examples=entry.examples.map(e=>{if(typeof e.en!=='string'||typeof e.zh!=='string'||!e.en.trim()||!e.zh.trim()||e.en.length>2000||e.zh.length>2000||seen.has(e.en)||/<\/?[a-z]|javascript:/i.test(e.en+e.zh))throw Error('Invalid bilingual example '+w.id);seen.add(e.en);return {en:e.en,zh:e.zh}});if(entry.editorialNote!==undefined&&(typeof entry.editorialNote!=='string'||!entry.editorialNote.trim()||entry.editorialNote.length>1000||/<\/?[a-z]|javascript:/i.test(entry.editorialNote)))throw Error('Invalid editorial note '+w.id);return {...w,gloss:entry.gloss,explanation:w.meaning,examples,...(entry.editorialNote?{editorialNote:entry.editorialNote}:{})}});
 return {...data,contentVersion:3,words:words.map(w=>{
  const entry=annotations.get(w.id),context=entry.context;
  if(!context||!['workplace','reading','domain'].includes(context.kind)||typeof context.scene!=='string'||!context.scene.trim()||typeof entry.explanation!=='string'||!entry.explanation.trim())throw Error('Missing purpose-specific context '+w.id);
  const source=context.sourceId?sources[context.sourceId]:null;
  if(context.sourceId&&!source)throw Error('Unknown context source '+w.id);
  if(context.kind==='reading'&&(!source||!context.focus))throw Error('Reading context must have a source and focus '+w.id);
  if(source&&(!/^https:\/\//.test(source.url)||!source.title||!['public-text','public-preview','public-transcript'].includes(source.access)))throw Error('Invalid context source '+w.id);
  if(entry.explanation.length>1000||/<\/?[a-z]|javascript:/i.test(entry.explanation+context.scene+(context.focus||'')))throw Error('Invalid context text '+w.id);
  const examples=w.examples.map((e,i)=>{const origin=entry.examples[i].origin;if(!['reading-original','workplace-original','transfer-original','domain-original'].includes(origin))throw Error('Missing example provenance '+w.id);return {...e,origin}});
  const primary={workplace:'workplace-original',reading:'reading-original',domain:'domain-original'}[context.kind];if(examples[0].origin!==primary)throw Error('Example purpose does not match card '+w.id);
  if(entry.chunk!==undefined&&(typeof entry.chunk!=='string'||!entry.chunk.trim()||entry.chunk.length>500||/<\/?[a-z]|javascript:/i.test(entry.chunk)))throw Error('Invalid contextual collocation '+w.id);
  if(entry.meaning!==undefined&&(typeof entry.meaning!=='string'||!entry.meaning.trim()||entry.meaning.length>1000||/<\/?[a-z]|javascript:/i.test(entry.meaning)))throw Error('Invalid contextual sense '+w.id);
  return {...w,meaning:entry.meaning??w.meaning,chunk:entry.chunk??w.chunk,example:examples[0].en,explanation:entry.explanation,context:{...context,source},examples};
 })};
}
