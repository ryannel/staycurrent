# RL132 author evidence and scope

19 October 2026. Article: `src/drafts/relational/rl132.md`.
Status: authored, pending independent review. No publication claim.

## Commission and consequential observation

RL74c: SQL/application compatibility, snapshot copy, retry changes and migration acceptance.

PostgreSQL child-first deferred write commits. Cockroach deferred syntax fails0A000; immediate child-first sequence fails23503. Parent-first target copy succeeds after source_app is fenced. RR JSON snapshot contains r81 and one remaining seat. Target accepts r82:2/42.00 versus stale source1/20.00; source reconciliation reaches2/42.00.

The bounded offline window is the commissioned method, not an incomplete promise of online CDC. The source fence is a real revoked mutation grant and denied source_app attempt. A missing separate order-ID fixture is acknowledged; stable request identity is preserved. Explicit source/target authority remains local teaching while the shared FD cutover home is planned.

## Execution ownership and reproduction

The coordinator executed the native lab. This author read its actual commands, outputs, errors and resulting states; the author did not mutate native scripts or observation JSON. Canonical record: `cockroach-observed.json`. Upgrade record: `cockroach-upgrade-observed.json`. Separate successful resume intervention: `cockroach-schema-resume-observed.json`. The exact 64 MiB BulkAdder error and source provenance are in `cockroach-low-memory-log-excerpt.txt`; the temporary source directory was later removed, explicitly recorded there.

Reproduce with the pinned native lab in `lab/cockroach_lab.py`, `lab/cockroach_scenarios.py` and `lab/cockroach_extra.py`, following the coordinator’s run instructions. These scripts own disposable stores, certificates, ports and cleanup. Do not run their process-loss or node-removal actions against an existing service. The live observation used 25.4.17 darwin ARM64; upgrade also pins 25.3.7. The PostgreSQL migration source is a disposable local fixture whose recorded encoding is SQL_ASCII; the demonstrated text is ASCII.

The concurrent schema index record used 200,000 source rows and final count 200001. The later repeatable script uses a smaller 50,000-row parameter to bound runtime; the article’s exact outcomes remain scoped to the observed run. Fixed job IDs and HLC timestamps are evidence from that run, not values to reuse during a new execution.

## Native labels checked

- `RL132-consistent-source-export`
- `RL132-corrected-copy-order`
- `RL132-create-target`
- `RL132-deferred-write-order`
- `RL132-denied-source-application-write`
- `RL132-init-source`
- `RL132-new-authority-write`
- `RL132-old-source-misses-later-acceptance`
- `RL132-reconcile-before-return`
- `RL132-source-application-identity`
- `RL132-source-schema-valid`
- `RL132-source-write-fence`
- `RL132-start-source`
- `RL132-target-deferred-constraint`
- `RL132-target-immediate-schema`
- `RL132-target-old-write-order`

## Primary sources

The following version-pinned primary pages were browsed in this authoring session; the article annotates their role. New product guarantees remain distinct from the invented figures and observed native outcomes.

- https://www.cockroachlabs.com/docs/v25.4/postgresql-compatibility
- https://www.cockroachlabs.com/docs/v25.4/foreign-key
- https://www.postgresql.org/docs/18/ddl-constraints.html
- https://www.cockroachlabs.com/docs/v25.4/transaction-retry-error-reference

## Limits and follow-through

All native nodes share one macOS host. Region labels and loopback timings do not prove independent regional survival, WAN latency, power-loss durability or production throughput. Backup restores use separate database names on the same cluster; independent destination-host recovery and external-provider storage policy remain untested. Native failure results are taught through their decision: repair the query or schema, wait for an actual state transition, restore the missing dependency, or reconcile accepted later work.

No map change is proposed. Root owns the final assembled preview checks and independent review; status remains drafting.
