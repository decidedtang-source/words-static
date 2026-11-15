# 词汇系统规划入口

更新：2026-11-16。本文为规划导航，不是新版运行状态。

## 当前与下一版

- 当前产品／页面／架构／既有生产方式的统一基准：[V9 冻结记录](../baselines/WORD_SYSTEM_V9_20261116.md)。基准提交 `02606557f6c0cad1aea20a7ba4d34073f567f1d1`；独立保留分支 `baseline/word-system-v9-20261116`。
- 下一版：**Words System V10 / planning revision 1**，状态 `PLANNING_BASELINE_RECORDED / IMPLEMENTATION_NOT_STARTED / NOT_DEPLOYED`。系统版本、页面版本、内容版本和生产流程版本分别记录，不能因网页编号增加就宣称全系统已升级。
- [系统与页面设计](v10/SYSTEM_AND_PAGE_DESIGN.md)
- [义项、Bridge 与七步内容规范](v10/CONTENT_AND_BRIDGE_SPEC.md)
- [现有生产基准、下一步生产与验收计划](v10/PRODUCTION_AND_ACCEPTANCE_PLAN.md)
- [Codex 交接入口](v10/CODEX_HANDOFF.md)

## 权威与边界

本仓库管理实现、内容合同、构建与发布证据；Context Hub Project 0003 管理跨对话目标、用户原始 Prompt、决策、路线图及交接。不要另外创建 Project 或恢复旧 `ctx/*` 写入方式。

[上下文规划入口](https://github.com/decidedtang-source/chatgpt-context-hub/blob/main/projects/0003-work-english-podcast/planning/words/README.md)；[用户七步 Prompt 原文](https://github.com/decidedtang-source/chatgpt-context-hub/blob/main/projects/0003-work-english-podcast/reference/prompts/WORK_ENGLISH_SEVEN_STEP_USER_ORIGINAL_20261116.md)。Prompt 的保存字节 SHA-256：`aaf3bd1e99daf47a70a2a158973652d67ff14dafcfc1748b3fc2a09d719885db`（UTF-8、LF、末尾换行）。

本轮授权是冻结、整理和写入下一版规划，不是启动 1,875 条批量生成、修改学习数据、上线 V10 或调整任何定时生产任务。以往版本和规划保留为历史；“冻结”不把未通过的候选变成已验收产品。
