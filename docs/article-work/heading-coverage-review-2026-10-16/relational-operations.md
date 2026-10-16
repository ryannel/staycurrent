# Relational operations: heading and coverage review

Outline-first review, 16 October 2026. Audience: software developers learning database engineering. Initial artifact: extracted built reading in `/private/tmp/staycurrent-heading-review/before/`. The opening of each of these twelve articles was read before any of their heading trees or bodies. The expectations below were saved at that point. Extracted text preserves reading order and marks optional disclosures; it does not verify layout, illustrations or live controls. The coordinator will arrange independent repair review, the shared build and browser checks.

## Expectations saved before the heading trees

- **Understanding database performance (slow-queries):** distinguish end-to-end delay, query work and contention; demonstrate diagnosis using timings and plans; connect evidence to an intervention and a way to check it. The promised queue needs enough transaction and caller context to explain competing claims. A server tuning catalogue is outside scope.
- **The database work behind an application request (request-cost):** derive the number of statements and returned rows for alternative relationship-loading strategies; show the risks of redundant joins and separate reads; finish with a predictable fetching choice. ORM-specific configuration is outside scope.
- **Reporting on operational data (reporting):** establish the unit and meaning of a reported total, show aggregation and its cost, compare on-demand versus maintained results, and explain freshness/resource tradeoffs of moving a copy. A complete warehouse design is outside scope.
- **Scaling a relational database (scaling):** identify which resource or contention limit is binding; explain what bigger machines, fewer operations, read replicas and write partitioning actually change; account for tenant skew and the costs/failure limits introduced. Product deployment instructions are outside scope.
- **Replication and failover (replicas-and-failover):** trace receipt, durability, replay and acknowledgement; show stale reads and lost acknowledged work under specific configurations; explain safe promotion and former-writer exclusion, client redirection and uncertainty near failure. Full election implementation is outside scope.
- **Partitioning and sharding (partitioning-and-sharding):** show routing/pruning and constraint limits of local partitions; distinguish independent write owners, select a workable tenant boundary, explain cross-shard work and a safe move. Complete distributed coordination code is outside scope.
- **Changing a schema while the application runs (schema-changes):** follow old/new readers and writers through expansion, synchronization, backfill, validation and removal; include lock/resource consequences, concurrent writes and recovery from an interrupted step. Data conversion policy is explicitly outside this rename's scope.
- **Backups and recovery (backup-and-restore):** connect failure scenarios to surviving backup authority/location; explain recovery point and time, reconstruct to a target, validate before reconnection and reconcile acknowledged external work. Production-specific backup commands can be onward reading.
- **Controlling access (access-control):** distinguish identity, object/column privileges, row policies and application authorization; demonstrate allowed and denied shipping-worker actions, tenant isolation and privilege bypass boundaries. Authentication infrastructure is outside the worked example but needs orientation.
- **Retention and deletion (data-lifecycle):** follow removal through relational dependencies, external copies and backups; explain how an older restore avoids resurrecting deleted records, what can remain and how completion is checked. Legal retention periods are explicitly outside scope.
- **Choosing a relational database (product-comparison):** compare the named products by application arrangement, transaction/concurrency behaviour and operational responsibilities; make a reasoned choice for the opening's examples, including compatibility/migration and recovery evidence. Exhaustive feature matrices are outside scope.
- **When should you add another data system? (adding-another-system):** compare the existing engine's search capability to the concrete reason for specialization; establish source of truth, update propagation, freshness, incomplete copies and replay/rebuild handling. Detailed deployment of an unnamed search product is outside scope.

## Original assembled heading trees

H1 is the article title listed above. The following trees retain the original levels and order. Figure labels are marked; none of these extracts contained a closed optional heading. Trees were inspected before the bodies, but the per-section judgments below were recorded after each complete article; they are not a sentence-by-sentence blind reading.

### slow-queries

```text
H2 The application request
H2 Waiting inside the database
H2 Plans and changing data
H2 Maintenance
H2 Testing an improvement
H2 Further reading
```

### request-cost

```text
H2 Repeated relationship queries
H2 Batching the children
H2 Joining several collections
H2 Connections and consistency
H2 Checking the response
H2 Further reading
```

### reporting

```text
H2 The report’s meaning
H2 Aggregation work
H2 Stored results
H2 Refresh and corrections
H2 Running reports elsewhere
H2 Further reading
```

### scaling

