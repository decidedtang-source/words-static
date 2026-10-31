> HISTORICAL — superseded by docs/codex/v3. Links in this snapshot are historical, not maintained navigation.

# Reusable Codex prompt — next vocabulary update (after workflow implementation)

**Implementation v1:** Follow ../CONTENT-CONTRACT.md and repository schemas/*.schema.json. These supersede old illustrative field names: ten lower-camel-case stage keys, stageEvidence references displayGroups, generated_example-only new production context, exact LF candidate bytes and sourceManifestHash. Template/BLOCK never approves. P1–P3 branch work is authorized; main/Pages release is not.


**Use only after the user has specifically approved the applicable implementation/update scope.** The prompt is a template for each future batch; it does not schedule or start a recurring job by itself.

~~~text
Continue the official words-static vocabulary content workflow.

Start by reading AGENTS.md, docs/codex/START-HERE.md, docs/codex/CONTENT-CONTRACT.md, docs/codex/UPDATE-WORKFLOW.md, docs/codex/QA-AND-RELEASE.md, and the current main/active PR. Use the existing GitHub Pages site and its user data compatibility baseline. Do NOT migrate or write Notion history; Notion may be a selection-only read source if access is explicitly authorized.

Input: [PATH TO PRIVATE, APPROVED SELECTION PACKET OUTSIDE PUBLIC REPO]
Scope authorized: [READ_ONLY_REVIEW / CONTENT_PR_ONLY / UI_FEATURE_BRANCH]
Date/source: [YYYY-MM-DD and actual provenance]
Expected result: [N selected terms; no fixed approved quota]
Explicit publication permission: NO, unless separately stated by owner.

For each selected term:
1. Validate source identity, rights/privacy, exact surface and context example kind.
2. Resolve dictionary lemma/form/POS/sense and safe citation/attribution.
3. Draft concise memory gloss + our full-stage compact analysis (all 10 questions reviewed, 4–5 readable paragraphs) and optional original/safe teaching example.
4. Independently review exact candidate hash and negative cases; quarantine errors or missing data, do not invent 125/125.
5. Create or update only source-safe candidate overlays in a feature branch with tests and a Draft PR. Keep original card IDs and FSRS/IndexedDB history intact.
6. Verify realistic desktop/mobile word page preview, no extra modal needed for dictionary or compact analysis. Test raw/deep copy.
7. Report selected / accepted / approved / quarantined counts, dictionary + compact-analysis coverage, exact source/test statuses, public privacy checks and next owner decision.

Stop before merging to main, GitHub Pages deployment, scheduled automation changes or Notion writes. Mark READY_FOR_OWNER_REVIEW.
~~~

If selected material originates from a private work email or restricted paid reading, do not copy that text into a public PR, PR description, logs, screenshots or model prompt without explicit permitted sharing. Publishing a derived short example may still need validation of source and user authorization.

**A future daily schedule would be a separate workflow proposal**: choose one authoritative selector/producer, avoid the existing external task being duplicated, and make reports idempotent. Do not silently install it from this reusable prompt.
