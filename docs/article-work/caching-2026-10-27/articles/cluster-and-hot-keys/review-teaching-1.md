# Teaching review, round 1: Redis Cluster, sharding and hot keys

Reviewer: independent editor, 28 October 2026. Read against `brief.md`, the plan's
entries for articles 9–11, the full text of Gears and Load Balancing (with three
Load Balancing simulations and two Gears demonstrations used in a browser), and
the rendered draft at `/learn/databases/caching/cluster-and-hot-keys/` with
`CACHING_DRAFT_PREVIEW=1`.

Every figure was used: all options and slider stops of Figures 1, 4, 5, 6 and 7,
all four presets plus typed input in Figure 2, and every step of both variants
of Figures 3, 8 and 9. I took screenshots in light and dark at 1280 px and 375 px
(`review-screens/`, 36 files; the states cited below are in
`review-screens/states/`). No page errors, console errors or horizontal overflow
at either width. Under reduced motion nothing autoplays, and every stepped
figure can be completed with Next.

## Verdict

**Publishable after required fixes.** It has the right subjects, they come in a
sensible order, and the evidence is unusually strong: a measured failover
(Figure 4), a measured reshard table and a measured hot-key tool comparison
(Figure 6). It covers every coverage-map item and every addition from the
27 October map changes. One figure is wrong in a way the reader will see. Two
passages of prose contradict the figure the reader is looking at, and one claim
contradicts the collection's own introduction.

Counts: **3 required**, **16 suggested**.

---

## Required

### R1. Figure 1's hash ring is badly unbalanced because of the model's hash, and the prose blames chance

Evidence: `states/f1-ring4.png`. With "a hash ring" and 4 servers, almost every
one of the 96 cells reads **D**. Only 4 of the 96 shown keys move, yet the
readout says 30%. I ran `placement-model.mjs` in node. The ring's per-server
shares after adding a server are wildly uneven: 17/59/24% for 3 servers, and
6/6/17/17/21/6/8/9/10% for 9. The keys that move are 24% for 2 → 3 servers
(the expected figure is 33%), 30% for 4 → 5 (expected 20%) and 10% for 8 → 9
(expected 11%).

The cause is `fnv1a()` applied to near-identical short strings
(`server-0#1`, `server-0#2`…, `product:0`, `product:1`…). FNV-1a disperses
these poorly, so ring points and keys bunch together. The same ring built with
MD5 moves 17.2% for 4 → 5 and 11.8% for 8 → 9, as expected with 160 points per
server.

Why it matters: a newcomer comparing the three options will conclude that
consistent hashing piles almost every key onto one server. That is false, and it
is the exact property the figure is meant to teach. The prose then explains the
artefact as a property of rings: "with four servers, 30% of the keys change in
this run … how much it actually takes depends on where its points happen to
land". The text alternative says the same ("30% in this run, because where the
new server's points fall varies"). The model is deterministic, so "in this run"
also implies randomness that isn't there.

Fix: put a well-mixed hash under the ring. Apply a finaliser such as murmur3's
`fmix32` to the FNV output, or use any 32-bit hash with good avalanche, for
both the points and the keys. Then check that every server's share is near
1/N and that the moved share is near 1/(N + 1) at every slider stop. Add a test
to `models.test.mjs` asserting both. Rewrite line 45 and the text alternative to
the new numbers. If you want to keep the point that a ring's split varies,
attribute it to the number of points per server, which is the real cause.

### R2. The Figure 5 prose, and the opening, contradict what the figure shows

Line 165: "Move to 6, then 12 shards. The average halves each time; the tallest
column does not." Following that instruction, the reader sees the busiest node
go from **250k to 138k** between 3 and 6 shards. That is nearly a halving.
Between 12 and 48 shards it falls from 100k to 75k. So the tallest column does
fall. It falls more slowly than the average, then levels off. A reader told
"does not" who watches it nearly halve will distrust the rest of the paragraph.

The opening has the same overclaim (line 15): "Adding servers does nothing for
it." Figure 5 shows that adding servers does help the hot node, until the hot
key and its neighbours alone fill it.

Fix: for line 165, say that the average halves each time but the tallest
column falls more slowly and levels off near 75,000, because the hot key and the
other popular keys in its slot range go with it wherever it is. For line 15,
use "Adding servers cannot spread that one key's reads" or similar. It is
accurate and sets up the same question.

### R3. "s … is usually somewhere near 1" contradicts the introduction and has no source

