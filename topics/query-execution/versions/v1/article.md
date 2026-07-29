---
version: 1
cut: 2026-07-29
---

# Query Execution

> Read the plan, not the schema: an index is a suggestion the planner prices and is free to refuse, and EXPLAIN ANALYZE is how you find out what your query actually did.

## Two queries, one index, and only one of them uses it

Here are two queries against the same table, filtering the same indexed column. One uses the index. The other reads all 130 MB, ignores the index, and is right to. If you've added an index because something got slow, seen it get faster, and never opened a plan to find out which change did it, this is aimed at you.

The table holds two million orders, lopsidedly: 1,899,747 `shipped` (94.987%), 80,012 `pending` (4.001%), 20,241 `cancelled` (1.012%), with a 13 MB index on `status`. Two labs run here, each in its own container on one Docker Desktop VM: PostgreSQL 16.14, `postgres:16-alpine`, server settings at their defaults, two further unrelated containers sharing the VM throughout. So plan shapes, row counts and buffers are the evidence, and milliseconds are directional.

`EXPLAIN (ANALYZE, BUFFERS)` runs the query and prints what happened. Start with the 1% value.

```
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE status = 'cancelled';
                                                              QUERY PLAN                                                              
--------------------------------------------------------------------------------------------------------------------------------------
 Index Scan using orders_status_idx on orders  (cost=0.43..9105.51 rows=18867 width=34) (actual time=0.015..5.047 rows=20241 loops=1)
   Index Cond: (status = 'cancelled'::text)
   Buffers: shared hit=11764
 Planning Time: 0.054 ms
 Execution Time: 5.467 ms
(5 rows)
```

Read the labels. `cost=0.43..9105.51` is the planner's own unit, startup then total, comparable to other costs and never to milliseconds. `rows=18867`, in the cost parentheses, is what the planner expected; the planner is what picks a strategy before any rows move. `rows=20241`, in the actual parentheses, is what the executor counted. `Buffers` counts 8 kB page accesses: `hit` was already in shared memory, `read` came from outside.

Now the 95% value.

```
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE status = 'shipped';
                                                    QUERY PLAN                                                     
-------------------------------------------------------------------------------------------------------------------
 Seq Scan on orders  (cost=0.00..41667.00 rows=1901467 width=34) (actual time=0.035..117.549 rows=1899747 loops=1)
   Filter: (status = 'shipped'::text)
   Rows Removed by Filter: 100253
   Buffers: shared hit=14661 read=2006 written=32
 Planning Time: 0.026 ms
 Execution Time: 156.691 ms
(6 rows)
```

`Seq Scan`, all three runs, 100,253 rows dropped by the filter, 16,667 page accesses: every page of the table, once. The `written=32` on that line swings between otherwise-identical runs, and I didn't chase it.

## The estimate is arithmetic you can check by hand

Postgres keeps a summary of each column in `pg_stats`, refreshed by `ANALYZE` — the standalone statement that resamples statistics, not the `ANALYZE` option inside `EXPLAIN` that makes it actually run the query. For `orders.status`: three values and a frequency for each. Multiply a frequency by the row count and you get the plan's number.

| status | stored frequency | × 2,000,000 | plan's `rows=` | executor's actual |
| --- | --- | --- | --- | --- |
| `shipped` | 0.9507333 | 1,901,466.6 | 1901467 | 1899747 |
| `pending` | 0.039833333 | 79,666.7 | 79667 | 80012 |
| `cancelled` | 0.009433334 | 18,866.7 | 18867 | 20241 |

The last two columns don't match because those frequencies come from sampling rather than counting — documented behaviour, not something these logs show. Otherwise that's the whole decision: the planner isn't checking your schema for permission, it's multiplying a stored fraction by two million and pricing the alternatives.

This is where the add-an-index reflex comes from, and why it survives. Add an index for a selective query and it works. Add one for a query returning most of the table and nothing happens: same plan, same speed, one more index on disk. No signal either way, so the habit never gets corrected. That's intermittent reinforcement: rewarded on some attempts and not others, which is the pattern hardest to unlearn. It's my explanation, not anything either lab measured.

## Now build the obvious index and watch nothing happen

Same table, new query: `SELECT customer_id, total FROM orders WHERE status = 'pending'`, 4% of the rows, and with only the plain status index it's an `Index Scan` costing 14082.32 at 16,607 page accesses. So build the index that ought to fix it. `CREATE INDEX orders_status_covering_idx ON orders (status) INCLUDE (customer_id, total)` puts both output columns inside the index, so Postgres could answer without opening the table. 77 MB. Run it again.

```
EXPLAIN (ANALYZE, BUFFERS) SELECT customer_id, total FROM orders WHERE status = 'pending';
                                                               QUERY PLAN                                                               
----------------------------------------------------------------------------------------------------------------------------------------
 Index Scan using orders_status_idx on orders  (cost=0.43..14082.32 rows=79667 width=10) (actual time=0.025..27.606 rows=80012 loops=1)
   Index Cond: (status = 'pending'::text)
   Buffers: shared hit=11188 read=5419
 Planning Time: 0.042 ms
 Execution Time: 29.296 ms
(5 rows)
```

