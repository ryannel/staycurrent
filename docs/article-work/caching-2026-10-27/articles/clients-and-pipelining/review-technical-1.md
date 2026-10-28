# Technical review, round 1: Redis clients: round trips, pipelining and atomic operations

Reviewer's evidence: `docs/article-work/caching-2026-10-27/evidence/clients-and-pipelining-review-1.txt` (cited below as E1 to E14). I ran my own checks on Redis 8.10.3 (port 7158), redis-py 8.1.0 in a fresh venv, and go-redis v9.23.0. I also read the client sources at the tags the article names and the redis.io pages and papers it cites. I did not use the writer's evidence as proof.

## Verdict

The article is accurate in almost all its specific claims, and I reproduced each of the ones I checked. That covers the RESP bytes, pipeline and `MGET` behaviour, the output-buffer growth, `maxclients`, the four library timeout defaults, redis-py's retry policy and failure times, `MULTI`/`EXEC` error handling, every `WATCH` abort trigger (including eviction), script partial writes, `BUSY`/`SCRIPT KILL`/`UNKILLABLE`, `NOSCRIPT` and lost functions after a restart, and every Redis 8.4 compare-and-set result. The quotations from Brooker, the SRE book, Dean and Barroso, and the Facebook paper match their sources, and the retry model behaves as the prose says.

The main problem is in the advice on retries. The article teaches "retry only idempotent commands" and offers transactions and scripts as the cure for lost updates. It does not tell the reader that the library defaults it names re-send transactions, scripts and whole pipelines after a timeout. I watched that happen. It also does not tell the reader that an idempotent `SET` can still overwrite a newer value when it is retried. Four findings are required and twelve are suggested.

## Required

### R1. Library retries re-send transactions, scripts and pipelines, not only single commands

**Where:** "Retries" (second paragraph and the list), the closing advice "retry only idempotent commands", the table in "Choosing the tool", and "Lua scripts".

**Problem:** The article shows redis-py retrying `INCR`, then advises "retry only idempotent commands". It never says that the default retry in both libraries it names applies to everything sent through the client: `MULTI`…`EXEC` blocks, `EVALSHA`, and whole pipelines. A reader who switches from `GET`+`SET` to the article's Lua script or to `MULTI`, as the article advises, will still double-apply after a timeout and will get no error. The table's "Watch out for" column gives the retry risk only for single commands. With the client's built-in retries left on, the reader cannot choose what gets retried.

**Evidence:**
- redis-py 8.1.0, with the default retry, a 0.1 s socket timeout and a 0.5 s stall on another connection (E9):
  - A non-transactional pipeline of `INCR a`, `INCR b` left both at 2.
  - A `MULTI`/`INCR a`/`INCR b`/`EXEC` pipeline left both at 2.
  - The article's own sale-counter script, run through `register_script` (`EVALSHA`), took `sold` from 10 to 12.
  - All of these returned success. A `WATCH` transaction was not retried, but it raised `TimeoutError` although it had run (`w` was 1).
- go-redis v9.23.0 with a warm pool, `ReadTimeout` 100 ms and the same stall: one `Incr` call returned 104, with no error (E12). It counted four times. Its source sets `retryTimeout` on a read timeout for every non-blocking command (`redis.go` `_process`; `error.go` `shouldRetry`), so retries cover timeouts, not only connection errors.

**Correction:**
1. In "Retries", say that redis-py 8.1 and go-redis v9.23 apply their retries to every command, including `INCR`, a `MULTI`…`EXEC` block, a script and a whole pipeline, and that both retry after a timeout.
2. Give the practical rule. To retry only idempotent operations, turn the library's retries off, or keep a separate client with retries off for non-idempotent writes, and retry in the application. Alternatively, make the write idempotent, for example with a version check (`SET … IFEQ`) or a request id, so that repeating it is harmless.
3. Add "a library retry after a timeout runs it twice" to the `MULTI`, script and single-command rows of the table.
4. Add one line to the scripts section: a script is atomic, but running it twice is not the same as running it once.

### R2. "SET is safe to retry" is false when another client writes in between

