# Final review, round 2: Redis Cluster, sharding and hot keys

Reviewer: independent pre-publication reviewer, 28 October 2026. I read the
brief, the full text of Gears and Load Balancing (and used five of their
demonstrations), and this article's plan entry and neighbours before reading the
article. I read the round-1 reviews and repair note only after forming the
judgement below, to check that their required items were done; they were.

## Verdict

**Publish.** No blocking problems. Nine minor items, each with a concrete fix,
none of which would mislead a reader or make a figure unusable. Two of them
(M1, M2) are the cuts I recommend for length.

## How I checked it

- Rendered at `http://localhost:4480/learn/databases/caching/cluster-and-hot-keys/`
  with `CACHING_DRAFT_PREVIEW=1`. Every figure screenshotted in light and dark
  themes at 1280 px and 375 px (`final-screens/`, 40 images). No console errors,
  no page errors, no horizontal overflow at 375 px.
- Used every control: all three placements at every server count 2 to 8
  (Figure 1); all four examples plus a typed set of edge-case keys (Figure 2);
  every step of both MOVED and ASK sequences, all 15 steps of atomic migration,
  both tracking modes and both race variants (Figures 3, 4, 9, 10); every
  failover option (Figure 5); every shard count at every skew (Figure 6); every
  tool view (Figure 7); every remedy (Figure 8). Read all ten "What this shows,
  as text" alternatives; each conveys its figure's result.
