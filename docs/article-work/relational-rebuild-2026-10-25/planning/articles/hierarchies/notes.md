# Planning notes

## Exposure and scope

Read the supplied commission, article, neighbours, incoming ownership, reading links and shared example. Read the current breakdown, write-reference procedure and continuity skills. All 19 bounded reference parts were read separately through `scripts/read-writing-reference.py` (sequences 1–6, indexes 1–7, storage 1–6), with every END marker delivered and source/text hashes checked by the helper.

Inspected finished drawings in three owned IAB tabs at the supplied preview, without theme or viewport changes: Sequences figure 2 (nested waiting), Indexes figure 3 (tree traversal tied to rows and counters), Storage figure 3 (one change represented differently). The tabs were closed. Their useful teaching pattern is a stable concrete case, one altered fact, visible intermediate state and a caption that states the inference. This plan identifies explanatory facts to make visible; the writer owns visual form and prose.

No main-repository bodies, old plans/reviews, other workers' notes or unassigned local material were read. No article, implementation, server, build, review or commit was produced. This is orchestrator-managed draft YAML; the eventual article receives the assigned independent review. No new child pages or ownership changes are proposed. Recursive traversal belongs here; elementary joins, general constraints, transaction theory, index internals and lifecycle policy remain with the accepted neighbours.

## Approved shared example extension

Coordinator approved centrally: introduce IDs 0 Catalogue (synthetic root), 10 Teaware, 11 Mugs, 12 Blue mugs, 20 Gifts. Baseline direct edges: 0→10, 10→11, 11→12, 0→20. The known names and ancestry are unchanged. Category identity stays separate from labels; no product membership is needed.

Independent variations, always reset to baseline:

- Move Mugs with Blue mugs from Teaware to Gifts: replace 10→11 with 20→11.
- Multiple parents: retain 10→11 and add 20→11. From Catalogue, Mugs and Blue mugs each have two routes, but one category identity.
- Reject 12→10, which would place Teaware beneath its existing descendant Blue mugs.
- Concurrent opposite moves: one attempts Teaware under Gifts while another attempts Gifts under Teaware, each checking the baseline first. This is an illustrative counterexample, not an observed execution.

Useful derived arithmetic for the writer to verify: baseline paths 0, 0.10, 0.10.11, 0.10.11.12, 0.20. Moving Mugs rewrites its path and Blue mugs' path. Baseline compact nested bounds in Teaware-before-Gifts sibling order: Catalogue (1,10), Teaware (2,7), Mugs (3,6), Blue mugs (4,5), Gifts (8,9). After the move: Catalogue (1,10), Teaware (2,3), Gifts (4,9), Mugs (5,8), Blue mugs (6,7). These bounds illustrate full rebuilding; they are not measured write counts. A chain of n categories has n(n+1)/2 reflexive reachability pairs by summing 1 through n.

## Primary-source checks

Checked 25 October 2026. These sources support mechanics; workload recommendations are deductions from the worked reads and changed rows, not measured universal performance claims.

