# Practitioner review · final complete articles · r00/r01/r02 · batch01-v02

Inputs read: the [frozen manifest](v02/manifest.json), complete rendered r00, r01 and r02 at the specified preview; their frozen source and relevant figures/data/worksheets; [commission](v02/context/commission.md), [briefs](v02/context/briefs.json), [example](v02/context/example.md) and parent/child/neighbour scopes in [tree](v02/context/tree.yaml); relevant permitted mechanical records. I read the review skill and its practitioner perspective only. No earlier drafts, findings, decisions, review reports or writer notes were inspected. No article edits or delegation were made.

Highest severity: none.

This is fresh independent complete practitioner coverage of each of these three articles, including new technical challenges and the practical judgement each promises. It is not corpus coverage of the unfinished collection. All five checks below apply independently to each complete article.

## r00 · Relational databases

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | pass | Keys, receipt joins, grouped totals, transaction visibility, the two stock schedules and the qualified durability promise agree with the example and primary documentation. |
| 2. Evidence | pass | The drawings explicitly use chosen illustrative schedules, not measured execution; their stated results follow the displayed data. No native-run claim needs extending to them. |
| 3. Coverage | pass | Establishes shared facts, row meaning, rules, atomic purchase and concurrency, then gives reasons to choose relational storage and meaningful next routes. |
| 4. Depth, both ways | pass | Enough SQL and failure reasoning for an engineer new to databases; the missing-reply and external-effect boundaries are made concrete without requiring their protocols yet. No missing understanding or unnecessary depth warrants a finding. |
| 5. Ownership | pass | Gives the introductory answer while handing off modelling, grain, enforcement, isolation, access costs, application work and recovery. |

Fresh technical challenges: I checked whether the stock check alone proves inventory correctness, whether an implicit row-lock wait rescues a saved-value write, and whether atomic visibility means an older read must suddenly advance. The article handles each: both unsafe purchases leave stock zero; only the conditional current-row update rechecks availability; and Figure 3 expressly gives each illustrated ordinary read a fresh start while warning about older long-running views. The query arithmetic preserves the distinction between report state and the separate purchase/race rewind. Order 101's two lines and two payments do produce four direct-join pairs; the given totals are 39.50, 40.00 and 29.00.

