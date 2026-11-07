# First unaided reading: Handling cache misses

Audience: an intelligent engineer new to handling cache misses. Inputs: first-reading instructions and supplied rendered prose; figures will be inspected afterwards. I have not consulted the plan, exit questions, writing or figure guides, source code, author notes, or other reviews. These are reading observations, not proposed repairs.

## Prose observations, in reading order

### Opening

The title promises the practical consequences of a cache lookup failing. The shop example gives me a query, a cached copy and a reason many callers want the same thing without requiring prior caching vocabulary. At the end of the opening I expect an article about what happens while a missing cached answer is being rebuilt, and how to prevent that interval overwhelming the database. The passage that establishes this is: “That sounds like one query every 30 seconds. But rebuilding the list takes time, and customers keep arriving while it happens. What do those requests find in the cache?” This is a useful question: I have enough information to suspect the answer before being told.

### One expiry can start many reads

Heading expectation: explain how one missing answer causes several database queries. The opening two requests meet that expectation exactly. “Redis has no record that someone is already working on the answer” gives the mechanism in a particularly economical sentence.

The calculation from 400 requests/second and 150 milliseconds to 60 computations is easy to follow; changing the duration to 600 milliseconds then makes the positive feedback legible. I do not have to know the term “stampede” beforehand.

The experiment gives useful evidence that the overlap exists, and immediately limits what the artificial sleep demonstrates. The long SQL activity output briefly changes the reading task: I move from understanding the mechanism to interpreting an operational query and four timing/count columns. “The copies started at different times and accumulated while earlier copies were still running” brings me back to the point. I understand the diagnosis more readily from that sentence than from the output.

“The burst can hide behind an excellent hit ratio” is a strong practical turn. The 99.5% example demonstrates why an apparently healthy aggregate can miss a failure. The P7 example then makes coordination a cost decision rather than an automatic requirement. I can already use arrival rate × fill duration to compare two keys.

### Share the work for one key

Heading expectation: give the missing record of work in progress. The map explanation supplies it, including who creates an entry, who joins, and what happens on completion. “Later requests for that key join it and wait for the same result” is simple and effective.

Three names arrive together—request coalescing, request collapsing, singleflight—followed by two library interfaces. I can follow the central idea but briefly switch from learning the behaviour to filing aliases and implementations. The atomic check/register requirement and Redis recheck both make sense from the race already described.

The complete-key warning is clear and consequential. The paragraph on a failed load introduces a separate recovery-policy choice (“A short, separately identified failure entry…”); I understand why an error must not become “not found”, but do not yet know how the short failure entry relates to the in-progress map or how a caller would distinguish it. This is the first place I would pause for an implementation question. It may be a boundary to another topic rather than a missing step in coalescing itself.

### Let each caller stop waiting — expectation

I expect the next section to distinguish the lifetime of a shared computation from the patience of its callers.

The A/B/C example fulfils the heading: it makes the shared deadline failure visible without code. I have to retain five numbers (0, 20, 40, 50, 100 milliseconds), then a sixth for the separate 120-millisecond budget; the relationship remains intelligible because the next paragraph spells out who loses a still-useful answer.

“Decide what A receives when it leaves” is a natural bridge to stale data. The soft/hard distinction is understandable. “30 seconds after the source observation” adds a term I cannot yet implement precisely: is the observation the start or completion of the database read? I can understand the intended prohibition on restarting age when copying without resolving that detail.

The Go code embodies the stated separation; I need Go familiarity to read every line, but the prose already explains the behaviour. “The wrapper shows how to share a load; caps on active keys, waiters and source work belong around it” warns me that this is an incomplete production mechanism. Those caps are not yet explained, so I carry the promise forward.

“Cancelling a client context asks for work to stop; it does not prove that the query has stopped” is the strongest sentence here. It changes my interpretation of timeouts and gives a reason for the additional database setting. The section has expanded from caller patience through freshness, library semantics and abandoned database queries; I can follow it, although the heading understates that breadth. “We will put limits on that work shortly” is a useful signpost.

### Across application servers — expectation

I expect to find the limit of a per-process map and a way to share ownership across the fleet.

The section meets that expectation. It usefully starts with “That may be enough”, preserving the earlier judgement that inexpensive duplicates can be acceptable. The 40-fill budget arrives before its derivation; I provisionally accept it as another shop assumption.

“Redis has expired A's permission, but PostgreSQL has not been told to stop A's work” gives me the essential distinction in one sentence. The timeline is more involved than A/B/C (0, 10, 200, 210, 360, 900), but each event has a reason. The late owner's two prohibited actions—publishing and deleting someone else's lease—are distinct and understandable.

