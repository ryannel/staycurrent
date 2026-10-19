# b11 — independent practitioner review

Reviewed 20 October 2026 using `staycurrent-review`, practitioner perspective.
Full initial review of a12 and a34 against the original relational-practice goal,
their actual parents and available family drafts, commissioned scopes, complete
prose, owned figures/models and evidence records. Source/native work preceded
preview availability. Browser checks used only root's subsequently confirmed
immutable b11 build on **4438**; 4437 was not used for this batch.

| ID | Practitioner verdict | Required repairs | Optional advice |
| --- | --- | --- | --- |
| a12 | Pass | None | None |
| a34 | Pass | None | None |

## a12 — Modelling history and data lifecycles

**Pass.** The article completes the modelling depth delegated by a01 without
turning every current fact into a temporal subsystem. Each retained representation
answers a different operational question: current contact, agreed booking facts,
committed sequence, contractual applicability and the account recorded before a
late correction. Exact report reproduction correctly needs the other original
inputs/calculation or the report itself.

The agreement snapshot has a capture boundary and an accepted-offer obligation;
it is not a current derived copy that should follow profile edits. Committed change
records are distinguished from requests and attempts. Initial state, complete
capture, atomic state/history updates and protected per-booking revisions are
necessary for the promised sequence. Timestamps and generated identifiers are not
mistaken for a global commit order.

Enduring customer identity, version identity and agreed fee are separate. The
two complete composite references prove the booking's customer and the selected
version's scope; the article explicitly withholds applicability and price-agreement
proof. Mutable version payloads also cannot silently serve as immutable evidence.

Half-open effective periods give the exact handover to one version. The nullable
upper end has an explicit unbounded meaning; finite positive periods and overlap
are separately constrained. Non-overlap establishes at most one answer, while
coverage remains a writer obligation. Spanning-period reads, absence before the
first rate, and failure on an uncovered date are handled usefully. The bitemporal
example preserves the earlier assertion and supersedes its whole effective
coverage with a replacement pair. Explicit fixture recording times are correctly
distinguished from observed commit times and automatic capture.

Lifecycle choices preserve reference, uniqueness and reporting consequences.
Inactive rows still join and reserve codes. Tombstone and archive alternatives
explicitly require a different schema from the parent's required profile shape.
Moving a referenced parent is not a transparent archive operation; retained
identity and archived payload are different. Code reuse cannot redirect an old
booking to a new person. Copies, restored data and authority to rewrite history
remain part of the retention/capture requirement. No jurisdictional retention or
physical-erasure procedure is invented.

### Independent execution and working models

Ran the unmodified `a12/verify.sql` on native PostgreSQL 18.6 in fresh own database
`rel3_prac_a12_1792449185648712000`, UTF8/C locale and UTC. It loaded the actual a01
schema/fixture and both owned rate representations. Positive results were checked
against the article, as well as the script's exact rejection assertions:

- 31 October: no rate; 9 November: version 1 / €20; 10 and 11 November:
  version 2 / €22. A read spanning 9–12 November found both versions.
- Effective 11 November with the earlier recorded cutoff returned €20; at the
  exact correction cutoff it returned €22.
- Overlap/conflicting two-axis assertion failed with 23P01; empty/reversed periods
  and infinite start with 23514. The deliberately introduced gap was accepted and
  had zero matches, then was rolled back.
- Valid version use passed. Missing version, matching-numeric cross-tenant target
  and wrong booking customer failed with 23503; referenced customer deletion
  failed with 23001.
- An inactive profile remained in the unfiltered count and reserved its code
  with 23505. Clearing the code in the explicitly separate lifecycle shape let a
  new identity use it.

These reproduce the retained native transcript. The database was dropped in
cleanup; no shared-server configuration changed. Independent output is at
`/private/tmp/rel3_prac_a12_1792449185648712000.txt`. Neither this run nor the article
claims a concurrent replacement, automatic history capture or complete erasure.

Read the complete model and render source and ran the 56-state verifier. In an
own Chrome tab on fixed 4438, exercised all five figures and all fourteen choices
at their consequential steps. The exact 10 November comparison returned one,
two or zero rates for adjacent/overlap/gap; recording cutoffs returned €20/€22;
snapshot/live reference and all four removal choices retained their stated
consequences. Choice changes preserved the comparison step.

