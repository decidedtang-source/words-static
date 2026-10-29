# Static release checks

Vocabulary inventory:15 batches,1875 distinct source IDs,latest2026-10-29; every entry has IPA. Published fields are id/date/term/ipa/pos/meaning/chunk/example/level only. No URLs, email addresses, local paths, internal source links, credentials, or actual learning records are bundled.

One independent fresh review identified recursive undo complexity, stale-tab undo targeting and incomplete settings/read-mark transfer. All three were reproduced by failing tests and fixed. Undo reconstruction now replays once with indexed pre-grade states;40 historical grade/undo pairs and validation finish under the test's3-second bound. UI undo carries the displayed event/version; import explicitly selects incoming or local preferences.

The malformed second import-file preview issue was treated as a data-selection risk: preview is cleared on selection and older asynchronous reads are ignored. No second review was requested. Model tests and real Chromium subpath-hosting flow cover persistence, export/import, responsive layout, duplicate/conflicting history and concurrent-tab writes. Automated speech adapters do not prove actual device audio quality.

Learning data is browser-local. Publication can be verified without exposing learning history because browser tests use disposable profiles. No old connector/server setup is required for users; server application and network restoration were paused at user request.

Rulings: GitHub Pages selected explicitly instead of Sites hosting; public static learning fields only. All recent dated batches included instead of initial20. Source files remain read-only. Build bundle pins FSRS6 and does not load a third-party runtime script. No cloud sync, account, or full offline promise.

Release: https://decidedtang-source.github.io/words-static/ . Initial deployment run40808514503 succeeded. Public HTTPS returned200; downloaded vocabulary confirmed1875 entries/15batches/latest2026-10-29. Fresh Chromium profile verified grading and reload at the actual public subpath;0page errors and no horizontal overflow at390px. Local5model tests and integrated browser flow passed; npm audit0vulnerabilities. Public smoke-test progress existed only in a disposable browser profile.

Mobile speech compatibility: screenshot showed no locally classified English voice, but actual mobile voice list is unknown. Added explicit per-browser opt-in for non-local/default engine playback; default remains local-only. Remote-labelled and empty-list cases reproduced RED then GREEN; browser mock verifies opt-in, persistence and disabling. No real-device audio success claimed. No IndexedDB schema or learning record changes.
