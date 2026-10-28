# Repair, round 1: Redis replication, persistence and failover

Reviews: `review-teaching-1.md` (4 required, 22 suggested), `review-technical-1.md`
(3 required, 9 suggested), with the orchestrator's notes. New checks are appended to
`evidence/replication-and-persistence.txt` under "repair-1" (RS1: replica reads with
`replica-serve-stale-data` yes/no on Redis 8.10.3, ports 7119/7185, data deleted;
RS2: source checks at 8.10.3 for `redis.conf`, `server.c`, `aof.c`, and the version
that introduced `disable-thp`).

Length: the prose is about 1.5% longer than before (roughly +100 words of about
6,850), after the required additions were paid for by cutting lab detail (S16) and
tightening the Figure 3, Figure 10 and choosing sections. Figure 9 gained a second
branch (the partition) and Figure 11 a capacity control.

## Required

| Finding | What I did |
| --- | --- |
| Tech R1 / note: Figure 11 verdict is a model result that reverses | Figure 11 now has a third control, "The database can take" (300, 380, 500, 800 reads a second, labelled 4×, 5×, 7×, 11× normal). The verdict reads "In this model, better than / about the same as / worse than restarting empty at once", with the capacity and multiple stated, and is decided on seconds above capacity (equal within 1 s counts as "about the same"; 380 gives a tie). At 300 the 31 s failover wins (31 against 45 s). The prose in #choosing walks the reader from 500 to 300, names the crossing at about 380 (five times normal) and says less traffic moves it the same way (half traffic, half-size database: 37 s). The Sentinel section now says 30 s "can cost the database more than an empty restart would (see the last section)". |
| Note: "extra reads" readout depends on the window | Removed it. Readouts are now seconds above capacity, peak reads a second (2,000 during an outage, 1,329 for an empty restart), and the empty-restart reference. The caption states the window (15 minutes; at these capacities all the seconds above capacity fall in the first three minutes) and the test checks that the count is unchanged over an hour. The `cost()` comment explains why extra reads are not shown. The x-axis is now −20 to 180 s (teaching S3). |
| Tech R2 / teaching S12: "loses nothing acknowledged under any policy" | Verified in `aof.c` (`flushAppendOnlyFile`, the 2,000 ms postponement) and recorded in RS2. Prose now says a process crash usually loses nothing, except `everysec` on a slow disk, where Redis holds writes in its own memory for up to two seconds while still replying. Same correction in Figure 4's text alternative, caption, crash message, model comment and the closing bullet. |
| Tech R3: MISCONF needs save points; AOF write errors | Added "and save points are configured (as they are by default)", and that `save ""` with an occasional manual `BGSAVE` is not exposed. The AOF paragraph now says a failed AOF write refuses every write, `DEL` included, with no setting to turn it off. Kept to one sentence each, framed for a cache. Source cited (`writeCommandsDeniedByDiskError`). |
| Teaching R1 / note: replica reads while the link is down | Measured (RS1). New paragraph: by default a replica that loses its primary keeps serving; a frozen primary left the link reported "up" and the old value served for the whole 60 s `repl-timeout`, and served after; `no` gives `MASTERDOWN` (a miss for cache-aside) but only once the link is known to be down, so it still served for those 60 s; monitor `master_link_status` and `master_last_io_seconds_ago` (normally ≤ 10 s, the ping period). "Small, unbounded" now reads "usually stale for milliseconds, but with no upper bound". Closing bullet updated. |
| Teaching R2: Figure 7 "replica of r1" | The model now stores "replica of Redis B". |
| Teaching R3: Figure 10's three times and one versus two replicas | One figure throughout: "within 10 seconds of the crash" (evidence s3, the Sentinel run). The caption says the run had two replicas and the figure draws one; prose says "In my run, with two replicas, both were empty…". |
| Teaching R4: Figure 2 shared pages before a child exists; legend | Pages are drawn as neutral "Page of Redis memory, no child" before the fork and after the child exits, and as shared only while it runs. Added a key line under the grid: "✓ already written to the snapshot file. Outlined: the page the child is writing now." |

## Suggested: applied

