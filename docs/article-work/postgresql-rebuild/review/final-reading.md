# Final assembled editorial reread

Reviewed the fresh `/private/tmp/postgresql-rebuild-final/postgresql-<slug>/` artifacts in collection order on 2026-10-15, after the uncued first reading. This is an informed reread for flow, voice and repaired passages; it does not replace the original question log. Read assembled DOM chunks continuously, with optional disclosures kept distinct. Native screenshot crops are recorded separately from textual inspection. No article source inspected or edited. The repair record supplied context for rechecking, not advance answers for the preserved first reading.

## Inside PostgreSQL

The opening's distinctions between memory, disk and committed visibility still provide a useful reason to follow the product through the machinery. The sentence “The application receives the value three. That response establishes what this read saw; it does not reserve those units against another request” remains the strongest transition into concurrency: it gives the reader a concrete question rather than adding a warning from outside the example.

The new reservation SQL now appears immediately before the three-connection schedule. Its introduction explains the predicate, returned value and open-transaction instruction; step 2's “reserve two units” therefore has an already available command. Repeating that SQL in the next section is useful because the new trial explicitly resets stock to three and changes the question to competing buyers. The repair improves immediate practice without delaying the conceptual visibility explanation.

The revised durability figure text says “Separate transaction state: W committed,” which supports the prose's separation of page bytes from commit status. The ending's three routes explain what the later chapters offer and permit direct entry into search. It is a better collection handoff than an undifferentiated link list: machinery, distribution and richer queries each have a concrete purpose.

Writing judgment: accepted. Long but coherent, with details introduced through the same reservation. Some overview terms remain intentionally brief (non-summarising indexes, freezing), and their later chapters supply the depth. The new SQL and navigation fit the existing voice and do not read as review patches.

## Planning and executing a query

The revised opening now says “Tenant 0 owns 45,000 … each of tenants 1–100 owns 50.” That is early enough to support the later custom-plan prediction without opening setup. The reader can connect tenant 1 to a narrow index lookup and tenant 0 to a broad scan before seeing the reported result. The priority formula and explanation of multiples of 101 likewise appear before the first top-five query, so its IDs are no longer unexplained fixture facts.

The serial-plan setting is stated both in setup and visible prose, with an explicit reset and a later parallelism discussion. It adds reproducibility context without changing the main question. The key passage remains the explanation that top-N retains a small set but must examine all 50,000 candidates: memory saving and early output are different. The transition to sorting every payload says it is a different task, preventing accidental carryover of LIMIT 5.

Writing judgment: accepted. The repairs fit naturally and make predictions fair on the visible route. The memory section is still the most compressed part because it adds parallelism and asynchronous I/O, but both are tied to interpreting costs rather than introduced as a feature list. “Cold tenant” could still mean cache temperature to some readers; the adjacent 50-row explanation removes ambiguity sufficiently, so this is optional wording polish rather than a required change.

## Indexes in PostgreSQL

The three structures still have distinct explanatory jobs. The ordered event timeline makes the B-tree result predictable; the audit/urgent lists make GIN set combination visible; the ordered-versus-permuted timestamps show why BRIN can retain broad candidates without proving any matching row. “The summary does not say that the minute is actually present, or which rows contain it” remains a precise sentence at the point where a reader might overinterpret min/max information.

The operator-class passage is abstract for a paragraph, then resolves through containment versus extracted text. The ending returns each structure to write cost, so the page does not leave “finds candidates” as its whole account. The four-search skip-scan observation still invites curiosity about the exact counter but is carefully used only to show multiple searches, not to promise a three-seek model.

Writing judgment: accepted. The information-retained theme holds the page together and supports later JSON/spatial/vector chapters. Native crops of the GIN diagram at 390 and 1280, light and dark, show the repaired key/reference gap clearly. `urgent` and `B, C` are now visually separate at both widths. The mobile stacked ordering preserves the explanatory sequence. No remaining diagram repair is needed here.

## Row versions, transactions, and vacuum

The page still develops each opening promise in order: visibility, access-path preservation and reclamation. The 784/785 out-of-order commit example makes the active-ID list necessary; the HOT redirect then explains why deleting old payload cannot mean removing every trace of its slot. “The index still points to slot one; that slot now redirects it to slot two” is precise enough to carry the diagram's causal work in prose.

The new instruction before the schedule tells the practising reader to pause after step 5, inspect on B while A remains open, and inspect again after step 6. It also explains the consequence of running the whole schedule first and supplies a reset. This fixes the timing dependency at the correct point: before any reader can destroy the retained state they meant to inspect. The page-inspection query remains below, but the forward reference now tells the reader exactly when to use it.

