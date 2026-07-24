# Fact-notes: partition pruning, retiring data, and the range/hash trade (r4-partitioning)

Environment: PostgreSQL 16.14 (`postgres:16-alpine`, image
`sha256:e013e867e712fec275706a6c51c966f0bb0c93cfa8f51000f85a15f9865a28cb`),
single container `r4-part`, Docker 29.4.3, arm64 Mac, macOS 26.5.1.
`shared_buffers` 128MB, `work_mem` 4MB, `max_parallel_workers_per_gather` 2,
`enable_partition_pruning` on. All values below are copied exactly as printed in
the raw logs.

**General caveat for every millisecond figure:** the three replication containers
from the sibling `r4-replication` lab were running on the same Docker VM
throughout. Plan shapes, partition-scan-node counts, buffer counts and row counts
are the reliable part; absolute milliseconds are not, and every timing is given
as the range over three runs.

**Data shape:** `events`, 2,400,000 rows, RANGE partitioned by `occurred_at` into
twelve monthly partitions (183,128–203,856 rows each), plus `events_flat`, an
unpartitioned twin holding the identical 2,400,000 rows with the identical
columns. Both carry a btree index on `occurred_at`. Raw: `raw/01-schema-load.log`.

---

## Pruning

1. **Pruning works exactly as claimed, and the plan says so in one line.** A
   query filtering to one month against the partitioned table produced a plan
   naming a single partition; the other eleven do not appear.
   Raw: `raw/02-pruning.log`.

   Verbatim (show-the-artifact excerpt, run 2 of 3):

   ```
    Finalize Aggregate (actual time=11.948..13.448 rows=1 loops=1)
      Buffers: shared hit=1699
      ->  Gather (actual time=11.852..13.445 rows=2 loops=1)
            Workers Planned: 1
            Workers Launched: 1
            ->  Partial Aggregate (actual time=10.476..10.476 rows=1 loops=2)
                  ->  Parallel Seq Scan on events_2025_07 events
                        (actual time=0.008..7.247 rows=101912 loops=2)
                        Filter: ((occurred_at >= '2025-07-01 00:00:00+00'...)
                        Buffers: shared hit=1699
    Execution Time: 13.476 ms
   ```

   Note on convention: `rows=101912 loops=2` is the *per-worker* row count under
   a parallel plan — two workers × 101,912 ≈ the partition's 203,825 rows. It is
   not the number of rows the query returned.

2. **Drop the partition key from the predicate and pruning cannot help.** The
   same table, filtered on `tenant_id` instead, produced a `Parallel Append` over
   all twelve partitions. Counting scan nodes in the two plans: **1** for the
   month-filtered query, **12** for the tenant-filtered one.
   Raw: `raw/02-pruning.log`.

3. **The comparison against the unpartitioned twin was confounded, and the
   confound was the bigger effect.** In the first measurement the flat twin
   showed `Heap Fetches: 203825` and `Buffers: shared hit=202121 read=2261` —
   an index-only scan visiting the heap for every row, because the table had
   never been vacuumed after its bulk load (`relallvisible` 0 of 20,000
   `relpages`). Reading that as partitioning's benefit would have overstated it
   by roughly 119× on buffers. Raw: `raw/02-pruning.log`, `raw/02b-vacuum-control.log`.

4. **After VACUUM, the unpartitioned table wins this query.** With
   `relallvisible` at 20,000 of 20,000 for the flat twin and 1,699 of 1,699 for
   the partition, the same one-month count over the same 203,825 rows measured:
   Raw: `raw/02b-vacuum-control.log`.

   | | plan node | buffers | execution, 3 runs |
   |---|---|---|---|
   | partitioned (`events`) | `Parallel Seq Scan on events_2025_07` | `shared hit=1699` | 14.144 / 12.499 / 11.770 ms |
   | flat twin (`events_flat`) | `Parallel Index Only Scan`, `Heap Fetches: 0` | `shared hit=564` | 9.632 / 9.213 / 8.161 ms |

   Interpretation, not measured: pruning to one partition left no selectivity for
   an index to exploit — the partition *is* the month — so the partitioned side
   seq-scanned it, while the flat table's btree served the same count as an
   index-only scan over three times fewer buffers. This is one query on one
   shape of data and is not a general claim that partitioning slows reads.

## Retiring old data

5. **DETACH against DELETE, same three months, same row counts.** Three months
   were retired from each side. The row counts matched exactly on both sides at
   every step (203,855 / 184,128 / 203,856; totals falling 2,400,000 →
   2,196,145 → 2,012,017 → 1,808,161 identically), so the two sides did
   provably the same job. Raw: `raw/03-detach-vs-delete.log`.

   | rows retired | `ALTER TABLE … DETACH PARTITION` | `DELETE FROM … WHERE` |
   |---|---|---|
   | 203,855 | 2.312 ms | 124.934 ms |
   | 184,128 | 2.153 ms | 104.757 ms |
   | 203,856 | 1.884 ms | 112.535 ms |
   | **range** | **1.884–2.312 ms** | **104.757–124.934 ms** |

6. **What each approach left behind is the sharper half of the result.** After
   the three deletes the flat table held `n_dead_tup = 591839` and measured
   `208 MB` — its size before the deletes. `VACUUM events_flat` took 101.718 ms,
   took dead tuples to `0`, and the table still measured `208 MB`. The
   partitioned side's remaining partitions summed to `157 MB` immediately, with
   no vacuum. Raw: `raw/03-detach-vs-delete.log`.

   From the docs, not measured in this run: plain `VACUUM` returns space for
   reuse within the table rather than to the filesystem; `VACUUM FULL` rewrites
   the table and does return it, at the cost of an exclusive lock. No
   `VACUUM FULL` was run here.

7. **The detached partitions survive as ordinary tables** outside the parent —
   they are dropped or archived separately, and the detach itself does not delete
   data. Raw: `raw/03-detach-vs-delete.log`.

## Range against hash

8. **A time-ordered stream lands entirely in one range partition, and spreads
   evenly under hash.** 120,000 rows with strictly increasing timestamps, all
   inside one day, inserted into two identically-keyed twelve-partition tables:
   Raw: `raw/04-range-vs-hash.log`.

   - RANGE: `ev_range_07` received **120,000**; the other eleven received none.
   - HASH: the twelve partitions received 10,187 / 10,100 / 9,907 / 9,762 /
     9,995 / 10,091 / 10,048 / 9,872 / 10,059 / 10,027 / 10,001 / 9,951 —
     a spread of 9,762–10,187.

9. **And the bill for that spread, in the same pair of plans.** A one-hour range
   scan over the same data touched **1** partition on the range-partitioned
   table (`Seq Scan on ev_range_07`) and **12** on the hash-partitioned one (an
   `Append` over `ev_hash_0` … `ev_hash_11`). Raw: `raw/04-range-vs-hash.log`.

---

## What this lab does NOT establish

- **There are no nodes here.** Everything above is one Postgres on one machine.
  The article's "one node works while the rest watch" is the distributed
  consequence of the skew measured in note 8; this lab measures which *partition*
  receives the writes, not what that does to a cluster.
- Nothing here tests cross-partition transactions, two-phase commit, or global
  versus local secondary indexes. Those claims in the article remain
  source-derived.
- Note 4 is one query shape (a count over one month). It is evidence that
  partitioning is not automatically a read win, not evidence that it is a read
  loss in general.
- No `VACUUM FULL`, no partition-wise join, and no concurrent write load were
  tested.
