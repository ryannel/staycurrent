# Research dossier B: article 4, `expiration-and-eviction`

Scope: coverage-map entry 4 (Cache expiration and eviction). Prepared 2026-10-27 for article writers.
Server used for observations: Redis 8.10.3 (`redis-server v=8.10.3 malloc=libc`, macOS, arm64), started only on
port 7202 with a temporary directory, `--save ''`, `--appendonly no` and `--enable-debug-command yes` (the last only for
`DEBUG SET-ACTIVE-EXPIRE`). Raw commands and output: `docs/article-work/caching-2026-10-27/evidence/research-B.txt`
(experiment labels E1 to E16 below point into that file).

How to read the tags on each fact:

- **[SRC]** read in a primary source (URL given). **[OBS]** observed on the 8.10.3 server (experiment label given).
- **[DER]** derived arithmetic or closed form, checked by a small simulation where stated (experiment label M1 to M5 in the evidence file).
- **UNCONFIRMED** could not be confirmed from a primary source.
- Source paths of the form `src/x.c@8.10.3` mean https://github.com/redis/redis/blob/8.10.3/src/x.c (the tag for the installed version).

Read these four warnings before using the facts.

1. **This macOS build uses libc malloc, not jemalloc.** Per-key byte counts below (159 to 190 bytes) are for this build and
   for the stated key and value sizes. Say "about 160 bytes of overhead plus data in a small test on libc malloc", never "Redis
   uses 160 bytes per key". Fragmentation and RSS figures were not collected and must not be presented as typical of Linux.
2. **Another client interfered with port 7202.** During the first attempt at E6c (decay disabled), something other than my
   scripts flushed the dataset and reset stats (`FLUSHALL` calls went from 1 to 5 with no matching command from me). I
   re-ran E6c with polling and every figure quoted below came from an uninterrupted run. If a writer re-runs anything on a
   shared machine, check `INFO commandstats` for foreign `flushall`/`config|resetstat`.
3. **The redis.io latency page is out of date about active expiry.** It describes 20 random keys per loop and a 25% repeat
   threshold. The source since 6.0.0 uses a 10% threshold scaled by `active-expire-effort`, walks hash-table buckets instead of
   picking independent random keys, and the 8.x code scans with a cursor. See B2.5. Do not copy the page's numbers.
4. **The antirez 2016 LFU post is out of date about decay.** It says high counters are halved. The current code subtracts one per
   elapsed decay period (B7.6), and E6b observed 100 to 99 to 98 to 97 over three minutes.

---

## 0. Version table (when each thing arrived)

Use this when a sentence must name a version. Sources are per row.

| Feature | Redis version | Source |
| --- | --- | --- |
| `SET ... EX/PX/NX/XX` | 2.6.12 | https://redis.io/docs/latest/commands/set/ (history block) |
| `TTL`/`PTTL` return `-2` for a missing key | 2.8.0 | https://redis.io/docs/latest/commands/ttl/ |
| Expire accuracy 0 to 1 ms (was 0 to 1 s in 2.4) | 2.6 | https://redis.io/docs/latest/commands/expire/ ("Expire accuracy") |
| Eviction pool for approximated LRU | 3.0 | https://redis.io/docs/latest/develop/reference/eviction/ ("From Redis 3.0 onwards ... pool") |
| LFU policies, `OBJECT FREQ`, `UNLINK`, lazy freeing | 4.0 | https://redis.io/docs/latest/develop/reference/eviction/ ; https://redis.io/docs/latest/commands/object-freq/ ("since 4.0.0") |
| `replica-ignore-maxmemory yes` | 5.0 | `redis.conf@5.0.0` contains it; absent in 4.0.0 |
| `SET ... KEEPTTL` | 6.0.0 | https://redis.io/docs/latest/commands/set/ |
| `active-expire-effort`, 10% stale threshold, bucket-walking active cycle | 6.0.0 | `src/expire.c@6.0.0` and `redis.conf@6.0.0`; 5.0.0 had a 25% threshold and `dictGetRandomKey` |
| `GETEX`, `SET ... EXAT/PXAT/GET` | 6.2.0 | https://redis.io/docs/latest/commands/set/ ; https://redis.io/docs/latest/commands/getex/ |
| `maxmemory-eviction-tenacity` | 6.2.0 | `redis.conf@6.2.0` has it; absent in 6.0.0 |
| `EXPIRE ... NX/XX/GT/LT`, `EXPIRETIME`, `evicted_clients` | 7.0.0 | https://redis.io/docs/latest/commands/expire/ ; https://redis.io/docs/latest/commands/info/ |
| Hash-field expiry: `HEXPIRE`, `HPEXPIRE`, `HTTL`, `HPERSIST` | 7.4.0 | https://redis.io/docs/latest/commands/hexpire/ |
| `evicted_scripts` in `INFO` | 7.4.0 | https://redis.io/docs/latest/commands/info/ |
| `HGETEX`, `HSETEX`, `HGETDEL` | 8.0.0 | https://github.com/redis/redis/releases/tag/8.0.0 |
| `MSETEX` (set several keys and expiry atomically) | 8.4.0 | https://github.com/redis/redis/releases/tag/8.4.0 |
| `volatile-lrm`, `allkeys-lrm` (least recently modified) | 8.6.0 | https://redis.io/docs/latest/develop/reference/eviction/ ; https://github.com/redis/redis/releases/tag/8.6.0 |
| `expired_keys_active` line in `INFO stats` | present in 8.6.0 source, absent in 8.4.0 | `src/server.c` at those tags; not in the redis.io INFO page (UNCONFIRMED in docs) |
| Valkey 8.0 | lazy-free settings default to `yes` | `valkey.conf@8.0.0` (B11.2) |

---

## 1. TTL as a staleness bound; choosing a TTL

**B1.1 [SRC]** A key's time to live is stored as an absolute Unix timestamp (milliseconds since 2.6), so time passes while the
instance is down; loading an old RDB file whose clock differs a lot can expire everything on load.
https://redis.io/docs/latest/commands/expire/ ("Expires and persistence").

**B1.2 [SRC]** A key with an expire is called *volatile* in Redis terminology; giving a key an expire costs extra memory.
https://redis.io/docs/latest/commands/expire/ ; https://redis.io/docs/latest/develop/reference/eviction/ (last paragraph of "Eviction policies").

**B1.3 [SRC]** Expiry accuracy: 0 to 1 ms since 2.6. The same page also says the key is deleted "after this many seconds", but
the deletion itself may be later (B2.1). A TTL bounds how long a copy is *valid*, not when it is *removed*.
https://redis.io/docs/latest/commands/expire/ ("Expire accuracy").

**B1.4 [OBS]** Remaining TTL is reported as `TTL` (seconds, rounded) or `PTTL` (ms): after `SET a hello EX 100`, `TTL a` gave 100
and `PTTL a` gave 99984. `EXPIRETIME a` returned an absolute Unix time in seconds (1793133461). A missing key gives `-2`, a key
with no expiry gives `-1` (E3). Source: https://redis.io/docs/latest/commands/ttl/ for the return codes.

**B1.5 [DER, M1]** Model for choosing a TTL. One key, requests arriving as a Poisson stream at `r` per second, each miss
refills the cache for `T` seconds. Each cycle is one miss followed by about `rT` hits, so
`hit ratio = rT / (1 + rT)` and `database reads per second = 1 / (T + 1/r)`. Checked by simulation to three decimal places in
six parameter sets (M1), for example `r = 1/s, T = 60 s` gives 0.9836 (formula and simulation agree) and `r = 1/min, T = 60 s`
gives 0.50. Consequence worth showing: a key requested less often than once per TTL gets a hit ratio under 50% whatever you do.

