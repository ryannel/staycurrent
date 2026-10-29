# Relational collection: visual teaching-economy review

29 October 2026. Review complete; substantive repairs remain open. This is a
rendered visual review, not a new technical sign-off or a relational redesign.

The application caching collection was separately published at
[Application caching](https://staycurrent.dev/learn/databases/application-caching/).
Publication commits `cfa42bbb` and `8711930c` deployed successfully. The latter's
[Publish run](https://github.com/ryannel/staycurrent/actions/runs/40903660395)
completed successfully; the live introduction was inspected. See its
[publication record](../application-caching-2026-10-28/publication.md) for checks.

## Outcome

Independent readers inspected all **59 relational articles and 278 numbered
figures** in rendered article context. The four reports contain **17 grouped
Medium findings**, plus optional Low refinements. No Critical finding was
established within this visual perspective. The collection does not yet meet the
new standard consistently; this review does not label it clean.

The main problems are steps that reveal only another sentence, figures that name
a mechanism without showing it, and final states that erase the history or object
identity needed to understand the outcome. Successful matrices, timelines, page
layouts, boundaries and meaningful controls should remain. The caching work is a
standard for useful understanding and reader effort, not a template requiring
every subject to become a traffic animation.

## Repair priorities

Start with missing causes and identities. These require a better drawing, rather
than more explanation:

- PostgreSQL upgrades, Figure 2: show two directory references to one shared file
  versus two independent files. Equal product values cannot explain the difference.
- CockroachDB architecture, Figures 2 and 4: connect secondary entries to their
  primary rows; distinguish the two-log explanation from a concrete local
  flush/compaction sequence.
- CockroachDB query performance, Figure 5: make the holder's occupied span and
  the waiter's blocked span visible, or use an ordinary short explanation.
- CockroachDB migration, Figure 3: keep the stale original distinct from the
  fresh return candidate. A reused box currently conceals the third object.
- Query execution, Figure 2: show the distinguishing nested-loop, hash and merge
  operation if those mechanisms are the lesson.

Next, reduce interaction where the answer is a comparison:

- Constraints, Figures 1 and 3: place candidates and rule outcomes together.
  Retain CHECK's acceptance of unknown and NOT NULL's separate rejection.
- Aggregates and windows, Figure 3; PostgreSQL architecture, Figure 5; PostgreSQL
  query execution, Figure 1: remove tours of already-visible information, or make
  the changing work visible where it matters.
- PostgreSQL JSON, Figures 2 and 4; PostgreSQL access control, Figure 2;
  CockroachDB operations, Figure 2: keep useful input selectors and show their
  results directly; compact the query/operator/index mapping.

Then preserve the comparison across time and remove repeated setup:

- Transaction boundaries, Figures 2 and 3: retain earlier reads and the commit or
  waiting history at completion.
- Updates and imports, Figure 2: show before / once / twice together.
- Replicas, Figure 3: make the reader's change of replica visible.
- Data modelling, Figures 5 and 6: evolve one decomposition rather than rebuilding
  the same destination. Figures 3 and 11 need visible relationship edges.

These bullets organise the 17 report findings; some findings cover multiple
related figures. They are not 17 entire articles requiring replacement. Optional
polish stays Low, including the application-SQL joined-transport excerpt: its
current query-count lesson already succeeds.

## Coverage and evidence

| Independent report | Articles | Numbered figures | Medium findings |
| --- | ---: | ---: | ---: |
| [Foundations and execution](foundations.md) | 20 | 111 | 7 |
| [PostgreSQL and recovery](postgresql-recovery.md) | 20 | 89 | 5 |
| [Distributed systems and CockroachDB foundations](distributed-operations.md) | 14 | 63 | 3 |
| [CockroachDB operations](cockroachdb-operations.md) | 5 | 15 | 2 |
| Total | 59 | 278 | 17 |

The assignment keys were checked against `collection.json`: all 59 are covered
exactly once. Each report records article-level coverage, retained forms, concrete
observations and repair directions. Reviewers calibrated against the preserved
Storage and durability reference, read surrounding explanations, inspected
initial/completed states and exercised representative alternatives. The
coordinator also confirmed the constraints comparison and PostgreSQL Copy/Link
finding in the rendered browser, and narrowed the application-SQL suggestion to
optional polish.

This pass used desktop dark renderings and manual stepping. It does not certify
every branch, mobile/light layouts, keyboard access, contrast, or smooth autoplay
pacing; hidden-browser timing was unreliable. It also does not rerun the native
database experiments or re-audit every technical claim. Caching's separate mobile
and light checks must not be mistaken for relational coverage.

The relational visual sources were unchanged between baseline `604e8c87` and
`8711930c`. A pre-existing, uncommitted data-modelling prose edit around totals was
present in the review context; it changes no figures and is not part of this
delivery. Other unrelated working-tree files are also excluded.

## Follow-through

No relational article or component was changed by this review. Address accepted
findings locally, preserve the successful neighbouring forms and run the
continuity pass. Confirm repaired initial, intermediate and completed states in
context, including affected alternatives and responsive layouts. Retain this
unaffected coverage rather than repeating a collection-wide review after each
local repair.
