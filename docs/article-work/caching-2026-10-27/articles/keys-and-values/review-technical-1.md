# Technical review 1: Cache keys and cached values

Reviewer: independent technical review, round 1, 2026-10-27.
Source: `src/articles/caching/keys-and-values.astro`, figures in `src/components/caching/keys-and-values/`.
Evidence: `docs/article-work/caching-2026-10-27/evidence/keys-and-values-review-1.txt` (Redis 8.10.3 on port 7153, temporary directory, `--save ''`; shut down afterwards).

## Verdict

Mostly accurate and well sourced. Every Redis measurement I repeated came out within allocator noise of the article's figures. All seven model outputs quoted in the prose reproduce from the `.mjs` code. The rendered page showed seven figures in order with no console errors. Three findings must be fixed: one is the HSETEX question the writer raised, one is advice that follows from it, and one is a correctness gap in the versioned-keys recommendation. There are nine suggested improvements.

Counts: **3 required, 9 suggested.**

## The HSETEX question, settled

The writer saw that the HSETEX page says "any previous TTLs associated with the key are discarded", but observed that on 8.10.3 the key's TTL and the other fields' TTLs stayed. **The observation is right and the documentation sentence is wrong.** The sentence matches the wording of the `SET` page and does not describe HSETEX.

- **Source.** `src/t_hash.c` at tag 8.10.3, `hsetexCommand`, loops over the named fields only. Each call is `hashTypeSet(..., opt)`, and `HASH_SET_KEEP_TTL` is added only when `EX`, `PX`, `EXAT`, `PXAT` or `KEEPTTL` was given. `hashTypeSetEx` then sets the new expiry only when an expiry option was given. Nothing in the command touches the key's own expiry or any field it was not given.
- **Observed** (evidence, Part 1). Starting state: key TTL 3600, price field TTL 100, stock field TTL 200.
  - `HSETEX p EX 5 FIELDS 1 stock 16`: key 3600, price 100, stock 5.
  - `HSETEX p FIELDS 1 stock 15`, with no option: stock becomes −1 (TTL cleared); key 3600 and price 100 are unchanged.
  - `HSETEX p KEEPTTL FIELDS 1 price 4800`: price stays at 100.
  - By contrast, `SET` on a key that has a TTL does discard the key's TTL.

So the true rule is: **HSETEX changes only the fields it names. With `EX`/`PX`/`EXAT`/`PXAT` it gives them that TTL. With `KEEPTTL` it keeps their existing TTL. With neither, it clears their TTL, exactly as `HSET` does. The key's TTL and every other field are never affected.**

The article should state that rule plainly. It should not tell the reader that the documentation conflicts with Redis: that sends readers off to doubt a behaviour that the source code settles. If the writer wants a record of the discrepancy, it belongs in the evidence file or in a short note in Sources, not in the advice list.

## Required

### R1. Replace the HSETEX bullet (line 237)

The current text reports the behaviour correctly but frames it as Redis contradicting its documentation. It also leaves out the option-less case, which is the case that bites people.

Correction:

> `HSETEX` changes only the fields it names. With `EX` or `PX` it sets their TTL, with `KEEPTTL` it keeps it, and with neither it clears it, as `HSET` does. The key's TTL and the other fields are untouched.

Evidence: t_hash.c 8.10.3, `hsetexCommand`; evidence Part 1.

### R2. "Write volatile fields with HSETEX every time" is incomplete, and the advice is unsafe as written (line 236)

A bare `HSETEX key FIELDS 1 stock 16` clears the stock field's TTL, just as `HSET` does (evidence Part 1). A reader who follows the advice literally keeps the bug the bullet is warning about.

The same trap applies to the full-rebuild path. Rebuilding the product with one `HSET name … stock …` clears the stock field's TTL, unless the code then re-applies `HEXPIRE` or writes stock with `HSETEX … EX`.

"Quietly become permanent" is also slightly overstated. With the key's one-hour TTL from the example, the stock field lives as long as the key, so it becomes up to an hour stale rather than permanent. It is permanent only when the key itself has no TTL.

Correction:

> Every write of a volatile field must carry its TTL: `HSETEX … EX 5 FIELDS …`, or `HSET` followed by `HEXPIRE` in the same transaction or pipeline. That includes the code that rebuilds the whole product. A plain `HSET`, or an `HSETEX` without `EX`, clears the field's TTL, and the stock then lives as long as the key. `HINCRBY` keeps it.

The `HINCRBY` claim is confirmed in the source: `hincrbyCommand` passes `HASH_SET_KEEP_TTL` (t_hash.c line 4788), and so does `HINCRBYFLOAT`.

