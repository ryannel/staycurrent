# Connections, overload and capacity: planning notes

Detailed outline only, under the supplied current breakdown skill. The accepted article is a leaf: no new child outcome or ownership change is proposed. The writer may reshape headings and illustration form using the fixed references.

## Reading and teaching

Read all bounded reference parts separately with `scripts/read-writing-reference.py`: sequences 1–6, indexes 1–7 and storage 1–6; all 19 END markers received without clipping. Read the supplied commission, article, neighbours, incoming ownership, reading links and complete shared shop record. Read current breakdown, write and continuity instructions from this workspace.

Studied finished references through an owned IAB tab at port 4584: Storage's WAL lanes and counters, Sequence diagrams' nested waiting/activation-bar explanation with the 3 s choice, and Indexes' selectivity/page-visits comparison. No viewport or theme changes; tab closed. The initial tab-creation call timed out after creation; recovered that owned tab from the inventory. The controls' contrast and the before/after comparisons matter here: name what to watch before a figure, expose one changing relationship, then develop the practical judgement. Do not use an unexplained throughput curve as a substitute for showing occupied work and waiting callers.

Read the complete finished parent at port 4606, `/review/relational-rebuild/slow-queries/`. It already teaches pool versus database waiting, the lock-only pool cascade, request interval accounting, optional report containment, storage headroom and verification of recovery. This child begins with its established population distinction, then develops durable budgets and policy. It need not teach those diagnostic branches again.

## Example and arithmetic

Use Mina's customer-1 post-103 history read; it returns 103 pending then 101 paid on the small teaching rows. It changes no business facts. Optional reporting reuses the supplied paid-order line-value report and, if needed, its exact generated fixture. No old benchmark timing becomes a capacity observation.

The coordinator approved these local arithmetic assumptions on 25 October: stable admitted/completed throughput of 100 history reads/s with mean connection-hold time 40 ms gives mean checked-out population 4; a separate stable 200 ms case gives 20. The boundary begins at acquisition and ends at release. It includes application-held idle time and database waits, but excludes waiting to acquire. This is Little's Law, not evidence that a small capped pool can complete an impossible offered load, nor a proposal to set its limit to either mean. Peaks, variability, resource costs and tail objectives require validation. Keep a growing-overload example separate.

A possible global connection-budget arithmetic example, also authorised as local assumptions: ceiling 80, provision 8 connections for operational access and other essential users, leaving 72 application/background connections. Six simultaneous app instances at pool maximum 10 allow 60; adding a separate report pool of 8 makes 68. Eight instances during deployment overlap would make 88 including that report pool and exceed 72. These are planning allocations, not native reserved-slot configuration or a claim that 68 active reports/history queries fit the hardware. Account for all pools targeting that server and for the actual maximum simultaneous instance count. Native role/slot mechanisms stay with operations.

For headroom, explain net backlog clearance qualitatively or use a separately labelled constant-rate arithmetic model. Do not borrow the replica article's 600 MiB case as an application queue measurement. Do not prescribe a universal CPU percentage, pool formula, retry count or queue length. Tail deadlines cannot be inferred from mean Little's Law arithmetic.

## Sources checked, 25 October 2026

- [John D. C. Little, A Proof for the Queuing Formula: L = λW (1961)](https://pubsonline.informs.org/doi/abs/10.1287/opre.9.3.383?journalCode=opre): consistent system boundaries and stationary finite means; original paper also available from [MIT](https://fisherp.scripts.mit.edu/wordpress/wp-content/uploads/2015/11/ContentServer.pdf). Use the relationship, not a formal queueing derivation.
- [PostgreSQL 18 connection settings](https://www.postgresql.org/docs/18/runtime-config-connection.html): `max_connections` is a server connection ceiling; increasing it allocates additional resources; reserved slots support operational access. These are supporting examples, not the generic policy itself.
- [PostgreSQL 18 resource consumption](https://www.postgresql.org/docs/18/runtime-config-resource.html): memory is shared and local; `work_mem` can apply to multiple operations in one query and concurrent sessions, with extra hash allowance. Avoid “connections × work_mem is total memory”.
- [PgBouncer features](https://www.pgbouncer.org/features.html): session pooling holds server assignment for the session; transaction pooling releases at transaction end and requires compatible session usage. No exhaustive feature table or native deployment procedure is needed here.
- [Google SRE, Handling Overload](https://sre.google/sre-book/handling-overload/): requests differ in resource cost; admission, priority and resource budgets are stronger than undifferentiated QPS. The plan applies those principles to the established shop workload.
- [Amazon Builders' Library, Using load shedding to avoid overload](https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/): connection counts alone cannot protect changing workloads; test through overload and judge useful responses, including the cost of rejection.
- [Amazon Builders' Library, Avoiding insurmountable queue backlogs](https://d1.awsstatic.com/builderslibrary/pdfs/avoiding-insurmountable-queue-backlogs.pdf): backlog can prolong recovery; application queues are not free capacity.
- [PostgreSQL 18 pgbench](https://www.postgresql.org/docs/18/pgbench.html): scheduled arrival rates, schedule lag and separately counted late/skipped transactions illustrate why the generator must expose offered demand. General validation belongs here; command-by-command native benchmarking does not.

## Boundaries and continuity

Application SQL owns correct borrowing, transaction ownership, result consumption and returning one client. This article budgets their aggregate occupancy. The incident parent owns symptom-to-cause work; query execution owns plan repair; locks owns protected intervals and lock protocol; retries owns safe replay and uncertain commit outcomes; jobs owns durable deferment. Naming these routes does not make their full procedures prerequisites for choosing a bounded policy here.

Recovery headroom is generic resource budgeting. Replicas owns lag/catch-up, failover owns authority, cluster change owns movement and redundancy, schema change owns migration compatibility, and implementation operations owns monitoring commands, configuration and native intervention. A separate pool is admission isolation, not physical resource isolation. A caller timeout is not proof of stopped database work.

Continuity pass completed on the outline and example notes: no core rows, values, IDs or outcomes change; stable and overloaded cases remain distinct; connection allowance and effective work capacity remain separate. No unresolved ownership proposal. No implementation, builds, article review or publication performed.