The plan didn't change: the old index, the same cost, the same 16,607 page accesses, three runs out of three. The new one sits there.

Then `VACUUM orders`, which takes `relallvisible` — pages the visibility map marks as holding only rows visible to every transaction — from 0 to 16,667 of the table's 16,667. Same query, third time:

```
EXPLAIN (ANALYZE, BUFFERS) SELECT customer_id, total FROM orders WHERE status = 'pending';
                                                                     QUERY PLAN                                                                     
----------------------------------------------------------------------------------------------------------------------------------------------------
 Index Only Scan using orders_status_covering_idx on orders  (cost=0.43..2974.60 rows=79667 width=10) (actual time=0.010..5.105 rows=80012 loops=1)
   Index Cond: (status = 'pending'::text)
   Heap Fetches: 0
   Buffers: shared hit=398
 Planning Time: 0.025 ms
 Execution Time: 6.641 ms
(6 rows)
```

`Heap Fetches: 0` — the heap is the table itself, so zero means this scan never opened it. Cost 2974.60 against 14082.32, 398 page accesses against 16,607: 41.7x fewer pages.

The documented mechanism: an index-only scan skips the table only for pages the visibility map marks all-visible, and `VACUUM` sets those bits. What this run measured is the correlation — `relallvisible` 0 → 16,667, and the plan flipped — not the mechanism itself.

So the refusal was priced, not broken: the 13 MB `orders_status_idx` the planner already trusted, against the 77 MB covering index whose every row it would have had to verify. I'm inferring that weighing. The log shows the refusal itself, at one selectivity, on one table size.

## rows=1, actual rows=500000

Insert 500,000 rows carrying a status the table has never held, `returned`, and skip `ANALYZE`. `n_mod_since_analyze` reads 500000; `last_autoanalyze` is empty.

```
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE status = 'returned';
                                                                QUERY PLAN                                                                
------------------------------------------------------------------------------------------------------------------------------------------
 Index Scan using orders_status_covering_idx on orders  (cost=0.43..8.45 rows=1 width=34) (actual time=0.015..35.358 rows=500000 loops=1)
   Index Cond: (status = 'returned'::text)
   Buffers: shared hit=6485
 Planning Time: 0.052 ms
 Execution Time: 50.636 ms
(5 rows)
```

The statistics still described the table as it was before the insert: three values, no `returned`. Running `ANALYZE orders` moves the estimate to 506,417 against 500,000 actual and flips the plan to a `Bitmap Heap Scan`. Documented behaviour: collect the matching row locations from the index, then read the table in page order, which is what you do when the match set is too big to chase a row at a time.

So how much did a 500,000x miss actually slow this query? Between 13 and 18 ms pairing them in run order: 55.917 / 50.636 / 50.920 ms with the bad estimate, 37.953 / 37.642 / 37.305 after `ANALYZE`. It's that cheap, as I read it, because this node is the whole query — nothing downstream got sized on the lie. Put a `rows=1` under a join and everything above it does.

## Where the time goes when the indexes are missing

The second lab runs the same Postgres at the same defaults, seeded with `setseed(0.42)`: 200,000 users, 1,000,000 orders, 3,000,000 order items, and two missing indexes on purpose. Nothing on `orders.user_id`, nothing on `order_items.order_id`. `user2@example.com` has 2,072 orders, 258 in the last 90 days: synthetic two-tier skew, not a real power law.

The query wants one user's recent orders with item counts:

```
SELECT o.id, o.created_at, o.status, count(oi.id) AS items
FROM users u
JOIN orders o ON o.user_id = u.id
JOIN order_items oi ON oi.order_id = o.id
WHERE u.email = 'user2@example.com'
  AND o.created_at > now() - interval '90 days'
GROUP BY o.id, o.created_at, o.status
ORDER BY o.created_at DESC
LIMIT 20;
```

Here's the part that matters:

```
                                 ->  Hash Join  (cost=15708.64..51003.07 rows=1 width=31) (actual time=37.949..185.403 rows=254 loops=3)
                                       Hash Cond: (o.user_id = u.id)
                                       Buffers: shared hit=11964 read=14950
                                       ->  Parallel Hash Join  (cost=15700.19..50590.45 rows=153966 width=39) (actual time=36.971..180.295 rows=123718 loops=3)
                                             Hash Cond: (oi.order_id = o.id)
                                             Buffers: shared hit=11926 read=14950
                                             ->  Parallel Seq Scan on order_items oi  (cost=0.00..31609.00 rows=1250000 width=16) (actual time=0.019..42.702 rows=1000000 loops=3)
                                                   Buffers: shared hit=11339 read=7770
```

`Workers Launched: 2`, from the plan's summary lines below this extent, so under these parallel nodes `loops=3` is the leader plus two workers and each printed `rows=` is a per-worker average: totals are roughly rows × loops. Which means `order_items` is read whole, 1,000,000 rows per worker and three million in all, and the join above it emits 123,718 per loop, roughly 371,000 intermediate rows, collapsing to 254 per loop at the user join and then to your 20. And lower in the same plan:

