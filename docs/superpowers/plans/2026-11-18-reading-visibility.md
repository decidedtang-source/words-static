# Personalized reading visibility implementation plan

> Execute inline with superpowers:executing-plans. The user explicitly requested planning followed directly by implementation and publication.

**Goal:** Preserve the published daily vocabulary layout while making section expansion, learning-text masks, and example target underlines independently configurable.

**Architecture:** Keep preferences in a versioned localStorage record, separate from learning records. Explicitly mark learning text and sections; never infer mask targets from Chinese characters across the page. Native details provide folding; accessible per-passage controls provide reversible reveal. Match target expressions at Unicode word boundaries without guessing unsupported inflections.

**Tech stack:** Existing vanilla JavaScript, CSS, esbuild, Node tests and Playwright; no new dependencies.

## Design and scope

- Preserve order, colors, card layout, IDs, source sentences, scoring, backup and speech consent.
- Independent default expansion: term and IPA, initial Chinese meaning, foundational meanings, context, examples, dictionary evidence and analysis method. Keep library card selection as navigation; conceal its term label when term defaults to collapsed.
- Chinese explanation masks cover meanings, glosses, context/contrast, explanatory notes and translations within cards/dialogs. UI labels, instructions, audio/copy/navigation controls and status are excluded.
- English example masks are independent of Chinese masks and section expansion. Audio stays operable and does not reveal text. Each passage can be revealed and hidden again with pointer or keyboard; returning to a card uses defaults.
- Underlines can be enabled or disabled; highlight exact case-insensitive whole words/phrases, including flexible spaces. Do not fabricate matches for paraphrases or conjugations. Hidden text also hides underlines.
- Defaults retain visible text and no underlines. New word/meaning/foundation sections start expanded; old global expansion preference is migrated for previously collapsible sections.
- Term folding includes IPA to avoid revealing the answer. Suppress automatic word speech when term is folded; explicit audio remains available.
- Preferences apply on the next card render, survive reload, and fail gracefully when storage is unavailable. Manual toggles never rewrite defaults.

## Implementation

- [x] Add preference migration/validation and matching tests; verify failure before implementation.
- [x] Extend `src/display-preferences.mjs`, add `src/reading-display.mjs` for section markup, mask interaction, matching and settings markup.
- [x] Integrate explicit learning-text markup and section controls in `src/app.mjs` and `src/lexical-ui.mjs`; add CSS and cache version.
- [x] Add browser coverage for sentence-first/listening-first, independent masks, keyboard reveal, reload, audio without reveal, underlines off/on and unchanged progress. Adapt existing mobile assertion to new term section.
- [x] Run Node tests, build and browser suite; inspect mobile screenshot. Review diff and source data preservation.
- [x] Commit, integrate latest remote main, publish with existing Actions workflow and verify public behavior in a disposable browser.

## Review focus

Storage corrupt/denied; old false expansion preference; duplicate and substring target matches; keyboard events accidentally triggering grading; hidden term leaking through auto speech or library heading; dictionary explanations and UI controls correctly separated. Test these in unit/browser coverage.

## Completion evidence

Release commit `c37590025b9064b69de853095fe55189b17d8616`; Pages run `44241800306` succeeded. The reading-controls browser scenario also passed against the actual public URL using a disposable browser context. Local validation: 16 unit tests and 4 browser tests passed. Rollback tag and release tag are both verified on origin.
