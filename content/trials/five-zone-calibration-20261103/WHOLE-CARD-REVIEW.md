# 整页独立审核：后五区之外的八个模块

2026-11-03；Reviewer：five_final_review；Writer：five_content。当前范围为冻结样机整页内容及对应交互，不是生产发布许可。

## 先纠正审核范围

上一轮25区评分只覆盖后方01—05，不能代表整页完成。它明确排除了沿用IPA、常用搭配及额外例句，词源切换也因数据为空而禁用。这些排除在小范围试产记录中是真实的，但不足以满足Owner要求的整页分区QA。

本次在不更改旧五区正文及其回执的前提下，新增5份整页补充包及独立回执：每词审核headword、currentSense、directExplanation、etymology、context、additionalSenses、examples、copyPayload，共40模块、160维评分。加上旧25区、100维，整页共65模块、260维。旧五区加权分不是整页总分；不得把它放到“整页得分”标题下。

## 内容核查结果

全部八模块均逐项达候选门槛，但大量3分保留了实际限制。准确不等于最高教学完成度：例如短语IPA核实组成词而非整短语录音，更多义项提供选取的相关义而非完整词典，复制按冻结原型负载验收而非生产全文复制。回执的每项具体理由和扣分见whole-card-reviews.json与生成后的SCORES.md。

|词条|本轮整页发现与处理|保留建议|
|---|---|---|
|scope|核验英式/skəʊp/及不可数词性；历史与现代关联分开，机会义不重复前方范围义|当前中文用“包含/不包含”解释边界，略偏项目专用；培训例子在多个区出现|
|accountable|核验读音/for搭配及额外质量责任例句；古法语与受托财物说明的联系有据|中文“最终结果”比本句“最终决定”稍窄，后续可精简；词源现代段复现已有解释|
|proposal|核验IPA与本句可数性；propose+-al历史有据；求婚义与当前方案义分开|词源回到本句时再次提示review不等于approve，整页还有可减重复空间|
|work around|核验work/around组成词读音；作者将附加例句“克服”改为“绕开存储限制，让工作继续进行”，避免误示消除问题|只给work可考历史，不冒充整短语首见；文件例与05重复|
|weigh up|核验weigh/up音标；weigh古英语及14世纪思量义有据，不挪用为整短语年代|当前整体义与weigh组成义接近；例句收益风险与05有复现|

## 独立来源证据

- scope：[Etymonline](https://www.etymonline.com/word/scope)可见意大利语/拉丁语/希腊语联系及早期行动空间；[Oxford](https://www.oxfordlearnersdictionaries.com/definition/english/scope_1)的词头、两义和Word Origin另行核对。[APM](https://www.apm.org.uk/resources/what-is-project-management/what-is-scope-management/)支持项目用法。
- accountable：[Etymonline](https://www.etymonline.com/word/accountable)可见古法语acontable及关联account解释；[Oxford](https://www.oxfordlearnersdictionaries.com/definition/english/accountable)核对发音、词性、责任/解释义和to/for。
- proposal：[Etymonline](https://www.etymonline.com/word/proposal)支持propose与名词后缀；[Oxford](https://www.oxfordlearnersdictionaries.com/definition/english/proposal)核对读音、名词用法与常见搭配。正文未主张所有-al都是同类名词后缀。
- work around：[Etymonline work](https://www.etymonline.com/word/work)仅证明基础动词历史；[Oxford work](https://www.oxfordlearnersdictionaries.com/definition/english/work_1)、[around](https://www.oxfordlearnersdictionaries.com/definition/english/around_1)与[整体短语](https://www.oxfordlearnersdictionaries.com/definition/english/work-around)分别核对读音、现代语义联系与整体义。
- weigh up：[Etymonline weigh](https://www.etymonline.com/word/weigh)支持基础动词的历史；[Oxford weigh](https://www.oxfordlearnersdictionaries.com/definition/english/weigh)与[up](https://www.oxfordlearnersdictionaries.com/definition/english/up_1)核对读音、权衡结构及短语需查对应动词的说明。

本Reviewer重新检索词源并打开上述Oxford及APM关键材料，逐项核对补充包；不是仅相信Writer的来源标题。原词典意义与旧五区的来源审核保留在REVIEW.md。历史部分为中文转述，不复制词典全文。时间记录不被转写成单词诞生的唯一精确日期。

## 代码独立复查

整页门禁把entry、supplement和旧zoneReview共同绑定fingerprint，任一模块缺失/低于门槛、来源未独立检查、自审或回执失效均不能构建。审核中提出两项实现补充：supplement.writer必须非空；build证据必须含整页/回执/渲染数据hash，而不只旧entry hash。实现者已补齐，本Reviewer复看当前实现并独立运行33项相关单元测试，全通过。

verify.mjs会先清旧acceptance，再串行执行整页门禁封包与浏览器验证，成功才写新验收。浏览器目前明确测试词源切换往返、音标/POS/搭配、译文、额外义项/例句、四个复制按钮的成功及拒绝降级。实机OS/Safari、生产FSRS与正式站点不在这些模拟视口验证范围内；最终浏览器执行结果由本轮evidence/browser.json及acceptance.json记录，不能用代码审查代替实际运行。

复制模块PASS的精确含义：原文负载是词头term，深析负载是“【深析】”+term，沿用冻结样机。没有把这一结果当作生产系统“复制完整语境或全部讲解”的验收，也未改变用户版式。

状态：整页内容候选可进入本地试读；没有生产发布、Notion写入或自动扩量许可。
