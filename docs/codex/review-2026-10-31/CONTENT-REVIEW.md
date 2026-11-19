# 独立语义审核（2026-10-31）

结论：**PREVIEW_APPROVE_WITH_EXPLICIT_GAPS**，仅允许作为有明确缺口的 Owner 内容预览；不是 APPROVED_FOR_STAGING、生产内容批准或发布许可。E 保持 **QUARANTINE_DOMAIN_TERM**。本报告不声称 1,875 卡已完成语义审查。

## 审核身份与精确对象

- Reviewer context：`/root/pr4_content_review`，由主任务新派发的独立上下文；未编写或修改候选内容，Writer ≠ Reviewer。
- checkout HEAD：`9858886dafecbab22d55c980d160a54bd6a98a06`；origin 为 `decidedtang-source/words-static`。候选位于未提交预览目录，故内容 hash 而非 HEAD 是本次绑定对象。
- 对象：[PREVIEW-CONTENT.json](PREVIEW-CONTENT.json) 与 [SIX-PREVIEWS.md](SIX-PREVIEWS.md)。最终 LF 版独立从文件原始字节重算 SHA-256：`7ef1d7d48c2bdf4bcf1b3114129574f147c3fced48fc06f2819b05884bd95354`。初审版本为 `69ec43f70be88e428723ced8f9a3c2d7f8b0c1fcc709591f73219f2e9ecb1916`，历史发现与定点复核见下文。
- review decision：仅接受上述 hash 的缺口展示；`approvedContentHash = null`（没有生产批准）。候选一旦修改，必须重新核对 hash 与变更内容。
- 已读 AGENTS、独立 Reviewer prompt、基线、START-HERE、内容/验收/工作流/QA 契约、GOLDEN-CASES；并检查当前词典目录、词组桥接、copy 源码及 B/C 当前卡记录。未把文档要求当成已实现行为。

## 独立源检查与许可

实际打开本机授权 OEWN SQLite 快照，使用 Node `DatabaseSync` 的 `readOnly:true`，通过 `forms JOIN entries` 定位，解析 `entries.content`。没有以 Writer 的核验声明代替源检查。

- snapshot：`oewn:2025:094517cfd433d7f9`，release `2025`。
- 实测数据库 SHA-256：`a78e8615e519ed24c9af58482159230f49c558be89104d8d511f3c7939ec5eb0`，与 manifest 和候选相符。
- **32/32 展示义项**：entry ID、lemma、POS、release、sourceEntryId、sourceSenseId、英文定义逐一匹配；**46/46 源例句**与对应源义项 examples 数组逐字、顺序匹配。
- 逐项读过中文摘要；没有把中文称为 OEWN 官方译文。E 的一处中文精确性问题已修正并定点复核；其余摘要足以作为简短教学解释，不要求穷尽英文定义中的所有限定。
- 独立读取快照 LICENSE.md 和 WNDB_License.txt：CC BY 4.0，含署名、修改声明和 Princeton 通知要求。快照文件 SHA 分别为 `672cc8b5663e8dc74c4b07a9dcf477193853575b119908fd3dc0aeeb60a9dbbb`、`df30ec18fbabcdaf031b79ea026d3e6b959010cffe6dd7be9ac137822175b904`。与仓库 public/licenses 对应文件仅 LF/CRLF 不同，规范化换行后完全一致。候选提供来源、版本、修改说明；SIX-PREVIEWS 提供源网址与两项许可链接。此结论限这份 OEWN 内容，不扩展至任何商业词典或工程标准。
- 源例句属于源义项例句，有些以同义词呈现，例如 frame 义项中的 put/cast；它们确实来自源数组，不能误称为目标词自身的独占搭配或频率证据。
- JSON 的所有展示定义、中文、源例句、五组简析、形态说明及缺口声明均在 SIX-PREVIEWS 中精确出现，未发现两份内容漂移。

## 六组 × 十阶段实质结论

P = PASS，N = NEEDS_EVIDENCE。P 只表示当前明确标记的教学预览内容在该阶段成立，不能提升为生产批准。引用定位为 JSON `cases[id]` 下 dictionaryEntries/gap 与 groups g1–g5；SIX-PREVIEWS 有同名段落。各组都有标记的学习例句，无需用空泛 N/A 填满阶段。

