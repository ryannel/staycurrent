# Technical review, round 1: Caching patterns

Article: `src/articles/caching/caching-patterns.astro`, figures in
`src/components/caching/caching-patterns/`. Evidence:
`docs/article-work/caching-2026-10-27/evidence/caching-patterns-review-1.txt`
(Redis 8.10.3 on port 7152, persistence off, now shut down; model runs; the
rendered page at port 4462, stepped with Playwright).

## Verdict

The article is accurate on almost everything it says. The Redis behaviour it
quotes reproduces: `DEL` 1 then 0, a plain `SET` dropping the TTL to -1,
`KEEPTTL` (since 6.0.0), `SET … XX` on an absent key, `PTTL` in milliseconds,
`GETDEL` (since 6.2.0), loss on restart, and "Connection refused". The primary
sources say what the article says they say: Nishtala et al. §2 and §3.1, Bronson
et al. §2.2 and §3, the Coherence quotations, Azure, Amazon and the Redisson
defaults. The figure numbers in the prose match the models and the rendered page
(Figure 1 after 600 s: 87% hit with 28% stale, 83%, 90%; Figure 4 at 30 s:
cache-aside 54% with a 26 s wait, read-through 90% with 100% answered). All five
model tests pass.

There are three required fixes. One is a formula presented as a hard bound when
it holds only for random arrivals. One is a connection-failure claim that is
wrong for the most dangerous kind of outage. The third presents a property of
some read-through implementations as a property of read-through itself.

Counts: **3 required, 9 suggested.**

## Required

### R1. k ÷ (k + 1) is the value for random arrivals, not a ceiling

Where: "Why delete is the usual choice", where the article says "A key read four
times per write can hit at most 80% of the time" and "This is a ceiling set by
writes alone". Also "Choosing a pattern": "At two or three it is a ceiling of
67% to 75%". The closing list says "work out the most a key can hit".

The derivation is correct for independent Poisson reads and writes (evidence §4
and §6; the model test confirms it). But the article calls it a maximum, and it
is not one. Under delete-on-write, each miss needs at least one write since the
previous read. So misses ≤ writes, and the only general bound runs the other
way: hit ratio ≥ 1 − 1/k. The actual value depends on how writes are spaced
(evidence §6):

| k | formula | random | evenly spaced writes | writes in bursts of 5 | a read right after every write |
|---|---|---|---|---|---|
| 1 | 50% | ≈50% | 0% | 80% | 0% |
| 2 | 67% | ≈66% | 50% | 90% | 50% |
| 4 | 80% | ≈80% | 75% | 95% | 75% |

The "read right after every write" column is the read-your-own-write case that
the article recommends write-through for. That pattern pushes the hit ratio
*below* the claimed ceiling. A practitioner who measures 70% at k = 4 could
wrongly conclude that something else is evicting keys.

**Correction:** call it the expected hit ratio when reads and writes arrive
independently at random, not a maximum. Add one sentence giving the range: if
writes are spread evenly, or each one is followed by a read, the result is
nearer 1 − 1/k (75% at k = 4, 0% at k = 1). If writes come in bursts, it is
higher. Change "at most", "ceiling" and "the most a key can hit" accordingly.
The decision rule, that keys with few reads per write lose much of their hit
ratio, stands.

### R2. "When Redis cannot be reached, a client typically fails at once" is wrong for an unreachable host

Where: "How each pattern fails", first paragraph after the table. The table
column is headed "Redis unreachable".

A fast failure happens only when the host is up and nothing is listening on the
port, which produces a TCP RST. That was 0.025 s on a stopped local server
(evidence §3). If the host is down, or the network drops packets (a crashed VM,
a partition, a security group change), the connect waits for the client's
connect timeout. `redis-cli` against a non-routable address was still waiting
after 30 s. With `-t 2` it gave up after about 4 s (evidence §3). Without a
connect timeout, the operating system's SYN retries run for tens of seconds or
longer. So the case the article calls the worse one ("up but slow") is not the
only slow one. An unreachable cache can hold every request open for the length
of the connect timeout, and that is how a cache outage becomes a site outage.

**Correction:** "If Redis is stopped but its host is up, the connection is
refused at once: with the server stopped, `redis-cli GET product:42` printed
'Connection refused' in milliseconds. If the host or network is down, nothing
answers, and the client waits for its connect timeout. Against an unreachable
address `redis-cli` was still waiting after 30 seconds. A Redis that is up but
slow behaves the same way. Set both a connect timeout and a command timeout;
the clients article covers choosing them."

### R3. Read-through does not inherently keep filling under overload

