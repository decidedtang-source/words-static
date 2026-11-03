# SDD ledger — plan: docs/codex/review-2026-10-31/IMPLEMENTATION-PLAN.md

Authority: Owner replied 执行 after design handoff. Execute P1–P3 on non-main branch; release/Notion/schedules remain excluded. Base dd4eee9; production cfa2ecc. Existing linked worktree reused; branch feature/words-static-p1-p3.
Baseline: npm ci exit0, audit0; npm test 11/11.
Pre-flight P1→P2: AnalysisEntry/cardId/revision shared; runtime uses same validated source projection. P1→P3: projectionBytes/receipt/sourceManifest/baseManifest; builder consumes complete PublishedCard for add. P2→P3: content-manifest/revisions/retiredIds shared.
Ruling: P1–P3 are the approved execution scope; P4 selection and G2 release remain gates — matches preceding handoff, cost: later release requires Owner action.
Ruling: skill task-start parser expects numbered Task headings but plan uses P1/P2/P3; keep plan immutable and record equivalent task briefs/base/test commands in this ledger — avoids rewriting accepted design, cost: helper automation replaced by explicit records.
Task 1: in_progress; BASE dd4eee9. Brief: strict public schemas, byte-bound independent receipt, source/identity/privacy rejection, revision-aware analysis loading, consistent templates. Test node --test tests/reviewed-content.test.mjs then npm test.
Task 1: complete; RED missing validator, GREEN reviewed-content 6/6 and full unit 17/17. Ruling: generated-only new intake and sourceManifestHash binding. Task 2: in_progress; bundle/entry view/browser compatibility.
Task 2: complete; shared direct view/hash bundles; RED missing modules and timeout/history defects -> GREEN.
Task 3: complete; pure reviewed builder and explicit active chain; RED missing builder -> GREEN; actual five-item independent source/semantic receipt, E quarantined.
Ruling: compile explicit active batches into dist and retain legacy base unchanged; P2/P3 share one integration commit because build/runtime interfaces depend on each other. Cost: upstream base changes require rebase/re-review rather than silently rebuilding.
Final: fixed late pending-update race, same-revision rollback, stale withdrawal DOM, full-body timeout, second-batch CLI — all reproductions RED→GREEN; final unit 30/30, browser 9/9, build exit0.
Final: Ruling: use session render hash in addition to revision for rollback protection; numeric revision remains deterministic within the active chain. Cost: future renderer inputs must be included in the hash.
Final: Ruling: global catalog source metadata is not currently displayed, so per-card hash remains card/analysis/entries; displayed source/release fields are hashed. Cost: expanding metadata display requires updating hash inputs.
Final: minor (deferred): none.
Final review: independent fresh read-only agent p1_p3_final_review, five findings fixed in one TDD pass; no re-review. Source content receipt unchanged. Owner hardware UAT and G2 remain pending.
