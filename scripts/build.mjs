import {build} from 'esbuild';import {mkdir,copyFile,cp} from 'node:fs/promises';
await mkdir('dist',{recursive:true});await build({entryPoints:['src/app.mjs'],outfile:'dist/app.js',bundle:true,format:'esm',target:['safari16','chrome110'],minify:true});for(const file of ['index.html','styles.css','vocabulary.json'])await copyFile('public/'+file,'dist/'+file);

await cp('public/licenses','dist/licenses',{recursive:true});

// Publish the owner-frozen word-page sample at a versioned URL.
await cp('public/previews/word-layout-v6-20261116','dist/previews/word-layout-v6-20261116',{recursive:true});

await cp('public/previews/word-layout-v7-20261116','dist/previews/word-layout-v7-20261116',{recursive:true});
