# Capacity author check

15 October 2026. Author self-check and literal SQL verification completed;
independent review/rendered inspection remain pending with the coordinator.

The main page opens with resources and kinds of limits before asking the reader
to track tenants. A cache and a read copy are introduced as different ways to
avoid or relocate reads. The copied-record and disjoint-owner figures preserve
which tenant data each node contains. Neither adds new write capacity merely
because a second box exists.

Replication preserves the distinction between A committing, B saving the log and
B applying it. The acknowledgement table is conditional on configured synchronous
standbys. Read routing requires the confirming copy, a valid progress definition
and a suitable new snapshot. The promotion section explains why a timeout cannot
prove A has stopped, and why DNS changes do not fence existing write connections.

Partitioning supplies records before queries. A lower-inclusive/upper-exclusive
boundary explains the November record. The composite primary key is then tested
with a repeated order ID on another date; the article does not quietly change the
business rule to claim global uniqueness. The sharding discussion traces locality
from tenant IDs to related tables before adding cross-owner reports and rules.

The move history deliberately retains equal row counts despite a correction,
deletion and insertion. It makes count-only verification visibly insufficient.
The final boundary is a pause in admission plus drained earlier writers, not a
claim that background catch-up alone proves equality. Cutover checks complete
rows and refuses a mismatch. The subsequent write on B explains why retaining A
is not the same as having an immediately safe routing rollback.

Self-review repairs made before handoff:

- Fixed the backup link to the actual planned route `backup-and-restore`.
- Made source writes in the movement model consult the owner gate and create log
  entries only from their accepted `RETURNING` rows. The lesson explains the
  data-changing WITH clauses rather than hiding their role.
- Explicitly limited the sequential gate model: concurrent admission and cutover
  need a locking/fencing protocol. An EXISTS check against a routing row on its
  own is not offered as sufficient under concurrent writers.
- Kept actual partition execution separate from the replica and shard models.
  Neither model claims to create servers, reproduce network failure or measure
  durability.

The self-check is not independent editorial approval. The coordinator should
preserve a fresh top-to-bottom reading of the assembled pages, then verify the
phone/desktop figures and table/SQL scrolling in both themes. The repository’s
`pnpm build` remains part of the coordinated build pass.

All eighteen literal lesson steps passed through the raw simple-query protocol.
The actual October plan excludes the November child; the tenant plan includes
both. Missing December fails with 23514; the December repair succeeds; different
date/order-ID pairs coexist while repeating the complete key fails with 23505.
Freshness results distinguish saved position 2 from applied position 1, and only
the applied node qualifies for the modeled read requirement. The unreplayed
tenant-move variation finds four differing rows and refuses cutover; after replay
it finds zero. Replaying the fixed change set twice is stable. The stale writer
changes zero rows; the new writer changes only B. Every setup reruns successfully.
Exact responses are retained in `observed.json` and the checks in `verify.mjs`.
