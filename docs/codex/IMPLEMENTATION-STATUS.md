# P1–P3 implementation — READY_FOR_OWNER_REVIEW

**规划整理完成：见 [V3总规划](v3/README.md)。下方30/9为旧P1–P3历史结果，不是V3运行验收。Task1–6尚未执行。**

**2026-11-01：新版 UI-V3 已获 Owner 正式确认并注册。** [以此冻结版为实施基线](../design/words-ui-v3/README.md)。V1/V2 布局被取代；此前候选运行代码尚待整合 V3，历史测试不代表 V3 已上线。

Owner authorized non-main implementation with “执行” after the preview handoff. Planning base: `dd4eee9ac661ba91acf1ca5a6948332db4b1c383`. Production main rechecked on 2026-10-31: `cfa2ecc19fddf2fac7508c642f8580b1b5a85838`, unchanged. This is a working application candidate, not a deployed version. G2 release is NOT_AUTHORIZED; P4 is NOT_STARTED.

| Phase | Delivered | Evidence |
|---|---|---|
| P1 IMPLEMENTED | Strict public schemas, canonical byte hashes, allowlist/source/receipt validation, independent reviewer binding, revision-aware analysis lookup | Negative tests reject altered hashes, self review, templates, missing stages, invalid references, private fields and wrong source senses |
| P2 IMPLEMENTED | Shared front/revealed/lookup renderer; direct dictionary + five concise analysis groups; hash-addressed complete bundles; pending-update, rollback and retirement protection | Browser tests on actual built app at 320/390/768/1024/1440; FSRS, backup, bookmarks, copy failure, two tabs, speech consent and next-card scrolling preserved |
| P3 IMPLEMENTED | Explicit active batch chain; pure builder; atomic isolated staging; idempotent CLI; genuine five-item independent content review | Full chain + second-batch add/revise/withdraw CLI tests; unchanged original 1875 cards; +3 cards, +2 old-card analyses; E quarantined |

## Final verification

- `npm test`: **30 passed, 0 failed**.
- `npm run build`: **exit 0**, `BUILT_NOT_PUBLISHED`.
- `npm run test:browser`: **9 passed, 0 failed**, isolated Chromium profiles.
- Candidate content release ID: `569de5f8326d08c698ac95e561afcc0276229d3c9e54668429eaa4d7752bf448`.
- Candidate projection: 37,888 bytes; app gzip: 30,380 bytes, within the planned 500 KiB / 250 KiB budgets. These are size checks, not mobile slow-network timing measurements.
- 1878 compiled cards; fully independently reviewed new dictionary/analysis/copy set: **5/1878**. Existing copy support and older lexical coverage remain separate; this is not a claim that all legacy cards passed the new review.
- A/D/F are new cards; B/C retain their old IDs and original card bytes. [Content review](p1-p3-content-review.md) binds the exact candidate hash and independently verifies 14 source entries / 28 senses / 50 stage checks. F's “by Friday” translation was corrected to include Friday before approval.
- [Desktop actual-app capture](p1-p3-evidence/working-definition-1440.jpg) and [mobile actual-app capture](p1-p3-evidence/working-definition-390.jpg). Six-case planning previews remain design evidence; E is not published content.

## Independent final code review and repair

One fresh read-only whole-branch reviewer found five issues. All entered one TDD fix pass; there was no second review or claim of independent re-approval of the fixes.

| Finding | Repair and reproduced regression |
|---|---|
| Late old manifest cleared pending-update barrier | Controller owns request-scoped pending state; old response → failed newer withdrawal → offline grade reproducer originally wrote an event, now keeps events empty |
| Same numeric revision after content rollback bypassed re-reveal | Study session additionally binds the per-card render hash; actual no-active-batch rollback now cancels the pending grade |
| Accepted withdrawal left detail/library content visible | Refresh redraws non-study content pages and invalidates detached copy controls; detail and expanded library tests now hide the retired card |
| Timeout ended at headers, leaving body/grade blocked | Deadline covers full response body; stalled-stream unit test changed from early resolution to timeout, browser test confirms controls recover |
| Second-batch CLI skipped predecessors | CLI replays only the explicit allowlist through its target; real isolated CLI tests for add/revise/withdraw and two identical runs now pass |

Each regression was observed failing before repair; the final full suites above passed. No deferred minor findings were reported. The reviewer did not flag global catalog source metadata in per-card hashes because the renderer does not consume it; displayed entry source/release fields are already hashed. If future UI displays that metadata, its render-identity inputs must expand.

## Decisions, limits and next gate

- Execute P1–P3 only; P4/G2 require later decisions. Cost: this candidate is not automatically published.
- The task helper expected numbered Task headings, whereas the accepted plan uses P1/P2/P3. Kept the plan unchanged and recorded equivalent task briefs/test evidence manually; helper tracking was not used as completion evidence.
- New original-quotation ingestion remains fail-closed pending provenance implementation. The first batch uses generated educational examples; future quotations require additional evidence work.
- Bind source-manifest bytes as well as the snapshot label. Changing excerpts invalidates the receipt and requires review.
- Compile explicit batches into `dist`, preserving the legacy source vocabulary. P2/P3 are delivered together because their runtime/build interface is shared. A future legacy base update intentionally blocks the chain until reconciled and re-reviewed.
- Use render hash as well as numeric revision for study confirmation. Revision numbers are deterministic within a batch chain, not a global monotonic release counter.
- Independent source/reviewer identity is a maintainer trust gate; deterministic code cannot authenticate a human/agent review. No new external API or secret is needed to reproduce this candidate.

Safari/iOS hardware UAT, Owner acceptance, mobile slow-network timing and live Pages deployment are **NOT_VERIFIED**. Real user records were not accessed. Automatic progress sync and full offline cache remain absent. Notion is selection-only; all historical changes and scheduled-task changes remain paused.

Next: Owner checks the actual branch app and decides G2. Use [the runbook](P1-P3-RUNBOOK.md) for manual content updates and both rollback paths. No main merge, production deployment or task change occurred in this execution.
