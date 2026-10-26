# Planning record

This is the detailed outline for the accepted `pg-upgrades` leaf. It proposes no new article, child stub or ownership change. Its full outcome remains the method decision, compatibility rehearsal, whole-service acceptance and one recoverable write handover. No article prose, implementation, build, review or publication was performed.

## Inputs and reference exposure

Read `input/assignment.txt`, `commission.md`, `article.json`, `neighbours.json`, `incoming-ownership.json`, `reading-links.json` and the complete `shop-example.md`. Applied the supplied current `staycurrent-breakdown`, `staycurrent-write` reference procedure and continuity guidance. Read each bounded reference separately through `scripts/read-writing-reference.py`: Sequences 1–6, Indexes 1–7 and Storage 1–6; all 19 END markers arrived.

Studied owned IAB previews on port 4584 with default theme and viewport: Sequences' focused message ladders and Figure 6 ordering comparison; Indexes' first page-by-page scan and counters; Storage's Figure 8 separation of application knowledge, volatile state and durable history. The useful teaching pattern is an established state, one consequential change, then a comparison that exposes what the earlier observation failed to prove. Figure structure, prose and controls remain the writer's choices.

Read these available replacement previews, preserving each supplied URL suffix under `http://127.0.0.1:4606/review/relational-rebuild/`:

- `postgresql/architecture/`: parent physical and connection setting; full upgrade/migration ownership is already delegated here.
- `postgresql/logical-replication/`: selective copy, initial table readiness, replica identity, exclusions, retention and apply evidence are already developed. Its final section explicitly delegates full migration acceptance and write handover here.
- `postgresql/backup-and-restore/` and `backup-and-restore/`: restore mechanics and reconciliation are already developed; preserve their identity and external-effect distinctions without repeating the recovery drill.
- `failover/`: address changes do not fence old pools; a returning machine needs enforced exclusion. Apply that established principle to a planned migration rather than reteaching leader election.
- `schema-changes/` and `postgresql/schema-changes/`: compatibility and a maintained return target are already developed. Whole-cluster version and system migration remains this article's new outcome.

No old published bodies, target drafts, plans, reviews, feedback, main-repository files or other workers' notes were read. A direct local HTTP read attempt was denied by the environment; the prerequisite reading was completed in the owned browser tab instead. All owned tabs were closed at the end; no user tabs or global display settings were changed.

## Sources checked

Primary PostgreSQL 18 documentation checked on 26 October 2026. These are planning evidence, not observed server execution.

