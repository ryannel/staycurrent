# Performance evidence

Checked 15 October 2026. PostgreSQL-specific claims use version 18 documentation.
The linked current documentation resolved to PostgreSQL 18 when researched; article
links pin that version. SQL ran on PGlite 0.5.8, reporting PostgreSQL 18.3.

## Sources and consequential claims

- [Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html): estimated
  versus actual rows, per-loop values, cost units, buffer counters and execution by
  EXPLAIN ANALYZE. For engineers learning plan interpretation after basic SQL.
- [Activity statistics](https://www.postgresql.org/docs/18/monitoring-stats.html):
  active versus waiting, current/last query timestamps, transaction age, visibility
  of other users' activity and wait categories. The article's monitoring query ran
  for syntax in PGlite; no server blocker observation is claimed.
- [Explicit locking](https://www.postgresql.org/docs/18/explicit-locking.html):
  transaction locks and conflicting updates. The checkout wait is an illustrative
  server scenario, not a browser experiment.
- [Planner statistics](https://www.postgresql.org/docs/18/planner-stats.html):
  sampled distributions and multivariate statistics. The stale-estimate sequence
  is also directly observed; exact stale estimates are deliberately not promised.
- [Routine vacuuming](https://www.postgresql.org/docs/18/routine-vacuuming.html):
  reusable space, visibility map, planner statistics, retained row versions and
  ordinary VACUUM versus VACUUM FULL. The main article routes implementation depth
  to the PostgreSQL row-versions article.
- [pg_stat_statements](https://www.postgresql.org/docs/18/pgstatstatements.html):
  configuration requirements and cumulative call/execution counters. These do not
  include an application's pre-query pool wait or form an endpoint trace.
- [node-postgres pooling](https://node-postgres.com/features/pooling) and
  [transactions](https://node-postgres.com/features/transactions): bounded pooling,
  required release, and using the same checked-out client throughout a transaction.
  No particular ORM's query-generation strategy is asserted; the article asks the
  reader to inspect the strategy their application actually sends.
- [Transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html):
  per-statement snapshots for ordinary Read Committed reads, and stable snapshots
  for ordinary Repeatable Read queries. The application article bounds its claims
  to the read-only response under discussion.
- [Materialized views](https://www.postgresql.org/docs/18/rules-materializedviews.html)
  and [refresh](https://www.postgresql.org/docs/18/sql-refreshmaterializedview.html):
  stored contents, explicit replacement on refresh, concurrent refresh prerequisites
  and serialization per view. A qualifying unique-index concurrent refresh also
  executes in the verification; this does not reproduce concurrent readers.
- [Memory settings](https://www.postgresql.org/docs/18/runtime-config-resource.html):
  work_mem is available per sort/hash operation and can multiply across operations
  and sessions. The article avoids recommending a global tuning number.

Sam Who's [Load Balancing](https://samwho.dev/load-balancing/) was read alongside
the house writing history for staying with the work and observations in an example.
It supplies prose context, not technical database evidence or borrowed text.

## Observations and boundaries

Run `node docs/article-work/performance-completion/verify.mjs` from the repository.
It executes all 15 lesson steps, checks semantic results, executes each article's
SQL against the corresponding setup, exercises variations, and reruns each setup
after completion. `observed.json` records results and JSON plans.

- The initial queue scan emits 10 rows and rejects 9,990. Changing the queue gives
  5,000 matches while the stale estimate remains much lower. ANALYZE restores an
  estimate of 5,000. After restoring selectivity and adding a state index, the
  observed path uses an index; the lessons allow implementation-dependent plan
  choices and do not treat timing as a server benchmark.
- The batched line read returns three rows. Joining two independent child
  collections produces six rows overall, four for Ada. Preaggregating gives
  ordered/paid totals 25/25, 8/8 and 0/0. A third payment changes Ada to 25/27 while
  increasing her raw joined rows to six.
- The report stores 50/8, then a correction yields 55 live against 50 stored for
  the first day. Refresh yields 55/8. Changing the same amount to 40 and refreshing
  yields 60/8. Counts remain correct; all dates are explicit business dates.

The 180 ms request trace and the five-millisecond exchange example are invented
arithmetic, explicitly labelled. Pool sizing, representative performance testing,
summary maintenance and copying-system decisions are engineering reasoning over
the stated workload, not claimed benchmark results. No multi-session experiment,
physical I/O measurement, analytical-store benchmark or production diagnosis ran.

## Author's continuous pass

Read all three articles after drafting and ran the complete executable lesson
sequence. The main article owns diagnosis, waits, estimates, upkeep and verification;
children develop response assembly and report freshness. The examples introduce
their records before results and name the sender/connection context. Articles remain
working drafts/noindex for independent review and coordinator publication. The
coordinator owns browser inspection, integration and the required build.