- [PostgreSQL 18: recursive WITH](https://www.postgresql.org/docs/18/queries-with.html), sections 7.8.2–7.8.2.2: working-table evaluation; result ordering versus visitation; whole-row duplicate elimination; visited paths and CYCLE. Cycle handling in a query does not enforce acyclicity on writes. Keep this source's derived discussion concise.
- [PostgreSQL 18: constraints](https://www.postgresql.org/docs/18/ddl-constraints.html), sections 5.5.1 and 5.5.5: self-referencing foreign keys establish existing endpoints; a row check cannot enforce transitive, cross-row acyclicity. FK deletion action is an explicit design decision.
- [PostgreSQL 18: LOCK](https://www.postgresql.org/docs/18/sql-lock.html): a concrete conservative procedure can BEGIN at Read Committed, acquire SHARE ROW EXCLUSIVE on topology tables before validation, then read, maintain and COMMIT. This lock serialises writers and lasts to transaction end; take multiple tables in one fixed order. It blocks ordinary topology writes, but every accepted write must still execute validation. A lock acquired after a Repeatable Read snapshot does not refresh that snapshot.
- [PostgreSQL 18: isolation](https://www.postgresql.org/docs/18/transaction-iso.html), section 13.2.3: serializable execution is an alternative with whole-transaction retries on failure. Mention the choice and link to its owner; do not turn this article into another isolation tutorial.
- [PostgreSQL 18: ltree](https://www.postgresql.org/docs/18/ltree.html): labels form paths; ancestor/descendant operators include self; GiST supports hierarchy operators. The data type does not supply the application's missing-parent, single-tree or update protocol.
- [Bill Karwin: Moving Subtrees in Closure Table Hierarchies](https://www.percona.com/blog/moving-subtrees-in-closure-table/): tree closure includes reflexive paths; moves preserve internal pairs and change external ancestry through ancestor/descendant combinations. The author's DAG comment confirms that his tree procedure was not tested for shared ancestry. The plan therefore explicitly chooses distinct-pair rebuild from edges for DAG closure, rather than promising that tree deletion works there.
- [Joe Celko: Trees in SQL](https://www.ibase.ru/files/articles/programming/dbmstrees/sqltrees.html), an attributed reprint, plus the [publisher-hosted book chapter preview](https://www.oreilly.com/library/view/joe-celkos-trees/9780123877338/B9780123877338000124.xhtml): nested intervals and traversal numbering, subtree range queries and gap creation for insertion. Use the mechanics. Do not repeat the old claim that adjacency traversal requires a cursor, its normalisation claim about stable-ID self references, or its universal preference for nested sets.
- [Microsoft: hierarchical data](https://learn.microsoft.com/en-us/sql/relational-databases/hierarchical-data-sql-server?view=sql-server-ver17): hierarchyid encodes positions, changes across subtree moves and does not automatically enforce the desired tree. Optional comparison context only; full SQL Server implementation is not commissioned here.

## Maintenance and verification decisions

Prefer one verified, conservative PostgreSQL topology transaction for the worked procedures rather than several partially justified concurrency recipes. Lock topology tables in a fixed order before reading at Read Committed; validate all proposed edges, maintain direct and derived structures and commit together. Explain the concurrency cost. Do not claim that a self-parent CHECK, FK, CYCLE clause, trigger alone or locking only the moved row prevents every cycle.

For paths, explain stable-ID segments and prefix boundaries before any text predicate. A materialised path and a recursively accumulated query path are different stored/temporary uses. State inclusion of self for every query.

For closure, distinguish a reachable pair from every route. Tree depth is unambiguous; DAG routes may have different lengths. Tree incremental moves and a protected full DAG reachability rebuild are complete procedures with different costs. Removal of an edge must preserve ancestry still supported by another route. Rebuild-and-compare should check both missing and surplus pairs.

For nested sets, keep compact numbering's leaf/count arithmetic conditional on that convention. The practical move route is an atomic regeneration from authoritative edges, appropriate to the small, seldom changed example. Its full-tree rewrite is a deliberate cost, not an efficient incremental move claim. If the writer elects to teach an in-place gap/offset algorithm instead, it needs complete SQL, uniqueness-safe intermediate states and execution verification.

Writer/root verification remains necessary before showing observed SQL output or claiming a concurrency outcome. This planning assignment performs no native database execution. Check traversal direction, self inclusion, move rollback, rejected cycle, opposite-move concurrency, duplicate DAG routes, closure reconstruction and nested interval agreement on an owned disposable system. Rendered figures and controls are checked through the designated preview owner. No additional planning review is requested.

## Remaining boundary

The coordinator approved the root, IDs, baseline and four independent variations and will record them centrally. Preserve the core shop facts and imply no product membership. Concurrency outcomes require the stated complete protocol and isolation; no particular attempt is assumed to be the victim. No ownership boundary is unresolved.
