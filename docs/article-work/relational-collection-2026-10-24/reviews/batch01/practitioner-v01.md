# Practitioner review · article batch · r00, r01, r02 · batch01-v01

Highest severity: none

Fresh independent first coverage of all five practitioner checks for each complete piece. This was a technical challenge of the frozen articles, not confirmation of an earlier verdict. No earlier reports, repair decisions or author teaching notes were consulted. No findings are raised; each piece's next available finding number remains practitioner-1.

## Inputs and integrity

The fixed input manifest is [v01/manifest.json](v01/manifest.json), SHA-256 `d2519772bab1714502e434d74215656e6344e83bb5874368c6ca2cced01f261e`. At `2026-10-23T23:55:33.849856+00:00`, an independent SHA-256 pass verified all 108 files listed in it: zero missing files or mismatches. Hash verification is an integrity check, not a claim to have read every shared stylesheet or visual receipt.

Read in full:

- Frozen article fragments `source/src/articles/relational-collection/r00.astro`, `r01.astro`, `r02.astro`; all claim-bearing figure components they import; r00's `shop.mjs`, controls and shared `stepper.mjs`; r02's `predicates.mjs`; both complete downloadable worksheets; `core.json` and `values.json`. Clipped initial combined output was recovered through separate complete/bounded reads.
- `context/commission.md`, `briefs.json`, `example.md`; `tree.yaml` root/design/value/lifecycle/JSON/query/aggregate plans and the relevant enforcement, recovery and isolation/locking ownership passages. The rest of the tree was inspected by its ID/title/slug outline, not treated as written neighbouring articles.
- Relevant rendering/link/disclosure dependencies: `RelationalCollectionDraft.astro`, `ArticleBody.astro`, `RelationalDraftNavigation.astro`, and the worksheet endpoint source.
- Applicable mechanical records listed below, critically as observations with provenance rather than quality verdicts.
- Complete rendered articles at `http://127.0.0.1:4370/review/relational-collection/`, `/modelling/`, `/values/`, including expanded source sections and figure text alternatives. Used the article controls afresh.

Principal article hashes:

| Piece | SHA-256 |
| --- | --- |
| r00 | `08f2f667d25ea1a4d8323b0a0ea2da9021a3d74c9ce8cd43c8388602daa563ac` |
| r01 | `b5b0d330ce5e811317c69dabcb15a946a3244fd7fb7c933179df04aba767eeed` |
| r02 | `efde5569e9373914d55814d3d6850b727709efb9ff279099e65ed8991a2c392c` |
| modelling.sql | `534f12aa6f5fa158e8bdb52324f2d64c468ce67d578c8703532b4e594e08e916` |
| values-experiment.sql | `e62bebe57d94a18504d35210b9b2f3369e962aef39998d950d4e878691203462` |
| core.json | `bdae3259a820ed6a81e7f3e95dabce8bcc7a03eae11ff0a1f09cbe1d2d46948c` |
| values.json | `cf6a8156fefb35db4723e837a78bc0d925ebbfb952dcb23714bfcf3817c1439c` |
| r02 predicates.mjs | `6ceb9d563dafae4c3274d26a9b6c6e4881a207f92832b807a78ff4c8182e8b27` |

All other component, context, verifier and receipt hashes are exactly those in the verified manifest. Only the practitioner perspective and its database-verification reference were used as review instructions.

## r00 · Relational databases

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass | Key/reference, join/grain, atomicity, PostgreSQL Read Committed update recheck, Serializable and qualified durability explanations agree with primary sources and the displayed facts. |
| Evidence | pass | The drawings explicitly claim chosen conceptual schedules, not measured execution. All displayed arithmetic is recoverable from the fixed rows. |
| Coverage | pass | Supplies the promised useful introduction: related facts, queries, enforcement, all-or-nothing purchase, competing writers, deployment/fit and meaningful onward choices. |
| Depth, both ways | pass | Explains enough of each mechanism to establish its practical consequence; does not require a newcomer to implement recovery, retries or multi-row concurrency here. |
| Ownership | pass | Parent-level answers stand on their own while deeper design, result grain, isolation, access cost and recovery retain their named owners. |