Line 155 says the Zipf skew "is usually somewhere near 1". The collection's
introduction teaches that the exponent "has to be measured". It cites
Breslau et al. finding s between 0.64 and 0.83 in web proxy traces (the plan's
map change for article 1 says the same). A reader who has just read article 1
meets a contradiction, and this article's whole hot-shard argument depends on
s. Its own Figure 5 shows that s = 0.8 and s = 1.2 give qualitatively different
answers.

Fix: link back to the introduction's Zipf section instead of re-defining the
distribution from scratch. Say that s = 1 is a round example, not a typical
value. State what is known with a source (web proxy traces 0.64–0.83; key-value
cache workloads are often more skewed, and only if you have a source for that).
Then tell the reader to measure s from their own logs, which is the decision the
slider in Figure 5 actually informs.

---

## Suggested

### Teaching

**S1. Show the hottest key's share inside its column in Figures 5 and 7.** The
busiest column is filled magenta. The magenta readout is "The hottest key
alone", but the red readout is "Busiest node". So the colour links the column to
the wrong number. More importantly, the article's argument is that the hot key
sets a floor that sharding cannot remove, and that floor is never drawn. Stack
each column as "hottest key" plus "everything else" (or mark the hottest key's
load as a segment). The reader would then watch the "everything else" part
shrink with shards while the hot-key part stays put. Colour the "Busiest node"
readout to match the highlighted column.

**S2. Figure 9 does not show the overtaking it is named for.**
`states/f9-plain-last.png`: the GET arrives at Redis on row 1, the SET on row 2,
the invalidation leaves on row 3 and "v1 (data)" on row 4. Drawn as horizontal
arrows in that order, it looks as though Redis answered the GET with the old
value *after* processing the write, which would be a Redis bug. Draw the reply
as a sloped arrow that leaves Redis at row 1 and arrives at row 4, crossing the
invalidation. Alternatively, give the data and invalidation connections
separate lanes. The reader then sees the message being overtaken instead of
having to read about it in the step text.

**S3. Resharding and failover have no stepped figure, though the brief names
both.** Atomic slot migration (snapshot, stream, catch-up within the lag
threshold, write pause, handoff, trim) is told in one dense paragraph (line 110)
and measured in a table. A five- or six-step sequence figure with "key by key" /
"atomic" as its choice would let a newcomer see why ASM produces no `ASK` and
no `TRYAGAIN`. Figure 3 already has the actors. The cluster election (rank delay,
votes from a majority of primaries) would also step well, but it matters less
for decisions.

**S4. "and you can stop here" (line 29) sends away readers who need the rest.**
Near caches, `CLIENT TRACKING` and finding hot keys with `HOTKEYS` or
`--hotkeys` all apply to a single server. Say instead that such a cache needs no
cluster, and that the sections from "One hot key" onwards still apply.

**S5. Explain the gap between the 15-second timeout and 17–20 seconds of
detection.** Line 143 says 20 seconds to agree, against a 15-second
`cluster-node-timeout`. The difference isn't explained, yet it is what a
practitioner needs when choosing the timeout. One or two sentences are enough:
a node is first marked as possibly failing (PFAIL) after the timeout, and the
failure reports then have to reach a majority by gossip before it becomes FAIL.
Name PFAIL and FAIL, because those flags appear in `CLUSTER NODES` output and in
the logs the reader will read. Replace "is suspected by whoever noticed" (line
135) with that.

**S6. Give the reason for the `cluster-node-timeout` advice.** "a few seconds is
a common choice for a cache" (line 149) has no source and doesn't say what
limits how low it can go. Tie it to a decision. The timeout must exceed the
longest pause a healthy node can have: a fork for a snapshot or atomic slot
migration on a large dataset, a slow command, a VM stall. Otherwise a pause
causes a failover. Cite a source, or present it as reasoning rather than custom.

**S7. Say why atomic slot migration trims on the main thread when clients
track keys** (line 231). As written it is a stray fact. The likely reason is
that deleting the moved keys must send invalidations to tracking clients, so
their near caches drop keys whose new owner has no record of their reads. That
reason is what makes a near cache safe across a reshard, so it is worth a
clause. Verify it against `cluster_asm.c` first.

### Depth

