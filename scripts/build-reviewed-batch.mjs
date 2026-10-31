import {readFileSync,writeFileSync,mkdirSync,existsSync,readdirSync,renameSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';import {pathToFileURL} from 'node:url';import {randomUUID} from 'node:crypto';
import {validateReviewedContent,sha256,jsonBytes} from './validate-reviewed-content.mjs';
import {createContentBundle} from './content-bundle.mjs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
export function buildReviewedBatch({baseVocabulary,baseVocabularyBytes=jsonBytes(baseVocabulary),baseAnalysis,baseCatalog,manifest,approvedProjection,receipt,sourceManifest,previousManifest=null}){
 if(sha256(baseVocabularyBytes)!==manifest.baseContentHash||JSON.stringify(JSON.parse(baseVocabularyBytes))!==JSON.stringify(baseVocabulary)||sha256(jsonBytes(baseAnalysis))!==manifest.baseAnalysisHash||sha256(jsonBytes(baseCatalog))!==manifest.baseCatalogHash)throw Error('Base files changed: rebase and re-review');
 const existingCards=baseVocabulary.words.map(w=>({id:w.id,term:w.term}));
 if(new Set(existingCards.map(w=>w.id)).size!==existingCards.length)throw Error('Base duplicate identities');
 const result=validateReviewedContent({projectionBytes:approvedProjection,receipt,sourceManifest,baseManifest:{...manifest,existingCards}});
 if(!result.ok)throw Error(result.errors.join('; '));
 const projection=JSON.parse(approvedProjection),vocabulary=structuredClone(baseVocabulary),analysis=structuredClone(baseAnalysis),catalog=structuredClone(baseCatalog),retiredIds=[];
 const cards=new Map(projection.cards.map(w=>[w.id,w]));
 for(const op of manifest.operations){if(op.operation==='add')vocabulary.words.push(cards.get(op.cardId));else if(op.operation==='revise')vocabulary.words[vocabulary.words.findIndex(w=>w.id===op.cardId)]=cards.get(op.cardId);else if(op.operation==='withdraw'){retiredIds.push(op.cardId);delete analysis.entries[op.cardId];}}
 for(const a of projection.analysis)analysis.entries[a.cardId]=a;
 for(const e of projection.dictionaryEntries){const index=catalog.entries.findIndex(x=>x.id===e.id);if(index<0)catalog.entries.push(e);else{const old=catalog.entries[index];if(['lemma','pos','sourceEntryId','release','source'].some(k=>old[k]!==e[k]))throw Error('Dictionary identity collision');const senses=new Map(old.senses.map(s=>[s.id,s]));for(const s of e.senses)senses.set(s.id,s);catalog.entries[index]={...e,senses:[...senses.values()]};}}
 const dates=new Set(projection.cards.map(w=>w.date));for(const date of dates){const count=vocabulary.words.filter(w=>w.date===date).length,old=vocabulary.batches.find(b=>b.date===date);if(old)old.count=count;else vocabulary.batches.push({date,count,sha256:manifest.reviewedProjectionHash});}
 vocabulary.batches.sort((a,b)=>a.date.localeCompare(b.date));vocabulary.updated=vocabulary.batches.at(-1)?.date||baseVocabulary.updated;
 const bundle=createContentBundle({vocabulary,analysis,catalog,previous:previousManifest,retiredIds});
 const reviewed=Object.keys(bundle.analysis.entries).filter(id=>!bundle.manifest.retiredIds.includes(id)).length;
 return {vocabulary,analysis:bundle.analysis,catalog,contentManifest:bundle.manifest,files:bundle.files,coverage:{total:vocabulary.words.length,dictionary:reviewed,analysis:reviewed,copy:reviewed},batchId:projection.batchId};
}
function publicPath(root,path,prefix){if(typeof path!=='string'||!path.startsWith(prefix)||path.includes('..')||path.includes('\\')||!path.endsWith('.json'))throw Error('Invalid public input path');const full=resolve(root,path);if(!full.startsWith(resolve(root)+requireSeparator()))throw Error('Path escapes repo');return full;}
function requireSeparator(){return process.platform==='win32'?'\\':'/'}
export function loadReviewedRelease(root=process.cwd(),manifestPaths=null){
 let vocabulary=read(join(root,'public/vocabulary.json')),vocabularyBytes=readFileSync(join(root,'public/vocabulary.json')),analysis=existsSync(join(root,'public/analysis.json'))?read(join(root,'public/analysis.json')):{schema:1,entries:{}},catalog=read(join(root,'dictionary/catalog.json')),previous=null,result;
 const active=manifestPaths||read(join(root,'content/active-batches.json')).manifests;
 if(!Array.isArray(active)||new Set(active).size!==active.length)throw Error('Invalid active batch allowlist');
 for(const path of active){const manifest=read(publicPath(root,path,'content/manifests/'));
  result=buildReviewedBatch({baseVocabulary:vocabulary,baseVocabularyBytes:vocabularyBytes,baseAnalysis:analysis,baseCatalog:catalog,manifest,approvedProjection:readFileSync(publicPath(root,manifest.projectionPath,'content/reviewed/')),receipt:read(publicPath(root,manifest.receiptPath,'content/reviews/')),sourceManifest:read(publicPath(root,manifest.sourcePath,'content/sources/')),previousManifest:previous});
  vocabulary=result.vocabulary;vocabularyBytes=jsonBytes(vocabulary);analysis=result.analysis;catalog=result.catalog;previous=result.contentManifest;
 }
 if(!result){const bundle=createContentBundle({vocabulary,analysis,catalog});result={vocabulary,analysis:bundle.analysis,catalog,contentManifest:bundle.manifest,files:bundle.files,coverage:{total:vocabulary.words.length,dictionary:0,analysis:0,copy:0}};}
 return result;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const args=process.argv.slice(2),manifest=args[args.indexOf('--manifest')+1],out=args[args.indexOf('--out')+1];
 if(!args.includes('--manifest')||!args.includes('--out')||!manifest||!out)throw Error('Usage: --manifest content/manifests/batch.json --out staging-directory');
 const active=read(resolve('content/active-batches.json')).manifests;
 if(!Array.isArray(active)||new Set(active).size!==active.length||!active.includes(manifest))throw Error('Target manifest must be explicitly active');
 const result=loadReviewedRelease(process.cwd(),active.slice(0,active.indexOf(manifest)+1)),destination=resolve(out),parent=dirname(destination);
 if(['public','dictionary','content','src','.git'].some(p=>destination===resolve(p)||destination.startsWith(resolve(p)+requireSeparator())))throw Error('Output must be an isolated staging directory');
 const files={'vocabulary.json':jsonBytes(result.vocabulary),'analysis.json':jsonBytes(result.analysis),'catalog.json':jsonBytes(result.catalog),'content-manifest.json':jsonBytes(result.contentManifest),...result.files};
 if(existsSync(destination)){if(readdirSync(destination).length!==Object.keys(files).length||Object.entries(files).some(([name,b])=>!existsSync(join(destination,name))||!readFileSync(join(destination,name)).equals(b)))throw Error('Staging destination already contains different files');}
 else{mkdirSync(parent,{recursive:true});const temporary=join(parent,'.reviewed-'+randomUUID());mkdirSync(temporary);for(const [name,b]of Object.entries(files))writeFileSync(join(temporary,name),b);renameSync(temporary,destination);}
 console.log(JSON.stringify({output:destination,coverage:result.coverage,releaseId:result.contentManifest.releaseId,status:'BRANCH_STAGING_ONLY'}));
}
