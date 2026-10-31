# Words Static 产品规划审阅包

**HISTORICAL：本目录为2026-10-31设计/评审证据。当前计划从 [V3](../v3/README.md) 开始；不要按本目录旧UI规则重新实施。**

**READY_FOR_OWNER_REVIEW · IMPLEMENTATION_NOT_STARTED · NO_PAGES_DEPLOYMENT**

当前正式产品继续是 [Words Static GitHub Pages](https://decidedtang-source.github.io/words-static/)。本轮基于正式 main `cfa2ecc19fddf2fac7508c642f8580b1b5a85838`、Draft PR #4 `9858886dafecbab22d55c980d160a54bd6a98a06`，完成独立审阅、六组完整选义范围的内容预览和可执行分阶段计划。保留GitHub Pages、FSRS和本地学习记录；Notion仅选词，历史整理全部暂停。

## 推荐阅读顺序

1. [六组真实词汇内容](SIX-PREVIEWS.md) 与 [手机/桌面截图](SCREENSHOTS.md)：直接看词典中文理解→五段完整流程简析→双复制。每组都有查词、背诵正面、一次揭晓后。
2. [独立审阅与问题清单](INDEPENDENT-REVIEW.md)：产品、来源、更新脚本、模板矛盾、数据安全与复杂度。
3. [墨墨 Web 差距与次序](MAIMEMO-WEB-GAPS.md)：官方Web日志证据与本仓库逐项比较；没有把未登录实测的功能写成VERIFIED_WEB。
4. [实施计划 P0–P5](IMPLEMENTATION-PLAN.md)：依赖、文件/接口、验收、独立审核、风险、回退及Owner节点；[合同决策](CONTRACT-DECISIONS.md)补齐构建与版本边界。
5. [持续更新运行手册](UPDATE-RUNBOOK.md)：从已选词到私有提案、生成、独立审核、内容PR和发布验收；首批人工5–10项。
6. [独立内容审核](CONTENT-REVIEW.md)、[独立实现审阅](BUILDER-REVIEW.md)、[实际QA](PREVIEW-QA.md)。

## 可打开的预览

[preview.html](preview.html) 是可下载后直接打开的单文件，无服务端、无API、无学习库写入。GitHub文件页只展示源码，不会替我们部署新网页；在本地直接打开即可切换六组和三种状态。网页正文亦完整保存在上面的Markdown和截图中，不必运行代码才能审阅。

六组：A shift；B working definition；C frame/framing/outcome framing；D take into account；E functional seating surface；F 排程条件句。共32个选定义项、46条源词典例句。**完整**指声明范围内的全部选定义项，不意味着完整英汉词典；音标未核不补写。E整条工程术语仍缺领域证据、保持隔离；F的whether为项目语法解释，不伪造OEWN条目。

## 主要推荐

- 首先统一内容/审阅合同，随后做词典与简析直显，打通人工内容闭环，再逐项补词书、搜索历史、词条记忆历史和复习控制。
- 保留 Syntax → Concept → Contrast → Language Game → English Neighbors → Pragmatic Action → Workplace Use，并在前面接 Dictionary、Memory、Semantic Connection；十项逐一审核，页面自然分五段，不堆空标题。
- 基础页提供完整可用学习内容，ChatGPT只承接自愿的长版深析。初期不搭自动多Agent平台，不扩大到服务器、自动同步或Notion迁移。
- 已修正金样D：当前源包已有take into account整条证据。合同建议同时修正阶段枚举冲突、字节hash绑定、同词不同语境、公开投影字段和内容回退。

## 待 Owner 决定

- 是否接受六组页面的信息层级和五段解析篇幅；E缺口是否作为预览保留（不授予发布资格）。
- 是否接受合同决策，并授权 **P1–P3非main实施**，或只授权其中一个阶段。
- P4的成熟功能按哪些包推进；同步、自动化与Notion历史改造均不在当前实施包。

**接受设计、授权分支开发、授权生产发布是三个不同决定。** 当前没有执行后两项，PR继续保持Draft，等待Owner下一步。不要合并该规划PR触发现有main自动部署。
