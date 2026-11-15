# Codex 接手：V9 基准 → Words System V10

当前：V10 方案已获准整理并同步，随后进行 50 条本地试生产；不是全量生成或上线授权。新增 [50 词实施单](PILOT50_EXECUTION_PLAN_20261116.md) 与 [生产合同](PILOT50_PRODUCTION_WORKFLOW_20261116.md) 为本次执行入口。方案云端回读通过之前不得开始新内容生成；实际进度看同步回执与试运行报告。

## 先读

1. 最新 Context Hub `main` 的 Protocol、Registry，复用 Project `0003`。
2. `projects/0003-work-english-podcast/context/CURRENT_STATE.md` 与 `planning/words/README.md`。
3. 用户原始 Prompt：`reference/prompts/WORK_ENGLISH_SEVEN_STEP_USER_ORIGINAL_20261116.md`。UTF-8/LF SHA-256 `aaf3bd1e99daf47a70a2a158973652d67ff14dafcfc1748b3fc2a09d719885db`。
4. 本仓库 [V9 冻结记录](../../baselines/WORD_SYSTEM_V9_20261116.md)、[系统与页面](SYSTEM_AND_PAGE_DESIGN.md)、[内容合同](CONTENT_AND_BRIDGE_SPEC.md)、[生产计划](PRODUCTION_AND_ACCEPTANCE_PLAN.md)。

## 不再重新讨论的方向

前部可靠词典与Bridge保留；后部在新版本彻底改为原七步法。目标覆盖1,875既有入口。共享Language Game是可复用实践资料，不是强制单一路径。常用义缺失时先补充／定位真实场景义，再判断联系；允许不做牵强推导。短语与组合术语必须按整体身份处理。

## 下一工作包

本次先对齐本地与两个 GitHub 仓库的方案，再做全量只读盘点、义项／语境合同及 50 条本地试生产（24 条校准 + 26 条扩展）。此为用户最新指定范围，原 100 条验证及全量安排继续保留为后续阶段。不因样例通过就宣称全库完成。

生成Prompt的生产适配层位于Hub `workflows/words/v10/GENERATION_ADAPTER.md`；它只能添加来源、版本、结构与审核要求，不能取消原文“不要机械展开七个标题”等教学原则。

## 不得做

不覆盖V6–V9；不重置ID／FSRS／用户记录；不把V4候选当最新主线；不把当前完整词典预留接口说成已接入；不在本轮激活任何API、自动化、同步服务、域名迁移或Podcast生产变更。不得将聊天中的自评或技术样例当已审核生产证据。

## 汇报

区分planned、implemented、reviewed、accepted、deployed。记录基准和最终SHA、实际修改路径、保全检查、未运行的测试、资料缺口、每条状态和真实用量。技术测试通过不等于学习效果已验证。
