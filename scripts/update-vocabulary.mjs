import {readFileSync,readdirSync,writeFileSync,mkdirSync} from 'node:fs';import {join} from 'node:path';import {createHash} from 'node:crypto';
const root=process.argv[2];if(!root)throw Error('Provide the source vocabulary directory');const words=[],batches=[],ids=new Set();
for(const name of readdirSync(root).filter(n=>/^\d{4}-\d{2}-\d{2}\.entries\.json$/.test(n)).sort()){
 const bytes=readFileSync(join(root,name)),rows=JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/,'')),date=name.slice(0,10);if(!Array.isArray(rows)||!rows.length)throw Error('Invalid batch '+date);
 for(const row of rows){if(typeof row.id!=='string'||!/^[A-Za-z0-9_-]+$/.test(row.id)||ids.has(row.id))throw Error('Invalid/duplicate ID');ids.add(row.id);const word={id:row.id,date};for(const field of ['term','ipa','pos','meaning','chunk','example','level']){if(typeof row[field]!=='string'||(['term','meaning','example'].includes(field)&&!row[field].trim()))throw Error('Invalid learning field '+field+' '+row.id);word[field]=row[field]}words.push(word)}batches.push({date,count:rows.length,sha256:createHash('sha256').update(bytes).digest('hex')});
}
mkdirSync('public',{recursive:true});writeFileSync('public/vocabulary.json',JSON.stringify({schema:1,updated:batches.at(-1)?.date,batches,words}));console.log(JSON.stringify({batches:batches.length,words:words.length,latest:batches.at(-1)?.date}));
