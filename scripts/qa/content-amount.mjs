import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),current=JSON.parse(fs.readFileSync(root+'/config/qa/current.json','utf8')),policy=JSON.parse(fs.readFileSync(path.join(root,current.policy),'utf8'));
export function countUnits(value){const s=String(value||'');return (s.match(/\p{Script=Han}/gu)||[]).length+(s.match(/[A-Za-z0-9]+(?:['’\-][A-Za-z0-9]+)*/g)||[]).length;}
const unique=values=>[...new Set(values.filter(v=>typeof v==='string'&&v.trim()).map(v=>v.replace(/\s+/g,' ').trim()))];
export function checkContentAmount(bundle,budget={}){
 const profile=budget.profile||bundle.analysis?.depth,rules=policy.contentAmount.profiles[profile];
 const paragraphs=unique((bundle.analysis?.blocks||[]).filter(b=>!b.dimensions?.length||!b.dimensions.every(d=>d==='workplaceUse')).map(b=>b.text));
 const analysisUnits=paragraphs.reduce((n,s)=>n+countUnits(s),0),explanationUnits=unique([bundle.context?.meaning,bundle.bridge?.semanticText,...paragraphs]).reduce((n,s)=>n+countUnits(s),0);
 const examples=unique((bundle.analysis?.workplaceUse||[]).filter(e=>e.en?.trim()&&e.zh?.trim()).map(e=>e.en.trim()+'\n'+e.zh.trim())).length;
 const base={entryId:bundle.snapshot?.entryId,profile:profile||null,analysisUnits,explanationUnits,bilingualExamples:examples,unit:'Chinese characters + English/numeric words',semanticScore:null};
 if(!rules)return {...base,pass:false,status:'unconfigured',detail:'生产前指定concise/standard/deep，不按成稿长度自动降档。'};
 const minimum=budget.minimum??rules.minimum,target=budget.target||rules.target;
 if(!Number.isInteger(minimum)||minimum<1||!Array.isArray(target)||target.length!==2||!target.every(Number.isInteger)||target[0]<minimum||target[1]<target[0]||((budget.minimum!==undefined||budget.target)&&!budget.reason?.trim()))return {...base,pass:false,status:'invalid_budget',detail:'个别词调整须给出有效下限/预计区间及原因。'};
 const pass=analysisUnits>=minimum&&examples>=policy.contentAmount.minimumBilingualExamples;
 return {...base,minimum,target,minimumBilingualExamples:policy.contentAmount.minimumBilingualExamples,pass,status:pass?'pass':'needs_expansion',shortfall:Math.max(0,minimum-analysisUnits),detail:pass?'达到基础内容量要求；不代表语义质量评分。':'正文或双语表达数量不足，保留原稿并列入待补；不自动补写或截断。'};
}
