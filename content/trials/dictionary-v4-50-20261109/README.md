# 词典学习系统 V4 候选

**CANDIDATE / NOT_DEPLOYED**。原50词全部保留，另附working definition、shift两个补充示范；它们不属于原50，未替换旧词或学习ID。

- [完整预览](preview.html)（下载本目录后可直接用浏览器打开）
- [六个代表词完整前后对照](COMPARISON.html)
- [新版词典／Bridge／五区结构与写作规则](STRUCTURE.md)
- [审计、实施计划和边界](PLAN.md)
- [逐词教学质量记录](QUALITY.md) / [可读评分页](scores.html) / [绑定全文指纹的52条独立回执](reviews.json)
- [六词初审](six-review-initial.md) → [六词修订复核](six-review-final.md)
- [其余46词初审](rest-review-initial.md) → [最终内容复核](rest-review-final.md)
- [独立技术审查及修复记录](CODE-REVIEW.md)
- [原稿数据](before.json) / [候选数据](cards.json)
- [来源与许可](SOURCE-NOTICE.html)

## 实际基线与范围

PR #6仍OPEN，head `trial/five-zone-50-20261103` = `44b16396415e8e1a92132efec767a633b5e28f7d`；base为`feature/words-static-p1-p3`。远端main为`cfa2ecc19fddf2fac7508c642f8580b1b5a85838`。新候选基于PR #6，保留`docs/design/dictionary-learner-50-20261105`及全部历史试产不变。

候选为既有50词预览链路的后继，不把它伪装成已接入生产词库的新应用。复习算法、学习数据、IndexedDB、原有日更与发布工作流均未改。页面不保存评分；既有应用的学习/复习流程独立做兼容回归。正式接入与真实设备UAT仍是后续阶段，不合并main。

## 三个问题的结论

**词典能否独立承担任务？** 在本批词的主要常用义范围内可独立查阅，核心释义默认显示，词性、用法和原创双语例句可查，当前义明确标记。原125组学习义项保留、原185条许可来源文本可展开；补充示范另有13组释义。它仍不是完整成熟词典产品：常用度排序是编辑判断，部分次要义合列，两个组成词示范不声称收尽所有义项，没有全量发音音频或学习者实测。

**Bridge是否解释联系？** align从位置/方向协调接到目标行动协调；ownership从归属接到主动负责；work around从绕行接到障碍仍在时换路径。shift明确轮替只是现代记忆联系，历史证据另列C。objective、deadline等不强推另一义或编造词源，处理理由逐条记录。

**五区是否有独立价值？** align的03区分agree/coordinate；reservation的04不再把顾虑误判为已暂停承诺；scope的04澄清范围、05表达范围排除和新增任务协商。B改为具体场景/应用边界，C保留有据历史，移出重复现代联系。初审真实拦下六词中的5词、其余46中的18词，修订后各项达到4分，不代表学习效果已实测。

## 验证方法

从仓库根运行：

```text
node --test tests/dictionary-v4.test.mjs
node scripts/five-zone-workflow/build-v4.mjs --six
node scripts/five-zone-workflow/build-v4.mjs
node scripts/five-zone-workflow/report-v4.mjs
node scripts/five-zone-workflow/check-v4.mjs
npm test
npm run build
npm run test:browser
```

本机浏览器命令使用`PLAYWRIGHT_CHROMIUM_EXECUTABLE`（预览检查）与`CHROMIUM_PATH`（原应用测试）指向已安装Edge；默认Playwright缓存与锁定版本不匹配，首次启动失败并已记录。内容回执只消费、不自动生成；正文变化后需重新独立审核，构建拒绝旧指纹。`author-*.mjs`及`revise-*.mjs`记录写作过程，不是日更任务，也不能产生审核批准。

## 保留问题

- Chromium/Edge视口模拟不等于iOS Safari或实体手机验收；剪贴板成功与拒绝为受控模拟。
- 词典未声称收录所有词典全集；shift移除/售出、sequence科学用法等还可细分，若调整须重新审查。
- 个别透明Bridge仍带“无需强推词源”的教学边界提示，可在下一轮真实试读后压缩；部分01/02搭配复现是允许的强化，不等于零重复。
- 新增来源与旧来源检查范围在独立报告中分开列出；未重新抓取50词所有网页。无法直接取得的网页不冒充全文核验。
- 没有真实学习者迁移实验；下一步应拿未见过的新句做理解测试，再决定是否进入正式应用整合。候选QA通过不等于Owner验收或发布许可。

## 本轮验证结果

89项单元测试、15项现有应用浏览器测试、312项候选视口检查通过；实际构建成功但未发布。桌面1440×900与手机390×844长页截图已人工查看。详见[evidence/acceptance.json](evidence/acceptance.json)、[浏览器记录](evidence/browser.json)、[测试原始日志](evidence/tests.json)。视口包括320px窄屏；原185条来源文本逐页核对保留。

本机后台预览服务启动被自动审批策略拒绝（仅返回blocked by policy）；没有启动服务或替换发布方式。请直接打开preview.html，或下载候选目录后打开；所有本地来源链接已随目录封包。
