# Dictionary V4 candidate implementation plan

Goal: preserve the frozen 50 identities and build dictionary → semantic Bridge → five distinct teaching zones, without deployment.
Architecture: versioned candidate data and preview in this directory; reuse baseline style and licensed source inventories, add a versioned validation/build entry under scripts/five-zone-workflow. No production runtime or storage migration.
Tech stack: existing Node / Playwright / static HTML.
Spec: current user V4 instructions and STRUCTURE.md; these supersede historical Bridge-as-scenario and all-source-default-open rules.

- [x] Verify PR #6 HEAD 44b16396415e8e1a92132efec767a633b5e28f7d and main cfa2ecc19fddf2fac7508c642f8580b1b5a85838; baseline 82 tests pass.
- [x] Author six full demonstrations; independent A–E review, revise before remaining 46.
- [x] Migrate original 50, preserving sources/B/C and adding individual exceptions; independent content review.
- [x] Implement compact progressive dictionary, Bridge and full five zones; fail-closed review fingerprints, search/copy regression.
- [x] Run unit/build/browser regression, visually inspect desktop/mobile, verify immutable baseline and storage files.
- [ ] Commit/push candidate, create draft PR against original candidate, read back remote; no merge/deploy.

Review focus: shifted POS/context bindings; transparent terms padded into fake etymology; duplicated B/C/01 explanations; mobile long-source overflow; stale or self-authored QA receipts.

Ruling: working definition and shift are absent from the original 50. Keep all original 50 and provide these two as separately labelled supplemental demonstrations, using their existing public preview IDs and contexts.
Ruling: preserve baseline trial preview architecture; do not silently activate this batch in production app. Run existing application regression for compatibility and explicitly distinguish preview from integrated FSRS acceptance.

## Audit

Data: existing x.b is scenario explanation, not a semantic bridge (align only describes incompatible priorities). Existing learner inventories already provide 125 useful senses; they should be curated rather than replaced. Some grammar must expand (align on + topic). Full licensed inventory has 185 senses and must remain available.
Generation: build-learner-dictionary requires c.bridgeText === old.x.b and inherits whole-card approval; that prevents rewriting Bridge. New rule must invalidate review when any layer changes; old approvals are historical only. Existing prompts define 01 as both memory and semantic connection, creating overlap.
Rendering: all learner meanings plus all raw sources are expanded together; context sense binding exists in JSON but is not visibly marked. B/C occupies the Bridge slot. Frozen preview has no search and only prototype copy actions; no FSRS within preview.

Before data: before.json is exact extracted baseline cards plus two older public demos; no frozen files edited.
