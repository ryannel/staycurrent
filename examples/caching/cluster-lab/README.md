# Redis Cluster lab

Native companion to https://staycurrent.dev/learn/databases/caching/redis-cluster/.
Requires Node24+, npm and a Redis8.2.2 server binary on macOS or Linux. The client
is pinned to node-redis6.3.0. Run only on an isolated development machine.

```sh
npm ci
REDIS_SERVER=/absolute/path/to/redis-8.2.2/src/redis-server node run.mjs
```

If the correct redis-server is on PATH, `node run.mjs` works. Obtain Redis from its
official release source or a trusted package manager. The article used the
8.2.2 source built on arm64 macOS with
`make BUILD_WITH_MODULES=no BUILD_TLS=no MALLOC=libc redis-server redis-cli`.

The runner creates six Redis processes, each with a private Unix socket and
separate ephemeral data/cluster-bus ports bound to 127.0.0.1, inside an owned
temporary directory. Admin commands use the owned Unix sockets. The cluster
client connects only to these nodes' loopback data ports. No existing Redis is
contacted. Persistence is off. This local setup is not a production security,
TLS, authentication, capacity or failure-domain configuration.

Three primaries own slots0–5460,5461–10922,10923–16383. Each has one replica.
Assertions cover:

- Six native KEYSLOT examples including braces and UTF8.
- Direct wrong-node GET returns MOVED; a cluster client routes successfully.
- MGET across different slots returns CROSSSLOT; same-tag keys work together.
- Slot8000 migrates from B to C using the classic8.2 protocol. After the first
  of two keys moves, source GET returns ASK, split MGET returns TRYAGAIN, and
  target GET without ASKING returns MOVED. ASKING+GET and the cluster client's
  redirected GET return12.
- After both keys move and ownership is assigned (destination first), the old
  source returns MOVED and the cluster client's MGET returns both values.
- A separate key on A is replicated with WAIT1. Killing A leads to its replica
  becoming primary and the cluster client retrieving the surviving15.

Cluster failure detection uses a deliberately short1000ms timer. The cluster
client disables offline command queueing and allows up to100 reconnect attempts
with200ms delay; the lab has a75second guard. This pinned client's topology
refresh is driven by reconnection attempts, so disabling reconnection prevented
our first run's client from discovering the promoted node. These settings make a
bounded local exercise, not a recommended production backoff/deadline policy.
The observer checks results until bounded deadlines; exact election times are not
asserted. Production recovery needs its own latency, queue and retry limits.

Cleanup destroys clients, kills only child processes started here, and removes
only the lab's temporary directory. SIGINT/SIGTERM are handled. A host crash or
SIGKILL of the runner itself cannot execute cleanup. Port availability is checked
before launch; another process racing to claim a port causes startup failure.

No network partition, host/storage failure, asymmetric reachability, sustained
load, migration of large values or realistic source fallback is tested. All six
nodes share one machine. The article's load and coverage figures are models,
not measurements from this lab. Current Redis documentation may cover newer
migration protocols; this lab deliberately exercises Redis8.2.2 behaviour.
