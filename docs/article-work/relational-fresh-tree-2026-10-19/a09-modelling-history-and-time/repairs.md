# A09 planning review and repairs

Scope: one history-and-time article, planned from the assigned context and commission. No existing relational corpus or previous plans were used. The draft has seven headings and no nested articles. Nothing changes the canonical tree or public reading.

## Primary-source checks

Checked on 19 October 2026 for the bounded product comparisons in the plan:

- [PostgreSQL 18 CREATE TABLE](https://www.postgresql.org/docs/18/sql-createtable.html): `WITHOUT OVERLAPS` on a range/multirange column provides non-overlap for equal remaining key values. A `PERIOD` foreign key requires combined referenced-period coverage and a referenced temporal unique/primary key. These features are not automatic recorded-history capture. The general exclusion form supports the planned two-range comparison; this is a model design, not a claim of an executed example.
- [PostgreSQL 18 Range Types](https://www.postgresql.org/docs/18/rangetypes.html): range exclusion examples combine scalar equality with range overlap using `btree_gist`. Any eventual executable example must include its extension, null and range-shape requirements.
- [SQL Server temporal tables overview](https://learn.microsoft.com/en-us/sql/relational-databases/tables/temporal/overview?view=sql-server-ver17): system-managed periods use transaction-begin UTC timestamps; as-of predicates use inclusive starts and exclusive ends. `FOR SYSTEM_TIME` omits zero-duration versions made by repeated updates within a transaction, while direct history-table querying can expose them. These semantics require an explicit distinction from business validity and commit/observer time.

No SQL example or concurrency experiment has been executed at this planning stage. The plan commissions those writing-stage checks and distinguishes illustrative timelines from observed execution.

## Independent reviews

Pending practitioner and adversarial editor review.
