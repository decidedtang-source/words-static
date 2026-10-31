# Semantic Bridge｜项目解析框架的紧凑完整版本

状态：**CONTENT-AUTHORING STANDARD / PR #5 CONTENT REVISION REQUIRED**。
本文件必须与 [docs/CHATGPT_PROJECT_INSTRUCTIONS.md](../../CHATGPT_PROJECT_INSTRUCTIONS.md) 一致。它不是一套替代项目指令的新方法，而是将原有完整解析流程压缩成适合词汇网页直接显示的版本。

## 1. 核心原则：流程完整，信息量精简

我们的既有解析顺序必须保留：

**Dictionary → Memory → Semantic Connection → Context（Syntax → Concept → Contrast）→ Language Game → English Neighbors → Pragmatic Action → Workplace Use**

网页不是深析文章，不需要把每一步写成一篇小论文；但不能因为简化篇幅就跳过这些问题。

因此，默认可见的简析统一压缩成**四个连续部分**：

1. **词典与当前义（Dictionary）**：先可靠说明学习对象是什么、当前选用什么义项。
2. **记忆与语义桥（Memory → Semantic Connection）**：解释如何从词典义项走到当前词/词组的整体意义；这是本规范最重要的桥接部分。
3. **语境理解（Context：Syntax → Concept → Contrast）**：解释整体表达在句子里如何构成、具体指什么，以及最有价值的相邻表达区别。
4. **语言游戏与实际使用（Language Game → English Neighbors → Pragmatic Action → Workplace Use）**：说明表达所在的活动、相关英文表达、说话者在做什么，以及如何自然使用。

**四部分是网页展示结构；括号里的原项目步骤仍须完整经过。** 不能将四部分误解为只做四个泛泛的栏目，也不能把原七阶段或 Dictionary/Memory/Semantic Connection 任意删掉。

## 2. 分析单位：一个目标表达，一条完整解释链

用户学习的对象可能是：
- 单词：shift
- 组合词组：working definition
- 固定表达/习语：take into account
- 技术术语：functional seating surface
- 完整句子：If management asks whether the schedule is safe, answer with conditions.

**无论目标由几个英文单词组成，都先把用户输入的整个目标作为一个学习和解释单位。**

对于 working definition：
- 整体目标就是 **working definition**。
- 可以在第一部分指出 working 是 adjective、definition 是 noun，并引用真正相关的组成词义项。
- 可以在第二部分解释 working 的所选义项如何修饰 definition，两者怎样形成整个词组的含义。
- 但绝不能把内容拆成“working 的完整四步解释”＋“definition 的完整四步解释”＋“最后再拼成词组”。这会让学习者失去整体理解，也会制造重复。

组成词只在**帮助解释整个目标表达**时被拆开；拆词是解释工具，不是把分析对象拆成若干个独立词卡。

### 词组的统一原则

**先确定整体表达类型，再解释组成部分对整体意义的贡献。**

- 如果是有可靠词典依据的固定表达/习语：先说明整体义，只有在有助于记忆时才补组成词，不能强行逐字推导。
- 如果是可组合词组：先识别中心词、修饰关系、词性和各部分贡献，再说明组合后整体表达了什么。
- 如果是常见搭配：说明搭配如何限制或具体化常见词义；不要把它冒称为固定习语。
- 如果是工程术语：先说明现实问题和中文技术概念，再说明英文各部分如何组成术语；技术事实仍须图纸/规范/场景证据。
- 如果是完整句子：整句作为分析单位，挑选关键词义和结构作为支点；不要给句中每个词各做一篇迷你词典。

## 3. 四部分标准模板

### ① Dictionary｜词典与当前义

回答：
- 用户输入的目标是什么类型：单词、组合词组、习语、技术术语还是句子？
- 目标中关键词的 lemma、实际词形、词性与相关常见词典义是什么？
- 当前语境选择哪个义项？有哪些最容易误选的其他义项？
- 整个词组是否有独立词典收录？还是本项目根据组成词作出的组合解释？

**写法**：给学习者足够可靠的词典锚点，但只突出与整个目标相关的义项。对词组可同时标出必要组成词的 POS/sense；不要把每个组成词扩写成独立的完整解析。

### ② Memory & Semantic Bridge｜记忆与语义桥

