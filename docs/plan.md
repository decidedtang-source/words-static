# Static vocabulary implementation plan

> **For agentic workers:** Use superpowers:executing-plans. The user explicitly chose direct implementation; do not reopen architecture selection.

**Goal:** Publish all recent vocabulary on GitHub Pages with local learning and portable records.

**Architecture:** Original vanilla browser UI, bundled FSRS, IndexedDB transactional history, static vocabulary JSON, GitHub Pages. No external runtime APIs.

**Tech Stack:** HTML/CSS/JavaScript, ts-fsrs6, esbuild, Node tests and Chromium.

**Spec:** docs/design.md

## Tasks
- [x] Test then implement scheduling, idempotent events, undo and import conflict validation in src/model.mjs; verify node --test.
- [x] Build validated vocabulary ingestion from every supplied dated entries.json; count and hash source inputs, whitelist learning fields; keep source files unchanged.
- [x] Implement responsive study/library/statistics/backup screens, local persistence and speech; test browser reload, grades, export/import, concurrent-tab conflicts and mobile overflow.
- [x] One fresh whole-branch review, fix important findings with reproducing tests, build, audit, deploy GitHub Pages, verify real public URL.

## Review Focus
Lost local records, concurrent tab overwrite, malicious backup import/XSS, update stability, accidental private metadata publication. No automatic cloud synchronization or full offline guarantee.

## Execution record
Independent repository; existing server and networking work paused by user. GitHub hosting explicitly selected, superseding Sites hosting. User requested all latest batches and direct work, so no further design approval loop. Public code/vocabulary only, private learning remains local. Initial source inventory: 15 dated batches,1875 entries,2026-10-12 through2026-10-29.
