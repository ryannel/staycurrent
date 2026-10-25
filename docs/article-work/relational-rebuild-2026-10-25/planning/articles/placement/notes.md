# Regional placement and survival — planning notes

## Inputs and references

Read all supplied input files and the current breakdown, write and continuity skills. No main-repository material, old drafts/plans/reviews/feedback or other workers' notes were read.

Read nineteen bounded reference parts separately using the supplied helper: sequences 1–6, indexes 1–7, storage 1–6. Every END marker arrived without clipping. At the supplied 4584 previews, inspected and compared sequence Figure 10 (TLS round trips), index Figure 7 (customer versus customer/date index) and storage Figure 8 (before versus after flush). The references establish a visible example, change one assumption, then explain the changed consequence. Prose and visual design remain with the fresh writer. Owned temporary tabs were closed; viewport and theme were unchanged.

Read the completed parent and replica neighbour at the supplied 4606 URLs. The parent supplies customer owners A/B/C, shared product owner P, purchase 103's two data participants, fixed-majority Raft, authoritative history and quorum loss. The replica neighbour owns progress stages, history tokens and routing qualification. This outline applies that understanding to regional placement.

## Illustrative assumptions

Use fictitious **North**, **West** and **East** regions, with separately named zones. These describe locations, not customer residences, customer-shard names or the supplier-offer regions. No shared schema, business rule or starting row changes.

Quorum models use full, durable voting replicas, fixed membership and the parent's non-malicious crash/recovery and trustworthy-storage assumptions. Membership does not shrink after failure. Surviving voters must communicate sufficiently reliably and have adequate resources; quorum arithmetic does not promise an election or completion deadline. Witnesses, asymmetric quorums and native configuration restrictions are outside this model.

For a group of n voters, `q = floor(n / 2) + 1`. Removing domain D leaves `n - voters_in_D`; test whether communicating survivors reach q. Show independent candidate layouts, not a live membership-change sequence:

| Candidate | Voters | Majority | Whole-region loss |
| --- | --- | --- | --- |
| One region | Three North zones, one voter each | 2 | North leaves 0; one zone loss leaves 2 |
| Two regions | 2 North in separate zones, 1 West | 2 | North leaves 1; West leaves 2 |
| Three regions | 1 North, 1 West, 1 East | 2 | Any region leaves 2 |
| Five-voter extension | 2 North, 2 West, 1 East; separate zones within each region | 3 | Any region leaves at least 3 |

Five is not presented as a minimum for regional survival. A surviving copy can retain agreed history without a usable quorum. Replication still does not undo committed mistakes or replace backups.

For the single-command model, P has one voter per region and an established leader in **West**. Its catalogue-edit client is also in West. Optional assumed RTTs: West–North 40 ms, West–East 60 ms, North–East 80 ms. Ignore processing, storage and queues only for this arithmetic. Parallel replication can use North's 40 ms reply; losing North requires East's 60 ms reply. These are network floors for that illustrated round, not measured commit latencies. Do not estimate leader-loss recovery by RTT alone. The separate P7 price 20.00→22.00 replay retains post-103 stock 10/0/4, pending order 103, no payment and agreed lines totalling 29.00.

For the independent purchase replay, use the parent's before-103 state. Application and customer-shard A leader are in North; P's leader is in West. Both product rows remain on P, preserving two data owners before any constraint/index participants. Success creates the exact pending order and two lines, decrements P7 1→0 and P3 12→10 and creates no payment. Do not infer a portable transaction latency by summing a fixed count of consensus rounds; implementations overlap and optimise work differently.

A hypothetical global order-ID uniqueness owner in East supplies an optional extra dependency. It is a mechanism assumption, not a new business rule or valid duplicate order. `(1,103)` and `(2,103)` remain the parent's invalid duplicate-ID counterexample. A declared remote index/reference alone does not prove one native message path.

## Primary sources

Checked 25 October 2026:

- [Raft extended paper](https://raft.github.io/raft.pdf), section 2 and sections 5.2–5.4: majority progress conditions and preserved log history. Domain-removal arithmetic is a derivation under this model, not the entire safety proof.
- [CockroachDB survival goals](https://docs.cockroachlabs.com/docs/stable/multiregion-survival-goals), region failures: concrete two-plus-two-plus-one placement and remote coordination cost. Native settings stay with crdb-locality; the three-voter comparison is not a CockroachDB recipe.
- [Spanner replication](https://docs.cloud.google.com/spanner/docs/replication), replica roles and reads/writes: voting versus read-only roles and read-contract effects on communication. Do not generalise Spanner's specific read-only or witness behaviour to every engine.
- [Life of Spanner Reads & Writes](https://docs.cloud.google.com/spanner/docs/whitepapers/life-of-reads-and-writes), single/multi-split writes: separates within-owner replication from coordination across participants. No stage count or timing is borrowed.
- [Spanner foreign keys](https://docs.cloud.google.com/spanner/docs/foreign-keys/overview), performance and backing indexes: enforcement can require extra requests and index work. The East uniqueness owner remains explicitly hypothetical.

The Google Research Spanner landing page was also consulted; no additional claim is used. No execution or performance observations are asserted.

## Continuity and ownership

Continuity pass retained distinct region/shard names, independent topology alternatives, correct replay starting states, durable/applied/authoritative distinctions, and per-group then whole-request survival reasoning. Historical reads never grant stock authority. Network inputs remain assumptions.

No new nested article or ownership change is proposed. Accepted deeper owners remain distributed-commit (atomic decisions/recovery), distributed-snapshots (safe common history), cluster-change (movement/membership), replicas (progress/read routing) and crdb-locality (native settings/evidence). Use contextual links at those questions. No shared business-fact change needs reconciliation. Root owns preview, build, integration and eventual article review.
