# Replicas outline notes

Draft for coordinator integration. Seven main headings; the only contextual child is the existing **Failover and fencing**. No ownership changes or new pages proposed.

## Inputs and reference exposure

Read the supplied commission, article, neighbours, incoming ownership, reading links and shop record, plus the current breakdown, continuity, figures and write skills. No repository bodies, earlier plans, reviews or other workers' notes were read.

Read all 19 bounded parts separately through `read-writing-reference.py`, with every END marker delivered: sequences 1–6, indexes 1–7 and storage 1–6. Hashes match the supplied manifest. Inspected finished drawings at port 4584 in owned IAB tabs: Sequence diagrams figure 2 (waiting and the 3 s variation), Indexes figure 7 (customer/date versus date/customer), and Storage and durability figure 5 (durable WAL before reply while the table file remains old). Used controls and compared visible states. No viewport/theme changes; all owned tabs closed.

The references lead through persistent objects, one-condition comparisons, visible state beside the caller's knowledge, and conclusions drawn from what changed. The outline names understanding to establish, leaving prose and drawing design to the fresh writer.

Read the new Storage and durability parent at `http://127.0.0.1:4646/review/article/` for factual context only. It supplies snapshots, commit history, durability and symbolic U/C records; it passes receipt/durable/replay and routing here, authority transfer to failover.

## Agreed example and continuity

Coordinator approved this conceptual extension during the assignment and will add its canonical note. Reuse the independent P7.price 20.00→22.00 replay, keeping stock P3/P7/P9 = 10/0/4, order 103 pending, no payment and agreed line value 29.00. Add no business rows, people, times or observed execution results.

One primary and read replicas A/B share a history identity. Symbolic U/C denote the price change and commit, not native positions. In the selected schedule A receives C, retains it durably, then replays it; a new snapshot can include the change while B remains before C. Reading A then B can show 22.00 then 20.00 in this one-change model. Neither query reads a torn transaction.

The illustrative token contract denotes required committed history. Qualify the actual target before its new snapshot: checking A does not qualify B behind a pool. An earlier retained snapshot can still return 20.00 after replay. Inclusion neither promises the latest state nor fixes a row's value against future writes. A bounded wait needs qualified primary fallback, an explicit inability to meet the promise, or an agreed weaker answer. A fixed sleep or old lag sample is insufficient. Carry observed history too when monotonic reads matter. Revalidate tokens across failover; bare positions are not comparable across arbitrary histories.

Continuity pass completed on the outline: progress precedes acknowledgement, acknowledgement precedes routing, and routing precedes failure. Snapshot rules and shop facts remain coherent. No native execution, benchmark or publication occurred.

## Primary sources checked on 25 October 2026

- [PostgreSQL 18, Log-Shipping Standby Servers](https://www.postgresql.org/docs/18/warm-standby.html), §§26.2.5–26.2.8: copied history, acknowledgement selection, waiting and asynchronous loss exposure. Synchronous participation does not qualify every read replica. The concrete model is physical replication, not a universal scalar-prefix claim.
- [PostgreSQL 18, WAL settings](https://www.postgresql.org/docs/18/runtime-config-wal.html#GUC-SYNCHRONOUS-COMMIT): remote write, durable flush and replay acknowledgements differ; `remote_apply` covers participating synchronous standbys.
- [PostgreSQL 18, Hot Standby](https://www.postgresql.org/docs/18/hot-standby.html), §§26.4.1–26.4.2: commit replay permits visibility to new snapshots; read resource competition and particular recovery conflicts can affect replay. Do not claim every long query blocks replay.
- [PostgreSQL 18, replication statistics](https://www.postgresql.org/docs/18/monitoring-stats.html#MONITORING-PG-STAT-REPLICATION-VIEW): distinguish sent/write/flush/replay evidence. Lag intervals describe recent progress and feedback, are not catch-up estimates and can become NULL when caught up and idle.
- [PostgreSQL 18, replication settings](https://www.postgresql.org/docs/18/runtime-config-replication.html): required history may disappear; an archive may supply it. Slot retention can exhaust storage. Upstream retention needs differ from replay backlog already held at a replica.
- [PostgreSQL 18, recovery information functions](https://www.postgresql.org/docs/18/functions-admin.html#FUNCTIONS-RECOVERY-INFO-TABLE): native names have exact semantics; `pg_last_wal_receive_lsn()` includes syncing to disk, not merely volatile receipt.
- [MySQL 8.4, GTID functions](https://dev.mysql.com/doc/refman/8.4/en/gtid-functions.html) and [GTID life cycle](https://dev.mysql.com/doc/refman/8.4/en/replication-gtids-lifecycle.html): transaction-set inclusion and bounded waits provide another mechanism. Sets can have gaps; filtering can retain identifiers without applying row changes. The symbolic contract is not a portable SQL API.
- [Terry et al., Session Guarantees for Weakly Consistent Replicated Data (1994)](https://pages.cs.wisc.edu/~remzi/Classes/739/Fall2016/Papers/bayou-sessions94.pdf), §§1–2: read-your-writes and monotonic reads are distinct; restricting eligible targets can reduce availability. Used for terms and reasoning, without importing Bayou's multi-writer mechanism.

## Boundaries and open points

This article completes general read-routing judgement, including target qualification and unavailable guarantees. **Failover and fencing** owns suspicion, authority, fencing, promotion, loss acceptance, divergence and return. **PostgreSQL physical replicas and promotion** owns native measurements, synchronous configuration, conflicts, retention controls and operating drills. **Sharding and distributed SQL** owns quorum agreement within a partition; synchronous acknowledgement here is not leader election. **Time, snapshots and distributed reads** owns common snapshots across shards; qualifying one copy does not establish one.

No further example extension is required. If the writer adds an exact time-based freshness bound, agree its evidence and unavailable-evidence behaviour first: no bound, heartbeat interval or timing has been supplied. Native procedures and measurements remain with their accepted owners. The outline remains unpublished and awaits ordinary article-stage review after writing.
