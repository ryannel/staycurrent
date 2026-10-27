# Plan: Cache keys and cached values (article 3)

## The reader at the start

They have read the introduction and the patterns article. They can write the
cache-aside read path (`GET`, then `SET product:42 … EX 60` on a miss), they know
that the miss ratio sets database load and that popularity is skewed, and they
know that a write usually deletes the cached copy, so each write costs the next
read a miss (hit ratio at most k / (k + 1) for k reads per write).

So far every example cached one product under one obvious name. Their real shop
is messier: listing pages filtered by category, sort order and currency; product
pages in several languages; a stock level that changes with every sale; links to
products that no longer exist; a deploy next week that changes the shape of the
cached product. They now have to decide what one cache entry holds, what its key
says, and how its value is stored. Mistakes here are quiet: the cache still
"works", but serves one shopper another shopper's prices, misses far more than
it should, or fills memory with entries nobody can read.

## The questions, in order

1. **What should one entry hold?** Rows, assembled objects, query results,
   rendered fragments, aggregates. Three forces: work saved per hit, how many
   requests share the entry, how many entries one change touches. Derivation:
   an entry's reads per change is (its read rate) / (sum of its parts' change
   rates); larger entries are read by fewer requests and changed by more
   writes, so both terms move against them. Figure 1.
2. **What must the key contain?** Every input that changes the answer, because a
   key that omits one returns a hit with the wrong answer and nothing reports
   it. Figure 2. List of the usual missing inputs, and the security case
   (permissions, personal data).
