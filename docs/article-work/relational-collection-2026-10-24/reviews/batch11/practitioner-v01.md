# Practitioner review · article · r44–r48 · batch11-v01

Role: fresh independent **initial** practitioner coverage, 24 October 2026. This is neither the final complete practitioner reading nor corpus review. Highest severity: **none**.

## Inputs and method

Fixed input: [v01/manifest.json](v01/manifest.json), SHA-256 `66228718ec6788496a0cf907857e186c17be035f73b8c8fa649c924bceb846cf`. Every file listed in the manifest was hashed against its frozen copy: no mismatch. Read the current review skill and practitioner perspective only; commission, audience, canonical example/extensions, all five complete briefs and plans RL123–RL127; relevant owner/prerequisite plans RL79, RL83, RL85–RL87, RL93–RL94, RL96–RL97, RL100, RL104–RL109, RL118, RL122 and RL128–RL132. The shared plans have matching hashes in the two supplied manifests. These establish boundaries, not earlier article verdicts.

Read complete rendered prose, SQL, tables, captions, disclosures, Sources and text alternatives at these URLs, formed from the manifest's preview and article_paths:

| Piece | Complete frozen URL |
| --- | --- |
| r44 | <http://127.0.0.1:4522/review/relational-collection/cockroachdb/keys-and-ranges/> |
| r45 | <http://127.0.0.1:4522/review/relational-collection/cockroachdb/transactions/> |
| r46 | <http://127.0.0.1:4522/review/relational-collection/cockroachdb/follower-reads/> |
| r47 | <http://127.0.0.1:4522/review/relational-collection/cockroachdb/query-performance/> |
| r48 | <http://127.0.0.1:4522/review/relational-collection/cockroachdb/locality/> |

Repeated collection navigation was read once and current-item/availability differences checked. Read frozen technical components including every scripted state, their input data, the downloadable worksheets, [mechanical/applicability.md](v01/mechanical/applicability.md), final native receipts and their exact verifiers. Earlier failed attempt records were used only to distinguish provenance from completed observations. No author notes, earlier quality reports, decisions or peer reports were read. No article was edited and no build or publication was performed.

Native results below are **reused author observations**, independently challenged against source, data, assertions and primary documentation; they are not fresh reviewer reproductions. No unresolved mechanism warranted repeating a local cluster run. No database, credentials, host limits, browser viewport or theme was changed. Primary sources were checked on this review date; claims are assessed for the pinned 25.4/25.4.17 scope.

## r44 · CockroachDB keys, ranges and replication

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass | Ordered primary/secondary spans, half-open range boundaries, lease/leader distinction, quorum and family/storage distinctions agree with primary documentation. |
| Evidence | pass | Split observation is one-node SQL; both diagrams explicitly model ownership/agreement rather than RPCs or a complete transaction. |
| Coverage | pass | Teaches lookup routing, stale metadata, splits, replica versus lease movement, non-voters and the single-row/ascending-key failures a split cannot cure. |
| Depth, both ways | pass | Sufficient native detail to inspect ownership; family and Pebble explanations are short and prevent false row/range/file equivalence. No material missing or unnecessary mechanism. |
| Ownership | pass | Gives the useful keys-to-ranges answer and hands transaction decisions to RL124, workload repair to RL126 and geography to RL127. |

