# Reading controls release — 2026-11-18

The daily vocabulary app keeps its existing content order and learning records. Settings now offer seven independent expansion defaults, separate masks for Chinese learning explanations and English examples, and optional underlines on exact target expressions in examples. Audio and interface text remain available. Each passage can be revealed or hidden independently using pointer or keyboard.

The old expansion setting migrates into the existing sections. Display preferences remain local to this browser, separate from the learning-record backup. The default leaves learning text visible and underlines disabled. Term folding also folds IPA; automatic word speech follows the term's actual open state. Reopening a library card resets temporary reveals and folds to the saved defaults.

Underlines match whole words/phrases case-insensitively, preserving original sentence text. Paraphrases and inflected variants are not guessed. Chinese masking uses explicit learning-text fields, never blanket Chinese-character detection.

## Version preservation and rollback

- Previous published commit: `72c2bc08d60d18640bedb6377fec869b10676e68`.
- Remote annotated tag: `published-before-reading-controls-20261118`.
- Implementation branch: `feature/reading-visibility-20261118`.
- New release tag: `reading-controls-20261118` (created with the release commit).

To undo only this release while retaining later history, create a branch from the current main, run `git revert reading-controls-20261118`, resolve any later-change conflicts, run `npm test`, `npm run build`, and `npm run test:browser`, then integrate and deploy through the existing Pages workflow. Do not reset shared history or delete browser learning data. The previous display-preference key is retained for compatibility.

## Validation and review

Node tests cover preference migration/invalid values and safe whole-expression matching. Browser tests cover setting persistence, independent masking, audio without reveal, keyboard control, manual term folding through answer reveal, card reopening defaults, hidden-word headings, underline off/on, unchanged scoring, old preferences, denied localStorage, and 320/390/768/1440px layouts. Existing grading, export/import, dictionary, bookmark and mobile docking flows also pass. A mobile mask screenshot was visually inspected.

Independent review identified Safari regex compatibility and term/reopen answer leaks. The implementation avoids lookbehind, preserves the current term state on reveal, neutralizes open library headings and resets reopened cards; browser regressions cover the latter behaviors. Physical Safari/iPhone testing was not performed.
