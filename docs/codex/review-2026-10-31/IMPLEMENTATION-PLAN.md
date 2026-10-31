# Words Static 渐进改造 Implementation Plan

> **For agentic workers:** 获 Owner 分支实施许可后，使用 superpowers:executing-plans 按任务实施；独立内容 Reviewer 不可由 Writer 自审替代。当前只规划，所有实施项均未开始。

**Goal:** 在当前正式 GitHub Pages 上提供词典→简要全流程解析→可选长深析的成熟词汇学习体验，并建立可持续、可审阅的内容更新。

**Architecture:** 保留静态站与浏览器FSRS状态。词典与按cardId关联的简析作为受审静态内容；详情/揭晓共用纯渲染模块。离线人工选词与独立审核形成允许清单，构建器只消费公开投影；不新增服务端或线上模型调用。

**Tech Stack:** 现有 JavaScript ESM、Node锁文件、esbuild、TS-FSRS 6.0.0、IndexedDB、node:test、Playwright、GitHub Pages。

**Spec:** [审阅与设计选择](INDEPENDENT-REVIEW.md)、[合同决策](CONTRACT-DECISIONS.md)、[六组预览](SIX-PREVIEWS.md)、原 [产品要求](../PRODUCT-ACCEPTANCE.md)。

## 全局约束与 Owner 节点

- main基线 `cfa2ecc19fddf2fac7508c642f8580b1b5a85838`；开始实施时fetch再核对，不覆盖后来变更。1875是该版本基线，不是永远的总量上限。
- 保留既有卡ID、学习事件、FSRS参数、撤销、已读、收藏、声音同意、手工备份和公开URL；不清空数据库、不迁移到本机服务器。
- Notion仅手工选词来源；历史内容改造与71深析页迁移全部PAUSED，不修改Notion、定时任务、云盘副本。
- 当前 G0＝READY_FOR_OWNER_REVIEW；G1＝Owner接受预览并明确授权P1–P3或其子集的非main实施；G2＝每次实际QA后独立授权main/Pages发布；G3＝同步/自动化/Notion连接器另行范围决策。
- Owner可以只接受设计而不授权代码。任何阶段不以mock、测试通过或Draft PR自动跨过G2。

## Review Focus

1. 同词不同语境或跨日源ID冲突 → P1/P3拒绝误绑定，保留全部旧事件。
2. 词典未收录、工程证据不足或IPA缺失 → P1/P2诚实降级，禁止自动补成权威事实。
3. 更新发布发生在已揭晓待评分期间 → P2锁定版本并重新确认，不跨内容评分。
4. 手机上长词义、长句、键盘和复制失败 → P2可读可返回，复制不触发评分。
5. 两标签页冲突、旧备份、内容回滚后的新事件 → P2/P5事件与收藏都完整，不清库恢复。

## P0 本轮交付（设计审阅）

交付：代码差距、Web矩阵、六组冻结JSON与HTML/Markdown/截图、独立语义审核、此计划与更新运行手册。仅规划分支。结构和视觉检查见 PREVIEW-QA；Owner阅读验收仍待进行。E领域证据仍缺失，不把六组预览宣称六张可发布卡。

## P1 统一数据合同与安全构建基础（依赖 G1，1个实施PR）

**Files:** 新增 `schemas/analysis.schema.json`、`schemas/content-review.schema.json`、`schemas/reviewed-batch.schema.json`、`scripts/validate-reviewed-content.mjs`、`tests/reviewed-content.test.mjs`；更新 docs/codex 的合同/示例/prompts；不改学习数据库。

**Interfaces:** `validateReviewedContent({projectionBytes,receipt,sourceManifest,baseManifest}) → {ok,errors,coverage}`，纯函数；`loadAnalysis(cardId,contentRevision,analysisData) → AnalysisEntry|null` 在 `src/analysis.mjs`；类型和枚举完全采用 CONTRACT-DECISIONS。外部审阅信任仍由维护者/Owner核验，不靠函数接受任意APPROVE字符串。

- [ ] 先写失败测试：hash串版、删阶段、无效ref、Writer=Reviewer、NEEDS_EVIDENCE假放行、私有字段、错误源sense、同卡不同义、空中文、多余未知字段必须拒绝；合法N/A理由和明确无音标通过。
- [ ] 运行 `node --test tests/reviewed-content.test.mjs` 确认因接口未实现失败。
- [ ] 实现上述纯验证与旁文件读取；不要读网络/Notion；公开投影字段逐项复制，不展开私有对象。
- [ ] 更新所有旧模板为同一合同，补5个负例fixture并逐一验证；源事实比对和语义审阅分开报告。
- [ ] 同一命令PASS后运行 `npm test`；独立审阅接口与隐私边界，提交小commit。

