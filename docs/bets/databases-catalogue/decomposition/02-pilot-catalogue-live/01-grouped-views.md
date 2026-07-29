# Slice 2.1 — site: grouped navigation, hub rollup band, reading-order rail

**Owner service:** `services/site`
**Surface:** site
**Complexity:** L
**Prerequisite:** Milestone 1 delivered (the contract this slice renders from)

## Scope

The rendering half of the display patch: both browse surfaces grouped, the hub's freshness band, and the foundation reading rail — each to its micro-polish spec, with the four new patterns recorded in `docs/design-system.md`.

**Required Capabilities:**
- Sidebar (`components/shell/sidebar.tsx`, `app/layout.tsx`): area label, hub entry, register-group disclosures with trailing mono counts, movement dividers, `[core]` badges; topics outside any catalogue render exactly as today; an empty register group does not render.
- Library (`components/library/topic-library.tsx`): area heading, hub card standalone, register-labelled groups, reading-order sort, core badges; grid stays un-sub-grouped by movement (resolved decision 1).
- Hub page (`app/[topic]/page.tsx` when `register === 'hub'`): the Catalogue Freshness Rollup instrumentation strip — one aggregate line from `summarizeCatalogueFreshness`, true live counts only.
- Foundation pages (when `register === 'foundation'` and `getReadingPosition` returns non-null): the Reading-Order Rail — movement/position line, "Read first" prereq links (absent when none), header and footer Continue (footer redirects to the hub on the last piece).
- The four patterns (Instrumentation Strip, Comparison Matrix, Register-Group Disclosure + Movement Divider, `badge-core`) recorded in `docs/design-system.md` per the design's naming.
- Motion, atmosphere, and static-micro land exactly per `01-ui-design.md`'s token-level specs; no new accent-colored element.

## Design

Wires the three views in `01-ui-design.md` (sidebar/library, hub rollup, reading rail) over the accessors Milestone 1 proved; degraded and empty states per each view's States table.

## Proof of work

**Proves:** A reader observes the grouped catalogue and the two instruments, rendered to spec, in every interim state Milestone 2 ships through.

**How we prove it:** Component tests for the grouped sidebar/library DOM (including the ungrouped-topic and empty-register cases) and both instruments' render conditions; the existing sidebar/library suites updated for the grouped tree; token-conformance smoke stays green.

**Test file:** `tests/bets/databases-catalogue/test_slice_2_site_grouped_views.tsx` — generated red at Delivery start; traces to the three view specs in `01-ui-design.md`.
