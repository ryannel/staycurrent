# Plan: Application caching with Redis (introduction)

## The reader's starting situation

An engineer who has built a web application on a relational database. They have
seen a page get slow under load, or a database CPU graph climb, and have heard
"put Redis in front of it". They know SQL and HTTP; they have never designed or
run a cache and do not know what a hit ratio implies.

## Questions the article answers, in order

1. Why would an application keep copies of answers at all? (Repeated work: the
   same query asked again and again, with the same answer.)
2. What is the simplest correct way to keep a copy? (Cache-aside read path with
   `GET` and `SET ... EX`, and why the expiry goes in the same command.)
3. How do we measure whether the copy helps? (Hit, miss, hit ratio, and what
   Redis itself counts.)
4. What does a given hit ratio buy? (Derivation: mean latency and database
   reads as functions of h; miss ratio sets database load; break-even.)
5. Why does the mean mislead? (Hits and misses form two groups; the tail is set
   by misses until the miss ratio falls below the percentile.)
6. How can a cache much smaller than the data reach a useful hit ratio?
   (Skewed popularity, Zipf-like distributions, working set; honest about the
   exponent; LRU falls short of the ideal; what a real Redis did.)
7. What does a cache cost? (Staleness, a dependency that multiplies database
   load when it is lost, memory and the default configuration.) Each posed as a
   question with the article that answers it.
8. Where does Redis sit among the caches a request already passes? (Browser,
   CDN, in-process, Redis, database buffer pool.)
9. What is Redis, concretely? (A separate in-memory key-value server reached
   over the network; a real `redis-cli` session; measured loopback round trip.)
10. What can the reader now decide, and where does the collection go next?

## Figures

1. **Repeated work.** Live. An application and a database, no cache; requests
   for products with skewed popularity. A tally beside the scene counts how many
   times the database has computed each product's page. One control: visitors a
   second. Notice: the same few answers are computed again and again, and the
   database load rises in step with traffic.
2. **The cache-aside read path.** Stepped. Lanes: Application, Redis, Database.
   A first request misses (`GET` → nil), reads the database, stores with
   `SET product:42 … EX 60`; a second request hits. Notice: the miss costs
   three trips, the hit one.
3. **Hit ratio.** Live. Clients, application, Redis, database. No parameter
   control; readouts for hits, misses, hit ratio, database reads a second.
   Notice: the ratio settles; only misses reach the database.
4. **What a hit ratio means for the database.** No clock. A choice of hit
   ratio (0%, 50%, 90%, 95%, 99%, 99.9%). A grid of 1,000 requests where misses
   are rings; bars for mean latency and database reads a second. Notice: going
   from 95% to 99% takes the database from 50 to 10 reads, while mean latency
   moves from 2.0 to 1.2 ms.
5. **Averages hide the misses.** No clock. Hit ratio slider; latency histogram
   with p50 and p99 markers. Notice: the median becomes a hit long before the
   p99 does; p99 is a miss until fewer than 1% of requests miss.
6. **How popularity is spread.** No clock. Exponent slider. Cumulative curve:
   share of requests served by the most popular x% of items, with markers at
   1% and 10%. Notice: at s = 1 the top 1% serves about two thirds; at the
   proxy-trace exponents (0.64 to 0.83) far less.
7. **A small cache, a real workload.** Live. Same scene as figure 3, with one
   control: how many keys Redis holds. Readouts: hit ratio and the ideal for
   that size. Notice: hit ratio rises quickly then slowly; LRU falls short of
   the ideal.
8. **A cached copy goes stale.** Stepped. The database changes while Redis
   holds the old value; reads return the stale copy until expiry. Notice: the
   TTL bounds how long the copy can be wrong, and nothing else does.
9. **When the cache disappears.** Live. Line chart of database reads with an
   assumed database capacity; a button empties Redis. Notice: at 95% the
   database jumps twentyfold, and stays over capacity while the cache refills.
10. **Where Redis sits.** Static. The caches a request passes from browser to
    database disk, with what each one holds.

## Where to stop

- Patterns other than cache-aside: one paragraph, link to article 2.
- How expiry and eviction work inside Redis: named, linked to article 4.
- Invalidation races: one sentence, article 5.
- Stampedes: the cold-start spike in figure 9 is shown, its remedies linked
  to articles 6 and 11.
- Redis internals (event loop, encodings, memory): article 7.
- HTTP caching: out of scope; named only to place Redis.
- Miss-ratio curve modelling and LRU sampling: article 4. Here only "LRU falls
  short of an ideal cache" and one real measurement.

Further depth would not change the decisions this article prepares: whether a
workload is worth caching, what hit ratio it needs, and what questions the
rest of the design must answer.
