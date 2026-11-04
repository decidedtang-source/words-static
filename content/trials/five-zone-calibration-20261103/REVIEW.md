# 独立分区与实现审核

Reviewer：five_final_review；Writer：five_content。2026-11-03。范围为5条静态阅读内容和本轮工作流实现，不批准生产发布。

## 审核方法

独立逐条读前区、25区正文、对应requirements与30个claims；用0—4锚点逐项给100个维度分，再由CLI计算区分和总分。3表示明确完成任务但可精简/具体化，4需要指出实际优势，未因内容无错自动打4。回执保存为reviews-initial.json及reviews.json，绑定最终entries完整fingerprint。首次正式分区评分全部满足候选门槛，不等于人类实测学习效果或所有措辞无需改进。

评分前发现scope的lexical claim漏连APM来源、proposal的contrast/use漏连教材来源；反馈Writer后修复。是证据映射修订，不是Reviewer自己改正文自审。原始50条评分不复用。

## 来源核查

- scope：[APM范围管理](https://www.apm.org.uk/resources/what-is-project-management/what-is-scope-management/)及[范围/目标对照](https://www.apm.org.uk/resources/find-a-resource/major-differences-between-project-scope-and-objectives/)支持项目概念；[Cambridge可见索引](https://dictionary.cambridge.org/dictionary/english/scope?topic=opportunity)支持范围与机会义。索引不冒充本次完整原站打开。
- accountable：[Cambridge官方词典摘录](https://assets.cambridge.org/97805211/22504/excerpt/9780521122504_excerpt.pdf)支持for/to、accountability和account for联系；[American Heritage的同义词说明](https://ahdictionary.com/word/search.html?q=responsible)支持重叠与侧重点，不采RACI普遍二分。VOA只作为作者教学组织参考，不承担本审核的关键事实证明。
- proposal：[Collins条目](https://www.collinsdictionary.com/us/dictionary/english/proposal)支持当前义、求婚义与常正式倾向；[Cambridge教学样章](https://www.cambridge.org/sites/default/files/media/documents/Complete%20Advanced%203rd%20Ed%20Unit%205%20Sample.pdf)第10个PDF页面、教材60页说明建议配事实支持；正文没有把考试写作规范当所有proposal的必要定义。
- work around：[Oxford短语](https://www.oxfordlearnersdictionaries.com/definition/english/work-around)、[workaround](https://www.oxfordlearnersdictionaries.com/definition/english/workaround)、[work](https://www.oxfordlearnersdictionaries.com/definition/english/work_1)分别支持整体义、关联名词和基础联系。
- weigh up：[Oxford weigh第2/3义](https://www.oxfordlearnersdictionaries.com/definition/english/weigh)支持称重/权衡及可分结构；[weigh somebody up](https://www.oxfordlearnersdictionaries.com/definition/english/weigh-up)仅用作人物评价扩展。第05区迁移到weigh A against B有词典明确支持，省略up不是错误。
- [British Council短语动词说明](https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/phrasal-verbs)支持整体理解与代词位置框架，具体词组由相应词典核对。自编情境和回应按语法/语义审核，不声称摘自这些来源。

## 保留的非阻断建议

scope的03虽然避免错误互斥，但“目标也可写成成果”较抽象；05再次使用training，与04有重叠。accountable的03用报告作对照成立，但“说明报告及其问题”可进一步具体成说明数据或结论。proposal的03末句较长，04比旧版明确但仍与02重复部分结构说明。work around的03是本批较强的同情境对照，05文件例与桥接重复。weigh up的02信息密度稍高，05可补一句说明带/不带up的关系，但目前有据且可理解。

所有建议与各区扣分写在回执reasons及SCORES.md；不通过加长所有段落追求满分。Owner仍需实际阅读确认这套解释风格。

## 实现审核与修复确认

初审发现两项重要问题：部分执行可能沿用未处理词条的旧分并错误通过validate-only；渲染用旧中文/POS而不是已审核字段。实现者已修复，新增反例测试；本Reviewer复跑22项测试全部通过。复核当前代码：变更但未处理条置NOT_STARTED，validate-only要求complete；渲染映射e.contextZh/e.pos并由浏览器精确断言。更多义项按focused sense ID排除已显示义项，保留不同义项；仅改数据投影，没有改变模板CSS/DOM。

独立执行validate-only输出5条CANDIDATE，productionActivated=false。CLI负责结构与回执门禁，不能自己证明语义；reviewer字符串非身份认证，独立性依赖真实执行记录。沿用IPA、额外原卡例句、冻结原型复制能力及真实应用FSRS未专项复核，不在本次内容批准范围。

状态：五条静态内容候选可供Owner试读；不发布，不扩量，不以本批结果证明全部50条已通过。
