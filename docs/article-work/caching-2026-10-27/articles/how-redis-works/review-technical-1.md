# Technical review, round 1: How Redis works

Article: `src/articles/caching/how-redis-works.astro`, figures in
`src/components/caching/how-redis-works/`. Evidence:
`docs/article-work/caching-2026-10-27/evidence/how-redis-works-review-1.txt`
(Redis 8.10.3 from Homebrew, libc malloc, on port 7157 with persistence off and
now shut down; Redis 8.10.3 and Valkey 7.2.5/8.0.0 source fetched from GitHub;
model runs under node; the rendered page on port 4467, driven with Playwright).

## Verdict

Most of the article holds up, both in the source and on a live server. These
reproduce: `KEYS *` over a million keys (102 to 112 ms of execution, with a
probing `PING` waiting the same time), `KEYS` with a selective or non-matching
pattern still taking 48 to 92 ms, `DEL` of a 2,000,000-member set (238 ms here),
`UNLINK` replying in 0.2 ms, and expiry freeing on the main thread by default
(215 to 220 ms) but not with `lazyfree-lazy-expire yes`. Server CPU per `GET` was
7.5 to 8.2 µs without pipelining and 0.75 µs with 16 per round trip. The
used_memory/RSS table reproduced exactly on a fresh server (159.1/171.0 MB, then
84.3/171.0 MB, ratio 2.03). All encoding thresholds matched (513th field, 129th
string member, 513th integer member, 129th sorted-set member, 65-byte value).

These defaults match `src/config.c` at 8.10.3: `LAZYFREE_THRESHOLD 64`, all five
`lazyfree-*` set to `no`, `io-threads 1` and immutable, `io-threads-do-reads`
deprecated, `slowlog-log-slower-than 10000`, `slowlog-max-len 128` and
`latency-monitor-threshold 0`. Valkey 8.0 does set every lazy-free default to
`yes` (`src/config.c` at 8.0.0; 7.2.5 had `no`).

The I/O threads description is right in what matters. In `src/iothread.c`, the
I/O thread reads and parses requests and writes replies, and the main thread
alone executes commands. The vendor figures are quoted accurately: "37% to 112%"
with `io-threads 8` on Intel in the 8.0-M03 post, and ">30% for caching use
cases (10% SET, 90% GET), 4 cores" in the 8.4.0 notes. The writer also caught the
`redis-cli --latency` trap correctly: without a terminal it prints raw output
once after 1 s and exits. Under a pseudo-terminal I got maxima of 93.7 and
119.5 ms against `KEYS` executions of 95.4 and 128.9 ms. All ten model tests
pass, and the model numbers the prose quotes are what the models produce. Every
source link resolves.

There are four required fixes. The most serious is the string-embedding rule.
In Redis 8 it depends on the key's length and on the CPU's cache-line size, and
the 44-byte boundary in the article is a property of Apple Silicon builds. The
other three fix numbers that would mislead a practitioner: Figure 3's
"slowest PING" readouts, the size of a fork pause, and which `io-threads` value
the core-count advice means.

Counts: **4 required, 13 suggested.**

## Required

### R1. The 44-byte embstr boundary is not the rule in Redis 8, and on Linux it is far lower

The article says (§ What one key costs, final paragraph): "Strings of up to 44
bytes are stored in the same allocation as the object header, an encoding Redis
calls `embstr`; from 45 bytes the value gets an allocation of its own (`raw`),
which is why the cost steps up between 44 and 45 bytes." Figure 6's note repeats
"(up to 44 bytes)". Its caption says that on Linux "the overhead there will
differ by some bytes; the shape is the same".

In Redis 8 the key is embedded in the value object (`kvobj`). `kvobjSet()` in
`src/object.c` (lines 286–296 at 8.10.3) embeds an embstr value only if
`16 + (keylen + 3) + (4 + vallen) <= CACHE_LINE_SIZE`. Otherwise it gives the
value a separate allocation and the object reports `raw`. `src/config.h` sets
`CACHE_LINE_SIZE` to **128 on Apple aarch64 and 64 everywhere else**, including
Linux on x86-64 and on ARM. So:

- On the writer's M3 laptop the condition is keylen + vallen ≤ 105. With a
  13-byte key, the 44-byte limit happens to apply first, and the measured step
  sits at 44/45 by coincidence.
