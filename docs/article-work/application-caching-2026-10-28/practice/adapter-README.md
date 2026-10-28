# Product cache adapter

Use Python 3.14 and a local Redis server executable. Put `cache_adapter.py`,
`adapter_demo.py`, `cache_lab.py` and `requirements.txt` in one directory.

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python adapter_demo.py --redis-server /path/to/redis-server --json adapter-results.json
```

`redis-server` on PATH is the default. No existing server address is accepted.
The helper creates a disposable Redis, with TCP disabled and an owned Unix
socket. It verifies the PID, instance ID and directory before writing, and stops
the process and removes the directory on exit. Nothing is kept in Redis.
Run without Python's `-O` option: assertions check the exercise results.

Tested: Python 3.14.5, redis-py 8.1.0, Redis 8.10.3. The pinned client is in
`requirements.txt`. The JSON report includes those versions, the exact source
file hashes, the owned server identity and the checked scenario outcomes.

## Read the first result

The first two product requests return `price_pence: 2000`, with one source call.
The next request after a real Redis expiry raises that count to two. The expiry
test shortens one stored entry's remaining life to 100 ms with `PEXPIRE`; the
adapter's ordinary positive TTL is still 30 seconds.

Change one source fact and inspect the printed prices and source-call counts:

```sh
.venv/bin/python adapter_demo.py --initial-price-pence 1800
```

That option is a labelled variation of the source model. The normal collection
example remains GBP 20.00 at revision 1, later GBP 22.00 at revision 2.

## What runs where

`SourceModel` is an in-process dictionary for north/en-GB/GBP. It is not a
database, a transaction engine or a source-latency measurement. Its assignment
is its commit point. A real integration must implement `read(context)` and
`commit_price(context, price_pence)`, including source transaction semantics,
cancellation cleanup and uncertain mutation outcomes. Only a successful source
read may return `None` for a confirmed absence.

Real Redis/client checks cover GET/SET EX, actual expiry, bytes and envelope
validation, negative hits, WRONGTYPE, OOM on SET, pool exhaustion, DEL/refill and
cancellation of a command observed blocked on Redis. The latter uses BLPOP only
as a client lifecycle test: normal product GETs do not use list commands. After
cancellation, the same one-slot client performs PING and GET successfully.

`FaultCache` injects connection/authentication errors and delays before a client
method. Dictionary delays and failures are also injected. These checks verify
application branches; they do not reproduce a network partition or database
failure. The failed-invalidation injection happens before DEL is sent. A real
timeout may instead occur after Redis applied DEL; the caller cannot infer that
from the timeout alone.

The separate `cache_lab.py` command lab stores raw product JSON, not the adapter's
schema/context envelope. Its retained evidence includes the delayed revision-1
fill after a successful revision-2 invalidation. Running that file alone does not
exercise redis-py or this adapter.

## Integration boundaries

Create one client and adapter per application event loop; close the client at
shutdown with `await client.aclose()`. The ordinary pool has four connections and
raises immediately when all are in use. Adapter gates admit 64 concurrent calls
and eight source operations, refusing excess work without a queue. These are
example per-process limits, not the capacity of a production source or fleet.

Pass the caller's existing absolute deadline, from the event loop clock, to
`read` and `change_price`. Without one, the example grants 200 ms from that call.
GET has a 25 ms application wrapper; connection/socket limits are 20 ms each.
Optional writes receive at most 20 ms and preserve 5 ms for returning the answer.
Retries are zero. No fill is detached or replayed after reconnection.

Async cancellation is cooperative. The source adapter must yield, propagate
cancellation and release its resources. Blocking work and cancellation-suppressing
coroutines can exceed these allowances. Cancelling the client's wait cannot undo
a command Redis already received.

The baseline uses 30-second positive and five-second negative insertion TTLs.
They do not guarantee a maximum source age or prevent late fills after updates.
Checkout uses the source's transaction and stock rules; it cannot rely on the
display card. The adapter does not coalesce requests across processes, enforce a
fleet-wide source limit or implement version-guarded fills.

The default observation sink uses Python logging at INFO. Configure its handler
and level when integrating, or supply a non-blocking `observe` callback. The driver
collects events in a list only for its bounded exercise. Avoid retaining every
production event in memory. Report the error kinds separately: a request can
succeed from the source while a failed fill removes future reuse.
