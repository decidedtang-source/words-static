> **2026-11-05 Owner确认冻结**：当前50词示例与词典默认展开/前置版式固定为 [WORDS-STATIC-V3.1-DICTIONARY-FIRST-20261105](docs/design/dictionary-learner-50-20261105/README.md)，冻结目录不可覆盖。覆盖历史暂不冻结及旧排序说明；仅预览基线，不是main/Pages发布。

> **2026-11-05 Owner版式调整**：词典义项默认展开，位于 B·直接释义之前，可手动折叠；本句先记和后五区保持原内容与顺序。仅候选预览，不发布。此要求覆盖历史排序。

> **2026-11-04 最新Owner补充**：完整词典区必须可独立查阅，核对主要常用义、词性、语法和对应例句，Bridge再连接当前语境。源记录全量不等于常用覆盖完整。执行 [LEARNER-DICTIONARY-QA](docs/codex/v3/five-zone-v3.1/LEARNER-DICTIONARY-QA.md) 和 verify-learner-dictionary.mjs；新版暂不冻结最终基线，不发布。

> **2026-11-04 Owner词典区纠正**：标题改为“词典义项”，按明确词典版本完整收录原文释义、源例句、用法与标签，中文译释另标；不能只列更多摘要或过滤当前义。新要求与QA见 [FULL-DICTIONARY-QA](docs/codex/v3/five-zone-v3.1/FULL-DICTIONARY-QA.md)，优先于本文件历史冲突描述。版式冻结，不发布。

> **2026-11-03 最新正式登记：WORDS-STATIC-V3.1-FIVE-ZONE-SOURCE-FIRST**。先读 [五区来源整理版基线、工作流与QA](docs/codex/v3/five-zone-v3.1/README.md)。Owner已确认模板和“按五区需求检索成熟解释→整理→必要补写→独立QA”的内容生产方法。保留展开的当前拆词释义，随后直接释义区→本句先记→更多词典义项，再进入完整01—05。冻结HTML不可覆盖。此登记优先于下方历史规划中冲突的排序和讲解方法；仅模板/规划新版本，不是生产发布或内容独立审核通过。GitHub Pages、FSRS、学习记录、Notion选词和定时任务边界保持。状态 **READY_FOR_OWNER_REVIEW / NOT_DEPLOYED**。

# Codex working contract — Words Static / English Vocabulary

> **整页QA范围纠正**：后五区仅是讲解子模块。按 [WHOLE-CARD-QA](docs/codex/v3/five-zone-v3.1/WHOLE-CARD-QA.md)逐一生产和审核整页13模块，必须包括词源切换、词头及例句，不可用五区PASS声称整页完整。版式不变，不发布。此范围纠正优先于历史“词源可省略”说明。

> **最新 Owner 产品方向（2026-11-03）**：先读 [B 默认、C1 按需切换的产品总纲](docs/codex/v3/OWNER-B-C1-PRODUCT-BRIEF.md)。保留现有 V3 词典/本句与完整原 01–05 五区，桥接区域默认展示 B（现代常见义＋具体使用场景＋当前义），C1 提供按需深入的词典来源、义项关联及有据词源；A 不作为用户可见模式。**Codex 自行决定架构和 UI、版本/审核/测试方案，先复现和评分，再在隔离分支实施；不可未经单独许可合并 main 或发布。** 这优先于历史 A/B/C 三选一、把五区改为三/四区的探索文档。


## Latest Owner instruction — preserve V3, add Bridge before the original five groups

Read [the corrected V3 Semantic Bridge specification](docs/codex/v3/SEMANTIC-BRIDGE.md) first. The previously suggested "four sections replacing five" and the sample "three sections replacing five" are **rejected**. **Keep all existing V3 header/dictionary/current sense/example/expanded-dictionary behavior. Add one independent, unnumbered semantic transition immediately before all five original analysis groups (01 memory, 02 syntax/concept, 03 contrast/neighbors, 04 language game/pragmatics, 05 workplace use). Do not delete or renumber them.** One phrase has one Bridge and one full five-group explanation, not one per component word. The new bridge has to be independently source-anchored, versioned and reviewed; the old hash receipt does not approve it. Only planning and demo changed so far; not the live site.


**Status: UI-V3 design is Owner-approved and registered; V3 candidate implementation is complete pending Owner UAT; release remains separately gated.**

This repository is the user's **official vocabulary website**, published at https://decidedtang-source.github.io/words-static/ . Its **main** branch triggers GitHub Pages deployment. Do not switch the product to the separate experimental Node/SQLite app, invent a second daily generator, or treat documentation commits as product delivery.

