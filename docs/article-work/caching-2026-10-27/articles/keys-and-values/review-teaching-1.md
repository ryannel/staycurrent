# Teaching review, round 1: Cache keys and cached values

Reviewer: independent editor, fresh to this draft. Date: 27 October 2026.

Read before reviewing: `brief.md`; the full text of Gears and Load Balancing,
with four of their demonstrations used in a browser (two Load Balancing
simulations with the speed slider moved; two Gears discs with the angular
velocity slider and a drag). Also read this article's entry and its neighbours'
in `plan.md`, the article plan, the writer report and
`evidence/keys-and-values.txt`.

Method: read the rendered article at
`http://localhost:4453/learn/databases/caching/keys-and-values/`
(`CACHING_DRAFT_PREVIEW=1`). Used every figure with Playwright: Figure 1 at 12,
120 and 0 changes a minute; all seven steps of Figure 2; all five key-building
options of Figure 3; all three deploy modes of Figure 4 to 60 s; Figure 5 at
every size on both links; both expiry modes of Figure 6; all four combinations
of Figure 7 to 300 s. Checked reduced motion: Figure 1 stays paused at 0.0 s.
Re-ran the four simulation models in Node to check the numbers quoted in the
prose against the models themselves. Screenshots in light and dark themes, at
desktop and 375 px, are in `review-screens/`, and the interaction captures are in
`review-screens/interact/`. There were no console errors and no page overflow.

Verdict: **publishable after required fixes.** There are 2 required findings
and 17 suggested ones.

The draft is accurate, carefully measured and honest about what it models. Its
best figures (3 and 4) show a result first and explain it afterwards, as the
reference essays do. One required finding is a real gap in the advice on
versioned keys. The other is a component import that breaks the collection's
rule for links between articles.

---

## Required

### R1. Links to other articles import a superseded local copy of `ArticleRef`

`src/articles/caching/keys-and-values.astro` line 3:

```astro
import ArticleRef from '../../components/caching/caching-patterns/ArticleRef.astro';
```

The brief and the commission say to refer to other articles only through
`src/components/caching/shared/ArticleRef.astro`. The file imported here
belongs to another article's folder, and its own comment says it is "now
superseded by shared/ArticleRef.astro". Today it behaves the same as the shared
component. But this article now depends on another article's private folder,
and any fix to the shared component will not reach it.

How the links behave now is correct:

- Under preview, the three articles that have source files are linked:
  `caching-patterns`, `how-redis-works` and `expiration-and-eviction`.
- `clients-and-pipelining`, `cluster-and-hot-keys`, `stampedes`,
  `operating-a-cache` and `invalidation` render as plain text.
- There are no hand-written links to other articles. The only hand-written
  `<a>` in the prose is the in-page anchor `#field-expiry` (line 48). The
  figure components contain no links.

**Fix:** change the import to `'../../components/caching/shared/ArticleRef.astro'`.
Nothing else needs to change.

### R2. Versioned keys: the article omits that invalidation must cover every live version

Lines 126 and 137, and Figure 4. The versions section presents "the two
versions never touch each other's entries" as a pure benefit. The Figure 4 model
contains no writes, so it cannot show the cost. During a rolling deploy, a
product change handled by a version 2 instance deletes `product:v2:42` and
leaves `product:v1:42` in place. Instances still running version 1 then serve
the old price until the TTL runs out. The same happens after a rollback: the v1
entries left in Redis missed every change made while v2 was running.

A practitioner who follows the article's advice ("bump the version in the key")
gets this stale-data bug. The article teaches delete-on-write from its first
figure, so it cannot leave this out.

**Fix:** add a short paragraph after line 126:

- During and after a versioned deploy, the write path must delete the key under
  every version that may still be read (in practice the current and the
  previous one).
- Alternatively, keep the TTL short enough that a rollback is harmless.

Add a sentence to Figure 4's caption saying the model has no writes, so it does
not show this. Then link to
`<ArticleRef slug="invalidation">` for the general problem. Optionally, add a
product change during the deploy to Figure 4's versioned mode, so the stale v1
read is visible.

---

## Suggested

### Teaching

**S1. Figure 2 never shows the key, which is the point of the figure** (lines
54 and 2). The arrows read only `GET`, `SET … EX 60`, `GET`. The reason the
euro shopper's request hits (the same key, because the currency is missing) is
only in the explanation box. A reader skimming the diagram sees a miss, a store,
a hit and "wrong currency", but not the cause.

