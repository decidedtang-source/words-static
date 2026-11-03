# 五区内容工作流 v2

本实现是Agent辅助流水线：检索与教学写作由Agent使用浏览工具执行，独立Reviewer负责语义判断；CLI负责完整性、分区门禁、失效检测、断点恢复、评分报告及冻结模板封包。没有后台模型API或定时任务，不宣称CLI能自动理解网页或独立判定教学质量。

输入 `entries.json`：保留原cardId/context；sources记录实际可见证据；claims区分source_fact/teaching_inference/authored_example；五区引用claims并填写anchor/explanation/example/boundary，具体含义按QUALITY-REASSESSMENT中每区教学要求解释，不在学习页面额外展示。dictionaryEntries保留已核验不同义项；focusedEntries指定前方当前义与适用拆词义。

独立输入 `reviews.json`：每条cardId、reviewer、ruleVersion=five-zone/2、fingerprint、front{decision,reason}、hardGates、每个claim的sourceChecks[{claimId,verdict,note}]、zones[{id,scores,reasons,requirementsVerdict,issues}]。scores/reasons四键：accuracy/completion/readability/increment；scores为0—4整数，issues为{message,blocking}。逐区>=75且每项>=3，不得被总分抵消。评审需检查要求是否真的体现在正文里，而非相信requirements标签。

`fingerprint(entry)`按对象键排序后计算SHA-256，绑定全部正文、来源、前区与教学任务；更改任何字段须重审。reviewer字符串仅为可追溯署名，不是身份认证。独立性由执行记录保证，不能靠换名字绕过。

从仓库根目录运行：

```text
node --test tests/five-zone-workflow.test.mjs
node scripts/five-zone-workflow/run.mjs content/trials/five-zone-calibration-20261103 --limit=2
node scripts/five-zone-workflow/run.mjs content/trials/five-zone-calibration-20261103
node scripts/five-zone-workflow/run.mjs content/trials/five-zone-calibration-20261103 --validate-only
node scripts/five-zone-workflow/run.mjs content/trials/five-zone-calibration-20261103 --build
```

每条处理后原子保存state；重跑按规则/内容/回执hash复用。history保存状态转换。先修缺口再封包；缺来源为EVIDENCE_GAP，缺审核为REVIEW，低分/失效回执为REVISE。只有全批CANDIDATE才构建。单条失败不丢其他条状态；相同证据缺口两轮后由Agent标记具体阻塞，禁止无限重试或编造。

交付 `report.json`、`SCORES.md`、独立 `scores.html` 与 `preview.html`。评分页不侵入冻结学习版式。来源归属文字使用既有试产修正，CSS、DOM结构与行为不改。复制按钮仍为冻结原型能力，真实应用集成/FSRS验收/发布不属于此工具。
