# RL130 author evidence and scope

19 October 2026. Article: `src/drafts/relational/rl130.md`.
Status: authored, pending independent review. No publication claim.

## Commission and consequential observation

RL74a: schema versions, durable job states, backfill and caller compatibility.

10,000 stored computed values have aggregate difference0. Unique index on repeated value fails23505 and is absent from public index listing. A200,000-row index build accepts an old caller update, pauses, rejects premature resume, accepts later resume, succeeds and finds the changed row through the new index; table count 200001.

Keep DDL job recovery separate from cluster-version upgrades and authority cutovers. The concurrent example now earns the card’s interruption case: PAUSE completion is distinct from pause-requested; resume must use the completed paused state. Backfill progress is not a universal application rollout proof.

## Execution ownership and reproduction

The coordinator executed the native lab. This author read its actual commands, outputs, errors and resulting states; the author did not mutate native scripts or observation JSON. Canonical record: `cockroach-observed.json`. Upgrade record: `cockroach-upgrade-observed.json`. Separate successful resume intervention: `cockroach-schema-resume-observed.json`. The exact 64 MiB BulkAdder error and source provenance are in `cockroach-low-memory-log-excerpt.txt`; the temporary source directory was later removed, explicitly recorded there.

Reproduce with the pinned native lab in `lab/cockroach_lab.py`, `lab/cockroach_scenarios.py` and `lab/cockroach_extra.py`, following the coordinator’s run instructions. These scripts own disposable stores, certificates, ports and cleanup. Do not run their process-loss or node-removal actions against an existing service. The live observation used 25.4.17 darwin ARM64; upgrade also pins 25.3.7. The PostgreSQL migration source is a disposable local fixture whose recorded encoding is SQL_ASCII; the demonstrated text is ASCII.

The concurrent schema index record used 200,000 source rows and final count 200001. The later repeatable script uses a smaller 50,000-row parameter to bound runtime; the article’s exact outcomes remain scoped to the observed run. Fixed job IDs and HLC timestamps are evidence from that run, not values to reuse during a new execution.

## Native labels checked

- `RL130-after-failed-build`
- `RL130-backfill`
- `RL130-concurrent-index-client`
- `RL130-failed-unique-build`
- `RL130-final-schema-job`
- `RL130-find-active-job`
- `RL130-new-caller-after-publication`
- `RL130-observe-paused`
- `RL130-old-caller-during-build`
- `RL130-old-caller-while-paused`
- `RL130-online-fixture`
- `RL130-pause-job`
- `RL130-resume-job`

## Primary sources

The following version-pinned primary pages were browsed in this authoring session; the article annotates their role. New product guarantees remain distinct from the invented figures and observed native outcomes.

- https://www.cockroachlabs.com/docs/v25.4/online-schema-changes
- https://www.cockroachlabs.com/docs/v25.4/show-jobs
- https://www.cockroachlabs.com/docs/v25.4/pause-job
- https://www.cockroachlabs.com/docs/v25.4/resume-job
- https://www.cockroachlabs.com/docs/v25.4/cancel-job

## Limits and follow-through

All native nodes share one macOS host. Region labels and loopback timings do not prove independent regional survival, WAN latency, power-loss durability or production throughput. Backup restores use separate database names on the same cluster; independent destination-host recovery and external-provider storage policy remain untested. Native failure results are taught through their decision: repair the query or schema, wait for an actual state transition, restore the missing dependency, or reconcile accepted later work.

No map change is proposed. Root owns the final assembled preview checks and independent review; status remains drafting.
