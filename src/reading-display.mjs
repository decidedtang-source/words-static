import {moduleOrderSettings,bindModuleOrder,applyModuleOrder} from './module-order.mjs';
import {createFaceSizer} from './equal-faces.mjs';
import {readingPreferences,contentExpanded,sectionLabels,saveReadingPreference,maskLabels,defaultModuleOrder,flipMaskKeys} from './display-preferences.mjs';
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
  const masked=readingPreferences().masks[maskKey],label=['ipa','pos'].includes(maskKey)?maskLabels[maskKey]:kind==='en'?'英文例句':'中文解释';
  if(!masked)return `<span data-learning-text="${kind}" data-mask-key="${maskKey}">${html}</span>`;
  return `<span class="learning-mask" data-learning-text="${kind}" data-mask-key="${maskKey}" data-masked="true"><button type="button" class="mask-toggle" aria-expanded="false" aria-label="显示${label}"><span class="masked-content" aria-hidden="true">${html}</span><span class="mask-hint" aria-hidden="true">点击显示${label}</span></button></span>`;
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
      else button.setAttribute('aria-label',`显示${['ipa','pos'].includes(wrapper.dataset.maskKey)?maskLabels[wrapper.dataset.maskKey]:wrapper.dataset.learningText==='en'?'英文例句':'中文解释'}`);
    };
  });
}
export function resetReadingState(container) {
  container.querySelectorAll('[data-reading-section]').forEach(detail=>{detail.open=contentExpanded(detail.dataset.readingSection);});
  container.querySelectorAll('.learning-mask[data-masked="false"] .mask-toggle').forEach(button=>button.click());
}

export function applyFlipActions(container){
 const p=readingPreferences();
 container.querySelectorAll('[data-reading-section]').forEach(el=>{const action=p.flipSections[el.dataset.readingSection];if(action==='open')el.open=true;else if(action==='closed')el.open=false;});
 container.querySelectorAll('.learning-mask[data-masked="true"]').forEach(mask=>{if(p.flipMasks[mask.dataset.maskKey])mask.querySelector('.mask-toggle')?.click();});
}

export function applyFaceVisibility(container,face){
 const selected=readingPreferences()[face==='front'?'frontModules':'backModules'];
 for(const el of container.querySelectorAll(':scope>[data-reading-section],:scope>[data-reading-module]')){const key=el.dataset.readingModule||el.dataset.readingSection,hidden=!selected.includes(key);el.classList.toggle('face-hidden',hidden);el.inert=hidden;if(hidden)el.setAttribute('aria-hidden','true');else el.removeAttribute('aria-hidden');}
 for(const el of container.querySelectorAll('[data-lexical-tools],.recall-prompt')){const hidden=el.matches('.recall-prompt')?face==='back':face==='front'||selected.length===0;el.classList.toggle('face-hidden',hidden);el.inert=hidden;if(hidden)el.setAttribute('aria-hidden','true');else el.removeAttribute('aria-hidden');}
}
export function prepareFace(probe,face,snapshot){bindLearningMasks(probe);resetReadingState(probe);restoreReadingState(probe,snapshot||[]);if(face==='back')applyFlipActions(probe);applyFaceVisibility(probe,face);}
function faceContentSettings(){const p=readingPreferences();return `<fieldset class="reading-settings"><legend>正反面分别显示什么</legend><p class="hint">每面可选多个模块，也可以全部不选。正反面保持同样大小，未显示的内容保留空白位置。</p>${['front','back'].map(face=>`<div><h3>${face==='front'?'正面':'背面'}</h3>${defaultModuleOrder.map(key=>`<label class="readlabel"><input type="checkbox" data-reading-setting="${face}-visible:${key}" ${p[face+'Modules'].includes(key)?'checked':''}>${sectionLabels[key]}</label>`).join('')}</div>`).join('')}</fieldset>`;}

