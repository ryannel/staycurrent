# PostgreSQL vector retrieval assessment

Draft evidence record, accessed 2 October 2026. Page:
`src/pages/assessments/postgres-vectors.astro`. No publication, benchmarks,
database execution, restore drills or production validation are implied.

The engineering question is whether filtered product retrieval can share the
application's PostgreSQL deployment while meeting its quality, latency,
transaction and recovery targets. The assessment recommends evaluating that
option first when relational data already lives there, then changing the choice
on measured shortcomings. That recommendation is inference, not a published
performance result.

| Primary source | Use in draft |
| --- | --- |
| [pgvector README](https://github.com/pgvector/pgvector) | Retrieval capabilities, filtered approximate scans, valid-vector eligibility, exact-comparison SQL, WAL integration |
| [pgvector changelog](https://github.com/pgvector/pgvector/blob/master/CHANGELOG.md) | Iterative scans in 0.8.0; dated release evidence |
| [Maintainer issue 1036](https://github.com/pgvector/pgvector/issues/1036) | 1 October 2026 IVFFlat build report; affected through 0.8.6, fixed 0.8.7 |
| [PostgreSQL index types](https://www.postgresql.org/docs/current/indexes-types.html) | Conventional indexes on filter columns |
| [PostgreSQL EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html) | Query-plan inspection and ANALYZE execution overhead |
| [PostgreSQL routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html) | Reclaiming obsolete row versions |
| [PostgreSQL CREATE INDEX](https://www.postgresql.org/docs/current/sql-createindex.html) | Writer blocking and concurrent-build tradeoffs |
| [PostgreSQL PITR](https://www.postgresql.org/docs/current/continuous-archiving.html) | Recovery depends on base backups and archived WAL |
| [PostgreSQL CREATE EXTENSION](https://www.postgresql.org/docs/current/sql-createextension.html) | Extension files must be installed on target server |
| [RDS extension management](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Appendix.PostgreSQL.CommonDBATasks.Extensions.html) | Provider permissions, allowlists and version-dependent support |

The pgvector README/default branch and PostgreSQL `/current/` URLs are mutable.
No installed version was inspected. The issue reports a vulnerability with an
index-creation precondition; the page does not claim a particular deployment is
affected or fixed, nor that any provider currently offers 0.8.7.

Independent review should verify the current report, version scope and provider
availability before publishing; check exact-baseline SQL against a real supported
installation; and review tie handling and eligibility snapshots in the proposed
recall evaluation. The three-dimensional query is illustrative syntax rather
than a real embedding or measured result. No universal dataset-size cutoff or
vendor comparison is established by this research.

If the conclusion changes after measurements, revise the field guide's starting
advice and the search explanation's pgvector discussion where applicable. Keep
this draft outside publication entries until an editorial publication decision.

Review correction: both exact and approximate cosine queries exclude null and
zero vectors. The pgvector function reference confirms `vector_norm(vector)`
returns the Euclidean norm. Embedding coverage is tracked separately from ANN
recall; products awaiting usable embeddings need a separate discovery policy.
