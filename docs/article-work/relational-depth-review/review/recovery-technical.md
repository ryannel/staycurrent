# Backup and recovery: independent technical and editorial review

Reviewed 15 October 2026 by the foundations reviewer, who did not author these changes. Read the complete revised article, RecoveryBoundary figure source, both downloadable drills, logical/physical observation records, and the retained physical server logs. Did not read the fresh-reader log. No article/source edits or new server executions were performed in this review.

## Findings requiring bounded repair

1. **P2 — Do not equate pg_ctl's first startup status with the failed recovery's final outcome.** In the retained missing-WAL log, PostgreSQL reached consistency and briefly accepted read-only connections at 23:38:01.097 before reporting the unreached target at .101 and shutting down at .102. `pg_ctl -w start` can race with that interval. The script currently asserts its return code is nonzero. Wait for the target-unreached fatal and completed shutdown, and assert those facts; retain the initial exit as diagnostic evidence only. The important condition is failure to reach the configured recovery target, not whether the process briefly accepted connections. The article's recovery conclusion is correct.
2. **P2 — Attempt cleanup for every registered cluster even if one stop fails.** The final loop currently lets one stop exception prevent subsequent stop attempts. Collect failures per directory, attempt all registered paths, and report any still-running paths before raising. Avoid the blanket “all stopped” message on a partial cleanup failure. The recorded run did stop all three clusters: logs say shut down and no postmaster.pid files remain.
3. **P3 — State the script's platform boundary where it is offered.** The source says macOS/Linux, while the article currently says only Python 3 plus PostgreSQL tools. Unix sockets and shell cp commands make that platform boundary relevant before someone downloads and runs it. Add macOS/Linux to the article's execution paragraph.

**Disposition:** Rechecked the repaired source and fresh physical observation record. The missing-WAL test now waits for both the target-unreached fatal and disappearance of `postmaster.pid`, retaining the initial startup status only as evidence. Cleanup catches each stop failure, attempts every registered directory and raises an aggregate error before any success message. The article explicitly says macOS or Linux. All three findings are resolved; no further native rerun is necessary for this independent check.

## Mechanism and evidence

The logical drill preserves exactly req-a in the dump and adds req-b only afterwards. It creates separate databases and never drops or replaces an existing one. `--no-owner --no-acl` is expressly limited to inspection, and the text later requires testing the actual application role. The observed reconciliation correctly identifies req-b. The zero-second whole-second timer is reported as unsuitable for a service recovery claim.

The physical drill creates a private Unix-only source; takes a streamed base backup; explicitly advances beyond the backup stream before inserting req-b; records the named restore point; then commits the erroneous delete and req-c. It waits for the later segment to reach the archive. It copies the base to independent targets, leaving the verified base and complete archive intact. The successful target pauses at the marker and returns req-a plus req-b. The independent receipts identify req-c as absent. This demonstrates a history boundary, not selective removal of a bad transaction.

The missing-WAL copy omits the segment containing the marker. The same base still verifies, while the target reports the specified unreached-target fatal. That distinction is supported by both script and raw logs. The script's bounded temporary directory, fixed private socket, no TCP listener, retained evidence and registered cluster paths make it suitable for this disposable exercise once the cleanup loop is hardened. It does not test production permissions, remote storage, credentials or cutover, and the article says so.

Primary documentation checked:

- [Recovery target settings, PostgreSQL 18](https://www.postgresql.org/docs/18/runtime-config-wal.html#RUNTIME-CONFIG-WAL-RECOVERY-TARGET): a named target follows the marker created by pg_create_restore_point; pause permits inspection; archive recovery ending before a configured target causes fatal shutdown.
- [pg_verifybackup, PostgreSQL 18](https://www.postgresql.org/docs/18/app-pgverifybackup.html): manifest/data/required-WAL verification does not replace an actual test restore, and extra WAL beyond what the base requires is not automatically checked.
- [pg_basebackup, PostgreSQL 18](https://www.postgresql.org/docs/18/app-pgbasebackup.html): the streamed backup includes the WAL needed for its backup period; it cannot contain future transactions.

## Reader and writing judgement

The new material earns its space. The original page told the reader that a base and WAL can recover a point; the revision now establishes a source history and lets the reader derive what must be in and out of the target. Req-c makes the limit concrete. The explicit return to the logical drill before the final reconciliation query prevents the two fixtures from being silently conflated.

The figure's source order gives a clear sequence: base purchase, later replayed purchase, stopping point, excluded later history. Its caption states the consequence in ordinary terms. A source inspection cannot establish phone wrapping or contrast; those rendered checks remain pending with the coordinator.

The execution context is present: normal operating-system user, own clusters, tool/version requirements, retained files, no production cutover. The logical drill intentionally retains its two databases; the physical script uses a new private directory on each run. Neither claims that repeating the script repairs a production database.

**Verdict:** the article's technical argument and depth are sound, and the bounded script lifecycle/race and platform findings are resolved. Perform the planned rendered check. No additional recovery feature catalogue is needed.
