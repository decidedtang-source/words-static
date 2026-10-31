# V3 QA与验收矩阵

本文件是待执行标准，不是PASS报告。实际候选执行结果见DELIVERY.md；生产V3未发布，实机UAT待验。

| Gate | 必须验证 | 失败处理 |
|---|---|---|
| Q0 基线 | remote/main、候选tree、来源/回执哈希；原卡ID、事件/备份协议、任务无改动 | 范围冲突停止对应操作 |
| Q1 来源 | 准确entry/sense/POS/role；英文定义与源一致；中文标教学；v1回执不能放行v2 | REVISE/QUARANTINE，不猜义项 |
| Q2 语义 | 五项逐卡短义、当前义项、本句提示、十阶段完整性；无虚构批准/词源/原话 | Writer修订后独立复核 |
| Q3 展示 | V3固定顺序；当前义项直显，其他默认收起；通用查词/legacy降级明确 | 真实渲染失败不得只修改截图 |
| Q4 状态 | grade/undo、copy、展开、返回、撤回、迟到请求、离线/坏hash | 先复现再修复，不清记录 |
| Q5 设备 | 六视口、320px、200%缩放、键盘、固定栏、实际平台标记 | 浏览器模拟与实机分别报告 |
| Q6 发布 | 精确main候选+G2、Actions成功、公网回读同一release | 未验证不得写LIVE |

## 内容矩阵

| 案例 | 默认焦点 | 展开/拒绝点 |
|---|---|---|
| A shift | 当前句的名词班次义 | 其他名词/动词义在展开中，不能当作本句义 |
| B working definition | working暂定基础义+definition意义说明义 | 六个已选义项可展开；组合解释标明；不自动拼入work |
| C outcome framing | 审核后的frame表达动词义作为名词化组成依据 | 不把名词framing全都当进行时动词 |
| D take into account | 存在的整短语义 | 不通过银行account推导含义 |
| E functional seating surface | 缺工程证据，隔离样例待核 | 不进入active批次，不伪造术语定义 |
| F 条件排程句 | 句子翻译+经审关键词义项 | whether语法解释不是伪造OEWN词条；by Friday包含周五 |

五卡×6视口×3模式=90个检查单元（可参数化，不要求90个独立测试文件）。E单独负例；加legacy、通用词典、不存在/退役ID。每个单元检查层级、答案遮蔽、溢出、可操作性与内容，不只检查元素数量。

## 六设备与交互

Windows 1440×810、Mac 1440×900、手机390×844/844×390、平板820×1180/1180×820。默认折叠、打开、收起均无横向溢出；原文/深析顶部和底部内容一致；长句不截断。真实OS/浏览器另记版本与日期，未测写NOT_VERIFIED。

- Tab/Enter/Space操作summary及复制；收起时焦点不留在不可见区域；可访问名称唯一明确；没有重复id。
- 学习正面无中文、解释及深析payload；揭晓一次即出现对应义项，其他义项需主动展开。
- 200%缩放/手机横屏，顶部复制与底部评分不遮正文、焦点和复制失败文本。
- 查词返回同卡保留展开/揭晓/滚动；新卡、换revision或撤回清理旧视图状态。
- 两处复制快速点击、迟到拒绝/成功、页面切走：仅当前目标反馈，不泄露前卡上下文；使用正式copy模块的来源/分享限制。

## 数据不丢与网络

用隔离fixture记录grade→undo→导出→导入；原事件ID、卡ID、计数及收藏往返相同；重复导入幂等，跨设备分叉仍拒绝。不得为了测试访问或给用户真实卡评分。

复用并保留P1–P3已有反例：并发旧manifest不得解除较新更新屏障；同revision变renderHash必须重新揭晓；撤回后详情/展开词库正文与copy同步失效；headers到达而body停流5秒后退出等待；hash错/404不能混装新旧bundle。纯断网且没有已知未完成更新时才允许固定已加载版本学习。

## 验收记录模板

```
Candidate SHA / tree / main base:
Content releaseId / projectionHash / sourceHash / receiptHash:
UI baseline: WORDS-STATIC-UI-V3
Unit/build/browser commands + exit codes + counts:
Q0..Q6: PASS / FAIL / PARTIAL / NOT_VERIFIED
Five content rows + E quarantine:
contextSenseBound / total; analysis / total; legacy count:
Six viewport evidence; actual device/browser evidence:
Old data + both backups preserved:
Code review findings/fixes; independent content reviewer:
Owner implementation acceptance: pending / accepted / revise
G2 deployment authorization: absent / exact scope and SHA
Public readback: NOT_DEPLOYED / LIVE_VERIFIED / FAILED
```

Owner只验收真实实现是否符合已接受设计、并决定发布；不要求重复接受同一V3视觉方向。