| 阶段 | A shift | B working definition | C outcome framing | D take into account | E functional seating surface | F 条件排程句 |
|---|---|---|---|---|---|---|
| Dictionary | P：4 源义，班次义对应本句 | P：working 4、definition 2；组合解释分开 | P：7 源义；不把 framing 的计划拟定义冒充全部语境义 | P：整条词组及 account 共 4 义实查 | N：4 个成分义真实，seating 工程义与整条术语无证据 | P：safe/condition/schedule 共 7 义；whether 单列项目语法 |
| Memory | P：next shift 是班次 | P：当前可使用，可暂定；非普遍等同 temporary | P：围绕结果组织说明 | P：整体记纳入考虑 | N：承靠/就位仅暂时理解，不是核定术语义 | P：条件化回答，无无条件保证 |
| Semantic Connection | P：记忆联系非词源 | P：区分四类 working 义 | P：frame/outcome 组合，非固定习语 | P：不从银行账户硬拆 | N：functional/surface 可联结；技术桥接仍缺证据 | P：safe 联系稳妥、condition 联系前提 |
| Syntax | P：before 时间短语、shift 名词 | P：working 修饰 definition | P：outcome 名词修饰语、framing 名词性中心、整体主语 | P：take X into account 结构及 X 正确 | P：surface 中心、seating 修饰，不误作谓语 | P：If 条件从句、whether 间接疑问补语、answer 祈使 |
| Concept | P：需要与时间边界，不代表批准 | P：共同约定的提议，非既成共识 | P：will help 为预期，非管理层认可记录 | P：need/before 是必要性与先后关系 | P：确认请求，confirm 的具体对象/效力未知 | P：条件假设与回答指示，非实际提问记录 |
| Contrast | P：班次/交接/换线不同 | P：tentative/formal/final 与 working 可重叠 | P：framing/description/measurement 不同 | P：consider 较广，纳入判断有重叠 | P：只警示四种 surface 不必等价，未冒称精确工程定义 | P：safe/achievable/on track 不可无条件互换 |
| Language Game | P：假设准备沟通，可选澄清 | P：假设质量讨论，可问边界和修订 | P：假设提案表达，非操控事实 | P：假设评审，问影响与依据 | P：索取图纸和装配语境，明确非固定 SOP | P：示范如何说明判断前提 |
| English Neighbors | P：指导书/人员准备/交接有解释 | P：criteria 等帮助界定判据 | P：impact 等连接影响与判断依据 | P：uncertainty/risk/decision/approval 关联合理 | P：drawing reference/contact area/assembly context 用于索证，不宣称频率 | P：readiness/constraints/fallback/gate 均标示例方向 |
| Pragmatic Action | P：限时需求非责任任命 | P：提议共识非授权 | P：建议改善说明非正式决定 | P：提醒纳入因素非接受风险 | P：请求定位/澄清非正式工程批准 | P：限制承诺，不授权更改排程 |
| Workplace Use | P：自然自编确认句，confirm 范围仍待语境 | P：for now 明示阶段性、自编 | P：Frame 祈使动词与 framing 区别清楚 | P：自然自编审查句，无审批结论 | N：句法自然且标自编，但目标术语仍未核，不得作为已核工程用法发布 | P：provided that 自编条件句；Friday 非真实交期 |

E 的 Dictionary / Memory / Semantic Connection / Workplace Use 不得用其他阶段 PASS 抵销。语法成立不证明工程术语正确；领域缺证据不妨碍展示“为什么当前不能放行”。

## 反例审核：预期、实际与边界

以下为本 Reviewer 实际进行的语义对照与源查询；**不是已部署拦截器或自动测试执行结果**。

