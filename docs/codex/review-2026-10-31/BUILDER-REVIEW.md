# 独立 Builder 实施可行性审阅

审阅状态：**READY_FOR_OWNER_REVIEW（初审3项已在规划层关闭）**。本审阅是独立实现审阅，不是 Writer 自审，不重复六组内容的语义审核，也不授权本轮实现或发布。下方保留初审问题和当时证据；最新关闭结论见末节。

审阅位置：`planning/pr4-independent-review-20261031`，代码 HEAD `9858886dafecbab22d55c980d160a54bd6a98a06`；审阅对象为本工作树未提交的 2026-10-31 计划文档。本轮未修改生产代码、main、Notion或任务配置，未运行生产导入器，未访问真实学习库。记录的 main/Pages 版本沿用被审材料，本独立审阅未重新验证远端运行状态。

阅读范围：AGENTS、基线、README、START-HERE及其产品/内容/更新/QA/金样文件；本目录 INDEPENDENT-REVIEW、CONTRACT-DECISIONS、IMPLEMENTATION-PLAN、UPDATE-RUNBOOK、MAIMEMO-WEB-GAPS；核对 app/model/storage/bookmarks/lexical/copy、构建/更新/补充脚本、词典结构及内容测试。以下只列需要明确答案、会改变实现计划的事项，按重要性排序。

## 1. 高：P3 新增学习卡的公开输入不在允许投影内

**证据：** CONTRACT-DECISIONS:7、17 将允许投影封闭为 AnalysisEntry、词典更新和许可文件；AnalysisEntry 不含卡片日期、原有词性/音标字段、双语例句及批次信息。IMPLEMENTATION-PLAN:66 却要求 `buildReviewedBatch` 从 base + 该投影生成新增 vocabulary。实际 `update-vocabulary.mjs` 和 `enrich-vocabulary.mjs` 需要完整学习卡字段；`tests/content.test.mjs` 要求两条中英例句，队列还依赖 `date`。私有 SelectionPacket 不是公开可重现构建的合法补充输入。

**影响：** 按现有允许清单可以给旧卡加简析，但不足以生成 P3 承诺的新卡；实现者只能补造数据、暗用私有输入，或自行扩大 schema。仅在 P1 写字段类型不能解决输入边界冲突。

**需明确答案：** P3 首批是否确实新增学习卡？若是，建议明确新增 `PublicCardProjection`，逐项列出兼容现有 vocabulary 的字段、公开教学例句及 kind、日期/批次规则，以及它和 AnalysisEntry 的一对一 ID/targetText 校验。该投影必须纳入相同 receipt/hash/许可检查。若首批仅覆盖旧卡，应删去本节点“新增卡”承诺并另列新增输入节点。

**计划应增加的验收：** 一个全新 ID 仅凭公开 repo 输入可重建；双语例句和批次统计完整；构建不读 SelectionPacket；缺卡字段拒绝，不能以词典释义临时拼出学习卡。

## 2. 高：内容版本的运行时权威与更新检测尚未定义

**证据：** CONTRACT-DECISIONS:29 要求轮中内容更新时重新查看再评分；P1 `loadAnalysis(cardId,contentRevision,analysisData)` 要求调用者给出 revision，但现有 vocabulary 卡不包含它。`src/app.mjs:37` 只在启动时 fetch vocabulary；词典则由 `src/lexical.mjs` 打包到 app.js，P2又新增单独 analysis.json。现有 BroadcastChannel 只通知本地学习记录变化，不通知 Pages 新部署。

**影响：** Git 批次一致不等于浏览器分次请求一致：旧 app/词典可以遇到新 vocabulary/analysis。只有 analysis 内的 revision 无法证明当前卡及词典属于同一显示版本；已打开页面也不会自动得知新发布。把学习事件的 `version` 当作内容版本则会破坏既有冲突控制语义。

**需明确答案：** 冻结一套浏览器加载协议：谁提供整版 release/content identity、如何绑定 vocabulary/analysis/词典，revision 覆盖哪些显示数据；旧卡无 analysis 的版本如何表示；在启动、恢复前台或评分前何时检测发布变化，离线/检测失败时是否允许对已冻结版本评分。若选择会话内一直使用冻结快照，应同步修改“轮中更新必重新确认”的承诺，不能让测试假设生产没有的检测机制。

**建议：** 将版本一致加载与会话状态机列为 P2 显式任务，单独于 IndexedDB/FSRS event schema；混版时不挂载混合内容。无需引入服务器或服务工作线程才能定义该协议。

**计划应增加的验收：** 旧脚本+新JSON、一个资源加载失败、揭晓后发布、恢复前台、离线及回滚到旧版；明确每种情况下能否评分以及下一次 reveal 的内容版本，保留现有学习 version 冲突检查。

