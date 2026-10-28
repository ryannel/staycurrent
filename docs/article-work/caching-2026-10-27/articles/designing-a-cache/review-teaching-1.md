# Teaching review, round 1: Designing a cache: a worked example

Reviewer: independent editor, 28 October 2026. Rendered at
`http://localhost:4462/learn/databases/caching/designing-a-cache/` with
`CACHING_DRAFT_PREVIEW=1`. Source: `src/articles/caching/designing-a-cache.astro`
and `src/components/caching/designing-a-cache/`.

**Verdict: publishable after required fixes.** 6 required, 14 suggested.

## What I did

- Read the brief, the plan entries for articles 10 to 12, and the article plan.
  Read the full text of Gears and Load Balancing. Used the Gears radius-ratio
  disc demo (dragged the knob), Load Balancing's speed-slider demos and its
  dynamic weighted round robin simulation (played it, shuffled server power).
- Read the article top to bottom. Used both figures in every state the prose
  walks through. Scripts: `scratchpad/pw/dc1-use.cjs`, `dc1-use2.cjs` and
  `dc1-phone.cjs`. Screenshots are in `review-screens/`: the shot.cjs set
  (light/dark × desktop/375 px), plus `use-f1-*` and `use-f2-*` for each state.
- Re-ran the Figure 1 model in node for every number the prose quotes, and ran
  `models.test.mjs` (6/6 pass). Independently recomputed the Zipf rates: top
  product 30.1/s, median once every 2.3 h, 4,152 products read at least once a
  minute taking 59.2% of reads, 19.6% of products read at least hourly. All of
  the article's numbers match.
- Checked all 33 `ArticleRef` anchors. Every one resolves to a real `id` and
  lands on the section that holds the claim. I read the target passages in
  caching-patterns, expiration-and-eviction, invalidation, stampedes,
  replication-and-persistence, clients-and-pipelining, cluster-and-hot-keys,
  operating-a-cache, keys-and-values and the introduction.
- Reduced motion: Figure 2 does not autoplay (Time 0.0 s after 2 s, button reads
  Play). There were no console errors and no page overflow at 375 px.

## Density: two figures for about 6,500 words

For a capstone, most of this article *should* be prose and tables. What to
cache, keys, clients, topology arithmetic and access control are decisions with
reasons and links. Figures there would re-teach what other articles own. The
design-on-one-page table does the summary job well.

The density fails in two places, both where this article teaches something no
other article does:

1. **The catalogue-wide TTL cap** (`#ttl`, lines 78 to 95). This is the
   article's headline surprise, and it is delivered as a table and a paragraph
   of figures (4,152 products; 59%; 80% of products, 19% of reads). Figure 1
   shows the consequence but not the cause. Here a figure should replace prose
   (R4).
2. **The sensitivity section** (`#what-would-change`, the skew and traffic
   paragraphs). It reads out numbers the reader could produce with two more
   controls on Figure 1 (S1).

Figure 2's walkthrough is the opposite problem. The figure is good, but about
400 words of chained instructions (lines 165 and 167) make the reader hold a
script while scrolling between the buttons and the charts (R5).

Can a newcomer follow the main decisions from the figures alone? Partly. Figure 1
carries requirement → budget → freshness mechanism → TTL → memory → checkout,
and the bar makes "every decision spends one budget" visible at a glance.
Figure 2 carries the failure plan. A figures-only reader would miss *why* a
one-minute TTL fails (R4). They would also miss the stampede, eviction and
topology decisions, which is acceptable because those belong to earlier
articles.

## Required

**R1. The relay-lag alert contradicts the stock requirement.** In `#watching`
(line 175): "If it passes a minute, pages are showing prices older than the
requirement allows". In `#freshness` (line 113): "a gap of a second or so …
inside the one-minute target". The relay also sends the stock deletes (the
relay's ACL covers `~shop:stock:*`, and evidence E3 shows "A sale deletes the
stock key" as `shop-relay`). The requirement table gives stock on the product
page 5 seconds. A one-minute alert lets stock run twelve times past its target
without anyone being paged. *Fix:* alert when the oldest unsent delete passes a
few seconds (the stock target). In `#freshness`, say the relay gap must stay
inside the 5-second stock target as well as the price target.

