# Technical review, round 1: Redis replication, persistence and failover

Reviewer: independent technical reviewer (no earlier review seen).
Source: `src/articles/caching/replication-and-persistence.astro`, figures in
`src/components/caching/replication-and-persistence/`.
My own runs and outputs are in `docs/article-work/caching-2026-10-27/evidence/replication-and-persistence-review-1.txt`
(sections E1–E11b, M1–M2, S1–S3). Redis 8.10.3, libc malloc, macOS, loopback network.

## Verdict

**Revise before publication.** The Redis mechanics are almost all correct, and I
reproduced the key experiments: snapshot restores a deleted key, MISCONF under
default save points, the AOF crash test, the failover that loses an acknowledged
DEL (with `WAIT` returning 0), expiry on a frozen-primary replica, partial versus
full resync, `NOREPLICAS` after about 10 s, the Sentinel failovers at 30 s and
5 s, and the replica wiped by a fast restart. All matched the article within noise.
The timings state their settings and conditions.

Three findings are required. One is the central model conclusion: it holds under
its stated assumptions, but the prose presents it as a general fact, and it
reverses for plausible databases. The second is an absolute claim about AOF
durability that the source contradicts. The third is a precondition missing from
the MISCONF advice.

Counts: **3 required, 9 suggested.**

## Required

### R1. "A failover at Sentinel's defaults is worse than an empty restart" is a model result. Say so where it is concluded, and give the condition under which it reverses.

Where: `#choosing` prose ("A replica promoted after Sentinel's default 31 seconds is worse: the database is overloaded for longer than if the primary had simply restarted empty."). Also the Sentinel section ("for the reason in the last section, 30 seconds is often too long"), the Figure 11 verdict box ("Worse than restarting empty at once."), and the closing paragraph about the shop.

What holds: under the model's stated assumptions the claim is true, and I reproduced it.

The assumptions are:
- 2,000 requests a second over 50,000 Zipf(0.9) keys;
- a 600 s TTL and fixed TTLs;
- a database capacity of 500 reads a second, about 6.9 times the normal 73;
- the application fails open, so every request goes to the database while Redis is unavailable;
- the empty restart is instant;
- a 15-minute window.

Under those, an empty restart at once spends 19 s above capacity with about 49k extra reads. Coming back with the data after 31 s spends 31 s above capacity with about 62k extra reads (evidence M1). The model's one-read-per-missing-key-per-second simplification does not change this. When I let concurrent misses during a 0.05–0.5 s database read all go to the database, the empty restart moves only from 19 s to 20 s above capacity (M2). The 31 s outage is also real: I measured 31.5 s client unavailability at the default `down-after-milliseconds` and 6.3 s at 5,000 ms (E7, E8).

Why it is still required: the conclusion depends on the assumed capacity and traffic, and the prose does not say so.
- The verdict flips at a capacity of about 380 reads a second, about 5.2 times normal load. With 300 reads a second, the empty restart spends 45 s above capacity against the failover's 31 s (M1, flip.mjs).
- With 1,000 requests a second and capacity scaled in proportion (250), the empty restart spends 37 s above capacity, so the failover wins.
- With skew 0.7 the two are tied (30 s against 31 s).
- The "extra reads" readout depends on the window and on counting only reads above normal. Counted with sign over 15 minutes, it is 25k for the empty restart against 61k for the failover. Over an hour, with the model's undamped TTL waves, it is 77k against 62k, the other way round (M1).

A practitioner whose database has 3–5 times headroom would draw the wrong conclusion from the current sentence, and the figure offers no capacity control that would show it.

Correction:
- Rewrite the sentence to make the condition explicit. For example: "In this model, with a database that can take about seven times its normal load, a replica promoted after the 31 seconds I measured at Sentinel's default settings keeps the database overloaded for longer than an immediate empty restart (31 s against 19 s). With a database that can take less than about five times its normal load, or with less traffic to refill the cache, the order reverses. Compare the two on your own numbers."
- Make the Figure 11 verdict text conditional ("In this model, worse than…"). Ideally add a capacity control (for example 300 / 500 / 800) so the reader can see the flip.
- Either drop the "Extra database reads" readout or state its window ("over the 15 minutes after the failure, counting only reads above normal").
- In the Sentinel section, change "for the reason in the last section, 30 seconds is often too long" to "…can be too long (see the last section)".

### R2. "Crashing Redis loses nothing that was acknowledged, under any policy" is not true for `everysec` when the disk is slow.

Where: `#aof` prose ("Crashing Redis loses nothing that was acknowledged, under any policy."), the AofFigure text alternative ("Crash Redis loses no acknowledged write under any policy…"), the `aof-model.mjs` header comment, and the "What you can now decide" bullet ("knowing that a process crash loses nothing acknowledged under any policy").

