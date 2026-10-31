# 建议冻结的接口与边界（待 Owner 接受）

此文解决原模板歧义，不表示已实现 validator。原 JSON 示例仍为示例，未来实施应一次更新 schema、示例、Writer/Reviewer prompts，禁止并存两个矛盾契约。

## 内容与学习状态分离

既有 `public/vocabulary.json` schema/IDs、IndexedDB v1、FSRS event schema 均保留。新增公开 `public/analysis.json`：`{schema:1, entries:{[cardId]: AnalysisEntry}}`。`AnalysisEntry` 固定字段：`cardId, contentRevision, targetText, context:{text,kind}, memoryGloss, dictionaryEntryIds, displayGroups:[{id,title,text}], stageEvidence, coverage, copyPayload`。例句 kind 仅 `original_sentence|generated_example`，original_sentence 需要私有来源证明及公开许可；公共数据不含私有证明。中文、词形与项目语法不能假装源词典事实。

`stageEvidence` 固定键依次为 `dictionary,memory,semanticConnection,syntax,concept,contrast,languageGame,englishNeighbors,pragmaticAction,workplaceUse`；值为 `{refs:[string], applicability:'APPLICABLE'|'NOT_APPLICABLE', reason?:string}`。refs 指向当前对象的 dictionaryEntryIds / displayGroups 的稳定ID，不再复制另一份分析正文。每条显示4–5段是目标，不是硬字数配额；不得为凑字数删掉必要区别或缺证据说明。

词典 `catalog.json` 仍分 source、entry、sense；每个显示版本冻结 entryId/senseId 清单及源 snapshot/hash。**完整显示＝所声明选义范围内全部合法且已审内容直接呈现**，不等于整个OEWN或全部常见义。新增音标字段必须带来源/方言，未知为null。词形可由项目审核但须单列归因，不能标词源。coverage 至少含 dictionaryStatus、analysisStatus、copyStatus；三者分别按“卡ID的覆盖数/本版总卡数”报告，另报去重词头/词性条目/义项数，不混分母。

## 候选、审核与公共构建

新增词卡的公开输入不是只有 AnalysisEntry。`ReviewedBatchProjection = {schema:1,batchId,baseContentHash,cards:[PublishedCard],analysis:[AnalysisEntry],dictionaryEntries:[...],licenses:[...]}`，全部一起绑定reviewedProjectionHash。`PublishedCard`白名单沿用旧词卡：`id,date,term,ipa,pos,meaning,chunk,example,level,gloss,explanation,examples:[{en,zh}],editorialNote?`；新增 `exampleKinds:[original_sentence|generated_example]` 与 examples 等长，`example === examples[0].en`、`explanation === meaning`、gloss≤40、至少两条不同双语例句；ipa未知用空字符串兼容旧结构，前端显示待核。各字段不得携带私人来源。新卡date为批准批次学习日期，非私有采集时间；level未知为`unspecified`，非擅自推断CEFR；pos/chunk可以为空，但term/meaning/example必须非空。本预览仅是页面内容，不是符合此生产卡合同的候选（例如并未给每组凑两条双语生产例句）。

`baseContentHash`绑定当前 vocabulary.json 实际字节；P3输出仍保留 schema:1/contentVersion:2、全部旧卡原字段，并重算 batches 的日期计数与公开批次投影hash。旧batch sha不改写；同日期补充不能覆盖旧batch证据，manifest另记增量条目。未知字段拒绝，不经 legacy enrich 的私有全目录扫描；由新builder验证同等内容质量。只有已有卡内容微调才允许 analysis 单独追加，manifest须明确 operation=`add|revise|analysis-only|withdraw`；add需要完整PublishedCard。

私有 SelectionPacket：`selectionKey, selectedAt, selectedBy, sourceRef, targetText, context, shareClass, sourceBatchId, sourceEntryId, existingCardId?`。selectionKey 使用随机不透明值，原始 sourceRef 与低熵私有文本哈希不进入公开 Git。只接受用户已选项，首批人工输入；本轮不建 Notion connector。

公开投影允许清单是上述 ReviewedBatchProjection（包含PublishedCard、AnalysisEntry、已审词典更新、许可文件），不得递归 spread 私有对象。投影先脱敏/获许可，再在本机安全审阅；禁止把私有素材先提交公开 PR 再删。生成教学例句是新内容，不能把真实未授权原句换个 kind 字段后公开。

候选生命周期：`DRAFT → IN_REVIEW → REVIEWED → READY_FOR_OWNER_REVIEW → RELEASE_AUTHORIZED → PUBLISHED`；异常状态 `REVISE|QUARANTINED|BLOCKED`。Reviewer receipt 整体 verdict：`APPROVE|REVISE|QUARANTINE|BLOCK`；阶段 verdict：`PASS|NOT_APPLICABLE_WITH_REASON|NEEDS_EVIDENCE|FAIL`。`PRESENT` 只表结构存在，不是审核PASS。除合法N/A外，任何 NEEDS_EVIDENCE/FAIL 不得生产放行；可审阅缺口预览另用 PREVIEW_APPROVE_WITH_EXPLICIT_GAPS，不进入生产receipt枚举。

