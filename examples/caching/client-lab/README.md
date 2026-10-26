# Redis client behaviour lab

This worksheet accompanies **Redis clients, latency and pipelining** at
https://staycurrent.dev/learn/databases/caching/clients-and-latency/.

Requires Node.js 24+, npm and Redis 8.2.2 on macOS or Linux. It pins node-redis 6.3.0
and all package dependencies through package-lock.json. It creates a temporary
Redis process on a private Unix socket, disables persistence and removes the
process, socket and temporary directory afterwards. It never connects to an
existing Redis service. Two client-readiness tests use temporary TCP listeners
bound only to 127.0.0.1; these peers deliberately do not answer the handshake and
are not Redis emulators.

```sh
npm ci --ignore-scripts --no-audit --no-fund
REDIS_SERVER=/absolute/path/to/redis-8.2.2/src/redis-server node run.mjs
```

If Redis 8.2.2 is already on PATH, `node run.mjs` is sufficient. The runner checks
the server version before starting. A different version requires deliberately
updating the experiment and its expectations, not assuming behaviour is unchanged.

To build the tested server, obtain the 8.2.2 source archive from the official release
https://github.com/redis/redis/releases/tag/8.2.2, extract it, and run from that folder:

```sh
make -j4 BUILD_WITH_MODULES=no BUILD_TLS=no MALLOC=libc redis-server redis-cli
```

This build does not install a service or modify your PATH. The lab uses only a
private local Unix socket; these build settings are not deployment guidance.
Native execution was verified on macOS with Node 24.16.0, node-redis 6.3.0 and
Redis 8.2.2 built from the official source. The platform-specific build may require
a compiler and make. No Docker dependency.

The assertions establish:

- Pipeline results preserve command order, including a nil reply.
- A command error rejects the pipeline result, but a later SET can still succeed.
- In node-redis 6.3.0 a sent command can remain pending beyond commandOptions.timeout.
- An unsent command times out before readiness when offline queuing is enabled;
  disabling it rejects the command immediately. Neither GET reaches the test peer.
- The configured client queue limit includes commands already awaiting replies.

CLIENT PAUSE intentionally delays processing in this disposable process. Its
intervals, the artificial peer and the small queue limit are fault probes, not
recommended settings or throughput measurements. The command timer's implementation
was inspected at node-redis commit bfdd485b0bb24eab1a99aeb0de96b2285e4b26e1:
packages/client/lib/client/commands-queue.ts removes timeout/abort listeners in
commandsToWrite. This is a version-specific observation, not a promise about all
clients or later releases.

An application deadline needs a separate policy for waiting, cancellation and
in-flight work. Destroying a connection may reject many callers and does not prove
that Redis did not execute their commands. This lab intentionally does not present
its tiny runner as a production cache client.
