# B37 practitioner review — a31

Verdict: **PASS** (full initial review). Required repairs: none.

## Optional accuracy advice

**a31-O1 — Describe the deliberately advanced sequence state precisely** (`b37/a31.astro:128`; worksheet `rehearse.py:211`). The rehearsal explicitly calls `setval(...,5000,true)` at the source; it does not generate every missing allocation up to 5000. Prefer “The drill advanced the source sequence to 5000 to model allocations beyond the retained rows” to “last allocated value was 5000, with gaps from allocations…”. This is a non-blocking observation-label improvement: the retained output establishes 5000|true, the subscriber's 101|false collision and the correct state transfer independently of how the source reached that value. The source ledger already accurately says the sequence was advanced. No native/model repair is needed.

## Scope, completeness and practical judgement

Read the complete article, assigned context, primary-source ledger, writer handoff, worksheet, native evidence, model and figure implementation. Reused the immediately preceding actual a06/a29/a30 family reviews and checked their ownership against this article's supplied plans. The original goal remains expert relational practice, rather than migration-tool specialism.

The article gives a complete, simpler paused move first, then earns the logical-copy path through its additional obligations. It connects compatibility/object scope, a supported initial-copy/stream join, explicit relation readiness, writer exclusion, final scoped marker, stable comparison, allocator state, refreshed application access, bounded admission, return and cleanup. It distinguishes abort before destination writes from preserving new destination history afterwards. Those decisions supply useful operating depth within its seven-section brief.

The parent still owns application compatibility and lifecycle gates; a29 owns physical schema deployment, a30 guarded transformations, and the operational children own underlying replica and restore procedures. The brief reuse of those mechanisms is necessary here and does not duplicate their procedures. It does not imply that a local role fence, miniature loopback copy or unexecuted reverse transfer establishes production acceptance.

## Independent native reproduction and audit

Executed the complete inspected worksheet with installed PostgreSQL 18.6 binaries, Python standard library only, retaining [independent native evidence](practitioner-native.json). It created two fresh clusters under `a31-cutover-x4dfnm7v` on own ports 59378/59385. No shared service was contacted or reconfigured. The run passed, retaining 98 command/output records and both server logs.

Independently audited both the author and new raw results against the exact SQL and an independently constructed expected identity/value set; the conclusion does not rely on the worksheet's final pass flag:

- Paused restore: all 2,000 ordered order rows, item rows and marker agree exactly; repeated restore fails; the fresh destination role generates 2101, establishing full-dump sequence transfer.
- Logical route: all three declared relations reach ready; order 101 and its item line change together, 102 disappears, and during-copy/old-pool orders arrive. At final comparison, both sides have exactly IDs 101–2100 except 102, plus 2101 and 2102: 2,001 orders and corresponding lines. Checked every reference, status, total and item quantity; the independently recomputed total/item rule holds.
- NOLOGIN alone: an existing source session completes its insert and COMMIT. After revocation/NOLOGIN/termination, the sleeping transaction exits with 57P01, its uncommitted order is absent, and fresh application login is refused. This proves only the fixture role boundary.
- Final marker: after disable and observed worker shutdown, the destination returns zero matching markers. Re-enable delivers one marker; the declared relation set is ready. A second disable/quiescence precedes comparison and independent destination writes.
- Validation failure: injected total 999 at destination ID 103 changes exactly that one value while both row counts remain 2,001. The corrected exact comparison and domain invariant pass.
- Allocator gate: subscriber state is 101|false and its generated insert fails with 23505 on ID 101; copying source 5000|true produces 5001 for the fresh application transaction. The later negative total fails with 23514.
- New destination history: its order and item transaction commits, a fresh application read returns paid|100, and the source has zero destination-only orders. A blind return would therefore lose visibility of accepted work.
- Cleanup: subscription removal confirms source slot count zero; both stops return success and both status probes return exit 3. Independently checked that the unique temporary parent directory is absent and neither own port listens. The worksheet process exited; no own clusters or sessions remain.

Timings were not treated as benchmarks or complete service-pause measurements. The ledger correctly records their narrower intervals and unperformed volume/network/application acceptance.

## Primary contracts and working models

Checked the PostgreSQL 18 contracts for [initial synchronisation and transaction order](https://www.postgresql.org/docs/18/logical-replication-architecture.html), [replication omissions](https://www.postgresql.org/docs/18/logical-replication-restrictions.html), [subscription options/restrictions](https://www.postgresql.org/docs/18/sql-createsubscription.html), [relation readiness](https://www.postgresql.org/docs/18/catalog-pg-subscription-rel.html), [publication identity](https://www.postgresql.org/docs/18/logical-replication-publication.html), [dump](https://www.postgresql.org/docs/18/app-pgdump.html), [restore](https://www.postgresql.org/docs/18/app-pgrestore.html), [globals](https://www.postgresql.org/docs/18/app-pg-dumpall.html), [sequence state](https://www.postgresql.org/docs/18/functions-sequence.html) and [subscription cleanup](https://www.postgresql.org/docs/18/sql-dropsubscription.html). The final-marker rule is correctly a derived protocol under the stated one-subscription/ready-table/serial-apply/fenced-writer prerequisites. It is not presented as a universal cross-tool barrier. The common-S figure explicitly distinguishes its conceptual snapshot from PostgreSQL's per-table initial synchronisation.

Walked all **60 configured rendered states across five figures and 14 branches** on immutable 4438. Checked every event, panel, value, result and narration against the pure model and relevant prose/native boundary. The tight pause remains unproved; a capture gap is rejected; wrong identities and values close their data gates; pool/marker/sequence failures never authorise destination writes; the return branches preserve their different history obligations. Later cutover checks remain inspectable as expressly described, while the real runbook stops at its first failure. Controls change choices at the current causal step and generated row styling is present. The model verifier's 14 branch assertions also pass.

All four component hashes match B37; the article snapshot matches rendered source. No article, component, source evidence, shared build, Git or server configuration changes made. Browser download was not activated. Frozen preview released after this review.
