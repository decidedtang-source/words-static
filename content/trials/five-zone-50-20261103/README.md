# V3.1 五区来源整理：50条试产

本批使用已正式登记的 V3.1 模板与工作流，供 Owner 检查规模化后的讲解效果。**未替换正式词库、未发布 Pages，也未改动学习记录、Notion 或定时任务。**

## 查看

- [50条预览](preview.html)：下载后用浏览器打开，或在本地静态服务器中查看；GitHub文件页不是执行页面。
- [结构化批次与逐项审核状态](batch.json)
- [固定选择和原卡片](selection.json)
- [执行范围与计划](PLAN.md)
- [自动结构检查](evidence/validation.json) · [300格浏览器检查](evidence/browser.json)
- 独立审阅：[第1组](review-1.md)、[第2组](review-2.md)、[第3组](review-3.md)。回执 JSON 与正文、来源 hash 配对。
- 研究记录：[第1组](research-1.md)、[第2组](research-2.md)、[第3组](research-3.md)。

## 内容与来源

50条均来自既有公开词库，保留原cardId和公开教学例句，不新增学习身份。范围为项目概念、沟通表达及短语动词，选择规则可复现；不是随机样本，也不代表全库质量已验证。

每条有当前义、直接解释、本句提示和完整五区。词典提供当前义和搭配依据，项目/沟通/语法教学材料提供解释方法，具体工作情境与回应为明确标注的教学补写。独立Reviewer检查事实、自然程度、来源范围、信息效率和实际可用性。

大部分商业词典直接访问受限，所用证据的实际状态逐条记录；检索片段不冒充全文。显示的中英文释义是原创教学转述，不是OEWN数据或商业词典原文；本批只纳入核实的当前义，不假装拥有完整词典或完整词源。来源链接在五区段末。

模板的CSS和布局未重设计。前方原释义位置、A直接释义→B本句先记→C更多词典义项、后方01—05均保留。为避免错误归属，仅将样机硬编码的“OEWN”来源说明换成本批转述说明。没有有据词源时保留按钮位置并禁用，不补造历史。

## 状态与验收边界

本批是独立试产数据格式 `five-zone-trial/1`，**productionImportAllowed=false**。它不是已兼容生产schemas的active batch，未复用或伪造旧生产回执。网页复制仍继承冻结样机行为，未声称生产级双复制通过；原词库IPA沿用且未做本批读音专项核验。真实产品学习/查词、FSRS、导入导出及设备验收仍属后续集成任务。

独立评分是编辑审核，不是实证学习效果。Owner仍需看讲解是否容易记住、是否自然、是否值得保留。内容修订必须改变hash并重新核对回执，不能沿用旧批准。

试产回执的 `contentHash` 由原始 `part-*.json` 中该条记录移除sources后，以保留字段顺序的JSON.stringify UTF-8计算SHA-256；`sourceEvidenceHash` 则对其sources数组同样计算。batch.json另加的展示状态和回执不在前一个hash范围中。验证器从原记录重算，而非相信batch内的状态。字段重排也会触发重新核对；这些回执不是生产内容schema回执或身份认证。

## 复现

在仓库根目录执行：

```text
node content/trials/five-zone-50-20261103/validate-build.mjs
node content/trials/five-zone-50-20261103/check-preview.mjs
```

浏览器使用已有Playwright Chromium；如环境有特定可执行路径，可通过 `PLAYWRIGHT_CHROMIUM_EXECUTABLE` 指定。不安装新定时器或新增日更生成器。

## 失败与回滚

缺源/错误内容标REVISE或QUARANTINE，不进入生产。恢复上一试产预览即可回退展示；当前生产版本与学习事件不受影响。后续若要进入正式词库，先适配来源与内容schema、独立回执和现有构建链，进行真实应用回归，取得Owner发布授权后才进入main。
