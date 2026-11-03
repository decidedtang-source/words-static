# Words Static UI V3 — 正式确认的新版本设计基线

**版本：WORDS-STATIC-UI-V3 / UI-V3**
**状态：OWNER_APPROVED_DESIGN_BASELINE**
**确认及登记日期：2026-11-01（Asia/Taipei）**

Owner 已明确接受本版，并要求在 GitHub 正式注册。此目录冻结的就是已展示并获接受的 V3，不是 V1/V2，也不是之前 PR #5 尚未调整的运行界面。后续实现必须以本版为准；变更阅读顺序或折叠策略需再次确认。

## 固定的阅读顺序

1. 单词/词组、醒目的中文释义与搭配。
2. 默认直接显示当前语境对应的具体词典义项。
3. 适度突出的“本句先记 · 怎么理解”，连同原句及译文。
4. “展开更多词典释义”：默认折叠其余已核内容，可展开和收起。
5. 继续显示完整递进解析；顶部常驻、底部均保留双复制。

本版取代早期“所有词典义项必须默认全部直显”的要求：**当前义项直显，其余义项展开**。不取代完整方法 Syntax → Concept → Contrast → Language Game → English Neighbors → Pragmatic Action → Workplace Use；Dictionary / Memory / Semantic Connection 仍为前置基础。

## 冻结物与回看

- [精确 HTML 样例](index.html)：与 Owner 接受的本机 V3 字节一致。
- [六设备交互对照 HTML](gallery.html)、[尺寸清单](devices.json)、[预览检查结果](qa.json)。GitHub 文件页只显示源码；下载目录后用本地 HTTP 服务打开 HTML。
- [机器可读登记与全部文件 SHA-256](baseline.json)。冻结源文件不原地覆盖；后续设计另建版本。
- gallery 内“上一版”相对链接保留原预览状态，仅原本机目录可用；不影响本版六设备或页面预览。

| 视口 | 首屏 | 整页 | 展开状态 |
|---|---|---|---|
| Windows · 16:9 1440×810 | [查看](windows.png) | [查看](windows-full.png) | [查看](windows-expanded.png) |
| Mac 笔记本 · 16:10 1440×900 | [查看](mac.png) | [查看](mac-full.png) | [查看](mac-expanded.png) |
| 手机竖屏 390×844 | [查看](phone-portrait.png) | [查看](phone-portrait-full.png) | [查看](phone-portrait-expanded.png) |
| 手机横屏 844×390 | [查看](phone-landscape.png) | [查看](phone-landscape-full.png) | [查看](phone-landscape-expanded.png) |
| 平板竖屏 820×1180 | [查看](tablet-portrait.png) | [查看](tablet-portrait-full.png) | [查看](tablet-portrait-expanded.png) |
| 平板横屏 1180×820 | [查看](tablet-landscape.png) | [查看](tablet-landscape-full.png) | [查看](tablet-landscape-expanded.png) |

全部为 Chromium 尺寸模拟，不是 Mac/Safari/iOS 实机认证。检查确认每个视口当前义项2条，展开6条，可收起，无横向溢出。

## 内容与实施边界

- 此样例以 working definition 为中心；working 的语境义项为“暂定用作进一步工作基础的”，不是“正在工作中”。组成词与整词解释必须区分。
- work 独立词条没有已核数据，不因展开而自动编造；展开的是当前已收录义项，不宣称完整词典。
- 将具体义项与语境绑定需明确来源/审核字段，不允许自动取第一义项。样例中的手工绑定不是通用生产逻辑。
- HTML 用于冻结视觉和交互要求；复制提示仍须在正式实现中复用生产 copy 模块，不能以样例简化代码替换完整协议。
- 保留正式 GitHub Pages 产品身份、FSRS、稳定ID、学习事件、收藏、声音许可及备份。Notion 仅选词，历史迁移和任务调整仍暂停。

## 交付状态

设计接受：**已确认**。GitHub 基线登记：由本提交记录。运行程序 V3 整合：**待实施**。生产发布：**未部署**。

本登记提交只包含文档与冻结预览，不修改 src、生产词表、定时任务或 main。之后实施和测试必须报告相对于本版的符合程度，不能拿旧 P1–P3 测试结果声称 V3 已上线。
