# First three relational deep dives: review disposition

Completed 14 October 2026. All three articles are **ready as drafts**. The user
explicitly authorised committing and pushing the completed stages to main.
The website continues to label the articles as working drafts.

## Scope and independent readings

Designing your data combines modelling, identities, dependencies, normalisation,
history, types, constraints and representation choices. Querying your data follows
result semantics into execution work and an observed plan. Transactions and
concurrency connects atomic changes, overlapping requests, snapshots, wider rules,
retries, unknown commit outcomes and external effects.

Independent technical and editorial reviews are preserved beside this record.
The same fresh reader read the three articles in order; their notes live in each
article work folder. That reader received the articles without author briefs or
expected answers. No material review finding remains unresolved.

The fresh reading identified two design-example gaps: the typed-details query
needed its first explanation of aliases, JOIN and WHERE, and the receipt result
needed an explicit fresh seed state after an earlier insert example. Both are
repaired. The technical reviewer confirmed the latter resolution. Editorial
refinements added missing design contents links, removed a meta-editorial sentence,
simplified the payment diagram heading and avoided defining row locks twice.

## Executable evidence

Author verification scripts and independent SQL checks passed with PGlite,
PostgreSQL 18.3. These cover the schema, rejected and accepted records, returned
query rows, aggregate fan-out, the observed execution plan and transaction examples.
The technical review records the detailed checks. Concurrent sessions were not
executed: concurrency claims were checked against PostgreSQL documentation, and
browser schedules are explicitly labelled teaching models.

The browser interaction runner passed 192 design-rule combinations, 18 query
settings, 24 recovery states, both current/historical-fact layouts and 36 concurrent
schedule states. It checks displayed results, backward navigation, resets and
keyboard controls. No uncaught JavaScript errors occurred.

## Rendered reading and navigation

Built pages were checked at 390px and 1280px in light and dark themes. Screenshots
and the layout report are retained here. Visual inspection covered the nested
reading map, each new lab and the query-plan trace. Controls and results are
legible, mobile columns stack, and no page has horizontal overflow. Wide SQL and
tables use their own scroll regions. The new labs retain static explanations when
JavaScript is disabled; inactive controls are hidden. A final fallback check caught
and repaired initially visible inert controls in the query and recovery labs.
The full interaction runner passed again after this repair.

The final build produced 55 pages. The internal-link audit checked 1,131 links,
including fragments, with no failures after correcting a stale schema-design link.
Combined planned topics redirect to their new homes. The former concurrent-updates
article redirects to the concurrent-work section in Transactions and concurrency.
The normalisation URL remains preserved. Child articles and practice instructions
use the revised main-article names.

## Running these checks again

`pnpm build` is the project check. `python3 docs/article-work/deep-dives-batch/link-audit.py` checks built internal links.
The browser scripts use the local preview on port 4322, temporary Playwright at
`/private/tmp/staycurrent-browser`, and the cached Chromium path recorded in their
launch configuration. SQL scripts use temporary PGlite under
`/private/tmp/staycurrent-design-sql`. These are verification dependencies, not
site runtime dependencies. Adjust those paths when running on another computer.
