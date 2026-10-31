# 本轮实际验证记录

范围：独立规划样机和当前基线单元测试；不是生产UI实现或Owner验收。

## 实际执行

- `python render-preview.py`：从冻结JSON生成单文件HTML，exit 0。
- `node check-preview.mjs`：Chromium 151.0.7922.34，**90/90** 状态通过（A–F × lookup/front/revealed × 320/390/768/1024/1440px），exit 0；结果见 [preview-checks.json](preview-checks.json)。
- 36 张截图：六组 × 手机390/桌面1440 × 三状态。lookup为完整长页，front/revealed为900px视口；揭晓内容与lookup相同，底部评分是禁用示意。
- 检查：无横向溢出；front不挂载答案和简析；lookup/revealed显示所有选定源义项与五段正文，无details/dialog；一次揭晓即显示；两个复制载荷精确匹配JSON；剪贴板失败提供完整文本；0 page errors、0外部网络请求、0存储写入。
- 首次样机测试捕获 hash 改变后仍显示旧样例；定位为缺hashchange订阅，修正后完整90状态重跑通过。失败未被当成完成。
- 原正式代码工作树 `npm test`：**11 passed / 0 failed**，exit 0；包含内容ID、词典证据、双复制、收藏命名空间、旧标签撤销、备份冲突、FSRS事件和语音许可。该命令不访问用户真实浏览器记录。
- 独立语义审核：32义项/46源例句对照只读源快照，最终hash `7ef1d7d48c2bdf4bcf1b3114129574f147c3fced48fc06f2819b05884bd95354`；见 CONTENT-REVIEW。E仍领域隔离。

实际运行使用当前已安装依赖：`PREVIEW_PACKAGE_JSON` 指向同机正式仓库 package.json，CHROMIUM_PATH使用已安装Chromium；没有改正式锁文件或安装全局依赖。其他机器可在隔离工作树 `npm ci` 后 `python docs/codex/review-2026-10-31/render-preview.py`、`node docs/codex/review-2026-10-31/check-preview.mjs`；浏览器路径用CHROMIUM_PATH显式指定。本轮没有运行npm build或正式app的browser套件；没有修改app生产文件，不能把原型浏览器验证冒称正式产品回归。

## 视觉与可用性范围

人工查看桌面B、手机E长页，核对字号层级、词典/简析分区、技术缺口说明与完整正文；截图索引供Owner逐组阅读。其余组合是自动结构/内容验证，不声称做了36次人工可用性评估。固定评分栏会覆盖当前视口底部，页面保留额外底部空间可滚动看到所有正文；lookup长截图不含评分遮挡。

未完成：Owner阅读/学习适配验收、真实Safari/iOS/Android实机、屏幕阅读器、正式声音/收藏/评分、真实用户备份迁移、性能预算测量、生产部署。原型评分禁用且无学习库；不能用它证明FSRS兼容，后续P2/P5必须对真正实现另验。

## 仓库边界

本次新增均位于 `docs/codex/review-2026-10-31/`，另修正 `GOLDEN-CASES.md` 的整条习语事实并给 `START-HERE.md` 增加审阅入口。没有改 `.github/workflows/`、src、scripts、public、dictionary、package锁文件；main不更新、不触发Pages；Notion与定时任务不访问或修改。

提交前对候选统一LF，与Git实际blob字节一致；原Windows CRLF哈希仅为中间版本，独立Reviewer对LF版定点复核。内容语义未变；目录.gitattributes固定换行，避免再次串版。
