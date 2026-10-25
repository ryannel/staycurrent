# Chosen scenarios and continuity

Uses the agreed independent physical-storage/replica variation: P7 catalogue price 20.00→22.00, one primary and read replicas A/B following one identified history H. U/C are symbolic change/commit positions. A receives and durably stores C before replay; then its new snapshot sees 22.00. B can remain before C, yielding 20.00 on a later newly routed read. No measured LSN, transaction identifier, native time or replication rate is invented.

Order103 remains pending, no payment, mug unit_price 20.00, line total 29.00. Post-103 stocks remain P3 = 10, P7 = 0, P9 = 4. P3/P9 catalogue prices remain 4.50/35.00. No business effective/recorded time is added. The mistaken 2.20 is explicitly a separate branch, used only to explain that a live copy copies committed mistakes.

H:C is an illustrative required-history contract, not a claimed portable API or automatically returned SQL token. Qualification belongs to the actual target and precedes the new snapshot. Paths: A catches up; finite wait expires then qualified primary fallback; finite wait expires with no eligible target and explicit unavailable result. A timeout never silently weakens the contract. A→B routing with/without retained observed history distinguishes monotonic reads from read-your-writes. Later legitimate overwrites remain permitted by an includes-C lower bound.

Coordinator approved independent arithmetic model: 600 MiB backlog, 20 MiB/s replay, 10 MiB/s new log gives 10 MiB/s net drain and ideal 60 s; writes stopped gives 30 s; equal 20 MiB/s rates leave the backlog unchanged. These are fixed assumed rates in consistent units, not measurements, service guarantees or new shop facts.

Continuity reread: starts from commit history, durability and snapshot visibility; introduces replica, primary, three progress points, acknowledgement, qualified read, session-history bound, lag and retention in that order. Figures, controls, captions and text alternatives use the same outcomes. Position comparisons are qualified by history and topology. Reader instructions do not grant write authority to a current/reachable copy. Failover procedure, native standby controls and cross-shard snapshots remain with their assigned neighbours. Canonical reading links come from the supplied link index.

No unresolved shared-example dependency remains.