3. **How do we make sure one answer has one name?** Normalisation (parameter
   order, irrelevant parameters, defaults, case) and its limit (dropping an
   input that does matter brings back figure 2's bug). Figure 3. Key length:
   measured bytes, hashing long parameter strings, readable prefixes, sharing a
   Redis between services.
4. **What happens when a deploy changes the value's shape?** Rolling deploys run
   two versions against one Redis. Shared key and a strict reader: errors.
   Shared key and a tolerant reader that treats an unknown shape as a miss:
   the versions overwrite each other's entries. Version in the key: no errors,
   a cold namespace and old keys that linger until expiry. Figure 4. `WRONGTYPE`
   when the Redis type changes. Additive changes need no version.
5. **What format do we store?** Redis stores bytes. JSON versus binary formats
   (qualitative, no numbers I could not measure); language-native serialisation
   as a code-execution risk; store only what readers need.
6. **Should values be compressed?** Redis does not compress in memory (measured).
   Derivation: per read, compressed costs transfer of the smaller value plus
   decompression; uncompressed costs transfer of the full value; compression
   cost itself is paid once per write. Measured compression ratios and times on
   real JSON and HTML. Figure 5.
7. **String or hash?** Measured memory per product for a JSON string, a hash and
   (8.10) a compact hash. Partial reads and updates (`HGET`, `HMGET`,
   `HINCRBY`). When a string is better. One sentence on encodings with a link to
   article 7.
8. **What if parts of a value change at different speeds?** One TTL for the
   whole entry must follow the most volatile part. Hash-field expiry (7.4+,
   `HSETEX`/`HGETEX` in 8.0) or a separate key. Observed semantics (an `HSET`
   clears the field's TTL; the key vanishes with its last field) and memory
   cost. Figure 6.
9. **How do we cache "not found"?** `GET` nil means "not cached", so absence
   needs a sentinel. Negative caching absorbs repeated lookups of the same
   missing key but not random ones (cache penetration), and it can hide a newly
   created record. Figure 7.
10. **Why keep values small?** Memory, bandwidth (size × read rate), and one
    thread: measured 20 MiB `GET`, measured 120 ms `DEL` of a large hash.
    Finding big keys. Execution mechanics link to article 7.
11. **What can you now decide?** A short list of decisions, then a link to
    article 4 (how long an entry should live).

## Figures

1. **Caching pages or caching products.** Live. The same stream of listing-page
   views (4 categories × 3 sort orders × 2 currencies = 24 pages of 12
   products each, 48 products) runs through two caches at once: one stores
   whole pages, one stores products. Price changes delete every entry that
   contains the product. Grids show each cache's entries, filled or empty;
   a price change flashes the entries it deletes. One slider: price changes a
   minute. Readouts per cache: hit ratio, Redis lookups per view, database rows
   per view. Notice: with no changes, pages win (one lookup, nothing to
   assemble); as changes rise, one change empties six pages and the page
   cache's hit ratio falls while the product cache barely moves.
2. **A key that leaves out the currency.** Stepped. Lanes: shopper paying in
   pounds, shopper paying in euros, Redis, database. The first shopper misses
   and stores the page in pounds under `listing:shoes:popular`; the second gets
   a hit and pounds. Notice: the wrong answer is a hit; nothing fails.
3. **One answer, many names.** No clock. 2,000 generated listing requests
   whose URLs vary in parameter order, tracking parameters, explicit defaults
   and case, for 24 distinct answers. One cumulative choice of how the key is
   built: raw URL, sorted parameters, tracking dropped, defaults and case
   normalised, and finally "currency dropped too". Sample URLs with the key each
   produces. Readouts: distinct keys, hit ratio with unlimited memory, requests
   given the wrong answer. Notice: each step merges names and raises the hit
   ratio; the last step raises it further by serving wrong answers.
4. **A deploy changes the cached shape.** Live. Six application instances,
   replaced one by one by a version that stores a new shape. Choice: shared key
   with a strict reader, shared key with a reader that treats an unknown shape as
   a miss, version in the key. Chart of errors a second and database reads a
   second; readout of keys held. Notice: errors during the deploy; or extra
   misses as the two versions overwrite each other; or a short miss bump and old
   keys that remain until they expire.
5. **Is compression worth it on a read?** No clock. Slider: value size
   (measured points from 1 KB to 300 KB of real JSON). Choice: network speed.
   Bars: time per read without compression, with compression (transfer plus
   decompression), memory per value. Notice: small values gain nothing; on a
   fast network the read can be slower compressed even when memory falls
   fourfold.
6. **One TTL or one per field.** Live. A product hash whose stock should be no
   older than 5 s and whose description may be an hour old. Choice: one TTL on
   the key (must be 5 s) or a TTL on the stock field. Field bars drain with
   their TTLs. Readouts: database reads a minute, bytes reloaded a minute.
   Notice: with one TTL the description is reloaded every 5 s.
7. **Caching "not found".** Live. Real product reads plus lookups for missing
   ids. Choices: cache "not found" (no / yes, 30 s); missing ids are a few
   repeated ones / random ones. Readouts: database reads a second for missing
   ids. Notice: negative caching removes almost all of the repeated misses and
   none of the random ones.

## Where to stop

- TTL choice, expiry mechanics, eviction: article 4. Here TTLs appear only as a
  safety net and in hash-field expiry.
- Invalidation fan-out remedies (tags, generations), races on a negative
  entry, compare-and-set: article 5. Here fan-out is shown as a cost of
  granularity.
- Stampede on a new key namespace after a version bump: named, article 6.
- Encodings, per-key overhead, `DEL` versus `UNLINK` mechanics: article 7.
  Here only the decision consequence (one long field moves a hash to a larger
  encoding; deleting a big key can block).
- Round-trip cost of 12 lookups versus one `MGET`: article 8. Hash tags and
  `CROSSSLOT`: article 10. Hot big keys: article 10. Sizing memory: article 11.
- Binary serialisation formats: described, not measured, because I have no
  measurement and the choice rarely turns on the last microsecond.

Further depth (encoding internals, format benchmarks across languages) would
not change the decisions this article prepares: the unit of caching, the key,
the version strategy, the format, the structure, and what to do about absence
and size.