这是核心。回答：
- 当前最值得记住的整体中文意义是什么？
- 为什么在这里选这个词典义项，而不是其他义项？
- 被选义项内部的哪些语义成分对当前用法重要？
- 这些成分如何通过词组构成、修饰关系、固定搭配或句法结构，形成整个目标表达的意义？
- 从上一个结论到下一个结论，中间的语义变化是什么？为什么成立？

必须写出**连续的语义推导**，不能只列“词典义项 A、最终中文 B”。每次转变都要解释，但不要求机械使用箭头或固定“第一步、第二步”小标题。

若不同词典义项之间没有自然、可证的共同联系，直接说明它们是不同义项；只解释当前目标实际选择的那一个。语义类比不能冒充词源历史。

### ③ Context｜语境理解：Syntax → Concept → Contrast

以整个目标表达和实际原句为中心：
- **Syntax**：关键词在当前句子的词性/句法角色、中心词、修饰关系和句子主干。
- **Concept**：当前表达在这里具体指什么、范围到哪里、包含哪些前提；区分事实、假设、建议、承诺和正式决定。
- **Contrast**：只比较最有帮助的相邻表达，解释它们的关注点和替换边界；不为凑数制造区别。

这一部分必须承接第二部分已经建立的整体意义，不能重新从头解释每个组成词。

### ④ Language Game & Use｜语言游戏与实际使用

继续从原句的具体含义出发：
- **Language Game**：这个表达出现在哪一种实际活动？参与者可能正在解决什么问题？
- **English Neighbors**：哪些自然 chunks、句式和概念与它相连？为什么相连？讨论可能怎样继续？
- **Pragmatic Action**：说话者是在 clarify、confirm、limit commitment、raise a risk、request evidence、align，还是做其他交际动作？不能无依据推断正式授权。
- **Workplace Use**：工作语境给1–2条自然短句；若原材料来自哲学、政治、经济或其他领域，使用相应领域，不强行套制造业例句。

语言游戏解释的是表达参与的实践，不是词典义项；“某种组织可能接下来做什么”也不是所有组织必须遵循的普遍流程。

## 4. 完整示例：working definition（整个词组只走一套四部分）

### 原句

*Let us agree on a working definition of a critical defect.*

学习例句：这是教学例句，不是客户原话，也不是正式质量标准。

### ① Dictionary｜词典与当前义

整个学习对象是 **working definition**，一个由形容词修饰名词的组合词组；当前组合解释为“工作定义；当前供进一步讨论和判断使用的定义”。

本句中的 working 是形容词，不是 work 的进行时。它选用的 OEWN 2025 义项是：

> adopted as a temporary basis for further work

中文教学释义：**暂定用作进一步工作基础的**。

definition 是名词，指对词语、概念或对象含义的界定/说明。这里没有证据表明 OEWN 把 working definition 作为一个独立整词条收录；当前解释是根据组成词的已核义项所作的组合解释。

### ② Memory & Semantic Bridge｜记忆与语义桥

先记住整个词组：**当前供讨论、分析或判断使用的定义；通常可以暂定，之后视需要修订。**

为什么 working 会有这个意思？要看它在本句采用的完整词典释义，而不能只抽出 temporary：

- adopted：被选择并采用，说明它已经被拿来使用，而不只是一个尚未采用的想法；
- a temporary basis：现阶段使用的依据，并不声称它是永久或最终的依据；
- for further work：它的用途是支持后续讨论、判断或工作继续进行。

所以，这个义项的重点不是单纯“时间很短”，而是**暂时采用一个依据，让后续工作能够继续展开**。

再看它与 definition 的关系：definition 提供要使用的概念界定；working 修饰这个名词，说明这个定义目前被采用来作为工作依据。两者组合后，working definition 就是**现阶段供讨论、分析或分类使用的定义**。

这就是从词典义项到整体词组意义的桥。它可以以后修订，但“可以修订”是合理的语境特征，不表示它一定会被推翻；更不能把 working 在所有其他用法里都翻译成 temporary。

### ③ Context｜语境理解：Syntax → Concept → Contrast

在句子 *Let us agree on a working definition of a critical defect* 中，working 修饰 definition，of a critical defect 指明这个定义要界定的对象。因此整句是在建议大家先就“什么算作严重缺陷”建立一个当前可共同使用的判断口径。

这里的 *Let us agree on…* 是提出共同约定的建议，不是报告“大家已经同意”。working definition 强调当前可用的工作依据；tentative definition 更强调尚未确定，provisional definition 更强调暂行、等待进一步确认或替代，final definition 则强调已经定稿。这些表达有重叠，区别在关注重点，不是互斥标签。

