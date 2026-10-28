# Final review, round 2: Operating a cache: monitoring, capacity and failure

Article: `src/articles/caching/operating-a-cache.astro`, figures in
`src/components/caching/operating-a-cache/`. Read rendered at
`http://localhost:4481/learn/databases/caching/operating-a-cache/` with
`CACHING_DRAFT_PREVIEW=1`, 28 October 2026. Every figure was used: Figure 1 at all
five hit ratios; Figures 2 and 3 stepped through every choice to 180 s and 150 s,
with readouts logged; Figure 4 under all four incidents; Figure 5 at all fifteen
combinations. Reduced motion was checked: nothing autoplays. Screens of every
figure as loaded, light and dark, 1280 px and 375 px, are in `final-screens/`.
No horizontal overflow and no console errors. Redis 8.10.3 checks were run on port
7181 in a temporary directory with `--save ''`. The server was shut down and its
directory deleted afterwards.

## Verdict

**Publish after the listed blocking fixes.** Counts: **2 blocking, 11 minor.**
Both blocking fixes are small: a figure's arithmetic, and one line plus two
sentences in the ACL example.

This is the most useful article in the collection for someone who has just been
handed the pager. The opening is a recognisable situation. It lists the
questions an operator is actually asked, then answers them in order.

Figure 1 turns the arithmetic from earlier articles into the operator's
question: "with and without the cache, how much traffic can we carry?" The
slider makes a point many teams miss: a better hit ratio moves only the warm
line.

Figure 2 is the centrepiece, and it earns it. The no-limit run shows the outage
lasting until about 144 s, more than a minute after Redis is back. That is a
real surprise, shown first and then explained. The readouts matched every
number the prose quotes:

- a queue of 70 s at 40 s;
- about 39,500 wasted queries;
- 14% served at a limit of 4;
- 28 to 29% served at a limit of 60.

The Little's law bound then turns the surprise into a sizing rule.

Figure 3's three strategies and Figure 4's measured incidents are both well
chosen. In Figure 4, the "evictions point at size, expirations at TTLs"
diagnosis can be read straight off the middle chart.

The voice is plain and the sources are primary. Measured results are clearly
separated from modelled ones.

Beside Gears and Load Balancing it is weaker in one respect: figure density.
There are five figures in about 6,500 words of prose, and the last third
(alerts, security, services) has none. Most of that third is reference and
decision material that would not gain much from a simulation, so I do not count
this as blocking.

### Length

The body is about 6,500 words. Figure captions and text alternatives add about
1,200 more, and the sources about 350, so the article is about 7,000 to 8,000
words in all. That suits its scope, which is seven distinct operational
subjects, each owned here by the plan. Few paragraphs repeat another. About
500 words could go without loss; see M10. The length should not hold up
publication.

## Blocking

### B1. Figure 5 draws client buffers inside `maxmemory` but takes nothing away from the products held

The article teaches that client buffers "come out of the same limit as the
data". It supports this with a striking measurement: a 24 MB output buffer made
Redis evict three quarters of a 30 MB cache. I reproduced that on 8.10.3. At
`maxmemory 30mb` with 12,000 keys of 2,000 bytes, one client pipelined 20,000
`GET`s without reading the replies. `mem_clients_normal` reached 23.9 MB and
9,083 keys were evicted.

Figure 5 now draws a hatched client-buffer slice, 2% of the node, inside
`maxmemory`, and the key says "counted inside maxmemory". But nothing else in
the figure reflects it:

- The data segment is visibly shorter than `maxmemory`, yet its key reads
  "maxmemory: cached data **870 MB**", which is the whole of `maxmemory`.
- "Products held" is `maxmemory ÷ 2,130` (`chain()` in `sizing-model.mjs`). At
  1 GB, 428,488 × 2,130 bytes fills all 870 MB, so the products occupy the
  space the bar gives to client buffers.
- The text alternative says the same: `maxmemory` "holds the cached data and
  also the buffers of connected clients", and then "dividing what is left by
  2,130 bytes gives the products held".

So the figure counts the slice twice. It shows buffers taking memory and the
data losing none. That contradicts the lesson the paragraph above it has just
taught. A reader who checks the figure against the bullet comes away unsure
which one is right.

**Fix (either one):**

- **Subtract the slice.** In the model, products = (`maxmemory` − client slice)
  ÷ 2,130. Label the data segment with what is left (about 850 MB at 1 GB) and
  give the buffers an amount marked illustrative (about 20 MB). Update the
  prose. Computed from the model with the 2% slice:

  | Setting | Products held | Hit ratio | Database queries a second |
  | --- | --- | --- | --- |
  | 1 GB, 15% reserve | about 418,000 (was 430,000) | 81% (was 82%) | 186 (was 183) |
  | 1 GB, 50% reserve | about 242,000 (was 250,000) | | rise from 15% is still about a third |
  | 4 GB | 84% of the catalogue (was 86%) | 98% | |

  The "about 80 fewer queries" steps stay the same (79 and 84). The 512 MB, 50%
  case stays over capacity (314).

