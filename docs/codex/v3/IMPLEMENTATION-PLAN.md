# Words Static UI-V3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: use superpowers:executing-plans for task-by-task implementation. Preserve one independent whole-branch code review and a separate content reviewer. Do not restart the accepted UI design.

**Goal:** 将已冻结V3接入真实词汇学习系统，准确显示语境义项，安全展开其他义项，并保留全部学习数据。

**Architecture:** 沿用静态GitHub Pages、hash bundle和浏览器FSRS。增加经过独立审核的presentation数据与纯解析器；共享渲染接入现有app/lexical UI，不以预览HTML替换生产程序。

**Tech Stack:** 现有Node 24、JavaScript ESM、esbuild、ts-fsrs 6.0.0、IndexedDB、node:test、Playwright；不新增服务端或付费API。

**Spec:** [PRODUCT](PRODUCT.md)、[CONTENT-V2](CONTENT-V2.md)、[冻结V3](../../design/words-ui-v3/README.md)。状态：计划可执行，Task 1–6均未执行。

## Global Constraints

- 生产main当前cfa2ecc；候选注册ba404074；执行时fetch并记录最新base/tree，不覆盖他人变更。PR5叠加PR4规划分支，最终main集成须另审完整diff。
- 不变更FSRS参数、事件schema、稳定cardId、IndexedDB版本、双备份协议、声音同意、公共网址。
- Notion只选词；任务/云盘/历史迁移不触碰；E继续隔离。
- 设计已接受，不重复G0；执行Task1–5是分支实施，Task6仅明确G2后。冻结预览只读。

## Review Focus

1. 同形异义/POS、组合词与句子关键词不能误绑定；Task1负例覆盖。
2. v1→v2审核不能靠改版本号继承；Task1与Task4版本混用/回执负例覆盖。
3. 当前卡撤回/更新与两处复制、展开状态、迟到请求竞争；Task3覆盖。
4. 横屏短高度、200%缩放、屏幕阅读器、剪贴板失败时固定栏不能遮盖；Task3/5覆盖。
5. 混合批次回退、已产生新事件后回退，资料移除不能导致事件丢失；Task4/5覆盖。

### Task 1: 可验证的语境义项与版本化合同

依赖：执行授权。交付：纯解析器、v2 schema与v1兼容验证。预估1–2工程日。

Files: 新建src/presentation.mjs、schemas/analysis-v2.schema.json、schemas/reviewed-batch-v2.schema.json、schemas/content-review-v2.schema.json、tests/presentation.test.mjs、tests/reviewed-content-v2.test.mjs；修改scripts/validate-reviewed-content.mjs；旧v1 schema不改。
Interfaces: resolvePresentation见CONTENT-V2；validateReviewedContent原签名不变，按projection/receipt/rulesVersion三元组选择schema。

- [ ] 写失败测试：B绑定暂定基础义、A绑定班次义；跨POS错误sense、缺ref、重复ref、超范围、未知字段、空中文、v1回执套v2均拒绝；legacy返回待核且不选第一义。
- [ ] 运行node --test tests/presentation.test.mjs tests/reviewed-content-v2.test.mjs，确认真实RED。
- [ ] 最小实现schema分发和纯解析；独立语义审核仍不可被程序取代。
- [ ] 同一测试GREEN；npm test验证v1候选原有回执和原卡完整性不退化。提交独立commit。
回滚：撤销新增接口/调用，旧v1流程继续；没有生产数据迁移。

### Task 2: V3共享阅读组件

依赖Task1。交付：真实renderEntry/entryMarkup三种模式。预估1–2日。

Files: 修改src/entry-view.mjs、public/styles.css、tests/entry-view.test.mjs；冻结docs/design不可改。
Interfaces: 保留entryMarkup/renderEntry输入；增加可选presentation解析结果，未传时安全legacy。不让组件调用grade/store/network。顶部与底部copy只提供独立挂载点。

- [ ] 失败测试固定DOM顺序：短义→focused senses→本句理解→details→五组解析；front不挂载答案和深析payload；details初始关闭且只一层；展开全部已选义项。
- [ ] node --test tests/entry-view.test.mjs确认RED。
- [ ] 实现横向逐行及窄屏顺序、语义details/summary、唯一锚点/标题/可访问名称；通用词典无context不冒充当前义项。
- [ ] 同命令GREEN及npm test；保存独立组件截图作对比，不把截图当学习流程验收。提交。
回滚：只撤销渲染/CSS，源字段与学习记录保留。

### Task 3: 学习流程、双复制与响应式状态

依赖Task2。交付：真实app中的V3而非独立HTML。预估1–2日。

Files: 修改src/app.mjs、src/lexical-ui.mjs、src/copy.mjs（仅必要的双挂载/可访问反馈适配）、tests/browser/entry-view.test.mjs、lexical.test.mjs、mobile-actions.test.mjs；新增tests/browser/v3-layout.test.mjs。
Interfaces: 两处mountCopy复用相同payload及isCurrent guard；视图状态键为cardId+renderHash，内存保存expanded/scroll/revealed，不写FSRS。刷新/revision变更清旧状态。

