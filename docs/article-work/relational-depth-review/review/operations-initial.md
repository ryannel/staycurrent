# Operations and product-choice depth review

Reviewed 15 October 2026. This is an informed technical/editorial review, not the
collection's independent first reading. I read all twelve assigned article
sources in full, their registry scopes, and the corresponding lesson contracts
in `performance.ts`, `capacity.ts`, `operations.ts` and `choices.ts`. I did not
read the independent reader's log. No article or lesson was changed for this
initial review, and no examples were executed. Primary references were checked
where the consequence or version could matter.

The rebuilt PostgreSQL recovery chapter provides a useful standard: a reader
can follow a concrete input, inspect the intermediate state, explain the result,
and predict a changed condition. Its observed server experiment is clearly
separated from the browser lesson. This standard does not require a general
family article to repeat PostgreSQL implementation details.

## Decisions by article

### Understanding database performance — retain

`slow-queries.astro` already follows a complete investigation: the invented
180 ms trace separates pool wait, query exchanges and application work; the
10,000-job fixture separates result size from scan work and changes the
distribution before refreshing statistics. It explains the caller's
connection, operator privileges, monitoring transaction boundaries, and why a
lock wait does not imply a missing index. The end moves from an explicit
prediction into a representative mixed-load test and rollout.

The `performance-estimates` lesson has actual input counts, stale-estimate and
common-value variations, and the important distinction between an index-only
plan name and its heap fetches. Retain it. A compact request-time strip could
replace the timing table if visual review finds it easier to follow, but a new
diagram is not needed to repair understanding. A forward link from the prepared
statement paragraph to the new PostgreSQL query-execution chapter would help.

Writing judgement: the opening genuinely distinguishes service time from query
time. The maintenance and testing sections contain several qualifications, but
they answer specific mistaken diagnoses rather than padding a checklist.

### The database work behind an application request — retain

`request-cost.astro` derives N + 1, then gives the handler's grouping operation
and preserves Sam's empty order. Ada's two lines and two payments produce the
four explicit combinations and incorrect 50/50 totals; preaggregation restores
25/25. Adding a third payment changes paid to 27 without changing ordered.
The prose locates the SQL in an authorised, bounded parent-page request and
explains connection ownership, cleanup and multi-statement snapshot effects.

The `request-batching` lesson has a useful changed-condition prediction, not
merely SQL to run. Retain it. A request/connection diagram would be optional;
the current combination table already performs the most important visual job.

Writing judgement: this is one of the strongest pieces in the assigned set.
The example stays connected through a tempting optimisation and its repair.
Do not bury it under a general survey of ORM products or pool implementations.

### Reporting on operational data — retain

`reporting.astro` establishes source and result grain, computes 50 and 8, then
follows a historical correction to 55 while the materialized view remains at
50. It also explains why a refresh published at 12:04 need not include a sale
committed at 12:03. Corrections, changed reporting days, deleted contributions,
duplicate delivery and summary-row contention are concrete enough to motivate
the full-refresh/incremental choice without implementing another subsystem.

The `report-freshness` lesson's change to 40 gives an independent prediction of
60, and its limits are honest. Retain. A source-snapshot/refresh-publication
timeline could clarify the clock relationship, but is an enhancement, not a
missing mechanism. Do not add an incremental materialized-view tutorial merely
to make this chapter longer.

Writing judgement: the source-row arithmetic earns the later operational
choices. The final section expands the same correction's journey rather than
changing examples.

### Scaling a relational database — retain, improve onward routes

`scaling.astro` serves its overview scope well. It distinguishes independent
CPU work from a contested stock row, copies from ownership, local partitions
from write distribution, and normal capacity from degraded capacity. The two
existing diagrams show which tenants each machine contains and accepts writes
for. The failure path includes authority, client reconnection and uncertain
operation outcomes.

Its paragraph beginning “A service may initially complete more requests” is
qualitative. An explicit offered/completed/queued arithmetic example could
help, but is not needed to explain the architectural choices. Avoid inventing
a benchmark or a universal pool-size rule. Add direct routes to the rebuilt
PostgreSQL replication/sharding chapters for the reader ready for actual
positions, server behaviour and implementation limits. The local pruning
lesson is an appropriate practical handoff; a SQL table pretending to model
server capacity would not add useful evidence.

Writing judgement: the breadth belongs here. Some paragraphs conclude with
general advice, but each section explains where a particular next request
goes. Preserve that framing.

### Replication and failover — retain, connect to observed server work

`replicas-and-failover.astro` derives durable versus readable copies through
the 20-to-25 price change, explains three acknowledgement boundaries, and
follows writer authority through a partition rather than equating a timeout
with a crashed node. Its old-snapshot and nonconfirming-replica qualifications
prevent important misreadings. The monitoring query explicitly belongs on a
real writer with suitable privileges.

`replica-freshness` is honestly a one-connection state model. It is useful for
prediction and should not be relabelled as observed replication. Now that the
PostgreSQL branch has an actual physical experiment, link to it from the stage
table and promotion discussion. That creates a depth path without reproducing
the same lab. A saved/replayed timeline would be useful only if rendered review
finds the current stage table difficult.

