import {readingPreferences,saveReadingPreference,sectionLabels,defaultModuleOrder} from './display-preferences.mjs';

export function applyModuleOrder(container) {
  const modules=[...container.children].filter(el=>defaultModuleOrder.includes(el.dataset.readingModule||el.dataset.readingSection));
  if(modules.length<2)return;
  const marker=document.createComment('module order');container.insertBefore(marker,modules[0]);
  for(const key of readingPreferences().order)for(const el of modules)if((el.dataset.readingModule||el.dataset.readingSection)===key)container.insertBefore(el,marker);
  marker.remove();
}

export function moduleOrderSettings() {
  return '<fieldset class="reading-settings"><legend>词卡模块顺序</legend><p class="hint">拖动左侧手柄调整顺序，也可使用上移、下移按钮。适用于背单词和词库；词典详情中的对应模块也使用此顺序。</p><ol class="module-order" aria-label="词卡模块顺序"></ol><button type="button" class="secondary" data-reset-order>恢复原顺序</button><p class="hint" role="status" data-order-status></p></fieldset>';
}

export function bindModuleOrder() {
  const list=document.querySelector('.module-order');if(!list)return;
  const status=document.querySelector('[data-order-status]');let drag=null;
  const draw=()=>{
    list.innerHTML=readingPreferences().order.map((key,i)=>`<li data-module-key="${key}"><button type="button" class="order-handle" aria-label="拖动${sectionLabels[key]}调整顺序">⠿</button><span>${sectionLabels[key]}</span><button type="button" class="order-step" data-step="-1" aria-label="上移${sectionLabels[key]}" ${i===0?'disabled':''}>↑</button><button type="button" class="order-step" data-step="1" aria-label="下移${sectionLabels[key]}" ${i===readingPreferences().order.length-1?'disabled':''}>↓</button></li>`).join('');
  };
  const finish=(order,key)=>{
    const saved=saveReadingPreference('order',order);draw();
    list.querySelector(`[data-module-key="${key}"] .order-handle`)?.focus({preventScroll:true});
    status.textContent=saved?'模块顺序已保存，下次打开词卡时生效。':'浏览器拒绝保存顺序，本次仍可使用。';
  };
  const move=(row,step)=>{
    const order=[...readingPreferences().order],key=row.dataset.moduleKey,from=order.indexOf(key),to=from+step;
    if(to<0||to>=order.length)return;
    order.splice(from,1);order.splice(to,0,key);finish(order,key);
  };
  list.onclick=e=>{const button=e.target.closest('[data-step]');if(button)move(button.closest('li'),Number(button.dataset.step));};
  list.onkeydown=e=>{if(e.target.closest('.order-handle')&&['ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();move(e.target.closest('li'),e.key==='ArrowUp'?-1:1);}};
  list.onpointerdown=e=>{
    const handle=e.target.closest('.order-handle');if(!handle||e.button!==0||drag)return;
    e.preventDefault();drag={row:handle.closest('li'),id:e.pointerId};drag.row.classList.add('is-dragging');list.setPointerCapture(e.pointerId);
  };
  list.onpointermove=e=>{
    if(!drag||drag.id!==e.pointerId)return;e.preventDefault();
    const row=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-module-key]');
    if(row&&row.parentElement===list&&row!==drag.row){const box=row.getBoundingClientRect();list.insertBefore(drag.row,e.clientY<box.top+box.height/2?row:row.nextSibling);}
    if(e.clientY<55)window.scrollBy(0,-12);else if(e.clientY>innerHeight-55)window.scrollBy(0,12);
  };
  list.onpointerup=e=>{
    if(!drag||drag.id!==e.pointerId)return;
    const key=drag.row.dataset.moduleKey,order=[...list.children].map(row=>row.dataset.moduleKey);drag=null;
    if(list.hasPointerCapture(e.pointerId))list.releasePointerCapture(e.pointerId);finish(order,key);
  };
  const cancel=()=>{if(drag){drag=null;draw();}};
  list.onpointercancel=cancel;list.onlostpointercapture=cancel;
  document.querySelector('[data-reset-order]').onclick=()=>finish([...defaultModuleOrder],'term');draw();
}