- [Upgrading a PostgreSQL Cluster](https://www.postgresql.org/docs/18/upgrading.html): minor/major distinction; dump/restore, pg_upgrade and cross-major logical replication; read migration notes across skipped majors. Its generic downtime statements are not forecasts for the shop.
- [pg_upgrade](https://www.postgresql.org/docs/18/pgupgrade.html): new-version tool, mode-specific checks, compatible clusters and extension binaries, generated follow-up work. Copy/clone preserve separate old files; link shares them and starting the target makes the old cluster unsafe. Swap also has a destructive boundary and should be acknowledged if comparing all PostgreSQL 18 modes. PostgreSQL 18 transfers most optimiser statistics; do not repeat the older blanket claim that none are transferred. Follow the tool's remaining statistics instructions. The main outline develops copy/clone/link; it does not prescribe every flag.
- [Release 18: migration](https://www.postgresql.org/docs/18/release-18.html#RELEASE-18-MIGRATION): the new initdb checksum default can conflict with an older non-checksum cluster's pg_upgrade requirements. This is one bounded concrete compatibility example, not a reason to catalogue every release change. Exact source and target versions must be named by the writer.
- [pg_dump](https://www.postgresql.org/docs/18/app-pgdump.html): consistent live export, one-database scope, portability and target-version limitations. Newer dump tools can read older supported servers; output is not guaranteed to load into an older major. The already-developed native restore procedure need only be linked.
- [Logical replication restrictions](https://www.postgresql.org/docs/18/logical-replication-restrictions.html): DDL/schema and sequences do not travel with ordinary row changes; large objects need separate treatment. Copied identity values do not advance the target sequence.
- [Logical replication monitoring](https://www.postgresql.org/docs/18/logical-replication-monitoring.html), [Replication progress tracking](https://www.postgresql.org/docs/18/replication-origins.html) and [administration functions](https://www.postgresql.org/docs/18/functions-admin.html): worker presence and receipt are distinct from tracked apply progress; origin progress can be queried with a durability requirement. A migration barrier must be tied to the exact source and subscription, not guessed from a lag display.
- [ALTER COLLATION](https://www.postgresql.org/docs/18/sql-altercollation.html): changed provider rules can invalidate dependent ordering structures; rebuild affected objects before refreshing recorded versions. Refreshing the version neither rebuilds nor proves repair. Native rebuilding details remain with their owner.
- [Logical replication upgrade](https://www.postgresql.org/docs/18/logical-replication-upgrade.html): retaining slots and subscription dependencies through pg_upgrade is version- and prerequisite-dependent; old clusters before 17 do not receive that continuity automatically. Include feeds/consumers in the migration inventory; do not present full multi-node upgrade procedures here.
- [Log-shipping standby servers](https://www.postgresql.org/docs/18/warm-standby.html): physical log shipping generally cannot cross major releases. A same-major host move may use a physical route, linked to the existing physical-replica/restore owners; it does not replace the major-upgrade decision.

## Example and continuity decisions

Use an independent whole-shop migration beginning after order 103. Source and candidate initially contain the exact shared rows: three customers, three products, three orders, five order lines and three payments. Count equality is only a quick accounting check; acceptance must compare required identities, values, relationships and application results. Order 103 stays pending for 29.00 with no payment; stock remains P3/P7/P9 10/0/4.

After the controlled handover, use the existing independent P7 catalogue update 20.00→22.00 as the first target-only authoritative change. The fenced old source remains 20.00. This is enough to make the stale-return problem concrete without new purchases, payment effects or invented identifiers. The order's agreed mug price remains 20.00 and its total remains 29.00. Do not combine this with the mistaken 2.20 recovery branch or price-hundredths schema change.

The shared shop declares explicit integer keys, not sequences. Explain sequence preparation in the whole-system inventory without silently changing those keys into serial or identity columns. No real payment provider is contacted; outstanding external work is an acceptance obligation, not a newly invented payment result. The existing `shop_runtime` and `shop_migrate` task identities may support access checks without implying that native roles already exist.

F may name the closed source boundary in a drawing; it is a symbolic ordering point, not a measured LSN or timestamp. Show source admission, old-writer exclusion, target copy/apply, accepted service and the return window separately where needed. The critical second comparison is physical old-file usability versus semantic completeness after target-only work. These are understanding needs, not a prescribed visual layout.

Continuity pass: the outline starts from the parent and completed prerequisites; develops the three methods before their operating choices; establishes completeness before closing the source; accepts before routing; and distinguishes abort, physical unusability and later divergence. References to deeper mechanics remain with existing owners. No shared business fact or accepted ownership needs changing.

## Writer decisions and evidence still needed

A 17→18 rehearsal is a suitable local assumption, subject to the coordinator's available native versioned fixtures. It is not a claim that a particular source version was commissioned or tested. A native full copy-mode pg_upgrade and a whole-shop logical migration would provide stronger evidence than PGlite for the central choices. Include a pre-admission abort and a target-only-write return counterexample. A tiny fixture establishes mechanics, not a production interruption or catch-up rate. The coordinator owns fixture provisioning and rendered preview/build work.

For the streaming handover, choose and verify a final-apply barrier on the actual version pair and exact subscription after all required tables are ready. A dedicated technical marker in that same ordered stream is a possible local fixture device, but must not be confused with a business row or an uncoordinated slot/dump boundary. Confirm any marker's ordering and durability; a final global WAL position can include activity outside the publication and should not be assumed to become the subscription's applied transaction position. Do not print plausible native LSNs before execution. If several subscriptions are required, each needs its own coverage evidence; the teaching fixture can avoid that complexity with one deliberately complete subscription.

Rehearsal acceptance needs equivalent application reads and controlled writes as the intended identities, complete object/data comparison, target backup/restore coverage and the consumers required by the chosen service. Controlled validation writes or external effects can themselves cross the semantic return boundary, so perform them on a disposable rehearsal or explicitly account for them. Preserve the actual command results and generated follow-up instructions before making claims about statistics or extension repair.

No request for a new child or collection-wide review is outstanding. The article's normal review can judge delivered understanding and affected native evidence. The source/target pair and exact tested barrier remain implementation choices for the fresh writer and coordinator.
