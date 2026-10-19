# Root breakdown repair record

Scope: commission `../commission.md`; current skills `staycurrent-breakdown` and `staycurrent-review`. Planned only the root article and immediate child topic/title/brief stubs. No existing relational article, coverage map or previous page tree was used as a starting structure. README and current site direction were read for repository and commission context.

`breakdown-before-review.yaml` preserves the original eight-child proposal. `breakdown.yaml` is the reviewed revision. The two independently assigned reviewers performed only their own perspectives.

## Practitioner findings

1. Made analytical and mixed workloads explicit alongside the order-reservation example. The execution branch owns row/column layouts, scan/parallel execution and resource behaviour; root evaluation considers freshness and isolation alongside transactional requirements.
2. Named bulk-data ownership: SQL owns facilities and semantics; application engineering owns staging, validation, restartability and source/target reconciliation; execution owns resource/maintenance effects; operations retains backups/restores.
3. Named database-resident behaviour: SQL owns observable views/routines/trigger semantics; design distinguishes declarative from procedural enforcement; application engineering owns placement, testing and deployment judgement; operations owns privilege implications.

The first repair recheck passed. The practitioner was then asked to recheck the subsequent consolidation to ensure coverage remained explicit.

## Adversarial editorial findings

1. Added an initial task-entrance heading before the walkthrough; root evaluation is directly reachable from it.
2. Merged the sole integrity subheading into the schema introduction. The stock race is introduced once, in the transaction section.
3. Bounded root previews by observable contrasts: one join multiplicity error; a failed/repaired stock reservation; compact access-path/commit picture and lookup/report contrast; lost commit reply; mistaken deletion; stale replica read and a reason to divide write ownership. Deep mechanisms remain in their child branches.
4. Removed the separate system-evaluation child. Its practical synthesis remains a root-owned worked shortlist, requirement/evidence matrix and validation checklist pointing to the owners of mechanism and testing depth. Cost, ecosystem, portability, exit and neighbouring-family fit remain explicit. This saves a repetitive cross-cutting article without losing the ability to make or validate a choice.

Seven substantive immediate children remain. This is a reviewed decision at the root level, not a fixed final corpus size or a rule against justified implementation-specific depth. Each descendant must earn its own article boundaries during its separate breakdown and review.

## Ownership carried forward

Transaction correctness owns database-abort/retry boundaries; application engineering owns request replay, unknown client outcomes and external effects. Execution explains maintenance mechanisms and measurement; operations owns scheduling, verification, recovery objectives and runbooks. Distribution explains multi-server guarantees and failures; operations applies those guarantees in service recovery. Application engineering owns schema/data evolution and bulk movement; distribution owns movement between multi-server layouts.

## Verification

The final YAML is parsed and checked for the required singular `heading` list and child stubs containing exactly `topic`, `title` and `brief`. No descendant headings, public pages, reading state or routes are changed. Review rechecks are retained in the two review files. Any later whole-tree findings belong to the orchestrator's reconciliation.

Both independent final rechecks passed. No unresolved root-level findings remain. Final structural validation passed: nine root headings, seven immediate child stubs, zero descendant heading lists.