### R3. Versioned keys need invalidation across versions during the overlap and on rollback (lines 126 and 137, "What you can now decide")

The article recommends a key version for changes that cannot be additive. Earlier, in Figure 1's setup, it also makes delete-on-write the invalidation rule. Put together, those two produce a stale-read bug that the article presents as a pure benefit ("the two versions never touch each other's entries").

During the rolling deploy:

- A product update handled by a v1 instance deletes `product:v1:42` but not `product:v2:42`. The v2 instances keep serving the old price until the v2 entry's TTL runs out.
- The same happens the other way round.
- If the deploy is rolled back, the v1 entries that sat unread during the v2 period are served again. Writes made while v2 was live never deleted them, so they may be up to a full TTL stale. With the hour-long TTL used in the article's own `SCAN` example, that is up to an hour.

The Deploy model does not show this because it has no writes. That is fine for an illustration, but the prose should not imply the approach is free of consistency cost.

Correction: add a short paragraph after line 126.

> Version keys trade one problem for another. While both versions run, the write path must delete the entry under every version still being read (`product:v1:42` and `product:v2:42`), or each version serves the other's stale data until its TTL. Keep deleting the old version's keys until a rollback is no longer possible, or clear them with `SCAN` and `UNLINK` before rolling back.

Also mention it in the closing bullet, or in the caption of Figure 4: "the model has no writes; see the paragraph below."

## Suggested

### S1. Large-value stalls on expiry apply to collections, not to big strings (line 271)

The sentence "a large cached value can stall the server when its TTL runs out" reads as if any large value does this. In fact the cost of freeing grows with the number of elements, not with the number of bytes.

`src/lazyfree.c`, `lazyfreeGetFreeEffort`, gives a string an effort of 1, and the lazy-free threshold is 64 elements. Measured server-side with `SLOWLOG` (evidence Part 4):

- `DEL` of a 1,000,000-field hash: 61,002 µs.
- `UNLINK` of the same kind of hash: 6 µs.
- `DEL` of a 20 MiB string: 1 µs.

Say "a large hash, set, sorted set or list, one with many elements," rather than "a large cached value". The 82 ms figure measured at the client is consistent with the 61 ms server-side figure; either can be quoted, as long as the article says which it is.

### S2. Explain why a big GET hurts others: the reply write, not the command (line 271)

The section heading is "Time on Redis's one thread". Directly after it, the article quotes "a GET of a 20 MiB value took about 4 ms", which implies the command itself occupies the thread for 4 ms. It does not:

- `SLOWLOG` shows the `GET` executing in 1 µs.
- The event loop writes the reply in slices of about 64 KB per client per event (`networking.c`, `NET_MAX_WRITES_PER_EVENT`), interleaved with other clients.

The conclusion still holds, and I measured it (evidence Part 5). While one client looped `GET`s of a 20 MiB value, a second process's `PING` median rose from 0.16 ms to 2.1 ms, with p99 at 3.1 ms. Quote that instead. It shows the actual harm to other clients, and it is a measurement from a separate process. Suggested wording:

> The command itself is instant, but the same thread then writes 20 MiB to the socket, a slice at a time between other clients' work. While one client fetched a 20 MiB value in a loop, another client's `PING` went from 0.16 ms to about 2 ms.

### S3. Valkey's lazy-free defaults differ, and the difference matters to the DEL/UNLINK decision (line 271)

Since Valkey 8.0, `valkey.conf` ships `lazyfree-lazy-eviction`, `lazyfree-lazy-expire`, `lazyfree-lazy-server-del`, `lazyfree-lazy-user-del` and `lazyfree-lazy-user-flush` all set to `yes`. On Valkey, `DEL` behaves like `UNLINK` and expiry frees in the background by default. Redis 8.10.3 has all five set to `no` (confirmed with `CONFIG GET`).

The brief asks for Valkey differences where they matter to a decision. Add one clause, for example: "Redis 8.10; Valkey 8.0 and later free in the background by default."

### S4. Compact hashes and field TTLs do not combine (lines 186 and 217)

On 8.10.3, `HEXPIRE` on a hash created with `HIMPORT SET` (encoding `template-listpack`) converted it to `listpackex` (evidence Part 3). The product in the field-expiry section therefore cannot also be a compact hash. That is worth one sentence, because the article offers both as memory and freshness options for the same product.

Two further details are useful to readers who adopt compact hashes:

