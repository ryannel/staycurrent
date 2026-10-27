# Teaching review, round 1: How Redis works (article 7)

Reviewer: independent editor, 27 October 2026. Read against `brief.md`, the
collection plan (articles 6 to 8 and the map changes) and this article's
`plan.md` and `writer-report.md`. Reference essays re-read in full (Gears and
Load Balancing page text). I used three Load Balancing simulations (1, 5 and 10,
each played and with the speed slider moved) and three Gears demonstrations
(the disc, the wrench with its slider, and a later gear demonstration, each dragged).

The rendered draft was read top to bottom at
`http://localhost:4457/learn/databases/caching/how-redis-works/` with
`CACHING_DRAFT_PREVIEW=1`. I used every control in every figure with
Playwright (scripts `scratchpad/pw/rv7-use*.cjs`). Screenshots are in
`review-screens/`: light and dark at 1280 px and 375 px for each figure, and
`review-screens/use/` for figure states after interaction. I found no page
errors and no horizontal overflow. With reduced motion, figures 1, 2 and 4 load paused.

## Verdict

**Publishable after required fixes.** This is a strong, honest and well-measured
article. It is built around a concrete incident that it fully pays off. Its
derivations are shown, and it keeps measured, derived and illustrative numbers
apart better than most writing on Redis. The required fixes are mostly in the
figures. In three places a figure shows something different from what the prose
tells the reader to notice. There is also one coverage-map gap, one opening promise
the article never pays off, and the ArticleRef import.

Counts: **8 required, 15 suggested.**

---

## Required

### R1. Use the shared ArticleRef, not the local copy

`src/articles/caching/how-redis-works.astro` line 3 imports
`../../components/caching/how-redis-works/ArticleRef.astro`. It is a copy of
the shared helper, and its header comment says it was made because no shared
helper existed. The shared helper exists now at
`src/components/caching/shared/ArticleRef.astro`. The two behave the same
today (the diff is one comment line), but the brief requires the shared helper
so that future changes to linking rules apply everywhere.

All six cross-references in the prose do go through `ArticleRef`: lines 32, 113, 156, 201, 241 (twice) and 259. No figure component links to another article.

**Fix:** change the import to `../../components/caching/shared/ArticleRef.astro`
and delete `src/components/caching/how-redis-works/ArticleRef.astro`.

### R2. Figure 1: the readouts lag the slider by about 20 seconds, so the main result is not visible when the prose says it is

The prose says: "Now drag the slider up. Each client adds about the same
again, until somewhere around 14 clients the gaps disappear. From there, adding
clients does not raise the requests a second at all." A reader who does exactly
this while the figure plays sees the following:

- After dragging from 3 to 14 clients and waiting 6 s: **56,000 requests a second, 43% busy**.
- After dragging on to 40 clients and waiting 6 s more: **78,000, 62% busy**.

Meanwhile the timeline is solid grey (`use/f1-clients-40.png`). The readouts
average over the last 2,000 µs of Redis time (`m.rates(Math.min(2000, …))`). At
the figure's slowdown of 10,000 times, that is 20 s of watching at 1×. They
reach 130,000 and 100% only after a reset and a long wait (`f1-steady-14`,
`f1-steady-40`: about 2.4 ms of Redis time). So the figure's central lesson, the
ceiling, contradicts the prose for the first 20 seconds after every change.

**Fix:** average the readouts over the same 400 µs window the timeline shows,
or restart the averaging window when the slider changes. Check that dragging
from 1 to 14 to 40 shows about 9,300, then 130,000, then 130,000 within a few
seconds at 1×.

### R3. Figure 3: SCAN with COUNT 10 is drawn as a solid busy thread, which is the opposite of what it shows; the figure also shows only one side of its trade-off