**B1.6 [DER, M1]** Model for the staleness a TTL permits. If the underlying value changes as a Poisson process at rate `λ`
and nothing invalidates the cache, a hit at age `a` is stale with probability `1 - e^(-λa)`. Averaged over a cached life of
length `T` (hits spread evenly), the fraction of hits that are stale is `1 - (1 - e^(-λT)) / (λT)`. Examples checked by simulation:
`λ = 1/hour`: `T = 60 s` gives 0.8%, `T = 300 s` gives 4.1%, `T = 3600 s` gives 36.8% (simulated 36.3%). `λ = 1/10 min`, `T = 30 s`
gives 2.5%. Maximum staleness is exactly `T` (only if the fill read fresh data; see article 5 for fills that race). The
fraction grows roughly as `λT/2` while `λT` is small, so halving the TTL roughly halves staleness and costs hit ratio only
through B1.5. This is an *illustrative model*, not Redis behaviour.

**B1.7 [DER]** Backend load per key under a TTL is `1/(T + 1/r)`; for a fleet of `K` keys with the same popularity it is `K` times that.
Doubling `T` at `rT = 60` changes database reads per second by about 2% but doubles worst-case staleness. At `rT = 1` it changes
reads by about 33%. This is the arithmetic behind "TTL matters for cold keys and barely matters for hot keys".

**B1.8 [SRC]** Facebook's memcache paper (Nishtala et al., NSDI 2013, section 6.3, "Transient Item Cache"): memcached
expires lazily, so short-lived keys that see one burst waste memory until they reach the end of the LRU. Facebook added a
structure that proactively evicts short-lived keys when they expire; for one heavily used key family the share of the pool
fell from 6% to 0.3% "without affecting the hit rate". This motivates Redis's active expiry cycle and the point that short
TTLs on many keys are a memory tool as well as a freshness tool.
https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf

**B1.9 [SRC]** The AWS Builders' Library article on caching says TTLs should reflect how stale data a client can tolerate and
how fast the source changes, describes soft TTL (triggers a refresh) versus hard TTL (limit on serving existing data when the
downstream is down), and tells readers to choose cache size and expiry deliberately and validate with metrics. It does *not*
mention jitter. https://builder.aws.com/content/3K9TeXp6strMiJ4vhakpRD7BQWO/caching-challenges-and-strategies
(soft/hard expiry belongs to article 6).

---

## 2. How Redis expires keys

**B2.1 [SRC]** Two mechanisms. Passive: a key found expired when a command touches it is deleted. Active: a background cycle
tests keys that have an expire and deletes the expired ones, so keys never accessed again are still reclaimed.
https://redis.io/docs/latest/commands/expire/ ("How Redis expires keys").

**B2.2 [OBS, E1a, E1b, E1c]** Passive expiry observed with the background cycle switched off
(`DEBUG SET-ACTIVE-EXPIRE 0`, a debugging command; disabled by default): 10,000 keys with `PX 500`; 1.5 s later `DBSIZE` was
still 10000, `INFO keyspace` still said `keys=10000,expires=10000`, `expired_keys` was 0 and `used_memory` had not
dropped (3,117,616 before, 2,985,392 after; the small fall is client buffers, not keys). `GET` on two expired keys returned
nil and each deleted its key (`expired_keys:5` after five touches: `GET`, `GET`, `EXISTS` with three keys). `SCAN 0 COUNT 20` deleted
about 20 expired keys as it passed over them (`DBSIZE` 9995 to 9975). `RANDOMKEY` deleted *all* remaining expired keys
(1000 in E1b) before returning nil. So: logically expired keys are invisible to reads, but they still hold memory until a
touch or the active cycle removes them.

**B2.3 [OBS, E1c]** With the background cycle on (default), 1000 keys expiring after 300 ms were all gone 1.5 s later with no
client touching them: `expired_keys:1000`, `expired_keys_active:1000`, `expired_stale_perc:5.84`.

**B2.4 [SRC]** The cycle runs from the 10 Hz server cron (`hz 10`, range 1 to 500 in the config; `dynamic-hz yes` raises the
actual rate when many clients are connected) as a "slow" cycle, and a short "fast" cycle runs before the event loop sleeps
when the previous slow cycle ran out of time or the stale estimate is above the threshold.
`src/expire.c@8.10.3`, comment above `ACTIVE_EXPIRE_CYCLE_KEYS_PER_LOOP`; `redis.conf@8.10.3` ("hz"). The constants:
20 keys per loop per database, slow cycle limited to 25% of CPU time (25 ms of each 100 ms at `hz 10`), fast cycle at most
1000 microseconds and not repeated within twice that, repeat a database's loop while more than 10% of sampled keys were
expired.

**B2.5 [SRC]** What changed since the redis.io latency page was written. `src/expire.c@5.0.0` repeats while more than 25% of
20 randomly picked keys were expired (`dictGetRandomKey`). `src/expire.c@6.0.0` and later: threshold
`ACTIVE_EXPIRE_CYCLE_ACCEPTABLE_STALE = 10` minus the configured effort, work done by walking hash-table buckets
(`kvstoreScan` with a persistent cursor `expires_cursor` in 8.10.3), sampling stops when `max_buckets = 20 x keys-per-loop` have
been checked, and per-database running estimate `stat_expired_stale_perc` (5% new, 95% old). So "tests a few keys at random"
(the redis.io EXPIRE page) is a simplification; writers should say "samples keys with an expire, a few at a time, and keeps going
while more than about a tenth of the sample was expired". Pages: https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/
(out of date, 25%); `redis.conf@8.10.3` section on `active-expire-effort`: "will try to avoid having more than ten percent
of expired keys still in memory, and will try to avoid consuming more than 25% of total memory" (the conf text says "25% of total
memory"; the code limits *CPU time*, so treat that conf sentence as loosely worded).

**B2.6 [SRC]** `active-expire-effort` ranges 1 to 10 (`src/config.c@8.10.3`), default 1. Effort adds to keys per loop
(+5 each step), fast-cycle duration (+250 microseconds each), slow-cycle CPU share (+2 percentage points each) and lowers the
tolerated stale percentage (-1 point each): effort 10 means 65 keys per loop, a 3.25 ms fast cycle, up to 43% CPU in the slow cycle, 1% tolerated stale.
`src/expire.c@8.10.3`, start of `activeExpireCycle`. Config text: "It's a tradeoff between memory, CPU and latency."

**B2.7 [OBS, E2]** Cost of a synchronised expiry. 1,000,000 keys with 100-byte values were written with `SET ... PXAT <same ms>`
(189 MB `used_memory`, `INFO keyspace`: `keys=1000000,expires=1000000`). At the expiry instant the dataset drained in about 2.5 s
(`DBSIZE` 893,328 at t=12.56 s, 628,283 at 13.06, 377,954 at 13.57, 110,700 at 14.07, 0 at 14.57). A `PING` loop on a second
connection saw a maximum latency of 24 to 28 ms in *every* half-second sample during the drain (baseline before: 0.2 to 0.3 ms).
That matches the 25 ms slice of each 100 ms slow cycle (B2.4). Final counters: `expired_keys:1000000`,
`expired_keys_active:1000000`, `expired_time_cap_reached_count:436`, `expire_cycle_cpu_milliseconds:912`.
Caveat: this laptop also showed unrelated 5 to 36 ms outliers in idle samples, so the claim is "a steady 24 to 28 ms plateau
for 2.5 s", not any single value.

**B2.8 [OBS, E2b]** Same 1,000,000 keys but with expiry times spread evenly over 30 s: `DBSIZE` fell steadily over about 30 s
and the drain-time `PING` maxima were 1 to 12 ms (no 25 ms plateau); `expired_time_cap_reached_count` was 504 and
`expire_cycle_cpu_milliseconds` 2485 (cumulative CPU was *higher*, because the cycle ran at every 100 ms instead of in one
burst). Message for writers: jitter does not make expiry cheaper in total, it removes the pause that clients see.

