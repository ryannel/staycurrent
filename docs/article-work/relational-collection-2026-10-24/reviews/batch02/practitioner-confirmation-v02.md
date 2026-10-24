# Practitioner repair confirmation · article mode · r05, r06, r09, r13 · batch02-v02

Inputs read: the [assignment](practitioner-confirmation-v02-assignment.txt), current review skill and practitioner perspective, [v02 manifest](v02/manifest.json), permitted frozen source/context/mechanical records and the current 4414 pages. This is fresh **informed repair confirmation**, not an independent first reading or final complete review. Earlier versions, reports, decisions and author teaching notes were withheld and were not inspected. No agents, build or source edits were arranged.

Highest severity: **none**. All four assigned problems pass; no new substantive finding arose within the checked scope.

## Checks

| Check | Result | Applied scope and evidence |
| --- | --- | --- |
| 1. Correctness | pass | Checked the revised r13 snapshot boundary against PostgreSQL 18 documentation, implementation and the permitted raw native probe; traced the r09 temporary-parent change through its runnable and current native record; reconstructed r05 pairs and r06 customer membership/arithmetic from the canonical data, SQL and rendered modes. |
| 2. Evidence | pass | Verified all 123 manifest file hashes and the separate native-supplement hash. Reused only applicable unchanged SQL/data evidence. The changed r09 runnable has a current exact-source rerun. Conceptual figures and selected schedules remain explicitly distinguished from database execution and timing. |
| 3. Coverage | pass | Rechecked each changed explanation, its prerequisites and practical consequences: BEGIN versus snapshot establishment; runnable platform/setup and private endpoint; repeated contributions versus independent totals; grouped versus retained order identities. Read surrounding arguments and affected downstream uses. |
| 4. Depth, both ways | pass | The snapshot paragraph explains the practical SET LOCAL exception without turning into a utility-statement catalogue. The setup supplies actionable platform, dependencies, binary location and temporary-parent constraints. The repaired tables expose the needed identities without introducing new data or additional SQL mechanisms. |
| 5. Ownership | pass | Checked relevant frozen briefs/tree boundaries. r05 retains result grain; r06 owns grouped/window calculations; r09 owns connection/transaction lifecycle; r13 owns the isolation distinction. Complete locking protocols, retry policy, physical execution and pool sizing remain with their named owners. The repairs invalidate no additional ownership judgement. |

## Problem results

### r13 · transaction-boundaries · snapshot establishment — pass

The current “What a snapshot keeps” paragraph correctly says the Repeatable Read view becomes fixed when the transaction first needs a query snapshot. It identifies the report's first SELECT as that point and directly distinguishes BEGIN and `SET LOCAL application_name = 'report'` from the first read. Its later-read explanation retains the transaction's own changes. The surrounding Read Committed explanation, logical two-read schedule, warning that a stable view does not reserve stock, and later write-skew/locking argument remain consistent.

I checked [PostgreSQL 18 Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html), then checked the exception in the primary implementation rather than relying on the manual's broader first-non-transaction-control wording. In [pquery.c, PlannedStmtRequiresSnapshot and PortalRunUtility](https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/tcop/pquery.c), transaction commands and VariableSetStmt are exempt from the snapshot requirement; the utility executor requests a snapshot when required. [snapmgr.c, GetTransactionSnapshot](https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/utils/time/snapmgr.c) preserves and subsequently returns the initial snapshot at transaction-snapshot isolation. Those mechanisms support the revised ordinary explanation.

The separately frozen [raw native probe](v02-native-supplement/independent-snapshot-probe.json), whose SHA-256 matches its manifest (`7519424bf551b07b9adc95415d25c5e0a08448ed9820e513026175798ad8dc92`), directly distinguishes the cases on PostgreSQL 18.6: BEGIN + SET LOCAL, external committed stock change, first SELECT → 2; first SELECT → 1, external committed change, later SELECT → 1. It records private socket/port/user/database, removal of inherited PG variables, disabled TCP, ownership queries in both sessions, server stop and removal. This is reused raw execution evidence, not a new run or a borrowed review verdict.

