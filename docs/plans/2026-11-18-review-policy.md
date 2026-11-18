# Research-informed review policy

Base: 9da3c04. User authorized implementation and publication, preserving Git rollback. Scope: keep FSRS-6 memory model; improve due-review selection and configurable retention without rewriting history.

Evidence:
- Ye, Su, Cao (KDD 2022), A Stochastic Shortest Path Algorithm for Optimizing Spaced Repetition Scheduling, DOI 10.1145/3534678.3539081. Public experiments/model fitting: https://github.com/maimemo/SSP-MMC . Motivation: balance recall and review cost; this change does not reproduce SSP-MMC or claim to be current proprietary MaiMemo scheduling.
- https://memodocs.maimemo.com/docs/2025_experiment/ : preliminary MaiMemo Flashcards MMX comparison; improved offline prediction did not establish improved learning efficiency. Vocabulary and Flashcards are distinct products. No claim of personal learning gains or fitted personal weights.
- https://docs.ankiweb.net/deck-options.html : ascending retrievability prioritizes at-risk due reviews. We use raw FSRS retrievability, not Anki's preset-adjusted implementation.

Plan / acceptance:
1. Freeze original parameters; version future grade policy with retention 85/90/95%; missing policy means original 90%. Preserve old backups byte-equivalent card replay, undo, idempotency and merge preference semantics.
2. Queue: due learning/relearning first; due review risk ascending (default) or old due-time order; deterministic ties; never schedule before due; retain all quotas/scopes/unlimited.
3. Settings: explicit retention/workload tradeoff and ordering, applies future grading only. Local delayed-review self-reported recall over 30 days, exclude first exposure, same-day practice and undone events. No fake training or mastery claims.
4. Unit regressions plus browser save/reload/import/grade tests, existing suites, fresh final review, publish and live check.

Ruling: preserve the pinned FSRS-6 model rather than adopt new model weights without personal held-out evaluation; potential cost is foregoing an unproven improvement. Retention presets are user choices, not paper-derived personal optima. New risk ordering is reversible in settings.

Progress: research and clean-base rollback tag complete; implementation pending.

## Rollback and compatibility
- Rollback Git tag: published-before-review-policy-20261118 (9da3c04). Export a browser JSON backup before changing versions; the website cannot access the user's real browser records from the development machine.
- Preferred data-safe operational rollback: in Records/Settings, set retention to 90% and due order. This restores original future scheduling and selection behavior while retaining version-aware historical replay. Already scheduled due dates stay unchanged; the next grade uses 90%.
- Do NOT deploy the exact pre-feature source against post-feature .85/.95 history: it cannot replay that history and undo/import may fail. A code rollback must retain src/review-policy.mjs and the version-aware model replay/validation/merge changes, reverting only UI/ranking changes. An exact historical build needs the pre-upgrade exported backup, which excludes later grades; always preserve the newer export separately. No automatic destructive migration is provided.

Final review fixes: equivalent preference field ordering caused a false merge conflict; regression reproduced failure and fixed by comparing values. Risk deemed important at the backup model boundary. Legacy-behavior settings after a .95 grade retain replay/undo (regression passed). Research decision remains pinned model + transparent reversible policy rather than unvalidated personal training.

Verification progress: 34 initial unit tests passed; new settings browser save/reload/import/grade passed. Parallel browser run had resource/synchronization failures; both affected tests passed in isolation, full serial regression in progress.

Final review complete: no other blockers. Corrected save copy to distinguish next queue order from next-grade retention; this small clarity correction is included in the requested settings work. No deferred findings. Personal learning benefit is deliberately unclaimed; historical fixtures and local browser tests prove compatibility, not efficacy. Final unit suite 36/36, full serial browser suite 13/13, build passed. Parallel run instability was confined to a hash-navigation assertion race and Chromium screenshot crash under concurrent launches; isolated and full serial runs passed.
