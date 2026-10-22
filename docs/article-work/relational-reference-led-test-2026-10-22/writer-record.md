# Writer record · relational opening sample

- Actual start: 22 October 2026, 18:55:30 UTC (20:55:30 Stockholm).
- First complete source: 18:59:05 UTC.
- Writing and rendered verification complete: 19:04:05 UTC (21:04:05 Stockholm).
- Final record completion: 19:04 UTC; no later prose or teaching edits.
- Assignment: a fresh introduction and first section only; no full-article review or publication commission.

## Inputs and boundaries

Read the assigned writer-input.md and example-facts.md, AGENTS.md, README.md and docs/site-direction.md. Applied the current staycurrent-write, staycurrent-figures and staycurrent-continuity skills and the figures skill’s database-verification guidance. Read the three fixed reference article sources in full and studied their finished pages, including all figures, on the coordinator’s port 4350. The reference figures were viewed in their starting states; sequence figures were also taken to their completed state with the keyboard, and index figures were played to inspect their changing drawings and counters. This was study, not a full verification of those existing tools.

No previous sample sources, historical skills or sibling experiment files were opened. After the draft and its sole mobile-header repair were complete, a collaboration.list_agents status query (after the 19:02:22 UTC clock reading; the query’s exact timestamp was not separately measured) inadvertently returned older agents’ final summaries, including an earlier opening sample’s check outcome and a mention of a clipped-SQL repair. No earlier prose or component content was shown or used; nevertheless this is a late metadata exposure, reported immediately to the coordinator, and limits a claim of complete isolation. A file-name search to locate shared generic figure/table components exposed names of older trial components; their contents were not opened. The source uses the existing generic ResultTable component. Only the assigned source, supporting component and this record were written.

## Writing and figure decisions

The introduction establishes storing, asking questions and keeping rules through the shop. The first section introduces the table/row/column vocabulary, asks the reader to follow one customer reference, then extends the same reading to order lines and products. Each new term has a visible use before the section moves on.

Two static figures keep their data visible together: customers and their orders in reading order, then order 103’s lines followed by their products. No animation or custom controls are needed to expose this relationship. Native tables provide the text representation as well as the figure. The last small table pairs three rejected changes with the constraint responsible; it is conceptual, not output from a claimed run.

The price distinction follows the order arithmetic. The hypothetical offered-price change is introduced with “Suppose”, and the text explicitly says the database does not infer price meanings or protect an agreed price automatically. Syntax, query construction, stock races, execution internals and transaction working depth are left to later branches.

## Technical source checks

Checked on 22 October 2026 against PostgreSQL 18’s primary documentation:

- https://www.postgresql.org/docs/18/ddl-basics.html — rows, columns and column types.
- https://www.postgresql.org/docs/18/ddl-constraints.html — primary keys (including combined columns), foreign keys, and positive-quantity checks.
- https://www.postgresql.org/docs/18/tutorial-transactions.html — several database changes succeeding or failing together.

The reader-facing source note links these three pages. No SQL listing, executable download, benchmark or observed engine result is claimed. No native database instance was needed or started. The constraint examples illustrate the declared canonical rules; this record does not claim an executed counterexample test.

## Continuity pass

Read the complete fragment and captions from the newcomer’s starting point. Names and identities follow example-facts.md: Mina 1 with orders 101 and 103, Tariq 2 with 102, and Edda 3 with no orders. Order 103 has P7 × 1 at 20.00 and P3 × 2 at 4.50, making 29.00. The hypothetical 22.00 offer makes 31.00 only for the explicitly wrong recalculation. The canonical column names remain products.price and order_items.unit_price. “Order line” is used in prose and order_items for the table. Stock and payments are not shown, so no before/after stock state or payment state is introduced. No shared example extension is proposed.

## Rendered checks

The coordinator built r01 successfully at 18:59:25 UTC and reported all 13 site checks passing. At http://127.0.0.1:4352/review/relational-reference-led/ I checked the complete rendered reading order and both figures at the default desktop viewport (1488 × 917) in light and dark, then at 375 × 812. The narrow Figure 2 headings initially split inside words. I changed only the owned component’s header wrapping to permit breaks after underscores; no prose changed. The coordinator rebuilt r02 at 19:01:59 UTC, again with all 13 site checks passing.

Reloaded r02 and rechecked both figures at desktop and 375 px in both themes. At 375 px the Figure 2 headers now wrap at word boundaries; all table cells remain visible without table or page overflow. Inspected the constraint table separately in both mobile themes. The native table regions and column headers have accessible names and reading order; Tab from the customers region moved focus to the orders region. There are no custom controls or options to exercise. Browser error logs were empty.

DOM-derived contrast checks on figure titles, number labels, captions, headers and data cells found a minimum text contrast of 6.61:1 in light and 6.83:1 in dark. Decorative rules are not used to carry meaning. render-checks.json records the actual viewports, computed colours and text ratios. Ten r02 PNG receipts retain both figures at desktop/mobile in both themes, plus the constraint table in the two mobile themes. source-hashes.json records the two final source files. Direct source whitespace checks found no trailing whitespace and confirmed terminal newlines.

The final continuity pass includes all prose, tables and captions and retains the data decisions above. Restored the original System theme choice and default viewport. No build, server, route, commit, push or review team was created by this writer. Native database execution, runnable downloads, independent practitioner review and full-article completeness are outside this partial sample’s verification.
