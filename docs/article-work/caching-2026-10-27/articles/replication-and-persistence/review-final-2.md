# Final review, round 2: Redis replication, persistence and failover

Reviewer: independent pre-publication review. I formed this judgement before
reading the round-1 reviews and repair notes, and checked them afterwards only
to confirm that nothing required was left undone. Nothing was.

## Verdict

**Publish.** There are no blocking problems and 10 minor ones.

The article meets the Gears and Load Balancing bar for this subject. It opens on
a reboot the reader will recognise, turns that into a cost they can work out
(1 ÷ (1 − h)), and then judges every mechanism against three rules that are
specific to caches: do not lose everything at once, do not serve deleted values,
do not refuse writes. That frame does real work. It is why the article can say,
correctly and usefully, that `stop-writes-on-bgsave-error`, AOF write errors and
`min-replicas-to-write` are wrong for a cache, and that a restored snapshot or a
failover can bring back a deleted price. A newcomer will not find those points
in the Redis documentation. The two sequence figures for lost deletes (9) and
the fast restart that wipes the replica (10) are the most valuable in the
collection so far, and Figure 11 makes the reader decide with their own
database capacity instead of handing them a slogan.

Labelling of models and measurements is careful throughout. Every timed figure
says how fast its clock runs (Fig. 1 at ten times real time, Fig. 7 in real
time, Fig. 4 and 5 with dots slowed but delays in model time). Every measured
timing gives the setting that produced it: the 60 s `repl-timeout`, the 10 s
`min-replicas-max-lag`, 30 s and 5 s `down-after-milliseconds`, `everysec` for
`WAITAOF`, and the default 1 MB backlog. Figures 1, 2, 4, 5 and 11 are labelled
as illustrative models with their conditions, and Figure 6 as arithmetic.
**Figure 9's partition branch is labelled** in its caption: "The partition
version follows the example in the Redis Sentinel documentation; I did not run
it." Its steps match the documentation's example (lines on clients in the old
primary's partition, and "If you are using Redis as a cache, it could be handy
that Client B is still able to write to the old master").

## How I checked

- Read the brief, the full text of Gears and Load Balancing, and plan entries 7
  to 11 with "Map changes after research". I ran Load Balancing simulations,
  including the play and speed controls.
- Read the rendered article top to bottom on the preview at port 4479 and used
  every control of all 11 figures through Playwright. Other agents' edits
  hot-reloaded the page during the timed runs (Figures 2 and 7 reset
  mid-run). I blocked the dev server's reload socket and repeated those steps,
  and deleted the two screenshots taken after a reset.
- Screenshots of every figure in light and dark, at 1280 px and 375 px, plus
  interaction states, are in `final-screens/` (`use-*` are the interaction
  states). No page overflow, no console or page errors. With reduced motion,
  no figure autoplays, and every result can be reached by stepping.
- Primary sources: the Redis 8.10.3 `redis.conf`, `server.c`
  (`writeCommandsDeniedByDiskError`), `aof.c` (the 2,000 ms postponement),
  `config.c` (`repl-rdb-channel` defaults to yes), `sentinel.c`, and the 6.2.0
  `redis.conf` for `disable-thp`. The redis.io pages on persistence,
  replication, Sentinel, latency and WAIT. The ElastiCache Multi-AZ page,
  including the reboot-clears-replicas text and the Valkey 9.0+ durability
  note.
