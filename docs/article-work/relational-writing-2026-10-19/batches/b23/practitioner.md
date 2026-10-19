# Practitioner review — b23

## a23 — Connecting transactions to background work and events

**Verdict: PASS.** No required repairs or optional changes requested from the practitioner perspective.

Read the complete article, context and actual family plans, actual a04 parent and recently reviewed a20/a21/a22 siblings, complete native harness and retained evidence, all five scene models and renderer, source ledger and writer handoff. The article develops the parent's useful first durable-intent case into an executable claim/call/completion boundary. It owns external uncertainty, attempt versus operation identity, replay-safe input and payload meaning, while leaving transaction concurrency theory, connection cleanup, caller request recovery, schema rollout, history policy and monitoring procedures with their owners. Its bounded capture comparison supports the original relational-practice goal without becoming a connector or messaging syllabus.

The correctness distinctions hold throughout: committing intent is not delivering it; receiver acceptance is not shipping; an expired lease does not stop an old call; conditional completion fences the database row rather than the external receiver; and source progress is evidence only for the hand-off that saved it. The deliberate current-state pointer is not presented as an immutable historical fact. An ORDER BY in a concurrent claim query does not promise publication order. Operation scope, input matching, retained receiver result and expiry remain obligations of the actual receiver contract.

### Independent native execution

Ran the inspected worksheet using Node 24.16.0, pinned pg 8.23.1 and PostgreSQL 18.6, changing only its accepted database-name prefix in a temporary copy. Fresh database: `rel3_prac_a23_1792462001`. Own full output: `/private/tmp/rel3-prac-a23-native.json`.

All eleven cases passed; a separate comparison established that the complete case results match the retained evidence:

- Rollback retained neither order nor instruction; commit retained both. An actual child process exiting after a bare order commit left no instruction. A synthetic receiver acceptance survived database rollback.
- Competing claims skipped a locked candidate and could not take a committed unexpired claim. Explicit lease expiry admitted attempt 2. Old A could still reach the receiver, but its attempt-1 completion returned zero rows; B's current completion returned one.
- Actual child exits after claim and after acceptance left discoverable claimed work. After acceptance, replay used the stable operation identity and recovered R1: two requests, one synthetic acceptance.
- A deliberately destroyed receiver response left acceptance uncertain to the sender; matching replay returned the retained result, changed input returned 409, and the separate nondeduplicating route accepted twice despite the same operation key.
- The payload/current-order demonstration and attempt cap agreed with the retained results. Three abandoned claims admitted no fourth; the sweep moved the record to unresolved.

The short claim uses the row lock inside its candidate CTE, increments the attempt and commits before the call. Completion checks state, owner, attempt and lease. The SQL and harness agree. Child modes are real bounded process exits, not merely labelled branches; the synthetic receiver counts and retains its acceptance before deliberately losing a reply. The receiver's in-memory, single-run contract is explicitly narrower than durable provider deduplication. Expiry is deliberately advanced in fixture rows. Neither is represented as an executed production scheduler or provider guarantee.

The rehearsal returned zero remaining database sessions, removed its database and closed its ephemeral loopback receiver and child workers. No shared server settings, roles, dependencies or retained evidence were changed.

### Primary claims and models

Checked the consequential queue and capture claims against [PostgreSQL SELECT locking](https://www.postgresql.org/docs/18/sql-select.html#SQL-FOR-UPDATE-SHARE), [logical decoding concepts](https://www.postgresql.org/docs/18/logicaldecoding-explanation.html), [output-plugin callbacks](https://www.postgresql.org/docs/18/logicaldecoding-output-plugin.html), [logical replication restrictions](https://www.postgresql.org/docs/18/logical-replication-restrictions.html), and the [AWS outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html). SKIP LOCKED's inconsistent queue view and table-lock caveat are accurate. Exported snapshot boundaries, possible recent-change replay after crash, retained source resources, ordinary committed callbacks versus optional in-progress streaming, and built-in DDL limitations are correctly qualified. Capture and provider durability remain documentation-based requirements, with no invented execution evidence.

Independently enumerated all thirteen variants and 78 complete source frames, with boundary assertions for obsolete completion, receiver effect counts and capture replay. Then exercised all 78 rendered states in the immutable 4439 preview. Cards, causal steps, observer evidence and endpoint results agreed with the source and prose. Changing scenarios retained the current step and changed its causal labels/cards consistently. Visually inspected the slow-old-worker intermediate comparison: B owns attempt 2, A's completion returns zero, and A may still have reached the receiver. The capture model labels its positions as placeholders and keeps downstream completion separate.

The evidence appropriately excludes full stock/item correctness, tenant enforcement, a real provider, durable receiver restart, broker/capture execution, source-log expiry and projection rebuild. These exclusions leave the article's stated relational boundary intact. This is a practitioner correctness and scope pass; the independent teaching perspective owns playback pacing and wider interaction quality.

Article snapshot/rendered bytes and all three manifest component hashes remained unchanged. Browser tab closed; preview released.
