# Timeline — selectivity lab (pilot-query-execution, container pilot-sel)

Append-only, written as things happen. Times are host clock, UTC.
This is a fresh re-run of the round-3 t3-selectivity harness
(/Users/ryannel/Workspace/writer/testing/round-3/evidence/t3-selectivity/).
The 2026-07-23 source directory contains no .sql/.sh driver files — only raw
logs; the drivers here were reconstructed verbatim from those logs (psql -e
echoed every statement into them). Declared adaptations, per the standing
contract, decided BEFORE running:
- driver-02: each EXPLAIN run 3x (original ran each once) — rule ">=3 runs per
  timed measurement".
- driver-04: each EXPLAIN run 3x and BUFFERS added (original: single bare
  EXPLAIN (ANALYZE)) — same rule plus "complete verbatim plan text with BUFFERS".
- drivers 01/03/05: same statements and run counts as the originals.

## Step 1 — 2026-07-29 02:03 UTC — workspace + harness reconstruction

- Created evidence/selectivity/{setup.sh, driver-01..05, raw/}.
- Ports 54315/54316 verified free before container start.
- Background load note: two unrelated sibling containers (r6-jvm-fixed,
  r6-jvm-leak, eclipse-temurin:21-jdk, up 4 days) are running on the same
  Docker Desktop VM and will stay up throughout. Absolute ms timings are
  therefore directional only.

## Step 2 — 2026-07-29 02:05:29 UTC — container up

- setup.sh: `docker run -d --name pilot-sel -e POSTGRES_PASSWORD=pilotpw -p 54315:5432 postgres:16-alpine`
  -> container a69f06c51d33. pg_isready poll, then real SELECT 1 confirmed.
- SELECT version(): PostgreSQL 16.14 on aarch64-unknown-linux-musl, compiled by
  gcc (Alpine 15.2.0) 15.2.0, 64-bit — identical server version to the
  2026-07-23 run (r3-t3).

## Step 3 — 2026-07-29 02:05:40 UTC — driver-01 schema + load (log: 01-schema-load.log)

- 2,000,000-row orders table, no seed (matches original, which also had none):
  shipped 1,899,747 (94.987%) / pending 80,012 (4.001%) / cancelled 20,241
  (1.012%). Original 2026-07-23: 1,900,077 / 79,797 / 20,126 — same class,
  small random drift as expected without setseed.
- Sizes identical to original: table 130 MB, orders_status_idx 13 MB, pkey
  43 MB, total 186 MB. relpages 16667, relallvisible 0.

## Step 4 — 2026-07-29 02:05:57 UTC — driver-02 selectivity flip (log: 02-selectivity-flip.log)

- 'cancelled' (1.012%): Index Scan using orders_status_idx, all 3 runs.
  Execution Time 23.392 / 5.467 / 4.323 ms (run 1 cold-ish: read=4767;
  runs 2-3 fully in shared_buffers: hit=11764, read=0).
- 'shipped' (94.987%): Seq Scan, all 3 runs. Execution Time 156.691 / 154.274
  / 155.760 ms. Rows Removed by Filter: 100,253.
- Plan flip REPRODUCES the 2026-07-23 result (old log: index scan 43.820 ms /
  seq scan 136.347 ms). Same plan shapes, same cost logic (43,667.00 seq-scan
  cost identical; index-scan cost 9105.51 vs old 10722.69 — proportional to
  the slightly different cancelled-row estimate 18867 vs 21267).
- pg_stats MCV freqs: {0.9507333, 0.039833333, 0.009433334} vs old
  {0.94853336, 0.04083333, 0.010633334} — sampling drift, same story.

## Step 5 — 2026-07-29 02:06:16 UTC — driver-03 covering index (log: 03-covering-index.log)

- Baseline ('pending', plain index): Index Scan, 46.067 / 41.814 / 23.119 ms,
  ~16.6k buffers touched per run.
