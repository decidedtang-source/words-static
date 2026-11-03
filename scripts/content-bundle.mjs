import {sha256,jsonBytes} from './validate-reviewed-content.mjs';
import bridges from '../dictionary/bridges.json' with {type:'json'};
const normalize=s=>String(s).normalize('NFC').trim().toLowerCase();
export function createContentBundle({vocabulary,analysis={schema:1,entries:{}},catalog,previous=null,retiredIds=[]}){
 const next=structuredClone(analysis),revisions={},renderHashes={},files={};
 const retired=[...new Set([...(previous?.retiredIds||[]),...retiredIds])].sort();
 for(const card of vocabulary.words){
  const a=next.entries[card.id],clean=a?Object.fromEntries(Object.entries(a).filter(([k])=>k!=='contentRevision')):null;
  const terms=[card.term,...(bridges[normalize(card.term)]?.components||[])].map(normalize);
  const entries=catalog.entries.filter(e=>a?a.dictionaryEntryIds.includes(e.id):terms.includes(normalize(e.lemma)));
  const hash=sha256(jsonBytes({card,analysis:clean,entries}));renderHashes[card.id]=hash;
  const old=previous?.revisions?.[card.id];revisions[card.id]=old?(previous.renderHashes?.[card.id]===hash?old:old+1):1;
  if(a)a.contentRevision=revisions[card.id];
 }
 const assets={};for(const [name,value]of Object.entries({vocabulary,analysis:next,catalog})){
  const bytes=jsonBytes(value),hash=sha256(bytes),path=`${name}.${hash}.json`;files[path]=bytes;assets[name]={path,sha256:hash};
 }
 const core={schema:1,assets,revisions,renderHashes,retiredIds:retired};
 return {manifest:{...core,releaseId:sha256(jsonBytes(core))},files,analysis:next};
}