function flipPreview(){return readingPreferences().order.map(key=>section(key,sectionLabels[key],previewSample(key))).join('');}
function flipSettings(){const p=readingPreferences();return `<fieldset class="reading-settings flip-settings"><legend>翻开与切换词卡</legend><label class="readlabel"><input type="checkbox" data-reading-setting="keepFace" ${p.keepFace?'checked':''}>切换单词时保持当前正面或背面</label><label for="reading-scroll-mode">切换单词时的阅读位置</label><select id="reading-scroll-mode" data-reading-setting="scrollMode">${[['module','切词时按阅读模块衔接'],['position','保持页面滚动位置'],['top','回到顶部']].map(([value,label])=>`<option value="${value}" ${p.scrollMode===value?'selected':''}>${label}</option>`).join('')}</select><p class="hint">默认下一词先显示正面；勾选后，从背面评分会直接进入下一词的背面。回到正面后也可以继续翻开。</p><h3>翻开词卡时</h3><p class="hint">点击“显示释义”后执行。保持原状会沿用正面手动状态和各模块默认设置。</p><div class="flip-section-controls">${defaultModuleOrder.map(key=>`<label>${sectionLabels[key]}<select data-reading-setting="flip-section:${key}" aria-label="翻开时${sectionLabels[key]}">${[['keep','保持原状'],['open','展开'],['closed','收起']].map(([value,label])=>`<option value="${value}" ${p.flipSections[key]===value?'selected':''}>${label}</option>`).join('')}</select></label>`).join('')}</div><p>翻开时自动揭开：</p>${flipMaskKeys.map(key=>`<label class="readlabel"><input type="checkbox" data-reading-setting="flip-mask:${key}" ${p.flipMasks[key]?'checked':''}>${maskLabels[key]}</label>`).join('')}<p class="hint">未勾选的遮挡保持原状。下一张词卡重新使用默认设置；自动朗读在“发音”中单独设置。</p><button class="secondary" type="button" data-flip-preview-button>预览翻开效果</button><div class="flip-preview" data-flip-preview>${flipPreview()}</div></fieldset>`;}

