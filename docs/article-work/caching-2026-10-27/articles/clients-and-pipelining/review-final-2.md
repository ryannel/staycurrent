# Final review, round 2: Redis clients: round trips, pipelining and atomic operations

Reviewer: independent, first reading. I read the brief, Gears and Load Balancing in full, and the plan entries for articles 7–9 with the "Map changes after research" before reading the article. I read the rendered page at `localhost:4478` from top to bottom. I used every control in all eight figures: all modes of Figures 2, 3, 5, 6 and 7; every step of Figures 4, 5 and 8; Figures 6 and 7 run to 60 s in every mode; and reduced motion. I took screenshots in both themes at 1280 px and 375 px, saved in `final-screens/` and `final-screens/use/`. There were no console or page errors and no horizontal overflow. I checked the claims against redis.io, the redis-py 8.1.0 and go-redis v9.23.0 source, valkey.io and Redis 8.10.3 on port 7178, and re-ran the retry experiments myself. Commands and output are in `evidence/clients-and-pipelining-final-2.txt`.

## Verdict

**Publish after the one blocking fix below.** It is a strong article. It starts from a situation every reader has seen (a page that is slow on a fast cache) and builds in order through batching, the tail, pools, timeouts, retries and atomic changes. Each figure isolates one variable, and the prose tells the reader what to watch. Measured numbers are kept apart from the models throughout. The retry section is the best treatment of this subject I have seen in a tutorial, and my own runs reproduced every cell of its table. One gap remains: after a timeout, redis-py turns a `WATCH` transaction's ambiguous result into a `WatchError`, even with retries off. The article's own remedy, "turn the library's retries off", therefore does not protect the `WATCH` loop it teaches.

Counts: 1 blocking, 11 minor.

## Blocking

### B1. redis-py reports a timed-out WATCH transaction as WatchError, so a standard WATCH loop applies the change twice even with retries off

The Retries section says that with retries off, "every one ran once and reported a timeout … the honest answer". It then tells the reader to turn the library's retries off, or keep a second client without them. The `WATCH` section and the "Choosing the tool" row for `WATCH` say nothing about retries. For redis-py 8.1 that advice is incomplete in a way that loses or doubles data:

- In `Pipeline._disconnect_raise_on_watching` (client.py), any connection or timeout error during a watched transaction disconnects and raises `WatchError("A TimeoutError occurred while watching one or more keys")`. This happens in the failure callback, whatever the retry count.
- Every redis-py `WATCH` loop, including the library's own `Redis.transaction()` helper, catches `WatchError` and starts again. The application therefore reads again and writes again, although its first `EXEC` was still waiting in Redis's socket buffer and ran when the stall ended.
- I measured this on Redis 8.10.3 with a 100 ms timeout and a 150 ms stall. A `WATCH` / `GET` / `MULTI` / `SET v+1` / `EXEC` loop meant to add 1 left the counter at 2 in 5 runs of 5, with default retries and again with `Retry(NoBackoff(), 0)`. With a 500 ms stall the application saw `TimeoutError` instead, and the change ran once. That happened only because `reset()`'s `UNWATCH` reconnect also timed out, which is luck, not design.
- go-redis v9.23 behaves honestly here. `Watch` plus `TxPipelined` ran once and returned the i/o timeout, not `TxFailedErr`, with a cold or warm pool, retries on or off.

Figure 8's version check is safe, because the re-run reads the newer version and refuses. A relative change is not: "add 1 to `sold`" or "append to a list" under `WATCH`, which is exactly the "product updated by an occasional writer" case the article recommends `WATCH` for.

**Fix:** add two sentences at the end of the `WATCH` section's "Three details" paragraph or in Retries. For example: "redis-py reports a timeout during a watched transaction as `WatchError`, the same error as a real conflict, even with its retries off, so a loop that retries on `WatchError` can apply a change twice. Use `WATCH` for decisions that are safe to make again after re-reading, such as 'only if newer', or check for your own write before retrying." Add "a timeout can look like a conflict (redis-py)" to the `WATCH` row of the table.

## Minor

1. **Retry table, go-redis column: name the pool state.** "Ran 4 times" needs connections already open in the pool. With one pooled connection, go-redis's retry had to reconnect during the stall, its handshake timed out, and `INCR` ran once and returned a timeout after about 250 ms (the earlier evidence shows the same). Add to the table's lead-in: "with several connections already open in the pool, as in a busy application".

2. **"So the library, not your choice of commands, decides what is repeated."** Within go-redis, the choice of call does decide: `Pipelined` is re-sent and `TxPipelined` is not. Suggested: "So the library, and how it treats each kind of call, decides what is repeated; making a change atomic … does not make it safe to repeat."

3. **"A retry suits a failure that will not happen again, such as a connection reset by a load balancer."** A reset after the command was sent is as ambiguous as a timeout, because the command may already have run. The failures that are always safe to retry happen before the command leaves the client: a refused connection, a failed dial, an empty pool. go-redis's `shouldRetry` makes exactly this distinction for dial errors. Reword the example to "a connection that could not be opened", and add "a reset after sending is as uncertain as a timeout".

4. **"Yet most client libraries retry by default, after timeouts as well as connection errors."** The article shows this for redis-py 8 and go-redis v9. Jedis does not retry standalone commands by default, and Lettuce re-sends only commands queued across a reconnect, not after a timeout. Say "redis-py 8 and go-redis v9, two of the most widely used, retry by default …".

5. **Reported values in the retry table.** redis-py's doubled `INCR` reported success with the value 2, and go-redis's reported 4. The application is told a wrong number, not only "success". Add "(the reply showed the doubled count)" to the `INCR` row, or say it once in the paragraph after the table. It strengthens the point that the reply cannot be trusted.

