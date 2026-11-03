# 文档导航、冲突清理与历史保存

## 当前入口

README → AGENTS → START-HERE → v3/README → PRODUCT / CONTENT-V2 / IMPLEMENTATION-PLAN / OPERATIONS / QA / ROADMAP。

| 文件/目录 | 地位 | 处理 |
|---|---|---|
| docs/design/words-ui-v3/* | Owner冻结基线 | 全部只读，逐文件hash核对；不改样例掩盖实现差异 |
| docs/codex/v3/* | 本轮完整计划 | 当前执行规格，未实施字段明确标记 |
| CONTENT-CONTRACT.md + schemas | 实际v1合同 | 不假装v2已实现；新增规格链接明确 |
| PRODUCT-ACCEPTANCE / QA-AND-RELEASE / UPDATE-WORKFLOW | 当前规范入口 | 改为指向V3对应唯一正文，避免两份矛盾规则 |
| prompts/* | 当前Agent工作指令 | 重写为V3分工与明确状态，不再从零规划旧P0 |
| templates/OWNER-PREVIEW-ACCEPTANCE.md | 当前验收单 | 验收实现符合V3，不重问已接受设计 |
| GOLDEN-CASES.md | 语义案例 | 保留原内容，V3表决定默认义项；E仍隔离 |
| templates/entry-with-analysis.example.json等 | 可运行v1反例/样例 | 不改历史hash或提升为v2审批，未来Task1后更新 |
| v3/templates/presentation.example.json | v2设计样例 | 明确不可直接构建/审批，entryId占位 |
| review-2026-10-31/* | 原P0设计、来源/评审证据 | 历史，只在README说明被取代；其旧UI语句不是当前要求 |
| p1-p3-* / IMPLEMENTATION-STATUS / P1-P3-RUNBOOK | 已实现候选证据 | 保留历史测试和操作，不冒称V3已完成 |
| archive/pre-v3-consolidation/* | 整理前规范副本 | 只读历史追踪；不是第二套有效指令 |
| workflows/PR-QUALITY-GATE.proposed.yml | 未安装的CI建议 | 不自动应用；本轮不修改任何workflow |

## 生产完整性补充

[PRODUCTION-AUDIT](PRODUCTION-AUDIT.md)逐项区分正式main、PR候选、V3计划；当前正式词表HTTP回读1875卡。Task5计划补只读PR浏览器CI，不在本轮安装。

## 已解决冲突

1. 全部义项直显 → 当前语境义项直显，更多已核义项可展开；无语境通用词典例外直接列全部已选义项。
2. 先长分析/两列独立长文 → V3固定顺序，首屏短义和当前词典，随后本句提示和解析。
3. 六组金样=六张可发布卡 → 五项真实候选，E隔离；六组覆盖用于QA而非放行。
4. v1回执已通过=新绑定已通过 → 新presentation必须新版本合同与独立回执。
5. 设计登记/历史30+9测试=V3已上线 → 分开设计、实现、测试、Owner UAT、发布、公网验证。
6. 本机服务为正式产品/Notion历史继续改 → 正式产品仍GitHub Pages；Notion与任务边界不变。
7. 旧P0/P1计划从头重跑 → 复用候选代码，执行V3增量Task1–5；旧计划仅历史。

## Agent任务入口

总控用 ../prompts/CODEX-KICKOFF.md；内容Writer与独立Reviewer分别用相应prompt；后续批次用NEXT-VOCABULARY-UPDATE。报告必须给出已完成/未开始/未验证及证据，不能把角色分工包装成新增常驻平台。
