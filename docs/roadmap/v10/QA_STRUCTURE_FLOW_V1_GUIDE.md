# 新QA入口：结构、流程与基础内容量 V1.1

QA检查结构、数据传递、资料步骤、页面交互、版本一致性，以及用户新增的基础内容量要求。不对内容做语义评分，不要求独立语义审阅证书，不自动删改正文。篇幅初值和计数规则见[内容量要求](QA_CONTENT_AMOUNT_V1_1.md)。

## 使用

```powershell
npm run qa:verify
npm run qa:check -- content/enrichment/v10/runs/r2-50-20261116
npm run qa:page -- content/enrichment/v10/runs/r2-50-20261116 content/enrichment/v10/runs/r2-50-20261116/candidate-all/index.html
npm run qa:preview -- content/enrichment/v10/runs/r2-50-20261116 local-evidence/qa-preview-new
```

- check：检查固定结构与流程记录；不联网、不生成内容、不要求旧reviewed状态。
- page：对实际HTML核对词条、九模块顺序、折叠/导航及四种宽度。发音只模拟控件状态，不评价音质。
- preview：在全新目录渲染已有稿件并附QA报告；资料任务未齐可以预览，但productionComplete仍为false。不得覆盖旧目录或词库/模板。
- verify：核对冻结的方案、规则、入口、脚本、依赖和测试是否变化。

新版默认入口由`config/qa/current.json`和以上npm命令确定。旧`scripts/word-content/build-reviewed.mjs`等为R2历史复现入口，不用于新QA；新路由不调用其语义审核门。原数据和旧记录不转换、不补造审核或获取记录。

## 怎么看结果

| 字段 | 含义 |
| --- | --- |
| structurePass | 结构可读取、引用与身份对应、输入/稿件未损坏 |
| flowComplete | 约定的资料步骤有实际执行和产物记录 |
| previewReady | 结构和实际页面检查通过，适合打开试读 |
| contentAmountPass | 七步正文达到预设最低量，至少2条双语表达；不是语义评分 |
| productionComplete | 结构/流程/基础内容量/本次页面检查全部完成；不代表教学质量获认可 |
| contentQuality | 固定为not_scored，QA不评内容分数 |
| accepted/published | 本工具不执行用户验收或发布，始终false |

命令退出码1表示结构/页面/文件读取错误；资料待补不让写作和预览退出失败。自动化若要判断流程是否全部完成，读取`productionComplete`，不能把退出码0当成整批完成。

## 资料获取接口

run目录可提供`acquisition.json`：`{"records":[...]}`。每个词的history模块只保存一个当前回执，历史版本另存。缺回执报告`unrecorded`，不会推断没有尝试，也不从现有摘要倒填成功。

回执字段：entryId、module（history）、sourceId、status、url、fetchedAt、artifactPath、artifactSHA；失败可附error，无匹配条目必须附reason。

状态：not_attempted、fetch_failed、parse_failed、ready、no_entry。ready/no_entry须有实际文件与SHA-256；路径相对于run目录。保存的解析结果JSON含entryId、sourceId、url、text。ready还要确认同一来源已传入history.summary/sourceRefs。no_entry作为可见例外计数，不生成词史替代内容。

这是给后续固定Etymonline抓取适配器使用的流程接口，不是抓取器本身。完整词典排除在新增获取任务之外，仅保持现有数据接口可读取。

## 修复与冻结

单词缺字段修该字段；抓取失败修该步骤；页面故障修组件。没有自动语义复审轮次，没有“为了通过QA而压缩正文”的规则。

冻结文件为`config/qa/freezes/structure-flow-v1.1.json`。文本SHA按UTF-8/LF核对，避免Windows换行转换造成假失效。已有冻结文件不能覆盖；代码或规则变更应发布新的QA修订版本，保留旧文件。

本版不会自动执行抓取、重写50词或发布网页。内容本身的完善在内容生产工作中处理。
