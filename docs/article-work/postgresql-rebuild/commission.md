# Rebuild the PostgreSQL branch

Commissioned 15 October 2026 after the user found the published branch too shallow.
The user explicitly authorises substantive rebuilding, supporting articles,
diagrams, practical lessons, deep review, and committing and pushing to main.
This supersedes the earlier four-page completion judgment; those review records
remain historical evidence, not approval of the new work.

## Reader and purpose

An application engineer understands basic SQL and relational transactions, but
does not already know PostgreSQL's implementation. Explain enough mechanism for
this reader to derive a worked outcome, predict a changed condition and make a
better design or diagnostic decision. A paragraph that names the subsystem and
states its benefit does not fulfil that purpose. Length is not the acceptance
criterion; the reasoning that produces the answer is.

Use PostgreSQL 18, the stable major verified against primary sources on this date.
PostgreSQL 19 is a release candidate. Identify extension versions independently.
Keep browser observations, server observations and schematic models distinct.

## Connected reading

| Route suffix under postgresql/ | Investigation |
| --- | --- |
| architecture | Follow one read and committed change through backend, memory, index/heap pages, visibility, locks, WAL and cleanup. Teach the connecting mechanisms here before offering deeper paths. |
| query-execution | Resolve and plan a query, then expose parameter-sensitive custom/generic plans, executor demand and blocking work, memory and parallel resource consequences. Build on, rather than repeat, the family join-method article. |
| indexes | Derive B-tree descent/ordered access, GIN extracted keys and candidate combinations, BRIN range elimination/rechecks, and the operator-class/write consequences. |
| row-versions | Derive snapshot visibility, inspect retained versions, follow HOT/index references, distinguish cleanup eligibility from throughput, and connect visibility maps/freezing/autovacuum to diagnosis. |
| recovery | Trace a changed page and WAL through commit, flush, checkpoints and restart, including page redo progress, full-page images and the distinction from backup/PITR. |
| replication | Follow physical and logical replication, read routing, replay and retention; work through failover, fencing and rejoining with PostgreSQL-specific evidence. |
| sharding | Choose a distribution boundary, trace local and cross-shard work, and examine constraints, hot tenants and movement. Distinguish native partitioning, FDW, Citus and compatible distributed systems. |
| json | Derive JSON containment/path results, index the actual expression, and connect flexible records to typed invariants and update/storage costs. |
| full-text-search | Follow documents into lexemes/positions, query matching, candidate retrieval and ranking; test phrases, field weights, filters and mismatches. |
| vector-search | Establish exact filtered neighbours, then understand and measure approximate retrieval, recall and relevance; identify pgvector as an extension. |
| extensions | Use range/exclusion booking and a bounded spatial query to explain types, operators and indexes working together; make installation and lifecycle dependencies concrete. |

There are three entrances: internals, distribution, and richer queries. Readers
interested in search need local orientation, not a prerequisite to finish every
storage chapter. Existing family articles remain useful background. The parked
distributed-systems programme is not activated by this PostgreSQL commission.

Independent planning challenge found this tree defensible with these boundaries.
It identified the old snapshot decision, GIN candidate combination and page-redo
explanations as missing mechanisms. The main and row-version rewrites form the
first depth checkpoint before accepting the remaining chapters.

## Work queue

- [x] Inspect the actual reading, original promises and independent planning challenge.
- [x] Establish a versioned primary-source research plan and article ownership.
- [x] Rebuild the main and row-version explanations; inspect their worked reasoning.
- [x] Develop query execution, indexes and recovery with diagrams and tested examples.
- [x] Develop PostgreSQL replication and sharding with explicit system boundaries.
- [x] Develop JSON, text, vector and richer-type investigations.
- [x] Integrate and execute practical lessons and isolated server experiments.
- [x] Independently review technical claims, continuous reading, depth and diagrams; repair findings.
- [x] Inspect desktop/phone in both themes, test the sandbox and routes, and build.
- [x] Commit, push and verify deployment.

Authors own their prose, examples, evidence and diagrams. The coordinator owns the
registry, shared lesson imports, shared styles, continuous-reader coordination and
publication. Preserve unrelated local files. Do not commit until the commissioned
deep review is complete.

## First depth checkpoint

The rebuilt main traces a real product lookup through page-item indirection,
shared buffers, snapshot choice, a waiting conditional writer, WAL ordering and
cleanup. The coordinator accepted this explanation as the basis for the remaining
chapters, with repairs to supply the reservation SQL before its first schedule and
make all three onward reading paths visible. This is an authoring checkpoint, not
independent review approval.

The row-version chapter derives snapshot 784:786:784 from an observed overlapping
transaction experiment. It follows the same heap slots through a HOT update, retained
vacuum and redirect cleanup; contrasts an included-column index; and distinguishes
all-visible from all-frozen state. `verify-versions.mjs` and `versions-observed.json`
record the isolated PostgreSQL 18.6 run. `snapshot-lesson-observed.json` records
browser-engine assertions for the complementary explicit-snapshot lesson.

The server lab was created under `/private/tmp/staycurrent-pg-rebuild`, with Unix
sockets only, port 55438, local trust and rejected host authentication. It is a
disposable authoring cluster, not the Homebrew default cluster or a running service.
Each author uses a separate database or separately owned temporary cluster.

## Publication

Commit `6069e2d` was pushed to main after independent technical review, the uncued
reading, repairs and the final continuous editorial reread. GitHub Pages run
[38809630051](https://github.com/ryannel/staycurrent/actions/runs/38809630051)
completed successfully. The public-site check then loaded all eleven chapters,
confirmed their published state, fetched both downloadable experiment files and
executed the extension-backed booking lesson through setup, adjacent acceptance
and overlap rejection. `live-verification.json` records the result.
