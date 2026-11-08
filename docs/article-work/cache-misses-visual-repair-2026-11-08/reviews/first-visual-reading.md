# First visual reading: Handling cache misses

This is the unaided account, saved before receiving learning goals, the article body or informed visual checks. It records comprehension and uncertainty, not proposed repairs.

## Evidence and limits

- Preview: `http://127.0.0.1:4329/review/figures/cache-misses/`, titled “Handling cache misses — Figures-only preview”, reviewed on 8 November 2026. This was the fixed preview assigned by the coordinator. No revision or build identifier was visible, so I have not independently identified its commit or build.
- I opened a new Chrome automation session named “👀 First visual reading”. All browser interaction used `cua_repl`. The normal desktop viewport captures were 1488 × 917 pixels. System theme was selected and rendered dark. I did not change zoom, viewport, theme or motion preferences. This is not a mobile, light-theme, reduced-motion or keyboard-only assessment.
- I read only the assigned `first-visual-reading.md` lens outside the page. I did not open article prose, source, other repository files, plans, goals, earlier reviews or informed checks. I did not use long text alternatives. The first accessibility snapshot exposed the visible captions for all ten figures together; those captions are part of this account's permitted evidence, even though I subsequently watched the drawings in order.
- I have general prior knowledge of caches, deadlines and queues. I distinguish deductions made using that knowledge from mechanisms actually visible here. This is an independent visual reading, not evidence from a human participant with no prior caching knowledge.
- I brought each drawing into view and used Replay or selected a variant to restart it there. I observed changing rendered states through successive screenshots, including initial states, intermediate states and settled results. I did not capture continuous video or measure frame timing, so this establishes observed transitions rather than frame-by-frame smoothness. Some figures below the current one had already played by the time I reached them; I replayed them rather than judging those off-screen runs.
- Watched variants: Figure 1, both computation durations; Figure 2, both load-budget arrangements; Figure 3, local sharing and fleet lease; Figure 4, lease only and source timeout; Figure 5, refresh success and failure; Figure 6, XFetch, jitter and empty cache; Figure 7, ordinary misses, short queue budget and Redis unavailable; Figure 8, 20 ms, 200 ms and 30-server cases; Figure 9, its single recovery comparison; Figure 10, stuck recovery, breaking the loop and retry multiplication.
- Replay and variant selection restarted the relevant drawing. I also paused and resumed the retry multiplication animation: the control changed to Resume, the partly drawn rows remained visible, and resuming reached the full result. At completion, Pause disappeared while Replay remained. I did not test every figure's pause control separately.

## Figure 1: Computations after one expiry

**Setup and what happens.** An empty entry receives 400 requests a second, with no sharing or admission limit, as the caption states. The graph is explicitly “List computations started”. The line rises while the badge says “empty cache → each miss starts work”. In the 150 ms variant it reaches 60 computations, then stops rising when “first fill lands, 150 ms” appears and the badge changes to “list cached → later requests hit”. With a 600 ms source, I watched the line continue rising past 200 and settle at 240 computations at the first fill.

**Why and conclusion.** The first completed fill ends the period in which later requests start duplicate work. A slower fill leaves a larger window for that duplication. The dashed 40-slot line makes the scale consequential. The caption explicitly says it is intended fleet capacity, not an enforced limit, so I did not read the line as throttling the graph.

**What I supplied or questioned.** I can check 400 × 0.15 = 60 and 400 × 0.6 = 240 using the supplied rate and durations. The graph counts starts, not a measured trace of simultaneous execution. I would not claim the plateau proves that all 240 computations remain running. The state change and plateau were useful; no guess about the central mechanism was needed. I repositioned the page so that the badge, axes, controls and caption could be read together.

## Figure 2: Callers sharing one load

**Setup and what happens.** A, B and C request the same P7 card, according to the caption. A has a 50 ms budget; B and C have 150 ms each and begin later on the common time axis. Dotted lines end at separate deadline markers. In “Load has its own budget”, the shared load has 120 ms available. A's bar ends with “error” at 50 ms; the load continues, becomes “filled” at about 100 ms, and B and C receive “GBP 20.00 card”. In “Load tied to caller A”, all three callers receive errors around A's 50 ms boundary and the shared load is labelled “cancelled”.

**Why and conclusion.** Giving shared work its own budget lets later callers benefit after the first caller has run out of time. Tying its lifetime to A makes A's short budget constrain everyone. The common axis and unused dotted parts of B's and C's budgets make the lost opportunity visible.

**What I supplied or questioned.** The price is simply the returned card content; I do not infer a pricing or freshness policy. The drawing does not specify an API or cancellation implementation. The 120 ms budget is an upper bound, not the load's actual duration: the earlier filled marker makes that distinction readable. This was one of the clearest comparisons.

