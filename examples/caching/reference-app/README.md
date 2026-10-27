# A bounded-age catalogue cache

A runnable HTTP application and an executable load/failure lab. SQLite owns the
products; Redis 8.2.2 holds disposable display copies. This project accompanies
[Designing a production cache](https://staycurrent.dev/learn/databases/caching/system-design/).
It demonstrates a coherent contract, not a ready-made production deployment.

## Run the application

Use Node **24.16+ in the 24.x line**, npm and an official **Redis 8.2.2** binary.
The dependency lock pins node-redis 6.3.0. Node's SQLite API is a release candidate
in this baseline. No Docker, external database or existing Redis service is needed.

```sh
npm ci
REDIS_SERVER=/absolute/path/to/redis-server npm start
```

If that exact redis-server is on PATH, omit REDIS_SERVER. The runner prints a local
API address, such as `http://127.0.0.1:12345`. Substitute the actual address below:

```sh
curl -H 'Authorization: Bearer demo-alpha' 'http://127.0.0.1:12345/products/42?locale=en'
curl -H 'Authorization: Bearer demo-alpha' 'http://127.0.0.1:12345/products/42?locale=en'
curl -H 'Authorization: Bearer demo-beta' 'http://127.0.0.1:12345/products/42?locale=en'
curl -H 'Authorization: Bearer demo-alpha' 'http://127.0.0.1:12345/products/42?locale=sv'
```

The first answer normally says `path: source`, the repeated answer `path: redis`.
Tenant alpha starts at 1,200 pence; beta's same product ID starts at 7,500. Swedish
uses a separate representation. Products 1–100 exist for each tenant. These fixed,
public **demo credentials are not production authentication**. The API binds only
to loopback; do not expose it to a network or put private data in it. Tenant context
comes from the credential mapping, never a query parameter supplied by the caller.
All HTTP responses use `Cache-Control: no-store`.

Read the current revision from a response, then make a conditional source update:

```sh
curl -X PATCH -H 'Authorization: Bearer demo-alpha' \
  -H 'Content-Type: application/json' \
  --data '{"priceCents":1500,"revision":1}' \
  'http://127.0.0.1:12345/products/42'
curl -H 'Authorization: Bearer demo-alpha' 'http://127.0.0.1:12345/price-check/42'
curl -H 'Authorization: Bearer demo-operator' 'http://127.0.0.1:12345/metrics'
```

PATCH uses an atomic conditional SQLite statement; a stale revision returns 409.
The source commits before best-effort invalidation of both locale keys. An
ambiguous/timed-out update is not automatically retried: read authoritative state
and reconcile its revision before deciding what to do. `price-check` bypasses
Redis. It supplies a source observation, **not** an entire purchase, stock
reservation or payment transaction. Metrics are aggregate counters and bounded
resource counts; the operator credential is also public and demo-only.

Ctrl-C closes the HTTP server, database worker and owned Redis process, and removes
the private directory. All data is temporary, including SQLite. Restarting Redis
_within the lab_ preserves that run's SQLite database; ending the run removes both.
Handled interruption and test failure run cleanup. A host failure or uncatchable
SIGKILL cannot run cleanup. Redis listens on a private Unix socket, with no TCP
listener, persistence disabled, 16 MiB maxmemory and allkeys-lru. The private local
Redis administration connection is not a production identity/TLS configuration.

## The contract

Display reads may use a source observation for at most **2 seconds**, checked when
the application prepares its response. This is an illustrative budget. It is not
“latest after every update”, and does not bound later network transit or how long a
browser displays an answer. The JSON envelope binds schema, tenant, product ID,
locale, revision, observedAt and validUntil to the value. Copies retain the original
deadline. Redis TTL helps remove entries, but the application still checks the
payload: restored, malformed or over-age entries are not accepted.

A late old fill can survive a post-commit DEL. This design deliberately permits it
while the original age budget remains. It does not permit it indefinitely. A source
reply already beyond its age limit is refused without being cached. No stale-if-error
extension is enabled. Authoritative decisions use the source path instead.

The implementation uses one host's aligned wall clock. A production deployment
must define clock-error allowances and handling of clock adjustments; Date.now()
is not a universal distributed-clock guarantee. Source timestamps are taken at the
SELECT, not when a delayed reply arrives. The response check is not proof that no
source update happened in the intervening interval.

## Resource and failure policy

Default limits are examples to replace with measured, allocated budgets:

| Boundary               | Limit / behaviour                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| HTTP work              | 64 unfinished handlers; 128 connections; 1-second caller wait                                |
| Request and value size | 2,048-byte PATCH body; 4,096-byte accepted envelope                                          |
| Redis work             | 16 pending operations; offline queue disabled; no automatic replay                           |
| Redis wait             | External 60 ms deadline; destroy the owned connection on timeout                             |
| Recovery probe         | One connect attempt; 150 ms cooldown after failed connection                                 |
| Source                 | Four active operations; token refill 20 starts/s, burst four; no waiting queue               |
| Shared fill            | At most 16 waiting handlers per key, including the leader                                    |
| Source wait            | 300 ms caller deadline; cancellation requested; permit held until acknowledgement/completion |

A token refill of 20/s with burst 4 is **not** a hard limit of 20 in every one-second
window. Source work can consume the initial burst as well as refilled tokens.
Limits here belong to one application process. Multiplying application processes
multiplies those allocations; use a fleet-level plan or shared admission mechanism.

The cache lookup uses GETRANGE 0 4096, not an unbounded GET. At most 4,097 payload
bytes are returned, allowing an oversized envelope to be detected and rejected.
A wrong type is a cache error. The schema and payload are validated before use.
Source names and request identifiers are bounded. Redis maxmemory is not a bound
on every application's memory; all these limits serve different purposes.

In pinned node-redis 6.3.0, a command's queue timeout does not bound an already-sent
command. This adapter uses an external wait and discards the connection on timeout
so pending client state cannot accumulate without bound. A sent SET or DEL might
still execute; the original application deadline makes a late fill safe for this
age contract. There is no application retry of a command within the request.
Other pending operations on that connection can fail too; fallback is admitted.

Coalesced work has its own source budget. A waiting HTTP caller timing out does not
free the source permit or remove unfinished work from admission accounting. SQLite
runs in a worker so a blocking query cannot freeze HTTP timers. Cancellation cannot
undo a committed statement or interrupt every synchronous operation: a permit stays
occupied until the worker replies or exits. Timers are scheduling budgets, not
hard real-time guarantees under operating-system stalls.

## Run the acceptance and load/failure lab

```sh
REDIS_SERVER=/absolute/path/to/redis-server npm test
```

The lab uses actual loopback HTTP, the real pinned Redis client/server, and SQLite.
It deliberately shortens the display age to 500 ms in some cases. Concurrency cases
use controlled barriers and a token refill of zero to isolate a burst of four; these
are test inputs, not production recommendations. A 25-second overall interruption
guard and bounded individual waits prevent an ordinary failed test hanging forever.

Assertions cover:

1. Cold fill, warm hit with unchanged source-read count, tenant/locale isolation,
   rejected unknown context and unauthorised access.
2. Malformed, wrong-tenant, wrong-schema, over-age and oversized Redis values.
3. A controlled stale fill after source commit and DEL; authoritative price checks;
   conditional-write conflict; rejection at the original observation deadline.
4. A source reply held beyond its age limit, refused without a cache write.
5. CLIENT PAUSE on the owned Redis process: external wait failure, discarded
   connection, bounded fallback and later recovery.
6. Redis stopped, forty simultaneous same-key requests: one source read, sixteen
   successful waiters, twenty-four refusals.
7. Redis stopped, forty distinct keys: four admitted reads and thirty-six refusals.
8. Source failure and cancellation cleanup; a deliberately blocked worker retains
   its permit even after the caller times out.
9. A timed-out HTTP caller's unfinished handler remains counted; a second request
   is refused at a configured limit of one until that work finishes.
10. Redis restarted empty while SQLite still owns the updated value; reconnect,
    refill and a subsequent cache hit succeed.

Delay and block hooks exist only as in-process lab controls, never as HTTP routes.
They are not measurements of Redis or SQLite performance. The lab prints assertion
outcomes, not misleading requests-per-second benchmark scores. It kills only its
own Redis process and uses its own credentials, keys and temporary files.

## Read and adapt the design

- `app.mjs`: HTTP contract, contextual keys, envelope validation, shared fills and
  post-commit invalidation.
- `cache.mjs`: bounded Redis connection, command waits and recovery probe.
- `source.mjs` / `source-worker.mjs`: admission, completion accounting and SQLite.
- `limits.mjs`: token bucket, deadlines, keys and envelope rules.
- `exercise.mjs`: executable adversarial cases; `runtime.mjs` / `run.mjs`: ownership
  and cleanup.

Before adapting this into a deployed system, choose your actual freshness and
write guarantees, source budget, authentication and secret distribution, TLS and
network policy, monitoring, invalidation dependencies and recovery procedures.
The earlier articles derive those choices. This example intentionally has no L1,
Cluster, distributed lease, durable invalidation stream or shared fleet limiter.
Add one only when a stated requirement needs it, and test the new boundary.