const sampleText={meaning:'范围；界限',foundation:'scope（名词）：涉及的范围',context:'这里指项目需要覆盖哪些工作，以及不包括哪些工作。',example:'We need to define the scope before Friday.',translation:'我们需要在星期五之前明确范围。',dictionary:'某项活动、研究等所涉及的范围。'};
const maskControl=key=>`<label class="readlabel"><input type="checkbox" data-reading-setting="mask:${key}" ${readingPreferences().masks[key]?'checked':''}>遮住${maskLabels[key]}</label>`;
function previewSample(key){
 if(key==='term')return `<div class="word">scope</div><div class="ipa">${learningText('/skəʊp/','ipa','','ipa')} · ${learningText('noun','pos','','pos')}</div>`;
 if(key==='foundation')return `<p>scope（${learningText('名词','pos','','pos')}）：${learningText('涉及的范围','zh','','foundation')}</p>`;
 if(key==='examples')return `<p class="example-english">${learningText(sampleText.example,'en','scope')}</p><p class="example-translation">${learningText(sampleText.translation,'zh','','translation')}</p>`;
 return `<p>${learningText(sampleText[key],'zh','',key)}</p>`;
}
function previewModule(key){
 const p=readingPreferences();
 return `<div class="preview-controls"><label class="readlabel"><input type="radio" name="frontModule" aria-label="设为正面：${sectionLabels[key]}" value="${key}" ${p.frontModules.length===1&&p.frontModules.includes(key)?'checked':''}>仅此模块做正面</label><label class="readlabel"><input type="checkbox" data-reading-setting="${key}" aria-label="${sectionLabels[key]}默认展开" ${p.expanded[key]?'checked':''}>默认展开</label>${key==='examples'?maskControl('example')+maskControl('translation')+`<label class="readlabel"><input type="checkbox" data-reading-setting="underline" ${p.underline?'checked':''}>例句目标词下划线</label>`:key!=='term'?maskControl(key):maskControl('ipa')+maskControl('pos')}</div><details class="preview-module" ${p.expanded[key]?'open':''}><summary>${sectionLabels[key]}预览</summary>${previewSample(key)}</details>`;
}
export function readingSettings(){
 const p=readingPreferences();
 return `<section class="panel reading-editor"><h2>阅读显示</h2>${moduleOrderSettings()}${faceContentSettings()}${flipSettings()}<fieldset class="reading-settings"><legend>词典详情</legend>${maskControl('dictionary')}<div data-dictionary-preview>${previewSample('dictionary')}</div>${['dictionary','analysis'].map(key=>`<label class="readlabel"><input type="checkbox" data-reading-setting="${key}" ${p.expanded[key]?'checked':''}>${sectionLabels[key]}默认展开</label>`).join('')}</fieldset><p class="muted">正反面按各自选择显示内容，沿用模块展开与遮罩设置。上面的“仅此模块做正面”可快速改为单模块正面。</p><p class="muted">文字遮罩独立设置，朗读与其他操作按钮不会被遮住。设置下次打开词卡时生效。</p></section>`;
}
let previewObserver;
export function stopReadingPreview(){previewObserver?.disconnect();previewObserver=null;}
export function bindReadingSettings(notice){
 stopReadingPreview();
 const panel=document.querySelector('.reading-editor');let flipped=false,previewFront=null,previewBack=null;const preview=panel.querySelector('[data-flip-preview]'),previewButton=panel.querySelector('[data-flip-preview-button]'),fitPreview=createFaceSizer();const syncPreview=()=>{applyFaceVisibility(preview,flipped?'back':'front');fitPreview(preview,JSON.stringify(readingPreferences()),(probe,face)=>prepareFace(probe,face,face==='front'?(flipped?previewFront:captureReadingState(preview)):(flipped?captureReadingState(preview):(previewBack||captureReadingState(preview)))))};previewButton.onclick=()=>{const snapshot=captureReadingState(preview);if(flipped)previewBack=snapshot;else previewFront=snapshot;flipped=!flipped;preview.innerHTML=flipPreview(!flipped);bindLearningMasks(preview);restoreReadingState(preview,flipped?(previewBack||previewFront||[]):(previewFront||[]));if(flipped)applyFlipActions(preview);syncPreview();previewButton.textContent=flipped?'返回正面预览':'预览翻开效果'};
 const redraw=bindModuleOrder(previewModule,()=>{bindLearningMasks(panel);applyModuleOrder(preview);syncPreview()});syncPreview();let previewWidth=preview.getBoundingClientRect().width;previewObserver=new ResizeObserver(()=>{if(!preview.isConnected)return;const width=preview.getBoundingClientRect().width;if(Math.abs(width-previewWidth)>1){previewWidth=width;syncPreview()}});previewObserver.observe(preview);preview.addEventListener('toggle',syncPreview,true);preview.addEventListener('click',syncPreview);
 panel.onchange=e=>{
   const input=e.target,key=input.name==='frontModule'?'frontModule':input.dataset.readingSetting;if(!key)return;
   const saved=saveReadingPreference(key,key==='frontModule'||key==='scrollMode'||key.startsWith('flip-section:')?input.value:input.checked),y=scrollY;
   const focusSelector=key==='frontModule'?`input[name="frontModule"][value="${input.value}"]`:`[data-reading-setting="${key}"]`;
   flipped=false;previewFront=null;previewBack=null;preview.innerHTML=flipPreview();redraw();previewButton.textContent='预览翻开效果';panel.querySelector('[data-dictionary-preview]').innerHTML=previewSample('dictionary');bindLearningMasks(panel);panel.querySelectorAll('[data-reading-setting^="front-visible:"],[data-reading-setting^="back-visible:"]').forEach(el=>{const [face,module]=el.dataset.readingSetting.split('-visible:');el.checked=readingPreferences()[face+'Modules'].includes(module)});syncPreview();
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
