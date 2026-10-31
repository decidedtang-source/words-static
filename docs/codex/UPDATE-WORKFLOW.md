# Future GitHub-first update workflow

**Planning only.** This describes what Codex must be able to build, test and document in a later, separately authorized implementation. It does **not** install or change the existing external 09:00 vocabulary generator, Notion, GitHub Pages main, Google Drive, OneDrive, or any active scheduled task.

## Workflow overview

~~~text
USER selects a word/phrase/sentence (possibly in Notion, but NO Notion rewrite)
   |
   v
SELECTION INTAKE
  - manual packet first, read-only authorized importer later
  - exact text / source labels / privacy / ID / audit signature
  - packet remains PRIVATE and outside public repository
   |
   v
SOURCE & ID PREFLIGHT
  - exact original ID collision check (not term-based de-dup)
  - license / source snapshot / POS / sense / pronunciation availability
  - 2026-10-30 duplicate-ID sources → QUARANTINE and explicit mapping review
   |
   v
DETERMINISTIC DICTIONARY RESOLUTION
  - separate lemma/form/POS/sense
  - distinguish word, compositional phrase, idiom, technical term, sentence
  - show authentic source definitions; no etymology invention
   |
   v
CONTENT WRITER (candidate only)
  - memory gloss + short semantic bridge
  - compactAnalysis full method questions, short natural visible prose
  - real original vs educational example labels
   |
   v
RULE VALIDATOR
  - schema/POS/forms/senses/rights/UTF-8/privacy/bounds
  - full stage disposition, no fake source, no bad IPA aliases
   |
   v
INDEPENDENT SEMANTIC REVIEWER (new context)
  - all source evidence + raw candidate, especially working/framing/etc
  - feedback/FAIL/NEEDS_SOURCE/APPROVE for exact candidate hash
   |
   v
STAGED GITHUB CONTENT PR
  - approved safe dictionary/analysis overlays and manifest
  - tests/build/browser privacy/FSRS regression
  - six sample real-content desktop/mobile preview
   |
   v
OWNER CONTENT & UX ACCEPTANCE
  - review PR, real rendered text, current data coverage/status
   |
   v
EXPLICIT RELEASE APPROVAL → integrate to protected main
   |
   v
EXISTING GitHub Actions Pages deployment → post-release verification
~~~

## Phase U0 — actual repo baseline, preserve history

