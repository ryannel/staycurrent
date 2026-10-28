# Final review, round 2: Designing a cache: a worked example

Reviewer: independent, fresh read. Source `src/articles/caching/designing-a-cache.astro`,
figures in `src/components/caching/designing-a-cache/`. Read on the dev server at
`/learn/databases/caching/designing-a-cache/` (port 4482), all three figures driven
by hand and by script, in both themes, at 1280 px and 375 px, and with reduced
motion. Screenshots are in `final-screens/`. Checked on Redis 8.10.3 (port 7182/7183,
`--save ''`, temporary directory, shut down and deleted afterwards). The model tests
pass (8/8). Earlier reviews and `repair-1.md` were skimmed only after this judgement
was formed.

## Verdict

**Publish after the listed blocking fixes.** Two blocking items, both small. The
article does what the capstone should: one shop, every decision with the number that
settles it and a link to where the reasoning lives, and two genuine results no single
article could show (a one-minute TTL caps the catalogue at 42%; each failure protection
covers a different incident). The figures work, the numbers in the prose match what
the figures and models produce, and the design agrees with the published articles it
links. Length is a real weakness but not a blocking one (see "Length").

Counts: 2 blocking, 1 decision requested (memory: 4 GB), 13 minor.

## Blocking

**B1. Figure 2's hit-ratio readout claims a fixed need of 92.5% in states where the need
is different.** The label "Page reads that hit (need 92.5%)" is static
(`BudgetFigure.astro`, line 43). The 92.5% comes from 150 spare queries over 2,000 reads,
which holds only at today's peak with checkout reading the database. At "twice the
peak", 3.5 GB, the figure shows 95.9% hit against "need 92.5%", which reads as
comfortably met, while the bar sits at 284 queries a second, 95% of capacity. The real
need there is 1 − (210 − 120) ÷ 4,000 = 97.75%. With checkout reading Redis it is
1 − (210 − 20) ÷ 2,000 = 90.5%. The section "The database decides how good the cache must
be" teaches that this number is derived from the budget, so a readout that does not
follow the budget contradicts the lesson in exactly the "What if" the article walks
through. Fix: compute the need with the same formula,
`1 − (capacity × alert − checkout queries) ÷ (2 × reads)`, and show it in the label (or
as the readout's second line). Consider also colouring the load readout once it passes
the alert line, not only capacity (minor 8).

**B2. The bulk-repricing advice silently breaks the article's own one-minute price
target, and charging "the database's price whatever the page showed" can charge more
than the shopper was shown.** The requirement table says a page price may be at most a
minute old. The sale paragraph ("One kind of change needs planning…") paces deletes to
about 50 popular products a second, about seven minutes for 20,000, so during a sale the
later products show the old price for up to about seven minutes. That may be the right
trade, but the text does not say it breaks the target. And the safety argument in
"Keeping copies fresh", that checkout charges the database's price whatever the page
showed, cuts both ways: when a sale ends, or a lost delete leaves an old price up for a
day, a shopper is charged more than the page showed. In the UK that is a misleading-price
problem, not a staleness nuisance. Fix, in two or three sentences: (a) say that pacing
leaves pages up to about seven minutes behind during a bulk change, which the shop
accepts at peak or avoids by scheduling the change off-peak; (b) have the basket carry
the price the page showed, and have checkout, which already reads the price from the
database, show the new price and ask the shopper to confirm when the two differ. Add
that to the "What not to cache" or "Freshness" row of the design table and to checklist
item 3. This also closes the day-long lost-delete case honestly.

## Decision requested: 3.5 GB or 4 GB

**Choose 4 GB.** From the article's own model (`budget-model.mjs`, run for this review):

| `maxmemory` | Today's peak, s = 0.9 | s = 0.8 | 2 × peak | 2 × peak, s = 0.8 | Limited by |
| --- | --- | --- | --- | --- | --- |
| 3.5 GB | 147 (63 below alert), 95.6% hit | 181 (29 below) | 284 (over alert, 95% of capacity) | 353 (over capacity) | memory |
| 4 GB | 123 (87 below alert), 96.9% hit | 124 (86 below) | 204 (under alert) | 212 (just over) | the TTL (uses 3.80 GB) |
| 5 GB | 123 | 124 | 204 | 205 | the TTL |

Reasons, in order of weight:

1. **4 GB is the knee, the smallest setting at which memory stops binding.** Figure 2
   says "limited by the TTL" there, and nothing improves beyond it. At 3.5 GB the design
   sits on the steep part of the curve, where every error in the inputs moves the total.
2. **It makes the design insensitive to the one input the article says is uncertain.**
   The exponent comes from "a sample of a day's logs". At 3.5 GB, 0.8 instead of 0.9
   takes the headroom from 63 to 29; at 4 GB the total barely moves (123 to 124). The
   article's own advice, "Measure the exponent before choosing memory", becomes much
   less load-bearing.
3. **It costs nothing the design has not already paid for.** The server is 8 GB either
   way. At 4 GB (3.8 GB used today, 3.97 at twice the traffic) there is still room for
   fragmentation, client and replica buffers and the copy-on-write of a full
   synchronisation on a read-mostly cache. The article itself says 4 GB "costs little".
4. **It doubles the margin for the incidents the article plans for**: 87 queries a second
   below the alert line for the sale burst instead of 63, and it covers twice the peak
   traffic without changing memory.
5. **A practical detail:** Redis 8.10.3 rejects `maxmemory 3.5gb` (checked:
   `CONFIG SET maxmemory 3.5gb` gives "argument must be a memory value"; a config file
   with that line would not start). 3.5 GB has to be written `3584mb`. `4gb` is clean.

Edits that follow: the Figure 2 walk-through ends at 4 GB ("memory has stopped being
the limit"); "The design takes … a `maxmemory` of 4 GB, which leaves 87 queries a second
below the alert line"; the memory section says it holds every product read at least
about once a day (about 1.83 million, 3.8 GB used); the eviction paragraphs say memory
does not bind at today's peak, so the policy matters when traffic or the catalogue grows
(which lets the LFU paragraph shrink, see Length); the sale paragraph's headroom becomes
87; "What would change the design" becomes "Less skew: barely moves (123 to 124)" and
"Twice the traffic: 204, just under the alert line, and checkout's 120 is what more
memory cannot reduce"; the design table's Memory row; the alert's "product hit ratio
falling from about 97%" becomes about 98%; and `recovery-model.mjs` (`keys`,
`steadyHit`) and `models.test.mjs` are rerun for the shop-scale restart and deploy
numbers.

## Consistency with the published articles (question 3)

All checked against the linked sections' current text.

- **Retries and `WATCH`** (`clients-and-pipelining#retries`, `#watch`): agrees. Same
  settings (`Retry(NoBackoff(), 0)`, `MaxRetries: -1`), the same `SET … NX` false-refusal
  argument, the same 3.6-second median, the same redis-py `WatchError`-on-timeout finding.
  The design's per-step meaning of a timeout is consistent with "retry in the application
  where a repeat is harmless".
- **Delete on write, lost deletes and failover** (`invalidation#lost-deletes`,
  `replication-and-persistence#failover-loss`): agrees: outbox, replay after a failover,
  TTL on every key. The design departs from invalidation's "set the TTL to how long a
  wrong value may be shown" and says so, with its reasons. See minor 7 for the partition
  case.
- **Leases** (`invalidation#leases`): agrees: token with `SET … NX PX 2000`, fill with
  `SET … IFEQ … EX`, placeholder counted as a miss, fills read the primary database.
  Verified on 8.10.3: `IFEQ` on a deleted lease returns nil and creates nothing, a repeated
  `IFEQ` after a successful fill returns nil, and `IFEQ` without `EX` leaves no TTL.
- **Locks** (`stampedes#lock`): agrees: random token, `NX PX 5000`, 2-second statement
  timeout inside the lock, release with `DELEX … IFEQ` (verified: 0 for another token,
  1 for its own).
- **Replication, fork and durability** (`replication-and-persistence#choosing`,
  `#replication`): agrees with the recommended default line by line. Verified that a
  replica's full synchronisation forks a primary with persistence off (`total_forks:1`,
  diskless sync on). The sessions Redis matches "data that is not really cache needs the
  opposite answers".
