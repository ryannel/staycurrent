# Failover and fencing planning notes

Draft outline for coordinator integration, 25 October 2026. Applied the supplied
staycurrent-breakdown procedure and continuity record. No article, implementation,
review, build or publication work performed.

## Exact exposure and teaching

Read `input/assignment.txt`, `commission.md`, `article.json`, `neighbours.json`,
`incoming-ownership.json`, `reading-links.json` and `shop-example.md`. Recovered
the initially clipped combined packet with complete separate reads.

Read every bounded reference part separately with
`scripts/read-writing-reference.py`: sequences 1–6, indexes 1–7, storage 1–6;
all 19 END markers received. Complete-text hashes were respectively
`722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c`,
`d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1`, and
`2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07`.

Studied finished drawings in owned temporary IAB tabs at the supplied 4584
reference routes, at their existing theme and viewport. Comparable teaching:
Sequence diagrams' Figure 6 changes one ordering while keeping the interaction;
Indexes' Figure 7 compares alternatives against one fixed question; Storage's
Figure 8 changes the failure cut and tracks separately what the application heard
and what survives. These suggest developing one transfer and its decisive
variations, with visible authority and history evidence. The outline leaves the
writer to develop prose and choose drawing design.

Read the complete rendered parent at
http://127.0.0.1:4606/review/relational-rebuild/replicas-and-read-routing/
and neighbouring backup article at
http://127.0.0.1:4606/review/relational-rebuild/backup-and-restore/.
The parent supplies H/U/C, receipt/durability/replay, acknowledgement policies,
read-history tokens and the explicit handoff to authority transfer. The backup
article supplies source closure, omitted-work classification and payment-504
reconciliation; this outline uses that understanding without repeating its drill.

## Primary sources checked

- [PostgreSQL 18: Failover](https://www.postgresql.org/docs/18/warm-standby-failover.html): exclusion of a returning primary, separate failure-management software, and recreating standby protection after promotion.
- [PostgreSQL 18: Log-shipping standby servers](https://www.postgresql.org/docs/18/warm-standby.html): asynchronous loss exposure; promotion applies immediately available WAL but does not obtain missing history by reconnecting to the former primary. Do not suggest that issuing promotion fetches every missing commit.
- [Patroni: Watchdog support](https://patroni.readthedocs.io/en/latest/watchdog.html): expiring leader authority must be coupled to preventing later commits. Process pauses, failed control software and slow shutdown can defeat ordinary demotion. Watchdog timing has explicit conditions; no generic lease duration or timing guarantee is proposed here.
- [Patroni: Replication modes](https://patroni.readthedocs.io/en/latest/replication_modes.html): promotion eligibility must match the acknowledgement promise; unsafe manual promotion can lose work. Synchronous settings alone do not make an arbitrary surviving candidate safe. The authority service's quorum and the placement of database commits are separate evidence.
- [Chubby, §2.4](https://www.usenix.org/legacy/event/osdi06/tech/full_papers/burrows/burrows_html/): delayed old-holder requests and recipient enforcement of sequencers. A token in a controller or request provides no protection if the affected write path ignores it. This is a bounded mechanism explanation, not a proposed PostgreSQL SQL interface.
- [ClusterLabs fence-agent API](https://github.com/ClusterLabs/fence-agents/blob/main/doc/FenceAgentAPI.md): fencing prevents a resumed member's I/O; an unsuccessful or unverified fence is not evidence of exclusion. Shared-storage fencing examples require shared storage and must not be presented as fencing an independent local database copy.
- [PostgreSQL 18: pg_rewind](https://www.postgresql.org/docs/18/app-pgrewind.html): divergent histories can be made to follow one source, with requirements and replay still necessary. Rewind replaces the losing branch; it does not reconcile its business operations. Native procedure remains elsewhere.

All scenarios are explanatory models, not observed executions or outage timings.
No source establishes a production recovery-time or zero-loss guarantee for the
invented topology.

## Example decisions and continuity pass

Reuse only the shared independent catalogue replay: P7.price 20.00 → 22.00,
symbolic change U and commit C in history H. Retain post-103 stock P3/P7/P9 =
10/0/4, pending order 103, no payment and agreed order-line total 29.00.

Local illustrative topology branches: the original primary can remain alive
beyond a partition; A's durable history includes C before its replay; B's history
is before C. A confirmed independent power-off plus controlled restart exclusion
can be the simple fencing example. An alternative where fencing cannot be
established must leave the transfer unavailable. These are local control and
history assumptions, not new business facts or observed services.

For the loss illustration, distinguish C retained by A from C omitted when B is
promoted without obtaining it. Preserve old C evidence before reinitialisation.
The price edit's intent can be assessed against the new authority; do not silently
invent another price, request token, payment or conflicting purchase. Any later
authoritative suffix may be drawn symbolically without inventing row contents.
Do not merge this successful-price experiment with the backup article's separate
2.20 mistake/payment branch. Use the backup reading for the detailed external
effect example if a contextual link is needed.

Continuity pass on the outline: authority and recoverable history are distinct
throughout; durable C is not yet readable until replay/new snapshot; history
identity remains necessary after promotion; local durability does not promise
survival on another copy. Reachability, timeout, election and address changes
are never substituted for evidence of write exclusion. Rejoin follows the chosen
history and does not reactivate the former role.

## Accepted ownership and remaining boundaries

No new child stub: the accepted tree makes this a general-outcome leaf. Native
PostgreSQL physical replicas and promotion remains under Inside PostgreSQL,
with configuration, commands, native timeline/position inspection, rewind
prerequisites and operating drills. This outline must not silently reparent it.

Backups owns restoration and detailed later-work/external-effect reconciliation;
this article owns what the transfer's branch boundary makes necessary and why
evidence must survive rejoin. Replicas owns read routing and progress;
retry-outcomes/outboxes own safe request repetition and dispatch protocols.
Distribution and cluster-change own consensus, membership and movement. A small
lease/token explanation here serves fencing judgement without duplicating those
formal subjects.

No shared business-fact or ownership change proposed. No unresolved scope issue.
The writer should link the accepted implementation and recovery owners
contextually, retaining planned status where applicable.