交付：唯一可验证schema、真实失败样本、无生产数据变动的分支。风险：模板迁移导致过宽兼容；不兼容旧候选则重生成/重审，不静默转换APPROVE。回滚：撤销本PR，旧产品不受影响。

## P2 六组内容直显与学习循环兼容（依赖P1与Owner预览接受，1个实施PR）

**Files:** 新增 `src/entry-view.mjs`、`src/content-bundle.mjs`、`tests/entry-view.test.mjs`、`tests/content-bundle.test.mjs`、`tests/browser/entry-view.test.mjs`；改 `src/app.mjs`、`src/lexical.mjs`、`src/lexical-ui.mjs`、`public/styles.css`、`scripts/build.mjs`；使用 `src/analysis.mjs`，复用 copy/speech/storage/model，不替换FSRS。

**Interfaces:** `renderEntry({card,entries,analysis,mode:'lookup'|'front'|'revealed'}) → HTMLElement`；front不挂载词义和简析DOM，lookup/revealed共享词典和正文。组件不调用grade/store；父页面显式绑定copy、speech、grade。`contentRevision`是展示会话保护，不是修改历史事件schema的许可。

新增 `loadContentBundle(manifestUrl) → {releaseId,vocabulary,analysis,catalog,revisions,retiredIds}`；manifest和hash文件名规则见合同。lexical查询接收已验证bundle内catalog，不再静态import另版词典。app以active words调用原queue；有event但内容不可用者只显示历史占位，绝不清事件。

- [ ] 写失败测试：6组×3状态，单次reveal全部已选sense/源例句/5段可读；无二次details；E缺证据提示；未知entry保留缺口；XSS文本被转义。
- [ ] `node --test tests/entry-view.test.mjs` 应先FAIL，再实现共享渲染器与页面内详情；原词库列表可折叠以节省浏览，但进入详情后基础内容不得再次折叠。
- [ ] 接入当前背诵循环，保持三档反馈/撤销60秒；查词返回同卡同状态；复制、播放、切换例句不能评分。保留原声音许可与异步旧响应保护。
- [ ] 添加内容版本变化、双标签冲突、剪贴板失败回退、长句320px及键盘焦点回归。旧卡无analysis时清楚标待审，不阻塞原学习。
- [ ] 验证混版、404、hash错、迟到响应均不替换完整bundle；grade前已知更新需重新揭晓，断网固定旧bundle提示；撤回卡不入queue、事件可导入导出、历史占位不泄漏旧正文。
- [ ] `npm test`、`npm run build`、`npm run test:browser` 全通过；真实本地浏览器核对390/1440截图和键盘。iOS/Safari实机未测必须报告NOT_VERIFIED，不能以Chromium代替。
- [ ] 真实记录只在用户授权后备份验证；默认用脱敏fixture克隆库，grade→undo→export→import事件不变、收藏单独往返；提交候选与Owner验收表。

交付：非main真实功能分支及6组兼容证据；不是本轮HTML原型。风险：长词典稀释记忆重点，解决为顶部短义+分区直接正文、合理滚动，不隐藏基本义；虚拟化后置。回滚：撤销UI/content commit，保留IndexedDB，无旧库版本升级。

## P3 手工一批5–10项的持续内容闭环（依赖P1；首个预览需要P2，1个实施PR+后续内容PR）

**Files:** 新增 `scripts/build-reviewed-batch.mjs`、`content/reviewed/<batchId>.json`、`content/manifests/<batchId>.json`、`tests/reviewed-batch.test.mjs`、`tests/fixtures/baseline-card-ids.json`；更新 `tests/content.test.mjs`、构建读取入口。旧 `update-vocabulary.mjs` 保留原入口，不在无授权情况下切换原日更。

**Interfaces:** `buildReviewedBatch({baseVocabulary,baseAnalysis,manifest,approvedProjection,receipt}) → {vocabulary,analysis,coverage,contentManifest}`；approvedProjection完整PublishedCard合同见CONTRACT-DECISIONS，含add/revise/analysis-only/withdraw操作；只消费明确manifest列出的已审投影；相同manifest重复运行字节一致，不读取任何其他日期文件。CLI先写临时目录、验证后一次产出完整候选，出错不覆盖旧文件；Git提交保证整批版本一致。build生成hash命名资源及同版content-manifest。

- [ ] 失败测试：未选输入、源ID复用、相同拼写不同语境、旧ID缺失、receipt字节变化、两次执行新增重复、模板APPROVE、私有URL、源例句伪装原创均拒绝。
- [ ] 运行 `node --test tests/reviewed-batch.test.mjs` 确认FAIL；实现纯构建与命令行 `node scripts/build-reviewed-batch.mjs --manifest <public-manifest> --out <staging-dir>`。
- [ ] 把固定1875总数测试改为基线集合完整保留 + 本次批准新ID集合精确增加；原gloss/双例句质量断言保留，合法标记例句来源。不能把旧基线校验简单删掉。
- [ ] 按 UPDATE-RUNBOOK 做一个真实手工批次：先仅5项，独立Reviewer逐条核对；E不作为已核工程术语混入首批。身份冲突不扩大扫描、不绕过旧校验。
- [ ] 验证完整构建可由公共repo内容重现、无私有依赖；内容PR给出新增/修订/隔离数及三种覆盖率、逐条diff、回退commit。分支预览验收后再申请G2。

