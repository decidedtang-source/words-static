# 生产工作流与QA完整性审计

核对日期：2026-11-01（Asia/Taipei）。结论：**正式单词本主体已在GitHub运行；V3增量的生产与QA闭环尚未完成，以下是实际缺口及补齐节点。** 不从零重建产品。

## 正式产品证据

- remote/main：cfa2ecc19fddf2fac7508c642f8580b1b5a85838。
- 正式入口 https://decidedtang-source.github.io/words-static/ HTTP 200；vocabulary.json HTTP 200，1875卡，updated=2026-10-29。此为HTTP/数据回读，不冒称本轮完成用户全部学习操作验收。
- 直接读取origin/main的scripts/build.mjs、package.json、.github/workflows/pages.yml：Node24、npm ci→npm test→npm run build→Pages artifact/deploy，main push或workflow_dispatch触发。
- main构建复制静态vocabulary；PR5候选才增加独立审核批次和hash-bundle构建。不能把候选能力说成已在main运行。
- P1–P3候选编译1878卡、五项内容审核、历史30/9测试；V3设计已接受并登记，但运行整合未实施。

## 完整性分层

| 环节 | 现况 | 补齐/责任/验收 |
|---|---|---|
| 正式托管与构建 | 已有main/Pages生产流程 | 沿用；发布后校验具体commit/artifact/URL |
| 选词与旧来源摄入 | 旧update-vocabulary扫描指定目录；新人工allowlist仅候选实现 | Selector/Builder保持两条边界；Task4先人工闭环，不切换旧任务 |
| 来源与词义绑定 | v1源与回执校验仅候选；V3无通用绑定 | Task1/4版本化合同＋独立源核对 |
| 内容语义/许可/隐私 | 5项真实独立审核；不是全历史 | 每批独立Reviewer；v2字段重新审，不用metadata冒充身份验证 |
| 单元与构建CI | main已运行 | Task1–5扩展反例；任何失败不得发布 |
| 浏览器CI | 有本地test:browser，但现有Pages YAML未调用 | Task5新增只读PR检查方案，执行时实施，见下文；发布仍需实机/Owner |
| 分支保护/required checks | 本轮未核对远端仓库设置 | 发布前只读审计，记录NOT_VERIFIED直到证实；设置变更需明确授权 |
| Owner与发布范围 | G2与设计确认分开 | 总控锁精确候选；不因有workflow_dispatch权限自行发布 |
| 公网验收 | 当前HTTP与词表回读通过，V3未部署 | Task6核对源码/artifact/manifest/assets、深链接、复制/展开、学习循环 |
| 回滚与记录恢复 | 方案与历史隔离测试存在；未执行V3演练 | Task5兼容壳撤回+完整旧版回退演练；事件/收藏不可删 |
| 定时生产自动化 | 当前任务保持，无本轮变更/健康认证 | 不建立竞争publisher；将来接管另立范围，先测人工质量与耗时 |

## Task5需要补的只读PR QA（计划，不在本轮安装）

新增 .github/workflows/pr-quality.yml：pull_request触发（不使用pull_request_target），contents:read，无secrets、pages写权限或自动merge，checkout精确候选，Node24/npm ci/npm test/npm run build；安装锁定Playwright对应Chromium和系统依赖，再npm run test:browser。测试helper须支持Playwright默认executablePath，不能沿用Windows本机缓存路径在Linux运行。

为每个测试helper集中浏览器路径解析：显式CHROMIUM_PATH优先，其次chromium.executablePath()；测试确认本机与CI路径均可启动。不降低失败测试或跳过语义门槛来绿CI。保存失败日志与截图artifact，不上传私有数据。PR检查artifact不进入Pages自动部署。

required checks是否开启需独立核实；未开启时Owner/维护者仍必须人工核对精确候选检查结果，不能宣称GitHub已强制阻止合并。若main有变更导致候选重整合，重新运行检查。

## 明确终点

本文件保留实施前缺口基线。候选已补V3运行实现、五卡独立审批和自动测试；最新证据见DELIVERY.md。实机UAT、发布、公网验收仍未完成，required checks未核实。
