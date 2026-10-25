# Fresh planning notes

## Exposure and teaching

Read the supplied commission, article, neighbours, incoming ownership, reading links and complete shared example. Read all 19 bounded reference parts separately with `scripts/read-writing-reference.py`: sequences 1–6, indexes 1–7 and storage 1–6; every END marker was delivered. Read the current breakdown, write and continuity skills. No old bodies, feedback, other workers' notes or main-repository content was consulted.

Studied owned IAB previews at port 4584: Sequence diagrams' waiting/activation comparison, Indexes' composite-column comparison and Storage and durability's three-moment crash recovery drawing. Their useful teaching pattern is one visible change at a time, a stable example, explicit attention before the drawing and the consequence developed afterwards. Their prose leads style; the plan names understanding rather than prescribing visual layouts.

Read finished factual prerequisites at port 4606: `/review/relational-rebuild/backup-and-restore/` and `/review/relational-rebuild/postgresql/architecture/`. The first already teaches recovery design, chain gaps, boundary choice, closing source history and payment reconciliation. This article makes those outcomes operational in PostgreSQL. The second supplies processes, files and WAL context; it does not establish backup procedures. All five owned temporary tabs were closed after reading. No viewport or theme changes.

## Example and continuity decisions

Use the existing independent recovery branch: post-103 state → committed P7 price 2.20 → valid payment 504, 10.00 by card. Preserve the unchanged 29.00 agreement, pending status and stock P3/P7/P9 = 10/0/4. Before reconciliation the restored cut has no payment 504; afterwards it has that payment once and 19.00 due. Preserve `order-103-part-payment-1` with the supplied hypothetical queryable provider contract. No actual provider call is proposed.

Local drill choices: PostgreSQL 18, one owned disposable cluster, a full plain base backup with streamed consistency WAL, continued independent archiving, and a fresh isolated restore. After the backup completes, create a uniquely named restore point before the mistake. This is a planned rehearsal marker, not an incident-discovery technique. Its name, paths and any deliberate segment switches are local illustrative choices. Do not invent native times, filenames, XIDs, LSNs, timelines, log messages or elapsed rates: capture these only when the future writer performs the native drill. A marker after payment may support the later-target gap case without adding business facts.

The failure case must remove a segment required *after* the base backup from a copied archive, with the configured target beyond it. Exclude source streaming, bundled-WAL shortcuts and any retained alternative copy that would silently bridge the intended gap. Preserve originals. No execution or observation has been performed by this planner.

Continuity pass: the outline moves from method/scope through archive and base dependencies to target identity, isolated restoration, proof and controlled reconciliation. It does not present backup verification, local commit flush, a segment switch or a last-archived filename as recovery coverage. Nor does it imply that restore selectively skips the mistake while keeping payment 504. The accepted tree needs no added child pages or shared-business-fact changes.

## Primary-source checks

Checked PostgreSQL 18 documentation on 26 October 2026. These links are research inputs for the fresh writer, not observations of a running server.

- [Continuous archiving and PITR](https://www.postgresql.org/docs/18/continuous-archiving.html): archive chain, archive-command success and retry contract, completed segments, preserved configuration, restore sequence, earliest target after backup completion, timeline history. Keep any local archive helper explicitly bounded; the manual's simple copy command is not a production durability guarantee.
- [pg_basebackup](https://www.postgresql.org/docs/18/app-pgbasebackup.html): cluster scope, replication authorisation and connections, plain/tar formats, tablespace mapping, streamed backup WAL and manifest. `-R` prepares a standby; it is not the targeted-recovery path selected here.
- [pg_verifybackup](https://www.postgresql.org/docs/18/app-pgverifybackup.html): manifest/file/consistency-WAL checks and their limits. Extra later WAL is not verified merely because it is present. A successful verification still requires a test restore and recovered-data checks.
- [WAL recovery configuration](https://www.postgresql.org/docs/18/runtime-config-wal.html#RUNTIME-CONFIG-WAL-ARCHIVE-RECOVERY) and [recovery targets](https://www.postgresql.org/docs/18/runtime-config-wal.html#RUNTIME-CONFIG-WAL-RECOVERY-TARGET): signal-file precedence; restore-command result contract; one target form; inclusive boundaries; transaction commit order; timeline selection; pause/promote/shutdown. An unreached configured target is fatal. For inspection, enable hot standby and confirm pause before queries. Resuming at a reached target ends recovery rather than resuming replay arbitrarily beyond it.
- [Administration functions](https://www.postgresql.org/docs/18/functions-admin.html#FUNCTIONS-ADMIN-BACKUP): unique restore markers and `pg_switch_wal`. [Recovery functions](https://www.postgresql.org/docs/18/functions-admin.html#FUNCTIONS-RECOVERY-CONTROL): replay position and `pg_get_wal_replay_pause_state()`; the Boolean pause function reports a request, which is weaker than proof of the actual paused state.
- [pg_stat_archiver](https://www.postgresql.org/docs/18/monitoring-stats.html#MONITORING-PG-STAT-ARCHIVER-VIEW): counters, timestamps, resets and the explicit warning that successful files need not be archived in order.
- [pg_combinebackup](https://www.postgresql.org/docs/18/app-pgcombinebackup.html): ordered full/incremental inputs, dependency checking distinct from file integrity, and avoiding hard-linked restore output that can alter its inputs.
- [File-system backup](https://www.postgresql.org/docs/18/backup-file.html): arbitrary copying of running files is insufficient; supported snapshots have whole-cluster and simultaneous-volume requirements.
- [pg_dump](https://www.postgresql.org/docs/18/app-pgdump.html), [SQL dump restoration](https://www.postgresql.org/docs/18/backup-dump.html) and [pg_restore](https://www.postgresql.org/docs/18/app-pgrestore.html): single-database versus global scope, archive versus plain SQL restore, dependency/ownership and error handling. The writer should show explicit fresh destination selection; `--create` restores into the archive's database name, so it is easy to misread `-d` as renaming that destination.

## Boundaries and remaining execution

No ownership change proposed. General RPO/RTO design and provider reconciliation contracts remain with `backups`; native commit/restart controls with `pg-wal`; receipt/flush/replay, existing-standby promotion and former-primary return with `pg-replication`. Explain the finishing step for *this archive recovery*, without importing the standby operating procedure. Retain the general fencing requirement and refer to its owning articles for enforcement mechanisms.

The incoming `pg-upgrades` responsibility is met by a bounded working logical-dump restore path as well as physical restoration. Upgrade method choice, cross-version compatibility judgement and migration write handover stay there. Incremental mechanics fit inside this article; no separate child is needed.

Future work: the fresh writer must execute and preserve the successful native restore, target/fact evidence and the bounded missing-WAL failure on owned disposable copies before claiming observed behaviour. The logical path also needs its own actual restore result if presented as a working example. Root remains sole preview/build/integration owner. No writing, implementation, delegation, review, build, server, commit or publication was done here.
