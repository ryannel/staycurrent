# Article decisions

The informed review found substantial existing explanations across the collection.
Six articles needed a more complete operational example. Two performance articles
needed browser lessons matching their central experiments. The remaining decisions
preserve depth already present and make the next investigation easier to find.
The uncued first-reading log remains separate from these author decisions.

| Article | Decision and practical consequence |
| --- | --- |
| Relational introduction | Retain the overview and routes through the collection; it introduces the family rather than repeating every chapter. |
| Modelling | Retain identity, shared facts and historical purchase values; the interactive changes expose the consequences. |
| Constraints | Retain the progression from row rules through references and concurrent uniqueness. |
| Tables and documents | Retain the typed-input and document-query examples; add the deeper PostgreSQL JSON route. |
| Query results | Retain joins, missing relationships, grouping and result grain, including the existing practice. |
| Query execution | Retain the worked plans; add a matching join-work lesson with narrow, broad and intermediate reports, and a prepared-plan onward route. |
| Large results | Retain ordering, keyset boundaries and stable-export distinctions. |
| Transaction boundaries | Retain the complete caller/connection/error handling and uncertain-commit example. |
| Isolation | Add exact multi-session schedules, reset instructions, observed outcomes and the full Serializable decision retry; demonstrate the limits of an unchanged control-row lock. |
| Conflicts and retries | Retain known rejection versus unknown outcome and the whole-operation retry contract. |
| Checkout | Retain the connected introductory tour; make the earlier-version heading precise. |
| Indexes | Retain the detailed ordered-key experiment; add its matching six-step lesson and PostgreSQL access-path continuation. |
| Storage | Retain page, WAL, crash and cleanup reasoning; link the observed PostgreSQL recovery investigation. |
| Slow queries | Retain the request trace and estimate repair; connect prepared-statement diagnosis to its PostgreSQL experiment. |
| Request cost | Retain N + 1, bounded batching, independent child aggregation and connection ownership. |
| Reporting | Retain source/result grain, corrections and the difference between snapshot and publication time. |
| Scaling | Retain the architectural overview; add the PostgreSQL worker/distribution investigation. |
| Replicas and failover | Retain freshness and writer-authority reasoning; connect to PostgreSQL physical/logical replication and promotion. |
| Partitioning and sharding | Retain pruning, identity and ownership-cutover examples; connect to parameter-time pruning, FDW and distributed PostgreSQL transactions. |
| Schema changes | Add a stale-copy counterexample, two actual writer/backfill schedules, and a three-connection DDL wait/timeout experiment with a downloadable worksheet. |
| Backups and recovery | Execute the existing logical drill; add a physical base/WAL recovery drill, missing-segment failure, recovery-boundary figure and reconciliation of later good work. Derive RPO from a known recovery point. |
| Access control | Add permissive-OR versus restrictive-AND policy composition, a visible tenant leak, repair and a matching six-step lesson. |
| Data lifecycle | Retain deletion, suppression and restore reasoning; explain the DELETE USING target and ledger match; connect delayed arrivals to the copy-freshness lesson and complete outbox delivery. |
| Product comparison | Replace a broad isolation contrast with an exact two-connection schedule; distinguish observed PostgreSQL/SQLite results from documented MySQL/SQL Server expectations. |
| Adding another system | Follow an atomic catalogue/outbox commit through destination application, lost acknowledgement, replay and delivery marking; add a diagram and seven-step lesson. |
| Practice | Retain runnable setup and fixture boundaries; add precise routes to the isolation, migration and physical-recovery worksheets. |

The initial informed reports explain the retain decisions with passage-level
evidence. Final editorial and first-reading reports determine whether these
repairs leave any consequential gap; passing examples alone is not that judgement.

## First-reader dispositions

The full initial reading found four small required explanations, all repaired:
NULL-aware schema validation; the same-name match in reconciliation's JOIN USING;
which records DELETE USING removes while preserving its ledger; and concrete
SQLite affinity/MySQL SQL-mode consequences. The revised reading checks those
repairs in context. The replica example now correctly gives the price edit to a
staff member. The request-cost payment paragraph remains a short worked prediction
in the main text; its runnable sandbox variation already lets the reader perform
the change. Moving the answer into a disclosure would add interaction without
resolving a necessary gap in that explanation.

Screenshot review also identified a practical problem in plan-reading lessons.
Compact monospaced EXPLAIN rows now preserve hierarchy inside a keyboard-scrollable
region. This is a scoped presentation repair; it does not parse plans or change
query output, execution, truncation budgets or ordinary result tables.
