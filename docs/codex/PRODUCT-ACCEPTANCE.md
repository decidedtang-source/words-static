# Product acceptance: mature vocabulary app with our added interpretation

## The product to compare

**Official current site**: https://decidedtang-source.github.io/words-static/ . Borrow **user problems, interface information hierarchy and verifiable Web behaviors** of mature vocabulary tools such as MaiMemo, not their private IP, brand marks or copyrighted dictionary content.

**Evidence classes** must be distinct: VERIFIED_WEB / VERIFIED_MOBILE_ONLY / SOURCE_DOC_ONLY / UNKNOWN. Official MaiMemo Web updates: https://memodocs.maimemo.com/docs/product-log-memo-web/ . Dictionary-depth preferences (few/medium/many senses; simple/medium/detailed explanations) must be verified in current Web before claiming Web parity. Never pass mobile-only functionality off as Web.

### Required functional comparison matrix

For every capability record: link/screenshot/date of third-party evidence; current own URL/code; status EXISTING / PARTIAL / MISSING / UNKNOWN; desired behavior; UAT example; user value; implementation risk; priority; explicit deferral reason.

**Must assess:**
- study/reveal/grade and FSRS-like spaced review (our FSRS is independent of any proprietary memory algorithm);
- full dictionary entry (multiple senses by POS, morphology, example, pronunciation) and presentation preferences;
- wordbook selection, switching, self-selected/imported/removed vocabulary;
- daily target and mode/recall direction, review queue, ahead-of-schedule and continue-review behavior;
- word lookup, query history, saved personal glosses/examples/bookmarks and personal notes;
- per-word recall history, next due/interval, time-on-task, stats;
- responsiveness, keyboard, accessibility, prefetch/perceived latency;
- multi-device access vs **not yet implemented automatic synchronization**;
- commercial, social/team and hardware-specific features (record but do not reproduce automatically).

## UI modes with different concealment policies

| Mode | Answer shown? | Required immediate content | Actions |
|---|---|---|---|
| Dictionary lookup | Yes | Actual licensed dictionary senses grouped by POS, examples, source and morphology, followed by **our compact complete-method analysis** | Back, sound, save, copy raw/deep |
| Library entry detail | Yes | Same complete word/phrase/sentence data, current sense highlighted, source sentence/provenance | Add/remove from study separately, save, copy |
| Study front (before reveal) | No | English target, valid IPA/audio, where allowed; no leaking Chinese definitions | Reveal, leave, audio |
| Study back (after **one** reveal) | Yes | **Dictionary directly visible** + **our compact analysis directly visible**; all supported senses can be read by scrolling | Existing Again/Hard/Good, source, copy, sound |
| Further deep exploration | User initiated | Copies short 【深析】 request including only share-approved real original sentence or marked teaching example | No background model call, no grade side effect |

**Default content density**: enough like a mature dictionary app to see useful senses without multiple clicks. Allow vertical scroll, do not shrink text or hide noun/verb senses in layers. Do not cram seven headings into the card; group the complete applicable method as ~4–5 concise paragraphs (an approximate readability goal, not hard output token quota).

### Target view (golden: shift)

~~~text
shift   /ʃɪft/   n., v.                  🔊 ☆  [复制原文] [复制深析]

Dictionary / 词典（directly visible）
  n. ① 班次、轮班：night shift / the next shift
     ② 变化、转变：a shift in priorities
  v. ① 移动：shift the part
     ② 转移重点：shift focus to quality
  Exact OEWN source senses / project-reviewed Chinese teaching summaries indicated.
  Any unavailable senses explicitly identified; no fake etymology.

我们的简析（directly visible）
  Memory & semantic: 两个重要义项“转变/转移”和“班次”分别记；不要硬编必然词源链。
  Syntax & concept: before the next shift 中 shift 是名词；下个班次前需有作业指导书，不意味着给出精确钟点。
  Contrast: shift≠handover≠changeover。
  Language game & neighbors: work instruction / operator readiness / handover...班次交接前的准备问题。
  Pragmatics & use: 说明一项时间要求，不是正式批准。Please confirm the instruction before the next shift.

[继续深入：复制【深析】]     [保存词]   [忘记] [模糊] [认识]
~~~

## Acceptance gates

**UX-1**: At least six real examples (shift; working definition; frame/framing/outcome framing; take into account; functional seating surface; conditional scheduling sentence) in **lookup, front, revealed** modes. Desktop/mobile content previews before code implementation.

**UX-2**: Available licensed dictionary senses are **all visible directly** in dictionary/revealed mode, not hidden behind secondary details/modal. A full entry means fully showing what the **selected actual source supports**, not claiming the tiny OEWN subset is a complete bilingual commercial dictionary.

**UX-3**: "我们的简析" is substantive **and visible**: short but method-complete where context exists. Missing context is marked; a copy button is not a substitute for on-site explanation.

**UX-4**: Exact initial morphology/POS and source sense vs chosen use; compositional phrase ≠ lexeme; idiom ≠ literal components; work terms ≠ official standard with no source.

**UX-5**: Buttons and copy near relevant target, 44px touch target; fail states honest; no rerating, no hidden Notion write or query disclosure.

**UX-6**: Mobile widths 320, 390, 768 plus desktop 1024 and 1440; vertical scrolling and bottom grading do not hide definition/analysis; reader returns to current position.

**UX-7**: Existing card IDs/events/grades/undo/backup/import/export/audio/read marks/bookmarks remain compatible and readback tested.

**UX-8**: Owner tries the preview with actual learning content and **explicitly accepts** the experience before any live Pages deployment. Build success is not product success.

## What we should not treat as a pass

- Only CSS change, opening existing details by default, one-line gloss with a "Dictionary" modal, or seven empty theory labels.
- Claiming a copyright-protected third-party dictionary is embedded when it is only linked.
- AI guesses that replace source evidence; a generic manufacturer story presented as the original article or customer email.
- 6 goldens PASS → claiming all 1,875 old cards reviewed.
- Having a GitHub PR but no actual deployed UI, or having a Pages deployment without owner UAT.