Writing judgement: the repeated distinction between copying, applying and
authority is necessary because the consequences differ. No broad rewrite.

### Partitioning and sharding — retain

`partitioning-and-sharding.astro` has unusually strong worked operational
reasoning. The same tenant spanning two months defeats a date-pruning
assumption; the changed primary key explicitly changes the identity promise.
The migration compares equal row counts with three actual discrepancies,
closes admissions, drains writers, verifies a common boundary, fences stale
authority, and shows why switching back after B accepts 35 would lose data.

The `partition-pruning` and `shard-cutover` lessons support those outcomes.
The latter expressly does not provide a concurrent distributed fencing
protocol. Retain that boundary. Link to PostgreSQL sharding for native
pruning, Citus and implementation-specific rules. Do not manufacture a Citus
deployment result. Its current stable Citus links identify themselves as
13.0.1 documentation; the article's Citus 13 source labels are correct.

Writing judgement: long, but the length carries a single move through failure
and recovery. The phase and discrepancy tables are already useful media.

### Schema changes — bounded substantive repair recommended

`schema-changes.astro` has a complete compatibility example: A/B/C readers
and writers, old-column authority, bounded backfill, live-write trigger,
validated presence and an explicit rollback boundary. Keep those foundations.

The depth gap is in the actual concurrency. At line 45, “PostgreSQL coordinates
the row update and rechecks the current target” compresses the decisive step
into expert shorthand, followed by an instruction to test it elsewhere. The
browser lesson is sequential, so it cannot supply the missing observation.
At line 34, “a waiting strong lock can delay later operations” is consequential
but not followed through a blocked caller and its recovery.

Recommended repair: run a small two/three-connection native PostgreSQL lab.
First let an old writer hold an updated row while backfill waits; show that
the trigger has filled the replacement and the waiting backfill skips or
preserves it after the writer commits. Reverse the schedule to show the
backfill followed by the old writer still agrees. Separately hold a table
read transaction, run the bounded ALTER, record the lock timeout and failed
transaction state, roll back, release the blocker and retry. Keep complete
caller/connection labels and exact observed outcomes. A small schedule table
is sufficient; do not claim a three-row duration establishes production cost.
The existing sandbox lesson can remain unchanged, with a link to this server
experiment and a changed-condition prediction.

Writing judgement: the A/B/C compatibility table is helpful, while the quoted
recheck paragraph is the one place the author moves faster than the reader.

### Backups and recovery — substantive repair required

`backup-and-restore.astro` explains the scope and reconciliation well, but its
registry promises a tested restore. Line 51 instead says “was not executed
for this article: the authoring environment has no server client tools.” The
browser lesson verifies a table-copy model only. This is an explicitly
disclosed evidence gap, not a false claim, but it falls below the article's
commission and the rebuilt branch's standard.

Run the downloadable logical drill on an isolated PostgreSQL server, retain
the output and validate the restored schema as well as the expected missing
receipt. Add an actual bounded PITR experiment if practical: a base plus WAL,
an intentional bad transaction, a named recovery boundary, a legitimate later
change excluded by that boundary, and reconciliation before promotion. A
timeline would make the chosen history clear. Keep this separate from crash
recovery and from power-loss claims. Make the RPO arithmetic depend on an
established recovery point, not merely on the age of one missing purchase.
Root has reserved this repair and server evidence work.

Writing judgement: the useful distinction between a valid restored database
and the service's acknowledged purchases should remain the centre.

### Controlling access — bounded substantive repair recommended

`access-control.astro` gives real permitted, denied and zero-row outcomes,
names the effective identity and explains owner bypass. Those are strong.
Its one thin consequential mechanism is line 48: “Multiple policies can
combine, so adding a broad policy may widen access unexpectedly.” Readers
cannot derive which row becomes available or how to repair the mistake.

Add a small extension of the shipping fixture: retain its tenant policy, add
a second default permissive SELECT policy for ready orders, and predict
which orders become visible. Explain `(tenant 1) OR (ready)`, including why
the second tenant appears. Then remove/recreate that status rule as
RESTRICTIVE, derive `(tenant 1) AND (ready)`, and check both a successful
worker read and the excluded row. Place the scenario before packing changes
statuses, or reset explicitly. Restrictive policies need an applicable
permissive policy; adding one to an otherwise closed table does not grant
access. Keep the original column and operation boundaries in the result.
This belongs in a bounded new lesson or clearly ordered extra steps. A
two-row truth table is better than an ornamental permissions diagram.

Writing judgement: avoid expanding authentication and auditing into separate
surveys; they are correctly scoped handoffs. The page's practical outcome is
clear already, so integrate this as a counterexample that tests the existing
promise.

### Retention and deletion — retain, add an onward lesson route

