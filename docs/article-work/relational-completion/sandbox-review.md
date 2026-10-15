# SQL sandbox independent review

Reviewed 15 October 2026. This is a read-only review of the four existing tutorials, client, worker and sandbox page. Source changes are being made by the coordinator in parallel; findings below describe the revision first read, with observed later changes identified separately. I used the Stay Current review and style skills and did not modify `src`.

The original 21-step teaching sequence works. It moves from selecting records to joining them and calculating a total; then distinguishes a rejected standalone statement from a failed explicit transaction. The checkout and rollback lessons say who sends each command, preserve one connection between runs, and explain when the handler would inspect a response before continuing. They do not pretend to reproduce concurrent clients. The original sandbox has useful safeguards, but the following repairs would make it easier to explore and recover with confidence.

## Prioritized findings

### P2: bound the amount of displayed data across a run

**Observed in source:** `sql-sandbox-worker.ts` awaits `execProtocolStream` before applying the 200-row, 2,000-character-cell and 50-response limits. The installed PGlite declaration returns `Promise<BackendMessage[]>`; the whole protocol response is already available when that loop begins. There is no column or aggregate character/cell budget. At the configured maxima, a wide result repeated across statements can still produce a large message and DOM. Notice and error text also has no character cap.

**Consequence and uncertainty:** the limits bound each individual dimension of the display; they do not bound database execution memory or total rendering work. A tab becoming unresponsive is an inferred risk, not a reproduced crash. I did not intentionally exhaust the user's machine.

**Repair:** add a conservative total displayed-cell or character budget per run, including notices, error details and field names. State when output was shortened and keep the final error and transaction status visible. Describe these as display limits. Do not claim that truncation limits PostgreSQL's own result allocation. Retain the worker termination escape hatch. A future protocol streaming design would need separate investigation before promising a memory bound.

### P2: distinguish SQL NULL from the string “NULL” for assistive technology

**Observed in browser and source:** running `SELECT 'NULL' AS text_null, NULL AS actual_null;` displays both cells as `NULL`. The accessibility tree exposes the same text for both. The real null has italic/secondary styling, which is the only distinction. This matters especially if a lesson teaches missing values.

**Repair:** give a real null an accessible explanation such as “SQL NULL, no value,” using a cell label or visually hidden text. Keep the visible convention compact. Verify the resulting accessibility tree distinguishes it from ordinary text.

### P2: disclose automatic session discard before the reader starts a long query

**Observed in source:** `execute()` discards the entire worker after 20 seconds. The original “What runs here?” text describes a manual stop but does not disclose that automatic deadline. The source also enforces 100,000 input characters, which the limits disclosure omits.

**Consequence:** an exploratory query can discard earlier committed practice changes without the reader having encountered the actual limit. The database is explicitly disposable, so this is a recovery/documentation issue rather than persistent data loss.

**Repair:** disclose the 20-second run limit and that timeout discards the session. Include the editor limit in the same explanation. Preserve the current explicit timeout message and enabled Start action. I verified manual Stop in the browser; I did not complete a timed automatic-discard run in this pass.

### P3: make loading cancellable through the same visible stop action

**Observed in source and browser:** loading disables Start and Run, while Stop remains hidden until `ready` is true. Reset is available, and initialization has a 60-second deadline. A reader can restart initialization but cannot simply stop it through the named Stop action.

**Repair:** show Stop whenever a worker is busy, with wording appropriate to loading or query execution. This is a usability improvement, not an indefinite-load bug: the existing deadline eventually recovers.

### P3: identify multiple result tables within a run

**Observed in source:** every scrollable result region in a run receives the same accessible name, “Rows returned in run N.” Multi-statement output therefore has several indistinguishable region names. Headers have `scope="col"`, and wrappers are keyboard-focusable, which is useful.

**Repair:** include a response or statement ordinal in each region label or table caption. Preserve the command tag beside the table.

### P3: show what was sent after a stopped or failed engine run

**Observed in source:** the “SQL you sent” disclosure is created only when `renderResults` receives a result. The editor remains editable during execution. If a reader edits it while a run is pending and the worker then times out or fails, the pending SQL has no history entry.

