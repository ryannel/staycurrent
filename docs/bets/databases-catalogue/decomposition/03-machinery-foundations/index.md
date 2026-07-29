# Milestone 3: The machinery movement fills in — five foundations, two movements, a real reading path

**Type:** surface (site)

**Consumer:** a reader on the deployed site — they see a Foundations group of five (Storage Engines, Transactions, Query Execution under SINGLE NODE; Replication, Partitioning under DISTRIBUTED), walk the Continue chain between live pieces, and follow "Read first" prereq links that resolve.

**Demonstrable goal:** Four more foundations cut and live — `storage-engines`, `transactions`, `replication`, `partitioning` — each an evidence-grounded stance-piece with its lab harness published in-repo, each wearing the rail with honest derived positions ("piece 2 of 5" as of this milestone, never a hardcoded total). The reading path now actually chains: Continue on one live piece names the next live piece; prereqs among live pieces render as resolving links.

**Sequencing rationale:** These four re-home the monolith's strongest ground, and three of their labs already exist in-repo — the v4 harnesses at `topics/databases/evidence/` (`t1-isolation-rerun/`, `r4-replication/`, `r4-partitioning/`, landed with the v4 cut and verifiable there); a new storage-engines lab is this milestone's only net-new evidence work. They prove the wave rhythm — several sibling cuts in sequence, each with an operator go — before the program commits to the twelve pieces that follow. Slices are authored on arrival, at Milestone 2's postmortem.

**Acceptance criteria (agreed front-door cases):**
- [ ] `/` and the sidebar show Foundations (5) across two movement dividers, ordered by reading order within each.
- [ ] A mid-sequence live piece (e.g. `/transactions/`) shows derived positions consistent with the live sweep and a Continue link naming the next live foundation; the last live piece's Continue returns to the hub.
- [ ] Each new piece's provenance names its measured evidence, and its harness directory exists in-repo under `topics/<slug>/evidence/`.
- [ ] Publish gate green for all topics after every individual cut (waves land piece by piece; the site is never broken between cuts).

## Proof of work

**Proves:** The catalogue grows piece-by-piece through the single-slug lifecycle without ever breaking the deployed site, and the derived reading instrumentation stays honest at every intermediate count.

**How we prove it:** After each cut, build and serve exactly as CI does and drive the grouped views and the changed piece's rail; at milestone close, walk the Continue chain end to end from the first live foundation and confirm every hop lands and the final hop returns to the hub.

**Test file:** `tests/bets/databases-catalogue/test_milestone_3_machinery_foundations.py` — generated red on arrival; drives the grouped views and rail chain in `01-ui-design.md`.

## Slices

Authored on arrival at Milestone 2's postmortem (plan-just-enough): expected shape is one content slice per piece (four operator-sanctioned cuts through the writing pipeline) plus a storage-engines lab-construction slice.
