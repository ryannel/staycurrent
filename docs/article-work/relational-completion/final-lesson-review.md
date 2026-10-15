# Final SQL lesson catalogue review

Reviewed 15 October 2026: all 29 lessons and 152 steps in the registry and the foundations, performance, operations, capacity, choices and PostgreSQL modules. This is a collection-level educational review, not another full execution run. The reviewer authored foundations and capacity, so the entries for those modules are a self-check; their separate independent article and lesson reviews remain necessary evidence. The other modules were written by other contributors.

## Reading the catalogue as a learner

Opened the actual site at localhost:4326 in Chrome. Followed Playgrounds → Browse SQL lessons, inspected the grouped catalogue and selector, followed the introductory query lesson, and inspected its setup, editor, expected-result disclosure and step controls. After the changes below, revisited the catalogue and visually inspected the new starting point. The registered PostgreSQL group was present in both selector and catalogue.

The subject groups match the article journey and are easier to scan than one long menu. Each card names an action, explains its purpose, gives a step count and links to its article. Titles such as “Find why a join doubled the total” and “Find what a recovered copy is missing” describe a problem a reader can investigate. The descriptive text distinguishes apparently similar copy, recovery and deletion experiences. The broad Playgrounds page provides a clear home for SQL and room for later technologies without tying that navigation to relational database internals.

There was one entry-point problem: the first group begins with constraints and JSON, while the easiest reading lesson sits in the second group. Added a short “New to SQL?” route above the groups linking to “From product IDs to an order”, followed by constraints and checkout. This preserves topic grouping for returning readers while giving beginners a concrete first step. The link and surrounding copy were verified in the live page and screenshot.

The runtime guidance explains that loading a step changes the editor rather than executing it, a connection persists across runs, and an implicit submitted batch is one transaction. Expected answers are in a disclosure so a reader can predict first. Reset and a fresh tutorial discard practice state. Starting a lesson supplies the standard shop; additional modules explicitly require running their own first-step setup. No lesson depends on completing another lesson’s database mutations.

## Repairs made

- Introductory queries now explicitly ask for a predicted total and give the numbers needed for the second-order variation.
- Constraints now asks the reader to try a negative quantity and then a valid positive one, inspecting the retained state after each. This distinguishes rejecting a write from undoing a prior committed write.
- Checkout now includes the insufficient-stock branch: request four units from stock of three, inspect the empty reservation result, roll back and verify that no order was created.
- Rollback now includes a valid-but-cancelled purchase. Changing the line to a valid quantity makes the intermediate read succeed; the later rollback still discards the pending purchase. This teaches that rollback is also a caller’s choice, not only error recovery.
- Pagination had described the INSERT as committed before a SELECT in the same submitted batch. The SQL is unchanged; the instruction now accurately says the SELECT sees this connection’s preceding INSERT and that the batch finishes before the next step. It does not claim a second session exists.
- The partition lesson now says “one database” rather than “one database server”, matching its embedded runtime while preserving the distinction from distributed shards.
- The PostgreSQL visibility variation now names steps 5–7 explicitly, including plan inspection before vacuum, standalone vacuum and comparison afterwards. “Repeat the previous two steps” was an ambiguous route from the last step.

No SQL blocks, ordering or lesson IDs were changed in this review. The new introductory variations were executed separately through raw simple-query protocol in verify-lesson-variations.mjs. All passed: negative quantity rejected with 23514 and preserved 3; positive 4 accepted; four-unit reservation returned no row and rollback left 3/0/0; a valid pending line allowed the intermediate read of 1 and rollback restored 3/0/0. Results are in lesson-variations.json. Other literal SQL and plan behavior remain covered by the existing module and integrated verifiers.

## Every lesson’s learning consequence

All entries were read in full, including SQL and expected answers. “Variation” below means an actual changed input, query or execution choice with a stated consequence, not merely an invitation to experiment.