```text
H2 Find the limiting work
H2 Use one server well
H2 Copies for reads
  H3 A · writer [figure]
  H3 B · read copy [figure]
H2 Divide the writes
  H3 Shard A [figure]
  H3 Shard B [figure]
H2 What a cluster shares
H2 Capacity after a failure
H2 Further reading
H2 Sources and model notes
```

### replicas-and-failover

```text
H2 Copying a change
H2 What success confirms
H2 Routing a fresh read
H2 Replacing the writer
H2 Failure domains and regions
H2 Operating the copies
H2 Further reading
H2 Model notes
```

### partitioning-and-sharding

```text
H2 Local partitions and pruning
H2 Keys and maintenance
H2 Choosing a shard key
H2 Queries and rules across shards
H2 Moving live data
H2 Verification and cutover
H2 Further reading
H2 Sources and model notes
```

### schema-changes

```text
H2 Compatible stages
H2 Adding the new column
H2 Backfilling existing records
H2 Validation and constraints
H2 Cutover and retirement
H2 Further reading
```

### backup-and-restore

```text
H2 Recovery requirements
H2 What the backup contains
H2 A restore drill
H2 Recovering beyond the base backup
H2 When the WAL chain is incomplete
H2 Validating the service
H2 Keeping recovery usable
H2 Further reading
```

### access-control

```text
H2 Owners and application roles
H2 Granting the required work
H2 Restricting rows
H2 Testing with the actual identity
H2 Combining policies
H2 New objects and audit boundaries
H2 Further reading
```

### data-lifecycle

```text
H2 The deletion’s scope
H2 Deleting related records
H2 Other live copies
H2 Restores and reintroduction
H2 Expiring retained data
H2 Further reading
```

### product-comparison

```text
H2 Where the database runs
H2 What the application can assume
H2 How records are accessed
H2 What you will operate
H2 Making the choice concrete
H2 Further reading
```

### adding-another-system

```text
H2 Describe the missing behaviour
H2 Try the existing engine
H2 What another copy changes
H2 Deliver changes without forgetting them
H2 Follow a delivery through interruption
  H3 1 · Catalogue commit [figure]
  H3 2 · Search accepts [figure]
  H3 3 · Record delivery [figure]
H2 Rebuild and operate the copy
H2 Decide from an observed limit
H2 Further reading
```

## Findings and repairs

The original contents lists matched their H2 destinations and omitted figure labels. They were accurate top-level lists, but did not always expose the investigations inside those sections. Source edits preserve the existing section IDs used by incoming links.

### slow-queries

**Heading usability:** retain. The map proceeds from the application request to database waits, execution plans, maintenance and verification. “Waiting inside the database” prepares the lock investigation without implying that every delay is a lock. “Maintenance” is broad but contains one connected explanation of changing physical and statistical state.

**Coverage:** complete for the stated investigation. The 180 ms request separates pool acquisition, eleven queries and response construction; the next section locates the monitoring query on a separate server connection and explains blockers, idle transactions and snapshot refresh. The job example derives ten and then 5,000 matching rows and explains why better estimates need not change the access path. The final section supplies load, tail latency, timeouts and rollout verification. The opening's background queue is used to investigate distributions, not to promise a complete job-claiming protocol. No claim requires adding such a protocol here.

**Flow and writing:** the move from waiting to execution explicitly begins “Now suppose the request spends its time executing SQL”. The concrete saving of ten milliseconds from one optimisation makes the larger batching opportunity intelligible. No repair.

### request-cost

**Heading usability:** retain. Each heading identifies the next relationship-loading choice or its consequence. The existing flat outline is a short sequence of decisions, not several cases masquerading as independent main topics.

**Coverage:** complete. Checked parent and child identities, the 25/8/0 totals, preservation of an empty order, the four line/payment combinations, and the third-payment variation. The text supplies both repairs: separate child batches for individual records and preaggregation for amounts. It also handles large child collections, authorization, snapshots, one-connection transaction ownership and cleanup. The broad title is bounded by the opening's order-list response; an ORM configuration survey is a legitimate boundary.

**Flow and writing:** the question introducing joins follows naturally after two-command batching; the consistency section explains the new tradeoff introduced by multiple queries. The body, rather than a linked page alone, supplies the Repeatable Read option for ordinary reads. No repair.

### reporting

