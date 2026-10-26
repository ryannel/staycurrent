# Example and continuity

Baseline is the supplied post-order103 shop: customers1/2/3; productsP3/P7/P9 at4.50/20.00/35.00 and stock10/0/4; orders101/102 paid,103 pending; five order lines; payments501–503 and no payment for103. Agreement29.00 is independent of catalogue price. No currency is assigned.

Local scenarios only:

- Copy/link17→18 transfers retain all shop facts. Clone is a documented model, explicitly unobserved.
- Good handover closes source writers and required shop history; target-only P7price22.00 leaves old source20.00. No order, payment or stock changes accompany it.
- Address-only counterexample is an independent conceptual schedule. One old import connection commits sourceP7price22.00 after an apparent final comparison while target remains20.00. It stops handover; it is not a native concurrent-session observation.
- Native fixture adds only migration_marker(marker text primary key) and a standalone demonstration sequenceorder_number explicitly setto103. No order104 is created by observing nextval104. It is a helper sequence, not a silently added core-schema default.
- Rolled-back target validation updates price but retains no table change; sequence104 is consumed separately. The article accounts for sequence and external effects when judging return.
- PGlite counterexample reprices order103's agreed mug line and produces31.00, then rolls back. It stays separate from catalogue-only22.00, which retains29.00.

No shared business-fact or ownership changes are proposed. Stream setup/identity/repair remain with pg-logical-replication; restore commands remain with pg-backup; PostgreSQL-to-CockroachDB contract transfer remains with crdb-migration. This article owns upgrade choice, full service acceptance and one-authority handover.

Continuity pass reread the complete prose, captions, all options/stages, controls, SQL, results and bottom sources. Terms source/candidate/target/authority are introduced as roles; B is symbolic required source history, with no invented native position or timeline. The introductory statement distinguishes accepted source changes from initial-copy target transactions. Sequence setup is described as setup, not an observed allocation history.
