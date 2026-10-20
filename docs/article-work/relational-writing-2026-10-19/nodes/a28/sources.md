# a28 source and observation ledger

Checked 20 October 2026. All engine references use PostgreSQL 18 documentation;
the observed engine is native PostgreSQL 18.6 (Homebrew), aarch64-apple-darwin25.6.0.

## Primary sources

- [Cumulative statistics system](https://www.postgresql.org/docs/18/monitoring-stats.html):
  dynamic activity versus accumulated statistics, transaction-level snapshot caching,
  reporting lag, state/wait separation, wait categories and checkpoint/I/O views.
  Sampled waits do not measure exact elapsed waiting or host CPU. No server-wide
  counters were reset or attributed exclusively to this article.
- [Session information functions](https://www.postgresql.org/docs/18/functions-info.html#FUNCTIONS-INFO-SESSION):
  `pg_blocking_pids`, hard and soft blockers and lock-manager observation overhead.
- [pg_locks](https://www.postgresql.org/docs/18/view-pg-locks.html): row locks normally
  live in tuple storage rather than the lock view; waiting for an owner can appear
  as a transaction-identifier wait.
- [Explicit locking](https://www.postgresql.org/docs/18/explicit-locking.html): conflicting
  row changes, normal transaction-end lock release and exceptions such as rollback
  to a savepoint. The article says “normally” rather than claiming every lock always
  lasts to outer transaction completion.
- [Resource consumption](https://www.postgresql.org/docs/18/runtime-config-resource.html):
  per-operation `work_mem`, hash multiplier and multiplied parallel process demand.
- [Parallel query](https://www.postgresql.org/docs/18/parallel-query.html): parallel
  execution is conditional; no parallel execution was measured on this runtime.
- [Routine vacuuming](https://www.postgresql.org/docs/18/routine-vacuuming.html):
  eligible cleanup and old-transaction/snapshot consequences. Mechanism depth stays
  with a24 and operational procedures with a37.
- [WAL configuration](https://www.postgresql.org/docs/18/wal-configuration.html):
  checkpoint dirty-page work, smoothing and I/O competition.
- [pgbench](https://www.postgresql.org/docs/18/pgbench.html): rate scheduling,
  schedule lag, skipped work and logging. This supports the measurement distinction;
  our actual workload uses the `pg` driver, not pgbench.
- John D. C. Little, [A Proof for the Queuing Formula: L = λW](https://doi.org/10.1287/opre.9.3.383),
  Operations Research 9(3), 1961, 383–387. Abstract checked: finite means and the
  stationary/representative-population conditions. Our 100/s × 0.05s = 5 example
  is arithmetic, not an engine measurement or a prescription for five connections.

## Native evidence

`evidence/verify.mjs` is a portable Node.js >=22 worksheet using `pg@8.23.1`.
`PG_DRIVER=file:///private/tmp/rel3-pg-driver-20261020/node_modules/pg/esm/index.mjs`
selected the root-provided pinned driver for this run. `PG_URL` defaulted to the
disposable shared server at loopback port 57319. Only a unique own database was
created; raw metadata records its name. It was dropped after every session closed.
No shared service was restarted, reconfigured or stopped; no global statistics
were reset. No browser worksheet download was exercised by the author.

Runtime: 32 MB shared buffers, 4 MB work memory, no parallel workers; fsync,
synchronous_commit and full_page_writes on. Session overrides: JIT off, UTC,
max_parallel_workers_per_gather=0, statement_timeout=1500ms, lock_timeout=1000ms,
idle_in_transaction_session_timeout=3s. Five own connections during runs: four
preconnected workers plus observer. The administrative connection closed first.

Fixture: 100 account rows, revision initially zero; 20,000 orders, 100 accounts,
non-null numeric totals. Account changes target account 1; reports aggregate only
orders and are unaffected by revision changes. Automatic maintenance was not
disabled. All data and statement paths received a short warm-up. Five isolated
samples per class establish only the opening observed ranges (updates
13.578–15.069ms, reports 4.401–4.519ms).

The controlled cause is a 12ms application timer after the hot-row update and
before COMMIT. The remedy moves that same independent timer before active-slot
admission/connection acquisition; it remains inside the outer latency boundary.
It models independent preparation, not external effects or a protected balance
check. The atomic increment, report SQL, isolation and durability stay the same.

Four updates then one report, independent deterministic arrivals at 40/s and
120/s, two-second schedules, active limits 1/2/4. Before/after alternate at each
point. Only the critical 4-slot 120/s pair repeats once: fourteen bounded runs,
not a long benchmark. Guard: 80 outstanding; 6s drainage stop; bounded statement
and lock waits above. All actual runs finished without triggering a stop,
rejection or error. High-rate runs each eventually completed 192 updates and
48 reports. Revisions equalled successful update counts; every report equalled
the reference ordered answer.

`evidence/raw-results.json` retains all request timestamps and sampled activity,
the report plan and answer, runtime, isolated samples, summaries and cleanup flag.
Latency percentiles use nearest rank on end minus intended arrival, separately
per successful class, including drainage. Driver intervals include waits and
local exchange/decoding; they are not exclusive server execution or CPU time.
No retries or caller timeouts occurred. The accounting treatment of those
outcomes in the prose is guidance, not a claim that they were injected.

At 4 slots / 120/s: before finished 188 and 187 by 2s, leaving 52 and 53;
after finished 240 in both, leaving zero. Before update p95 553.214 / 553.291ms;
report p95 507.782 / 513.611ms. After update p95 15.588 / 15.934ms;
report p95 7.747 / 7.668ms. Before drainage 556.086 / 562.895ms; after zero.
The first before run sampled 130 Lock/transactionid and 33 Lock/tuple session
observations; first after zero Lock observations. The repeat before sampled
123 and 45 respectively; repeat after zero. These are sample counts, not wait
durations. Before owners were observed idle in transaction / ClientRead.

At 120/s, 1/2/4 before slots completed 165/189/188 by 2s. This supports rejecting
“more connections removes the hot-row dependency”, not ranking 2 above 4 or
claiming a general optimum. Low-rate runs finished all 80 before 2s, with similar
end-to-end latency. Short duration, timer fixture, shared server and absent host
resource/device/WAL/memory measurements exclude production capacity claims.

## Models and generated presentation data

Figures 1–4: invented timeline, arrival population, memory allowance arithmetic,
and lock/preparation ordering respectively. No invented quantity is labelled a
PostgreSQL observation. Figure 5 derives summaries and six snapshots per run from
`raw-results.json`; `src/components/relational-next/a28/observations.json` is its
small presentation extract (sweep records only). It shows the same 120/s demand
and changes only active limit. Both versions remain visible at once; on phones
they stack. Last snapshots are each run after its own last terminal result.

The component budgets playback from the entire currently visible figure text,
including open transcripts, at three words per second plus 1.2s (minimum 6.5s).
Back/Next use aria-disabled with clamping and retain focus. Offscreen suspension
uses zero-threshold IntersectionObserver; partial visibility does not pause.
Document-hidden suspension also stops playback. No focus/hover suspension.
Dynamic children use explicit global CSS selectors under the figure board.
