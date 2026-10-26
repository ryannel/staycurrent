# Planning record

The accepted ownership tree is unchanged. No new child article is proposed: the
access-path, fan-out and hotspot decisions form this article's one practical
outcome. Existing reading supplies deeper general execution, native transaction
handling, historical reads, regional policy, schema-job rollout and cluster health.
The YAML is an understanding brief, leaving prose development and visual design
to the fresh writer.

## Reference exposure

Read the supplied breakdown and write skills, then every bounded reference part
separately through `scripts/read-writing-reference.py`, with every END marker
received: sequences 1–6, indexes 1–7, storage 1–6. Source/export integrity checks
passed in the helper. Also read the supplied continuity skill.

Inspected finished references in owned IAB tabs on port 4584, without changing
viewport, theme or browser settings. Comparable drawings were Indexes figure 7
(one query, alternative key orders, visible entry/fetch counters), Sequence
diagrams figure 2 (nested waiting and named participant states), and Storage and
durability figure 5 (the same fact in separate layers, with precise state labels).
These inform explanatory progression, not a mandated drawing layout. What needs
to become visible here is the extra primary fetch, SQL/KV boundaries, concentrated
arrival positions and the indivisibility of P7's allocation decision.

Read relevant finished neighbours through the supplied link index, translating
`/learn/databases/relational/` to the coordinator's confirmed
`http://127.0.0.1:4606/review/relational-rebuild/`: Inside CockroachDB, Query execution
and performance, Indexes and access paths, CockroachDB transactions and retries,
and CockroachDB isolation and follower reads. The architecture article already
establishes SQL gateway versus leaseholder, primary-key locators, range splits,
moving index edges and the P7 limit. The general articles already teach operator
repair, selectivity, ordering and workload comparison. Their PostgreSQL page,
visibility-map and measured-plan behaviour must not be transferred to CockroachDB.
The read neighbour was marked working draft; treat its scope as continuity input,
not independent technical evidence. Locality and operations were still planned.

## Example decisions and continuity

- Small mechanism: Mina/customer 1's post-103 history; orders 101 and 103 remain
  paid and pending respectively. Extend the parent's conceptual customer index
  to the existing history request: return `order_id`, `placed_at`, `status`, one
  customer and a UTC lower bound, descending time and ID, LIMIT 10. Primary keys
  travel in secondary entries; the covering candidate stores status. This adds
  an illustrative index, no business rows or new totals.
- Workload: reuse the exact supplied generated report fixture and history
  variation, including customer 1001 versus 1002. Preserve 120003 orders,
  360005 lines, core stock 10/0/4 and all starting payments. Existing native
  timings belong to PostgreSQL and are not CockroachDB baselines.
- Distribution: the paid-order report remains agreed line value on paid orders,
  not payments received. The small answer remains Tariq 40.00 and Mina 39.50;
  pending 103 is excluded. Use it only where a broader input clarifies native
  distribution; do not retell the general operator course.
- Sequential arrivals: a separate local workload model assumes increasing new
  order keys or an advancing time-index edge. Label arrivals and placements as
  illustrative. The generated fixture's dates are not a monotonic arrival trace,
  and its 70% customer skew establishes no observed live write pattern. Avoid
  adding invented committed orders to make the drawing work.
- P7: use an independent lock/contention-only experiment or labelled schedule,
  rolled back with no business change. The already owned purchase replay supplies
  any needed pre-purchase stock 1; it must not be mixed with post-103 stock 0.
  No partitioned-stock or escrow protocol is proposed. Splitting that invariant
  would need an explicit new design, not a performance shortcut.

Continuity pass on the plan: index keys precede counters, counters precede
distribution diagnosis, and key-pattern diagnosis precedes repair. Names, table
names, status, agreed prices and independent scenario boundaries match the shared
record. No shared-fact extension or ownership change needs coordinator approval.

## Primary sources checked

Checked against the v26.2 documentation on 26 October 2026. These establish
documented mechanisms; this planner performed no database execution.

- [EXPLAIN ANALYZE](https://docs.cockroachlabs.com/docs/v26.2/explain-analyze):
  execution effects, native counters and DistSQL output; especially the explicit
  allowance for remote KV fetches with `distribution: local`. Separate operator
  output, KV work, CPU and waits. The page's broad wording for `network usage`
  must not become a claim that zero reported bytes proves no remote KV work;
  qualify the observed fields against the actual SQL/KV nodes and deployed version.
- [SQL layer](https://docs.cockroachlabs.com/docs/v26.2/architecture/sql-layer):
  gateway, physical execution and KV-request boundary.
- [Indexes, storing columns](https://docs.cockroachlabs.com/docs/v26.2/indexes#storing-columns):
  STORING payload and removal of the primary-index join, with write/space cost.
- [Statement tuning with EXPLAIN](https://docs.cockroachlabs.com/docs/v26.2/sql-tuning-with-explain):
  native index-join and table-join examples. A useful lookup join is conditional
  on its input and access path; do not import the tutorial's broad suggestions
  as a universal preference for lookup joins or against full scans.
- [SHOW RANGES](https://docs.cockroachlabs.com/docs/v26.2/show-ranges):
  key bounds, index/range mapping, replica and leaseholder evidence. DETAILS adds
  cross-node work and is not a continuous load-monitoring loop.
- [Understand hotspots](https://docs.cockroachlabs.com/docs/v26.2/understand-hotspots):
  native hot-range, moving-edge and indivisible hot-row terminology. Randomising
  one index leaves other indexes' concentrated write patterns intact; DESC merely
  changes which edge receives increasing-time arrivals.
- [Hash-sharded indexes](https://docs.cockroachlabs.com/docs/v26.2/hash-sharded-indexes):
  hash prefix, shard-count/read trade-off and v26.2 `shard_columns`. Hashing only
  a constrained prefix can reduce read fan-out, but hashing a single hot customer
  prefix still sends that customer's writes to one bucket. Bucket count is not
  a promise of one range or one node per bucket. Full syntax and chosen behaviour
  need native verification if used in runnable examples.
- [Monitor and analyse contention](https://docs.cockroachlabs.com/docs/v26.2/monitor-and-analyze-transaction-contention):
  LOCK_WAIT versus SERIALIZATION_CONFLICT, key and fingerprint correlation,
  and in-memory event retention. The contention-event query fans out expensively;
  use targeted investigation, not frequent polling. Counts and duration answer
  different questions; absent evicted events do not prove no past contention.
- [Performance tuning recipes](https://docs.cockroachlabs.com/docs/v26.2/performance-recipes):
  Top Ranges/Key Visualizer demand evidence, separate from statement contention.

## Remaining evidence boundary

The writer should obtain native plans and schema from its designated disposable
v26.2 environment before claiming an optimiser choice or measured saving. Exact
field availability follows that patch and output mode. An owned single-node run
can establish syntax, result equivalence and local access work; distributed
fan-out, lease movement, hotspot relief and latency need an appropriate topology
or stay explicitly illustrative. No present observation establishes those results.
Live index build/drop and primary-key migration procedures stay with schema jobs;
regional policy stays with locality; health and capacity faults stay with operations.
All temporary tabs created by this planner were closed after reading.
