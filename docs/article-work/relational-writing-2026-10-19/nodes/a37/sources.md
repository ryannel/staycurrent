# a37 primary sources and execution evidence

Checked 20 October 2026. Topic: relational service maintenance and upgrades. The
article contributes practical relational operation, without an upgrade-specialist
curriculum or new tree nodes. The author read AGENTS.md, the write skill, README,
site direction, commission/runtime/context, all three fixed reference articles in
full including their figure specifications, and actual family articles a07, a38
and a39. Those fixed three examples are the prose/teaching reference.

## Primary sources

- [Routine vacuuming](https://www.postgresql.org/docs/18/routine-vacuuming.html):
  duties, version removal, automatic scheduling, freezing and transaction/multixact
  wraparound protection. The article links to the documented emergency procedure
  rather than inventing another emergency runbook.
- [VACUUM](https://www.postgresql.org/docs/18/sql-vacuum.html): reusable space,
  FULL rewrite/exclusive lock, temporary allocation, TRUNCATE false, inability to
  execute in a transaction block, progress views.
- [ANALYZE](https://www.postgresql.org/docs/18/sql-analyze.html): sampled estimates
  and partition-parent upkeep. No measured production plan benefit is claimed.
- [Autovacuum settings](https://www.postgresql.org/docs/18/runtime-config-autovacuum.html):
  table and engine controls; changing workers alone cannot remove required history.
- [Statistics views](https://www.postgresql.org/docs/18/monitoring-stats.html):
  exact displayed table/activity/archive columns, estimates and observation caveats.
- [Progress reporting](https://www.postgresql.org/docs/18/progress-reporting.html):
  phase-specific vacuum, FULL/CLUSTER and index-build observations. A heap scan
  fraction is not total completion.
- [Replication slots](https://www.postgresql.org/docs/18/view-pg-replication-slots.html):
  xmin/catalog_xmin, restart_lsn, wal_status and safe_wal_size.
- [Continuous archiving](https://www.postgresql.org/docs/18/continuous-archiving.html):
  history completeness, blocked archival and supported recovery inputs.
- [REINDEX](https://www.postgresql.org/docs/18/sql-reindex.html): concurrent
  rebuild load/waits and invalid remnants. The article has no periodic-rebuild
  recommendation or duplicate index-selection curriculum.
- [Cluster upgrading](https://www.postgresql.org/docs/18/upgrading.html): minor
  versus major storage paths, release notes and logical replacement choices.
- [pg_upgrade](https://www.postgresql.org/docs/18/pgupgrade.html): target tool,
  supported check/copy/link/clone modes, module compatibility, post-upgrade
  commands and mode-specific reversion. The copy-mode observations below also
  directly verify this article's exercised path. Link mode is documentary only.
- [Release 18 migration notes](https://www.postgresql.org/docs/18/release-18.html):
  compatibility inventory and checking the actual upgrade's required actions.
- [ALTER COLLATION](https://www.postgresql.org/docs/18/sql-altercollation.html):
  rebuild affected objects before refreshing recorded version; refresh does not
  establish a successful rebuild.
- RDS [valid targets](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.PostgreSQL.MajorVersion.html),
  [preparation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.PostgreSQL.MajorVersion.Process.html)
  and [engine upgrades](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.PostgreSQL.html):
  provider target selection, prechecks, parameter and replica duties and exact
  instance/cluster transition contract. No AWS commands or hosted changes ran.

## Native verification

Downloadable code: `src/components/relational-next/a37/rehearse.py`. Python 3
standard library, exact installed PostgreSQL binaries:

- old: `/private/tmp/staycurrent-pg17/bin`, PostgreSQL 17.6;
- new: `/opt/homebrew/Cellar/postgresql@18/18.6_1/bin`, PostgreSQL 18.6 Homebrew.

These are observation versions, not a claim that 17.6 is current/recommended.
Every cluster was freshly initialised under a private `a37-drill-*` temporary
root with C locale, UTF8, data checksums, role `drill` and trust authentication
for the local disposable fixture only. TCP listened only on 127.0.0.1, with
separate ephemeral ports and a private socket directory. No shared runtime or
pre-existing cluster/data directory was contacted or changed. No software
installation was altered or removed.

Bounds: 16 MB shared buffers and maintenance memory, 12 connections, no parallel
workers, 15-second statement timeout, two-second lock timeout; explicit rewrite
failure uses 200 ms lock timeout. Subprocesses and server waits are bounded.
Defaults preserve fsync, full_page_writes and synchronous commit.

Raw retained evidence:

- `evidence/native-run1.json`: initial successful maintenance and upgrade run,
  all commands/output, post-upgrade output/logs and cleanup. An exploratory
  VACUUM FULL submitted in one psql -c with SET first received the expected
  transaction-block error; rerunning with separate -c commands reached the
  intended lock-timeout gate. Final worksheet fixes this submission directly.
- `evidence/native-run2.json`: final worksheet rerun, exact upgraded order IDs
  and values additionally asserted; all displayed monitoring queries executed.
  All gates passed and own resources were removed.

Observed maintenance in both runs:

1. Four thousand 200-character-payload orders, autovacuum disabled for this
   fixture only, and a repeatable-read snapshot established by a real read.
2. Another session updates every status to paid and commits.
3. VERBOSE vacuum with TRUNCATE false reports 4,000 dead versions not yet
   removable; current query returns 4,000 paid orders.
4. Report rolls back; second vacuum removes 4,000. Heap size before and after:
   1,990,656 bytes. Statistics collection finishes; reltuples is 4,000 and dead
   estimate is zero. No throughput conclusion follows.
5. Held reader blocks VACUUM FULL; 200 ms lock-acquisition gate rejects it.
   Reader released. REINDEX INDEX CONCURRENTLY completes; indisvalid true.

Observed upgrade in both runs:

1. Fresh old17/new18 clusters, matching checksum/locale/init identity. Old has
   orders 101/2200 and 102/1800 and a disposable regproc-column table.
2. Target 18.6 pg_upgrade --copy --check rejects that unsupported object.
   Old restarts and shows two orders totalling 4,000.
3. Throwaway incompatibility removed, old stopped, repeated check passes.
4. Target --copy upgrade succeeds; new server is 18.6 and retains count/total.
   Run2 also asserts exact ID:value pairs 101:2200,102:1800.
5. Wrong predicate count(*)=3 returns false. New stopped, old restarted and
   still reports 17.6 and 2/4000. This is a deliberately failed acceptance
   predicate, not manufactured corruption.
6. New restarted; emitted two vacuumdb statistics commands succeed. New order
   103/500 makes 3/4500. New stopped; old restarts and still has 2/4000. The old
   intact copy cannot automatically preserve later writes.

Run1 upgrade command 1.823 s, run2 1.706 s. These are command times only,
excluding representative traffic/reconnection, cloud provisioning, extensions
and recovery establishment. Old logical file lengths 39,868,588 bytes; final new
41,488,933 bytes. No peak physical disk measurement or production capacity claim.

## Model and limits

Four figures, eight comparison sequences: retained snapshot/removable versions;
space-allowance gate with a 22 GB invented peak; copy/link startup boundary;
failed validation versus new accepted writes. Models have no database side
effects. Maintenance and copy-upgrade evidence is separate from explanatory
frames. Figures budget playback from whole visible figure innerText, use
aria-disabled focus-preserving endpoint controls, stack comparisons on phones,
and pause only when fully offscreen or document hidden. No token controls.

Not executed: link/clone upgrades, crash mid-transfer, extension upgrades,
production application/pool authentication, physical power loss, cloud upgrade,
replica upgrade, WAL-retention exhaustion or new-state backup restoration. Each
required real deployment step is identified, scoped to its owner and remains an
acceptance prerequisite. No new tree nodes proposed.
