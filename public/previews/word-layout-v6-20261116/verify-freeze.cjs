const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const m=JSON.parse(fs.readFileSync(path.join(__dirname,'manifest.json'),'utf8'));
for(const f of m.files)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,f.path))).digest('hex'),f.sha256,f.path);
console.log('Frozen hashes verified: '+m.files.length);
