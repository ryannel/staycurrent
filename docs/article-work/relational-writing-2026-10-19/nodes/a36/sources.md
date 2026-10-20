# a36 — sources and observation boundaries

Checked on 20 October 2026. Scope: deployment visibility, signal routing, allocation
and growth budgets, intervention lead time, normal/degraded headroom and alert
ownership. a28 owns concurrent-workload diagnosis; a37 maintenance; a38 topology;
a39 restoration; a07 incident coordination. No new branch or tree change proposed.

## Primary documentation

- [PostgreSQL 18 statistics](https://www.postgresql.org/docs/18/monitoring-stats.html):
  sampled state versus cumulative counts, reporting lag, transaction caching,
  session visibility, state/wait distinction, database counters and temporary bytes.
  Counter deltas do not count application business completions. No cluster-wide
  counter is attributed exclusively to this article.
- [Monitoring database activity](https://www.postgresql.org/docs/18/monitoring.html):
  engine observations together with OS tools. The proposed collection intervals
  are invented starting choices, not PostgreSQL defaults or measured safe costs.
- [Predefined roles](https://www.postgresql.org/docs/18/predefined-roles.html):
  pg_read_all_stats and broader pg_monitor capabilities. Actual denied/permitted
  actions are retained below. The article does not recommend administrator access
  for the exporter.
- [Administration functions](https://www.postgresql.org/docs/18/functions-admin.html):
  size-function inclusions; pg_total_relation_size = pg_table_size + pg_indexes_size;
  main fork is narrower than total table allocation; CONNECT or statistics-role
  permission for database size; pg_ls_waldir restricted independently of merely
  reading statistics. Values retained in bytes to avoid pretty-size unit ambiguity.
- [Replication slots](https://www.postgresql.org/docs/18/view-pg-replication-slots.html):
  restart_lsn, wal_status and retained-history interpretation. Slot position
  distances are not additive separate file allocations. No slot created or faulted
  by this worker; use a38's bounded evidence and operational procedure.
- [Continuous archiving](https://www.postgresql.org/docs/18/continuous-archiving.html):
  local retention on archive failure and complete recovery-history dependencies.
  No archive configuration or failure injected here; a39 owns that rehearsal.
- [RDS metric definitions](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-metrics.html):
  DatabaseConnections is a network-client count with stated engine/provider
  exclusions. It cannot simply be equated with all pg_stat_activity rows.
- [RDS storage autoscaling](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIOPS.Autoscaling.html):
  configured maximum, modification restrictions, workload risks and delay. No
  cloud account was accessed; no RDS expansion or metrics observed.

## Read context and teaching references

Read AGENTS.md, README.md, docs/site-direction.md, writing commission and runtime,
the supplied complete a36 context, registry, and actual articles a07, a28, a37,
a38, a39, plus a28's sources.md. Read all three fixed reference articles:
sequences.astro, indexes.astro and storage.astro, including the figure prompts,
captions and comparison explanations. Prose follows one service and keeps the
mechanism/result/decision sequence; figures repeatedly change one assumption.
a21's transport informed implementation mechanics only.

## Exact native evidence

Files: `evidence/verify.mjs`, `evidence/native.json` (first run),
`evidence/native-repeat.json` (exact activity columns included).

Portable setup: Node.js >=22, install pg@8.23.1 with lifecycle scripts disabled
in a fresh directory; PG_URL points at an explicitly disposable PostgreSQL 18
server with CREATE DATABASE and CREATE ROLE permission. Run
`node monitoring-verify.mjs`. The default output is observation-evidence.json;
EVIDENCE_FILE selects another absent filename. PG_DRIVER optionally supplies a
pinned module. No production URL is embedded and existing output is refused.
Connections and statements have finite timeouts.

For both retained runs, PG_DRIVER selected the root-provided pg 8.23.1 at
file:///private/tmp/rel3-pg-driver-20261020/node_modules/pg/esm/index.mjs.
PG_URL addressed the shared disposable PostgreSQL 18.6 loopback instance on
127.0.0.1:57319. Runtime metadata is retained: native Homebrew 18.6,
aarch64-apple-darwin25.6.0, 32 MB shared buffers, 4 MB default work memory,
12 maximum connections, track_counts on, track_io_timing off, fsync and
synchronous_commit on. Session overrides only: UTC, five-second statement
timeout, one-second lock timeout; sort fixture uses 64 kB work_mem. Client
connection timeout is three seconds, query timeout six seconds in the portable
final worksheet. No server configuration, restart or shared statistics reset.

Each run creates a unique `rel3_a36_run_<timestamp>_<pid>` database and
`rel3_a36_observer_<timestamp>_<pid>` role. Setup closes before actor and observer
begin; cleanup follows their closure. Peak own connections are two in the normal
path (up to three if an error requires cleanup with setup still present).
All queries are filtered to this worker's database/session. The observer's
pg_read_all_stats privilege can see other sessions in principle, but this worker
never queries other workers' data or session statements.

Observed in both runs:

- Without the statistics grant, the fixture session exists but state is null and
  query is `<insufficient privilege>`. After GRANT pg_read_all_stats, idle state
  and own fixture query are visible. SELECT of orders and pg_ls_waldir remain
  denied with SQLSTATE 42501. The exercise does not grant the broader pg_monitor
  or server-file roles.
- Fixture: 4,000 integer-key rows, each with repeat(md5(id),8) text. Table allocation
  1,253,376 bytes, indexes 106,496, total 1,359,872; main heap 1,220,608. Exact sum
  is asserted.
- Delete IDs <=3000, VACUUM(TRUNCATE false, ANALYZE). 1,000 rows remain. Main heap
  still 1,220,608 bytes; table total becomes 1,261,568, overall 1,368,064. The
  8,192-byte change is visibility-map allocation, not increased live-row demand.
  No reclaimable-byte estimate, rewrite benefit or production growth measured.
- A 20,000-value ORDER BY with 64 kB work_mem creates cumulative temp_bytes
  1,107,392 across two temporary files. Before/after own-database commit counters
  are 2 and 15 in both captures. Observer/setup/maintenance transactions belong
  inside that scope; these are not order counts or useful workload throughput.
- Backend statistics are flushed using pg_stat_force_next_flush and backend exit;
  this flushes only the fixture backend, without resetting any statistics. Other
  article activity is neither attributed nor subtracted.
- stats_reset is null at both observations. This is retained, not interpreted as
  independent proof that no reset ever happened. The known disposable scope,
  no-reset harness and nondecreasing values establish this exercise's boundary.
- Both evidence files record database and role cleanup true. No own server,
  cluster, process, installed dependency or cache remains. The root owns the
  shared cluster and pinned driver; neither was removed by this worker.

No native CPU, resident-memory, device throughput/latency, WAL generation-rate,
long-duration capacity, archive failure, failover, restore or alert-delivery
experiment was added here. Those remain bounded upstream evidence or unverified
production acceptance tasks.

## Upstream evidence reused, not extended

a28's four-slot, 120/s two-second schedules offer 240 operations. Before repair,
187–188 complete by 2s, 52–53 remain. After repair both critical runs complete
all 240 by 2s, no errors/rejections. The fixture is shared, small and short, and
does not measure host resources or a sustainable envelope. Intended arrival,
admission, useful completion, failure, rejection and outstanding-work accounting
are reused from a28; no second load-test tutorial is introduced.

a38's observed 0.303-second local switchover excludes failure detection and real
application/network infrastructure. a39's tiny subsecond restore excludes most
of its complete service path. These are explicitly insufficient to accept the
shop's production recovery budgets or proposed 500 GB staging destination.

## Models and worksheet

All four figure scenes are invented models, never engine traces. The CSV labels
each row as invented planning value, unverified production assumption,
calculated model or observed bounded measure. Decimal GB/MB/s in planning;
exact native bytes kept separate. The 20 October 10:00 observation and 14:00/16:00
deadlines are an invented worked calendar, not an actual live service alarm.

Dashboard: 120/s offered versus 90/s useful gives growing outstanding work.
First changed interval admits 904/10s = 90.4/s, completes 900, leaves four active
and 296 queued; next admits/completes 900, leaves four active and 596 queued.
The healthy branch has zero outstanding at sample edges. CPU/resource values
are invented; they name no diagnosed bottleneck. Archive branch can warn before
order failure. Labels distinguish window measures from point gauges.

Space: 400 = 224+64+16+96 GB. Remote 900 GB copies and separate 500 GB destination
do not consume the local free allocation. Reserve 32, ordinary growth 4/h,
adverse 12/h. To reserve:16h/5.333h. Hard full:24h/8h. Intervention8 + contingency2
gives action free thresholds72/152 GB and ordinary latest start +6h; adverse now.
The alternate sixteen-hour intervention plus2 makes ordinary action already due.
At zero/negative free margin the model clamps remaining time to zero and retains
the hard-limit distinction; it never suggests waiting to delete active WAL.

Resource envelope: ordinary [6 cores,12 GB,140 MB/s,56 client sessions] versus
limits[8,16,200,90], with ten of the configured100 connections kept for operations.
Inherited reads+[2,2,60,35], catch-up+[1,1,30,5] =>[9,15,230,96]. Deferring agreed
reports subtracts[3,3,70,20] =>[6,12,160,76]. Additive reservations are arithmetic,
not measured latency, actual CPU scaling or an accepted service capacity.

Alerts: illustrative99.9%-within500ms requirement,0.1% bad allowance. Bad1%/0.4%
in five-minute/hour windows gives10x/4x allowance ratios. No claim of monthly
budget already consumed or valid general alert thresholds. Missing data is unknown,
with an independent route. Synthetic breach/delivery/ack/escalation and collector
tests are proposed acceptance tasks, never claimed executed.

Playback counts all current rendered figure innerText at3 words/s +1.2s,
minimum6.5s, including caption, legend, both panels, controls and open transcript.
Endpoint controls use aria-disabled with clamping and preserve keyboard focus.
Variants preserve the current step so comparisons remain useful. Both panels
stack at <=600px. Dynamic children receive global CSS under a scoped panel
container. Offscreen (threshold0) and document-hidden states stop playback;
focus and hover do not. No automatic playback or motion transitions.

## Author checks

See `evidence/draft-checks.json` and `writer.md`. Root owns shared builds, route
integration and independent visual/teaching review. No final article, shared
route, dependency manifest, Git state or publication was changed by this worker.
