# RL128 author evidence and scope

19 October 2026. Article: `src/drafts/relational/rl128.md`.
Status: authored, pending independent review. No publication claim.

## Commission and consequential observation

RL72/RL75: identity and grants alongside range health, relocation and membership.

TLS booking_app can SELECT and cannot UPDATE (42501). Node status and SHOW RANGES replace an absent replication_stats view. Listener56909 is discovered as nodeID5; decommission reduces 27 replicas to0, then stopping it leaves the regional application count/sum2/42.00 and no booking replica on5.

Security belongs with native operation because new members and clients must establish identity before privileges or range placement matter. A single read grant is explicitly not tenant isolation. Disk-full/blocked-relocation cases remain diagnostic obligations, without pretending a native capacity-exhaustion drill occurred.

## Execution ownership and reproduction

The coordinator executed the native lab. This author read its actual commands, outputs, errors and resulting states; the author did not mutate native scripts or observation JSON. Canonical record: `cockroach-observed.json`. Upgrade record: `cockroach-upgrade-observed.json`. Separate successful resume intervention: `cockroach-schema-resume-observed.json`. The exact 64 MiB BulkAdder error and source provenance are in `cockroach-low-memory-log-excerpt.txt`; the temporary source directory was later removed, explicitly recorded there.

Reproduce with the pinned native lab in `lab/cockroach_lab.py`, `lab/cockroach_scenarios.py` and `lab/cockroach_extra.py`, following the coordinator’s run instructions. These scripts own disposable stores, certificates, ports and cleanup. Do not run their process-loss or node-removal actions against an existing service. The live observation used 25.4.17 darwin ARM64; upgrade also pins 25.3.7. The PostgreSQL migration source is a disposable local fixture whose recorded encoding is SQL_ASCII; the demonstrated text is ASCII.

The concurrent schema index record used 200,000 source rows and final count 200001. The later repeatable script uses a smaller 50,000-row parameter to bound runtime; the article’s exact outcomes remain scoped to the observed run. Fixed job IDs and HLC timestamps are evidence from that run, not values to reuse during a new execution.

## Native labels checked

- `RL128-after-decommission`
- `RL128-before-removal`
- `RL128-create-client-identity`
- `RL128-decommission-node`
- `RL128-denied-write`
- `RL128-health-evidence`
- `RL128-limited-role`
- `RL128-nine-node-health`
- `RL128-node-health`
- `RL128-permitted-read`

## Primary sources

The following version-pinned primary pages were browsed in this authoring session; the article annotates their role. New product guarantees remain distinct from the invented figures and observed native outcomes.

- https://www.cockroachlabs.com/docs/v25.4/authentication
- https://www.cockroachlabs.com/docs/v25.4/authorization
- https://www.cockroachlabs.com/docs/v25.4/cockroach-node

## Limits and follow-through

All native nodes share one macOS host. Region labels and loopback timings do not prove independent regional survival, WAN latency, power-loss durability or production throughput. Backup restores use separate database names on the same cluster; independent destination-host recovery and external-provider storage policy remain untested. Native failure results are taught through their decision: repair the query or schema, wait for an actual state transition, restore the missing dependency, or reconcile accepted later work.

No map change is proposed. Root owns the final assembled preview checks and independent review; status remains drafting.
