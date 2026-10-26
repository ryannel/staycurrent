# Article 4 — Cache invalidation and consistency

Next commission within the collection. Not drafted or published yet.

## Intended teaching arc

1. Start from one product at £12, source update to £15, and an in-flight reader.
   Reader steps: cache lookup/miss, source read (holds snapshot), cache fill.
   Writer steps: source commit, cache invalidation. Let the reader interleave
   actor steps, with presets for serial success, delete-before-write race, and
   stale refill after post-commit deletion. Show held value explicitly so no
   invisible read-after-write assumption is made. Reversible schedule inspector.
2. Explain post-commit invalidation closes the early-delete gap but not delayed
   fills, crash-between-systems, stale replica sources or uncovered dependencies.
   Define read-your-writes, eventual convergence and bounded staleness using
   concrete observations. Don't call cache-aside strongly consistent. TTL is a
   repair limit only under the preceding article's assumptions.
3. Generation-checked fill as a protocol that prevents one precise race. A unique
   opaque token belongs to the invalidation generation, NOT a data schema version
   or a source revision. Loader captures token BEFORE reading authoritative
   source. Atomic fill checks token still matches, then writes value with TTL.
   Invalidation rotates to a never-before-used token and deletes value atomically.
   Old held £12 cannot fill after rotation. Distinguish a rejected cache fill from
   the response already read by an in-flight request.
4. Delivery failures: source write plus invalidation notification is a dual write.
   Outbox row in same source transaction, replayable consumer. Delivery paused
   visual: committed source, pending events, old cache; resume drains invalidation.
   Duplicate deletes are safe, and delayed deletes cause extra misses rather than
   installing old payloads. No exactly-once or instantaneous consistency claim.
5. Close with choosing the contract: public browse vs own just-written view vs
   consequential authoritative action; dependencies/queries must be covered;
   durable delivery improves repair, generations close refill race, neither makes
   Redis and source a single transaction.

## Generation protocol details to preserve

Use two keys with same entity hash tag in native lab (cluster constraints explained
later). One guard token, one expiring cached value. All operations below atomic
Redis scripts; scripts are short. Avoid tonumber/source-version precision traps.

- Read/initialise: if guard absent, set fresh token and delete any surviving cached
  value; then return guard + cached value together. Guard missing never means a
  universal default token. Each initialisation uses a unique opaque token.
- Reader captures token from that atomic result. If miss, it reads authoritative
  source AFTER token capture. It may hold that snapshot while other work runs.
- Fill: if current guard equals captured token, SET value EX TTL; otherwise reject.
  Missing guard rejects. A rejected fill may simply be skipped; no retry storm.
- Invalidate AFTER source commit: SET guard to a fresh unique token and DEL value
  atomically. Every invalidation attempt, including duplicate delivery, gets a
  fresh token. Reusing an event's old token after a newer event can reintroduce an
  ABA match and is forbidden. Random UUIDs are practical unique tokens; lab uses
  distinct literal tokens to make steps inspectable, not as production generator.
- If guard is evicted independently, reads initialise a NEW token and discard any
  old value; old fills no longer match. Guard is not given the value's TTL, but
  eviction must still be handled. No claim that volatile/allkeys policies retain
  guards forever. Initialisation failure is a cache failure, not permission to
  bypass the guard check.
- Assumptions: every relevant source write triggers invalidation; source read is
  authoritative; unique tokens never reused; Redis operations are atomic on the
  same live primary history. There remains a commit-to-invalidation stale window.
  An in-flight hit can return after invalidation. Failover restoring an older
  guard/value history breaks the no-reuse assumption; do not claim durability or
  linearizability. Explain later replication/failover article handles this.
- Native worksheet should prove stale unguarded refill, guarded rejection after
  rotation, current fill accepted, missing guard rejects, reinitialisation with
  new token discards survivor and rejects older fill. Database snapshot simulated
  explicitly by held shell values; native Redis claims only for Redis steps.

## Primary research started 26 October 2026

Read https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside
(cache-aside source update then invalidate, consistency limitations).
Read https://redis.io/docs/latest/develop/programmability/eval-intro/
(atomic Redis script execution, blocking, client-side script lifecycle).
Read https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html
(dual writes, transactional outbox/CDC, duplicate and ordered delivery concerns).
Redis distributed locks URL redirected without contents; not a source and not
needed for this protocol. Do not conflate generation validation with a lock.
Continue with Redis Pub/Sub at-most-once primary docs, transactional source
semantics and authoritative consistency definitions as needed. Keep source-derived
summary modest; most of this article is original explicit schedule analysis.