哈希规则：producer输出 UTF-8无BOM、LF、2空格缩进、末尾一个LF 的候选JSON；receipt绑定**文件实际字节 SHA-256**，不做对象重排后偷换哈希。验证器拒绝同内容不同字节与旧receipt，不需要引入跨语言 canonical JSON。公开manifest按路径字典序列出 `{path,sha256,bytes}`，另绑定 sourceSnapshotHash、rulesVersion、baseContentHash、reviewedProjectionHash；receipt不进入被自己哈希的candidate。独立Reviewer重新算字节哈希并核对源。任何显示文案修改或选义变化重审；纯版式改动重做视觉QA，不能借版式改动改内容。

哈希只能防串版，不能证明审阅独立或正确。可信证据由受信维护者核对独立审阅上下文/工具记录与 GitHub review，再批准合并；公共receipt只存公开投影hash、规则版本、Reviewer审阅标识与结论。恶意PR自写APPROVE不能绕过。初期不引入自建PKI或承诺“机器签名等于语义真”。若分支保护尚未实际配置，报告“流程门，非平台强制门”，发布时由Owner把关，不悄悄扩权限。

## 身份、增量与降级

运行时版本权威为新 `public/content-manifest.json`：`{schema:1,releaseId,assets:{vocabulary:{path,sha256},analysis:{path,sha256},catalog:{path,sha256}},revisions:{[cardId]:contentRevision},retiredIds:[]}`。releaseId为构建内容清单hash，非需自引用的Git commit。词典在P2从编译时常量迁为同一内容包载入，学习组件不自行拼混版本。加载器 `loadContentBundle(manifestUrl)` 取manifest后加载带hash文件名的三个资源并校验；全部成功才原子替换内存bundle，任何404/hash错保持上次完整bundle并显示失败，不使用半新数据。冷启动无可用包则显示可重试错误，不清库；已有 legacy 用户state照常读取。暂不加持久离线缓存。

当前学习轮记录 bundle.releaseId/cardId/contentRevision。回到前台及每次grade前，用cache:no-store读取小manifest；网络不可用时只允许对已载入并揭晓的固定bundle学习并明确显示版本，不宣称最新；获知新版本时先加载完整包，若当前cardRevision变更则取消当前揭晓状态、要求重新查看后再评分。grade事件保留原schema，跨内容保护由app层负责；不把contentRevision塞进旧event replay。请求序号保证迟到网络响应不能覆盖新选择。仅发布后仍长期开着旧版 app 的标签页无法获得新规则；P5需提示刷新，不能声称从未实现的旧代码也具有新门禁。

`contentRevision` 为正整数，首次manifest内所有旧卡（包括无analysis者）从1开始；Builder按每卡公开显示投影字节hash对比上版，target、例句、短义、简析、所引词典义项/POS/词形/来源说明等任何显示内容变化均+1；共享catalog改动使引用它的每张卡递增。纯CSS版式不递增，但需视觉QA。manifest额外保存`renderHashes:{[cardId]:sha256}`供构建比对，不含私有内容；AnalysisEntry的revision必须等于manifest。若当前卡在新manifest被retired或移除，立即取消待评分并显示撤回提示，即使revision未变也不得继续；可保留已发生事件。

现有1875 ID集合保持；相同拼写不等于同一卡。私有 `selectionKey → sourceBatchId/sourceEntryId → publicCardId` 显式映射。不同内容撞旧ID必隔离；仅拼写相同但语境不同，可建独立候选，Owner/维护者审定后给新ID；绝不自动把10/30改成10/29或覆盖旧卡。

仅文字纠错可同ID递增contentRevision；改变召回目标/词义或语境导致记忆任务改变时，提出新卡和旧卡保留方案，不移植旧学习状态。当前学习轮锁定contentRevision；若内容在轮中更新，提示重新查看当前版本后再评分（不改FSRS算法）。无简析的旧卡仍显示旧教学说明并明确“全流程待审”，不可把旧文本伪装成新方法完成。

整条工程表达缺证据时，E 可作为 **Owner教学预览**，只开放有据的组成词内容；工程术语学习卡保持QUARANTINED，直至可许可、适用的图纸/标准/技术来源与领域Reviewer补齐。普通句法与项目语法可以用经审自有解释，但不得写假OEWN锚。用户确认设计不自动补足这些证据。

撤回定义：不向旧vocabulary数组塞缺字段的假卡。`retiredIds`来自manifest；app在调用现有queue之前过滤这些ID，历史页将有event但不在active vocabulary中的ID显示为“此词卡已撤回/当前内容不可用”，仅显示ID与原事件、不恢复错误或敏感正文。学习记录export/import继续包含全部事件，收藏仍可显示旧标签并提示内容不可用。这项最小退役处理属于P2/P3兼容门，不等于P4用户主动暂停功能。

两种回退：①保留新版兼容壳的**内容修复发布**，撤回批次并保留retiredIds，验收上述提示与队列排除；②紧急**整版回到旧cfa2ecc**，旧app不识别retiredIds，但其queue仅使用旧vocabulary，所以新ID不会继续排队，事件仍存留并可导出，旧UI不能保证显示撤回提示。Owner收到此降级说明后，待修复壳发布恢复完整历史提示。不能承诺简单git revert同时具备尚未实现的新提示。
