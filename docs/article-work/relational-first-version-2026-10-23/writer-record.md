# First-version writer record

## Commission and boundary

Complete relational-database introduction for an intelligent engineer who has never used one. This is the first complete source, before independent review or repairs. Work stayed in this clean workspace. No previous introduction, review findings, experiment results, Git history or other chat/draft was inspected. No delegation, build, server, commit, push or publication was performed.

The article is an Astro body fragment at `src/articles/relational-first-version/introduction.astro`. It has seven main teaching sections, four figures and sources. Supporting source is confined to `src/components/relational-first-version/`. Existing supplied `Sql.astro` and the shared `figures/stepper.mjs` are reused unchanged. The preview owner supplies the page shell and contents wrapper.

## Reference exposure and timing

- Read the commission, example facts, available destinations, local AGENTS.md, README, site direction, all three supplied current skills, and the figures skill's three implementation/verification guides.
- Read each reference export separately, each with a 6,000-token output allowance: sequences 1–6, indexes 1–7, storage 1–6. Every END marker was delivered. Root independently checked all 19 exact chunks and acknowledged complete text delivery before design began.
- Used dedicated reference browser tabs only, opened directly to the three supplied localhost reference URLs. Inspected Sequence figures 1–13, Index figures 1–11 and Storage figures 1–10 with their lead-ins, captions and following explanations. Comparisons exercised included waiting/email, crowded and focused views, TLS, fork/stair, scattered and customer order, covering/visibility, and PostgreSQL/InnoDB old-version placement. Manual seeking was used as well as playback. Some figures initialise on first interaction; final states were revisited after initialisation.
- Sent root the completed rendered-study list before beginning design/source writing, following root's delivery acknowledgement. Root supplied no teaching, heading or visual feedback.
- Exact work-start time was not separately clocked. Reference reading and rendered study preceded the first recorded clock checkpoint, 19:25 UTC on 23 October 2026. Design and source writing began after readiness, around that checkpoint. Complete prose and figures were written by 19:34 UTC. Author rereading, continuity checks and the source freeze finished at approximately 19:36 UTC. These are actual clock checkpoints, not a claim about human reading time.

## Teaching and continuity decisions

The explanation follows customers and orders into order lines, then constructs a query result, then moves from rules to one purchase and a competing purchase. Figure 1 follows shared ID values. Figure 2 draws row contributions rather than a physical query plan. Figures 3 and 4 rewind explicitly to before order 103, so their pre-purchase stock does not conflict with the earlier read-only tables.

The shop facts are centralised in `shop.mjs`: Mina 1 owns 101 and 103; Tariq 2 owns 102 and the attempted 104; Edda 3 has no orders; P7 is the blue mug; P3 is green tea. Order lines have the composite key (order_id, line_no). Price history is explained using `products.price` and `order_items.unit_price` without inventing an actual later price change. Order totals are 39.50, 40.00 and 29.00; payments are 30.00 + 9.50, 40.00 and none. Initial stock 1/12 becomes 0/10 after 103. Order 103 is pending, not paid. The protected race commits only 103; 104 does not commit. No factual extension is requested.

The ordinary complete author reread and the supplied continuity pass were performed before freezing, including captions, controls and model states. New concepts are introduced in prose before they are used in the workings, except that figure labels expose the corresponding concrete column names as they are explained. No independent article review or repair loop was arranged.

## Sources and evidence

Primary sources opened and checked on 23 October 2026:

- PostgreSQL 18 `tutorial-concepts.html`, `ddl-basics.html`, `ddl-constraints.html`: tables, column types, keys, nullability and checks.
- PostgreSQL 18 `tutorial-select.html`, `tutorial-join.html`, `tutorial-agg.html`, `queries-table-expressions.html`, `functions-aggregate.html`: filtering, pairing, result rows, grouping and totals.
- PostgreSQL 18 `tutorial-transactions.html`, `dml-update.html`, `transaction-iso.html`: atomic transactions, rollback, row-based updates and Read Committed wait/recheck behaviour. Serializable is introduced as a continuation, with its retry consequence.
- PostgreSQL 18 `wal-intro.html`, `tutorial-arch.html`, `indexes-intro.html`: durable log/recovery, application/server connections and access paths.
- SQLite `whentouse.html`: local embedded use and the client/server distinction.

Article Sources and further reading links the sources supporting its consequential claims. Store-fit comparisons are introductory engineering judgement, not benchmark results or a claim that only one storage family can perform the work.

`node src/components/relational-first-version/verify.mjs` passed. It checks keys/references in the chosen data, both receipt lines, all order and payment totals, visibility of both transaction endings, and the two deliberately selected race outcomes. `node --check` passed for both `.mjs` files. These checks validate the illustration's arithmetic and state descriptions; they do not establish PostgreSQL execution. No database engine or native instance was executed. The unsafe/protected concurrency comparison is a conceptual account of documented PostgreSQL Read Committed behaviour, explicitly labelled as such.

## Freeze and rendering limits

Source frozen before requesting preview. The manifest in `evidence/first-source.sha256` identifies the nine new article/component files. No later prose or figure edits are permitted in this assignment. Full build/site checks belong to root.

Root reported that the unchanged source built successfully and supplied the immutable r01 preview at `http://127.0.0.1:4364/review/relational-first-version/`. A brief read-only inspection confirmed the seven-section contents, the rendered article and all four figures in the default desktop/system-dark view. Edda's selection showed no matching orders; stepping the query produced the two receipt rows and correct 20.00/9.00 line totals; the transaction reached both commit and rollback endings; the protected race reached stock 0 with only order 103 committed. No source was edited after this inspection. This was a brief author observation, not a review or full mechanical certification. Mobile/375 px, light theme, exhaustive playback/options, keyboard navigation and measured contrast were not checked. All four temporary reference/inspection tabs were closed. No browser settings were changed.
