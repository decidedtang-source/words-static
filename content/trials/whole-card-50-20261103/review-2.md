# 第 2 组整页独立审核

审核者：`whole50_reviewer_group2`。日期：2026-11-04。作者为 `whole50-author2`，审核者未改该组正文。覆盖 17 词 × 13 模块；不是只审后方五区。

初审回执保留在 `reviews-2-initial.json` / `whole-reviews-2-initial.json`，对应输入快照在 `local-evidence/reviewer2-entries-initial.json` / `reviewer2-supplements-initial.json`。后续当前回执单独绑定修订后的内容。未运行聚合发布 CLI，未改 state、网页或正式数据。

## 取证范围

独立读取 17 个本词 Oxford 页面、9 个实际采用的词族/另一词性页面、17 个 Etymonline 条目，并针对长页中的更多义项回读。不是仅接受作者的 evidence 摘要。页地址可从本组 sources/research-2.md 定位；取证覆盖全部 17 词词源，而非抽样。

- Oxford 核对 commitment 承诺/投入；contingency 可能事件/备用金；trade-off 与 trade off；agenda 会议事项/行动事项；context 情境/上下文；clarify 与 clarification；confirm 核实/使安排确定；specify 与 specification。
- Oxford 核对 elaborate 动词 /ɪˈlæbəreɪt/ 与形容词 /ɪˈlæbərət/；summarize 与 summary；recap 动词/名词；align 实体位置/使相符；consensus 与 consensual；concern 担忧/企业；objection 与 object 动词；reservation 疑虑/预订；rationale 与 rational。
- Etymonline 核查各历史段的构词、来源语言、含义范围；不强行选 Oxford/Etymonline 不同的 recap 首见年代。现代联想不按历史事实审核。
- 额外独立读取 [Oxford agreement](https://www.oxfordlearnersdictionaries.com/definition/english/agreement)：具体约定与共同意见两义，既可用于两方，也可用于群体，为退修后的对照核验依据。
- 额外读取 [Atlassian Sprint Planning](https://www.atlassian.com/agile/scrum/sprint-planning) 的 Benefits 段，实际有 align on priorities；只用于确认当前工作搭配，不把它说成 Oxford 固定词组。Oxford 的 align with/to 模式另行核对。
- 句法按原句逐句核对；objection to doing 的介词模式有 Oxford 明确例证，其他宾语/修饰/条件分析是审核者的语法判断，不伪称词典收录了原卡的整句。
- 作者另外参考的 British Council 会议讲义没有作为本组每词 sourceChecks 的独立证据，本次不声称重新验证了该 PDF。

## 初审发现与处置

1. **consensus g3 阻断**：只用一句定义比较 agreement，后面重复 g1/g2 已说明的共识范围及表决程序。完成度 2、增量 2，不能因词义基本正确就通过。已退给另一 Writer，要求同一场景使用两词并保留非绝对人数规则。初审 five-zone 状态 REVISE；whole 补充八模块通过不能抵消它。
2. **reservation g4 非阻断重复**：末句“评审后不一定同意”与 g2 重复。互动中的追问和找信息缺口仍有增量，因此初审增量 3，没有为迫使修改而降到 2。Writer 已删重复末句，后续重新绑定指纹。
3. **保留的非阻断质量扣分**：agenda g4 重复未规定提前几天；context g4 重复无需全部历史；recap g1/g2 与前区复述较多；consensus g2/g4 仍反复讲范围；相关增量保留 3。若未来继续润色，应减少这些重述，不扩张版式。
4. **specify g4**：回应说需要修订价格与日期，却未给出明确可接受门槛；仍是可用的材料要求，但不够充分展示 specify 的精度。完成/易读/增量各 3。
5. **summarize g4**：The supplier is agreed 可理解，但比 We agreed on the supplier 更公事化；准确度和易读给 3，没有把可理解一律当最佳表达。
6. **concern 词源回用**：“时间不足”是从担忧作出的合理推测，原句本身未证实不足，g2 明确保留这个边界。整页词源模块四维给 3；建议日后回用段加“可能”。
7. **contingency 附加例句**：“预算涵盖这项意外情况”可理解，译成涵盖相应费用更自然；例句易读及增量给 3。
8. **词源普遍重复**：历史段提供真实新增信息，但现代联系和回用常与五区复述；没有批量满分，普遍易读/增量 3。

## 评分边界

每模块四维是具体内容判断，短字段不为“增量”硬添长话；未把结构检查当语义通过。分数及理由逐词写在回执中，不用整页平均分遮蔽低分区。

copyPayload 核对的是冻结源码约定 `term` / `【深析】+term` 以及共用上下按钮生成器。成功提示、拒绝后的手动复制和四按钮实测仍须运行浏览器 QA；本审核不宣称这些交互已由评分证明。

最终重新核验和状态见当前回执及下附复审记录。所有 CANDIDATE 均只表示内容门禁，不等于网页已发布或 Owner 已验收。

## 复审记录（2026-11-04）

另一 Writer 完成 consensus g3 和 reservation g4 修订。独立复读改动以及 claim/requirements 映射；consensus 词典事实 lexical claim 已恢复为原事实摘要，新周五对照只由 g3 teaching_inference 承担。consensus g3 最终为准确 4、完成 4、易读 3、增量 4；reservation g4 去重后四维均为 4。其余扣分保留，没有以重算指纹代替审核。

`reviewEntry` 与 `checkWholeCard` 对当前 17 条回执全部返回 CANDIDATE，初审文件未覆盖。实际网页渲染、六视口与剪贴板交互验证由后续集成 QA 完成；未发布。