| 反例 | 预期 | 实际核对结果 |
|---|---|---|
| next shift = 下一次转变 | REJECT | A 明确选班次；通过对照 |
| shift 永远只有名词 | REJECT | A 同时显示两个动词义；通过 |
| working 普遍等于 temporary，或完全禁止暂定义 | REJECT | B 实查 impermanent、operative 与另外两义，明示语境范围；通过 |
| framing 在本句是谓语动词 | REJECT | C 的主语名词性中心分析正确；通过 |
| outcome framing 为 OEWN 固定习语 | REJECT | C 明示组合分析；通过 |
| take into account 从 bank account 字面推出／整条无证也归 OEWN | REJECT | 实查 take_into_account%2:31:00::；D 整条证据真实；通过 |
| seating 普通座位义证明工程承靠面 | REJECT | 实查 seating 仅座位区域与引座服务两义；E 隔离正确 |
| confirm/needs/agree on 自动等于客户批准 | REJECT | A/B/D/E 明确拒绝此推断；通过 |
| whether 有 OEWN 条目／整句是固定词条 | REJECT | 独立 exact-form 查询 whether 返回 0；F 归项目语法；通过 |
| safe schedule 是无条件出货保证 | REJECT | F 的条件、示例交期、承诺边界正确；通过 |
| lead 金属和带领共用 IPA/同一条目 | REJECT | 实查金属 lead%1:27:00:: 对应 lɛd；动词条目 liːd；反例驳回。六组没有 lead 卡，不声称运行时已测 |
| stated 直接套用 state 发音 | REJECT | 实查 stated 的 ˈsteɪtɪd；反例驳回。六组未输出 IPA |
| reversible 直接套 reverse IPA | REJECT | 实查 reversible 发音 null；无法据此补 IPA，反例驳回 |
| approval 与 acceptance 恒等且自动授予权限 | REJECT | 实查 approval 有正式批准/赞许等不同义，acceptance 有接受/法律接受等；不能全局等号，六组无这种授权推断 |
| pending 自动等于 pending approval | REJECT | 实查 pending 为 awaiting conclusion or confirmation；没有指定一定等待批准，反例驳回 |
| due by 与 due on 无条件完全等价 | REJECT | Reviewer 语法对照：by 给最晚边界，on 指所定日期；具体日内截止仍需语境。六组未使用，未声称源条目或运行时覆盖 |
| 自编例句冒充客户原话/商业词典中文 | REJECT | 六组 contextKind=generated_example，shareClass=public；正文/复制明确教学来源，未见上述误归因 |

## 必须保留的缺口、修订与未验证项

1. **历史发现，已修复并复核**：初审版本 E `surface%1:15:00::` 中文“三维物体向外延伸的二维边界；表面”中的“向外延伸”不够准确。Writer 已改为“三维物体的二维外边界；表面”。Reviewer 独立确认当前 JSON、SIX-PREVIEWS.md、preview.html 均含修正文字且无旧措辞；英文、sourceSenseId、例句未变。将新 JSON 中这一处文字还原后重算，准确得到初审旧 hash，证明候选字节差异仅为此定点修改。修正后的中文义通过，**此项不再待修**；E 领域术语隔离仍独立成立。
2. E 必须持续隔离，直到取得可公开使用的 seating 工程义、具体装配语境/图纸或适当领域来源，完成独立复核；普通 functional/surface 义不能代替这些证据。
3. F whether 语法分析当前正确；不能把它转换成虚构的 OEWN sourceSenseId。词典覆盖仅限明确选择的 32 义，所有 pronunciation=null 是保守缺项，不是发音审查完成。
4. B/C cardId 分别与当前 public/vocabulary.json 的 `V20261029-005` / `V20261029-006` 的 term 和 example 相符；其余 null 未伪造新生产身份。未执行全历史导入/重复 ID 审核，因此不批准新批次导入。
5. 候选与 SIX-PREVIEWS 未发现私人链接、邮箱、凭据、客户身份、真实会议或交期材料；六组为标记教学句。没有访问 Notion、修改日程或发布。隐私结论仅覆盖这两份实查文本，不替代截图/构建产物扫描。
6. 未验证生产 UI、移动端截图、浏览器行为、FSRS 兼容、构建或公网发布；这些由主任务的工程审查及后续 Owner/release gates 负责。预览内容接受不能推导主线合并或 Pages 发布许可。

最终状态：A/B/C/D/F 的已展示教学内容通过本次语义检查；E 中文修订已通过定点复核，仍因 seating 工程义与整条术语缺证据保持 **QUARANTINE_DOMAIN_TERM**。整体最终绑定 LF 字节 hash `7ef1d7d48c2bdf4bcf1b3114129574f147c3fced48fc06f2819b05884bd95354`，结论仍为 **PREVIEW_APPROVE_WITH_EXPLICIT_GAPS / NOT_PRODUCTION_APPROVED**。没有剩余必须修正的已识别文案错误；领域证据缺口及 Owner/release gates 继续保留。


## 提交前换行规范化复核

Writer 将候选 JSON 从 CRLF 统一为 LF，并通过目录 `.gitattributes` 的 `*.json text eol=lf` 固定 Git 与工作树换行。Reviewer 独立读取当前原始字节：CRLF 数量为 0，SHA-256 为 `7ef1d7d48c2bdf4bcf1b3114129574f147c3fced48fc06f2819b05884bd95354`。仅将每个 LF 还原为 CRLF 后，准确得到上一轮已审修订版 hash `4b9d47c8fb00f5f200c4fcb25344d4e11d92d91dd34695d54ef27e21bd96361e`。因此本轮仅为换行字节规范化，语义与32义项/46例句审阅对象未变，不虚称重新执行了源义项核验。最终预览接受绑定上述 LF hash；E 领域隔离、非生产批准及其他缺口保持不变。