The progression from a Redis command to a trace, Lua, Redis 8.4 and Cluster hash tags increases implementation density noticeably. I understand the token-check principle but cannot independently explain a Cluster hash slot from this prose; it reads as a deployment caveat to investigate if relevant. The following distinction between reducing duplication and enforcing correctness feels important but abstract. The explicit link to a separate article explains the boundary rather than pretending this lease solves freshness.

The change from a 200-millisecond teaching lease to an example 2-second operational lease initially makes me reconsider the earlier numbers; “The short times make the race easy to see” explicitly resolves the discrepancy. The last sentence clearly states what must survive lease-service failure.

### Refresh before the answer expires — expectation

I expect to prevent callers waiting at expiry by beginning the same protected work sooner.

The first three paragraphs meet the expectation cleanly. “A failed refresh leaves the old observation exactly as old as before” is a memorable way to prohibit extending stale data's allowance. Reusing the same 60 callers demonstrates that early refresh does not by itself coordinate work.

The random-decision explanation is understandable before the equation. I pause at the rough first-refresh lead estimate, “0.15 × ln(400 × 0.15)”: the prose explains the per-request logarithm but does not show why the request rate enters this second formula. I can take it as a supplied estimate, not derive it from what I have learnt. The distinction between 0.6 estimated and 0.7 simulated seconds is clear. Keeping both average 2.8 and 99th-percentile 11 refreshes helps establish that randomness reduces duplication rather than eliminating it.

### Spread different keys out too

Heading expectation: a separate synchronisation problem affecting several keys. The warm-up example immediately supplies the cause. “Jitter spreads work across keys. It does not coordinate the callers of one popular key” is exceptionally useful: I can now distinguish two techniques that might otherwise sound like variants of random waiting. The return to P7 makes the selection advice concrete.

“Neither technique helps an empty cache” opens the next problem naturally. At this point the recurring source-budget references need their promised explanation, and the transition supplies it.

### Limit the work reaching the database — expectation

I expect a total limit across different keys and different reasons for starting database work.

This section pays off the deferred source-budget references. The arithmetic and then “two executing places” plus “one more request to wait” make admission control tangible. Checking the queued request's remaining deadline is a useful extra step, not merely a label for a semaphore.

The mean/median caveat makes me revisit the 40-place result. I understand that 40 is an illustrative starting limit requiring measurement, but the adjective “conservative” is asserted rather than demonstrated here. I would not now treat the example as a measured capacity recommendation.

“Every refusal needs a response the product can accept” connects the mechanism to the actual page. I pause at “Otherwise return a reduced card with the name and picture”: after a cache miss and refusal to read the source, I do not know where those two fields come from. The example tells me what a useful degraded response might look like, not how this application has it available.

The 40/200-millisecond slowdown examples clearly distinguish a concurrency limit from a fixed start rate. “Adding application servers does not add database capacity” is a compact and useful conclusion. Repeated instructions to count abandoned queries are justified by the earlier experiment; by this point I understand why counting active HTTP callers would be wrong.

### Choose connection limits separately

Heading expectation: explain why the database pool is not already the work limiter. The pool of 50 per server and fleet total of 1,000 immediately answer that. The 240 active fills, only 12 per server, make the hidden fleet-wide problem particularly clear. The database refusal is usefully distinguished from the controlled refusal the application was meant to make. “Put admission before obtaining a connection” is an actionable ordering I can remember.

### Batch different missing keys

Heading expectation: combine several distinct misses efficiently. The eight missing cards out of 24 is sufficient to explain the opportunity. It is a short aside after substantial treatment of admission. “Charge the batch for its expected source cost” leaves a deliberate implementation question: the previous limiter counts places, so I do not yet know how to charge unequal costs. The caveat prevents me treating a batch as magically free, but it does not equip me to build cost-weighted admission.

### When Redis is unavailable — expectation

I expect the mechanisms to be applied to loss of the cache service rather than absence of a key.

“A missing key is an answer from Redis. A timeout is a failure to get an answer” fulfils the heading with a distinction I can use immediately. Subtracting the cache timeout from the overall deadline makes the cost concrete.

The progression from 20,000 requests to about 17,700 remaining fills, then only about 12% full responses under protection, is sobering and useful. “Keeping the database healthy does not mean every request succeeds” prevents me mistaking a successful limiter for a successful customer experience.

