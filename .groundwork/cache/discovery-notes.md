# Discovery Notes

> Signals captured out-of-phase during GroundWork conversations. Each skill reads its section before starting and removes lines once incorporated into output. Section headers match the canonical set defined in `operating-contract.md` — do not add, rename, or reorder them.

---

## Product Brief

<!-- Vision-level signals captured during later phases — new user types, missing capabilities, refined success criteria. -->

---

## Design System

<!-- What the user sees or does: interaction patterns, search/browse/navigation flows, aesthetic instincts. User-facing signals go here even when they name a concrete mechanism (e.g. faceted vs conversational search). Internal mechanisms belong in ## Design Details. -->

---

## Architecture

<!-- Infrastructure preferences, scaling instincts, technology opinions surfaced outside the architecture phase. -->

---

## Design Details

<!-- Internal mechanisms the user never sees directly — async flows, callback patterns, job lifecycles, data ownership, contract format choices, resiliency patterns. Not user-facing interaction patterns; those go to ## Design System. -->

---

## Bets

- Post-MVP sequencing instincts (from setup, 2026-07-09): second topic proves loop repeatability; framework extraction after that; search at ~25 topics.
- Skill-design bet (operator, 2026-07-09, change-proposal-2): companion-skill authoring deferred until the article format settles; the one-skill-per-topic assumption is in doubt — the databases topic will likely yield SEVERAL focused skills. A future bet must design the skill unit, the content contract implications (topics/<slug>/skill/ shape), and how the install page presents a set. Until then v1+ ships an honestly-labelled placeholder.
- Diagram captions (slice 2.2 review, 2026-07-09): the UI design commits every mermaid figure to a designed `alt` and caption, and the diagram-render-failure state renders "the figure's designed caption in the empty-state pattern" — but the v1 article's fences carry no captions and the content contract has no caption channel. The writer-skill/content-format bet must design how a fence declares its caption/alt; the renderer follows. Until then the failure state falls back to showing the fenced source.
- Framework-extraction constraint (slice 2.3, 2026-07-10, change-proposal-4): a zero-topic instance cannot build — Next's static export requires ≥ 1 `[topic]` route, so a fresh Stay Current instance has no deployable first-run state. Extraction must solve this (conditional route emission, a seeded starter topic, or an export-mode change) before "the first research run creates one" is literally true for a new instance. Also: no canonical framework-docs URL exists yet — the `/` empty state and any future instance-facing links point at the GitHub repo as placeholder.
- Retrospective action items (first-living-topic validation, 2026-07-14): **R1** — next content-schema/gate change must verify gate↔loader parity across all content stores in one pass (ADR 0006 is the standard). **R2** — close maturity G9 (test git-config fragility + non-xdist-safe shared build dirs); promote the fixture-root-build hardenings to one shared helper. **R3** — at the first live v2 cut, confirm the deployed site shows the new version standing alone with the prior archived (the one loop path the live run's no-cut did not exercise).
- Readiness carry-forward (first-living-topic, 2026-07-14): the bet is green and the loop closed (no-cut), but NOT deployed — the trunk merge, first Pages deploy, staycurrent.dev DNS, and the deployed-origin walk + red-check PR experiment remain. A real v2 cut is proven only in the rehearsal, not live.
- Skill-design input (databases-catalogue discovery, 2026-07-16): the databases hub's chooser is the most skill-shaped artifact in the catalogue — an agent can execute its decision tree + estimation arithmetic directly. Candidate first real companion skill when the change-proposal-2 deferral lifts; the 7 tech profiles then bind as its reference cards.

<!-- Delivery priorities, MVP scope instincts, feature sequencing for future bets. -->
