# Independent sandbox technical review

Reviewed 15 October 2026: worker, client, tutorial data, sandbox page and Astro
configuration. Used the Stay Current review/research/style guidance. Read the
actual source and exercised the worker's protocol parsing against installed PGlite;
then checked transaction state, COPY output, stop/restart and reset in Chromium
against the built preview on port 4322. No implementation edits by this reviewer.

**Verdict after repair: ready as a draft feature.** All material findings below
were repaired by the coordinator and rechecked. No unresolved technical blocker
remains in this review.

## Findings

1. **Notice erased an active result — repaired and rechecked.** A query calling a
   function that raises NOTICE returned a command tag but lost its field and row.
   The notice branch had cleared the current result. Reproduction:
   `CREATE FUNCTION noisy() RETURNS int LANGUAGE plpgsql AS $$ BEGIN RAISE NOTICE 'hello'; RETURN 42; END $$; SELECT noisy() AS answer;`.
   Executed the repaired worker: it preserves the notice and the answer 42.

2. **Response limit hid a database error — repaired and rechecked.** Fifty
   `SELECT 1;` statements followed by `SELECT 1/0;` omitted the error, returned an
   idle status and let the UI announce success. The fixed worker preserves the
   error within the capped output and marks omitted responses. Executed it and
   observed SQLSTATE 22012 retained. This matters because the implicit batch can
   have rolled back even though earlier command tags are present.

3. **Long cells silently lost text — repaired and rechecked.** The original
   2,000-character clipping had no indication beside the shortened value. The
   fixed worker adds a marker and `cellsTruncated`, with a local client message.
   Executed `SELECT repeat('x',2001)` and checked the truncation flag. The 201-row
   case also correctly retains 200 rows, marks truncation and preserves SELECT 201.

4. **COPY output silently disappears — repaired and rechecked.** In the browser,
   `COPY (SELECT 42 AS answer) TO STDOUT;` reports completed with `COPY 1`, but the
   42 is never shown. The worker ignores copy-data messages. Either display bounded
   COPY output or explicitly tell the reader that this output mode is unsupported.
   An ordinary success message is misleading for an editor that promises results.
   The repaired worker supplies an explicit unsupported-output notice with SELECT
   guidance. Confirmed that notice in the rebuilt browser and protocol test.

5. **Reset discards unsent SQL without asking — repaired and rechecked.** Start a fresh
   session, edit to `SELECT 999 AS my_unrun_query;`, and press Reset without running
   it. No confirmation appears and the editor is replaced with the sample. The
   guard tracks only runs, not editor changes. Include unsent edits in the guard,
   with wording that names editor loss, or preserve the editor when resetting.
   Starting a different tutorial uses the same path. The guard now includes edited
   SQL and its confirmation names that loss. The initial loaded SQL is correctly
   set from the textarea, avoiding an unnecessary first-start prompt. Browser
   checks confirmed no first-start dialog, one dialog for unsent edits, and that
   declining the reset preserves those edits.

## What is sound

The protocol ReadyForQuery status, rather than SQL-text guesses, supplies I/T/E.
Observed BEGIN → T, division by zero → E, ROLLBACK → I, with the error and current
state matching. Transaction commands can span separate Run actions on the same
worker database. NULL and the text 'NULL' remain distinct in worker data; duplicate
column names can survive because rows are arrays rather than keyed objects.

Reset terminates the old worker, clears its timer and creates a new session.
Callbacks check worker identity before updating the UI, so a late response from an
old session cannot overwrite the new state. Only one run is enabled at once.
The main-thread timeout and Stop terminate the worker rather than pretending to
cancel a query while preserving unknown database state. Observed Stop, restart
and original stock 3 successfully; no uncaught browser JavaScript errors occurred.

SQL values, field names, notices, errors and history are rendered with textContent
or text nodes. They do not become HTML. The database has no server credential or
persistent data directory, and arbitrary SQL is intentionally scoped to the
reader's disposable browser instance. The worker bundling produced a functioning
engine in the built preview.

Tutorial steps explain that loading is not execution, preserve the open
transaction between steps, and make expected failure an intentional outcome.
The reservation continuation rule is explicit. The content does not claim to
grade edited SQL. The constraints tutorial correctly distinguishes a failed
standalone statement from a failed explicit transaction.

The coordinator also added an explanation of PostgreSQL's implicit transaction
for a multi-statement Run. That distinction is essential when the UI retains early
command responses after a later error; a command tag does not prove commit.

## Limits and optional refinements

The displayed row/cell/response limits are applied after `execProtocolStream`
returns its message array. They bound rendering and transfer to the main thread,
not engine execution or worker memory. A very large result can still exhaust
resources before display clipping. The 10-second statement timeout and 20-second
worker termination are useful protections, but not a strict memory bound. Avoid
presenting display limits as an execution guarantee.

The controls have native labels, visible focus treatment and keyboard activation;
responses have table headers and focusable scroll regions. The coordinator repaired guide step discovery by moving focus to the new step
heading. Browser verification of Next confirmed focus on “Open the transaction”.
This is a targeted accessibility check, not a full assistive-technology audit.

## Evidence

`technical-protocol-check.mjs` executes the actual TypeScript worker after stripping
types and resolving its bundled schema import for Node. It asserts all eight protocol
cases above and passed after the repairs; it does not approximate SQL parsing.
The dependency resolves relative to the repository through pathToFileURL/resolve,
so the runner contains no user-specific import path. Browser checks used the same
local Playwright/Chromium installation as the batch review. The coordinator owns
full tutorial/browser flow and build verification.

Primary references checked:
[PostgreSQL message flow](https://www.postgresql.org/docs/18/protocol-flow.html)
for simple-query transaction grouping and asynchronous notices, and
[PGlite API](https://pglite.dev/docs/api) for local instances and protocol behaviour.
The installed package and actual execution establish the precise low-level API
used here; the public API page does not document every protocol-level method.
