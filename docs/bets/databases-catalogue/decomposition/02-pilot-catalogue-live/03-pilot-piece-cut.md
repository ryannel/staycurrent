# Slice 2.3 — content: the pilot piece (query-execution v1)

**Owner service:** content loop (`workbench` lifecycle — not a slice-worker)
**Surface:** site
**Complexity:** L
**Prerequisite:** Slice 2.2 merged

## Scope

The catalogue's first foundation, produced end to end through the witnessed-evidence writing pipeline the operator sanctioned on 2026-07-28: fresh lab runs (planner selectivity + slow-query harnesses), fact notes at measured resolution, a stake-carrying brief, a fresh-context draft, mechanical intake gates, an accuracy-vs-logs audit, a blind reader review, the binding editorial pass, and the operator's explicit go to cut.

**Required Capabilities:**
- `topics/query-execution/` is a complete founding topic (five-artifact shape) whose frontmatter carries `area: databases`, `register: foundation`, `movement: Single Node`, `reading_order: 6` per the locked table in `04-data-design.md`.
- The article is a 1,100–1,700-word evidence-grounded stance piece per the witnessed-evidence convention (`technical-design/04-data-design.md` § The evidence directory); every measured figure traces to a named raw log in `topics/query-execution/evidence/` (the published harness — drivers, environment records, immutable raw logs); provenance separates measured from source-derived claims.
- The v1 cut passes the full publish gate; the deployed piece renders the reading rail with derived positions and Continue-to-hub.

## Design

Authors the foundation frontmatter in `04-data-design.md`; makes the reading-rail view in `01-ui-design.md` observable end to end; the article body is authored content (zero code).

## Proof of work

**Proves:** A brand-new sibling topic travels the unmodified single-slug lifecycle into the catalogue, and the piece itself meets the evidence standard the program exists to ship.

**How we prove it:** The writing pipeline's own gates recorded in the research log (intake word-count and label trace, accuracy audit to raw files, blind-reader verdict, editorial `PRESENT`); `gate query-execution` verbatim; the operator's go; then the front-door drive of `/query-execution/` on the served build.

**Test file:** covered by the milestone front-door test (`test_milestone_2_pilot_catalogue_live.py`); the content gates above are the slice's own record.

*Process note:* article prose is drafted by the writer-project pipeline under its quarantine rules (the writer never sees the monolith or any staycurrent prose); the staycurrent editorial pass and publish gate bind as for any cut.
