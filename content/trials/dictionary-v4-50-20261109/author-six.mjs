import fs from 'node:fs';
const dir=new URL('./',import.meta.url),cards=JSON.parse(fs.readFileSync(new URL('cards.json',dir)));
const edits={
'align': ['把物体 align，是让它们的位置或方向对得上。用于目标与行动时，共同点是彼此协调，而非各朝一个方向。因此 align on priorities 是对优先顺序形成共同理解，不要求大家在所有问题上意见完全相同。',[
'把 align with（与……协调）和 align on（就……达成一致）分开记：with 后常接参照对象，on 后接讨论事项。检索线索是“与谁/什么一致”和“就什么一致”。',
'We need to align on priorities 中 align 不带直接宾语，on priorities 指要协调的事项；before assigning the work 给出分工前的步骤。对比 align our plans with the budget，此处 our plans 是被调整的对象。',
'agree 常用于同意某个判断或方案；align 强调目标、理解或行动相协调；coordinate 强调安排彼此配合。团队可能 agree that testing matters，却仍需要 coordinate the test schedule；并非说过 agree 就完成了安排。',
'We need to 把协调优先级提出为分工的前提。它可能是在发现分歧后要求讨论，但句子本身不证明已经争执。可回应：Do we agree that testing comes first? 用一个具体次序检验是否已有共同理解。',
'分工前可说：Could we align on the next steps before we proceed?（继续前，我们能否就下一步达成一致？）把 next steps 换成 priorities；若是校准方案与预算的关系，则说 We need to align the plan with the budget.']],
'ownership':['ownership 首先指某物归谁所有。工作中的 take ownership 借用“把它当作自己负责的事”这一联系：接手者主动跟进结果，而不只是完成别人交办的一步。因此询问谁 take ownership，是找负责推进的人，不是转让财产权。',[
'成组记 take ownership of a task（主动负责）与 transfer ownership of a house（转让所有权）。遇到 of 后的对象，先判断谈的是任务还是财产；这是搭配检索线索。',
'Who will take ownership of this open item? 中 Who 是主语，will take 是谓语，of this open item 说明负责的对象。open item 是尚待处理的事项，不是“打开的物品”；will 在这里问接下来的安排。',
'responsibility 可以是分配给某人的职责；take ownership 常突出主动跟进。accountability 强调需要说明结果、接受追问。三者可能落在同一个人身上，词本身不决定组织的权限或责任矩阵。',
'这句问话要求把待办落实到负责人。只回答“有人在看”仍没有明确谁接手；可回应：I’ll take it and report back on Friday. 这是可行回应，不是原句已经承诺了周五交付。',
'主动接手可说：I’ll take ownership of the follow-up and update you tomorrow.（我来负责后续，明天向你更新。）将 follow-up 换成 customer complaint；如果还缺权限，可补：I’ll need approval before making changes.']],
'reservation':['reserve 有保留、留存的意思。对方案 have reservations，可以理解为仍保留疑虑，尚未把赞同全部给出去。这帮助理解“有保留”，不等于把订座的意思搬进会议：说话者未必反对，但有一些问题妨碍他完全接受。',[
'记 have reservations about 加担心的对象；再用 without reservation（毫无保留地）形成对照。预订则常用 make a reservation，动词搭配和单复数能帮助迅速辨义。',
'I have reservations about committing before the review. 中 about 后接 committing 这个动名词；before the review 修饰作出承诺的时间。顾虑指向“评审前承诺”这件事，句子没有说明承诺的具体内容。',
'concern 可以泛指担心或关切；reservation 侧重不能完全接受的保留意见；objection 更直接提出反对理由。表达的强弱仍取决于上下文，reservations 不能自动当作最终赞成。',
'说话者把承诺按下暂停，给进一步讨论疑虑留下空间。可问：What would you need to see before committing?（承诺前你需要看到什么？）这样把保留意见变成可澄清的条件，而不是把人归为反对方。',
'需要保留意见可说：I support the direction, but I have reservations about the timeline.（我支持这个方向，但对时间安排有顾虑。）把 timeline 换成 cost estimate；确实完全认可时才说 I support it without reservation.']],
'work around':['around 可以表示从旁边绕过障碍。work around a problem 也把问题当成限制路径的障碍：改变做法，从另一条路继续，而不是把障碍本身消除。因此原句问的是能否绕开限制，不能据此说限制已经解决。',[
'把动词 work around a limitation 与名词 a workaround 成对记。前者说“怎样做”，后者给替代办法命名；workaround 通常连写，不要把名词直接放进 can 后当动词。',
'Can we work around this constraint without changing the scope? 中 constraint 接在 around 后；without 后用 changing，表示继续工作时要满足“不改变范围”的条件。问题同时检查办法和边界。',
'solve a problem 通常表示解决问题本身；work around it 表示避开限制以便继续；ignore it 则只是不理会。绕行可能可用，也可能代价更高，需要检验，不能把 workaround 等同于可靠的最终修复。',
'Can we 在这里邀请提出办法，并把范围不变作为约束。可回应：We could split the file, but we should test the result first. 这是建议与验证步骤，不是原句已经许可任何替代方案。',
'系统暂时受限时可说：We can work around the upload limit by splitting the file.（我们可以把文件拆开，绕过上传限制。）by 后替换为可验证的做法；需要彻底修复时说 We still need to fix the underlying issue.']],
'working definition':['working 在这里强调可供当前工作使用。定义一旦足够支持讨论，就可以先作为共同起点，但仍能随新信息修订。因此 working definition 是“目前拿来用的定义”：它有实际用途和暂定性质，不是正在工作的定义，也不是随便猜一个说法。',[
'把 working definition 与 working hypothesis（工作假设）成对记：两者都能作为当前工作的依据。记搭配 agree on a working definition of X，检索时替换 X 即可，不必重新逐字翻译。',
'Let us agree on a working definition of a critical defect. 中 agree on 后接共同采用的内容，of a critical defect 说明要定义的对象。working 修饰 definition；critical 修饰 defect，两个修饰层次不能混在一起。',
'working definition 侧重当前可用而仍可修订；final definition 强调已定稿；operational definition 强调怎样识别或测量对象。一个定义可以同时是 working 和 operational，这不是互斥分类。',
'Let us agree on 是邀请共同确定判断标准，而不是直接宣布标准已有共识。可回应：Would a defect that stops production count as critical? 通过边界案例确认各人会不会把同一种情况归入同一类。',
'启动讨论可说：For now, let’s use this as our working definition of success.（目前先用它作为成功的暂定定义。）将 success 换成 readiness；若出现新证据，可接 We can revise it after the pilot.']],
'shift':['shift 常表示从一个位置或状态转到另一个。轮班也可以借“工作由这一批接到下一批”来理解，shift 便指排定的一段班次或该班人员。这只是现代记忆联系，不证明词源顺序；before the next shift 在本句把下一班开始当作时间界点。',[
'记 on the night shift（上夜班）、start a shift（开始一班）和 change shifts（换班）。用 on 搭配所在班次，用 before 提示下一班开始前；不要把每个 shift 都翻成“变化”。',
'The supplier needs a work instruction before the next shift. 中 needs 的宾语是 a work instruction，before the next shift 是时间短语。本句说下一班之前需要有作业指导书；不是说指导书只能在该班使用。',
'shift 是排定的工作时段，也能指当班人员；schedule 是整体时间安排；handover 是交接过程。a shift change 是换班，a handover 可发生在换班时，也可发生在项目换负责人时。',
'needs 把指导书作为待满足的需求，before 给出时限。可追问：When does the next shift start? 然后确认谁提供文件；原句没有说明班次的具体时间，也没有指定由听者编写。',
'交接前可说：Please send the updated instructions before the night shift starts.（请在夜班开始前发送更新后的说明。）换成 morning shift 就能调整时点；若问值班人员，用 Who is on the next shift?']]
};
for(const c of cards){const e=edits[c.term];if(!e)continue;c.bridge={text:e[0],mode:c.term==='shift'?'lexicalized':'semantic',reason:c.term==='shift'?'轮班义单独学习；变化联系只作记忆提示，不声称历史推导。':'基础概念与当前用法存在明确现代联系。'};c.groups=c.groups.map((g,i)=>({id:g.id,title:g.title,text:e[1][i],sources:g.sources||[]}));c.exploration=c.exploration.filter(([h])=>/历史|词源|来源|证据/.test(h));}
const align=cards.find(c=>c.term==='align');align.dictionary.senses[1].pos='动词〔及物或不及物〕';align.dictionary.senses[1].usage='align something with; be aligned with; align on a topic〔工作交流〕';
function dict(term,rows,current){const c=cards.find(c=>c.term===term),url='https://dictionary.cambridge.org/dictionary/english/'+(term==='working definition'?'working':term);c.dictionary={cardId:c.cardId,term,sources:[url],context:c.context.text,contextSenseId:term+'-'+current,senses:rows.map((r,i)=>({id:term+'-'+i,pos:r[0],meaning:r[1],usage:r[2],example:{en:r[3],zh:r[4],kind:'authored_example'},sourceUrls:[url]}))};}
dict('working definition',[
['名词短语〔可数〕','当前采用、可继续修订的定义。','a working definition of something','We adopted a working definition of fairness for the study.','研究中我们采用了一个暂定的公平定义。'],
['组成词 working：形容词','与工作有关的；正常运作的；够用的；暂定可用的。','working hours; in working order; a working knowledge; a working hypothesis','She has a working knowledge of Spanish.','她的西班牙语知识足以应付实际需要。'],
['组成词 definition：名词〔可数或不可数〕','词或概念的定义；图像、声音等的清晰程度。','a definition of; high definition','The image lacks definition.','这幅图像不够清晰。']
],0);
cards.find(c=>c.term==='working definition').dictionary.senses[2].sourceUrls=['https://dictionary.cambridge.org/dictionary/english/definition'];cards.find(c=>c.term==='working definition').dictionary.sources.push('https://dictionary.cambridge.org/dictionary/english/definition');
dict('shift',[
['动词〔及物或不及物〕','移动；转移；改变位置、方向或关注点。','shift something to; shift from A to B','She shifted the chair closer to the table.','她把椅子移近桌子。'],
['名词〔可数〕','位置、方向或状态的变化。','a shift in; a shift towards','There has been a shift in public opinion.','公众意见发生了变化。'],
['名词〔可数〕','轮班的一段工作时间，或该班的工作人员。','work a shift; the day / night shift','The night shift starts at ten.','夜班十点开始。'],
['动词〔及物或不及物，美式〕','换挡。','shift gears; shift into second','Shift into second before the bend.','入弯前换到二挡。'],
['动词〔及物，英式非正式〕','移除；设法卖掉。','shift a stain; shift stock','The shop cut prices to shift old stock.','商店降价以卖掉旧库存。'],
['名词〔可数〕','宽松直筒连衣裙。','a shift dress','She wore a simple cotton shift.','她穿了一条简单的棉质直筒裙。']
],2);
cards.find(c=>c.term==='shift').word.ipa='ʃɪft';
for(const c of cards.filter(c=>edits[c.term])){c.dictionary.bridgeText=c.bridge.text;c.dictionary.writer='v4-author';}
fs.writeFileSync(new URL('cards.json',dir),JSON.stringify(cards,null,2)+'\n');