## Approved UI version — 2026-11-01

**WORDS-STATIC-UI-V3 is the Owner-approved new UI baseline.** Read [the frozen V3 registration](docs/design/words-ui-v3/README.md) and its exact preview before UI work. It supersedes V1/V2 and the earlier all-senses-always-visible requirement. Current-context senses are direct; additional reviewed senses are expandable. Design approved does not mean runtime integrated or Pages deployed.

## Before doing any work

1. Read **docs/CURRENT_OFFICIAL_BASELINE.md** and **README.md**.
2. Read **docs/codex/START-HERE.md**, **docs/codex/v3/README.md** and their current product/contract/implementation/QA links; distinguish preserved v1 schemas from implemented v2.
3. Inspect the current code rather than presuming all planned features exist: **src/app.mjs**, **src/lexical-ui.mjs**, **src/lexical.mjs**, **src/copy.mjs**, **scripts/update-vocabulary.mjs**, **scripts/enrich-vocabulary.mjs**, **scripts/build.mjs**, **dictionary/catalog.json**, **dictionary/bridges.json**, and the tests.
4. Check current main SHA / Pages status and PR/issue changes before declaring a requirement complete; recorded baselines (1,875 cards, 21 OEWN headwords, 40 senses) are historical snapshots, **not permanent limits**.
5. For new content, use only input the user has authorized, retain selection provenance privately, and never publish private Notion links, customer records, notes, credentials, or personal data.

## Non-negotiable product requirements

- **Current website stays canonical**: preserve stable card IDs, browser IndexedDB history, TS-FSRS settings, grading/undo, read marks, backups, bookmarks, speech consent, public URL and build path. Do not clear or silently migrate user progress.
- **Mature vocabulary UX first**: benchmark real, verifiable MaiMemo Web capabilities, implement functional equivalents independently where authorized. Do not copy its copyrighted dictionary entries, proprietary algorithm, graphics, code or brand. Distinguish Web from mobile-only features.
- **Dictionary visible directly**: lookup / word detail shows available licensed source-backed POS, senses, morphology and examples. Study front may conceal answers; **one reveal** shows current-context dictionary senses directly; additional reviewed senses use the Owner-approved V3 expand/collapse control.
- **Our concise analysis visible directly** after dictionary: apply the complete established learning questions **Dictionary → Memory → Semantic Connection → Syntax → Concept → Contrast → Language Game → English Neighbors → Pragmatic Action → Workplace Use**. Keep user-facing text brief and naturally grouped, but review every applicable stage. For missing context mark N/A with reason; **do not invent work events or official approvals**.
- **Long analysis on demand**: two copy actions (raw English; short 【深析】 prompt) hand off to the user's existing ChatGPT Project. Copy is not grading, and does not auto-send or call a paid model API.
- **Notion role is selection-only for now**: preserve historic pages and checkboxes. All Notion restructuring/migration/71 deep-page rewrites are **PAUSED**; do not write to Notion or alter the existing daily publisher, cloud copies, schedules, or credentials.

## Delivery and approval gates

**Current assignment executed V3 Tasks 1–5 on the candidate branch; see docs/codex/v3/DELIVERY.md for evidence and remaining UAT.** The next implementation authority is docs/codex/v3/IMPLEMENTATION-PLAN.md, not the historical P1–P3 checklist. On explicit execution of that plan, complete Tasks 1–5 in an isolated branch. Use a Draft PR and retain explicit review evidence. Another release approval is required before anything reaches **main** (which auto-publishes). P4, new automation and any Notion connector need separate scope review.

Do not claim PASS when only prose, source templates, mock screenshots, static tests or a draft workflow exist. Report **IMPLEMENTED / PARTIAL / NOT_VERIFIED / BLOCKED / NOT_STARTED** with evidence and a specific next step.

## Codex execution pattern

- Start from the accepted V3 baseline and current v3 plan; recheck actual code/source gaps without restarting the accepted design.
- Reuse the five reviewed golden candidates, add independently reviewed V3 context bindings, and keep E quarantined. Verify six device layouts on the actual application; frozen previews are reference only.
- Do not skip a separate content reviewer: Writer ≠ Reviewer; deterministic checks ≠ semantic truth; source license ≠ unlimited permission to reproduce texts.
- Only after the user accepts the preview and explicitly authorizes code: implement the smallest incremental change with tests and rollback, preserve prior data, and keep release separate.
