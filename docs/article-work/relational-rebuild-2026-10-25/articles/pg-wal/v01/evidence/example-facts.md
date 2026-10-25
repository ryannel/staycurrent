# Example facts and continuity

Uses independent physical-storage price replay: P7 catalogue price 20.00 → 22.00. Post-103 stock is P3 10, P7 0, P9 4; order 103 pending, no payments, agreed mug price 20.00, line total 29.00. Does not import business effective/recorded times or native addresses from other scenarios.

Local drill assumption: concurrent connection attempts P9 35.00 → 36.00 and never commits. This is temporary unfinished work, not a shared baseline extension. A technical evidence_marker row forces the earlier WAL forwards after the unfinished update returns. It is not a shop order/payment. The isolated native fixture includes only the products and order-103 projection necessary for its checks; it does not claim to recreate the whole shop database.

Figure U/C/R/K are symbolic records/positions. Illustrative pg_lsn arithmetic is 0/1600040 − 0/1600000 = 64 bytes; not measured update cost. Checkpoint page A/B and selected schedules are invented. No diagram output is asserted to trace the native run.

Separate mistaken 2.20 variation appears only when choosing a recovery mechanism. No accidental transition from successful 22.00 replay into that branch. Backup/restore and synchronous-standby procedures stay with their designated neighbours. Native settings, restart, and counter interpretation are taught here as incoming ownership requires.