Where: the failure table ("Read-through … Refills itself, and keeps refilling
under overload because loads outlive requests"); the summary table ("Use for …
refilling under overload"); "Choosing a pattern" ("make sure fills outlive
requests, as read-through's do"); and the closing list.

The read-through section itself says correctly that "the label is not the
cause", and Bronson et al. §3 say only that a read-through cache "*can* have a
permissive timeout for database queries". Whether a load outlives the request
depends on the implementation. A loader that runs on the caller's thread, or
inside a future that is cancelled or removed when the caller times out, has the
same coupling as cache-aside. A database or driver with a statement timeout or
cancellation also drops the late result, as the article notes. The tables and
the advice reverse the careful caveat, and a reader may adopt a read-through
library believing it brings this protection.

**Correction:** in both tables and in "Choosing a pattern", make the property
conditional. For example: "Refills under overload *if* its loads are allowed to
finish after the request gives up". And: "make sure fills outlive requests (a
read-through layer makes this easy to arrange; check that yours does)."

## Suggested

**S1. The split `GET`/`DEL` caveat is not borne out.** The article says the
roughly 50% loss "was exaggerated, because each command was a separate
`redis-cli` process". I reran the experiment with one persistent connection for
the flusher and `redis-benchmark -c 20 -n 200000 INCR`. `GETDEL` flushed
200,000 of 200,000 twice. Split `GET`/`DEL` flushed 100,912 and 101,075, so
about half was still lost (evidence §2). What makes the gap large is the
flusher running in a tight loop, not process start-up. A flusher that runs
every few seconds loses only the increments that land in the one round trip
between its `GET` and `DEL`. Reword: "The loss is this large because the
flusher ran continuously; one that runs every few seconds loses less, but any
gap between reading and deleting loses the increments that land in it."

**S2. Flusher crash windows.** In the example flusher, a crash between `SPOP`
and `GETDEL` leaves the counter unlisted until that product gets another view.
A crash after `GETDEL` loses the count, which the article mentions. Consider
naming the first window too, or pointing at a safer shape: move the pending set
aside with `RENAME` or `SMOVE` to a processing key and remove items only after
the database write. Exactly-once delivery can be left to later articles.

**S3. Write-behind failure table, "Redis unreachable … or must go to the
database directly, around the queue".** Writing around the queue recreates
Figure 6's hazard: older queued values flushed later overwrite the direct
writes, and updates can arrive out of order. Add "which risks the overwrite in
Figure 6 when the queue later flushes".

**S4. Write-behind loss is wider than restarts.** Acknowledged writes that have
not been flushed are also lost when a replica that had not yet received them is
promoted in a failover. Replication is asynchronous. A clause such as "a
restart, or a failover to a replica that had not received them" would make the
exposure complete without taking over article 9.

**S5. "Never stale … holds only while there is one writer at a time."** It also
needs no reader filling from an older read. Write-through is paired with
cache-aside reads (the article recommends this). A reader can miss, read the old
row, and `SET` it after the writer's `SET`. Suggest "only while one process
writes the key at a time, and no reader fills it from an older read", deferring
the race to the invalidation article.

**S6. Figure 4: say that headroom decides.** The stuck state depends on the
parameters. With the database at 150 queries a second (about 30% busy before
the restart instead of about 45%), or a 5 s application timeout, the
cache-aside model also recovers to about 90% (evidence §4). One sentence in the
prose or caption ("with a little more database headroom, or a longer timeout,
cache-aside recovers too; the trap needs both a busy database and a timeout
shorter than the queue") stops readers concluding that cache-aside always gets
stuck. It also supports the "Choosing" question about restarts. Separately,
before the restart the model's database runs at about 40 to 48 queries a
second, slightly under the "about 50" in the figure text. That is fine as
"about half".

**S7. Refresh-ahead with `PTTL`.** Checking `PTTL` on every read adds a round
trip unless it is pipelined with the `GET`. The common alternatives are to
pipeline `GET` and `PTTL`, or to store a soft "refresh after" timestamp inside
the value. Worth one clause, since the clients article owns round-trip cost.

**S8. Amazon source link.** The whitepaper URL now redirects (301) to
`https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html`, a
page titled "Caching strategies for Memcached". The content quoted ("never
stale", cache churn, missing data, TTL) is there. Link to the final URL and
describe it as the ElastiCache developer guide's caching strategies page, so a
reader is not surprised to land on a page headed Memcached.

**S9. Facebook's "errors as misses" rule, context.** In the paper this rule is
about dropped or late UDP `get` packets (0.25% at peak), not a cache that is
down. It is still a sound default, but "Facebook's rule for handling failed
cache reads" is more accurate than "Facebook's rule for cache-aside", and it
sits better next to R2's timeout point.

## Checked and correct (no action)

- The derivations of the miss ratio w ÷ (r + w) under random arrivals and of
  1 ÷ (k + 1) wasted updates; the exposure r × T ÷ 2. The model shows a mean of
  4.0, 20.3 and 118.7 views pending at 1, 5 and 30 s. The database load of
  1 ÷ (1 − h) when the cache is lost matches Bronson's "10× query
  amplification".
- Azure's order (database, then delete) and its reason (a race, not a crash);
  Azure's sensitive-data guidance.
- The two meanings of write-through (Coherence `put` blocks until the store
  write; Amazon's pseudocode writes the database, then `cache.set`).
- The Coherence quotations "may re-order database updates", "heuristically or
  escalated" and system-of-record, and the refresh-ahead 60 s / 0.5 example.
- The Redisson write-behind delay default of 1,000 ms (batch size 50).
- The illustrative and measured numbers are kept apart, and the captions say
  what each model leaves out.