**Where:** Figure 5 prose ("the same sequence is harmless"), the idempotence paragraph ("The property that makes `SET` safe to retry is idempotence"), and "A cache's own traffic … is mostly idempotent, which is lucky".

**Problem:** Idempotence means that running a command twice in a row gives the same result as running it once. It does not make a late duplicate safe. A timed-out `SET` that is retried, or that simply runs late from the server's buffer, can land after a newer write from another client and overwrite it. In a cache, that is how a stale value comes back after an invalidation. The stall that causes the timeout is also when other writers' commands queue up, so the interleaving is likely rather than exotic.

**Evidence:** E10. Client A ran `SET price 35` with redis-py defaults and a 0.1 s timeout during a 0.5 s stall. Client B sent `SET price 36` 50 ms later. A's call returned True, and the final price was 35 in all three runs, so B's newer write was lost.

**Correction:** Keep the Figure 5 contrast, but add one or two sentences:

> Idempotence makes a retry safe only if nobody else writes the key in between. A retried or late `SET` can overwrite a newer value. For cache fills, use the guarded fills from Cache invalidation and consistency (a lease, or `SET … IFEQ`), where a retry fails harmlessly.

Then reword "mostly idempotent, which is lucky" so that it does not suggest fills are safe to retry blindly. One more point is worth a sentence: a retried `SET … IFEQ` whose first attempt succeeded returns nil. The data is then correct, but the caller wrongly believes it lost.

### R3. Pool sizing says nothing about what happens when the pool runs out

**Where:** "Connections and pools", "How large should a pool be?" and "Size pools from the arithmetic above rather than generously".

**Problem:** Little's law gives the average number of connections in use. During a Redis stall, every request holds its connection for up to the full timeout. An instance making 2,000 requests a second with a 100 ms timeout then needs about 200 connections. The article recommends small pools but omits the failure behaviour and the setting that controls it, the time to wait for a free connection. The defaults are far from the article's goal of keeping the whole call within the page's budget:
- go-redis v9.23 waits `PoolTimeout = ReadTimeout + 1 s`, which is 6 s by default, for a free connection. It also treats a pool timeout as retryable (`shouldRetry`: `pool.ErrPoolTimeout` returns true).
- redis-py's default `ConnectionPool` allows 100 connections and fails at once with `MaxConnectionsError`.
- redis-py's `BlockingConnectionPool` waits up to 20 s.

**Evidence:** go-redis `options.go` at v9.23.0, lines 341–345 and 772–777, and `error.go` at the same tag. For redis-py, `connection.py` at 8.1.0 and the E11 test: an exhausted pool failed in 0.0 ms, the default `max_connections` is 100, and `BlockingConnectionPool` defaults to 50 connections and a 20 s timeout.

**Correction:** Add a short paragraph to the pool section along these lines:

> The arithmetic gives the average. When Redis stalls, each request holds its connection for up to the command timeout, so size the pool for rate × timeout, or accept that requests will wait. Then set the wait for a free connection (go-redis `PoolTimeout`, redis-py `BlockingConnectionPool(timeout=…)`) to a few milliseconds, and treat running out as a miss.

Name the defaults and their versions. Add "the wait for a pooled connection" to the closing list of things the reader can now set.

### R4. The Lua JSON script silently changes cached values

**Where:** "Lua scripts", the `cjson` example and the sentence "note that it does not keep the order of a JSON object's fields, which matters only if something compares the text".

**Problem:** The article presents decoding and re-encoding JSON in a script as the fix for the lost sale count, and names field order as the only caveat. Redis's `cjson` also changes the data:
- An empty array becomes an empty object.
- Integers with more than 14 significant digits become rounded floats, which affects ids such as snowflake ids and timestamps in microseconds.

Following the example as written can therefore corrupt cached products in ways the application's JSON parser will then accept.

**Evidence:** E3. `cjson.encode(cjson.decode('{"name":"Kettle","tags":[],"id":12345678901234567,"price":3500,"sold":10}'))` returned `{"name":"Kettle","tags":{},"price":3500,"id":1.2345678901235e+16,"sold":10}`.