```
                                                   ->  Parallel Seq Scan on orders o  (cost=0.00..15058.67 rows=51322 width=31) (actual time=0.016..31.141 rows=41209 loops=3)
                                                         Filter: (created_at > (now() - '90 days'::interval))
                                                         Rows Removed by Filter: 292124
                                                         Buffers: shared hit=587 read=7180
```

41,209 rows kept per worker, 292,124 dropped per worker on the date filter. And the predicate that reduces the answer to one user runs last, with an estimate there of `rows=1` against an actual 254. What follows is my reading, inferred from the printed estimates rather than measured. With no index on `orders(user_id)`, the planner can't cheaply start from the user and work outward. And since the filter is on `u.email`, it can't know at plan time which `user_id` to price. So it prices an average user: a million orders over 200,000 users, dividing to five, against one holding 2,072.

| stage | timed runs (ms) | buffers, instrumented run |
| --- | --- | --- |
| no join indexes | 180.537 / 149.901 / 138.042 | 11,983 hit + 14,950 read = 26,933 |
| + `order_items(order_id)` | 37.081 / 33.496 / 31.630 | 2,617 hit + 6,796 read = 9,413 |
| + `orders(user_id, created_at)` | 4.516 / 1.824 / 1.227 | 1,800 hit + 0 read = 1,800 |

Two indexes fix it, one line each. `CREATE INDEX ON order_items(order_id)` removes the three-million-row scan: `order_items` gets probed 258 times at three rows a probe. What's left is the parallel scan on `orders`, still dropping 292,125 rows per worker in that run. `CREATE INDEX ON orders(user_id, created_at)` removes that too.

```
                     ->  Nested Loop  (cost=1.28..18.23 rows=3 width=31) (actual time=0.018..0.552 rows=762 loops=1)
                           Buffers: shared hit=1800
                           ->  Nested Loop  (cost=0.85..16.90 rows=1 width=23) (actual time=0.014..0.105 rows=258 loops=1)
                                 Buffers: shared hit=264
                                 ->  Index Scan using users_email_key on users u  (cost=0.42..8.44 rows=1 width=8) (actual time=0.006..0.006 rows=1 loops=1)
                                       Index Cond: (email = 'user2@example.com'::text)
                                       Buffers: shared hit=4
                                 ->  Index Scan using orders_user_id_created_at_idx on orders o  (cost=0.43..8.45 rows=1 width=31) (actual time=0.006..0.079 rows=258 loops=1)
                                       Index Cond: ((user_id = u.id) AND (created_at > (now() - '90 days'::interval)))
                                       Buffers: shared hit=260
                           ->  Index Scan using order_items_order_id_idx on order_items oi  (cost=0.43..1.29 rows=4 width=16) (actual time=0.001..0.001 rows=3 loops=258)
                                 Index Cond: (order_id = o.id)
                                 Buffers: shared hit=1536
```

Three index scans stacked: the email lookup for 4 buffers, the composite index carrying user and date range in one `Index Cond` for 258 rows and 260 buffers, then `order_items` probed 258 times for 1,536. That's 1,800 page accesses, nothing read from outside shared buffers, against 26,933 before. The estimate still says `rows=1` where 258 rows come back.

These are warm-cache laptop values, so take the ratio: about 40x worst-to-worst, about 112x best-to-best, same 20 rows at every stage. The two indexes took 72 MB of disk and 911.990 ms to build on an idle instance. A live table would want `CREATE INDEX CONCURRENTLY`, untested here, and neither lab measured what two more indexes charge the write path.

## Read the plan before you touch the schema

Before you change the schema, run `EXPLAIN (ANALYZE, BUFFERS)` and read three things: the shape (which scans, which join order, what got applied last), the estimate against the actual at every node, and the buffer counts.

Your trigger is the gap between those last two. `rows=1` against 500,000 meant statistics that had stopped describing the table, and `ANALYZE` fixed it on a table that already had every index it needed. `rows=1` against 254 meant statistics that couldn't help, for the reason above.

What you accept: this is slower than the reflex, `EXPLAIN ANALYZE` executes the query so you can't point it at something you're afraid to run, and the plan is only true of the state you read it in. That last one produced the selectivity lab's only surprise — re-run against the lab's grown end state, 2.5 million rows and the covering index present, `cancelled` came back a `Bitmap Heap Scan` rather than the `Index Scan` at the top of this page. Rebuilding the original state brought it back.

The falsifier: if your tables are small, your values uniform and your statistics fresh, the plan will only confirm what you assumed, and the reflex costs you nothing but disk.

The question you probably have is about an index you added last quarter: did anything use it. `pg_stat_user_indexes` closed the join lab with 2,080 scans on `order_items(order_id)` and 12 on `orders(user_id, created_at)`, the two I added, while `order_items_pkey` sat at 0 and `orders_pkey` at 24. The schema says which indexes exist, the plan says which one ran, and the counters say how often. A schema dump shows you only the first.
