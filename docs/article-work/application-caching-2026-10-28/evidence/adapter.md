# Executed product-cache adapter

Executed 28 October 2026 using Python 3.14.5, redis-py 8.1.0 and Redis 8.10.3.
The final exact file hashes and observed outcomes are in `adapter.json`.
`adapter.variation.json` repeats the reader's documented 1800-pence variation.
Both runs passed all 17 scenarios and confirmed client closure, process exit and
temporary-directory removal. No production endpoint or source database was used.

## Invocation

```sh
/private/tmp/application-caching-python/bin/python \
  docs/article-work/application-caching-2026-10-28/practice/adapter_demo.py \
  --redis-server /opt/homebrew/bin/redis-server \
  --json docs/article-work/application-caching-2026-10-28/evidence/adapter.json
```

The second invocation added `--initial-price-pence 1800` and wrote
`adapter.variation.json`. The initial sandboxed attempt could not bind a Unix
socket; approved execution outside that restriction ran the owned local harness.
The unsuccessful attempt cleaned up and produced no success report.

## Ownership and files

The unmodified `cache_lab.OwnedRedis` launches Redis with TCP disabled, persistence
disabled and a new private Unix socket. PID, server run ID and configured directory
are checked before data writes. The async client independently checks that run ID
and PID before its own writes. No inherited Redis endpoint or credentials are used.
The same helper's retained native evidence separately tests exception cleanup.

`cache_adapter.py`, `adapter_demo.py`, `cache_lab.py` and `requirements.txt` are the
exact exercised reader files. Adapter code and demonstration assertions were not
substituted by a separate test-only implementation. The client dependency is
explicitly pinned. The source API is implemented by a labelled dictionary model.

## Observations

| Scenario | Executed outcome and boundary |
| --- | --- |
| Miss/fill/hit | Real GET/SET EX. Two product reads make one dictionary call; revision 1/2000 pence returned. |
| Expiry | Real PEXPIRE shortens one entry to 100 ms; poll observes deletion; next adapter read calls source again. Default adapter TTL stays 30 seconds. |
| Unusable content | Seven actual stored payloads: broken JSON, invalid UTF-8, obsolete schema, wrong shop context, array, oversized payload and boolean pence. Each causes one source call and replacement. |
| Empty/zero and negative hit | Empty name and zero pence remain usable. P99's tagged absence hits without another source call; TTL at most five seconds. |
| Source failure | Injected dictionary exception propagates and writes no absence. |
| Cache unavailability | Injected ConnectionError falls back once; occupying all source slots makes the next request raise Busy without source work. |
| Persistent read faults | Injected AuthenticationError becomes CacheFault. A real list under the key produces WRONGTYPE and CacheFault. Neither calls the source. |
| Optional SET rejection | Real Redis noeviction/maxmemory rejection leaves the key absent while the caller receives its source product. Memory setting is reset in finally. |
| Pool exhaustion | All four real client pool connections are held. GET and SET report pool-exhausted; the source result survives. Connections are released in finally. |
| Request admission | Occupied one-slot request gate raises Busy before any source call. |
| Slow fill | Injected one-second pre-send delay is cancelled by the optional budget. It never reaches SET; caller receives the source product. |
| Read/source deadlines | Injected slow GET falls back; injected slow source propagates timeout. Gates return to zero and no fill occurs. |
| Request cancellation | Task is cancelled while an injected SET delay is suspended. CancelledError propagates, no detached fill completes and gates release. |
| Native client cancellation | Redis CLIENT LIST confirms a real BLPOP is blocked. Cancel the task; pool has zero in-use connections; same one-slot client successfully PINGs and GETs. This is client lifecycle evidence, not GET latency. |
| Update/invalidate/refill | Dictionary commits revision 2/2200 pence; actual DEL completes; next read refills revision 2. |
| Failed invalidation | Injected DEL timeout before send keeps old Redis card despite revision-2 dictionary commit. Caller receives invalidation_confirmed=false. Does not reproduce uncertain network delivery. |
| Failed source update | Injected dictionary rejection leaves revision 2 and does not proceed to invalidation. Does not reproduce a database's uncertain commit outcome. |

The counterexamples are visible in the stored input or failed run branch: old
schema/context and boolean pence are returned by Redis but rejected by decoding;
source failure writes no invented absence; OOM rejects the copy but leaves the
source answer; deletion failure retains revision 1 alongside committed revision 2.
The unchanged native command lab supplies the successful-DEL/late-fill race and
plain-SET-clears-expiry counterexamples. A direct unbounded delayed SET would wait
one second; the adapter cancels the injected delay before the native method runs.

No benchmark, production latency, actual network loss, replication, database
transaction or fleet-wide capacity claim follows from these tests. All timeout
figures are example policy values. An event-loop deadline cannot forcibly cancel
blocking code or a coroutine that suppresses cancellation.

## Primary sources checked

- Redis [SET](https://redis.io/docs/latest/commands/set/): value/expiry atomic
  command and replacement behaviour.
- Redis [async client guide](https://redis.io/docs/latest/develop/clients/redis-py/async/):
  shared clients, pool ownership and explicit close.
- redis-py [8.1.0 API](https://redis.readthedocs.io/en/v8.1.0/connections.html),
  [connection source](https://github.com/redis/redis-py/blob/v8.1.0/redis/asyncio/connection.py),
  [client source](https://github.com/redis/redis-py/blob/v8.1.0/redis/asyncio/client.py)
  and [retry source](https://github.com/redis/redis-py/blob/v8.1.0/redis/asyncio/retry.py).
  Also inspected the installed 8.1.0 implementations of read_response,
  execute_command and get_available_connection. Cancellation disconnects on
  BaseException, command finally releases the connection, and the ordinary pool
  raises MaxConnectionsError at capacity. Retry count zero was asserted at runtime.
- Redis [error handling](https://redis.io/docs/latest/develop/clients/redis-py/error-handling/)
  and [production usage](https://redis.io/docs/latest/develop/clients/redis-py/produsage/).
  Inspected installed exception inheritance: AuthenticationError and
  AuthorizationError inherit ConnectionError and are classified first.
- Python [3.14 asyncio timeouts](https://docs.python.org/3.14/library/asyncio-task.html#timeouts):
  absolute event-loop deadline and cancellation semantics.

Rendered checks and prose lint belong to the coordinator's build handoff and are
not claimed here. Retain native command evidence unchanged.