| Lesson | Main observation and useful variation | State and scope judgment |
| --- | --- | --- |
| queries | Product IDs become names; line amounts become one total. Switch to the older purchase and retain its agreed price. | Fresh shop; read-only entry point; basic clauses and aliases explained. |
| constraints | A rejected update leaves the earlier committed quantity. Try -1 and then 4. | Standalone failure explicitly distinguished from an aborted explicit transaction; reset restores 2. |
| checkout | Reservation plus order and line become one committed purchase. Request too much and take the rollback branch. | Reader acts as handler on one connection; empty RETURNING blocks later purchase statements. |
| rollback | Failed line rejects subsequent reads until rollback. Make the line valid, then deliberately cancel anyway. | Open, failed and ended transaction states are visible; no compensating stock increment is suggested. |
| history | Agreed price survives catalogue changes while the joined name changes. Add another purchase and change current price again. | Independent fixture; distinguishes preserved facts from mutable display attributes and later correction policy. |
| json-rules | Missing, null, number and numeric string differ. Try fraction, zero, overflow, then a valid stored capacity. | Validation precedes conversion; failed migration requires rollback; setup restores state. |
| join-totals | Independent child matches multiply amounts. Equal legitimate amounts defeat SUM(DISTINCT). | Explicit original totals, null-extended empty order and at-most-one-row aggregates explain the repair. |
| pagination | Insertion changes offset positions but not the saved key boundary. Move an unseen row across the boundary and try timestamp ties. | One-connection changed-order model; saved key is explicitly not a fixed snapshot. Batch wording repaired. |
| index-selectivity | Same result can require different access work; broad reads may prefer scanning. Try several cutoffs and move an indexed value. | Known 20,000-row distribution; plans are observations, not a universal threshold or timing benchmark. |
| query-plans | Filtering, grouping and sorting operate at different row counts. Remove or narrow the filter. | Estimate and execution distinguished; output rows are not every row examined; loops qualification retained. |
| transaction-state | A Repeatable Read transaction sees its own pending write. Roll back a later 35 after committing 30. | Open connection and own-write visibility are explicit; no second-session snapshot or crash is claimed. |
| retry-identity | Only a new operation claim reserves stock. Reuse the key with changed quantity, price or customer. | Caller branches on RETURNING and verifies full request fields; model repeats a known commit, not a lost reply or deadlock. |
| performance-estimates | Changed distribution makes old estimates wrong without changing query correctness. Compare the selective indexed read with done rows. | Independent queue; preparation commits before final plan; heap fetches explained; no background analyze assumed. |
| request-batching | Batch child reads, then see why joining two collections can multiply work. Add another payment; ordered value must stay constant. | Caller/authorised IDs identified; this fixture does not measure network round trips. |
| report-freshness | Stored totals lag a correction to an earlier day. Change the amount again and refresh. | Materialized view is real; time-zone choice is already resolved in fixture dates; no speed claim from three rows. |
| schema-evolution | Backfill alone does not keep old writes current; a new-only record marks a rollback boundary. Change batch size or old-writer edit. | Sequential compatibility model, not concurrent lock testing; reader/writer retirement conditions are stated. |
| recovery-reconciliation | A structurally valid older copy can omit an acknowledged request. Keep the row count but corrupt its amount. | Receipts represent independent evidence; restore is a table model, not a backup tool or external payment replay. |
| least-privilege | Role, column grant and row policy impose different restrictions. Change the tenant policy and compare the same reads. | Administrator versus worker explicit; SET ROLE persists; expected denials are standalone; RESET ROLE returns authority. |
| deletion-and-copies | Live deletion leaves an older retained profile that a model restore revives. Repeat restore and deletion replay. | Foreign-key failure, complete transaction and retained deletion identity explain consequences; real backup/log scope remains outside the model. |
| replica-freshness | Durable-copy readiness and applied-read readiness differ. Stop before receipt or after receipt and compare recovery/read eligibility. | Ordinary rows explicitly model stages; numbered positions are not real WAL; new read and old snapshot distinguished. |
| partition-pruning | Date bounds exclude a real child relation; tenant-only predicate cannot. Try an uncovered date and duplicate a complete versus partial key. | Actual PostgreSQL partitioning inside one database; no distributed capacity or speed measurement implied. |
| shard-cutover | A live correction/delete defeats row-count validation. Skip replay and require cutover refusal; then test stale writer generation. | Explicit sequential ownership model; real admission coordination/fencing and post-cutover rollback limits are stated. |
| product-contract | Two-decimal storage rounds input; successful insertion can violate intended input policy. Try 18.004. | PostgreSQL-only acceptance observation, not evidence of other products’ behavior. |
| search-in-postgres | Generated terms change with the title. Compare matching blue cup with misspelled blu cup. | Language normalization separated from typo correction; tiny matching fixture is not capacity/relevance proof. The earlier confounded typo was already repaired. |
| copy-freshness | A stale offer is removed by recheck; retained version rejects an old active event. Try an authorised newer restoration. | Two-table model; full-state event assumption and atomic conditional replacement retained; no cross-service atomicity claimed. |
| pg-read-write | Index reaches a heap version; logical identity survives a changed physical location. Request the last single unit after a two-unit refusal. | One caller; explicitly commits only stock for a bounded storage demonstration, not a complete checkout. |
| pg-access-methods | B-tree ordering, GIN containment and BRIN ranges serve different requests. Change the expression and widen the time interval. | Real indexes; partial-page recheck and fixture-specific range size explained; not forced planner outcomes. |
| pg-visibility | Update changes row version and index-only heap work; vacuum changes visibility metadata rather than stock. Update another product and inspect before/after vacuum. | One connection, no independent old reader. Update and later plan are separate runs; VACUUM standalone; variation route clarified. |
| pg-wal-records | An uncommitted update generates WAL, and rollback does not erase that stream. Change its quantity and predict both views. | Insertion position is not flush evidence; real physical crash/power-loss guarantees explicitly excluded. |

