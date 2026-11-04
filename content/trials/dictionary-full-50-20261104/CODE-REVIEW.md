# Final branch code review — 2026-11-04

Reviewer: dictionary-final-code-review (fresh context). Base/HEAD: a63970470811c190c6ff0462f49d853dd6bc9cd8. Scope: uncommitted dictionary-full/1 pipeline, tests, candidate artifacts and QA requirements. No publishing, commits, data migration or baseline edits performed.

## Finding requiring correction

**P2 — Bind the inherited preview to the reviewed frozen baseline.** In `scripts/five-zone-workflow/build-full-dictionary.mjs:24-28`, the builder validates the old entries/supplement/reviews but separately trusts the mutable old `preview.html`, checking only card identity. The browser comparison also uses that same file. An edited or stale non-dictionary explanation in the old preview can therefore be copied into the new preview while the unchanged JSON receipts still yield PASS. The recorded `basePreviewHash` describes whichever bytes were read; it does not enforce the declared base commit. Verify the complete old preview against the pinned base (and/or its rendered cards against the old build evidence) before copying it, and add a regression check for changed baseline content. Current artifacts are correct: the baseline has no diff against the specified commit and its embedded cards match `evidence/build.json.renderedCardsHash`.

## Verified strengths

- All 50 card identities retained; exact source-field comparison covers entries, senses, ordering, definitions, examples, frames, domains and usage labels. Independent receipts bind the card and both source snapshots; missing review, changed data, low score and same writer/reviewer are rejected.
- Renderer escapes source/translation text and distinguishes project Chinese, lexical examples and synset examples. Source versions, licenses and the limited meaning of “complete” are visible.
- Original dictionary module scores are replaced; original other-module validators still run. Existing baseline directory remains unchanged.
- New scripts are candidate-only filesystem work. No production, FSRS/history, Notion or schedule mutation found.
- Ran `node --test tests/full-dictionary.test.mjs`: 6 passed, 0 failed. Confirmed branch/HEAD and old preview rendered-card hash independently.

## Limits

The coordinator is running the 300 browser cases; this review does not claim their result. Independent content review already documents original-source comparisons; this code review does not repeat its translation assessment or live Wiktionary retrieval. Extraction requires the documented local source archive/unpacked directory; normal verification checks reviewed snapshots rather than redownloading sources. Source archive hash alone does not automatically prove the unpacked directory matches it; the recorded independent raw-source comparison supplies that evidence for this batch.

Disposition: correct the inherited-preview binding before final candidate acceptance. No release authorization implied.

## Resolution recheck

The P2 finding is resolved. The builder now invokes `assertBaseline` before content validation/rendering and checks exact UTF-8 string fingerprints for seven inherited artifacts, including the complete baseline preview, both reviews and original build/acceptance evidence. Independently compared all seven lock hashes with `git show a63970470811c190c6ff0462f49d853dd6bc9cd8:<path>` and current working files: all match. Independently reran the focused suite: **7 passed, 0 failed**, including rejection of edited/missing baseline artifacts.

Final code-review disposition: **no unresolved blocking findings; suitable for final candidate verification and Owner review**. Final browser evidence remains the coordinator's separate gate. No publication approval is implied.
