# Application caching collection

The [commission](commission.md) authorises writing and review, with Redis as one
worked implementation among several. Publication awaits a separate decision.

- [Canonical article tree](../../coverage/application-caching-2026-10-28.yaml)
- [Shared example](../../coverage/application-caching-2026-10-28-example.md)
- Individual article plans: `planning/`
- Independent reviews and scoped confirmations: `reviews/`
- Native execution and rendered evidence: `evidence/`
- Exact reader practice files: `practice/`
- Article sources: `src/articles/application-caching/`

## Preview

Build the draft routes, then serve the result:

```sh
APPLICATION_CACHING_DRAFT_PREVIEW=1 pnpm build
pnpm preview --host 127.0.0.1 --port 4327
```

The entrance is `http://127.0.0.1:4327/review/application-caching/`. The draft
download routes serve the files in `practice/` verbatim. For live article editing,
use the same flag with `pnpm dev`. Normal builds exclude this collection.

## Work and verification

The nine article plans have separate planners and one whole-tree review. The
foundation path has eight articles; versioned fills is optional depth under
freshness. New articles use fresh writers. First technical, reader and rendered
reviews are independent of the writers; repairs retain unaffected judgements.

All nine articles are reviewed drafts, with 37 figures. The eight-article main
path covers cache benefits and placement, keys, freshness, misses, memory,
Redis integration and operation. Versioned fills is optional depth under
freshness. Redis is one worked implementation of the general subject.

- [Reader and assembled-collection review](reviews/reader.md)
- [Technical review](reviews/technical.md)
- [Rendered review](reviews/visual.md)
- [Accepted repairs and delivery checks](reviews/coordination.md)
- [Figure captures](screens/) and [mechanical evidence](evidence/)

The command lab executed six scenarios on an owned Redis 8.10.3 instance with
Python 3.14.5. The async adapter uses redis-py 8.1.0 and passed 17 scenarios in
both the baseline and a changed-price variation. A separate conditional-fill lab
executes competing publication orders and counterexamples. See
[command evidence](evidence/native-redis.md), [adapter evidence](evidence/adapter.md)
and [conditional-fill evidence](evidence/versioned.md). All seven reader downloads
were compared byte for byte with their sources.

The completed preview passes all 14 site rules, including dense-prose. Its 37
figures were checked at 375 px and desktop, in both themes; controls, keyboard
use and playback have recorded checks. The site's 24 checker tests also pass.
Normal builds exclude these draft routes. Final source hashes and build evidence
are retained in `evidence/delivery.json`.

The browser illustrations use labelled teaching models. The native experiments
use real Redis and an in-process source model; they do not measure production
capacity, a real source database, replication failover or a managed deployment.
Those limits remain beside the relevant claims and in the reviews.
