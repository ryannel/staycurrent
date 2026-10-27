# Final review, round 2: Cache keys and cached values

Reviewer: fresh, independent. I read the brief, the plan entry and its neighbours,
and the full text of Gears and Load Balancing. I used five of their demonstrations:
the Load Balancing first simulation, the variable-cost queue and the shuffled
dynamic weighted round robin, and the Gears friction-disc and spool figures. Then I
read the rendered article top to bottom at
`http://localhost:4473/learn/databases/caching/keys-and-values/` and used every
control in all eight figures. I checked claims against redis.io, the Microsoft
and HIMPORT pages, and Redis 8.10.3 on port 7173. Only after forming this
judgement did I skim the round-1 reviews and repair notes.

Screens: `final-screens/` (8 figures × light/dark × desktop/375 px) and
`final-screens/interact/` (figure states, plus Figure 8 under simulated
deuteranopia, protanopia and greyscale).

## Verdict

**Publish.** No blocking problems. I recommend fixing the Figure 8 encoding (minor 1)
before publishing, because the change is small, but the figure can still be used
without it.

The article stands beside Gears and Load Balancing. Each section starts from a
situation the reader knows from the shop, and an interactive figure follows almost
every idea. Each figure changes one thing, and the prose tells the reader what to
watch. The surprises are earned and then explained: failures outlast the deploy by
a TTL, a versioned key brings back stale reads, compression slows reads on a fast
link, and parsing costs more than transfer. The arithmetic is derived rather than
asserted (72× reads per change, transfer-versus-decompression, Bloom bits per id).
Where the article says something was measured, it was measured, and the illustrative
models are labelled as such. The voice is plain, first-person and British, and the
depth suits the subject. Prose without code is about 5,800 words.

Counts: **0 blocking, 9 minor.**

## Figure 8: can a reader with colour-vision deficiency tell missing-id lookups from misses?

In Figure 8, a lookup for a missing id is a grey ring (`client` colour with the
`ring` paint). A miss is an orange ring (`miss`). The two have the same shape and
stroke width. Their radii differ by half a pixel, so in practice only the colour
separates them. I computed the colours for each theme (Machado 2009 at full
severity, CIEDE2000) and rendered the scene through the same matrices:

| | Light: grey vs orange | Dark: grey vs orange |
| --- | --- | --- |
| Luminance contrast between them | 1.10 : 1 | 1.05 : 1 |
| Normal vision, ΔE2000 | 31.9 | 29.2 |
| Deuteranopia: simulated colours, ΔE | #5e6370 vs #807104 (olive), 33.2 | #b5b9c4 vs #cebc5d (khaki), 30.3 |
| Protanopia: simulated colours, ΔE | #606571 vs #6b5e00 (dark olive), 30.9 | #b7bac5 vs #bdab55, 29.3 |
| Greyscale, ΔE | 2.4 | 1.2 |

**Answer.** Readers with the common red–green deficiencies (deuteranomaly,
deuteranopia, protanopia) still see a difference in saturation: neutral grey against
olive or khaki. That difference survives on the blue–yellow axis they keep. In the
legend, and in a paused frame looked at closely, most of them **can** tell the two
apart (see `interact/light-f8-legend-protan.png` and `interact/*-f8-cvd-deutan.png`).
In the running figure they **cannot do so reliably**. The marks are rings about
9 px across with a 2.2 px stroke, and they move. Colour discrimination drops sharply
for thin, small, moving marks. The two colours also have the same lightness, so
there is no brightness cue to fall back on, and in greyscale they are identical
(`interact/light-f8-cvd-mono.png`).

The bigger problem affects every reader. The encoding breaks the collection's own
rule that hue is never the only signal (`shared/tokens.css`, `shared/README.md`),
because everywhere else a ring means a miss. The prose also says "watch where the
hollow dots go", but misses are hollow dots too. On the edge between the application
and Redis, a grey ring travelling out and an orange ring coming back differ only in
colour and direction.

**Fix (in `NegativeCache.astro`; the toolkit is untouched):** give lookups for
missing ids a shape the vocabulary does not use. A ring with a diagonal slash (∅,
"nothing") in the client grey reads as "an id that does not exist":

- In `render`, for `dot.data?.absent` client dots, set `d` as well as `data-paint`:
  `circle(4.5) + 'M-3.2 3.2L3.2 -3.2'` with paint `ring`. The ring rule strokes
  both parts and fills the inside with the surface colour.
- Replace the second legend glyph with the same path instead of `marker('miss', 11)`.
- Leave hits and misses as they are, so a ∅ turns into a green dot or an orange ring
  at Redis. That moment is the lesson.
- Prose and text alternative: change "drawn as hollow dots" to "drawn as crossed-out
  circles (∅)". Change "watch where the hollow dots go" to "watch what each ∅ becomes
  at Redis: a green dot answered there, or an orange ring sent on to the database".

