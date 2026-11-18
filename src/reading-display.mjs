import {readingPreferences,contentExpanded,sectionLabels,saveReadingPreference} from './display-preferences.mjs';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function underlineTarget(text,term,enabled=readingPreferences().underline) {
  if(!enabled||!term?.trim())return esc(text);
  const pattern=term.trim().split(/\s+/).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('\\s+');
  const re=new RegExp(`(^|[^\\p{L}\\p{N}_])(${pattern})(?![\\p{L}\\p{N}_])`,'giu');
  let result='',offset=0;
  for(const match of text.matchAll(re)){result+=esc(text.slice(offset,match.index)+match[1])+`<u class="target-word">${esc(match[2])}</u>`;offset=match.index+match[0].length;}
  return result+esc(text.slice(offset));
}
export function learningText(text,kind='zh',term='') {
  const html=kind==='en'?underlineTarget(String(text??''),term):esc(text);
  const masked=readingPreferences()[kind==='en'?'maskEnglish':'maskChinese'];
  if(!masked)return `<span data-learning-text="${kind}">${html}</span>`;
  return `<span class="learning-mask" data-learning-text="${kind}" data-masked="true"><button type="button" class="mask-toggle" aria-expanded="false" aria-label="显示${kind==='en'?'英文例句':'中文解释'}"><span class="masked-content" aria-hidden="true">${html}</span><span class="mask-hint" aria-hidden="true">点击显示${kind==='en'?'英文例句':'中文解释'}</span></button></span>`;
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
export function readingSettings() {
  const p=readingPreferences();
  return `<section class="panel"><h2>阅读显示</h2><fieldset class="reading-settings"><legend>默认展开的内容</legend>${Object.entries(sectionLabels).map(([key,label])=>`<label class="readlabel"><input type="checkbox" data-reading-setting="${key}" ${p.expanded[key]?'checked':''}>${label}默认展开</label>`).join('')}</fieldset><fieldset class="reading-settings"><legend>文字提示</legend>${[['maskChinese','默认遮住中文解释'],['maskEnglish','默认遮住英文例句'],['underline','例句中的目标词加下划线']].map(([key,label])=>`<label class="readlabel"><input type="checkbox" data-reading-setting="${key}" ${p[key]?'checked':''}>${label}</label>`).join('')}</fieldset><p class="muted">未勾选的区块默认折叠。遮罩只影响学习文字，点击可显示，再点可遮住；朗读按钮始终可用。设置保存在当前浏览器，下次打开词卡时生效。</p><p class="hint">先听后看：展开例句，遮住英文例句与中文解释，折叠词汇。先看句子猜词：展开例句，只遮住中文解释，折叠词汇。</p></section>`;
}
export function bindReadingSettings(notice) {
  document.querySelectorAll('[data-reading-setting]').forEach(input=>input.onchange=()=>notice(saveReadingPreference(input.dataset.readingSetting,input.checked)?'显示偏好已保存，下次打开词卡时生效':'浏览器拒绝保存显示偏好，本次仍可使用。'));
}
