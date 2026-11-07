# Teach-back answers — v1

Inputs used: `evidence/v1-prose.txt` and `evidence/exit-questions.txt` only. Figures were omitted from the supplied prose. No article source, dossier, plan, other review or outside source was consulted. The answers below use the article’s illustrative model and distinguish its simulations from recorded execution where relevant.

## 1. Unprotected list expiry

About **60 computations** start before the first fill: 400 requests/second × 0.15 seconds. That is 1.5 times the fleet’s 40-fill allowance, or 20 more computations than the allowance. If the fill takes 600 milliseconds, the estimate becomes **240 computations**, four times the original count and six times the 40-place allowance. The slowdown leaves more time for new requests to find the same missing answer and start duplicate work.

Supporting passages:

> Our example list receives 400 requests a second, roughly one every 2.5 milliseconds. The first result takes 150 milliseconds to arrive. During that gap, about 60 requests can each start the same work:
> 400 requests/second × 0.15 seconds = 60 computations

> If the extra load makes each computation take 600 milliseconds, four times as many requests arrive before the first answer. The estimate becomes 240 computations. A slower database gives the stampede more time to grow.

> The shop's example capacity budget permits roughly 40 card fills at once, so this one expired list can occupy half those places.

The execution example observed 61 and 241 starts with chosen delays; those observations illustrate overlap rather than establish the real query’s cost:

> With a 150-millisecond delay, 61 queries started before the first result was cached. Increasing the chosen delay to 600 milliseconds produced 241. These runs demonstrate the overlapping requests; the sleep does not measure the cost of a real list query.

## 2. Per-process coalescing and a shared lease

For **P7**, I would initially refuse the extra shared lease: its approximately 250 requests/second are spread over 20 servers, so each server sees about 12 requests/second and few overlap during a 20-millisecond fill. A handful of duplicate cheap reads can be an acceptable cost; fleet-wide coordination may cost more than it saves.

For the **list**, I would add the shared refresh lease. Per-process coalescing still permits 20 computations, each occupying source capacity for about 150 milliseconds. That one expired key can consume half the fleet’s 40 places. Choosing one fleet-wide owner can save substantial work.

Supporting passages:

> The shop has 20 application-server instances. Each has its own map, so per-process coalescing can still allow 20 copies of the list query.

> P7's roughly 250 requests a second are spread across the fleet, giving each server about 12 a second. Few arrive on the same server during a 20-millisecond fill. Coordinating the entire fleet to save a handful of card reads may cost more than it saves.

> The list is a stronger candidate. Twenty copies each spend about 150 milliseconds in the database. The shop's example capacity budget permits roughly 40 card fills at once, so this one expired list can occupy half those places. A refresh lease lets the servers choose one owner to do the work.

The lease is an **efficiency mechanism** because it reduces duplicate computations but can expire while its owner still works. Owner-token checks must separately reject an expired owner’s publication and release. Even those checks do not establish that a result includes the latest product edit; the article identifies that as a separate versioned-fill problem. It does not teach that separate versioning mechanism here.

> These checks reject an expired owner in this scheme. They do not establish that a result includes the latest product edit; Versioned cache fills explains that separate problem. The lease reduces duplicate work, so occasional overlap is an efficiency cost. A lock protecting a correctness requirement would need the protected resource to reject obsolete owners too.

## 3. An owner outlives its lease

In the article’s illustrative timing:

- At **0 ms**, A acquires the 200-millisecond lease and starts its query. A is the one running computation.
- At **10 ms**, B finds A’s lease and serves a still-permitted older list. B starts no query.
- At **200 ms**, A’s lease expires, but A’s query continues.
- At **210 ms**, B acquires a new lease and starts a 150-millisecond query. **Two computations run concurrently from 210 to 360 ms.**
- At **360 ms**, B finishes and publishes its answer with an owner check. A is then the one remaining computation.
- At **900 ms**, A finishes. Its later publication must be refused, so it cannot overwrite B’s answer. Its release must also be refused, so it cannot delete another owner’s lease. Both operations require an atomic comparison with A’s token.

Two source computations start in total. The lease lifetime bounded permission to act as owner; it **failed to bound how long the source query ran**.

Supporting passages:

> Suppose Server A gets the lease at 0 milliseconds, then its query stalls for 900 milliseconds. B tries at 10 milliseconds, finds A's lease and serves the older list. At 200 milliseconds the lease expires. B tries again at 210 milliseconds, wins, and finishes its own 150-millisecond computation at 360 milliseconds.

