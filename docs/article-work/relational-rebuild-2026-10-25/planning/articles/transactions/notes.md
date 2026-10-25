# Transactions planning notes

Prepared from the supplied commission, accepted article/neighbour records and updated shop facts. No ownership change, new child, scenario extension or extra planning review is proposed. No main-repository bodies, old drafts, feedback or workers' notes were read.

## Reference exposure

Read sequences 1–6, indexes 1–7 and storage 1–6 separately with `scripts/read-writing-reference.py`; all 19 END markers arrived. Studied the finished previews in one owned temporary IAB tab, then closed it. No visibility options, viewport/theme changes or user-tab operations.

Comparable teaching: Sequence diagrams' **Ordering and gaps**, Figure 6, isolates an event-order change; Indexes' **Covering indexes and index-only scans**, Figure 8, varies one condition against the same rows; Storage's **Row versions and undo logs**, Figure 3, keeps old and new readers visible together. Carry their progression from concrete case to judgement into this article. The writer chooses visual form; the required understanding is the atomic purchase boundary, visible snapshots, contending stock guard and cross-row payment decisions.

## Example and continuity decisions

- Start the purchase replay before order 103 exists: P3 12, P7 1, P9 4. Success creates the supplied pending order and two lines, P3 10/P7 0/P9 4, total 29.00 and no payment. Call `order_items` rows order lines; preserve agreed prices.
- Mina/103 wins the illustrative last-mug schedule. Tariq/104's guard updates no row and the entire attempt rolls back, including any earlier purchase work. Do not store a cancelled order for the loser. Zero updated rows is a business rejection, not a SQL error.
- Contrast stale `stock = 0` with a relative guarded decrement. Two stale zero assignments can satisfy the non-negative CHECK while accepting two orders. The application must inspect the guard's result.
- Reuse the purchase's stock changes for visibility: ordinary reads spanning its commit may observe P7 before and P3 after. One statement or a suitably established stable snapshot avoids that mixed observation. Visibility remains relative to the snapshot.
- Reset independently for the payment limit: order 103 exists, value 29.00, no payments; two distinct attempted rows of 20.00. The unsafe total is 40.00. Under Serializable, one commits 20.00; a fresh attempt sees only 9.00 available and rejects 20.00. No new IDs or schema are needed in the plan. This concerns recorded payments, not an external charge; the partial-payment scenario stays separate.
- Every mutation affecting the rule must participate, including changes to the lines determining its limit. Lines stay fixed in this worked race. Reads and decisions must be inside the protected transaction, not only its INSERT.

## Primary checks

Checked 25 October 2026 against PostgreSQL 18 documentation. These support documented predictions; no schedule was executed.

- [Transactions](https://www.postgresql.org/docs/18/tutorial-transactions.html): transaction blocks, rollback and implicit statement transactions. Savepoints may receive a short explanation if useful; they are not separate commits and must not permit a partial purchase.
- [Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html): ordinary Read Committed statement snapshots versus an updating command's wait/recheck; Repeatable Read's first non-control statement fixes its snapshot and conflicting row updates can abort. PostgreSQL Repeatable Read prevents phantoms while allowing serialization anomalies; its Read Uncommitted maps to Read Committed. Serializable checks dependencies rather than literally running transactions in series. Own changes remain visible. Qualify level names by implementation.
- [UPDATE](https://www.postgresql.org/docs/18/sql-update.html): RETURNING describes updated rows; zero updated rows is not an error.
- [Application consistency](https://www.postgresql.org/docs/18/applevel-consistency.html): Serializable protection needs consistent participation. Blocking locks require a sound snapshot protocol; a later lock does not refresh an old fixed snapshot.
- [Explicit Locking](https://www.postgresql.org/docs/18/explicit-locking.html): row locks block conflicting row writers/lockers through transaction end; they neither prevent ordinary reads nor protect absent matching rows.
- [Serialization Failure Handling](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html): SQLSTATE 40001 requires retrying the complete transaction, including decisions and value selection. Do not treat every constraint error as transient.
- [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html): a CHECK cannot guarantee conditions over other rows. Preserve native constraints alongside a payment-sum concurrency protocol.

## Boundaries and writing evidence

The parent fully explains the stock guard and Serializable payment protocol, including the fresh decision after abort. A common authority such as the order row introduces explicit locking; the locks child owns the full isolation/snapshot protocol, scope, ordering and wait diagnosis. The retry child owns request identity, recorded results and uncertain-outcome recovery. Connection ownership and transport stay with application SQL; physical versions, retention, WAL and durability settings stay with storage. Snapshot versions are not business history.

The writer has native PostgreSQL 18.6/pg 8.23.1 fixtures. For observed results, retain SQL, session order, isolation, final rows and errors. Verify guarded-writer waiting/recheck, Repeatable Read's same-row abort and distinct-row payment write skew versus Serializable abort/retry. Label illustrative schedules as models; do not promise the Serializable victim or exact failure point. No runtime experiment, build, server, article review, commit or publication was performed.

Continuity pass: the outline builds from purchase/guards/constraints to snapshots, stable reads, cross-row failure and serial reasoning. Scenarios reset explicitly; customer roles, stock, order value and child ownership remain coherent. No unresolved ownership boundary remains.
