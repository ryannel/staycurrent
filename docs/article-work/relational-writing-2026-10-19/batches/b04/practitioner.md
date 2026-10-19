# b04 — independent practitioner review

Reviewed 19 October 2026 using `staycurrent-review`, practitioner perspective.
a04 carries forward unchanged technical work; a05 receives an initial full
review against the original relational-practice goal, its supplied parent,
sibling and child scopes and the available family drafts. No teaching review,
fixed teaching-reference articles or old relational corpus was read. No article,
component, retained evidence, commit or publication state was changed.

| ID | Practitioner verdict | Required repairs | Optional advice |
| --- | --- | --- | --- |
| a04 | Pass | None; retain b03 practitioner pass | None new |
| a05 | Pass | None | None |

## a04 — Building applications around a relational database

**Pass, narrow carry-forward.** The article snapshot is byte-identical to b03;
scene and native driver-verifier hashes are unchanged. Read the root repair note:
the shared player's changes concern endpoint focus, narration pacing and phone
whitespace, rather than the model paths or technical claims. Retain the b03
correctness, native verification, useful-depth and family-boundary pass without
repeating that work. The independent teaching recheck owns those presentation
changes.

## a05 — Understanding and improving database performance

**Pass.** This parent completes an ordinary diagnosis rather than requiring a
child to supply its remedy or acceptance decision. It follows the report from
an early, consequential underestimate through excess repeated probes, a targeted
statistics refresh, changed physical work, result checking and a bounded mixed
workload comparison. The conclusion accepts that explanation for the fixture,
with the missing production evidence kept explicit.

### Correctness and practical judgement

The timing boundary distinguishes connection acquisition, execution, transfer
and application processing. Frequency, latency distributions and useful
completions guide priority without confusing accumulated elapsed execution with
CPU time. Observations and causal hypotheses remain distinct.

The physical model explains locality, row width, retained versions, shared hits
versus reads and reusable versus returned space without implying that fewer
projected columns repack existing pages. The index discussion correctly relates
equality, range and ordering to the history query; it avoids a universal
leftmost-prefix rule, accounts for coverage's visibility checks and includes
write and maintenance costs. These are useful candidate-selection principles,
not a claim that an index intervention was captured here.

The plan legend separates cost units, elapsed time, emitted rows, per-loop
averages and inclusive reporting. The shortened before plan agrees with the raw
JSON. Its input sort genuinely consumes 80,000 rows despite the final LIMIT;
the inner order lookup's ten rows are correctly distinguished from its 8,000
executions. The report explains why the lower sort spills and why that alone
does not justify a global memory increase. The after plan's larger estimated
cost is not presented as a measured slowdown.

Concurrent resource costs, a serial hot row and snapshot retention are relevant
to the wider workload. The admission model holds service rate fixed, correctly
showing that relocating its queue alone saves no completion time. It separately
shows the effect of reducing service work and leaves real competition effects
to measurement. The concluding comparison method preserves meaning and checks
parameter classes, preparation, ongoing changes, cache conditions, useful
completions, remaining work and operational costs before deployment.

### Independent native checks and measurement audit

Read the complete article, own plan, a24/a25/a26/a28 plans, source record,
writer report and full figure component. Parsed both retained JSON plans and
checked their node structure, estimates, loops, sort method, buffers and result
claims against the article and captured-data panels.

Independently recreated the supplied schema and generator in a fresh own native
PostgreSQL 18.6 database on the assigned runtime. No shared-server setting was
changed. Before the targeted refresh, the customer scan estimated 18 and emitted
8,000; the order bitmap heap scan emitted ten rows over 8,000 loops; the input
sort used external merge with 1,496 kB reported. Top-level shared hits were
96,104 and temporary reads 187. After `ANALYZE customers`, the customer estimate
was 8,000, the plan used a hash join and hash aggregation, and temporary reads
were zero. My fresh after plan had 741 shared hits rather than the retained
capture's 745; the mechanism and claim are unchanged, and the article correctly
reports its own captured run rather than promising invariant buffer totals.

Before and after returned the same exact ordered ten rows: customers
99, 199, …, 999, each at 1090.00. Independently ran the separate correctness
fixture: it returned customer 2 then 3 at 20.00, covering the date boundary,
region exclusion, multiple orders, ties and absent orders; its non-null check
also completed. Reset the fixture's per-table autovacuum setting and removed
only my fresh review database afterwards.

Recalculated every per-class nearest-rank p95 from all 3,600 retained latency
observations. Every run has 364 lookup, 176 change and 60 report samples. The
reported ranges reproduce:

| Class | Before p95 range, ms | After p95 range, ms |
| --- | --- | --- |
| Report | 55.117–56.611 | 15.731–16.298 |
| Lookup | 0.148–0.169 | 0.134–0.156 |
| Change | 0.258–0.305 | 0.221–0.266 |

The displayed rounding is correct. The scripts and seed specify a comparable
mix; revision-counter changes preserve report amounts. The ledger explicitly
records that all before rounds precede all after rounds and that physical churn
and shared-host activity are not controlled. The article limits its inference to
short warm closed-loop observations, identifies the absent application/pool path
and CPU/device-I/O/WAL comparison, and makes no sustainable arrival-capacity
claim. Reproducing incidental timings was unnecessary for this gate.

Checked the consequential contracts against PostgreSQL 18 primary documentation:
[plan structure and reporting](https://www.postgresql.org/docs/18/using-explain.html),
[EXPLAIN execution, buffers and timing](https://www.postgresql.org/docs/18/sql-explain.html),
[planner statistics](https://www.postgresql.org/docs/18/planner-stats.html),
[page layout](https://www.postgresql.org/docs/18/storage-page-layout.html),
[vacuum and retained versions](https://www.postgresql.org/docs/18/routine-vacuuming.html),
[memory limits](https://www.postgresql.org/docs/18/runtime-config-resource.html),
[multicolumn access](https://www.postgresql.org/docs/18/indexes-multicolumn.html),
[index-only visibility](https://www.postgresql.org/docs/18/indexes-index-only-scans.html),
[prepared execution](https://www.postgresql.org/docs/18/sql-prepare.html) and
[pgbench logging units](https://www.postgresql.org/docs/18/pgbench.html).

### Working models and boundaries

In my own Chrome tab on fixed built preview 4437, selected every case in all
five figures and read each resulting panel. The three delay decompositions sum
to 160 ms; the page map has four matches on four pages, four on one, then twenty
on six; the plan comparison agrees with retained JSON; the admission cases end
at ticks 6, 6 and 3; and the measurement panel agrees with the independently
recalculated p95 ranges and retained completion-rate range. Model arithmetic and
invented layouts are clearly separated from the native evidence panels.

a00's small-result/large-work introduction now has a complete practical owner.
a02 retains query meaning and pagination correctness; a03 retains transaction
guarantees and lock correctness; a04 retains pool ownership and application
round trips. a24 deepens page/space investigations, a25 access-path design, a26
operator/statistics/prepared-parameter diagnosis and a28 concurrent-load
measurement. The parent supplies enough of each mechanism to finish its first
case while explicitly requiring completion of its common comparison method
before optional investigations. Monitoring and rollout procedures remain with
operations and live changes. No further branch or consolidation is needed to
meet this article's relational-practice goal.

## Review scope and handoff

Both snapshots match rendered source; every owned-file hash matches the b04
manifest. Browser work used only the fixed 4437 build. The centrally reported
full build and fragment audit were not rerun. The teaching perspective owns
pacing, endpoint focus, keyboard and phone presentation. Both articles pass the
practitioner gate; no repair recheck is requested.