**A related, collection-wide finding (not this article's to fix).** The pair that is
actually weaker under deuteranopia is the grey filled request dot against the green
filled hit dot. Both are filled circles. Their ΔE drops to 18 (light) and 16 (dark),
with chroma 8 against 13 and 1.10:1 lightness. In dark deuteranopia they look like
the same beige-grey dot (`interact/dark-f8-cvd-deutan.png`). Every scene figure in
the collection relies on direction of travel to separate them. Report this to the
toolkit owner. One option is a thin outline, or a darker lightness, on hit dots.

## Blocking

None.

## Minor

1. **Figure 8 encoding** (above). Fix it before publishing if you can; it takes
   about ten lines.

2. **Figure 8 at 375 px.** The compact layout leaves the Shoppers–Application edge
   about 40 px long, so dots bunch and overlap at the application
   (`final-screens/light-phone-08.png`). Fix: in the compact layout, put Shoppers
   above the application, or reduce the `spread` padding so the first edge gets
   more length.

3. **Figure 4's chart stops at 60 s while the clock runs on.** After 60 s the
   readouts keep changing, but the chart is frozen at its right edge. Fix: stop the
   simulation at 60 s (auto-pause with "Deploy finished"), or let the axis scroll.

4. **Figure 2 shows the database replying without being asked.** Step 3 draws only
   a "rows" arrow from Database to the £ request. Fix: add a "SELECT" arrow before
   it, or label the arrow "query → rows".

5. **"The id list for 'sorted by price' still changes whenever a price does"**
   (granularity section). It changes only when a price change alters the order.
   Fix: "can change whenever a price does, so it must be deleted on every price
   change unless you compare the order".

6. **Examples do not follow the article's own key advice.** `sku:XJ-0000`,
   `product:42` and `catalog:v1:` appear without the `shop:` prefix that the
   section on key parts recommends. That is fine for the earlier `product:42`
   inherited from the introduction. Fix: either use `shop:` in the examples after
   that section, or add one clause saying examples drop the prefix for brevity.

7. **Measured sizes vary by a few bytes.** On 8.10.3 I got 75 bytes (not 74) for the
   54-character key, 114,710 (not 114,712) for the 100,000 `x` string, and 121/238
   (not 115/233) for the 64/65-byte hash with my own field names. All the
   conclusions hold. Fix: optional. Round to "about 75" and "about 115,000", or
   leave as is, since the evidence file records the exact runs.

8. **Figure 3 cache keys look like URLs** (`listing?category=shoes&page=1&sort=popular`).
   The section then recommends the colon convention. Fix: show the canonical key in
   the house form (`shop:listing:v3:shoes:popular:GBP:1`). This also previews the
   function that follows.

9. **The Figure 8 text alternative says "fewer than one in a hundred"** for random
   ids with the filter, but the readout settles at 1% (616 lookups, seed 3). Fix:
   "about one in a hundred".

## Checked and correct

- **Redis 8.10.3, observed on port 7173** (temporary directory, `--save ''`, shut
  down afterwards):
  - `WRONGTYPE` on `HGET` of a string.
  - `hash-max-listpack-value 64` and `-entries 512`; the hash goes from listpack to
    hashtable at a 65-byte value, roughly doubling in size.
  - `proto-max-bulk-len` is 512 MB.
  - A four-field hash is 132 bytes with a key TTL and 172 bytes with one field TTL
    (`listpackex`).
  - `HSET` clears a field TTL; `HINCRBY` keeps it.
  - `HSETEX` with no option clears the TTL of the named field. `KEEPTTL` keeps it.
    `EX 5` sets the named field only, and the key's TTL (3600) and price's field TTL
    are untouched. `HGETEX EX` resets the TTL.
  - When the last field expires, the key goes and only `expired_subkeys` counts it,
    not `expired_keys`.
  - `GET` of a 20 MiB value takes about 1.6 µs per call in `commandstats`.
  - `--bigkeys` and `--memkeys` with `-i` find the 20 MiB string among 300 small
    keys.
  - No `BF.*` commands in the Homebrew build.
  - `HIMPORT` reports `since 8.10.0`.
  - Lazy-free settings default to `no`, so the warning about deleting big
    collections stands.
- **Documentation:**
  - redis.io keyspace page: the 1,024-byte "bad idea" and `u1000flw`.
  - HIMPORT and compact hashes (8.10): field names stored once.
  - Microsoft Cache-Aside: "might not be suitable when the data is sensitive …
    especially when multiple applications or users share the cache". The
    paraphrase is fair.
  - The Python `pickle` warnings are quoted accurately.
  - Bloom filter: 9.6 bits per id at 1%, 1.2 MB for a million ids.
- **Models match the prose:**
  - Figure 1: 83–88% at 12 a minute; 49% and 6.1 rows at 120 a minute; 98%.
  - Figure 3: 1,620 / 1,120 / 121 / 24 / 12 keys; 19 / 44 / 94 / 98.8 / 99.4%;
    1,065 wrong-currency requests.
  - Figure 4: failures to about 50 s; tolerant peak about 37/s against a baseline
    of about 7; versioned peak about 19/s; 97 stale reads ending by about 44 s;
    none when deleting both versions.
  - Figure 5: 16 KB is 5.7 µs slower at 10 Gbit/s and 75 µs faster at 1 Gbit/s;
    64 KB uses 52% of 1 Gbit/s.
  - Figure 6: 129/4, 258/4, 1,548/1,056 bytes.
  - Figure 7: 10 rebuilds a minute at 30 s, which tends to about 11.
  - Figure 8: one in six (16%) for repeated ids; 67 markers for random ids; 0% and
    1% with the filter.
- **Accessibility and themes:**
  - With reduced motion, all four simulations stay paused at 0.0 s.
  - Every figure has a text alternative.
  - No console errors, and no horizontal overflow at 375 px in either theme.
  - Controls look like controls and are labelled with what they change.
- **Round-1 required items:**
  - The `ArticleRef` import is the shared one.
  - Versioned keys now cover deleting under every live version, and rollback.
  - The `HSETEX` bullets are correct.
