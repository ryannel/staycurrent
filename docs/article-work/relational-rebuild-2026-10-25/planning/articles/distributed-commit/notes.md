# Transactions across partitions: planning notes

## Inputs and reference exposure

Read the supplied assignment, commission, article, neighbours, incoming ownership,
reading links, finished-reading list and complete shop example. Read the local
current breakdown skill and its write-reference procedure; used the continuity
skill for the outline's sequence and example check.

Read all 19 bounded parts separately with `scripts/read-writing-reference.py`,
with each END marker delivered: sequences 1–6, indexes 1–7, storage 1–6. The helper
validated the supplied source/text hashes. Inspected finished drawings in owned
IAB tabs on port 4584 at unchanged settings: sequence Figure 4's request/worker
ladder, index Figure 3's tree and table, storage Figure 8's failure-point comparison
including its completed after-flush state. Closed all owned tabs afterwards.

Teaching comparison: sequence work gives each question its own message path;
indexes exposes the same rows before explaining the mechanism; storage separates
what survives from what the application heard. Carry those methods into the
purchase and its failure points. The plan states what needs making visible and
leaves figure form, controls and prose to the fresh writer.

Read the finished distribution parent and retry-outcomes neighbour through their
supplied port-4606 browser URLs. Their factual/prerequisite context governs the
purchase placement and the request-recovery hand-off. No old bodies, plans,
reviews or feedback were read. A terminal HTTP attempt was denied by local network
permissions; the owned browser supplied both finished articles successfully.

## Example and continuity decisions

Retain the parent's independent replay from before order 103: customer shard A
owns Mina's pending order and lines; product shard P owns P3/P7. Success changes
P3 12→10 and P7 1→0, keeps P9 4, creates line 1 P7×1 at 20.00 and line 2 P3×2 at
4.50, total 29.00, and creates no payment. Abort retains none of this purchase.
Each new failure branch starts from that same pre-purchase state. It does not
follow the parent's independent catalogue-price experiment.

Use one labelled illustrative transaction identity, such as T, distinct from order
103 and caller key purchase-103. A/P denote owners, never machines or replicas.
Treat the two-owner figure as the displayed data work. Explicitly count any extra
constraint/index participants when reasoning about an actual implementation;
there is no claim that the drawing itself enforces global order-ID uniqueness.
No extra shared business facts, placement change or new article ownership is
requested.

The baseline teaching model may use classic two-phase commit with a fixed
participant set and durable state. A separate, explicitly labelled replicated
coordinator-state model can show failover recovery. Do not depict a second
coordinator as free to decide from memory, silence or a stale absence read.
Describe transaction visibility separately from physical application/cleanup;
separate reads straddling commit retain the parent's snapshot caveat.

## Consequential claims and primary sources

- [Gray and Lamport, Consensus on Transaction Commit](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/tr-2003-96.pdf),
  §§2–3 and 6.4: atomic outcomes, preparation, durable protocol state, classic
  coordinator-loss blocking and outcome recovery. This supplies the protocol
  model, not an asserted engine trace.
- [Corbett et al., Spanner](https://storage.googleapis.com/gweb-research2023-media/pubtools/1974.pdf),
  §§2.1 and 4.2.1: a concrete separation between consensus inside replica groups
  and commit across them; replicated transaction-manager state and restoration
  of prepared lock state after leadership changes. Use only as evidence that
  replication can protect the decision machinery; TrueTime and snapshot
  algorithms belong to distributed-snapshots.
- [PostgreSQL 18, PREPARE TRANSACTION](https://www.postgresql.org/docs/18/sql-prepare-transaction.html):
  durable preparation, completion from a different session and locks retained
  while prepared. It is intended for external transaction managers. This is
  supporting evidence, not a recommendation to hand-build a coordinator or a
  native procedure promised by this article.
- [CockroachDB, Transaction Layer](https://docs.cockroachlabs.com/docs/stable/architecture/transaction-layer),
  commit/cleanup and Parallel Commits sections: an implementation can make its
  outcome recoverable before all cleanup finishes and can optimise the normal
  commit path. Native STAGING/intents/recovery details remain owned by
  crdb-transactions; avoid teaching classic two-phase commit as its literal
  current execution.

Sources checked 25 October 2026. No measured latency, exact universal message
count, SQL execution result or cluster failure experiment is claimed. Native
verification is unnecessary for this conceptual outline. If eventual writing
adds observed behaviour or commands, the root arranges an owned disposable
verification before those claims are delivered.

## Ownership and delivery

No nested article is proposed: this accepted leaf owns the complete generic
atomic-decision explanation. Contextual onward reading stays with the existing
owners: retry-outcomes for logical requests; crdb-transactions for its native
protocol/errors; distributed-snapshots for compatible read histories; placement
for regional delays/survival; distribution for replica agreement and boundaries;
outboxes-jobs for external delivery. These are links, not reparented child stubs.

Continuity pass complete for the outline: prerequisites precede preparation,
decision precedes recovery, visibility precedes cost and application judgement.
No unresolved ownership or shared-fact change. Returned draft YAML for root
integration; no separate planning review, implementation, build or publication.