> From 210 to 360 milliseconds, both queries are running. Redis has expired A's permission, but PostgreSQL has not been told to stop A's work.

> Its older result must not replace B's, and its cleanup must not delete a lease belonging to a later owner. Both publication and release need an atomic check that the stored token is still A's.

Add a source-side statement timeout and retain admission control over actual source work. In the short experiment, a 180-millisecond statement timeout ended A at 181 milliseconds, before B began. Those numbers are experimental settings, not suitable production defaults for a list that can take 600 milliseconds. Set the statement timeout, whole-load budget and lease using measured tail latency with headroom; keep token checks because an owner can pause after the query.

> With a 180-millisecond statement timeout, the experiment cancelled A's query at 181 milliseconds, before B's replacement began. The token check is still needed because A could pause after its query and before publication.

> Size the statement timeout, whole-load budget and lease from observed tail latency with headroom.

> Count demand loads, early refreshes, warm-up reads and retries against the same source budget. Limit their total work where it runs, including queries whose callers have gone away.

## 4. Per-key wrapper with independent deadlines

This compact adaptation of the article’s Go wrapper assumes its `Card` type and `Group` fields: `sf singleflight.Group`, `Load func(context.Context, string) (Card, error)`, and `Stale func(string) (Card, bool)`. `Stale` returns true only for a copy whose hard limit still permits serving it.

```go
func (g *Group) Get(ctx context.Context, key string) (Card, error) {
    ch := g.sf.DoChan(key, func() (any, error) {
        lctx, cancel := context.WithTimeout(
            context.WithoutCancel(ctx), 120*time.Millisecond)
        defer cancel()
        return g.Load(lctx, key)
    })
    select {
    case r := <-ch:
        if r.Err != nil {
            return "", r.Err
        }
        return r.Val.(Card), nil
    case <-ctx.Done():
        if card, ok := g.Stale(key); ok {
            return card, nil
        }
        return "", ctx.Err()
    }
}
```

`DoChan` shares the load for the complete key. The load’s context is detached from the first caller’s cancellation and given its own 120-millisecond timeout. Each caller selects against its own context; leaving returns a permitted older card or the caller’s error and starts no replacement read. `Load` must recheck the cache and acquire source admission before reading and filling it. Source timeouts and caps on active keys, waiters and source work belong around this wrapper.

Supporting passages:

> Instead, give the shared load its own budget, here 120 milliseconds, and let each caller wait only as long as its own request permits. A can leave at 50 milliseconds while B and C continue waiting.

> A caller that runs out of time returns a still-permitted older card, if it has one, or an error. It does not start another query. Otherwise every impatient waiter would recreate the stampede.

> In Go, context.WithoutCancel detaches the shared load from the first caller's cancellation. A new timeout bounds that load, and DoChan lets each caller select between its own deadline and the result:

> The Load function rechecks the cache, obtains permission to use the source, reads it and stores the result. Stale returns a copy only if its hard limit still allows serving it. The wrapper shows how to share a load; caps on active keys, waiters and source work belong around it.

## 5. XFetch, jitter and an empty cache

With beta 1, the rough first-refresh lead for the list is **0.6 seconds before expiry**; the article’s simulation averaged about **0.7 seconds**. It averaged **2.8 refreshes per expiry**, with 11 at the 99th percentile, so probabilistic early refresh still permits duplicates across the fleet. Per-process coalescing may remove little if attempts land on different servers; add a lease if that remaining overlap exceeds the source budget.

Supporting passages:

> For the list's 400 requests a second and 150-millisecond computation, a rough estimate of the first refresh's lead is 0.15 × ln(400 × 0.15), about 0.6 seconds. Across 2,000 simulated expiries, it began about 0.7 seconds early on average. More requests could start refreshes before that one finished: the simulation averaged 2.8 refreshes per expiry, with 11 at the 99th percentile.

> Per-process coalescing may remove little when the attempts land on different servers. Use a lease as well if the remaining overlap exceeds the source budget.

For cheap fills such as P7, a fixed refresh point spread with jitter, plus justified coalescing, may suffice. Jitter spreads different keys’ refreshes; it does not coordinate callers of one popular key. Neither jitter nor XFetch helps immediately after an empty restart because there is no stored answer, refresh point or previous computation time. Source admission still has to bound fills.

> Jitter spreads work across keys. It does not coordinate the callers of one popular key. For cheap fills such as P7's, a fixed refresh point with jitter and whatever coalescing is justified may be sufficient.

