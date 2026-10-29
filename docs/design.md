# Static vocabulary library

Approved scope: a GitHub-hosted static website containing all available recent vocabulary batches, rather than a 20-card pilot. No local server, account, pairing, domain changes, or cloud learning database. Vocabulary updates are published as static files. Learning progress stays in the browser and can be exported as JSON for manual handoff and imported on another device.

Use stable source IDs; preserve differing senses and dated duplicates rather than silently merging. Publish only learning fields; omit private Notion/Drive links and internal metadata. Show all dates, search, expandable meanings, read marks, due/new review, three ratings, statistics, and reveal-triggered local English speech. Default new target20, adjustable0–125; library size is not an obligation.

Use IndexedDB transactions; concurrent tabs cannot overwrite newer card state. Export contains schema/version, events, and settings, never credentials. Import validates before writing, merges event IDs idempotently, rejects conflicting IDs and divergent per-card histories instead of guessing. User can export their current backup first. Updating bundled vocabulary never replaces browser history. Browser clearing/private mode can lose local data; explain export in the UI. No background upload.

FSRS6 runs locally with the same three rating meanings and conservative parameters as the existing app. Source code and vocabulary are public static assets; user progress is not pushed to GitHub. Existing server application and relay remain untouched.
