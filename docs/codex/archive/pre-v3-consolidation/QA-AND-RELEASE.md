> HISTORICAL — superseded by docs/codex/v3. Links in this snapshot are historical, not maintained navigation.

# QA, negative fixtures and release gates (proposed)

**This file states tests Codex must design/execute after authorization; merely listing them does not mean they passed.**

## Q0 Baseline & permissions (blocker)

- Pin current **words-static main commit**, build artifact/source hashes and publicly accessible GitHub Pages path.
- Record baseline values: existing card IDs/order, original editorial overlays, IndexedDB versions and export/import schema, FSRS retention/settings, undo, read marks, speech preferences and separate bookmarks.
- Read only selected Notion material; keep Notion history/migration **PAUSED**. Original external vocabulary scheduler, Google Drive and OneDrive untouched.
- Record what has explicit owner authorization: review only; branch UI implementation; release; source rewrite; task cutover. An approval for one never implies the others.

**FAIL** if task unexpectedly targets local Node/SQLite experimental server, resets browser data, publishes private selection payload or writes to Notion.

## Q1 Source evidence / dictionary

- Every displayed source sense has source name/release/snapshot hash and a stable entry/sense anchor. Its POS/lemma/form is correct. Selected Chinese gloss is a verified *project teaching interpretation*, never labelled official Chinese text of a commercial dictionary.
- Different POS/homographs can coexist; selected sense is highlighted without hiding other allowed common senses.
- Exact form's pronunciation must be verified or marked unknown. Never use state IPA for stated, reverse for reversible, or concatenate fabricated official IPA for word groups.
- Composition types word/phrase/idiom/technical/sentence must be consistent with evidence. Technical standards/diagram conclusions require corresponding engineering evidence. Historic word origin requires an etymology source, not OEWN.
- Source rights and public redistribution (not just repo software license) verified per source/field/use; third-party dictionary external links are allowed as links, not automatic scraping permission.

**FAIL** examples: working universally = temporary; framing always = verb; "take into account" = bank account; source sense claims official Collins/Oxford/Cambridge origin when none licensed; source rights unknown but candidate marked APPROVED.

## Q2 Compact full-method content (required review checklist)

For an **entry with a usable original/labelled teaching sentence**, independently consider all:

| Check | PASS example | FAIL example |
|---|---|---|
| Dictionary | Correct chosen POS/sense, anchored evidence, separated from author's explanation | Pretend an unreviewed work gloss is dictionary sense |
| Memory | One accurate currently useful meaning | Unbounded one-to-one Chinese equality |
| Semantic Connection | Honest relation to lemma or phrase composition | Invented root, fabricated word-history chain |
| Syntax | Target's real syntactic role in actual sentence | Treat framing as verb when head noun |
| Concept | Specific scope with uncertainty/decision boundaries | Treat observed difference as confirmed defect |
| Contrast | Actual relevant neighbor with why it differs | Forced meaningless comparisons |
| Language Game | Plausible situated discussion following current utterance | Universal organization workflow implied by the word |
| English Neighbors | 2–4 natural chunks with explanation of connection | Random key word list/fictitious frequency |
| Pragmatic Action | Distinguishes clarify/request/qualify from official authorization | "Please confirm" = formal approved |
| Workplace Use | Natural one/two short field-relevant sentences, marked educational | Fake source quotation or unrelated manufacturing examples |

If there is **no real context**, a missing real-world action can be **NOT_APPLICABLE_WITH_REASON**, with optional clearly hypothetical illustration. Do not add fake content to turn N/A into apparent PASS. **Review all stages; render them in 4–5 grouped paragraphs**, not 10 repetitive headings.

Stage verdict enum: **PASS / NOT_APPLICABLE_WITH_REASON / NEEDS_EVIDENCE / FAIL**. Aggregate APPROVED requires all applicable stages PASS, no rights/privacy/identity block, plus exact payload hash. Missing data can yield QUARANTINED (not publishable). A script checking keys exist is only structural QA and cannot replace content review.

## Q3 Goldens and negative counterexamples

Must cover at least six, each with actual displayText, evidence, word class, original-vs-teaching-example tag, and compact paragraphs:

1. **shift**: noun shift=next work period vs verb shift=move/transfer; in "before the next shift" shift noun; contrast handover/changeover. **Reject** next shift as "next transition."
2. **working definition**: working practical/temporary-basis/operative/functioning, avoid both working=temporary everywhere and banning "provisional" when valid in context; distinguish recommendation to agree from actual official approval.
3. **frame/framing/outcome framing**: POS difference, outcome noun modifier, framing noun head, frame noun/verb relationship; free combination not automatically an attested idiom. **Reject** framing-as-verb for this phrase.
4. **take into account**: idiomatic "consider a factor," not "take bank account"; clarify consider vs take X into account.
5. **functional seating surface**: confirm functional contact/seating in assembly; no fabricated drawing face number/datum/tolerances/customer authorization.
6. **conditional schedule sentence**: If management asks whether the schedule is safe, answer with conditions. Explain whether clause/if/safe/current scope; NOT a blanket schedule guarantee.

