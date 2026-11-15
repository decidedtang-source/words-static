# 词条阅读 v6 冻结与发布

2026-11-16，用户要求冻结当前 v6 页面及生成、资料获取流程，并发布。发布范围为现有三词阅读页面，不替换学习主页或词库数据。

- [线上阅读页](https://decidedtang-source.github.io/words-static/previews/word-layout-v6-20261116/)
- [整页审阅 PDF](https://decidedtang-source.github.io/words-static/previews/word-layout-v6-20261116/review.pdf)
- [冻结流程](../public/previews/word-layout-v6-20261116/WORKFLOW.md)
- [来源记录](../public/previews/word-layout-v6-20261116/sources.json)
- [文件哈希](../public/previews/word-layout-v6-20261116/manifest.json)

页面及 PDF 原字节冻结；来源数据、模板和可移植构建/检查/PDF导出脚本一起版本化。以后迭代新建版本目录，不改写本目录。五区连续分析属于我们自己的内容与方法；其他部分优先接入成熟资料，Bridge 组织其与场景的联系。

资料获取状态：Cambridge 直接请求返回403，本次使用官方页面的搜索索引正文核对精选义项与短例句；不是自动抓取器或API服务。历史来源及既有场景原句的来源和限制另见 sources.json。

发布前验证：重新生成 index.html 与冻结哈希一致；11个包内文件哈希通过；36组布局/交互检查通过；仓库11项单元测试、3项浏览器测试通过；构建成功。学习主页、词库和应用源码无修改。发布成功仍须以本提交的 GitHub Pages workflow 及公网回读为准。
