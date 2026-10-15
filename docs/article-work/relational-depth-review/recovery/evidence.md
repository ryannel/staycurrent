# Recovery experiments

Checked on 15 October 2026 with PostgreSQL 18.6. The logical restore and physical
recovery drills exercise different recoverable histories; the article keeps their
records and conclusions separate.

The existing `operations-completion/restore-drill.sh` ran on the isolated review
server through its Unix socket at port 55439. It restored order 101 from the dump
and found the later acknowledged request `req-b` missing. The script's whole-second
clock reported zero seconds for this tiny local restore. That is not a useful RTO
measurement and the article does not present it as one. Its actual output is in
`logical-observed.txt`.

The downloadable `physical-restore.py` starts its own private PostgreSQL clusters,
with no TCP listener. It creates a streamed physical base backup, verifies the
manifest, archives subsequent WAL, and records a named restore point after order
102 but before deleting order 101. A legitimate order 103 follows that deletion.
Recovery to the named point pauses read-only with orders 101 and 102; comparison
with acknowledged requests identifies order 103 as missing. Stopping before a
mistake also excludes later good work. The drill makes that reconciliation
obligation observable rather than implying that replay can omit one transaction
and preserve every later dependent transaction.

A second restore uses the same verified base with an archive that omits the segment
needed to reach the named target. PostgreSQL reports that recovery ended before
the configured target was reached and shuts down. The base still passes
`pg_verifybackup`. A valid base manifest cannot prove that all future archive
segments exist. `physical-observed.json` records both outcomes; the verifier asserts
the exact rows, paused state, missing acknowledgement and failed target recovery.

Independent review identified three repairs, all applied and rerun: cleanup now
attempts every owned cluster even if stopping one fails; the missing-WAL check
waits for the actual fatal recovery outcome and server exit rather than assuming
`pg_ctl` must fail before briefly reaching readiness; the download's macOS/Linux
requirement is explicit. The script never connects to an existing server. It leaves
its private files for inspection but stops its servers on exit.

## Sources

These primary references support the commands and stated limits:

- [Continuous archiving and point-in-time recovery](https://www.postgresql.org/docs/18/continuous-archiving.html): base backup plus uninterrupted archive history, recovery configuration and recovery scope.
- [pg_basebackup](https://www.postgresql.org/docs/18/app-pgbasebackup.html): the WAL streamed with a base backup covers that backup, not all later recovery targets.
- [Recovery target settings](https://www.postgresql.org/docs/18/runtime-config-wal.html#RUNTIME-CONFIG-WAL-RECOVERY-TARGET): named targets, pausing and a target not reached before recovery ends.
- [pg_verifybackup](https://www.postgresql.org/docs/18/app-pgverifybackup.html): manifest and WAL verification limits; testing a restore remains necessary.

The small drills establish mechanisms and result boundaries. They do not test a
production archive service, encryption keys, remote storage, failover, load or a
service-level recovery time. The article's existing operational procedure covers
the further validation and reconnection work.
