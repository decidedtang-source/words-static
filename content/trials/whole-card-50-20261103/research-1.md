# 第一组 17 词：作者检索与交付记录

状态：AUTHOR_DRAFT_COMPLETE / INDEPENDENT_REVIEW_PENDING。只生成试跑内容，未发布、未改版式、未修改学习记录。作者为 `whole50_author1`；本文件不是审核报告，不包含自评分或放行结论。

## 覆盖范围

scope、objective、deliverable、milestone、priority、constraint、dependency、assumption、baseline、buffer、sequence、capacity、allocate、delegate、ownership、accountable、deadline。对应原卡 ID 保留。交付 `entries-1.json` 与 `supplements-1.json`，各 17 条。

scope、accountable 复用本任务输入中的已校准正文与补充资料；仅更新作者/修订标识，来源取得方式仍保留原记录，不把此前的索引片段变成此次全文抓取。本轮必须重新独立审核，不继承先前审核结论。

其余 15 词重新读取 Oxford 词条正文和 Etymonline 相关条目，保留释义、语境、五区、词源及补充例句之间的区别。英文与中文解释为教学转述，不复制完整版权文章。例句标识为既有教学例句或自编，不冒充真实工作事件。

## 实际读取的资料

本组通过网页工具进行了 9 批读取/点击操作。以下成功页面记为 `full_page`；具体 URL、定位和证据摘要均写入对应词卡或补充包的 sources。这里的“全文”指工具成功取得页面正文，不代表所有内容均用于输出。

词典根地址：https://www.oxfordlearnersdictionaries.com/definition/english/

| 词 | 成功读取的 Oxford 路径 | Etymonline 路径 |
|---|---|---|
| objective | objective_1；objective_2 | /word/objective |
| deliverable | deliverable（重定向形容词）；deliverable_2 | /word/deliver |
| milestone | milestone | /word/milestone |
| priority | priority | /word/priority |
| constraint | constraint | /word/constraint |
| dependency | dependency | /word/dependency |
| assumption | assumption | /word/assumption |
| baseline | baseline | /word/baseline |
| buffer | buffer_1 | /word/buffer |
| sequence | sequence_1 | /word/sequence |
| capacity | capacity | /word/capacity |
| allocate | allocate；allocation | /word/allocate |
| delegate | delegate_2 | /word/delegate |
| ownership | ownership | /word/ownership |
| deadline | deadline | /word/deadline |

Etymonline 根地址：https://www.etymonline.com 。ownership、deadline 因首批输出截断再次读取；baseline 及部分 Oxford 义项亦做针对性重读。deliverable 仅引用母词 deliver 的历史，未伪造派生词首见日期。

另外实际读取以下专业说明，供当前应用解释而非冒充词典定义：

- [APM：What is resource management?](https://www.apm.org.uk/blog/what-is-resource-management/)：资源获取、分配与管理，人员、技能、资金、技术、材料，以及数量和时间需求；用于 capacity、allocate。
- [APM：What is scheduling in project management?](https://www.apm.org.uk/resources/what-is-project-management/what-is-scheduling-in-project-management/)：进度安排、逻辑次序、依赖关系与缓冲；用于 dependency、sequence、buffer。
- [APM：Seven tips on how to delegate effectively](https://www.apm.org.uk/blog/seven-tips-on-how-to-delegate-effectively/)：委派工作、让他人承担工作以及领导放下逐项控制；用于 delegate。具体对话仍为自编。

两个猜测的 APM 路径读取失败，未列为来源：`/resources/what-is-project-management/what-is-resource-management/` 和 `/resources/what-is-project-management/what-is-scheduling/`。随后读取上述有效页面，并从 resource management 页点击到实际 scheduling 地址。

## 本轮内容处理与边界

- 当前词义与更多义项分开：更多义项采用真实不同义项，或明确标明同族词（allocate → allocation），不重复当前定义充数。
- deadline 未发现适合此卡的其他已核实相关现代义项，因此额外义项为 0；在 limitations 明确记录“没有额外已核实的相关义项，本模块已核查，不重复填充”。这不是缺失整页模块，不用旧历史义填数量。
- 词源分历史事实、现代记忆联系、回到当前用法三段；每段都有 sourceId。deadline 的早期历史与现代期限义之间的联系保持不确定表述；capacity 不硬写成单一“容器义后来变能力义”的演变链。
- 新稿重新整理桥接段和第 04、05 区。第 04 区解释原句在做什么、措辞线索、可回应的话和下一步；第 05 区提供适用场景、可替换表达及边界。
- baseline 第 02 区修正为原句真实的 measuring 结构；capacity 语境译文明确资源与余力。其余已有五区内容依适用性保留，必须由另一 Reviewer 判断可读性和区间重复。
- 每词约 6 个 claims，区分来源事实、教学推断和自编表达。requirements 指向实际正文，不作为自动质量分数。
- 音标采用 Oxford 英式读音；delegate 明确动词读音，避免混用名词结尾。补充例句为原卡教学材料，不能据此推断用户真实业务。

## 已执行的结构验证与待审项

使用 `validateEntry` 与 `checkWholeCard` 检查 17 条。17/17 通过结构要求；在没有 reviewer receipt 的情况下均为 `REVIEW`，没有生成假审核或最终分数。生成脚本位于 `local-evidence/whole50-author1.mjs`，不属于交付页面模板。

下一环节由独立 Reviewer 逐卡判断全部模块的准确性、自然度、易读性、增量信息与来源适配，并写真实逐模块评分。特别检查：更多义项是否有助当前学习、复用 scope/accountable 的片段来源局限、五区之间是否重复、词源当前用法段与桥接段是否可接受地复述。作者结构通过不能代替这些语义判断。