- **ACL users on every node** (`operating-a-cache#security`): agrees and is stricter
  than operating's example, for a stated reason (`+@read` lets in `SCAN`). Verified the
  application and relay users on 8.10.3: `HELLO`, `CLIENT SETINFO`, `MGET`, `SET … NX PX`,
  `PTTL`, `DELEX`, `UNLINK` allowed; `SCAN`, `INFO`, `CLIENT KILL`, `DEL`, `EVALSHA` and keys
  outside `shop:` refused; the relay deletes product and stock keys and cannot read or
  delete the trending key. Sentinel and replica rules match the redis.io ACL page. See
  minors 5 and 9.
- **Eviction measured at a realistic pace** (`expiration-and-eviction#lru-or-lfu`):
  agrees. The design's own LRU/LFU test ran at 5,000 reads a second, and the text says
  plainly that its edge keys were read every 50 seconds against the shop's four hours,
  which flatters LFU, and recommends replaying a day at real pace. LFU's initial counter
  of 5 and one-per-period decay match the article and the source.
- **Model scale**: every Figure 3 number in the prose is presented as the model's, and
  each step gives the shop's numbers from `recovery-model.mjs` separately. I found no
  model number quoted as the shop's. "The shop loses the same 6 seconds" is fair, since
  the failover time is an assumption that does not depend on size. The caption's warmed
  92% against the shop's 96.7% is stated.