With "SCAN 10" selected (`use/f3-10.png`), the main-thread lane is a solid
red band from 0 to 50 ms. The data say the thread was busy 2% of the time,
in 2.5 µs pieces. The cause is that `strip.mjs` gives every block a minimum
width of 1 px. About 420 calls in a 50 ms window then fill the lane. The prose
beside it says "almost all the time between them is the round trip". The
note under the figure says "the thread is almost always free". The picture says
the reverse. COUNT 100 has the same problem to a lesser degree.

Second, the idea of this figure is a trade-off: how long the walk takes against
how long other clients wait. The 50 ms window shows only the waiting side. The
walk-time side (11.3 s against 0.43 s) appears only as a number in a readout,
so the reader never sees the cost of a small COUNT.

**Fix (the drawing):** draw blocks to true scale with no minimum width, and
show idle time explicitly. Alternatively, show a "share of the window busy" bar
beside the lane.

**Fix (the trade-off), and my answer on whether it should be interactive:**
yes, this figure should become a live replay. Its subject is behaviour over
time, and the measured walks are short enough to replay in real time with no
slowdown: KEYS takes 0.37 s, COUNT 1,000 takes 0.59 s and COUNT 10 takes 11.3 s.
Give it the same PING round-trip chart as figure 2 and add a progress bar for "keys
walked so far". With COUNT 10 the reader would watch the bar crawl for 11
seconds while the chart stays flat. With COUNT 100,000 the bar would jump in
ten steps while the chart shows ten 17 ms spikes. That shows the trade-off
instead of stating it. A cheaper alternative also works: keep the choice, and add
a small two-series chart against COUNT on a log axis, with walk time and slowest
PING as the two series, so that both costs are visible at once.

### R4. Figures 2 and 4: the PING chart draws a ramp, not a spike

Both charts join successive PING samples with a straight line. The PING that
waited behind the stall is plotted at its completion time. The line from the
previous normal PING to the stalled one therefore rises diagonally over 100 ms
in figure 2 and 195 ms in figure 4 (`use/f2-keys-after.png`, `use/f4-unlink.png`,
`use/f4-expire.png`). It reads as latency growing steadily. The prose says the
opposite: "nothing on the chart suggests anything was wrong, apart from one
spike". Only one PING was slow. The probe is closed-loop, so no PINGs were sent
during the stall.

**Fix:** plot each PING as a point or a vertical stem at its send time,
or at its completion time with no joining line. Alternatively, add a sample at
the stall's start at the old value, so that the line rises vertically. Then
check figure 4's DEL and expiry runs the same way.

### R5. Figure 2: "the spike is ten times taller" cannot be seen, and the 10-million case takes 50 seconds to watch

The prose says: "Try 10 million keys. The block lasts a second, and the spike
is ten times taller." The chart's y-axis rescales automatically (0 to 100, then
0 to 1k), so the 10-million spike is drawn at the same height as the
1-million one (`use/f2-keys-10M.png`). The reader can see "ten times" only by
reading the axis labels. Also, at 50 times slower, one second of KEYS takes 50 s
at 1× and still 13 s at the maximum speed of 4× (timed). The timeline is filled
with one red block for most of that time.

**Fix:** fix the y-axis at the largest key count's scale, about 1,000 ms (a log axis
would also work), or keep earlier runs' spikes on the chart, so that 100 ms and
1,000 ms sit side by side. Run large key counts at a smaller slowdown, or tell
the reader in the prose to raise the speed first.

### R6. The opening promises that hashes can cut memory by more than half; the article never shows it

The opening lists three puzzles. One is "why storing small values as fields of
a hash rather than as separate keys can cut their memory by more than half."
The article measures both halves of that comparison: about 85 B per key for a
20-byte value with its own key (figure 6), and 34 B per field in a listpack hash
(figure 7). It never puts the two side by side. "What you can now decide" asks
the reader to "use the listpack limits when choosing between hashes and
separate keys" without having shown what the choice is worth.

