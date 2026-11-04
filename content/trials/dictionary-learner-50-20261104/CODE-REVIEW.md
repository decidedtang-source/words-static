# Independent implementation code review — learner dictionary

Reviewed 2026-11-04 on candidate branch `trial/five-zone-50-20261103`, HEAD `52d7ac994a87e2166368b2e373bbab5885cb772d` plus uncommitted learner workflow changes. Scope: learner validator/renderer, builder/verifier, browser checker changes, unit tests, and LEARNER-DICTIONARY-QA. Semantic review of the 50 cards remains separate. No release approval is implied.

## Finding requiring correction

**P2 — Validate every rendered source URL, including unused sources.** In `scripts/five-zone-workflow/learner-dictionary.mjs:10`, the validation applies HTTPS checks only to `senses[*].sourceUrls`. The renderer at line 24 emits all `card.sources` directly into href attributes. A card with a valid HTTPS sense source and an additional `javascript:alert(1)` source passes the full review gate with a matching receipt and renders the unsafe href. HTML attribute escaping does not validate URL schemes. The same gap permits malformed and other non-HTTPS unused links. Require a nonempty array of valid HTTPS URLs for `card.sources`, then check sense-source membership; add a regression test for an extra unsafe source and malformed URLs. Demonstrated output: `{"status":"CANDIDATE","unsafeHref":true}`. Actual script execution was not tested or claimed.

## Verification and other observations

- Ran `node --test tests/learner-dictionary.test.mjs`: 4 tests passed, 0 failed.
- Independently reproduced the source URL bypass using an in-memory fixture; no candidate data was modified.
- The learner fingerprint binds the full card and rule; stale context, Bridge, examples, and sources invalidate its receipt.
- All six new quality criteria, zero known gaps, per-sense source support, distinct writer/reviewer, and dimensional score floors are checked.
- Builder verifies both inherited artifact locks, rechecks raw dictionary review evidence, and changes only the dictionary module score and dictionary HTML/title. Browser checker compares non-dictionary DOM and checks every learner field across six viewport sizes.
- The verifier deletes prior acceptance before rebuilding; failed content or browser checks cannot issue new acceptance. Browser/build receipts can remain from earlier runs, but are not accepted by the verifier without rerunning both stages.
- Candidate acceptance and browser validation were not run by this reviewer because independent semantic receipts were pending; no READY or product-complete assertion is made here.

Assessment: fix the P2 source URL gap before final candidate verification. No additional implementation blockers identified in this review. No commit, deployment, production data, or external write performed.

## Independent narrow recheck — P2 resolved

Re-read the URL validator and regression test after the correction. `checkLearner` now parses every entry in `card.sources` and requires HTTPS, a hostname, and no embedded username/password. This closes the reported unused-source bypass before candidate acceptance. The added test uses an updated fingerprint for each mutated card, so rejection proves URL validation rather than stale-receipt detection.

Independently reran `node --test tests/learner-dictionary.test.mjs`: 5 tests passed, 0 failed, including unused JavaScript URLs, malformed HTTPS URLs, and embedded credentials. The previously reported P2 is **RESOLVED**. No remaining implementation blockers from this review; final semantic receipts and candidate/browser verification remain the coordinator's separate gates. This recheck changed only this review document.
