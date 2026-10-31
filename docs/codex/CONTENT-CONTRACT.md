# Candidate content contract v0.1 (proposed, not yet installed)

This is a **proposed future content overlay**, not a claim that the current published JSON/UI already recognizes these fields. See **templates/** for concrete illustrative JSON and **GOLDEN-CASES.md** for required teacher-quality examples.

## Existing storage and what must remain compatible

Today:
- **source input**: dated YYYY-MM-DD.entries.json in an external directory; **scripts/update-vocabulary.mjs** checks exact source IDs across batches, reads term/ipa/pos/meaning/chunk/example/level, and writes **public/vocabulary.json**.
- **editorial overlays**: **content/YYYY-MM-DD.json** keyed by original source/card ID. **scripts/enrich-vocabulary.mjs** insists every ID has a concise gloss and at least two bilingual examples. The first English example equals the original source example; it preserves original wording.
- **dictionary**: **dictionary/catalog.json** contains selected OEWN source senses + self-authored Chinese summaries; **dictionary/bridges.json** contains a few original phrase bridges, not a full idiom corpus.
- **browser state**: IndexedDB events/FSRS/read marks and a separate bookmarks store. Content updates must not change existing card IDs or silently reassign sense identity.

**Do not silently change current public schema/contentVersion=2, fixed-size content test, original English first-example invariant, or browser persistence** as a side effect of adding proposed templates. Codex must implement an explicit new validated contract, a compatibility proof, and a migration/cutover gate separately.

## Canonical identity: occurrence is not a lexeme

An occurrence from selection is NOT a new dictionary sense:
- **selectionKey**: uniquely identifies a particular selection/source occurrence (source system, date, original selected target, private stable locator or fingerprint). Duplicates by spelling may be legitimate.
- **cardId**: existing original learning identity if present. Preserve exactly. For a new candidate, do not allocate production cardId until source identities are checked; 2026-10-30 has a known conflict with reused 2026-10-29 IDs.
- **entryType**: word / compositional_phrase / attested_collocation / idiom / technical_term / sentence / unverified_candidate.
- **displayText**: exact selected orthography, spelling, punctuation and whitespace. **lemma** and **form** are separately tracked, not secretly substituted in copy.
- **sourceSenseRefs**: array of **sourceId/release/sourceEntryId/sourceSenseId** (or source-local documented stable anchor); never merge on same Chinese gloss alone. POS lexical vs syntax role separate.
- **contentRevision**: changes to same learning object increment content revision, preserving FSRS events; truly different studied sense is a separate user-consented learning objective.

## Proposed separation of future records

Three records should not be flattened into one big generated explanation:

1. **SelectionPacket** (private staged intake): where the target came from, exact surface, classification, optional source sentence, privacy label, explicit consent and selection identity. It may retain private Notion IDs **only outside this public repo**.
2. **LexicalCandidate / DictionaryAnchor**: every offered sense has sourceName, release/snapshot, source entry/sense ID, POS, English definition from a licensed source, independently-reviewed Chinese **teaching** gloss, morphology/pronunciation evidence, permitted display/redistribution rights and QA status.
3. **CompactAnalysisCandidate**: tied to selected card/occurrence and selected senses, clearly labelled original vs generated example, with content for **Dictionary → Memory → Semantic Connection → Syntax → Concept → Contrast → Language Game → English Neighbors → Pragmatic Action → Workplace Use**. User sees roughly 4–5 concise grouped sections, reviewer still evaluates every applicable substep.
4. **ReviewReceipt** (private/auditable or safe reduced published status): separate reviewer context, hash of exact candidate payload, source/ref checks, per-stage verdict, corrections, final disposition, reviewer version/time. A template is **never** a receipt; a Writer cannot self-sign.

Proposed future location (Codex must first audit actual implementation and adjust):
- Private, **outside Git checkout**: selection-packets / candidate drafts / raw private source / reviewer evidence / local logs and run journals.
- Public, once licensed and reviewed: approved dictionary snapshot references, minimally sufficient approved Chinese teaching gloss, public example text/source indicators, an optional **content/analysis/YYYY-MM-DD.json** sidecar keyed by stable source ID (proposal), and safe aggregated coverage report.
- Never publish raw private selection packets, Notion URLs, unpublished client email, sensitive workflow notes, QA service credentials, or user learning history.

### CompactAnalysis fields: method-complete, display-concise

| Stage | Need to answer | Empty / no context handling |
|---|---|---|
| Dictionary | Which actual form/POS/sense is intended, source-backed? | If not in approved source, SOURCE_UNAVAILABLE; no invented definition |
| Memory | What one accurate Chinese meaning should learner remember first? | Draft can exist without source, but not approved |
| Semantic Connection | What real lexical/morphological/phrase relation helps recall? | N/A if no honest relation; no fabricated etymology |
| Syntax | What does it modify or do in the **actual sentence**? | No real sentence → generic typical structure, explicitly marked as teaching example |
| Concept | What exactly is being asserted/asked/limited? | No source sentence → avoid speaker-specific inferences |
| Contrast | Which confusing neighbor matters here and why? | N/A with reason if no relevant comparison |
| Language Game | What real activity is occurring, what might people discuss/do? | Without scene, mark typical scenario hypothetical, not a real client event |
| English Neighbors | Which 2–4 chunks/concepts co-occur, **why**? | Can give common collocations; don't fake source frequency |
| Pragmatic Action | What communicative act is speaker performing? | No utterance → N/A; never fabricate approval/authority |
| Workplace Use | Natural one/two examples adapted to source domain | Philosophy/economics article → examples in that domain, not forced manufacturing |

**All 10 stages must have a review disposition** for sourced/contextual entries (PRESENT, NOT_APPLICABLE_WITH_REASON, NEEDS_SOURCE, FAIL). This is a **QA trace**, not ten mandatory visible headings or an excuse to manufacture low-information filler. Render compact UI in merged groups:
- memory meaning + semantic relation;
- syntax + current conceptual scope;
- useful contrast;
- language game + linked English chunks;
- pragmatic act + one/two natural usage examples.

When no context, being brief and explicitly uncertain is more correct than completing a fictional workplace narrative. A claim such as "owner assigns final approval" is not a dictionary sense.

## Dictionary rights, licensing and etymology

The **current** dictionary catalogue labels source **Open English Wordnet 2025** (OEWN), with its CC BY and Princeton WordNet obligations. 2026-10-31 repository snapshot: **21 headwords / 28 POS records / 40 selected senses** only. The English definitions are selected original-source text; the Chinese glosses are **our project's independent teaching interpretations**, not "official Cambridge Chinese definitions." Phrase bridges are **our own composition explanations**. Publishing new dictionary snapshots requires documented data lineage, license terms and attribution; do not scrape Oxford/Cambridge/Collins or MaiMemo for republishing without explicit rights.

**Etymology is not dictionary meaning**: OEWN is not a historical etymological dictionary. No invented early form/root/semantic evolution. A learner-friendly semantic analogy is allowed only when described as an aid, not word history.

## Examples and safe copying

Every sentence must carry an **exampleKind**:
- **original_sentence**: actually quoted/confirmed source with provenance and rights.
- **generated_example**: created for teaching, even if first printed in an earlier wordbook.
- **unknown**: do not claim original or public sharing rights.

The current **src/copy.mjs** already recognizes these two accepted kinds and shareClass public/approved. For private/unknown class, do not attach context; the raw selected target still needs an on-screen warning when it is sensitive. A complete work email or paid article paragraph is never automatically attached to a prompt or public static wordbook.

**Critical existing code conflict**: the old **scripts/enrich-vocabulary.mjs** requires the *first* English example to equal source word.example. If source original is private/unlicensed, do not simply route it through this existing public JSON. Hold the candidate until a rights-safe publishing path is defined and approved. Do not destroy the original or silently mark a generated example as original to bypass the validator.

## State machine (content, not deployment)

~~~text
SELECTED_PRIVATE → ID_CHECKED → SOURCE_EVIDENCE_READY
 → WRITER_DRAFT → DETERMINISTIC_CHECKED → INDEPENDENT_REVIEW
 → APPROVED_FOR_STAGING → BUILT_FOR_PREVIEW → OWNER_ACCEPTED
 → (separate approval) PUBLISHED_READBACK_VERIFIED

Any uncertain source/rights/POS/IPA/phrasing:
 → QUARANTINED with reason and immutable candidate identity
~~~

- Publication remains **disabled by default**.
- Approved 6/10 and blocked 4/10 means only 6 may proceed to review staging; no quota-padding to 125.
- A revision after approval invalidates the previous candidate hash and review receipt. Reviewer must check exact candidate and source versions, not only spelling.
- Review evidence can be private; if publishing a status indicator, do not publish reviewer private prompts/paths/authorizations.
