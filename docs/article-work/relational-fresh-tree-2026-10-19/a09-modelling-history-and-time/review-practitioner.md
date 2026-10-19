# Practitioner review: Modelling history and time

Verdict: **pass**. No required repairs to the breakdown.

Reviewed `breakdown.yaml` against `context.yaml` and `../commission.md` in breakdown mode. This review covers the assigned article only; it does not expand children or use existing relational articles or previous plans.

## Findings

1. **The representation choice is driven by the required answer.** “Begin with the question about the past” compares current rows and audit records, agreement snapshots, entity versions and the two temporal axes in one worked domain. Keeping an order's agreed price beside the contract rate is especially useful: it prevents a technically accurate rate history from being mistaken for a record of what an order agreed. No missing representation justifies another article.

2. **The correction example has sufficient precision for expert practice.** “Correct yesterday without rewriting what was known” supplies initial and replacement rows, both as-of cuts, the absence of a recorded assertion before 2 January, and the distinction between effective, recorded, commit and observer time. The plan does not silently equate a backdated business fact with a historical database state. Stable entity identity, assertion identity, correction linkage and the unchanged agreement snapshot are all covered.

3. **The constraint discussion addresses the consequential failure modes.** “Enforce the timeline you have promised” correctly distinguishes one-axis non-overlap from overlap on both axes, and distinguishes non-overlap from continuity and coordinated correction. Its counterexample and explicit hand-off for the concurrent protocol give the reader an actionable boundary between schema protection and transaction work. Non-null periods, empty periods, adjacency, gaps and open ends are sufficiently specified at planning stage.

4. **Historical relationships and deletion receive adequate depth.** The plan distinguishes a reference to one version from coverage across an entire child interval, including coverage supplied by adjacent parent periods. It also requires the relationship's axes to be chosen explicitly. Provenance and deletion are treated as questions of preserved meaning, with access and purge execution left to operations. That is the correct ownership boundary.

5. **The named engine comparison is accurate and appropriately bounded.** PostgreSQL 18's temporal keys and PERIOD references provide overlap and combined-period coverage, rather than automatic recorded-history capture. SQL Server system versioning uses transaction-begin time in UTC and its temporal queries omit zero-duration versions. The plan explicitly prevents readers from inferring commit order, business-validity management or proof of authorship from these facilities. These consequential points were checked against the primary documentation below.

## Writing-stage cautions, not required breakdown changes

- In the executable PostgreSQL example, include `btree_gist` when using an ordinary scalar contract identifier with GiST exclusion or temporal keys, and show the period checks explicitly. The feature comparison must retain the PostgreSQL 18 version boundary.
- When choosing the custom recorded-time representation, make same-clock-tick corrections and multiple changes within one transaction an explicit consequence of the selected ordering rule. The existing requirement to define the recorded cut and its ordering guarantees already covers this; the rows and SQL must honour it.

## Primary checks

- [PostgreSQL 18 CREATE TABLE](https://www.postgresql.org/docs/18/sql-createtable.html): WITHOUT OVERLAPS uses range or multirange values and GiST-compatible scalar equality; PERIOD references require matching referenced periods whose union covers the complete child period.
- [Microsoft SQL Server temporal tables](https://learn.microsoft.com/en-ca/sql/relational-databases/tables/temporal-tables?view=sql-server-ver17): system-managed UTC periods use transaction-begin time; FOR SYSTEM_TIME filters zero-duration versions.

The final expected-answer worksheet is a strong acceptance criterion: checking cardinality, boundaries and both temporal axes will expose plausible wrong models that return a believable rate for only the happy-path query.

## Final recheck

**Accepted: pass. No unresolved required findings.** Rechecked the revised breakdown: “Correct yesterday without rewriting what was known” now explicitly requires recorded ordering to address tied clock values and several changes within one transaction; “Enforce the timeline you have promised” now names `btree_gist` for scalar identity equality. Both writing-stage cautions are incorporated without expanding the article's scope.
