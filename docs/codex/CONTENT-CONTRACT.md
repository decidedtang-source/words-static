# Reviewed content v1 — implemented contract

Authoritative machine shapes: schemas/reviewed-batch.schema.json, analysis.schema.json, dictionary-entry.schema.json, content-review.schema.json. Validator: scripts/validate-reviewed-content.mjs. Accepted rationale: review-2026-10-31/CONTRACT-DECISIONS.md. This replaces earlier PRESENT/NEEDS_SOURCE and duplicate stage prose formats; old receipts cannot be promoted by renaming fields.

## Public input

ReviewedBatchProjection contains schema, batchId, baseContentHash, cards, analysis, dictionaryEntries, licenses. PublishedCard retains legacy fields plus aligned exampleKinds. Analysis-only cannot change the old card. Unknown fields fail at every defined object boundary. Notion IDs/URLs, customer context, private notes and private text hashes never enter public Git. selectionId is a public opaque token.

English definitions/examples/POS are matched against the licensed source manifest. Chinese summaries, morphology and contextual reasoning are project editorial content, not official Chinese dictionary text. Never invent IPA, etymology, phrase attestation or work approvals. Initial v1 accepts generated_example only for newly reviewed cards/context; original quotations need a separately implemented provenance workflow. Relabeling a private quotation is forbidden. Legacy cards are not relabeled by this restriction.

## Complete-method compact analysis

One authoritative text in 4–5 displayGroups. Ten ordered stage keys: dictionary, memory, semanticConnection, syntax, concept, contrast, languageGame, englishNeighbors, pragmaticAction, workplaceUse. Each stageEvidence references dictionaryEntryIds or existing group IDs. APPLICABLE requires evidence and reviewer PASS; NOT_APPLICABLE requires a substantive reason and matching NOT_APPLICABLE_WITH_REASON. Presence of keys is not semantic QA.

Coverage records REVIEWED_SELECTED_SENSES / REVIEWED / READY with an honest scope. All selected reviewed senses display directly; never claim exhaustive dictionary coverage. Domain-unverified E remains outside the production projection. Dictionary/analysis/copy coverage denominators are card counts; lexeme/POS/sense counts are separate.

## Byte binding and independence

Candidate bytes: UTF-8 no BOM, LF, two-space indentation, one terminal LF. SHA-256 binds exact bytes; validator rejects rather than normalizes. Receipt also binds sourceSnapshotHash, sourceManifestHash, rulesVersion. Manifest binds actual base files and selected operations. Display text/source changes expire review.

Receipt verdict: APPROVE / REVISE / QUARANTINE / BLOCK. Stage verdict: PASS / NOT_APPLICABLE_WITH_REASON / NEEDS_EVIDENCE / FAIL. Rights/privacy must PASS. Writer and Reviewer identities differ; reviewId references an actual independent context, never a placeholder. Lifecycle states are separate. Examples deliberately BLOCK.

These are evidence consistency checks, not identity authentication or semantic truth. A trusted maintainer/Owner must verify independent review provenance before merge. Self-written APPROVE metadata does not constitute authorization. No signing service or new platform permissions are implied.

## Identity and rollback

Allowlisted operations: add/revise/analysis-only/withdraw. Existing IDs stay stable; add cannot reuse IDs; revise cannot change the recall target or declare semantic change. Different meanings need separately reviewed new identities. Duplicate selections fail. Builder validates base files and retains original records; retiredIds exclude withdrawn cards from active queues without deleting events. Runtime contentRevision is separate from existing FSRS event versions. Preserve both learning and bookmark backups and licence notices.
