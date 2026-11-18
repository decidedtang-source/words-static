export const sectionLabels = {term:'词汇与音标',meaning:'中文词义',foundation:'基础词义',context:'语境解释',examples:'例句',dictionary:'词典依据',analysis:'分析方法'};
export function normalizePreferences(value, legacyExpanded=true) {
  const result={expanded:{term:true,meaning:true,foundation:true,context:legacyExpanded,examples:legacyExpanded,dictionary:legacyExpanded,analysis:legacyExpanded},maskChinese:false,maskEnglish:false,underline:false};
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
  if(Object.hasOwn(sectionLabels,key))preferences.expanded[key]=value===true;
  else if(['maskChinese','maskEnglish','underline'].includes(key))preferences[key]=value===true;
  else return false;
  try { localStorage.setItem('words-static-reading-v2',JSON.stringify(preferences));return true; } catch { return false; }
}