Primary checks included PostgreSQL 18's
[ranges](https://www.postgresql.org/docs/18/rangetypes.html),
[transaction-start time](https://www.postgresql.org/docs/18/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT)
and the already verified composite/exclusion constraint contracts; IBM's
[bitemporal terminology](https://www.ibm.com/docs/en/db2/12.1.x?topic=tables-bitemporal)
supports the distinction between application and system periods. a09 retains
value/time-zone representation, a10 enforcement mechanisms, a11 dependency and
derived-copy reasoning, a03 concurrency, and evolution/operations live conversion
and removal/restore procedures. No family-boundary repair or new child is needed.

## a34 — Checking a distributed choice with CockroachDB

**Pass as a documentation-screened, deferred candidate decision.** It does not
claim production acceptance or completed executable evaluation. The original
parent brief still accepts region outage; the changed requirement is explicit.
The article rejects arrangements that cannot survive the new boundary and defers
the exact candidate where application, workload, failure, commercial and recovery
evidence is absent. That is a useful result for the original relational-practice
goal and an optional candidate route, without a product-specialist curriculum.

The candidate is pinned to self-hosted v26.3.2 Enterprise/Linux amd64, not a borrowed
managed tier. Independently checked the release date, Innovation classification
and listed 19 February 2027 support endpoint with no Assistance phase. The proposed
upgrade owner/rehearsal and missing licence/support quote remain adoption gates.
The licensing record distinguishes entitlements and avoids treating development
grace as production permission. No binary was downloaded/run, account created,
terms accepted, or CockroachDB connection opened for this review.

The topology explanation preserves distinct gateways, row homes, voters,
non-voters and unused host capacity. Five voters in 2+2+1 leave a possible majority
after any one region loss. This is documented placement and arithmetic, not a
measured interruption result. Nine hosts are explicitly the chosen zone-capable
baseline rather than a universal minimum. Required placement, internal ranges,
reachable application routes and degraded capacity still need verification.
Resource and I/O sums agree with their stated inputs; neither sums nor the
approximate replicated footprint establish throughput or price.

The cross-home inventory reference and fixed regional request identity make the
transaction boundary visible. Gateway changes cannot silently change identity.
Regional uniqueness is not presented as a global UUID guarantee. Co-location
does not remove region-survival coordination; locality does not prove permitted
physical-copy residency. The proposed SQL shape is consistent with documented
custom RBR region columns and top-level data-modifying CTE support, but remains
unexecuted.

Wire compatibility is correctly separated from types, expressions, generated
defaults, session state and extensions. The versioned references support the
range-type limitation, integer-division difference, compatibility no-op subset
of session advisory functions and default SERIAL row-ID translation. Explicit
SERIALIZABLE, all stock writers and driver mapping remain actual candidate tests.

The candidate claim is correctly bounded as an atomic claim rather than a replay
implementation. Empty-input repeats and unique-key rollback preserve the parent's
repaired boundary. Known 40001 aborts need supported whole-transaction handling;
40003/disconnect ambiguity needs authoritative resolution under the same stable
identity. Retry ownership, original deadline, external effects and connection
cleanup go to the common application protocol. An empty preliminary lookup is
not treated as proof of non-commit.

Ordinary/degraded workload gates, hot-key versus distance diagnosis, independent
acknowledgement evidence, separate faults and recovery are useful acceptance depth.
The article counts deadline failures, queueing and retries, preserves correctness
and freshness during comparison, and distinguishes injected retry paths from
regional failure evidence. Backup cadence alone does not establish a recovery
point; restore destination constraints, reconciliation, exit and full costs remain
explicit missing evidence. a03/a04/a05/a06/a07 and their children retain the common
transaction, application, performance, evolution and operating procedures.

### Primary checks and working models

Independent versioned checks included the
[release notes](https://www.cockroachlabs.com/docs/releases/v26.3#v26-3-2),
[support policy](https://www.cockroachlabs.com/docs/releases/release-support-policy),
[licensing options](https://www.cockroachlabs.com/docs/v26.3/licensing-faqs),
[Software License](https://www.cockroachlabs.com/cockroachdb-software-license/),
[survival goals](https://www.cockroachlabs.com/docs/v26.3/multiregion-survival-goals),
[production resource guidance](https://www.cockroachlabs.com/docs/v26.3/recommended-production-settings),
[custom region columns](https://www.cockroachlabs.com/docs/v26.3/create-table#create-a-table-with-a-regional-by-row-locality-using-a-custom-region-column),
[compatibility](https://www.cockroachlabs.com/docs/v26.3/postgresql-compatibility),
[SERIAL](https://www.cockroachlabs.com/docs/v26.3/serial),
[transactions](https://www.cockroachlabs.com/docs/v26.3/transactions),
[data-modifying CTEs](https://www.cockroachlabs.com/docs/v26.3/common-table-expressions#data-modifying-statements),
[retry errors](https://www.cockroachlabs.com/docs/v26.3/transaction-retry-error-reference),
[ambiguous results](https://www.cockroachlabs.com/docs/v26.3/common-errors#result-is-ambiguous)
and [multi-region restore restrictions](https://www.cockroachlabs.com/docs/v26.3/restore#restoring-to-multi-region-databases).

Read the complete model/render source and independently swept 108 frames across
the nine variants and three RTT inputs, including repeated irrelevant RTT inputs
outside the budget scene. Assertions checked 3/5 versus 0/3 votes, the remote stock
dependency, identical client evidence despite different unknown database outcomes,
and cumulative deadline sums. In fixed 4438, exercised all thirteen exposed
variant/RTT combinations at the meaningful comparison steps and continued every
figure to its final decision. Visible quorum, stock path, unknown outcomes,
unverified returning replicas and 150/270/510 versus 310/430/670 ms totals agree.
The fixed-scale deadline bar uses the same sums. These are explanatory models;
they supply no native correctness, latency, fault or recovery observation.

## Scope and handoff

Both snapshots match rendered sources and all eight manifest hashes are unchanged.
No retained evidence was overwritten. No article/component edits, build, commit,
CockroachDB execution or shared-server changes were performed. The fresh PostgreSQL
review database was removed. The own browser tab is closed and preview 4438 is
released. Both articles pass the practitioner gate; no repair recheck is requested.
