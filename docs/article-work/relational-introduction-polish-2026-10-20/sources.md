# a00 source record · 20 October 2026

## Inputs and reference teaching

Read the actual repository AGENTS.md, README.md, docs/site-direction.md and the
updated staycurrent-write skill. Read context.yaml, commission.md, all eight
finished direct children (a01–a08), and their full supplied plans. No earlier
review verdict or editorial recommendation was used.

Read the complete three reference article sources: Sequence diagrams, Indexes,
and Storage and durability. Read their rendered figure narratives, alternative
text, controls and captions at the supplied reference preview on port 4337.
The draft follows their running-example progression: establish the question,
change one condition, inspect the consequence and explain the useful decision.

## Retained execution evidence

The original source record remains at
`docs/article-work/relational-writing-2026-10-19/nodes/a00/sources.md`.
It records the native PostgreSQL 18.6 checks performed on 19 October: selection,
inner/left joins and grouped totals, NULL and count behaviour, separate commits,
rollback, successful commit and the one-row conditional update under contention.
The SQL, fixture and models supporting those observations are unchanged:

- `src/components/relational-next/a00/queries.mjs`
- `src/components/relational-next/a00/models.mjs`
- `src/components/relational-next/a00/verify.mjs`

The earlier runtime has been stopped and removed. **No new native PostgreSQL run
was performed for this revision.** The two-buyer paragraph retains the narrow
conditional-update result, not a complete checkout or payment guarantee.

## Primary documentation for the added comparisons

Opened directly on 20 October 2026:

| Source | Use |
| --- | --- |
| [PostgreSQL 18: ALTER TABLE](https://www.postgresql.org/docs/18/sql-altertable.html) | An added value must have a legitimate representation in existing rows; strengthening NOT NULL requires the existing values to satisfy it. Physical work and locks depend on the operation. Figure 5 is a compatibility model, not an executed DDL trace. |
| [PostgreSQL 18: Database page layout](https://www.postgresql.org/docs/18/storage-page-layout.html) | Ordinary table rows are stored in pages. The model's four rows per page are invented, not a claimed real row size or page capacity. |
| [PostgreSQL 18: Introduction to indexes](https://www.postgresql.org/docs/18/indexes-intro.html) | Index lookup can avoid scanning the table, while adding storage and maintenance work. Figure 4 omits and explicitly does not count index pages; no timing or captured plan is claimed. |
| [PostgreSQL 18: Transactions](https://www.postgresql.org/docs/18/tutorial-transactions.html) | Atomicity, commit, rollback and visibility of unfinished work. |
| [PostgreSQL 18: Message flow](https://www.postgresql.org/docs/18/protocol-flow.html) | Session termination rolls back an open transaction; an already committed change is not undone by losing its reply. Figure 3 shows two possible histories, not a fresh fault-injection observation. |
| [PostgreSQL 18: Continuous archiving and PITR](https://www.postgresql.org/docs/18/continuous-archiving.html) | Recovery from retained earlier state and history; successful replication is not reversal of a committed wrong change. Figure 6 assumes usable independently accessible earlier state and does not execute recovery. |

The retained source list continues to support constraints, values, joins,
missing values, ordering, isolation, durability, binding and replica boundaries.
The prose distinguishes those documented contracts and original limited native
observations from the illustrative figures. Request recovery, rollout gates,
service validation and selection criteria are orientation-level design reasoning;
their full protocols stay with the owning direct children.

## Own rendered checks

The orchestrator promoted the staged fragment to its review source location.
On the port-4337 development preview, the writer exercised both alternatives of
all four added models at their final step. Outcome state changes while client
knowledge stays uncertain; lookup changes from three table pages/twelve tested
rows to one table page plus an uncounted index search; staged change reaches a
required value only with converted rows and compatible writers; copied deletion
removes the order from both current copies.

Checked original join grouping and LEFT JOIN output (£36 and retained NULL),
transaction failure under separate commits versus rollback, and successful
transaction commit. Endpoint Next kept focus and exposed aria-disabled=true in
both original figures. All selections preserve the current step for comparison.
All six players budget advancement from the entire rendered figure text, not
only the changing explanatory paragraph; no player starts automatically.

At a 390 × 844 viewport, the document and each of the six figures had no
horizontal overflow (document width 390; figure client and scroll widths 356).
Visually inspected the page/counter comparison and recovery cards in the dark
phone layout. Independent interaction review still owns full keyboard, all-state,
light/dark and breakpoint verification. No full build or Git operation was run by
the writer, as assigned.

## b01 repair evidence

The accepted E1–E3/I1–I2 repairs clarify existing explanations; they add no new
engine or provider claim and require no fresh native run. Purchase attempt R103
is an illustrative stable request identifier, separate from customer identity
and order 103. Provider retries explicitly depend on a supported
payment-request duplicate-prevention mechanism. The overlapping-attempt caveat
is retained.

The repaired lookup reveals one invented index entry, `9 → page 3`, at candidate
discovery. It keeps twelve rows, four per page, three scan pages, one indexed
table visit and no counted index pages or timings. Early table-work notes now
state that no table page has been visited. These are explanatory state changes,
not observations of a running PostgreSQL engine.

Own port-4337 Chrome checks exercised the new candidate step in both modes,
both unchanged final work counts/results, both Figure 3 inspected outcomes and
Figure 5's named delivery-instruction transition. At 390 × 844 the document and
both Figures 4/5 had no horizontal overflow; the candidate entry/card were
visually legible. Enter activated Next at the final lookup step and retained
focus. The final rendered source note retains both verification dates and the
illustrative-versus-native boundary without editing history. Viewport reset and
temporary tab closed. Full b02 build and independent narrow rechecks remain the
orchestrator's work.
