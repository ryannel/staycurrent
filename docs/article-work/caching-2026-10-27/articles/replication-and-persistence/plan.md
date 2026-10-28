# Plan: Redis replication, persistence and failover (article 9)

## The reader's starting situation

The reader has read articles 1 to 8. They can design a cache-aside read path,
choose keys, TTLs and an eviction policy, deal with invalidation races and
stampedes, and they know Redis is one process with one main thread, reached
over round trips. They have treated "the Redis server" as one machine that is
always there. They have heard of RDB, AOF, replicas and Sentinel, and probably
assume that turning more of them on makes a cache "safer".

Opening situation: the shop's Redis host is rebooted for a kernel patch at
night. Redis comes back empty, the hit ratio collapses, and the database is far
over its normal load for many minutes. The team's instinct is "turn on
persistence and add a replica". The article answers what each of those actually
protects for a cache, what each costs, and what each can still lose, including
two ways a protection makes a cache worse (a snapshot or failover that brings
back deleted values; a replica wiped by its own primary's fast restart).

## What is different for a cache

A database must not lose acknowledged writes. A cache may lose any key at any
time, because it can be rebuilt from the database. What it must not do is (a)
lose everything at once when the database cannot absorb the misses, (b) serve
values that should have been deleted, or (c) refuse writes, because refused
deletes become stale reads. The article measures every mechanism against those
three, and separates real cache data from "not really a cache" data (sessions,
rate-limit counters, write-behind buffers) that does need durability.

## Questions, in order

1. What does losing the cache cost? Restart empty: database load × 1/(1−h),
   recovery over minutes. Derived, then simulated (Figure 1). The answer sets
   the budget for everything else.
2. How does Redis put its memory on disk without stopping? RDB: fork, child
   writes a file, rename. The fork pause (page tables, ms per GB) and
   copy-on-write memory (Figure 2). THP, overcommit.
3. What does a snapshot give back after a crash? Everything since the last save
   is gone (default save rules; `rdb_changes_since_last_save`). For a cache the
   surprise is the opposite: deletes made after the snapshot are undone, while
   TTLs still hold because expiry times are absolute (Figure 3, measured).
   A failed save stops writes, deletes included (`MISCONF`, measured).
   Loading takes seconds per million keys and answers `-LOADING` meanwhile.
4. What does the append-only file add? Log of commands in RESP, absolute
   expiry; fsync policies; process crash versus power loss (Figure 4); rewrite.
   For a cache it is rarely worth it; for non-cache data it is. `WAITAOF`.
5. What is a replica? Full sync, then the command stream; replication ID and
   offset; asynchronous acknowledgement; lag and stale reads (Figure 5). Replica
   expiry behaviour (owned here; measured). Replicas ignore `maxmemory`.
6. What happens when the link breaks? Backlog, partial against full resync,
   sizing the backlog (Figure 6, measured both outcomes). `repl-timeout`, and
   `min-replicas-to-write` observed at real time.
7. What does a failover lose? An acknowledged delete, brought back (Figure 7,
   measured). `WAIT` and what it does not promise. The partitioned old primary.
8. Can a replica make things worse? A primary without persistence that restarts
   quickly wipes its replicas; Sentinel does not notice (Figure 8, measured).
9. How does Sentinel fail over? SDOWN, ODOWN, quorum, majority vote, replica
   selection, promotion, reconfiguration, client discovery and `ROLE`. A live
   failover at real timings from my measurement (Figure 9). Quorum against
   majority, and why two Sentinels are not enough (Figure 10). Planned
   switchover with `FAILOVER` (measured, no lost writes).
10. So what should a cache run? Compare restart empty, restart from a snapshot,
    fail over to a replica, and a larger or rebuilt cache, on the database's
    load (Figure 11). Managed services in a paragraph. A decision list.

Stop: no Redis Cluster failover (article 10), no capacity sizing or alerts
(article 11, mentioned), no metastable-failure treatment (articles 2 and 11),
no AOF file format beyond what explains rewrite, no `BACKUP` command family
beyond a sentence, no Sentinel configuration-epoch internals beyond one
paragraph. Those details would not change what a practitioner configures for a
cache.

## Figures

1. **Restarting empty** (live chart). Expected-value model of a catalogue under
   Zipf popularity with cache-aside and a TTL; database reads a second against
   an assumed capacity. Action: Restart Redis empty. Notice: the spike is
   1/(1−h) times normal load and takes minutes to fall. Illustrative.
2. **Fork and copy-on-write** (live grid). Pages shared by parent and child;
   the child writes the snapshot page by page; parent writes copy pages. Slider:
   how writes spread (a few hot pages or all over). Notice: extra memory is the
   share of pages written during the save, up to the whole dataset.
3. **A snapshot restore** (steps, measured). Deleted value comes back; expired
   value does not.
4. **Where an acknowledged write lives** (live scene). App → Redis → OS page
   cache → disk; Choice of `appendfsync`; actions Crash Redis / Cut the power.
   Notice: a process crash loses nothing that was acknowledged; power loss loses
   what was not yet fsynced.
5. **Asynchronous replication** (live scene). Primary acknowledges, stream to
   replica with a delay slider; readers on the replica; offsets and stale reads.
6. **The backlog** (no clock; sliders). A ring buffer; write rate and outage
   length; partial or full resync, and the size it would need.
7. **An acknowledged delete lost at failover** (steps, measured).
8. **A fast empty restart wipes the replica** (steps, measured), with a Choice
   for "restarts at once" against "stays down": the second path fails over.
9. **A Sentinel failover** (live scene and chart). Three Sentinels, a primary,
   two replicas, clients. Action: Kill the primary. Slider:
   down-after-milliseconds. Timings after detection from my measurement.
10. **Quorum and majority** (no clock; sliders). Number of Sentinels, quorum,
    how many are lost. Can detect? Can authorise?
11. **What each choice costs the database** (live chart). Choice: restart
    empty, restart from snapshot, fail over to a replica. Action: Lose the
    primary.

Measured numbers are labelled "observed on Redis 8.10.3 on my laptop"; model
numbers are labelled illustrative. Times in milliseconds from this laptop are
noisy (heavy machine load) and are quoted only as such.
