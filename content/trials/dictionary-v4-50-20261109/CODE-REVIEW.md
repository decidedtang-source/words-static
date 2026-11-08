# Independent technical code review — V4 candidate

Reviewer: /root/code_reviewer. Date: 2026-11-09. Scope: candidate validator, builder, browser checker, report generator, unit tests and review-generation helpers. Baseline HEAD supplied: 44b1639; candidate files are untracked. No production/source/content edits made by this reviewer. Content semantics are reviewed separately.

Assessment: CHANGES_REQUESTED. One high-priority approval-integrity issue and two medium-priority gate issues should be resolved before the candidate is described as fail-closed. No production integration or deployment approval is given.

## P1 — Stored review generators can reapprove changed content without review

Location: `write-six-final-review.mjs:13` (candidate directory); the same fingerprint-refresh pattern occurs in `write-six-review.mjs:44`.

The final-review helper reads current cards.json, recomputes `fingerprint(c)`, then assigns PASS and static scores/reasons from an earlier human/agent review. After changing a Bridge or dictionary sense, rerunning this helper silently creates a fresh matching independent receipt under the old reviewer identity. `validateReview` can no longer detect the stale judgment. This does not allege that the existing reviewer failed to review; it is a reproducible future reapproval path in the submitted artifact.

Required remedy: make approval artifacts immutable, or pin the exact reviewed fingerprints in the helper and abort if current cards differ. Regenerating formatting is fine; regenerating approval fingerprints from arbitrary current content is not. Apply to any subsequent all-batch review helper as well.

## P2 — Review validation ignores review contract and mandatory migration/transfer evidence

Location: `scripts/five-zone-workflow/v4.mjs:16-19`.

`validateReview` never checks `ruleVersion` or `transferCheck`. Reproduction against the existing first six-word receipt: delete both fields, call validateReview with its matching card, and receive `[]`. Thus a receipt not identifying which review rubric it used, or lacking the explicitly required transfer test, passes the supposedly fail-closed gate. Existing receipts use `dictionary-v4/1`, while V4_RULE is `dictionary-bridge-five/4`; the intended content-review version should be explicit rather than assumed to equal the build version.

Required remedy: declare and enforce the accepted content-review schema/rule version and nonempty transfer evidence. Add negative tests for absent/wrong versions and missing transfer evidence. This is structural enforcement only; semantic adequacy still needs the independent reviewer.

## P2 — Six-demonstration build accepts an incomplete demonstration set

Location: `scripts/five-zone-workflow/build-v4.mjs:3-6`.

`--six` filters whichever requested terms happen to be present, but the sole count check is guarded by `!demo`. A dataset missing working definition, shift or another required demo can still produce a successful five-card (or even empty) six-build receipt if reviews match the remaining cards. This weakens the explicit six-before-expansion gate.

Required remedy: assert the exact six expected terms/IDs are present once each before validation/build; ensure review coverage is exact for the selected set. Test an omitted demo and unexpected/duplicate reviews.

## P3 — Card schema omits fields directly consumed by the renderer

Location: `scripts/five-zone-workflow/v4.mjs:7-15` and `build-v4.mjs:17`.

Deleting `word` from an otherwise valid card returns no validateCard errors (verified). The builder serializes the card successfully after a matching receipt, but the browser renderer then dereferences w.pos and crashes. Validate the word object and essential display fields/examples before emitting a preview. This is not an observed defect in the current 52 records; all current cards pass the validator.

## Verification and boundaries

- Independently ran `node --test tests/dictionary-v4.test.mjs`: 4/4 pass.
- Independently checked all current 52 cards: existing validateCard returns no errors.
- Reproduced missing word and missing review version/transfer evidence acceptance in memory; no candidate data was mutated.
- Inspected escaping, safe HTTPS authored links, explicit current-sense ID marker, details controls, search/no-result handling and clipboard rejection fallback. No additional concrete exploitable issue was identified in those paths.
- Raw legacy source HTML is deliberately trusted and compared against before.json. That comparison proves agreement with the snapshot, not independent immutability of the snapshot; preserve a separate frozen-file diff/hash check in final delivery evidence.
- Browser checker covers six viewport sizes, all cards, expanded source/B/C overflow and mocked clipboard success/rejection. It is Chromium viewport emulation, not physical-device or real clipboard authorization testing. I did not rerun that suite during this review because final content/reviews are still being finalized.
- New code operates on static candidate previews. No src/app, FSRS, IndexedDB/storage, production data or publishing paths are changed in the visible working-tree status. Passing preview checks does not establish integrated-runtime acceptance.
- Transparent/lexicalized Bridge reasons are recorded in data and included in QUALITY.md by the report generator; brevity is permitted by the stated specification. Semantic correctness and duplicated teaching layers remain the independent content reviewer's responsibility.
- Current in-progress absence of final batch reviews/reports is not treated as a finding. Existing parent-reported 82 unit and 15 browser passes were not independently rerun by this reviewer and are not claimed as fresh evidence here.

## Follow-up verification — same review session

The implementer addressed the three blocking findings during review:

- P1 resolved: independently confirmed both `write-six-review.mjs` and `write-six-final-review.mjs` no longer exist. The already-issued JSON/Markdown judgments remain the historical evidence. Subsequent reviewer helpers must not re-sign changed cards.
- P2 review contract resolved: validateReview now requires `dictionary-v4/1` and nonempty transferCheck. Negative coverage added.
- P2 six-set gate resolved: builder now requires six expected terms and six unique matching receipts. Negative incomplete/empty-set coverage added.
- Independently reran the updated test file: **6/6 PASS**.

Updated assessment: **NO OPEN P1/P2 TECHNICAL FINDINGS**. P3 word-schema robustness remains a nonblocking improvement. Final content QA, full preview browser evidence, immutable frozen baseline checks and final candidate packaging remain the implementer's delivery work; this assessment does not assert those in-progress steps complete.

## Implementer resolution after review
P3 is treated as a schema completeness issue and fixed: missing word / POS / examples now fail validation. Added negative regression, observed RED then GREEN (7/7). This is implementer verification, not a second independent review. Source notice local snapshot links are now packaged; browser checker asserts local link targets exist.