- Every `ArticleRef` hash used exists in its target article.

## Length (question 1)

About 8,270 words of body (8,550 with sources), with three figures. The worked example
stays followable, because each section opens with its decision and the design table pulls
it together, so **the cut list is not blocking**. But the stretch from Figure 2 to Figure 3
(about 2,900 words, no figure) is the densest reading in the collection, and much of it
re-states evidence the linked articles already hold. These cuts, about 1,750 words, lose no
decision and no justification:

1. **Memory and eviction, LFU paragraph (188 → ~40).** Keep one sentence: LFU was not
   chosen because the shop's marginal products are read every few hours, below
   `lfu-decay-time`, which the eviction article shows defeats LFU; replay real traffic at
   real pace before switching. Drop the 30,824 vs 29,851 key-count aside. With 4 GB this
   paragraph matters even less. Also trim the LRU-check paragraph to its result (98 → ~50)
   and the allocator aside in the bytes-per-entry paragraph (~40). **Saves ~250.**
2. **"Several regions" (140) and "Listing pages" (~80) in "What would change the design".**
   Cut regions to one sentence with the Facebook link, or drop it (the plan only allows a
   note). Listing pages to one sentence. **Saves ~170.**
3. **When things fail.** Drop the "Stuck" walk-through paragraph (~90): Caching patterns
   and Operating a cache already teach it, and it is not a decision. In the key-version
   paragraphs, cut the ramp numbers (440,000 pages; an hour and a half) to one clause and
   the paced-fill fallback (414,000 products, 81%, 46 minutes) to one sentence. **Saves
   ~250.**
4. **Keeping copies fresh.** Trim the opening paragraph's restatement of invalidation's
   rule (154 → ~100); in the lease paragraph drop the race-rate recap and the "I ran the
   whole sequence" narrative to one clause (187 → ~110). **Saves ~130.**
5. **Watching and securing it, the ACL paragraph (189 → ~80).** Keep the reason for
   listing commands and the `masteruser`/`sentinel auth-user` sentence; reduce the test
   report to "I loaded this file into a primary and a replica on 8.10.3: the users worked
   on both, the application was refused `SCAN`, `FLUSHALL`, `CONFIG` and keys outside its
   prefix, and a user added with `ACL SETUSER` never reached the replica". **Saves ~110.**
6. **Sessions and baskets paragraph (156 → ~70).** It is not the cache. Keep the settings
   and the one-second loss the requirement accepts; link the replication article for
   `WAIT`, `WAITAOF` and `min-replicas-to-write`. **Saves ~85.**
7. **Talking to Redis, retries paragraph (226 → ~160).** Drop the 3.6-second figure and
   the `WATCH` sentence (the link holds both); keep the per-step meaning of a timeout,
   which is design-specific. **Saves ~65.**
8. **How long may a copy live?** In the Che paragraph, drop the "checked against a
   simulation … and Redis, which comes later" sentence (the caption says it) and shorten
   the definition (~60); tighten the two walk-through paragraphs (~60). **Saves ~120.**
9. **Checklist (789).** Keep all 17 questions, but cut each reason to one short clause
   where the design section already gave it (most of them). Cut the closing paragraph
   (100) to two sentences. **Saves ~250.**
10. **Opening and requirements.** The third opening paragraph previews both results in
    detail (~90 → ~50); the 1999 exponent comparison in the requirements (~30 → ~10).
    **Saves ~60.**
11. Smaller trims in "What to cache" (currency paragraph) and "One server or several"
    (~60).

Total about 1,550 to 1,800 words, landing near 6,500.

## Minor

1. **Figure 1 label clipped at 375 px.** "Read less than once per TTL: mostly misses" runs
   off the left edge ("ead less than…") at 1 minute and 1 hour on a phone
   (`final-screens/dark-phone-01.png`). Fix: right-align it to the plot's right edge and
   wrap, or use a short label ("Mostly misses") below 480 px.
