# RL129 author evidence and scope

19 October 2026. Article: `src/drafts/relational/rl129.md`.
Status: authored, pending independent review. No publication claim.

## Commission and consequential observation

RL73: scope, incremental/history choices, dependencies, jobs and restore acceptance.

Full and incremental jobs succeed. Latest restore preserves r80/concurrent-A/r82. AS OF1792408336255229000 omits valid r82; explicit reconciliation restores it. Recovered sessions shows remaining0 and only root/admin grants. Missing collection fails58P01.

The final card requires usable recovery rather than a successful job. Latest and earlier-time restores into new database names teach that decision. These are isolated data destinations on the same cluster; no independent-host restore, production restore-time or cloud-storage guarantee is claimed. The missing ordinary grant is treated as a real application acceptance gap.

## Execution ownership and reproduction

The coordinator executed the native lab. This author read its actual commands, outputs, errors and resulting states; the author did not mutate native scripts or observation JSON. Canonical record: `cockroach-observed.json`. Upgrade record: `cockroach-upgrade-observed.json`. Separate successful resume intervention: `cockroach-schema-resume-observed.json`. The exact 64 MiB BulkAdder error and source provenance are in `cockroach-low-memory-log-excerpt.txt`; the temporary source directory was later removed, explicitly recorded there.

Reproduce with the pinned native lab in `lab/cockroach_lab.py`, `lab/cockroach_scenarios.py` and `lab/cockroach_extra.py`, following the coordinator’s run instructions. These scripts own disposable stores, certificates, ports and cleanup. Do not run their process-loss or node-removal actions against an existing service. The live observation used 25.4.17 darwin ARM64; upgrade also pins 25.3.7. The PostgreSQL migration source is a disposable local fixture whose recorded encoding is SQL_ASCII; the demonstrated text is ASCII.

The concurrent schema index record used 200,000 source rows and final count 200001. The later repeatable script uses a smaller 50,000-row parameter to bound runtime; the article’s exact outcomes remain scoped to the observed run. Fixed job IDs and HLC timestamps are evidence from that run, not values to reuse during a new execution.

## Native labels checked

- `RL129-before-later-acceptance`
- `RL129-committed-mistake`
- `RL129-earlier-misses-valid-order`
- `RL129-full-backup`
- `RL129-incremental`
- `RL129-later-valid-order`
- `RL129-missing-backup`
- `RL129-reconcile-later-order`
- `RL129-restore-earlier`
- `RL129-restore-latest`
- `RL129-restored-application`

## Primary sources

The following version-pinned primary pages were browsed in this authoring session; the article annotates their role. New product guarantees remain distinct from the invented figures and observed native outcomes.

- https://www.cockroachlabs.com/docs/v25.4/backup
- https://www.cockroachlabs.com/docs/v25.4/take-full-and-incremental-backups
- https://www.cockroachlabs.com/docs/v25.4/restore

## Limits and follow-through

All native nodes share one macOS host. Region labels and loopback timings do not prove independent regional survival, WAN latency, power-loss durability or production throughput. Backup restores use separate database names on the same cluster; independent destination-host recovery and external-provider storage policy remain untested. Native failure results are taught through their decision: repair the query or schema, wait for an actual state transition, restore the missing dependency, or reconcile accepted later work.

No map change is proposed. Root owns the final assembled preview checks and independent review; status remains drafting.

## Coordinator supplement after author handoff

`cockroach-restore-observed.json` and `lab/cockroach_restore.py` add an actual
separately initialised destination cluster, missing application identity28P01,
created identity but absent table grant42501, repaired SELECT success, mutation
denied42501 and restored remaining>=0 constraint23514. Backup/restore jobs
succeeded. The source fixture is smaller: r80/20, s7 remaining2. Restore wall time
was1.1378seconds. Both clusters share one host, temporary external-file directory
and labCA. Owned processes were stopped and temporary data removed. This closes
the earlier missing runtime acceptance while preserving the geographical limit.
