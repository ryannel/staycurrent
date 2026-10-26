# Consequential claims and primary sources

Checked against PostgreSQL18 documentation during authoring on26October2026. Reader-facing links are under Sources and further reading.

- https://www.postgresql.org/docs/18/upgrading.html — minor/major compatibility; crossed migration notes; supported logical methods.
- https://www.postgresql.org/docs/18/pgupgrade.html — target-version tool; --check; extension/cluster preparation; copy/clone/link; oldcontrol rename and link target-start safety boundary; generated follow-up/statistics work.
- https://www.postgresql.org/docs/18/release-18.html — checksums default on; pg_upgrade matching checksums; retained planner statistics.
- https://www.postgresql.org/docs/18/app-pgdump.html — consistent saved view, single-database scope, later-commit exclusion, newer-to-older restore not guaranteed.
- https://www.postgresql.org/docs/18/app-pg-dumpall.html — reviewed globals including roles/tablespaces separate from single-database dump.
- https://www.postgresql.org/docs/18/logical-replication-restrictions.html — DDL/sequences/large objects outside native row replication; relationship obligations. Finished logical-replication neighbour supplies apply-trigger qualification and ready-state context.
- https://www.postgresql.org/docs/18/functions-admin.html#FUNCTIONS-REPLICATION — pg_replication_origin_progress(name,true) guarantees corresponding local transaction flush; source sample and exact origin must refer to the same history.
- https://www.postgresql.org/docs/18/view-pg-replication-origin-status.html — remote versus local positions distinguish source progress from subscriber WAL.
- https://www.postgresql.org/docs/18/sql-altercollation.html — changed collation definitions can invalidate objects; rebuild affected objects before refreshing recorded version.
- https://www.postgresql.org/docs/18/warm-standby.html — physical standby compatibility does not supply a major upgrade.

Observed evidence is separate:

- native-execution.json and executed-native-verifier.sh/executed-shop.sql identify exactly executed input and before/after hashes. Pinned image provenance and observed17.11/18.6 are in input/upgrade-runtime.json and root-fixture.json. networknone, no published host ports/mounts; separate data/socket directories; source and target identities guarded; owned container removed by root.
- native-results.txt records completed --check/fullcopy+link, actual ordersfile identity relation, copy old restart, link control rename, sixready logical tables, source-role refusal, exact sourceB/subscriptionorigin durable progress plus latermarker, full five-table equality, sequence mismatch/correction, rolled-back validation and target22/source20/agreement29.
- Native position values remain evidence only. No conceptual drawing claims those exact positions or measured timing.
- sql-results.json identifies PGlite0.5.8/PostgreSQL18.3 WASM and exact article/fixture hashes. check-sql.mjs extracts and executes the reader's displayed SQL, verifies exact results, catalogue/agreement separation and the repricing counterexample, checks scene state structure, then closes the disposable database.

Limits: one-container native mechanics; no clone run, independent storage loss, production writer exclusion, real external provider, full application integration, production throughput or migration duration. No such result is claimed. Recovery/acceptance obligations outside this fixture are prescribed, not reported as tested.