**Fix:** in the listpacks section, add one or two sentences with the
arithmetic: 20-byte values cost about 85 B each as separate keys and about 34 B
each as fields of a packed hash, so 60% less, until field 513. Also add a
reference line, "same values as separate keys (measured)", to figure 7's
chart. Note that figure 7 uses `MEMORY USAGE` while figure 6 uses `used_memory`
growth, and that for a single large hash the difference is one keyspace entry.

### R7. Coverage map: compact hashes (Redis 8.10) are missing

The plan's map changes say that article 7 "owns per-key memory measurement
and encodings, including compact hashes in 8.10". The research already contains
the facts and a measurement (group-D 7.D7, group-A A-3.16):

- a hash encoding that stores field names once per shared template (`template-listpack`), created with `HIMPORT` or converted automatically with `hash-min-template-entries`
- off by default (0)
- one-way, and never applied to hashes with field expiry
- about 25% less memory than a plain hash in the research measurement

The article does not mention it.

**Fix:** add two or three sentences after the encodings table that name
the version and the default, give the measured saving, and point to keys and
values for the design choice. It is off by default, so it does not need a
figure.

### R8. The used_memory and RSS table's last row contradicts figure 8 and is never explained

The table ends with "Everything deleted (`FLUSHALL`): used_memory 1 MB, RSS
192 MB, ratio 189". Figure 8's model, and the sentence after it ("Only deleting
nearly everything frees whole pages"), say that an empty page is returned to
the operating system. Drag figure 8 to 95% deleted and pages are marked
"returned" (`use/f8-0.95-0.png`). A careful reader therefore sees the real server
keep 192 MB with nothing in it, and a model that says it would not. The
article's only comment on this, that libc ignored `MEMORY PURGE`, comes later
and does not connect to the row.

**Fix:** after the table or after figure 8, say plainly that allocators can keep
freed pages rather than return them. On this laptop, libc malloc kept them even
after `FLUSHALL`. jemalloc on Linux returns them gradually in the background.
So the model shows the best case, which is when a page becomes returnable, and
not when it is actually returned. Add the same caveat to figure 8's caption,
which already says that real allocators "purge returned pages in the background".

---

## Judgement on the static figures

The caller counted four static figures. Five figures have `controls="none"`:
3, 6, 7, 8 and 9. I judged each.

| Figure | Idea | Static is right? |
| --- | --- | --- |
| 3. Walking a million keys | COUNT trades walk time against pauses for other clients | **No.** The walk time is behaviour over time, and the measured runs replay in real time. Make it live (see R3). |
| 6. What one key costs | Fixed overhead dominates small values | **Yes.** It is a function of size, not time. Suggested: add a small line chart of "share that is your value" against value size, with the current size marked, so the reader sees the whole curve without having to sweep the slider (S8). |
| 7. Packed or hashed | Encoding switches at a threshold, and memory per field doubles | **Yes.** The chart already shows the whole curve, and the slider marks a position on it. Animating the conversion would add little. It needs the comparison line from R6. |
| 8. Deleted keys, resident pages | Random deletion leaves no empty page | **Yes.** The deletion order is fixed and seeded, so dragging deletes more of the same keys and works as a step-through. A short animation of keys disappearing one by one would add drama, not understanding. It needs the R8 caveat. |
| 9. One stall, five tools | Each tool sees a different part of the stall | **Yes.** The idea is a set of viewpoints on a single moment, and a choice is the right control. |

Figure 5 is stepped rather than static, but it is the weakest figure (S1).

---

## Suggested

**S1. Figure 5 (I/O threads) teaches with seven steps what one sentence says,
and shows neither consequence.** A single request's path does not show the two
facts the section depends on: the ceiling rises, and a slow command still blocks
everyone. Consider replacing it with figure 1's timeline plus an "I/O threads:
off / 3" choice. Socket work would move to I/O-thread lanes, and the main-thread
lane would keep only the thin execution slivers and the KEYS block. Label it
illustrative, since there is no measurement of your own. If you keep the
sequence, cut it to four steps.