Evidence (S1): in `src/aof.c` `flushAppendOnlyFile()` at 8.10.3, with `everysec` and a background fsync still running, Redis returns without calling `write(2)` and keeps the data in its own `aof_buf`. It does this for up to 2,000 ms, which is the postponement the article itself cites for the power-cut case. `beforeSleep()` in `src/server.c` then sends client replies regardless; its ordering comment names only `appendfsync always`. So for up to about two seconds on a busy disk, acknowledged writes exist only in the Redis process's memory, and `kill -9` or a crash loses them. My own `kill -9` test lost nothing (E4), as did the writer's, but on an idle disk the postponement never happens. A buffer that cannot be written because of an AOF write error, such as a full disk, is also process memory.

Correction: "A crash of the Redis process usually loses nothing acknowledged, because each write has already been handed to the operating system. The exception is `everysec` on a slow disk. While an fsync is still running, Redis holds new writes in its own buffer for up to two seconds and replies to clients anyway, so a crash in that window loses them. With `always`, nothing acknowledged is lost." Apply the same change to the figure text, the model comment and the closing bullet.

### R3. `stop-writes-on-bgsave-error` refuses writes only when save points are configured; say so, and mention the AOF case.

Where: `#snapshot-restore` ("if a background save fails … Redis by default refuses every write until a save succeeds"), and the first bullet of the recommended defaults.

Evidence: `src/server.c` `writeCommandsDeniedByDiskError()` checks `stop_writes_on_bgsave_err && saveparamslen > 0 && lastbgsave_status == C_ERR`. I made the directory read-only and ran `BGSAVE` with `--save ''`. The status became `err`, but `SET` and `DEL` still succeeded (E3). With the default save points the same steps gave `MISCONF` on both (E3b), as the article says.

This matters for the advice:
- A cache that runs with `save ""` and takes an occasional manual or scripted `BGSAVE` is not exposed.
- A cache with `appendonly yes` is exposed in a way the article does not mention. Any AOF write error, such as a full disk, refuses all writes, `DEL` included. No setting turns this off (the `DISK_ERROR_TYPE_AOF` branch).

The article's own principle, that a refused `DEL` leaves stale data, makes both points decision-relevant.

Correction: "…if a background save fails and save points are configured (as they are by default), Redis refuses every write…". In the AOF section or the recommended defaults, add one sentence: "With the AOF on, a failed write to the file (a full disk, say) also makes Redis refuse writes, and no setting turns that off, which is one more reason to keep the AOF off a cache."

## Suggested

### S1. Reconcile the 1 ÷ (1 − h) derivation with Figure 1's 18×.
The derivation says that straight after an empty restart the database sees all reads, 1 ÷ (1 − h) times normal. At the figure's 96.4% hit ratio that is about 27×, but the figure and prose say 1,330 reads, 18×. The model counts one database read per distinct missing key per second, so repeat requests for a hot key within the first second are hits. Both are defensible, but a careful reader will notice the mismatch. Add one sentence: "1 ÷ (1 − h) is the instantaneous rate; within the first second the most popular keys are already back, so the model's first-second count is lower: 1,330 rather than 2,000." The closing bullet ("1 ÷ (1 − hit ratio) times … at first") could then say "up to".

### S2. Figure 11 treats a snapshot as current.
The `snapshot` recovery restores what Redis held at the moment of failure. A real snapshot under the default save rules can be up to an hour old: it lacks keys filled since it was taken and holds values deleted since (Figure 3). The prose's conclusion, "the same holds for a snapshot that takes half a minute to load", is in the safe direction. A reader trying a short load time would still overestimate the snapshot. Add "assuming the snapshot was taken just before the failure" to the caption, or omit the snapshot case from the figure.

### S3. "Sentinel's default 31 seconds" mixes a setting and a measurement.
The default is `down-after-milliseconds 30000`; 31 s was the measured outage. Write "after about 31 seconds, which is what I measured with Sentinel's default 30-second `down-after-milliseconds`" in `#choosing` and in the Figure 11 text alternative. Also note that this ran on loopback with the process killed, so connections were refused at once. If the host itself dies, clients also wait for their connect timeouts. My run: SDOWN 30.04–30.13 s after the kill, ODOWN +0.17 s, switch-master +1.5 s, client back at 31.5 s (E7).

### S4. Figure 3 quotes a log line from a three-key run.
The sequence shows two keys, the kettle and the banner, but quotes "keys loaded: 2, keys expired: 1". The writer's run (evidence e1c) also had `product:7`. In my two-key reproduction the log reads "keys loaded: 1, keys expired: 1" (E2). Either quote the matching line or show the third key. The caption's "25-second wait" also does not match the prose's "Twenty seconds later"; the banner had a 20 s TTL and the wait was 25 s, so word it consistently.