- Redis 8.10.3 runs on ports 7178/7179 and 26175–26177. All have been stopped
  and their data deleted.
  - With no config file, `save` is `3600 1 300 100 60 10000`, and
    `repl-rdb-channel`, `repl-diskless-sync` and
    `stop-writes-on-bgsave-error` are all `yes`. This confirms the article.
  - The Figure 3 core: `SET … EX 3600`, `BGSAVE`, `DEL`, `kill -9`, restart.
    The deleted value came back with 3,598 s of TTL left. This confirms the
    article.
  - Three Sentinels with quorum 2 and `down-after-milliseconds 5000`, and a
    client polling every 100 ms through `get-master-addr-by-name`. The first
    successful `SET` came 6.52 s after `kill -9` of the primary. Logs:
    `+sdown` at about 5 s, `+odown` 1.15 s later, `+switch-master` 0.24 s
    after that. The article reports 6.3 s; this is consistent.
  - The Figure 10 fast restart, with three Sentinels at default settings and
    5,000 real keys. I killed the primary and restarted it at once, with no
    persistence. The replica held 5,000 keys at about 6 s and 0 keys by about
    8 s, after the 5 s diskless delay. All three Sentinels logged only
    `+reboot` and still reported the original primary. This confirms the
    article.
  - `WAITAOF 1 0 2000` after `INCR`, with `everysec`, 30 samples: median
    0.64 s, range 0.34–0.98 s. This is consistent with "up to about a
    second". The article's 0.88 s median was taken on a more loaded machine.
  - RDB load of about 1M keys with 100-byte values (119 MB file) took
    **0.55 s** at a load average of about 9. The article's 2 to 3 s were
    measured at a load average of 126–180 (evidence E1F). See minor 1.

## Blocking

None.

## Minor

1. **Load time is overstated, and the overstatement is turned into a general
   rule.** "Expect seconds per million keys rather than milliseconds" (snapshot
   section) and "take seconds per million keys to load" (closing bullet) come
   from runs at a load average of over 120. On the same laptop at a load
   average of about 9, a million 100-byte keys loaded in 0.55 s. This feeds the
   snapshot-versus-empty decision.
   *Fix:* "On my laptop a million small keys took about half a second to load
   when it was quiet, and 2 to 3 seconds when it was heavily loaded: expect
   hundreds of milliseconds to seconds per million keys, and measure yours."
   Change the closing bullet to "take time to load (about half a second per
   million small keys on my laptop)".

2. **Figure 11's 6-second failover is called "much better" and "never worse"
   than an empty restart, but that rests on one metric.** Counted in seconds
   above capacity, 6 s beats 19 s at 500 reads a second. Counted in reads
   beyond capacity, the 6-second outage sends about 9,000 against the empty
   restart's 4,300, because every request goes to the database at 2,000 a
   second (the repair notes record this). At 800 the figure itself says "about
   the same" (6 s against 5 s), which contradicts "never worse".
   *Fix:* change "much better" to "a shorter overload, though a deeper one
   while it lasts (2,000 reads a second against a peak of 1,330)". Change
   "never worse than" to "never meaningfully longer than".

3. **The opening asks for persistence to be turned on when Redis has it on by
   default.** The article later says, correctly, that Redis 8.10 saves on
   save points with or without `redis.conf`. A planned reboot sends SIGTERM,
   which would also have saved a snapshot on shutdown. So a reader who knows
   the defaults will wonder why the cache came back empty.
   *Fix:* in the first paragraph, add "It runs with persistence turned off
   (`save ""`), as many caches do".

4. **Shutdown-time saving is missing for the single-server case.** For planned
   work on one server without a replica, `SHUTDOWN SAVE` (or SIGTERM when save
   points are set) writes a snapshot at the moment of shutdown. It does this
   even with `save ""` when forced. That gives a warm restart whose only
   stale-delete risk is deletes attempted while Redis was down. This is a real
   option for the opening's kernel patch, and cheaper than adding a replica.
   *Fix:* add one or two sentences after the `FAILOVER` paragraph or in the
   defaults list: for a single server, `redis-cli SHUTDOWN SAVE` before a
   planned reboot, at the cost of load time and failed requests while it is
   down.

5. **Figure 7's failed-request line runs off the top of the chart.** The y
   axis tops out at about 13. Seconds with 14–15 failed requests are clipped,
   which leaves visible gaps in the dashed line at about 18, 31, 35 and 38 s
   (`use-07-after-failover.png`).
   *Fix:* fix the y maximum at 20, or derive it from the data.

