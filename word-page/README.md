# 词条页模块管理

v8 将 v7 的页面拆成九个模块，保留页面外观、原内容和交互。v6 原冻结包和 v7 地址继续保留。当前接口为静态构建使用的 JSON 合同，尚无服务端或在线 Cambridge API。

|模块目录|页面区域|输入关系|
|---|---|---|
|headword|单词、音标、词性、发音|共同词条身份；本机语音|
|source-preview|顶部来源折叠栏|读取 scenario，不复制原句|
|navigation|两个概览块、侧栏、底部导航、返回链接|learning、scenario|
|dictionary|完整词典入口|预留完整数据接口，当前无完整词典数据|
|learning|常用义项、例句、提示|dictionary 的词典链接|
|history|独立历史用法|词源资料|
|scenario|原句、翻译、上下文、重点与场景义|实际来源或明确自编场景|
|bridge|默认语义衔接、折叠历史联系|learning、history、scenario|
|analysis|我们自己的五区连续分析|learning、scenario、bridge；五区共同版本化|

## 每个模块怎么改

`modules/<模块>/content.json` 是按稳定 wordId 分组的内容。`view.html` 是展示模板。`interface.json` 明确该模块拥有的字段、类型、依赖、锚点及接口版本。`PROCESS.md` 记录该模块的来源或生成责任。发音及导航分别还有 `behavior.js`；导航的侧栏、底栏、页尾也在其目录内。

模块可读取自己的内容与声明依赖提供的内容。wordId/词头是全页共同身份。生成器会校验字段归属、类型、义项必需字段、词条集合、依赖存在性与循环依赖。对外接入成熟来源时，应先通过适配器整理为这些结构；不要让外部返回值直接散落在页面中。现阶段旧渲染器通过内部适配合并字段以保持页面一致，不是已实现的远端服务接口。

标题、正文、留白与响应式规则目前仍统一位于 `theme.css`，作为共享主题单独版本管理；它是有意保留的跨模块样式依赖。修改共享主题需检查全部区域。`shell.html` 只负责组装、公共格式化与事件接线。

## 独立冻结

`registry.json` 给每个模块设置 contentVersion、viewVersion、processVersion；接口版本在 interface.json。`release.lock.json` 锁定这四类版本与哈希，并保存上游内容/接口指纹。共享主题、壳、来源记录和生成管理代码也被哈希锁定。

```text
node word-page/manage.mjs                 # 检查是否偏离锁定版
node word-page/manage.mjs impact scenario # 列出改动后需要复核的下游模块
node word-page/manage.mjs freeze          # 修改版本号、发布名并完成复核后更新锁定清单
node word-page/build.mjs                 # 锁定检查通过才构建
node word-page/check-layout.mjs          # 当前v8与v7的布局/交互对照
```

浏览器生成与检查使用 Playwright；先在仓库根目录 npm ci，然后安装 Chromium，或设置 CHROMIUM_PATH 指向本机浏览器。

例如只修改发音按钮：改 headword 的 view.html/behavior.js，提升其 viewVersion；词典内容与五区内容版本不变。修改场景原句：改 scenario 的 content.json、提升 contentVersion；命令会列出来源预览、导航、Bridge、五区的复核依赖。需要改写的下游内容提升自身版本；无需改写的内容保留版本但重新锁定其输入指纹。

检查能发现过期依赖，但不能代替语义复核。freeze 是显式人工发布动作，不代表程序已经证明分析正确。变更冻结内容必须使用新的 release 名称和相应模块版本，旧版由 Git 历史及固定发布目录保留。

## 资料流程

其他部分优先使用成熟资料，五区分析是我们自己的方法与内容。此次拆分没有重新抓取或改写词义。sources.json 沿用已核对来源记录，包括 Cambridge 直接请求403后从官方搜索索引取得正文的限制；不是宣称已有自动抓取或正式API。完整记录见 v6 的 WORKFLOW.md，各模块 PROCESS.md 管理各自职责。

## 本次验证

接口拒绝未知字段、错误类型和不完整义项；锁定检查发现内容/布局变化并报告依赖复核。浏览器对照覆盖三词、四宽度、三种屏幕模式，手机三个词截图逐像素比较。发音沿用 v7，并保留播放/停止/切词取消与无可用语音提示。
