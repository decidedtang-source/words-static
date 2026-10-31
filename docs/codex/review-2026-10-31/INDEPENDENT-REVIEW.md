# PR #4 独立审阅 — 2026-10-31

状态：REVIEWED_DESIGN_ONLY。审阅依据：PR #4 `9858886dafecbab22d55c980d160a54bd6a98a06`，正式 main `cfa2ecc19fddf2fac7508c642f8580b1b5a85838`，Issue #2/#3 的最新范围。旧冻结点 `7741f24` 是历史回滚参照，不是当前 main。本文不是软件完成证明。

## 结论

方向合理：GitHub Pages 是当前正式产品；词典、记忆与深入语境分析应连续呈现；Notion 仅选词。PR #4 把学习目标、来源边界和独立审核说清楚了，但还不是可直接执行的机器合同。应先补齐真实预览和最小数据接口，再实施，不需要先建设本地服务器、全词典平台或全自动多 Agent 系统。

推荐保留当前 JS/静态 JSON/TS-FSRS 架构，新增独立词条渲染模块和按学习卡定位的简析旁文件；手工选词、单批候选、独立审核、内容 PR、独立发布许可。曾考虑：A 原弹窗上加更多字段（无法满足一次直显）；B 迁移服务端全量平台（引入账号、运维和数据迁移，本期不需要）；C 当前静态站渐进改造（推荐，保留 URL 和浏览器历史）。

## 发现与修正建议

|级别|证据与问题|影响|建议及验收|
|---|---|---|---|
|P0 产品差距|`src/app.mjs:18` context/examples 为 details，`src/lexical-ui.mjs:6,15` 英文依据再次折叠且详情在 dialog|一次揭晓仍不足，旧 explanation 也不等于全流程简析|独立详情渲染器，lookup/revealed 共用；基础正文无 details/modal；front 不挂载答案；见 P2|
|P0 数据身份|`src/lexical.mjs:6` bridge 仅按 term；`scripts/update-vocabulary.mjs` 跨所有日期扫输入并拒绝重复 ID；START-HERE 已记录 10/30 冲突|同形词不同语境会误用简析；一批坏数据会阻断全部增量|简析按 cardId+contentRevision，私有 selectionKey 不公开；允许清单构建，碰撞隔离，禁止静默重编号；见 P1/P3|
|P0 审核可信度|CONTENT-CONTRACT 使用 PRESENT/NEEDS_SOURCE，QA 使用 PASS/NEEDS_EVIDENCE；模板混用大小写键，candidateHash 未定字节规则|无法写唯一验证器；Writer 可伪造 APPROVE 字段|候选状态和 Reviewer verdict 分开，固定十个 stage key；字节哈希绑定来源/规则/显示文本；审阅来源必须由受信合并流程核验；见 CONTRACT-DECISIONS|
|P0 私密发布边界|UPDATE-WORKFLOW 私有选词源与公开 CI 的依赖未落到实际可重现输入|可能把私人链接/原文或低熵输入哈希上传；CI 无法复现也可能假绿|私有提案留本机；公开仅许可内容、无来源标识的公开投影及投影哈希；安全审核先于 Git 上传，截图同样受审|
|P1 金样事实错误|GOLDEN-CASES D 原称整条 take into account 待证；`dictionary/catalog.json` 已有 `take_into_account%2:31:00::`|会误把有据内容降级或重新造词典来源|修正 D，预览保留确切条目；不要用 account 的银行义代替整条义|
|P1 完整性表述|21词头/40义项是选义包；“full”可能误读为完整源词典，音标/词形并非每项有据|用户以为全部常见义已齐，事实上缺覆盖|展示完整选义清单+范围缺口；新增源义逐义审阅。不能以少/中/全部默认藏义项；暂缓复杂密度设置|
|P1 工程与语法证据|E 工程 seating 无当前领域证据；F whether 不在 OEWN 快照|词典基础不能证明技术基准或整句含义|E 保留教学预览，工程术语卡隔离；F 明示项目语法分析。未核音标不从模型补写|
|P1 字段重复|candidate 同时维护 stages 长文本和 displayGroups 文本|后台审核的是一套、页面展示另一套|只存一份公开正文；stageEvidence 指向正文 groupId 和词典证据；对完整投影做哈希|
|P1 兼容性|`tests/content.test.mjs:2` 固定总数1875；`enrich-vocabulary.mjs` 首例必须与输入相同|新批会失败；“原例”可能被误标真实原句|保留基线1875 ID集合测试，另测批准清单增量。保留真实 example.kind；清洗形成新公开投影，不能改标签绕隐私检查|
|P1 发布门|pages.yml 只有 npm test/build；proposed PR workflow 尚未启用，validate-reviewed-content 不存在|规划 gate 易被当成当前已生效保护|先独立实现并反例验证 gate，再提交工作流 PR；受保护分支/权限实际检查另列发布准入，不能凭 YAML 声称强制|
|P1 回滚与状态|FSRS 记录和收藏分处不同 IndexedDB；进度按卡ID，未绑定内容版本|单一备份不能保证全恢复；换义仍沿用旧记忆历史不合理|两份备份分别往返；语义重大变化创建经批准新卡映射，老卡历史保留；部署回退只回退代码内容，绝不清库|
|P2 复杂度|一次建设自动选词、多个生成者、频率排序、全量多义库和云同步|阻塞最迫切的中文基础义与简析体验|先人工一批5–10项、单 Writer+独立 Reviewer；可重复后再决定调度。同步单独决策，不作本期依赖|

## 保留而不重写

`src/model.mjs` TS-FSRS 6.0.0：retention .9、fuzz false、learning/relearning 1m/10m，Asia/Taipei 日界；事件重放、版本冲突校验与撤销不改语义。`src/storage.mjs` 的 IndexedDB 事务、跨标签通知继续使用；`src/bookmarks.mjs` 独立收藏库保留。双复制的精确目标与 generated_example 标签复用 `src/copy.mjs`。本轮既不访问真实学习库，也不执行 importer。

## 未验证与限制

墨墨登录态真实操作、当前账号设置及“少/中/全部”具体 UI 未验证；官方 Web 日志只证实存在相关能力，不足以证明交互细节。[功能矩阵](MAIMEMO-WEB-GAPS.md) 分开记录。网页共享 URL 不等于学习记录自动同步，当前仍为本地记录与手工导入导出。预览截图和结构检查不代表 Owner 阅读验收、正式 UI 回归或生产内容放行。

审阅覆盖 AGENTS、START-HERE、四份核心合同、六组金样、四个 Agent prompts、三份报告模板、JSON 示例与 proposed workflow；实际代码覆盖 app/lexical/copy/model/storage/bookmarks、更新/补充/构建脚本及现有测试。下一步按 [实施计划](IMPLEMENTATION-PLAN.md) 的 Owner 节点推进。
