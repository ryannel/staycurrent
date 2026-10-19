# a34 sources and evidence — 20 October 2026

## Evidence boundary

No CockroachDB binary was downloaded or run, no account or licence was obtained,
no cluster was provisioned and no database session was opened. The Software
License's acceptance clause covers accessing/using the software. The assignment
explicitly prohibited licence-agreement acceptance, so native verification did
not proceed. Root confirmed this boundary. No shared PostgreSQL server, port or
data was touched, and there is no local service or temporary cluster to clean up.

This is a documentation-screened candidate decision, not a production acceptance
record. SQL is labelled proposed. All four figures are explanatory models with
invented state and timing, never observed execution. No latency, retry, node,
zone, region, partition, restore, cost quote or driver result is claimed.

## Primary documentation checked

All links were accessed through web research on 20 October 2026. Versioned URLs
were preferred over `stable`. Most now redirect to `docs.cockroachlabs.com` while
the canonical `www.cockroachlabs.com/docs/...` URLs continue to resolve.

| Source | Narrow claim used / implication |
| --- | --- |
| [v26.3 release notes](https://www.cockroachlabs.com/docs/releases/v26.3#v26-3-2) | v26.3.2 released 18 September 2026. v26.3 reports PostgreSQL 18 to clients. Mac downloads are experimental; no Mac runtime evidence claimed. |
| [Release support policy](https://www.cockroachlabs.com/docs/releases/release-support-policy) | v26.3 is Innovation; listed support endpoint 19 February 2027, no Assistance phase. Pins evaluation lifetime, not a newest-release recommendation. |
| [Licensing FAQs, v26.3](https://www.cockroachlabs.com/docs/v26.3/licensing-faqs) | Self-hosted paid Enterprise, Free, Trial and Evaluation are distinct entitlements. Annual renewal and telemetry conditions differ; ephemeral grace/single-node development is not production entitlement. No shop eligibility asserted. |
| [Software License](https://www.cockroachlabs.com/cockroachdb-software-license/) | Acceptance covers software access/use. Limited Non-Production Use, telemetry and broad evaluation/benchmark disclosure obligations matter. No legal eligibility determination, terms acceptance or licence generation performed. |
| [Production checklist, v26.3](https://www.cockroachlabs.com/docs/v26.3/recommended-production-settings) | Independent machines, region/zone labels, clocks, network and sizing guidance. Article baseline is our choice: 9 hosts × 8 vCPU/32 GiB/256 GiB; 4,000 IOPS and 240 MB/s derive from the guide's per-vCPU I/O recommendations. These are untested resource allowances. |
| [Survival goals](https://www.cockroachlabs.com/docs/v26.3/multiregion-survival-goals) | At least three regions for region survival; the three-region configuration uses 5 replicas in 2+2+1, with remote write coordination. Zone survival does not imply whole-region survival. Figure isolates one range's voting arithmetic. |
| [Topology patterns](https://www.cockroachlabs.com/docs/v26.3/topology-patterns) | Two-region anti-pattern and distinction between regional access, historical reads and current foreign-key checks. Used as cross-check; no universal nine-node SQL minimum asserted. |
| [CREATE TABLE](https://www.cockroachlabs.com/docs/v26.3/create-table#create-a-table-with-a-regional-by-row-locality-using-a-custom-region-column) | Custom RBR locality column has `crdb_internal_region` type. Proposed composite home/request and home/SKU keys make identity scope explicit. DDL was not executed. |
| [ALTER DATABASE](https://www.cockroachlabs.com/docs/v26.3/alter-database) | Database region/survival statements used in proposed snippet. Region labels require matching physical deployment and inspection. |
| [Table localities](https://www.cockroachlabs.com/docs/v26.3/table-localities) | Regional table, regional by row and global access patterns; regional indexes and region/schema-job interactions. `GLOBAL` has a write cost. Locality does not make every transaction local. |
| [Multi-region overview](https://www.cockroachlabs.com/docs/v26.3/multiregion-overview#super-regions) | Physical copies and internal ranges matter; super-region placement has qualifications. Residency is a separately verified application gate. |
| [SHOW LOCALITY](https://www.cockroachlabs.com/docs/v26.3/show-locality) | Gateway locality only. |
| [SHOW RANGES](https://www.cockroachlabs.com/docs/v26.3/show-ranges) | Voting/non-voting replicas, their localities and leaseholder inspection; DETAILS adds cross-node work. No fabricated output supplied. |
| [PostgreSQL compatibility](https://www.cockroachlabs.com/docs/v26.3/postgresql-compatibility) | Wire protocol/catalog compatibility differs from SQL semantics. Concrete discriminators: range types unsupported, integer division, session advisory locks that can be compatibility no-ops. Full-schema extensions remain an acceptance dependency. |
| [SERIAL](https://www.cockroachlabs.com/docs/v26.3/serial) | Default row-ID translation differs from assuming a PostgreSQL sequence. User-supplied UUID for logical operation identity is an application design decision. |
| [Online schema changes](https://www.cockroachlabs.com/docs/v26.3/online-schema-changes) | Jobs/backfills, resource consequences and DDL transaction restrictions require representative coexistence testing. No claim of zero-impact change. |
| [Transactions](https://www.cockroachlabs.com/docs/v26.3/transactions) | SERIALIZABLE default and READ COMMITTED availability; record effective setting. Article explicitly chooses SERIALIZABLE rather than transferring PostgreSQL isolation observations. |
| [Common table expressions](https://www.cockroachlabs.com/docs/v26.3/common-table-expressions#data-modifying-statements) | Top-level data-modifying CTEs are documented. Supports the proposed guarded UPDATE/INSERT shape; not an execution result. |
| [Retry error reference](https://www.cockroachlabs.com/docs/v26.3/transaction-retry-error-reference) | Automatic database retries versus surfaced 40001; whole-transaction application handling. Retry machinery remains owned by a04/request-recovery. |
| [Retry error example](https://www.cockroachlabs.com/docs/v26.3/transaction-retry-error-example) | Suggested repeatable client-path exercise; injected retry path is not real contention or failover measurement. |
| [Common errors](https://www.cockroachlabs.com/docs/v26.3/common-errors#result-is-ambiguous) | 40003 ambiguous completion and dropped commit connection require outcome resolution. Model separates application knowledge and database truth. |
| [EXPLAIN ANALYZE](https://www.cockroachlabs.com/docs/v26.3/explain-analyze) | Executed statement evidence, regions/network work. Candidate plan is an acceptance requirement; none invented. |
| [Contention analysis](https://www.cockroachlabs.com/docs/v26.3/monitor-and-analyze-transaction-contention) | Connect waits and retries to contended work; distinguish hot key from distance/resource/query shape. |
| [BACKUP](https://www.cockroachlabs.com/docs/v26.3/backup) | Backup/revision history coverage and external storage dependencies. Cadence plus completion lag must meet recovery-point gate. |
| [RESTORE](https://www.cockroachlabs.com/docs/v26.3/restore#restoring-to-multi-region-databases) | Multi-region restoration restrictions require a matching supported target; time application validation separately. No restore observed. |

The current public [pricing page](https://www.cockroachlabs.com/pricing/) was also
checked. It now distinguishes Continuum editions for organisations/deployments
from 15 September 2026, while the engine/cloud documentation still discusses
Basic/Standard/Advanced. The article deliberately does not combine these
different contract records: its exact candidate is self-hosted Enterprise, no
managed tier, and its required licence/infrastructure/support quote is absent.
No current price, SLA, region availability or managed limits are borrowed into
that candidate.

## Models and calculations

`src/components/relational-next/a34/model.ts` is the complete deterministic model.
Four states per scene, with switches preserving the current state:

- Topology: one Irish range; five voters across 2+2+1 versus three home voters
  with illustrative remote non-voters. Home-region failure leaves 3/5 or 0/3
  votes. This is majority arithmetic, not consensus implementation or observed
  placement. Nine hosts does not imply nine replicas. Returning replicas remain
  visually unverified.
- Locality: Irish gateway/customer/request; Irish or German stock. Shows logical
  dependencies, not packets, fixed consensus rounds or measured latency.
- Outcome: known abort versus committed/uncommitted missing replies. The missing
  reply cases have identical client evidence and different model database truth.
  Final stock + reservations remains one. No full request-recovery implementation
  is asserted by this model.
- Budget: 20 ms admission, 10 or 170 ms queue, two RTT allowances and 30 ms other
  work. One repeat adds 20 ms backoff, two RTT allowances and 30 ms other work.
  At RTT 40, dispersed first/second totals are 140/270 ms; hot totals 300/430 ms.
  At RTT 100, hot totals 420/670 ms. An 800 ms fixed visual scale keeps the 300 ms
  deadline at 37.5%. These are illustrative sums, not p99 predictions.

Resource arithmetic: 9 × 8 = 72 vCPUs, 9 × 32 = 288 GiB, 9 × 256 = 2,304 GiB;
after one region fails, 6 hosts leave 48 vCPUs and 192 GiB. Approximate 5 × 100 GB
logical footprint = 500 GB before the specifically excluded storage factors.
Neither calculation establishes capacity or price.

Playback budgets all visible figure text, including all panels, results,
narration, graph labels, controls and caption, at approximately 198 words/minute
plus five seconds inspection, minimum seven seconds. Final state receives its
own dwell. Manual controls and select changes pause playback; hidden document
pauses it. Buttons remain focusable at both endpoints. Figures use divs, no
article-section elements or internal headings, and stack comparisons on phones.

## Authoring context and validation

Read the write skill, writing commission, runtime record, node context and actual
a08 parent. Consulted the relevant actual a03 transaction, a04 application,
a05 performance and a07 operating articles to keep ownership boundaries. Read
all three fixed reference articles and their figures; inspected rendered figure
text at the development reference routes on port 4337. Port 4437 was untouched.

Validation performed without a site build:

- Astro compiler 2.13.1: article fragment and CandidateFigure compile cleanly,
  zero diagnostics.
- TypeScript 5.9.3: component script transpiles without diagnostics.
- 27 variant/RTT combinations × 4 model states have complete panels/results;
  assertions cover quorum, remote stock dependency, equal client knowledge with
  different database outcomes and 270/430/670 ms arithmetic.
- Targeted whitespace, required anchors and import/route inspection recorded in
  writer report.

Central browser proof and independent review remain with root. No shared full
build, route promotion, review request, Git index operation or commit was made.
