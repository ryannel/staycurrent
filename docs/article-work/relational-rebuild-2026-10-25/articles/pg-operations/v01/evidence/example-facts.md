# Example facts and continuity

Core facts remain unchanged. Mina is customer 1. Post-103 history returns order 103 (pending, 20 October 2026 10:15 UTC), then 101 (paid, 12 October 09:30 UTC). Tariq’s order 102 is not in Mina’s result. Order 103 has two lines totalling 29.00 and no payment; stock remains the shared post-purchase 10/0/4. No new business rows, IDs, staff roles or committed changes are introduced.

Independent scenarios:

- Pool-only waiting occurs before a database client is borrowed. Backend W denotes a borrowed direct connection, not Mina’s permanent identity. A transaction pooler can change that mapping.
- Lock-only H runs BEGIN and takes ACCESS EXCLUSIVE on orders, then remains idle in transaction. No rows change. W’s ordinary SELECT requests ACCESS SHARE. H/W are symbolic labels in drawings; actual PIDs and timestamps exist only in retained native evidence.
- Four model branches restart from that dependency. Owner rollback and observed session termination release H’s lock. Cancelling idle H need not release it. Cancelling W ends that attempt while H remains. W’s failed explicit transaction needs rollback before reuse.
- Native fixture uses an owned three-column-plus-ID orders projection with the exact three core orders. It is not a full production shop schema. The one-client pool has one later checkout waiter, with H outside that pool. No HTTP server or load generator is involved.
- Optional paid-order report is the existing agreed-line-value report. No generated rows or benchmark timing is imported. Figure 3’s independent 60-second windows and 10/100 calls at 20/200 ms are synthetic arithmetic.
- Figure 4’s 100 connection ceiling, 2 reserved and 3 superuser-reserved slots are illustrative settings, separate from the native fixture’s actual settings. The graphic uses exact 95:2:3 proportions; privileged sessions can consume places before thresholds too. No native saturation or role-admission test is claimed.
- Figure 5’s 2,000 ms request budget is 600 ms already spent on checkout, at most 900 ms for the server statement and 500 ms reserved for transfer/cleanup/reply. Its 200 ms lock timeout is inside the statement allowance and applies per acquisition. It is not a measured latency or deadline guarantee.
- The 12/8/4 GiB free-space trajectory over ten minutes and 6 GiB repair requirement are reused explicitly as the incident article’s synthetic example. No filesystem measurement is implied.

The complete reader continuity pass followed request identity → activity state and times → lock dependency and interventions → aggregate work → admission → storage → bounded attempt → signal scope → useful recovery. Scope stays local: lock protocols belong to locks; plan repair to PostgreSQL plans; retention/age to vacuum; WAL/checkpoint/restart drill to WAL; general workload budgets to capacity; commit uncertainty to retry outcomes. The article establishes each handoff through the local example. No shared extension or ownership change is requested.