## Figure 3: The scope of shared work

**Setup and what happens.** “One missing list · 20 servers” is shown with A, B and “… Server 20”, each receiving two list requests. Local sharing leaves one yellow query bar per depicted server. The result says “20 maps can still start 20 copies”. Selecting the fleet lease leaves one query at A, marks the other servers “lease held by A” and concludes “One owner fills; other servers reuse”.

**Why and conclusion.** Sharing within one server does not remove the same work across servers. A fleet lease can save that remaining duplication. The cost panel compares about 100 ms of P7-card work with up to 3,000 ms of list work, and explicitly says to coordinate where the saving is worth it. The caption also retains waiting servers' own deadlines and fallbacks, and warns that lease expiry can allow overlap.

**What I supplied or questioned.** “Maps” is not defined in this drawing. I inferred local bookkeeping for shared work from the server arrangement, rather than learning what a map contains. I can follow the list's 20 × 150 ms arithmetic, but the figure does not show why the P7 example uses about five copies at 20 ms when the fleet has 20 servers. The bars illustrate the contrast; they do not establish that five-copy assumption or the cost of coordination. “Ownership alone does not make data current” is a clear warning in text, but this figure does not itself show the stale-data case. These gaps did not obscure the local-versus-fleet distinction.

## Figure 4: A lease outlived by its owner

**Setup and what happens.** The rows distinguish server A, server B and the cached list. A's thin lease bar labelled tokA is shorter than its thick query bar. In the lease-only run, B starts with tokB after A's lease has ended; the drawing highlights “2 computations” while both query bars overlap. B publishes and releases, and the cached-list row changes from the older list to B's list. A continues to about 900 ms, where “publish and release refused” appears. The text says the lease is absent at 900 ms and that an atomic owner check refuses publication and release on a token mismatch.

The source-timeout variant stops A's query before B starts and labels it “cancelled, lease released”. B then fills the list without the depicted overlap.

**Why and conclusion.** Lease expiry limits permission but does not itself stop a query. A source timeout can bound the actual work. A late result must also pass the owner check before it can publish or release. The cached-list row provides a useful concrete consequence: A's late result does not replace B's list.

**What I supplied or questioned.** I inferred the thicker yellow bars represent source computation by reading the caption and the two-computation label; there is no separate legend. I understand tokA/tokB as ownership identifiers from the text. The mechanism of the atomic check, including how it is enforced, is not shown. The warning is nevertheless more than an abstract slogan here: the overlap and refused late result are visible. The final text is present early in the run, so it forecasts the outcome before the animation arrives there.

## Figure 5: Refreshing before the limit

**Setup and what happens.** The old list has a hard limit at 30 seconds, marked by a vertical dashed line. Request dots first use the old list. A refresh reads at 29.3 seconds and runs briefly. With success, “new list stored” appears, subsequent request dots use the new-list colour, and the new row is labelled “until 59.3 s”. With failure, the refresh is labelled “failed”, the old-list bar still stops at 30 seconds, and request dots beyond that point change to the miss colour and label.

**Why and conclusion.** An early successful refresh can avoid a gap when the old copy reaches its limit. A failed attempt does not move the old value's hard limit. The success/failure switch makes this distinction direct. It also connects requests to the list version they receive, not just to a background operation.

**What I supplied or questioned.** The 59.3-second label suggests a new 30-second allowance measured from the refresh's read at 29.3; that arithmetic is my deduction from the displayed numbers. The drawing does not show the next limit in scale. I would not infer that a failed refresh automatically serves stale data forever: the visible result says “miss”. The final labels matter: during the drawing, the request dots had changed colour before the final “miss” label appeared, so I watched through to settlement rather than deciding from that intermediate frame.

## Figure 6: Choosing when to refresh

**Setup and what happens.** In the XFetch view, one popular list expires at 30 seconds and each request makes its own refresh decision. The probability curve is nearly flat early, labelled 0.13% at 29 seconds, then rises to 100% at expiry. Below it, two selected requests each produce a 150 ms fill and their bars overlap. The caption reports a simulation's first attempt around 0.7 seconds early and 2.8 attempts per expiry on average.

The jitter view changes to different keys with the same 30-second hard limit. P7, P8 and P9 have refresh points at 23, 25 and 26 seconds. Text says each waits for a request after its point, and several callers of P7 can still trigger together. In the empty-cache view, Redis has restarted, all three keys are missing, there is no stored value or refresh time, and the drawing leads to “source admission”.

