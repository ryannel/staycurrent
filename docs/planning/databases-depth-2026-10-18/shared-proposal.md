# Shared field teaching: proposed allocation

18 October 2026. Derived from [shared abilities](shared-abilities.md). This is the
coordinator's provisional allocation before the independent collection proposals
are reconciled. It sets no prerequisite course or collection page-count target.

## Pages derived from the tasks

| ID | Page and reader outcome | Owned units/sections | Concrete change or failure | Teaching form and prerequisites | Why a page |
| --- | --- | --- | --- | --- | --- |
| FD01 | Databases and storage: understand what kinds of systems are available and which problem to investigate | Records/bytes/queries; exact/ranked/path/analytical work; model/layout/deployment/role; overlapping families and modest starting designs | A catalogue needs both a purchase invariant and ranked discovery; one family name cannot answer both | Small operations with actual input/output; no database knowledge | The field entrance must orient rather than compress the mechanisms of every family. |
| FD02 | Describe the workload: turn an application's needs into a testable design brief | Workload access/invariant/size/skew/concurrency/freshness/recovery/location/operating units from the ability map | A few tenants dominate writes and latency; an average hides them | Three worked briefs with units and changed distributions; local vocabulary from FD01 | An engineer arrives to specify needs before comparing products or reading internals. |
| FD03 | Read and write promises: interpret an interface's guarantees | Atomic scope, visibility, durability, replica/failure scope, missing responses and retry identity | A request commits but the caller times out; a stale replica misses the accepted change | Trace one record and two clients; separate histories from product/protocol details | One shared vocabulary helps all collections; deriving every protocol here would be an expensive detour. |
| FD04 | Keep a derived copy correct: design a copy that can be rebuilt and reconciled | Source ownership/revision; snapshot/live boundary; order/duplicates/deletes; checkpoints/retention; backfill; repair and schema changes | Old revision arrives late, deletion is missed, capture expires while the copy catches up | One continuous source/target trace plus a reconciliation procedure; brief local contract reminder | Copy completeness and repair form an investigation independent of a target store's indexing machinery. |
| FD05 | Move between stores: switch authority without losing later work | Compatibility; copy/catch-up; validation; mixed application versions; cutover; rollback and divergence; retirement | Reads are switched back after new writes have reached only the replacement | Work through migration states and acceptance checks; local FD04 reminder | Authority transfer and rollback deserve their own endpoint rather than burying the copy mechanism. |
| FD06 | Evaluate a storage design: test the full candidate against a credible baseline | Representative workload; distributions and load; correctness/quality; sustained/warm/cold; overload/maintenance/recovery; costs and reproducibility | Fast isolated queries lose under ingestion or recovery; the client becomes the benchmark bottleneck | Worked evaluation record, misleading test and defensible decision; FD02's brief explained locally | An independently useful practice, shared by comparisons without repeating test methodology. |
| FD07 | Protect and retire data across stores: retain control through copies and recovery | Privilege/tenancy; sensitive derivatives; encryption/key recovery; audit; retention; erasure; restored state | A backup restore reintroduces a deleted record and its obsolete search permissions | One person's data and authority tracked through primary, derived and backup copies | Cross-store ownership cannot be established by any one product's permission page. |

## Decisions still awaiting collection derivations

The question “when is a second store justified?” belongs in FD01's choice examples
and each collection's comparison unless a concrete investigation proves it needs
an additional shared page. A separate list of every convergence feature is not a
reader outcome.

Do not preassign B-trees, logs, compaction, replication or snapshots to a generic
foundations collection. The independent derivations will identify whether they
are best taught within a family or at a shared home, with sufficient local context
for the other entrances. Product-specific counter names and protocol exceptions
need their own implementation homes.

These are seven proposed shared pages. The number follows this allocation and
can change at coordination or independent review. No claim about the sufficiency
of the full field follows from it.

## Primary-source scope checks

Checked 18 October 2026; these justify planning questions, not unrun product
examples or complete article verification.

- [Debezium's PostgreSQL connector](https://debezium.io/documentation/reference/stable/connectors/postgresql.html): the snapshot/stream boundary, retained source position and restart behaviour make copy completeness an investigation of its own. Connector-specific commands remain implementation work.
- [AWS cutover guidance](https://docs.aws.amazon.com/prescriptive-guidance/latest/best-practices-migration-cutover/cutover-stage.html): rollback after changed data needs a reconciliation path, which makes authority transfer a different outcome from finishing an initial copy.
