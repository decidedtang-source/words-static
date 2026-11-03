# Execution ledger — QUALITY-REASSESSMENT.md, five-card calibration

Owner correction: zone QA means the entire card, not only g1—g5. Implemented whole-card/1 default gate, 8 additional module receipts per card, mandatory sourced etymology and reviewed headword/examples. Historical five-zone-only delivery is not full-card approval.

Whole-card verification: 11 added negative/positive tests (including a missing-writer test observed RED with recomputed hash then GREEN), plus zone-only bypass regression. verify.mjs now clears previous acceptance, builds only after all modules pass, checks six viewports including exact etymology text/source switching and four copy buttons in success/denied modes, and binds acceptance to current artifacts. Frozen DOM/CSS remains unchanged; source attribution corrections only. No main/Pages/learning-state changes.

Base: 376190b67da994c645b481ba791a5f8a9e76c600. Owner explicitly authorized implementation, five full previews and zone scores; no publishing and no layout change.

Preflight interfaces: Writer supplies entries/claims/source evidence/front senses; validator checks structure; independent Reviewer supplies per-claim checks, front verdict and 5×4 scores bound to a canonical hash. Renderer uses only frozen template data slots. Scores are separate artifacts.

Ruling: implement an Agent-assisted workflow, not a background model API. Actual research/writing/review occur in this session; the reusable CLI persists state, blocks gaps/stale reviews, scores, and packages. This preserves the existing no-new-scheduler boundary.

Ruling: existing isolated candidate worktree is sufficient; no main mutation. The one content Writer is separated from the final whole-branch/content Reviewer as AGENTS requires. Implementation stays with the coordinator.

Task 1: 18 negative/positive workflow tests were run RED with missing core.mjs, then GREEN after implementation (18/18). Synthetic fixtures are test-only and never content approval.

Task 2: complete. CLI implemented for atomic per-entry checkpoints, state/history, independent score report, validate-only, gated frozen-template preview. Real limit=2 -> full resume -> independent review transition recorded in trial history.

Task 3: complete. Independent reviewer evaluated 30 claims and 25 zones/100 score dimensions. Five candidates passed each zone, with nonblocking editorial suggestions preserved. Whole-branch review fixed stale unprocessed scores and mapping of reviewed translation/POS; targeted tests grew to22 including filtered expanded senses and immutable zone titles. Each new defect test was observed RED then GREEN.

Task 4: complete. Frozen-template build hash verified. Six viewports x five cards=30 Chromium checks passed; desktop/phone screenshots inspected. Scope remains static reading candidate, not live application or publication. See trial DELIVERY.md and evidence for precise coverage.