**Why and conclusion.** The three views explain different scopes. Per-request probability can encourage a busy key to refresh early. Jitter spreads different keys' refresh points. Neither prevents overlapping fills for one key, and neither supplies stored values after an empty restart. The overlap panel connects timing policy back to the earlier sharing/lease mechanisms.

**What I supplied or questioned.** I understand that more requests give more chances for an early decision; this follows from “each request” plus the curve, but no busy-versus-quiet request trace is drawn. I cannot recover the probability formula, its parameter choices or the 2.8 average from the drawing. Those remain reported example results. The jitter animation mainly reveals the three time labels; it does not show requests arriving after them. “Every key needs a fill now” in the empty-cache panel reads as a description of missing requested keys; the drawing does not actually show a request stream there. I would not use it alone to justify filling every catalogue key immediately.

## Figure 7: Admit only work that can finish

**Setup and what happens.** P7, P8, P9 and P10 are different cards and cannot share one answer. Admission sits before the connection pool. There are two executing places and one waiting place. P7 and P8 run, P9 waits and P10 receives “queue full → fallback now”. When P7 returns a card, an arrow moves P9 from waiting into the free place. P9 has 100 ms left and a fill needs 20 ms, so the deadline check permits it.

In “Queue deadline expires”, P9 has only 8 ms left against a 20 ms fill. The place opens, but P9 is refused without a query; the executing place remains free. In “Redis unavailable”, the top text subtracts a 10 ms Redis timeout from a 150 ms request budget, and the same admission sequence remains in use.

**Why and conclusion.** Bound execution and waiting across different keys. A free place is insufficient reason to start a fill if the caller cannot benefit before its deadline. Redis failure must not remove the bound. The fallback text is specific: use an older copy only within its hard limit, otherwise available fields or HTTP 503, without an extra source read. The caption says demand, refresh, warming and retries share the same allowance, and a place is released when source work ends rather than when its caller leaves.

**What I supplied or questioned.** The slot-and-arrow change is easy to read. The control's phrase “deadline expires” is a little broader than the actual shown condition: 8 ms remains, but that is insufficient for a 20 ms fill. The numerical test itself is clear. The outage panel adds 20,000 requests/s, 40 places, about 2,000 fills/s, 17,700 loads/s after local sharing and a 12% full-card/88% fallback split. I can derive 2,000 from 40 divided by 20 ms. I cannot derive 17,700 or exactly 12% from this visual setup; I assume an unstated request-distribution or sharing model. I do not treat those numbers as universal outage outcomes. The outage variant grew taller than the viewport, so I used two views to read the whole drawing, its outcome bar and caption.

## Figure 8: Concurrency, rate and connection limits

**Setup and what happens.** With constant 20 ms fills, a 40-executing concurrency limit permits 2,000 completions/s, while a 2,000-starts/s rate limit leaves 40 fills in progress. Twenty pools of 50 connections allow 1,000 potential connections. Switching to 200 ms leaves the concurrency bar small and changes its completion figure to 200/s; the rate-limited work-in-progress bar grows to 400. The pool allowance stays 1,000.

The scaling view compares 20 servers × 2 places = 40 with 30 × 2 = 60, explicitly exceeding the intended 40. Redistributing to 20 × 1 + 10 × 2 restores 40, or the text suggests enforcing the limit at the source.

**Why and conclusion.** The three limits count different quantities. A start rate that was tolerable for fast fills can leave much more concurrent work when fills slow. A large connection pool does not enforce the smaller safe execution allowance. Adding application servers does not add database capacity, so a fixed per-server allowance can silently enlarge the fleet total.

**What I supplied or questioned.** The arithmetic is understandable from the visible fixed durations, and the caption explicitly bounds the example that way. I needed the labels to read the first two bars: the concurrency bar depicts 40 executing even though the bold number immediately below it is a completion rate; the rate-limit bar depicts work in progress beneath a starts-per-second heading. I did not interpret all bold numbers as sharing a common unit. The additional “1,200 misses/s: 24 → 240” sentence is another numerical scenario rather than a plotted series. It supports the same point, but required a separate read. The fleet-scaling bars were simpler to compare directly.

## Figure 9: Recovering from an empty cache

**Setup and what happens.** The top two bars show that the most popular 1,000 cards are 2% of 50,000 keys but receive about two thirds of requests. Below, requests served from cache rise over 20 seconds after restart. The demand-fill line climbs sharply, with 61% after one second, then approaches the normal 94% hit-ratio line. Catalogue-order prewarming rises much more slowly, marked 20% after five seconds and roughly 80% at twenty. The caption gives both the same allowance of 2,000 fills/s.

