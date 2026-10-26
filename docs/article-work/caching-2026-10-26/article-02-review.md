# Article 2 — Cache keys and cached values

Completed 26 October 2026. Sole-agent writing and review; no independent review claimed.

## Technical evidence

Primary documentation checked: Redis keyspace and strings; HSET, HGET, HMGET,
TYPE, SET and EXPIRE; OWASP authorisation guidance. Links are in the article.
The native worksheet ran successfully against official Redis 8.2.2 in its own
network-isolated disposable container. Its assertions verify tenant-separated
string values, selected hash reads, preservation of omitted fields, empty versus
missing hash fields, HSET preserving key expiry, and an explicit negative result
being a present Redis key. Output: evidence/keys-and-values.txt.

Five pure-model tests cover unsafe/safe/overspecific keys, unambiguous tuple
encoding, response versus record dependencies, negative-result expiry and
invalidation, and failure remaining distinct from an authoritative absence.
These models are illustrative, serial, fixed-price scenarios, not measured Redis
execution or guarantees of concurrent source consistency.

## Teaching judgement

The opening gives the reader an observable wrong answer before naming tenant
isolation or equivalence. Six stable requests can be regrouped by one dimension
at a time. An apparently excellent hit rate becomes evidence of incorrect reuse;
adding an irrelevant dimension then removes useful reuse. This follows the
reference articles' concrete experiment, complication, explanation progression.

The dependency illustration changes the cache boundary while keeping the same
source change. The reader sees both stale output and source work, rather than
being told that one granularity is best. The negative-cache experiment makes
three states observable and lets creation precede expiry or invalidation. Prose
connects those experiments to permissions, query dependencies, representation
versions and write semantics. Redis command detail is anchored in a retained
field that can cause a real application bug.

The article has three main interactive arguments and a short runnable command
worksheet, about ten minutes of prose. It does not try to teach invalidation
races, capacity policy or transactions prematurely. Limitations are explicit
beside the relevant figures. Encoding and hash semantics are also demonstrated
with short concrete examples. Titles use established industry vocabulary.

## Rendered and functional verification

- Wrong key: five hits, four wrong answers, one entry.
- Shop/language/currency: two hits, zero wrong answers, four entries.
- Viewer added: zero hits, zero wrong answers, six entries.
- Changing key choices resets state; step, all and reset controls function.
- Whole-response cache retains old price/category after source change. Product
  record cache reads two current source records and returns the changed value.
- Negative lookup twice makes only one source read. Creating the product leaves
  the cached absence visible. Advancing twice expires it; keyboard Enter on Read
  discovers and caches the product. Invalidate removes the entry only.
- Desktop dark and 390×844 light views inspected. Figure controls wrap, two-column
  key groups fit, source cards remain readable, and negative source/copy states
  remain side by side. Document width equals viewport width, 390 px.
- Moved key controls above groups so changing the group count does not move the
  controls. Added explicit accessible names to the dependency selectors. Fixed
  outline-only icon paths being filled by shared CSS. No browser console errors.
- Native HTML controls support keyboard, focus outlines, and live explanations.
  TTL bar transitions respect reduced motion. All time advances are explicit.

Final verification: pnpm build passed all 13 site-check rules; all eight collection
model tests passed; git diff --check passed. Publishing
flag exposes the completed article through the shared collection integration;
remaining planned articles remain unavailable.
