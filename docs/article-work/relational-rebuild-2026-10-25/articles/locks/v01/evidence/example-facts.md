# Example and continuity choices

The shared example record is the authority. No shared starting row was added or changed.

- Figure1 replays only the last-P7-mug competition before Mina's purchase103 commits: stock1 initially, Mina changes and commits0, Tariq purchase104 fails its guarded change and rolls back. Locking-read and ordinary-read options compare operations over that same selected schedule. Ordinary reads create no purchase. P3 allocation and the rest of purchase103 are deliberately outside this drawing.
- Payment scenario independently starts after order103 exists: line1 P7 quantity1 at20.00 and line2 P3 quantity2 at4.50; total29.00; pending; no payments. A and B attempt20.00 each. Coordinator assigned IDs601/602 (504 remains reserved for the independent10.00 query example). Correct RC result is one20.00 payment, 9.00 unpaid, pending status retained. No provider call or paid-status transition is asserted.
- Existing-payment-row locking, later-statement RC, RR earlier snapshot and one-statement RC are independent resets of that same payment starting state. No payment601/602 is added to the shared core records.
- Native verifier uses a separate owned schema, full core table definitions and relevant starting rows, including postpurchase P3stock10/P7stock0/P9stock4. Its deadlock case only locks P3/P7; it does not alter stock, orders or payments. The native result can identify the observed victim; the drawing does not prescribe or pick one.
- The three-transaction blocker chain is a separate lock-only illustration: A requests P7 held by B; B holds P7 and requests P3 held by C; C holds P3 and is idle in an open transaction. No observed native run or cycle is asserted. This scenario neither follows the two-transaction deadlock nor changes core facts.
- PGlite ordinary-SQL check briefly resets products to the prepurchase counts for the guarded stock command, then verifies the independent payment example. All these changes remain inside the disposable instance.

Continuity pass: transaction/snapshot concepts are prerequisites; holder/waiter and conflicting operation precede common authority; missing child rows establish why an existing parent is useful; statement timing is then separated from ownership. Scope and duration follow the complete successful protocol. Deadlock is introduced only after a simple wait has been shown to advance. The diagnosis chain deliberately terminates at an idle holder, so deadlock-check timing cannot be mistaken for a wait deadline. Caption, alternatives and figure-as-text repeat the same scenario bounds and amounts.

No unresolved example extension. Root owns resolving collection links and available/planned route presentation.
