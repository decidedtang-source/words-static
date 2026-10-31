# 内容更新、Agent分工与发布运行手册

## Writer 内容合同更新：四部分完整框架＋整体分析单位

请严格遵循 [SEMANTIC-BRIDGE.md](SEMANTIC-BRIDGE.md)，并以 [CHATGPT_PROJECT_INSTRUCTIONS.md](../../CHATGPT_PROJECT_INSTRUCTIONS.md) 为上位教学框架。简析统一按四部分生成：① Dictionary；② Memory + Semantic Connection；③ Context（Syntax→Concept→Contrast）；④ Language Game（English Neighbors→Pragmatic Action→Workplace Use）。信息量可短，但原项目所有核心步骤都必须在四部分中实际体现。

**分析单位是整个用户目标**。如 working definition，先把整个词组作为一个学习对象；第一部分引用 working/definition 的必要词性和义项，第二部分解释所选 working 义如何修饰 definition 并形成整体意义，第三、四部分继续分析整个词组在原句中的含义和作用。不得为 working 和 definition 各自分别写一套一二三四，再拼接起来。习语先讲整体义；技术术语以整个术语为单位；整句以整句为单位。

当前 V3 的 displayGroups schema 允许4–5组，优先生成四组；如某条确实需要第五组，只能为可读性拆分，不能增加或删减分析步骤。新要求不自动增加 UI 或 JSON 字段。

## Writer 新增要求：Semantic Bridge

每条候选必须按 [SEMANTIC-BRIDGE.md](SEMANTIC-BRIDGE.md) 说明从词典义项到当前用法的连续路径。至少回答：为什么选这个义项、义项内部哪些语义成分重要、它如何与词组/句法结构组合、原句如何进一步限定意义。五组显示内容之间也必须承接前一组的结论。只列义项和五段彼此独立的正确说明，仍应退回 REVISE。新要求不自动增加 UI 或 JSON 字段；先用现有 presentation 与 g1–g5 写出真实桥接，再由 Owner 审阅是否需要结构化字段。


适用：候选已支持v1/v2的人工批次流程。命令见../P1-P3-RUNBOOK.md；v2必须经过新独立审核回执验证。实际首批证据见DELIVERY.md。Notion仅选词，禁止整理/回写/迁移。

## 角色与交付

| 角色 | 输入→输出 | 不得做 |
|---|---|---|
| 总控 | authority/base/计划→范围、依赖、验收与提交报告 | 把候选或设计通过当部署 |
| Selector | 用户明确选词→私有selection packet＋公开opaque token | 扫全Notion、重复造ID、公开私有来源 |
| Writer | 目标/语境/源快照→严格公开投影、义项绑定、简析 | 给自己出独立APPROVE；猜IPA/来源 |
| Independent Reviewer | 精确候选与实际源→逐项语义/权利/隐私结论及新回执 | 复用旧回执批准新增presentation |
| Builder | 已审manifest链→确定性staging及内容hash | glob所有输入、写Notion、改任务 |
| QA/代码审查 | 真实运行候选→反例/兼容/设备/缺口证据 | 用mock或静态截图代替学习流程 |
| Owner | 已证候选→实现接受与独立G2 | 不承担日常工程修复/内容核源工作 |

角色是职责分离，不要求常驻Agent平台。Writer与内容Reviewer必须独立上下文；实现者可兼Builder/QA操作。代码审查与语义审查互不代替。

## 每批实际步骤

1. **SELECTED**：初期5–10项人工批次；选词可来自Notion，但本项目不写Notion。保留授权范围与私有来源，公开文件仅使用允许字段。
2. **SOURCE_CHECKED**：检查原目标、类型、现有cardId、源snapshot/license/entry/sense。相同拼写不是同学习身份。短语整词义优先真实来源，组合解释明确标注。
3. **DRAFTED**：Writer生成短义、明确语境义项、本句提示、4–5组正文、十阶段证据及copyPayload。查不到对应义项不自动代用；缺工程证据隔离。
4. **VALIDATED**：canonical UTF-8/LF字节、schema/rules/source/base/allowlist检查。构建拒绝未知字段、私有URL、混版本及模板回执。验证器不能代替语义判断。
5. **INDEPENDENTLY_REVIEWED**：新上下文逐项核源、绑定和简析，给APPROVE/REVISE/QUARANTINE/BLOCK。修改候选后重算hash并复核；记录退修原因/耗时以决定未来更新频率。
6. **STAGED**：只有APPROVE才进入active-batches候选变更。CLI重放明确前序链到目标，两次产出相同；失败不覆盖既有目录。历史基线变化时重新核对base并重审，不改hash蒙混。
7. **BRANCH_REVIEW**：commit并提交内容PR；列新增/修订/analysis-only/退役/隔离、三类旧覆盖及contextSenseBound、来源许可、QA、回滚。没有额外新增学习任务或自动模型调用。
8. **OWNER_ACCEPTED → RELEASE_AUTHORIZED → LIVE_VERIFIED**：分开记录。无G2只停在READY；明确授权后按既有Pages发布并回读精确版本。

正常命令（v2支持实施后）：

```text
npm ci
npm test
npm run build
node scripts/build-reviewed-batch.mjs --manifest content/manifests/v3-goldens.json --out local-evidence/v3-batch
node scripts/build-reviewed-batch.mjs --manifest content/manifests/v3-goldens.json --out local-evidence/v3-batch
npm run test:browser
```

## ChatGPT Project交接

复用src/copy.mjs。原文复制保持目标文本；深析为【深析】目标＋允许分享且来源标明的上下文/来源标签。用户自己粘贴发送，不自动打开/提交、不调用付费模型。

项目指令建议稿：先判断词/组合/整句与实际语境，区分可靠词典事实与教学推断；依Syntax → Concept → Contrast → Language Game → English Neighbors → Pragmatic Action → Workplace Use递进；缺语境先明确不确定，不编真实工作事件、词源、标准或授权。深入分析不替代网页基础词义。网页按钮不自动安装/修改ChatGPT项目指令。

## 风险和回滚

| 风险 | 预防/触发 | 回滚 |
|---|---|---|
| 词义绑定错 | 严格ID+源比对+独立语义review | 修订/退役对应内容，保留事件，重新揭晓 |
| 旧自动publisher改base | 链base哈希失败即止 | 保持线上旧成功版本，rebase重审；不接管任务 |
| 卡在旧正文评分 | renderHash/revision/pending guard | 保留完整旧bundle或阻断待评分，不混装 |
| UI不兼容 | 六设备+备份fixture+Owner实机 | 撤销UI改动，学习数据库不变 |
| v2内容回退 | 删除active引用可能丢掉本次新卡资料 | 优先兼容壳下显式withdraw/revise及retiredIds；退役ID保留在新的完整manifest |
| 整版紧急回退 | 回到曾验证的完整git版本 | 明确旧UI可能无退役占位，但事件/收藏仍须可导出；不删IndexedDB |
| 私有信息误发布 | 白名单与独立隐私核验 | 停止进一步发布并通知Owner；不能保证Git revert消除缓存/历史 |

发布在现有main/Pages上，PR5当前base是规划分支。最终集成要核对PR4+PR5整体diff、最新main和准确候选SHA，不得在规划分支merge后宣称上线。公开回读与分支提交分别汇报。
