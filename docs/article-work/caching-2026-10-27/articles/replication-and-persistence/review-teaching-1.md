# Teaching review, round 1: Redis replication, persistence and failover

Reviewer: independent editor, 28 October 2026. Read against `brief.md`, the plan's
entries for articles 8–10 and the map changes, the full text of Gears and Load
Balancing (with four of their demonstrations used: Gears' radius-ratio and
torque sliders, Load Balancing's first and fifth simulations played for
13 seconds, and three of its speed sliders moved to maximum).

Rendered at `http://localhost:4459/learn/databases/caching/replication-and-persistence/`
with `CACHING_DRAFT_PREVIEW=1`. I used every figure. In Figure 1 I restarted Redis,
stepped through to the second wave and changed the TTL. In Figure 2 I started a
snapshot with both write patterns. I stepped Figures 3, 9 and 10 through every
step, and both branches of Figure 10. In Figure 4 I tried each fsync policy with
both failures. I set all five delays in Figure 5 and ran 15 s at each. I tried
five combinations each in Figures 6 and 8. I ran Figure 7 at 30 s and at 5 s, and
tried both recovery modes in Figure 11 at four unavailability times. I also loaded
the page with reduced motion. Screenshots in light, dark and 375 px are in
`review-screens/`. No console errors. No horizontal overflow at 375 px. Nothing
autoplays under reduced motion.

**Verdict: publishable after required fixes.** 4 required, 22 suggested.

The article is strong. It frames everything against three things a cache must not
do (lose everything at once, serve deleted values, refuse writes), and each
mechanism is then judged against them. That gives the reader a decision rule, not
a feature tour. Several results are earned surprises in the Load Balancing
manner: a restored snapshot undoes a delete (Figure 3), a 31-second Sentinel
failover costs the database more than an empty restart (Figure 11), and a fast
supervisor restart wipes the replica (Figure 10). Each is shown first and then
explained. Measured and modelled numbers are kept distinct throughout. The
required fixes are small. The main suggested work is to cut lab-notebook detail
from the long prose stretches in the middle.

---

## Required

### R1. Replica reads: "small, unbounded" staleness omits the largest case (depth)

Under Figure 5: "So treat replica reads as eventually consistent: they can be
stale for some small, unbounded time after a write". This holds while the link
is up. It misleads when the link is down. With the default
`replica-serve-stale-data yes` (redis.conf, 8.10.3), a replica that has lost its
primary keeps answering reads from whatever it holds. It does so for the whole
`repl-timeout` (60 s, which the article measures two sections later), then while
it reconnects, and through a full resynchronisation unless diskless loading
swaps the dataset. During all that time no deletes arrive. A practitioner
deciding whether to send cache reads to replicas needs this more than the 1 ms
figure.

**Fix:** after the WAIT paragraph or in the backlog section, add two or three
sentences:
- a disconnected replica keeps serving its last state by default
  (`replica-serve-stale-data yes`);
- `no` makes it answer with a `MASTERDOWN` error instead, which a cache-aside
  client treats as a miss;
- monitor `master_link_status` and `master_last_io_seconds_ago` on replicas that
  serve reads.

Change "some small, unbounded time" to say it is usually milliseconds but
unbounded while the link is down.

### R2. Figure 7 shows an internal identifier in the drawing

With down-after-milliseconds at 5 seconds, after the failover the label under
Redis C reads "replica of r1". "r1" appears nowhere else, and the server is drawn
as "Redis B". **Fix:** render the display name ("replica of Redis B"), or keep
"replica" as the 30-second run does.

### R3. Figure 10's timings and replica count disagree with themselves and the prose

- The caption says the replicas were empty "between 5 and 10 seconds after the
  crash (between 4 and 8 seconds without Sentinel)".
- Step 6 says "In my runs this had happened within 8 to 10 seconds of the crash".
- The prose says "In my runs both replicas were empty within 10 seconds of the
  crash".

The figure draws one replica, but the prose and caption say "both replicas" and
"the replicas". A reader checking the figure against the text finds three ranges
and two topologies. **Fix:** take one range from the evidence file and use it in
all three places. Then either say the run had two replicas and the figure draws
one, or say "the replica".