交付：一次实际可重复但尚未生产的内容更新。风险：旧自动publisher仍可能产生未审输入；保持输入隔离，禁止新脚本自动接管。回滚：丢弃未合并候选；已发布内容采用合同/P5的“兼容壳内容回退”或“旧版整版回退”两路径，分别报告退役提示能力；两者都不删学习事件。

## P4 成熟功能按小PR逐项推进（每项需Owner选择；不绑成一次大版本）

|次序/交付|文件与接口建议|QA与风险|回滚|
|---|---|---|---|
|P4a词条记忆历史/预测|`src/history-view.mjs`，消费现有events/cardState，只读|预测与同一FSRS engine的grade结果一致；undo明确；不暴露他人数据|撤销UI，事件不变|
|P4b统一搜索/本地搜索历史|`src/search.mjs`/search-view，search({query,catalog,cards})返回带kind稳定ID|同形词不同POS、中文、空查询、无结果、返回原卡；历史可清除且不发送|移除新偏好键，不清学习库|
|P4c词书/加入/暂停/恢复|`src/collections.mjs`独立本地偏好存储，集合仅引用cardId|收藏不自动入队；暂停可恢复；换书不丢历史/到期卡；备份新增清单需版本协议|停用新功能，保留偏好与历史备份|
|P4d提前练习/每日目标/模式|app+model已有接口先复用，practice只读不重排|提前练习不产生grade；日界Asia/Taipei；新方向若改变记忆单位另作设计|撤销入口，不重算历史|
|P4e自编词/偏好/活动时间|先私有本地草稿；公开提交仍P3审核；前台活动计时|私有草稿不进公共Git；后台时间不计；偏好不能默认隐藏全部已审义|隔离新存储；兼容导出后停用|

上述是独立可实施的范围包，选定某包后补该包精确状态/接口测试再写代码，不授权执行全部；完整双向学习、自编私密词跨设备同步等需要另一个设计。音频许可、无障碍与包大小性能随P2/P3处理，不能等全部P4才测试。

## P5 每次发布验收（依赖对应分支完成+独立G2）

- [ ] freeze候选commit、生产base SHA、source/receipt/manifest hashes；复核Notion与任务配置未触碰。
- [ ] `npm test`/build/browser、内容反例、独立语义审核全合格；报告新增内容体积，gzip app初始预算≤250KiB、每批新增JSON≤500KiB，超预算分包或另审，不能直接压低质量。移动慢网性能作为测量结果记录，不能假定静态=快。
- [ ] Owner检查真实功能分支手机/桌面6组、保留记录和双备份，明确授权release；Owner未授权则STOP，不合并。
- [ ] 授权后merge精确commit；核对Pages workflow成功、artifact/source SHA对应，公开网址返回新内容版本；直接lookup与学习揭晓、刷新与深链接、旧状态仍在。自动化验证只用隔离浏览器，不给用户真卡评分。
- [ ] 故障先阻止新合并；内容回退优先保留兼容壳并更新retiredIds、隐藏错误正文；整版revert回旧cfa2ecc则明确旧UI暂不显示新卡退役提示但事件仍在。两条回退路径都验证Pages版本、队列不含撤回新卡、全部事件与收藏备份可读。紧急隐私暴露停止扩散并联系Owner，不承诺Git历史删除即消除缓存。

交付：真正发布后的版本/运行链接及验收记录，未完成这些不得称“已发布”。本轮禁止执行P5。

## 分工、时间与终点

总控负责基线、范围、依赖和发布证据；Selector只交授权选词；Writer产生源锚与五段正文；独立Reviewer逐项核源/语义/隐私；Builder只消费已审公开投影；QA测真实页面与不丢数据；Owner决定设计、实施和发布。初期同一实现者可兼Selector/Builder/QA操作，但Writer与内容Reviewer必须隔离。无需搭建常驻Agent平台。

粗估工程工作量（非交付承诺）：P1 1–2天，P2 2–4天，P3 1–3天；每个P4包1–3天，复杂自编/模式另估；独立内容审阅与Owner等待单列。先完成5–10项人工闭环，测真实每项生成/审阅耗时与退修率再定频率，不承诺每天全自动。当前终点 **READY_FOR_OWNER_REVIEW**；Notion历史整理 **PAUSED_UNTIL_OWNER_REACTIVATES**。