The unchanged r13 runnable, native summary/transcript and logical model still give Read Committed `1,0` and Repeatable Read `1,1` for the illustrated first-SELECT-before-checkout schedule. I also traced the affected dependency in r07's “One view for an export”: the first COUNT follows BEGIN and establishes the shared view before cursor declaration and later reads. No downstream claim depends on SET LOCAL establishing a snapshot. The later lock warning still correctly rejects waiting as a way to refresh an existing Repeatable Read view.

Bounded HTTP inspection of the current r13 page confirmed the revised paragraph is actually served. Its actual experiment href returned HTTP 200 and SHA-256 `c38f5a137ef311a7813ed133b36e52c19e8751bf961c45229b302d9180654d0d`, matching the frozen runnable.

### r09 · application-sql · supported runnable setup and temporary parent — pass

The current “Repeat the driver checks” section names macOS/Linux, Unix-domain sockets and the required PostgreSQL tools, pins Psycopg/pool dependencies, requires the two downloads to sit together and shows `python run-boundary.py --bindir /path/to/postgresql/bin --tmpdir /tmp`. It explains that the parent must exist, be writable, short, absolute and without spaces. The next paragraph identifies the actual macOS/version check and expressly says Linux execution has not been checked. The target-platform statement therefore does not masquerade as an observed Linux result.

