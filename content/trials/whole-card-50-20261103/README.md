# 原50词：整页分区QA重跑

范围：原50词、原cardId和主语境；冻结学习页面结构/样式，按whole-card/1重新生产并独立审核。正式GitHub Pages、学习记录、FSRS、Notion及定时任务不变。

- [完整页面](preview.html)
- [50词×13模块评分总览与逐项理由](scores.html) / [Markdown报告](SCORES.md)
- [整页机器报告](whole-card-report.json) / [后五区子报告](report.json)
- [全链路验收](evidence/acceptance.json) / [六视口及功能测试](evidence/browser.json)
- [选词与原卡身份](selection.json) / [实施计划](PLAN.md)
- [完整结构化内容](entries.json) / [词源、音标、搭配与例句](whole-card-supplement.json)
- [五区独立回执](reviews.json) / [整页独立回执](whole-card-reviews.json)
- [来源与研究](research.md) / [审阅记录](REVIEW.md)

生成与审核分开；引用事实、现代联想和自编示例分开。音标采用明示的宽式体系，短语不伪装有整短语录音或历史首见证明。更多义项为0表示已核查但没有更多已核验相关义项，不用重复当前义填充。历史词源不等于全部现代义都能从古义机械推出。

评分为编辑判断，不是学习效果百分比。每词13模块独立门禁：词头、当前义/拆词、直接讲解、词源/演变、本句先记、更多义项、后方01—05、学习例句、复制负载。每模块>=75且四维各>=3/4，不以平均分掩盖缺项。评分页与学习页分开，学习版式不改；仅词条计数字样按实际50显示。

从仓库根目录复跑：

```text
node content/trials/whole-card-50-20261103/assemble.mjs
node scripts/five-zone-workflow/verify.mjs content/trials/whole-card-50-20261103
```

必须先有独立回执才能封包；修改任一正文/来源/补充字段后旧hash失效。单一verify命令清除旧验收，再依次校验、构建与浏览器检查，成功后生成当前产物hash回执。正式发布仍需另行授权，候选页面不读写真实学习数据。

回滚：撤销本次候选提交或回看旧50词试产/5词校准目录；不迁移或清空学习记录。复制验收限定冻结原型既定负载（词条／【深析】词条）及模拟拒绝降级，不代表生产应用所有深析功能已完成。