**Heading usability:** retain. Meaning → work → stored results → refresh → another location describes the actual decision. “Stored results” quickly names a materialized view and distinguishes an ordinary view; a separate heading for each term would interrupt a connected comparison.

**Coverage:** complete. The article derives daily grain and zero-day absence, explains broad scan/aggregation cost, follows a €30-to-€35 correction through live and stored totals, and distinguishes source snapshot from refresh completion. Incremental maintenance accounts for corrections, moves, deletion and repeated delivery. Replica and analytical-store boundaries have enough local explanation to support the choice. The linked request-cost join multiplication, replica conflict explanation and adding-another-system delivery/rebuild mechanisms were read in this batch and support their stated destinations. Detailed warehouse design is onward work, not missing report reasoning.

**Flow and writing:** “What happens when a source record changes?” introduces a useful change in state; the later 12:00–12:04 example answers the question of what a freshness label actually means. No repair.

### scaling

**Heading usability finding:** “Copies for reads” concealed two substantial techniques. Its only child headings were figure labels naming A and B, leaving the cache explanation absent from the navigation map even though the body teaches invalidation, expiry, cache misses and checkout authority. This is **complete but hard to find**, not missing technical coverage.

**Repair:** rename the H2 and contents entry to “Caches and read replicas”; add H3 “Caching repeated reads” and “Read replicas”. A short parent opening distinguishes reusing an answer from querying a database copy. Demote the replica figure's node labels to H4 and retain their local styling. The shard figure remains H3 beneath its H2 because it has no intervening article subheading.

**Coverage:** the body connects every proposed resource to the next request, distinguishes partitioning from write ownership, follows a large tenant's skew, explains global constraints and checks degraded capacity. The linked replication, partitioning and performance pieces were read and do provide their advertised next steps. Cache implementation and a distributed transaction protocol are legitimate boundaries; the current body does not recommend either without stating its new responsibility.

**Flow and writing:** retain the last-item contention example and the distinction between useful capacity and a growing queue. Reread the new parent opening through both subsections: it introduces the comparison without repeating the cache definition.

### replicas-and-failover

**Heading usability:** retain. “What success confirms” has a clear referent after the copying stages; “Replacing the writer” develops failure detection, exclusive authority, promotion and client recovery. The map supports the opening's three questions about freshness, survival and replacement.

**Coverage:** complete. Checked saved versus replayed WAL, the synchronous settings table, empty synchronous-standby configuration, a non-confirming replica, old snapshots, unknown client outcome, fencing old connections, candidate history and rebuilding the former primary. The article also covers retained-log pressure, standby query conflict and common failure domains. A production election implementation is deliberately outside scope, with an explicit account of who must supply it. The fencing explanation and five-step sequence finish the promised failover reasoning; a promotion command alone would not, but the article does not stop there.

**Fact spot-check:** PostgreSQL 18's synchronous-commit reference confirms the receive/write/flush/apply distinction and the need for configured synchronous standbys. No changed technical claim.

**Flow and writing:** the €20/€25 example persists through copying, read routing and failover, reducing reconstruction effort. No repair.

### partitioning-and-sharding

**Heading usability:** retain. The first two sections concern local tables, the next two concern distributed ownership, and the final two complete a live move. The opening previews that sequence, and “Now suppose independent tenants need more write capacity” explicitly introduces the second arrangement. Additional wrapper headings would add hierarchy without repairing a missing connection.

**Coverage:** complete. The body checks inclusive/exclusive boundaries, pruning versus an index, globally unique identity, missing future ranges, maintenance, co-location, skew, cross-shard queries and constraints. The move includes inserts, corrections and deletion, a gap-free snapshot/change boundary, draining, full-row comparison, enforced authority and rollback after new writes. Its single-database model is clearly distinguished from a distributed implementation. The verification is stronger than matching row counts, and the article explains why.

**Flow and writing:** two equally sized but different row sets give verification an immediate purpose. The later amount 35 on B makes stale rollback concrete. No repair.

### schema-changes

**Heading usability finding:** the stage-level map is useful, but “Adding the new column” contains both the expansion and a three-session lock-queue investigation. “Backfilling existing records” contains both a resumable batch and two concurrent execution schedules. Those consequential investigations were **buried**, not absent.