## Repetition, article alignment and limits

There is useful recurrence rather than 29 unrelated demonstrations. Basic joins teach how lines acquire product names; join-totals then explains cardinality and equal-value traps. Request-batching uses that knowledge to evaluate an application response with two collections. It adds a caller, selected IDs and the tradeoff between fewer requests and multiplied rows. Removing it as a duplicate would lose that application-level question.

The four transaction-centered experiences also have separate jobs: checkout establishes the success branch, rollback makes the failed state visible, transaction-state isolates own-write visibility, and retry-identity governs repeated intent after a known commit. The PostgreSQL stock example then introduces physical version location and access paths, explicitly limiting its abbreviated purchase. These boundaries prevent an abridged storage experiment from silently replacing the complete checkout contract.

Freshness recurs with different obligations. A materialized report needs refresh after historical correction. A replication model separates durable receipt from apply. A search copy needs out-of-order full-state handling and retained withdrawal versions. Recovery reconciliation compares acknowledged operations with restored values, while deletion replay prevents an older copy reopening with suppressed identities. Those are distinct failure questions; their descriptions and fixtures make the distinction visible.

Verified every registered articleHref against source pages and, where present, exact anchor IDs. All 29 resolve. No backlink mismatch remained. Contextual article links supply deeper SQL and server explanation; the local practice guide remains the route for independent sessions and full server behavior. The sandbox does not imply that it executes MySQL, SQL Server, SQLite, true replication, physical recovery, live migration or simultaneous application sessions.

## Judgment

Ready from this educational catalogue pass after the bounded repairs. Setup, predictions, result interpretation and purposeful variations are present throughout. The advanced setup SQL is substantial, particularly migration and sharding, but each step tells the learner which state or response to inspect; those examples belong beside their detailed articles rather than at the beginner entry point. Resets are explained globally and locally, and deliberate errors have distinct interpretations from missing rows or successful empty updates.

Writing is clear and consistent across the catalogue: titles state practical tasks and instructions identify decisions the reader must make. Necessary model limitations are tied to specific false inferences rather than being generic disclaimers. This review did not rerun all lessons or replace the coordinator’s final browser/build pass. The first development-server browser run timed out during concurrent integration; catalogue navigation, setup controls and the repaired starter text were inspected afterwards. Full live execution coverage is recorded by the separate integrated browser check.
