# Example facts and continuity

The article reuses shared post-purchase stock10/0/4 and an independent price20.00→22.00 experiment. Order103 remains pending, agreed lines29.00, no payment. Native products/customers are explicitly projections; no order/payment is created by the verifier. P3/P7/P9 become450/2000/3500 before the separate update; actual final values450/2200/3500.

The application price protocol remains: expand nullable column; bridge reads price, writes both forms atomically; drain every old-only writer and in-flight transaction before backfill; reconcile coverage and exact price×100; switch reads; retain bridge return target; end return boundary when old representation stops being maintained. INT is CockroachDB INT8. Original finite nonnegative DECIMAL(8,2) domain retained for compatibility, with exceptions audited. No claim that disabling autocommit_before_ddl adds general DDL atomicity.

Loyalty-code starting values1=TEA-7;2=NULL;3=NULL follow shared record. Deliberate independent invalid assignment2=TEA-7 supplies failed-build counterexample. Local illustrative assumption: shop agrees2’s assignment is mistaken, so clear it toNULL. Probe unusedTEA-8, then clear again; final shared values restored. No global uniqueness policy beyond assigned string codes unique/multiple NULL allowed is introduced. No real correction authority or business record is implied.

Index drawing is a possible logical current-state ordering on products(price), includes P7’s independent22.00 update; internal merge versions and timing omitted. Actual generated workload is separate jobs_lab.workload(id1…40000,price=i%1000,payload128x), not generated shop rows. Ten updates increment IDs7…16. Primary/secondary totals40000/19980010 after first build; exact changed values8…17. Cancellation experiment changes the same ten workload rows again but is not used to claim the earlier total remains current.

No shared business-fact or ownership change proposed. General migration protocol stays with schema-change; index choice stays with crdb-performance; binary finalisation stays with crdb-upgrades. Incoming job-state/cleanup responsibility is fulfilled here.