**Repair:** add H3 “Schema locks and timeouts” and “Backfill and concurrent writes”, with H4 “A blocked migration can delay readers” beneath the locks subsection. The coordinator’s independent check identified that the blocked-migration experiment belongs inside its lock topic; the initial H3 case label was demoted accordingly. Preserve the H2 contents list as a compact stage map; the subheadings give the detailed reading and heading navigation their additional landmarks. Existing text already introduces the separate original-table fixture and both backfill orderings, so no new experimental preamble is needed.

**Coverage:** complete. The reader/writer table, source-of-truth trigger, fallback read, bounded DDL, aborted-transaction cleanup, resumable batches, Read Committed target recheck, validation locks and B/C rollout account for the promised migration. The late rollback boundary is explicit: retaining an old column does not preserve its contents when new-only writers begin. Type conversion is an honest boundary of the same-meaning rename, not an essential omission.

**Flow and writing:** reread each new heading into its existing opening. “To see what the timeout protects” preserves the causal connection to the previous subsection. The backfill section explains the stale cached value before the successful schedules; no new technical claim or SQL change.

### backup-and-restore

**Heading usability finding:** “A restore drill” and “Recovering beyond the base backup” did not name the two distinct recovery methods. A returning reader had to infer which experiment restored a dump and which replayed WAL to a chosen point. Both explanations were **complete but harder to locate than necessary**.

**Repair:** use “Restoring a logical dump” and “Point-in-time recovery” in the H2s and contents. Keep “When the WAL chain is incomplete” as a main failure investigation because it has its own recoverability question and operational resolution. Preserve section anchors.

**Coverage:** complete. The article defines RPO/RTO, distinguishes backup scope and authority, reconstructs a dump, follows physical recovery past the base, and shows both the valid purchase excluded by an earlier target and failure when required WAL is missing. The validation stage explicitly returns to the logical-dump example, so request req-b is not confused with req-c. Access restoration, external effects and deletion replay are included. The data-lifecycle destination was read and does teach independent suppression history.

**Fact spot-check:** PostgreSQL 18's continuous-archiving guide confirms the uninterrupted WAL requirement and cluster-level recovery boundary. The heading change matches that documented operation; it does not alter the experiment or its reported evidence.

**Flow and writing:** retain “The dump stopped before request req-b” as the bridge into physical recovery. It explains why the second method is being investigated.

### access-control

**Heading usability:** retain. Identity, grants, row filtering, actual-role testing, policy composition and future objects are distinct steps. “Combining policies” introduces a new fixture and resets its statuses explicitly, so its place after the simple worker test is clear.

**Coverage:** complete for the shipping worker. The text distinguishes authentication from permission, schema usage from table grants, column restrictions from row policies, a permission error from zero changed rows, permissive OR from restrictive AND, and owners from runtime identities. The successful packing operation and forbidden email/tenant/deletion paths are all explained. Authentication has a short orientation and an official chapter link; implementing credential infrastructure is a legitimate boundary. Audit requirements are framed as a separate design task rather than a claim that statement logging solves them.

**Fact spot-check:** PostgreSQL 18's row-security documentation confirms default deny, bypass roles, policy combination and constraints' independent checks. No technical correction required.

**Flow and writing:** the visible-row truth table explains how adding a policy can widen access. Preserve it and the warning against treating a fully denying policy as a functioning workflow. No repair.

### data-lifecycle

**Heading usability:** retain. The map follows scope, local removal, downstream copies, restore suppression and expiry. Each heading contains the subject its opening establishes; no extra heading is required merely because a paragraph names a further copy.

**Coverage:** complete for the declared engineering task. The example preserves the deletion identity with local removal, distinguishes a failed foreign-key delete from policy selection, follows downstream acknowledgment and obsolete replay, and requires independently surviving deletion history before reopening a restore. The expiry section resolves the retention-window dependency and distinguishes detachment from erasure. Organizational/legal deadlines are explicitly outside scope, and the article does not imply that its mechanics select them. The outbox destination and recovery destination were read and supply the advertised delivery and validation explanations.

**Flow and writing:** the movement from one live customer and two saved customers into reintroduction makes the central problem concrete. The final properties follow demonstrated states instead of claiming deletion from a row count alone. No repair.

### product-comparison

**Heading usability finding:** “What the application can assume” covered a long transaction-snapshot comparison and then a substantial input-conversion comparison, with neither visible as a child heading. This is **buried complete coverage**, not a demand for more product features.

