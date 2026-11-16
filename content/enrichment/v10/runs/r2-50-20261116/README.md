# R2 50词试生产执行记录

当前结果：50成稿、50独立完整包审核、0未解决阻塞、0用户接受、0正式发布。入口为 `candidate-all/index.html`；审阅报告、文字稿、48项QA记录均在同目录。冻结方案的“待审/暂停”文字是批准前快照，当前授权见authorization.json。

## 真实执行顺序

1. 用户明确“好的，按照方案生产50词”，登记v10-plan-r2-20261116-01；保全V9、1875 ID/15批和96基准文件。
2. 必要合同/来源/状态/投影实现及红绿测试；独立实现审核提出的门禁和恢复问题修复。
3. 24校准按5条子批制作；独立审阅修订，21条r1与3条r2通过；calibration-gate.json精确绑定内容状态和D/E。
4. 仅校准门通过后制作26扩展。独立r0审核2通过、24因结构化限定缺失修订；24条r1复审通过。未更换任何选中ID。
5. 只读已审包构建50词；200四宽度检查、50原句/预览/导航检查、48主题/发音生命周期/返回检查；五张截图实际查看。37单元及3浏览器回归通过。
6. 完整模块/脚本/来源/稿件/审阅/许可锁及QA绑定封包。校准和最终证据分别保留，未将用户方案批准冒称候选接受。

## 数据入口

- selected.json：冻结50 ID、24/26分组和原句快照。
- entries/：不可变input/bundle修订；reviews/：独立审阅历史。
- manifest.json：逐条当前状态；phase/calibrationPassed为初始化阶段字段，最终整批结论以final-candidate.json为准，不从初始化字段推断现在仍未校准。
- journal/：原始状态转换和恢复审计；禁止覆盖旧稿、复用过期审核。
- calibration-gate.json / calibration-lock.json：扩展前的24条门。
- final-candidate.json：最终50条内容/D/E锁和accepted=false/published=false。
- candidate-all/candidate-lock.json：本次HTML及完整依赖；sources.html/许可证为材料说明。
- qa/：测试日志、48项QA处置、需求追踪、视觉检查、独立实现审核问题闭环。

## 可重复的离线步骤（既有50已完成，不要重建run或重复写稿）

```powershell
node scripts/word-content/build-reviewed.mjs content/enrichment/v10/runs/r2-50-20261116 all
node scripts/word-content/check-final-design.mjs content/enrichment/v10/runs/r2-50-20261116
node scripts/word-content/finalize-reviewed.mjs content/enrichment/v10/runs/r2-50-20261116
node scripts/write-r2-trial-review.mjs
```

构建只读当前已审内容，不调用模型或网络。浏览器路径可用CHROMIUM_PATH指定。正式源、脚本或QA证据变更会使锁失效，须另建修订封包；final-candidate不可覆盖为不同内容。重复浏览器检查产生的新截图/QA字节可能改变证据SHA，不能据此覆盖既有最终回执。

本机原始审计使用Windows绝对路径及字节哈希；异机查看HTML无需此环境，执行恢复需先显式重定位证据路径并记录迁移，不能假称任意机器开箱恢复。普通词典不完整、45音标待核、46词史缺口、真机/音质/学习者未测均详列，不藏入笼统通过率。成本无法归属时为null。未调用新增付费API，未动Podcast/日更/学习库。
