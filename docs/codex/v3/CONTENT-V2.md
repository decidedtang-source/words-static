# V3 数据合同增量 — 候选已实现

## 简析结构与整体分析单位（最新）

按 [SEMANTIC-BRIDGE.md](SEMANTIC-BRIDGE.md) 采用四部分：Dictionary；Memory + Semantic Connection；Context（Syntax / Concept / Contrast）；Language Game（English Neighbors / Pragmatic Action / Workplace Use）。它是现有项目指令的紧凑显示版，不能漏掉原有步骤。

整个用户目标（尤其多词组成的词组）是唯一分析单位。组成词的词典义项可以作为 Dictionary/Bridge 的证据，但不得对每个组成词重复一整套四阶段解释。现有 displayGroups 4–5 项结构足够承载该内容，默认四组，不需先增加schema字段。

## 内容连续性要求：Semantic Bridge

v2 当前 presentation 字段提供 displayGloss、contextSenseRefs 与 contextTakeaway，但**没有独立的 semanticBridge 字段**。当前先把桥接作为 Writer/Reviewer 的必需内容标准：在 g1 明确完成“词典所选义项→语义分解→组合意义”，g2 接续解释当前句法/概念，g3–g5 继续承接，而不是各写各的。完整示例见 [SEMANTIC-BRIDGE.md](SEMANTIC-BRIDGE.md)。

本轮不应为了增加字段而立即升级 schema 或重做 UI。如果后续确实需要将桥接步骤结构化，须另提 schema 设计、迁移兼容、逐阶段证据和独立回执版本变更；不可把新增字段默认视为内容质量已经改善。


候选并行支持v1和v2；新增schema与独立v2回执，不覆写旧v1回执。真实批次见content/reviewed/v3-goldens.json；证据见DELIVERY.md。

## 最小新增对象

在已有AnalysisEntry增加必需（仅v2）的 presentation：

```json
{
  "version": 1,
  "displayGloss": "工作定义；暂定采用的定义",
  "glossKind": "compositional",
  "contextTakeaway": "这里先约定一个用于当前判断的定义；它可以是暂定的。",
  "contextSenseRefs": [
    {"entryId": "实际catalog中的working条目ID", "senseId": "working%5:00:00:impermanent:00", "role": "component"},
    {"entryId": "实际catalog中的definition条目ID", "senseId": "definition%1:10:00::", "role": "component"}
  ]
}
```

以上entryId是明确占位示例，不可提交生产。另存模板见 templates/presentation.example.json，状态为ILLUSTRATIVE_NOT_APPROVED。

- version恒1；displayGloss 1–400字符，contextTakeaway 1–600字符；不把上限当生成目标，正常各1–2句。
- glossKind：source_summary / compositional / sentence_translation。对应源摘要、组合解释、句子翻译。中文不是源词典官方译文。
- contextSenseRefs为1–12项，顺序即默认显示顺序；每项只含entryId、senseId、role，role为whole/component/keyword。重复(entryId,senseId)拒绝。
- entryId必须在该AnalysisEntry.dictionaryEntryIds内，并在本批投影中有完整源锚；senseId必须属于该entry、来自核验源。不能仅按相同拼写跨POS找sense。
- 不重复存英文定义/中文义项，运行时以ID解析到既有词典对象，避免正文漂移。
- 来源范围、权利、隐私、copyPayload、十阶段证据与现有校验继续有效。semantic change需要新学习身份，不借UI字段改召回目标。
- 本句语义不明确、缺源或多义无法审定的新增候选→REVISE/QUARANTINE，不能随机取第一义。历史v1卡允许明确未核降级；工程E不因此获准入库。

## 版本与审核

计划新增 schemas/analysis-v2.schema.json、reviewed-batch-v2.schema.json、content-review-v2.schema.json，复用既有dictionary-entry结构。投影schema=2；回执schema=2；rulesVersion=reviewed-content-v2；旧三者继续匹配schema1/rules-v1。混用或未知版本拒绝。

v2回执除现有字段外，增加presentationChecks，键集必须恰好等于本批analysis.cardId集合；每项包含displayGloss/contextSenseRefs/contextTakeaway三项，均为PASS才放行。字段值只允许PASS/FAIL/NEEDS_EVIDENCE。Writer≠Reviewer，实际新上下文审阅证明仍由维护者核验，JSON不是身份认证。

v1回执不能给新增presentation签字。新增/改义项绑定、短义或本句提示都改变candidateHash，必须独立重审。既有reviewed-content-v1语义通过不等于contextSenseRefs通过。

analysis.json运行旁文件仍保持schema=1的envelope以兼容loadAnalysis；entries中v1没有presentation，v2有presentation。UI版本、projection版本、presentation版本、FSRS事件版本分别管理，绝不升级IndexedDB或重算排期。

## 迁移策略：追加批次，保留原据

先保留 content/reviewed/2026-10-31-goldens.json 及其旧回执不动。追加一个v2 analysis-only批次，覆盖A/B/C/D/F五张既有候选卡的完整AnalysisEntry，含旧十阶段正文及新presentation。

基线哈希绑定第一批编译后的vocabulary、analysis、catalog，不绑定原1875库；公开source manifest必须覆盖五卡引用的全部条目。操作只analysis-only，不新增或删卡；总量仍1878。新回执独立验证五卡绑定与新增短文，E继续隔离。

混合v1→v2链可重复构建；编译器将presentation纳入renderHash（现有分析整体hash路径需测试确认），显示变化使待评分会话重新揭晓。contentRevision只是链内序号；仍同时比较renderHash以覆盖内容回退。

## 运行接口（计划）

新增 src/presentation.mjs：
resolvePresentation({card,analysis,catalog}) → {status:'reviewed'|'legacy'|'unavailable', displayGloss, glossKind, contextTakeaway, focused:[{entry,sense,role}], allEntries, diagnostic}。

不读网络/存储、不修改card、不猜义项。缺presentation→legacy，字段/引用异常→unavailable；focused始终来自真实catalog引用。通用查词由调用者走无语境路径，不构造伪AnalysisEntry。
