# Codex handoff: templates, goals and future update workflow

**Latest scope: Owner authorized P1–P3 branch implementation. See [implementation status](IMPLEMENTATION-STATUS.md) and [candidate runbook](P1-P3-RUNBOOK.md). This branch is not deployed; main/Pages release remains a separate Owner gate.**

**2026-10-31 independent review:** Start with [review results, six page previews and implementation plan](review-2026-10-31/README.md). The review records template/schema conflicts and proposed resolutions; the original proposals are design history; implemented gates and remaining gaps are recorded in IMPLEMENTATION-STATUS. Terminal: **READY_FOR_OWNER_REVIEW**. No main update, Pages deployment, Notion write or schedule change is authorized by these planning artifacts.

## 1. The target outcome (what the user actually sees)

The product is **the already deployed GitHub Pages vocabulary website**, not a new server. It should feel as complete and fluent as a mature MaiMemo-style vocabulary app, while adding the user's own English-explanation method.

The normal study sequence is:

1. Choose a word/phrase/sentence from the user's selected study set (Notion is **only a selection/source input**; no historical Notion migration).
2. During learning, show the English target first so recall remains possible; lookup mode is unmasked.
3. After one **Reveal** action, display all source-licensed and reviewed dictionary senses for this entry **directly**, organized by part of speech, with pronunciation, example and word-family evidence. No secondary dictionary modal/accordion needed to get basic meanings.
4. On the **same page**, show our short but substantive **complete-method contextual analysis**. Its analysis checks follow Dictionary → Memory → Semantic Connection → Syntax → Concept → Contrast → Language Game → English Neighbors → Pragmatic Action → Workplace Use. The UI can group them into 4–5 short paragraphs. Every applicable stage needs real content; without context, mark N/A, never fill gaps by fictional narratives.
5. The user can grade **Again/Hard/Good** with existing FSRS and can separately **Copy Original / Copy 【深析】**, manually paste/send to ChatGPT for more detail.

**Different things that must not be conflated:** basic dictionary sense; user-friendly memory gloss; morphology; compositional phrase interpretation; sourced sentence; original educational example; actual professional practice; speaker's pragmatic action; historical etymology.

## 2. What is in this planning branch

| File | Purpose / acceptance product |
|---|---|
| **AGENTS.md** | First-page Codex rules and risk boundaries |
| **PRODUCT-ACCEPTANCE.md** | Concrete mature-product UI states and measurable owner acceptance |
| **CONTENT-CONTRACT.md** | Data shapes, provenance, separate dictionary vs compact analysis and coverage accounting |
| **UPDATE-WORKFLOW.md** | Future manual-to-GitHub content pipeline, states, idempotence, rollback, approvals |
| **QA-AND-RELEASE.md** | Deterministic + independent semantic QA, privacy and non-loss regression gates |
| **GOLDEN-CASES.md** | Six realistic content examples and common invalid interpretations |
| **templates/selection-packet.example.json** | A safe **illustrative** selected-target input |
| **templates/entry-with-analysis.example.json** | Candidate dictionary anchors + full-stage short analysis |
| **templates/reviewer-verdict.example.json** | Separate reviewer verdict schema; NOT actual signed approval |
| **templates/MAIMEMO-WEB-PARITY-REVIEW.md** | Evidence-based feature-by-feature mature-Web comparison |
| **templates/CONTENT-UPDATE-REPORT.md** | Repeatable per-batch counts, reviewer evidence and publication status |
| **templates/OWNER-PREVIEW-ACCEPTANCE.md** | User-visible real-content UAT and separate design/implementation/release permissions |
| **prompts/CODEX-KICKOFF.md** | Copy/paste first-turn request for future Codex |
| **prompts/CONTENT-WRITER.md** | Writer's responsibilities, required draft output and no-hallucination rule |
| **prompts/INDEPENDENT-REVIEWER.md** | Separate reviewer checklist and stop/fail rules |
| **prompts/NEXT-VOCABULARY-UPDATE.md** | Copy/paste prompt for future authorized manual batches |
| **workflows/PR-QUALITY-GATE.proposed.yml** | **Proposal only** for a safe pull-request quality check; not installed as a production GitHub Action |