- On a Linux production server the condition is keylen + vallen ≤ 41. With the
  article's 13-byte keys, values above 28 bytes are stored `raw`, and the step
  is at 28/29, not 44/45. With longer keys it moves lower still.

I observed the key-length dependence on the same build (evidence R1): with a
70-byte key, a 35-byte value is `embstr` and a 36-byte value is `raw`
(`MEMORY USAGE` 160 B, then 139 B). With the 13-byte key, 44 bytes is `embstr`.

**Correction.** Replace the paragraph's rule with the Redis 8 rule. Short strings
are embedded with the key in one allocation when key and value together fit in
a CPU cache line (64 bytes on Linux, 128 on Apple Silicon builds, less 23 bytes
of header). On a typical Linux server that means key length plus value length
up to about 41 bytes. Say that the 44/45 step in Figure 6 is where my Mac's
build put it, and that on Linux with these keys it would be near 28/29 bytes.
Fix Figure 6's note so it does not say "up to 44 bytes". Remove "the shape is
the same" from the caption. Also update the comment in `measured.mjs`.

### R2. Figure 3's "slowest PING" readouts measure the Python probe, not Redis

Figure 3's readout "Slowest PING (measured)", its notes and its text alternative
attribute waits to `SCAN` that `SCAN` cannot have caused. Examples: "COUNT
10,000 … other clients now wait up to 5 ms" (note and list), "COUNT 100: … slowest
PING 6.0 ms", and the 15.6 ms at `COUNT 10`. That last one the text already
calls an outlier.

