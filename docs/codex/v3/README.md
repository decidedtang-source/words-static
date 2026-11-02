# UI-V3 总规划与执行入口

> **最新 Owner 决定**：[B 默认、C1 按需切换｜Codex 自行决定具体实施](OWNER-B-C1-PRODUCT-BRIEF.md)。V3 原词典与原五区完全保留；新增 Bridge 默认 B 场景式讲解，C1 是同一块里的可选深入证据/词义探索；A 仅可留作内部基线，不是用户模式。Codex 先复现 B/C1、评分、独立核对，再在隔离分支实施候选，不经额外授权不合并/部署。本入口下面旧 A/B/C 三模式比较仅作为历史试验记录，**不是最新产品需求**。


## 最新实验：双模块 Workflow + 五种词类 × A/B/C 共15个语义桥版本

先读 [双模块完整 Workflow](https://github.com/decidedtang-source/words-static/blob/feature/words-static-p1-p3/docs/codex/v3/TWO-PART-LEXICAL-WORKFLOW.md)，再看 [15个版本的初评与QA范围](https://github.com/decidedtang-source/words-static/blob/feature/words-static-p1-p3/docs/codex/v3/TWO-PART-WORKFLOW-REVIEW.md)。用户要求 **模块A：成熟学习词典式现代基本义/词典证据/当前义/独立 Bridge；模块B：原 01–05 五区全部保留**。不能把桥替换五区，也不能只要求一套万能“原意推导”。本轮用 shift、working definition、outcome framing、take into account、条件式排程句各试三版（词典直连/基本义＋画面/来源核对），建议候选分别 B/B/C/A/B。15版分数属于助手预审，不是独立 reviewer PASS，也没有修改运行时 JSON/正式页面；该 HTML 原型在本对话附件供 Owner 试读。


## Owner 最新校正：保留 V3 前半与五区，只在中间新增语义桥

[SEMANTIC-BRIDGE.md](SEMANTIC-BRIDGE.md) 是当前最新内容位置与连续性规范，**优先于此前“四部分替代五区”的规划**。正确顺序：V3 原词典及本句提示 → 单独一段默认直显的 Semantic Bridge（不编号）→ 原 01–05 五区（记忆、句法概念、辨析邻居、语言游戏/言语动作、工作使用）→ 学习例句及双复制。五区原方法与先后顺序全部保留，整个词组只分析一次，组成词只提供证据。

Bridge 必须解释所选义项为何能组合成当前词组义，以及该意义怎样用于原句。不能把桥替换成 g1，也不能让 g1–g5 消失。原五项旧内容及旧审核回执不自动覆盖新桥；任何正式候选正文更改均须重新计算 hash 并独立复审。HTML 样机是独立文件，不属于已部署正式网页。


日期：2026-11-01（Asia/Taipei）。状态：**READY_FOR_OWNER_REVIEW**。
已接受的设计不需要重复确认；本轮已完成V3候选实现及自动验证；未部署V3，实机UAT待Owner。详见 [DELIVERY](DELIVERY.md)。

## 唯一权威与实际状态

1. Owner 最新明确指令。
2. [已冻结 UI-V3](../../design/words-ui-v3/README.md)，原始登记提交 ba40407431adf39202ec191105d7db04a6ea480e；HTML SHA-256 54b67149fe4ea5bf4c46c7922c9e58b56b65c0858c8fac62cc8d9db2d816524a。不得覆盖被冻结的 HTML/截图。
3. 本目录的产品、数据、实施与验收规格。若文字与冻结样例有视觉冲突，保持样例；泛化数据/安全边界按本目录，无法兼容则报告具体冲突。
4. 现有代码是实施现况，不自动成为新产品要求；旧规划仅作历史依据。

| 层次 | 当前证据 | 不可混淆 |
|---|---|---|
| 正式网站 | GitHub Pages；main cfa2ecc19fddf2fac7508c642f8580b1b5a85838 | 本机服务器只供开发预览 |
| P1–P3候选 | PR #5，内容构建1878卡，5项独立审核，历史30单元/9浏览器通过 | 不等于V3实现通过，不等于全词库审核 |
| V3设计 | Owner已接受，已在GitHub登记，六种尺寸模拟 | 非macOS/iOS实机验收 |
| V3运行整合 | IMPLEMENTED；共享组件已接入真实学习/查词 | 不得把静态HTML复制到dist当交付 |
| 本轮 | 版本化合同、共享布局、五卡批次、自动QA和独立审查 | 未改main、Pages发布任务、Notion或定时任务 |

## 阅读路径

- [PRODUCTION-AUDIT.md](PRODUCTION-AUDIT.md)：正式线上1875卡证据、生产与QA实际缺口。
- [PRODUCT.md](PRODUCT.md)：目标、布局、三种页面状态、降级与适配。
- [CONTENT-V2.md](CONTENT-V2.md)：已实施的v2语境义项绑定与审核合同；v1回执仍严格保留。
- [IMPLEMENTATION-PLAN.md](IMPLEMENTATION-PLAN.md)：Task 1–6，文件/接口/失败测试/依赖/回滚。
- [OPERATIONS.md](OPERATIONS.md)：选词、Writer、独立Reviewer、构建、发布与ChatGPT手动交接。
- [QA.md](QA.md)：六设备、旧记录、异步与回滚矩阵和Owner验收表。
- [ROADMAP.md](ROADMAP.md)：成熟背词核心功能次序与后续范围。
- [DOCUMENT-MAP.md](DOCUMENT-MAP.md)：当前规范、历史证据、冲突解决、未来Agent入口。

## 执行顺序与决策

Task 1合同 → Task 2共享渲染 → Task 3真实学习集成；Task 4五项内容迁移依赖Task 1并与Task 2/3集成；Task 5总验收依赖1–4；Task 6发布依赖5及明确G2。

下一业务节点是Owner验收真实候选并决定G2发布。Tasks1–4完成；Task5工程验证完成、实机UAT待验；Task6未执行。

保留GitHub Pages、稳定ID、FSRS、学习记录与双备份。Notion仅选词；历史整理、71深析页、旧发布器/定时任务及云盘均暂停变更。自动跨设备进度同步、私有账户与服务端不在V3内。

## 2026-11-03 实例评估与下一版设计

[实例审阅、100分量表、B/C1与阶段规划](NEXT-VERSION-DESIGN-20261103.md)：依据Owner最新B默认/C1可选方向，区分研究界面和日常学习界面；仅设计提案，未实施、未发布。
