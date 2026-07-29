# Milestone 6: The hub re-cut — `/databases` becomes the chooser and map

**Type:** surface (site)

**Consumer:** a reader landing on `/databases` — they name their access pattern, and leave with a specific profile or foundation to read: the eight axes, the seven-profile comparison matrix, the reading path, and the decision tree, in place of the monolith essay.

**Demonstrable goal:** The `databases` topic cut to its hub form: chooser-and-map article (authored content — matrix, axes, reading path, decision tree as markdown/mermaid; zero new code), the monolith essay superseded into `versions/`, every matrix and tree link resolving to a live piece. This is the program's only re-cut and it lands last, per the no-dead-links invariant.

**Sequencing rationale:** Last by construction: the hub links to all 24 pieces, so it can only cut when they all exist. It also closes the pitch's success signals — the rubric audit and the ≤2-clicks reader journeys are checked against this page.

**Acceptance criteria (agreed front-door cases):**
- [ ] From `/databases`, any of the 7 profiles is reachable in ≤2 clicks via the matrix; the reading path is navigable end to end; a full link sweep of the hub finds zero dead links.
- [ ] The monolith remains readable at its archived version URL; the hub's changelog entry records the re-cut honestly with its Stance line.
- [ ] The rubric audit table (all 11 competencies, all 10 archetypes → live provenance-cited sections) is published in the bet's validation record.

## Proof of work

**Proves:** The catalogue has a front door that chooses; the bet's success signal is answerable yes on the deployed site.

**How we prove it:** Drive `/databases` on the served build: exercise the decision tree and matrix into two clicks reaching a profile; walk the reading-path links; run the link sweep; confirm the archived monolith renders at `/databases/v/<n>/`.

**Test file:** `tests/bets/databases-catalogue/test_milestone_6_hub_recut.py` — generated red on arrival.

## Slices

Authored on arrival at Milestone 5's postmortem. Expected shape: one content slice (the re-cut, fresh-drafted through the writing pipeline — the writer is never shown the monolith's prose) plus the validation-audit slice.
