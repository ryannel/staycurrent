# Article 2: Which answer belongs under this key?

Self-review, 26 October 2026. Single-agent work, not independent review.

## Teaching judgement

The article starts with two different questions producing one key. Its first
illustration groups a small fixed request set by the selected dimensions. This
makes a concrete counterexample to optimising hit rate alone: seven hits and six
wrong answers become four hits and no wrong answers. The fields in the prose
retain the same shop/currency/price-group meanings as the visual.

The second illustration exposes the meaning imposed by a decoder; toggling key
versions changes incompatible reads into misses. The third separates a coherent
price pair into two visible writes, then joins the write boundary again. The
fourth distinguishes absence of a Redis entry from a cached source absence and
from an unresolved source error. These are four different mechanisms with
different appropriate controls. Following the Gears benchmark, each is introduced
as a concrete problem before terminology and then interpreted in connected prose.

There is deliberately no claim that grouping fields solves source consistency,
that key naming enforces access control, or that a schema version establishes data
freshness. The prose explicitly explains those boundaries. Application key
canonicalisation, expiry policy and envelopes are distinguished from Redis's own
behaviour. The worked native exercise reproduces the mixed-field observation.

## Verification

- Primary Redis keys/keyspace, strings, HSET, HMGET, EXPIRE and SET sources read.
  Native checks use Redis 8.2.2, as recorded in `keys-native.txt`.
- Five model tests pass: omitted-input collisions, atomic versus split field
  updates, format incompatibility, negative versus failed source reads, and
  structured key encoding with delimiter-containing inputs.
- Native checks pass: multi-field HSET, its new-field count, intermediate mixed
  pair, HMGET results, wrong-type GET, preserved hash expiry, retained obsolete
  fields, discarded TTL on ordinary SET, and expiring negative values.
- Browser inspected in desktop dark and mobile light at 390 and 320 px. Page
  width equals viewport width at both narrow sizes; long code blocks scroll within
  their own containers. No console errors in the inspected run.
- Interactions checked: all identity dimensions, split/combined field updates,
  key-version boundary, confirmed-negative caching versus source timeout,
  keyboard slider changes and the write player. Screenshots retained.
- A single grouping bucket was widened to use available space after visual review.
- Draft and final published builds passed all thirteen site rules. The final
  build has 132 pages. Both published caching pages are indexable, have four
  figures each and have reciprocal collection navigation. The full nine-test
  caching model suite passes.

This article's boundary is the identity and representation of a cache entry. The
following article owns freshness, source versions and concurrent fills.
