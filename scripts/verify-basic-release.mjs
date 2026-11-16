import fs from 'node:fs';
import crypto from 'node:crypto';
export function verifyBasicRelease(dir='public/releases/basic-v1-20261117'){
 const html=fs.readFileSync(dir+'/index.html','utf8').replace(/\r\n/g,'\n'),lock=JSON.parse(fs.readFileSync(dir+'/release.lock.json')),qa=JSON.parse(fs.readFileSync(dir+'/qa-report.json'));
 if(crypto.createHash('sha256').update(html).digest('hex')!==lock.htmlSHA||qa.htmlSHA!==lock.htmlSHA||!qa.pass||qa.trialEntries!==100)throw Error('Basic release hash/QA mismatch');
 const words=JSON.parse(html.match(/id="wl-data">([\s\S]*?)<\/script>/)?.[1]||'null');
 if(!words||words.length!==100||new Set(words.map(w=>w.entryId)).size!==100)throw Error('Basic release roster mismatch');
 if(['id="wl-bridge"','id="wl-deep"','id="wl-dictionary"','<summary>查看必要上下文</summary>'].some(t=>html.includes(t)))throw Error('Retired module in basic release');
 return dir;
}