**Correction:** Replace the field-order caveat with these two concrete changes. Recommend keeping counters that scripts update in a hash field (`HINCRBY`, which the article already recommends), or applying the script only to values whose shape you control. Optionally, note that Redis 8 builds that include the JSON data type offer `JSON.NUMINCRBY` as a single atomic command. This Homebrew build has no JSON data type (E1 header), so do not claim it without a version.

## Suggested

**S1. The `WATCH` round-trip counts are one too high.** `WATCH` and the read can share a round trip. A raw socket sending `WATCH k`, `GET k`, `MULTI`, `SET k 9`, `EXEC` in one write got all five replies (E2). The article's own Figure 7 model and caption already send "WATCH and GET together". The prose for Figure 8 ("3 round trips"), the table ("3 or more") and the compare-and-set comparison ("2 … against 3 for `WATCH`") use a different count.
- Say that an uncontested `WATCH` write takes 2 round trips at minimum.
- Restate the advantage of `IFEQ` as what it really is: no state on the connection, so it works on multiplexed clients and costs nothing when the check fails. Either approach costs one round trip to refuse a late write.
- Note that a `WATCH` that is abandoned without `EXEC` needs `UNWATCH`.

**S2. go-redis retry timings.** Configured bounds of "between 10 ms and 1 second" are correct, but the backoff formula gives 10–30, 10–50 and 10–90 ms for its three retries (`internal.RetryBackoff`). Underneath that, each attempt dials up to 5 times, 100 ms apart (`DialerRetries`, `DialerRetryTimeout`). I measured failures with 50 ms timeouts taking 1.7 s against a refused port and 2.8 s against a silent host (E12). That pattern is just like the redis-py result the article reports, and stating it would make the article's point more general than "redis-py does this".

**S3. Lettuce re-sends on reconnect.** "Other libraries differ again" could name the third pattern. Lettuce 7.9 defaults to `autoReconnect=true`, with an unbounded request queue while disconnected (`ClientOptions`), so commands buffered across a reconnect are sent later, which gives at-least-once delivery. One sentence would be enough. Check Lettuce's reliability documentation before stating exactly which in-flight commands it replays.

**S4. Where the stalled command waits.** In Figure 5 and the prose, the `INCR` is said to wait "in Redis's input buffer". While the main thread is busy, Redis has not read it; it sits in the kernel's socket receive buffer. That detail is what explains the article's own FIN-versus-RST result: an abrupt reset discards unread bytes, while a normal close leaves them to be read. I reproduced it: 50 of 50 ran after FIN and 0 of 50 after RST (E6).

**S5. Figure 3's text alternative does not match the default rendering.** At 24 independent round trips, the seeded wall shows "17 of 100" pages slow, while the text alternative says "about 21 pages in 100" (E14). Either say that the drawing shows one random sample, with 21% expected, or choose a seed near 21.

