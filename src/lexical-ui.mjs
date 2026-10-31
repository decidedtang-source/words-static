import {catalog,lookup,searchDictionary,entriesForCard,bookmarkKey,validateBookmarks} from './lexical.mjs';
import {bookmarks,saveBookmark,removeBookmark} from './bookmarks.mjs';
import {mountCopy} from './copy.mjs';
import {loadAnalysis} from './analysis.mjs';
import {renderEntry,escapeText as esc} from './entry-view.mjs';
const pos={n:'名词',v:'动词',a:'形容词',s:'形容词',r:'副词'};
export function createLexicalUI({getWords,getBundle}){
 function open(cardOrTerm,entryId=null){
  history.replaceState({...history.state,returnScroll:scrollY},'',location.href);
  const params=typeof cardOrTerm==='object'?{card:cardOrTerm.id}:{term:cardOrTerm,...(entryId?{entryId}:{})};
  location.hash='entry?'+new URLSearchParams(params);history.replaceState({entryFrom:true},'',location.href);
 }
 function payload(card){const b=getBundle(),a=loadAnalysis(card.id,b.revisions[card.id],b.analysis);return a?.copyPayload||{displayText:card.term,context:card.example?{text:card.example,kind:'generated_example'}:null,sourceLabel:card.date?'Work English｜'+card.date:null,shareClass:'public'}}
 function attach(container=document){
  for(const target of container.querySelectorAll('[data-lexical-tools]')){
   if(target.dataset.mounted)continue;target.dataset.mounted='yes';const card=getWords().find(w=>w.id===target.dataset.lexicalTools)||{term:target.dataset.copyTarget};if(!card.term)continue;
   mountCopy(target,payload(card),()=>target.isConnected);
  }
  for(const button of container.querySelectorAll('[data-save-lexeme]'))button.onclick=async()=>{
   const e=catalog.entries.find(e=>e.id===button.dataset.saveLexeme);if(!e)return;
   try{await saveBookmark({kind:'lexeme',id:e.id,label:e.lemma+' · '+(pos[e.pos]||e.pos)+' · '+e.senses[0].glossZh,query:e.lemma});if(button.isConnected)button.textContent='已收藏，排期未改变'}catch(error){if(button.isConnected)button.textContent=error.message}
  };
 }
 function renderDetail(container,params){
  const id=params.get('card'),term=params.get('term')||'',entryId=params.get('entryId');
  const card=id?getWords().find(w=>w.id===id):null,b=getBundle();
  const a=card?loadAnalysis(card.id,b.revisions[card.id],b.analysis):null;
  container.innerHTML='<button class="secondary" data-return>返回原页面</button>';
  container.querySelector('[data-return]').onclick=()=>{if(history.state?.entryFrom)history.back();else location.hash='dictionary'};
  if(id&&!card){const p=document.createElement('p');p.textContent='此词卡已撤回或当前内容不可用：'+id+'。原学习记录仍保留。';container.append(p);return;}
  const entries=card?entriesForCard(card,a):entryId?lookup(term).filter(e=>e.id===entryId):lookup(term);
  const title=document.createElement('h2');title.className='entry-title';title.textContent=card?.term||term;container.append(title);
  container.append(renderEntry({card:card||{term},entries,analysis:a,mode:'lookup'}));
  if(entryId&&!entries.length){const p=document.createElement('p');p.textContent='收藏的具体词条在当前版本中不可用，未自动替换为同形词。';container.append(p);}
  if(card){const button=document.createElement('button');button.className='secondary';button.textContent='收藏整个词卡';button.onclick=async()=>{try{await saveBookmark({kind:'card',id:card.id,label:card.term,query:card.term});if(button.isConnected)button.textContent='已收藏，学习记录未改变'}catch(e){if(button.isConnected)button.textContent=e.message}};container.append(button);}
  const link=document.createElement('a');link.href='https://dictionary.cambridge.org/dictionary/english/'+encodeURIComponent(card?.term||term);link.target='_blank';link.rel='noopener noreferrer';link.textContent='到 Cambridge 查询（离开本站）';container.append(link);attach(container);
 }
 function renderSearch(container){const words=getWords();let request=0,importRequest=0;container.innerHTML=`<form data-dictionary-search class="actions"><label>查词（英文或中文）<input name="q" aria-label="查词（英文或中文）" maxlength="200"></label><button>查词</button></form><p class="hint">${new Set(catalog.entries.map(e=>e.lemma)).size}个精选词头提供源义项；可查询${words.length}条学习资料，内容状态单独标明。收藏仅存当前浏览器，和评分分开。</p><div data-results></div><details><summary>我的收藏与备份</summary><button data-export class="secondary">导出收藏</button><label>导入收藏（合并，不覆盖学习记录）<input data-import type="file" accept="application/json"></label><div data-saved></div></details><p role="status" data-dictionary-feedback></p>`;
  const feedback=t=>{if(container.isConnected)container.querySelector('[data-dictionary-feedback]').textContent=t;};
  const search=q=>{const entries=searchDictionary(q),cards=words.filter(w=>(w.term+' '+(w.gloss||w.meaning)).toLowerCase().includes(q.toLowerCase())).slice(0,40);container.querySelector('[data-results]').innerHTML=`<h3>词典词条</h3>${entries.map(e=>`<button class="dictionary-result secondary" data-query="${esc(e.lemma)}" data-entry-id="${esc(e.id)}">${esc(e.lemma)} · ${pos[e.pos]} · ${esc(e.senses[0].glossZh)}</button>`).join('')||'<p>精校包未收录；可以查下方学习资料，或在详情打开官方词典。</p>'}<h3>现有学习资料（最多40条）</h3>${cards.map(c=>`<button class="dictionary-result secondary" data-card="${esc(c.id)}">${esc(c.term)} · ${esc(c.gloss||c.meaning)}</button>`).join('')||'<p>没有匹配资料。</p>'}<button data-external class="secondary">查看此查询与外部词典入口</button>`;for(const b of container.querySelectorAll('[data-query]'))b.onclick=()=>open(b.dataset.query);for(const b of container.querySelectorAll('[data-card]'))b.onclick=()=>open(words.find(c=>c.id===b.dataset.card));container.querySelector('[data-external]').onclick=()=>open(q||'word');};
  container.querySelector('form').onsubmit=e=>{e.preventDefault();search(new FormData(e.target).get('q').trim());};
  const showSaved=async()=>{const own=++request;try{const items=await bookmarks();if(!container.isConnected||own!==request)return;container.querySelector('[data-saved]').innerHTML=items.map((e,i)=>`<div><button class="textbutton" data-open-saved="${i}">${esc(e.label)} · ${e.kind==='card'?'词卡':'词典'}</button><button class="textbutton" data-remove="${i}">移除</button></div>`).join('')||'<p>还没有收藏。</p>';for(const b of container.querySelectorAll('[data-open-saved]'))b.onclick=()=>{const item=items[Number(b.dataset.openSaved)];item.kind==='card'?open({id:item.id,term:item.query}):open(item.query,item.id)};for(const b of container.querySelectorAll('[data-remove]'))b.onclick=async()=>{try{await removeBookmark(items[Number(b.dataset.remove)]);await showSaved()}catch(e){feedback(e.message)}};}catch(e){feedback(e.message)}};
  container.querySelector('details').ontoggle=()=>showSaved();
  container.querySelector('[data-export]').onclick=async()=>{try{const value={schema:1,items:await bookmarks()},url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='words-bookmarks.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);feedback('收藏已导出；学习记录请在记录与设置中另行导出。')}catch(e){feedback(e.message)}};
  container.querySelector('[data-import]').onchange=async e=>{const own=++importRequest,valid=()=>own===importRequest&&container.isConnected;try{const file=e.target.files[0];if(!file)return;if(file.size>2*1024*1024)throw Error('收藏文件超过2MB');const text=await file.text();if(!valid())return;const value=validateBookmarks(JSON.parse(text));await bookmarks(items=>{if(!valid())throw Error('导入已取消');return [...new Map([...items,...value.items].map(x=>[bookmarkKey(x),x])).values()]});if(!valid())return;feedback('收藏已合并，学习记录未改动');await showSaved();}catch(e){if(valid())feedback('未导入：'+e.message)}};
  search(new URLSearchParams(location.hash.split('?')[1]||'').get('q')||'');showSaved();
 }
 return {attach,open,renderSearch,renderDetail};
}