- Teaching S1: Figure 1 window widened to 750 s so the restart, the trough and the second wave fit in one frame (checked at 676 s); one sentence on the trough.
- Teaching S2: Restart Redis starts playback, and the step button is now 10 s instead of 60 s. Checked with reduced motion.
- Teaching S3: Figure 11 axis −20 to 180 s.
- Teaching S4: each Sentinel's ping to the primary is drawn once a second; after the kill it comes back as a cross. Legend now reads "Request or Sentinel ping / Answered / Failed or unanswered", and the prose asks the reader to watch the pings go unanswered.
- Teaching S5: Figure 10 lanes are now "Redis A" and "Redis B" (matching Figure 7), so the role swap no longer contradicts a lane title; "SDOWN, ODOWN" became "marked down"; Sentinels read "watching" after the promotion; "returns" became "back as replica". States were kept short ("5,000 keys", "0 keys") because role-plus-count states collided at 375 px.
- Teaching S6: Figure 6 "already has" segments are now the Redis colour at 40% opacity (visible in both themes); the "stopped here" label moved above the arrow; ring text 1 px larger.
- Teaching S7: already clamped in code (quorum and lost max follow the number of Sentinels); confirmed in the browser (max 3 at 3 Sentinels).
- Teaching S8: one-sentence derivation of 1 − e^(−wd) under Figure 5.
- Teaching S9: `Term` marks added for write, stale and fails at their first use near Figures 4, 5 and 7. Kept to three so the prose does not become a colour field.
- Teaching S10 / note on the long middle: the partition case is now a stepped branch of Figure 9 ("The primary: crashes / is cut off by the network"), so it needs no renumbering. It follows the Sentinel documentation's example and the caption says I did not run it. The partition paragraph shrank to point at it.
- Teaching S11: the muddled "output buffers" sentence now refers to the stream a replica buffers during a full synchronisation; one sentence in the backlog section on `client-output-buffer-limit replica` (256 MB by default, verified with `CONFIG GET`) and the dropped-and-restarted sync. I did not reproduce the loop on 8.10.3, so the sentence states the documented limit behaviour rather than a measured loop.
- Teaching S13: one sentence: for a cache, a TTL on every key and a replayable outbox cover the last-moment window of `SENTINEL FAILOVER`. I did not add `CLIENT PAUSE` because it adds a procedure for a window the cache already tolerates.
- Teaching S14: fsync, PSYNC (with `+CONTINUE`) and run ID defined at first use.
- Teaching S15: WAITAOF now "expect up to about a second; median 0.88 s on my loaded laptop".
- Teaching S16: cut the 16.50/21.86 timestamps, the 276/7/158 error counts, the SIGSTOP/EXISTS/TTL/expired_keys list, the AOF file sizes, the per-platform fork list, the 14.2 million bytes and similar detail; all remain in the evidence file.
- Teaching S17: the repeated "better cache, bigger shock" now appears once, after Figure 1, with its reason.
- Teaching S19, S20, S21, S22: applied (plain restatement of the snapshot result; informational Sentinel lede; the Sentinel timeline counted from the kill; WAIT "about the writes you have sent so far on that connection"; the list sentence in the opening).
- Tech S1: one sentence reconciling 1 ÷ (1 − h) (27×) with the model's 18× first second; closing bullet says "up to".
- Tech S2: Figure 11's caption says "with its data" assumes a current copy, as a promoted replica has; the prose says a half-minute snapshot load is no better "and staler".
- Tech S3: "about 31 seconds, what I measured with Sentinel's default 30-second down-after-milliseconds", and a sentence that both runs killed the process on one machine, so a dead host also adds client connection timeouts.
- Tech S4: dropped the three-key log quote from the prose and Figure 3; the caption and step now agree on the 20-second TTL and the 25-second wait.
- Tech S5: `disable-thp` added. Verified it first appears in `redis.conf` at 6.2.0 (absent at 6.0.0 and 6.0.20), so the article says "Since Redis 6.2".
- Tech S6: "common" replaced by a recommendation with its reason.
- Tech S7: "with this default diskless transfer" added to the RDB-channel sentence.
- Tech S8: fixed-address client gets connection errors while the primary is down and `READONLY` once it is back as a replica.
- Tech S9: ElastiCache wording now "when you reboot a primary yourself, which does not trigger a failover". Confirmed on the AWS page. I did not add the Multi-AZ/AOF exclusivity: it is true but does not change a decision the article already makes.

## Suggested: skipped or deferred

- Teaching S18 (ownership with article 11): no change here. Article 11's reviewer or writer should refer back to Figure 11 rather than build a second recovery-cost model.
- Teaching S22, third point: no change needed (the reviewer accepted the flourish).

## Conflicts and choices

- Teaching R4 suggested legend entries for the tick and the outline. The shared legend draws only kind glyphs, so I added a one-line key under the grid instead of editing the shared toolkit.
- The teaching review wanted role labels under the Figure 10 lanes. At 375 px "primary, 5,000" and "replica, 5,000" ran together, so I named the lanes Redis A and Redis B and left the roles to the arrows (promote, REPLICAOF) and notes.
- Figure 11's verdict uses seconds above capacity only. Reads above capacity would rank a 6-second failover below an empty restart at 500 (9,000 against 4,300), because the outage sends the database 2,000 a second. The prose and the peak readout state that intensity (2,000 a second against an empty restart's 1,330) rather than adding a second, conflicting verdict.

## Checks

- `node --test models.test.mjs`: 11 of 11 pass, with new assertions for the capacity crossing (300 failover wins, 380 tie, 800 short) and window independence.
- Screenshots of all 11 figures in light, dark, desktop and 375 px are in `screens/`. Interaction shots are `screens/f*.png`: Figure 1 under reduced motion and the second wave, Figure 2 before, during and after a snapshot, Figure 7 pings, kill and 5 s run, both Figure 9 branches, both Figure 10 branches (desktop and phone), and Figure 11 at 300. No console errors from the page itself; the only console error was the Astro dev toolbar's audit fetch.
- Read the article top to bottom after the edits.
- Dev server on 4419 stopped. Redis on 7119/7185 shut down, data deleted. Nothing committed.

## Still open

- Whether a +1.5% length change is acceptable. The remaining extra words are the required R1 paragraph and the capacity explanation in #choosing.
- The partition branch of Figure 9 is drawn from the documentation, not a run. It could be measured with a firewall rule on Linux if that standard is wanted.
