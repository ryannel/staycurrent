# Milestone 4: The full reading path — seventeen foundations across five movements

**Type:** surface (site)

**Consumer:** a reader on the deployed site — they see the complete Foundations group (17) under five movement dividers and can walk the whole reading path from Capacity Planning to Database Observability.

**Demonstrable goal:** The remaining twelve foundations cut and live: `capacity-planning`, `data-models`, `schema-design`, `consensus`, `distributed-transactions`, `multi-region`, `caching`, `derived-data`, and the Operations practice movement (`schema-migrations`, `connection-pooling`, `backup-recovery`, `database-observability`). Every piece carries its movement, reading order, and prereqs; the path is contiguous 1–17; practice pieces are evidence-grounded on the same standard as the machinery pieces (labs where a measurement is news — the literature-gap rule).

**Sequencing rationale:** Follows Milestone 3 because the machinery pieces are most of the practice pieces' prereqs, and because the wave rhythm those four cuts prove is what these twelve then run on. Movement display names are settled (the operator's plain-language set, 2026-07-29) — no naming blockage remains. Slices are authored on arrival.

**Acceptance criteria (agreed front-door cases):**
- [ ] Foundations (17) across five movement dividers, each movement's members contiguous in reading order.
- [ ] The Continue chain walks 1→17 without a dead hop; piece 17's Continue returns to the hub.
- [ ] Every prereq link on every foundation resolves (no 404s among live pieces at milestone close).
- [ ] Each practice piece's provenance distinguishes measured claims from source-derived ones per the house convention.

## Proof of work

**Proves:** The catalogue's pedagogical spine is complete and navigable, and the practice tier holds the same evidence standard as the machinery tier.

**How we prove it:** At milestone close, drive the full Continue chain 1→17 on the served static build, click every "Read first" link on every foundation, and confirm the sidebar/library counts; spot-audit two practice pieces' provenance against their in-repo harnesses.

**Test file:** `tests/bets/databases-catalogue/test_milestone_4_foundations_complete.py` — generated red on arrival.

## Slices

Authored on arrival at Milestone 3's postmortem. Expected shape: twelve content slices (one per piece, operator go each) plus lab-construction slices for the practice movement (migrations-under-locks, pooling saturation, PITR restore drill, observability probes — each subject to the literature-gap check).
