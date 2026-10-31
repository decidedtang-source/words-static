# GitHub 正式基线上的递进词汇增量

基线见 CURRENT_OFFICIAL_BASELINE.md：7741f24；当前正式产品是 GitHub Pages，不迁移到本机服务。本增量实现原计划的首批词典/详情/收藏/双复制闭环，不能代表1875条词汇或Notion历史已全部语义审核。

## 交付范围

- 原1875卡、词表字节、学习数据库名/version/schema、事件/FSRS/导入导出保持。21词头、28词性/同形条目、40义项有OEWN英文证据和中文教学摘要；11种表达提供组合/语境桥，其中10种命中现有卡，take into account可独立查询。最终实际命中数以测试报告为准。
- 先记中文义，按需查组成词与词典证据，再理解语境与辨析，最后通过双复制进入既有ChatGPT项目。七阶段保留；不预生成1875篇分析。
- 其余卡保留原教学内容并标明尚未完成新一轮词典锚定。小包查询不声称整部词典、常用频率或所有音标已核。
- 收藏在独立IndexedDB words-static-lexical-v1存储；词典entry与card分别命名，不生成评分。学习备份格式保持原样，收藏单独导入/导出并说明；自动跨设备同步仍待实现。
- Github Actions部署及原URL验收后才写RELEASE_VERIFIED。任何内容审阅发现须修复，不因测试通过而称语义正确。

## 实施步骤与验证

1. 冻结正式基线；隔离feature/progressive-lexical，保护原工作树未跟踪规划。基线8 Node/2 browser通过。
2. 先写lexical测试并观察缺模块失败，固定许可源的40义项，新增中文摘要及11个组合说明。source hash检查后离线导出JSON，不读取用户学习数据。
3. 验证copy精确保留目标、public上下文标签、拒绝权限回退；词典/词卡收藏分离且重复幂等，备份未知字段/重复ID拒绝。
4. 浏览器先观察词典按钮不存在而失败，再集成静态页面；原卡揭晓后访问，返回原卡不重播/评分，浏览器返回关闭详情，查询与收藏不改变原state。320px搜索label溢出经DOM定位修复。
5. 一次独立全分支与内容审查；重要问题集中修复并回归，不以作者自评替代内容审阅。Node/browser/build/audit及public数据不变验证。
6. 发布到当前words-static，等待Pages成功，公网回读构建与词表；记录未做的真机/Owner学习UAT与内容覆盖，不将其计PASS。

## Review Focus

- 词性/同形/中文摘要是否忠于所选英文sense；working/framing/account等不能过度推广。
- 异步复制、导入或视图离开期间旧结果不能污染新视图；词典书签不能重新绑定另一homograph。
- IndexedDB写入失败、旧备份、重复导入、多标签并发不能损失原学习state。
- Github子路径资源、外链编码、第三方内容转义、公开数据许可/隐私边界。
- 320px操作、dialog返回、浏览器历史/前进后退、刷新详情、焦点及学习卡揭晓轮次。

## 裁决与代价

- 从现有静态站做增量，复用候选的copy纯模块和公开词典证据，不搬Node/SQLite接口；代价是服务端测试不能复用为网页验收。
- 新收藏使用独立IndexedDB，避免扩写学习schema；代价是当前需要分别导出学习记录与收藏，UI明确提示，后续统一备份/同步另作兼容设计。
- 保留原4个手机导航位，查词替换统计主导航，统计仍从今日明确进入；代价是统计多一步。
- 本次发布精校小包并给旧内容明确状态，不自动批量翻译整个OEWN；代价是未覆盖词仍需既有资料/官方外链，全历史审阅仍待办。

## 来源与回滚

Open English Wordnet 2025；由Princeton WordNet衍生。原许可随public/licenses发布：CC BY 4.0及Princeton通知。source definition未改写；选取40个义项，加入中文教学摘要及独立语境说明，中文不是官方中文词典原文。锁定snapshot及sha在dictionary/catalog.json；所有例句原来源标签保留。

回滚可恢复7741f24的静态资源，学习schema未变；新收藏库保留，旧客户端不读取它，不可删除。无服务器、无API密钥、无Notion写入、无原日更变更。不能把这个网页增量发布当作Notion全历史迁移或同步功能完成。
`n审查修订：三条有证据的组合卡在揭晓背面直接显示必要组成词中文义（working definition、working hypothesis、outcome framing）；其余仍按明确覆盖状态展示。详见 progressive-review-closeout.md。
