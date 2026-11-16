# 前部模块自动资料流水线 V2

范围：完整词典 M04 使用原生产器、原资料和原视图，不扩建；七步 M09 保持待搭建。页面区域顺序保持 V1。脚本收集与组装，AI做义项匹配、中文翻译及场景衔接。

## 模块与接口

|模块|脚本职责|AI职责|版本|
|---|---|---|---|
|词头 M01|按词形、词性选择词典音标，缓存对应音频，优先音频播放，失败用系统语音|不编音标|2.0.0|
|来源预览 M02|引用场景原句、来源和折叠状态|解释原句，保留引文身份|1.0.0|
|导航 M03|依据固定锚点拼接按钮、跳转、回顶部|无|1.0.0|
|完整词典 M04|复用原模块|本轮不改|1.0.0|
|学习义项 M05|保留原定义，读取WordNet与Cambridge例句候选；只接入选定原英文|选择符合义项的用例并译为中文；缺合适来源保留标注的原创补充|2.0.0|
|普通历史 M06|验证55个共享Etymonline缓存单元，按词／组成词／固定表达关系接入|沿用已绑定来源的中文摘要；新来源与旧摘要分离|1.0.0|
|场景 M07|有URL则抓原页面并定位原句；无URL保持教学材料|给适度概括的场景词义与句子解释|1.0.0|
|Bridge M08|独立引用学习义项、词史和场景，保持折叠历史入口|现代语义衔接＋可折叠历史衔接，不把普通词史搬进Bridge|1.0.0|
|七步 M09|只保留区域与接口|待另线程搭建|1.0.0|

主注册表：`word-page/system.registry.v2.json`。M01/M05独立`production-v2.json`和`produce-v2.mjs`，其余使用原合同。组装检查字段归属和依赖哈希；改一个模块不必改其他模块文件。

## 生产命令

在产品仓根目录，用Node 24与仓内Playwright依赖执行。浏览器默认本机Chromium 1234，可用`CHROMIUM_PATH`覆盖。WordNet快照目录可用`WORDS_OEWN_SNAPSHOT`设置；缺少完整SQLite时使用仓内已有选用快照。

```powershell
node scripts/modules/automation/collect.mjs content/enrichment/v10/runs/r2-50-20261116 local-evidence/automation-v2
node scripts/modules/automation/tasks.mjs prepare content/enrichment/v10/runs/r2-50-20261116 local-evidence/automation-v2
# AI读取ai-tasks.json并写ai-replies.json后，继续：
node scripts/modules/automation/tasks.mjs import content/enrichment/v10/runs/r2-50-20261116 local-evidence/automation-v2 content/module-inputs/front-auto-50-20261116
node --test tests/module-automation.test.mjs
# 新版本首次冻结；已有锁不得覆盖，修改应升版：
node scripts/modules/automation/freeze.mjs create
# 同步GitHub产品仓与上下文仓之后，正式组装：
node scripts/modules/automation/build.mjs content/enrichment/v10/runs/r2-50-20261116 content/module-runs/front-auto-50-20261116
```

缓存默认复用；采集命令加`--refresh`才重新请求页面。失败保留原缓存原时间，另记尝试。缺失资料只影响相应来源，不删除词条。此版固定50词输入沿用当前词库；增加批次须提供相同bundle合同及词史／编辑关系，再建立独立输入版本。

AI回传结构为数组，每项`entryId`、`inputHash`、`selections:[{senseId,candidateId,zh,reason}]`，可选`editorial:{scenario:{meaning,sentenceExplanation},bridge:{modern,history}}`。英文由候选ID取回，不允许AI替换；省略editorial表示保留原编辑稿，并明确记为retained_existing，不能声称本轮重新生成。任务包含普通历史来源文本与场景来源供整理参考。

当前AI由助手读取任务包执行；没有配置无人值守模型API。收集、解析、缓存、导入、组装和结构检查均为脚本，AI任务回传是显式步骤。导入重算整个任务包，防止旧回传接到更新后的资料。

## 缓存、来源和词史

完整页面、候选集、任务包留在忽略的`local-evidence/automation-v2`；仓库只提交选用例句、译文、出处与模块产物。音频嵌入单文件页面，双击即可读与播放；保留音频源URL，设备实际声音效果需本人试听。

Etymonline使用已有工具快照，校验原始hash及抽取文本hash。本机HTTP直连仍可能403；不得改写获取时间或称为重新抓取。`--refresh`成功解析后进入`refresh_available`，新文本放入AI任务的`historySources.refreshPending`，旧摘要继续引用旧收据。**本版没有自动发布刷新词史摘要的接口**；需要用既有共享词史库的编辑与收据流程建立新版本，再重建任务。此限制避免将新来源误挂旧摘要，不影响已有55单元接入。

短语/句式可以引用多个单词历史；明确固定搭配同时保留整词槽位。组件历史不能伪装成整句历史。当前无外部URL的50条场景仍是原词库教学句，不伪称Krugman或其他作者原文。

## 冻结与检查

V1锁不改。V2锁固定新增脚本、模块文件、接口、指南和50词输入，同时验证V1依赖。修改后新建版本锁与输出目录；不覆盖旧试读。正式构建在读取锁后运行，原词典输出逐词对比，模块哈希重放一致，浏览器检查原句、例句、折叠、锚点、四种宽度、播放高度与无JS初始正文。

基础完整性：每个原有义项必须保留定义与一条例句及中文，场景意义和Bridge现代／历史说明非空；七步待搭建不生成空泛占位分析。QA不评判观点、不缩减篇幅，不替代内容编辑。报告分别列出来源例句、原创补充、音标、音频覆盖，不将脚本成功解释为资料全部补齐。
