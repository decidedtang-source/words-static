const names=['vocabulary','analysis','catalog'];
const digest=async bytes=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
export async function fetchContent(url,options={},fetcher=globalThis.fetch,timeoutMs=5000){
 const controller=new AbortController();let timer;
 const deadline=new Promise((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(Error('Content download timed out'))},timeoutMs)});
 try{return await Promise.race([deadline,(async()=>{const response=await fetcher(url,{...options,signal:controller.signal});const bytes=await response.arrayBuffer();return new Response([204,205,304].includes(response.status)?null:bytes,{status:response.status,statusText:response.statusText,headers:response.headers})})()])}finally{clearTimeout(timer)}
}
export async function loadContentBundle(manifestUrl,{fetcher=globalThis.fetch,manifest=null,assetTimeoutMs=5000}={}){
 const url=new URL(manifestUrl,globalThis.location?.href);
 if(!manifest){const response=await fetchContent(url,{cache:'no-store'},fetcher);if(!response.ok)throw Error('内容清单下载失败 '+response.status);manifest=await response.json();}
 if(manifest?.schema!==1||!/^[a-f0-9]{64}$/.test(manifest.releaseId)||!Array.isArray(manifest.retiredIds))throw Error('Invalid content manifest');
 const loaded={};
 for(const name of names){const asset=manifest.assets?.[name];if(!asset||!new RegExp(`^${name}\\.[a-f0-9]{64}\\.json$`).test(asset.path)||!asset.path.includes(asset.sha256))throw Error('Invalid asset path');
  const response=await fetchContent(new URL(asset.path,url),{},fetcher,assetTimeoutMs);if(!response.ok)throw Error('内容文件下载失败 '+response.status);
  const bytes=await response.arrayBuffer();if(await digest(bytes)!==asset.sha256)throw Error('Content hash mismatch');loaded[name]=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
 }
 if(!Array.isArray(loaded.vocabulary.words)||!loaded.vocabulary.words.length||loaded.analysis.schema!==1||!Array.isArray(loaded.catalog.entries))throw Error('Invalid content bundle');
 for(const w of loaded.vocabulary.words){const revision=manifest.revisions?.[w.id];if(!Number.isSafeInteger(revision)||revision<1)throw Error('Missing card revision');const a=loaded.analysis.entries?.[w.id];if(a&&(a.cardId!==w.id||a.contentRevision!==revision))throw Error('Analysis revision mismatch');}
 return {...loaded,...manifest};
}
export function createBundleController(initial,loader){
 let current=initial,sequence=0,pending=false;
 return {get current(){return current;},get pending(){return pending;},async refresh(){const own=++sequence,next=await loader(current,{markPending(){if(own===sequence)pending=true}});if(own===sequence){current=next;pending=false}return current;}};
}
