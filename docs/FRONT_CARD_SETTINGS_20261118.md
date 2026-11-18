# Front card and interactive reading settings

Owner-confirmed scope: choose one of the five card modules for the face before “显示释义”; set default masks independently for Chinese meaning, foundations, context, English examples, Chinese translations and dictionary glosses. Settings should use a representative editable card. Preserve reading position on advancing to the next word.

Implementation: the settings card previews scope and exposes per-module radio/checkbox controls alongside drag handles and accessible move buttons. Changes update the preview and save to the existing browser display preference record. Existing language-wide mask settings seed independent fields only when those fields are missing. Existing order, expansion and underline choices remain intact.

The front renders only the selected module and uses its fold/mask defaults. Missing foundational content gets a neutral message; it does not fall back to the answer. Showing the full card preserves the front's temporary fold/reveal state. Word auto-speech requires the term to have been visible on the front. Scoring stays unavailable until the full card is revealed.

Advancing restores the previous scroll offset, clamped to the next card's actual height. It does not pad a short card with blank content. Initial session entry still starts at the top.

Rollback baseline: remote tag `published-before-front-card-20261118`, commit `19607f94f0381aba8972a0dbc5d4c5c14c41ebfc`. No vocabulary, scheduling or learning-record schema changes.

Validation covers legacy preference migration, independent masks, all five fronts, preview updates, preservation on reveal, next-card position/mask defaults, dragging and keyboard ordering, and the existing learning/backup/dictionary/mobile suites. Physical-device Safari testing is not included.