### ④ Language Game & Use｜语言游戏与实际使用

在质量讨论中，先提出一个 working definition，可以让团队继续讨论边界案例、需要哪些证据，以及什么情况下要修订定义。这些是该表达在这个活动中可能引出的后续问题，不是词典定义，也不表示原句已经指定负责人、批准流程或正式质量标准。

**Pragmatic Action**：说话者是在建议建立共同判断口径（align on a shared working basis），而不是宣布某项标准已经生效。

**Workplace Use**：
- *Let's use this as a working definition for the current review.*  
  目前这次评审先按这个工作定义使用。
- *We can refine the working definition when more evidence is available.*  
  有更多证据后，我们可以进一步完善这个工作定义。

## 5. 不同输入类型如何使用同一套四部分结构

### A. 单词

四部分始终围绕这个单词本身。Dictionary 列出有学习价值的词性/义项；Memory & Bridge 解释当前记忆义与真实语义联系；Context 分析当前例句；Language Game & Use 连接相邻表达与实际交际。若两个义项没有可证明的联系，不制造统一的核心义。

### B. 组合词组

四部分始终围绕**整个词组**。只在 Dictionary 部分标明必要的组成词义项；在 Memory & Bridge 部分解释这些组成意义如何形成整体表达；Context 和 Language Game 继续解释整体词组在原句中的意义与作用。绝不为每个组成词重复完整四阶段。

### C. 固定习语 / 不透明短语

Dictionary 先给有依据的整体习语义。Memory & Bridge 解释整体义的记忆方式；如果组成词无法自然推出习语义，就明确说这是整体记忆，不编逐词语义桥。Context、Language Game 与实际使用仍围绕整个习语。

### D. 派生词 / 词形变化

四部分围绕当前学习词形。必要时说明 lemma、morphology、POS 与句中角色；不要把 -ing 一律解释为动名词或进行时。只解释对当前词形有帮助的词族关系。

### E. 工程技术表达

四部分围绕整个术语。技术概念可按**现实问题 → 中文概念 → 英文术语 → 实际工程语境 → 工作表达**展开；缺少图纸、标准或产品证据时明确限制，不虚构技术事实。

### F. 完整句子

整句是唯一分析单位。Dictionary 只解释影响理解的关键词；Memory & Bridge 说明关键意义如何组合；Context 处理句法、概念和承诺范围；Language Game & Use 解释交际动作与领域内自然表达。不要为句中每个普通词单独生成四部分。

## 6. Writer / Reviewer 的硬性验收要求

Writer 必须交付：
- 四个部分，顺序固定，文字简短但有具体内容；
- 一个整体目标表达、一条连续的解释链；
- 必要的词典来源、词性、义项和原句/学习例句身份；
- 说明每个重要语义转变为何成立；
- 不把组成词各自扩成独立的四阶段分析。

Reviewer 必须逐项检查：
- [ ] 是否保留原项目指令的全部核心步骤？
- [ ] 四部分是否按 Dictionary → Memory/Semantic Connection → Syntax/Concept/Contrast → Language Game/Neighbors/Pragmatic Action/Use 排列？
- [ ] 分析单位是否是用户实际输入的整个词/词组/句子？
- [ ] 若为词组，是否只在必要处解释组成词，而不是逐词复制完整框架？
- [ ] 是否清楚说明从词典义项到整体意义的中间步骤？
- [ ] 每次重要语义变化是否有理由，而不是只有 A → B 的箭头？
- [ ] Context、Contrast、Language Game 和 Pragmatic Action 是否承接前面已经建立的意义？
- [ ] 是否区分词典事实、组合解释、语境推断、组织实践和词源历史？
- [ ] 例句是否与前面解释的同一义项保持一致？

**失败标准**：内容即使每段单独正确，只要流程被删减、目标被拆散、或学习者仍需要自己猜词典义项如何变成当前词组意义，仍判定 REVISE。

## 7. 长度原则

普通词条默认以四部分完成；每部分可用一到数句。复杂词可以稍长，但不重复词典原文，不为凑齐小标题制造无意义内容。信息量可以少，**完整结构和语义连接不能少**。

最终验收问题：

> 学习者是否能把整个目标表达当作一个单位，沿着四个连续部分看懂：它有哪些可靠词义、为什么这里选这个意思、它如何形成当前表达、以及它在具体活动中发挥什么作用？
