import fs from 'node:fs';import {assemble,root} from '../../word-page/manage.mjs';import {assertEntity} from './contracts.mjs';
export function toV10AnalysisProjection(a){assertEntity('AnalysisRecord',a);return {analysisBlocks:a.blocks.map(b=>({id:b.blockId,title:b.title||b.dimensions.join(' · '),text:b.text})),workplaceUse:a.workplaceUse};}
export function toLegacyReadingProjection(entry,context,resources){
 const {selection,bridge,history,analysis,inventory,senses,practices=[]}=resources;
 if(!selection||!bridge||!history||!analysis||!inventory||!senses||!context.quote)throw Error('missing projection dependencies');
 const learn=selection.senses.map(s=>{const sense=senses.find(x=>x.senseId===s.senseId);if(!sense)throw Error('missing sense');const e=s.examples[0];if(!e)throw Error('missing learning example');return {title:s.title,en:s.explanationZh,meta:s.usageLabels.join(' · '),example:e.en,zh:e.zh,credit:e.origin==='original'?'原创教学例句':'来源例句',url:s.evidenceRefs[0].url||'https://en-word.net/'};});
 return {word:entry.term,entryId:entry.id,ipa:resources.verifiedIPA||'音标待核',pos:entry.pos,general:selection.general,senses:learn,note:selection.reason,retrieved:'2026-11-16',retrieval:'verified source records',learningSource:'成熟资料选义＋中文整理；不作频率排名',dictUrl:resources.dictionaryURL||'https://en-word.net/',extra:'',history:history.summary||'本条暂无已核实的历史资料。',historyUrl:resources.historyURL||'',meaning:context.meaning,sourceLabel:'原词库教学材料 · '+entry.date,sourceUrl:null,sourceDate:null,quote:context.quote,translation:context.translation,quoteType:'教学例句／转述；非已核实的作者逐字引文',context:context.context||'来源身份以原词库记录为限。',highlightTerm:context.meaning,keyMeaning:context.meaning,bridge:bridge.semanticText+' '+bridge.boundary,bridgeHistory:bridge.historyLink?.text||null,inventorySenses:senses.map(s=>({title:s.meaning.glossZh,en:s.meaning.definitionEn,id:s.senseId})),coverageLabel:inventory.coverageStatus==='complete'?'该来源条目范围内的义项':'已核查的部分义项；不代表完整词典',...toV10AnalysisProjection(analysis),practiceCards:practices};
}
export function assembleCandidate(p,bundles){
 const baseline=assemble(p);if(!bundles.length)return baseline;
 const words=bundles.map(b=>toLegacyReadingProjection(b.snapshot,b.context,b));let template=baseline.template;
 const analysis=fs.readFileSync(root+'/modules/analysis/view-v2.html','utf8').replace(/\r\n/g,'\n');
 template=template.replace(p.modules.analysis.view,analysis);
 template=template.replace(p.modules.learning.view,p.modules.learning.view.replace('英文例句为词典短引。','英文例句的来源身份见各例标注。'));
 template=template.replace(p.modules.dictionary.view,'<details id="wl-dictionary"><summary>完整词典</summary><div class="dictionary-body" data-slot="full-dictionary"><p class="muted">${escape(w.coverageLabel)}</p>${w.inventorySenses.map(s=>`<p><strong>${escape(s.title)}</strong><br>${escape(s.en)}</p>`).join(\'\')}<p>${link(w.dictUrl,\'查看来源词典 ↗\')}</p></div></details>');
 template=template.replace(p.modules.history.view,p.modules.history.view.replace("${link(w.historyUrl,'Etymonline ↗')}","${w.historyUrl?link(w.historyUrl,'历史来源 ↗'):'尚无已核实史源'}"));
 const details='<details id="wl-bridge-history"><summary>历史联系 · 如何接到当前场景</summary><p>${escape(w.bridgeHistory)}</p><button class="text-button" data-go="history">↑ 回看前面的历史用法</button></details>';
 template=template.replace(details,"${w.bridgeHistory?`"+details+"`:''}");
 template=template.replace(/<select id="wl-word">[\s\S]*?<\/select>/,`<select id="wl-word">${words.map((w,i)=>`<option value="${i}">${html(w.word)}</option>`).join('')}</select>`);
 return {words,template};
}
function html(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