- **Remove the slice from the stack.** Then say in the key or the caption that
  client buffers also come out of `maxmemory`, that this figure assumes they
  are near zero, and that a greedy client can take far more (the 24 MB example).
  This keeps every number in the prose.

Either way, rename the data key from "maxmemory: cached data" to "cached data",
so that the stack does not equate the two.

### B2. The ACL example locks out administration, breaks replica and Sentinel authentication, and does not survive a restart

The example ends with `ACL SETUSER default off` and creates only `shop` and
`metrics`. I ran it on 8.10.3. After `default off`:

- every new unauthenticated connection got `NOAUTH Authentication required`;
- `shop` was refused `ACL SETUSER` and `CONFIG SET` (`NOPERM`).

No user is left who can change configuration, manage users or diagnose the
server. The operator keeps access only while the session that ran the command
stays open.

On a self-run deployment, replicas authenticate with `masterauth`, which uses
the default user unless `masteruser` is set. Sentinel also connects as the
default user unless `auth-user` and `auth-pass` are set. Disabling the default
user therefore breaks replication and Sentinel's checks, and can set off a
failover.

Finally, `ACL SETUSER` changes only the running server. Unless the users are
written to an `aclfile` with `ACL SAVE`, or to `redis.conf` with
`CONFIG REWRITE`, the next restart brings back a password-less default user
that can do everything. The article presents the three lines as the way to
lock Redis down, so this advice is unsafe as written.

**Fix:** add one line and two sentences.

1. Add an administrator before disabling the default user, for example
   `ACL SETUSER admin on >… ~* &* +@all`.
2. Say that replicas (`masteruser`/`masterauth`) and Sentinel
   (`auth-user`/`auth-pass`) need their own users first.
3. Say that users must be saved with `ACL SAVE` into an `aclfile`, or with
   `CONFIG REWRITE`. Otherwise a restart undoes the lock-down.

## Requested checks

- **The ACL now works for a normal client.** On 8.10.3, the `shop` user, as
  written, ran the following on one connection:
  - `HELLO 3` and `HELLO 2 AUTH … SETNAME`;
  - `PING`;
  - `CLIENT SETINFO lib-name`/`lib-ver`, `CLIENT SETNAME`/`GETNAME`/`ID`;
  - `SELECT 0`;
  - `SET`/`GET`/`MGET`, `DEL`, `UNLINK`, `EXPIRE`;
  - `WATCH`, then `MULTI`/`SET`/`EXEC` (result `OK`);
  - `EVAL` on `app:1`, `SCRIPT LOAD`, `EVALSHA`;
  - `SET … IFEQ` and `DELEX … IFEQ`.

  The following were refused:
  - `EVAL` naming `other:1`, or touching it undeclared;
  - `SET other:1`;
  - `KEYS`, `FLUSHALL`, `FLUSHDB`;
  - `CONFIG GET`, `INFO`;
  - `CLIENT LIST`/`KILL`, `MONITOR`;
  - `CLUSTER SLOTS` and `CLUSTER SHARDS`.

  `READONLY` and `ASKING` are in `@connection`, so cluster replica reads work.
  The prose's claims about this user are correct.
- **Figure 5:** see B1. Yes, it contradicts the lesson.
- **Length:** see above. It is justified, with about 500 words to spare.

## Other claims checked

These were observed on 8.10.3:

- With no configuration file, `bind * -::*` and `protected-mode yes`.
- `CONFIG SET dir` and `CONFIG SET dbfilename` are refused as protected
  configs, with `enable-protected-configs no`.
- All `lazyfree-*` settings are `no`.
- `client-output-buffer-limit normal 0 0 0`, `maxclients 10000`,
  `slowlog-log-slower-than 10000`, `latency-monitor-threshold 0`, and a 1 MB
  backlog.
- Hit counting: `MGET a b c` counted 1 hit and 2 misses; `EXISTS` and `TTL`
  counted; `HGET` of a missing field in an existing hash counted a hit; `SET`
  counted nothing; `CONFIG RESETSTAT` set both counters to zero.
- Flushing 500,000 small keys: `FLUSHALL` inside `MULTI` held another client
  for 76 ms (the article measured 130 ms, which is machine-dependent). A plain
  `FLUSHALL` and `FLUSHALL ASYNC` did not hold it.