**B2.9 [SRC]** Until the active cycle reaches a key, expired-not-yet-deleted keys still count in `used_memory` and in
`DBSIZE`; `INFO stats` field `expired_stale_perc` is "the percentage of keys probably expired" and
`expired_time_cap_reached_count` is "the count of times that active expiry cycles have stopped early";
`expire_cycle_cpu_milliseconds` is cumulative time in active expiry cycles. https://redis.io/docs/latest/commands/info/ (Stats).

**B2.10 [OBS, E8]** Memory cost of giving a key a TTL on this libc-malloc build: 100,000 keys named `k:N` with 100-byte values
used 159.5 bytes per key (`used_memory` delta over 100,000 keys: 17,062,880 - 1,110,288) without a TTL and 190.4 bytes per
key with `PX 3600000` (20,199,888 - 1,159,856), about 31 bytes more. `MEMORY USAGE k:5` said 134 and 142 bytes (it does not count
everything). Illustrative of "a TTL costs a few tens of bytes per key", not a constant.

**B2.11 [SRC]** Command facts for the page (all complexity O(1) unless stated): `EXPIRE key seconds [NX|XX|GT|LT]` (options 7.0.0, mutually exclusive;
`GT`/`LT` treat a key with no expiry as infinite TTL); `PEXPIRE`, `EXPIREAT`, `PEXPIREAT`; `PERSIST` (2.2.0); `TTL`, `PTTL`;
`EXPIRETIME`/`PEXPIRETIME` (7.0.0). https://redis.io/docs/latest/commands/expire/ and sibling pages.
`SET key value [NX|XX] [GET] [EX|PX|EXAT|PXAT|KEEPTTL]` (versions in section 0). `GETEX key [EX|PX|EXAT|PXAT|PERSIST]` (6.2.0, O(1)).

**B2.12 [OBS, E3]** Which commands clear or keep a TTL (8.10.3):

| Command on a key that has a TTL | Result for TTL |
| --- | --- |
| plain `SET k v` | cleared (`TTL` returns `-1`) |
| `SET k v KEEPTTL` | kept (100 stayed 100) |
| `INCR` (valid integer), `APPEND` | kept |
| `GETSET` | cleared |
| `PERSIST` | cleared; returns 1, then 0 if already persistent |
| `RENAME a b` | the TTL moves to `b` |
| `RENAME g e` onto an existing key with a TTL | the TTL of the *source* wins (`e` ended with `-1`) |
| `EXPIRE b -1` or `EXPIREAT` in the past | key deleted at once, returns 1 |
| `SET c 1 EX 0` / `PX 0` / huge `EX` | error `invalid expire time in 'set' command` |
| `SET k v NX EX 30` when the key exists | returns nil, TTL of the existing key untouched |
| `SET i 2 EX 50 GET` | returns old value; new TTL applies |
| `GETEX h EX 500`, `GETEX h PERSIST` | reads and changes TTL in one command |
| `EXPIRE a 100 NX XX` | error: "NX and XX, GT or LT options at the same time are not compatible" |

`EXPIRE` with `NX`/`XX`/`GT`/`LT`: on a key without TTL, `XX` and `GT` return 0, `NX` and `LT` set it (E3). Source for the semantics:
https://redis.io/docs/latest/commands/expire/ ("The timeout will only be cleared by commands that delete or overwrite the contents").
Pitfall to name: a read-modify-write refresh with plain `SET` silently makes a cached key immortal; use `SET ... EX` again or `KEEPTTL` on purpose.

**B2.13 [SRC]** Bug history that supports the pitfall above: Redis 8.2.0 fixed "TTL was not removed by the `SET` command"
(an optimisation path ignored the TTL); behaviour in 8.10.3 is correct (E3). https://github.com/redis/redis/releases/tag/8.2.0 and https://github.com/redis/redis/issues/14216.

**B2.14 [SRC]** Time inside scripts and transactions is frozen: no keys expire while a script runs, so each key either exists or not
for the whole script. https://redis.io/docs/latest/operate/oss_and_stack/management/replication/ (expiry techniques, item 3); the 8.10.3 code uses one
`commandTimeSnapshot()` per command in `keyIsExpired` (`src/db.c@8.10.3`).

**B2.15 [SRC]** Keyspace notifications: `expired` events are produced when Redis *deletes* the key (on access or from the active
cycle), not when the TTL reaches zero, so "there can be a significant delay"; `evicted` events are produced on `maxmemory` eviction.
Do not build exact-time logic on them. https://redis.io/docs/latest/develop/pubsub/keyspace-notifications/ ("Timing of expired events").

**B2.16 [SRC]** Lazy freeing: `lazyfree-lazy-expire` (default `no` in 8.10.3: `CONFIG GET` returned `no`, E-config) makes the expired-key delete
asynchronous, like `UNLINK`; `lazyfree-lazy-eviction` (default `no`) does the same for eviction. With the default, deleting a key
with a huge value blocks the main thread. Cache keys are usually small, so mainly relevant to big values. Same file notes Valkey 8
flips these to `yes` (B11.2). `redis.conf@8.10.3` ("LAZY FREEING"); `src/config.c@8.10.3` defaults.

**B2.17 [SRC]** Hash-field expiry (7.4.0+): `HEXPIRE key seconds [NX|XX|GT|LT] FIELDS n field...`, `HPEXPIRE`, `HTTL`, `HPERSIST`,
and in 8.0.0 `HGETEX`/`HSETEX`. Complexity O(N) in the number of fields named. Fields are removed when their TTL ends; cleared only
by deleting or overwriting the field (`HDEL`, `HSET`). https://redis.io/docs/latest/commands/hexpire/ , https://redis.io/docs/latest/commands/hgetex/ .
(Owned by article 3; only the interaction with eviction matters here.)

**B2.18 [OBS, E9]** Field expiry behaves as documented: `HEXPIRE h 100 FIELDS 1 f1` returned 1; `HTTL h FIELDS 2 f1 f2` returned
100 and -1; `TTL h` returned -1 (the *key* has no TTL); `INFO keyspace` showed `keys=1,expires=0,avg_ttl=0,subexpiry=1`. After a
field's 1 s TTL, `HGETALL` showed only the other field, `expired_subkeys:1`, `expired_subkeys_active:1`, `expired_keys:0`. When
the last field expired the whole key vanished (`EXISTS h` gave 0).

**B2.19 [OBS, E2c]** `active-expire-effort` 10 versus 1 on 500,000 keys with one expiry instant (one run each): both drained in about one second;
`PING` maxima during the drain were 26 ms at effort 1 and 33 to 48 ms at effort 10; `expired_time_cap_reached_count` 142 versus 40; cumulative
`expire_cycle_cpu_milliseconds` 300 versus 292. So a higher effort does not remove the pause for a burst; it mainly lowers the amount of expired data tolerated at steady
state (B2.6). One run each, and this laptop is noisy.

**B2.20 [OBS, E12]** Memory held by expired keys. 200,000 keys (100-byte values, `PX 500`) with the background cycle off: 2 s after they expired,
`DBSIZE` was 200000 and `used_memory` was 39,137,568 bytes (empty server: 939,840). `GET` and `EXISTS` on expired keys returned nil / 0 but
freed only those keys. After `DEBUG SET-ACTIVE-EXPIRE 1`, 3 s later `DBSIZE` was 0 and `used_memory` 1,112,880; `expired_keys:200000`, `expired_keys_active:199998`.
With the cycle on (the default) this lag is normally a small fraction of a second to a few seconds, bounded by the stale threshold (B2.4, B2.5).