Additionally test: **pending vs pending approval**, **due by time vs due on day**, **lead** (metal vs guiding), **stated** pronunciation, **reversible** and **approval vs acceptance**. Report expected and actual outputs and reviewer disposition. Six-golden pass is **not** 1,875-card semantic pass.

## Q4 Privacy, source identity & content

- No private Notion URLs, source IDs that reveal private pages, emails, Windows user paths, tokens, work email paragraphs, or confidential client/customer terms added to static JSON/docs/screenshots.
- In public content, mark **generated_example** vs **original_sentence** accurately, with permission to publish exact source text. Source data license restrictions may block publishing. Keep original private source only in protected staging, not a public Git history.
- New source IDs checked against every previous batch. If a new batch reuses 2026-10-29 IDs for different 2026-10-30 content, block until mapped. No auto-overwrite and no rebasing by term.
- Edits invalidate the reviewed hash. Unknown dictionary origin or inactive QA status must be visible as unreviewed; cannot silently substitute a generic model hallucination.
- User's existing grades/bookmarks/reading event data must never enter GitHub commit or AI content logs. No automatic external ChatGPT API on copy.

## Q5 Existing repository baseline tests

Relevant executable commands (run in authorized **isolated checkout**, not claim success from documentation):

~~~bash
npm ci
npm test
npm run build
npm run test:browser
~~~

**Real dependency caveat**: the existing browser tests use Playwright Chromium, and on non-Windows the **CHROMIUM_PATH** environment variable needs a valid installed browser executable. A future CI must install browser dependencies and set this path, not falsely mark browser PASS after only npm test. The tests/content.test.mjs baseline currently expects **1,875 cards**, so updating source batches needs an explicit approved count-aware test, not deleting a failing assertion without verifying identity.

Proposed new tests:
- dictionary no-modal direct rendering of all selected legitimate senses after lookup and one reveal;
- compact analysis direct rendering; per-stage reviewer complete vs N/A and source tag;
- copy original exactly and deep prompt with correct "原句"/"学习例句"; no clipboard success on rejection;
- return/back and no implicit grade while viewing dictionary/short analysis;
- sense selection vs homograph; idiom/composition; unknown/missing source fallbacks;
- user state compatibility with old exported backup, multi-tab race, undo, due dates, local speech consent;
- mobile widths **320/390/768** and desktop **1024/1440**; no clipped scroll / fixed grade bar overlap, keyboard and screen reader labels;
- changed content hash means previous approval invalid, 125 source ID conflict causes quarantine, private text is not packaged.

After pass: independent evidence-based review with findings severity and real before/after browser screenshots.

## Q6 Deployment: important implicit main push trigger

**.github/workflows/pages.yml** automatically starts on push to **main** (also workflow_dispatch) and has page-writing permission. Publishing approval is **not technically enforced by a markdown TODO**. Until separately authorized and configured:
- Work in planning/feature branch, Draft PR, **never merge as part of generating templates**.
- Propose a PR validation workflow separately; it must not upload/publish site artifacts. See **workflows/PR-QUALITY-GATE.proposed.yml**.
- Before official merge: approved preview, tested public asset license/privacy scan, original card IDs/FSRS snapshots unchanged, explicit user's release approval, operator checks Pages mechanism.
- After GitHub Actions succeeds: verify actual public URL, content bytes/build SHA, at least six goldens in the real live browser, copy, grading, imports and content appearance; use a **disposable test browser profile**, never modify the user's stored progress.
- Failure/outcome-unknown: stop, preserve evidence, correct forward or use compatible code rollback. Do not delete IndexedDB to force green.

**A plan / PR / static screenshot ≠ implemented; a Pages success ≠ product accepted.**

## Q7 Reporting template

Use:
~~~text
Review target: repository @ SHA, PR, snapshot sources
Scope: dictionary X/Y / compactAnalysis X/Y / deep-copy X/Y
Status by gate: Q0–Q6 PASS / FAIL / PARTIAL / NOT_VERIFIED / BLOCKED
Six goldens: each PASS / FAIL / NOT_REVIEWED + source evidence
Independent reviewer: run ID, separate context, exact candidate hash
Old data: original cards, FSRS events, read marks, backup and bookmarks comparison
Notion: REORGANIZATION_PAUSED / SELECTED_TERMS_ONLY / NO_WRITES
Public website: unchanged unless explicitly released; verify pages run and URL if released
Outstanding gaps: owner decisions, source license, mobile devices, build bottlenecks
Next authorization required: explicit narrow scope
~~~
