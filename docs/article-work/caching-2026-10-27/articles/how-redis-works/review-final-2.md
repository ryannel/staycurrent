# Final review, round 2: How Redis works: the event loop, data structures and memory

Reviewer: independent pre-publication review, 28 October 2026. I formed this
judgement before I read the earlier reviews and the repair notes.

## Verdict

**Publish.** No blocking problems. 10 minor items, each with a fix below. None
of them would mislead a reader about how Redis behaves or what to do.

It stands beside Gears and Load Balancing. It opens with a problem the reader
will recognise: a nightly 100 ms stall that the CPU graph does not show. That
problem carries the article through the event loop, `KEYS`/`SCAN`, freeing,
I/O threads and diagnosis, and the closing section resolves it in full. Each
figure isolates one variable, as the brief asks: clients in Figure 1, key count
in Figure 2, `COUNT` in Figure 3, how the key goes in Figure 4, value size and
TTL in Figure 6, field count and value size in Figure 7, and deletion and refill
in Figure 8. The prose tells the reader what to watch, and the surprises are
shown before they are explained: `KEYS` beats every `SCAN` on time, `COUNT`
does not change the total work, and deleting half the data frees no RSS. The
article is careful about what it measured. Every figure says which numbers are
measured and which are modelled, and the article says where macOS and libc
malloc differ from Linux and jemalloc. It is also honest about what it could not
measure (I/O threads).

## How I checked

- Read `brief.md`, the plan entries for articles 6 to 8 and "Map changes after
  research". Fetched the full text of Gears and Load Balancing. In a browser I
  dragged three Gears sliders and played three Load Balancing simulations.
- Ran `CACHING_DRAFT_PREVIEW=1 pnpm dev --port 4477` and read the article top to
  bottom. I drove every control with Playwright: Figure 1 at 1, 7, 14 and 40
  clients, with readouts sampled over 25 s; Figure 2 at 1 million keys, then
  10 million at 4×; all six Figure 3 options; all four Figure 4 options; every
  Figure 5 step; all 14 Figure 6 sizes, with and without a TTL; Figure 7 at 1,
  100, 512, 513 and 600 fields for both value sizes; six Figure 8 slider
  combinations; all five Figure 9 tools. I also checked reduced motion: Figures
  1 to 5 start paused, showing Play. Screenshots of every figure in both themes
  at 1280 px and 375 px are in `final-screens/`. The page has no horizontal
  overflow and no console errors. The dev server reloaded several times while
  other agents edited CSS, so I retook every capture that a reload interrupted.
- Primary sources at tag 8.10.3: `redis.conf`, `src/object.c`, `src/object.h`,
  `src/config.h`, `src/config.c`, `src/lazyfree.c`, `src/iothread.c` and
  `src/redis-cli.c`. Also Valkey 8.0 `valkey.conf`, the Redis 8.0-M03 blog post
  and the 8.4.0 release notes.
- Redis 8.10.3 on port 7177 (temporary directory, `--save ''`, shut down
  afterwards). The machine had a load average of 50 to 140 on 14 cores during
  my run, from other work, so I compared only relative timings.

### Claims confirmed

| Claim | Check |
| --- | --- |
| `KEYS *` on 1M keys stalls every client by about its own execution time | Slow log 134 ms, slowest `PING` 137.5 ms (machine loaded) |
| `SCAN ... MATCH` can return empty pages with a non-zero cursor | 989 of 1,000 pages were empty for `user:0000099*` |
| `KEYS`, `FLUSHALL`, `SORT`, `DEBUG` are in `@dangerous` | `ACL CAT dangerous` |
| `DEL` of a 2M-member set stalls; `UNLINK` doesn't; expiry frees on the main thread unless `lazyfree-lazy-expire yes` | `DEL` 187 ms, with `PING` at 186 ms. `UNLINK` 0.3 ms. Default expiry: `PING` at 187 ms. Lazy expiry: 17 ms, which is machine noise |
| A 100 MB string deletes quickly | 0.2 ms |
| `LAZYFREE_THRESHOLD 64`, all lazy-free defaults `no` in Redis and `yes` in Valkey 8.0 | `lazyfree.c`, `redis.conf`, `valkey.conf` |
| 100-byte value about 159 B per key, `MEMORY USAGE` 144; a TTL adds memory but only 8 B to `MEMORY USAGE` | 159.4 B and 144; with a TTL 196 B and 152 |
| embstr up to 44 bytes on this build; 64-byte line means key + value ≤ 41 | 44 bytes gives `embstr`, 45 gives `raw`. In `kvobjSet`, 16 + key + 3 + 4 + value ≤ `CACHE_LINE_SIZE`, and `sizeof(robj)` is 16 |
| Hash: listpack to hashtable at field 513 (17,437 B to 34,946 B); no conversion back; lists shrink back | 17,435 B to 34,944 B; still `hashtable` at 10 fields; trimmed list returns to `listpack` |
| Intset converts at 513, string set and sorted set at 129; an intset given a string becomes a listpack | All confirmed |
| Compact hashes (`template-listpack`) are off by default and save memory; field-expiry hashes never convert | 207 B to 175 B per hash with my field names; `HEXPIRE` hash stays `listpackex` |
| I/O threads: `io-threads N` runs N − 1 threads; immutable; Pub/Sub, `MONITOR`, blocked and tracking clients stay on the main thread | `iothread.c` loops from 1; `IMMUTABLE_CONFIG`; `isClientMustHandledByMainThread` |
| Vendor figures: 37 to 112% (8.0, 8 threads), more than 30% (8.4, 4 cores, caching mix) | Blog post and release notes |
| `busy-reply-threshold` 5000 ms; slow log 10,000 µs and 128 entries; latency monitor off; active defrag 1 to 25% | `config.c`, `redis.conf` |
| `--latency` sleeps 10 ms; when not writing to a terminal it uses a 1 s interval | `redis-cli.c` (`LATENCY_SAMPLE_RATE`, interval default) |
| Fork about 10 ms per GB on modern hardware | redis.io latency page, as recorded in the evidence file |