**B2.21 [OBS, E13]** Expiry precision: three trials of `SET p 1 PX 200` read in a tight loop: last hit at 200.7, 200.1 and 200.2 ms and first miss at 200.9, 201.9 and 200.4 ms after the
`SET` was sent (client-side clock, including network): consistent with the documented 0 to 1 ms accuracy (B1.3).

---

## 3. Expiry jitter

**B3.1 [DER, M2]** If `N` keys are filled together with the same TTL `T`, all expire together. With the TTL drawn uniformly from
`T(1 ± j)` the expiries spread over `2jT`, and the refresh rate during that window is about `N / (2jT)`. Examples: 10,000 keys,
`T = 600 s`: no jitter gives a burst of 10,000 refreshes at once; `±10%` spreads them over 120 s at about 83 per second;
`±20%` over 240 s at about 42 per second. The long-run average rate `N/T` is 16.7 per second for those 10,000 keys, so even
±10% leaves a spike five times the average that fades after one cycle. 1,000,000 keys at `T = 3600 s`, ±10%: about 1,389 per
second against 278 per second average. Derivation is three lines (spread window, count divided by window).

**B3.2 [OBS]** Server-side cost of the burst is measured in B2.7 and B2.8: 1,000,000 simultaneous expiries cost a 2.5 s run of
24 to 28 ms stalls inside Redis, before the application sees a single database stampede.

**B3.3 UNCONFIRMED** I found no primary source (paper or vendor documentation) that names "TTL jitter" as a practice. The AWS
Builders' Library caching article was checked and does not mention it (B1.9). Present it as a derived technique, not as an
established quotation. Stampede protection itself (article 6) has primary sources: Vattani, Chierichetti, Lowenstein 2015.

---

## 4. Memory limits: `maxmemory` and `noeviction`

**B4.1 [SRC]** `maxmemory` default 0 (no limit) on 64-bit; 32-bit builds have an implicit 3 GB limit. Set in `redis.conf` or at
runtime with `CONFIG SET maxmemory 100mb`. Default policy `noeviction` (`CONFIG GET maxmemory-policy` returned `noeviction`, E-config).
https://redis.io/docs/latest/develop/reference/eviction/ ; `src/config.c@8.10.3`.
**This default means a fresh Redis used as a cache fills up and then refuses writes.** That is the single most useful
"surprise" for this article.

**B4.2 [SRC]** When is memory checked: before every command that Redis processes when `maxmemory` is set (`processCommand` calls
`performEvictions()`; a command flagged as using memory is rejected if eviction could not get under the limit). Reads and
`DEL` still run. `src/server.c@8.10.3` near line 4656. Eviction is therefore driven by *any* traffic, not just writes (E4b observed
eviction counts still rising across `DBSIZE` and `INFO` calls).

**B4.3 [SRC]** The memory compared with `maxmemory` is `used_memory` minus replica output buffers, the replication backlog and
the AOF buffer (these are "not counted"). Reason in the source: otherwise eviction `DEL`s would grow those buffers and trigger
more eviction in a feedback loop. `INFO memory` shows the uncounted amount as `mem_not_counted_for_evict`. Advice from the docs:
leave some RAM free if replicas or AOF are used. `src/evict.c@8.10.3` `freeMemoryGetNotCountedMemory`;
https://redis.io/docs/latest/develop/reference/eviction/ ("Setting maxmemory for a replicated or persisted instance").

**B4.4 [OBS, E4a]** `noeviction` with `maxmemory 20mb`: loading 200,000 keys (100-byte values) stored 126,439 and rejected 73,561
`SET`s with `OOM command not allowed when used memory > 'maxmemory'.`; `used_memory` ended at 21,036,416 (about 64 KB over the limit).
`GET` and `DEL` still worked; `EXPIRE` on an existing key worked; `SETEX`, `INCR` on a new key, `APPEND` and a script that calls `SET`
were all rejected (the script error read `OOM command not allowed ... script: ...`). `INFO commandstats` shows
`cmdstat_set:...rejected_calls=73563` and `INFO errorstats` shows `errorstat_OOM:count=73563`. `evicted_keys:0`.
The conf file says the same: commands "that would use more memory, like SET, LPUSH" error while read-only commands continue.
(`redis.conf@8.10.3`, "MEMORY MANAGEMENT").

**B4.5 [SRC]** The docs warn that one command can push the instance well over the limit (example: storing a large set
intersection), because the check happens before the command runs. https://redis.io/docs/latest/develop/reference/eviction/ (intro).

**B4.6 [OBS, E14]** Large-value overshoot. With `allkeys-lru`, `maxmemory 6mb` and 3000 keys of 1 KB (4.2 MB), an 8 MB `SET big`
returned `OK` (it was accepted); the *next* command (`DBSIZE`) evicted 1671 keys, including `big` itself, leaving 1330 small keys.
So a single value larger than `maxmemory` evicts a large part of the cache and then is itself evicted. Lesson for article 3 and
for the writers: cap value size; "big key" is also an eviction hazard.