- [ ] RED：上/下按钮复制完全一致；Clipboard拒绝在正确位置提供手工复制；离开页面/撤回后旧响应不得显示或评分。
- [ ] RED：展开→查词→返回同卡恢复；nextCard关闭；内容更新重新揭晓；相同revision但renderHash变更同样阻断评分；两标签冲突保留现有拒绝逻辑。
- [ ] npm run build后运行node --test tests/browser/v3-layout.test.mjs，确认失败。
- [ ] 接入共享渲染、顶部sticky工具栏与既有底部grade dock，保证触控44px及焦点/锚点可见；不新增重复ID。
- [ ] 同组GREEN，npm test/build/test:browser。提交。
回滚：回到上一UI commit；保留IndexedDB，不通过清库“修复”。

### Task 4: 五项真实内容升级与持续批次

依赖Task1，验收需Task3。交付：新v2 analysis-only批次和独立回执。预估内容生成/审阅0.5–1.5日，源缺口另计。

Files: 修改scripts/build-reviewed-batch.mjs、scripts/content-bundle.mjs（仅若hash路径需要）、tests/reviewed-batch.test.mjs、tests/content.test.mjs；新增content/reviewed/v3-goldens.json、manifests/v3-goldens.json、reviews/v3-goldens.json、sources/v3-goldens.json；最后才更新active-batches.json。
Interfaces: 现有buildReviewedBatch/loadReviewedRelease输出不变；新增coverage.contextSenseBound计数，旧dictionary/analysis/copy含义不可暗改。

- [ ] RED：v1→v2混合链重复运行字节一致；analysis-only保留1878卡及每个旧card字段；presentation变化改变renderHash；坏绑定/自审/假回执拒绝且不覆盖staging。
- [ ] node --test tests/reviewed-batch.test.mjs确认RED，再实现最小兼容。
- [ ] Writer按五卡真实上下文填写presentation，A班次、B组合、C名词framing、D整短语、F条件句；不改旧v1文件、不引入E。
- [ ] 独立Reviewer用源快照逐项审查短义、sense绑定、本句提示和原十阶段关系；每次修改重算哈希并复核受影响内容。不要请求Owner代替日常语义核验。
- [ ] 实际CLI --manifest content/manifests/v3-goldens.json --out local-evidence/v3-batch运行两次；核对与完整链结果相同、无重复卡；npm test/build。
- [ ] 保存批次报告及独立回执，明确contextSenseBound=5/1878，不推称全历史已审核。提交。
回滚：移除未发布v2 active引用即可恢复旧链；发布后按OPERATIONS兼容壳策略处理，不能删学习事件。

### Task 5: 整体验收与分支交付

依赖Task1–4。交付：固定候选commit、QA矩阵、审查修复及Owner实机验收单。预估0.5–1日加Owner等待。

Files: 新增.github/workflows/pr-quality.yml；修改tests/browser/site.mjs及既有browser测试的浏览器路径选择；tests/browser/v3-layout.test.mjs、docs/codex/v3/实施证据（执行时新建），更新IMPLEMENTATION-STATUS；不覆盖冻结设计截图。

- [ ] 按PRODUCTION-AUDIT实施无发布权限的PR QA，并验证Linux Playwright路径解析；核对required checks设置，未验证不可声称强制门禁。保持既有Pages发布流程与所有定时任务不变。
- [ ] 按QA全矩阵运行npm test、npm run build、npm run test:browser；保留真实退出码与失败证据，不沿用旧30/9宣称完成。
- [ ] 五张已审卡×六视口×front/revealed/lookup，另E隔离降级、通用查词、legacy、缺失/撤回；截图比较信息层级而非仅像素相似。
- [ ] 检查固定栏、键盘、200%缩放、3倍CPU/慢网可重复profile，记录首内容可见和交互耗时；app gzip≤250KiB、单批JSON≤500KiB。
- [ ] 一次独立整分支代码审查；重要问题复现RED→修复→GREEN及相关全套回归。内容与代码审查职责分开。
- [ ] Owner在可用真实设备验收；无设备明确NOT_VERIFIED，不以Chromium代替Safari。出具可点击分支/预览、真实差距及release候选SHA。
- [ ] 停在READY_FOR_OWNER_REVIEW，已接受的设计不重问，只验收真实实现与决定是否发布。
回滚：候选不合并，现网不受影响。

### Task 6: GitHub Pages发布与回读（G2后）

依赖Task5和明确发布授权。交付：原公网URL真实新版本与运行证据。

- [ ] fetch main/PR4/PR5，检查新变更与叠加依赖；准备整合后的精确候选，解决冲突后重新测试，不把合入规划分支当发布。
- [ ] 固定候选commit、生产base、内容releaseId、source/receipt哈希。对实际将合入main的diff做授权范围核对。
- [ ] 明确G2后合入main，等待现有Pages workflow；不调整定时任务或另外搭服务器。
- [ ] 核对Actions artifact/source SHA、公网manifest和hash assets、入口与深链接、展开/复制/学习可用。仅隔离测试账户/浏览器评分。
- [ ] 失败按OPERATIONS回退并验证历史/收藏可读；记录LIVE_VERIFIED或具体失败，不把CI成功当公网已生效。