**S8. Mention the alternative to cluster-aware clients.** The article assumes
the application uses a cluster-aware client. Many teams meet sharding through a
proxy (Envoy's Redis proxy, twemproxy) or a managed service's "cluster mode"
switch. Add one or two sentences on what a proxy changes, such as where
redirections and multi-key splitting happen, and on the added hop. The plan
lists client-side sharding only "as background", but this is a choice the reader
will face.

**S9. Big keys as the other cause of a hot shard.** A single large value or
collection skews memory and network per shard in the same way, and sharding
can't split it either. A sentence alongside the `CLUSTER SLOT-STATS` bullet would
complete the "hot shard" subject: per-slot key counts and memory, and
`redis-cli --bigkeys` / `--memkeys`.

**S10. Connection fan-out.** Each application process holds connections to
every primary, and to the replicas too if it reads from them. A cluster of 24
nodes behind 200 processes is thousands of connections. One sentence in "What a
cluster cannot do" or "Finding the right node" would help sizing. Article 11 can
own the numbers.

**S11. Trim trivia that changes no decision.** The "Why 16,384?" paragraph
(line 57) could be one sentence carrying its practical consequence: clusters are
designed for up to about 1,000 primaries. The `foo{{bar}}zap` and empty-brace
cases (line 65) could stay in the figure's "Odd braces" preset, with the prose
keeping only "only the first tag counts" and "empty braces are no tag". The
`MULTI`/`MOVED`/`EXEC` detail (line 84) could shrink to "the transaction is
discarded and none of it runs".

### Writing

**S12. Sentences to fix:**
- "The key-by-key times are less fair" (line 127): it's unclear what is less
  fair than what. Say "The key-by-key comparison flatters atomic migration:"
  and then give the reason.
- "which is the last thing an overloaded node needs" (line 195): a flourish.
  State the effect: "on an already overloaded node this makes the overload
  worse."
- "Sharding divides keys; it cannot divide one key's requests." (line 173): an
  aphorism after an explanation that has already made the point. Cut it, or fold
  it into the next sentence.
- Figure 8, step 8: "One invalidation per read, never more." This is a slogan,
  and with broadcast mode beside it, it is only true of default mode. Say "In
  default mode, each read earns at most one invalidation."

**S13. Headings: use searchable terms** as the brief asks. "Adding a shard to a
running cache" → "Resharding and slot migration". "When a node dies" → "Cluster
failover". "One hot key" → "Hot keys and hot shards". "A near cache that Redis
keeps up to date" → "Client-side caching with CLIENT TRACKING".

### Figures as artefacts

**S14. Figure 4.** (a) With "had no replica", the readout "Other shards' keys
unavailable for 10 s or more" reads as a measured duration. The outage is open
ended, and 10 s is just where the run stopped. Use "from 20 s until repaired" or
"until repaired". (b) In the "had a replica" run, the healthy-shard line jitters
between about 450 and 780 reads a second during detection, although the clients
read at a fixed 600. Explain it in the caption (bucket boundaries? client
retries?), or plot 1-second buckets. (c) At 375 px, "agreed: FAIL" and "replica
promoted" crowd the top of the plot and the 900 tick (`dark-phone-04.png`,
`light-phone-04.png`). Stagger them or move one below the axis.

**S15. Figure 5 at 48 shards.** The "average 13k" label overlaps the x-axis
labels "1" and "3" (`states/f5-s1-n4.png`). Place the average label at the right
end, or above the line.

**S16. Sequence diagram actor boxes.** "Node C (old owner)", "Node A (new
owner)" and "App A (near cache)" wrap to two lines of very small text inside
boxes sized for one line (Figures 3, 8 and 9, desktop). Widen the boxes, or put
"old owner" / "near cache" in the state line underneath, which already exists.

---

## Beside the references

It would sit acceptably beside Load Balancing and Gears once R1 to R3 are fixed.
The voice is plain and first-person, the prose tells the reader what to notice
("Start at 3 shards… Move to 6…", "Look at the other line just before the
replica is promoted"), and each figure isolates one choice. The measured figures
are more honest than either reference needs to be.

**The single biggest gap** is that nothing moves. The two references teach by
letting the reader watch behaviour unfold: requests queueing on a weak server,
a gear ratio changing under a slider. This article's central ideas are a hot
node saturating while its neighbours idle, a slot changing owner under live
traffic, and a cluster refusing reads during an election. All three are shown
as end states (column charts, a table, a recorded line chart) or as prose. The
column chart in Figure 5 does its job, and a stacked hot-key segment (S1) would
make it much stronger. But a reader can't yet *watch* the problem happen in the
way Load Balancing lets them watch round robin drop requests. If the writer adds
one live figure, it should be requests flowing to shards with the hot node's
queue growing (or a stepped atomic migration, S3). That would close most of the
gap.
