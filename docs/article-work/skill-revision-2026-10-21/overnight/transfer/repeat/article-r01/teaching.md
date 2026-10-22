# Teaching review · article · Keep a diagram under the pointer · D-REPEAT-ARTICLE-r01

Inputs read: the frozen [manifest](manifest.json); the local worktree's `AGENTS.md`, `README.md`, `docs/site-direction.md`, `.agents/skills/staycurrent-review/SKILL.md` and only its teaching perspective; the transfer commission; canonical root and child plans and shared Review board example; the complete child article, Gesture comparison component and its three displayed source modules; the current parent article solely as prerequisite context. Calibration used all three fixed reference articles in full, including their figure captions, controls, textual outcomes and message/step transcripts from the existing built pages, with index figure narration also read in source. No earlier versions, reviews, findings, writer notes, work records, evidence index, planning records outside the canonical plans/example, other trial content or agent inventories were consulted.

Highest severity: medium

## Timing and frozen bindings

- First explicitly logged UTC checkpoint: `2026-10-22T01:34:06Z`, after initial instructions/context reading had begun. No exact earlier start time was recorded.
- Logged source/reference/plan reading and rendered-semantic inspection interval: `2026-10-22T01:34:06Z`–`2026-10-22T01:36:47Z`.
- Report preparation followed that interval. The completion timestamp is recorded at the end of this report.
- Source root: `/private/tmp/staycurrent-skills-night-repeat`; frozen candidate D-02 unchanged.
- Manifest SHA-256: `d9e2ef7b9698f4b8cfa3fa553bdabe2a89b5495eb9d8629220b5922d0749fb75`. All **51** manifest entries were hashed against the worktree; all matched.
- Child source SHA-256: `d47aee1fa495930ebd22e3fc0a0e7ff8172f640459d92a606585f6da2e103365`.
- Gesture comparison SHA-256: `db9b24a79332e27838e6e8c114beee47f6a8f3e64a8813bc40031e4609bef4fd`.
- Child model / runtime / event policy SHA-256: `deccc407072113bd1bafeb6f3a7ce810fc623b761f8f457b8eb7287a52269edf` / `ebf06572836098e2d5cbec4326b88f185d0b1f311894f9014a3663076227c227` / `0c244d0b3cdd95706fb0331d7ed60305f467603dc424a2dabb668270c674eda0`.
- Review skill / teaching perspective SHA-256: `477378da081b4e75ee24d08048ecac88b6751b48fd602112a3cf74be335e574b` / `819f0712a03ab8601671ff9451cf0d56f627ed8e3a3cc9c04fcd9fc7903d7ef6`.
- Commission SHA-256: `08e4afa034fa9969b716cf810ec312e96ee7756d9f67c187921f52d84a47e527`.
- Existing built child HTML SHA-256: `66d9be8948cfbb3284116442abd9f900d0a46af46ca9ef34bcbb765e517be4db`.
- Built reference HTML SHA-256, sequences / indexes / storage: `6cac7de2d94fde8dc0952c0ce5c95532571e094a406c9b6293ee3f344686fac0` / `bd3cfd9119eb777f06b956048d6e4d140c182b40296b10c18b3ec847bb92e7cd` / `82b729740dce14e2c536df086c98c9203979c14d74cbf792d6cfdf4d688f2e5c`.
- Rendered child inspected read-only in an independent Chrome tab at `http://127.0.0.1:4344/review/skill-transfer/gestures/`. The observed headings, worked prose, figure controls and initial trace/readouts agree with the reviewed source. No shared viewport/theme or native input was changed.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | The prerequisite root is explicit; O/G/W/V/C, invariant, angle convention, new-value prime, clamping, pointer events/capture, button flags and NaN are explained or recalled when needed. Root-owned composition and inversion receive targeted links. |
| 2. Order | pass | Retained point → simplest pan solve → stationary zoom/turn target → card placement → current DOM mapping → lifecycle → guarded commit is a coherent progression. The equations are derived by substitution, rather than presented as recipes. |
| 3. Examples | pass | Review and Review lane carry baseline, half-size, turned-view, stale resize, wrong divide-by-zoom and arbitrary-grab cases. Pan and Card share the pointer path while changing different stored parameters. |
| 4. Showing | finding (low) | The before/after pan table, numerical anchor examples, shared trace, four-space displacement readouts, static outcomes and lifecycle table show changing state. The turned-view prediction is answered before the reader reaches its reveal control; see teaching-2. |
| 5. Judgement | finding (medium) | The geometric/lifecycle diagnostic distinctions and limits are useful, but the promised complete implementation route omits reader-accessible dependencies and markup; see teaching-1. |
| 6. Gradual exposure | pass | The parent already explains the geometric core and anchored update at high level. This child earns its page through absolute gesture updates, changing browser mappings and event completion/cancellation; it does not reteach matrix multiplication or inversion. |
| 7. Placement of additions | not applicable | This is an independent first review of the complete child; no coordinator-named additions were supplied. The complete route and ownership of all present material were nevertheless assessed under checks 2, 4 and 6. |

