# Technical review, round 1: Cache invalidation and consistency

Reviewer: independent technical review of `src/articles/caching/invalidation.astro`
and `src/components/caching/invalidation/`. Evidence: `evidence/invalidation-review-1.txt`.
I ran Redis 8.10.3 on port 7155 with a temporary directory and `--save ''`, then shut it
down. I ran the `.mjs` models in node and loaded the rendered page with Playwright on port 4465.
I read these primary sources: Nishtala et al. 2013 (full text), Meta's "Cache made consistent",
the Debezium PostgreSQL connector documentation, and the redis.io pages for SET,
replication and Pub/Sub. I also checked Terry et al. 1994 and the Rails caching guide.

## Verdict

The core of the article is sound and unusually careful. The race interleavings are correct. The
lease built from `SET … NX PX` and `SET … IFEQ` does close the slow-reader race, including when
the lease expires, when the placeholder is evicted and when a fill is retried. Every Redis 8.10.3
behaviour the article quotes reproduced. The w·δ derivation holds, and the figure numbers match the
models and the rendered readouts.

However, there are five required fixes:

- One missing failure mode undermines several "this closes it" claims: Redis failover can lose acknowledged writes.
- The tag-set recipe contains a race of its own.
- The generation-number round-trip claim is wrong.
- One piece of arithmetic is out by a factor of 30.
- One statement about the replica model contradicts the model.

**Counts: 5 required, 19 suggested.**

---

## Required

### R1. Redis failover and restarts lose acknowledged deletes, tombstones and generation increments

**Where:** "When the delete is never sent" (whole section); the table rows "Outbox or change data capture" and "Version check and tombstones"; the Figure 7 text alternative ("but it always arrives"); the closing list.

**Problem:** Every remedy treats a `DEL`, tombstone or `INCR` that Redis has acknowledged as durable. Redis replication is asynchronous. The redis.io replication page says that even with `WAIT`, "acknowledged writes can still be lost during a failover". Consider these interleavings:

- A writer's `DEL` (or the outbox relay's `DEL`) is acknowledged by the primary, and the primary fails before replicating it. The promoted replica still holds £39, and nothing will delete it again. The outbox relay has already marked the row done, so **the outbox does not catch this lost delete**. The table says the outbox fixes "Deletes lost between commit and delete", but this delete was lost after it reached Redis.
- **Lease:** the reader's `SET … NX PX` lease replicates, but the writer's `DEL` does not. After failover the slow reader's `SET … IFEQ lease:…` *succeeds* on the new primary and stores the old value. The lease is defeated.
- **Version tombstone:** the tombstone for version 8 is lost, and a late version-7 fill is then accepted. This is the eviction case, without any eviction.
- **Generation number:** the `INCR` from generation 3 to 4 is lost, but the generation-3 pages filled before it were replicated. After failover the counter reads 3 again, and the old pages "come back from the dead". This is the trap the article describes for a lost counter, reached a different way.
- **Restarts:** a restart that reloads an older RDB or AOF does the same thing.

**Correction:** Add a short paragraph, perhaps to "When the delete is never sent", and add the case to the table. Suggested content:

- Redis replicates asynchronously, so a failover can lose the most recent writes, including deletes, tombstones and generation increments, even after Redis has acknowledged them (redis.io replication docs).
- The TTL is again what bounds the damage.
- `WAIT 1 <timeout>` after an important invalidation makes the loss much less likely but does not prevent it.
- Because invalidations come from the outbox or change log, they can be replayed: after a failover, re-send the invalidations from the last few seconds or minutes of the log. This is what Facebook's "replay" of buffered deletes amounts to.
- After a failover, a generation counter should also be moved past any value it might have had, for example by setting it from the clock.

Also soften "but it always arrives" in the Figure 7 text alternative to "it arrives once the relay is running, even if the writer died".

**Evidence:** redis.io replication page (quoted in the evidence file). I did not observe a failover, because I could only use one port. This finding rests on the documented semantics.

### R2. A generation lookup cannot be "sent together with the page's key in one round trip"

**Where:** "One change, many keys", paragraph 3: "Each read also costs an extra lookup to fetch the current generation, though it can be sent together with the page's key in one round trip." The table lists `MGET` among the generation number's commands.

**Problem:** The page key is `category:7:g3:cheap:p1`, and it contains the generation's value. The client cannot name the page key until it has read the generation, so `MGET gen:category:7 <page key>` is impossible. The evidence file shows `MGET` returning only the generation.

**Correction:**

