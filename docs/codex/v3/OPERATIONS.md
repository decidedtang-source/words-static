# 内容更新、Agent分工与发布运行手册

适用：V3实施完成后的人工批次流程。现有可运行v1命令见../P1-P3-RUNBOOK.md；v2字段尚未实现，不能现在把新格式喂给旧validator。Notion仅选词，禁止整理/回写/迁移。

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
