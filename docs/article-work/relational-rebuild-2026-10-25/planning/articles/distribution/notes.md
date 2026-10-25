# Distribution outline notes

This is a detailed outline within the accepted tree, with four existing contextual children. No changed or new ownership is proposed. No article prose, implementation, build, review or publication was undertaken.

## Reference exposure

Read all 19 bounded text parts separately using the supplied reader; every END marker arrived: sequences 1–6, indexes 1–7, storage 1–6. The supplied current breakdown, write and continuity skills were read. The complete assignment, commission, article record, neighbour records, incoming ownership, reading links and shared shop record were read.

Studied the finished 4584 drawings in an owned temporary IAB tab, preserving the current System theme and viewport: sequences, Replies and activation bars (Figure 2); indexes, Composite (multicolumn) indexes (Figure 7); storage, Write-ahead log (Figure 5). The comparison keeps its inputs visible, changes one choice and names the work or knowledge that changes. That teaching progression informs the outline; final figure design remains with the writer.

At the factual 4606 preview, read the introduction's More than one machine handover and the finished Replicas, lag and read routing and Table partitioning and data lifecycle articles. Their boundaries remain intact: this piece adds authoritative agreement within one replicated partition, while copied-history progress/read routing and single-instance table pruning/lifecycle stay with those neighbours.

## Example decisions and continuity

Use the core shop and explicitly hypothetical routing/placement arrangements. No new business rows, tenants, regions, prices, clocks or observed measurements are needed. Keep routing labels separate from business identity. The writer may choose a small placement map and must show it consistently; grouping related records requires an actual routing/co-location contract, not merely identical-looking key names.

For co-location, contrast order-owned work with customer-owned work using Mina's orders 101 and 103. Order lines and payments follow their existing order relationships. Do not silently add a customer_id column to their canonical schema. Keep product stock authoritative separately: co-locating a customer's orders does not duplicate the one last mug into independently spendable stock. Use the purchase-103 replay before its creation if drawing the stock changes: P7 1→0, P3 12→10, order 103 pending with two lines worth 29.00, no payment. This is independent of the later price replay.

For size skew, reuse only the supplied generated fixture's exact fact that customer 1001 owns 70% of generated orders. That fixture does not establish request frequency, hot stock, latency or actual distributed performance. Any request-load diagram needs separately labelled assumed inputs. Range/hash trade-offs are general models, not claims that native engines provide interchangeable schemes.

For replica agreement, use the separate P7 catalogue 20.00→22.00 replay; post-103 stock remains 10/0/4, order 103 remains pending with no payment and agreed value 29.00. Label three voters R1/R2/R3 and make this a Raft teaching model, distinct from the neighbour's primary/A/B copied-history model. Trace a new entry from the established leader's current term. State stable-storage/crash-failure assumptions. The outline requires sufficient election/history explanation, not a complete consensus implementation or proof. Preserve the distinction between a committed log entry and the atomic outcome of a multi-partition SQL transaction. No numeric log positions or timing claims are supplied.

Make visible: which existing facts each request needs; which owner each routing choice selects; what fan-out leaves to combine; what each voter durably retains before acknowledgement; and which communicating group can still decide. A single-partition operation can still involve remote replication. Several partitions sharing one machine is not a proof that their commit protocols collapse into one local transaction.

The continuity pass followed the outline from the parent's replica/shard vocabulary through ownership, work, agreement and the four deeper outcomes. It preserves the shared scenarios, identifies each model and introduces children only after establishing their motivating problem. No shared example extension or central reconciliation is presently needed.

## Primary-source checks

Checked 25 October 2026. These are mechanism checks for a plan, not execution evidence.

- [Ongaro and Ousterhout, Raft extended paper](https://raft.github.io/raft.pdf), Figure 2 and §§5.2–5.4, 8: stable state precedes RPC acknowledgement; leader/log/election rules preserve committed history. The current-term commitment restriction prevents teaching majority counting as a complete rule. Availability needs a communicating majority and workable leadership, not simply two running processes. Read authority is separate from having a copy. Native implementation remains outside this article.
- [Citus 13.0.1, Choosing Distribution Column](https://docs.citusdata.com/en/stable/sharding/data_modeling.html): distribution keys control co-location, routing and skew; global reporting combines work, and common keys remain concentrated. This supports the general choice framework. Citus-specific schema support, constraint restrictions and commands stay with Distributing PostgreSQL work.
- [CockroachDB, Distribution Layer](https://docs.cockroachlabs.com/docs/stable/architecture/distribution-layer): requests locate and contact the ranges owning keys; table/index entries and ranges need not share placement. Supports the distinction between the SQL entry point and participating data owners, and the costs of remote lookups. Native key encoding, metadata, splits and leases stay with Inside CockroachDB.
- [CockroachDB, Replication Layer](https://docs.cockroachlabs.com/docs/stable/architecture/replication-layer): confirms per-range replicated agreement and read authority as distinct responsibilities. The general article uses a labelled Raft model rather than implying CockroachDB's lease/read path is every distributed SQL engine's protocol.

## Boundaries for the writer

Transactions across partitions owns atomic-commit analysis and coordinator-loss recovery. Time, snapshots and distributed reads owns timestamp/clock uncertainty and safe-read methods. Regional placement and survival owns latency and failure-domain arithmetic. Rebalancing and cluster change owns membership transitions and movement procedures. The parent must make each concept usable before the contextual link without reproducing those methods. Failover and fencing remains the owner of primary/standby promotion procedures. Implementation comparisons and native observation belong to the PostgreSQL and CockroachDB routes. No unresolved ownership dependency blocks writing.
