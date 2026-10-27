# Plan: Cache invalidation and consistency (article 5)

## The reader at the start

They have read articles 1 to 4. They write cache-aside reads, and on a write
they commit the database first and then `DEL` the key (article 2 gave three
reasons). They know the TTL bounds staleness when nothing else removes a copy
(articles 2 and 4), that a stale read is still a hit, that keys must name every
input (article 3), and that a version in the key handles deploys (article 3).
Article 2 promised them two things this article must deliver: the race that a
delete does not close, and two write-through writers landing out of order.

Their situation: the kettle's price went from £39 to £35, the code did exactly
what article 2 said, and a customer still saw £39 an hour later. They need to
know whether that is a bug in their code, how often it happens, how bad it can
get, and what to do about it, and then the wider questions: what happens when
the delete itself is lost, when one change affects many cached pages, and how
the person who made the change sees it at once.

## The questions, in order

1. **What can a cache promise at all?** A copy is behind the database from the
   commit until the delete lands. Name three promises precisely: bounded
   staleness, eventual convergence, read-your-writes (session guarantees).
   Strong consistency is not on offer from cache-aside; read the database for
   values that need it. Figure 1.
2. **How did £39 come back after a correct delete?** Race 1, stale refill:
   the reader's database read and its `SET` are two steps with a gap; the
   writer's delete lands in the gap. Measured trace. Same shape with a lagging
   read replica, where no pause is needed. Figure 2.
3. **How often does that happen, and how bad does it get?** Derivation from
   Little's law: a write can only race a fill that is in progress; share of
   time stale ≈ writes a second × mean fill time. TTL does not change the
   share; it changes how long the worst one lasts. Figure 3. Decision: which
   keys deserve more than a TTL.
4. **Can we just delete again later?** Delayed double delete: catches fills
   that land before the second delete; fill times have a tail with no upper
   bound; replica lag shifts everything right; the delay needs a durable
   queue. Facebook's two-second delete hold-off as the same idea. Figure 4.
5. **How do we close the window rather than shrink it?** Leases, from
   Facebook's memcache: a token issued on a miss that a delete cancels. Built
   in Redis 8.4+ with a placeholder value and `SET … IFEQ`, one command each
   step; Lua for older versions (article 8). The lease's second job, stopping
   herds, linked to article 6. What a lease does not fix (a lost delete).
   Figure 5.
6. **What about writes that update the cache?** Race 2: two writers' cache
   writes out of order. Versioned values with "set only if newer" (Lua; or a
   read-compare-`SET IFEQ` loop on 8.4+). The catch: a `DEL` or eviction
   forgets the newest version; tombstones carry it. Figure 6.
7. **What if the delete never happens?** The dual-write problem. Transactional
   outbox and change data capture; deletes are idempotent so at-least-once
   delivery is fine, which is a further reason to send deletes rather than
   values; Facebook's mcsqueal; Pub/Sub and keyspace notifications are not
   reliable transports. The cost: delay, which brings back question 1's window.
   Figure 7.
8. **One change, many cached results?** Fan-out: tag sets versus generation
   numbers versus keys built from the row's version (Rails). Costs: O(N)
   deletes, `DEL` versus `UNLINK` on a big set (measured), names outliving
   keys; orphaned keys left until TTL; a lost generation counter bringing old
   keys back (measured) and the fix. Figure 8.
9. **How does the person who made the change see it?** Read-your-writes: the
   writer deletes synchronously in its own path even when a stream also does;
   a short-lived recent-write marker routes that user's reads past the cache
   (Facebook's remote marker); or the client carries the version it wrote.
   Markers are correctness state: their eviction is not safe. Figure 9.
10. **What to choose.** A table of techniques: what each fixes, what it costs,
    Redis commands. Questions to decide per kind of data.
11. **What you can now decide**, and a link to article 6.

## Figures

1. **The copy is behind the database for a while** (live). One key; a
   timeline with the database's price and Redis's copy as bands over time,
   reads as marks. Slider: how long after the commit the delete arrives
   (0–3 s). Button: lose the next delete. Readouts: stale reads, longest stale
   period. Notice: staleness after each write equals the delay; a lost delete
   lasts until the copy expires, which is the TTL bound.
2. **A slow reader puts back the old price** (steps). Choice: slow reader /
   lagging replica. Notice: every actor behaves correctly; the old value ends
   up cached with a full TTL.
3. **A day of fifty keys** (no clock). Each row is one key over 24 hours; a
   mark wherever it held an old value because of race 1. Controls: writes per
   key (choice), mean fill time (slider), TTL (choice). Readouts: old values
   stored, share of time stale against the predicted w × δ, longest stale
   period. Notice: more writes or slower fills, more marks; a shorter TTL gives
   more, shorter marks for the same share.
4. **Deleting again after a delay** (no clock). Histogram of when racing
   fills store their old value, measured from the first delete; slider for the
   second delete's delay D; choice: reads from the primary / from a replica
   500 ms behind. Readouts: share caught, share missed. Notice: no D catches
   the tail; a replica moves the whole distribution right.
5. **The same race with a lease** (steps). Choice: without / with lease.
   Notice: the delete removes the reader's placeholder, so its late `SET … IFEQ`
   is refused and the next reader caches £35.
6. **Two writers out of order** (steps). Choice: plain `SET` / set only if
   newer / set only if newer after an eviction. Notice: the version check
   refuses the late write, unless the cache has forgotten the newer version.
7. **A crash between the commit and the delete** (steps). Choice: the
   application deletes / an outbox relay deletes. Notice: the outbox row
   commits with the change, so the delete happens later but always happens.
8. **One change, many cached pages** (live). Twelve cached pages of a
   category; products change; choice: tag set / generation number. Grid of
   keys in Redis; readouts: keys in Redis, unreachable keys still in memory,
   commands per change, lookups per read. Notice: tags delete exactly and pay
   per page; generations pay one command and leave old pages in memory until
   they expire.
9. **The editor sees their own change** (steps). Choice: no marker / marker.
   Lanes: Editor, Redis, Database, Invalidator. Notice: with a delayed
   invalidation the editor's reload is a stale hit; the marker sends their
   reads to the database for a few seconds.

## Measured versus illustrative

Measured on Redis 8.10.3, port 7105 (evidence/invalidation.txt): every command
trace (races, `SET … IFEQ`, leases, version script, tombstones, double delete
timing, generation counter and its loss, tag sets, `PUBLISH` with no
subscribers, markers), `DEL` against `UNLINK` on big sets, and a short real
run showing race 1 occurs with real commands. Illustrative: every number in
figures 1, 3, 4 and 8, which come from models stated in captions.

## Where to stop

- No linearizability, consensus or cross-region protocols beyond the two
  Facebook mechanisms that a single-region Redis user can copy.
- Atomic operations are used, not taught: `EVAL`, `WATCH` and functions belong
  to article 8. The rebuild lock and its waiting strategies belong to article
  6; the lease is introduced here and article 6 refers back.
- Near caches and `CLIENT TRACKING`: article 10. Replication mechanics:
  article 9. Eviction policies: article 4 (here only "eviction can remove a
  tombstone, counter or marker").
- Meta's Polaris consistency checker gets one sentence as a way of measuring
  the promise, not a section.
