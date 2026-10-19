# b08 — independent practitioner review

Reviewed 20 October 2026 using `staycurrent-review`, practitioner perspective.
a09 is a narrow playback-source recheck, retaining its b07 technical pass. a10
and a11 receive full initial reviews against the original relational-practice
goal, the actual a01 parent, a09 sibling and supplied family scopes. Read the
complete snapshots, owned models and SQL, source records, writer handoffs and
retained native transcripts. No other perspective's report, teaching-reference
articles or old relational corpus was read.

| ID | Practitioner verdict | Required repairs | Optional advice |
| --- | --- | --- | --- |
| a09 | Pass, narrow recheck | None | None new |
| a10 | Pass | None | None |
| a11 | Pass | None | None |

## a09 — Choosing types and representing missing values

**Pass.** The snapshot is byte-identical to b07. Model, native SQL and application
verifier hashes are unchanged. The changed playback scheduling reads the current
frame's labels, values, details and narration to calculate its dwell time. It
does not alter the representation policy, result calculation, frame sequence or
runtime claims. Retain b07's full correctness, native PostgreSQL, PGlite/application,
working-model and family-boundary assessment. Presentation and actual playback
timing remain with the teaching perspective.

## a10 — Expressing rules with constraints

**Pass.** This supplies the practical enforcement depth the parent delegates.
The room-reservation extension is explicitly separate from the parent's retained
class-booking identity. Requiredness, row validity, business identity, tenant-scoped
references, state-dependent uniqueness, check timing and interval conflict are
distinct rules with accepted and rejected changes. It avoids treating generated
identity, application validation or an availability query as sufficient enforcement.

The important qualifications are correct: an unknown CHECK result passes; defaults
do not replace explicit NULL; MATCH FULL is unsuitable for an optional reference
sharing a required tenant unless the representation accounts for that; a partial
unique index is immediate and cannot serve as the displayed foreign-key target.
Cancellation/replacement is a complete transaction. The lead cycle requires the
lead to belong to that reservation and retains the requirement at commit.
Half-open intervals allow adjacency, while finite positive bounds remain separate
checks. All exclusion comparisons and its confirmed-state predicate matter.

Reference actions follow ownership and retention, including the difference between
deferred NO ACTION and RESTRICT and selective referrer nulling. The final enforcement
map includes edits, reactivation, reassignment and parent changes. Capacity, triggers
and separately identified places retain explicit all-writer and concurrency duties;
the article does not claim that a cross-table CHECK or a unique place claim alone
solves the whole capacity rule.

Independently ran `experiment.sql`, `supplement.sql` and `matrix.sql` in one fresh
own native PostgreSQL 18.6 database, then removed that database. The required-value,
interval, identity, nullable uniqueness, composite reference, MATCH FULL, current
reference, overlap and reference-action checks passed with their asserted SQLSTATEs.
The real missing-lead COMMIT failed with 23503 and the following assertion proved
that the invalid reservation did not survive. Wrong-reservation lead and immediate
first insert also failed. Cancellation released occupied time; PostgreSQL 18's
WITHOUT OVERLAPS accepted adjacency and rejected overlap. This reproduces the
retained stored-state evidence without inferring a concurrent schedule.

Read the model and render logic; independently enumerated all 88 supported frames
and checked each final rejection against its invariant. In an own Chrome tab on
fixed preview 4437, stepped all four figures and exercised all 22 parameter
combinations at the final comparison step. Composite tenant ownership, all four
current-reference changes, all three lead paths and all twelve interval/scope/state
outcomes agree with the SQL rules. The models remain labelled explanations.

