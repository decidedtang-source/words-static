# 第1组独立整页审核

Reviewer：whole50_reviewer_group1；审核日期：2026-11-04。审核对象为另一作者提交的17词（scope至deadline），不是本人写作的第3组。

## 方法与证据

独立打开17个Etymonline主词条、17个Oxford主词条及objective形容词、deliverable形容词、allocation附加词条。词头英式IPA、词性、所选义、全部两条例句和翻译逐一对照。另读取APM scope management、scope/objectives、scheduling、resource management和delegation原页，区分资料事实、语境推断及自编对话。

scope的Cambridge原URL直接请求403，使用Cambridge搜索索引所显示的范围/机会义，并以Oxford原页交叉核实，不声称重新直读成功。accountable重新读取Cambridge Business Dictionary PDF第6页accountability/accountable段、American Heritage responsible近义辨析、VOA责任讲解；没有复用旧批准。dependency的Latin悬挂链路需追到dependent原页，已独立核验 https://www.etymonline.com/word/dependent 。

Etymonline记录特别核对：objective point与19世纪目标名词；deliver母词历史不等于deliverable项目名词首见；milestone实物路标义；deadline报业期限与旧禁越线仅可能关联；capacity早期同时有容纳和能力，不能编造固定先后演化。Oxford特别核对delegate动词/ˈdelɪɡeɪt/、ownership责任义、sequence有序系列与顺序两义、deadline没有适用额外现代义时保留0项。

## 初审结果

15词整页内容为CANDIDATE；priority及dependency需修订。初审回执保留在reviews-1-initial.json及whole-reviews-1-initial.json；完整初审输入保存于local-evidence/group1-review-initial-inputs.json，便于回查。

- priority：当前中文“事项或优先程度”与附加不可数优先地位重叠，增量评分2/4；应收窄当前复数priorities为优先事项，并同步focused/definition/claim。另requirements.boundary不能只填标点。
- dependency：历史段追溯更早拉丁语，但sourceId指向dependency主条目。内容本身有dependent支持，需补直接来源及定位或删更早链路，来源完成度2/4。
- 复用校准内容应清除与新整页补充包相冲突的“未新增词源/未核验IPA”等旧限制说明。

## 评分边界

五区与前区分别评分，共17×13=221模块。分数是编辑判断，不是实际学习成效测量。大多数完成度/增量为3，原因包括义项缺独立例句、前区与词源current_use重复、段内中英文术语负担；没有因为字段齐全自动满分。每区理由指向实际内容，例如baseline区分target、buffer双日复合修饰、capacity否定范围、accountable介词对象。

复制负载仅按冻结模板的term及【深析】+term验收文本约定；四按钮成功、拒绝降级及设备表现须另跑浏览器，内容评分不替代交互验证。未发布、未改main及生产词库。

## 实现审阅

已只读审查report-html.mjs、run.mjs、check-preview.mjs及本批assemble.mjs。发现run.mjs的completeness计数可与REVISE状态矛盾：接受区数未检查独立reviewer、blocking issue、合法zone id及整数分，证据数未排除重复回执。应按真实reviewEntry门禁逐项计数，不能把哈希当前和字段范围当作独立通过。此问题不绕过构建门禁，但影响QA报告可信度。评分表13模块、50词拼装身份检查、0额外义诚实说明及冻结版式规范化检查未发现其他实质阻断。

## 定稿复审

已复读修订：priority当前义/focused/claim收窄为优先事项，附加优先地位不再重复，g5边界有实际使用条件；dependency补etym-dependent并修正原条目证据范围；scope/accountable清除旧限制冲突。17词均获新的five-zone/2及whole-card/1哈希回执，内容状态17/17 CANDIDATE。初审回执仍保留2项阻断记录。CANDIDATE仅表示内容通过，浏览器交互和Owner验收另行完成。

实现复核关闭：reviewCoverage已调用实际reviewEntry门禁。独立运行正例得到5区/6claims；单区blocking或3.5非整数分得到4区；重复来源检查或Writer自审得到0区/0claims。run已改用该结果，报告计数问题关闭。教学requirements纯标点检查已补入结构门禁。未发现新阻断。
