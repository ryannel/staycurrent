# Plan: Caching patterns (article 2)

## The reader at the start

They have read the introduction. They can write the cache-aside read path with
`GET` and `SET ... EX`, know that the miss ratio sets database load, and know
that popularity is skewed. They have not yet thought about what happens to the
cache when data changes, and they meet the names read-through, write-through
and write-behind in vendor documentation without knowing which differences
matter. Their concrete situation: an online shop's product page is cached, and
now a price changes.

## The questions, in order

1. A price changed in the database. What should the write do to the cached copy?
   (Leave it, delete it, or update it.) Figure 1 shows the three choices.
2. Why is delete the usual answer, and what does it cost? Each write costs the
   next read a miss: hit ratio for one key is at most k / (k + 1), where k is
   reads per write (derived from two Poisson streams). Figure 2 runs delete and
   update on the same events.
3. So why not update (write-through)? What it buys (no miss after a write,
   read-your-writes), what it costs (the writer must build the cached form;
   memory for unread keys; plain `SET` silently drops the TTL, observed), and
   why the database must be written first: Figure 3 crashes between the two
   writes in either order.
4. What if the cache layer did the loading (read-through)? What changes for
   code (one loader) and, more importantly, for failure: the load outlives the
   request, so a read-through cache refills during overload while cache-aside
   can stay empty. Figure 4 (Bronson et al., HotOS 2021).
5. What if the write did not wait for the database (write-behind)? Coalescing
   arithmetic (database writes = keys / interval, not increments a second) and
   exposure (about rate × interval / 2 lost on average if Redis restarts).
   Figure 5, a counter with a flush interval and a restart button. Atomic
   `GETDEL` flush, measured against `GET` then `DEL`. Figure 6: the flusher
   overwrites a newer write made directly to the database.
6. Write-around and refresh-ahead, briefly, as variations of the above.
7. How does each pattern fail? A consolidated table: cache unreachable on read,
   cache unreachable on write, crash between steps, database down, cold start.
8. How do you choose? Questions about the workload (reads per write per key,
   staleness tolerance, loss tolerance, other writers of the database, whether
   the writer holds the cached form) and a summary table.

## Figures

1. **What a write does to the cached copy.** Live. Six products, reads with
   skewed popularity, occasional price changes. Each row shows the database
   version and the Redis version side by side, so staleness is visible as a
   mismatch. Control: one choice, "After writing the database": leave Redis /
   delete the key / update the key. Notice: "leave" serves stale reads until
   the TTL; "delete" causes one miss after each write; "update" neither.
2. **Each write costs the next read a miss.** Live. One key, one stream of reads
   and writes drawn twice: the top row deletes on write, the bottom row updates.
   Control: reads per write. Notice: in the delete row every write is followed
   by exactly one miss, so the hit ratio tracks k / (k + 1); the update row
   never misses, but some cache writes are overwritten before anyone reads them.
3. **A crash between the two writes.** Stepped sequence with a choice of order:
   database first, or Redis first. Notice: database-first leaves an old value
   until the TTL; Redis-first leaves a value the database never accepted.
4. **Who finishes the load after Redis restarts.** Live. A warm cache is
   emptied at 10 s; the database can serve fewer queries than the misses that
   follow. Control: cache-aside or read-through. Chart of hit ratio and requests
   answered in time. Notice: cache-aside stays stuck because every query
   finishes after the application has given up; read-through refills and
   recovers.
5. **Write-behind trades database writes for exposure.** Live scene of view
   counters: application increments Redis, a flusher writes the database every
   N seconds. Control: flush interval, plus a Restart Redis button. Notice:
   longer intervals mean far fewer database writes and more views lost in a
   restart.
6. **The flusher overwrites a newer write.** Stepped sequence: stock set in
   Redis and queued, a warehouse import writes the database directly, the
   flusher writes the old number over it.

## Where I stop

- Races between concurrent readers and writers: one paragraph and a link to
  article 5 (the classic stale write-back and the delete order).
- Stampede protection and single-flight: named, linked to article 6.
- TTL choice, expiry mechanics, eviction: article 4. Persistence settings that
  shrink write-behind exposure: article 9. Metastable recovery and degradation:
  article 11. Atomic compare-and-set: article 8.
- No library tour: one example (Redisson's map loader and writer) to show where
  read-through and write-behind live when Redis itself does not run them.
- Further depth on write-behind queue designs (streams, outbox) would not change
  the decision of whether to use write-behind, so it stops at the exposure,
  coalescing, ordering and conflict properties.
