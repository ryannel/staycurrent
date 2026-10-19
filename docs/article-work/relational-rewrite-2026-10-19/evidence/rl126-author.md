# RL126 author evidence and scope

19 October 2026. Article: `src/drafts/relational/rl126.md`.
Status: authored, pending independent review. No publication claim.

## Commission and consequential observation

RL70: distributed operators, KV lookup work, key/index design and locality evidence.

Covering removes the index join: 20 KV rows/2 calls → 10/1. Four hash buckets make a different global newest-ten query read 40 KV rows/4 calls rather than 10/1, with 110 KiB versus 20 KiB reported maximum memory.

The final card earns both the covering-index repair and the measured ordered-read regression after hash sharding. Native counters and placement are taught directly; sustained write-throughput and WAN-latency claims are excluded because they were not measured.

## Execution ownership and reproduction

The coordinator executed the native lab. This author read its actual commands, outputs, errors and resulting states; the author did not mutate native scripts or observation JSON. Canonical record: `cockroach-observed.json`. Upgrade record: `cockroach-upgrade-observed.json`. Separate successful resume intervention: `cockroach-schema-resume-observed.json`. The exact 64 MiB BulkAdder error and source provenance are in `cockroach-low-memory-log-excerpt.txt`; the temporary source directory was later removed, explicitly recorded there.

Reproduce with the pinned native lab in `lab/cockroach_lab.py`, `lab/cockroach_scenarios.py` and `lab/cockroach_extra.py`, following the coordinator’s run instructions. These scripts own disposable stores, certificates, ports and cleanup. Do not run their process-loss or node-removal actions against an existing service. The live observation used 25.4.17 darwin ARM64; upgrade also pins 25.3.7. The PostgreSQL migration source is a disposable local fixture whose recorded encoding is SQL_ASCII; the demonstrated text is ASCII.

The concurrent schema index record used 200,000 source rows and final count 200001. The later repeatable script uses a smaller 50,000-row parameter to bound runtime; the article’s exact outcomes remain scoped to the observed run. Fixed job IDs and HLC timestamps are evidence from that run, not values to reuse during a new execution.

## Native labels checked

- `RL126-covering-query`
- `RL126-noncovering-query`
- `RL126-ordered-read`
- `RL126-sharded-read`

## Primary sources

The following version-pinned primary pages were browsed in this authoring session; the article annotates their role. New product guarantees remain distinct from the invented figures and observed native outcomes.

- https://www.cockroachlabs.com/docs/v25.4/explain-analyze
- https://www.cockroachlabs.com/docs/v25.4/hash-sharded-indexes
- https://www.cockroachlabs.com/docs/v25.4/performance-recipes

## Limits and follow-through

All native nodes share one macOS host. Region labels and loopback timings do not prove independent regional survival, WAN latency, power-loss durability or production throughput. Backup restores use separate database names on the same cluster; independent destination-host recovery and external-provider storage policy remain untested. Native failure results are taught through their decision: repair the query or schema, wait for an actual state transition, restore the missing dependency, or reconcile accepted later work.

No map change is proposed. Root owns the final assembled preview checks and independent review; status remains drafting.