Primary challenge: checked [Distribution Layer](https://docs.cockroachlabs.com/docs/v25.4/architecture/distribution-layer), [Replication Layer](https://docs.cockroachlabs.com/docs/v25.4/architecture/replication-layer), [Column Families](https://docs.cockroachlabs.com/docs/v25.4/column-families), [Storage Layer](https://docs.cockroachlabs.com/docs/v25.4/architecture/storage-layer) and [SHOW RANGES](https://docs.cockroachlabs.com/docs/v25.4/show-ranges). In particular, the leader-lease claim is version-specific and supported; detailed inspection requires admin/ZONECONFIG authority and has distributed overhead.

Evidence applicability: [native-ranges.json](v01/mechanical/r44/native-ranges.json) records 25.4.17, owned endpoint/cluster identity, worksheet hash, three unchanged rows and the primary split at `/10/103`, with two primary intervals and a separate customer-index span. Its script hash equals the frozen worksheet (`ed401bde…`). Reviewed [native-ranges.py](v01/mechanical/r44/native-ranges.py), including cleared subprocess connection environment, listener PID check, fixed fixture, assertions and owned cleanup. Earlier attempts have no final success and do not establish this result. Final article/component/worksheet source hashes all match.

Bounded note: no automatic split, replicated fault, movement-speed or multi-range commit observation is claimed or inferred. Quorum and key-layout states are consistent across the enumerated inputs.

## r45 · CockroachDB transactions and retries

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass | STAGING needs successful required writes; intent resolution follows the decision. Whole-body 40001 retry, ambiguous 40003 and retry-savepoint RELEASE boundaries are accurate. |
| Evidence | pass | Forced retry, suffix counterexample and caller-boundary acknowledgement withholding are identified as injections. No native 40003 or distributed message trace is asserted. |
| Coverage | pass | Covers business refusal, payload conflict, overlapping identity claims, absent outcomes, retention, retry exhaustion, external effects and the driver's replay boundary. |
| Depth, both ways | pass | Commit internals support practical error classification without requiring a full recovery algorithm; the request protocol remains concrete. |
| Ownership | pass | Keeps CockroachDB intent/retry mechanics here and delegates effects/outbox delivery and historical-read choices to their owners. |

Primary challenge: checked [Transaction Layer](https://docs.cockroachlabs.com/docs/v25.4/architecture/transaction-layer), [Transaction Retry Error Reference](https://docs.cockroachlabs.com/docs/v25.4/transaction-retry-error-reference), [Common Errors](https://docs.cockroachlabs.com/docs/v25.4/common-errors#result-is-ambiguous), [Transactions](https://docs.cockroachlabs.com/docs/v25.4/transactions) and [Advanced Client-side Transaction Retries](https://docs.cockroachlabs.com/docs/v25.4/advanced-client-side-transaction-retries). The crucial challenge was whether STAGING alone or an absent reply proves the outcome: the article correctly refuses both inferences.

Evidence applicability: [native-purchase.json](v01/mechanical/r45/native-purchase.json), frozen [purchase.py](v01/source/src/components/relational-collection/r45/downloads/purchase.py), source hash `708b171d…`, CockroachDB 25.4.17 and Psycopg 3.3.6 agree. The unsafe suffix leaves P3 at12; full retry records 40001 and leaves P3/P7/P9 at10/0/4, one request/order and both exact lines. Changed payload is rejected. Success-withheld and disconnect-before-commit histories converge on the same complete state. The verifier clears actual inherited connection variables before driver/subprocess use, checks listener ownership/cluster identity and cleans its private process/store.

Bounded note: the drill is a fixed-payload application protocol exercise, not a production transport-error recovery library, provider test or concurrent multi-node commit test. The prose makes the native 40003 and driver-automatic-replay gaps explicit; this review does not fill them by inference. Its no-deferred-FK fixture is accurately distinguished from a database-enforced outcome relationship.

## r46 · CockroachDB isolation and follower reads

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass | Statement snapshots, Serializable retry/refusal, historical read-only scope, closed/applied/retained conditions and bounded-query eligibility are correctly separated. |
| Evidence | pass | Native SQL observations are one-node contracts; follower routing, garbage-collection expiry and regional latency are explicitly unproved. |
| Coverage | pass | Includes write skew, current decision versus historical display, one timestamp for related queries, exact versus bounded staleness, retention lifetime and actual-route verification. |
| Depth, both ways | pass | Frontier model supplies the missing conditions without pretending to expose actual replication positions. No material excess or missing decision branch. |
| Ownership | pass | Owns engine read/isolation contracts, leaves export lifecycle to RL83 and GLOBAL/region policy to RL127. |

Primary challenge: checked [Transactions](https://docs.cockroachlabs.com/docs/v25.4/transactions), [Transaction Layer](https://docs.cockroachlabs.com/docs/v25.4/architecture/transaction-layer) and [Follower Reads](https://docs.cockroachlabs.com/docs/v25.4/follower-reads), including single-statement/single-row/no-index-join restrictions, `nearest_only`, and EXPLAIN ANALYZE route evidence. A successful historical query is correctly treated as insufficient proof of follower service.

Evidence applicability: [native-reads.json](v01/mechanical/r46/native-reads.json) and exact frozen [read-contracts.py](v01/source/src/components/relational-collection/r46/downloads/read-contracts.py), hash `485efad9…`, pin 25.4.17/Psycopg3.3.6 and the shown starting states. Two connections report actual isolation; Read Committed permits zero instructors, Serializable returns40001 and the complete retry retains one. Historical versus current purchase views are coherent; writes fail25006, the bounded point read succeeds, and the multi-row form fails0A000. Verified code/environment/identity/cleanup scope matches these assertions. The first attempt lacks the full history result and is not used in its place.

Bounded note: all eight frontier-input combinations were checked in component logic. Expiry blocks the old timestamp; unapplied B blocks the newer complete local answer; neither is silently replaced with mixed data. This was source-state assessment, not a fresh browser-control or follower-routing run.

## r47 · CockroachDB query work and hot ranges

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass | Prefix/order/covering reasoning and SQL-versus-KV counters are sound; hash buckets are not equated with nodes or independent stock allowances. |
| Evidence | pass | Exact row/byte/call counts match retained plans; timing and distributed throughput are deliberately not extrapolated. |
| Coverage | pass | Provides a useful diagnostic path through candidates, primary lookups, fan-out, placement, estimates, contention and the costs of another index. |
| Depth, both ways | pass | Three fixed-result plans make saved work concrete; write/space trade-offs are qualitative and explicitly need workload measurement. |
| Ownership | pass | Retains native SQL/KV diagnosis while handing transaction correctness, locality and cluster health to their owners. |

Primary challenge: checked [EXPLAIN ANALYZE](https://docs.cockroachlabs.com/docs/v25.4/explain-analyze), [CREATE INDEX](https://docs.cockroachlabs.com/docs/v25.4/create-index) and [Hash-sharded Indexes](https://docs.cockroachlabs.com/docs/v25.4/hash-sharded-indexes). The distinctions between an index join, a SQL join, DistSQL exchange bytes and KV calls are useful and technically defensible.

Evidence applicability: [native-plans.json](v01/mechanical/r47/native-plans.json), [native-plans.py](v01/mechanical/r47/native-plans.py) and exact frozen worksheet hash `ba892c14…` agree on60,000 deterministic rows, customer42's60/15 candidates and returned IDs59041…50041. The forced paths decode120/20/10 KV rows, read15KiB/2.6KiB/440B and make2/2/1 calls; the unhinted plan selects the cover. SHOW CREATE exposes the hidden virtual shard column and EXPLAIN exposes four bucket spans. All three primary comparisons assert identical ordered results. The exact local verifier clears actual inherited connection settings, checks PID/cluster identity and removes owned resources.

Bounded note: no measured index-write amplification, storage-growth ratio, hash-index insert throughput, contention reduction or WAN speed-up is established. These are presented as measurement obligations, not observed benefits. The hash path's four spans are EXPLAIN evidence, not an executed distributed benchmark.

## r48 · CockroachDB table locality and region survival

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass | Table/row homes, default home selection, regional uniqueness, GLOBAL current reads and separate database survival policy are accurately distinguished. |
| Evidence | pass | Accepted DDL, generated constraints and one five-voter shared span are carefully separated from complete partition convergence or real regional survival. |
| Coverage | pass | Covers gateway changes, implicit region defaults, indexes/references, uniqueness costs, global invariants, capacity/dependencies and healthy-placement acceptance. |
| Depth, both ways | pass | Enough native configuration and inspection to choose and audit policy; avoids an unsupported full replica map or geographic timings. |
| Ownership | pass | Owns geography/policy, refers query placement diagnosis and operational response to RL126/RL128, and retains the transaction contract. |

Primary challenge: checked [ALTER TABLE, localities and regional unique indexes](https://docs.cockroachlabs.com/docs/v25.4/alter-table#set-localities), [Global Tables](https://docs.cockroachlabs.com/docs/v25.4/global-tables), [Survival Goals](https://docs.cockroachlabs.com/docs/v25.4/multiregion-survival-goals), [SHOW RANGES](https://docs.cockroachlabs.com/docs/v25.4/show-ranges) and [Licensing FAQs](https://docs.cockroachlabs.com/docs/v25.4/licensing-faqs). The standalone table-localities page did not fetch through the web tool; the relevant default/partition/uniqueness claims were checked against the official ALTER TABLE chapter instead. The ordinary three-region five-voter2–2–1 case and remote write vote are properly scoped.

Evidence applicability: [native-locality.json](v01/mechanical/r48/native-locality.json), [native-locality.py](v01/mechanical/r48/native-locality.py), [placement-summary.json](v01/mechanical/r48/placement-summary.json) and native/source hashes bind the final in-memory six-process fixture to worksheet `9556fe4b…` and verifier `5bc0d29c…`. Pins25.4.17/Psycopg3.3.6; node IDs are mapped to the declared region/zone labels. All three policies are accepted; six regional index partitions and generated five-voter requests appear; duplicate(10,103) in eu-west fails23505. The final shared range has two north, one west and two US voters, with a north leaseholder. The article explicitly declines to call this complete generated-constraint convergence. Prior attempts do not provide a substitute topology result. Actual environment clearing and every listener/client's ownership checks were reviewed in the final verifier.

Bounded note: the no-key grace is a documented ephemeral condition, not licence entitlement. Six in-memory processes on one host prove neither independent durability nor regional failure tolerance. All six policy/operation figure combinations describe access contracts, not measured routes. No fresh region-loss challenge was run because the article makes no observed region-loss claim.

## Delivery checks, findings and limits

Independently fetched the five actual `download` href responses from4522 over bounded HTTP and compared every byte with the frozen worksheets: r44 879bytes, r45 7,773bytes, r46 6,857bytes, r47 2,034bytes and r48 1,668bytes; all equal their manifest/source hashes. This establishes served bytes only. Browser file saving was not exercised.

**Findings: none.** Each piece received all five checks independently; a pass is not a claim of untested deployment acceptance. No prior verdict was adopted. This report supplies initial coverage only and leaves the required independent final complete reading to its separately commissioned reviewer. Visual usability and fresh playback interactions belong to the independent visual review; source-state scrutiny here does not replace it. No reviewer tabs or database processes were created, so none remained to close.