### Technical challenge and rendered observations

Checked the two-lines/two-payments counterexample for order 101: four joined pairs would duplicate both independent amounts. Receipt 103 returns two lines, 20.00 and 9.00; order totals and paid/due amounts match the fixed example. The product key supplies at most one match, with the core non-missing reference supplying existence.

Read every scripted transaction/race state and both text alternatives; used receipt Next through its final state, purchase Next through commit then switched to rollback, and both complete race schedules. Commit showed stock 0/10 and two lines; rollback restored 1/12 and no 103. The unsafe ending committed 103 and 104 with stock 0; guarded ending committed only 103 after waiting, rechecking and rolling Tariq back. The figure's caption explicitly limits the race to PostgreSQL Read Committed and includes Mina's omitted tea work in her same transaction. This avoids claiming that waiting alone repairs a stale saved write or that a single row's rule solves every invariant.

The durability promise includes normal settings and storage honouring flushes; it is not a promise against losing storage. External effects and an uncertain commit reply are correctly distinguished. There is no claimed native run to infer from these illustrations.

### Findings

None.

## r01 · Relations, keys and normalisation

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass | Candidate/superkey minimality, dependencies within valid states, 2NF/3NF/BCNF qualifications and the retained-key reconstruction are sound for the stated design. |
| Evidence | pass | Conceptual alternatives and later-price history are labelled; the exact worksheet and its observed PostgreSQL 18.6 results match. |
| Coverage | pass | Covers row meaning, identities, repeated-product lines, surrogate/business uniqueness, all three anomalies, reconstruction and justified historical/derived copies. |
| Depth, both ways | pass | The optional prime-column/BCNF disclosure prevents the mnemonic becoming a false general rule without forcing a formal normalisation course into the main route. |
| Ownership | pass | Owns dependency-based row design; enforcement, temporal correction/lifecycle, JSON implementation and workload measurements remain bounded hand-offs. |

### Technical challenge and rendered observations

Tested the explanations against future states rather than the five-row sample alone: duplicate customer names are permitted; the same product may occupy separate lines; adding a surrogate does not remove `(order_id, line_no)` as business identity. Generation and uniqueness are explicitly separate. Both nullable-reference and duplicate-match hazards are addressed by the reconstruction's required foreign keys and keys. The worksheet's composite primary key makes both components non-missing even though the column declarations do not repeat `NOT NULL`.

The normal-form discussion tests every candidate key. Its third-normal-form prime-column exception and BCNF determinant rule are materially more careful than the shorthand. Source checking supported the definitions and the distinction between a dependency in each valid snapshot and immutability over time.

Used all three anomaly choices and expanded both disclosures. Four current-name edit locations, Edda without a sale, and Tariq surviving removal of order 102 agree with the source fixture. Read the dependency and price figures and captions. Price 25.00 is explicitly the accepted 21 October history; the order line remains 20.00 and does not follow the later catalogue. The discussion distinguishes historical evidence from a derived copy, identifies authority/freshness/rebuild obligations, and does not promise automatically maintained PostgreSQL materialised views.

### Findings

None.

## r02 · Values, missing data and equality

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass | Decimal range/rounding, instant and local-time meanings, text comparison, scalar NULL logic, ordering and constraint semantics agree with PostgreSQL 18 sources and supplied native results. |
| Evidence | pass | Exact native worksheet, data, verifier and predicate receipts remain applicable; diagrams and browser logic are explicitly illustrative. |
| Coverage | pass | Provides the promised choices for money/time/text and repairs for NULL predicates/uniqueness, with realistic rounding, DST, canonicalisation and empty-input pitfalls. |
| Depth, both ways | pass | Includes the awkward decisions needed to use the types safely while leaving aggregate variants, existence queries and full constraint implementation to their owners. |
| Ownership | pass | Owns value meaning and scalar comparison; r01 owns row identity, RL79 enforcement, RL81 absence-query structure, RL82 aggregate detail and RL80 changing history. |

### Technical challenge and rendered observations