### R4. Figure 2's opening state and legend contradict the readouts

Before any snapshot, the readout says "Child process: none", yet all 48 pages are
drawn in the style the legend calls "Page shared by Redis and the child". A
reader's first look at the figure therefore shows something that cannot exist.
During the snapshot, pages acquire a tick (✓) and the current page gets a heavy
outline. Neither is in the legend: only the status line mentions "(outlined)",
and the tick is never explained. The tick is how the reader sees the child's
progress, which is half the mechanism.

**Fix:**
- Draw pages in a neutral "Redis's memory" style until the fork, and switch to
  "shared" when the child exists.
- Add legend entries "✓ already written to the snapshot file" and "outlined:
  the page the child is writing".

---

## Suggested

### Teaching and figures

**S1. Figure 1 loses the spike when the second wave arrives.** The 600-second
window scrolls. At 676 s after the restart, the restart marker and the
1,330-read peak have left the chart, and only the second wave is visible (screen
`f1-b`, 189 reads a second, 2.6×). The prose asks the reader to "notice the
second, smaller wave", but the two can never be compared in one frame. The
chart also shows a long trough below normal load from about 150 to 600 s, which
the prose never mentions; only the text alternative explains it. Fix: widen the
window to about 750 s (or pin the restart at the left edge). Add one sentence on
the trough: every popular key was refilled together, so few expire until one TTL
later.

**S2. Figure 1: Restart Redis does nothing visible while paused.** After Reset,
or with reduced motion, pressing Restart Redis leaves "0 s since the restart.
Peak so far 0 reads" until the reader presses Play. The only step is 60 s, which
jumps past the whole peak in one go. Fix: have Restart Redis start playback, or
add a "Step 1 s" button.

**S3. Figure 11's x-axis compresses the decision into a sliver.** The comparison
that matters is in the first 120 seconds: a 6-s or 31-s block against the area
of the dotted curve above the capacity line. On a −60 to 900 s axis, the 31-s
block is a few pixels wide on desktop and barely visible at 375 px. The readouts
carry the result, but the picture does not. Fix: default the axis to about −10
to 150 s, or add a toggle that zooms to the first two minutes. The second wave
at 600 s is not needed for this comparison.

**S4. Figure 7: the Sentinels' watching is not drawn.** During the 30-second wait
the only motion is failing client requests. The three Sentinel boxes say
"watching" and are not connected to anything. The prose says each Sentinel pings
the primary every second; showing those pings, unanswered after the kill, would
let the reader see what the Sentinels are waiting for. The "Primary silent for"
readout partly does this. Fix: draw a faint ping from each Sentinel to Redis A
once a second, marked with a cross after the kill.

**S5. Figure 10's "stays down" branch: lanes and labels.**
- After the role swap, the lane titled "Primary" holds the replica and the lane
  titled "Replica" reads "5,000, primary". Fix: show "now replica" / "now primary"
  under the lane titles.
- The "SDOWN, ODOWN" chip overflows its box on desktop.
- At step 7 the Sentinels still read "failing over". It should read "watching" or
  "failover complete", as Figure 7 does.

**S6. Figure 6, dark theme: the "already has" segments are nearly invisible.**
Dark brown on charcoal (`dark-desktop-06`, `dark-phone-06`), and pale pink on
beige in light. These segments are the contrast the ring exists to show. The
"the replica stopped here" label is crossed by its own arrow on desktop and is
very small at 375 px. Fix: raise the fill contrast for that kind in both themes,
and move the label clear of the arrow.

**S7. Figure 8: quorum can be set above the number of Sentinels.** Quorum runs to
7 when Sentinels is 3. Fix: clamp the quorum (and Lost) maximum to the current
count. Optional: a one-line "majority = ⌊n/2⌋+1" readout would make the rule
visible.

**S8. Show the one-line derivation under Figure 5.** "A read is stale with
probability 1 − e^(−wd)" is asserted. The brief asks for small derivations to be
shown. Fix: "A read is stale if at least one write arrived in the last d seconds.
With writes arriving at random at w a second, the chance of none is e^(−wd)."
That is one sentence, and it makes the slider's result predictable.

