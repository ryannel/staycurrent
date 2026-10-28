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

The command lab has executed six scenarios on an owned Redis 8.10.3 instance
with Python 3.14.5. Its source is an explicitly labelled Python model. See
[native execution evidence](evidence/native-redis.md). The application client
environment pins `redis==8.1.0`; its forthcoming evidence is separate.

The draft infrastructure passed a build/site check before articles were added.
The built command-lab download matched its executed source by SHA-256. Article
linting, controls, rendering and completed-route checks will be recorded against
the delivered sources as they become available.
