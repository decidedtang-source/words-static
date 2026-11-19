# 持续更新运行手册（实施后使用，当前不执行）

先人工、单批5–10项。频率由真实退修率和Owner需要决定，不设新定时任务。此手册具体化原 UPDATE-WORKFLOW 的U0–U7，不能当作本轮生产授权。

|步骤/角色|输入与实际动作|产物/退出条件|失败处理|
|---|---|---|---|
|U0 总控|fetch main、检查发布SHA、当前分支/dirty状态；确认这批有选词及实施权限|私有run记录，固定base；保留旧cardID集合与两个备份格式fixture|base漂移先重比差异，不覆盖其他工作|
|U1 Selector|用户在Notion已选的5–10词，人工复制目标与最少必要上下文；不勾选/修改Notion|私有selection packet，随机selectionKey、来源/分享许可、已有卡匹配|未选择或未授权素材不生成；私有上下文留本地|
|U2 Source curator|精确lemma/POS/义项查许可快照，核原始定义、IPA、词形；分清固定短语与组合表达|源entry/sense IDs、snapshot hash、选义范围、许可清单；未核字段为null|无来源不造锚；工程缺证据隔离，商业词典只留合法外链|
|U3 Writer|按五组正文组织十阶段；每组有实际语义，区别教学例句/真实原句/推断|候选公开投影草稿、stage refs、memory gloss、双复制载荷；生成字节hash|不得绕过原框架，不向线上模型发送私有全文；若以后用付费API另行授权|
|U4 独立Reviewer|新上下文接收精确hash、源材料和反例，独立重查词典/句法/语用/隐私|逐阶段结论及APPROVE/REVISE/QUARANTINE/BLOCK；记录实际工具证据|只定点退修；任何文案修改使原receipt失效，重审新hash；不无限重生成|
|U5 Builder|受信维护者确认独立审核身份；投影隐私审核在任何Git上传前完成|只包含批准ID的manifest，staging JSON；重复执行字节一致，覆盖率三表|一项失败隔离该项，批次清单重冻结后重算；绝不保留旧整体APPROVE|
|U6 QA + PR作者|验证schema/source/receipt/basehash；npm测试、构建与浏览器；检查公开diff/截图|内容Draft PR：新增/修订/隔离数、内容清单、审阅链接、体积、preview、回滚SHA|CI失败不合并；无真实浏览器结果标NOT_VERIFIED；不可只说“生成完成”|
|U7 Owner + 发布执行者|Owner单独批准精确候选；合并后核Pages workflow、artifact版本、公开页面及保留记录|PUBLISHED仅在远端读回、页面验收成功后；批次台账含实际发布SHA|未授权停READY_FOR_OWNER_REVIEW；失败按P5回退代码/内容，不删用户事件|

## 第一批与后续规模

第一批建议选5个普通词/组合表达，覆盖多义、-ing和固定习语；仅采用已授权公开或自编教学语境。E工程表达不混入普通通过名单。候选来源本身只有5项时，不扫描全部历史Notion或全部原始日期文件。若这批存在10/30类ID碰撞，保留源记录、明示身份冲突，Owner/维护者批准映射后才分配新公共ID。

手工重复2–3批后，记录每项耗时、首次通过率、漏锚率、退修原因、构建失败率和上线后纠错数。再决定是否需要自动收集；无需为了“持续更新”先搭建常驻Agent或自动发布。现有日更任务继续原样，本流程不争抢同一输出文件。

## 每批提交格式

1. base main SHA、batchId、允许清单、公开投影hash、source版本、rulesVersion；不得放私有NotionID/URL或私有文本hash。
2. 数量：selected / approved / revised / quarantined / excluded，每项原因可追踪；公开统计不披露私有词句。
3. 新增与修订卡ID分开；旧基线集合无丢失；语义变化不静默沿用旧ID。
4. dictionary coverage、compact-analysis reviewed coverage、copy-ready coverage 三种分子/分母；选义条目/义项另报。旧数据未重审不能算新框架已审。
5. 实际命令/退出码、独立审核hash、手机/桌面截图、已知缺口；分支预览与正式发布状态分开。
6. 回滚commit、可能受影响的公开字段、旧浏览器兼容证据、待Owner决定范围；不混入Notion历史整理。

## 暂停的 Notion 工作

历史词库字段整理、批量改中文解释、重写71分析页、迁移checkbox/学习记录、索引重建、双向同步、任务切换全部保持 **PAUSED_UNTIL_OWNER_REACTIVATES**。允许的本期行为只有读取用户主动交付的选词清单；未来自动只读连接器也需单独范围授权。当前并未访问或修改Notion。
