export function copyOriginal(displayText){
 if(typeof displayText!=='string'||!displayText.trim()||displayText.length>4000)throw Error('请选择 1–4000 字符的目标；超长内容请手工选择复制。');return displayText;
}
export function buildDeepAnalysisCopy({displayText,context,sourceLabel,shareClass}){
 let text='【深析】'+copyOriginal(displayText);const omissions=[];
 if(!['public','approved'].includes(shareClass)){if(context||sourceLabel)omissions.push('私人或未确认上下文已省略');return {text,omissions};}
 if(context?.text&&context.text!==displayText){
  if(context.text.length>2000)omissions.push('超长上下文已省略');
  else if(['original_sentence','generated_example'].includes(context.kind))text+='\n'+(context.kind==='original_sentence'?'原句':'学习例句')+'：'+context.text;
  else omissions.push('来源类型未确认，上下文已省略');
 }
 if(sourceLabel){if(sourceLabel.length>200)omissions.push('超长来源已省略');else text+='\n来源：'+sourceLabel;}
 return {text,omissions};
}
export async function copyText(text,clipboard=globalThis.navigator?.clipboard){
 if(!clipboard?.writeText)throw Error('剪贴板不可用');await clipboard.writeText(text);
}
export function mountCopy(container,payload,isCurrent=()=>true){
 const group=document.createElement('section');group.className='copy-controls';
 const status=document.createElement('p');status.setAttribute('role','status');
 const warning=document.createElement('p');warning.className='hint';warning.textContent='复制目标原文全文；若目标含私人信息，也会完整复制。请确认后再粘贴发送。';
 let sequence=0;
 for(const [label,build]of [['复制原文',()=>({text:copyOriginal(payload.displayText),omissions:[]})],['复制深析',()=>buildDeepAnalysisCopy(payload)]]){
  const button=document.createElement('button');button.textContent=label;button.setAttribute('aria-label',label);
  try{copyOriginal(payload.displayText);}catch(e){button.disabled=true;status.textContent=e.message;}
  button.onclick=()=>{
   const request=++sequence,result=build();status.textContent='正在复制…';
   const valid=()=>group.isConnected&&isCurrent()&&request===sequence;
   copyText(result.text).then(()=>{if(valid())status.textContent=['已复制',...result.omissions].join('；');},()=>{
    if(!valid())return;status.textContent=['复制受阻，请选择下方文本手工复制',...result.omissions].join('；');
    group.querySelector('textarea')?.remove();const area=document.createElement('textarea');area.readOnly=true;area.value=result.text;area.setAttribute('aria-label','手工复制文本');group.append(area);area.focus({preventScroll:true});area.select();area.scrollIntoView({block:'center'});
   });
  };group.append(button);
 }
 group.append(warning,status);container.append(group);return group;
}
