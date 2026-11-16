export async function parseCambridge(page,html,url){
 return page.evaluate(({html,url})=>{
  const d=new DOMParser().parseFromString(html,'text/html'),clean=e=>e?.textContent.replace(/\s+/g,' ').trim()||'';
  const head=e=>{const h=(e.querySelector('.headword .hw')||e.querySelector('.headword'))?.cloneNode(true);h?.querySelectorAll('.obj').forEach(x=>x.remove());return clean(h).replace(/\s+(?:sth|sb)$/,'').trim();};
  const entries=[...d.querySelectorAll('.entry-body__el')].map((entry,ei)=>({
   lemma:head(entry),
   pos:clean(entry.querySelector('.pos')),
   pronunciations:[...entry.querySelectorAll('.dpron-i')].map(p=>({ipa:clean(p.querySelector('.ipa')),variety:p.classList.contains('us')?'US':'GB',audioURL:p.querySelector('source')?new URL(p.querySelector('source').getAttribute('src'),url).href:null})),
   senses:[...entry.querySelectorAll('.def-block')].map((s,si)=>({id:`entry-${ei}/sense-${si}`,definition:clean(s.querySelector('.def')),level:clean(s.querySelector('.epp-xref')),examples:[...s.querySelectorAll('.examp')].map((e,i)=>({id:`entry-${ei}/sense-${si}/example-${i}`,en:clean(e.querySelector('.eg')||e)})).filter(e=>e.en)})).filter(s=>s.definition)
  })).filter(e=>e.lemma);
  return {provider:'cambridge',url,title:clean(d.querySelector('title')),parserVersion:'cambridge-dom-1',entries};
 },{html,url});
}
export async function parseArticle(page,html,url,quote){
 return page.evaluate(({html,url,quote})=>{
  const d=new DOMParser().parseFromString(html,'text/html');d.querySelectorAll('script,style,nav,footer,header').forEach(e=>e.remove());
  const body=d.querySelector('article')||d.querySelector('main')||d.body,text=body.textContent.replace(/\s+/g,' ').trim(),needle=quote.replace(/\s+/g,' ').trim(),offset=text.indexOf(needle);
  return {url,title:d.title,text,quoteFound:Boolean(needle)&&offset>=0,offset,excerpt:offset>=0?text.slice(Math.max(0,offset-120),offset+needle.length+120):null,parserVersion:'article-dom-1'};
 },{html,url,quote});
}
export async function parseEtymonlineHTML(page,html,lemma){
 return page.evaluate(({html,lemma})=>{
  const d=new DOMParser().parseFromString(html,'text/html');d.querySelectorAll('script,style,nav,footer,header').forEach(e=>e.remove());
  const nodes=[...d.querySelectorAll('h1,h2,h3,p')];let active=false;const parts=[];
  for(const n of nodes){const text=n.textContent.replace(/\s+/g,' ').trim();
   if(/^H/.test(n.tagName)){if(/^Entries linking|More to explore|Share /i.test(text))break;active=new RegExp('^'+lemma.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\s*\\(','i').test(text);continue;}
   if(active&&text)parts.push(text);
  }
  return {lemma,text:parts.join('\n'),parserVersion:'etym-heading-1',status:parts.length?'ready':'parse_failed'};
 },{html,lemma});
}
