import {fingerprint} from './core.mjs';
export const DICTIONARY_RULE='dictionary-full/1';
export function assertBaseline(artifacts,lock){
 if(!lock?.hashes||!Object.keys(lock.hashes).length)throw Error('Baseline lock missing');
 for(const [path,hash] of Object.entries(lock.hashes))if(typeof artifacts[path]!=='string'||fingerprint(artifacts[path])!==hash)throw Error('Baseline changed: '+path);
}
export const dictionaryFingerprint=(card,source,wiktionary)=>fingerprint({card,source,wiktionary});
const nonempty=x=>typeof x==='string'&&/[\p{L}\p{N}]/u.test(x);
const rawEntry=e=>({...e,senses:e.senses.map(({glossZh,...s})=>s)});
export function validateDictionary(card,source,wiktionary){
 const errors=[],base=source.cards.find(c=>c.cardId===card.cardId),ok=(x,m)=>{if(!x)errors.push(m)};
 ok(base&&base.term===card.term,'identity/source missing');ok(nonempty(card.writer),'writer missing');
 const expected=[...(base?.entries||[]),...wiktionary.entries.filter(e=>e.lemma===card.term)];
 ok(card.entries?.length>0&&card.entries.length===expected.length,'dictionary POS/source entries incomplete');
 const seen=new Set();
 for(const [i,e] of (card.entries||[]).entries()){
  ok(e.lemma===card.term,'wrong lemma');
  ok(expected[i]&&fingerprint(rawEntry(e))===fingerprint(rawEntry(expected[i])),'source fields/count/order changed: '+e.lemma+'/'+e.entryKey+'/'+e.sourceId);
  for(const s of e.senses||[]){ok(!seen.has(s.id),'duplicate sense');seen.add(s.id);ok(nonempty(s.glossZh),'Chinese translation missing: '+s.id)}
 }
 return errors;
}
export function checkDictionaryReview(card,source,wiktionary,r){
 const errors=validateDictionary(card,source,wiktionary),ok=(x,m)=>{if(!x)errors.push(m)};
 if(errors.length)return {status:'EVIDENCE_GAP',errors};
 if(!r)return {status:'REVIEW',errors:['Independent dictionary review missing']};
 ok(r.cardId===card.cardId&&r.ruleVersion===DICTIONARY_RULE,'review rule/identity');
 ok(nonempty(r.reviewer)&&r.reviewer!==card.writer,'reviewer not independent');
 ok(r.fingerprint===dictionaryFingerprint(card,source,wiktionary),'stale dictionary review');
 ok(r.decision==='PASS'&&Array.isArray(r.issues)&&!r.issues.some(x=>x.blocking),'review blocked');
 let score=0;for(const [key,weight] of Object.entries({accuracy:30,completion:30,readability:25,increment:15})){const n=r.scores?.[key];ok(Number.isInteger(n)&&n>=3&&n<=4,key+' below gate');ok(nonempty(r.reasons?.[key]),key+' reason missing');score+=(Number.isInteger(n)?n:0)*weight/4;}
 return {status:errors.length?'REVISE':'CANDIDATE',errors,module:{id:'additionalSenses',label:'词典义项',score,scores:r.scores,reasons:r.reasons,issues:r.issues}};
}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pos={n:'名词',v:'动词',a:'形容词',s:'形容词',r:'副词'};
const example=x=>typeof x==='string'?x:[x.text,x.source?'〔'+x.source+'〕':''].filter(Boolean).join(' ');
const usage=s=>[...(s.labels||[]),...(s.sourceDomains||[]).map(d=>'领域：'+d.labels.join(' / ')),...(s.usageLabels||[]).map(d=>'用法：'+d.label)];
export function renderDictionary(card){
 return card.entries.map(e=>{
  const wn=e.sourceId==='oewn-2025',url=wn?'https://en-word.net/lemma/'+encodeURIComponent(e.lemma):e.url;
  const attribution=wn?'Open English WordNet 2025／Princeton WordNet':'Wiktionary contributors · revision '+e.revision;
  const license=wn?'CC BY 4.0':'CC BY-SA 4.0',licenseUrl=wn?'https://creativecommons.org/licenses/by/4.0/':'https://creativecommons.org/licenses/by-sa/4.0/';
  return '<article data-dictionary-entry="'+esc(e.sourceId+'/'+e.entryKey)+'"><h3>'+esc(e.lemma)+' <small>'+esc(pos[e.pos]||e.pos)+(e.entryKey!==e.pos?' · 同形词条 '+esc(e.entryKey):'')+'</small></h3><p class="source"><a target="_blank" rel="noopener" href="'+esc(url)+'">'+esc(attribution)+'</a> · <a target="_blank" rel="noopener" href="'+licenseUrl+'">'+license+'</a> · <a href="SOURCE-NOTICE.html" target="_blank" rel="noopener">来源、范围与版权声明</a></p>'+
   (e.pronunciation?.length?'<p>词典发音：'+e.pronunciation.map(p=>esc(p.variety||'源未分口音')+' /'+esc(p.value)+'/').join(' · ')+'</p>':'')+
   (e.forms?.length?'<p>词形〔来源列出〕：'+e.forms.map(esc).join(' · ')+'</p>':'')+
   (e.alternativeForms?.length?'<p>变体：'+e.alternativeForms.map(esc).join(' · ')+'</p>':'')+
   e.senses.map(s=>'<p data-dictionary-sense="'+esc(s.id)+'"><strong>'+s.number+'. '+esc(s.glossZh)+'</strong><br><small>本项目中文译释</small><br>'+(usage(s).length?'<span>'+usage(s).map(esc).join(' · ')+'</span><br>':'')+'<span class="en" lang="en">'+s.definitions.map(esc).join('<br>')+'</span>'+s.lexicalExamples.map(x=>'<br><span class="en" lang="en">词条例句：'+esc(example(x))+'</span>').join('')+s.examples.map(x=>'<br><span class="en" lang="en">'+(wn?'同义词集例句〔未必使用本词〕：':'词典例句：')+esc(example(x))+'</span>').join('')+(s.usageFrames.length?'<br><span class="en" lang="en">源句型〔----为动词占位〕：'+s.usageFrames.map(esc).join(' / ')+'</span>':'')+'</p>').join('')+'</article>';
 }).join('')+'<p class="source">以上为所标版本中该词的全部义项，不因前面已展示当前义而删减源义项；并非所有词典的合并全集。源中未提供的例句、标签或用法不补造。英语释义保留源文本；中文是项目译释。WordNet义项按同义词集划分，可能含较少用义和近似义，例句可能使用同组其他词。</p>';
}
