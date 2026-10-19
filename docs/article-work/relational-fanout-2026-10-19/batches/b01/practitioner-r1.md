# Practitioner review — b01, round 1

Perspective: independent practitioner coverage and depth under `staycurrent-review`.

Inputs: the original relational-practice commission; the batch manifest; the assigned round-1 plans and contexts for a01, a02 and a03. No other review report or earlier relational coverage map was read. This review judges planned decisions, depth and boundaries rather than unwritten prose, figures or execution evidence.

## a01 — Designing relational data

**Verdict: pass. No required repair.**

The plan contributes the design competence needed by the original commission: translating ambiguous application requirements into row meanings, identity, cardinality, value representations, enforceable rules and lifecycle behaviour. It does not mistake adding an identifier for defining identity, or normalisation for following a list of formal rules. Its final schema review connects design choices to representative reads, changes, tenant boundaries, history and deletion.

The four child stubs have identifiable practical payoffs. Types and missing values prevent representational mistakes; constraints distinguish stored guarantees from application intentions; normalisation and deliberate redundancy establish ownership and maintenance obligations; history and lifecycle modelling define what later queries can truthfully answer. Each is bounded by concrete engineering decisions. None currently requires a separate specialist curriculum.

The plan also preserves important interfaces with the rest of the commission: transaction protocols own concurrent multirow enforcement; performance validates the cost of redundancy; evolution owns live changes; operations owns recovery and removal beyond live tables. The schema review's inventory of database, transaction and application responsibilities is a useful integration point rather than extra theory.

**Conditions for descendants, not additional scope:** retain tenant scope in both uniqueness and references; preserve the distinction between an agreed historical fact and an accidental duplicate; and make every derived copy's ownership, freshness and repair path concrete. These are already promised and need no new branch.

## a02 — Working with SQL

**Verdict: pass. No required repair.**

The plan supports expert relational use through query meaning and verification, rather than a syntax inventory. The result-row contract, hand-calculated expected results and adversarial fixtures provide a consistent way to establish correctness across joins, aggregation, composition, window calculations and changes. The progression reaches substantial application and reporting queries while keeping physical execution in the performance branch.

The child stubs earn their depth through consequential failure cases: null-sensitive membership, multiplicity and double-counting, scalar cardinality, recursive cycles, window peers and frames, and changes with ambiguous source matches. These are useful practitioner decisions, not depth pursued merely because SQL offers the feature. The bounded recursive traversal and selected reporting calculations appropriately avoid separate graph and analytical specialisms.

Pagination is kept in the parent with a stated traversal contract and explicit concurrent-change effects, which is sufficient at this planning level. Modification work accounts for zero and multiple matches, postconditions, conflict-handling differences and transaction hand-offs. Production corrections and backfills remain with evolution; request retries remain with application integration.

**Conditions for descendants, not required repairs:** examples must continue to identify engine-specific behaviour at first use, and the intended duplicate, ordering and null policies must remain observable in the checked results. The current plan explicitly requires both. Passing result checks must not be presented as proof of acceptable cost; the closing section already makes that boundary clear.

## a03 — Making concurrent changes correct

**Verdict: pass. No required repair.**

The plan takes the right practitioner unit of reasoning: a stated invariant, all its writers and the guarantees that cover each way the invariant can fail. The sequence from conditional single-row changes through declarative rules to multirow coordination makes readers choose protection for a problem rather than pick an isolation label by habit.

The two child stubs supply justified depth. Explicit lock design is about covering rows, missing rows, predicates and alternative writers; isolation testing is about deriving application obligations from concrete engine contracts. The representative PostgreSQL/InnoDB comparison has a clear decision-based boundary and does not promise vendor-specialist completeness. The parent retains enough of both to explain the basic choice without requiring every reader to enter both children.

The plan covers the major interfaces needed for the original commission: whole-transaction reconsideration after relevant aborts; business rejection versus known abort versus unknown commit outcome; durability as a stated failure contract; and the external-effect boundary. It hands driver behaviour, request retry budgets, idempotency and reconciliation to application integration and service recovery to operations. Controlled sessions support a correctness argument rather than replacing it. These are sound scope and evidence boundaries.

**Minor hand-off clarification:** under “Let the database reject invalid states where it can”, the brief refers to data design for constraint “deployment procedures”. The a01 plan correctly assigns adding constraints to an existing live database to evolution. When linking the finished work, point constraint modelling to data design and live deployment to evolution. This is a local reference clarification, not a missing topic or a reason to block recursive planning.

**Condition for descendants:** preserve the difference between abstract illustrative schedules and recorded engine runs, including version, settings, observed result and the protection or retry obligation inferred from it. The isolation child explicitly promises this evidence; no technical claims or executable examples exist here to verify yet.

## Batch assessment

All three plans make distinct, necessary contributions to the original relational-practice goal. Their boundaries leave a useful route from schema meaning, through SQL result meaning, to concurrent application correctness. No additional article is required by this review, and no required repair prevents proceeding to the next breakdown level.