**S9. Use the inline term component.** `Term` is used twice in 6,700 words
(Redis and database in the first paragraph). The figures use a consistent
vocabulary: write or invalidation (teal), cache hit, stale value (olive),
error (crimson), primary and replica (Redis red). The prose around Figures 4,
5, 7 and 9 could colour "stale", "write" and "failed" so that the text doubles
as the legend, as Load Balancing does.

**S10. Long figure-free stretches.** The section from "Expiry and memory on a
replica" to Figure 7 is about 800 words, with only the arithmetic ring between.
The section from Figure 8 to Figure 9 (client discovery, FAILOVER and SENTINEL
FAILOVER) is about 550 words. The network-partition paragraph has no picture,
though it is the case readers find hardest. Not every paragraph needs a figure.
But a stepped partition sequence (old primary isolated with one client, writes
accepted, demoted on heal, writes discarded) would make the last remaining
failure mode as concrete as Figure 9. Alternatively, cut detail (see S16).

### Depth

**S11. Clarify which "output buffers".** "Give replicas the same memory as the
primary, and more for the output buffers they use" is muddled. The output buffer
for a replica lives on the primary; Figure 9's step 2 says so correctly. What
the replica holds locally since 8.0 is the buffer of the stream while it loads
over the rdb channel. Fix: name the one meant. Consider adding
`client-output-buffer-limit replica` (default 256mb 64mb 60). A primary drops a
replica that exceeds it during a full sync, and the replica then starts another
full sync. This full-sync loop is a classic production failure for large
caches, and it fits the backlog section's "size it for the breaks you expect".

**S12. "Crashing Redis loses nothing that was acknowledged, under any policy" may
be too absolute.** The article itself notes that with everysec, Redis postpones
the write() for up to two seconds while an fsync is still running. If replies
are still sent during that postponement, a process crash in that window loses
acknowledged writes. In `beforeSleep`, client replies are flushed after
`flushAppendOnlyFile`, which can return without writing. Please confirm against
`src/aof.c` and `server.c` at 8.10.3. If confirmed, add "except during a
postponed write on a slow disk" to the prose and to Figure 4's crash message.

**S13. Planned failover: say how to close the last-moment window.** The article
recommends SENTINEL FAILOVER before maintenance and notes that it can lose a
write or delete from the last moment. A practitioner will ask how to avoid that.
Consider one sentence: pause writes on the primary briefly (`CLIENT PAUSE ...
WRITE`, Redis 6.2+) and check that the replica's offset has caught up before
issuing it. Or say plainly that for a cache this window is accepted and covered
by TTLs and the outbox.

**S14. Define fsync, run ID and PSYNC at first use.** "fsynced" is used before it
is defined; give it a clause ("fsync, the system call that forces a file's data
from the page cache to the disk"). "Lowest run ID" (Sentinel's tie-break) is
never defined. "PSYNC" appears in Figure 10 and "+CONTINUE" in Figure 6, but
neither is in the prose. A clause each in the backlog section would do.

**S15. Unexplained number: WAITAOF median 0.88 s.** With everysec, a reader
expects about half a second on average to the next fsync. 0.88 s invites a
question the article does not answer. Explain it (for example, the fsync timing
under load on that laptop), or give the range and say it is roughly up to one
fsync interval.

### Cuts

**S16. Trim lab-notebook detail that changes no decision.** Each of these costs
reading time and could move to the evidence file or a caption:
- "in my run the replica asked at 16.50 seconds past the minute and the transfer
  started at 21.86"; "about 5 seconds later" is enough.
- "my incremental file was 27,249 bytes; after BGREWRITEAOF the base file was
  152 bytes".
- "My client saw 276 connection errors while the primary was down and 7 'master
  not found' errors"; one clause would do.
- "got 158 READONLY errors before it was pointed at the new primary".
- The full SIGSTOP / EXISTS / TTL / DBSIZE / expired_keys list in "Expiry and
  memory on a replica" could be one sentence of result.

Together these would take a few minutes off a 27-minute read without losing a
decision.

**S17. Repeated point.** "The better the cache works, the larger the shock when
it is lost" (arithmetic paragraph) and "So a cache that works better is a bigger
shock to lose" (after Figure 1) say the same thing. Keep the second, which the
reader has just seen, and end the first at "100 times".

**S18. Ownership boundary with article 11.** Figure 11 and "Choosing what a cache
should run" stay on the side of this article's map entry (restart cost, and
replica versus a larger or rebuilt cache). Ask article 11 to refer back to
Figure 11 rather than build its own recovery-cost model.

