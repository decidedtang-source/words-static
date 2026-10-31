# Paste to Codex — initial implementation planning / independent review

**Implementation v1:** Follow ../CONTENT-CONTRACT.md and repository schemas/*.schema.json. These supersede old illustrative field names: ten lower-camel-case stage keys, stageEvidence references displayGroups, generated_example-only new production context, exact LF candidate bytes and sourceManifestHash. Template/BLOCK never approves. P1–P3 branch work is authorized; main/Pages release is not.


You are the **Codex planning and review lead** for the *official Words Static vocabulary website*.

## Repository and scope

- Official deployed website: https://decidedtang-source.github.io/words-static/
- Source: https://github.com/decidedtang-source/words-static
- Start in planning branch: **planning/codex-wordbook-templates-workflow-2026-10-31**; read **AGENTS.md** and **docs/codex/START-HERE.md** first.
- Prior UX issue: https://github.com/decidedtang-source/words-static/issues/2
- GitHub-first content issue: https://github.com/decidedtang-source/words-static/issues/3
- Background design PR: https://github.com/decidedtang-source/domain-services-plan/pull/2 (use current head, not an old immutable link).
- Notion **selection only** for now; Notion historical reorganization, 71 deep analyses and index migration **PAUSED**. No Notion writes, no existing automation or Google/OneDrive change.

## User goals (not optional)

1. Retain the frozen GitHub Pages product and its existing user state (1875 baseline cards, FSRS, grading, undo, bookmarks, read marks, backups and speech consent).
2. Benchmark the **real capabilities of MaiMemo Web** and produce an evidence-labelled feature parity matrix. The goal is a mature vocabulary product user flow, not just prettier CSS, without copying any proprietary data/code/algorithm.
3. Word lookup and a study card after **one reveal** must show all available licensed dictionary common POS/senses, pronunciation, example, morphology **directly**. Do not hide base meanings behind an extra modal/accordion.
4. The same page must **directly** show OUR short but meaningful complete-method analysis: Dictionary → Memory → Semantic Connection → Syntax → Concept → Contrast → Language Game → English Neighbors → Pragmatic Action → Workplace Use. All applicable stages must be checked, but the on-screen analysis can be 4–5 concise paragraphs. If real context is missing, use N/A/clearly marked teaching hypotheticals, not a fabricated manufacturing incident.
5. Two distinct copy buttons: exact target; 【深析】 target plus optional safely shareable, correctly labelled original/teaching sentence. The user pastes manually to ChatGPT for **longer analysis**, not to obtain the first contextual explanation.
6. Build a **future update workflow**: Notion/user selected target (read-only/manual) → private source packet → sense/rights check → writer draft → deterministic QA → **independent reviewer** → approved GitHub content PR → mobile/desktop preview → Owner acceptance → separately authorized GitHub Pages release/readback. Do not install competing auto publishers.

## Mandatory initial deliveries

A. Inspect actual scripts/update-vocabulary.mjs, scripts/enrich-vocabulary.mjs, src/app.mjs, lexical-ui, copy, dictionary, tests and GitHub Pages Action. Report current facts vs design assumptions; specifically confirm Pages main automatically deploys.

B. Read proposed documents and template JSON in **docs/codex**; challenge them independently. Confirm whether sidecar storage, candidate/reviewer contracts, copy provenance, identity mapping and CI design are minimal, testable and privacy-safe. Correct any mistakes in the **planning branch** only.

C. Use six goldens from **docs/codex/GOLDEN-CASES.md** and the structured shift example to deliver real-content desktop/mobile design previews: lookup, masked study front, revealed study back, our own compact 7-method analysis, copy-deep. Show which dictionary facts are already sourced vs pending license/QA. Reject working=temporary universal, framing=verb universal, fake source, fake technical approval, private source disclosure.

D. Create a detailed, **incremental implementation plan** with file-by-file tasks, QA gates and rollback/owner decisions. Produce a MaiMemo Web function matrix, source coverage counts, and a safe future branch PR/CI/release workflow.

E. End with **READY_FOR_OWNER_REVIEW**. **Do not** change production main, publish, edit Notion, alter scheduled producers, create paid API keys or claim unrun tests PASS. An isolated visual/code prototype is allowed only if explicitly within this planning assignment and must not mutate user data.

## Expected final response

Provide: PR and branch link, actual examined source SHA, gaps ranked by user impact, 6 sample-preview links, content/source status, exact phase-by-phase test/owner gates, currently unimplemented items, and **one concise next decision** for the owner.
