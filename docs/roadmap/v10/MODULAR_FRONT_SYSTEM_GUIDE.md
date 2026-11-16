# 前部模块系统 · 流程与本地入口

版本：front-system-1.0.0。一个主仓，各模块独立目录、生产入口、合同、产物与版本。七步pending_build，完整词典interface_only。本版流程固定后才运行50词，不部署网页。

## 本地入口

- Git公共目录：`D:/aaaaaa/personal project/words-static/.git`。
- 本次唯一开发入口：`D:/aaaaaa/personal project/words-v10-plan-correction-20261116`，分支`feat/front-system-trial-20261116`。
- 旧R2稿：`content/enrichment/v10/runs/r2-50-20261116`，只读输入。
- 新数据与编辑稿：`content/module-inputs/front-50-20261116`。
- 新输出：`content/module-runs/<独立批次>`，不覆盖已有目录。
- 模块目录：`word-page/modules/<id>`；登记：`word-page/system.registry.json`。
- 七步后续线程：`systems/seven-step/THREAD_START.md`。

旧main工作区及其他worktree保留；不移动含绝对路径审计证据的旧目录。`words-static`中的未跟踪`docs/superpowers/`不属于本次修改。新输出引用仓库相对路径；原R2加载器将原绝对地址映射到同批次的entries路径，并核对原稿哈希。

## 模块边界

每个目录的`production.json`声明输入、依赖和字段归属，`produce.mjs`只生成自己的字段，`PRODUCTION.md`说明流程，`TASKS.md`列本模块任务。新视图用`view-front.html`，旧view.html、旧发布锁和原QA V1.1锁不动。词头发音继续使用原音波按钮，状态文字只提供无障碍提示，不占页面空间。

生产顺序与显示顺序分开：先生产依赖，再按原页面的顶部来源→词头→导航→词典→常用义→普通历史→场景→Bridge→七步占位拼接。

固定来源缓存自动选字段、校验身份并转换；中文整理、场景词义和Bridge是独立版本化编辑稿。当前试产不是无人值守模型生成，也没有新建完整词典爬虫。学习区使用已有成熟来源义项缓存，现有原创教学例句明确标记；不冒称来自剑桥。词义与例句的来源身份分别保存。

## 历史语用：词与表达分开管理

依用户最新决定：单词词史独立存为`history-library.json`的unit，词组／句式经`history-relations.json`引用组成词；明确固定搭配同时保留整体词史的独立位置。`whole`和`components`可同时有值，互不覆盖。

例如verification method与validation method共享method资料，但分别引用verification和validation；trade-off和sign-off有自己的整体条目。not necessarily保留固定表达身份，目前引用necessarily的历史。组成词资料不冒充整个表达的起源证明。

每个unit包括ID、版本、中文整理、原URL、提取覆盖范围、获取时间、原快照与提取文本哈希。每条词卡引用unit ID和版本，脚本解析为展示卡。Bridge另存如何接到当前用法的教学联系，不把普通词史搬进Bridge。

Etymonline直连当前遇403，保存失败状态；本批使用网页工具快照导入再统一解析。搜索取得的原站片段也明确记录，不假称直接HTTP成功。解析器只取目标条目，不带入关联词和广告。原全文快照仅放忽略的local-evidence/front-sources；Git记录中文整理、来源回执和哈希。

尚未取得整个表达的词史时保留not_acquired；实际失败为fetch_failed，两者均不同于no_entry。按组成词范围交付时可完成该范围的流程，不宣称整体词史已完成。handover当前整体获取失败，按hand组成词提供资料。

## 执行命令

在本开发工作区执行：

```powershell
# 来源快照已按web*.txt存入本地缓存；准备来源索引和模块输入
node scripts/modules/prepare-inputs.mjs content/enrichment/v10/runs/r2-50-20261116 content/module-inputs/front-50-20261116 local-evidence/front-sources
# 不生产页面，仅核对输入、模块和来源快照哈希
node scripts/modules/cli.mjs check content/enrichment/v10/runs/r2-50-20261116 content/module-inputs/front-50-20261116/edits.json
# 确认流程锁后，以新目录生产；存在的目录会被拒绝
node scripts/modules/freeze.mjs verify
node scripts/modules/cli.mjs build content/enrichment/v10/runs/r2-50-20261116 content/module-inputs/front-50-20261116/edits.json content/module-runs/front-50-20261116
# 单独生产普通词史（只运行目标模块及其必要上游，不运行其他模块）
node scripts/modules/produce-one.mjs history content/enrichment/v10/runs/r2-50-20261116 content/module-inputs/front-50-20261116/edits.json content/module-runs/history-only-20261116
```

从已有输入重复组装无须再次联网或生成内容。同一输入产生相同模块记录和哈希；来源重新取得时生成新来源版本，不改旧冻结回执。修改某模块的produce.mjs或production.json后升该模块版本；依赖它的产物按依赖哈希重建。七步没有生产器实现，仅有范围占位输出。

## 检查与完成口径

检查词条／语境ID、原句、字段归属、来源与依赖哈希、模块顺序、折叠、导航、320／390／768／1440宽度和无JavaScript初始正文。每个模块单独保存records.json；整页保存assembly.lock.json、report.json和试读HTML。

`frontProductionComplete`仅表示本次前部范围流程与页面检查完成；`fullSystemComplete`始终false，七步待搭建。词组的整体词史状态在relations和模块provenance另列。内容质量不打自动分，预览与通过不等于用户接受，不自动发布。

当前冻结方案的源文件清单见`config/module-system/front-v1.lock.json`。旧QA V1.1继续验证自身锁；前部范围检查独立登记，不删除旧七步内容量规则。