**S2. Figure 4: add the fourth case the prose discusses.** The prose measures
`lazyfree-lazy-expire yes` (a 7 to 24 ms residual) and then recommends turning
it on. The figure offers DEL, UNLINK and "TTL runs out" only. Add "TTL runs out,
lazy-expire on", which puts the block on the free lane. Also consider keeping
the last two runs visible, so that DEL and UNLINK can be compared directly. At
present the 400 ms window scrolls DEL away before UNLINK runs.

**S3. Figure 9 labels.** The choice "INFO stats" shows `INFO latencystats`
and `INFO commandstats`. `INFO stats` is a different section, so relabel it
"INFO latencystats". The span label "KEYS *: 106,972 µs" sits over a block
drawn at 100 ms. Either draw the block at 107 ms, or say in the caption that
the timeline length and the outputs come from different runs. The caption
already says that KEYS took 85 to 107 ms across runs.

**S4. Long Lua scripts and `MULTI` also hold the main thread.** The plan said
one sentence each, linking to article 8. Practitioners meet `BUSY` errors from
long scripts, so it is worth that one sentence in the slow-command section:
a script or transaction runs as one command, so a long one blocks like KEYS.

**S5. I/O threads count.** "leave one core spare (3 I/O threads on 4 cores, 7
on 8)" leaves the reader unsure what to type. The count in `io-threads`
includes the main thread (research 7.B3; figure 5's intro says "io-threads 4:
the main thread plus three I/O threads"). Say which value to set, and note that
redis.conf's own advice is ambiguous here.

**S6. Fork is understated.** "can pause the main thread for milliseconds on a
large dataset". The Redis latency page's own table gives about 9 ms per GB on
bare metal and over a second for 6 GB on old Xen virtual machines, and
research 7.F3 measured 6.8 ms for 152 MB here. Say "about 10 ms per GB on
typical hardware, far more on some virtual machines", and keep the link to
article 9.

**S7. Two missing latency notes from the Redis checklist.**
`--intrinsic-latency` must run on the server host, not the client (the prose
implies this but never says it). Transparent huge pages on Linux is the
classic cause of fork-related latency, and one sentence pointing to article 9
would cover it.

**S8. Figure 6: show the whole curve.** See the table above. A reader has to
sweep 14 stops to learn the shape. A small chart of bytes per key against value
size, with and without a TTL, would show it at a glance.

**S9. Numbers that drift from the data.** "a TTL ... cost between 20 and 40
bytes per key", but the quoted 100-byte case is 42 (201.4 − 159.3). The
measured range is 20.8 to 42.1, so say "20 to 42". "Redis's own accounting
agrees: INFO commandstats reported 0.05 µs" is not quite agreement with 0.2 µs.
Write "points the same way" or "is smaller still, because it times only the
command's function".

**S10. "maxmemory counts used_memory" needs its consequence.** The
fragmentation section says RSS is what runs the machine out of RAM, but does
not state the decision: set `maxmemory` well below the machine's RAM, leaving
headroom for fragmentation (ratio 2 after mass deletes, as measured). One
sentence, linking to article 11 for sizing.

**S11. Active defragmentation deserves two more sentences.** It is the
remedy a Linux practitioner reaches for after a mass delete. Say when to enable
it (sustained high `allocator_frag_ratio` with memory pressure), that it costs
main-thread CPU, and that it needs jemalloc. The current sentence carrying it
is also the densest in the article. See W5.

**S12. Use the Term component for the figure vocabulary.** The prose describes
the timelines in words ("Grey blocks are work on sockets ... The thin coloured
blocks are the thread executing a command") but uses `Term` only for Redis and
one PING. Mark "executing a command", "socket work", "PING waiting" and
"freeing memory" with `Term` at their first use, so that the text doubles as a
legend, as the brief's point 7 asks.

**S13. Figure 6 colour meaning.** The key name uses the `client` kind, which
across the collection means a request or client. Use `neutral` with a
different shade, or a distinct kind, so that the colour does not carry two
meanings.

**S14. Figure 2: make the waiting PING visible.** The wait is drawn as a 1 px
line under the KEYS block (`use/f2-keys-after.png`). The prose says "The PING
that arrives while it runs waits for all of it". Draw it as a visible bar in a
"PING" lane, as figure 9 does with its app and cli lanes.

**S15. Valkey wording.** "Valkey, the open-source fork of Redis" implies that
Redis is not open source. Since 8.0, Redis is available under AGPLv3 as one of
three licences (research 7.G1). Write "Valkey, a fork of Redis" or "the
BSD-licensed fork". Licensing belongs to article 11.

---

## Writing

The voice is mostly what the brief asks for: plain, first person, connected,
with ledes that state information. The derivation of *s* and *e* is a good
example of "shown, not asserted". Sentences that fail:

- W1. "Two practical defences follow. First, find your big keys before they find you" is an aphorism standing in for the instruction. Write "First, find big keys before they cause a stall".
- W2. "There is one more trap in the job, though: the deleting." is a teaser with an awkward noun. Write "The job's deletes can stall Redis too."
- W3. "The cost is the other side of the same fact: while one command runs, nothing else does." This is acceptable, but it is the section's flourish. Keep at most this one.
- W4. "Redis's own accounting agrees" (see S9).
- W5. "Redis on Linux is normally built with the jemalloc allocator, which rounds allocations to different sizes, reports its own fragmentation as `allocator_frag_ratio` in `INFO memory`, and is required for **active defragmentation** (`activedefrag yes`): Redis moving values out of sparse pages so that whole pages can be returned." That is four ideas in one sentence. Split it into three sentences.
- W6. "Try 10 million keys. The block lasts a second, and the spike is ten times taller." This is true of the data but not of the figure (R5).

Terms are defined at first use, in order: main thread, event loop,
pipelining, atomic, head-of-line blocking, time complexity, big key, cursor,
listpack, RSS. Two small exceptions. "hz 10" in figure 4's caption is
undefined; write "10 times a second". `epoll` and `kqueue` are named without
gloss, which is fine as an aside.

## Depth

The coverage-map subjects are reached at practitioner depth, with one
exception: compact hashes (R7). The article stops in sensible places. It leaves
out dict rehashing, the listpack byte layout and jemalloc size classes, none of
which changes a decision. The SCAN guarantees paragraph, with its empty page
and non-zero cursor, is exactly the kind of practitioner detail that is usually
missing elsewhere.

What a practitioner would still want is covered by S4 (scripts),
S6 and S7 (fork, transparent huge pages, intrinsic latency on the server),
S10 (maxmemory headroom) and S11 (when to use active defragmentation).

Candidates to cut if length matters:
- the commandstats 0.05 µs reconciliation, which could be one clause
- the second half of the I/O threads configuration paragraph, since `io-threads-do-reads` matters only to someone upgrading from Redis 7
- figure 5 in its current form (S1)

Ownership: the article stays inside its lane. It defers the
strings-or-hashes decision to article 3, the expiry cycle to article 4,
persistence to article 9 and round trips to article 8, each in a sentence and
an `ArticleRef`. The mention of `INCR` and `SET NX` as atomic is the right
length; it does not teach atomic operations.

## Beside the references

Mostly yes in voice, honesty and use of measurement. The incident framing does
what the fan and the wrench do in Gears: it starts from something the reader
recognises and returns to it at the end. The density of demonstrations is lower
than in either reference: about one figure per 550 words, against about one per
150 in Load Balancing.

**The single biggest gap: several figures state their result instead of
showing it.** The ceiling in figure 1 appears only after a long wait (R2).
Figure 3's trade-off is in readouts while its picture shows the reverse (R3).
Figures 2 and 4 draw a ramp where the prose describes a spike (R4). Figure 2's
"ten times taller" is visible only on an axis label (R5). In Load Balancing,
the reader sees round robin drop requests before any number is given. Fix these
four, and the figures will carry the article as the brief requires.
