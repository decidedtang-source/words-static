# Word page modules implementation plan

**Goal:** Split the approved page into nine independently versioned regions and explicit data contracts, preserving v7 rendering and frozen v6.

**Architecture:** Module-local content, view templates and optional behavior; shared page shell/theme; validated local data contracts; assembly manifest and per-module content/view/process hashes. Static build, no server/API activation. Five-zone analysis remains one coherent module.

**Tech stack:** Node, JSON, HTML/CSS/JS, existing Playwright and GitHub Pages.

- [x] Introduce modules under `word-page/`, ownership contracts, unique word IDs and dependency checks. Tests reject duplicate fields, bad types, incomplete senses and stale dependency fingerprints.
- [x] Extract nine views and two interaction components; keep shared CSS as explicitly versioned page theme. Reassemble the same v7 DOM and pixels for three words.
- [x] Separate content/view/process/interface revisions and pin them in `release.lock.json`; verifier rejects changed modules and reports affected downstream modules.
- [x] Publish a new v8 URL, preserve v6 hashes and old URLs, run page and production tests, verify deployment.

Contracts are local versioned interfaces, not live Cambridge endpoints. Content retrieval remains manual/assistant-assisted as documented in v6. No new lexical claims or source fetches are needed for this structural change.
