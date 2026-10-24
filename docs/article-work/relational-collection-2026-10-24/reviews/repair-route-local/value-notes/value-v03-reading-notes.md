# Value reading notes · repair-route-local-v03

These are observations from complete current rendered reading, not mechanical evidence or an earlier-version comparison. Scope is P2/P3/P4, their surroundings and the r19/r22 ownership dependencies. All five value checks were applied. The commission's general/native ownership rule and minimum-concept prerequisites were used; the tree's nesting was not treated as mandatory page order.

## Rendered reading receipt

Base: `http://127.0.0.1:4566/review/relational-collection/`.

| Piece | Finished destination read | Additional reader-facing content |
| --- | --- | --- |
| r37 | `postgresql/backup-and-restore/` | Complete body, both command excerpts, recovery log, four-row reconciliation table, expanded source notes. No recovery stepper is presented in this version. |
| r19 | `backup-and-restore/` | Complete body, saved-pieces table, figure's complete six-step text, expanded source notes. |
| r50 | `cockroachdb/backup-and-restore/` | Complete body, three command examples, three-row acceptance table, expanded source notes. No recovery stepper is presented in this version. |
| r40 | `postgresql/schema-changes/` | Complete body and SQL, both figures and lock figure's complete text alternative, expanded source notes. |
| r22 | `schema-changes/` | Complete body and SQL, price and compatibility tables, both figures and race figure's complete text alternative, expanded source notes. |

No linked executable or internal record was opened. Read-only browser text inspection was used; visual operation and native execution are not asserted.

## Section value retained

### r37

| Section | Useful loss if cut |
| --- | --- |
| A base and a continuation | Whole-cluster physical scope, WAL covering the base, streaming/manifest limits, logical recovery alternative and incremental dependencies. These explain which saved objects can support the target. |
| When the archive command can report success | The persisted-copy promise, identical/different duplicate handling, segment availability, storage pressure and one-host boundary. These are distinct PostgreSQL operational decisions. |
| Identify the transaction to exclude | Exclusive XID boundary, actual run identity versus scenario time, restore-command placeholders, alternative target kinds and timeline branch meaning. |
| Close the source history | The short native gate method and observed waiting/refusal result that apply r19's protocol. Cutting it would leave the recorded enumeration without its native admission boundary. |
| Restore without the live source | Isolation/configuration checks, paused `3/3` and empty records, exact missing segment and visible inability to reach target. |
| Reconcile the isolated candidate | Replay completion versus inspection, candidate closure, atomic serial application, repeated/conflicting identity behaviour and final `3/2` acceptance. The table is a result summary rather than a second argument about why complete operations matter. |
| Retain the whole route to service | Native dependencies and the distinction between mechanism recovery and a measured service objective; handoffs to replica authority and major-version migration. |

The entry supplies a sufficient local drill model: what was wrong, what later valid work is lost, and what final state is required. The general link supplies the full reasoning to readers who need it. The final external-effects anchor identifies the owner precisely.

### r50

| Section | Useful loss if cut |
| --- | --- |
| Save history you can reach | Collection/full/incremental scope, revision history versus endpoints, references and cluster state, failure-domain limits. |
| Inspect the chain before the restore | Collection/file checks versus application acceptance, asynchronous-job completion and a deliberately unavailable expected file. |
| Select a state before the mistake | T after full backup/before the marker transaction, an increment covering later work, timestamp selection and both-sided row acceptance. |
| Close the source, then restore | CockroachDB's gate update/conflict and retry behaviour, final ledger result, stopped old authority and fresh candidate, restoration of one state rather than old queryable versions. |
| Reconcile on the isolated candidate | Native guarded decrement plus booking and request outcome, complete-transaction retry, first/repeated/conflicting results and the one-place capacity invariant. |
| Accept the service before transferring writes | Candidate/source closure through runtime checks, one-host/no-RPO/RTO limit and the new reconciliation obligation if returning to the old authority. |