**Fix:** label the arrows with the key, for example
`GET listing:shoes:popular`. Or add a "key" annotation on the € lane at step 4
showing the key it built, with "(no currency)".

**S2. Figure 1: "Now drag it to zero: both caches hit every time" (line 36) is
not what the reader sees at first.** The readouts cover the last 300 views, and
deleted pages refill only when they are next viewed. Running the model, after
moving from 120 to 0 the page hit ratio reads 51% after 5 s, 81% after 40 s and
100% only after about 80 s.

**Fix:** say "drag it to zero and press Reset", or "drag it to zero and watch for
a minute while the emptied pages refill".

**S3. Figure 1's legend does not match what is drawn.** "Cached entry" is shown
as a red dot, but entries are pink squares. The dashed "deleted, waiting for a
view" state, which carries most of the lesson at 120 a minute, is explained only
in the caption.

**Fix:** show legend items as cell swatches, and add "Deleted, waiting for the
next view" with a dashed swatch.

**S4. Figure 4's coloured rings around the instances have no legend.** Green,
orange and magenta rings flash for hit, miss and failure. The chart carries the
result, but the instance row is unexplained motion.

**Fix:** add a legend with hit, miss and failed request.

**S5. Figure 7: lookups for missing ids look the same as lookups for products
that exist.** Every request dot uses the client colour. In the default "cache
nothing" mode the reader cannot see which dots are the problem.

**Fix:** give missing-id requests a distinct mark, for example a hollow dot or a
"?" glyph, and say so in the prose: "the hollow dots are lookups for ids that do
not exist".

**S6. Figure 5 shows four bars, and one of them repeats two others.**
"Compressed: total" is the sum of the two bars above it and uses the same red
as "Compressed: transfer".

**Fix:** use two stacked bars, uncompressed transfer against compressed
transfer plus decompression. Then the comparison is one glance, and the
decompression segment visibly outgrows the transfer saving at 10 Gbit/s.

**S7. Long stretches with no figure.** After Figure 5 the reader goes through
"Strings or hashes" with only a table (about 650 words), then a figure, then
"Keeping values small" with none (about 450 words). The brief expects "a figure
every few hundred words in the explanatory parts". The hash section has an
observed result that would make a good small figure: the listpack-to-hashtable
jump at a 65-byte field (115 → 233 bytes). The partial read (`HMGET`) against
read-the-whole-string is another.

**Fix:** consider one small stepped or toggle figure in "Strings or hashes".
"Keeping values small" can stay prose if it is trimmed (S9).

**S8. A key form appears before it is explained** (line 62). The `redis-cli`
example introduces `listing:v1:shoes:popular:EUR` with a `v1` that is not
explained until the next section. Its form also differs from the
`shop:listing:v3:…` key built a few paragraphs later.

**Fix:** use `listing:shoes:popular:EUR` here, or use the final form from the
start.

### Depth and scope

**S9. Some paragraphs teach subjects that article 7 owns.**

- "Keeping values small" (line 271) gives the measured `DEL` of a hash with a
  million fields, a second client's `PING` waiting 80 ms, `UNLINK` at 0.4 ms, and
  the lazy-free defaults for expiry and eviction.
- Line 126 teaches `KEYS` against `SCAN`.
- The plan gives article 3 only "the decision consequence (deleting a big key can
  block)". The 27 October map changes give compact hashes in 8.10 to article 7.
  Line 186 explains `HIMPORT PREPARE` and automatic conversion.

**Fix:**

- Keep one sentence each for blocking deletes and `KEYS`, with the link.
- Keep the compact-hash row in the table only if it is reduced to one sentence
  and a link. Otherwise move it to article 7.

This also shortens the article, which at about 5,800 words of prose is long for
a subject that is partly a catalogue of decisions.

**S10. The compression advice omits shared dictionaries.** Small values (1–4
KB, the common case) compress poorly one at a time, as Figure 5's 51% at 1 KB
shows. zstd's trained dictionaries are the standard way practitioners get good
ratios on small, similar JSON values.

**Fix:** add one sentence to the bullet list after Figure 5. The one-byte marker
bullet already gives a way to roll it out.

**S11. Multi-tenant prefixes are not named in the list of usual missing inputs**
(lines 67–74). A tenant or organisation id is the most common case where a
missing input becomes a cross-customer data leak in SaaS applications. "The
user's identity" does not cover it.

**Fix:** add "the tenant or organisation" to the list.

### Writing