**R2. "With persistence off there is no fork to allow for" contradicts the
replication article.** See `#memory`, line 133. The design has a replica.
Redis replication, persistence and failover states that a full synchronisation
forks the primary ("the primary forks, the snapshot crosses the network").
Diskless sync forks as well. *Fix:* "Persistence is off, but a replica's full
resynchronisation still forks the primary, so allow for copy-on-write while it
runs; with fills the only writes, an 8 GB server covers it."

**R3. "Read replicas for checkout" breaks the article's own rule.** See
`#what-would-change`, line 212. Checkout reads the database precisely because
its price and stock may not be stale "at all". Asynchronous read replicas lag,
so they reintroduce the same staleness through a different copy. Also, "the
uncached checkout reads become the largest item in the budget, 120 queries a
second" is wrong: 120 is all of checkout's queries (80 reads plus 40 order
writes). *Fix:* "a bigger database, or moving reads that tolerate lag to
replicas so the primary keeps checkout"; "checkout's queries, 120 a second".

**R4. The central surprise needs its own figure.** As argued above, the
one-minute TTL capping hits at 42% "however much memory" is the thing a reader
must *see*. Right now they take it from a table. *Fix:* add a small figure
before Figure 1. Show reads a second for each product by popularity rank (log
axes, 2,000,000 products, exponent 0.9). Add one control, the TTL (1 min …
24 h), which draws the line *r* = 1/*T*. Shade the reads from products below
the line, which mostly miss. Give two readouts: the hit ratio from summing
*rT*/(1+*rT*), and the share of reads from products read less than once per
TTL. The prose can then say "drag the TTL to an hour and notice that most
products are still below the line" and drop most of line 91. Keep the TTL
table only in the text alternative. This is also where Breslau's flatter
exponents would make sense as a second control (exponent 0.8 / 0.9), which
answers "measure the exponent before choosing memory".

**R5. The Figure 2 walkthrough asks the reader to read without return.**
Line 165 (177 words) chains four experiments: one server; one limit for all;
no limit; limit back on while stuck plus skip ahead. Line 167 (225 words)
chains another four: deploy all at once; ramp; 1.5× with no limit; checkout
first again. Each experiment needs Reset, two or three switch changes, Skip
ahead and an incident button. On a 375 px screen, "Lose the primary" sits
508 px below the top of the database chart. On desktop, the switches and the
incident buttons are 860 px apart in a 900 px viewport, so the reader cannot
see the charts while acting. *Fix (required):* give each incident its own
short paragraph with one instruction and one "notice". Cut the 1.5× ramp
experiment, or move it to the text alternative; it makes a fine point but is
the fifth variation. *Fix (suggested, see S9):* put the incident buttons
beside the switches, or shrink the scene, so controls and charts share a
screen.

