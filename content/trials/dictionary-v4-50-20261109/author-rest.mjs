import fs from 'node:fs';import {fingerprint} from '../../../scripts/five-zone-workflow/core.mjs';
const dir=new URL('./',import.meta.url),read=n=>JSON.parse(fs.readFileSync(new URL(n,dir))),cards=read('cards.json'),reviews=read('six-reviews.json');
for(const r of reviews){const c=cards.find(c=>c.cardId===r.cardId);if(r.decision!=='PASS'||r.fingerprint!==fingerprint(c)||Object.values(r.scores).some(n=>n<4))throw Error('Six-example review gate failed');}
if(reviews.length!==6)throw Error('Six reviews required');
// Each pair is separately authored: modern link, then a retrieval-oriented zone 01.
const edits={
scope:['scope 指某种活动所覆盖的范围。项目也有“哪些算在里面、哪些在外面”的边界，所以工作 scope 是范围义在任务上的直接应用；不必从望远镜或其他专业义绕一圈来理解。','成组记 define the scope、within scope、out of scope。读到新增要求时，用“在不在这次范围内”检索这组搭配；例如 training is out of scope，表示培训未包含，不代表培训没有价值。'],
objective:['名词 objective 直接指希望达到的目标；本句把这个目标具体写成减少审批耗时。形容词“客观的”是另一个要单独辨认的用法，不必编造“因为客观所以是目标”的推导。','把 objective 配上 achieve、meet、set，形成 set an objective → achieve it 的记忆链。若看到 an objective assessment，则先看词性：这里 objective 修饰 assessment，不能按名词“目标”读。'],
deliverable:['deliver 不只指把包裹送到，也能指提供约定的服务或结果。项目把“应当交出来的东西”称为 deliverable：活动是做事的过程，成果是可交付的结果；它可以是软件或服务，不必是一件实物。','把 list the deliverables 和 check the deliverables 连起来：先列清交付清单，再检查实际交出的成果。第一阶段可能交报告，第二阶段交软件；用具体名词填清单，比只记“已做很多工作”更容易检索。'],
milestone:['路边的 milestone 标出旅程走到了哪里；项目里的重要事件也能标出进展到了哪一步。两者共享“标记进程中的位置”这一关系，因此完成评审可成为 milestone，但不意味着整个旅程或项目已经结束。','记 reach / pass a milestone，再连到 a major milestone。可用时间轴上几个带日期的点作检索提示：点旁写“评审通过”等事件，不必把每个日常小任务都叫 milestone。'],
priority:['priority 的共同核心是“先得到考虑或处理”。用作可数名词时，是被排在前面的事项；谈优先地位时，是这种先后待遇本身。set priorities 因而是安排哪些事项先处理，而不是宣称其余事项毫无价值。','记 top priority、give priority to、take priority over 三种搭配。前者给事项贴标签，后两者说明优先给谁、优先于谁；用 safety takes priority over speed 练习比较关系。'],
constraint:['constraint 指限制可选择行动的条件。评审人数不足，就是可用资源让某些安排做不到：一般的“受限制”在这里具体落到任务安排上，无需把它想成看得见的绳索。','用时间、预算、人员三类词搭配记忆：time / budget / staffing constraints。看到方案难执行时先找是哪类约束；一项约束可以缩小选择，却不一定使所有办法都不可能。'],
dependency:['dependency 的基础是“离不开某人或某物”。项目活动也可能离不开另一项活动的输入或某个条件，因此用同一个词表示任务间的依赖关系。它不只等于“等上一步结束”：不同工作还可能依赖同一开始条件。','记 identify dependencies 与 dependencies between tasks。画 A→B 时在箭头旁写清“需要什么”，例如 A 需要 B 提供数据；不要让箭头方向或等待方式只靠猜。'],
assumption:['assumption 在本句直接用“未经充分证明、先当作真的前提”这个常见义。计划可以暂借此前提推算，核实后再修正；它既不是已证实的事实，也不因为叫假设就一定是错的。','把 make an assumption、check an assumption、revise an assumption 连起来记。先问“目前把什么当真”，再找证据；另一搭配 assumption of office 是就职，不沿用“假设”义。'],
baseline:['base 可表示依据，line 可作为参照线；baseline 在测量中也起“从这里比较”的作用。改进前记录的状态就是比较后来变化的起点，所以它是参照标准，不等于希望达到的目标，也不要求起点本身表现良好。','记 establish a baseline，再用 compare results against the baseline。把“起始值”和“目标值”写在两栏可帮助检索：前者记录实际起点，后者写希望达到哪里。'],
buffer:['实体 buffer 能承接冲击，让两边不直接碰撞。时间缓冲也借同样的关系：预留一段余量，让小幅变化不立即挤压后续安排。因此 two-day buffer 是可吸收变化的两天，不是已经发生的两天延误。','把 buffer 搭配成 a time buffer、a cash buffer、a buffer zone，分别检索时间、资金与空间。它们保护的对象不同；记“预留什么、保护什么”比把所有 buffer 都译成空闲时间更稳。'],
sequence:['sequence 可指依次排列的一串事物，也可侧重它们的先后顺序。本句已有 remaining activities，所以要商定的是这些活动怎么接续，而不是再增加一份活动名单。','记 in sequence、out of sequence 和 the sequence of events。把几张步骤卡调换位置，就能检查自己说的是“有哪些步骤”还是“步骤顺序”；顺序确定不代表日期也已确定。'],
capacity:['容器的 capacity 是能装多少，团队的 capacity 也是在一定条件下“能承接多少”。装入的由物品换成了工作量，有限容量这个关系仍在。因此说没有足够 capacity，不必是在说成员不会做，而可能是可投入的资源已满。','记 at full capacity、spare capacity、capacity to do something。前两者便于说负荷是否已满，后者说明能做什么；看到 in her capacity as chair 则切换到“以主席身份”的义项。'],
allocate:['allocate 本来就是把有限资源分给某人或某用途。时间虽然不能像物品那样递过去，也能在日程中分配份额；所以 allocate more time 是增加给这项工作的时间份额，不是让一天变长。','记 allocate X to Y / allocate X for Y，X可填 time、funds、space。用资源与用途两栏练习，例如 allocate funds for training；只说 allocate more 还没有说明分配什么。'],
delegate:['名词 delegate 是代表别人办事的人；动词 delegate 则把任务或权限交给他人代为处理。两者共享“由他人代表承担”的关系，因此委派数据收集不是自己做每一步，也不自动意味着把全部最终责任转走。','把 delegate a task to someone 与 a conference delegate 分开读，前者是动作、后者是人。练习时固定 to 后的人名，再替换 data collection / scheduling 等任务，避免只记一个中文标签。'],
accountable:['account 除账户外还能指对事情的说明，account for 可表示解释。accountable 与这一“能被要求交代”的联系能帮助理解：负责人不只参与工作，还须对决定和结果作出说明。这是现代语义联系，不把银行账户义硬接过来。','记 accountable for the result 与 accountable to the board：for 接要交代的事项，to 接接受交代的人或机构。把这两个空格填出来，有助于避免只写“某人负责”却说不清对谁、为何负责。'],
deadline:['deadline 在今天直接表示必须完成某事的最晚时间。本句需要今天先作决定，才能赶上这个时限；today 修饰当前决定，不自动等于最终 deadline。这个用法无需从 dead 的现代意思强行推导。','记 meet / miss / extend a deadline，分别对应赶上、错过与延后截止。把 by Friday 与 on Friday 区分练习：前者强调最迟周五，后者仅指定周五，不能在所有句子中互换。'],
commitment:['commitment 可指持续投入，也可指让自己承担行动义务的承诺。这里的共同点是“把自己放进需要继续履行的事情里”；this commitment 指一项具体答应下来的事，因此才可以追问它以哪些条件为前提。','记 make a commitment 与 honour a commitment：答应和兑现是两步。commitment to quality 则常谈持续投入；用 a / this 与后面的内容一起判断，不能只凭单词决定是哪一种。'],
contingency:['contingency 是将来可能发生、需要预作准备的状况。放到 contingency plan 里，它说明预案“为哪类可能情况而设”：可能缺席的是评审人，备用安排才是 plan。不要把状况本身与应对办法混成同一义。','把 contingency 与 plan / fund 连起来：预案和预留资金分别是应对方式。再练 in case the reviewer is unavailable，检索“如果发生什么”，而不是把任何已发生的问题都叫 contingency。'],
'trade-off':['trade 有交换的意思，trade-off 则强调获得一方面好处时，要接受另一方面的损失。共享的是“有所获，也有所付出”的关系，所以更快交付与更低成本形成取舍时，不是简单从两个同样好的标签中任选一个。','固定记 a trade-off between A and B，再给两端填 speed / cost、privacy / convenience。先说清牺牲的是什么，才是在讲取舍；没有损失的一次改进，不必硬套 trade-off。'],
agenda:['agenda 既能指要推动的目标，也能指会议要讨论的事项；两者都围绕“准备处理哪些事”。before the meeting 把这里限定为会前议程，而不是会后记录，也不必从 hidden agenda 猜测有人暗藏动机。','记 an item on the agenda 与 put something on the agenda。用 item 记住议程是一项项内容，介词用 on；hidden agenda 另作固定搭配记，不给普通会议议程自动加上负面含义。'],
context:['语言里的 context 是某句话前后帮助理解它的内容；事情的 context 是周围帮助理解它的情况。两者共享“不能只孤立看这一点”的关系。因此讨论选项前补充 context，是给判断提供背景，而非另开一个无关话题。','记 in context 与 out of context 成对出现，再搭配 provide context。练习读一个孤立数字时追问“何时、何地、与什么比较”，可提示自己补背景；并非背景越多越好。'],
clarify:['clear 可形容液体清澈，也可说意思清楚。clarify 的两类用法都让妨碍看清的东西减少：液体中是杂质，解释中是歧义或缺失信息。因此 clarify a request 是让请求的含义更明确，不一定要把话说得更长。','记 clarify the scope / meaning / requirements。把“哪一点不清楚”放在 clarify 后面；clarification 是对应名词，可说 ask for clarification。检索的是模糊点，不是更多篇幅。'],
confirm:['confirm 的几个常见用法都涉及让原本未定的判断或安排变得更确定。证据可以确认事实，沟通也可以确认安排。本句核对谁负责下一步，是把责任归属说定或查实；不是凭一句 confirm 就创造出事实。','记 confirm a booking、confirm the details、confirm that…。前两项接名词，后一项接完整内容；请求 Please confirm 是否已经得到回复，要靠后续信息，不能看见这个词就当作确认完成。'],
specify:['specify 是把需要的信息明确指出来。用于接受条件时，就是把“什么情况下可以接受”从笼统期待变成具体条目；它不保证这些条件已经获同意，也不等于解释条件背后的全部原因。','记 specify the date / amount / conditions。练习把 soon 换成一个日期、把 enough 换成可核对的数量，以“信息够不够明确”作为检索提示；具体化不等于擅自制定标准。'],
elaborate:['elaborate 作形容词可指细致复杂，作动词则是在已有内容上补充细节。共享的是“展开得更充分”：elaborate on a concern 要把已提出的顾虑讲得更具体，而不是另提一个完全不同的问题，也不要求故意说复杂。','把动词 elaborate on something 整块记；形容词 an elaborate plan 则直接修饰名词。两种词性末尾读音不同，读词典音标时要看当前词性，不能只背同一个中文“详细”。'],
summarize:['summary 是从较长内容中保留要点的摘要，summarize 是做这件事的动作。因此 summarize decisions and questions 要压缩表达，却仍保留“已决定”和“未解决”的区别；简短不意味着删掉会影响判断的问题。','连着记 summarize the findings 与 a summary of the findings。前者是动作，后者是结果；练习用两三句说完一段材料，再检查是否漏了改变结论的限定条件。'],
recap:['recap 是把已经讲过或发生过的要点再简短过一遍。原句给新成员回顾，是这个常见义的直接使用；“再讲一次”强调已有内容，“要点”又限制它不是逐句重播。','记 recap the main points 与 a quick recap。动词和名词都能接到“回顾要点”，用 quick 提醒简洁；若对方需要第一次完整教学，仅给 recap 可能还不够。'],
consensus:['consensus 本身就指群体形成的大体一致，本句直接用这一义。on the main objective 把一致的对象限定为主要目标；不能由此推出每个人对预算、日期和全部细节也都相同。','记 reach / build a consensus 与 consensus on a topic。把 topic 填成 objective、approach 等具体事项，比只说“已经一致”更容易记住共识的边界。'],
concern:['concern 可表示某事与人有关，也可表示关心或担忧；与自己有关系的事常会引起关注，但并不是所有相关事情都令人害怕。本句 main concern 把重点放在让说话者不放心的事项：可用的评审时间。','把 concern about（对……的担忧）与 concern for（对……的关心）对照记，再联系 a matter of concern。读到 a business concern 要切到企业义，不能把公司名称误读成担忧。'],
objection:['objection 表示反对或反对理由；在讨论中问有没有 objection，就是给不同意者提出异议的机会。这是常见义的直接应用，不必借“物体 object”编造一段词义演变。','把 raise an objection 与 object to something 配对记，分别是名词和动词表达。to 后可接名词或动名词；例如 object to delaying the review，不用 to delay 来套不定式。'],
rationale:['rationale 直接指决定或做法背后的理由与逻辑。本句的 changing the priority 是要解释的对象：学习者应区分“新顺序是什么”与“哪些考虑使人决定更改”，而不需要另编一条从拼写推导的故事。','记 the rationale for a decision 与 explain the rationale。用一个“因为……”链检查理由是否能接到行动；只说谁批准了，回答的是权限来源，未必回答做法为何合理。'],
proposal:['propose 是把想法提出供考虑，proposal 是拿出来供考虑的建议或方案。共享的是“提出而尚待回应”这一步，所以 review a proposal 是审阅一项待考虑的内容，不能从词本身判断已获批准。','连记 submit / review / accept a proposal，按提出、审阅、接受三个动作检索。proposal 也可指求婚，a marriage proposal 明确对象；不要把所有 proposal 都译成商业计划书。'],
alternative:['alternative 的核心是还有一个可以替代当前选择的办法。项目日期过紧时，另一日期或另一做法都可能成为 alternative；可替代只说明它是另一个选项，不代表它必然更好或已经被采用。','记 an alternative to the current plan，to 后是被替代对象；形容词则说 an alternative plan。用 have no alternative but to do something 练习“别无选择”，注意这里的否定。'],
compromise:['达成 compromise 时，各方不把自己的要求全部保留，而各让一部分来取得共同安排。这个“放低部分要求”的联系，也帮助理解 compromise on standards；但 compromise safety 是使安全受损，不能把所有用法都看成良好协商。','记 reach a compromise、compromise on a date，再单独记 compromise safety。前两者谈折中，最后一种谈损害；同一个动词在不同宾语前不能一律套“互相让步”。'],
negotiate:['negotiate 在这里直接指通过讨论争取谈妥条件，deadline 是拿来协商的内容。它不等于一方宣布新日期；“通过难走路段”的另一义可以另学，不必强行声称协商就是从走弯路演变而来。','记 negotiate with someone / negotiate over terms / negotiate an agreement。分别检索和谁谈、谈什么、争取谈成什么；能开始 negotiate，并不保证最后达成协议。'],
conclude:['conclude 可以结束一场活动，也可以在考虑后得出结论；两者可借“到达一个收束点”联系起来。本句的 meeting 是活动，所以是结束会议；若后接 that 引出判断，则常是给推理一个结论，而非让会议散场。','把 conclude the meeting、conclude that…、conclude an agreement 三块分别记。前者结束活动，中者得出判断，后者正式达成协议；宾语是辨义线索，不能只看词形。'],
document:['名词 document 是记录信息的文档，动词 document 是留下记录这个动作。英语把记录载体的名称用于描述记录行为，所以 document a decision 是把决定记下来；记录也能用照片等形式，不限于纸质文件。','记 a document 与 document the evidence 的位置差别：冠词后常是名词，情态动词后可能是动作。把 decision、process、damage 放到动词后练习，检索“要记录什么”。'],
'follow up':['follow 有接着或跟随的意思，follow up 把关注点放在先前行动之后接上的后续处理。这里要继续查尚未完成的事项，是沿着已有事情往下做，而不是空间上“向上跟随”；第一次发起事情与后续跟进要分开。','记 follow up on an issue 与 follow something up with a call。前者跟进什么，后者用什么作为后续行动；名词/修饰语常写 follow-up，动词两词分写。'],
'bring up':['bring 是带来，up 在这里可借“进入眼前注意范围”帮助理解：bring up an issue 是把原来未在谈的话题带入讨论。这是现代教学联系，不是证明短语起源于把实物往上搬；提出问题也不等于已经处理。','记 bring up a question 与 bring it up，代词放在中间。再把 bring up a child（养育）另作整块记；看宾语是话题还是孩子，别一律译成提出。'],
'walk through':['真的走过一条路线时，人会依次经过各个位置。walk someone through a plan 借这个顺序关系，让听者依次了解各个步骤。因此是带着对方逐步理解，不需要真的走动，也不只是快速宣布结果。','固定记 walk someone through something，用 me / us 填人，用 process / plan 填内容。练习时先说出听者是谁，再说要过什么；不要省略对象后误读成单纯穿过某地。'],
'point out':['point 可以把别人的目光引到某处；point out 也能把注意力引到某个信息上。对象由眼前事物换成事实或差别，提醒注意的关系相同，所以本句不用真的指手势，也不天然带批评意味。','记 point out a difference、point it out、point out that…。名词、代词和从句位置不同；用 that 后一整句补充事实，能避免只会背“指出”却接不出内容。'],
'rule out':['out 可借“不留在考虑范围内”理解；rule out 表示排除一种可能或选择，而不是把规则拿出去。本句加 cannot，便是目前没有足够理由把延误排除；保留可能性不等于认定一定延误。','把 rule out 与 cannot rule out 成对练习：看见否定就先确认“还能不能排除”。rule it out 中 it 放在中间；换成 illness 或 an error，可迁移到诊断和日常判断。'],
'hold off':['hold 有使某物保持住、不让它继续推进的意思。hold off 用于行动时，可理解为让行动暂时不要开始，所以 hold off on a decision 是先缓一缓；until the results 指明等到什么条件，而不是取消这项决定。','记 hold off on doing something 与 hold off until…。前者说明暂缓的动作，后者说明等待界点；例如 hold off on booking until Friday，先把动作和时间分别填清。'],
'take on':['take 可以表示接过，take on a task 则把接过的对象换成工作负担。共享的是“接到自己这边来承担”的关系，所以团队说 cannot take on another task，是拒绝新增承担，不表示当前任务已经结束。','把 take on a task、take on staff、take on a new meaning 分块记。任务对应承担，员工对应雇用，meaning 对应呈现；take it on 中代词在中间，不能只靠 on 猜所有意义。'],
'weigh up':['称东西时 weigh 是衡量重量；判断选项时，也要衡量各方面的分量。weigh up 把这一关系用于利弊：不是把价格和风险真的放上秤，而是比较它们对决定有多重要，因此比仅仅浏览选项多了权衡。','记 weigh up the options / pros and cons；代词用 weigh them up。把每项优点和代价放在两栏，是检索辅助，不代表所有决定都能用数字加减得出。'],
'wrap up':['wrap up 可把零散物品包好，抽象用于活动时，也可借“收拢成一个已完成的整体”理解收尾。本句用确认负责人和日期来结束讨论；这是一种收尾办法，不是说每次 wrap up 都必须做同样的总结。','记 wrap up a meeting、wrap it up，以及 wrap up warm。前两者可结束活动，最后一项是穿暖和；用具体宾语和搭配辨义，避免把暖和与会议收尾混到一起。']
};
const transparent=new Set(['scope','objective','constraint','assumption','sequence','deadline','specify','recap','consensus','objection','rationale','alternative','negotiate']);
for(const c of cards){const e=edits[c.term];if(!e)continue;c.bridge={text:e[0],mode:transparent.has(c.term)?'transparent':'semantic',reason:transparent.has(c.term)?'当前义是常见义直接应用，或另一义不可可靠推导；用短说明澄清适用边界，不强造词源。':'用现代可理解的共同关系连接基础义与当前用法；历史事实留在C。'};c.dictionary.bridgeText=c.bridge.text;c.dictionary.writer='v4-author';c.groups=c.groups.map((g,i)=>({id:g.id,title:g.title,text:i===0?e[1]:g.text,sources:g.sources||[]}));c.exploration=c.exploration.slice(0,1);}
// Retain current-context scenarios when they already add a concrete application; replace definition-only B.
const scenes={
objective:'例如一周开了更多次审批会，却没有缩短等待时间。可以把活动数量与期望结果分别记录，核对新增会议是否真的帮助达成目标。目标描述应能指导选择办法，而不是只增加任务清单。',
deliverable:'例如第一阶段只约定提交调查报告，团队不能仅用“已完成访谈”代替报告交付。还要确认报告内容和验收要求；这些要求来自双方约定，并不由 deliverable 一词自动规定。',
milestone:'例如把“完成首轮测试”设为节点后，可以核对是否只是执行结束，还是还需要缺陷处理完毕。先把节点完成条件说清，才能避免两人都说已达成却指不同状态。',
priority:'例如本周测试与采购都要用同一位工程师。可以明确先处理哪项、另一项何时安排；如果两项都标最高优先级，却不解决资源冲突，标签本身帮不上分工。',
constraint:'例如三名评审人中只有一人熟悉安全标准。安排时既要看总人数，也要看任务要求的资格；具体瓶颈需核实，不能仅凭人数就认定任何并行评审都不可行。',
dependency:'例如测试需要样件到货，也需要测试环境可用。即使这两项由不同团队负责，缺任意一项都可能影响开始；可在计划中分别标明输入与条件，避免只画一条顺序链。',
assumption:'例如报价按每周交两批估算，供应商却只确认每月两批。原估算的前提需修正，而不是简单责备计算错误。把未核实前提记出来，能帮助后来定位计划变化的原因。',
buffer:'例如正常评审需三天，另留两天应对补充资料。排期时把正常工时和余量分列，才看得清额外时间是否已用掉；预留缓冲不意味着可以无条件推迟承诺。',
sequence:'例如先检查尺寸再封箱，调换后可能必须拆箱重检。讨论顺序时可以逐步问“下一步需要上一步留下什么”；顺序商定后，仍需核实耗时和具体日期。',
capacity:'例如团队会做两类项目，但本周人员已被另一项工作占满。可分别问技能是否具备、工时是否可用；前者充足仍可能承接不了两个项目，后者也可能通过排期调整改善。',
allocate:'例如原本给初审半天，资料量增加后建议改成一天。说出增加到多少、从哪项安排腾出时间，比只说“多留一点”更便于讨论；是否调整还需考虑其他工作的影响。',
delegate:'例如把数据收集交给同事，同时约定字段、来源范围与提交时间。若对方发现缺项，应知道找谁确认；这是让委派可执行的场景建议，不是 delegate 自动保证完成质量。',
accountable:'例如三人都参与决定，但外部审查需要一个清楚的答复窗口。可以明确谁说明最终选择及理由、其他人提供哪些依据；指定交代责任不等于让此人单独做全部工作。',
deadline:'例如周五要提交报告，但必须今天先确定测试方案，才能留下执行和整理时间。当天的决定时点与最终提交时点不同；倒推过程应基于实际工作量，不能只凭一句催促判断。',
agenda:'例如会前把“比较两种交期方案”列入议程，让参与者提前准备报价与时间表。会议若改为确认预算，议程也应相应更新；这些准备动作不是会后纪要可以补替的。',
consensus:'例如团队同意先减少审批等待，但对是否增派人员仍未决定。可以分别记录已达成的目标共识和待讨论的办法，避免后续把未议定细节也当成所有人认可。',
objection:'例如新版顺序把验收提前到包装前，有人担心最终包装会影响结果。应让其说清反对哪一步、依据是什么，再判断是否调整；提出异议并不自动推翻安排。',
rationale:'例如优先级从外观改成密封性，可以解释新的客户反馈怎样改变风险判断。只把最新排序再念一次并没有回答原因；说明理由也不意味着理由一定经得起检验。',
proposal:'例如提案写了缩短评审的办法，却没写需要多少人。审阅时可列出缺失假设并要求补充，再进入讨论；能够被称为 proposal 并不保证已是完备或可执行的计划。',
'follow up':'例如昨天发出一个待办，明天先核对对方是否收到、是否有阻碍，再更新约定时间。后续处理不一定是催得更急，也可能是提供对方缺少的信息。',
'bring up':'例如讨论即将结束时发现一个尚未提及的交期风险。可先简短提出并询问是否现在讨论或另约时间；让议题进入对话，不等于必须立刻占用所有人的时间。',
'walk through':'例如计划修订了两处步骤，讲解时先说明入口条件，再按执行顺序走一遍，并邀请听者指出不清楚的位置。逐步讲解可以关注改动处，不必逐字读完整份文件。',
'point out':'例如两个报价总额相同，但一个包含运输、另一个没有。指出这一差异能帮助比较；是否足以改变选择，还要看其他条件，而不是说出 point out 就完成论证。',
'take on':'例如本周已有两个交付节点，新任务又需要同一位检验员。团队可说明当前负荷并讨论改期或转交；拒绝本周新增任务不代表永久拒绝合作。',
'wrap up':'例如讨论已经形成方案，最后把负责人和日期复述给双方确认。有未解决事项时可以明确记录并另约处理，而不是为了宣告结束就假装所有问题都已解决。'
};for(const c of cards)if(scenes[c.term])c.scenario=scenes[c.term];
// Keep lower-frequency / technical senses available, separate from the core reading area.
for(const c of cards.filter(c=>edits[c.term]))for(const s of c.dictionary.senses)if(/属地|坚振礼|商业公司|企业。|连续镜头|科学中|缓冲区|暂存数据|网球|棒球|雇用员工|燃料|呕出|液体/.test(s.meaning)&&s.id!==c.dictionary.contextSenseId)s.extended=true;
fs.writeFileSync(new URL('cards.json',dir),JSON.stringify(cards,null,2)+'\n');
fs.writeFileSync(new URL('expansion-gate.json',dir),JSON.stringify({sixReviewedBeforeExpansion:true,reviewHash:fingerprint(reviews),expandedTerms:Object.keys(edits),count:Object.keys(edits).length},null,2));