**S12. An aphorism closes the derivation** (line 42): "Merging things into one
entry multiplies what can change it and divides who can reuse it." The
derivation just before it already says this with numbers.

**Fix:** cut the sentence, or replace it with "So the product entry is read 72
times as often per change as the page entry."

**S13. A stock phrase appears twice:** "Each section earns its place:"
(line 103) and "A hash earns its place when…" (line 199).

**Fix:** "Each part of the key has a job:" and "A hash is the better choice
when…".

**S14. The opening line about wrong answers is inaccurate** (line 14): "A cache
with a bad key still returns fast hits; they are just someone else's answer."
In the article's own example the answer is the same page in the wrong currency,
not someone else's.

**Fix:** "A cache with a bad key still returns fast hits; some of them are wrong."

**S15. A long sentence with a parenthesis nested inside a parenthesis** (line
44): "The work left to the application is the price: twelve lookups instead of
one (sent as a single `MGET` command, so one network round trip; Redis clients
covers what round trips cost), plus sorting, currency conversion and rendering,
which this model does not charge for."

**Fix:** split it into two sentences and move the link to a sentence of its own.

**S16. Two overloaded paragraphs.**

- Line 112 (about 230 words) covers separators in user input, key bytes,
  measured `MEMORY USAGE`, the 1,024-byte advice, hashing with a readable
  prefix, and cryptic short keys.
- Line 126 covers versioned keys, the lingering-key measurement, why every entry
  needs a TTL, `SCAN`/`UNLINK`, `KEYS`, and a forward link.

**Fix:** split each into two or three paragraphs, one idea each. For line 126 this
fits with R2 and S9.

**S17. The opening promise is one long sentence listing eight abilities** (line
16).

**Fix:** keep it to the three questions the previous paragraph raised, for
example "By the end you will be able to decide what one entry holds, what its key
must say, and how to store its value safely and compactly." Leave the full list
to "What you can now decide".

---

## Checks that passed

- **Numbers in the prose match the models.** Checked in Node and in the browser:
  - Figure 1: 85% and 99.8% at 12 a minute; 48% and 97% at 120, against the
    article's derived expectation of 47% and 97%.
  - Figure 3: 1,620 keys / 19%, 1,120 / 44%, 121 / 94%, 24 / 98.8%, and
    12 / 99.4% with 1,065 wrong.
  - Figure 4: strict peak 46 failures a second, last failure at 51.5 s; tolerant
    peak 36.5 reads a second; versioned peak 17.5.
  - Figure 5: +75 µs and −5.7 µs at 16 KB; 52% → 15% of the link at 64 KB.
  - Figure 6: about 10–11 rebuilds a minute and 400–450 ms against 10–11 ms.
  - Figure 7: 16% repeated with caching on, 100% random, 67 markers.
- **Primary sources.** Checked against the source pages:
  - Microsoft's Cache-Aside page lists "The data is sensitive or security related"
    under "might not be suitable".
  - Redis's `HSETEX` page says "any previous TTLs associated with the key are
    discarded". The article's observation that the key TTL survived matches the
    evidence file.
  - The lazy-free defaults (`no`) and `hash-max-listpack-*` (64 and 512) match
    the evidence file.
- **Figures as artefacts.**
  - Both themes are legible, and no figure overflows at 375 px.
  - Every figure has a number, a title, a caption that separates measured from
    modelled values, and a text alternative that states the result.
  - Reduced motion holds Figure 1 at 0.0 s.
  - On a phone the segmented controls in Figures 3 and 4 wrap unevenly, leaving
    a gap beside "Drop tracking parameters". This is cosmetic and comes from the
    shared `Choice` component.
- **Structure.** The lede is informational. Sections build in order. The closing
  "What you can now decide" links forward to article 4. Sources is the final
  `<h2>`.

## Beside Gears and Load Balancing

It mostly sits comfortably beside them. Figures 3 and 4 follow the references'
habit of showing a result and then explaining it: the hit ratio rises when the
currency is dropped, and failures outlast the deploy by a full TTL. Figure 1's
two grids make the granularity derivation visible before it is stated. The voice
is plain and first-person, and honest about measurement.

The single biggest gap is the second half. After Figure 5 the article changes
from a sequence of demonstrations into a well-sourced reference guide: long
paragraphs, a table, command transcripts, and two sections without a figure.
The references keep the reader's hands on a demonstration every few hundred
words to the end. Trimming the article-7 material (S9), splitting the dense
paragraphs (S16) and adding one small figure for strings and hashes (S7) would
close most of that gap.
