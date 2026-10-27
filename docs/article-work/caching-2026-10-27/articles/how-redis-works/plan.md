# Plan: How Redis works: the event loop, data structures and memory (article 7)

## The reader's starting situation

The reader has read articles 1 to 6. They can design a cache-aside read path,
choose TTLs and an eviction policy, and prevent stampedes. They have used Redis
as a black box that answers `GET` and `SET` in well under a millisecond. They do
not yet know why one operator's command can stall every client, why a Redis that
holds 100 MB of data can occupy 200 MB of RAM, or which of `SLOWLOG`, `INFO` and
`redis-cli --latency` would show them what went wrong.

Opening situation: a product cache whose p99 latency jumps to about 100 ms for a
moment every night, while Redis's CPU graph barely moves. A clean-up job runs
`KEYS product:*` and deletes the matches. By the end of the article the reader
can explain that incident in full and fix it.

## Questions, in order

1. How does one Redis process serve thousands of clients? One main thread, an
   event loop, one command at a time. What does that buy (each command is
   atomic) and what does it cost (a ceiling on requests per second per thread)?
   Where does the main thread's time actually go? (Mostly sockets, not commands.)
2. What happens when one command takes 100 ms? Every other client waits.
   Measured with `KEYS *` on a million keys.
3. How do I know in advance whether a command is slow? Time complexity, and what
   N is. Big keys turn an O(N) command on one key into a stall.
4. How do I walk the keyspace without stalling it? `SCAN`, and the `COUNT`
   trade-off between total time and the longest pause. Its guarantees.
5. Why does deleting a big key stall Redis, and how do I avoid it? `DEL`
   against `UNLINK`; lazy freeing; expiry and eviction free on the main thread
   by default in Redis (not in Valkey).
6. Do I/O threads change any of this? What they move off the main thread, when
   to enable them, and why they do not fix a slow command.
7. What does a key cost in memory? Per-key overhead against value size; TTL
   cost; string encodings; `MEMORY USAGE` against `used_memory`.
8. Why are small hashes so much cheaper, and when does that stop? Listpack
   against hash table, the 512-entry and 64-byte thresholds, one-way conversion.
9. Why does RSS not fall when I delete keys? used_memory against RSS, pages and
   fragmentation, provisioning for the peak, `maxmemory` counting used_memory.
10. When latency spikes, which tool shows the cause? `SLOWLOG` shows the
    culprit, not the victims; client timers show the victims; the latency
    monitor and `redis-cli --latency`; non-command causes (fork, swap, many
    expiries) and where they are taught.

Close: a list of decisions the reader can now make, linking forward to article 8
(round trips and pipelining) where the cost model continues.

## Figures

All figures use the shared toolkit; the article-specific parts are a
main-thread strip renderer and the models, in
`src/components/caching/how-redis-works/`.

1. **The event loop** (live). Clients (one slider: how many, 1 to 40) send `GET`
   in a closed loop to Redis. A strip under the scene shows what the main thread
   does over time: socket work (read and parse, write) and command execution,
   never overlapping. Proportions come from my measurement (about 7.3 µs of main
   thread CPU per un-pipelined `GET`, of which execution is a fraction of a
   microsecond); time is slowed about 10,000 times. Readouts: requests a second,
   main thread busy, average wait. Notice: with a few clients the thread is
   mostly idle; somewhere past 15 clients it is never idle, requests a second
   stop rising and waits grow. Execution is the thinnest part of each block.
2. **One slow command** (live). The strip at millisecond scale, a client sending
   `PING` about every millisecond and a few other clients. Button: run `KEYS *`;
   slider: keys in the database (100,000 to 10 million). Chart below: each
   `PING`'s round trip. Notice: the strip fills with one block and every
   request waits behind it; the spike grows in proportion to the key count.
3. **SCAN in steps** (static, one choice: `KEYS` or `SCAN` with `COUNT` 10, 100,
   1,000, 10,000, 100,000). A 50 ms window of the main thread in the middle of a
   full walk of a million keys, with the other client's `PING`s marked. Readouts
   are my measurements: calls, time to finish, longest wait for another client.
   Notice: small `COUNT` leaves tiny gaps but needs 95,000 round trips; huge
   `COUNT` is `KEYS` in ten pieces.
4. **Freeing a big key** (live, one choice: `DEL`, `UNLINK`, TTL runs out; one
   button). Two lanes: main thread and background thread. Chart: `PING` round
   trips. Notice: `UNLINK` moves the same 195 ms of work to the other lane;
   expiry behaves like `DEL` at the default settings.
5. **A request with I/O threads** (stepped sequence). Client, I/O thread, main
   thread: read and parse on the I/O thread, execute on the main thread, write
   on the I/O thread. Notice: execution never leaves the main thread.
6. **What one key costs** (static; slider over measured value sizes; choice: TTL
   or not). Stacked bar of payload against overhead; readouts of measured bytes
   per key and the total for 10 million keys. Notice: overhead dominates small
   values; a TTL adds 20 to 40 bytes.
7. **Packed or hashed** (static; slider: fields, 1 to 600; choice: 20-byte or
   100-byte values). Drawing of a listpack (one contiguous block) against a hash
   table (buckets pointing to separate entries); chart of measured bytes per
   field. Notice: bytes per field doubles at field 513, and 100-byte values are
   never packed.
8. **Pages and fragmentation** (static, illustrative model; two sliders: delete
   a share of keys at random, then add new keys). A grid of allocator pages and
   slots. Readouts: used, resident, ratio. Notice: deleting half the keys at
   random frees almost no pages (ratio 2, matching my measurement of 2.03); new
   keys fill the holes before RSS grows.
9. **Which tool sees which delay** (static, one choice of tool). A culprit
   command and a victim `GET` on the strip; each tool's view highlighted with
   what it would report. Notice: `SLOWLOG` names the culprit and never the
   victim; the application's timer sees the victim.

## Evidence

All Redis numbers measured on port 7107 (Redis 8.10.3, macOS, libc malloc),
recorded in `evidence/how-redis-works.txt`: `KEYS` stall, `SCAN` at five
`COUNT` values, `DEL`/`UNLINK`/expiry of a 2,000,000-member set, lazy-free
settings, main-thread CPU per request with and without pipelining, I/O thread
benchmark (inconclusive on one laptop), bytes per key against value size, hash
growth series, encodings, used_memory against RSS, `SLOWLOG`, latency monitor,
`latencystats`, `redis-cli --latency`, `--intrinsic-latency`, `--bigkeys`.

## Where to stop

- No dictionary rehashing, listpack byte layout, kqueue/epoll internals or
  jemalloc size classes: none changes a practitioner's decision.
- Pipelining, `MULTI`, scripts: one sentence each, linking to article 8.
- Fork and copy-on-write: named as a latency source; article 9 owns it.
- Active expiry and eviction mechanics: article 4. Hot keys: article 10.
  Monitoring and capacity planning across a fleet: article 11.
- Strings against hashes as a key design choice: article 3; this article
  supplies the encoding mechanism and the measured costs.