Writing judgment: accepted. The added procedural paragraph is longer than a simple warning because it identifies both checkpoints and the reset; all of it earns its place. The later diagnostic distinction between eligibility and maintenance capacity remains grounded in that experiment. The freezing passage still asks the reader to picture circular ordering, but its consequence is explained sufficiently; a ring illustration is optional future support, not a condition of acceptance.

## WAL, checkpoints, and recovery

The chapter's two-stock-record experiment remains its centre. Both updates have durable WAL, only A commits, and the recovered values distinguish physical reconstruction from transaction visibility. The sentence explaining that the stored file still matched the initial bytes matters: it establishes why successful restart actually needed redo. The later P20/P30/P40 example then answers a different question—how to avoid applying a page change twice—without confusing LSNs with transaction IDs.

The progression from ordinary redo to torn-page repair gives full-page images a reason. The explanation of compact images prevents the measured 216-byte update from seeming inconsistent with an 8 KiB page. The final accidental DELETE and PITR paragraph extends recovery into a business-history decision, including the legitimate later commits that a rollback in time would omit.

Writing judgment: accepted. The page makes limits on evidence concrete instead of adding generic warnings. Its final retention topics are brief, but they prepare replication and backup questions without taking over the crash explanation. No new flow or voice problem found on continuous rereading.

## Following a change to another PostgreSQL server

The price progression still holds: 20 while replay is paused, 25 after catching up, 26 durable remotely but not applied, 27 after remote_apply, then the deliberate asynchronous divergence at 35. The promotion/rejoin section explicitly removes synchronous requirements before creating that divergence, so loss of 35 does not contradict the preceding promise. The phrase “Rewind is not a merge of accepted business operations” is justified immediately by the missing acknowledged price.

The repaired final section begins “For a separate failover scenario, return to the original arrangement: A is the primary and B is its physical standby.” This resolves the role reversal before C is introduced, at exactly the point where a reader needs the reset. Slot readiness and possession of C's consumed history can now be followed without mentally undoing the previous experiment.

Writing judgment: accepted. This is a dense page, but the ownership of each action and the concrete prices sustain its flow. The optional local-cluster setup remains operationally specific, and the logical configuration is appropriately identified as a separate topic rather than implied to follow from a publication alone. Native 390/1280 light/dark crops show the WAL-stream label clear of both server boxes. Desktop keeps it in the central track; mobile places the stream between stacked servers. The label repair is complete.

## Where distributed PostgreSQL work runs

The transition from replication is clear: the preceding page copies one history; this page assigns different rows and operations to owners. Native partitioning first demonstrates that splitting storage alone does not imply multiple machines. Ada and Bo then make the compound identity necessary before the article asks that identity to guide placement. “A foreign key does not silently fix an incomplete SELECT” is concise and well supported by the four-row wrong join.

The Citus section follows the tenant through hash, range, placement and local join. The two-phase schedule distinguishes the durable completion decision from simultaneous visibility, then applies that distinction to the earlier all-tenant sum. Its implementation paragraph remains explicitly versioned and limited to a multi-worker modification sequence. The final movement section keeps isolation, movement and splitting one tenant's workload separate through the same tenant 7.

Writing judgment: accepted. The broader FDW and compatible-system passages have a clear role: identify where familiar SQL stops proving familiar execution or transaction behaviour. The page does not pretend its Citus diagrams are observed cluster results. No new consequential flow issue found. This editorial reread does not independently revalidate the tagged Citus implementation evidence; that belongs to the separate technical review.

## JSON queries in PostgreSQL

The four-product fixture still does a great deal of useful work without changing identity: swapped seller prices establish the relationship problem; steel versus ceramic separates tag membership from compound containment; string capacity creates a real type-policy decision. The line “Its final AND cannot recover whether they were the same member” explains the failure in the query's information flow rather than merely labelling it wrong.

The capacity section explicitly distinguishes tolerant reads from enforced writes. It announces that the current constraint would fail, establishes that the imported measurement was truly numeric, repairs the representation, and then directs the reader to repeat validation. That completes the intended path rather than leaving a failure demonstration as the final state. The same guarded expression is visible in both index and query, so type semantics and access path remain connected.

Writing judgment: accepted. The sequence from containment to one-member conditions, row expansion, indexed expression, numeric policy and update ownership is coherent. The page remains useful as direct-entry reading because its fixture and operators are explained locally. No new consequential issue found.

## Full-text search in PostgreSQL

