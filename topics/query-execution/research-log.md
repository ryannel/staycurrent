# Query Execution — Research Log

## 2026-07-29 — cut v1

Founding run for the databases catalogue's first foundation, produced through the witnessed-evidence writing pipeline: fresh lab runs, fact notes at measured resolution, a stake-carrying brief, a fresh-context draft, mechanical intake gates, an accuracy audit, a blind reader review, and a binding editorial pass, ending in the operator's explicit go to cut.

Two labs re-run fresh on 2026-07-29 rather than reused from prior sessions — selectivity and slow-query, both PostgreSQL 16.14 (`postgres:16-alpine`), Docker on a laptop, chain-of-custody held (setup, drivers, environment records, and immutable raw logs published at `evidence/`, spot-verify runs kept separately under `verify/` and never overwriting `raw/`). The selectivity lab flips the same indexed predicate between an index scan and a sequential scan across selectivities, watches a covering index sit unused until `VACUUM` populates the visibility map, and catches the planner mis-costing a fresh bulk insert at `rows=1` against an actual 500,000. The slow-query lab walks one join from 26,933 buffers with no join-column indexes down to 1,800 with two, then closes by reading `pg_stat_user_indexes` to confirm which added index the planner actually used.

Fact notes distilled from the fresh raw logs only, not from any prior session's numbers. Draft went through five versions against a brief carrying the stance, the audience, and the two labs' fact notes:

- Mechanical length gate: final draft 1,587 prose words, inside the 1,200–1,600-word contract.
- Full accuracy audit against the raw logs, plus a targeted re-audit on the items the first pass flagged: zero fabricated figures, every fenced artifact block byte-verified as a contiguous, unedited excerpt of its source log.
- Blind reader review: positive, and the reader independently verified the piece's arithmetic (the frequency-times-row-count estimate check) without being prompted to.
- Editorial pass: REVISE on the first read, PRESENT once the advisories were applied.

One editorial decision recorded rather than silently absorbed: the fact-notes' labelled reading that the stale-insert rows stayed cheap to scan because they landed physically clustered at the table's end was left out of the piece on budget grounds — the word count had no room to carry another labelled interpretation without cutting something load-bearing. It is candidate material for this topic's next research run, not a finding this cut dropped for cause.

Stance founded at v1; no prior version to hold it against.
