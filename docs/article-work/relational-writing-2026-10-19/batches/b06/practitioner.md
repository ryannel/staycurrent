# b06 — independent practitioner review

Reviewed 20 October 2026 using `staycurrent-review`, practitioner perspective.
Both articles receive initial full review against the original relational-practice
goal, supplied parent/sibling/child plans and available family drafts. No teaching
review, teaching-reference articles or old relational corpus was read. No article,
component, retained evidence, commit or publication state was changed.

| ID | Practitioner verdict | Required repairs | Optional advice |
| --- | --- | --- | --- |
| a07 | Pass | None | None |
| a08 | Repair | a08-P1: qualify the duplicate-request outcome when no stock is claimed | None |

## a07 — Running a relational service

**Pass.** This parent supplies a useful service and incident decision method.
Failure-specific loss/time requirements, operating ownership, useful observations,
maintenance limits and recovery dependencies lead into two complete contrasting
incidents. It does not require a child to tell the reader whether this scenario
calls for demand control, promotion or restoration.

Availability, acknowledged-write durability and correct business state remain
distinct. The example RTO/RPO table states its failure cases and clock boundaries;
the late-discovered mistake needs retained earlier state and reconciliation rather
than permission to discard valid recent work. Managed hosting transfers specified
tasks, while application correctness and actual readiness still have owners.

The access section separates network admission, authentication, ownership and
privileges, then includes transport identity checks, keys, recovery copies and
independently useful audit evidence. Positive and negative checks through actual
identities are the right acceptance boundary. The parent does not pretend to
implement a complete role or compromise-response procedure here.

Observation starts at application outcomes, distinguishes idle connections from
active work and connects symptoms to evidence rather than prescribing pool growth
or a restart. Capacity arithmetic includes an intervention reserve and lead time.
Maintenance distinguishes reusable space from a rewrite and preserves recovery
and workload allowances. These are useful operating decisions without duplicating
the performance diagnosis or live-change procedures.

The replication explanation and model correctly distinguish local flush, selected
standby flush and replay. The model explicitly names the configured synchronous
participant and `synchronous_commit=on`, and its acknowledgement label concerns
order 103. It does not imply that the default setting alone selects a standby or
that remote durability immediately makes a replica read current. The committed
deletion reaches both live copies, preserving the need for retained recovery
history. Former-writer exclusion, reconnection and validation remain prerequisites
to a new write authority.

Restoration includes independent access, keys, configuration, compatible recovery
inputs, elapsed usable-service time and business checks. The accidental-deletion
case preserves later order 106 and dependent facts; a blind table copy or rewind
is not offered as a repair. The incident sequence identifies evidence, containment,
the owning prepared procedure, explicit no-go conditions and application/external
reconciliation before traffic returns. Its seven- and 42-minute outcomes are
explicitly invented, not observed recovery performance.

### Independent model and source checks

Read the full snapshot, own plan, a35–a39 section plans, actual available family
context, source ledger, writer report, player, models and verifier. Ran the pure
model verifier; no native service or server changes were needed or claimed.
Independently checked the forecast: `(96−32)/4 = 16` hours and
`(96−32)/12 = 5.333…` hours; after six hours at the adverse rate only 24 GB
remains, below the reserve.

In my own Chrome tab on fixed preview 4437, advanced every capacity step for
both rates, every copy step under both acknowledgement policies and all seven
incident phases. Visible free space/time values, acknowledgement boundaries,
durable-versus-readable states, deletion propagation and incident actions agree
with the models and prose. The copy can be durable while its new query still
shows no order; the two incident procedures remain different at their outcome.

