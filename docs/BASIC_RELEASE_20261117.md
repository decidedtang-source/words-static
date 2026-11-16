# 基础学习版正式发布基线

用户2026-11-17指定当前基础版为正式版本，并授权100词试生产。版本basic-release-1.0.1，独立地址：https://decidedtang-source.github.io/words-static/releases/basic-v1-20261117/ 。

保留场景来源预览、词头发音、两张导航卡、学习释义和例句、普通词史、场景原句／中文解释／场景词义；移除“查看必要上下文”、Bridge、七步和独立完整词典入口。原网站学习应用、词库与浏览器记录不变。

100词为原V2的50词加50个不同词条。新50词均有Cambridge释义；100词历史均有资料记录，其中部分短语或派生词引用组成词历史并明确标记。40词有词典录音，其余使用系统语音；新增学习例句为原词库教学补充，未冒称来源词典例句。不是两站的完整全文复刻。

生产代码与数据固定于同仓提交[5374c3b](https://github.com/decidedtang-source/words-static/tree/5374c3b)，流程先冻结同步，再执行试产。详情见该提交的docs/roadmap/v10/BASIC_RELEASE_100_RESULT_20261117.md、scripts/basic及config/module-system/basic-v1.0.1.lock.json。

生产检查：78项自动测试、100词逐项显示与结构检查、1项导航检查、400次多屏宽度检查通过。public/releases/basic-v1-20261117/release.lock.json固定最终HTML；部署构建校验其hash与QA结果后才复制。qa-report.json记录生成阶段，不代替GitHub Actions部署回执。
