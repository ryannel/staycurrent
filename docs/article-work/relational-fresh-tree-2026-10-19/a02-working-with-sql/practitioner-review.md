# Practitioner review: Working with SQL

Review mode: breakdown. Perspective: coverage and working depth only.

Reviewed the commission, assignment context and proposed `breakdown.yaml`. No existing relational articles, earlier plans or coverage maps were used. Child articles are assessed as topic/title/brief stubs; they should remain unexpanded here.

Verdict: two local repairs needed, then recheck. The proposed coverage otherwise gives a credible route from a first query to substantial SQL work. The two child boundaries are justified by their distinct practical tasks; no additional child article is needed. The ownership boundaries with modelling, transactions, application engineering, execution and operations are reasonable.

## Findings

### P2 — Clarify which checks happen during a statement and which can fail later

Location: **Change exactly the intended rows → Changing data with SQL**, child brief, `breakdown.yaml:145–147`.

“Immediate versus deferred checks at the statement boundary” is ambiguous enough to encourage a consequential false simplification. In PostgreSQL, deferred constraints may be checked at commit or when explicitly forced earlier. Immediate checking is also not uniformly an end-of-statement operation: `CHECK`, `NOT NULL` and non-deferrable uniqueness checks have more immediate timing. A reader can otherwise infer that successful execution and `RETURNING` establish all integrity checks relevant to that change.

Repair: replace the phrase with an explicit promise to distinguish checks made during statement execution, end-of-statement checking for applicable immediate deferrable constraints, and outstanding deferred checks that can still reject commit. Include one compact example where a statement returns rows but a deferred check remains outstanding. Link to the transaction owner for controlling deferral and commit handling, and to modelling for choosing constraint properties. This is enough semantic depth here; it does not require a transaction tutorial.

Primary evidence: [PostgreSQL 18 SET CONSTRAINTS](https://www.postgresql.org/docs/18/sql-set-constraints.html), particularly Description and Compatibility.

### P2 — Add a concrete expression-safety counterexample

Location: **Build a result from expressions and rows**, `breakdown.yaml:41–46`; **Filter when some facts are missing**, `breakdown.yaml:52–59`; reuse in **Summarise at the intended grain**, `breakdown.yaml:83–85`.

The distinction between a logical row model and execution is valuable, but the plan never requires the practical consequence: predicate text order does not provide an evaluation guard. An engineer accustomed to application Boolean operators may write `denominator <> 0 AND numerator / denominator > ...`, or assume that an outer `CASE` protects a risky calculation inside an aggregate. Both mistakes belong to statement meaning and can produce errors even when the intended result excludes the troublesome rows. They should not be deferred to execution diagnosis.

Repair: add one small division example that rejects reliance on left-to-right `AND`/`OR`; introduce `NULLIF` or an appropriately placed `CASE` with the resulting NULL policy stated. When reusing the denominator in an aggregate, place the protection inside the aggregate input, or use its `FILTER`, rather than wrapping the finished aggregate. State briefly that `CASE` does not universally suppress planning-time constant evaluation or evaluation of aggregate arguments. This can fit in the existing headings and fixture without a new section or child.

Primary evidence: [PostgreSQL 18 expression evaluation rules](https://www.postgresql.org/docs/18/sql-expressions.html#SYNTAX-EXPRESS-EVAL).

## Coverage and boundaries accepted

- Joins, multiplicity, missing values, aggregation, ordering, pagination and wrong-answer fixtures receive explicit practical treatment.
- The composition child already promises scalar cardinality, correlation, set multiplicity, frames and peers, recursive termination, nullable cursor keys and realistic report validation. Its expansion should fulfil those promises rather than introduce more navigation now.
- The data-change child already promises source-to-target cardinality, conflict targets, no-row outcomes, MERGE distinctions, returned identities and data-modifying CTE semantics. Those are appropriate statement-level responsibilities.
- Keeping visible view, routine, trigger and COPY effects in this article is useful. Deployment, privileges, transaction protocols and ingestion recovery remain with their named neighbours.

Recheck required: yes, limited to the repaired heading and child briefs. No article writing or runnable example execution is required at this planning stage.

## Focused repair recheck

Reviewed only the revised briefs for **Build a result from expressions and rows**, **Summarise at the intended grain**, and **Change exactly the intended rows → Changing data with SQL**.

- **Constraint timing finding: resolved.** The child now explicitly separates checking during execution, applicable immediate deferrable checks at statement end, and deferred checks that may reject commit. The promised returned-rows example supplies the necessary practical distinction, with deferral control, commit handling and constraint choices handed to the correct neighbours.
- **Expression safety finding: resolved.** The expression heading now requires a concrete counterexample to reliance on AND/OR text order and an explicit NULL policy for its repair. The aggregate heading requires protection of aggregate inputs or filtering, and states the limits of outer CASE and planning-time constant evaluation.

Verdict: practitioner review passed at breakdown stage. No remaining issue in the focused changes and no further practitioner recheck needed before child expansion. The child remains a topic/title/brief stub. Writing must still validate its eventual examples against the selected executable dialect.

## Final preservation check after editorial relocation

Checked the current `breakdown.yaml` only, focusing on the relocated material and the two previously resolved findings.

Both findings remain resolved. **Filter when some facts are missing** now owns protected division after introducing NULL, explicitly rejects AND/OR text order as a guard and requires the missing-versus-excluded result policy. **Summarise at the intended grain** retains aggregate-input protection and rejects an outer CASE guard; the composition child explicitly owns the short depth note on aggregate argument evaluation and planning-time constant evaluation. This preserves the practical safety lesson and its necessary caveats.

The DML child retains the explicit distinction between execution-time, applicable statement-end and deferred checks, including a returned-rows example with an outstanding deferred check. Detailed trigger timing, granularity, zero-row, added-write and RETURNING cases remain explicitly owned there. The parent's inspection bridge still warns that returned rows do not enumerate every side effect and directs readers to that depth.

Verdict: practitioner coverage preserved; no regression or remaining issue in these relocations. No further recheck required for this change. Child nodes remain unexpanded topic/title/brief stubs.
