# Writer report: article 12, Designing a cache: a worked example

Draft: `src/articles/caching/designing-a-cache.astro` (status in the registry left as `planned`; not committed).
Components: `src/components/caching/designing-a-cache/` (BudgetFigure, PlaygroundFigure, budget-model.mjs, playground-model.mjs, models.test.mjs, designing.css).

## Word count

About 6,400 words of prose, figures excluded (6,600 with the sources list). Seventeen sections: the requirements, the budget, what to cache, pattern and keys, TTL, freshness, stampedes, memory and eviction, clients, servers, failure, watching and access, the design on one page, what would change, a seventeen-question review checklist, sources. 34 ArticleRef links, all checked against rendered ids on the preview server.

## Figures

1. **One database, four decisions** (BudgetFigure). Uses no clock. A stacked bar of database queries a second (product misses, stock misses, checkout) against the alert line at 210 and capacity at 300. Controls: freshness by expiry or delete-on-change, product TTL, memory, and where checkout reads the price. Readouts: load, product hit ratio, page price lag, checkout price age, memory. The text alternative includes a build-time table of six configurations. It carries the central finding: no TTL that meets the one-minute price target gives enough hits on a long-tail catalogue (1 minute caps at 42%), so freshness has to come from deletes and the TTL becomes a 24-hour backstop.
2. **The design under failure** (PlaygroundFigure). A live model of 20,000 products, with switches for traffic, topology (replica or single), database limit (none, shared, checkout-first) and rollout (all at once or ramp), plus buttons to lose the primary, deploy a new key version, or skip ahead. Two charts show database demand against capacity and failed pages and checkouts. Each switch maps to the incident it exists for.

Every control was exercised with Playwright (`scratchpad/pw/d12-use.cjs`). Readouts matched the prose and the node models. Screenshots for light, dark, desktop and 375 px are in `screens/`. Nothing overflows and no console errors appeared. During the first run one scenario's clock reset, probably a hot reload. I repeated it and it matched.

Corrections the browser check forced:
- The ramp at peak is not failure-free: with checkout first, under 2% of pages fail for a second or two. The prose and text alternative now say so.
- Switching the limit back on while the shop is stuck does not recover at once. Recovery waits for the accepted backlog to drain. The prose now says so.

## Evidence gathered

`evidence/designing-a-cache.txt` (Redis 8.10.3, port 7112, since stopped with its data deleted):

- **E1, bytes per entry.** Product 2,131 B, stock 98 B, trending 2,603 B.
- **E2, LRU and LFU hit ratios.** Paced Zipf 0.9 at 5,000 reads/s:
  - LRU 76.9% against a Che prediction of 77.3%.
  - LFU 79.7%. The prose explains why the shop still chooses LRU.
- **E3, the design's command sequence end to end.**
  - MGET, then leases with SET NX PX and SET IFEQ; a relay DEL refuses a stale fill.
  - The trending lock with DELEX IFEQ.
  - ACL users: NOPERM refusals for FLUSHALL, KEYS, CONFIG SET and out-of-prefix keys, and the relay user's limits.
- **Model tests.** 6 out of 6 pass.

The scenario runs are recorded in the evidence file. The article labels E1 to E3 as measured; everything else is labelled a model or illustrative.

## Claims I could not verify

- **The shop's numbers.** Traffic, the exponent of 0.9, capacity of 300 and 5 ms rebuilds are illustrative. 0.9 is steeper than Breslau's 0.64 to 0.83; the article says so and tests 0.8.
- **Che's paper.** Cited from the dossier; I did not re-read the PDF.
- **LFU with a raised `lfu-decay-time` on real-paced traffic.** Not tested; the article frames it as an experiment.
- **"A single server's capacity of well over a hundred thousand commands a second."** An order of magnitude, not measured here.
- **The multi-region note.** Taken from the memcache paper's section 5 text, not tested.

## Coverage-map gaps or overlaps

- **Listing-page cache design.** No article owns it. It is named here as the next exercise.
- **Outbox relay lag as an alert.** New in this article. Article 11 could mention it.
- **Pacing bulk repricing deletes.** New and brief.
- **TTL jitter.** Handled in prose only; the playground has no expiry.
- **Multi-region invalidation.** Noted here, as plan.md allowed.

## Toolkit gaps

- **No stacked bar with reference rules.** Figure 1 draws a local SVG with `svgEl`.
- **Charts have no way to mark a second series as dashed with the same kind.** It works because the toolkit dashes the second series automatically; worth documenting.

## Against the reference essays' openings

Both reference essays put a concrete question in front of the reader and then a working demonstration within a few hundred words. This opening uses three paragraphs to frame the design, and the first figure arrives after about 1,800 words: the requirements table, the budget arithmetic, and the what-to-cache decisions all come first. For a capstone, the budget has to exist before Figure 1 means anything, so I kept the order. The weakness remains: a reader who wants to play first waits longer here than in either essay. I moved the concrete TTL surprise, that a one-minute TTL caps the hit ratio at 42% whatever the memory, into the third opening paragraph as the hook. A reviewer may still want the opening shorter.
