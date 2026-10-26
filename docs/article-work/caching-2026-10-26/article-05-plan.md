# Article 5 — Cache stampedes

Planned, not yet drafted or published. Four visual arguments; keep their jobs
separate. Avoid a generic dashboard or pretending coordination is free.

1. Concurrent burst: 12 callers for one absent key, three application processes,
   four source execution slots. No coalescing => 12 source jobs queued in waves;
   per-process coalescing => 3; ideal shared lease/coalescing => 1. Time scrubber
   and explicit Play/Pause can show jobs moving from queued to active to finished,
   request groups waiting for the one result. Fixed job latency, FIFO, simultaneous
   arrivals, no cancellation of already-enqueued duplicates; all illustrative.
   Vary process count to show local scope. Intro approximate arrivals during load
   = arrival rate × load duration, not a benchmark. Cache miss alone cannot choose
   a single loader. Bound waiter count, deadlines, in-flight key map; clean up on
   failure, preserve per-caller cancellation semantics. Recheck cache inside leader.
2. TTL jitter: 60 independent keys loaded together, base deadline 60s, shorten by
   reproducible pseudo-random 0..20s. Histogram on common 40..60s axis. Peak versus
   spread; no individual lifetime exceeds freshness budget. Does not help all
   callers hitting one newly absent key; coalescing and jitter solve different
   dimensions. Jitter spreads recurring work, not initial cold start. Randomness
   need not perfectly balance every run. Refresh-all timers recreate synchrony.
3. Lease expiry: A owns token A and starts loading, lease expires while A is still
   running, B acquires token B and also loads. Show both jobs active. A's late
   completion must not delete B's lease or overwrite under expired ownership.
   Compare token+fill+release atomically in lab. A lease limits ownership interval,
   not lifetime of actual source work; not exactly-once or a general correctness
   lock. Keep this single-primary cache efficiency pattern distinct from Redlock,
   source fencing and prior article's invalidation generations. Lock unavailable
   must not make every waiter bypass it to the source. Bounded wait/backoff/read.
4. Stale-while-revalidate: soft threshold 10s, hard maximum age 20s. Request in
   between may return saved value and trigger one bounded refresh. Concurrent
   callers share refresh. Failure does not reset age/deadline. At hard limit do
   not return old value; bounded wait, authoritative fallback within capacity or
   controlled failure. Source changes at t=5. Buttons advance5/read/finish/fail.
   Successful refresh's age starts at source observation, not completion; avoid
   reintroducing article 3's freshness mistake. Label illustrative times. Real
   Redis retention must reach hard limit so soft expiry is application metadata.
   Eviction can still remove the saved value early. Do not imply HTTP headers are
   interpreted by Redis: application adaptation of RFC5861 idea.

Native worksheet: independent Redis 8.2.2 container, SET lease unique-token NX PX;
second owner denied; expiry then B ownership; token-checked late A release and fill
rejected; B atomic fill/release succeeds. Also illustrate unsafe unconditional DEL
removing successor lease. No database measured, no multi-node correctness claimed.
Use Lua compare/delete for Redis8.2 baseline (new DELEX versions not relevant).

Primary research already opened/read 26 October 2026:
- https://pkg.go.dev/golang.org/x/sync/singleflight (API duplicate suppression).
- https://www.rfc-editor.org/info/rfc5861/ (actual full text available here;
  stale-while-revalidate and stale-if-error have bounded windows; HTTP-specific).
- https://aws.amazon.com/builders-library/caching-challenges-and-strategies/
  redirects to builder.aws.com/content/3K9TeXp6strMiJ4vhakpRD7BQWO/caching-challenges-and-strategies;
  coalescing and cache-addiction source-overload discussion.
- https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/
  is the working URL; old develop/use/patterns path gave no content.
Read focused SET/lock sections and verify native exercise before prose claims.

Finish by connecting per-key duplicate suppression to aggregate source admission:
one load per key is still too much for thousands of cold keys. Next failure article
handles capacity, deadlines, retries and recovery. Early refresh/prewarming are
options with bounded work, not magic universal policy. Do not write rate-limit or
queue internals here at expense of the main cache argument.
