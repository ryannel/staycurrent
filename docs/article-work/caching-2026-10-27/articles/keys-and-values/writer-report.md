# Writer report: 3, Cache keys and cached values

Draft at `src/articles/caching/keys-and-values.astro`. The figures and models are in
`src/components/caching/keys-and-values/`. The status is still `planned`, and nothing
has been committed.

## Size

- About 5,800 words of prose, not counting code blocks or figure text.
- 7 figures and one measured table.
- 11 sections, then "What you can now decide" and "Sources and further reading", which
  is the last h2.

## Figures

All seven were checked at desktop and phone widths in light and dark themes. There
were no console errors and no page overflow. Every control was exercised with
Playwright (`scratchpad/pw/a3-interact.cjs`), and the readouts match the prose. The
screenshots are in `screens/` and `screens/interact*/`.

1. **Granularity** (live, slider for product changes a minute). Whole pages and
   products run side by side. It shows that a page cache falls from about 85% to
   about 45% while a product cache stays at 97–99%.
2. **MissingInput** (steps). A key that leaves out the currency serves the page
   priced in pounds to a euro shopper.
3. **Normalise** (choice of key-building step). Measured on the model: 1,620 keys and
   19% hits, falling to 24 keys and 98.8%. Dropping the currency gives 99.4% hits
   but 1,065 wrong answers.
4. **Deploy** (live, three modes):
   - Strict readers fail until about 50 s, although the deploy ends at 23 s.
   - Tolerant readers send about 5× the database reads.
   - Versioned keys send about 2.5× the database reads.
5. **Compression** (size and link). The measured zstd sizes and times are fed into a
   transfer model. Compression is about 75 µs faster at 16 KB on a 1 Gbit/s link and
   about 6 µs slower on a 10 Gbit/s link.
6. **FieldTtl** (key TTL against field TTL). Rebuilds cost about 450 ms of database
   time a minute; reading the stock field alone costs about 11 ms a minute.
7. **NegativeCache** (two choices). Negative caching sends about 16% of repeated
   missing-id lookups to the database. With random ids it still sends 100%, and
   about 67 useless markers pile up.

Logic lives in pure `.mjs` models, with 12 passing tests in `models.test.mjs`.

Fixes made after previewing:

- Grouped column headers in Figure 1.
- A cumulative readout in Figure 7, because the windowed ratio showed 110%.
- A fixed chart scale in Figure 4.
- Shorter lane labels in Figure 2 for phone width.
- Figure text and prose numbers aligned with the observed readouts.

## Checks

- `pnpm build` passes. It excludes this draft, which is still planned.
- A `CACHING_DRAFT_PREVIEW=1` build in the scratchpad, checked with the site rules,
  gave 0 issues on the caching pages, with Figures 1–7 labelled in order.

## Evidence

Kept in `evidence/keys-and-values.txt`. Everything was run on Redis 8.10.3 on port
7103, a macOS build with the system allocator and persistence off. Redis has been
shut down.

Measured on Redis:

- Key bytes from `MEMORY USAGE`.
- The missing-currency key and the `WRONGTYPE` errors.
- Versioned keys lingering, found with `SCAN`.
- A JSON string against a hash against a compact hash (`HIMPORT`), for one product
  and for 1,000.
- The jump from listpack to hashtable at a 65-byte field.
- Hash-field expiry: what `HSET`, `HINCRBY` and `HSETEX` each do to a field's TTL,
  `expired_subkeys`, and the memory cost.
- The "not found" marker.
- No compression in memory.
- Big-value `GET` and `SET` times.
- `DEL` of a 1M-field hash blocking for 82 ms, against `UNLINK` at 0.4 ms.
- `--bigkeys` and `--memkeys`.
- The defaults `hash-max-listpack-*` and `lazyfree-*`.

Measured in Python 3.14 on real data:

- zstd and zlib ratios and times on prose JSON, structured JSON and this site's HTML.
- `json.loads` times.

The article says which numbers are measured and which come from an illustrative
model; each figure caption says the same.

## Unverified or caveated

- **Binary formats.** Protocol Buffers, Avro and MessagePack were not measured. The
  article says so and gives no numbers.
- **Compression threshold.** "A few kilobytes" is a judgement from Figure 5, not a
  sourced figure.
- **Bloom filters.** `BF.*` is documented for Redis 8 but missing from the Homebrew
  build, so it is untested. The article says so.
- **HSETEX documentation.** The page says "previous TTLs associated with the key are
  discarded", but I observed that the key TTL and other field TTLs stay intact. The
  article reports what I observed and notes the conflict. It is worth a second check
  on Linux or a newer version.
- **Absolute byte counts.** These would differ under jemalloc. The article says to
  treat them as relative.

## Coverage map: gaps and overlaps

- **Article 7.** Encodings and lazy freeing are touched in a sentence or two each,
  with links: the 64-byte and 512-entry listpack limits, `DEL` against `UNLINK`,
  expiry freeing on the main thread, and compact hashes. Article 7 should own the
  mechanics and may reuse the `DEL`/`UNLINK` measurement.
- **Article 5.** The stale "not found" marker race and fan-out invalidation are only
  linked.
- **Article 6.** A versioned cold start is linked as a stampede.
- **Article 8.** Round trips and read-modify-write races are linked.
- **Article 10.** Hash slots and `MGET` with `CROSSSLOT` get one sentence.
- **Article 4.** TTL choice is deferred to it.
- **Article 11.** Securing Redis is linked from the pickle warning.
- **Not covered:**
  - Locale-aware normalisation beyond lower-casing.
  - Choosing a hash function for long keys. SHA-256 is mentioned in passing.
  - Valkey's compact-hash equivalent, which is unknown.

## Toolkit gaps

These were handled locally in `draw.mjs` and `kv.css`; the shared toolkit was not
edited.

- No grid of cache entries. I added `entryGrid` with row and column labels and column
  groups.
- No row of application instances, and no field-by-field view of a hash with TTL bars.
- `Slider` cannot show custom value labels. The Compression figure overwrites the
  output and `aria-valuetext`.
- No checkbox control.
- `ArticleRef` lives in `caching-patterns/` and is imported from there. It belongs in
  `shared/`.
- Setting radio inputs from a script (`checked` plus a dispatched event) did not
  rebuild the Deploy figure; real clicks did. This is worth knowing for future
  Playwright checks.