6. **Figure 4's "Acknowledged, not on disk" readout can exceed "Writes
   acknowledged".** With `no`, I read 17 acknowledged and 18 not on disk at
   6 s, and 25 against 27 at the crash. The readout counts writes that have
   reached the page cache but whose acknowledgement has not yet reached the
   application.
   *Fix:* count only acknowledged writes, or relabel it "Written, not on disk".

7. **Figure 5's grey read dots have no legend entry.** The legend lists
   "Write or invalidation", "Cache hit" and "Stale value", but the moving grey
   dots between the replica and the readers are reads.
   *Fix:* add "Read" to the legend, as Figure 7 does with "Request or Sentinel
   ping".

8. **The full-synchronisation buffer limit describes the pre-8.0 path.** The
   article says (correctly) that since 8.0 the replica buffers the stream
   while it loads. It then says writes are buffered "up to
   `client-output-buffer-limit replica` (256 MB by default)" and the replica is
   dropped when that is exceeded. With the default RDB channel, the replica
   first buffers up to `replica-full-sync-buffer-limit`, which defaults to the
   same 256 MB. Only after that does the primary's output buffer grow, up to
   its own 256 MB. The advice to raise the limit for large, busy caches still
   holds.
   *Fix:* "…are buffered, on the replica since 8.0 and then on the primary, up
   to `replica-full-sync-buffer-limit` and `client-output-buffer-limit replica`
   (256 MB each by default)…". The sources already cite both settings.

9. **The transparent huge pages advice reads as an action, then says Redis does
   it.** "On Linux, also turn off transparent huge pages… Since Redis 6.2, the
   `disable-thp` setting (on by default) does this for the Redis process
   itself." This leaves the reader unsure whether to act.
   *Fix:* lead with the mechanism and say "Redis 6.2 and later disable them
   for their own process (`disable-thp yes`, the default); on older versions,
   or if that setting is off, disable them in the kernel."

10. **Optional: say in the figure that Figure 9's partition branch was not
    run.** The caption labels it correctly. But its first sentence describes
    the crash run, and "Every reply shown was observed" comes before the
    partition note.
    *Fix:* end the partition branch's first step with "(from the Sentinel
    documentation's example; not run)". Alternatively, move the partition
    sentence of the caption ahead of "Every reply shown was observed".

## Length

The article has about 6,700 words of prose by my count (the orchestrator's
figure is about 6,900), with 11 figures. Measured against the subject, which
is three systems (persistence, replication and Sentinel), each with
cache-specific traps, **the length is earned**, with three exceptions that
spend reader time without changing a decision:

- **"What you can now decide": the seven-bullet list (about 250 words).** It
  restates the six-item defaults list the reader finished one screen earlier,
  and the section summaries before it. Keep the shop's resolution paragraph and
  the forward link. Cut the bullets to two or three lines, or drop them.
- **The `everysec` slow-disk caveat appears five times:** in Figure 4's crash
  message, its caption, its text alternative, the prose and the closing
  bullet. Once in the prose and once in the figure is enough.
- **Mechanics of the full synchronisation in "Replicas"** (the 5-second
  diskless delay, the second connection since 8.0, `READONLY`). Only the
  buffering consequence feeds a decision (replica memory, buffer limits). The
  rest can shrink to a clause.

Together these come to roughly 300–350 words. Everything else feeds a
decision. That includes the stale-read derivation, the expiry-on-replica
experiment, the backlog arithmetic, replica selection and client discovery.

## Round-1 items

All round-1 required items are present in the rendered article:

- Figure 11's verdict is a labelled model result with a capacity control.
- The `everysec` slow-disk exception is stated.
- MISCONF is described as needing save points, and the AOF case is covered.
- Replica reads while the link is down are covered.
- Figure 7 labels the replica correctly.
- Figure 10 is consistent.
- Figure 2's neutral pages and its key are in place.
