// Measure both faces off-screen without changing the visible card or scroll range.
export function createFaceSizer(){
 let previousKey=null,previousWidth=0,reserved=0;
 return (container,key,prepare)=>{
  if(!container?.isConnected)return;
  const width=container.getBoundingClientRect().width;if(!width)return;
  if(key!==previousKey||Math.abs(width-previousWidth)>1){reserved=0;previousKey=key;previousWidth=width;}
  for(const face of ['current','front','back']){
   const probe=container.cloneNode(true);probe.removeAttribute('tabindex');probe.setAttribute('aria-hidden','true');probe.inert=true;
   Object.assign(probe.style,{position:'fixed',left:'-100000px',top:'0',width:width+'px',minHeight:'0',height:'auto',margin:'0',visibility:'hidden',pointerEvents:'none'});
   container.parentElement.append(probe);
   try{if(face!=='current')prepare(probe,face);reserved=Math.max(reserved,Math.ceil(probe.getBoundingClientRect().height));}finally{probe.remove();}
  }
  container.style.minHeight=reserved+'px';
 };
}
