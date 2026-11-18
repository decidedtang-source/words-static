import {moduleOrderSettings,bindModuleOrder} from './module-order.mjs';
import {readingPreferences,contentExpanded,sectionLabels,saveReadingPreference,maskLabels} from './display-preferences.mjs';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function underlineTarget(text,term,enabled=readingPreferences().underline) {
  if(!enabled||!term?.trim())return esc(text);
  const pattern=term.trim().split(/\s+/).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('\\s+');
  const re=new RegExp(`(^|[^\\p{L}\\p{N}_])(${pattern})(?![\\p{L}\\p{N}_])`,'giu');
  let result='',offset=0;
  for(const match of text.matchAll(re)){result+=esc(text.slice(offset,match.index)+match[1])+`<u class="target-word">${esc(match[2])}</u>`;offset=match.index+match[0].length;}
  return result+esc(text.slice(offset));
}
export function learningText(text,kind='zh',term='',maskKey=kind==='en'?'example':'meaning') {
  const html=kind==='en'?underlineTarget(String(text??''),term):esc(text);
  const masked=readingPreferences().masks[maskKey];
  if(!masked)return `<span data-learning-text="${kind}" data-mask-key="${maskKey}">${html}</span>`;
  return `<span class="learning-mask" data-learning-text="${kind}" data-mask-key="${maskKey}" data-masked="true"><button type="button" class="mask-toggle" aria-expanded="false" aria-label="显示${kind==='en'?'英文例句':'中文解释'}"><span class="masked-content" aria-hidden="true">${html}</span><span class="mask-hint" aria-hidden="true">点击显示${kind==='en'?'英文例句':'中文解释'}</span></button></span>`;
}
export function section(key,label,body,cls='') {
  return `<details class="reading-section ${cls}" data-reading-section="${key}" ${contentExpanded(key)?'open':''}><summary>${esc(label)}</summary>${body}</details>`;
}
export function bindLearningMasks(container=document) {
  container.querySelectorAll('.mask-toggle').forEach(button=>{
    button.onclick=()=>{
      const wrapper=button.parentElement,hidden=wrapper.dataset.masked==='true';
      wrapper.dataset.masked=String(!hidden);button.setAttribute('aria-expanded',String(hidden));
      button.querySelector('.masked-content').setAttribute('aria-hidden',String(!hidden));
      if(hidden)button.removeAttribute('aria-label');
      else button.setAttribute('aria-label',`显示${wrapper.dataset.learningText==='en'?'英文例句':'中文解释'}`);
    };
  });
}
export function resetReadingState(container) {
  container.querySelectorAll('[data-reading-section]').forEach(detail=>{detail.open=contentExpanded(detail.dataset.readingSection);});
  container.querySelectorAll('.learning-mask[data-masked="false"] .mask-toggle').forEach(button=>button.click());
}

const sampleText={meaning:'范围；界限',foundation:'scope（名词）：涉及的范围',context:'这里指项目需要覆盖哪些工作，以及不包括哪些工作。',example:'We need to define the scope before Friday.',translation:'我们需要在星期五之前明确范围。',dictionary:'某项活动、研究等所涉及的范围。'};
const maskControl=key=>`<label class="readlabel"><input type="checkbox" data-reading-setting="mask:${key}" ${readingPreferences().masks[key]?'checked':''}>遮住${maskLabels[key]}</label>`;
function previewSample(key){
 if(key==='term')return '<div class="word">scope</div><div class="ipa">/skəʊp/ · noun</div>';
 if(key==='examples')return `<p class="example-english">${learningText(sampleText.example,'en','scope')}</p><p class="example-translation">${learningText(sampleText.translation,'zh','','translation')}</p>`;
 return `<p>${learningText(sampleText[key],'zh','',key)}</p>`;
}
function previewModule(key){
 const p=readingPreferences();
 return `<div class="preview-controls"><label class="readlabel"><input type="radio" name="frontModule" aria-label="设为正面：${sectionLabels[key]}" value="${key}" ${p.frontModule===key?'checked':''}>设为正面</label><label class="readlabel"><input type="checkbox" data-reading-setting="${key}" aria-label="${sectionLabels[key]}默认展开" ${p.expanded[key]?'checked':''}>默认展开</label>${key==='examples'?maskControl('example')+maskControl('translation')+`<label class="readlabel"><input type="checkbox" data-reading-setting="underline" ${p.underline?'checked':''}>例句目标词下划线</label>`:key!=='term'?maskControl(key):''}</div><details class="preview-module" ${p.expanded[key]?'open':''}><summary>${sectionLabels[key]}预览</summary>${previewSample(key)}</details>`;
}
export function readingSettings(){
 const p=readingPreferences();
 return `<section class="panel reading-editor"><h2>阅读显示</h2>${moduleOrderSettings()}<fieldset class="reading-settings"><legend>词典详情</legend>${maskControl('dictionary')}<div data-dictionary-preview>${previewSample('dictionary')}</div>${['dictionary','analysis'].map(key=>`<label class="readlabel"><input type="checkbox" data-reading-setting="${key}" ${p.expanded[key]?'checked':''}>${sectionLabels[key]}默认展开</label>`).join('')}</fieldset><p class="muted">正面仅显示所选模块，沿用该模块的展开与遮罩设置。点“显示释义”查看完整词卡。没有基础词义的卡片会提示暂无内容，不会提前露出单词。</p><p class="muted">文字遮罩独立设置，朗读与其他操作按钮不会被遮住。设置下次打开词卡时生效。</p></section>`;
}
export function bindReadingSettings(notice){
 const panel=document.querySelector('.reading-editor');
 const redraw=bindModuleOrder(previewModule,()=>bindLearningMasks(panel));
 panel.onchange=e=>{
   const input=e.target,key=input.name==='frontModule'?'frontModule':input.dataset.readingSetting;if(!key)return;
   const saved=saveReadingPreference(key,key==='frontModule'?input.value:input.checked),y=scrollY;
   const focusSelector=key==='frontModule'?`input[name="frontModule"][value="${input.value}"]`:`[data-reading-setting="${key}"]`;
   redraw();panel.querySelector('[data-dictionary-preview]').innerHTML=previewSample('dictionary');bindLearningMasks(panel);
   panel.querySelector(focusSelector)?.focus({preventScroll:true});window.scrollTo(0,y);
   notice(saved?'显示偏好已保存，示例已更新；下次打开词卡时生效。':'浏览器拒绝保存显示偏好，本次仍可使用。');
 };
}
export function captureReadingState(container){
 return [...container.querySelectorAll('[data-reading-section]')].map(el=>({key:el.dataset.readingSection,open:el.open,revealed:[...el.querySelectorAll('.learning-mask')].map(mask=>mask.dataset.masked==='false')}));
}
export function restoreReadingState(container,snapshot){
 for(const item of snapshot){const el=container.querySelector(`[data-reading-section="${item.key}"]`);if(!el)continue;el.open=item.open;el.querySelectorAll('.learning-mask').forEach((mask,i)=>{if(item.revealed[i]&&mask.dataset.masked==='true')mask.querySelector('button').click();});}
}