## Blocking

None.

## Minor

1. **Figure 1 overstates throughput at one client for the first 10 to 20
   seconds.** The prose and the text alternative say about 9,300 requests a
   second and 7% busy with one client. The slider starts at 3. When I moved it
   to 1 straight away, the readouts showed 15,000 and 11% after 3 s, 11,000 and
   9% after 8 s, and 9,000 and 7% only after 25 s. The prose says "a couple of
   seconds". At 40 clients the readout showed 120,000 after 9 s, slightly below
   the 130,000 shown at 14, which a reader could take as a fall. The cause is
   that the requests of clients removed by the slider still finish after the
   100 µs skip, inside the short window. *Fix:* start the slider at 1 to match
   "With one client". In `rates`, count only completions from clients whose
   index is below `params.clients`, or start the window when the last surplus
   client stops. Check that 1, 14 and 40 read about 9,300, 130,000 and 130,000
   within about 5 s.

2. **The opening's p99 does not quite fit a 100 ms stall once a night.** A
   100 ms stall touches about 0.17% of a minute's requests, so a per-minute p99
   would not move. The article itself makes this point about the CPU graph.
   *Fix:* say "the slowest product-page requests" or "the 99.9th percentile", or
   give the graph a 10-second resolution.

3. **The parenthetical for *s* includes parsing.** "The work of each round trip
   (reading the request, parsing it, writing the reply)" is not right as an
   explanation of *s*. Parsing is done per command, so pipelining does not share
   it, and the derivation puts it in *e*. That is also why *e* (0.2 µs) is
   larger than commandstats' 0.05 µs. *Fix:* "(the system calls that read the
   request and write the reply, and the event loop's own bookkeeping)". Then
   add one clause saying *e* includes parsing and building the reply.

4. **"Beyond that the walk barely gets faster" understates Figure 3's data.**
   `COUNT` 10,000 took 0.17 s, half of `COUNT` 1,000's 0.33 s. `COUNT` 100,000
   took 0.18 s. *Fix:* "`COUNT` 10,000 halves the walk to 0.17 s, and beyond
   that it gets no faster while the pauses grow."

5. **"The job's deletes can stall Redis too" overstates the case for product
   keys.** These are probably small strings or hashes, which free in
   microseconds. The section that follows shows the stall comes only from big
   collections. *Fix:* "If any of those keys is a big collection, the job's
   deletes can stall Redis too."

6. **"With a round trip between every two" (`SCAN` `COUNT` 10) is hard to
   parse.** It appears in the prose and in Figure 3's text alternative. *Fix:*
   "with a network round trip between one call and the next".

7. **Figure 4's readout label does not match the expiry options.** The label
   says "Slowest PING after Run", but the button for the two expiry options
   reads "Let bigset expire". *Fix:* use "Slowest PING since" with the action,
   or a neutral "Slowest PING this run".

8. **Figure 6's text alternative is unclear about rounding.** It says
   `MEMORY USAGE` "shows only the first part, rounded by the allocator to
   between 0 and 16 bytes". *Fix:* "shows only the 8-byte expiry time, which the
   allocator's rounding turns into 0 to 16 more bytes".

9. **"Redis 8 takes the cache line to be 64 bytes on Linux" is narrower than
   the source.** `config.h` uses 64 bytes for every build except Apple Silicon,
   so Linux on ARM (Graviton) is also 64. *Fix:* "64 bytes on every build except
   Apple Silicon, including any Linux server".

10. **The section on Figure 1 asks the reader to drag the slider "up" without
    saying where it starts.** Combined with item 1, a reader at the default of
    3 never sees the one-client state the paragraph describes. *Fix:* covered
    by starting at 1. Otherwise, say "Set it to 1, then drag it up".

## Earlier rounds

After forming this judgement I skimmed `review-teaching-1.md`,
`review-technical-1.md` and `repair-1.md`. The required items look done:
ArticleRef, the Figure 3 rebuild, the stem charts, the 10-million case at 4×,
the hash saving now shown in Figure 7, compact hashes, and the explained
`FLUSHALL` row. The exception is part of T-R2 on Figure 1's readouts. 14 clients
now settles within a few seconds, but the one-client case still lags (item 1
above). The lag no longer hides the article's central result, the ceiling, so I
have kept it minor.