All sample JSON and sample interpretations are **training examples, not production-ready semantic QA receipts**. Never publish sample entries as if an independent reviewer approved them.

## 3. Repo-specific reality checks before generating new specs

The official repo already has:
- **scripts/update-vocabulary.mjs**: reads dated source files, rejects duplicate IDs across all dates, builds source records and calls enrich.
- **scripts/enrich-vocabulary.mjs**: joins exact **content/YYYY-MM-DD.json** overlays, demands a short gloss and 2 bilingual examples; first English example exactly matches the original source sentence.
- **scripts/build.mjs**: bundles **src/app.mjs** and ships public index/styles/vocabulary/licenses.
- **dictionary/catalog.json**: 2026-10-31 snapshot has **21 OEWN headwords, 28 POS-specific entries and 40 selected senses**, not a whole English/Chinese dictionary.
- **dictionary/bridges.json**: a handful of project-authored phrase interpretations; not a generic fixed-idiom dictionary.
- **src/app.mjs / lexical-ui.mjs**: current short-gloss-first UI with optional details/modal, the behavior the user rejected.
- **src/copy.mjs**: already supports exact copy and 【深析】 with source/example labels.
- **.github/workflows/pages.yml**: **push to main automatically builds/deploys**; never edit main as a side effect of planning.

**Important conflict**: at least one selected source batch dated 2026-10-30 reuses IDs from 2026-10-29 for different entries. The importer must **quarantine** these instead of merging by spelling or silently reassigning. Do not bypass the duplicate-ID validator; identity mapping requires separately reviewed evidence.

## 4. Scope and relative priority

**P0 (review/previews):** Audit existing code & current pages; compare actual MaiMemo Web features with gaps; confirm licensing and dictionary coverage; build six real-content sample pages; define content schema/reviewer contract and show them to owner.

**P1 (later, separately authorized):** Add reviewed compactAnalysis sidecar and direct-view dictionary UI to existing words-static. Keep originals, indices and user state. Make PR-only tests prove layout and no learning-state mutation.

**P2 (later):** Build private selection packet intake → source/resolver → writer → independent reviewer → static overlay PR; create hard release gates and audit trail. Prioritize quality/partial approval over fixed daily quantity. Source word selection may be manual.

**P3 (later):** Expand source-licensed dictionary data, advanced vocabulary features and measured MaiMemo Web parity; incremental releases after owner review; address sync only with separate security/backend consent.

**PAUSED**: Notion mass editing, native block migration/checkbox replay, 71 deep-page restructuring, competing daily publishers or changes to existing scheduled tasks.

## 5. Codex outputs for the next review, not vague promises

The reviewer must deliver:
- A **real feature matrix** mapping MaiMemo Web capability → current words-static evidence → actual gap → viable independent implementation → preview/UAT acceptance.
- **Six complete, legible goldens** with dictionary facts, short staged analysis, sources and safe deep-copy; mobile + desktop preview. Mark unavailable dictionary senses as gaps, not fake entries.
- A **field-by-field design** for how new candidate entries and analysis overlays become static public vocabulary JSON, which source files change and which are read-only.
- A **phase-and-risk plan** with test commands, exact stop gates and what requires additional explicit owner authorization.
- Clear status after stopping: **READY_FOR_OWNER_REVIEW**, not DEPLOYED or FULL_DICTIONARY_DONE.

## 6. Canonical design links

- User's current GitHub-first decision: https://github.com/decidedtang-source/domain-services-plan/blob/planning/words-v2-lexical-foundation-2026-10-31/docs/product/2026-10-31-github-first-notion-selection-only.md
- Product parity/mandatory full mini-method: https://github.com/decidedtang-source/domain-services-plan/blob/planning/words-v2-lexical-foundation-2026-10-31/docs/superpowers/specs/2026-10-31-maimemo-web-parity-and-mandatory-compact-seven-step.md
- Website UX issue: https://github.com/decidedtang-source/words-static/issues/2
- Content pipeline issue: https://github.com/decidedtang-source/words-static/issues/3
- Project instructions in this repo: **docs/CHATGPT_PROJECT_INSTRUCTIONS.md**