> Neither technique helps an empty cache. There is no stored answer, refresh point or previous computation time to work with. We need a limit that applies to all source work, whatever caused it.

## 6. Redis unreachable at peak

Unrestricted fallback sends **20,000 attempted fills/second** to the database, up from about **1,200**, an approximately **seventeenfold** increase. In the article’s simulation, per-process coalescing joins about **2,300 requests/second** to existing work, leaving about **17,700 fills/second**, nearly nine times the 2,000-fill allowance.

With two executing places and one deadline-checked waiting place per server, source work stays near 2,000 fills/second. Those fills directly give full cards to about **10%** of requests; callers joining them add about two percentage points, so about **12% receive a full card** in that scenario.

Supporting passages:

> If every failed lookup goes straight to PostgreSQL, its 1,200 card fills a second become 20,000 attempted fills a second. The increase is about seventeenfold: the source previously saw 6% of requests and now sees all of them.

> In a simulation with 50,000 cards and the shop's skewed popularity, per-process coalescing joined about 2,300 requests a second to existing work. That still left about 17,700 fills a second, nearly nine times the allowance.

> With two executing places and one waiting place per server, admitted work stayed near 2,000 fills a second. Those fills directly served about 10% of requests. Callers that joined them added about two percentage points, so roughly 12% received a full card. The remaining callers needed the defined fallback.

The rest should receive the defined fallback promptly: an older copy still within its original hard limit, including a local copy if available; otherwise a reduced card with its name and picture and price marked temporarily unavailable, or an explicit error such as HTTP 503. Lack of capacity must not become a zero price or “product not found”.

> Try a cached copy that is still within its hard limit, including a local copy if Redis is unavailable. Otherwise return a reduced card with the name and picture but a price marked temporarily unavailable, or fail quickly with an explicit error such as HTTP 503. Do not turn missing capacity into a zero price or “product not found”. Checkout still checks the authoritative price.

## 7. Recovery stuck after failover

The system is in a **metastable failure**. The cache is available, but misses overload the database; queries then run beyond caller deadlines, so almost no useful fills finish. Retrying and abandoned queries sustain the overload. Returning to the previous traffic level need not help because that level relied on a warm cache.

Supporting passages:

> The cache is available again, but the system cannot refill it. Most requests miss, so too much work reaches the database. Queries slow beyond the callers' deadlines, leaving few useful answers to store. Retries add work, and abandoned queries keep using capacity.

> This is a metastable failure: a temporary disturbance has pushed the system into a state that sustains its own overload. Traffic returning to its old level may not help, because that level depended on a warm cache.

My first two changes follow the article’s sequence:

1. **Stop amplification and reduce admitted demand enough for fills to finish.** Disable independent retries outside the loader, enforce the loader’s shared retry budget, and put source admission in place. If no working application limiter exists, shed traffic at the edge for emergency relief.
2. **End abandoned work at the database.** Set a statement timeout within the load budget and verify that timed-out queries actually stop. As useful fills resume, raise traffic gradually while measuring source latency and work in progress.

> First stop the amplification. Disable retries outside the loader, enforce its retry budget, and put the admission limit before the source. If the application has no working limiter, shedding traffic at the edge can provide emergency relief. Reduce demand far enough that admitted queries can finish and populate the cache.

> Then stop abandoned work at the source. Set a suitable statement timeout within the application's load budget and verify that timed-out work actually ends. Request logs showing failures are not enough while database backends remain busy.

## 8. Refilling an empty Redis

Under the article’s popularity model, **all 1,000 most-requested cards return by about eight seconds**; 500 are back by 0.8 seconds and 900 by 2.6 seconds. Together they serve **about two thirds of requests**. Half a second is only the theoretical minimum to fill 1,000 at 2,000/second, because demand does not request them in perfect popularity order.

> The 1,000 most requested cards serve about two thirds of requests. Filling all of them needs at least half a second at the full allowance, but demand does not request them in perfect order. The simulation had 500 back within 0.8 seconds, 900 within 2.6 seconds and all 1,000 by about eight seconds.

Prewarming all 50,000 first consumes at least **25 seconds** at the full allowance and spends capacity on less useful cards while popular requests wait. In the model, catalogue-order warming restored about **20%** of requests after five seconds, compared with **80%** from demand fills. Warm-up should receive only a share of the source budget and yield to current demand; yesterday’s most popular cards are a more useful warm-up target.

> Fifty thousand cards at 2,000 fills a second take at least 25 seconds. A catalogue-order warm-up in this model restored about 20% of requests after five seconds, compared with about 80% from demand fills.

