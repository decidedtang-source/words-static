// Original learner summaries/examples; source dictionary text remains separately preserved.
import {readFileSync,writeFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';import {fileURLToPath} from 'node:url';
const dir=dirname(fileURLToPath(import.meta.url)),base=JSON.parse(readFileSync(resolve(dir,'../whole-card-50-20261103/entries.json'),'utf8'));
// POS / standalone meaning / grammar or collocation / original example / translation
const rows={
scope:[
['名词〔通常不可数〕','某项工作、讨论或权力涉及的范围。','the scope of; within / beyond the scope','The course covers topics beyond the scope of this book.','这门课涉及的主题超出了这本书的范围。'],
['名词〔不可数〕','做某事或发挥能力的机会、空间。','scope for something; scope to do something','The role offers scope for creativity.','这个职位有发挥创造力的空间。'],
['动词〔及物，非正式〕','仔细查看或全面观察。','scope something','She scoped the room before choosing a seat.','她先仔细看了看房间，然后选了一个座位。'],
['动词〔及物〕','开始工作前调查任务的规模、范围和需求。','scope a project; scope something out','We need to scope the repair work before requesting quotes.','询价前，我们需要摸清维修工作的范围。']],
objective:[
['名词〔可数〕','希望达到的目标。','an objective; achieve / meet an objective','Her main objective is to become financially independent.','她的主要目标是实现经济独立。'],
['形容词','根据事实判断，不让个人感情或偏见左右结论的；客观的。','an objective assessment; remain objective','We asked an independent expert for an objective assessment.','我们请一位独立专家作客观评估。']],
deliverable:[
['名词〔可数，常用复数〕','项目或约定中需要完成并提供的成果，如报告、软件或产品。','project deliverables; agree on the deliverables','The final deliverables are a report and a working prototype.','最终交付成果是一份报告和一个可运行的原型。'],
['形容词','能够运送或交付的。','deliverable goods; in a deliverable state','The package is deliverable to this address.','这个包裹可以投递到这个地址。'],
['形容词','计划、成果等能够实现或完成的。','a deliverable plan / result','The team must decide whether the proposed improvements are deliverable.','团队必须判断提议的改进能否实现。']],
milestone:[
['名词〔可数〕','人生、事业或项目发展中的重要事件或阶段。','reach / mark a milestone; a milestone in','Opening her first shop was a milestone in her career.','开第一家店是她职业生涯中的一个里程碑。'],
['名词〔可数〕','路旁标明到某地距离的石碑或标志。','a roadside milestone','An old milestone stood beside the road.','路旁立着一块旧里程碑。']],
priority:[
['名词〔可数〕','因为更重要或紧急而应先处理的事情。','a top priority; set priorities','Finding somewhere safe to stay is our first priority.','找到安全的住处是我们的首要任务。'],
['名词〔不可数〕','比其他事项优先获得处理或考虑的地位。','give priority to; take priority over','Emergency vehicles have priority over other traffic.','紧急车辆比其他车辆享有优先通行权。']],
constraint:[
['名词〔可数〕','限制行动或选择的条件、规则或因素。','a constraint on; budget / time constraints','The small room puts a constraint on the number of guests.','房间小，限制了可邀请的客人数。'],
['名词〔不可数，较正式〕','受到拘束、无法自然行动或表达的状态。','without constraint','She spoke freely and without constraint.','她毫无拘束地畅所欲言。']],
dependency:[
['名词〔不可数〕','依赖他人或某物才能生活或运作的状态。','dependency on; reduce dependency','The policy aims to reduce dependency on imported fuel.','这项政策旨在减少对进口燃料的依赖。'],
['名词〔可数或不可数〕','对酒精、药物等形成的依赖。','alcohol / drug dependency','The clinic treats people with alcohol dependency.','这家诊所治疗酒精依赖患者。'],
['名词〔可数〕','由另一个国家统治的属地。','an overseas dependency','The island was once a dependency of another country.','这座岛曾是另一个国家的属地。'],
['名词〔可数，项目用语〕','项目中一项活动与其他活动、所需输入或条件之间的依赖关系。','identify dependencies; a dependency between activities','We listed the dependencies between the installation tasks.','我们列出了各项安装任务之间的依赖关系。']],
assumption:[
['名词〔可数〕','尚未得到充分证实却被认为是真的看法或前提。','make an assumption; the assumption that','We booked two rooms on the assumption that everyone would come.','我们假定大家都会来，因此订了两个房间。'],
['名词〔可数或不可数，正式〕','开始取得或承担权力、责任、控制等。','the assumption of power / responsibility','The agreement marked her assumption of full responsibility.','这项协议标志着她开始承担全部责任。']],
baseline:[
['名词〔可数，通常单数〕','用来衡量后来变化的起点、数据或比较标准。','establish a baseline; a baseline for comparison','We recorded the initial temperature as a baseline.','我们记录初始温度，作为后续比较的基准。'],
['名词〔可数，体育〕','网球等场地的底线，或棒球跑垒的垒线。','behind the baseline','The tennis player waited just behind the baseline.','那名网球选手在底线后方等候。']],
buffer:[
['名词〔可数〕','减轻冲击、风险或困难的保护因素，也可指预留的钱或时间。','a buffer against; a buffer between','We keep some savings as a buffer against unexpected expenses.','我们留些积蓄，以应付意外开支。'],
['名词〔可数〕','隔开事物并减少碰撞的空间或缓冲装置。','a buffer zone; a buffer between','A strip of trees forms a buffer between the houses and the road.','一排树在房屋和道路之间形成缓冲带。'],
['名词〔可数，计算机〕','数据继续传送前暂时存放的缓冲区。','a memory buffer','The data stays in a buffer before it is printed.','数据打印前会暂存在缓冲区中。'],
['动词〔及物〕','保护某人或某物，使其少受不利影响。','buffer someone/something against / from','The thick walls buffer the rooms against traffic noise.','厚墙减弱了房间受到的交通噪声干扰。'],
['动词〔及物，计算机〕','先暂存数据，再进行播放、处理或传输。','buffer data / video','The player buffers the video before playback starts.','播放器在开始播放前先缓冲视频数据。']],
sequence:[
['名词〔可数〕','按某种顺序发生或排列的一连串事物。','a sequence of events','A sequence of small mistakes caused the failure.','一连串小错误导致了这次失败。'],
['名词〔可数或不可数〕','事物先后排列的顺序。','in sequence; in the correct sequence','Put the photographs in chronological sequence.','把这些照片按时间顺序排列。'],
['名词〔可数，影视〕','围绕同一事件或主题的一段连续镜头。','an opening / action sequence','The film opens with a short dream sequence.','电影以一小段梦境镜头开场。'],
['动词〔及物〕','给事物排序；在科学中也指测定成分的先后次序。','sequence activities; sequence DNA','The researchers sequenced the DNA sample.','研究人员对这份DNA样本进行了测序。']],
capacity:[
['名词〔可数或不可数〕','容器或场所能容纳的数量。','a capacity of; at full capacity','The hall has a capacity of three hundred people.','大厅可容纳三百人。'],
['名词〔通常不可数〕','在一定条件下能生产或承接的最大工作量。','production capacity; capacity to do','The factory lacks the capacity to meet the new demand.','工厂的产能不足以满足新增需求。'],
['名词〔可数或不可数〕','做某事、理解某事或感受某事的能力。','a capacity for; the capacity to learn','Children have a remarkable capacity to learn languages.','儿童学习语言的能力很强。'],
['名词〔可数，正式〕','某人所具有的身份或承担的职能。',"in a personal / official capacity; in one's capacity as",'She attended in her capacity as chair of the committee.','她以委员会主席的身份出席。']],
allocate:[['动词〔及物〕','把资金、时间、空间等分给特定的人或用途。','allocate something to someone; allocate someone something; allocate something for something','The school allocated extra funds to the library.','学校给图书馆增拨了经费。']],
delegate:[
['动词〔及物或不及物〕','把职责、任务或权力交给他人代为承担。','delegate something to someone; learn to delegate','She delegated the booking arrangements to her assistant.','她把预订安排交给了助理。'],
['动词〔及物，通常被动〕','委派某人代表他人执行一项工作。','be delegated to do something','Two members were delegated to inspect the site.','两名成员被委派去检查现场。'],
['名词〔可数〕','被选出或派出代表他人参加会议等的代表。','a conference delegate; 名词末尾读/ɡət/，动词读/ɡeɪt/','Each school sent two delegates to the conference.','每所学校派了两名代表参会。']],
ownership:[
['名词〔不可数〕','拥有某项财产或事物的状态或权利。','ownership of; transfer ownership','Ownership of the building changed last year.','这栋楼的所有权去年发生了变更。'],
['名词〔不可数，工作用语〕','对某项工作或问题承担责任并主动推动处理。','take ownership of','The new manager took ownership of the unresolved complaints.','新经理接手负责处理尚未解决的投诉。']],
accountable:[['形容词〔通常不直接放在名词前〕','必须对自己的决定或行为作出说明并承担责任的。','accountable to someone for something; hold someone accountable','The director is accountable to the board for the budget.','主任须就预算向董事会负责。']],
deadline:[['名词〔可数〕','某事必须完成或提交的最晚时间。','meet / miss / extend a deadline; a deadline for','The deadline for applications is next Friday.','申请截止时间是下周五。']],
commitment:[
['名词〔可数或不可数〕','答应做某事的承诺。','make a commitment to do; a commitment to something','They made a commitment to keep the service open.','他们承诺保持这项服务开放。'],
['名词〔不可数〕','愿意持续投入时间和努力的热忱、忠诚或专注。','commitment to; show commitment','Learning an instrument takes practice and commitment.','学习乐器需要练习和持续投入。'],
['名词〔可数，常用复数〕','已经承担、需要投入时间或金钱的义务。','family / work / financial commitments','I cannot travel this week because of family commitments.','由于家庭事务，我这周无法出行。']],
contingency:[['名词〔可数〕','未来可能发生、需要预作准备的情况，尤其是问题。','plan for contingencies; a contingency plan / fund','We set aside money for unexpected contingencies.','我们留了一笔钱，以应付可能出现的意外情况。'],['名词〔可数或不可数〕','为可能增加的支出预留的款项。','a contingency for additional costs','The budget includes a contingency for repairs.','预算中包含一笔维修预留款。']],
'trade-off':[['名词〔可数〕','为了得到一种好处而接受另一种损失或不足的取舍。','a trade-off between A and B; 名词常带连字符','There is a trade-off between a lighter device and a larger battery.','更轻的设备和更大的电池之间需要取舍。']],
agenda:[
['名词〔可数〕','会议准备讨论的事项清单。','on the agenda; set the agenda','The first item on the agenda is the new timetable.','议程的第一项是新的时间表。'],
['名词〔可数〕','个人或组织想推动的目标和计划。','a political agenda; a hidden agenda','The group has a clear environmental agenda.','这个团体有明确的环保目标。']],
context:[
['名词〔可数或不可数〕','帮助理解某件事的背景或周围情况。','in the context of; put something in context','The figures make sense in the context of rising prices.','考虑到物价上涨的背景，这些数字就容易理解了。'],
['名词〔可数或不可数〕','词语或句子前后的语言内容；上下文。','in context; out of context','The quotation is misleading when taken out of context.','这段引文脱离上下文后会产生误导。']],
clarify:[
['动词〔及物〕','把不清楚的事情解释得更明确、更容易理解。','clarify something; clarify what / whether','Could you clarify whether visitors need tickets?','你能说明访客是否需要门票吗？'],
['动词〔及物，烹饪等〕','去除液体中的杂质，使其澄清。','clarify butter / stock','The cook clarified the butter before using it.','厨师使用黄油前先将其澄清处理。']],
confirm:[
['动词〔及物〕','用证据证明某事属实，或使原有判断更确定。','confirm a suspicion; confirm that','The test confirmed that the water was safe.','检测证实水是安全的。'],
['动词〔及物〕','确认安排、预订或信息，使其明确或确定下来。','confirm a booking; confirm the details','Please confirm the number of guests by Thursday.','请在周四前确认来宾人数。'],
['动词〔及物〕','正式批准任命或认可某人的职位。','confirm an appointment; confirm someone in a post','The committee confirmed her appointment as director.','委员会正式批准了她的主任任命。'],
['动词〔及物，通常被动，宗教〕','为某人施行坚振礼。','be confirmed','He was confirmed at the local church.','他在当地教堂接受了坚振礼。']],
specify:[['动词〔及物〕','明确、具体地说明或规定内容。','specify something; specify that / how / whether','The form asks you to specify which days you are available.','表格要求你具体说明哪些天有空。']],
elaborate:[
['动词〔及物或不及物〕','进一步详细说明，使已有信息更充分。','elaborate on / upon something; 动词末尾读/reɪt/','Could you elaborate on your reasons for leaving?','你能详细说明离开的原因吗？'],
['形容词〔通常用于名词前〕','细节丰富、结构复杂或精心制作的。','an elaborate design / plan; 形容词末尾读/rət/','The ceiling has an elaborate floral design.','天花板上有精细复杂的花卉图案。']],
summarize:[['动词〔及物或不及物〕','用较少的话概括最重要的内容。','summarize the findings; 英式也写summarise','Could you summarize the story in three sentences?','你能用三句话概括这个故事吗？']],
recap:[
['动词〔及物或不及物〕','简要重述刚讲过或发生过的主要内容。','recap the main points; to recap','Before we continue, let me recap what happened yesterday.','继续之前，我先简要回顾一下昨天发生的事。'],
['名词〔可数或不可数〕','对已有内容所作的简短回顾或总结。','a recap of','The episode starts with a recap of last week’s events.','这集以对上周剧情的简短回顾开场。']],
align:[
['动词〔及物或不及物〕','排成直线，或调整到正确的相对位置。','align A with B; align the wheels','Align the edge of the paper with the guide.','把纸的边缘与导向标记对齐。'],
['动词〔及物〕','使目标、做法等相互一致或协调。','align something with; be aligned with','The course content is aligned with the exam requirements.','课程内容与考试要求相一致。'],
['动词','公开支持某一群体或立场，与其站在一起。','align oneself with','He refused to align himself with either faction.','他拒绝加入任何一派。']],
consensus:[['名词〔通常单数或不可数〕','一群人在意见或判断上形成的大体一致。','reach a consensus; consensus on / about','There is a broad consensus on the need for change.','大家普遍同意有必要改变。']],
concern:[
['名词〔不可数〕','担心、忧虑。','concern about / over; express concern','There is growing concern about water quality.','人们对水质越来越担忧。'],
['名词〔可数〕','使人担忧的问题或关注的重要事项。',"a major concern; one's main concern",'The cost of repairs is my main concern.','维修费用是我最担心的问题。'],
['名词〔不可数〕','对他人的关心。','concern for someone','She showed real concern for her neighbours.','她真心关心邻居。'],
['名词〔可数〕','与某人有关或由某人负责的事情。',"none of someone's concern; someone's concern",'The arrangements are my concern, so I will handle them.','这些安排由我负责，我来处理。'],
['名词〔可数〕','商业公司或企业。','a business concern; a going concern','The company is a small family concern.','这是一家小型家族企业。'],
['动词〔及物〕','与某人或某事有关、涉及；也可指内容主要谈论什么。','concern someone/something; be concerned with; concern itself with','The announcement concerns all passengers.','这则通知涉及所有乘客。'],
['动词〔及物〕','使人担忧。','something concerns someone; it concerns me that','The sudden change in his behaviour concerns me.','他行为的突然变化让我担心。'],
['动词〔反身结构〕','关注某件事，或把精力用于考虑、处理它。','concern yourself with / about something','She concerns herself with the practical details of the project.','她关注并处理项目的实际细节。']],
objection:[['名词〔可数或不可数〕','对某事表示反对，或反对的理由；法庭上也可指正式异议。','an objection to something / doing; raise an objection','Do you have any objection to us opening the window?','你介意我们打开窗户吗？']],
reservation:[
['名词〔可数〕','为住宿、座位等提前作出的预订。','make / cancel a reservation','I made a reservation for two at seven o’clock.','我预订了七点的两人位。'],
['名词〔可数或不可数；可数时通常用复数〕','使人不能完全接受某事的疑虑或保留意见。','have reservations about; without reservation','She has reservations about moving so far away.','她对搬到那么远的地方有所顾虑。'],
['名词〔可数，美国用法〕','美国为原住民保留的地区。','a reservation; a Native American reservation','The museum explains the history of the reservation.','博物馆介绍了这片原住民保留地的历史。']],
rationale:[['名词〔可数，正式〕','某个决定、方法或信念背后的理由及其逻辑依据。','the rationale for / behind','The teacher explained the rationale for the new marking system.','老师解释了采用新评分制度的理由。']],
proposal:[
['名词〔可数或不可数〕','提交给他人考虑的建议、方案，或提出建议这一行为。','a proposal for; a proposal to do','The council approved a proposal to build a new park.','市政委员会批准了建设新公园的提案。'],
['名词〔可数〕','求婚。','a marriage proposal; accept a proposal','She accepted his marriage proposal.','她答应了他的求婚。']],
alternative:[
['名词〔可数〕','可以取代当前选择的另一种选择。','an alternative to; have no alternative but to','Cycling is a cheap alternative to driving.','骑车是比开车便宜的替代出行方式。'],
['形容词〔此义通常用于名词前〕','可用来替代另一事物的。','an alternative route / method','We found an alternative route through the village.','我们找到了一条穿过村庄的替代路线。'],
['形容词','不同于主流或传统方式的。','alternative medicine / lifestyles','The article discusses alternative forms of education.','这篇文章讨论非传统的教育形式。']],
compromise:[
['名词〔可数或不可数〕','各方作出部分让步后达成的协议或折中办法。','reach a compromise; a compromise between','They reached a compromise over how to share the costs.','他们就如何分摊费用达成了妥协。'],
['动词〔不及物〕','降低部分要求或作出让步，以达成一致。','compromise on; compromise with someone','Neither side was willing to compromise on the price.','双方都不愿在价格上让步。'],
['动词〔及物〕','损害安全、质量、名誉等；使其面临风险。','compromise safety / quality / security','The shortcut could compromise the safety of the building.','这种省事做法可能危及建筑安全。'],
['动词〔及物或不及物〕','违背原先坚持的原则，或降低自己设定的标准。','compromise principles; compromise on standards','She refused to compromise her principles for promotion.','她拒绝为获得晋升而违背自己的原则。']],
negotiate:[
['动词〔及物或不及物〕','通过讨论争取就条件或安排达成协议。','negotiate with someone over something; negotiate a deal','They are negotiating with the landlord over the rent.','他们正在与房东商谈租金。'],
['动词〔及物〕','成功通过或越过难走的路段、障碍等。','negotiate a bend / obstacle','The driver carefully negotiated the narrow bend.','司机小心地驶过狭窄的弯道。']],
conclude:[
['动词〔及物，此义通常不用进行时〕','根据事实或推理得出结论。','conclude that; conclude from','We concluded from the tracks that an animal had entered.','我们根据足迹判断有动物进来过。'],
['动词〔及物或不及物〕','结束或使结束某项活动。','conclude a meeting; conclude with / by','The concert concluded with a short encore.','音乐会以一段简短的返场演出结束。'],
['动词〔及物，正式〕','经过协商正式达成协议或交易。','conclude an agreement / deal','The two firms concluded a licensing agreement.','两家公司达成了一项许可协议。']],
document:[
['名词〔可数〕','记录信息的纸质文件或电子文档。','an official document; save a document','Please bring a document showing your address.','请带一份能证明你住址的文件。'],
['动词〔及物〕','用文字、照片等详细记录，或提供文献证据。','document a process / event; be well documented','The photographs document the changes in the neighbourhood.','这些照片记录了街区的变化。']],
'follow up':[
['短语动词','对先前开始的事继续采取行动、了解进展或深入调查。','follow up on something; follow something up','The reporter followed up on the anonymous tip.','记者继续调查了那条匿名线索。'],
['短语动词','接着做另一件事，以进一步发挥前一行动的效果。','follow something up with something','She followed up the phone call with an email.','打完电话后，她又发了一封邮件。']],
'bring up':[
['短语动词〔可分开〕','提出话题或问题供讨论。','bring something up; bring it up','Please bring this question up at the next meeting.','请在下次会议上提出这个问题。'],
['短语动词〔可分开〕','抚养、养育孩子。','bring someone up; be brought up to do','Her grandparents brought her up.','她由祖父母抚养长大。'],
['短语动词〔可分开〕','呕出食物等。','bring something up','The child brought up most of his dinner.','孩子把晚饭大部分都吐了出来。'],
['短语动词〔可分开，计算机〕','使信息或页面出现在屏幕上。','bring up a page / menu','Click the icon to bring up the settings menu.','点击图标打开设置菜单。']],
'walk through':[
['短语动词','逐步向某人讲解或演示一个过程。','walk someone through something','The nurse walked me through the steps of the test.','护士一步步向我说明了检查流程。'],
['短语动词','按步骤粗略演练或排练。','walk through a scene / routine','The actors walked through the scene before filming.','演员们在拍摄前粗略排练了这场戏。']],
'point out':[['短语动词〔可分开〕','向别人说明某个事实或问题，提醒其注意。','point something out to someone; point out that; point it out','She pointed out that the dates on the form were wrong.','她指出表格上的日期有误。'],['短语动词〔可分开〕','用手指等指出某人或某物所在的位置。','point someone/something out','He pointed out his house on the hillside.','他指了指山坡上的自家房子。']],
'rule out':[
['短语动词〔可分开〕','排除某种可能、选择或人选，不再考虑。','rule something/someone out; rule out doing','The doctor ruled out an infection.','医生排除了感染的可能。'],
['短语动词〔可分开〕','使某种行动或结果不可能发生。','rule out the possibility of; rule someone out of','The injury ruled him out of the final.','伤病使他无法参加决赛。']],
'hold off':[
['短语动词','暂缓行动，等一等再做。','hold off on something / doing; hold off until','We held off on buying the tickets until the dates were confirmed.','我们等日期确认后才买票。'],
['短语动词','雨、风暴等暂时没有开始。','the rain holds off','We can eat outside if the rain holds off.','如果暂时不下雨，我们就可以在外面吃。'],
['短语动词〔可分开〕','抵挡对手或攻击，使其不能靠近或获胜。','hold someone off','The defenders held off the attack until help arrived.','防守方顶住了进攻，直到援军到来。']],
'work around':[['短语动词','在障碍仍存在时改变做法，使事情能够继续。','work around a problem / limitation; 名词workaround通常连写','We worked around the road closure by taking a different route.','道路封闭后，我们改走另一条路。']],
'take on':[
['短语动词〔可分开〕','接受并承担任务、责任或挑战。','take on work / responsibility','She took on the task of organizing the festival.','她承担了组织节庆活动的任务。'],
['短语动词〔可分开〕','雇用员工，或接收客户等。','take on staff / clients','The shop is taking on extra staff for the summer.','这家店正在为夏季增聘员工。'],
['短语动词〔此义不用于被动〕','呈现某种特征、外观或意义。','take on a colour / meaning','The story takes on a different meaning when you know the ending.','知道结局后，这个故事就有了不同的含义。'],
['短语动词〔可分开，此义不用于被动〕','与某人竞争、对抗或较量。','take someone on','The local team will take on the champions tomorrow.','本地队明天将迎战冠军队。'],['短语动词〔可分开〕','车辆或船只让乘客上来，或装入燃料等。','take on passengers / fuel','The ship stopped to take on fuel.','船停下来补充燃料。']],
'weigh up':[['短语动词〔可分开，英式常见〕','仔细比较信息、利弊或选项，以形成判断或作决定。','weigh up the options; weigh A against B; weigh it up','We weighed up the cost and convenience before choosing a flat.','选公寓前，我们比较了费用和便利程度。'],['短语动词〔可分开〕','通过观察或交谈判断一个人的性格、能力或可信程度。','weigh someone up; weigh them up','She watched the new player closely, weighing him up.','她仔细观察那名新球员，评估他的能力。']],
'wrap up':[
['短语动词〔可分开〕','把东西包起来。','wrap something up; wrap it up','Could you wrap the present up for me?','你能帮我把礼物包起来吗？'],
['短语动词〔及物或不及物，非正式〕','完成工作、结束讨论或活动。','wrap up a meeting; wrap things up','We should wrap up the discussion before lunch.','我们应该在午饭前结束讨论。'],
['短语动词','穿暖和，或给别人裹上保暖衣物。','wrap up warm; wrap someone up','Wrap up warm before you go outside.','出门前穿暖和些。']]
};
const active={objective:1,deliverable:1,milestone:1,priority:1,constraint:1,dependency:4,assumption:1,baseline:1,buffer:1,sequence:2,capacity:2,delegate:1,ownership:2,commitment:1,agenda:1,context:1,confirm:2,elaborate:1,recap:1,align:2,concern:2,reservation:2,proposal:1,alternative:1,compromise:1,negotiate:1,conclude:2,document:2,'follow up':1,'bring up':1,'walk through':1,'rule out':1,'hold off':1,'take on':1,'wrap up':2};
const sourceMap=JSON.parse(readFileSync(resolve(dir,'source-map.json'),'utf8'));
if(!sourceMap.scope.includes('https://www.oxfordlearnersdictionaries.com/definition/english/scope_2'))sourceMap.scope.push('https://www.oxfordlearnersdictionaries.com/definition/english/scope_2');
const bindings={scope:[0,0,1,1],objective:[0,1],deliverable:[0,2,1],dependency:[0,1,0,2],buffer:[0,0,0,1,1],sequence:[0,0,0,1],delegate:[1,1,0],clarify:[0,1],elaborate:[1,0],recap:[0,1],align:[0,0,1],consensus:[[0,1]],concern:[1,1,1,1,1,0,0,0],alternative:[0,1,1],compromise:[0,1,1,1],document:[0,1],'follow up':[[0,1],0],'walk through':[0,1],'hold off':[[0,1],0,0],'weigh up':[0,1],'wrap up':[1,0,0]};
const cards=base.map(e=>{const input=rows[e.term];if(!input)throw Error('missing '+e.term);const sources=sourceMap[e.term];if(!sources?.length)throw Error('missing sources '+e.term);return {cardId:e.cardId,term:e.term,writer:'learner-dictionary-author',sources,scope:'Common learner meanings and usage, with separately preserved full licensed source entries; not an exhaustive dictionary merger',senses:input.map(([pos,meaning,usage,en,zh],i)=>{const idx=bindings[e.term]?.[i]??0,sourceUrls=[idx].flat().map(j=>sources[j]);if(sourceUrls.some(x=>!x))throw Error('missing bound source '+e.term+'/'+i);return {id:e.term.replaceAll(' ','-')+'-learner-'+(i+1),pos,meaning,usage,example:{en,zh,kind:'authored_example'},sourceUrls}}),contextSenseId:e.term.replaceAll(' ','-')+'-learner-'+(active[e.term]||1),context:e.context,bridgeText:e.bridgeText};});
writeFileSync(resolve(dir,'learner.json'),JSON.stringify({ruleVersion:'learner-dictionary/1',cards},null,2)+'\n');console.log({cards:cards.length,senses:cards.reduce((n,c)=>n+c.senses.length,0)});
