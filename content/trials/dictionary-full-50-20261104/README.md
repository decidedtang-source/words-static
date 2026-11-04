# 50词：词典义项完整收录纠正

Owner 2026-11-04授权；候选，不发布。新规范 [FULL-DICTIONARY-QA](../../../docs/codex/v3/five-zone-v3.1/FULL-DICTIONARY-QA.md)。

- [完整页面](preview.html)：保留前区、词源与后五区，原位置展开“词典义项”。
- [13模块评分](scores.html)：词典模块重新独立审核，其余12模块核对原hash后保留。
- [源范围、署名与许可](SOURCE-NOTICE.html)：48词OEWN 2025全部178义，Wiktionary三条目7义，共185义。不是牛津或剑桥全文。
- [独立审阅](REVIEW.md)、[逐词回执](dictionary-reviews.json)、[验收](evidence/acceptance.json)。
- [完整数据](dictionary.json)、[英文源快照](source-snapshot.json)、[Wiktionary快照](wiktionary-snapshot.json)、[中文译释](translations.json)。

旧“更多已选义项”混淆了当前义教学摘要与词典资料。新模块保留源义项，不因当前义前面已显示而删减；同形词/多词性完整保留。源原文与项目中文译释分开，原例句、用法框架、领域标签和美式拼写标记均展示。WordNet同义词集例句可能不用本词，已显式标记。

源范围的完整性不代表覆盖所有常见用法，也不把来源质量问题静默改成“词典原文”。walk through的逐步讲解义由完整Wiktionary条目补充；没有把组成词拼起来冒充短语词典义。源未提供的例句不杜撰。

本次仅词典折叠体内增加实际字段呈现与标题纠正；CSS、布局位置、前区当前义、直接讲解、本句、词源、五区、学习例句和复制控件不变。旧目录保留。main/Pages、FSRS、学习记录、Notion及定时任务均不动。

复现：先将固定归档解压到local-evidence/dictionary-full/source，再执行scripts/five-zone-workflow/extract-full-dictionary.mjs；随后执行本目录assemble.mjs，必须取得独立回执后才能运行scripts/five-zone-workflow/verify-full-dictionary.mjs。任何词典/源快照修改都使回执失效。不要用旧50词assemble覆盖新版。