> Give warm-up only a share of the source budget and let current demand take priority.

The two measurements for increasing traffic are **source fill latency** and **admitted work in progress**. Latency should stay near the model’s normal 20-millisecond median and 60-millisecond 99th percentile, and work must remain within the 40-place limit. Hold or reduce traffic when latency rises sharply or saturation brings persistent refusals; hit ratio alone is insufficient.

> Increase traffic in steps while watching source fill latency and admitted work in progress. Latency should remain near the example's normal 20-millisecond median and 60-millisecond 99th percentile, with work within the 40-place limit. If latency rises sharply or the limit stays saturated with persistent refusals, hold or reduce traffic.

These recovery timings are model results, not a promise for another service:

> They show what happens under those assumptions, including idealised local-copy maintenance and a recovery run without expiry. They are not forecasts for another service.

## 9. Fifty connections per server

A 50-connection pool on each of 20 servers permits **1,000 connections**, far above the intended 40 executing fills. At the normal 1,200 misses/second, slowing fills from 20 to 200 milliseconds raises work in progress from about **24 to 240 fills**, or only **12 per server**. The individual pools still have room, so they do not provide the intended short wait and fallback; the database can overload first.

> Across 20 servers that permits 1,000 connections. It is a much larger allowance than the 40 executing fills we intended.

> At the normal miss rate of 1,200 a second, increasing fill duration from 20 to 200 milliseconds raises the work in progress from about 24 to 240 fills. That is only 12 per application server, so a pool of 50 would not make those requests wait. The database can be overloaded before any individual pool is full.

With the article’s PostgreSQL 16 default connection settings, callers can instead encounter a database connection refusal before the application pool fills. That is not controlled admission and a defined fallback; raising `max_connections` may merely admit still more overload.

> With PostgreSQL 16's usual default of 100 total connections and three reserved for superusers, an ordinary fill role reaches the database's limit first.

> The failure is a connection error, not our planned short queue and fallback. Raising max_connections may remove that error while admitting still more work than the database can handle.

I would specify a fleet-wide **40-place source limit**, implemented in this example as **two executing fills and one waiting place per server**, with admission before acquiring a connection. Recheck a queued request’s deadline before starting; refuse excess or no-longer-useful work promptly with the defined fallback. Size each connection pool for admitted fills plus the server’s other database use, and bound its acquisition wait. Count refreshes, retries and abandoned source work within the source allowance too.

> Across 20 servers, that gives each server two executing places. When both are occupied, allow at most one more request to wait. When a place opens, check that waiting request's deadline again. If too little time remains for a useful result, refuse it. If the waiting place is already occupied, refuse the new request immediately.

> Put admission before obtaining a connection. Size the pool for the admitted fills and the server's other database uses, and give connection acquisition its own bounded wait.

At **30 servers**, retaining two places each would permit 60 fills and break the budget. Reallocate: one place each with ten places unused, explicitly distribute the remaining ten places, or enforce a shared limit at the source.

> Thirty servers with two places each permit 60 fills at once, not 40. Give each one place and accept some unused allowance, distribute the remaining places explicitly, or enforce a shared limit at the source. Adding application servers does not add database capacity.

## 10. Retry multiplication and budgets

Three attempts at each of the proxy, loader and database client can produce **3 × 3 × 3 = 27 source attempts** for one request. Retries should live in **one layer**, usually the loader that knows the remaining operation deadline; disable the other layers’ independent retries for this path.

> One proxy request can call the loader three times. Each loader call can call the database client three times, and each client call can try the query three times. One request has become as many as 3 × 3 × 3 = 27 source attempts.

> Choose one layer to retry, usually the loader that knows the operation's remaining deadline. Disable independent retries at the other layers for this path. Each attempt goes through the same coalescing and admission checks, and a caller that has left starts no new attempt.

Use a per-request limit **and a shared retry allowance**: the article gives at most 10% of request volume over a chosen interval as an example. A token bucket can charge retries and replenish on successful work. Stop retries when that budget is spent, too little deadline remains, the caller has left, or the failure explicitly refuses overload. All attempts still pass through coalescing and source admission. Backoff and jitter spread attempts over time but add no capacity.

> A per-request limit is still insufficient if every request fails. Give retries a shared allowance too: for example, permit retries to consume at most 10% of the request volume over a chosen interval. A token bucket can spend tokens on retries and replenish them as work succeeds. Stop when the budget is spent, the deadline is too close, or the failure is an explicit overload refusal. Backoff and jitter spread attempts out; they do not create room for more work.
