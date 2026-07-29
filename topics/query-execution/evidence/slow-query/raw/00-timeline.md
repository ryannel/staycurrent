# Timeline — slow-query lab (pilot-query-execution, container pilot-slow)

Append-only, written as things happen. Times are host clock, UTC (the
2026-07-23 original used SAST = UTC+2).
This is a fresh re-run of the round-3 ho-slow-query harness
(/Users/ryannel/Workspace/writer/testing/round-3/evidence/ho-slow-query/).
The source directory contains no .sql/.sh driver files — only raw logs whose
"input SQL (verbatim)" sections embed the SQL; the drivers here were
reconstructed from those sections, statement-for-statement. No adaptations to
statements or run counts: the original already ran every timed measurement 3x
and captured full EXPLAIN (ANALYZE, BUFFERS) plans. setseed(0.42) as in the
original, so data (incl. victim user2@example.com) is expected to reproduce
exactly; the hard-coded victim in drivers 02-07 is kept, and if the seed's
top-5 differs this run, that gets recorded here as a deviation before
proceeding.

## Step 1 — 2026-07-29 02:11 UTC — harness reconstruction

- Created evidence/slow-query/{setup.sh, driver-01..08, raw/}.
- Selectivity-lab container pilot-sel already removed; background load during
  this lab is only the two unrelated r6-jvm siblings (up 4 days) on the same
  Docker Desktop VM. Absolute ms timings directional only.

## Step 2 — 2026-07-29 02:10:55 UTC — container up

- setup.sh: `docker run -d --name pilot-slow -e POSTGRES_PASSWORD=pilotpw -p 54316:5432 postgres:16-alpine`
  -> container 0cd7e63ac778. pg_isready poll, then real SELECT 1 confirmed.
- SELECT version(): PostgreSQL 16.14 on aarch64-unknown-linux-musl — identical
  server version to the 2026-07-23 run (r3-ho).

## Step 3 — 2026-07-29 02:11:06 -> 02:11:12 UTC — driver-01 seed (log: 01-seed.log)

- setseed(0.42) reproduced the 2026-07-23 dataset EXACTLY: counts 200000 /
  1000000 / 3000000; sizes 29 MB / 82 MB / 214 MB; top-5 heavy users identical
  down to the counts (user2 2072, user8 2065, user15 2056, user3 2055,
  user19 2055); user 2 has 258 orders in the last 90 days (old: 258).
- \d confirms the deliberate gap: orders has ONLY orders_pkey, order_items
  ONLY order_items_pkey.
- Victim stays u.email = 'user2@example.com' as hard-coded in drivers 02-07.

## Step 4 — 2026-07-29 02:11:33 UTC — driver-02 incident query, 3 timed runs (log: 02-incident-query.log)

- Run 1: Time: 180.537 ms | Run 2: 149.901 ms | Run 3: 138.042 ms
  (2026-07-23: 121.640 / 107.484 / 106.182 ms — same order of magnitude,
  ~25-45% slower this session; absolute ms are directional per environment.txt).
- Returns the SAME 20 rows as the old run: identical order ids, statuses and
  item counts (986800 shipped/3 ... 980641 cancelled/5); created_at values are
  shifted by the ~5.7-day gap between run dates, exactly as the seeded
  now()-relative generator predicts.

## Step 5 — 2026-07-29 02:11:52 UTC — driver-03 before-plan (log: 03-explain-before.log)

- EXPLAIN (ANALYZE, BUFFERS): Execution Time 188.781 ms; Buffers shared
  hit=11983 read=14950 (old: 174.663 ms; 12306+14627 — same ~26.9k total).
- Plan structure reproduces the 2026-07-23 run NODE FOR NODE: Parallel Seq
  Scan on order_items (1,000,000 rows/worker, loops=3), Parallel Seq Scan on
  orders (41,209 rows/worker kept, 292,124 removed — identical numbers to the
  old log thanks to the seed), Parallel Hash Join of the two big tables FIRST
  (123,718 rows/loop), the one-user Hash Join LAST (254 rows/loop), 246 final
  groups, top-N heapsort, LIMIT 20.
- The teaching surprises hold: join order applies the most selective predicate
  last; estimate rows=1 vs actual 254 on the user join (skew invisible through
  u.email). Minor drift only in cost decimals (52003.42 vs 52028.30).

