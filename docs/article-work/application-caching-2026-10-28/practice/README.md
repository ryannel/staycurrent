# Try a Redis application cache

Run a small cache-aside experiment with a real Redis server. The source product
record is a Python dictionary. That keeps the cache operations and their order
visible without needing to set up an application database.

Redis is the implementation used here. The questions about stale copies, delayed
fills and failed cache writes apply to other caching systems too.

## Run it

You need Python 3 and a local `redis-server` executable on macOS or Linux. The
verified run used Python 3.14.5 and Redis 8.10.3. The script uses Python's standard
library and does not need a Python Redis package.

Run without Python's `-O` option, so the assertions remain active.

```sh
python3 cache_lab.py
```

If Redis is not on your `PATH`, supply its binary explicitly:

```sh
python3 cache_lab.py --redis-server /path/to/redis-server
```

To save every Redis command and reply alongside the results:

```sh
python3 cache_lab.py --json cache-lab-results.json
```

The script starts its own temporary Redis process. It accepts no server address
or credentials. TCP and persistence are disabled; the only connection is a private
Unix socket. Before writing data, the script verifies the server's process ID,
instance ID, port and temporary directory. It removes its server and temporary
files when it finishes, including when an exercise raises an exception.

## Follow the product

Shop `north` sells product `P7`, a blue mug. Its first revision costs GBP 20.00.
The model's source update changes the price to GBP 22.00 and the revision to 2.
Prices are stored as integer pence. The cache key is:

```text
product:v1:north:P7:en-GB:GBP
```

The cached product card can help display the catalogue. It does not decide the
price or stock that checkout can accept. That decision belongs to the source.

Open `cache_lab.py` at `run_lab` to follow the exercises. Its assertions describe
the result each step must produce:

1. **Miss, fill and hit.** `GET` finds no value. The application reads the source
   model and stores its result with `SET ... EX 30`. The next `GET` returns it.
2. **Expiry and replacement.** A separate, 150-millisecond entry expires. Its
   `TTL` becomes `-2`, meaning the key is absent. Plain `SET` on an entry with an
   expiry removes that expiry; `TTL` becomes `-1`. `SET ... EX 30` restores one.
3. **Update and invalidate.** The source changes to revision 2, `DEL` removes the
   cached revision, and the next fill reads revision 2.
4. **A fill overtakes invalidation.** A read takes revision 1. Before that read
   fills the cache, the source changes to revision 2 and `DEL` succeeds. The
   delayed fill then writes revision 1. The cache contains GBP 20.00 again.
5. **Count the wait before insertion.** A source snapshot waits for over one
   second before `SET ... EX 30`. Redis accepts it with a fresh TTL even though
   the observation is already over one second old. A paired application check
   rejects that delayed snapshot, rereads the source and returns revision 2.
6. **Keep a successful source result.** With `noeviction` and an intentionally
   tiny memory limit, Redis rejects a new cache write with `OOM`. The application
   still has the source result it fetched. The lab restores the limit immediately.

The race is scheduled explicitly, one operation at a time. It is a real sequence
of Redis commands, rather than a test that hopes two threads overlap at the right
instant. The Python source assignment marks the model's commit point.

## What the age check establishes

The one-second check measures time since this process observed the source. It
demonstrates why an insertion TTL alone does not cover a slow read or a delayed
fill. The same observation time is checked before filling and before returning
the result. If too much time has passed, the lab refuses that result.

This is a deliberately small example of an application freshness policy. It does
not make invalidation and the source update atomic. A value observed less than a
second ago may already have changed. A read from a lagging replica could already
be stale when it starts. The source model here has no replica lag.

The monotonic timestamps used by this exercise belong to one Python process;
they are not saved for other machines to compare. A shared-cache implementation
needs an age/version scheme whose meaning survives its client and clock boundaries.
The script is a teaching lab, not a production cache client.

## Expected output

The Redis version on the first line follows your installed binary. The remaining
lines are stable when all assertions pass:

```text
Redis 8.10.3 · owned Unix socket · TCP disabled
PASS miss → source read → SET EX → hit: revision 1, GBP 20.00
PASS expiry: TTL -2; plain SET: TTL -1; SET EX restores expiration
PASS source update → DEL → refill: revision 2, GBP 22.00
PASS counterexample: late fill restores revision 1 after invalidation
PASS age guard: reject delayed revision 1; reread and return revision 2
PASS optional cache write: OOM does not discard source result
PASS cleanup after success and an injected exception
```

The JSON trace includes the short expiry's polling reads and measured elapsed
time, so those details can differ between runs. These results establish neither
production latency nor throughput. They do not exercise failover, replication,
network timeouts, a real source database or eviction-policy quality.

## Sources and further reading

- [Redis SET](https://redis.io/docs/latest/commands/set/): replacement and expiry
  options. The lab uses ordinary `EX` and `PX`, not newer conditional-set options.
- [Redis GET](https://redis.io/docs/latest/commands/get/) and
  [DEL](https://redis.io/docs/latest/commands/del/): read and invalidation commands.
- [Redis TTL](https://redis.io/docs/latest/commands/ttl/): remaining lifetime and
  the meanings of `-1` and `-2`.
- [Redis key eviction](https://redis.io/docs/latest/develop/reference/eviction/):
  memory limits and the behaviour of `noeviction`.
- [Redis INFO](https://redis.io/docs/latest/commands/info/) and
  [RESP](https://redis.io/docs/latest/develop/reference/protocol-spec/): the
  instance checks and small protocol client used to keep the lab self-contained.
