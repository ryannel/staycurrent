# Milestone 2: A reader sees the catalogue take shape — the pilot foundation live on the grouped site

**Type:** surface (site)

**Consumer:** a reader on the deployed site — they open `/`, see the databases area grouped into registers, open `/query-execution/`, and read a complete, evidence-grounded foundation piece wearing its reading-order rail.

**Demonstrable goal:** With the proven contract rendered and `query-execution` cut as the catalogue's first foundation, the reader observes: the library grouped under a "Databases" area heading (hub card standalone, a Foundations group whose one card is Query Execution under its SINGLE NODE movement divider); the sidebar showing the same grouped tree; `/query-execution/` rendering the trust header, the reading-order rail (movement, derived position, Continue → back to the hub), the stance callout, the article, and provenance; and `/databases/` carrying the freshness rollup band with the true live count. The piece's lab harness is published in-repo at `topics/query-execution/evidence/` per the evidence-directory convention (`technical-design/04-data-design.md` § The evidence directory) and referenced from the article.

**Sequencing rationale:** This is the thinnest reader-visible flow through the bet's riskiest *real* path — a sibling topic cut through the unmodified single-slug lifecycle and rendered by the new grouping code, with derived instrumentation that must stay honest at catalogue-of-one scale. It lands the design-system work (Instrumentation Strip, Register-Group Disclosure, Movement Divider, `badge-core`) in the running app first, so every later wave inherits it. It can only follow Milestone 1: every element it asserts renders from the contract Milestone 1 proved.

**Acceptance criteria (agreed front-door cases):**
- [ ] On `/`, the reader sees the "Databases" area heading, the hub card standalone ahead of the registers, and a Foundations group whose one card is Query Execution; the sidebar shows the same two-level grouping with the SINGLE NODE movement divider and a "(1)" trailing count.
- [ ] On `/query-execution/`, the reading-order rail renders "Single node · piece 1 of 1 · 1st of 1 in this movement" (derived from the live sweep, not authored), no "Read first" line (no prereqs live yet), and a footer "Continue: back to the chooser and map →" linking to `/databases/`.
- [ ] On `/databases/`, the freshness rollup band shows the true live count (2 pieces) and the most recent cut — never a hardcoded total.
- [ ] After the `databases` v5 metadata cut (this program's first cut), `/databases/v/4/` still renders the archived v4 with the live version standing current — closing pitch retro item R3 here, at the first opportunity.
- [ ] The full publish gate passes for every topic; the deployed build renders all of the above with zero console errors on the smoke sweep.

## Proof of work

**Proves:** The catalogue architecture works end to end on the real pipeline — a new sibling topic through the untouched cut lifecycle, rendered by the proven contract, honest at catalogue-of-one scale, with the program's first cut leaving the prior version archived and reachable.

**How we prove it:** Build and serve the static export exactly as CI does (`prebuild` → `next build` → `serve:static`), then drive the routes the way a reader would: assert the grouped library and sidebar DOM on `/`, the rail's derived text and hub-link on `/query-execution/`, the rollup band's live count on `/databases/`, and the archived render at `/databases/v/4/`. The content beneath is real — `query-execution` is a genuine v1 cut through `create`/`gate`/`cut` with the operator's go, not a fixture topic.

**Test file:** `tests/bets/databases-catalogue/test_milestone_2_pilot_catalogue_live.py` — generated red at Delivery start; drives the library, sidebar, hub-rollup, and reading-rail views in `01-ui-design.md` over the contract proven by Milestone 1.

## Slices
- [Slice 2.1 — site: grouped navigation, hub rollup band, reading-order rail](./01-grouped-views.md)
- [Slice 2.2 — content: tag the hub (databases v5, metadata cut)](./02-hub-tagging-cut.md)
- [Slice 2.3 — content: the pilot piece (query-execution v1)](./03-pilot-piece-cut.md)
