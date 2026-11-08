import fs from 'node:fs';const dir=new URL('./',import.meta.url),cards=JSON.parse(fs.readFileSync(new URL('cards.json',dir)));
const changes={
baseline:'例如改进前只记录平均审批时间，改进后却改看最长等待时间，两个数字不能直接相比。可以先固定统计口径、时间段和样本范围，再比较变化；baseline提供起点，比较是否公平还要看测量方法。',
commitment:'例如供应商答应周三交样，但条件是周一前收到确认图纸。跟进时可以把交付动作和前提分别写清；前提变化后，应重新核对承诺是否仍有效，不能只重复最初日期。',
contingency:'例如主评审人可能临时无法参加，备用人员需提前拿到资料并确认资格。只写“找人代替”未必能执行；预案可以补清触发条件与联系人，而不必宣称缺席一定发生。',
clarify:'例如请求只写“安排测试”，双方对是否包含老化测试理解不同。可以直接问是否包含该项目，再更新范围说明；补清遗漏与改变原要求是两回事，必要时仍要确认变更。',
confirm:'例如会议里提过由采购跟进，但记录中仍留空。发出确认请求后，需要等待明确回复或有效记录；提过一个名字与对方已接受责任，不能自动视为同一状态。',
specify:'例如验收条件只写“包装完好”，检验人员可能各有判断。可以请提议者列明要检查的部位和可接受状况；具体标准须由适当人员确定，不能凭这句请求自行捏造。',
elaborate:'例如同事只说交期有风险，可以请他说明哪一步可能延误、依据和影响是什么。补充细节有助于判断顾虑，但不等于要求他给出与问题无关的整段项目历史。',
summarize:'例如会后用两栏记录“已同意试做”和“费用待确认”，可以避免把试做决定误读成预算已经批准。摘要保留关键区分，比单纯缩短字数更重要。',
recap:'例如新同事加入时先用三句话回顾目标、已作决定与未决问题，再让他问缺失背景。若他需要执行细节，可另看完整说明；简短回顾并不替代首次培训。',
concern:'例如评审只剩半天，说话者担心没有时间检查关键接口。可先问需要检查哪些项目、通常需要多久，再判断是否调整日程；提出担忧不是已经证明计划不可行。',
alternative:'例如原定周三的会场不可用，可以提出周四同场地或周三改线上两种替代。比较时还需核对参与者和资料条件；新选项可考虑，并不因此自动比原安排优越。',
negotiate:'例如现交期需加班才能满足，可以带着实际工作量、可调整范围和最早可行日期去谈。讨论可能达成新安排，也可能维持原条件；开始协商不等于获得延期。',
conclude:'例如会议接近结束，主持人复述下一步后询问是否还有遗漏。若出现关键分歧，可以决定继续或另约；“让我们结束”是提议收尾，不是宣布所有问题都解决了。',
document:'例如只记录“更换方案”会让后来的人难以判断原因。可以写下当时的信息、选择和依据，并区分确认事实与待核实假设；记录存在也不自动证明决定正确。',
'rule out':'例如物流尚未确认发运，团队不能排除延误。可以继续查承运安排并准备应对，而不必把“可能延误”写成“一定延误”；目前无法排除不等于风险概率已被测算。',
'hold off':'例如测试结果周五才能到，团队暂缓确认供应商。可说明等哪项结果、谁负责查看以及何时重新讨论；暂缓需要后续触发点，不能被当成永久搁置。'
};for(const c of cards)if(changes[c.term])c.scenario=changes[c.term];
cards.find(c=>c.term==='milestone').bridge.text='路边的 milestone 标出旅程走到了哪里；项目里的重要事件也能标出进展到了哪一步。两者共享“标记进程中的位置”这一关系。团队可以把评审完成设为节点，但原句仅说评审之后达到节点，并未说明节点就是评审本身。';
cards.find(c=>c.term==='milestone').dictionary.bridgeText=cards.find(c=>c.term==='milestone').bridge.text;
cards.find(c=>c.term==='scope').groups[4].text='需要明确排除时可说：Installation is included, but training is outside the agreed scope.（安装包含在内，但培训不在约定范围内。）将 training 换成 maintenance；若要扩大范围，可接 We can discuss adding it as a separate task. 这样把现有约定与新增讨论分开。';
for(const s of cards.find(c=>c.term==='take on').dictionary.senses)if(/雇用员工/.test(s.meaning))delete s.extended;
fs.writeFileSync(new URL('cards.json',dir),JSON.stringify(cards,null,2)+'\n');
