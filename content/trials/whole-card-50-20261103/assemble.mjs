import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const dir=dirname(fileURLToPath(import.meta.url));
const read=p=>JSON.parse(readFileSync(resolve(dir,p),'utf8'));
const selection=read('selection.json'),ids=selection.cards.map(c=>c.id);
const actual=createHash('sha256').update(readFileSync(resolve(dir,'../../..',selection.sourcePath))).digest('hex');
if(actual!==selection.baseVocabularySha256)throw Error('Original source changed');
function assemble(stem,target,required){
 const paths=[1,2,3].map(n=>`${stem}-${n}.json`);
 if(paths.some(p=>!existsSync(resolve(dir,p)))){if(required)throw Error(`Missing ${stem} partition`);return false;}
 const rows=paths.flatMap(read);
 if(rows.length!==50||new Set(rows.map(x=>x.cardId)).size!==50||rows.some(x=>!ids.includes(x.cardId)))throw Error(`${stem}: incomplete/duplicate/unauthorized cards`);
 writeFileSync(resolve(dir,target),JSON.stringify(ids.map(id=>rows.find(x=>x.cardId===id)),null,2)+'\n');return true;
}
assemble('entries','entries.json',true);assemble('supplements','whole-card-supplement.json',true);
const zones=assemble('reviews','reviews.json',false),whole=assemble('whole-reviews','whole-card-reviews.json',false);
console.log(JSON.stringify({cards:50,zoneReviews:zones,wholeReviews:whole,productionActivated:false}));
