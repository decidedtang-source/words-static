# V3 双模块内容生产 Workflow：成熟学习词典式讲词 + 原五区

**状态：设计/研究试验，非正式运行实现、非独立审批、非 GitHub Pages 发布。** 本文为 Owner 最新要求，补充 [SEMANTIC-BRIDGE.md](SEMANTIC-BRIDGE.md)、[WORD-SENSE-PATH.md](WORD-SENSE-PATH.md) 和上位 [项目指令](../../CHATGPT_PROJECT_INSTRUCTIONS.md)。

## 0. 产品边界（严格不可丢）

**模块 A｜Lexical Foundation + Meaning Path（词典基础与词义路径）**

前半维持 Owner 已接受的 V3 原页面：英文词头、中文短义、当前对应的已核词典义项、本句先记、原句/学习例句、更多义项默认折叠；在其后**新增一段独立、默认可见、不编号的词义联系 Bridge**。它应首先让用户认识一个词典上真实、易记的现代常用基本义，适当给具体画面，说明为什么能联系到当前义项，再回到原句。历史最早义和教学记忆锚点必须区别。

**模块 B｜Original Five Areas（原五区）**

独立 Bridge 之后，原来的五区**全部存在且顺序不变**：

01 先记住，再联系：Memory + Semantic Connection；巩固记忆，不重复整段 Bridge。
02 句法与概念：Syntax + Concept；解释当前句法/范围/前提。
03 辨析与英文邻居：Contrast + English Neighbors；区分邻词，解释自然搭配关联。
04 这句话在做什么：Language Game + Pragmatic Action；区别实际话语作用与可能的工作流程。
05 工作中可以这样说：Workplace Use；给真实自然的教学句并标明来源。

学习例句、双复制、FSRS/撤销/收藏/导入导出、页面网址及原用户状态不变。**Bridge 不是五区中的第 01 项；整个词组、习语或完整句子是一个分析单位，不给每个组成词分别生成五区。**

## 1. 核心问题：资料证据与讲词方式分离

**可验证资料（对事实负责）**：
- 本仓库 OEWN 2025 snapshot/senseId/POS、源例、许可通知；注意仓库是精选义项而非完整商业词典。
- Cambridge 与 Oxford 等成熟学习词典的**可核义项、POS、使用场景和链接**；本项目用自己编写的中文解释，不照抄版权词典正文与例句，不把外部 Cambridge 义项假称本仓库 OEWN sense。
- Etymonline 等词源研究材料只在用户真正问历史起点时查。shift 古英语的“安排、划分、分配”与现代“移动、改变”不同，工作时段义十九世纪初有记录；具体演化仍可能不确定。
- 墨墨官方“超级释义”仅证实它有义项数量少/中/多、解释简/中/详等产品机制，**并未提供本次 shift 页实际讲解，不能把自写 Bridge 冒充墨墨的解释**。

**教学选择（对学习效果负责）**：
选择现代常用义作为记忆锚点、构造有根据的具体场景、解释从已选义项到当前用法的连续关系。标明哪些是词典事实、哪些是合理记忆类比、哪些是有证据的词源历史。不能为了连贯而造一个所有义项都起源于它的“唯一原意”。

官方外部证据页：
- https://dictionary.cambridge.org/dictionary/english/shift
- https://www.oxfordlearnersdictionaries.com/definition/english/shift_1
- https://www.etymonline.com/word/shift
- https://dictionary.cambridge.org/dictionary/english/working
- https://www.oxfordlearnersdictionaries.com/definition/english/working_1
- https://dictionary.cambridge.org/dictionary/english/framing
- https://dictionary.cambridge.org/dictionary/english/take-into-account
- https://memodocs.maimemo.com/docs/AXhuwXpfFibceakKPpdc6VbVnFc

这些链接用于独立核对和出处说明，**不授予复制商业词典正文到公开 GitHub Pages 的权限**。

## 2. Workflow（从输入到审阅/候选发布）

