# Scoped repair: incremental result consumption

Accepted first-review medium reader problem: the export route assigned result streaming here, but v01 only covered complete arrays and small related-row loads. Input repair-plan.yaml restores that already assigned ownership. Frozen v01 is untouched. No delegation, independent review or publication performed.

Read whole current article and repair assignment/plan before designing the change. Used staycurrent-revise, current write/figures/continuity and prior complete reference exposure. Supplied revise skill was missing from the private copy; read the current skill at its catalogued repository location. Returned to bounded sequences part1 (END marker present) for caller wait/ownership teaching; adapted its separation of held resources and awaited replies, with a data-level procedure figure that fits this article. Earlier complete reference checks remain in reference-exposure.md.

## Changed source

- article.astro: added Consuming a large result between result mapping and N+1. Explains selection bound versus delivery batches, connection/resource lifetime, awaited consumer/backpressure and row-width limits, end/early stop/error cleanup, and enclosing-transaction/deadline limits. A runnable pg-cursor helper keeps ownership until close or discards on failure. It does not implement resumption or snapshot policy.
- Consumption.astro: new static Figure2 shows the same four Mina order lines in batches2/2, zero-row completion, close and release. Its connection-held band spans the two awaited consumer stages and closure. Short caption covers early stop and failure alternatives. Procedure illustration, not trace/memory/timing model.
- Loading.astro/Lifecycle.astro: figure numbers only changed to3/5. Existing split-connection figure renumbered4 and adjacent references updated. Earlier logic/data/control checks remain applicable.
- Sources adds Cursor, implementation and Node.js backpressure reference; observed-runtime paragraph adds focused cursor checks. Canonical continuation link is /learn/databases/relational/large-results/, as confirmed centrally. Manuscript-status prose is not introduced; wrapper handles availability.

## Continuity and scope

No new shared rows or scenario extension. The export projection selects Mina’s four known order lines, ordered by order_id,line_no, unlike newest-first order history; the new figure and query both name that order. Values stay101/1=P3×1@4.50,101/2=P9×1@35.00,103/1=P7×1@20.00,103/2=P3×2@4.50. Batch size2 serves visibility, not a production recommendation. No payments, prices, stock or order statuses change.

Driver/pool definitions already precede the bridge. Closing/releasing/discarding is explained at first use and developed by existing ownership/cleanup sections. Helper owns a borrowed connection without an explicit surrounding transaction; separately stated advice covers a result inside a caller-owned transaction. Early false means orderly stop between reads, not cancellation. Existing deadline explanation remains necessary for a stuck read/consumer. Pagination owns continuation/order/snapshot correctness; reading incrementally is explicitly not resumability.

## Focused native evidence

Run: `node evidence/verify-consumption.mjs`. Final run passed; exact runnable article snippet extracted into the verifier (snippetSHA256ef34f8a8e472b088ceec0e10a59974da9dbe3a30faf990fd42e17fcc29ce9d62). New results: consumption-native-results.json. Earlier verify.mjs/pglite-results/native-results were preserved unchanged and not rerun because their relevant SQL/client logic did not change.

Runtime: Node24.16.0, node-postgres8.23.1,pg-cursor2.22.1,nativeLinuxPostgreSQL18.6. Explicit coordinator-owned loopback target127.0.0.1:52133; verified current_database=sc_application_sql,current_user=sc_application_sql_writer,cluster_name=staycurrent-application-sql-20261025,data_directory=/var/lib/postgresql/18/docker before DDL. No default/existing database targets. Own sc_consumption_check schema removed after final run; every cursor/client/pool settled or discarded and coordinator notified. Generated password never printed or retained. Root owns fixture cleanup and pinned provenance.

- Complete: rows101/1,101/2,103/1,103/2; reads2/2/0; every consumer finishes before next read; close before release; next query on same backend succeeds.
- Early false: first two rows only; close without further read; same backend reused successfully.
- Consumer failure: original Error object escapes; client discarded and next borrower gets a new backend.
- Read failure: task-owned fault view makes actual SELECT divide by zero(SQLSTATE22012); client replaced. Original table restored afterwards.
- Closing failure: explicit injected close rejection (not a network-fault observation); client replaced.
- Counterexample for release: an open actual cursor is returned normally, the max1pool lends the identical client, and its next query stays unsettled until original cursor.close. Observed server active/ClientRead while paused. Counterexample is bounded and then cleaned up; it is not a latency measurement.
- Counterexample for pacing: actual cursor reads launch deliberately gated asynchronous consumers without awaiting them; both batches remain unfinished together. With awaited helper reads, an assertion forbids the next read during consumption.

## Source checks and repair iteration

Current Cursor documentation has an inconsistent pg.Result promise signature/example. Installed2.22.1 source and native run show promise read resolves the rows array. First focused run caught the wrong destructuring; changed the article and verifier to `const rows = await cursor.read(2)`. Public implementation at package gitHead0980cefebe0ae461da8883703be049fe13ca96cf corroborates it. Exact installed source hash retained in repair-source-hashes.json.

A second verifier run failed an overly specific expectation that the suspended session would report idle in transaction; actual state was active. The article never claimed either state. Removed that assumption, retained actual state/wait_event evidence. Isolated a recorded event array from later checks so the final early-stop result accurately records only read2/close. Final run passed.

Primary sources checked25October2026: https://node-postgres.com/apis/cursor; https://raw.githubusercontent.com/brianc/node-postgres/0980cefebe0ae461da8883703be049fe13ca96cf/packages/pg-cursor/index.js; https://www.postgresql.org/docs/18/protocol-flow.html (extended Execute/suspend/Close/Sync); https://nodejs.org/en/learn/modules/backpressuring-in-streams. Existing pool/transaction sources remain applicable.

## Actual limits

No large-volume/peak-memory benchmark, file/HTTP destination implementation, network loss or hung close/read fault injection, cancellation race, snapshot/export continuation validation, or new transaction protocol was claimed. Close-failure injection tests this helper’s failure branch only. Consumer test uses bounded owned promises, not a live slow browser. The code deliberately discards even a potentially reusable connection after any failure; no claim of optimal pool utilisation.

Source hashes in repair-source-hashes.json. Build/rendered checks are recorded in repair-authoring-checks.md when coordinator/browser work completes. Return for scoped confirmation only; no new full review round.