Primary checks: PostgreSQL 18 [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html), [Table Expressions](https://www.postgresql.org/docs/18/queries-table-expressions.html), [Transactions](https://www.postgresql.org/docs/18/tutorial-transactions.html), [Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html), [Write-Ahead Logging](https://www.postgresql.org/docs/18/wal-intro.html) and [WAL settings](https://www.postgresql.org/docs/18/runtime-config-wal.html), plus SQLite's [single-file explanation](https://www.sqlite.org/onefile.html). The PostgreSQL Read Committed update rule directly supports the stated wait/recheck schedule. The WAL sources support the crash promise within its stated settings and storage assumptions; the article does not promise protection against lost storage or erroneous committed work.

Findings: none.

## r01 · Relations, keys and normalisation

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | pass | Grain, candidate/superkeys, functional dependence, lossless reconstruction and the scoped normal-form definitions are technically sound. |
| 2. Evidence | pass | The worksheet, independent sales-sheet fixture, assertions and recorded PostgreSQL 18.6 output support its exact reconstruction, anomaly, identity and price claims. |
| 3. Coverage | pass | Teaches choices about row meaning, independent lifetimes, identity, dependencies and useful copies through changes that expose mistakes. |
| 4. Depth, both ways | pass | Gives useful design judgement beyond naming forms; optional precise definitions prevent the shorthand becoming an incorrect general test. No substantive missing or excessive depth identified. |
| 5. Ownership | pass | Owns the logical design and copy contract; leaves value semantics, declared enforcement, lifecycle protocols and measured query work to their neighbours. |

Fresh technical challenges: I tested the reasoning against a valid repeated product on one order, a surrogate that admits two instances of the same business line, and the difference between a snapshot dependency and an immutable historical fact. The article explicitly distinguishes all three. The lossless claim is tied to retained associations, non-missing references and unique referenced keys, rather than merely matching a row count. The worksheet compares its reconstruction with an independently populated flat fixture using `EXCEPT ALL` in both directions, so the acceptance test can detect changed values and multiplicities. Its expected duplicate rejection catches `unique_violation` narrowly.

The main normal-form account is appropriate for this shop. The optional detail correctly defines prime columns, checks every candidate key, states the prime-attribute exception in 3NF and the stronger BCNF determinant requirement. Its brief mention of higher forms does not pretend that all dependency problems have been exhausted. Current catalogue price and agreed line price have different meanings; the derived-total passage adds an authority, maintenance, freshness and rebuild contract instead of treating any repeated value as a design failure.

Primary checks: Codd's [Further Normalization of the Data Base Relational Model](https://thaumatorium.com/articles/the-papers-of-ef-the-coddfather-codd/1971b-further-normalization-of-the-data-base-relational-model/) (RJ909 transcription, sections 1–3), and Fagin's [Multivalued Dependencies and a New Normal Form for Relational Databases](https://www.comp.nus.edu.sg/~lingtw/papers/fagin.pdf) (functional dependencies, lossless decomposition and section 3's BCNF definition). PostgreSQL 18 [Identity Columns](https://www.postgresql.org/docs/18/ddl-identity-columns.html) confirms that generation does not ensure uniqueness; [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html), [Arrays](https://www.postgresql.org/docs/18/arrays.html#ARRAYS-SEARCHING) and [Materialized Views](https://www.postgresql.org/docs/18/rules-materializedviews.html) support the SQL implementation boundaries and the stored-copy discussion.

Applicable execution evidence: [environment](v02/mechanical/r01/native-environment.txt), [runner](v02/mechanical/r01/run-postgresql.sh), [native output](v02/mechanical/r01/modelling-result.txt), [frozen worksheet](v02/source/src/components/relational-collection/r01/downloads/modelling.sql) and [provenance](v02/mechanical/provenance.json). I inspected the actual statements and acceptance checks rather than accepting the pass label alone. The data directory was verified before mutation; the runner uses a new directory, private socket, disabled TCP, clean environment and cleanup trap. Its recorded version is PostgreSQL 18.6 on aarch64 macOS. The exact worksheet hash is unchanged. I reused that observation and did not represent it as a new independent native run.

Findings: none.

## r02 · Values, missing data and equality

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | pass | Money, rounding, instant/local-time conversion, collation, Unicode and NULL semantics agree with the PostgreSQL 18 sources and stated data. |
| 2. Evidence | pass | Exact-input PostgreSQL 18.6 evidence supports the displayed outputs and expected rejections; figures clearly describe illustrative client-side logic. |
| 3. Coverage | pass | Delivers deliberate money/time/text choices and repairs NULL predicates and uniqueness, including practical boundary cases. |
| 4. Depth, both ways | pass | Includes scale conversion, upstream rounding, DST, identity policy, `NOT IN`, empty sums and unknown checks without requiring a complete driver, scheduling or enforcement tutorial. |
| 5. Ownership | pass | Owns value meaning and NULL behaviour; leaves join absence/cardinality, aggregate mechanics and constraint implementation to their owning articles. |

Fresh technical challenges: I checked whether a decimal column fixes approximation already introduced upstream, whether a local day can be expressed as 24 hours, and whether negation or a uniqueness declaration makes NULL behave like ordinary text. The article answers each explicitly and correctly. Its Stockholm interval is 25 hours, bounded by 24 October 22:00 UTC and 25 October 23:00 UTC; the worksheet tests the exact instants. It distinguishes a named display/scheduling zone from the instant stored by `timestamptz`, and makes accepting ambiguous/nonexistent appointments a policy decision. The text comparison discussion preserves the distinction between Unicode normalisation, case/accent rules and external identity.

I freshly used all six delivery-note conditions in the current rendered piece. The results were respectively 102; 101; 101; 103; 101 and 103; 101 and 103. Order 103 stayed unknown under equality, inequality and negated equality, then passed the three explicit absence/null-safe policies. This matches the native matrix. The article also separates an empty payment set from a payment with an unknown amount, and distinguishes `CHECK` acceptance of unknown from `WHERE` rejection of it. The scratch uniqueness example matches the stated one-column policy and does not silently redefine the shop's product identity.

Primary checks: PostgreSQL 18 [Numeric Types](https://www.postgresql.org/docs/18/datatype-numeric.html), [Date/Time Types](https://www.postgresql.org/docs/18/datatype-datetime.html), [AT TIME ZONE](https://www.postgresql.org/docs/18/functions-datetime.html#FUNCTIONS-DATETIME-ZONECONVERT), [Collation Support](https://www.postgresql.org/docs/18/collation.html), [String Functions](https://www.postgresql.org/docs/18/functions-string.html), [Comparison Functions](https://www.postgresql.org/docs/18/functions-comparison.html), [Logical Operators](https://www.postgresql.org/docs/18/functions-logical.html), [WHERE](https://www.postgresql.org/docs/18/queries-table-expressions.html#QUERIES-WHERE), [Subquery Expressions](https://www.postgresql.org/docs/18/functions-subquery.html), [Conditional Expressions](https://www.postgresql.org/docs/18/functions-conditional.html), [Aggregate Functions](https://www.postgresql.org/docs/18/functions-aggregate.html), [Sorting Rows](https://www.postgresql.org/docs/18/queries-order.html) and [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html).

Applicable execution evidence: [native-run identity and assertions](v02/mechanical/r02/native-run.json), [verifier](v02/mechanical/r02/verify.py), [native output](v02/mechanical/r02/native-results.txt), [native predicate matrix](v02/mechanical/r02/predicate-native.json), [model comparisons](v02/mechanical/r02/predicate-model-check.json), [current predicate reuse check](v02/mechanical/current-rendering/predicate-reuse-check.json) and [worksheet](v02/source/src/components/relational-collection/r02/downloads/values-experiment.sql). The verifier checks the owned data directory, server version and system identifier, uses private socket access with TCP disabled and inherited database connection settings removed, and records shutdown/removal. UTF-8 applies to the Unicode example; UTC/ISO settings apply to the printed instants. The exact SQL, optional-note data and predicate-module hashes still match. The four expected error cases catch the intended exception classes, not arbitrary failures. No native rerun was needed for unchanged inputs.

Findings: none.

## Evidence applicability and limits

The [fresh receipt](final-complete-practitioner-evidence.json) records independent hash checking of all 103 permitted source/context/mechanical files, with no mismatch. Both preview worksheet links returned HTTP 200 and bytes identical to the frozen SQL. This establishes reachable links and exact contents, not attachment response headers or browser save behaviour. The static preview is not treated as an Astro dev response-header test.

No PostgreSQL process, existing database, credentials or shared configuration was touched by this reviewer. Native evidence above is supplied execution evidence whose input, environment and verifier applicability I assessed; fresh primary-source checks, whole-article reasoning and the current predicate interactions are this review's independent work. No timing, geographic, other-engine, crash-recovery or production-readiness result is inferred from those small temporary-table experiments. The r00 schedules remain conceptual, with their relevant behaviour checked against primary documentation.

I did not repeat visual/theme/viewport review, broad site checks or build work; the coordinator owns the frozen build and other perspectives. I did not visit unfinished articles or read sibling originals as substitutes. The Codd 1971 source was the linked transcription, and the IBM 1970 publication page supplies an abstract rather than the full paper; Fagin's paper was available in full. Numeric Types timed out on direct opening but its PostgreSQL 18 text was available through the official-domain search result. These access limits do not leave a consequential claim unchecked.

Complete practitioner verdict: all five checks pass for each of r00, r01 and r02 in batch01-v02. No practitioner finding numbers were consumed.
