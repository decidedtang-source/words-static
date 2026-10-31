import bridges from '../dictionary/bridges.json' with {type:'json'};
export let catalog={schema:1,entries:[]};
export function setCatalog(value){catalog=value;}
const normalize=s=>String(s??'').normalize('NFC').trim().toLocaleLowerCase('en');
export function lookup(query){const q=normalize(query);return catalog.entries.filter(e=>normalize(e.lemma)===q)}
export function cardLexical(card){return Object.hasOwn(bridges,normalize(card.term))?bridges[normalize(card.term)]:null}
export function foundations(card){return (cardLexical(card)?.foundation||[]).map(f=>{const e=lookup(f.word).find(e=>e.senses.some(s=>s.id===f.senseId));if(!e)throw Error('Missing foundation sense');return {...f,gloss:e.senses.find(s=>s.id===f.senseId).glossZh,pos:{n:'名词',v:'动词',a:'形容词',r:'副词'}[e.pos]};})}
export function searchDictionary(query){const q=normalize(query);return catalog.entries.filter(e=>normalize(e.lemma).includes(q)||e.senses.some(s=>s.glossZh.includes(q))).slice(0,40)}
export function entriesForCard(card,analysis=null){const terms=[card.term,...(cardLexical(card)?.components||[])].map(normalize);return catalog.entries.filter(e=>analysis?analysis.dictionaryEntryIds.includes(e.id):terms.includes(normalize(e.lemma)));}
export function validateCatalog(){const ids=new Set();for(const e of catalog.entries){if(ids.has(e.id)||!e.senses.length)throw Error('Duplicate/empty entry');ids.add(e.id);for(const s of e.senses)if(!s.id||!s.definitionEn||!s.glossZh)throw Error('Unanchored sense');}for(const b of Object.values(bridges))for(const c of b.components)if(!lookup(c).length)throw Error('Missing component');return true}
export function bookmarkKey(item){return item.kind+':'+item.id}
export function validateBookmarks(value){if(!value||value.schema!==1||!Array.isArray(value.items)||value.items.length>5000||Object.keys(value).some(k=>!['schema','items'].includes(k)))throw Error('收藏文件格式无效');const seen=new Set();for(const item of value.items){if(!item||Object.keys(item).sort().join(',')!=='id,kind,label,query'||!['card','lexeme'].includes(item.kind)||![item.id,item.label,item.query].every(v=>typeof v==='string'&&v.length>0&&v.length<=200)||!/^[-A-Za-z0-9_:]+$/.test(item.id)||seen.has(bookmarkKey(item)))throw Error('收藏项目无效或重复');seen.add(bookmarkKey(item));}return value}
