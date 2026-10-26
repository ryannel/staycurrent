# Redis transactions and Lua scripts — article 8

27 October 2026. Follow article 7's distinction between batching and atomicity.
Start with a real lost update. Reader must be able to locate the indivisible unit,
identify what a conflict aborts, and avoid interpreting an error as rollback.

## Teaching progression

1. Two workers increment the same cache-generation counter. Interleave their
   GET/SET steps: both save 11, one change lost. MULTI around already-computed SET
   does not repair the stale read. WATCH rejects one stale attempt; a fresh retry
   produces 12. Built-in INCR avoids the gap entirely. Visual holds the counter and
   two local observations in place while the protocol changes.
2. Follow a transaction's queue into execution. Preflight/queue error aborts all;
   runtime error leaves preceding writes and continues later commands. Compare a
   Lua runtime error: earlier writes remain, unhandled error stops later lines.
   Distinguish isolation from rollback by showing actual stored values.
3. Move read/check/write into a short Lua conditional fill. Show a generation
   change before vs after the script; no interleaving inside it, but source updates
   and downstream work remain outside Redis. A second work/cost comparison should
   make the server-wide waiting cost of scripts visible, not merely asserted.

Prefer three substantial experiments, with the script view joining conditional
behaviour and bounded occupancy if this stays legible. Every figure needs a
question/observable result, reversible controls and labelled assumptions.

## Primary evidence read

- https://redis.io/docs/latest/develop/using-commands/transactions/
  MULTI queues, EXEC serialises; queue-time vs execution errors; no rollback;
  WATCH detects modification including expiry/eviction, is connection-specific,
  watch before read and retry entire decision. EXEC/connection close clears watch.
- https://redis.io/docs/latest/develop/programmability/eval-intro/
  Lua executes near data without other command interleaving; keys explicit in
  KEYS, ordinary arguments ARGV; cached script SHA is ephemeral; NOSCRIPT handling
  inside a pipeline cannot simply reinsert a missing operation at its old place.
- https://redis.io/docs/latest/commands/eval/
  Current command reference explicitly says scripts loaded by EVAL/EVAL_RO can be
  evicted since 7.4; this qualifies the older intro's indefinite-cache wording.
- https://redis.io/docs/latest/develop/programmability/lua-api/
  redis.call throws, redis.pcall returns error for explicit handling; scripts only
  access Redis and supplied arguments, no source-database/network transaction.
- https://redis.io/docs/latest/develop/programmability/
  busy-reply-threshold is not automatic termination. SCRIPT KILL requires no writes
  yet; after writes cannot safely terminate through SCRIPT KILL. Keep scripts
  bounded by input size and command complexity rather than relying on that limit.

Pinned Redis 8.2.2. Current docs mention compare-and-set options and DELEX added
8.4; do not present these as available in the pinned baseline. Explain briefly
that newer releases may supply direct commands for custom-script use cases.

## Native lab to build

Private Unix-socket Redis 8.2.2, node-redis 6.3.0. Deterministic barriers between
separate clients, no probability-based race. Verify lost update, stale SET inside
MULTI, WATCH conflict and fresh retry, built-in INCR, queue-time abort, runtime
error with later success, Lua write then error without rollback, validated
conditional fill mismatch/success/missing generation, NOSCRIPT after SCRIPT FLUSH.
Keep evidence separate from the simplified browser models. Bound all processes;
only disposable private instance. Test exact client exception shapes.

## Publication gate

Source/native assertions, meaningful model invariants, full connected prose,
teaching review against both reference articles, keyboard and mobile/light/dark
visual inspection, required build and all model tests. Only then mark available,
link article 7, commit and push main; verify exact deployment and live controls.

## Implemented and verified

Four figures chosen to keep conditional atomicity and execution cost separate.
Complete prose, six model tests and six-file native lab. Sources include the Redis
distributed-lock guidance for the lease/fencing distinction. See article-08-review.md
for native, browser, reference-teaching and final build evidence. Publication next.