### Writing

**S19.** "So for a cache, a restored snapshot is fresh about TTLs and stale about
everything else." This is a coined antithesis standing in for the explanation
just given. Replace it with the plain statement: "So a restored snapshot drops
keys whose TTL has passed, but brings back every other value as it was when the
snapshot was taken."

**S20.** "A replica is only half of high availability." This is a slogan lede.
The brief asks for ledes that state information. Fix: "A replica holds a copy,
but nothing yet switches to it when the primary fails."

**S21.** The paragraph after Figure 7 has a sentence hard to parse because of its
chained "it"s: "they agreed it was objectively down about 0.1 seconds after the
first of those, elected a leader about 0.3 seconds after it, and promoted the
replica about a second after it." Split it into a short timeline: "30.07–30.18 s:
each Sentinel marks it down. +0.1 s: objectively down. +0.3 s: leader elected.
+1 s: replica promoted." Or give the offsets from the kill.

**S22.** Smaller points:
- "WAIT tells you about one write" is imprecise. WAIT covers all earlier writes
  on that connection; say "about the writes you have sent so far".
- The second opening paragraph, "Redis can save its memory to disk in two ways,
  and keep copies on other servers, and fail over to one of those copies
  automatically", reads more easily as a list sentence: "Redis can save its
  memory to disk in two ways, keep copies on other servers, and fail over to a
  copy automatically."
- "If your database could take the spike, losing the cache would be a non-event
  and you could stop reading here" is fine as the section's one flourish.

---

## Judgement against the five questions

1. **Teaching.** A newcomer can follow the main argument from the figures alone:
   restart shock (1), copy-on-write cost (2), deletes undone by restore (3),
   fsync policies (4), staleness against delay (5), backlog arithmetic (6), the
   30-second wait (7), voting rules (8), lost delete (9), wiped replica (10), and
   the cost comparison (11). Each figure isolates one variable with one or two
   controls, and the prose names what to watch ("Leave the figure running and
   notice the second, smaller wave", "Try two Sentinels with a quorum of 1").
   Terms mostly arrive when needed (copy-on-write, page cache, replication ID,
   SDOWN/ODOWN, quorum). The exceptions are in S14. Readers are most likely to
   lose the thread in the 800-word middle (S10, S16).
2. **Depth.** Every coverage-map item is covered, including WAITAOF, replica
   expiry and the choice between a replica and a larger or rebuilt cache. The
   main missing practitioner points are disconnected replicas serving stale
   data (R1) and the replica output-buffer full-sync loop (S11). Lab detail
   could be cut (S16). The article stays within its boundaries and links to
   articles 2, 4, 5, 6, 7, 10 and 11 rather than teaching their subjects.
3. **Writing.** Plain British English, short sentences, informational ledes,
   first-person measurements stated as such. Two coined lines (S19, S20) and one
   hard sentence (S21).
4. **Figures as artefacts.** They work in both themes and at 375 px. The controls
   are labelled, the captions say what is modelled and what is measured, and the
   text alternatives convey the results with numbers. Defects are R2, R3 and R4,
   plus S1–S7.
5. **Beside the references.** Yes. The figures are real instruments, and the
   surprises are earned. The measured runs give it an authority Load Balancing's
   simulations do not claim. The single biggest gap is density in the middle.
   From Figure 5 to Figure 9 the article becomes a sequence of "I froze X and saw
   Y" paragraphs with few demonstrations. Gears and Load Balancing never ask the
   reader to read that long without something to watch. Cutting the trivia
   (S16) and giving the partition case a stepped figure (S10) would close most
   of it.