- The hashes documentation notes that `HGETALL` field order can differ from the order declared.
- The hashes documentation also says `HIMPORT SET` replaces an existing key.

### S5. Deploy: "about five times" is the peak, not the level (line 124)

Running `deploy-model.mjs` (evidence Part 7, three seeds):

| Mode | Average database reads, 8–23 s | Peak |
| --- | --- | --- |
| Tolerant | 26–30 a second against a baseline of 7 (about 4×) | about 34 a second (5×) |
| Versioned | 13–14 a second (about 2×) | about 17–19 a second (2.5–3×) |

Say "up to about five times" for the tolerant mode. The figure's own text ("rise to about 35 a second") is fine.

### S6. Rails "cache version" is record versioning, not deploy-shape versioning (line 124)

Rails stores `cache_version`, derived from `updated_at`, alongside a stable `cache_key`. Its purpose is recyclable keys for changing records. The mechanism (a version inside the value, checked on read, with a mismatch treated as a miss) is the same as the article's tolerant reader, so the comparison is fair, but the article implies Rails uses it for code deploys. Suggested wording: "the mechanism Rails uses for record changes with its separate cache version".

### S7. The listpack limit applies to field names and values (line 206)

"every field is at most 64 bytes" should say "every field name and value is at most 64 bytes" (`hash-max-listpack-value 64`, `hash-max-listpack-entries 512`, both confirmed with `CONFIG GET`). The 115 → 233 byte jump reproduces exactly (evidence Part 2).

### S8. Compression also shortens Redis's own write time (lines 155–163)

The per-read formula counts only the client's transfer and decompression. Given S2, fewer bytes also means less of Redis's single thread spent writing replies, a benefit shared by every other client. One sentence would tie the compression section to the big-values section.

### S9. `--bigkeys` and `--memkeys` advice is more conservative than the documentation (line 275)

The redis-cli documentation says these options use `SCAN` and can run against a busy server, with `-i` to sleep between scan batches. "Run them against a replica or at a quiet time" is not wrong. Mentioning `-i 0.1` is more useful, since many teams have no replica to spare.

## Checked and correct

Repeated on Redis 8.10.3 (evidence Parts 1–4), or read from primary sources:

- **Key and value sizes.**
  - Key memory: 20 bytes against 75 bytes, about a byte per character.
  - 100,000 `x` characters: 114,711 bytes. `rdbcompression` applies to RDB files only.
- **Strings and hashes.**
  - JSON string against hash: 129-byte string, 194 against 155 bytes.
  - Listpack 64/65-byte boundary: 115 against 233 bytes.
  - Field-TTL memory overhead: +40 bytes, the same delta as the article's 132 → 172.
  - Compact-hash saving of about a third. Automatic conversion is off by default (`hash-min-template-entries 0`).
  - `HIMPORT` since 8.10.0.
- **Hash-field expiry.**
  - `HSET` clears a field's TTL; `HINCRBY` keeps it.
  - When the last field expires, the key is deleted. `expired_subkeys` counts it and `expired_keys` does not.
  - `HEXPIRE` since 7.4.0; `HSETEX` and `HGETEX` since 8.0.0; Valkey `HEXPIRE` since 9.0.0.
- **Freeing and big keys.**
  - `DEL` against `UNLINK` of a 1M-field hash.
  - `lazyfree-*` defaults are `no` on Redis.
  - `BF.ADD` is absent from the Homebrew build.
- **Documentation quotes.**
  - redis.io keyspace page: 1,024-byte key "bad idea", the `u1000flw` example, colon convention.
  - Microsoft Cache-Aside: "might not be suitable when the data is sensitive".
  - Python pickle warnings.
- **Models.** These all reproduce from the code:
  - Figure 1: 72× derivation; 85% and >99% at 12 changes a minute; about 45% and 97% at 120. In the live render, after 20 s: 88% and 99.7%.
  - Figure 3: 1,620 → 1,120 → 121 → 24 keys; 19 → 44 → 94 → 98.8%; dropping the currency gives 99.4% with 1,065 wrong answers.
  - Figure 4: strict-mode failures last until about 49–50 s.
  - Figure 5: compression arithmetic, +75 µs at 1 Gbit/s and −6 µs at 10 Gbit/s; 64 KB at 1,000 reads a second uses 52% of a 1 Gbit/s link.
  - Figure 6: 10.8 rebuilds and 432 ms a minute, against 11 ms.
  - Figure 7: 15% of missing-id lookups reach the database with repeated ids, 100% with random ids.

  Captions correctly label all of these as illustrative, and Figure 5 correctly separates its measured inputs from the transfer model.
