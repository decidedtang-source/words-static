# P1–P3 independent content review — 2026-10-31

Verdict: **APPROVE for the pending implementation branch only**. This is semantic content approval, not Owner release authorization, main integration, Pages deployment, UX acceptance, or review of all legacy cards.

Reviewer context: `codex-independent-reviewer:/root/implementation_content_review`, separate from manifest Writer `codex-writer-p1-p3-20261031`. Review ID: `p1-p3-content-20261031-d0052e7a-1514-4577-983a-91e0e9ff7354`. Reviewed raw candidate, manifest, source manifest, content contract, reviewer prompt, golden requirements and actual licensed SQLite snapshot; no old preview receipt was promoted.

## Exact evidence binding

- Candidate SHA-256: `b304b951e246a37e9261ceb515d4b53697f74f911131c544348435ac487cd2ee`.
- SQLite snapshot SHA-256: `a78e8615e519ed24c9af58482159230f49c558be89104d8d511f3c7939ec5eb0`.
- Source manifest SHA-256: `54e6fa2e6fcb3aadcd9e9b081a2004eff34ad238d355f56335d9ffb2ddee8f5e`.
- Rules: `reviewed-content-v1`.

All three hashes were independently computed from bytes. Candidate canonical UTF-8 without BOM, two-space indentation, LF and one final LF was checked. Read-only Node DatabaseSync queries against the actual OEWN 2025 SQLite snapshot verified all 14 selected entries / 28 senses: IDs, lemma, POS, release, source-entry anchor, exact English definitions and complete selected source-example arrays. Candidate entries matched the source manifest. Chinese glosses were read as project editorial summaries, not attributed as official Chinese dictionary text. Source licenses and retained Princeton notice were read; selected source attribution and editorial-change distinction are retained by the existing catalog. No unrestricted rights to unrelated text were inferred.

## Semantic findings

| Golden / identity | Independent finding | Ten stages |
|---|---|---|
| A / WS20261031-001 | shift means a work period in this context; noun/verb senses stay separate; memory links are explicitly not etymology; no invented approval. | PASS |
| B / V20261029-005 | working modifies definition; practical and temporary-basis meanings are distinguished; the proposal does not report existing agreement. | PASS |
| C / V20261029-006 | framing is the nominal head, outcome the nominal modifier; compositional explanation is not claimed as an attested idiom; frame verb and framing noun evidence are distinguished. | PASS |
| D / WS20261031-004 | Whole-expression take_into_account source sense exists; bank-account meaning is not used to derive the idiom; considering uncertainty does not imply approval. | PASS |
| F / WS20261031-006 | Conditional instruction and indirect whether question are correctly distinguished; schedule risk and conditions are contextual; whether is editorial grammar, not a fabricated OEWN entry. | PASS |

For every row, Dictionary, Memory, Semantic Connection, Syntax, Concept, Contrast, Language Game, English Neighbors, Pragmatic Action and Workplace Use were individually read. Their displayed references contain substantive support; none requires N/A. Neighbor expressions are teaching associations, not unsupported frequency claims. Proposed workplace moves remain hypothetical and do not invent real approvals or universal procedures. All supplied morphology is appropriate; no new IPA or etymology is invented.

A, D and F each contain two distinct bilingual examples with aligned generated_example labels. Their translations convey the English accurately after the correction below. The repository goldens identify the contexts as teaching examples; no private quotation is promoted as generated material. B/C were compared with public/vocabulary.json: exact stable IDs and targets match, contexts match their existing teaching examples, and neither old card appears in the candidate cards array. Their new operation is analysis-only, preserving recall targets and original card fields. New IDs do not collide with the base vocabulary. E is excluded because domain evidence is unresolved; its exclusion is not a domain-content approval.

Privacy: PASS for these artifacts. No private Notion links, customer identity, credentials, personal notes or real project deadlines were found. Rights: PASS for the selected licensed source extracts and clearly distinguished project teaching content. This review does not establish rights to unrelated legacy material.

## Targeted revision and re-review

Initial candidate `f6234c9101b2d5727d2946db22b7cdecec7d9934ffeb15fcf29c3137956ca86a` was held for revision: F translated “by Friday” as “周五前”, which can incorrectly exclude Friday. Reviewer reported the defect without editing the candidate. Writer changed the card's second example and the g5 workplace-use translation to “如果物料最迟周五到达，排程就可以实现。” The final exact bytes and both corrected locations were independently rechecked. The receipt binds only the final candidate hash above.

Schema/hash validation is complementary evidence; it is not the semantic reasoning behind this approval. Any candidate or source change invalidates the binding and needs review. Trusted maintainer/Owner verification of this independent review context remains required before release. No production action was taken by this reviewer.
