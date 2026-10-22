# Relational opening · writer record

## Scope and time

- Assignment: fresh introduction and first section only, from `writer-input.md`.
- First clock receipt: **2026-10-22 19:39:47 UTC**. Initial brief/instruction reading had begun just before that receipt; no more precise start time was captured.
- First complete source was handed to the coordinator and built successfully at **19:43:14 UTC**, according to the coordinator’s build receipt.
- First rendered checks: desktop at its default 1488 × 917 viewport, System theme resolving dark; then 375 × 850. A second preview was requested at approximately **19:44 UTC** to repair the desktop connector.
- End time and final checks are recorded below after the final preview.

## Inputs used

Read `AGENTS.md`, `README.md`, `docs/site-direction.md`, the assigned brief and its permitted `example-facts.md`. Applied the current `staycurrent-write`, `staycurrent-figures` and `staycurrent-continuity` skills, with the current figure render-check, stepper and database-verification notes. No earlier draft, historical skill, feedback, sibling experiment record or other agent’s history was read. No further agents or reviewers were arranged.

Read all three finished references on the coordinator’s port 4350 in a dedicated Chrome tab. The complete rendered text was read, including captions, model boundaries and sources; the long Indexes text was read in overlapping extracts. Representative figures were followed on screen: the sequence waiting figure with a different database delay and a manual step, the index sequential scan with a manual step, and storage page filling with a manual step. Reference source and shared article/figure infrastructure were consulted for implementation conventions after Astro symbol extraction proved unsupported.

Teaching choices taken from those references:

- Define the subject and give a concrete application reason before its vocabulary.
- Introduce one meaning at a time, with prose directing the reader’s attention to the figure.
- Let the first table establish a row and a column; then reuse the same data while adding a second table.
- Keep the small data set fully visible. The choice of order changes highlights and the resulting explanation, rather than hiding the unmatched data.
- Order 103 belongs to customer 1, so the example distinguishes matching values from matching row positions.
- Reuse the site’s paper surface and blue control palette; keep the data display and controls distinct.

## Sources checked

Checked on 22 October 2026 against the PostgreSQL 18 primary documentation (the `current` URLs resolved to 18; final article links use `/18/`):

- [Concepts](https://www.postgresql.org/docs/18/tutorial-concepts.html): tables as named collections of rows, named columns and lack of guaranteed row order.
- [Table basics](https://www.postgresql.org/docs/18/ddl-basics.html): consistent columns across rows and explicitly requested display ordering.
- [Joins between tables](https://www.postgresql.org/docs/18/tutorial-join.html): pairing rows according to matching values.
- [Architectural fundamentals](https://www.postgresql.org/docs/18/tutorial-arch.html): an application uses the database, whose server manages the stored files across client connections. This supports the introductory distinction between the application request and the retained record without introducing a crash-durability promise.

The sample does not claim an executed query, database benchmark, constraint enforcement or crash test. Its tables are invented example data from the permitted factual extract. No database instance was needed or used.

## Continuity pass

The complete introduction, section, captions, selected-state explanation and text alternative were reread from a newcomer’s starting point. Names and identifiers agree with the factual extract: Mina 1, Tariq 2, Edda 3; orders 101 and 103 refer to 1, and 102 to 2. Edda remains without orders. Status is unnecessary to these outcomes and is omitted. Shared values are defined once in `src/components/relational-visual-test/shop.ts` and reused by static rendering and the selection interaction. No extension to the shared example was needed.

The piece stops after reading rows/columns and following the order’s customer identifier. It does not introduce schema design, SQL syntax, constraints, transactions or operational choices.

## Rendering and implementation checks

The coordinator owns and runs builds and previews. The writer ran no build, server, commit or push. The first build passed all 13 site rules according to the coordinator. A whitespace diff check returned no issue; new-file inclusion and site checks remain the coordinator’s responsibility.

The first desktop check found a teaching defect: a fixed horizontal arrow could suggest a connection between rows in the same display position. The second source replaces it with a curved connector whose endpoints follow the chosen order and the matching customer. The narrow layout stacks the tables and retains matching row outlines, underlined identifiers and a written result. The first-check screenshot is retained separately from final receipts.

### Final preview and checks

The coordinator built preview r02 at **19:44:56 UTC** and r03 at **19:46:17 UTC**, both successfully. The only change after r02 was shortening the crowded connector label to “match”. Final checks used **r03**, served at `http://127.0.0.1:4356/review/relational-visual-test/`, with its immutable output at `/private/tmp/staycurrent-relational-visual-test-r03`.

| Viewport | Theme | Rendered result |
| --- | --- | --- |
| 1488 × 917, default | Light | Both tables readable; curved arrow connects order 103 to customer 1; all order choices worked. |
| 1488 × 917, default | Dark | Same matching behaviour; row outlines, underlined identifiers and keyboard focus visible; written alternative opened by Enter. |
| 375 × 850 | Dark | Tables stack, arrow points down, all values and controls remain readable; all three choices worked. |
| 375 × 850 | Light | Same stacked layout; first table and surrounding prose also inspected; all three choices worked. |

Each matrix row exercised all order choices. Mouse, Enter and Space were used across these checks. The results consistently identified 101 → 1 → Mina Shah, 102 → 2 → Tariq Aziz and 103 → 1 → Mina Shah. The selected button’s `aria-pressed`, selected order row, selected customer row and live result agreed. A visible 3 px focus outline was observed. The native disclosure opened and closed with Enter and its list contained all three mappings. Semantic table captions, row/column headers and the live-result region were inspected in the rendered structure.

Page width equalled viewport width at desktop and 375 px, so there was no horizontal page overflow. The mobile table wrappers also had no internal horizontal overflow. Captured browser error logs were empty. No timing or automatic animation is used by this figure.

Calculated contrast from the shared palette values, checked against rendered computed colours: light secondary text on the darkest paper endpoint **5.14:1**, main table text **8.51:1**, selected-row text **8.36:1**, meaningful selected outline **3.99:1**, control text on its tint **5.83:1**, and selected button text **6.55:1**. Dark equivalents were **6.67:1**, **10.34:1**, **7.36:1**, **5.11:1**, **8.20:1** and **9.17:1**. These calculations cover text and the selected/connecting graphics; subdued cell grid lines do not encode selection.

Receipts:

- [Desktop, light](receipts/final-desktop-light.png)
- [Desktop, dark](receipts/final-desktop-dark.png)
- [375 px, light](receipts/final-mobile-light.png)
- [375 px, dark](receipts/final-mobile-dark.png)
- [Selection and layout observations](receipts/final-controls.json)
- [First preview before the connector repair](receipts/first-preview-desktop-dark.png)

The complete prose and captions were reread after these changes and the continuity pass remained satisfied. **Rendered checking ended at 19:47:24 UTC on 22 October 2026.** The browser was restored to its original **System** theme, resolving dark, and default **1488 × 917** viewport before return.

Limits: this was a writer’s rendered/self-continuity check of a partial opening, not an independent article review. Chrome was the only browser tested. The semantic fallback was checked in source and the rendered text alternative, but no JavaScript-disabled session or screen-reader session was run. Build and site-check evidence belongs to the coordinator. No publication was performed.
