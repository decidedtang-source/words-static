# Words System V9 统一冻结记录

日期：2026-11-16。类型：当前基准与历史冻结登记；不是产品升级实现。

## 1. 不可变锚点

- 仓库：`decidedtang-source/words-static`。
- 本轮读取时 main：`02606557f6c0cad1aea20a7ba4d34073f567f1d1`。
- 完整 Git tree：`619e56251269763ac83e87c01d1d7bea6315629b`。
- 单独保留：`baseline/word-system-v9-20261116` 指向上述提交。后续不得移动此基准分支；恢复时以 commit SHA 为准。
- 固定页面目录：`public/previews/word-layout-v9-20261116/`，V6、V7、V8 原目录同时保留。
- V9 的 `artifact.json` 记录 HTML SHA-256 `2b9473e8cc12078b81162bfcbee69d5719a3c86adc4f08ea355fea1cc97b0401`；锁文件 SHA-256 `db803f7a5d08b6617e3a14bcebc5ef9ad73a291084ea7d51b70f066436fda860`。本轮读取了该记录，不把此前验证结果冒称为本轮重新运行的测试。

完整 tree 锁定此时的源码、内容、页面、模块接口、流程说明、脚本、既有规划及测试文件。冻结是版本与内容保全规则，不是设置 GitHub 分支保护，也不暂停当前生产任务。

## 2. 更早版本与候选同时登记

| 历史入口 | 不可变提交 | 原身份保留 |
|---|---|---|
| `baseline/official-github-pages-2026-10-31` | `7741f24dedcc9c67d27b291054e8c658531455fc` | 旧正式基准 |
| `release/progressive-lexical-2026-10-31` | `e88ad6b2a8f1498a4ae81330d7182844506d9c7d` | 渐进词义增量 |
| `planning/codex-wordbook-templates-workflow-2026-10-31` | `dd4eee9ac661ba91acf1ca5a6948332db4b1c383` | 历史审阅规划 |
| `feature/words-static-p1-p3` | `42424c8f5fbf4ee1f5352a27560a08d967488b65` | V3/V3.1 候选与流程 |
| `trial/five-zone-50-20261103` | `44b16396415e8e1a92132efec767a633b5e28f7d` | PR #6 冻结预览 |
| `trial/dictionary-v4-50-20261109` | `ea1871af9022c027d32412f31273be288216edfe` | PR #7 / V4 候选，非当前正式系统 |

上述分支不重写、不删除、不自动合并。V6→V7→V8→V9 的主线历史由基准提交及原固定目录保留。旧规划的“已完成／候选／未实施”状态不因归档而改变。

## 3. 当前系统实情

按本轮重新读取的根 README、`word-page/README.md` 和 V6 `WORKFLOW.md`：

- 正式静态学习站持有 15 批、1,875 条既有学习入口；ID、原句、FSRS 与浏览器 IndexedDB、备份机制仍是兼容基准。
- V8 拆成九个页面模块；V9 只修改词头发音控件与相应局部展示。三个模块化示范词仍为 scope、leverage、absorb。
- 九模块为 headword、source-preview、navigation、dictionary、learning、history、scenario、bridge、analysis；内容／展示／流程／接口版本及上游指纹分开管理。
- dictionary 是完整词典的预留接口，不是全量义项已经接入；成熟资料检索仍需人工／助手核对，既有 Cambridge 直接请求失败情况如实记录。
- 当前 analysis 仍为五区。七步法、共享语用网络、全库自动生成／审核尚未在此基准实现。
- 学习记录位于各浏览器本地；能在多设备访问网页不等于自动同步。没有因本规划引入服务器、账号体系或新词典 API。

## 4. 现有生产流程也冻结

必须保留两条不同的既有路径：

**词库更新路径**：源 `YYYY-MM-DD.entries.json` → 按 ID 的 `content/YYYY-MM-DD.json` 编辑资料 → `scripts/update-vocabulary.mjs` 校验／导出 → 原学习应用构建与发布。原句和 ID 不随内容改进而重建；内部来源字段不直接公开。

**三词阅读页路径**：成熟词典／历史／原句资料核查 → 人工／助手整理内容 → V6 data/template 或 V8/V9 模块合同 → 离线静态构建 → 锁文件／布局／交互验证 → 独立固定预览目录。构建阶段不联网生成、不自动改写讲解。

V4 50 词候选的审阅机制可以作为历史研究材料，但不是当前主线已经具备的全量生产能力。

## 5. 上下文与其他系统边界

Context Hub 的写入前 main 为 `3216e7db6fc5d205a8fdcb94f0bda7958052bd4b`，Project 0003 的完整子树为 `2993538ad0309734c57dfb6d0ce640e0fa6efcb6`。该项目此前的 planning、workflows、reference、context 全部作为原字节快照保留，详见 Hub 的 `reference/baselines/words-v9-20261116/`。

这是词汇系统的统一版本基准，不是声称已审计或冻结本机 Podcast 所有未提交文件。Podcast、Pre-study、Voice、Notion、Drive、OneDrive、调度器及另一个 private-domain 方案不被此次词汇规划改写或激活。

## 6. 后续变更规则

前部已确认内容与既有功能默认继承；后部五区只在新版本改为七步。若偏门义项路由要求补充前部数据，只在新候选按模块提升版本并重新审核相关依赖，不能覆盖旧版来“修好历史”。

本轮只增加规划文档；下一版详见 [V10 规划入口](../roadmap/README.md)。