- After CREATE INDEX orders_status_covering_idx but BEFORE VACUUM
  (relallvisible=0): planner STILL picks the plain-index Index Scan (39.663 /
  29.296 / 34.531 ms) — reproduces the 2026-07-23 nuance that a covering index
  alone does not buy an Index Only Scan while the visibility map is empty.
- After VACUUM (relallvisible=16667/16667): Index Only Scan using
  orders_status_covering_idx, Heap Fetches: 0, 8.053 / 6.641 / 7.215 ms,
  Buffers ~398 (vs ~16.6k). Cost estimate drops 14082.32 -> 2974.60.
- Covering index size 77 MB (same as original). All plan shapes match the
  2026-07-23 logs.

## Step 6 — 2026-07-29 02:06:36 UTC — driver-04 stale stats (log: 04-stale-stats.log)

- 500,000 'returned' rows inserted; n_mod_since_analyze=500000, last_autoanalyze
  still NULL through all three stale EXPLAINs (log brackets prove it).
- STALE: planner estimates rows=1 (actual 500,000), picks Index Scan using
  orders_status_covering_idx, cost=0.43..8.45. Execution 55.917 / 50.636 /
  50.920 ms. Reproduces the 2026-07-23 rows=1-vs-500000 miss (old cost 5.23).
- After ANALYZE: estimate rows=506,417, plan flips to Bitmap Heap Scan +
  Bitmap Index Scan on orders_status_idx, 37.953 / 37.642 / 37.305 ms,
  Heap Blocks exact=4168 — same flip as original (old est 496,500).
- New MCV freqs include returned=0.20256667 (old 0.1986).
- Note: all three stale-run EXPLAINs show identical Buffers (shared hit=6485);
  buffer counts for this measurement were absent in the 2026-07-23 log (no
  BUFFERS) so there is no old value to compare.

## Step 7 — 2026-07-29 02:06:56 UTC — driver-05 control supplement (log: 05-covering-prevacuum-supplement.log)

- Control kept per contract: orders2 has ONLY the covering index, so the
  planner cannot fall back to the plain index; isolates the visibility-map
  effect on Index Only Scan cost.
- Pre-VACUUM (relallvisible=0): Index Only Scan chosen but Heap Fetches: 80012,
  Buffers shared read=16934; 67.185 / 69.327 / 49.440 ms.
- Post-VACUUM (relallvisible=16667): same plan, Heap Fetches: 0, Buffers ~398;
  7.708 / 6.791 / 6.740 ms. Cost 15995.09 -> 3028.74.
- Matches 2026-07-23 (old: Heap Fetches 79797 -> 0, read=16952 -> ~397,
  58.593/65.066/44.947 -> 7.004/6.134/6.103 ms). orders2 dropped at the end
  as in the original.
- All five drivers ran cleanly; no failures, no dead ends this session.

## Step 8 — 2026-07-29 02:08-02:10 UTC — spot-verify (verify/01, verify/02) + teardown

- Rule-7 spot-check ran AFTER raw/ logs were cited above; written to verify/,
  raw/ untouched.
- verify/01-reverify-selectivity-flip.log: re-ran the flip pair against the
  lab database's END state (2.5M rows incl. 500k 'returned', covering index,
  post-VACUUM). SURPRISE, recorded as it happened: 'cancelled' now plans as
  Bitmap Heap Scan (est 20750 rows of 2.5M) rather than plain Index Scan —
  the state drift from driver-04 changed the arithmetic. 'shipped' still
  Seq Scan (cost 52084, table now 20834 pages). Same value CLASS
  (index-driven vs sequential), different index-plan flavor; noted, not tuned.
- verify/02-reverify-flip-fresh-state.log: recreated the exact driver-01/02
  state in a separate database (verifydb, dropped afterward). Result:
  'cancelled' -> Index Scan using orders_status_idx (19,884 rows, 20.425 ms);
  'shipped' -> Seq Scan (1,899,921 rows, 167.469 ms). raw/02's value class
  reproduces exactly on matching state.
- 02:10 UTC: container pilot-sel stopped and removed (lab complete). Removal
  happens before the slow-query lab starts so its timings run with the same
  background load profile (only the two r6-jvm siblings).
