# Words Static V3.1：五区来源整理版

版本 ID：WORDS-STATIC-V3.1-FIVE-ZONE-SOURCE-FIRST。登记日期：2026-11-03（Asia/Taipei）。

**OWNER_APPROVED_TEMPLATE_AND_WORKFLOW / BASELINE_FROZEN / READY_FOR_OWNER_REVIEW / NOT_DEPLOYED**。这是正式登记的模板与内容生产规范版本，不是软件发行、生产数据审核通过或已上线。

## 最新权威与冻结范围

Owner确认按五区需要抓取成熟解释并整理，节省重复生成；本轮要求登记GitHub、补齐QA、冻结新基线。最新要求优先于旧 OWNER-B-C1、SEMANTIC-BRIDGE 和 NEXT-VERSION-DESIGN 中冲突的顺序、强制语义推导与实验模式要求。兼容、安全、独立审核和发布门禁继续有效。

1. 保留词头、中文短义、搭配、展开的当前拆词释义，不因去重删除它。
2. 接着 A区域（直接释义，可切换有据词源/演变）→ B区域（本句先记）→ C区域（更多词典义项，折叠）。A/B/C是位置标记，不是内容模式；HTML内“B·直接释义/C·词源与演变”是遗留模式文字，不得混淆。
3. 完整保留01—05标题、布局、顺序、响应式样式及后方例句、复制入口。
4. 基线为 [preview.html](preview.html)，逐字节保存 Owner 看过的 five-zones-sources-r1。不可覆盖；后续候选另存并引用本版本与hash。
5. 五区来源整理样例只新完成 working definition；shift/outcome framing 是旧内容对照，不是本次全量内容金样。

## 文档导航

- [工作流与Agent职责](WORKFLOW.md)
- [五区模板、证据字段与提示词](TEMPLATE.md)
- [QA、评分、门禁与验收](QA.md)
- [来源说明及完整样例](EXAMPLE.md)
- [冻结清单](manifest.json)
- [本轮浏览器验证](evidence/preview-checks.json)

## 实施次序与回滚

P0 本次：规划登记与不可变预览，交付本目录、入口更新、hash和验证证据。P1 后续授权：在现有内容合同中设计兼容来源映射/改写类型/新hash审核回执，复用现有Writer→Reviewer→批次构建入口，不造第二套日更器。P2：先审working definition，再按单词/词组/习语/长句等类型扩大小批样例；每项独立复审。P3：接入真实共享渲染器与现有学习/查词页，保护稳定cardId、FSRS、事件和备份；完整回归与Owner设备验收。P4：取得单独G2后才合并main、由原Pages流程发布并回读。

依赖：P1→P2；P3需合同及内容审核通过；P4需P2/P3和Owner发布决定。未获得后续授权不自动开工。

规划回滚：新建纠正提交指回旧规范，保留冻结档案，不改历史。候选回滚：恢复上个已审内容版本及匹配回执；内容hash变了旧回执立即失效。生产回滚仅在发布范围内通过revert恢复应用/内容版本，绝不清理IndexedDB或更换cardId。

## 尚未完成的事项

本HTML是展示样机，不是生产应用；它的复制逻辑只复制词头/深析前缀，不能作为生产双复制验收。嵌入的旧contentRevision、stageEvidence、coverage、copyPayload不代表新正文的有效审核回执，不能直接导入生产。样例不是完整词典，正文许可需发布前审查；短引用不是自动获得再发布许可。当前页面没有FSRS集成，新工作流未自动化，旧生产与日更保持不动。独立内容审核、真实设备UAT及G2发布均未通过本次登记自动完成。

正式网站仍为GitHub Pages；main核对为cfa2ecc19fddf2fac7508c642f8580b1b5a85838。Notion仅选词，历史整理、定时任务不变。
