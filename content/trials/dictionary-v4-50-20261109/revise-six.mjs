import fs from 'node:fs';const dir=new URL('./',import.meta.url),cards=JSON.parse(fs.readFileSync(new URL('cards.json',dir))),before=JSON.parse(fs.readFileSync(new URL('before.json',dir)));
cards.find(c=>c.term==='shift').exploration=before.find(c=>c.w.term==='shift').x.c.slice(0,2);
const scenarios={
'working definition':'例如讨论“严重缺陷”时，一人按停线判断，另一人按返工成本判断。先拿两个边界案例试用同一定义，再记录争议案例，试用结束后决定是否修订。这里的案例是教学假设，定义仍需团队明确同意。',
'shift':'例如夜班22:00开始，供应商还需要提前培训操作员。仅在21:59发出文件未必来得及使用；可以进一步确认最晚接收时间。before the next shift 给出了班次界点，但没有自动涵盖接收、培训和确认所需的时间。',
'ownership':'例如质量与物流都参与处理一次退货：可以由一人负责汇总进度，检验与运输仍交给相应同事。接手后应问清自己能决定什么、何时需升级处理；主动负责并不自动获得全部审批权限。',
'align':'例如两人都说“质量优先”，一人准备补测试，另一人准备改设计。会议可以把优先顺序写成明确行动，再核对所需资源。共同口号未必足以指导分工；场景中的办法是教学建议，不是 align 一词自带的管理规则。',
'reservation':'例如同事支持采购方向，却担心交期承诺没有依据。可以先确认担心的是哪项证据，并约定拿到交期确认后再讨论承诺。保留意见并不说明顾虑一定合理，也不能代替补充事实。',
'work around':'例如报表接口暂时故障，团队改用获准的手工导出流程。继续工作前仍需核对权限、字段是否完整以及何时恢复接口；替代流程不能自动被当作最终修复，也不是可以绕过必要控制的许可。'};
for(const c of cards)if(scenarios[c.term])c.scenario=scenarios[c.term];
const c=cards.find(c=>c.term==='working definition'),base=c.dictionary.senses[0];
const rows=[
['working：形容词','与工作有关的。','working hours / conditions','The team discussed working hours.','团队讨论了工作时间。','working'],
['working：形容词','正常运作的。','in working order; a working model','The old radio is still in working order.','那台旧收音机仍能正常使用。','working'],
['working：形容词','足够实际使用的。','a working knowledge of','She has a working knowledge of Spanish.','她的西班牙语知识足以应付实际需要。','working'],
['working：形容词','暂供当前工作采用、可继续修改的。','a working hypothesis / title','The article still has a working title.','这篇文章仍用着暂定标题。','working'],
['definition：名词〔可数〕','词语或概念含义的说明。','a definition of','The book gives a clear definition of energy.','书中给出了能量的清晰定义。','definition'],
['definition：名词〔不可数〕','影像、声音等的清晰程度。','high definition; lack definition','The image lacks definition.','这幅图像不够清晰。','definition']];
c.dictionary.senses=[base,...rows.map((r,i)=>({id:'working-definition-component-'+i,pos:r[0],meaning:r[1],usage:r[2],extended:true,example:{en:r[3],zh:r[4],kind:'authored_example'},sourceUrls:['https://dictionary.cambridge.org/dictionary/english/'+r[5]]}))];
c.dictionary.sources.push('https://www.collinsdictionary.com/dictionary/english/working');
c.dictionary.senses[0].sourceUrls=['https://www.collinsdictionary.com/dictionary/english/working'];
c.dictionary.senses.find(s=>s.id==='working-definition-component-3').sourceUrls=['https://www.collinsdictionary.com/dictionary/english/working'];
c.groups[2].sources=[['Operational definition · APA Dictionary','https://dictionary.apa.org/operational-definition']];
cards.find(c=>c.term==='reservation').groups[3].text='这句表达了对承诺时点的顾虑，可能希望先讨论问题，但不证明说话者已停止承诺。可问：What would you need to see before committing?（承诺前你需要看到什么？）这样把保留意见转成可澄清的条件，而不是直接把人归为反对方。';
cards.find(c=>c.term==='work around').groups[3].text='Can we 邀请提出办法，并把范围不变作为约束。可先问：Which part of the process is blocked?（流程的哪一部分受阻？）再核对替代做法是否仍交付约定成果。这是在共同检查可行性，不是原句已批准某个办法。';
for(const term of ['reservation','shift']){const c=cards.find(c=>c.term===term);for(const s of c.dictionary.senses)if(/原住民|连衣裙|卖掉|换挡/.test(s.meaning))s.extended=true;}
fs.writeFileSync(new URL('cards.json',dir),JSON.stringify(cards,null,2)+'\n');
