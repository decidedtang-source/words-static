# UI-V3 总规划与执行入口

## 新增内容质量要求：Semantic Bridge

阅读 [SEMANTIC-BRIDGE.md](SEMANTIC-BRIDGE.md)。它要求词典义项、当前选义、语义分解、词组组合、原句解释与语言实践之间有可说明的连续推导。working definition 是完整金样；当前五项旧审核回执不自动覆盖按新标准修改后的内容，任何候选改动须重新计算hash并独立复审。


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