Checked the exact/approximate counterexample and rounding at unit versus line boundaries; the decimal column is not presented as repairing earlier binary rounding. Fixed-scale integer amounts carry scale/range qualifications and are not asserted to represent all currencies.

The instant/zone-free distinction is correct in both `AT TIME ZONE` directions. The named display zone is retained separately. Offset-free input, repeated/nonexistent local readings, date-only meanings and half-open local-day boundaries are addressed. The native receipt confirms the stated 25-hour Stockholm day and S501's 18:00Z/19:00 local display; the no-orders result is consistent with the unchanged core dates.

Text equality is tied to actual collation and intended identity, not visual appearance or automatic lowercasing. Unicode normalisation is qualified to UTF-8 and kept distinct from case/accent policy. A stronger type or a blanket canonicalisation rule is not claimed to settle the business identity.

Used all six filter choices afresh and read every explanation/text alternative. Expected included IDs were respectively `[102]`, `[101]`, `[101]`, `[103]`, `[101,103]`, `[101,103]`; the table retained false/unknown distinctions and agreed with all 18 native scalar truth values. Explicit optional delivery notes remain separate from core orders. `NOT IN`'s nullable right side, empty `SUM` versus unknown payment amount, deliberate `COALESCE`, NULL ordering and the independent presence/value/uniqueness rules are covered. The worksheet includes both admitted NULLs and narrow expected rejections, rather than merely displaying successful declarations.

### Findings

None.

## Batch coverage and ownership

All three use the same IDs, five line rows and 29.00 order 103 amount. The report snapshot, purchase rewind, unsafe alternative and later catalogue change stay explicitly separate. Edda remains a customer without core orders; class S501 and delivery-note E8 are labelled extensions.

The progression is useful at the commissioned level: r00 establishes the questions and first mechanisms, r01 teaches how to assign facts and identities, r02 teaches what stored values and equality mean. Some local repetition is necessary explanation at those successive depths, not duplicate full ownership. No missing specialist treatment was promoted to a defect merely because it belongs to a later planned article. In particular, COUNT variants, a full NOT EXISTS query, delete/deferred-reference actions, index/collation implementation and multi-row concurrency are not prerequisites the reader must supply to follow these three pieces' promised judgement.

This is complete article-batch practitioner coverage for r00–r02, not corpus coverage of 58 destinations or a judgement on unwritten neighbours.

## Mechanical evidence reused and fresh verification

- **r01:** reused `mechanical/r01/native-environment.txt`, `run-postgresql.sh`, `modelling-result.txt`, `input-hashes.txt`, `final-source-hashes.txt`, and `download-check.json`. PostgreSQL 18.6/Homebrew on aarch64 Darwin; command is `psql -X -h <owned-private-socket> -p 54871 -d postgres -v ON_ERROR_STOP=1 -f <exact modelling.sql>`. The runner clears inherited settings with `env -i`, disables TCP, verifies its owned data directory before writes and installs cleanup. Results reconstruct five exact lines, demonstrate conflicting copied names and disappearing flat customer facts, admit two surrogate-only duplicates, reject the protected duplicate, and preserve agreed price/29.00. The file hash equals the current frozen and delivered file. The historical runner was read, never rerun against its old workspace. Its cleanup trap is visible; the record is not a fresh independent observation that its historical cleanup completed.
- **r02:** reused `mechanical/r02/native-run.json`, `native-results.txt`, `verify.py`, `source-hashes.json`, `predicate-native.json`, `predicate-model-check.json`, `download-check.json`. Native run started `2026-10-23T23:30:59.277068+00:00`, recorded 0.922 seconds, PostgreSQL 18.6/Homebrew, UTF8, private socket, TCP off, inherited connection settings removed, owned data directory verified before mutation, system ID `7700009892195188066`, stopped/removed attestation true. The verifier reads the exact worksheet hash, checks narrow duplicate/null/value rejections and asserts arithmetic, time, Unicode and NULL results. The model receipt records Node v24.16.0 at `23:31:41.950Z` and binds all 18 comparisons to the exact current predicate/data/native-result hashes. Read the summary QA receipt only as additional mechanical context; its pass label did not replace any practitioner check.
- **Fresh transport check:** at `2026-10-23T23:58:40.828759+00:00` and `23:58:40.829715+00:00`, read the actual frozen build endpoints without trailing slash. Both returned HTTP 200, exactly 6,376 and 5,218 bytes, with SHA-256 hashes equal to the reviewed worksheets above. Unlike the old development-server receipts, the static preview reports `application/x-sql` and no Content-Disposition; the bytes remain exact. The initial sandbox loopback request was denied, then the narrowly scoped read-only escalation succeeded.
- **Fresh rendered checks:** all complete pages and relevant expanded disclosures read in the browser; interaction observations above are new. No existing database was contacted. No native database run was repeated, because the source/data/verifier/environment receipts remain applicable to these unchanged examples. No article, plan, skill, frozen input or build was changed.