## Complete learning route

The reader can explain why retaining a point is more reliable than adding per-event movement, derive each update in its destination space, reproduce the commissioned numerical cases and identify the stored parameter each gesture changes. The strongest part is the connection between one invariant and several gestures: the pan solve becomes the compensation for zoom and chosen-pivot view rotation, while card placement uses the same retained-point reasoning in G. The translation-only assumption is stated before the card equation, and the fixed-linear-part extension stays a brief reminder rather than a new lesson.

The article also prepares useful practical judgement. It distinguishes a wrong-space displacement, a bridge that changed after resize, an unconvertible sample and a broken event stream. The chord table makes the end condition concrete, including the later movement that must be ignored. Keeping the last valid state on cancellation is labelled editor policy. Singular inversion and zoom limits retain their proper ownership in the root's geometry explanation and this editor's policy.

The route is not yet fully delivered as an implementation a reader can reproduce from the article. The three source panels describe actual integrated code, but reaching that integration still requires reconstructing absent imports and DOM scaffolding. This is a bounded delivery gap within an otherwise coherent explanation, not a request for another article or another mechanism.

## Findings

### teaching-1 · medium · Check the promise before storing the update, source panels (gestures.astro lines 97–99)

Problem: The article calls its source panels the connected implementation route, but the panels depend on material that the reader is not supplied. `model.mjs` imports `../example.mjs` and `../geometry.mjs`; `runtime.mjs` imports those helpers and expects the figure's numerous `data-*` elements. The article exposes the event policy, model and runtime, but neither the shared helper modules nor the markup required by `mount`, and offers no complete child example download. The parent's displayed SVG uses a different binding scheme, and its download implements the parent's smaller editor rather than this gesture route.

Effect: A programmer who understands the derivation still cannot reproduce the promised complete small gesture implementation directly from the provided route. They must discover missing module contents and rebuild the demo's DOM/control contract, or extract and adapt the relevant fragments themselves. That extra work is not prepared by the teaching and obscures which few bindings are essential to the gesture versus incidental to the teaching controls.

Suggestion: Provide one runnable child example containing the necessary modules and minimal markup, or give a compact complete integration path with those dependencies and bindings explicitly available. Keep the same derived geometry and event policy; this does not need another implementation or page.

Evidence: `src/pages/review/skill-transfer/gestures.astro` lines 4–6 and 92–99 identify the three displayed modules. `src/components/coordinate-trial/a01/model.mjs` lines 1–2 import the omitted canonical data and helpers. `runtime.mjs` lines 1–4 and 23–27 import those helpers and bind the required DOM elements; later event/control bindings require further figure-specific elements. The rendered article's sources and links contain no child implementation package or corresponding dependency/markup listing. The canonical child brief explicitly promises a complete small single-pointer implementation.

### teaching-2 · low · Move the card in its parent's space, turned-view prediction (gestures.astro line 61)

Problem: The paragraph asks the reader to predict the direction before revealing the result below, then immediately gives all four displacements and the final `(-10, 0)` placement before the figure and its Reveal result control.

Effect: The figure remains a useful comparison, but its offered prediction cannot test whether the reader can carry the axes through the turned view: the answer has just been read.

Suggestion: Put the prediction before the worked answer, with the answer revealed in the figure or explained immediately after it. Alternatively frame the figure as a verification/comparison without promising a fresh prediction.

Evidence: The article's line 61 contains both the prediction request and complete answer; lines 62–63 then introduce the failed rule and figure. The rendered figure initially says “Predict where the grab will land, then reveal the result.”

## Limits

This is a teaching review, not practitioner or visual certification. I read the current rendered semantics and scripted figure material without playing controls, dispatching events or changing figure state. I did not run build/serve commands, execute verification scripts, inspect the author's work record/evidence index or infer physical-device/cross-browser coverage. Reference calibration used the existing built figure transcripts/fallbacks and relevant scripted narration, rather than fresh animation playback. No source, plan or shared UI settings were edited; this report is the sole durable review output.

Report completed UTC: `2026-10-22T01:37:42Z`. Report preparation interval: `2026-10-22T01:36:47Z`–`2026-10-22T01:37:42Z`.
