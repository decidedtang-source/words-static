export const sectionLabels = {term:'词汇与音标',meaning:'中文词义',foundation:'基础词义',context:'语境解释',examples:'例句',dictionary:'词典依据',analysis:'分析方法'};
export const defaultModuleOrder=['term','meaning','foundation','context','examples'];
export const maskLabels={meaning:'中文词义',foundation:'基础词义',context:'语境解释',example:'英文例句',translation:'例句中文翻译',dictionary:'词典中文释义'};
export const flipMaskKeys=['meaning','foundation','context','example','translation'];
export const normalizeModuleOrder=value=>[...new Set([...(Array.isArray(value)?value:[]),...defaultModuleOrder].filter(key=>defaultModuleOrder.includes(key)))];
export function normalizePreferences(value, legacyExpanded=true) {
  const result={expanded:{term:true,meaning:true,foundation:true,context:legacyExpanded,examples:legacyExpanded,dictionary:legacyExpanded,analysis:legacyExpanded},maskChinese:false,maskEnglish:false,underline:false,order:normalizeModuleOrder(value?.order)};
  result.frontModule=defaultModuleOrder.includes(value?.frontModule)?value.frontModule:'term';
  result.keepFace=value?.keepFace===true;
  result.scrollMode=['position','top'].includes(value?.scrollMode)?value.scrollMode:'module';
  result.flipSections=Object.fromEntries(defaultModuleOrder.map(key=>[key,['open','closed'].includes(value?.flipSections?.[key])?value.flipSections[key]:'keep']));
  result.flipMasks=Object.fromEntries(flipMaskKeys.map(key=>[key,value?.flipMasks?.[key]===true]));
  result.masks=Object.fromEntries(Object.keys(maskLabels).map(key=>[key,typeof value?.masks?.[key]==='boolean'?value.masks[key]:value?.[key==='example'?'maskEnglish':'maskChinese']===true]));
  if(!value||typeof value!=='object')return result;
  for(const key of Object.keys(result.expanded))if(typeof value.expanded?.[key]==='boolean')result.expanded[key]=value.expanded[key];
  for(const key of ['maskChinese','maskEnglish','underline'])if(typeof value[key]==='boolean')result[key]=value[key];
  return result;
}
let legacy=true,preferences;
try { legacy=localStorage.getItem('words-static-content-expanded')!=='false'; } catch {}
try { preferences=normalizePreferences(JSON.parse(localStorage.getItem('words-static-reading-v2')),legacy); } catch { preferences=normalizePreferences(null,legacy); }
export const readingPreferences=()=>preferences;
export const contentExpanded=(section='context')=>preferences.expanded[section];
export function saveReadingPreference(key,value) {
  if(key==='order')preferences.order=normalizeModuleOrder(value);
  else if(key==='frontModule'&&defaultModuleOrder.includes(value))preferences.frontModule=value;
  else if(key==='keepFace')preferences.keepFace=value===true;
  else if(key==='scrollMode')preferences.scrollMode=['position','top'].includes(value)?value:'module';
  else if(key.startsWith('flip-section:')&&defaultModuleOrder.includes(key.slice(13)))preferences.flipSections[key.slice(13)]=['open','closed'].includes(value)?value:'keep';
  else if(key.startsWith('flip-mask:')&&flipMaskKeys.includes(key.slice(10)))preferences.flipMasks[key.slice(10)]=value===true;
  else if(key.startsWith('mask:')&&Object.hasOwn(maskLabels,key.slice(5)))preferences.masks[key.slice(5)]=value===true;
  else if(Object.hasOwn(sectionLabels,key))preferences.expanded[key]=value===true;
  else if(['maskChinese','maskEnglish','underline'].includes(key))preferences[key]=value===true;
  else return false;
  try { localStorage.setItem('words-static-reading-v2',JSON.stringify(preferences));return true; } catch { return false; }
}
