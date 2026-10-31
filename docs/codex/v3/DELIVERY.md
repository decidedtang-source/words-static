# V3 candidate delivery — READY_FOR_OWNER_REVIEW

Date: 2026-11-01. Official product remains GitHub Pages words-static. This is the actual application candidate in Draft PR #5, not a replacement local product. Main remains cfa2ecc19fddf2fac7508c642f8580b1b5a85838; G2 absent; Task6 NOT_STARTED.

## Delivered

- Tasks1–4 IMPLEMENTED: strict v2 presentation/sense binding with independent v2 receipt; preserved v1 contract; shared real-app front/revealed/lookup layout; top/bottom copy; expandable further dictionary; current sense directly visible; concise complete-method analysis preserved.
- Five reviewed entries: shift, working definition, outcome framing, take into account, conditional schedule sentence. E remains quarantined. Only 5/1878 cards have new reviewed context bindings; no claim of full-history review. V2 is analysis-only: old 1878 card objects remain unchanged.
- [Independent content approval](CONTENT-REVIEW.md): writer/reviewer distinct; 14 entries / 28 source senses and 50 stages checked. framing corrected to frame expression sense with explicit nominalization, not misleading planning noun sense.
- Task5 engineering verification complete; Owner real-device UAT pending. Read-only PR workflow added (contents:read; no Pages permissions). Default Playwright-managed executable removes Windows-only CI path. Remote workflow run and required branch checks NOT_VERIFIED until confirmed on GitHub; do not call workflow YAML a mandatory enforced gate.

## Verification and evidence

- npm test: 34 passed; npm run build: exit0, BUILT_NOT_PUBLISHED.
- npm run test:browser: 15 passed, exit0; includes 90 cells (5 cards ×6 viewport×front/revealed/lookup), expand/collapse and keyboard interaction, 320px, zoom-equivalent reduced viewport, existing grade/undo/backup/conflict/withdrawal/hash/stale-network guards.
- Six Chromium viewport simulations: Windows1440×810; Mac1440×900; phone390×844/844×390; tablet820×1180/1180×820. These names describe dimensions, not OS/Safari qualification. Real browser UI zoom, iOS/macOS, screen reader: NOT_VERIFIED.
- Clipboard denial at top and bottom: manually selectable payload must remain above fixed grade dock; keyboard Tab to bottom copy must remain above mobile navigation. Regression reproduced failure before CSS focus clearance repair.
- Content-update expansion regression: old DOM state could be saved against new hash; repaired by remembering rendered DOM identity. New card resets; normal dictionary-return restores view.
- [90-cell result](evidence/matrix.json), [CPU/network/size profile](evidence/profile.json). Profile: CPU3x,150ms latency,200000B/s download, real full vocabulary uncompressed. First download initially failed5s deadline; initial assets now bounded20s, refresh remains5s. This is measured load time, not a fast-load SLA. Read measured values in JSON; machine timing varies.
- Candidate content release: b4d61ac21a06d8eb1603186990caa7c6023e2d6430e112d9c17f5cbbc8c3037d.
- Candidate exact source/projection hashes and independent receipt are in CONTENT-REVIEW.md and content/reviews/v3-goldens.json. Repeated real CLI staging generated identical release bytes.
- Original frozen V3 design artifacts remain untouched. Actual application screenshots are produced at local-evidence/v3/{windows,mac,phone-portrait,phone-landscape,tablet-portrait,tablet-landscape}.png; PR CI uploads local-evidence when run. Local actual-app preview: http://127.0.0.1:18935/#entry?card=V20261029-005 (same machine only).

## Independent code review and retained limitations

One fresh reviewer /root/v3_whole_branch_final: Critical0 / Important1 / Minor1. Important fixed-bar clipping repaired with failing geometry test→passing; keyboard focus regression passed. No second independent review claimed. Slow-network fix added during review is independently unreviewed but has actual RED→GREEN profile plus regressions.

Deferred Minor: A→B→A content rollback can restore A's former expanded dictionary state. No observed reveal/grade/history bypass. Owner can accept this minor or request next candidate fix; no production promotion implied.

No FSRS parameter, event schema, IndexedDB version, stable IDs, backup protocol, current Pages workflow, schedules, cloud copies, Notion or credentials changed. Production checkout untouched. Automatic cross-device progress synchronization remains outside V3; GitHub distributes content while progress remains browser-local with explicit backups.

## Production workflow and next gate

Selection (Notion read-only/manual) → authorized public projection → Writer → independent source/semantic Reviewer → exact-hash receipt → isolated staging replay of active batches → deterministic schema/source/privacy/hash tests → unit/build/browser QA → Draft PR review → Owner G2 → main/Pages → verify public release and old-record smoke test. See OPERATIONS.md for per-step artifacts and fail-closed handling. Existing daily publisher is unchanged; this candidate does not silently switch or schedule it.

Before release: Owner checks actual candidate on available devices; record untested platforms; resolve/accept minor; verify candidate CI and required checks; separately inspect final main integration diff because PR5 is stacked on PR4. Pin exact approved commit/tree. Do not merge solely because candidate is READY.

Rollback: before release, remove candidate v2 batch reference or revert UI commits without touching IndexedDB. After approved release, deploy the previous coherent content/app bundle; never delete card identities or learning events to undo content. Keep existing manifest/hash/retirement guards, and re-reveal changed content before grading.

Terminal: READY_FOR_OWNER_REVIEW / OWNER_UAT_PENDING / NOT_DEPLOYED.
