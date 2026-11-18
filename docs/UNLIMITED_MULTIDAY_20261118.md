# Unlimited and multi-day study — first-stage plan

Owner sequencing: complete and publish unlimited study and multi-day progress first. Do not change the review algorithm, FSRS parameters, existing due dates or rating mapping in this stage. Algorithm research and optimization are deferred until after this delivery.

Scope:
- Daily new-word target accepts a nonnegative safe integer without the old 125 cap, or null for unlimited. Existing numeric preferences remain intact; zero still means review only. Due reviews retain their current priority and scheduling.
- Select several source vocabulary dates for a study session, or continue using a single date/all dates. Progress is continuous across sessions and actual calendar days.
- Source-date summary: total words, started words, not yet started, currently due, period new/review counts and last study time. Starting a word means a non-undone grade, not mastery and not an “已读” mark.
- Actual-study-date history: new words, review answers, distinct words and total answers. Filter the reporting period and optionally one source vocabulary date. Use Asia/Taipei boundaries and exclude undone answers consistently.
- Preserve schema-1 event history, stable card IDs, export/import/merge/undo safety. Null target is explicit in the backup; previous backups still import. No deletion or rescheduling of records.

Implementation and checks:
1. Extend target validation and queue selection; prove unlimited, >125, zero, selected-date union and review priority with tests.
2. Derive progress from existing card/event history with tests for multi-day activity, undo, repeated reviews, dates and batch filtering.
3. Add target and multi-date controls, source-date overview and activity detail; verify in a disposable browser with seeded multi-day records, export/import and existing UI flows.
4. Review changes, build, publish through Pages and verify public UI. Preserve rollback tag `published-before-unlimited-study-20261118`.