**R6. Aphorisms and flourishes against the house voice.** Quote and fix:
- Closing, line 242: "A cache turned out to be less a component than a set of
  agreements: with the product owner …, with the database …, and with the
  people on call …" and "make every other decision pay for itself in that
  currency." Replace with a plain consolidation: what the reader can now
  decide, and the habit, stated literally ("write down the database's
  capacity first and check each decision against it").
- Line 51: "That is the price of correctness, and the right way to treat it is
  as a line in the budget, not as a temptation to cache." Use "Those 40
  queries are a fixed cost of charging the right price."
- Line 167: "The limit is what catches a ramp that was planned for the wrong
  day." Use "Only the limit protects a ramp sized for less traffic than
  arrives."
- Checklist 16: "The code path nobody runs is the one that does not work."
  Use "A fallback that has never run in production usually fails when first
  needed."
- Line 12: "and a sense of where the arithmetic surprises." Cut.

## Suggested

**S1. Put the sensitivity on Figure 1.** Add "Popularity exponent 0.8 / 0.9"
and "Traffic 1× / 2×" (the model already parameterises both through `SHOP`).
The two paragraphs at line 210 and line 212 then become one instruction each.
I reproduced the article's numbers from the model: 0.8 at 3 GB gives 182 and
92.0%; 2× at 3 GB gives 282; 2× at 4 GB gives 204.

**S2. Figure 1's axis rescales with every change.** The axis runs 0–1,500 at
start, 0–900 with a 24 h expiring TTL, and 0–450 for the design. The capacity
line jumps across the figure, so "the product segment shrinks" is hard to see
when the axis shrinks too. Use a fixed axis, or keep capacity at a fixed
position. At the default state the alert and capacity dashed lines cross the
"578" label in the product segment (`light-desktop-01.png`, `dark-phone-01.png`).

**S3. The memory readout exceeds the memory control.** With the slider at
"Memory for product details 3 GB", the readout says "Memory used by products
and stock 3.17 GB". That looks like a bug. Show "3.00 GB products + 0.17 GB
stock", or label the slider "maxmemory share for product details".

**S4. Two denominators for "hit ratio".** The target of 92.5% is over 2,000
reads a second (details plus stock, line 39). Figure 1's readout, the memory
row of the design table ("95% of product reads hit") and the watching section
("falling from 95%") use details only. Add a combined readout against the
92.5% target, or state the target as at most 150 misses and keep it in
misses.

**S5. Soft expiry differs from the stampedes article.** Line 125: "The entry
carries a soft expiry of 60 seconds inside its value". Cache stampedes stores
only the hard TTL and derives staleness from `PTTL` (the hard-minus-soft
margin). Either use the same mechanism, or add a clause saying why the value
holds the soft expiry here.

**S6. "Che's approximation for LRU" is used without definition** (line 97).
Add "the approximation for LRU that <ArticleRef expiration-and-eviction> used,
which says a key stays cached while it is read at least once per a
characteristic time".

**S7. Leases on the read path.** Say in one clause that `MGET` can return a
lease placeholder, which the application treats as a miss. Without that, the
read path described at line 59 is incomplete for a reader building it.
Invalidation's table already lists "readers must recognise placeholders".

**S8. Quantify the sale repricing.** The prose at line 119 says plan for it but
gives no size. From the same model: if the sale covers the 20,000 most popular
products (about 53% of reads), deleting them at once causes about 380 misses
in the first second and about 1,500 within five seconds. That is several times
the 57 a second of headroom. If it covers 20,000 random products, it causes
about 370 misses spread over a minute, which is harmless. One sentence with
those two cases makes the pacing advice concrete.

**S9. Figure 2 layout.**
- Put the incident buttons beside the switches (extend locally, since the
  shared `SimFigure` places `actions` below the charts).
- At 375 px the moving dots cover the "Redis + replica" label
  (`use-f2-phone-dark-nolimit.png`). Dots at one in 60 add little next to the
  charts. Shrink the scene, or drop it on phone widths.
- Product pages and checkouts are both `error` coloured and differ only by
  dash, while the prose says "Notice the dashed line". Label the lines
  directly, or give checkouts a distinct kind.
- Changing a switch mid-run leaves no mark on the charts. In the "switch the
  limit back on while it is stuck" experiment, the reader cannot see where the
  change happened or measure the recovery delay. Recovery came about 150
  simulated seconds after the switch (`use-f2-stuck-then-limit.png`). Add an
  event mark for switch changes.

**S10. Ambiguous duration.** Line 165: "Now losing it costs ten seconds of
downtime and then an empty cache. Pages fail for about 35 seconds". The model
gives 35 s from the failure, including the 10 s down, but the sentence reads
as 35 s after. Say "about 35 seconds in all".

**S11. Jitter sentence.** Line 127: "here it spreads a day's worth of refills
over nearly five hours." What jitter spreads is the burst filled together
after a deploy, over ±2.4 hours. Use "spreads keys filled in the same minute
over nearly five hours".

**S12. Bytes per entry beside Operating a cache.** This article measures 2,131
bytes for a 1,806-byte value. Operating a cache measured 2,130 for a
2,000-byte value. A careful reader will notice that the same cost for a
smaller value looks like an error. Both land in the allocator's 2,048-byte
size class. Add a clause, which also answers the brief's libc caution
(jemalloc also has a 2,048-byte class, so the figure transfers roughly).

**S13. "At 4 GB the whole catalogue fits"** (line 103). The model holds about
1.83 million of 2 million products, those read within a day. Say "memory stops
being the limit".

**S14. Figure 2's caption should list the trending panel as left out.** The
article decides on the trending panel's protection, and the figure does not
model it. "Nothing expires" covers jitter, but the trending panel is not
mentioned.

## Teaching, by section

- Opening: informative and concrete. It names the shop the reader already
  knows and the two things this article adds. Good.
- `#requirements` → `#budget`: the strongest teaching in the article. The
  budget derivation (300 → 210 → minus 60 → 150 → 92.5%) is shown, not
  asserted, as the brief asks.
- `#what-to-cache`: clear, with reasons and links. Stock split by *k*/(*k*+1) is
  well chosen.
- `#ttl`: the surprise is earned, but it lands as a table (R4). The Figure 1
  instructions (lines 101 to 105) are exactly right in form: one change at a
  time, each with a "notice".
- `#freshness`, `#stampedes`, `#memory`, `#clients`, `#servers`: correct
  decisions, each linked to its owner. Every number matches the earlier
  articles except R2 and S5. The LFU paragraph (line 137) is a good
  practitioner point. It correctly ties the fast benchmark's flattery to
  `lfu-decay-time`, consistent with Cache expiration and eviction.
- `#failure`: the Little's-law limit and checkout-first are this article's
  real additions. The figure demonstrates them convincingly. I verified every
  claimed outcome in the browser: design 0% checkout failures; no limit gives
  a ~28 s backlog with checkouts failing; one server plus one limit for all
  fails checkouts; one server with no limit sticks; ramp at peak needs no
  limit; ramp at 1.5× with no limit collapses (42% pages, 100% checkouts).
- `#design` table and `#checklist`: valuable and well reasoned. Every
  checklist link lands on the right section.

## Depth

The article reaches expert practitioner for its coverage-map subjects. It
makes the decisions in order, says which decision forces which, gives a
number for each, and says what would change it. Nothing major is missing.
Smaller practitioner needs are noted in S7 (placeholders on the read path),
S8 (the size of a bulk invalidation) and R1/R2. Nothing should be cut for
depth. The several-regions paragraph is at the right length for a pointer.
It does not stray: mechanisms are named and linked, not re-taught. The lease
and Little's-law passages are one or two sentences each.

## Figures as artefacts

- Both figures are legible in light and dark at 1280 px and 375 px. The
  palette matches the toolkit's meanings (miss, database, error).
- Captions are honest about what is modelled and what is measured.
  Figure 1's caption states the approximation and its checks. Figure 2's
  states the queue model and what is left out (add the trending panel, S14).
- Text alternatives convey the results. Figure 1's is a table of six
  decision sets, and Figure 2's is a list of outcomes per incident. Good.
- Problems: axis rescaling (S2), the memory readout (S3), the Figure 2 layout
  and missing switch marks (S9), labels crossed by the dashed lines (S2).

## Beside Gears and Load Balancing

Figure 1 would sit comfortably beside them. It is one bar, four decisions,
and the result is visible the moment you drag. Figure 2 is a credible
end-of-article playground in the spirit of Load Balancing's. As a whole,
though, the article reads as an excellent design document with two
demonstrations, not yet as a visual essay. The single biggest gap is that the
one thing this article discovers, that the long tail caps any short TTL
whatever the memory, is told in a table instead of shown (R4).
