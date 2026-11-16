# Codex 接手：V9 基准 → Words System V10

当前：**PLAN_REVIEW_ONLY / NOT_FROZEN / TRIAL_ON_HOLD**。用户指出此前提前试运行且页面偏离旧版与规划。先读 [方案冻结与QA纠偏稿](PLAN_FREEZE_AND_QA_20261116.md)。文档同步不等于定稿、冻结或启动许可；目前只整理与同步方案，暂停生成、重跑、改页面和部署。原50词试样不是认可基准。

本轮已完成 [V10全部模块完整方案R2](full-plan-r2/README.md)：九模块独立方案、整体排版、数据接口、来源与生产流程、QA矩阵、冻结同步及后续实施任务。当前为完整审阅稿，尚无用户对R2的审定／冻结／启动记录；不得执行任务框。

## 先读

1. 最新 Context Hub `main` 的 Protocol、Registry，复用 Project `0003`。
2. `projects/0003-work-english-podcast/context/CURRENT_STATE.md` 与 `planning/words/README.md`。
3. 用户原始 Prompt：`reference/prompts/WORK_ENGLISH_SEVEN_STEP_USER_ORIGINAL_20261116.md`。UTF-8/LF SHA-256 `aaf3bd1e99daf47a70a2a158973652d67ff14dafcfc1748b3fc2a09d719885db`。
4. 本仓库 [V9 冻结记录](../../baselines/WORD_SYSTEM_V9_20261116.md)、[系统与页面](SYSTEM_AND_PAGE_DESIGN.md)、[内容合同](CONTENT_AND_BRIDGE_SPEC.md)、[生产计划](PRODUCTION_AND_ACCEPTANCE_PLAN.md)。

## 不再重新讨论的方向

前部可靠词典与Bridge保留；后部在新版本彻底改为原七步法。目标覆盖1,875既有入口。共享Language Game是可复用实践资料，不是强制单一路径。常用义缺失时先补充／定位真实场景义，再判断联系；允许不做牵强推导。短语与组合术语必须按整体身份处理。

## 下一工作包

先完成旧版逐区保留／变更合同、完整生产流程、来源能力、QA矩阵和失败处理，供用户审定具体版本；同步一致后按审定版本登记冻结。此前“同步后直接生成50条”的解释已被用户否定，不得继续采用。冻结及启动安排明确之前不运行样本。

生成Prompt的生产适配层位于Hub `workflows/words/v10/GENERATION_ADAPTER.md`；它只能添加来源、版本、结构与审核要求，不能取消原文“不要机械展开七个标题”等教学原则。

## 不得做

不覆盖V6–V9；不重置ID／FSRS／用户记录；不把V4候选当最新主线；不把当前完整词典预留接口说成已接入；不在本轮激活任何API、自动化、同步服务、域名迁移或Podcast生产变更。不得将聊天中的自评或技术样例当已审核生产证据。

## 汇报

区分planned、implemented、reviewed、accepted、deployed。记录基准和最终SHA、实际修改路径、保全检查、未运行的测试、资料缺口、每条状态和真实用量。技术测试通过不等于学习效果已验证。
