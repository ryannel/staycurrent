# Plan: Designing a cache: a worked example (article 12)

## The reader's starting situation

They have read articles 1–11, or some of them. Each taught one decision with the
others held still. They have not yet seen the decisions made together, in order,
for one system, and they have not seen the places where one decision forces
another. They may also arrive here first, wanting a design method; for them every
decision must state its reason in a sentence and link to the section that holds
the full reasoning.

## The system

The shop that every article has used, now designed whole: 2,000,000 products
(about 2 KB of JSON each, popularity Zipf-like with exponent 0.9, as in article
11), 1,000 product page views a second at peak, a home page with the trending
panel at 500 views a second (article 6), 20 orders a second at checkout, prices
edited about once a second with occasional sale repricing, stock changing with
every sale, sessions and baskets on every page, and a database that answers about
300 product-sized queries a second before its latency climbs (article 11).
Listing pages are left as the reader's next design (checklist), because modelling
24 product reads per page would double the article without a new decision.

## Questions, in order

1. Is this a latency cache or a capacity cache, and what does the database's
   capacity leave for misses? (Budget: 70% of 300, minus checkout's 60.)
2. What to cache and what not: product details, stock as its own key, the
   trending panel; not the price and stock read at checkout, not sessions and
   baskets (data, separate Redis). The cost of not caching, in database queries.
3. Pattern and keys: cache-aside, delete on write; key names; what stays out of
   the key (currency is applied after the read).
4. How long may a copy live? Apply article 4's rT/(1+rT) to the whole catalogue:
   a 10-minute TTL caps product hits at 62% whatever the memory, because the long
   tail is read too rarely. Freshness has to come from deletes; the TTL becomes a
   backstop chosen for hit ratio and memory. **Figure 1** shows the database
   budget respond to each decision.
5. Invalidation: outbox relay deletes, leases for the stale-set race; why a long
   backstop TTL makes lost deletes and races expensive; a sale repricing as a
   burst of deletes.
6. Stampedes: reads × rebuild time per key family; only the trending panel needs
   more than jitter; cold starts belong to the failure plan.
7. Memory and eviction: measured bytes per entry, maxmemory and headroom,
   allkeys-lru with the reason (marginal keys are read every few hours).
8. Talking to Redis: one MGET per product page, timeouts, retries.
9. Topology: one primary, one replica, Sentinel; why no cluster (memory,
   throughput and network arithmetic); a separate, persistent Redis for sessions.
10. Failure plan: limit by Little's law with checkout first, breaker, degraded
    pages, warm-up rules. **Figure 2**: the playground.
11. Watching and securing it: per-family hit ratios, alerts, ACL users.
12. The design on one page (table); what would change it (less skew, more
    traffic, several regions); the design review checklist.

## Figures

**Figure 1, "The database budget" (no clock; controls).** One stacked bar of
database queries a second by source (product details, stock, checkout) against
capacity (300) and the alert line (210). Controls: how copies stay fresh (TTL only
/ delete on change), product TTL (1 min … 24 h), memory for product details
(1–8 GB), where checkout reads prices (database / Redis). Readouts: product hit
ratio, the longest a page can show an old price, memory in use, the price charged.
Single idea: every decision lands in one shared budget. Notice: with TTL only,
no TTL meets both the staleness requirement and the budget; with deletes, the TTL
and memory must both be large; caching checkout prices saves 40 queries and
costs correctness. Model: analytic (TTL cache per key, Che's approximation for
LRU, the smaller cap per key), checked against a simulation and against Redis.

**Figure 2, "The design under failure" (live playground).** The shop scaled to
20,000 products as in article 11, with four decisions as switches (replica and
Sentinel; database limit none / shared / checkout first; trending panel plain or
serve-stale behind a lock; TTL jitter) and two incidents as buttons (primary
fails; deploy with a new key version), plus skip ahead. Charts: work offered to
the database against capacity; failed browsing and failed checkouts. Single idea:
each decision exists for an incident; remove one and see which. Notice: the
replica turns a cold start into a few seconds; the limit keeps a cold start from
becoming a backlog; checkout-first keeps orders flowing; an unprotected trending
key turns a cold start into a collapse; without jitter, a deploy's cold wave
returns one TTL later.

## Where to stop

No new mechanism is taught. Each decision gets the reason and the number that
decide it for this shop, and a link. Multi-region is a short note (Facebook's
remote markers and commit-log invalidation), not taught. Listing pages,
personalised pages and search are named as further designs with pointers.

## Evidence to gather (Redis 8.10.3, port 7112)

- Bytes per entry for the product document, the stock key, the trending value.
- Redis allkeys-lru against the model at exponent 0.9, at a realistic pace.
- The design's commands end to end: MGET read path, fill with jittered EX,
  lease fill with SET … NX PX and SET … IFEQ, trending lock with DELEX … IFEQ,
  ACL users for the application and the relay, refusals of FLUSHALL and KEYS.
