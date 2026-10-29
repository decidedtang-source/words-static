import {build} from 'esbuild';import {mkdir,copyFile} from 'node:fs/promises';
await mkdir('dist',{recursive:true});await build({entryPoints:['src/app.mjs'],outfile:'dist/app.js',bundle:true,format:'esm',target:['safari16','chrome110'],minify:true});for(const file of ['index.html','styles.css','vocabulary.json'])await copyFile('public/'+file,'dist/'+file);
