# Article 1 — Application caching with Redis

Completed 26 October 2026. Sole-agent writing and review, as requested by the
single-agent experiment. No claim of an independent editorial review.

## Technical evidence

Read Redis GET, SET, DEL, TTL and EXPIRE primary documentation, plus the Redis
data-store quick start and AWS Caching patterns whitepaper page. Exact links are
in the article. All checked 26 October 2026. The initially attempted AWS
lazy-loading.html route was unavailable; replaced with verified caching-patterns.html.

Ran the downloadable first-cache.sh worksheet against official redis:8.2.2.
Observed absent GET, successful SET with expiry, retrieval of JSON bytes, TTL 60,
DEL 1, absent GET after deletion, and TTL -2 after one-second expiry. Output:
`evidence/first-cache.txt`. Network-isolated temporary container, no host port or
persistent data. No performance measurement or hosted Redis execution claimed.

The numerical models are explicitly illustrative, serial, fixed-latency models.
Tests cover cold/warm transition sequences, source not read on hits, stale copies,
empty-string hits, unique/repeated request counts, miss penalty, break-even and
the nearest-rank p99 boundary (98% vs 99% hits). Three tests passed.

## Teaching and writing judgement

Against Gears: familiar product-page work precedes cache terminology; each new
quantity is visible before its equation. One state is added at a time. Against
Load Balancing: the same request is replayed under a changed condition, costs and
percentiles are separated, and a favourable average is challenged with a cheap
source and with misses. Source-of-truth behaviour is manipulated directly.

Four distinct illustrations carry the article's central argument: avoid repeated
work; reuse depends on workload; misses have a cost and can dominate the tail;
a copy can disagree with its source. Prose connects their consequences to the
engineering decision rather than listing Redis features. About ten minutes of
reading before time spent on experiments. The article intentionally does not
pretend its successful-path pseudocode is production-ready. It motivates the
later concurrency, failure, key design and freshness articles without requiring
those concepts to follow the present argument.

## Browser verification and repairs

Used the in-app browser on localhost:4341. Verified:
- Cold path: seven states ending with saved copy; repeat gives four states and no
  source read. Back, empty-cache, next, repeat, play and pause controls work.
- Four products / 20 requests: 16 hits, four reads, 80%. Keyboard End on product
  slider: 20 unique products, zero hits and 20 reads.
- Hit-rate slider keyboard: 99% yields 2 ms p99; cheap 2 ms source exposes no
  latency benefit even at 100% hits. Changed mean display to two decimal places
  so 2.04 ms is not shown as 2.0 ms alongside a claim it is slower than 2 ms.
- Change source to £15 then read: £12 hit remains. Delete copy then read: £15 miss
  fills the cache. Reset restores both to £12.
- Light and dark themes, desktop and 390×844 phone view. Reworked request graph
  into a vertical arrangement because its initial horizontal layout had tiny
  phone labels. Moved chart annotations out of the SVG into readable HTML.
- Phone document width equals viewport width (390); all four figures fit their
  358 px content width without overflow. Controls wrap; source/copy states remain
  side by side. Captures were inspected in the browser tool outputs.
- Keyboard range controls work; buttons have visible focus, at least 44 px height,
  and live state explanations. Animation is explicit play, stops when document
  becomes hidden, and respects reduced-motion for travelling packets.
- Sources start collapsed; article contents follow the introduction. Shared
  title/disclosure and breadcrumb components are used.

`pnpm build`: successful; all 13 site-check rules passed. `git diff --check` passed.
Reading directory, homepage, database field guide, search entry and collection
order now include only the completed article. Future collection entries are
labelled in preparation and have no public article routes.

Publication commit and deployment confirmation are recorded in publication.md.