A `PING` can wait at most one call's server time, because the thread is free
between calls. The measured per-call times are 1.75 ms for `COUNT 10000` and
20 µs for `COUNT 100` (the figure's own `MEASURED.perCall`). Running the model's
window gives a longest wait of 1.74 ms and 0.02 ms.

The excess has a client-side cause. In the writer's `scanprobe.py`, the PING
prober is a thread (`Prober`, `threading.Thread`) in the same CPython process as
the client that parses each `SCAN` reply. While that client parses a large reply
it holds the GIL (global interpreter lock), whose default switch interval is
5 ms. That fits a ~5 ms worst case at `COUNT 10000` against a 1.75 ms call.

The laptop was also noisy. In my runs, the worst PING *before* any command was
issued reached 3 to 11 ms (evidence: probe "PING before" lines).

**Correction.** Use the measured per-call server time as the longest wait that
`SCAN` imposes, which the timeline already draws. Either drop the "slowest PING"
readout for the SCAN options, or label it as including client and machine
noise. Rewrite the `COUNT 10000` note: pieces of about 2 ms, so other clients
wait up to about 2 ms. Re-measuring with the prober in a separate process
(another Python process, or `redis-cli --latency` under a terminal) would give
honest maxima. The prose in § SCAN is unaffected: it cites only the `COUNT 1000`
maximum (under 1 ms) and the 17 ms per call at `COUNT 100000`.

### R3. A fork pause is tens to hundreds of milliseconds on a large dataset, not "milliseconds"

§ Finding the cause: "Saving a snapshot or rewriting the append-only file starts
with a `fork` of the whole process, which can pause the main thread for
milliseconds on a large dataset."

The Redis latency documentation (Diagnosing latency issues, "Fork time in
different systems") gives about 9 to 13 ms **per GB** of RSS on physical machines
and modern VMs. Its examples are 6.1 GB in 80 ms and 6.9 GB in 62 ms. On older
Xen VMs it gives 239 to 424 ms per GB. A 20 GB cache therefore pauses for roughly
200 ms on good hardware. That is the same size as the `KEYS` stall this article
treats as an incident.

**Correction.** "…which pauses the main thread for roughly 10 ms per GB of memory
on modern hardware, so a few hundred milliseconds for a cache of tens of
gigabytes (and much longer on some older virtual machines)". Then keep the
forward link to article 9. The latency monitor's `fork` event, mentioned a
paragraph earlier, is how a reader would see it.

### R4. The I/O threads core advice does not say which `io-threads` value it means, and as written it leaves no core spare

§ I/O threads: "The configuration file's advice is … to leave one core spare (3
I/O threads on 4 cores, 7 on 8)". Figure 5's intro says "Redis runs with
io-threads 4: the main thread plus three I/O threads."

In the 8.x implementation, `io-threads N` starts N−1 I/O threads plus the main
thread (`initThreadedIO()` loops `for (int i = 1; i < server.io_threads_num; i++)`
in `src/iothread.c`). The main thread no longer does socket work for assigned
clients. Read together, "3 I/O threads on 4 cores" and Figure 5 tell the reader
to set `io-threads 4` on a 4-core machine. That is four busy threads on four
cores, which contradicts "leave one core spare". The kernel's network stack, the
lazy-free thread and any fork for persistence also need CPU.

The ambiguity comes from `redis.conf` itself: its advice text predates the 8.0
rewrite and shows `io-threads 4` as the example.

**Correction.** State the setting, not a thread count. For example: "`io-threads
N` runs the main thread plus N−1 I/O threads. To leave a core spare on a 4-core
machine, that is `io-threads 3`; `redis.conf`'s comment ('try to use 3 I/O
threads' on 4 cores) can be read either way." Alternatively, quote the conf
verbatim and say it is ambiguous.

## Suggested

**S1. Clients that I/O threads never serve.** `isClientMustHandledByMainThread()`
in `src/iothread.c` keeps these clients on the main thread even with
`io-threads > 1`: Pub/Sub, `MONITOR`, blocked clients (`BLPOP` and similar), and
clients with `CLIENT TRACKING` on. For this collection the last one matters,
because those are the connections used for server-assisted client-side caching
in article 10. One sentence in § I/O threads would cover it: "Connections in
Pub/Sub, blocking or client-side-caching (tracking) mode stay on the main thread."

**S2. Lists do convert back; hashes, sets and sorted sets do not.** "The
conversion goes one way only … And the same scheme applies to other types"
implies every conversion is one-way. Observed: a list grown to `quicklist` and
popped back to one element reports `listpack` again. Hash, set and sorted-set
conversions stayed (evidence `enc.py`). Say "for hashes, sets and sorted sets".

**S3. `hash-max-listpack-value` limits field names too.** A hash with one 65-byte
field name and a 1-byte value is a `hashtable`. Write "any field or value longer
than 64 bytes".

**S4. Redis 8.10 has more than two hash encodings.** 8.10.0 added the template
("compact hashes") encoding, which shares field names across keys with the same
fields. It is off by default (`hash-min-template-entries 0`). Hash-field expiry
(`HEXPIRE`, 7.4+) changes a listpack to `listpackex` (observed). The sentence
"Redis has two ways" is true for the defaults. A short note would help, because
the template encoding bears directly on the hash-versus-keys decision passed to
article 3, and templates are never applied to hashes that use field expiry.

**S5. The residual few milliseconds with `lazyfree-lazy-expire yes` are not
specific to expiry.** The article contrasts `UNLINK` (slowest PING 0.3 ms) with
lazy expiry (7 to 24 ms, "I could not establish what the remaining few
milliseconds were"). In my repeats, `UNLINK` gave worst PINGs of 0.4, 6.9 and
13.9 ms, and lazy expiry gave 5.8, 7.9 and 12.7 ms. PINGs before any command
reached similar values. Both paths free through the same `freeObjAsync()`.
Present them as equivalent, and attribute the residual to the shared laptop
(and possibly allocator contention with the freeing thread), not to expiry.

**S6. Figure 4's PING chart draws a ramp that did not happen.** The line chart
joins a 0.1 ms sample to the next sample, about 195 ms later, with a straight
line. The stall therefore looks like latency climbing steadily for 200 ms (see
the `UNLINK` screenshot after a `DEL`, `shots/f4-unlink.png` in the review
scratch). One PING waited, and the others before it were fast. Plot points or
stems, or step the line, so a practitioner does not read it as gradual
degradation. Figure 2 uses the same chart and has the same problem.

**S7. "97% … went on the round trip".** The closing section says "97% of the
main thread's time per request went on the round trip, not the command … An
application across a real network pays a far longer round trip than that". The
7.3 µs is server CPU spent per round trip (syscalls, event-loop and buffer
work). It is not network round-trip time, and network latency costs the server
no CPU. The I/O-threads section words it correctly ("socket work"). Reword the
closing to "on the server's work for each round trip". Also note that these are
macOS `kqueue` and loopback syscall costs. On Linux the share will differ, which
qualifies the introduction's "the shapes and ratios are what carry over".

**S8. A TTL's cost is partly in the object itself.** In Redis 8 an expiring key
stores its 8-byte expiry time inside the `kvobj` (`kvobjSetExpire()`
reallocates it with `KEY_META_MASK_EXPIRE`). That is the "+8 bytes" `MEMORY
USAGE` shows. The rest is the entry in the expires table. Figure 6 says the TTL
cost is "mostly for the entry in the separate table". Say both. Also qualify
"add 20 to 40 bytes for a TTL" in the closing list as this build's figure (I got
21 to 37 bytes).

**S9. `used_memory` includes allocator rounding.** "used_memory is what Redis has
asked the allocator for" is slightly off. zmalloc counts usable sizes
(`zmalloc_size`), so rounding is included. The article relies on this elsewhere,
when it counts "the allocator rounding" in per-key overhead. Use "what the
allocator has handed Redis for its live allocations".

**S10. A fragmentation ratio below 1.** The INFO documentation says swapping is
indicated "when used >> rss", that is, a ratio well below 1. A ratio slightly
below 1 can have other causes. Write "a ratio well below 1 usually means…".

**S11. `redis-cli --latency` in scripts.** The writer found that without a
terminal it prints one raw line (`min max avg count`) after 1 s and exits. I
reproduced this: a run started 1.5 s before a `KEYS` missed it entirely and
reported a 4.4 ms max. A practitioner who wires `--latency` into a cron job or a
CI step gets exactly that. Add one clause: in a script, add `-i <seconds>` to set
the sampling period, or use `--latency-history`.

**S12. Figure 9 mixes runs.** The SLOWLOG and LATENCY outputs come from a
`KEYS` of 107 ms. The `--latency` output (max 94.9 ms) comes from a different
`KEYS` of 97.7 ms. The caption discloses this, but a reader comparing the two
panels may conclude that `--latency` underestimates. Use outputs from one run,
or put each run's `KEYS` time beside its output.

**S13. Smaller points.**

- **`SMEMBERS`.** "The client that asked took 90 ms to receive the 300,000-element
  reply" was measured with a pure-Python RESP parser, which dominates that
  figure. Say so, or say "to receive and parse".
- **Lazy-free settings table.** It omits `replica-lazy-flush` (Redis default
  `no`, Valkey 8.0 `yes`), which frees the old dataset during a replica's full
  resync. It belongs with the table, or with article 9.
- **`KEYS` in a cluster.** In cluster mode, a pattern containing a hash tag scans
  only that tag's slot (`keysCommand`, `patternHashSlot`), so "the pattern does
  not let Redis skip anything" is true for a standalone server only.
- **Expiry.** A key whose TTL has run out is also freed by the next command that
  touches it, not only by the expiry cycle. With the default
  `lazyfree-lazy-expire no`, that client's command waits for the whole free (I
  observed this: an `EXISTS` returned about 215 ms late). Figure 4's "at the next
  expiry cycle" is one of the two paths.

## Checked and correct

`epoll`/`kqueue`; `@dangerous` contains `KEYS`, `FLUSHALL`, `FLUSHDB`, `SORT` and
`DEBUG`; `SCAN` defaults to `COUNT 10` and applies `MATCH` after fetching; `MEMORY
USAGE` in 8.10 counts the object's own allocations, without the keyspace table
share (`memoryCommand` → `kvobjComputeSize`, no dict-entry term).
`activedefrag yes` is refused on a libc build; `MEMORY PURGE` returns OK but has
no effect there. The `--intrinsic-latency` reading (avg 1.036 µs, worst 1152×) is
quoted correctly. The `INFO commandstats` reading (0.05 µs in the writer's run,
0.10 µs in mine) is of the expected size. The SCAN totals (0.17 to 0.24 s of
server time) are arithmetically right. In the event-loop model, one client gets
9,280 requests/s, 14 clients saturate the thread, and the ceiling is 133,333/s.
The KEYS model shows 39 requests queued after 100 ms. The page model gives a
ratio of 2.00 at 50% deletion. The rendered figures produced no console errors.
One page reload during testing was caused by a hot-module update from another
article's file, not by the figure.
