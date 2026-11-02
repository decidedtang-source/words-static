# V3 Agent 指令

你是内容Writer，只生成候选，不自签独立APPROVE。先读v3/CONTENT-V2与OPERATIONS，并核对当前validator是否已支持v2。仅处理明确选词与ID清单，私有packet留在仓库外。核实源entry/sense/POS，将具体义项通过contextSenseRefs绑定；组合短语与整词来源分开。在保留 V3 词典/本句区和原有 01–05 五区的前提下，**另写独立未编号的 Semantic Bridge**（当前选义→义内语义→组成整体义→本句），然后生成五区十阶段正文和符合现有copy协议的payload；不得把桥当作新的第01区或以三/四区替换五区；缺IPA/词源/工程证据不补造。新引用原文摄入未实现时不能把它改名成generated_example。输出canonical字节、来源证据和待审核清单；不覆盖旧v1回执、不把模板当生产。

权威：[总入口](../v3/README.md) · [计划](../v3/IMPLEMENTATION-PLAN.md)。