The B203 setup duplicates r37's nouns and numbers deliberately but briefly. Its role is to make r50's native target and acceptance table readable without a PostgreSQL detour. The table does not replay r19's derivation. T is a recorded logical target, with a clearly labelled placeholder and observable exclusion conditions; the coordinator clarified that P3 does not require a literal run-specific numeric timestamp.

### r40

| Section | Useful loss if cut |
| --- | --- |
| Fast work can have a long queue | Reader→DDL→reader dependency, timeout release and rollback, command/lock budgets and the danger of repeated immediate attempts. |
| Separate metadata, scans and rewrites | Independent lock/work axes, constant/volatile default distinction and native file observation, actual-schema dependencies and resource implications. |
| Enforce new writes before checking old rows | Short bridge recap, `NOT VALID` guard with explicit null/equivalence conditions and privileged-writer boundary. This prepares the exact constraint being validated. |
| Finish the backfill with a complete check | The compact `(103,1)`/four-filled/empty/released observation, complete-scope discrepancy predicate and visibility, native validation lock, optimised required-column installation and file/constraint/receipt acceptance. |
| A concurrent index is a process | Top-level installation, distinct product access pattern, registration/build/valid lifecycle, native writer wait and phase-versus-whole-command progress. |
| Accept the index that actually exists | Failed uniqueness/invalid object, insufficient name check, validity versus write maintenance, later-stage enforcement, recovery choices, plan acceptance and retirement dependencies. |
| Leave every pause in a supported state | Caller rollback boundary connected to three distinct native pause states, executable drill access and explicit local evidence limits. |

The complete-key batch SQL and stale/late-row convergence explanation remain in r22. Repeating the acceptance predicate here is proportionate: the reader uses it immediately before native validation. Removing this local bridge would create an unexplained jump from a named migration prerequisite to native constraint work.

## Why the unchanged owners still earn their pages

r19's sections each contribute to the general recovery decision: failure/RPO/RTO; compatible saved chain; target inclusion and two-sided observation; closure of a moving source; complete operation and external-effect identity; testing dependencies and the complete path to service. Its six-state figure and missing-order/stock reasoning establish the full inference once. The native pages now apply it rather than retell it.

r22's sections contribute: representation/caller compatibility; explicit write authority and bridge; row-local backfill and complete-key retry; cursor/late-row convergence; whole-scope semantic acceptance; retirement and authority handover; workload control; a repeatable experiment. Its detailed batch and the stale/late-row counterexamples justify a protocol that r40 can name briefly. Both already use PostgreSQL; repeating the full SQL there would add no engine translation.

## Effort, routes and trade-offs

| Route/task | Concrete reader effort avoided | Useful understanding lost / remaining cost |
| --- | --- | --- |
| r19→r37 | Another full gate/race/identity/external-effects derivation and six-state recovery walkthrough. The native reader instead reads short method/results and the four-row acceptance table. | No native acceptance distinction lost. Two pages remain for a newcomer; the owner supplies general reasoning. |
| r19→r50 | A second general moving-source/whole-operation argument and an extended replay of B203 already used to illustrate native PostgreSQL recovery. | Local target, gate-update, retry and invariant evidence remains. Two pages remain; r37 is unnecessary to use r50. |
| Compare both engines after r19 | Re-deriving the same recovery rule while switching nouns or storage substrate. | Three pages contain one general argument and two useful implementation choices. Each native result still needs a brief local fixture and table. |
| r22→r40 | Decoding a second full composite-key batch statement, its retry explanation and the convergence proof. | The exact skipped-row result and whole-scope acceptance remain. Two pages remain; a direct reader needing the omitted recipe has one precise owner anchor to follow. |

No time saving was measured and no word quota was used. No merge saves an opening without mixing distinct implementation tasks or making the general owner unnecessarily long. No new substantive value finding; next unused identifier is `value-5`.