Codex shall first inspect:
- **scripts/update-vocabulary.mjs** for input dates / duplicate ID rejection.
- **scripts/enrich-vocabulary.mjs** and **content/YYYY-MM-DD.json** for first-English-example-preserved invariant, per-date 125 overlays and full editorial mapping.
- **dictionary/catalog.json**, **bridges.json**, **src/lexical.mjs** for dictionary lookup boundaries.
- **src/app.mjs** / **src/lexical-ui.mjs** / **src/copy.mjs** for old reveal/modals/copy UI.
- **scripts/build.mjs**, **package.json**, **tests/** and existing GitHub Actions workflow.

Snapshot actual source hashes, current working tree and **main**; preserve cardId, IndexedDB DB version and FSRS/undo semantics. Existing counts 1,875 cards, 21 headwords/40 senses refer to last verified snapshot, not permanent production values.

**Output:** a concise gap report and six chosen real existing card IDs or acknowledged independent lookup entries. No software deployment.

## Phase U1 — controlled selection intake (first version MANUAL)

- Input is a sanitized file matching **templates/selection-packet.example.json**, placed in a private staging location **outside words-static repository**. This public repo contains only a synthetic example.
- Each selection has selected surface, kind, sourceDate / sourceKind / exampleKind / privacyClass and exact source/card ID if known. Keep private Notion page/block ID only in private local evidence; **not in public PR or Pages**.
- Preflight rejects missing rights, malformed/mismatched identity, changed original sentence, duplicate IDs across dates, same ID different source content, or unapproved commercial text sharing. Do not allocate stable new public card ID based merely on order or term.
- Do not require rereading any Notion legacy page, migrating checkboxes or updating 71 analyses. Existing Notion remains a read/selection surface only.

**Output:** immutable selection-keyed intake manifest, per-item ACCEPTED_FOR_REVIEW / QUARANTINED and reasons. No publication.

## Phase U2 — dictionary/lexical evidence

- Resolve exact surface, lemma/form, POS, sense(s); verify source snapshot and rights **for public web redistribution**; keep original wording vs Chinese teaching gloss distinct.
- Existing curated OEWN 2025 catalog may be reused where refs actually match. Its current 21 headwords/40 senses do not make it full English/Chinese. Complete source coverage is a separate licensing and data project.
- Fixed phrases require their own evidence; free compositions cannot masquerade as idioms. Engineering technical facts require technical drawings/standards or appropriately qualified explanation.
- Provide pronunciation only for the exact surface and accent (IPA for stated cannot be state IPA). If unknown, mark unknown, never invent.
- If multiple POS/senses, preserve separately and keep selected current use highlighted; do not erase other available common senses.

**Output:** versioned dictionary anchoring report per entry, unresolved list. No invented sense IDs and no unofficial claims of official Chinese dictionaries.

## Phase U3 — candidate short explanation

Writer receives only approved evidence and source permission labels. It produces a draft according to **prompts/CONTENT-WRITER.md** and the schema template, with each relevant analysis stage considered. Render can group 10 checks into 4–5 short paragraphs (typically 120–250 meaningful Chinese characters for work scenarios, not a forced length). No source → no invented customer meeting or formal approval.

**Output:** draft in private staging, content hash and source provenance, not public production files.

## Phase U4 — QA and independent review

1. Deterministic validator checks structure, exact strings, sense refs, source/surface, paragraph escaping, approved source rights, exampleKind, privacy, no duplicate IDs, no stale reviewer hash.
2. **Independent** reviewer in fresh context follows **prompts/INDEPENDENT-REVIEWER.md** and **QA-AND-RELEASE.md**. Check misleading universal equalities, unsupported word origin, homograph, -ing form/POS, phrasal syntax, no invented standards.
3. A reviewer may approve only an exact hash. Any edit requires re-review; failed items quarantined. No automatic "fix all" pass without independent evidence.

**Output:** approved + quarantined manifest, per-stage verdicts, scope and coverage metrics. DRAFT is never APPROVED.

## Phase U5 — content PR & browser preview

Proposed implementation:
- Keep **content/YYYY-MM-DD.json** source/editorial overlays and card IDs intact. New **content/analysis/YYYY-MM-DD.json** (or similarly scoped sidecar) stores reviewed analyses keyed by original ID; a future explicit versioned build joins them. Codex **must test the alternative before changing the current published data contract**.
- Approved dictionary updates may extend **dictionary/catalog.json** with version/source/rights; never dump an unreviewed entire external corpus. Compositional bridges kept distinct from dictionary senses.
- Add tests without rewriting old fixed-count assertion as if it had always been 2,125. Old sourceID collisions require a dedicated ID reconciliation proposal.
- Build a realistic six-golden mobile+desktop preview on a branch. The new UI must show dictionary + analysis directly, not bury basic senses in an accordion. A copy button generates only an additional ChatGPT request.
- PR content should include file list, source/rights ledger, approved vs blocked counts, before/after screenshots, test commands/results, backward-compatibility and roll-back notes.

**Output:** reviewable **Draft PR**, no main deployment.

## Phase U6 — owner decision, publication, remote readback

Hard separation of gates:
- **DESIGN_ACCEPTED**: user accepts user flow and layout, does not mean "publish."
- **CONTENT_APPROVED**: user accepts selected QA-reviewed entries, does not mean "publish."
- **IMPLEMENTATION_APPROVED**: Codex may change code on isolated branch.
- **RELEASE_APPROVED**: designated operator may merge/trigger deploy to **main** once safe.
- **PUBLIC_READBACK_VERIFIED**: after existing GitHub Pages workflow success, check actual HTML/JS/vocabulary data, sample dictionary/short analysis/copy on public URL with disposable browser state; no data-loss/regression, publicly safe source fields only.

**Important current behavior:** **.github/workflows/pages.yml** triggers on push to **main** (and workflow_dispatch). There is no proved separate approval gate configured. Thus **merging a PR into main currently causes release**; Codex must not claim that a document-only "Owner Gate" can technically prevent it. Suggest branch protection/ruleset/release environment approval as a later separately authorized change. No new GitHub Action that auto-merges or auto-deploys on candidate creation.

On failed production smoke/readback: **stop further publication**, record exact URL+SHA and failure; preserve browser records; either forward-fix or revert only if data/schema compatibility is proven (never erase IndexedDB to make tests green).

## Phase U7 — next updates, no new daily scheduler yet

- The first iteration is **manual on-demand**: user selects/approves a small batch → Codex drafts/reviews → GitHub content PR → explicit release.
- Once this reliably works, propose semi-automated packets, scheduled lookup/review, and automatic notifications separately. No assumption that ChatGPT Projects, GitHub Actions or Notion can run the same model as the current ChatGPT chat.
- The existing external Notion/Drive vocabulary task continues as-is until the user explicitly requests a change. **Do not build a second publisher that races with it**.
- A recurring run can produce **0 approved entries**; it must report NO_APPROVED_CONTENT rather than fabricating 125.
- Each iteration reports dictionary lexemes/senses covered, approved compactAnalysis entries, deep-copy available, reviewer fails, held source IDs, public deployment SHA. Always say what has not been verified.

## Source license / privacy / version details to explicitly design

- Use an immutable source snapshot (name, release, hash, license, attribution). Attribution must ship with permitted definitions; current OEWN licenses are under public/licenses.
- Store private intake only outside the public repo. Enforce allowlist of public properties during build. Test for accidental Notion links, emails, local Windows paths, secrets.
- Hash the canonical candidate and all evidence refs; invalidate if content, dictionary source, rules, or reviewer standards change. Hash consistency ≠ factual correctness.
- Keep each selected occurrence separate from lexical headword/sense identity, and preserve original card IDs. One form may legitimately appear across multiple dates and senses.
- Do not turn a review summary, official source link, or selection packet into a claim of user authorization for actual Notion edits.
