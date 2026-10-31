import {build} from 'esbuild';import {mkdir,copyFile,cp,readFile,writeFile} from 'node:fs/promises';
import {loadReviewedRelease} from './build-reviewed-batch.mjs';import {jsonBytes,sha256} from './validate-reviewed-content.mjs';
const release=loadReviewedRelease();
await mkdir('dist',{recursive:true});await build({entryPoints:['src/app.mjs'],outfile:'dist/app.js',bundle:true,format:'esm',target:['safari16','chrome110'],minify:true});await copyFile('public/styles.css','dist/styles.css');
for(const [path,bytes]of Object.entries(release.files))await writeFile('dist/'+path,bytes);
await writeFile('dist/content-manifest.json',jsonBytes(release.contentManifest));
await writeFile('dist/vocabulary.json',jsonBytes(release.vocabulary));
const appHash=sha256(await readFile('dist/app.js')),cssHash=sha256(await readFile('dist/styles.css'));
const html=(await readFile('public/index.html','utf8')).replace(/app\.js\?v=[^"']+/,'app.js?v='+appHash.slice(0,16)).replace(/styles\.css\?v=[^"']+/,'styles.css?v='+cssHash.slice(0,16));await writeFile('dist/index.html',html);

await cp('public/licenses','dist/licenses',{recursive:true});
console.log(JSON.stringify({status:'BUILT_NOT_PUBLISHED',releaseId:release.contentManifest.releaseId,coverage:release.coverage}));
