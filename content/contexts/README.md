# Context content contract

Canonical editable entries: content/YYYY-MM-DD.json. The text indexes here are an editorial audit index, not a second runtime source. context-sources.json stores shared article metadata. published-batches.json fixes the currently published cohort; add a date deliberately only after its content is ready.

Each entry requires context.kind (workplace, reading, domain), context.scene, sourceId (null only where no external source applies), explanation and example.origin. Reading also requires an individual focus and a registered source. Each primary example's origin must match its purpose; additional examples may be transfer-original. There is no automatic project-management fallback.

originalExample preserves the imported teaching example for traceability. It does NOT mean article quotation. The displayed example is examples[0].en. Optional meaning and chunk overrides correct a contextual sense/collocation without changing card identity. Independently verify their meaning; do not select a sense solely from its frequency.

Use article context only within verified public-text / public-preview / public-transcript scope. New examples may be original relevant practice or attributed paraphrases; current schema intentionally does not label any generated sentence as an original article quotation. Never edit a source sentence to insert a target term. Preserve negation, modality, actor, time and comparison. For additional real quotations, extend the provenance contract and verify permitted quotation scope before importing.

Generate with node scripts/update-vocabulary.mjs <source-vocabulary-directory>, then npm test and npm run build. Tests verify generated output matches editorial context and preserve the current cohort. The importer reads only declared dates; it does not publish every newer daily source file automatically.
