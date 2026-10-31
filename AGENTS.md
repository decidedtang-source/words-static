# Codex working contract — Words Static / English Vocabulary

**Status: Owner authorized P1–P3 non-main implementation after PR #4 preview review. Production release remains separately gated.**

This repository is the user's **official vocabulary website**, published at https://decidedtang-source.github.io/words-static/ . Its **main** branch triggers GitHub Pages deployment. Do not switch the product to the separate experimental Node/SQLite app, invent a second daily generator, or treat documentation commits as product delivery.

## Approved UI version — 2026-11-01

**WORDS-STATIC-UI-V3 is the Owner-approved new UI baseline.** Read [the frozen V3 registration](docs/design/words-ui-v3/README.md) and its exact preview before UI work. It supersedes V1/V2 and the earlier all-senses-always-visible requirement. Current-context senses are direct; additional reviewed senses are expandable. Design approved does not mean runtime integrated or Pages deployed.

## Before doing any work

1. Read **docs/CURRENT_OFFICIAL_BASELINE.md** and **README.md**.
2. Read **docs/codex/START-HERE.md**; then its linked **PRODUCT-ACCEPTANCE**, **CONTENT-CONTRACT**, **UPDATE-WORKFLOW**, **QA-AND-RELEASE**, and **GOLDEN-CASES**.
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

**Current assignment is P1–P3 implementation in an isolated branch**, following docs/codex/review-2026-10-31/IMPLEMENTATION-PLAN.md. Use a Draft PR and retain explicit review evidence. Another release approval is required before anything reaches **main** (which auto-publishes). P4, new automation and any Notion connector need separate scope review.

Do not claim PASS when only prose, source templates, mock screenshots, static tests or a draft workflow exist. Report **IMPLEMENTED / PARTIAL / NOT_VERIFIED / BLOCKED / NOT_STARTED** with evidence and a specific next step.

## Codex execution pattern

- Start with a **source-and-UX gap assessment** against the live repository and MaiMemo Web evidence.
- Next produce **six independently reviewed, real-text golden examples** with dictionary, concise complete-method analysis, and deep-copy string; create mobile+desktop preview in isolation.
- Do not skip a separate content reviewer: Writer ≠ Reviewer; deterministic checks ≠ semantic truth; source license ≠ unlimited permission to reproduce texts.
- Only after the user accepts the preview and explicitly authorizes code: implement the smallest incremental change with tests and rollback, preserve prior data, and keep release separate.