**B4.7 [SRC]** Lowering `maxmemory` at runtime does not fail; Redis logs a warning and evicts (or rejects writes) from then on
(log line observed: "the new maxmemory value set via CONFIG SET (...) is smaller than the current memory usage (...). This will
result in key eviction and/or the inability to accept new write commands", E5 run).

**B4.8 [SRC]** `maxmemory-eviction-tenacity` (6.2+, 0 to 100, default 10) limits how long a single `performEvictions` call may spend:
0 to 10 is 50 microseconds per step (so 500 microseconds at 10), then a 15% geometric progression, about 2 minutes at 99, unlimited at
100. If time runs out, eviction continues from a time event that re-enters the loop. `src/evict.c@8.10.3` `evictionTimeLimitUs`,
`startEvictionTimeProc`. Config text: raise it "if there is an unusually large amount of write traffic". While behind, `used_memory`
can sit above `maxmemory`; `INFO stats` shows `current_eviction_exceeded_time` and `total_eviction_exceeded_time` (ms)
(https://redis.io/docs/latest/commands/info/). Both were 0 in all my runs.

**B4.9 [SRC]** On replicas: since 5.0 a replica ignores its own `maxmemory` by default (`replica-ignore-maxmemory yes`) and only
applies the `DEL`s the primary sends for evicted or expired keys; it therefore may use more memory than the primary and "you
should monitor your replicas". `redis.conf@8.10.3`; https://redis.io/docs/latest/operate/oss_and_stack/management/replication/ ("Maxmemory on replicas"). Replication owned by article 9.

**B4.10 [SRC]** With `volatile-*` policies or `noeviction`, `INFO commandstats` reports `rejected_calls` per command, which is how
to see which commands the limit is stopping. https://redis.io/docs/latest/develop/reference/eviction/ ("Using the INFO command").

**B4.11 [SRC]** With any LRU, LFU or LRM policy and `maxmemory` set, small-integer shared objects are not used, so integer values
cost normal object memory. `MAXMEMORY_FLAG_NO_SHARED_INTEGERS` in `src/server.h@8.10.3`, `src/object.c@8.10.3`. Minor; only mention
if a figure counts bytes for tiny integer values.

---

## 5. Eviction policies

**B5.1 [SRC]** Ten policies in 8.10.3 (`maxmemory_policy_enum`, `src/config.c@8.10.3`): `noeviction`; `allkeys-lru`, `allkeys-lfu`,
`allkeys-random`, `allkeys-lrm`; `volatile-lru`, `volatile-lfu`, `volatile-random`, `volatile-ttl`, `volatile-lrm`. Meanings:
https://redis.io/docs/latest/develop/reference/eviction/ . `allkeys-*` consider every key; `volatile-*` consider only keys that have an
expiry; "the `volatile-xxx` policies behave like `noeviction` if no keys have an associated expiration."
The brief and plan list the first nine without LRM; **LRM exists only from 8.6.0**, so a sentence on it must name the version.

**B5.2 [OBS, E4c]** `volatile-lru` with no key carrying a TTL behaves exactly like `noeviction`: 126,495 keys stored, 73,505 `SET`s
rejected with the same OOM error, `evicted_keys:0`.

**B5.3 [OBS, E4d]** `volatile-lru` on a mixed dataset: 100,000 keys with `EX 3600` and 100,000 without. TTL keys were evicted
(only 162 of the first 1000 TTL keys survived) and no key without a TTL was touched (1000 of 1000 survived). Once the TTL keys ran
out, the three further writes were rejected. This is the core hazard of `volatile-*`: forget a TTL and the key becomes
un-evictable, and the instance can reach OOM errors while holding evictable-looking data.

**B5.4 [OBS, E9b]** `volatile-*` policies look only at keys with a *key-level* expiry. Hashes whose only TTLs are field TTLs
(`HEXPIRE`) are tracked separately (`subexpiry=` in `INFO keyspace`, `expires=0`) and are not candidates: 40,000 such hashes under
`volatile-lru` and `maxmemory 6mb` produced 22,791 OOM errors and `evicted_keys:0`.

**B5.5 [SRC]** Docs guidance on choosing: `allkeys-lru` is "a good default option if you have no reason to prefer any others"
because of skew; `allkeys-random` if all keys are accessed about equally (for example a repeating cycle); `volatile-ttl` if the code
can assign short TTLs to good eviction candidates; `volatile-lru`/`volatile-random` are "mainly useful when you want to use a single
Redis instance for both caching and for a set of persistent keys", and the docs recommend two separate instances instead;
`allkeys-*` is more memory efficient because no expire is needed. https://redis.io/docs/latest/develop/reference/eviction/ .

**B5.6 [SRC]** `allkeys-lrm` (8.6.0+): same sampling as LRU, but only writes update the timestamp, so a key read constantly but never
rewritten is still evictable. Docs: useful to evict "data that hasn't been modified recently" in read-heavy workloads. https://redis.io/docs/latest/develop/reference/eviction/
("LRM eviction"); `src/db.c@8.10.3` (`lookupKey`: LRM skips the read touch). **[OBS, E16]** with `allkeys-lrm`: `SET a`, wait 3 s, `GET a` left
`OBJECT IDLETIME a` at 3; under `allkeys-lru` the same sequence gave 0. Use case for a cache is narrow; mention in one sentence at most.
Valkey has no LRM (B11.1).

**B5.7 [OBS, E15]** `volatile-ttl` prefers keys closest to expiry but, being sampled, is not strict: 10,000 keys each with TTL
600 s, 6,000 s and 60,000 s were loaded to the limit, then 10,000 more keys (TTL 60,000 s) were added. Survivors of 10,000 per class:
600 s class 1,161; 6,000 s class 4,325; 60,000 s class 9,960; new keys 10,000. So the order is right in aggregate but individual
short-TTL keys can survive.

**B5.8 [SRC]** `OBJECT FREQ key` works only under an LFU policy and `OBJECT IDLETIME` only under non-LFU policies; errors:
"An LFU maxmemory policy is not selected, access frequency not tracked. Please note that when switching between policies at runtime
LRU and LFU data will take some time to adjust." (E10). After switching to LFU a key last touched under LRU returned freq 0.
Docs: https://redis.io/docs/latest/commands/object-freq/ (since 4.0.0).

**B5.9 [SRC]** Policy can be changed at runtime with `CONFIG SET maxmemory-policy`. Managed-service defaults differ from Redis:
Amazon ElastiCache node-based parameter groups default `maxmemory-policy` to `volatile-lru` and serverless caches fix it at
`volatile-lru` (not modifiable). https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/RedisConfiguration.html . Azure and other providers
were **not** checked (UNCONFIRMED for them). Consequence worth a sentence: a cache that sets no TTLs on a managed `volatile-lru` instance is
effectively `noeviction`.

---

## 6. Approximated LRU

**B6.1 [SRC]** Redis does not keep a recency list. Each key has a 24-bit `lru` field holding a clock value
(`LRU_BITS 24`, `LRU_CLOCK_RESOLUTION 1000` ms, `src/object.h@8.10.3`), so recency is stored at **one-second resolution** and
wraps after 2^24 seconds (about 194 days, with wrap handling in `estimateObjectIdleTime`). The field is written on every key lookup
unless the lookup is flagged no-touch or a child process (RDB/AOF rewrite) is running, to avoid copy-on-write
(`src/db.c@8.10.3`, `lookupKey`). The docs say the reason for approximating is that true LRU costs more memory.

**B6.2 [SRC]** Algorithm (`src/evict.c@8.10.3`, `evictionPoolPopulate`, `performEvictions`): to free memory, Redis samples
`maxmemory-samples` keys (default 5, range 1 to 64) from consecutive hash-table buckets starting at a random place
(`dictGetSomeKeys`: "not suitable when you need a good distribution"), computes each key's idle time, and inserts it into a
**pool of 16 candidates** (`EVPOOL_SIZE 16`) kept sorted by idle time and **kept between eviction calls**. It then evicts the best
candidate in the pool (entries for keys that no longer exist are skipped, "ghosts"), deletes it, and repeats until under the limit
or out of time (B4.8). Policy `allkeys-*` samples all keys; `volatile-*` samples only keys with an expiry, from every database.
With `allkeys-random` and `volatile-random` it picks a random key instead; `volatile-ttl` ranks by nearest expiry.

**B6.3 [SRC]** Docs: pool added in 3.0; samples 10 "closely" approximates true LRU "but costs more CPU", 3 is "faster but not very
accurate" (`redis.conf`). "In simulations we found that using a power law access pattern, the difference between true LRU and Redis
approximation were minimal or non-existent." https://redis.io/docs/latest/develop/reference/eviction/ ("Approximated LRU algorithm") and `redis.conf@8.10.3`.

**B6.4 [DER, M4]** Without the pool, a single eviction with `k` samples picks the oldest of `k`, so the probability that it is
within the oldest fraction `q` of all keys is `1 - (1 - q)^k`. For `q = 10%`: `k = 1` gives 10%, `k = 3` 27%, `k = 5` 41%, `k = 10` 65%,
`k = 64` 99.9%. For `q = 20%`: `k = 5` gives 67%, `k = 10` 89%. This gives a figure's intuition (more samples, sharper). The pool
improves on it; B6.5 measures the whole thing.

**B6.5 [OBS, E5]** Measured accuracy of the real algorithm. 50,000 keys (100-byte values, created with
`RESTORE ... IDLETIME` so key *i* had idle time `K - i` seconds and key 0 was the oldest); `maxmemory` set to the current memory; then 25,000 fresh
keys written, forcing about 26,200 old keys out. A perfect LRU would evict exactly the oldest ones. Share of evicted old keys that were
among the oldest 26,2xx ("precision"), mean age percentile of the evicted keys (ideal 73.8), and fresh keys wrongly lost:

| `maxmemory-samples` | precision | mean age percentile of evicted (ideal 73.8) | fresh keys lost |
| --- | --- | --- | --- |
| 1 | 40.7% | 50.0 | 5,898 |
| 2 | 61.5% | 56.4 | 234 |
| 3 | 73.1% | 63.5 | 0 |
| 5 (default) | 83.2% | 69.0 | 0 |
| 10 | 91.8% | 72.4 | 0 |
| 20 | 96.4% | 73.5 | 0 |
| 64 | 98.9% | 73.8 | 0 |

One run per setting. Gives the "default is good, 10 is close to exact, 1 is random" story with measured numbers. This test
has uniformly spread idle times (the worst case for approximation); real traffic is skewed (B8.x).

**B6.6 [OBS, E11a]** The one-second clock matters. With 5,000-key capacity and ~80,000 requests per second the cache turns over
in well under a second; `allkeys-lru` then performed like random (hit ratio 0.360 against 0.342 for `allkeys-random` and 0.372 for an
exact LRU simulation), while `allkeys-lfu` got 0.443 (same Zipf 0.8 stream of 100,000 keys; batches of 20 pipelined requests). With a
cache that turns over over many seconds (B8.2) the gap to exact LRU is small. So: LRU's recency signal is only as fine as one second;
it needs a cache whose residence time is much longer than a second. That is the case for most real caches, but not for tiny ones
under heavy churn. Explain with care; it is a consequence of `LRU_CLOCK_RESOLUTION`, not a bug.

**B6.7 [SRC]** `OBJECT IDLETIME` returns the approximated idle time in seconds (resolution 1 s, observed returning whole seconds
such as 3).

---

## 7. Approximated LFU

**B7.1 [SRC]** (4.0+.) The same 24-bit field is split into 16 bits of "last decrement time" in **minutes** and an **8-bit
logarithmic counter**. New keys start at `LFU_INIT_VAL = 5` so they can collect accesses before being evicted (`src/evict.c@8.10.3` comment and
`src/server.h`). **[OBS, E6a]** A fresh key reported `OBJECT FREQ` 5; one `GET` made it 6.

**B7.2 [SRC]** Increment rule on each access: draw `R` in [0,1); with counter `c` and `baseval = max(c - 5, 0)`, increment only
if `R < 1 / (baseval x lfu-log-factor + 1)`; saturate at 255. `src/evict.c@8.10.3` `LFULogIncr`; `redis.conf` text: "probability P is
calculated as 1/(old_value*lfu_log_factor+1)". It is an approximate (Morris) counter. `lfu-log-factor` default 10.

**B7.3 [DER, M3]** Expected number of accesses to climb from 5 to counter `c`: `(c - 5) + F (c - 5)(c - 6) / 2`, where `F` is
`lfu-log-factor`. Examples with `F = 10`: counter 10 after about 105 hits, 50 after 9,945, 100 after 44,745, 142 after 93,297, 255 after
311,500. With `F = 1`: 255 after 31,375; with `F = 100`: 255 after about 3.1 million. The docs' "saturate at, around, one million
requests" is loosely worded for the default (the formula gives about 311,000); the `redis.conf` table shows 255 at 1M hits.

**B7.4 [OBS, E6a]** The `redis.conf` table reproduces. One key hammered with `redis-benchmark ... incr foo` (pipelined), counter read by
`OBJECT FREQ`, one run per cell (counts are random):

| `lfu-log-factor` | 100 hits | 1,000 | 100,000 | 1,000,000 | 10,000,000 |
| --- | --- | --- | --- | --- | --- |
| 0 | 104 | 255 | 255 | 255 | 255 |
| 1 | 18 | 48 | 255 | 255 | 255 |
| 10 (default) | 9 | 18 | 159 | 255 | 255 |
| 100 | 7 | 9 | 55 | 142 | 255 |

Docs table (https://redis.io/docs/latest/develop/reference/eviction/ and `redis.conf`) for comparison: factor 10 gives 10, 18, 142, 255, 255. Expected
values from B7.3 for factor 10 are 9, 19, 146, 255, 255.
**Consequence:** the counter separates keys with a handful of hits from keys with tens of thousands, but cannot separate a key with
500,000 hits from one with 5,000,000 at default settings. That is the right resolution for eviction.

**B7.5 [SRC]** Decay: `lfu-decay-time` (minutes, default 1, `0` disables decay). When a key is read for eviction or accessed, the counter is
reduced by `elapsed_minutes / lfu-decay-time` (whole periods; `LFUDecrAndReturn`, `updateLFU`, `src/evict.c@8.10.3`, `src/db.c@8.10.3`).
Because the timestamp is 16 bits of minutes, wrap-around is handled but a key untouched for about 45 days can look recently accessed
(`LFUTimeElapsed` treats wrap as exactly one). Edge case, no need to mention.

**B7.6 [OBS, E6b, E6c]** Decay is *linear*, one count per period: a key created with `RESTORE ... FREQ 100` read 100, then 99, 98, 97
after 0, 62, 124, 186 seconds with `lfu-decay-time 1`. With `lfu-decay-time 0` the counter stayed 100 for 160 s. (The antirez post
http://antirez.com/news/109 describes halving of high values; that does not match the 8.10.3 source or behaviour.)

**B7.7 [SRC]** Sampling for LFU is the same as for LRU (B6.2), but the pool is sorted by `255 - counter`, and decay is applied to each
sampled key before comparing. `src/evict.c@8.10.3` `evictionPoolPopulate`. Docs: "LFU is approximated like LRU: it uses a probabilistic counter, called
a Morris counter ... combined with a decay period".

**B7.8 [SRC]** `OBJECT FREQ key` shows the (decayed) counter under an LFU policy; `redis-cli --hotkeys` also needs LFU (article 10). Docs:
https://redis.io/docs/latest/commands/object-freq/ .

**B7.9 [SRC]** Why LFU can beat LRU for caches: Breslau et al. (INFOCOM 1999) found that on proxy traces a perfect-LFU replacement
policy gave the best byte hit ratio, as their independent-reference model predicted; their simulations also show plain LRU
trailing it, and that "In-Cache-LFU" (counts forgotten on eviction) performed worst. Perfect-LFU needs counts for evicted documents, which
Redis does not keep. https://pages.cs.wisc.edu/~cao/papers/zipf-implications.html (paper text: section on replacement algorithms, Fig. 9).
The Redis counter is closer to the "in-cache" kind (it lives in the object), which is the kind that Breslau found weakest; do not
claim Redis LFU equals perfect-LFU. **Measurements below (B8.4, B8.5) show LFU ahead of LRU on this machine.**

---

## 8. Hit ratio as a function of size; scan pollution

**B8.1 [SRC]** Skew in real request streams. Breslau, Cao, Fan, Phillips and Shenker (INFOCOM 1999) found web request counts on six proxy
traces follow a Zipf-like law, probability proportional to `1 / i^α` for the item of popularity rank `i`, with `α` between **0.64 and 0.83**
(Table I lists 0.77, 0.78, 0.83, 0.69, 0.73 and 0.64; my text extraction scrambled which value belongs to which trace). They state that the "10/90" rule
does not apply to proxy traffic: it took **25% to 40% of documents to draw 70% of accesses**. The hit ratio grows "log-like" with cache size (a log or a
small power; the data cannot tell them apart); their independent-reference model gives `H(C) ∝ ln C` for `α = 1` and `H(C) ∝ C^(1-α)` for
`0 < α < 1`. Extracted from the paper text (PostScript, `zipf-like.ps.gz`); the earlier 1998 tech report on the same page reports 0.57 to 0.67
on other traces and says more users or more varied users give a smaller `α`. Paper page: https://pages.cs.wisc.edu/~cao/papers/zipf-implications.html ;
DOI 10.1109/INFCOM.1999.749260. These are 1990s web proxy traces: say "for example, web proxies", not "caches follow Zipf". The measured curve in
Table Z (B8.3) is the better evidence for Redis; this paper supplies the idea of skew and a realistic exponent range.

**B8.2 [DER, M5]** How much of the traffic the most popular items take, for one million items: `α = 0.64`: top 1% takes 18.6%, top 10%
43.3%, top 20% 55.8%; `α = 0.8`: top 1% 36.2%, top 10% 60.9%, top 20% 70.8%; `α = 1.0`: top 1% 68.0%, top 10% 84.0%, top 20% 88.8%;
`α = 1.2`: top 1% 91.0%. A cache holding the most popular C items has hit ratio equal to that cumulative share (the best any cache of
that size could do with static popularity: the "oracle" column below).

**B8.3 [OBS, E11b]** HIT RATIO VS SIZE ON THE REAL SERVER. See Table Z at the end of this section (filled from the long run).

Setup: Zipf-like requests, exponent α = 0.8, 4,000,000 distinct keys, 100-byte values, cache-aside (`GET`, `SET` on miss) with the
client sending batches of 20 pipelined `GET`s then the `SET`s for the misses; 3,000,000 warm-up requests then 2,000,000 measured, one run per cell,
random seed 1, about 80,000 requests per second, `maxmemory-samples 5`. `maxmemory` was set to the empty-server memory plus capacity x 160
bytes, so the real number of keys held differs a little from the target (shown). "Oracle" is the hit ratio of a cache that always holds the most
popular keys (the cumulative Zipf share, which is the best any cache of that size can do on this stream). "Exact LRU" is a separate Python simulation of a
true LRU on the same stream, using the target capacity.

| Cache size (keys held, share of 4M keys) | Oracle | Exact LRU (sim) | Redis `allkeys-lru` | Redis `allkeys-lfu` | Redis `allkeys-random` |
| --- | --- | --- | --- | --- | --- |
| about 39,500 (1.0%) | 0.370 | 0.243 | 0.230 | 0.322 | 0.216 |
| about 119,000 (3.0%) | 0.473 | 0.341 | 0.338 | 0.406 | 0.308 |
| about 394,000 (9.8%) | 0.613 | 0.495 | 0.489 | 0.526 | 0.450 |
| about 1,172,000 (29%) | 0.773 | 0.694 | 0.688 | 0.695 | 0.660 |

Reading it (all [OBS] unless marked):
- Diminishing returns: tripling the cache from 1% to 3% adds about 10 points of hit ratio; going from 10% to 30% adds about 20 points for
  three times the memory again. The miss ratio (what the database sees) for `allkeys-lru` falls 0.770, 0.662, 0.511, 0.312, so a 30x larger cache cut database
  reads by only about 2.5x. Matches the "log-like" growth Breslau et al. report (B8.1).
- Even the perfect always-hold-the-most-popular cache misses 63% of requests at 1% size on this stream (oracle 0.370); the Zipf exponent (0.8) sets
  that ceiling. Say "hit ratio depends on the skew, not just the size".
- `allkeys-lfu` beats `allkeys-lru` at every size and the lead shrinks with size (+9.0, +6.9, +3.7 and +0.7 points). `allkeys-lru` in Redis tracks exact LRU
  closely at 10% and 30% (within 0.6 points), and trails it at 1% because that cache turns over in about 0.65 s, less than the one-second LRU clock (B6.1, B6.6; turnover
  is derived: misses per second divided into the cache size). The 0.5 point gaps at large sizes also include the 1 to 1.5% shortfall between target and actual keys held.
- LFU leads partly because this request stream is independent draws with a fixed popularity (the model Breslau et al. use). A real stream with bursts and
  changing popularity favours recency more and the decay (B7.5) matters; do not generalise the size of the gap.
- `allkeys-random` is 3 to 11 points behind LFU and only 2 to 4 points behind LRU at the larger sizes; the sampling machinery matters most when the cache is small relative to the
  working set.
- Raw rows (and a first run with a 5,000-key cache that shows the same ordering): evidence file E11a and E11b.


**B8.4 [OBS, E7]** Scan pollution, measured. Cache sized for about 20,000 keys; 1,000 hot keys each read 50 times; a 2.2 s pause; then a
scan of 100,000 distinct one-off keys written once; then count surviving hot keys:

| Policy | hot keys surviving of 1,000 | keys in cache at end | evicted |
| --- | --- | --- | --- |
| `allkeys-lru` | **0** | 19,929 | 101,230 |
| `allkeys-lfu` | **950** | 20,098 | 101,060 |
| `allkeys-random` | 25 | 19,915 | 101,243 |

Why: LRU sees the scan keys as the newest items and hot keys as 2 seconds old; LFU sees scan keys at the initial counter 5 and hot
keys at about 8 to 10. The pause exists because recency has one-second resolution (B6.1); a real scan interleaved with hot-key reads would
refresh the hot keys under LRU too. State the setup when presenting this; it is a favourable case for LFU. Random is "survives by chance":
expected survivors for a 20,000-key cache and 101,000 evictions is a fraction of a percent, the 25 is sampling noise plus keys
evicted in the initial fill.

**B8.5 [SRC]** Scan pollution is an old, documented weakness of LRU. O'Neil, O'Neil and Weikum, "The LRU-K page replacement algorithm
for database disk buffering" (SIGMOD 1993), section 1.1: sequential scans make an LRU buffer drop commonly referenced pages in favour of
pages unlikely to be reused. LRU-K and later frequency-aware admission schemes (TinyLFU, Einziger, Friedman and Manes, 2015,
https://arxiv.org/abs/1512.00727) exist because of this. https://www.csd.uoc.gr/~hy460/pdf/p297-o_neil.pdf . I did not read TinyLFU beyond its abstract.

**B8.6 [SRC]** Facebook found a different eviction issue: items with different churn interact badly in one LRU pool, so "low-churn keys that
are still valuable are evicted before high-churn keys that are no longer accessed"; they separated keys into a default "wildcard" pool and
specific pools sized by miss cost (Nishtala et al., NSDI 2013, section 3.2.2 "Memcache Pools"). For Redis the analogue is separate
instances (or logical separation) per workload class, which the Redis docs also recommend when mixing cache and persistent data (B5.5).

---

## 9. Observing expiry and eviction

**B9.1 [SRC]** `INFO stats`: `expired_keys` (total expire events), `evicted_keys`, `keyspace_hits`, `keyspace_misses`, `evicted_clients`
(7.0+), `evicted_scripts` (7.4+), `total_eviction_exceeded_time`, `current_eviction_exceeded_time`, `expired_subkeys`,
`expired_stale_perc`, `expired_time_cap_reached_count`, `expire_cycle_cpu_milliseconds`. `INFO keyspace`: `dbN:keys=...,expires=...,avg_ttl=...,subexpiry=...`.
`INFO memory`: `used_memory`, `used_memory_dataset`, `maxmemory`, `maxmemory_policy`, `mem_not_counted_for_evict`. https://redis.io/docs/latest/commands/info/ .

**B9.2 [SRC]** Hit ratio formula from the docs: `keyspace_hits / (keyspace_hits + keyspace_misses)`. An `EXISTS` on an absent key
counts as a miss. Docs' diagnosis recipe: if the hit ratio is lower than the working set implies, check `evicted_keys` (high suggests
the wrong keys are being evicted or the cache is too small) and, if that is low, `expired_keys` (high suggests TTLs too short).
https://redis.io/docs/latest/develop/reference/eviction/ ("Using the INFO command"). Caveat for writers: server-wide hit counters include all
traffic on the instance, not only the cache path.

**B9.3 [OBS, E1c]** In 8.10.3 `INFO stats` also reports `expired_keys_active` (keys removed by the background cycle); in E1b with the
background cycle off, 1000 expired keys deleted by `RANDOMKEY` counted in `expired_keys` but not in `expired_keys_active`. This
field is in the 8.6.0 source but is not in the redis.io INFO page (UNCONFIRMED in docs; a writer may mention it as "recent versions"
or skip it).

**B9.4 [SRC]** `expired_keys` counts both passive and active deletions (E1a, E1c). `evicted_keys` counts only `maxmemory` evictions.
`deleteKeyAndPropagate` emits a `DEL` (or `UNLINK`) to replicas and the AOF for both, so replicas stay identical. `src/db.c@8.10.3`.

**B9.5 [SRC]** Latency monitor event names for these paths: `expire-cycle`, `eviction-cycle`, `eviction-lazyfree`
(`src/expire.c@8.10.3`, `src/evict.c@8.10.3`); readable with `LATENCY LATEST`/`LATENCY HISTORY` once `latency-monitor-threshold` is set.
Not run here. UNCONFIRMED in observed output.

**B9.6 [SRC]** `OBJECT FREQ`/`OBJECT IDLETIME` (per key), `DEBUG SET-ACTIVE-EXPIRE` (debug only), `MEMORY USAGE key` (bytes, approximate).

---

## 10. Replicas and expiry (brief; article 9 owns replication)

**B10.1 [SRC]** Replicas do not expire keys on their own. The primary expires or evicts a key and sends a `DEL` to every replica.
Because the `DEL` can arrive late, a replica uses its own clock to *report* a logically expired key as missing for reads that do not
alter data ("an HTML fragments cache that uses replicas to scale will avoid returning items that are already older than the desired
time to live"). During scripts, time is frozen. A promoted replica starts expiring independently.
https://redis.io/docs/latest/operate/oss_and_stack/management/replication/ ("How Redis replication deals with expires on keys").
Source confirmation: `expireIfNeeded` in `src/db.c@8.10.3` returns "expired but not deleted" on replicas.

**B10.2 [SRC]** Consequences: replicas can hold more memory (B4.9) and, for a short time, expired-but-present keys that `DBSIZE` counts. Not observed (single instance only, per
the port rule).

---

## 11. Valkey and managed services

**B11.1 [SRC]** Valkey (documentation checked) supports `noeviction`, `allkeys-lru`, `allkeys-lfu`, `volatile-lru`, `volatile-lfu`, `allkeys-random`,
`volatile-random`, `volatile-ttl`, with the same default sample size 5 and an eviction pool; its page does not mention LRM.
https://valkey.io/topics/lru-cache/ . Hash-field expiry (`HEXPIRE`) is "since 9.0.0" in Valkey (https://valkey.io/commands/hexpire/); in Redis it is 7.4.0.

**B11.2 [SRC]** Valkey 8.0.0 and 9.0.0 ship `lazyfree-lazy-eviction`, `lazyfree-lazy-expire`, `lazyfree-lazy-server-del`, `lazyfree-lazy-user-del`
set to `yes` in the sample config; Redis 8.10.3 defaults all four to `no`. https://github.com/valkey-io/valkey/blob/8.0.0/valkey.conf and
https://github.com/valkey-io/valkey/blob/9.0.0/valkey.conf versus `redis.conf@8.10.3`. Relevant only for big-value deletes.

**B11.3 [SRC]** ElastiCache default policy `volatile-lru` (B5.9). Because TTL-less keys cannot be evicted under it, "set a TTL on every
cache key" is the rule on such services. For Redis OSS proper the default is `noeviction`.

**B11.4 UNCONFIRMED** Whether Azure Cache for Redis, Google Memorystore and Redis Cloud use the same default; not checked.

---

## 12. Running examples and what is measured

Three scenarios that fit this article and the others in the collection (the writers for 2, 3, 5 and 6 should reuse them):

1. **Product catalogue page cache** (an online shop). Product detail JSON, about 2 KB, changes about once an hour per product
   (`λ = 1/3600 s`), read `r` times per second per popular product. Use it for B1.5 to B1.7: with `T = 300 s` about 4% of hits are
   stale and the hit ratio of a product read once a second is 99.7%; a long-tail product read once a minute gets 83% at `T = 300 s`
   (`rT = 5`, `5/6`). Good for the TTL slider figure. Numbers: **illustrative model** (B1.5/B1.6), checked by simulation.
2. **News/article pages with a few viral stories and a long tail** (media site, millions of items, skewed reads). Use for hit ratio
   against cache size, LRU against LFU and scan pollution: the nightly crawler or "export all articles" job is the scan. Numbers:
   the hit ratios in Table Z and the scan result B8.4 are **measured on a real Redis 8.10.3 server** (with the stated stream and sizes);
   the Zipf exponent and request mix are **illustrative** (chosen within Breslau et al.'s 0.64 to 0.83).
3. **One Redis shared by a cache and by durable keys** (rate limiters, session store, job queue) with a managed-service default of
   `volatile-lru`. Use for the `noeviction` versus `volatile-*` versus `allkeys-*` choice and the "forgot the TTL" failure (B5.2, B5.3).
   A shorter variant: a 1 million product-price-key refresh at deploy time for jitter (B2.7, B3.1).

Which numbers should be measured and which illustrative in the article:

- **Measured (quote with the setup and "Redis 8.10.3, libc malloc"):** B2.2 to B2.3 and B2.20 (passive versus active expiry, memory held), B2.7 to B2.8 and B2.19 (cost
  of a synchronised expiry of a million keys), B2.12 (TTL semantics), B4.4 (OOM behaviour), B5.2 to B5.4, B6.5 (LRU accuracy by sample count),
  B6.6, B7.4, B7.6, B8.3 (Table Z), B8.4 (scan pollution). Bytes per key (B2.10) only as "libc malloc test".
- **Illustrative (say so in the caption):** all simulated figures with a clock, request stream, or invented rates (B1.5 to B1.7, B3.1, B6.4,
  B8.2), and any concrete workload (names, rates, item sizes).
- **Not measured, only from sources:** replica behaviour (B10), LATENCY events (B9.5), managed-service defaults beyond ElastiCache.

Suggested figure candidates (not prose): (a) a timeline strip showing a key's TTL, the logically-expired period and the moment a read or the
active cycle deletes it, with a memory bar that does not shrink until then; (b) a sampling picture with a ring of keys, `maxmemory-samples`
slider and the pool of 16; (c) hit ratio against cache size for LRU, LFU, random and an oracle; (d) a scan figure with a hot set and a scan band;
(e) a staleness-versus-TTL curve with `λ` slider, plus hit ratio on the same axes.

---

## 13. Gaps and overlaps in the coverage map

- **Overlap with article 6 on jitter.** Plan article 4 introduces jitter; article 6 shows its effect on load. B3.1 plus B2.7/B2.8 give article 4 enough
  without simulating a database stampede. Keep the database-side load model in article 6.
- **Overlap with article 3 on hash-field expiry.** Article 3 owns `HEXPIRE`; article 4 needs only B5.4 (volatile policies ignore field-only TTLs) and B2.18.
- **Gap: LRM is not in the plan.** `allkeys-lrm`/`volatile-lrm` exist from Redis 8.6.0 (and the installed 8.10.3). The plan's policy list stops at
  `noeviction`. One sentence with the version is enough (B5.6); the plan should say so.
- **Gap: the practical rule "every cache key needs a TTL on volatile-* or managed services"** is not listed explicitly; it follows from B5.2, B5.3, B5.9.
- **Gap: big values and eviction (B4.6).** Article 3 owns value size, but the overshoot-then-evict behaviour is an eviction fact and should be cross-linked.
- **Gap: LRU's one-second clock (B6.1, B6.6).** Not in the plan; it changes how to read small-cache benchmarks.
- **Overlap with article 11 on monitoring.** B9.1 to B9.4 are the signals; article 11 should own alert thresholds and link back for what the fields mean.
- **`HOTKEYS` command (8.6.0)** appears in the release notes (https://github.com/redis/redis/releases/tag/8.6.0); not in scope here but relevant to article 10, and
  the plan's `redis-cli --hotkeys` (needs LFU, B7.8) should be checked against it.
- **Sizing note for article 11.** B2.10, B4.4 and B4.6 give per-key overhead observations; the capacity-planning article should measure on the production
  allocator rather than reuse these.