The exact frozen runnable accepts `--tmpdir`, defaults to `/tmp` and passes that value into `tempfile.mkdtemp`. [Python 3.14 tempfile](https://docs.python.org/3.14/library/tempfile.html#tempfile.mkdtemp) supports a securely created child under the selected parent with caller-owned deletion. The script's child contains data and socket directories; it disables TCP, supplies explicit host/port/database/user and checks `data_directory` before fixtures. Its tool environment strips inherited PG variables. [PostgreSQL connection settings](https://www.postgresql.org/docs/18/runtime-config-connection.html) support the empty listening-address/private-socket arrangement. Cleanup stops the owned server before removing its directory.

The [current repair source record](v02/mechanical/current-repair/technical-sources.md), [source hashes](v02/mechanical/current-repair/source-hashes.json) and [native rerun](v02/mechanical/current-repair/r09-native-v02.jsonl) tie the changed runnable to the macOS command using `--tmpdir /tmp`, PostgreSQL 18.6, Python 3.14.5, Psycopg 3.2.12 and pool 3.3.3. I read the actual result rows and state checks, rather than treating “all checks passed” as sufficient: bound/unsafe values differ as claimed; refusal restores stock and IDLE before reuse; timeout yields 57014 then 25P02; the separate connection escapes rollback; cancellation settles before SELECT 1 and replacement; cleanup is recorded. Its shop data still matches canonical core.

The surrounding connection/transaction reasoning remains coherent with that record. In particular, autocommit connections plus an explicit transaction scope keep all purchase work on one session; application refusal exits that scope before reuse. [Psycopg transaction management](https://www.psycopg.org/psycopg3/docs/basic/transactions.html) also supports the surrounding caveat that a transaction context entered after an implicit transaction can manage a savepoint. The repair changes the experiment's location/setup, not its transaction protocol.

Bounded HTTP inspection confirmed the actual current page instructions and its two actual hrefs. Both returned HTTP 200 and exact frozen bytes: runnable SHA-256 `6cc72fe140da43dcef8e5bbe02cc95c420c0c7be2e0e235fa8223116a069f581`; shop data `bdae3259a820ed6a81e7f3e95dabce8bcc7a03eae11ff0a1f09cbe1d2d46948c`.

### r05 · query-results · repeated line–payment relation — pass

Fresh current-page control use confirmed both modes and the return transition. “Join the details” shows precisely `(line 1, 4.50, payment 501, 30.00)`, `(1, 4.50, 502, 9.50)`, `(2, 35.00, 501, 30.00)` and `(2, 35.00, 502, 9.50)`. Each original amount contributes twice: both column sums are 79.00. “Total each side first” replaces these with one order-101 row, line total 39.50, payment total 39.50 and due 0.00. The labels/explanations update with the selected mode, and switching back restores the four pairs.

I reconstructed those pairs from the frozen canonical line/payment rows and the component's nested mapping. They agree with the unchanged detailed join and the still-due SQL, and with the applicable PostgreSQL 18.6 [native output](v02/mechanical/r05/native-output.txt). [PostgreSQL joined-table rules](https://www.postgresql.org/docs/18/queries-table-expressions.html#QUERIES-JOIN) support matching each eligible pair. The figure and its text alternative describe result meaning rather than a chosen execution algorithm.

The surrounding argument still correctly explains why GROUP BY does not remove repeated contributions, why distinct amounts lose legitimate equal-valued facts, why order 103 disappears from the inner join and why separately grouped totals retain it in the report. The downstream r06 warning about multiplied input remains supported. No SQL, data or report-policy change is introduced by the new table form.

### r06 · aggregates-and-windows · partition membership — pass

Fresh current-page control use confirmed the fixed input rows `101 / Mina / 39.50`, `102 / Tariq / 40.00`, `103 / Mina / 29.00`. Grouped mode returns Mina Shah 68.50 and Tariq Aziz 40.00: three inputs become two customer groups. Window mode retains all three order/customer/value identities and places 68.50 beside both 101 and 103, with 40.00 beside 102. Switching back restores the grouped result and explanation.

Those memberships follow customer IDs in the canonical data; 39.50 + 29.00 = 68.50. They match the unchanged order_values/window SQL and the applicable PostgreSQL 18.6 [native output](v02/mechanical/r06/native-output.txt). [PostgreSQL's window tutorial](https://www.postgresql.org/docs/18/tutorial-window.html) supports retaining individual row identities while computing across rows sharing partition values. The component does not silently include Edda or the later amount-free tie orders in these three-order calculations.

I checked the surrounding input-grain, COUNT, HAVING and window passages, plus the subsequent repeated-customer-total warning, filter-before-window example, customer-specific LAG and separate tie extension. They remain consistent with the new display: it is now possible to identify exactly which orders share Mina's calculation, and nothing suggests that the repeated 68.50 represents another sale.

## Reuse, provenance and limits

The [applicability record](v02/mechanical/applicability.json) and [verification-reuse record](v02/mechanical/current-repair/verification-reuse.json) qualify reused unchanged r05/r06 SQL, downloads and core data, and unchanged r13 schedules. I checked their current frozen bytes and relevant query/result correspondence; I did not rerun already-applicable SQL for ceremony. r09 uses the supplied current exact-source rerun, not its old runnable's evidence. No new native server or database challenge was created by this confirmation.

Primary sources above were opened directly on 24 October 2026. Also consulted the official [Psycopg installation instructions](https://www.psycopg.org/psycopg3/docs/basic/install.html) and [PostgreSQL initdb instructions](https://www.postgresql.org/docs/18/app-initdb.html) for the setup. The versioned native receipts establish the stated tested versions; current documentation is supporting API/mechanism evidence, not proof that Linux was executed.

Current rendered checks used a newly created background tab for r05/r06 and bounded HTTP for r09/r13 paragraphs and actual download href bytes. No theme, viewport or unrelated tab was changed; the temporary tab was closed. A sandboxed HTTP attempt was denied before connection; an authorised read-only escalated retry completed. No browser download-event/path/save waits were used.

Full visual/accessibility certification, responsive/theme coverage, whole-collection coverage and independent final complete readings are outside this informed confirmation. I did not treat this report as any of those checks. The scoped technical checks found no need to widen beyond the surrounding passages and identified r07 dependency described above.
