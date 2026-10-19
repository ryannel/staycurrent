# Working with SQL: review and repair record

This assignment plans only `breakdown.yaml` and its unexpanded child stubs. It uses
no existing relational article, coverage map or old plan. The draft deliberately
uses one shared order schema and two descendants: query composition and data-change
statement semantics. Views, routines, triggers and COPY remain sections here to
limit reading and navigation cost.

## Evidence for the reference-dialect boundaries

The plan selects PostgreSQL 18 as a fixed executable reference, not as a claim
about the latest available version. Primary documentation checked while planning:

- [Query structure and SQL forms](https://www.postgresql.org/docs/18/queries.html)
- [SELECT: ordering and row selection](https://www.postgresql.org/docs/18/sql-select.html)
- [INSERT: conflict handling and returned results](https://www.postgresql.org/docs/18/sql-insert.html)
- [Returned data from modifications](https://www.postgresql.org/docs/18/dml-returning.html)
- [UPDATE: source matches, affected rows and results](https://www.postgresql.org/docs/18/sql-update.html)
- [MERGE: candidate rows and statement effects](https://www.postgresql.org/docs/18/sql-merge.html)
- [COPY: format, environment and failure boundaries](https://www.postgresql.org/docs/18/sql-copy.html)
- [Trigger behaviour](https://www.postgresql.org/docs/18/trigger-definition.html)
- [Constraint timing](https://www.postgresql.org/docs/18/sql-set-constraints.html)

These are planning checks, not evidence that the article's future examples have
been executed. The writer must provide the named engine, fixtures, expected
results and execution evidence, and verify each named cross-dialect difference.

## Validation

The first draft parses as YAML, uses the singular `heading` list and keeps each
`nested_article` to exactly `topic`, `title` and `brief`.

## Independent reviews

The shared reviewer slot was granted for two sequential independent reviewers.

### Practitioner review and repair

`practitioner-review.md` reported two P2 findings. Both were repaired in existing
headings without adding sections or descendants:

1. The data-change child now distinguishes checking during execution, applicable
   end-of-statement checks and checks still outstanding until commit. It requires
   a returned-row example with deferred checks outstanding and explicit hand-offs
   for deferral/commit protocols and constraint design.
2. Expressions now include a division counterexample to predicate-order guarding,
   safe NULLIF/CASE placement and its NULL policy. Aggregation reuses the example
   to put protection inside aggregate inputs and explain CASE's limits.

The second repair was checked against [PostgreSQL 18 expression evaluation
rules](https://www.postgresql.org/docs/18/sql-expressions.html#SYNTAX-EXPRESS-EVAL),
as identified by the independent reviewer. The focused practitioner recheck accepted
both repairs, with no remaining issue or additional recheck required before child
expansion. The independent adversarial editor is reviewing the repaired breakdown
without reading the practitioner findings or this repair record.

### Adversarial editorial review and repair

`editor-review.md` challenged every section and both child boundaries against the
three fixed teaching examples. It retained both descendants and requested four
major repairs plus one smaller reduction. The breakdown now:

- Introduces missing values before NULL-producing safety examples, preserves the
  safe aggregate-input rule and gives uncommon CASE evaluation limits an explicit
  depth-note owner in query composition (E1).
- Shows fan-out as pairs/counts in joins, introduces the incorrect total after
  aggregation, and completes one repair with separately aggregated CTE inputs in
  composition. It removes three parallel syntax formulations from the parent (E2).
- Leads composition with a customer-period report, an explicit stopping condition
  and intermediate-grain checks. Hard cursors have a direct task entrance; recursion
  is an optional bounded extension using `categories(id, parent_id)`. LATERAL and
  less-used window variants require a named task (E3).
- Keeps one diagnostic trigger example and definition inspection in the parent,
  with the full timing/granularity/RETURNING/zero-row treatment owned once by the
  data-change child (E4).
- Moves the portability ledger to an end reference and keeps consequential dialect
  differences beside their tasks (E5).

No descendant was added or removed. The focused editorial recheck accepted E1–E5
with no outstanding findings. The practitioner's final preservation recheck also
confirmed that its two findings remain resolved and safety/trigger coverage was
preserved through relocation. Neither reviewer requires further planning recheck.

## Final outcome

Accepted for planning: 11 top-level headings, 15 headings in total and two unexpanded
child stubs. Final YAML validation passed, including exact stub keys. No unresolved
findings remain. Article examples, rendered figures and runtime behaviour have not
been authored or tested at this planning stage. Only files in this assignment
directory were created or edited; no canonical tree or article was changed.
