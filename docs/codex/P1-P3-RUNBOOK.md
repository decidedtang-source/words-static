# P1–P3 candidate: manual reviewed content workflow

Status: non-main implementation; production release requires G2. GitHub Pages remains the official product. Notion is selection-only, with no writes, historical migration or scheduling changes.

## Reproduce the candidate

```text
npm ci
npm test
npm run build
npm run test:browser
node scripts/build-reviewed-batch.mjs --manifest content/manifests/2026-10-31-goldens.json --out local-evidence/reviewed-batch
```

Run the final command twice: an identical staging directory succeeds without duplicate additions; a different existing destination is rejected. Build writes only `dist`; staging does not modify the base vocabulary, learning data or production. Serve `dist` over localhost HTTP to inspect the actual app. Test browsers use isolated profiles; real user records were not opened or graded.

## The next authorized manual batch

1. Selector supplies an explicit authorized list. Keep private selection records outside this public repository. Resolve stable IDs against the exact compiled base; identical spelling is not proof of identical learning context. No directory-wide intake or Notion connector exists here.
2. Writer uses the checked-in schemas and CONTENT-CONTRACT v1. Supply licensed source entries and snapshot evidence; put Chinese teaching summaries and five concise groups in the analysis, covering all ten stage keys. Missing source facts stay missing. New quoted-original intake currently fails closed; this batch uses generated educational examples.
3. Freeze canonical UTF-8/LF projection bytes. A separate reviewer checks the source snapshot, rights, privacy, Chinese accuracy, every applicable stage and identity. Bind the actual review receipt to candidate, base, source-manifest and rule-version hashes. Sample receipts are BLOCK; metadata alone cannot prove that a real independent person/agent reviewed the content.
4. Add only the approved public projection, source manifest, receipt and operation manifest. `content/active-batches.json` is the explicit ordered allowlist. Each subsequent manifest must bind to the prior compiled vocabulary, analysis and catalog, not the original base files. Run the entire active chain with `npm run build`; `--manifest` replays the explicitly active predecessors through the requested target. The CLI rejects a target outside the allowlist.
5. Inspect additions/revisions/withdrawals and coverage separately. Old 1875 cards remain unchanged; this batch adds A/D/F and attaches analysis to existing B/C. E remains quarantined. Current fully reviewed dictionary+analysis+copy coverage is 5/1878; copy actions still work for legacy cards, whose older dictionary coverage is a separate measure.
6. Open a content Draft PR with exact hashes, reviewer report, diff, tests and rollback choice. If the legacy publisher changes base bytes, the build intentionally fails: reconcile and re-review against the new base. Do not bypass hashes or silently switch the publisher.
7. Owner checks desktop/mobile study, lookup, direct dictionary, concise analysis, both copy actions and backups. Only explicit G2 authorizes main merge/Pages publication. After that authorization, verify deployed commit/artifact/version at the existing URL. This run does not execute that step.

## Rollback and limits

- Before merge: discard/revise the candidate branch; production and records are unaffected.
- Content-only after a future release: retain the compatible UI, build a reviewed withdrawal/revision batch, and preserve retired IDs. The queue excludes withdrawn cards; history keeps their IDs and events while hiding withdrawn detail. Keep the complete hash-addressed bundle together.
- Full application rollback: restore the previously accepted Git commit and redeploy only with release authority. Do not clear IndexedDB. The old UI may lack the new retirement placeholder, but stored events and bookmarks must remain exportable. Restore bundles as complete versions, never copy individual JSON assets between versions.
- Published content is public. Privacy exposure requires stopping further publication and Owner incident handling; reverting Git cannot guarantee deletion of all copies or caches.
- No automatic cross-device progress sync, full offline app cache, P4 feature packages, schedule takeover or Notion migration is delivered. Safari/iOS hardware UAT and mobile slow-network measurement remain unverified; Chromium viewport tests do not substitute for them.

The initial source snapshot was checked independently; future source-manifest provenance and reviewer independence remain maintainer trust gates. The deterministic validator verifies structure and exact bindings, not semantic truth or identity authentication.