| Step | 执行者 | 需要的输入 | 交付和拒绝边界 |
|---|---|---|---|
| **W0 SELECT** | Selector | 用户已选词、原句/自编学习例句、词卡 ID、隐私、来源 | 固定一个学习目标和原句证据；Notion 暂只负责选词，不写入、迁移或公开私人字段 |
| **W1 SOURCE** | Lexical researcher | OEWN source refs + 真实查过的 Oxford/Cambridge/词源 URL | 来源账本：已核/未核、POS/sense、许可/归属、使用范围；缺证据不编 |
| **W2 ANCHOR** | Lexical editor | W1 的受许可资料 | 选现代记忆锚点、当前句所选 sense、为何不选其他义；历史最早义可选且另列 |
| **W3 BRIDGE STRATEGY** | Writer | 目标类型及 W2 | 多义词→自然联系；组合词组→中心词/修饰；派生词→形态/词性；习语→先整词义；技术/句子→现实问题与整句 |
| **W4 MULTI-DRAFT** | Writer | 相同源证据与相同 V3 前/后内容 | 生成 A/B/C 三种**真正不同**的独立 Bridge；不改原 01–05；各写一次完整词/词组而非逐词五区 |
| **W5 FACT REVIEW** | 独立词义审查 | 各候选及 source ledger | 检查现代义/教学类比/历史词源分类、词性、语境与来源权限。事实错直接 BLOCK，不能用高分补偿 |
| **W6 PEDAGOGY REVIEW** | 不同上下文的 Reviewer | 同一批候选 + 原五区 | 评估记忆、语义连续、与五区重复、真实自然度，REVISE/QUARANTINE/APPROVE；本次助手初评不能伪装独立复审 |
| **W7 UAT COMPARE** | Owner + 浏览器 QA | V3 同一页面中三个 Bridge 候选 | 比较 A/B/C，要求前半与 01–05 文字/顺序完全相同，桌面/手机不溢出，背词正面不泄答案 |
| **W8 CONTENT PR** | Builder（将来获实施许可） | 优选且独立核过的桥、准确原句 | 设计独立存储、来源、严格 schema、exact hash + review receipt；现有 PR5 没有独立 Bridge 字段，不能塞 g1 代替 |
| **W9 RELEASE** | Owner G2 + operator | 真正稳定的内容/代码 PR 与 QA | 只有明确发布许可才合入 main，现有 Pages 在 main push 后会自动发布；必须公网回读，保留旧 FSRS/身份 |

### W4 三种候选的不同教学路线

- **A｜词典直连**：当句已核词义 → 当前结构与适用范围。优点短、稳、最少臆断；可能不够好记。
- **B｜基本义＋具体画面**：熟悉现代义 → 日常/工作场景 → 当句义。优点最像学习词典的讲解过程；风险是把类比误称真实历史演变。
- **C｜交叉核对/词源旁注**：不同来源里的 POS/义项比较，必要时给经过核实的词源事实。优点稳、辨析精确；风险是讲太多，抢占五区 Contrast / Language Game。

“所有词都必须 B”是错的：固定习语 take into account 可能 A 最好，派生词 outcome framing 可能 C 的独立名词义核对更好。缺乏自然联系则分别记，不强行编“基本义推导”。

### W5/W6 五维评分（每项0–5，总25）

1. **词典/资料准确**：字义、POS、许可/来源、历史事实边界。
2. **记忆价值**：能否抓住一个具体而正确的学习锚点。
3. **语义连续**：从当前选义到目标义有没有合理的中间说明。
4. **句子边界**：忠于原句，不扩大为承诺、批准或真实工程事实。
5. **与五区配合**：Bridge 不取代、不重复 g1–g5，长度及信息密度可读。

审查者需另写事实来源链接、负例、每项优缺点。**SOURCE/PRIVACY/SEMANTIC FAIL 一票否决**；当前研究分数只能称“助手预审”，不产生签名回执、不能把原五卡旧 hash 直接继承为新桥 APPROVED。

## 3. 第一轮试验覆盖

从 PR #5 选了五类目标：
- shift（多义词；通常 B 的轮班画面比 A 更利于理解；C 适合词源兴趣）
- working definition（组合词组；B 的实际讨论场景利于理解“可据以继续工作”）
- outcome framing（名词化/组合；C 中 Cambridge 已收录 framing 的组织表达名词义，可作为外部补充证据，但不是 OEWN 可再分发正文）
- take into account（整体习语；A 先整词义更简明，不勉强 account = 账户 的逐字故事）
- If management asks whether the schedule is safe, answer with conditions.（整句；B 能较自然说明条件与排程稳妥之间的概念联系）

**每条有 A/B/C 三种 Bridge 候选、V3 原词典和原五区始终完全相同**。互动试验会展示初评五维评分，但评分并非独立 Reviewer 已签名的质量记录。下一阶段按独立证据复核选择胜出方案，不能只靠评分最高即发布。

## 4. 反例 / 停止条件

- 把“现代常用义”写成“历史上的最早原意”，或声称班次义必定由位移义直接演化。
- 把字面拆词的故事强加给整条固定习语，伪造 source sense。
- framing 名词作为主语却一概当进行时；把 Cambridge 名词义标成 OEWN 源义。
- 一个 working definition 拆出 working 五区 + definition 五区 + 全词五区。
- 新 Bridge 代替/覆盖原 01–05、把它编号为 01，或删掉五区中的 Language Game/English Neighbors 等真实内容。
- 将助记画面中的“客户、工单、数据、批注”虚构成真实项目。
- 把独立 HTML 预览或 Writer 自评说成独立审核/正式网站已部署。

**整体目标**：学习者可以先说出词本身真实的现代含义，再理解为什么当前表达使用这一义，最后借 V3 原五区掌握句法、概念、辨析、语言实践与实际表达。