The local-cache paragraphs add more figures (1,000 cards, two thirds, 670 fills, 65.7%, 6.7%, 72%) to an already numerical section. I understand the tradeoff—copies cost refresh capacity but serve many requests—more readily than I retain the exact percentages. The assumptions are clearly marked. The circuit-breaker description gives the behaviour before the name, which works well.

### Count every retry

Heading expectation: include retries in the same source budget. The multiplication across three layers goes further and makes the risk obvious. “One request has become as many as 3 × 3 × 3 = 27 source attempts” is easy to remember. The shared allowance then explains why choosing one layer alone is insufficient.

“Backoff and jitter spread attempts out; they do not create room for more work” is another strong distinction. Here the recurring budget lesson earns its repetition because retries are an additional route around it. I can explain the retry policy at a high level, although a token bucket is named rather than taught from scratch.

### Refill a cold cache — expectation

I expect a recovery sequence once Redis can accept entries again, with priorities for the limited filling capacity.

The opening contrast with unreachable Redis is clear and useful: the same admitted query now buys future hits. The comparison of catalogue-order warming with demand fills is the most useful numerical comparison here. I need not retain every intermediate recovery percentage to understand why popularity matters.

The 500/900/1,000-card timings are additional evidence but add tracking effort; the central operational decision comes in “Give warm-up only a share of the source budget and let current demand take priority.” The later instruction to raise traffic in steps names what to observe and when to hold, so I can see how to act rather than merely agree that recovery should be careful.

### When recovery gets stuck

Heading expectation: explain a cache that has returned but whose hit ratio fails to recover. The diagnostic scenario and the following causal chain meet it well. “Traffic returning to its old level may not help, because that level depended on a warm cache” gives a new implication of everything before it, and earns the term metastable failure.

The two recovery paragraphs revisit retries, admission and abandoned queries in a useful sequence. This is repetition with a purpose: I can now associate each control with one part of the loop I must break. “Request logs showing failures are not enough while database backends remain busy” states an observable trap precisely.

### Test the failure paths

Heading expectation: concrete failure exercises and their pass conditions. The table supplies both. The six cases feel usable as a test outline. “Fast failures can make a latency graph look better while fewer customers get useful pages” is an effective ending to the practical explanation and mirrors the opening hit-ratio trap without simply repeating it.

### Where the numbers come from

Heading expectation: identify measured results versus example assumptions. The section does so explicitly. It confirms the earlier caveats and separates simulations from observed query behaviour. “Those unchanged experiments support this rewrite” briefly addresses the article's editorial history rather than the reader's subject; I do not need that sentence to understand the evidence.

### Sources and further reading

Heading expectation: routes to verify or explore the mechanisms. The list associates each source with its purpose, which makes it more useful than unlabelled links. I did not open external sources during this unaided reading.

## What I can now explain or decide

I can explain why a high hit ratio can hide a damaging stampede; estimate overlap from arrival rate and fill duration; distinguish coalescing within a process from a fleet lease; explain why a lease does not stop a database query; and keep caller deadlines separate from shared-load and database timeouts. I can distinguish early refresh for one key from spreading refreshes across keys, and explain why neither protects an empty cache.

I can sketch an admission policy with a bounded queue, count refreshes/retries/warm-up against the same work allowance, place admission before connection acquisition, and say why a large connection pool is insufficient. I can choose a fallback category, recognise that a protected source still leaves many requests without full answers, and explain why demand-aware warming and gradual traffic restoration help recovery.

The prose works without figures. Its strongest teaching device is the same shop becoming progressively less forgiving: expiry, a slow owner, many keys, unavailable Redis, empty Redis and failed recovery. Some stretches require keeping several numerical models in mind at once, especially deadline/lease timings and the outage/recovery percentages. The recurring distinction between request completion and source work remains coherent despite that density.

The first pause about a separately identified failure entry was not resolved later; I have not silently supplied its implementation. I still cannot precisely identify the source-observation timestamp from this article, derive the rough XFetch lead estimate, explain how reduced cards retain their name/picture after refusing a miss, or implement cost-weighted admission for batches. These are limits on what this reading equips me to do, rather than claims that the main mechanism is unintelligible. The promise to explain source limits was fulfilled. The requirement for freshness/versioning beyond a lease is explicitly deferred to other articles.

## Figure observations

Prose reading is complete. The following observations will be made from the rendered page, looking at each figure before its caption.

