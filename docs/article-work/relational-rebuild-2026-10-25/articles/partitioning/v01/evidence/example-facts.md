# Example continuity

Independent partitioned-copy scenario approved in supplied record: exact generated 2026 workload, core three orders preserved, 120,003 order rows and 360,005 lines. No generated payments. Order-line values are agreed values, not payments received. Customer 1001 receives 70% of generated orders; hashing customer identity cannot divide that customer's rows among hash buckets.

Monthly boundaries are half-open UTC ranges. Exact boundary probes and duplicate-key probes use isolated disposable tables and do not add business facts to the report copy. Coordinator approved reusing 103 in key_demo at 2026-11-01 00:00 UTC and an out-of-range probe; correcting its probe timestamp to 2 November tests movement/reference behaviour. They are attempted counterexamples, never new shared orders.

The finished query-execution fixture was supplied byte-identically as input/generated-shop-fixture.sql, SHA256 157cec087588c360694e13ac3d7884a36a261957ed600121232ceb75d9947568. Generated timestamps use 2026-01-01 12:00 UTC plus the specified day offset, not midnight. Every row and occurrence in orders_monthly is compared with the original before reports and retirement.

Retirement model is independent of report measurement: hypothetical approved cutoff 2026-02-01 00:00 UTC makes all January rows eligible; 2026-01-15 does not. The policy must cover related lines, payments, history/external records and recovery copies; this article supplies no legal outcome or retention duration. Detachment removes parent-table membership but leaves the detached table's rows stored.

Global meaning of order_id remains distinct from uniqueness of (order_id, placed_at). The report copy's composite key is not a proposed replacement for the original transactional schema or its foreign keys. Live conversion and sharding stay with their designated neighbours.
