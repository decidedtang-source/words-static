# V10 完整方案与 50 词试生产实施单

日期：2026-11-16；方案版本：`v10-pilot50-plan-r1`。本文是实施合同，不是运行成功证明。

## 授权与执行顺序

用户指定 V10，并要求「先将生产流程与完整的方案整理好并对齐本地与云端，再进行试生产」。因此先同步本文和生产合同至产品仓及 Context Hub 的 main，核对提交及文件哈希，再生成 50 个既有词条的本地候选。云端指这两个 GitHub 仓库；不顺带修改 Notion、Drive、Podcast、定时任务或正式学习库。

本次 50 条包含先执行的 24 条跨类型校准与其余 26 条扩展，是对原先 24→100 分阶段建议的本次执行细化；不代表已经批准剩余 1,825 条，也不代表批准 V10 上线。原七步 Prompt、V10 系统设计及内容合同仍是上位规范。校准清单以 manifest.calibrationIds 显式指定，不取选样文件排序的前 24 条。

## 完整系统方案

系统由原始资料、词典义项、场景解释、Bridge、分析与共享实践、审核及发布六层组成。页面是审核内容包的视图，构建阶段不联网补写事实。

1. **原始资料**：原 entry/card ID、日期、英文句子和原资料不变。上下文 ID 独立；同一表达可有多个场景。现有教学句不自动称为真实会议、Episode 或作者原话。
2. **词典与学习部分**：可靠资料形成有覆盖边界的义项库存；精选义项是学习视图，不声称覆盖所有意义或掌握真实使用频率。例句、中文释义、词性和用法限制独立存储。接入器先归一化来源，再给页面；没有的 API 不写成已接入。
3. **场景部分**：先给原句、中文解释及来源，再解释当前用法；保留否定、条件、时态和责任范围。原词条是组合术语时按整个表达处理。
4. **Bridge**：先定位当前义，再判断能怎样联系。语境具体化、补充词义、补充专业概念、记忆类比与无法可靠推导均可。正文给联系及边界；折叠历史只在有来源时讲历史联系。传统词典历史模块与 Bridge 历史不是一个模块，缺少依据时两者都不编造。
5. **七步与共享实践**：Syntax → Concept → Contrast → Language Game → English Neighbors → Pragmatic Action → Workplace Use。保持顺序和七维覆盖，但不机械展示七个等长标题。深度依据歧义、概念距离及误用后果选择。共享 Practice 记录角色、活动目标、证据、常见回应及边界；每词仍有能独立读懂的本地说明。
6. **审核与发布**：可追溯输入指纹、逐条状态、独立语义审阅和模块版本。技术合格、语义审核、用户接受、线上部署分别记录，不能互相代替。

## 页面与模块接口

继承现有九模块及 registry/lock 思路。候选版本使用独立目录和模块版本，V6–V9 原文件不覆盖。

| 模块 | 输入与职责 | 本次注意事项 |
| --- | --- | --- |
| headword | entryId、表达、IPA、发音能力 | 图标旁音波；播放不插入可见状态文字、不跳版 |
| source-preview | contextId、原句、译文、来源 | 顶部提供可折叠原句；来源等级可见 |
| navigation | 稳定锚点、模块可用性 | 场景／词典按钮、返回顶部；窄屏不遮正文 |
| dictionary | inventoryId、senseIds、sourceIds | 精选和完整库存分开；不夸大资料覆盖 |
| learning | 精选义、教学例句、用法限制 | 既有成熟资料优先，教学例句明确标识 |
| history | 已核查词源／历史资料 | 独立于 Bridge；资料缺失显示缺口 |
| scenario | ContextUse、原句及限制 | 场景例句在 Bridge 前；目标表达未逐字出现时说明映射 |
| bridge | 定位、策略、依据、边界、可选历史 | 两个维度独立；不能把类比当词源 |
| analysis | 七维内容、Practice 版本与关系边 | 连续阅读；2–5 条原创制造业表达，含中文与适用条件 |

内容、视图、接口、生产流程分别版本化；改来源或共享实践须定位受影响条目重审，改字体不应重生成词义。50 词预览按词分片，可独立打开；不把全库深析塞进首次 HTML。正式学习应用／FSRS 接入是后续独立验收，不能凭候选页面宣称集成完成。

## 任务与交付路径

### P0：方案先同步

- 产品仓：本文与 [生产合同](PILOT50_PRODUCTION_WORKFLOW_20261116.md)，以及 CODEX_HANDOFF 的当前执行入口。
- Hub：Project 0003 的 `planning/words/v10/PILOT50_ALIGNMENT_20261116.md`、CURRENT_STATE 与规划索引，链接产品不可变提交。
- 本地：`English Podcast/中间产物-人机交互/V10-方案与流程-20261116/` 保存上述两份文档和同步回执。
- 验收：两仓 remote main 包含相应提交；远端文档、产品本地和本地审阅副本逐字节 SHA-256 一致；Prompt 规范化 UTF-8/LF 哈希匹配。此门通过前不生成新词条分析。