Checked primary PostgreSQL 18 documentation for
[host authentication](https://www.postgresql.org/docs/18/auth-pg-hba-conf.html),
[privileges](https://www.postgresql.org/docs/18/ddl-priv.html),
[TLS](https://www.postgresql.org/docs/18/ssl-tcp.html),
[synchronous acknowledgement and replay](https://www.postgresql.org/docs/18/warm-standby.html#SYNCHRONOUS-REPLICATION)
and the previously checked
[archiving/recovery](https://www.postgresql.org/docs/18/continuous-archiving.html)
and [vacuum contracts](https://www.postgresql.org/docs/18/routine-vacuuming.html).
Also independently checked RDS
[restore-to-new-instance behaviour](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html)
and [DNS/reconnection after DB instance failover](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_RebootInstance.html).
Those support the bounded claims; no hosted service rehearsal is inferred.

### Depth and family boundaries

a07 owns the incident framework and complete first decision. a35 retains concrete
access, rotation and compromise procedures; a36 dashboard/forecast construction;
a37 upkeep and upgrade execution; a38 topology/promotion/partition lifecycle;
a39 executable restore and recovery validation. a05 retains deep workload
diagnosis, a06 migration/data-repair implementation and a04 request/external-effect
reconciliation. The parent gives enough understanding to select and gate those
procedures without teaching their commands twice. No extra branch or consolidation
is needed for the original relational-practice goal.

## a08 — Choosing a relational database

**Repair, one narrow outcome qualification.** The selection case and conditional
decision otherwise pass. The complete requirements-to-evidence-to-decision path
is useful despite honestly deferring production acceptance. One sentence
overstates the displayed SQL's duplicate behaviour and could misclassify a valid
replay after stock is exhausted.

### Required a08-P1 — A repeated identity is not always tested by the INSERT

Location: snapshot `a08.astro:114`, immediately after the reservation SQL.

“A duplicate identity raises a uniqueness error” is conditional in this statement.
The INSERT receives rows only from the guarded UPDATE's RETURNING output. With
stock zero, that output is empty; the INSERT never proposes the repeated identity
and uniqueness is not checked.

Independently ran the complete owned native acceptance suite from a temporary
copy with fresh review database names and output confined to the temporary folder.
After its seven reservations exhausted stock, repeated existing request `first`
using the same guarded CTE/INSERT. PostgreSQL 18.6 returned successfully:

```text
INSERT 0 0
```

There was no returned request row and no 23505. The existing reservation remained,
and final stock/count/amount remained `0 / 7 / 140.00`. The separately recorded
duplicate while stock remains correctly raises 23505 and rolls its decrement
back; that observed table row is already qualified and needs no correction.

Qualify the explanatory paragraph: a uniqueness error occurs when a claimed row
reaches the INSERT and collides; if no stock is claimed, even a repeated identity
can yield an empty result. Before turning an empty/error outcome into the
application response, resolve any existing request and compare its original
arguments; a valid replay uses the saved outcome. Retain the existing handoff to
application integration for the full replay and uncertain-commit protocol. No SQL
or model change, new lesson or repeat full acceptance suite is required.

This changes interpretation, not the proven stock invariant. The bounded local
prototype's data/export observations remain valid; production request replay is
already an explicit untested gate owned by the application lead. The conditional
production deferral should remain.

### Correctness, useful depth and adoption boundaries otherwise pass

The brief distinguishes hard requirements, forecasts, design choices and
preferences. Process, topology and hosting are separate choices. SQLite's direct
multi-host WAL arrangement is rejected for the actual stated boundary while a
single-host API is correctly treated as a different candidate. Distributed SQL
is conditional on a requirement a simpler topology fails, and the region-loss
comparison rejects a particular server topology rather than every server engine.

The PostgreSQL record names the tested engine, direct privileged local path,
connection reservations, durability settings, timeouts and absent driver/pool/TLS
evidence. Settings are not claimed as power-loss proof or measured capacity.
The RDS comparison correctly distinguishes Multi-AZ DB instances from clusters,
restricted elevated access from true superuser/OS access, and documented facilities
from tested application readiness. Costs are invented allowances, not supplier
prices or equal-service quotations. The final decision adopts only the prototype,
rejects its single-host topology for the host-loss requirement and assigns concrete
owners and stop criteria to the remaining production evidence.

### Independent native and model evidence

Read the complete snapshot, own plan, actual a32/a34 section plans, available family
context, source ledger, writer handoff, all three components, verifier and retained
observation. The temporary native rerun reproduced read-back settings; 23514,
23503 and 23502 rejection cases; the stock-remaining duplicate's 23505 with stock
still six; 100 distinct attempts through four persistent psql sessions; and final
stock zero, seven reservations and 140.00. Logical dump/re-import reproduced
aggregates and every ordered reservation row in a second fresh database. All
sessions and only my review databases were cleaned up. Retained `observed.json`
was never overwritten. This is no host-loss, PITR, application-driver or latency
acceptance test, consistent with the article's limits.

On fixed preview 4437, stepped all four stages in each embedded/server/distributed
path, selected all three requirement cases and checked cost inputs around the
break-even: zero hours gives £260, six £740, seven £820 and thirty £2,660. The
managed allowance remains £780; the stated 6.5-hour break-even follows directly.
All routes, rejection reasons, totals and conditions agree with their source.

Primary checks included PostgreSQL
[connection reservations](https://www.postgresql.org/docs/18/runtime-config-connection.html),
[data-modifying WITH output](https://www.postgresql.org/docs/18/queries-with.html#QUERIES-WITH-MODIFYING),
[logical export scope](https://www.postgresql.org/docs/18/backup-dump.html)
and [engine licence](https://www.postgresql.org/about/licence/);
SQLite's [same-host WAL and writer contract](https://www.sqlite.org/wal.html);
RDS [Multi-AZ instance standby](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html),
[restricted role](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Appendix.PostgreSQL.CommonDBATasks.Roles.rds_superuser.html)
and [upgrade interruption](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.PostgreSQL.html);
and CockroachDB 26.3
[locality versus survival controls](https://www.cockroachlabs.com/docs/v26.3/multiregion-overview).
No RDS price/tier, SQLite runtime or CockroachDB deployment acceptance is invented.

a32 retains loaded-library, settings, writer-contention and embedded recovery
checks; a34 retains topology/tier/SQL/retry/locality/failure evaluation for a
distributed shortlist. They remain alternative follow-ups. a08 keeps the
PostgreSQL candidate and its actual evidence; common SQL, correctness, integration,
performance, service and cutover depth stays with its existing owners. No extra
branch or consolidation is needed.

## Scope and handoff

Both snapshots match their rendered sources and all eight manifest file hashes
remain unchanged. Browser work used the fixed 4437 build; no shared build or
server mutation was performed. Teaching/presentation review remains independent.
a07 passes; a08 needs only the a08-P1 paragraph qualification and a narrow source
recheck. Retain all unaffected native, model and family findings after that repair.