**Repair:** either preserve a pending run entry with its SQL and replace its status on completion/discard, or make the editor read-only while executing. The first option better preserves exploratory work. This is an inferred recovery inconvenience; I did not reproduce the full edit-then-timeout path.

## Teaching and discoverability

The original queries tutorial establishes product IDs and order-line quantities before joining them. It explains aliases, `WHERE`, `ORDER BY`, the purchase price versus the current catalogue price, and `SUM`. The numbers match the seed: O13 totals €44, O12 totals €36.

The constraint tutorial deliberately changes a historical practice line and explicitly says it is not a complete checkout or cancellation workflow. Its successful update commits separately; the following invalid update does not undo that earlier change. The final read makes that distinction inspectable.

The checkout tutorial introduces its three-answer inspection query, opens the transaction in a separate run, requires a returned stock row before inserting the purchase, and commits only after successful inserts. The rollback tutorial intentionally adds a read in the failed transaction and explains why real handler code would normally proceed directly to rollback. Those explanations are important and should survive any shortening.

The original navigation permits loading later steps before running earlier ones. It also permits loading earlier steps without undoing the database. This is accurately explained near the controls; it is not an implementation bug. Avoid adding a false “passed” state or forcing advancement based on arbitrary edited SQL. A small “step loaded / last run” indicator could help readers distinguish navigation from execution, especially as lessons grow.

At the original revision, the sandbox was linked from practice, modelling, query-results and transaction-boundaries. Its entire tutorial catalogue was hidden in a select, and the page carried `noindex`. During browser review, the coordinator's new Playgrounds navigation, lesson catalogue and subject groups appeared. These directly address the original discovery weakness; their completed links and added lessons need review against the final revision.

## Verification performed

- `node docs/article-work/sql-sandbox/verify-tutorials.mjs` passed all 21 original steps and the three expected errors. Final checkout state was `[available, orders, lines] = [1, 1, 1]`; rollback restored `[3, 0, 0]`.
- `node docs/article-work/sql-sandbox/technical-protocol-check.mjs` passed all eight existing protocol cases: open/failed/idle transaction state, notices, preserving an error beyond the response limit, cell and row truncation, and unsupported COPY output notice.
- In the actual browser, the database initialized, SQL containing `<img src=x onerror=alert(1)>` was shown as literal text, earlier results survived a later error, and division by zero after BEGIN exposed the failed transaction state and rollback advice.
- In the actual browser, `ROLLBACK; SELECT pg_sleep(30);` exposed Stop; Stop discarded the worker, changed the state to “No active database,” disabled Run/Reset and re-enabled Start.
- A reset confirmation appeared to block the browser automation transport. The tool timed out while dispatching the click, and then timed out trying to inspect the dialog. I could not verify acceptance/cancellation of that dialog in this pass. This is not evidence that the site's confirmation itself is broken.
- DOM/source inspection found labelled select and editor controls, a polite status region, focusable result scrollers, column headers, and focus movement to the newly loaded step title. This was not a full screen-reader or contrast audit.
- I did not rerun the full build: the coordinator owns the final build while editing the shared workspace. Live HMR also reset one browser experiment, so this review should not be treated as final integrated QA.

The tutorial verification script imports PGlite from `/private/tmp/staycurrent-design-sql/node_modules/…`, whereas the protocol script resolves the project dependency. The former passed here, but should use the project dependency before becoming reusable verification evidence on another machine.

## Evidence and limits

[PGlite's overview](https://pglite.dev/docs/about) identifies it as PostgreSQL compiled to WebAssembly and supports ephemeral in-memory use. Its [API reference](https://pglite.dev/docs/api) describes `exec` as a multi-statement simple-protocol operation. PostgreSQL's [simple-query protocol documentation](https://www.postgresql.org/docs/18/protocol-flow.html#PROTOCOL-FLOW-SIMPLE-QUERY) supports the sandbox's explanation of batching and error handling. The precise output allocation concern above comes from this worker's control flow and the installed dependency's `execProtocolStream` type, not an assumption that “stream” in the method name guarantees incremental delivery.

The four original lessons are technically sound at the scope checked. The output and accessibility repairs above remain worth addressing before expanding the sandbox's role; new tutorials require their own execution and reading checks.