### P1：只读盘点与输入快照

- 输入：`public/vocabulary.json`；期望 1,875 ID、15 批，实际统计并记录差异。
- 输出：`content/enrichment/v10/pilot50/selected-originals.json`、manifest、源文件指纹与逐条原句指纹。50 个 ID 必须唯一且是原库子集。
- 按语义选择类型，不把空格等同专业短语；原库形态统计为 1,597 含空格、22 无空格连字符、256 单 token，仅供盘点。
- 校准 24 条指定为 scope、ownership、reservation、commitment、accountable、pending、trade-off、infer、qualify、preliminary、follow up、rule out、provided that、not necessarily、acceptance criteria、conditional approval、waiver、working hypothesis、verification method、validation method、first-pass yield、government bond yield、customer concession、supplier leverage；其余 26 条扩展。
- 50 条覆盖低频责任义、保留意见、限定陈述、否定／条件、质量／验证、金融收益与产线良率等。外加 entrance pupil 只作测试夹具，不替换原 ID。

### P2：证据与生产合同落地

- 新脚本限定在 `scripts/analysis-workflow/`，新测试在 `tests/analysis-workflow.test.mjs`。
- 测试先覆盖定位／策略正交、组合表达、资料缺口、输入指纹变更、同输入不同稿件审核失效、重复运行和中断恢复。
- 按需核查 Cambridge、已许可 Open English WordNet、NASA、ASQ、ISO 等原始资料。保存访问时间、版本／页面、支持主张、适用范围及许可；中文原创归纳优先。
- 输出 evidence、practice、entry shards、版本化 manifest；原资料缺失不自动通过。

### P3：24 条校准，再 26 条扩展

- 生成子批 5–10 条，先完成 24 条语义校准并修订，再处理 26 条扩展。校准发现合同问题时先修合同再扩展。
- 逐条解释原句、真实概念、联系边界和至少两条原创工作表达；不写统一空话凑七步。
- 独立审阅每条原句保真、来源支持、概念区别、Bridge、实践关系、原创表达及深度。未审核条目保留 drafted；问题留 needs_revision/blocked_evidence。
- 一轮审阅最多两次修订尝试，仍失败则保留问题，不无限重试。审核记录必须说明实际审阅者与覆盖范围。

### P4：本地候选与技术验证

- 输出 `docs/design/v10-pilot50-20261116/`，含目录、50 条按词页面、共享实践说明、审核入口及运行报告。用户无需运行生成器即可阅读。
- 采用独立九模块适配，不改线上 release 锁。原词库哈希、V6–V9 文件和 ID 保全验证。
- 自动检查 50 词、三个视口、导航、原句、复制、音频不跳版、无横向溢出和错误；以浏览器实际结果报告。真实手机／Safari 未测则标未测。
- 内容包重复构建应一致；改一个 Practice 版本应只影响引用项；失败写入不得产生 accepted 状态。

### P5：报告与下一步

- 分别报告 selected/evidence_ready/drafted/reviewed/accepted/blocked 数与缺陷，不以文件数量冒充合格数量。
- 实测成本只记录可取得字段；tokens、计费和真实学习效果未知则写 unknown。
- 本次交付本地试生产结果；候选内容上传、V10 线上发布、正式学习库回填和全量生产均另立执行记录，不借文档同步触发 Pages 部署。

## 验收判据

计划与云端对齐是生产前置门。试生产必须有 50 个原 ID 对账、有来源范围、有独立逐条审核、有可阅读候选、有明确未决项，才能称为「50 条试运行完成」；不能称为全库已生产或学习者已验收。

特殊核查：government bond yield 原句只有 yields，不能伪造整词匹配；first-pass yield 的 five points 不翻成增长 5%；conditional approval 不抹掉已授予的有条件批准，也不升级成无限制放行；customer concession 不凭 reworked 推断最终仍不合格；NASA 的 waiver 定义不替代用户公司的制度。

## 基准

产品规划源：`c59737d42929138eda3fe5db2517107f721589e8`。V9 源：`02606557f6c0cad1aea20a7ba4d34073f567f1d1`。

原 Prompt 规范化 UTF-8/LF SHA-256：`aaf3bd1e99daf47a70a2a158973652d67ff14dafcfc1748b3fc2a09d719885db`。

本文件不修改原 Prompt、既有冻结记录或未涉及工作线。实际状态以同步回执和试运行报告为准。
