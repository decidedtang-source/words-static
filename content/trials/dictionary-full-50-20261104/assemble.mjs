import {readFileSync,writeFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=dirname(fileURLToPath(import.meta.url)),read=p=>JSON.parse(readFileSync(resolve(dir,p),'utf8'));
const source=read('source-snapshot.json'),wikt=read('wiktionary-snapshot.json'),translations=read('translations.json');
const cards=structuredClone(source.cards);
for(const c of cards){
 let n=0;for(const e of c.entries)for(const s of e.senses){s.glossZh=translations[c.term]?.[n++];if(!s.glossZh)throw Error('Missing translation '+s.id)}
 if(n!==(translations[c.term]?.length||0))throw Error('Translation count '+c.term);
 c.entries.push(...wikt.entries.filter(e=>e.lemma===c.term));
 if(!c.entries.length)throw Error('No dictionary '+c.term);
 c.writer='dictionary-full-author';c.scope='All senses of exact headword in the named source release/English revision; not all dictionaries';
}
writeFileSync(resolve(dir,'dictionary.json'),JSON.stringify({ruleVersion:'dictionary-full/1',cards},null,2)+'\n');
console.log({cards:cards.length,senses:cards.flatMap(c=>c.entries.flatMap(e=>e.senses)).length});
