# 首批递进词汇独立审查收口

基线7741f24，审查版本91d99ec。按executing-plans执行一次fresh-context全分支审查（static_final_review，gpt-6-astra/high），随后一次集中修复；不声称修复后获得第二轮独立审批。

语义：40/40中文义项摘要 ACCEPT，11/11语境桥 ACCEPT；独立只读核对OEWN原定义/例句/POS与snapshot hash一致。中文是教学摘要，组合说明不是新增权威词典条目；工程verification/validation仅限明确学习语境。此结论不扩大到原1875卡全部。

Critical 0，Important 4，Minor 0：

1. 详情内数字键误给后台学习卡评分：重现problem ownership→issue taxonomy后阻止modal内学习快捷键；回归验证原卡及原state。
2. 收藏导入旧文件迟到覆盖新文件：重现NEWER→OLDER，增加请求序号、视图存活与事务内检查；连续选择及离开页面回归通过。
3. lead同形条目收藏丢失entryId：重现铅条目打开3个lead，改为精确entryId回开并在标签加入中文义；缺失条目不静默替换。
4. 旧release文档弱化上游“背面最多1–3必要成分”：恢复working definition/hypothesis、outcome framing的精选基础义。独立审阅接受限定映射；frame明确标相关基形动词，不把framing句法角色变为动词。缺foundation测试RED后修复。

上述缺陷各有RED→GREEN证据（local-evidence日志只在本地）。静态词表字节未改，1875ID保持，src/model.mjs和storage.mjs未改，学习库schema/version不变。新增收藏独立备份的取舍见release文档。

未判定完成且继续待办：全量1875内容词典锚定/历史语义审阅、Notion整理/125冲突处理、自动跨设备同步、真实Safari/Android剪贴板、ChatGPT指令安装、Owner30卡阅读UAT。公网部署由独立发布记录证明，不能从本审阅推断。
