# Teaching review · article · a00 and a03 · 26811e2

Inputs read: both complete current articles, `src/articles/relational-trial-3/{a00,a03}.astro`, their imported teaching figures, SQL listings and all scripted step text; the complete Sequence diagrams, Indexes and Storage and durability reference articles, including their rendered figure text; the root, relevant parent/sibling/child plans in `docs/coverage/relational-2026-10-19.yaml` and the corresponding briefs, ownership and section structure in `docs/article-work/relational-writing-2026-10-19/registry.json`; the commission supplied with the assignment. Repository instructions also required reading `README.md` and `docs/site-direction.md`; these supplied repository scope, not additional teaching criteria. Applied `staycurrent-review` and its teaching perspective at 005ab6f; the working files match those versions. Withheld: the running-example record, earlier articles and reports, repair decisions, writing/run/results notes and other review perspectives.

Highest severity: none

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | a00 introduces tables, identity, relationships and SQL before relying on them; a03 explicitly establishes its parent prerequisite and explains invariants, snapshots, locks and serialisability as each becomes necessary. |
| 2. Order | pass | a00 follows stored facts through a checked answer, protected change and operational boundaries; a03 repairs one-row decisions before explaining views and the harder cross-row decision. |
| 3. Examples | pass | The shop carries both pieces; multiplied payments, a duplicate booking, conflicting buyers, a stale count and the two instructors expose distinct awkward cases with explicit starting states. |
| 4. Showing | pass | Tables make joined multiplicity and snapshot/count differences inspectable; changing committed state is separated from pending work in the races, partial failure and instructor histories. The lock/count history supplies a worked event table for its command-boundary subtlety. |
| 5. Judgement | pass | a00 leaves a defensible conditional shortlist and rejection tests; a03 connects the shape of the invariant to constraints, conditional changes, coordination or serialisable decisions, with abort and evidence limits. |
| 6. Gradual exposure | pass | Both give usable answers before their contextual hand-offs. a00 bounds each branch; a03 completes its ordinary and cross-row repairs while leaving comprehensive locking, isolation, request-recovery and external-delivery protocols with their owners. |
| 7. Placement of additions | pass | Both named additions belong at their present level and point in the argument; ownership and placement are assessed individually below. |

### Placement of the named additions

- **a00, Specialist features and ecosystem / evidence-table cell:** checking that the application's database library preserves exact prices in both directions belongs in the root's requirement-to-evidence synthesis. The earlier prices supply a concrete referent. It sits where candidate acceptance is being defined; the implementation and value-mapping protocol remain owned by application integration.
- **a03, end of the savepoint paragraph:** the supplied R10/R11 identifiers and already-existing tables state the scope of the demonstrated all-or-nothing change. The engine-specific rollback warning, with the number-generating sequence example, belongs alongside that boundary. It qualifies the lesson immediately after partial rollback rather than attaching a separate topic later. Detailed generated-identity design and table-change procedures remain with data design, SQL and live changes.

## Findings

None. No critical, medium or low teaching problem identified in either whole piece against this commission.

## Limits

This is a teaching review, not independent validation of the articles' recorded engine results. No native worksheet, build or other test was run. Both trial routes and all three reference routes were read in one hidden browser tab; rendered figure text was inspected, and all trial scripted alternatives were read from source. The tab was closed after review. This does not establish mobile layout, all visual states, animation timing or keyboard behaviour. No such visual or interaction result is claimed.

Timing (UTC): began 2026-10-21 20:05:44; completed 2026-10-21 20:08:36, including browser cleanup and report preparation.