**Repair:** rename the H2/contents entry “Transaction behaviour and input rules”, introduce the two parts in one paragraph, and add H3 “Read snapshots and transaction boundaries” and “Input conversion and constraints”. This makes the two investigations discoverable and gives their parent an explicit scope.

**Coverage:** complete for a method of choosing among the stated candidates. The article accounts for process/server deployment, explicit transaction settings, conversion outcomes, physical access differences, editions/hosting, recovery and team experience. It identifies the engine trials it actually ran and separates documentation-derived comparisons. The offline notebook and shared order service receive concrete starting decisions; the existing-estate case explains migration cost. A universal brand ranking would conflict with the article's application-specific promise. No complete feature or licensing matrix is owed here.

**Flow and writing:** the new opening prepares the change from seeing committed data to accepting input. The retained “Data conversion deserves equally concrete cases” links the two methods without repeating the numerical examples.

### adding-another-system

**Heading usability finding:** “Try the existing engine” hid the native full-text search example; the two adjacent main delivery headings hid the relation between the transactional outbox mechanism and its worked interruption. The body already supplies the mechanism and consequential alternatives.

**Repair:** rename the search H2/contents label to “Full-text search in PostgreSQL”. Rename delivery to “Outbox delivery and change capture”, nest “An interrupted delivery” as an H3 subsection and nest its contents link accordingly. Demote its three figure labels to H4 while retaining local styling. The existing first paragraph of the case explains the catalogue connection, separate worker and separate commits; it supplies the needed case transition. Move the closing case boundary before the change-capture alternative and give that alternative H3 “Log-based change capture”. The coordinator caught that an initial parent label “Transactional outbox” excluded this alternative; the broader parent now contains both mechanisms.

**Coverage:** complete. The native example distinguishes normalization from typo tolerance and changes a generated representation with the row. The maintained copy explains false positives versus missing new records, source authority, transactional obligation, complete-state versions, atomic conditional application, deletion markers, lost responses, worker coordination and rebuild boundaries. The report and lifecycle destinations were read and support the linked freshness and retention explanations. Choosing/configuring a particular external search engine is beyond the explicitly generic decision.

**Flow and writing:** retain the source → search → acknowledgment sequence and the explicit successful no-op versus lost response distinction. The grouped case now belongs visibly to the mechanism it tests. No SQL or delivery-contract change.

## Evidence, boundaries and handoff

No essential absent or shallow explanation was found in the twelve articles. Five articles had substantial explanations that their heading maps concealed. Repairs change navigation and grouping; they do not narrow a title's promised work or add unverified technical recommendations. No shared component, layout, collection manifest, lesson, worksheet or publication state was changed.

Official documentation spot-checks on 16 October 2026:

- [PostgreSQL 18: row security](https://www.postgresql.org/docs/18/ddl-rowsecurity.html): role bypass, default denial, composition and integrity-check boundaries.
- [PostgreSQL 18: modifying tables](https://www.postgresql.org/docs/18/ddl-alter.html): adding a column, defaults and later constraint changes. The article's existing server schedules were read as recorded evidence; they were not rerun in this pass.
- [PostgreSQL 18: continuous archiving and PITR](https://www.postgresql.org/docs/18/continuous-archiving.html): physical base, uninterrupted WAL and recovery scope.
- [PostgreSQL 18: synchronous commit](https://www.postgresql.org/docs/18/runtime-config-wal.html#GUC-SYNCHRONOUS-COMMIT): configured standbys and remote write/flush/apply acknowledgments.

The review read each entire extracted body in document order, with the request-cost batch/join passage reread after tool-output truncation. It checked the substantial mutually linked explanations within this batch, rather than using link titles as coverage evidence. The PostgreSQL subcollection and all sandbox controls remain part of the coordinator's wider review; this record does not claim those entire destinations were reread or executed here.

Local source checks: changes are limited to the five listed Astro files; existing anchors are retained, newly added IDs are unique, and local figure CSS follows the changed heading levels. The Serena symbol overview cannot parse Astro under this project's TypeScript language service, so source inspection used bounded text reads and all source edits used Serena `replace_content`.

**Handoff status:** editorial and coverage review complete for this batch; local repairs ready for the coordinator's independent reread. The coordinator must run the shared build and inspect desktop/phone, light/dark rendering, especially the nested outbox contents entry and changed figure heading levels. No new operational experiment is required by these editorial changes. Existing statements about executed experiments remain attributed to their earlier evidence; this pass adds no execution claim.