- Say the generation costs a second, dependent round trip.
- Alternatively, one short script can read the counter and then the page. The evidence shows this working with `EVAL`. In Redis Cluster, a script like that needs the page and counter in the same slot (hash tags), because it touches a key it did not declare. This also corrects "Redis Cluster adds a constraint to both".
- `MGET` is legitimately useful for fetching *several* generation counters at once, when a page depends on more than one. Say that if `MGET` stays in the table.
- A process can also cache the generation for a short time, which adds that much staleness.

### R3. The tag-set recipe loses track of pages filled between `SMEMBERS` and `UNLINK`

**Where:** "One change, many keys", the tag-set description: "To invalidate, it reads the set's members and deletes them, and the set". Also "A change is two commands", the Figure 8 text alternative, and the table row.

**Problem:** These are two separate commands. Suppose a reader fills a page and runs `SADD` between the invalidator's `SMEMBERS` and its `UNLINK … tag:product:42`. The `UNLINK` then deletes the set that held the new page's name. The page stays cached but is no longer in any tag set, so the *next* change to product 42 cannot find it, and it stays stale until its TTL expires. I reproduced this on 8.10.3: after the interleaving, `SMEMBERS` was empty and the page was still cached with `TTL 300`.

The fill has the same weakness: a reader that runs `SET` and then crashes before `SADD` leaves an untracked page.

**Correction:**

- Make the invalidation atomic. One option is a short script that reads the members, then unlinks them and the set; the evidence file shows one that unlinks in batches of 500. Another is to `RENAME` the set to a unique name first and then process the renamed set.
- On the fill side, run `SADD` *before* `SET`, or send both in one `MULTI`. A name without a page is harmless; a page without a name is not.
- One sentence is enough. Without it, the article's recipe has a race of the same kind the article teaches readers to spot.

### R4. Arithmetic: 100,000 products racing once a month is 100,000 stale prices a month, not "a few thousand"

**Where:** "How often it happens", the last paragraph: "A shop with a hundred thousand products, each racing once a month, has a few thousand stale prices a month."

**Correction:** "…has about a hundred thousand stale prices a month, a few thousand every day."

### R5. The replica claim "Almost every write now produces an old value" contradicts the model

**Where:** the paragraph after Figure 4: "Now switch to a replica 500 ms behind. Almost every write now produces an old value, because any read in the first half second reads the replica's old row."

**Problem:** The model (`double-delete-model.mjs`, `replicaRaceShare`) has reads at about two a second. The share of writes followed by a stale fill is 1 − e^(−2 × 0.5) = **63%**, not almost all. It approaches 100% only for keys read many times a second (at 20 reads a second it is 99.995%). The figure does not show this share, so the reader cannot check it.

**Correction:** "Most writes now produce an old value (about two in three in this model, where the key is read twice a second, and nearly all for a busy key), because any read in the first half second reads the replica's old row."

---

## Suggested

### Leases

**S1. Compare the lease with Nishtala et al. explicitly; the article is accurate but silent on three differences that matter to a practitioner.** Checked against the paper (§3.2.1):

- The 64-bit token, invalidation by delete, the load-link/store-conditional comparison, one token per key every 10 seconds, the "wait a short time" notification, and "17K/s to 1.3K/s" over one week for "a set of keys particularly susceptible to thundering herds" are all correct. So is the thundering-herd definition ("heavy read and write activity").

The differences are:

1. In memcache the token comes back *with the miss*, in one round trip. The Redis version takes two (`GET`, then `SET … NX`). Redis 7.0+ can do it in one: `SET product:42 lease:… NX GET PX 10000` returns nil when this reader took the lease, and the existing value otherwise. I verified this on 8.10.3. The cost is that every read becomes a write command (`denyoom`), so it errors under `noeviction` at `maxmemory` and cannot run on read-only replicas. It is worth one sentence, or worth naming as the reason the article uses two commands.
2. Memcache keeps a just-deleted value briefly and can return it marked stale to readers that do not hold the lease. The Redis version has nothing equivalent. Say so in one line, and point to Stampedes.
3. Memcache's lease state lives outside the value. Here it occupies the key, so *any* overwrite or eviction cancels it. Both are safe outcomes, and the article could say so.

**S2. "Take the lease before the database read" needs one more condition.** The read must also *start* after the lease: it must not run in a transaction or MVCC snapshot opened earlier in the request, for example a request-wide REPEATABLE READ transaction. Otherwise the read can return data older than the lease, and the ordering argument fails. One clause fixes this.

**S3. Retries and a crashed lease holder.** If the response to the lease `SET … NX` is lost and the client library retries, the retry returns nil. The reader then concludes that "another reader is filling", goes to the database, and leaves its own placeholder blocking the key for the full `PX 10000`. A crashed holder has the same effect. In the code shown, every reader goes to the database for those 10 seconds. That is correct but can be a lot of load on a hot key. Add one sentence on choosing the lease expiry: slightly above a normal fill, not 10× it.

