import fs from 'node:fs';
import {makeV2HTML} from '../modules/automation/render.mjs';
import {root} from '../modules/system.mjs';
import {sha} from '../modules/system.mjs';
import {parseSnapshot} from '../modules/history-source.mjs';
const read=p=>fs.readFileSync(root+'/'+p,'utf8').replace(/\r\n/g,'\n');
export function verifyHistoryEvidence(raw,receipt){
 if(sha(raw)!==receipt.rawSHA)throw Error('History source hash mismatch');
 const parsed=raw.split(/-{40,}/).flatMap(part=>{try{return [parseSnapshot(part,receipt.lemma)];}catch{return [];}});
 if(!parsed.some(p=>sha(p.text)===receipt.textSHA))throw Error('History entry text missing or changed');
}
export function makeBasic(words){
 const remove=['bridge','bridgeHistory','bridgeTarget','analysisStatus','dictUrl','extra','inventorySenses','coverageLabel'];
 const clean=words.map(w=>Object.fromEntries(Object.entries(w).filter(([k])=>!remove.includes(k))));
 let html=makeV2HTML(clean);
 for(const id of ['dictionary','bridge','analysis']){const view=read('word-page/modules/'+id+'/view-front.html');if(!html.includes(view))throw Error('Missing frozen view '+id);html=html.replace(view,'');}
 const context='<details><summary>查看必要上下文</summary><p>${escape(w.context)}</p></details>';
 if(!html.includes(context))throw Error('Context view missing');html=html.replace(context,'');
 html=html.replace('data-go="bridge">↑ 回看 Bridge','data-go="common">↑ 回看学习义项');
 html=html.replace(/<button[^>]*data-go="(?:dictionary|bridge|deep)"[^>]*>[\s\S]*?<\/button>/g,'').replace(/<option value="(?:dictionary|bridge|deep)">[^<]*<\/option>/g,'');
 html=html.replaceAll('50词 · 自动资料接入 V2','基础学习版 1.0 · '+words.length+'词').replace(' · 七步分析待搭建',' · 正式发布基线');
 html=html.replace('<label>查看','<button type="button" id="expand-all">展开来源</button><label>查看');
 html=html.replace("wordSelect.addEventListener('change',showWord);","root.querySelector('#expand-all').addEventListener('click',()=>{root.querySelectorAll('details').forEach(d=>d.open=true);});wordSelect.addEventListener('change',showWord);");
 return html;
}
export function verifyWords(words,source,expected=100){
 const errors=[],sources=new Map(source.map(w=>[w.id,w]));
 if(words.length!==expected||new Set(words.map(w=>w.entryId)).size!==expected||sources.size!==expected)errors.push('Roster count/duplicates');
 for(const w of words){
  if(!sources.has(w.entryId)||sources.get(w.entryId).example!==w.quote)errors.push(w.entryId+': original quote mismatch');
  if(![w.word,w.ipa,w.pos,w.quote,w.translation,w.meaning,w.sentenceExplanation,w.general].every(v=>typeof v==='string'&&v.trim()))errors.push(w.entryId+': missing required content');
  if(!w.senses?.length||w.senses.some(s=>![s.title,s.en,s.example,s.zh].every(v=>typeof v==='string'&&v.trim())))errors.push(w.entryId+': learning content incomplete');
  if(new Set([w.quote,...(w.senses||[]).map(s=>s.example)]).size<2)errors.push(w.entryId+': needs two distinct bilingual examples');
  if(!w.historyCards?.length||w.historyCards.some(c=>!c.summary||!c.url||c.status!=='ready'))errors.push(w.entryId+': history incomplete');
 }
 return {pass:!errors.length,errors,entries:words.length};
}
