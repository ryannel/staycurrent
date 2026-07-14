# Change Proposal 3 — diagram reservation absorbs, not eliminates, render growth

**Severity:** minor (one micro-polish mechanism corrected; no API, schema, or ladder change)
**Discovered:** slice 2.2 delivery review (edge-case tracer, confirmed live), 2026-07-09.

## Discovery / evidence

The `/[topic]/` design committed to three things at once: mermaid figures render client-side, their containers reserve explicit `min-height` at build, and settled text never shifts. Measured against the real v1 article at 1440×800, the three diagrams render at 614/985/597px against the 320px reservation — every JS page load extends the figures by ~1.2k px cumulative, shifting everything below them. The three commitments are unsatisfiable together for any diagram taller than its reservation: a fixed cap scales the tallest diagram to ~32% (illegible), and exact build-time measurement requires a headless browser in the site build — machinery out of proportion to the harm, since the growth is below the fold and browsers' native scroll anchoring keeps the reader's viewport pinned to the content they are reading while below-fold figures expand.

## Change

- **`technical-design/01-ui-design.md`**, `/[topic]/` micro-polish spec: the reservation's contract restated — the `min-height` absorbs the initial layout so the pre-render page shape is stable and the CLS budget is bounded; a rendered figure may extend beyond the reservation, with scroll anchoring preserving the reading position. The "never shifts settled text" absolute is retired.
- **`decomposition/02-article-readable/02-doc-shell-and-trust.md`**, Proof of work: the observation reworded to match — diagrams render in theme inside their reserved-space containers, the reservation absorbing initial layout rather than pinning final height.
- **`docs/design-system.md`**, Performance budgets → progressive-enhancement line: the same absolute retired — the reservation absorbs the initial render; a figure may extend beyond it with scroll anchoring preserving the reading position.
- `services/site/lib/content.ts`'s comment (code, not prose) is corrected in the slice diff to state the same bounded claim.

## Impact

- No slice added, removed, or re-scoped; slice 2.2's implementation already exhibits the accepted behaviour.
- Slice 2.1's contract is untouched — the marker container still carries the fenced source and the explicit reservation; only the reservation's *stated guarantee* changes.
- If Tier-2/Tier-3 milestone review judges the on-render growth harmful in practice, the recorded alternative is build-time size measurement (headless render, per-figure `aspect-ratio` baked into the export) — deliberately not taken now to keep the site build browser-free before M3's CI pipeline lands.

## Before / after

Before: "container reserves explicit `min-height` so client render never shifts settled text (CLS budget)"; proof observes "no layout shift of settled text". After: the reservation absorbs the initial layout and bounds CLS; figures may extend on render with scroll anchoring holding the reading position; proof observes diagrams rendered in theme inside their reserved-space containers.

**Decision:** approved by the operator, 2026-07-09 (option chosen over build-time measurement and a fixed 320px cap).