**S4. `KEEPTTL` is the wrong choice inside the lease.** "Always pass `EX` or `KEEPTTL`" is right in general. In the lease, however, `KEEPTTL` keeps the *lease's* 10-second expiry: on 8.10.3, `SET k val IFEQ lease:b KEEPTTL` left `PTTL 9975`. Say "pass `EX` (with a lease, `KEEPTTL` would keep the lease's short expiry)".

**S5. Valkey and managed services.** `IFEQ` is named as Redis 8.4+, which is correct (redis.io: since 8.4.0). Readers on Valkey or on a managed service pinned to Redis OSS 7.x need to know whether they have it. Valkey 8.1 added `SET … IFEQ`. I did not confirm when Valkey added a compare-and-delete equivalent of `DELEX` (`DELIFEQ`). A parenthesis is enough, and the Lua fallback already covers older servers. This fits the brief's rule to note Valkey where it affects a decision.

### Versions and tombstones

**S6. Version tombstones also close the lagging-replica race; the article says only leases fail there.** Take a writer that commits version 12 and writes a version-12 tombstone. A reader then misses and reads version 11 from a lagging replica, and its fill is refused while the tombstone lives. This is verified in the evidence file, §R4. This is an important asymmetry with leases. Add it in three places:

- the version section;
- the table's "What it fixes" cell ("…and fills from a lagging replica, while the tombstone lives");
- the "Do reads go to replicas?" question, as a third option alongside "keep fills on the primary" and "invalidate after the replica has the change".

**S7. The `IFEQ` retry loop needs a branch for a missing key.** "Read the current value, compare, write only if unchanged" cannot write a missing key, because `IFEQ` never creates one (documented and observed). When `GET` returns nil, the writer must use `SET … NX` and retry if that fails. Say so. Otherwise a reader who copies the loop will never populate an empty key.

**S8. Version numbers above 2^53 in Lua.** `tonumber` in Redis Lua produces a double. On 8.10.3 the script refused version 9007199254740993 after 9007199254740992. Database-assigned row versions will never get that large. A raw 64-bit log position or a snowflake-style ID can, so add one clause: "compare as strings of equal length, or keep versions below 2^53".

**S9. Rails' `updated_at` is an application timestamp.** The article warns that "A timestamp taken by the application is weaker", then presents Rails, whose cache version comes from `updated_at`, which Rails sets from the application server's clock. Two updates within the timestamp's precision produce the same version. On a MySQL `DATETIME` column without fractional seconds, that is the same second. Add a sentence so the two passages do not appear to conflict.

### Lost deletes and change data capture

**S10. A Redis stream is only a durable log if it lives somewhere durable.** "…or a Redis stream, keeps messages until they are processed" has two problems:

- A stream in the *cache* instance can be evicted under `allkeys-*` policies, and can be lost on failover (R1).
- A stream keeps entries until they are trimmed, not "until processed"; consumer groups track what is pending.

Suggest: "a Redis stream on an instance with persistence and `noeviction`, not on the cache itself".

**S11. The Debezium and mcsqueal claims are correct.** These were checked and need no change:

- Debezium's docs say that during recovery from a fault "Debezium, like Kafka, provides at least once delivery of change events". They also say the LSN can be used to detect duplicates. This is a useful pointer for anyone sending values rather than deletes.
- Facebook's mcsqueal, the "only 4%" figure and the "replay invalidations that may have been lost or misrouted" claim match §4.1.
- "Invalidate after the replica has the change, which is what Facebook's daemons achieve": §5 says the same pipeline "is also deployed with the replica databases", which supports it.

One addition would help: if readers use *several* replicas, the invalidation has to follow the slowest one.

### Fan-out

**S12. A generation number is naturally immune to the stale-fill race.** This holds when readers fetch the generation *before* the database read and invalidation increments it *after* the commit. A fill that read old data necessarily read the old generation first, so it lands on an unreachable key. This is a real advantage over tags and plain deletes, and it costs one sentence. It does not hold if the process caches the generation.

**S13. The counter restart uses the application's clock.** "Start a missing counter from … the current time in milliseconds" depends on the application server's clock. A server whose clock is behind another's can pick a value inside a range a faster server already used. The collision is unlikely, but it is avoidable: take the time from Redis (`TIME` inside the same script), or derive the counter from the database.

**S14. Give the tag set a TTL at least as long as its pages'.** "Unless the set gets its own TTL, renewed with each `SADD`" is right but incomplete. If the set's TTL is shorter than a page's remaining TTL, the set can expire while that page lives, and the page becomes untracked (the same effect as R3). Suggest "renew it to at least the page TTL on each `SADD` (`EXPIRE … GT` does this)".

