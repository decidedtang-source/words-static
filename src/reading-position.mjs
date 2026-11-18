export function capturePosition(container){
 const sections=[...container?.querySelectorAll('[data-reading-section]')||[]];
 const anchor=sections.find(el=>el.getBoundingClientRect().bottom>0)||sections.at(-1),rect=anchor?.getBoundingClientRect();
 return {y:window.scrollY,key:anchor?.dataset.readingSection,offset:rect?-rect.top:0};
}
export function restorePosition(container,position,mode='module'){
 let y=mode==='top'?0:position?.y||0;
 if(mode==='module'&&position?.key){const anchor=[...container?.querySelectorAll('[data-reading-section]')||[]].find(el=>el.dataset.readingSection===position.key);if(anchor){const rect=anchor.getBoundingClientRect();y=window.scrollY+rect.top+Math.min(position.offset,Math.max(0,rect.height-44));}}
 window.scrollTo({top:Math.max(0,y),left:0,behavior:'auto'});
}
