# Memorization content and mobile actions

User approved: direct short Chinese meaning first, original context explanation retained, richer bilingual examples expandable; reveal and three grading buttons reachable without scrolling on phones; next card starts at top. All1875 existing vocabulary IDs and browser history remain stable.

Plan: parallel content editing across three disjoint groups of five dates (625 entries each); each entry receives a concise contextual gloss and two natural bilingual examples, preserving original English example as first. No mechanical truncation of explanations or universal filler examples. Store curated content/date.json overlays keyed by ID so subsequent vocabulary rebuilds preserve edits. Validate exact coverage, original examples, bilingual fields and unique IDs; review each group independently.

UI implementation: short gloss visible after reveal, explanation and bilingual examples in details; fixed bottom study action bar on mobile with safe-area padding and no bottom navigation overlap; compact header and scroll-to-top on next card; notice/errors remain visible near actions. Library shares the same meaning/explanation/example layout. Preserve speech consent, rating transaction, export/import and vocabulary IDs.

Validation: content schema tests, phone320x568/390x700 grading controls visibility before and after expanding content, next-card reset, existing persistence/export/concurrency/speech regressions; visual screenshot check; one broad final review; deploy Pages and verify public data/UI.

Execution: isolated study worktree. Skill: subagent-driven-development + parallel independent editorial batches. Ruling: source entries remain read-only; overlays are the editable canonical layer for this static site, not changes to the original publishing workflow. Windows-native progress record replaces Bash helpers.

Progress: all 1875 overlays completed. Independent reviewers checked each 625-entry group; 18 findings (3/8/7) fixed and scoped re-reviewed PASS. UI review found no blocking issue; its update-preparation documentation finding is resolved in README. Source example V20261017-120 is retained verbatim with an accurate translation and a visible editorial note explaining its conceptual problem. Duplicate notice rendering found by concurrency regression was corrected at the fixed feedback target.

Validation: 8 node tests PASS, build PASS, 2 Chromium integration tests PASS (mobile controls, next-card reset, persistence, export/import, concurrent stale writes and speech consent). Public deployment/readback remains pending final review.