2. **Figure 1, one hour: "it still holds 80% of the products" is not a readout.** The
   readout shows "392,713 of 2,000,000" above the line. Fix: "only 392,713 products, a
   fifth of the catalogue, clear the line; the other 80% get 19% of the reads".
3. **Figure 3, "Stuck": the instruction cannot be followed on the chart.** After a minute
   stuck the backlog is about 230 s; the switch mark scrolls out of the 150 s window
   before recovery (in my run, switch at 140 s, recovery at about 380 s), and "press Skip
   ahead a few times" needs about eight presses. Fix: "press Skip ahead about eight times
   and watch 'Wait for the database' count down to zero before pages recover", or widen
   the window for that case. (If this paragraph is cut, per Length 3, the issue goes.)
4. **A rollback after conversion is a cold start.** The deploy design converts a v3
   entry to v4 and deletes the v3 key, so the popular products, the ones converted, have
   no v3 copy; rolling back to v3 code then misses on most reads, the incident the
   conversion exists to avoid. Fix, one sentence: say so and that the limit covers it
   (plan rollbacks off-peak), or keep v3 keys until a rollback is no longer possible if
   memory allows.
5. **`masteruser` and `masterauth` belong on both servers.** After a failover the old
   primary rejoins as a replica and must authenticate too; Operating a cache says
   "configured on every node". The text says "in its configuration" (the replica's).
6. **Bulk-change pacing must not delay stock deletes.** If the relay paces a sale's
   20,000 deletes in one queue, stock deletes behind them break the 5-second target and
   trip the 3-second relay-lag alert. Fix: "paced in a separate queue from ordinary
   deletes".
7. **Partitions, not only failovers.** Deletes the relay sends to a primary that is cut
   off before the switch are discarded when it rejoins (replication article, Figure 9
   partition case). "The last few minutes" covers it only if the window reaches back past
   `down-after-milliseconds` plus the failover; say so in a clause.
8. **Figure 2 flags overload only past capacity.** The design's line is the alert at
   210, but the load readout turns red only above 300, so 284 at twice the peak looks
   ordinary. Fix: a distinct state above the alert line ("over the alert line").
9. **ACL tested with `redis-cli`.** The application's user refuses `ROLE` and `INFO`.
   redis-py's Sentinel pool sends only `PING` and `CLIENT SETINFO` (both allowed), but
   other Sentinel-aware clients may query the role after connecting. Add "test the file
   with your own client library in Sentinel mode".
10. **The 26-a-second expiry bound counts products only.** Stock keys have the same
    24-hour TTL, so expiry misses can reach about 51 a second across both families. Fix:
    "two million product keys, and as many stock keys, cause at most about 26 expiry
    misses a second each".
11. **Trending refresh omits the re-check after taking the lock.** Stampedes#lock makes
    the second read a required step. Under serve-stale it is a check that the copy is
    still stale. Add a clause, or rely on the link.
12. **Figure 3 dev overlay.** Not an article defect: the Astro dev toolbar covers the
    chart axes in dev screenshots; the production build has none. Noted so nobody
    "fixes" it.
13. **Sources.** Add the Redis CONFIG/`redis.conf` memory-unit note if 3.5 GB stays
    (`3584mb`); otherwise nothing missing. The Gears demonstrations could not be driven
    headless (canvas controls); Load Balancing's first two simulations were used.

## Checked and fine

- All Figure 1 and Figure 2 numbers quoted in the prose, by driving the controls: 42.2%,
  4,152, 59.2%; 79.6%, 19.3% at an hour; 93.1% at six hours; 1,386 and 0.07 GB; 336 at
  2 GB; 199 at 3 GB; 147 and 95.6% at 3.5 GB; 123 and "limited by the TTL" at 4 GB; 107
  with checkout from Redis; 181/124 at s = 0.8; 284/204 at twice the traffic.
- Figure 3 scenarios by script and by hand: failover (about 76% of pages refused for 6 s,
  no checkout fails, back by 37 s); one server with one limit (84% of checkouts failing);
  stuck and recovery. Reduced motion: no autoplay, Step works. No console errors, no page
  overflow at 375 px.
- Arithmetic: Zipf 0.9 over 2M gives about 30 reads a second for the top product and one
  every 2.3 hours for the median; 2,131 bytes per product entry reproduced on 8.10.3
  (stock 98 measured by the writer; my 111 included a hash-table resize); 1.69 million
  products in 3.5 GiB; network 3.3 MB/s; Little's law 60; jitter spread 4.8 hours.
