# Relational opening · writer record

- First recorded worker clock: 22 October 2026, 12:12:06 UTC. Instruction reading had already started; its exact start was not measured. The coordinator's last pre-dispatch observation was 12:11:44 UTC, so neither time is presented as an exact assignment start.
- Work completed: 22 October 2026, 12:23:33 UTC, after the final rendered and evidence-applicability checks.
- Source: `src/articles/relational-reference-test/opening.astro`.
- Figure: `src/components/relational-reference-test/ShopSchema.astro`.
- Scope: fresh introduction and first section only. No complete-article review or publication claim.

## Inputs and approach

Read AGENTS.md, README.md, site direction, the writer input, current writing, figures and continuity skills, and all three fixed reference articles in full. Inspected the reference previews, including all figures' rendered text/alternative outcomes and representative visual layouts. No sibling experiment files, other relational drafts, earlier skill versions, feedback or review records were opened.

The opening follows the references' direct definition, concrete application and cost, then the shared worked example. The first section explains only the concepts required to read a small schema. One static figure records the rows and connections; mobile row cards preserve column labels. No animation is needed to teach these relationships. The SQL is explicitly one column-definition excerpt, without a promise of a runnable setup.

## Example and continuity

Audited against [the canonical example](../../coverage/relational-example.md). Customers and roles, order IDs and statuses, five order lines, product identifiers, quantities, prices and the primary/foreign keys match it. The figure uses the state after order 103: P3 stock 10, P7 stock 0, P9 stock 4. The coordinator confirmed that the brief's mention of stock reservations does not require a new relation; products and order lines remain canonical. No example extension is proposed.

Reading order: table/row/column are explained before their detailed use; primary key and foreign key before PK/FK labels; SQL before the excerpt; NOT NULL and CHECK immediately after it; constraint and schema when their meanings become concrete. Order line has its ordinary shop meaning and is explicitly connected to the `order_items` row. Price versus unit_price is explained as current offer versus agreed line price. No prior article is assumed. Formal dependencies, query duplicates, missing-value semantics and the shared-stock concurrency rule are deferred.

## Sources and evidence

Checked PostgreSQL 18's Concepts and Constraints chapters on 22 October 2026, linked in the sample. Claims checked: named rows/columns, primary-key uniqueness and required values, foreign-key matching, positive integer quantity plus NOT NULL, and rejection of violating changes. The picture is invented data, not a database screenshot.

The [native receipt](native-receipt.json) records PostgreSQL 18.6 on an owned disposable cluster at port 56812 with a private socket, sanitised connection settings, endpoint verification and guaranteed cleanup. The first sandboxed attempts could not allocate PostgreSQL shared memory; the authorised escalation succeeded. Every depicted row was accepted. Repeated/missing primary keys, a repeated composite key, absent referenced customers/orders/products, and zero/negative/missing quantities were refused. Failed quantity changes left the tea line at 2. Raising the current mug price left its agreed line price at 20.00. Removing the positive CHECK allowed zero, establishing the counterexample. All temporary server and socket files were removed.

The [rendered receipt](rendered-receipt.json) indexes six screenshots and the final source hashes. The native receipt hashes match the final article and figure. Checked the fixed coordinator preview in a visible Chrome tab at 375 × 812 and desktop width 1488, in light and dark. The schema stands alone as four real tables connected by named foreign keys; its highlighted order and two lines, key labels and caption agree. Phone row cards preserve every real column name and PK/FK mark without document overflow. Secondary figure labels have 6.05:1 light and 6.15:1 dark contrast. The SQL region receives keyboard focus with a visible outline. A first one-line excerpt clipped inside its own code viewport on phone; the final two-line excerpt fits completely and was visually rechecked in both themes against r02.

Reread the final piece, caption and labels against the references. Repeated the complete continuity pass; the canonical rows, terms and the post-order-103 stock state remain consistent. No child article or other draft was inspected or altered. No separate reviewers were arranged for this partial sample.

Coordinator reported that the r02 build at 12:21:01 UTC and all 13 site checks passed, and that a normal build excluded the sample route. The writer did not build or serve. Preview: `http://127.0.0.1:4350/review/relational-reference-test/`; immutable output: `/private/tmp/staycurrent-relational-reference-test-r02`. Browser viewport override was reset and the System theme preference restored. Reference figure outcomes were read in rendered text, with representative actual diagrams inspected; the record does not claim every reference animation state was played. This sample has no custom interactive controls or animation.
