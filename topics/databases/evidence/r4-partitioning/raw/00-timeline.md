# r4-partitioning — session timeline

Kept as the run happened, including the misses. 2026-07-24.

## 09:36 — table and twin built

2,400,000 rows into `events` (twelve monthly RANGE partitions) and the same rows
into `events_flat`, an unpartitioned twin with identical columns and an identical
index on `occurred_at`. The twin is the point: every claim about what
partitioning buys is a comparison, and without it there is nothing to compare to.

Curiosity worth noting: `pg_total_relation_size('events')` returns `0 bytes`. The
partitioned parent has no storage of its own. The real total has to be summed
over `pg_inherits`, which the later experiments do.

## 09:37 — experiment 2, pruning

Worked first time and produced the artifact this lab exists for: a plan naming
`events_2025_07` and no other partition. Counting scan nodes across the two
plans, 1 for the month-filtered query and 12 for the tenant-filtered one — the
`Parallel Append` over all twelve is as good a picture of "your predicate didn't
include the partition key" as I could have designed on purpose.

**Then the comparison went wrong, in my favour, which is the dangerous
direction.** The flat twin came back at `Buffers: shared hit=202121 read=2261`
against the partition's `1699` — a 119× difference that would have made
partitioning look extraordinary. The plan said why: `Heap Fetches: 203825`. The
twin had never been vacuumed after its bulk load, so its visibility map was empty
(`relallvisible` 0 of 20,000 relpages) and its index-only scan was visiting the
heap for every single row. That is not partitioning's win; that is an
un-vacuumed table.

This is the same trap the round-3 selectivity lab hit from the other side, and I
only caught it because the plan text was on the screen rather than a number
distilled out of it.

## 09:38 — experiment 2b, the VACUUM control

VACUUMed both sides and re-ran. **The result reverses.** With
`relallvisible` full on both, the *unpartitioned* table is faster and touches
about three times fewer buffers:

- partitioned: `Parallel Seq Scan on events_2025_07`, `hit=1699`, 11.770–14.144 ms
- flat twin: `Parallel Index Only Scan`, `Heap Fetches: 0`, `hit=564`, 8.161–9.632 ms

The reason, once you see it, is obvious: pruning to one partition leaves no
selectivity for an index to exploit, because the partition *is* the month. So the
partitioned side scans the whole partition while the flat table's btree answers
the same count from the index alone.

This is the finding I did not expect and the one most worth keeping. It supports
the article's existing stance rather than undermining it — partitioning is the
last rung of the ladder, not a read optimisation — and it is exactly the kind of
claim the literature states as advice and rarely as a measurement.

## 09:39 — experiment 3, DETACH vs DELETE

The other side of the ledger, and no surprises. DETACH 1.884–2.312 ms against
DELETE 104.757–124.934 ms for identical row counts (203,855 / 184,128 / 203,856
on both sides, with the running totals falling in lockstep — that match is the
check that the two sides did the same job).

The aftermath is sharper than the timing. After the deletes the flat table held
`n_dead_tup = 591839` and still measured 208 MB, its original size. `VACUUM`
took the dead tuples to 0 and the table still measured 208 MB. The partitioned
side dropped to 157 MB the moment the partitions were detached, with no vacuum at
all.

## 09:40 — experiment 4, range against hash

Clean and quick. A time-ordered stream of 120,000 rows put **all** of them in
`ev_range_07` under range partitioning and spread them 9,762–10,187 across twelve
under hash. The same one-hour scan then touched 1 range partition and 12 hash
partitions. Both halves of the article's trade, in one pair of plans.

Scope limit recorded in the fact-notes and worth repeating here: there are no
nodes in this lab. It shows which partition receives the writes; it cannot show
"one node works while the rest watch."