Access note: the in-app browser was unavailable; Chrome loaded the article successfully. Its automatic initial accessibility snapshot exposed descriptions and captions for all five figures before I could isolate them. I therefore cannot claim a completely caption-blind visual first impression. I inspected the actual rendered diagrams afterwards, in the page's current dark theme, and used their visible controls. I did not inspect implementation code.

### Figure 1: computations after expiry

Visual reading: an increasing count of list computations against milliseconds, with a dashed 40-place fleet limit. It looks like cumulative starts, not a count that decreases when work finishes; the title “List computations started” makes that distinction. The animated line makes continuing arrivals during a fill more immediate than the equation. I selected “Source slows to 600 ms” and saw the same slope continue well beyond the capacity line.

Caption/context: the caption confirms arrival rate multiplied by time to first fill. It supports the prose's 60-versus-240 comparison. The 40-place line is a useful reference after reading the whole article, but a reader encountering the figure in sequence has not yet been given that budget. This is an anticipation of later context, not a contradiction.

### Figure 2: callers sharing one load

Visual reading: four horizontal timelines separate caller A, B, C and the shared load. The different starting points and dashed remaining allowances make the relative deadlines much easier to compare than keeping the prose's six numbers in memory. In the independent-budget state, A visibly ends with an error at 50 milliseconds while B/C end with cards at 100 milliseconds; the load's unused allowance continues to 120. The result label “1 source read, 2 cards” makes the benefit concrete.

Caption/context: the caption names the intended comparison and the two visible controls make it discoverable. I selected the alternative tying the load to A and observed its changed state; it agrees with the failure described in the prose. The price labels add a little shop-specific texture but do not explain anything necessary about deadlines. The diagram is legible and does useful work for a reader who found the timings dense.

### Figure 3: a lease outlived by its owner

Visual reading: Server A's short lease sits above a much longer work bar; Server B gets a later lease and performs work while A is still running. A separate cached-list row changes to B's answer and stays there when A finally attempts publication. The highlighted overlap and “2 computations” label make the wasted work visible. I initially use the prose to identify the thicker yellow strokes as queries; the lease labels alone do not name that stroke type.

Caption/context: “The lease bounds A's permission; a source-side timeout bounds its work” makes the diagram's organising distinction explicit. I selected “With a source timeout”; the image description changed to cancellation at 181 milliseconds followed by B working alone. This is a helpful comparison, and the lease-only final image agrees with the prose's late-publication refusal. Of the figures so far, this one does the most to reduce the effort of reconstructing a multi-step race.

### Figure 4: refresh before the hard limit

Visual reading: requests continue above a refresh interval; an older list has a fixed 30-second endpoint, and a successful refresh introduces a new list before that endpoint. The switch in request-dot colour, labelled older/new list, shows why no caller waits. “Refresh reads at 29.3 s” and the new list's “until 59.3 s” label give a concrete example of the age rule, distinguishing the observation from later storage more clearly than the prose alone did for me.

Caption/context: the caption centres the old list's hard limit. I selected “Refresh fails”; its state describes requests continuing to receive the older list only until 30 seconds, then missing. The old endpoint remains in the same place. This directly supports “A failed refresh leaves the old observation exactly as old as before.” The diagram clarifies that example's observation timestamp; the prose-first uncertainty above remains the record of the earlier reading.

### Figure 5: cold-cache recovery

Visual reading: a steep early recovery curve approaches the normal 94% hit ratio while a straight catalogue-prewarming line rises much more slowly. The labels “61% after 1 s” and “20% after 5 s” make the contrast immediate. At the beginning of the animation, the second line is not yet labelled; I have to wait for the completed drawing to learn that it represents prewarming all 50,000 cards. Once complete, both series are labelled directly and the comparison is easy.

Caption/context: the caption fixes the source allowance and identifies demand filling. Together with the adjacent explanation of catalogue order, the chart supports a concrete recovery decision: spend scarce fills where they will help requests soonest. It makes the numerous prose percentages easier to understand as a trajectory rather than a sequence to memorise. I saw no disagreement with the surrounding model caveats.

### Overall first visual impression

All five diagrams were legible at the browser's current desktop size and dark theme. I observed completed alternate states for the caller deadline, lease timeout and failed refresh comparisons, and the completed slower-fill curve. The figures support explanations already present in the prose. The shared-load and lease timelines save the most mental bookkeeping; the recovery chart gives the most immediately useful comparison. I have not tested other viewport sizes, light theme, keyboard access or reduced-motion behaviour in this first-reading stage.

First-reading stage complete. No informed style or figure-guide review has been performed.
