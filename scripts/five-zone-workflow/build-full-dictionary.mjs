import {readFileSync,writeFileSync,mkdirSync,existsSync,unlinkSync,copyFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {fingerprint,reviewEntry} from './core.mjs';
import {checkWholeCard} from './whole-card.mjs';
import {checkDictionaryReview,renderDictionary,DICTIONARY_RULE,assertBaseline} from './full-dictionary.mjs';
import {renderScoreReport} from './report-html.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..'),dir=resolve(process.argv[2]||'content/trials/dictionary-full-50-20261104'),base=resolve(root,'content/trials/whole-card-50-20261103');
const read=(p,d=dir)=>JSON.parse(readFileSync(resolve(d,p),'utf8')),write=(p,x)=>{mkdirSync(dirname(resolve(dir,p)),{recursive:true});writeFileSync(resolve(dir,p),typeof x==='string'?x:JSON.stringify(x,null,2)+'\n')};
for(const name of ['evidence/acceptance.json','preview.html'])if(existsSync(resolve(dir,name)))unlinkSync(resolve(dir,name));
const lock=read('baseline-lock.json');
assertBaseline(Object.fromEntries(Object.keys(lock.hashes).map(p=>[p,readFileSync(resolve(base,p),'utf8')])),lock);
const dictionary=read('dictionary.json'),source=read('source-snapshot.json'),wiki=read('wiktionary-snapshot.json'),reviews=existsSync(resolve(dir,'dictionary-reviews.json'))?read('dictionary-reviews.json'):[];
const entries=read('entries.json',base),supplements=read('whole-card-supplement.json',base),zones=read('reviews.json',base),wholeReviews=read('whole-card-reviews.json',base);
for(const [name,list] of [['dictionary',dictionary.cards],['reviews',reviews]])if(new Set(list.map(c=>c.cardId)).size!==list.length)throw Error('Duplicate '+name);
if(dictionary.ruleVersion!==DICTIONARY_RULE||dictionary.cards.length!==50||entries.length!==50||dictionary.cards.some((c,i)=>c.cardId!==entries[i].cardId||c.term!==entries[i].term)||reviews.some(r=>!entries.some(e=>e.cardId===r.cardId)))throw Error('Batch identity mismatch');
const zoneReport={ruleVersion:'five-zone/2',cards:[]},report={ruleVersion:'whole-card/2',dictionaryRule:DICTIONARY_RULE,productionActivated:false,cards:[]};
for(const e of entries){
 const z=zones.find(r=>r.cardId===e.cardId),s=supplements.find(s=>s.cardId===e.cardId),w=wholeReviews.find(r=>r.cardId===e.cardId),dc=dictionary.cards.find(c=>c.cardId===e.cardId);
 const oldZone=reviewEntry(e,z),oldWhole=checkWholeCard(e,s,z,w),fresh=checkDictionaryReview(dc,source,wiki,reviews.find(r=>r.cardId===e.cardId));
 zoneReport.cards.push({cardId:e.cardId,term:e.term,...oldZone});
 report.cards.push({cardId:e.cardId,term:e.term,status:oldZone.status==='CANDIDATE'&&oldWhole.status==='CANDIDATE'?fresh.status:'REVISE',errors:[...oldZone.errors,...oldWhole.errors,...fresh.errors],modules:oldWhole.modules.filter(m=>m.id!=='additionalSenses').concat(fresh.module?[fresh.module]:[]),zoneStatus:oldZone.status});
}
write('whole-card-report.json',report);write('report.json',zoneReport);write('scores.html',renderScoreReport(report,zoneReport).replaceAll('更多义项','词典义项'));
if(report.cards.some(c=>c.status!=='CANDIDATE'))throw Error('Full dictionary build blocked; see whole-card-report.json');
const original=readFileSync(resolve(base,'preview.html'),'utf8'),match=original.match(/const cards=(.*?);let index=0/s);
if(!match)throw Error('Baseline data not found');
const cards=JSON.parse(match[1]);
for(const [i,c] of cards.entries()){
 const d=dictionary.cards[i];if(c.w.id!==d.cardId||c.w.term!==d.term)throw Error('Preview identity');
 c.p.dictionaryHtml=renderDictionary(d);c.p.dictionaryCount=d.entries.reduce((n,e)=>n+e.senses.length,0);
}
const start=original.indexOf('<details><summary>更多词典义项'),end=original.indexOf('</details>',start)+10;
if(start<0||end<10)throw Error('Baseline dictionary slot not found');
const oldSlot=original.slice(start,end),newSlot="<details><summary>词典义项 · '+p.dictionaryCount+' 个义项</summary>'+p.dictionaryHtml+'</details>";
let html=original.replace(oldSlot,newSlot).replace(/const cards=.*?;let index=0/s,()=>'const cards='+JSON.stringify(cards).replace(/</g,'\\u003c')+';let index=0');
const normalized=s=>s.replace(/const cards=.*?;let index=0/s,'__CONTENT__');
if(normalized(html.replace(newSlot,oldSlot))!==normalized(original))throw Error('Outside dictionary layout changed');
write('preview.html',html);
write('evidence/build.json',{ruleVersion:'whole-card/2',dictionaryRule:DICTIONARY_RULE,cards:50,senses:cards.reduce((n,c)=>n+c.p.dictionaryCount,0),baseCommit:'a63970470811c190c6ff0462f49d853dd6bc9cd8',basePreviewHash:fingerprint(original),previewHash:fingerprint(html),layoutOutsideDictionaryUnchanged:true,cssUnchanged:html.match(/<style>.*?<\/style>/s)?.[0]===original.match(/<style>.*?<\/style>/s)?.[0],scope:'Only dictionary body data, source labels and title changed; all other sections, controls, CSS unchanged',dictionaryHash:fingerprint(dictionary),sourceHash:fingerprint(source),wiktionaryHash:fingerprint(wiki),reviewHash:fingerprint(reviews),baseEntriesHash:fingerprint(entries),baseSupplementHash:fingerprint(supplements),productionActivated:false});
copyFileSync(resolve(base,'research.md'),resolve(dir,'research.md'));
console.log(JSON.stringify({cards:50,senses:cards.reduce((n,c)=>n+c.p.dictionaryCount,0),status:'CONTENT_CANDIDATE',browser:'PENDING',productionActivated:false}));