### S5. Transparent huge pages: Redis already disables them for itself.
The 8.10.3 `redis.conf` has `disable-thp yes`. When the kernel setting is `always`, `server.c` calls `prctl(PR_SET_THP_DISABLE)` for the Redis process. The latency document's advice is older than this. Keep the advice, but add: "Since Redis 7 (`disable-thp yes`) Redis turns them off for its own process when the kernel enables them for everything; check that it logged no warning." Please verify the exact version that introduced `disable-thp` before stating it.

### S6. "A few seconds is a common choice for a cache" is unsourced.
Neither `sentinel.conf` (30000) nor the Sentinel documentation's example (60000, or 10000 for a second master) supports "common". Rephrase as a recommendation with its reason, or drop "common".

### S7. RDB-channel replication applies with diskless sync.
In 8.10.3 the second connection is used only when `repl-rdb-channel` (a hidden setting, default yes) is on *and* `repl-diskless-sync` is on (`replication.c`, around line 1591). Both are defaults, so the sentence is true by default. Add "(with the default diskless sync)" so that readers who turn diskless sync off are not misled.

### S8. Fixed-address clients after a crash failover.
"…it keeps sending writes to the old primary, which after a failover is a replica, and gets READONLY errors" describes the old primary once it has returned. After a crash the client first gets connection errors, and gets `READONLY` only after the old server comes back and Sentinel demotes it. Add "once it is back".

### S9. ElastiCache context.
The quoted wipe behaviour is listed beside "A customer-initiated reboot of a primary doesn't trigger automatic failover" in the Multi-AZ limitations. Saying "when you reboot a primary yourself (which does not trigger a failover), it comes back cleared…" makes the parallel with Figure 10 exact. The document also says Multi-AZ and AOF are mutually exclusive for Redis OSS, which fits the article's advice, so a citation there would be worthwhile.

## Checked and correct (no action)

- Default save points `3600 1 300 100 60 10000` with no configuration file. Defaults confirmed: `stop-writes-on-bgsave-error yes`, `appendfsync everysec`, 1 MB backlog, `repl-timeout 60`, diskless sync on with a 5 s delay, `replica-ignore-maxmemory yes`, `min-replicas-max-lag 10` (E1, redis.conf).
- A snapshot drops keys whose absolute expiry has passed and restores a deleted key with its remaining TTL (E2).
- MISCONF with default save points; `GET` still served (E3b).
- Failover loses an acknowledged `DEL`. `DEL` then `WAIT 1 500` on one connection returned 1 then 0. The promoted replica (offset 557,489 of 5,908,961) served the kettle with TTL 3,589 (E5b). My first attempt (E5) was invalid and is recorded as such: `WAIT` sent on a different connection, and the stream small enough to sit in socket buffers. Note for the writer: `WAIT` covers only writes on its own connection. The article implies this but could say it.
- Replica hides an expired key from `GET`/`EXISTS`/`TTL` while `DBSIZE` counts it. A promoted replica expires the key itself (E6, replication documentation).
- Partial resync within the backlog, full resync beyond it (E10). `NOREPLICAS` about 10.5 s after freezing the only replica, `DEL` included (E11b).
- Sentinel timings: 31.5 s at the default and 6.3 s at 5,000 ms (E7, E8). A fast restart of a primary without persistence wiped both replicas, and Sentinel logged only `+reboot` (E9).
- Sentinel: pings every second; ODOWN by quorum; the leader needs max(majority, quorum) votes; replica exclusion `down-after × 10 + time since SDOWN`; ordering by priority, offset, run ID; priority 0 never promoted; `CLIENT KILL TYPE normal` on reconfiguration; `SENTINEL FAILOVER` forces a failover without agreement and without a catch-up pause (sentinel.c, Sentinel documentation, client specification).
- Model code: `lag-model` formula 1 − e^(−wd) with Poisson writes (39% at 250 ms); CoW 1 − (1 − 1/48)^60 ≈ 72%; backlog 1 MB ÷ (5,000 × 138 B) ≈ 1.5 s; the quorum rules. `models.test.mjs` passes (11/11).
- Fork-time figures and the "transparent huge pages must be disabled" wording match the latency document. The persistence document's "sometimes used when caching", the 30 s Linux flush and the multi-part AOF since 7.0 all match. The `WAIT` "best-effort" wording, the Sentinel cache quote and the ElastiCache claims (least-lag replica, "typically just a few seconds", rebooted primary clears replicas, Valkey 9.0+ durability) all match their sources.
- Rendered page: all 11 figures mount with no console errors. Figure 11's verdict text matches the model output (desktop, light theme, checked with Playwright).
