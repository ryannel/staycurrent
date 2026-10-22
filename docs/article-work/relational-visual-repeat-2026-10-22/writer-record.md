# Writer record: relational opening sample

Start: 2026-10-22 20:02:47 UTC (22:02:47 Europe/Stockholm).
End: 2026-10-22 20:09:12 UTC (22:09:12 Europe/Stockholm). Elapsed: 6 minutes 25 seconds.

## Scope and context

Fresh introduction and first section only, for an engineer new to relational databases. Read the assignment brief, its permitted example-facts extract, AGENTS.md, README.md, docs/site-direction.md, and the current writing, figures and continuity skills with the figure implementation/check references. Did not open earlier drafts, feedback, historical skills, sibling experiment records or other agents’ status/history.

Used shared figure infrastructure: src/components/figures/stepper.mjs. Read the fixed-reference ScanFigure and StepFigure wrappers and site colour tokens for implementation. A filename search for shared figure components also returned trial component names; none of those files was opened.

## Reference study

Read the three finished reference pages in a dedicated Chrome tab at port 4350, including their prose, figure text and captions. Inspected the rendered Sequence diagrams activation-bars figure; stepped it and changed the database duration to 3 s. Inspected and stepped Indexes’ sequential-scan figure and Storage and durability’s page-filling figure.

The opening borrows the references’ sequence of a concrete need, a defined object, a specific reading instruction, a figure that exposes the reasoning, and prose that interprets the result. The figure keeps all rows visible while the highlights narrow from a row to its connecting value. It illustrates reading a relationship and claims no engine execution.

## Factual checks

Checked PostgreSQL 18 primary documentation on 22 October 2026:

- https://www.postgresql.org/docs/18/tutorial-concepts.html — named tables, rows and columns; table row order is not guaranteed.
- https://www.postgresql.org/docs/18/tutorial-join.html — pairing rows through matching values; distinguishes the conceptual reading from physical query execution.

The two sources are linked at the end of the sample. No SQL execution, engine benchmark or measured database behaviour is claimed or needed.

## Continuity pass

Rows match the permitted facts: 101 and 103 carry customer_id 1 (Mina Shah); 102 carries customer_id 2 (Tariq Aziz); customer 3 (Edda Berg) has no orders. Stored table/column names are unchanged. No new example facts or extensions were introduced. The prose distinguishes an order’s own identifier from its customer reference before discussing repeated values. Names, primary/foreign-key terminology, constraints, SQL, transactions and operation are not assumed as prior knowledge. The sample stops after following the connection.

## Rendered checks

Pending coordinator preview. No build, server, commit or push run by the writer.

First coordinator preview: r01, built successfully at 20:05:52 UTC; coordinator reported all 13 site rules passing. Inspected at http://127.0.0.1:4358/review/relational-visual-repeat/ in Chrome.

Desktop viewport: 1488 × 917, original System theme resolving dark. Read the complete rendered opening and stepped through all four figure states. Verified choices 103 → Mina, 102 → Tariq, 101 → Mina. Back, Next, Reset and Play/Pause activated with Enter; the endpoint keeps focus and marks unavailable movement with aria-disabled. Opened the text alternative with Enter. Light desktop inspected and saved.

At 375 × 812, both tables stacked and the document’s scrollWidth equalled 375. r01 exposed an earlier mobile connector path across the destination name; requested a fresh build of the already-updated connector/gutter source. No prose repair or coordinator editorial feedback received.

Computed theme tokens checked in the rendered page. WCAG relative-luminance contrast calculations: secondary text on the figure board 6.05:1 light / 6.15:1 dark; main table text on cells 15.00:1 / 12.10:1; accent connector on board 5.52:1 / 8.77:1. Text exceeds 4.5:1 and connector exceeds 3:1. Decorative separators use the shared rule tokens; meaning is carried by the text and accent outlines/arrow.

Final coordinator preview: r02, built successfully at 20:07:55 UTC, reloaded at the same URL. Inspected the repaired route at 375 × 812 in Dark and Light. The connector leaves the selected order’s customer cell, crosses the empty gap between tables and enters the matching customer identifier from the left; it avoids the customer name. Verified both the 103 → 1 and 102 → 2 routes. The 375 px page has no horizontal overflow.

Automatic playback was observed advancing and completing at 4 / 4, with the expected customer text. Replay returns to 1 / 4; Pause stops it. All three options and all four steps were exercised; keyboard activation covered Play/Pause/Replay, Back, Next, Reset and the text disclosure. Native select options were exercised through the browser’s selection API, rather than a complete keyboard-only journey. Checked the final desktop layout after the mobile repair. No captured browser warnings or errors.

Receipts:

- desktop-dark.jpg — final r02, 1488 × 917, System resolving dark, order 103 connection.
- desktop-light.jpg — r01 desktop (desktop rendering unchanged by r02 mobile repair), light, order 101 connection and open text alternative.
- mobile-dark.jpg — final r02, 375 × 812, order 103 connection.
- mobile-light.jpg — final r02, 375 × 812, order 102 connection.

Restored the viewport override to default (1488 px wide) and the original System theme, resolving dark. Browser viewport lease released.

Final continuity reread: the introduction establishes persistent shared application facts before tables are read; both rows and columns are defined before the figure; the prose tells the reader where to start, explains the matching value after the figure, and distinguishes repeated customer references from an order’s own identifier. The drawing, live explanations and static text alternative agree with the permitted example facts. No unresolved factual dependencies.

Limits: this is the commissioned partial opening, not a complete article or full-article review. No independent reviewers were arranged. No screen-reader run, JavaScript-disabled browser run or live reduced-motion override was performed; semantic tables/text alternative are present, and reduced-motion timing is inherited from the shared player. No database execution is claimed. Build/site-rule reports belong to the coordinator. No shared routes/site files were edited, and no build/server/commit/push was run by the writer.
