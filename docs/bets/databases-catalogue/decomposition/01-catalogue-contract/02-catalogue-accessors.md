# Slice 1.2 — site: catalogue accessors and freshness rollup

**Owner service:** `services/site`
**Surface:** site
**Complexity:** M
**Prerequisite:** Slice 1.1 merged

## Scope

Adds the three pure accessors the display layer renders from — grouping stays in the site, core stays ignorant of what "foundation" means.

**Required Capabilities:**
- `getCatalogues(root): Catalogue[]` (`lib/content.ts`) returns one `Catalogue` per distinct `area` in the sweep, sorted ascending; `[]` when no topic carries an area; hub resolved per the tie-break (slug-alphabetical first wins, losers to `ungrouped`); movements ordered by lowest member `readingOrder`; fail-closed on a malformed sweep exactly as `sweepOrThrow` today.
- `getReadingPosition(frontmatter, root): ReadingPosition | null` (`lib/content.ts`) — total, null-on-inapplicable per `03-api-design.md`; positions derived among movement-carrying foundations only; `next` derived from the live sweep (never authored), null on the last piece.
- `summarizeCatalogueFreshness(entries, now): CatalogueFreshness` (`lib/freshness.ts`) — pure rollup keyed on cut dates via the existing `isFresh` oracle; a no-cut run must not light the count.

## Design

Implements the three function contracts in `03-api-design.md`, realizing flows (a), (b), and (c) in `02-data-flows.md`.

## Proof of work

**Proves:** Grouping, position, and freshness are derived correctly and totally from live frontmatter — including the catalogue-of-one and hub-less interim states Milestone 2 actually ships through.

**How we prove it:** Unit tests over fixture sweeps: no areas → `[]`; hub-only; hub + one foundation (the pilot state — position "1 of 1", `next` null, Continue-to-hub case); duplicate hub tie-break; unannotated foundation lands in `ungrouped` and off the path; freshness rollup against a fixed clock.

**Test file:** `tests/bets/databases-catalogue/test_slice_1_site_catalogue_accessors.ts` — generated red at Delivery start; traces to `Catalogue`, `ReadingPosition`, and `CatalogueFreshness` in `03-api-design.md`.