## Step 6 — 2026-07-29 02:12:18 UTC — driver-04 fix 1 (log: 04-fix-1.log)

- CREATE INDEX ON order_items(order_id) -> order_items_order_id_idx,
  651.165 ms build, 42 MB (old: 571.579 ms, 42 MB).

## Step 7 — 2026-07-29 02:12:28 UTC — driver-05 after fix 1 (log: 05-after-fix-1.log)

- Run 1: 37.081 ms | Run 2: 33.496 ms | Run 3: 31.630 ms
  (old: 51.267 / 33.658 / 31.608). Same 20 rows.
- EXPLAIN (ANALYZE, BUFFERS): Execution Time 33.747 ms; Buffers shared
  hit=2617 read=6796 (old: 31.475 ms; 2638+6775).
- Plan flip reproduces the old run exactly: Nested Loop; order_items now
  reached via Index Scan using order_items_order_id_idx (loops=258, rows=3
  per probe, 1536 buffers — same values as 2026-07-23). The 3M-row seq scan is
  gone; join order flipped to users x orders first (258 order rows via Gather).
- Remaining cost is the Parallel Seq Scan on orders (28.617 ms/worker;
  292,125 rows/worker removed by the created_at filter — identical count).
  Planner still estimates rows=1 for the user's orders (actual 258).

## Step 8 — 2026-07-29 02:12:49 UTC — driver-06 fix 2 (log: 06-fix-2.log)

- CREATE INDEX ON orders(user_id, created_at) -> orders_user_id_created_at_idx,
  260.825 ms build, 30 MB (old: 228.577 ms, 30 MB).

## Step 9 — 2026-07-29 02:12:57 UTC — driver-07 after fix 2 (log: 07-after-fix-2.log)

- Run 1: 4.516 ms | Run 2: 1.824 ms | Run 3: 1.227 ms
  (old: 4.357 / 1.918 / 1.514; original before-fix baseline this session:
  180.537 / 149.901 / 138.042). Same 20 rows.
- EXPLAIN (ANALYZE, BUFFERS): Execution Time 0.778 ms; Buffers shared
  hit=1800, read=0 — EXACTLY the old buffer count. No seq scans, no parallel
  workers; three stacked index scans: users_email_key (1 row) ->
  orders_user_id_created_at_idx with composite Index Cond (user_id = u.id AND
  created_at > now()-'90 days') -> 258 rows, 260 buffers ->
  order_items_order_id_idx (loops=258, 1536 buffers). Matches 2026-07-23
  node for node, including the 1800-buffer figure the old timeline flagged as
  its honest "magnitude off ~4x" prediction miss.

## Step 10 — 2026-07-29 02:13:14 UTC — driver-08 close-out (log: 08-close.log)

- Timings vs baseline, all runs kept (ms):
  before fixes:  180.537 / 149.901 / 138.042
  after fix 1:    37.081 /  33.496 /  31.630
  after fix 2:     4.516 /   1.824 /   1.227
- Cost of the fix: order_items_order_id_idx 42 MB (651.165 ms build) +
  orders_user_id_created_at_idx 30 MB (260.825 ms build).
- Index usage counters IDENTICAL to the 2026-07-23 close-out, scan for scan:
  order_items_order_id_idx idx_scan=2080, orders_user_id_created_at_idx 12,
  order_items_pkey 0, orders_pkey 24, users_email_key 28, users_pkey 26 —
  the deterministic seed plus identical driver sequence reproduces even the
  executor's index-usage bookkeeping.
- Relation sizes identical to old run (order_items 149/255 MB, orders
  61/112 MB, users 11/29 MB).

## Step 11 — 2026-07-29 02:14 UTC — spot-verify (verify/01) + teardown

- Rule-7 spot-check ran AFTER raw/ logs were cited above; written to verify/,
  raw/ untouched.
- verify/01-reverify-final-state.log: incident query 3x against the end state
  (both fixes): 7.582 / 0.935 / 0.986 ms — single-digit-ms class of raw/07
  reproduces. EXPLAIN (ANALYZE, BUFFERS): Execution Time 0.755 ms, Buffers
  shared hit=1800, same three stacked index scans, no seq scans, no Gather.
- 02:14 UTC: container pilot-slow stopped and removed. Both lab containers
  (pilot-sel, pilot-slow) now cleaned up; only the pre-existing unrelated
  r6-jvm siblings remain.