**S15. Figure 8's "two or three times as many page keys".** In the model, sampled each second for 600 s, the median ratio of keys held to keys reachable is about 3.6 (p10 2.4, p90 9). "About three or four times" would match better.

**S16. `DEL` timings.** My server-side `SLOWLOG` timings on the same build were:

| Set size | `DEL` | `UNLINK` |
|---|---|---|
| 100,000 names | 4.9–6.3 ms | up to 0.26 ms |
| 1,000,000 names | 164–339 ms | about 10 µs |

The article says "about 40 to 70 ms" for a million names. The direction and the advice are right, but the magnitude varies a lot with machine, allocator and name length. Suggest "tens to hundreds of milliseconds" and keep the one-laptop caveat.

### Read-your-writes

**S17. Facebook's remote marker is per key, not per user.** The paper's marker r_k is set for the key being written, in a regional pool. Any reader in that region that misses on k is sent to the master region. "Facebook uses the same idea" is fair for the mechanism, but it should say the marker is per key and affects everyone's reads of that key. The point about eviction is correct: §5 says "deleting or evicting keys is always a safe action … In contrast, the presence of a remote marker" matters. So is "trade additional latency … for a decreased probability of reading stale data".

### The model and smaller points

**S18. Counts and shares diverge for hot keys.** The derivation's "races happen about w × wδ times a second" assumes one fill per absence. With no coalescing and many reads, several fills are in progress at once. At 200 reads a second the model stores 284 old values a day instead of 73, while the stale share stays at 0.083%. With a 1-minute TTL, the share rises to 0.119% against 0.083% predicted. The share formula is the robust one, so say "share" when giving advice. Optionally note that a hot key's race *count* is higher.

**S19. Small consistency points.**

- Figure 3's text alternative says writing every 10 minutes "leaves a handful of races", while the prose and the model say exactly 1. Pick one.
- The `SET … tombstone PX 2000` hold-off sends every read of the key to the database for 2 seconds after each write. Say so in the paragraph or the table, as Facebook's paper did: it used the hold-off only while warming a cold cluster.
- "A few milliseconds behind … sometimes seconds" for replica lag is unsourced; the writer flagged this. Either cite a database's lag metric documentation or say "often milliseconds, and seconds under load".

---

## Checked and correct (no change needed)

- **Redis 8.10.3 behaviour, all reproduced:**
  - `SET … IFEQ`: drops the TTL when no expiry is given; does not create a missing key; `WRONGTYPE` on a hash; `NX` with `IFEQ` is a syntax error; accepts `EX` after `IFEQ`.
  - `DELEX … IFEQ` returns 1 then 0. With a condition it errors on non-string keys.
  - The version script: refuses the stale version and the duplicate; accepts a same-version fill over a tombstone; accepts the old version after `DEL`.
  - `SET … NX` against a tombstone; `PUBLISH` with no subscriber returns 0; `notify-keyspace-events` is empty by default; `lazyfree-lazy-user-del no`, so `DEL` is synchronous.
- **The race interleavings in Figures 2, 5, 6, 7 and 9,** and the three conditions for the lease. Lease expiry and lease eviction both fail safe: `IFEQ` on a missing key or another token returns nil. Retrying a fill or a delete is harmless.
- **The w·δ derivation.** The exact form is δ(w + 1/T)(1 − e^(−wT)), which is within a factor of about 1.3 of wδ across all values of wT. The figure reproduces it:

  | Setting | Simulated share | Prediction |
  |---|---|---|
  | Defaults | 0.077% | 0.083% |
  | Writes every 6 s | 0.745% (82× the races) | |
  | Fill time 200 ms | 0.324% | |
  | 1-minute TTL | 0.077% (104 races) | |
  | 1-hour TTL | 0.077% (73 races) | |

  Rendered readouts match the prose: 73 races, 0.077%, 2.9 minutes.
- **The double-delete percentages** (40/59/82% for the primary; 20/95% for the replica) match the model and the page. The conclusion that slow fills dominate rests on the assumed 2% pause tail. The prose says "in this model", which is honest.
- **The Facebook quotations:** leases, the hold-off (§4.3, "two second hold-off", add rejected), own-cluster invalidation "for read-after-write semantics for a single user request", markers.
- **Meta's 2022 figures:** "99.99999999 percent of cache writes are consistent within five minutes"; eviction loses knowledge of the newer version.
- **Other sources:** Terry et al. 1994 (four session guarantees, including Read Your Writes); Pub/Sub at-most-once; Rails `cache_key_with_version`, the version stored in the entry, and `touch: true`.
- **The rendered page** loads all nine figures with no page errors.