The first position example gives the later phrase experiment everything it needs: run@1, road@3 and the retained stop-word gap explain true/false/true without a hidden rule. The generated-column section then raises the field-join question, and the next section answers it through separate title/body matching. That is effective pacing rather than repetition.

The ranked corpus keeps access eligibility separate from relevance throughout. Document 1's title occurrence explains its higher score, while the statement that a low-ranked unauthorised document is still unauthorised gives filtering a practical consequence. The rename of document 2 then changes the result set through the same stored-generation rule. Trigram spelling comparison is clearly limited to supplied candidates, leaving vocabulary and evaluation as separate application work.

Writing judgment: accepted. The corpus is small enough to remember, and each row earns a role. Matching, ranking, retrieval and publication/tenant eligibility remain distinct without becoming a taxonomy for its own sake. The ending supplies concrete evaluation questions rather than claiming that the toy corpus measures real search quality. No new consequential issue found.

## Vector search in PostgreSQL

The opening continues to separate model usefulness from database retrieval accuracy. The four-point example makes filtered top-k versus filtering a limited candidate set visible before introducing approximation. The layered HNSW account supplies a causal reason that a nearer point can remain unseen: its connection was not explored. That supports the later ef_search tradeoff without requiring the reader to understand the entire construction algorithm.

The experiment table is unusually honest about method changes: ef_search 200 produces perfect overlap through a sequential scan, while strict iteration returns ten but overlaps nine. The paragraph “Its perfect agreement is not evidence that HNSW with this setting achieved perfect recall” follows the plan evidence and protects the central inference. The revision-5/revision-6 update then gives embedding freshness its own complete application branch.

Writing judgment: accepted. The article keeps synthetic retrieval measurements separate from semantic quality and does not use recall as a product-quality proxy. Native 390/1280 light/dark crops show the query label below the axis, x=1 farther down, and point 3's label clear of the diagonal. No collisions remain in the inspected figure. A layered HNSW illustration could still reduce mental drawing, but the prose is sufficient and no new medium is required for acceptance.

## Types and extensions in PostgreSQL

The half-open booking interval is explained from the desired adjacent-booking behaviour before notation appears. The table's checks now visibly include `isfinite` on both bounds as well as nonempty and nonnull-bound conditions, matching the stated finite-interval policy. Exclusion's conjunction of room equality and overlap remains concrete: Cedar fails, Birch succeeds, and a concurrent writer waits before receiving the same violation.

The temporal coverage section preserves its state transitions: remove the assignment, introduce the gap, retry and fail, close the gap and succeed. That is a complete exercise rather than a series of incompatible schema states. The venue table gives each eligibility condition a distinct counterexample, and the 189−66=123 spatial plan extends the collection's candidate-versus-exact-match theme without assuming every GiST candidate qualifies.

Writing judgment: accepted. The closing installation boundaries arise from the actual range, btree_gist, PostGIS and pgvector examples, so the operational discussion feels necessary. It distinguishes server package availability, per-database objects and upgrades without overwhelming the booking story. The optional question of enforcing one endpoint convention remains an application-design extension, not an error in the shown half-open examples. No new consequential issue found.

## Collection judgment and acceptance

Accepted for the final editorial gate. All eleven revised pages were read continuously from their assembled text, including captions, tables, code, navigation and separate optional disclosures. No unresolved consequential flow or voice problem remains from this review. The first-reading findings are preserved in `first-reading.md`; this informed reread records their resolution rather than replacing the original experience.

The repairs improve the explanation where readers need the information: tenant sizes before prediction, reservation SQL before its schedule, physical-inspection checkpoints before cleanup, and the original replication topology before adding C. They do not add a parallel layer of reviewer commentary. The changed GIN, replication and vector figures were inspected in native screenshot crops at 390 and 1280 pixels in light and dark themes; their reported spacing/overlap problems are resolved.

Across the collection, examples tend to earn their complexity. The same small values connect mechanisms to outcomes; larger fixtures are labelled as separate; reported experiments are distinguished from schematic models. The overview now gives three purposeful routes through the material, while the JSON/search/extension pages supply local starting examples for direct entry. Repeated distinctions—candidate versus match, physical bytes versus committed view, local identity versus ownership, retrieval accuracy versus usefulness—reappear with new consequences rather than mere restatement.

Remaining suggestions are optional: replace “cold tenant” with “small tenant,” or add future visual support for transaction-ID circular ordering and HNSW layers. None is required for acceptance. This was an editorial assembled-artifact review, not execution of SQL/downloads, a fresh technical source audit, a human novice session or a complete live responsive/interaction test. Build, technical verification and publication authorization remain separate responsibilities. No article files were edited.