## 3. 中：普通 revert 与保留新增卡 tombstone 不是同一种回滚

**证据：** IMPLEMENTATION-PLAN:74、94 同时要求 revert 发布提交并保留退役卡标签/tombstone。新增卡随提交被 revert 后会从 vocabulary 消失；现有 `src/model.mjs:36` 只对传入 words 排队，没有 retired 分支。旧版渲染/构建也不识别 tombstone。事件备份仍能保留这些 ID，这只证明记录未丢，不证明退役提示可显示或错误正文已停止参与学习。

**影响：** 直接回到旧 SHA 不会保留新卡 tombstone；直接把占位卡留在 words 又可能把退役提示作为到期卡排队。该撤回能力如果是首批发布保证，就不能等到可选 P4c 暂停/恢复才设计。

**需明确答案：** 区分“代码兼容回退”和“内容撤回”两条路径。建议在 P2/P3 冻结最小退役记录协议与渲染/队列过滤策略；内容撤回用基于已知安全代码的修复提交保留退役 ID，明确不是字节级回到原 SHA。若暂不提供 tombstone，应如实收窄承诺为事件/收藏备份保留、旧页面可能无法解析已撤回 ID。

**计划应增加的验收：** 新卡已评分并已收藏后撤回，学习事件和撤销仍可验证，退役卡不继续排队，详情不显示撤回正文；两份旧/新备份分别可导入。回滚目标必须是能理解该协议的版本，或明确兼容降级行为。

## 其余重要边界

- 现有 `model.validate/merge` 通过事件重放验证状态，不依赖当前词表清单；不修改事件 schema、稳定 ID 与 FSRS 参数的方向可行。学习和收藏分库、分别往返验证的计划准确。上述三项补充不需要清库或移植历史。
- P4a–P4e 已明确由 Owner 逐包选择，选定后补精确状态/接口再实施；双向学习、私密跨设备同步另做设计。该层级作为后续范围菜单足够清晰，不要求本轮预先完成所有 P4 设计。
- G1 非 main 实施、G2 发布、G3 同步/自动化/连接器分离清晰；Notion仅接收用户交付选词，历史整理保持暂停。没有发现需要为本轮预览扩大授权的理由。

初审结论：先在规划材料中答复以上三项，再冻结未来 P1–P3 实施输入。无需在本轮编写生产代码或执行发布；本文件不代表测试通过、Owner接受或软件可发布。

## 定点复核与关闭记录（2026-10-31）

复核限定在上述三项；读取修订后的 CONTRACT-DECISIONS 和 IMPLEMENTATION-PLAN，并再次核对两条旧措辞已同步。没有扩展 P4 或重审六组语义。

|初审项|修订证据及明确选择|复核结论|
|---|---|---|
|1 新增卡输入|合同“候选、审核与公共构建”新增完整 `PublishedCard` 与 `ReviewedBatchProjection`；定义双语例句、旧字段等式、exampleKinds、日期、未知值及add必需完整卡；公开白名单已改为完整ReviewedBatchProjection。P1新增reviewed-batch schema，P3明确公共完整输入和构建输出。|规划层关闭。新增卡不再依赖未声明私有输入或现场补造字段。|
|2 运行时版本|合同“身份、增量与降级”定义content-manifest、hash资源、整包校验后替换、失败保留旧包/冷启动报错；前台恢复及grade前检测，离线明确固定包；旧卡revision从1开始，显示投影及引用catalog变化递增，AnalysisEntry与manifest一致；退役/移除立即取消待评分。P2新增content-bundle接口、文件与混版/失败/迟到响应/评分回归。|规划层关闭。app层保护与原FSRS事件version分离，旧标签页局限已如实说明。|
|3 内容撤回/回退|合同定义retiredIds、调用queue前过滤、无正文历史占位和双备份保留；区分兼容壳内容修复与整版旧UI降级。P2纳入最小退役能力，P3交付及P5统一引用两条回退路径，不再承诺普通revert自动拥有新提示。|规划层关闭。此最小兼容措施不依赖可选P4暂停/恢复。|

**最新结论：READY_FOR_OWNER_REVIEW。** 本次定点复核未发现上述范围内仍需明确答案、会改变实施计划的重要遗漏。这里的“关闭”仅指设计问题已有明确选择与待执行验收；所有新schema、加载器、版本保护、退役处理及回归测试仍为 **NOT_STARTED**，没有运行时PASS结论。

Owner仍须决定是否接受设计、是否授权P1–P3或其子集的非main实施；发布须另获G2。此独立Builder审阅不替代Owner接受、内容Reviewer结论或将来的真实浏览器/备份验收。