Primary checks included PostgreSQL 18's
[Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html),
[CREATE TABLE](https://www.postgresql.org/docs/18/sql-createtable.html) and
[SET CONSTRAINTS](https://www.postgresql.org/docs/18/sql-set-constraints.html).
The transaction branch retains competing-session behaviour and retry protocols;
a06 retains rollout into existing data, a09 representation/equality, and a12
historical interval and retention meaning. No scope repair or new child is needed.

## a11 — Normalisation and deliberate redundancy

**Pass.** The service catalogue and booked-line extension develops the parent's
fact-ownership approach into dependencies, reconstruction and enforceability.
Candidate keys are derived from stated rules rather than accidental sample
uniqueness. The alternate customer/session key is preserved. Generated line IDs
do not remove the other dependencies, and current catalogue descriptions remain
different facts from agreed line quantities and fees.

The normal-form conditions are accurate, including prime attributes and alternate
candidate keys. The adviser example usefully separates a lossless BCNF split from
dependency preservation: the split reconstructs valid original assignments, but
its local constraints admit two advisers for the same booking/service. The chosen
controlled service copy has a concrete composite-reference enforcement purpose
and an explicit update obligation. The unsafe tenant-only split demonstrates the
opposite reconstruction failure. Independent facility/language membership is a
business assumption; correlated pairs cannot be discarded. Empty languages do
not erase facility membership or imply a joined availability row.

The subtotal contract includes booking state, active line state, quantity, agreed
fee and zero-line cases. Performance benefit is a hypothesis requiring measurement.
Atomic source/copy transactions are correctly distinguished from protection of an
earlier read–calculate–overwrite decision. Rebuilds retain source-snapshot, ongoing
change and publication obligations; a refresh schedule alone is no freshness
bound. The protected model path is explicitly an assumption whose implementation
and concurrency proof belong to a03. Delivery, live replacement and operational
scheduling retain their own owners.

Independently ran `verify.sql`, including the unchanged a01 schema/fixture and
`extension.sql`, in a second fresh own PostgreSQL 18.6 database, then removed it.
Observed zero reconstruction differences, two invented tenant-only associations,
catalogue survival after the last line deletion, and an unbooked MAP service.
The locally valid split admitted two B11/KIT advisers; controlled triples rejected
the second adviser, inconsistent service copy and tenant-crossing reference.
Independent sets produced four pairs, correlated projections two false pairs,
and empty languages retained two facilities with zero joined rows.

The subtotal run reproduced source €18 versus stale replacement €15; cancellation,
deletion, booking cancellation and reactivation produced the stated €15/€11/€0/€11
results. A subsequent correction left the materialised result at €11 while source
was €14; explicit refresh produced €14. These are sequential observations, as
claimed, rather than concurrent-protocol or performance evidence.

Ran the 80-state model verifier and inspected the complete model/render source.
In the fixed preview, exercised all five figures and every choice/cause combination.
Also stepped all three subtotal modes through source changes, reader, reconciliation
and publication: overwrite drift persists until publication; protected changes
agree at €18; the lagging generation remains €10 through reconstruction and becomes
€18 only at publication. These outcomes agree with the explanatory boundaries.

Primary checks included Kent's
[normal-form guide](https://www.bkent.davidjkent.com/Doc/simple5.htm), Bernstein's
[original 3NF paper, §2](https://apollo.inf.upol.cz/~urbanec/teaching/2021/data2/files/bernstein.pdf),
Fagin's [original dependency/4NF paper, §§2–3](https://s3.us.cloud-object-storage.appdomain.cloud/res-files/500-tods77.pdf)
and PostgreSQL's
[refresh contract](https://www.postgresql.org/docs/18/sql-refreshmaterializedview.html).
The article gives useful ordinary design judgement without turning into a
normalisation-algorithm or materialised-view implementation specialist branch.

## Scope and handoff

All three snapshots match the rendered sources; all 19 manifest component/evidence
hashes remain unchanged. No retained output was overwritten. Native checks used
only two fresh review databases and left the shared server configuration alone.
No article/component edits, build, commit or publication were performed. The own
preview tab is closed and preview 4437 is released. All three articles pass the
practitioner gate; no repair recheck is requested.