These were checked against sources:

- The SRE book: both quotations, the latency and capacity cache definitions,
  and "slowly increase the load".
- Bronson et al.: the 300 QPS database, the 90% hit ratio and the vulnerable
  state.
- ElastiCache:
  - the 25% reserve and "do not reduce", with 13.5 GB becoming about 10.1 GB;
  - "can add client latencies";
  - Valkey up to 9.1, and Redis OSS only up to 7.1.
- The Redis README licence ranges, including 7.4.x to 7.8.x.
- The Redis benchmark page: 180,180 `SET`s a second, and 1,536,098 with
  `-P 16`.
- The administration guide's "8 or 9" headroom rule, and the `redis.conf`
  heading "Command renaming (DEPRECATED)".

Every cross-article anchor resolves.

## Minor

**M1. "At 300 and 600 … the outage looks almost like no limit"
(`#limit`).** At 300, the figure serves 16% during the outage, against 28 to 29%
at 60 and 0% at no limit. That is about half as good as the right limit, not
"almost like no limit". Fix: "At 300 only about one request in six is served,
half what 60 manages, and at 600 none are. Both end when Redis returns."

**M2. Why 0.2 s, not the full second?** The upper bound uses "0.2 seconds, a
fifth of the request's timeout", but never says why a fifth. A reader applying
Little's law with W = 1 s gets 300, which the figure has just shown failing.
Add a clause: "leaving most of the second for the rest of the request and for
bursts; with the whole second, as at 300, any delay before or after the query
misses the deadline."

**M3. "Without `+@connection` and `+@transaction` even `PING` is refused"
(`#security`).** `PING` is in `@connection` only. `MULTI` and `WATCH` are in
`@transaction`. Fix: "Without `+@connection` even `PING` is refused, and pools
that check connections with it fail; without `+@transaction`, so are `MULTI`
and `WATCH`."

**M4. Key patterns do not hide key names.** The tenant paragraph shows that a
key pattern does not stop `FLUSHALL`. It also does not stop `SCAN` or
`RANDOMKEY` listing other users' key names. As `shop`, `SCAN 0` returned
`other:secret` and `RANDOMKEY` returned it too, although `TYPE other:secret` was
refused. Add half a sentence to that surprise, since key names often contain
ids.

**M5. Cluster topology permission.** The prose says "a cluster client also needs
`+cluster|slots`". `CLUSTER SLOTS` is deprecated since 7.0, and many current
clients use `CLUSTER SHARDS`. Both were refused for `shop`. Fix: "`+cluster|slots`
or `+cluster|shards`, whichever your client uses".

**M6. The metrics user and `CLIENT SETINFO`.** `metrics` was refused
`CLIENT SETINFO` (and allowed `HELLO`). Most libraries ignore that error, but it
fills `ACL LOG`, which the article tells readers to inspect. Add
`+client|setinfo`, or mention the entry.

**M7. "A fork pauses the server for its duration" (alert table).** This can be
read as the whole snapshot. Fix: "The fork call itself pauses the server for
`latest_fork_usec`."

**M8. "Fragmentation lives in the gap between the two" (alert table).** Three
fields are listed in that cell. Fix: "between `used_memory` and
`used_memory_rss`".

**M9. Figure 5's choice label.** "Kept back for" followed by "no snapshots, no
replica (15%)" does not read as a sentence. Fix: rename it "Reserve outside
maxmemory", with options such as "15%: no snapshots or replica".

**M10. Places to trim (about 500 words).**

- The three Valkey-divergence bullets could become a two-row table or a single
  sentence plus a link.
- The `FLUSHALL`-in-a-transaction detail could become one clause.
- The connection-pool paragraph (`#limit`, about 170 words) packs four product
  defaults, two bounds and a PostgreSQL setting into one paragraph. Split it,
  or move the defaults into a footnote-style sentence.
- The TLS paragraph could lose its last sentence.

**M11. Figure 4's x-axis starts at about 150 s, while the readouts say "since
start".** A first-time reader may wonder where the first 150 s went. Fix: add
"(the first 150 s are omitted)" to the axis title or the caption, or start the
axis at 0.

## Skimmed against earlier reviews

All required items in `review-technical-1.md` (R1 to R4) and
`review-teaching-1.md` (R1 to R7) are addressed in the current text and figures:

- client buffers inside `maxmemory`;
- the qualified fragmentation figure;
- a working ACL;
- the 7.0 protected configs;
- corrected slopes in Figure 1;
- Figure 3 held at capacity;
- a single rule for sizing the limit, with two bounds;
- per-node monitoring;
- the new stacked-memory figure.

B1 is a side effect of that last addition. B2 was not raised in round 1.