**Why and conclusion.** Filling a popular key serves many later requests, so demand spends the limited allowance on useful keys early. Arbitrary catalogue order spends many fills elsewhere. The popularity bars are particularly useful: they explain the difference in curve shapes rather than merely asserting that one strategy wins.

**What I supplied or questioned.** The caption distinguishes simulated demand fills from a popularity-independent prewarming expectation. I therefore read this as an illustrative workload comparison, not production measurement or a promise that every recovery reaches 61% in one second. The caption allows targeted warming and says it shares capacity with demand. I would not infer that all warming is harmful. I cannot reproduce the simulation from the drawing, but I can explain the direction of the difference without doing so. Curve labels appeared during the run rather than all being visible initially; watching to the end resolved their identities.

## Figure 10: Breaking failed recovery

**Setup and what happens.** “Redis is back, but the cache stays cold” introduces a loop: 31% hits leaves most requests missing; 2.7 attempts per request add work; 90 active queries overload the source; slow queries outlive one-second request deadlines; few fills complete, preserving the cold cache. The loop arrow closes back on misses. An abandoned-query bar passes the “caller left at 1 s” mark and is still running at 4.8 seconds.

“Break the loop” replaces that with a sequence: shed excess traffic and bound retries, keep actual work within 40 places, end abandoned queries at the source, and let completed fills restore useful keys. It says to free a place only when its work ends. Traffic is increased in steps while checking both fill latency and work in progress; rising latency or persistent refusals mean hold or cut. The 20/60 ms median/99th-percentile numbers are explicitly labelled examples.

“Retry multiplication” grows rows of attempts across proxy, loader and database-client layers, ending at 3 loader calls, 9 database-client calls and 27 source attempts. Text says to retry in one layer, use the same source places for every attempt, stop at the deadline or shared retry budget, and give an overload refusal no automatic retry.

**Why and conclusion.** Restoring the cache service does not by itself end source overload. A client timeout also does not prove the underlying query stopped. Recovery requires enough successful fills to reduce future miss demand, and uncontrolled retries can oppose that. The abandoned-query bar makes “actual work” concrete. The multiplicative rows make the cost of layered retries visible.

**What I supplied or questioned.** The stuck-loop values are stated example conditions, not observations I can verify from this page. The intervention view was largely a readable static flow in the snapshots I observed; I saw the running control settle but did not see a meaningful changing state comparable to the abandoned-query bar or retry rows. I do not infer a dynamic recovery trace from that view. The final caption's instruction to inspect retries, successful fills, source latency and executing work is broader than hit ratio alone; it is supported by the mechanisms, although the drawing does not show a monitoring dashboard.

## What the sequence taught me

The progression is coherent. A cache miss starts real work. Before one fill lands, many callers can start copies; slower work makes this worse. Sharing one load helps, but its lifetime must be independent of an impatient caller, and local sharing only covers one server. Fleet coordination can save more work, but a lease is permission rather than query cancellation. Actual source work needs its own bound, and a late owner needs its publication checked.

Early refresh can preserve useful answers before a hard limit, but failure does not extend that limit. Probability and jitter choose when to attempt work at different scopes; they do not replace duplicate suppression or admission. Different keys and a cache outage still compete for finite source capacity. The queue must be finite, and even a newly free place should reject a fill that cannot finish usefully. Fallback is a caller outcome, not permission to start another source read.

I can now predict that a slower source increases duplicate starts before first fill, increases executing work under a fixed start rate, and reduces throughput under a fixed concurrency bound. I can predict that adding servers with unchanged local limits raises the fleet allowance. I can choose to preserve a total source allowance, keep independent shared-load and caller deadlines, prefer useful demand fills over arbitrary catalogue warming in a skewed workload, and restrain layered retries during recovery. I can also explain why a recovered Redis endpoint or rising hit ratio is insufficient evidence of healthy recovery.

The strongest teaching comes from visible paired outcomes: 60 versus 240 starts, later callers succeeding versus all failing, an outlived lease versus cancelled source work, success versus failure at a hard limit, and an admitted versus rejected queued fill. The popularity bars explain the recovery graph especially well. Consistent row labels, direct outcome labels and replayable variants made the sequence manageable.

What remains unanswered by the visuals is how to choose actual source capacity and timeout values, implement the atomic owner check and cancellation reliably, tune XFetch or jitter, and derive several workload-specific numeric results. I also do not know from these figures exactly what P7's card or the list contains, or why their costs and popularity differ. Those are limits of this figures-only account, not evidence that the article fails to explain them. The largest unaided uncertainties were the undefined “maps”, the five-copy P7 cost assumption, and the outage load/full-card percentages. I have not converted these observations into proposed repairs or used later informed material to resolve them.
