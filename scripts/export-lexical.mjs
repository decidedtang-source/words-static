// Offline build input only. Never reads learning databases or private source pages.
import {DatabaseSync} from 'node:sqlite';import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';import {createHash} from 'node:crypto';import {join} from 'node:path';
const [snapshot]=process.argv.slice(2);if(!snapshot)throw Error('Pass a verified OEWN snapshot directory');
const manifest=JSON.parse(readFileSync(join(snapshot,'manifest.json'),'utf8')),file=readFileSync(join(snapshot,'dictionary.sqlite'));
if(createHash('sha256').update(file).digest('hex')!==manifest.sha256)throw Error('Source hash mismatch');
const selected=JSON.parse(readFileSync('scripts/lexical-selections.json','utf8')),found=new Set(),entries=[];
const db=new DatabaseSync(join(snapshot,'dictionary.sqlite'),{readOnly:true});
for(const row of db.prepare('SELECT content FROM entries ORDER BY id').iterate()){
 const entry=JSON.parse(row.content),senses=entry.senses.filter(s=>Object.hasOwn(selected,s.sourceSenseId));if(!senses.length)continue;
 for(const s of senses)found.add(s.sourceSenseId);
 entries.push({id:entry.id,lemma:entry.lemma,pos:entry.lexicalPos,sourceEntryId:entry.sourceEntryId,release:entry.release,senses:senses.map(s=>({id:s.sourceSenseId,definitionEn:s.definitions.join('; '),glossZh:selected[s.sourceSenseId],sourceExamples:s.examples})),source:'Open English Wordnet 2025'});
}db.close();if(found.size!==Object.keys(selected).length)throw Error('Missing selected sense');
mkdirSync('dictionary',{recursive:true});writeFileSync('dictionary/catalog.json',JSON.stringify({schema:1,source:{name:'Open English Wordnet 2025',url:'https://en-word.net/',license:'CC BY 4.0 + Princeton WordNet notice',snapshotId:manifest.snapshotId,sha256:manifest.sha256,changes:'Selected source senses; independently reviewed Chinese teaching summaries added; not official Chinese dictionary text.'},entries},null,2)+'\n');
mkdirSync('public/licenses',{recursive:true});for(const name of ['LICENSE.md','WNDB_License.txt'])copyFileSync(join(snapshot,name),'public/licenses/'+name);
console.log(JSON.stringify({entries:entries.length,senses:found.size,lemmas:new Set(entries.map(e=>e.lemma)).size}));