6. **Duplicate measurements (length).** The paragraph after the formula in "Twenty-four round trips" gives 2.1 ms on loopback and 39 ms through the proxy. The first table in the next section repeats them (2.13 ms, 39.3 ms). Keep the table and cut the paragraph to one sentence ("Measured, the same 24 reads took 2.1 ms on loopback and 39 ms over a 1.6 ms round trip; faster Redis would not help either"), or the reverse. This saves about 60 words.

7. **The `cjson` paragraph (length).** "A script could also fix the JSON sale counter…" (about 75 words) ends at the advice the Lost updates section already gave: prefer the hash field and `HINCRBY`. Its useful content is that `cjson` rewrites empty arrays and large integers. That could be one clause in the script-costs paragraph, or a footnote.

8. **Figure 4, Next at the last step.** Pressing Next on step 9 of 9 jumps back to step 2 instead of being disabled, as it is in Figures 5 and 8. Disable Next at the last step, or relabel it, as the other stepped figures do.

9. **Figure 5 at 375 px.** The "timeout: gives up" note covers row number 4 in the left margin (the repair notes record this as open), and "SET price 36" sits on the B lane line. This is cosmetic. Shift the note right by the width of the row-number gutter on narrow layouts.

10. **Closing bullet on retries.** "Check what your library re-sends after a timeout, which may include pipelines, scripts and transactions". Add "and, in redis-py, what it reports as a `WATCH` conflict", which ties in B1.

11. **Pool-timeout advice.** "For a cache, set that wait to a few milliseconds and treat running out as a miss" is right. In go-redis, an exhausted pool is also retried (`pool.ErrPoolTimeout` is in `shouldRetry`), so a short `PoolTimeout` is multiplied by up to four attempts plus backoff. One clause would make the advice complete: "in go-redis, running out is retried, so the wait multiplies".

## Length

The rendered page is about 8,250 words including figure text; the prose is about 7,000. I judged each section by whether it changes what the reader would decide:

- **Earned:** the request cost, the batching and batch size (the 1,000-value table is the clearest piece of evidence on the page), the tail, pools and `maxclients`, timeouts, retries with Figure 6, lost updates, `MULTI`, `WATCH`, scripts and their costs, functions (the restart trap is a real decision), the 8.4 compare-and-set commands with Valkey's differing versions, and the choosing table. Showing "set only if newer" in three tools on one problem lets the reader compare the tools on equal terms, so the repetition earns its place.
- **Spends time without changing a decision:** the repeated 24-value measurements (minor 6), the `cjson` detour (minor 7), and arguably the RESP3 aside in "What one request costs". Together these are about 150–200 words.

Beyond those, the length is earned. It sits between Load Balancing and Gears, and the subject, which spans protocol, latency, failure and concurrency, justifies that.

## Checked and correct

- RESP bytes (the `$30` length of the JSON value), RESP3 from 6.0, `HELLO 3 AUTH` in one command, and the TCP plus TLS 1.3 round-trip count in Figure 4.
- Defaults from source: redis-py 8.1 `socket_timeout` 5 s, 10 retries with `min(1 s, U × 10 ms × 2^n)` (waits up to 20 ms, doubling, capped at 1 s), `TimeoutError` retried, `ConnectionPool` maximum 100, `MaxConnectionsError`, `BlockingConnectionPool` 20 s. go-redis v9.23 `ReadTimeout` 5 s, `PoolTimeout` = read timeout + 1 s, `PoolSize` 10 × GOMAXPROCS, `MaxRetries` 3 with -1 meaning off, dial retries 5.
- The retry table, cell by cell. redis-py, warm connection, 0.5 s stall: `INCR`, the plain pipeline, `MULTI`/`EXEC` and the Lua script each ran twice and reported success. go-redis, warm pool: `INCR` 4 times, `Pipelined` 3 times, `TxPipelined` once with a timeout, script 4 times. With retries off, both ran everything once and reported a timeout after 102–205 ms. Source: go-redis `txPipelineProcessCmds` returns `canRetry=false` on a read error, and redis-py's `Pipeline.execute` wraps transactions in `call_with_retry`.
- Redis 8.10.3: `MSETEX 3 … EX 300` (TTL 300); `SET … IFEQ` on a missing key does nothing; `IFNE` creates it; `DIGEST` returns 16 hex characters; `IFEQ` on a hash returns `WRONGTYPE`; `SET … IFEQ` without `EX` drops the TTL; `DELEX … IFEQ`; `EXECABORT` on a queue-time error; a run-time error without rollback (1, `WRONGTYPE`, 2); a same-value write aborts `WATCH` and a write to another key does not; `busy-reply-threshold` 5000; `client-output-buffer-limit normal 0 0 0`; `maxclients` 10000.
- Valkey: `DELIFEQ` since 9.0.0, `MSETEX` since 9.1.0 and `DELEX` since 9.2.0 (valkey.io), and `IFNE` creates a missing key there too.
- The sources cited (Dean and Barroso's 63%, Brooker's 3⁵ and his percentile-based timeouts, the SRE book's 10% retry budget, Bronson et al. on metastable failure) are represented fairly.
- Figures: the controls are labelled with what they change. Each has a caption stating what is modelled and what is left out, and a text alternative that matches the figure, including the models' numbers (Figure 6: 3.85× attempts and 100% wasted with plain retries, 1.02× within a budget; Figure 7: about 125 executed and 48 shown for GET/SET, about 3 in 4 refused with `WATCH`). With reduced motion nothing autoplays. Both themes and 375 px render cleanly apart from minor 9.

Not run: `pnpm build` / `pnpm check`.