**S6. `MULTI` wording.** "Other clients see all of the writes or none of them, never half" is true of isolation, but a command that fails at run time leaves the others applied (the article's own `[1, WRONGTYPE, 2]`). The transactions page also warns that a hard crash with AOF can persist part of a transaction. Suggested wording: "no other client's command runs in the middle, so nobody sees the transaction half done".

**S7. `NOSCRIPT` inside a pipeline.** The eval-intro page says that "the `NOSCRIPT` error can return from a pipelined request but can't be handled". The `EVAL` fallback in a client library does not help inside a pipeline or a `MULTI`. Half a sentence would cover it.

**S8. `busy-reply-threshold`.** Note that this setting was called `lua-time-limit` before Redis 7.0, which remains an alias, so readers on older versions or managed services can find it. It also applies to functions.

**S9. `DEL` and `EXPIRE` as idempotent.** Their effect is idempotent, but `DEL`'s reply changes from 1 to 0 on a retry. Code that uses the reply as "I deleted it" would then misbehave. A retried `EXPIRE` with a relative time also restarts the clock. Neither is serious; a parenthesis would cover both.

**S10. Source URLs.** Four redis.io links are meta-refresh stubs (E13). Update them to the canonical pages:
- `develop/using-commands/transactions/`
- `develop/using-commands/pipelining/`
- `develop/programmability/eval-intro/`
- `develop/programmability/functions-intro/`

The Brooker link now redirects to builder.aws.com and still works. The Jedis and Lettuce source entries have no links.

**S11. Source for "metastable failure".** The term is introduced without a source. Cite Bronson, Aghayev, Charapko and Zhu, "Metastable Failures in Distributed Systems", HotOS 2021, or Huang et al., OSDI 2022.

**S12. Pool size defaults.** The article gives go-redis's pool default (10 × GOMAXPROCS) but not redis-py's 100 per pool. Add redis-py's figure, or none, so that the multiplication example ("200 instances × 50") can be checked against real defaults.

## Checked and correct

I confirmed each of these against the source and, where marked, by running it.

- **RESP and connections.** The RESP bytes and lengths; RESP3 and `HELLO` arriving in 6.0; the `HELLO 3 AUTH` form; the TLS 1.3 and 1.2 round trips.
- **Pipelining and output buffers.**
  - The latency page's 200 µs; the pipelining page's 250 ms RTT giving four requests a second, and its 10k batch advice.
  - `client-output-buffer-limit normal 0 0 0`: run; 200 MB of output buffer, freed on close.
  - `maxclients` 10000 and the exact error text: run.
  - `CROSSSLOT`.
- **Client libraries.**
  - redis-py 8.1.0: 5 s socket and connect timeouts; 10 retries; backoff starting at up to 20 ms and doubling to a 1 s cap. Failure times for a refused port and a silent host of about 2.7–5.4 s with retries on, and 0 and 52 ms with them off: run. The double-counted `INCR`: run.
  - go-redis v9.23.0: 5 s read timeout, 3 retries, pool of 10 × GOMAXPROCS.
  - Jedis 8.0.2: 2000 ms. Lettuce 7.9.0: 60 s.
  - The pool and multiplexing descriptions match redis.io's "Connection pools and multiplexing".
- **Transactions and `WATCH`.**
  - `EXECABORT` on a queueing error; no rollback on a run-time error: run.
  - `WATCH` is aborted by a same-value write, by expiry and by eviction (this build has had the expiry behaviour since 6.0.9), and also by `EXPIRE`. It is not aborted by a write to another key or by a read: all run.
- **Scripts and functions.**
  - Partial writes from a failing script; `BUSY`, `SCRIPT KILL` and `UNKILLABLE`; `SHUTDOWN NOSAVE` as the only way out: run.
  - `NOSCRIPT` before loading and after a restart: run.
  - Functions lost on a restart without persistence; `FUNCTION LOAD` failing without `REPLACE`: run.
  - `FCALL_RO` on replicas; functions are persisted and replicated (functions-intro).
- **Redis 8.4 commands.**
  - `SET … IFEQ`/`IFNE`, with their rules on creating a missing key; `WRONGTYPE` on a hash.
  - `DIGEST` returning 16 hex characters (XXH3); `DELEX … IFEQ`.
  - `MSETEX` with `EX` and with `NX` all-or-none: all run. The 8.4.0 "since" metadata on all of these.
- **Papers and books.**
  - Facebook paper: 521 items, 1,740 at the 95th percentile, batches of 24 keys.
  - SRE book: a 10% budget, about 3× load falling to 1.1×.
  - Brooker: the p99.9 timeout rule, the side-effects sentence, and 243×.
- **Models.**
  - The ladder model's arithmetic: 24 × 0.51 ms.
  - The tail model: 1 − 0.99ᵏ, and the burst model at about 4% at 24.
  - The retry model: run for 90 s with three seeds. With no retries or a budget it recovered by 25 s. With 3 retries it reached about 4× attempts, 100% wasted replies, and a queue still growing.
  - All 6 model tests pass.
- **Rendering.** No console errors and no overflow at 375 px. Figure 5 reaches its final state.

Illustrative numbers and measurements are kept apart clearly in the captions and the prose.
