# 50词独立查词补全候选

本轮不冻结为最终完整基线，不发布。Owner 2026-11-04要求：独立查清词本身，再由Bridge选取本句相关义。单一数据源全量导入不能代替常用义与用法完整。

- [完整学习页](preview.html) · [整页13模块评分](scores.html)
- [独立来源/缺口复查](RESEARCH-REVIEW.md) · [最终语义审核](LEARNER-REVIEW.md) · [逐词逐义回执](learner-reviews.json)
- [实现审查](CODE-REVIEW.md) · [最终验收](evidence/acceptance.json) · [来源说明](SOURCE-NOTICE.html)
- [常用义数据](learner.json) · [来源映射](source-map.json) · [规则](../../../docs/codex/v3/five-zone-v3.1/LEARNER-DICTIONARY-QA.md)

50词新增125组经过学习词典核对的常用释义/用法，每组均有词性、独立中文释义、结构或搭配、双语自编例句；原185条许可来源原文继续保留。125组是教学组织，不冒称商业词典的原编号。目标是读者不依赖当前例句也能查词；不是所有词典意义的无限合并。

典型修补包括ownership责任义、priority优先事项、contingency预留款、scope观察/界定任务的动词、buffer数据暂存动词、take on载运义、concern反身关注义，以及被动/可数性/介词等用法。按义关联正确的名词、动词或形容词来源，不再拿同族词页面顶替目标词来源。

每词contextSenseId绑定当前句对应的一组常用义；独立审核检查Bridge应用是否成立。原Bridge正文未改变，align on明确作为商务语境应用，不标作Oxford原条目句型。其余12模块由固定52d7ac9及更早的已审产物锁定，不虚构新审核。

复现：运行本目录learner-author.mjs生成数据；经独立审核后执行 `node scripts/five-zone-workflow/verify-learner-dictionary.mjs`。缺常用义、语法、有效例句、对应来源、Bridge关联或有效审核时构建阻断；修改任何内容导致回执失效。新验收先清旧receipt再运行全量门禁。

词典仍在原折叠区，CSS、前区、词源、五区、复制行为不变。旧dictionary-full-50目录可继续回看；回滚候选无需迁移学习数据。main/Pages、FSRS、学习记录、Notion和定时任务均保持。