- Redis 8.10.3, a three-primary cluster on ports 7191 to 7193 and a standalone
  server on 7190, `--save ''`, temporary directory, all shut down and deleted
  afterwards. Confirmed: `CLUSTER KEYSLOT` for every key Figure 2 shows,
  including `foo{}{bar}` 8363, `foo{{bar}}zap` 4015, `foo{bar}{zap}` 5061,
  `{}x{y}` 2166 and `a{}b` 13694, all matching the figure; the default slot
  ranges 0–5460, 5461–10922, 10923–16383; `CROSSSLOT` on a two-slot `MGET`;
  `ERR SELECT is not allowed in cluster mode`; the eight `views:42:N` parts land
  in eight slots across all three nodes (2, 2 and 4); `HOTKEYS START METRICS 2
  CPU NET COUNT 10` and the shape of `HOTKEYS GET`; `CONFIG SET
  cluster-slot-stats-enabled "cpu net"` succeeds at runtime and adding `mem`
  fails ("memory tracking cannot be enabled at runtime");
  `cluster-slot-migration-handoff-max-lag-bytes` defaults to 1048576 (the
  figure's "within 1 MB"); `redis-cli --hotkeys` without an LFU policy fails
  with the quoted message; `CLIENT TRACKING ON NOLOOP` behaves as the article
  says (no message after a write by another client until the key is read
  again).
- Redis source at 8.10.3: `cluster_asm.c` (active trim on the main thread when
  `server.tracking_clients != 0`, because tracking cannot invalidate a slot);
  `redis-cli.c` (`CLUSTER_MANAGER_ASM_MIN_VERSION "8.4.0"`, `CLUSTER MIGRATION
  IMPORT`); `cluster_legacy.c` (election delay 500 ms + random 0–500 ms + rank ×
  1000 ms; replica validity check; read-only down state).
- redis.io: HOTKEYS (since 8.6.0; the note that redis-py and go-redis cluster
  clients don't support it), CLUSTER SLOT-STATS (since 8.2.0; unsupported on
  Redis Software and Cloud), the client-side caching introduction (library
  versions) and the redis-py connection page (RESP3, Redis 7.4 or later).
- Arithmetic: H(100,000) ≈ 12.09, hottest share 8.27%, 49,600 reads a second;
  s = 1.2 gives about 118,000 and s = 0.8 about 13,000; the near-cache figure's
  269,000 reads reaching Redis follows from H(1,000)/H(100,000) ≈ 0.62 of reads
  replaced by 40,000. `N ÷ (N + 1)` and `1/(2N − 1)` are correct.
- Measured numbers in the prose and the migration table match
  `evidence/cluster-and-hot-keys.txt` (12,125 and 12,298 reads, 180,016 and
  209,343, the 3.30/7.59 and 1.32/20.33 ms percentiles, 883 ms rank #0,
  236,334 of 540,042, 268/639 µs).

## The two questions

### 1. Does the hot-key section teach without a live simulation of a hot node?

Yes. Its absence does not leave the reader unable to see the main idea.

The main idea is that sharding divides keys, not one key's reads, so the
busiest node stops shrinking at the hot key's load and the usable share of the
cluster collapses. Figure 6 shows exactly that and lets the reader find it
themselves: drag from 3 to 48 shards and the dark block at the foot of one
column stays the same height while every other column shrinks to nothing, and
the "usable share" readout falls from 80% to 17%. The skew switch then shows the
case where no shard count is enough (s = 1.2 puts 118,000 reads a second on one
key, above one node's capacity). The prose tells the reader where to look at
each stop. Figure 8 then applies the four remedies to the same model, and the
near-cache state, with every column level at about 22,000, is as memorable a
result as anything in the article.

What a live simulation (requests flowing to shards, one queue growing) would
add is the feel of overload: queueing and latency on the hot node. That is the
Load Balancing style, and the brief prefers live simulations for load. But no
decision in this article depends on queue dynamics; the decisions depend on
shares of load, which a steady-state column chart shows more exactly than
moving dots would. I would not hold publication for it. If a cheap improvement
is wanted, animate the columns between slider stops so the reader sees the hot
block hold still while the others fall, and add the missing legend entry for
the ✕ marker (M4).

### 2. Is the length (about 7,000 words) earned?

Mostly. My count of the rendered prose, excluding figures and sources, is about
7,500 words over twelve sections. Most sections change a decision: failover is
the longest (about 900 words) and every paragraph ends in a setting to choose
(`cluster-require-full-coverage`, `cluster-node-timeout`, replica count,
`CLUSTER FAILOVER`). Three passages spend reader time without changing a
decision, and cutting them would save about 450 words:

- **Resharding, the latency rows and their caveat** (M1). The table's two
  percentile rows and the paragraph explaining why they are "weaker evidence
  than they look" cost about 200 words to present numbers the article then
  disowns. The decision rests on the robust rows (time, every read a hit,
  redirections, no errors) and Redis's benchmark.
- **Client tracking, `OPTIN`, `NOLOOP` and `REDIRECT`** (M2). About 250 words of
  protocol detail for library authors, in a section that then says "You rarely
  send these commands yourself" (and redis-py's built-in cache implements
  neither opt-in nor broadcast). Keep one sentence each: the `OPTIN` per-command
  trap, and that RESP2 needs a second connection, which Figure 10 relies on.
- **Placing keys, the ring's share bounds** (minor, about 60 words). "Within a
  fifth of an equal share … from a tenth … to three and a half times" is a
  property of the model's ring, background the plan asked to keep brief.

The HOTKEYS CPU anomaly (product:4976) is borderline: it earns its place because
it leads to "prefer the bytes ranking", but it could be two sentences.

## Blocking

None.

## Minor

**M1. Shorten the resharding measurement.** Drop the "99th percentile read
latency" row and the four sentences that qualify it ("The latency rows are
weaker evidence … contention for the processor, not just the protocol"). Keep
the time, reads-all-hits, redirections and errors rows, then the Redis benchmark
sentence. Saves about 200 words and removes the reader's work of discounting
numbers.

**M2. Compress the tracking options.** Replace the `OPTIN` and `NOLOOP`/RESP2
paragraphs with about three sentences: `OPTIN` tracks only the one command after
`CLIENT CACHING YES`, so a client that caches several reads after one `YES` is
caching untracked keys; `NOLOOP` suppresses a client's own invalidations; RESP2
clients need a second, redirected connection, which is the arrangement Figure 10
shows going wrong. Saves about 200 words.

**M3. `CLUSTER SLOT-STATS` does not name the key.** "Since a hot slot usually
holds one hot key, it finds that too" overstates it: in a cache of ten million
keys a slot holds about 600. Write: "It names the slot; on 8.6 or later,
`HOTKEYS START … SLOTS 1 <slot>` then names the key, or `--hotkeys` on that
node."

**M4. Figure 6 and 8 markers and labels.**
(a) The ✕ above a column has no legend entry; add "✕ over one node's capacity".
(b) At 12 shards (s = 1) the busiest node is marked ✕ while the prose says
"exactly at its limit"; either say "just over its limit" or show it as full,
not over. (c) At 48 shards the average label reads "average 13k" at s = 1 and
"average 12k" at s = 0.8 for the same 12,500; round both the same way, or show
"12.5k". (d) The "average" label sits over the top of column 1 at 12 and 48
shards (light and dark); move it to the right end or give it a background.
(e) At 3 shards every column runs over the capacity line, which disappears
behind the bars; draw the line above the bars.

**M5. Copies must land on different nodes, not just different slots.**
"Stored four times each … in different slots" is the advice a reader will
follow. Four copies in random slots on twelve shards share a node about 40% of
the time, and then relieve less. Add: "choose the suffixes so the copies' slots
are on different nodes, and check with `CLUSTER KEYSLOT`." (The model happens to
place product:0's four copies on four nodes, which the text alternative states.)

**M6. A minority-side primary and `cluster-allow-reads-when-down`.** "A primary
cut off from the majority … stops serving … whatever the full-coverage setting"
is true for writes, but with `cluster-allow-reads-when-down yes`, introduced two
paragraphs earlier, it still serves reads (`CLUSTER_REDIR_DOWN_RO_STATE` in
`cluster.c`). Write "stops accepting writes, and reads too unless
`cluster-allow-reads-when-down` is on".

**M7. The closing contrast with key-by-key resharding.** "On Redis 8.4 and
later a shard can be added to the running cache without a single miss" implies
older versions cause misses, but the article's own key-by-key run had every read
a hit. The difference is redirections, retries and time. Write "without a
single miss and in seconds rather than minutes".

**M8. `--hotkeys` during an incident.** Its error text warns that LFU counters
take time to adjust after switching policy. A reader on an LRU cache who
switches to LFU mid-incident starts from counters that still hold LRU data, so
the first readings can mislead. One clause in the `--hotkeys` bullet: "and
after switching to LFU during an incident, give the counters some traffic
before trusting them; on 8.6 or later, use `HOTKEYS`, which needs no policy
change". (I did not measure how long the adjustment takes.)

**M9. Small figure legibility.** Figure 10's sloping reply arrow crosses the
"v1 (data)" and "invalidate (inv.)" labels at both widths; offset the labels
above their arrows or end the slope one row earlier. Figure 7 at 375 px clips
the "not listed" value at the right edge in the LFU and bytes views; let the
value column wrap or shorten to "—" with the explanation in the readout.

## Required items from round 1

Skimmed after forming the judgement above. Every required item in both round-1
reviews is done: the ring now uses a well-mixed hash and moves 18% at 4 → 5;
Figure 5's prose matches the chart (FAIL at 20.0 s, 21 s unavailable, the
one-second stop of healthy shards); the skew claim is sourced to Breslau et al.
and s = 1 is presented as convenient, not typical; the resharding table compares
like windows; `OPTIN` is described per command; the write-hot key is split
without a hash tag; the near-cache library advice names RESP3, Redis 7.4 or
later and the Valkey consequence. The live hot-node simulation was the only
proposal left unbuilt; see question 1.

## Counts

Blocking: 0. Minor: 9.