`data-lifecycle.astro` follows one subject across foreign keys, live deletion,
retained snapshots and independent deletion decisions. It explains ID reuse,
suppression expiry, new dependent writes, and why row invisibility is not
immediate byte erasure. The `deletion-and-copies` lesson produces a real
foreign-key error and a repeatable restoration/suppression model.

The asynchronous copy section is less concrete than the local example, but
the neighbouring adding-another-system article already develops retained
versions and stale replay. Link its copy-freshness lesson at the paragraph
about a delayed “customer updated” event. If that article gains a complete
outbox lesson, link that too. Do not duplicate the entire source/event
pipeline here. A map of live, derived and retained copies could help readers
locate those responsibilities; its current inventory table mostly does that.

Writing judgement: the progression to reintroduction is clear and carries a
specific failure. The policy caveat is appropriately limited and does not
pretend the chapter establishes legal retention obligations.

### Choosing a relational database — bounded explanatory repair recommended

`product-comparison.astro` respects engine/edition/service boundaries and
does not misrepresent its PostgreSQL-only lesson as a product benchmark.
The physical-access comparison has enough mechanism to explain primary-key
width and secondary lookups. It is useful decision guidance, not shallow
brand listing.

Its best contrast stops one step early: the two-read example names each
engine's snapshot semantics and line 29 asks the reader to arrange the
experiment. Add an explicit order count before and after another connection
commits, with a table of predicted documented outputs for PostgreSQL Read
Committed, InnoDB Repeatable Read, SQL Server locking Read Committed/RCSI,
and optionally SQLite WAL. Identify which cases were actually observed;
documented expected behaviour is legitimate but must not look like a
four-engine execution result. A tiny local PostgreSQL/SQLite run is practical
if those runtimes are available, but installing every product is unnecessary.
Use the exact isolation/settings, ordinary SELECTs and established initial
snapshot. Explain what the different result means for a two-query screen.

Writing judgement: replacing a generic instruction with one completed
comparison will strengthen the article without changing its decision-making
scope. No new engine survey is warranted.

### When should you add another data system? — bounded substantive repair recommended

`adding-another-system.astro` makes native full-text search concrete and gives
a correct version-guarded destination upsert. Its stale-positive versus
missing-result distinction and retained withdrawal version are particularly
useful. The separate-system decision is well supported.

At line 50 the source-side guarantee becomes prose only: “One design records
the catalogue change and a pending event in the same database transaction.”
The next executable SQL is the destination application, so the reader never
sees how the source change and publish obligation remain together, who selects
the pending event, or what remains after a lost delivery acknowledgement.

Complete that chain with one bounded outbox model and lesson: atomic product
update plus event INSERT, inspect pending work after commit; roll back a
variant and observe neither change nor event; deliver the complete versioned
state using the existing guard; leave the source event pending to represent
a lost acknowledgement; redeliver safely; only then record delivery. Name
the application connection, worker, destination call and acknowledgement
boundary. A sequence diagram can expose the two separate commits and crash
gap. The SQL browser model must remain explicit about having one database
and no network; do not advertise it as an exactly-once transport. This also
supplies the practical onward path for lifecycle's delayed-copy discussion.

Writing judgement: the example is already coherent. Add the missing operation
between the two established sides rather than introduce another workload.

## Evidence checked and remaining limits

Primary references opened during this review:

- [PostgreSQL 18 ALTER TABLE](https://www.postgresql.org/docs/18/sql-altertable.html):
  default AccessExclusive locking, validation's weaker lock, the validated
  CHECK proof used by SET NOT NULL, and enforcement of new changes under
  NOT VALID. Existing claims are supported.
- [PostgreSQL 18 row security](https://www.postgresql.org/docs/18/ddl-rowsecurity.html)
  and [CREATE POLICY](https://www.postgresql.org/docs/18/sql-createpolicy.html):
  permissive OR, restrictive AND and privilege/owner boundaries. These support
  the proposed counterexample.
- [PostgreSQL 18 default privileges](https://www.postgresql.org/docs/18/sql-alterdefaultprivileges.html):
  creating-role and global/schema-local composition. Existing claims supported.
- [PostgreSQL 18 refresh](https://www.postgresql.org/docs/18/sql-refreshmaterializedview.html):
  concurrent refresh conditions and one refresh at a time. Existing claims supported.
- [MySQL 8.4 isolation](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html),
  [SQL Server isolation](https://learn.microsoft.com/en-us/sql/t-sql/statements/set-transaction-isolation-level-transact-sql?view=sql-server-ver17)
  and [SQLite isolation](https://www.sqlite.org/isolation.html): the compared
  ordinary-read and writer behaviours are consistent with identified settings.
- [Citus stable cluster management](https://docs.citusdata.com/en/stable/admin_guide/cluster_management.html):
  currently identifies itself as 13.0.1; no reason to relabel these existing
  links as the different source version used in the PostgreSQL branch.

No new execution, rendered accessibility review, or browser lesson run was
performed by this initial reviewer. The recommendations distinguish gaps in
explanation from unverified server behaviour. Fresh-reader and rendered-media
results remain independent work.