## Primary sources checked

Checked during this review on 23 October 2026 UTC (24 October locally):

- r00: PostgreSQL 18 [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html), [Table Expressions](https://www.postgresql.org/docs/18/queries-table-expressions.html), [Transactions](https://www.postgresql.org/docs/18/tutorial-transactions.html), [Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html), [WAL](https://www.postgresql.org/docs/18/wal-intro.html), [Sorting Rows](https://www.postgresql.org/docs/18/queries-order.html); SQLite [Appropriate Uses](https://www.sqlite.org/whentouse.html).
- r01: Codd's [1970 paper record and abstract](https://research.ibm.com/publications/a-relational-model-of-data-for-large-shared-data-banks); his [1971 research report, reproduced transcription](https://thaumatorium.com/articles/the-papers-of-ef-the-coddfather-codd/1971b-further-normalization-of-the-data-base-relational-model/), especially candidate keys and sections 2–3; Fagin's original [1977 paper](https://www.comp.nus.edu.sg/~lingtw/papers/fagin.pdf), especially functional dependencies and BCNF/nonloss definitions; PostgreSQL [Identity Columns](https://www.postgresql.org/docs/18/ddl-identity-columns.html), [Arrays](https://www.postgresql.org/docs/18/arrays.html#ARRAYS-SEARCHING), [Materialized Views](https://www.postgresql.org/docs/18/rules-materializedviews.html), plus the shared constraint/join sources.
- r02: PostgreSQL [Numeric Types](https://www.postgresql.org/docs/18/datatype-numeric.html), [Date/Time Types](https://www.postgresql.org/docs/18/datatype-datetime.html), [AT TIME ZONE](https://www.postgresql.org/docs/18/functions-datetime.html#FUNCTIONS-DATETIME-ZONECONVERT), [Collation Support](https://www.postgresql.org/docs/18/collation.html), [String Functions](https://www.postgresql.org/docs/18/functions-string.html), [Comparison](https://www.postgresql.org/docs/18/functions-comparison.html), [Logical Operators](https://www.postgresql.org/docs/18/functions-logical.html), [Subquery Expressions](https://www.postgresql.org/docs/18/functions-subquery.html), [Conditional Expressions](https://www.postgresql.org/docs/18/functions-conditional.html), [Aggregate Functions](https://www.postgresql.org/docs/18/functions-aggregate.html), and the shared sorting/constraint/table-expression sources.

## Limits and timing

No first-action clock was captured, so no invented total duration is reported. Recorded checkpoints: complete manifest verification at 23:55:33 UTC; fresh endpoint checks at 23:58:40 UTC; final review clock at **2026-10-23 23:59:22 UTC** before saving this report. Primary-source and browser checks occurred in this session between the initial reading and that final checkpoint.

Native observations are explicitly reused author/root receipts, not fresh reviewer executions. I checked their content, counterexamples, exact relevant hashes and applicability; I did not independently reproduce the old machines, crash durability, a two-session race, all ICU configurations, or another database product. The introductory race remains a documented conceptual schedule rather than a claimed native observation. No performance, recovery-success or geographic measurement is inferred. Visual accessibility/contrast completeness, publication suitability and builds remain outside this practitioner's report. Required independent perspectives and later complete checks remain the coordinator's responsibility; a clean first coverage does not finish the article review schedule or authorise publication.
