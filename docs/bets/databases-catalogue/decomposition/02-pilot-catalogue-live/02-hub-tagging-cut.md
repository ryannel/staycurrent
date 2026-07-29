# Slice 2.2 — content: tag the hub (databases v5, metadata cut)

**Owner service:** content loop (`workbench` lifecycle — not a slice-worker)
**Surface:** site
**Complexity:** S
**Prerequisite:** Slice 2.1 merged (so the tagged state is observable on the next build)

## Scope

A metadata-only cut of the `databases` topic: frontmatter gains `area: databases` and `register: hub`, the changelog records the move honestly (the article's role changes — it now fronts the catalogue; its content is unchanged until Milestone 6), and the companion-skill placeholder's `article_version` bump rides the standard snapshot mechanics.

**Required Capabilities:**
- `topics/databases/article.md` frontmatter carries `area: databases`, `register: hub` (per the hub example in `04-data-design.md`); no other content change.
- The changelog entry follows the house anatomy with an honest `**Stance:** held` line.
- The cut passes the full publish gate; the site then renders the hub card/entry grouped and the rollup band on `/databases/`.

## Design

Authors the hub frontmatter defined in `04-data-design.md`; makes the hub views in `01-ui-design.md` observable.

## Proof of work

**Proves:** The existing topic joins the catalogue through the ordinary lifecycle — no special-case tooling — and the display patch renders it as the area's front door.

**How we prove it:** `gate databases` output verbatim, then the cut with the operator's explicit go; on the served build, `/databases/` carries the rollup band and the sidebar/library show the hub fronting the area.

**Test file:** covered by the milestone front-door test (`test_milestone_2_pilot_catalogue_live.py`); no separate slice stub — the slice's artifact is a governed content cut, proven at the front door (including the R3 archived-version check).

*Process note:* this slice executes as an operator content-loop action under `STAYCURRENT.md` (convene-less staged cut, explicit operator go), not as slice-worker code delivery.
