# Independent confirmation: core relational prose

Reviewed on 30 October 2026. **All 24 assigned articles pass the prose-independence confirmation. No substantive remaining gap found.** This is an independent reader judgement of the repaired core articles, excluding PostgreSQL, CockroachDB and the coordinator’s eight articles.

## Inputs and method

I fully read each actual built prose-only export through its `END` marker, including rendered SQL, code and ordinary semantic tables. All figure wrappers, captions, diagram/animation controls, SVG, scripts and standalone image containers were omitted. Syntax-highlighting `span`/`code` wrappers were stripped only for readable terminal output; displayed characters were retained. This was a complete sequential reread, not a reference-word scan. One clipped boundary between `backups` and `capacity` was recovered explicitly.

The reader standard was an intelligent newcomer progressing to practitioner: the prose must supply the example’s setup, mechanism, outcome and limits without any illustration or prose amendment. I applied the teaching and editorial checks in `staycurrent-review`. I did not consult the core writer’s repair notes or earlier verdicts before judging.

The initial aggregation export retained an order-history container marked `role="img"`. A scoped source inspection identified it as a visual; I excluded it from the reading. The exporter was then corrected, and current exports remove that container. The following prose independently supplies its LAG outcomes. The regenerated snapshot changed no other core article body.

The current manifest’s source and prose-export SHA-256 hashes were verified against all 24 files after the read; every check matched. The companion `confirmation-core-inputs.json` preserves each exact manifest entry, including source, rendered-HTML and text-export hashes and media-removal counts. Fixed source hashes are also recorded below.

## Individual judgments

### access-control

Pass. Customer and tenant identities, caller-supplied context, pooled-session cleanup, existing versus proposed rows and integrity versus access each receive an independent explanation. The reader can distinguish safe SQL construction from authority to see or change a row without consulting an illustration.

### aggregation

Pass. The five-line fixture establishes the inputs. Group grain, filters, null and empty results, window partitions, peers, frames, ranks and LAG results are explained in prose and ordinary result tables. Removing the standalone order-history image leaves Mina’s and Tariq’s preceding-order outcomes fully explained.

### application-sql

Pass. Parameters, type mapping, row counts, batching, join multiplication, cursor lifetime, transaction ownership and uncertain commits develop from explicit application behaviours. The reader can reason about ownership and failure cleanup from the text; code is treated as a bounded example, rather than a complete production client.

### backups

Pass. The unwanted 2.20 price and later valid payment 504 establish why choosing a recovery target is a business decision. Recovery chains, isolated validation, identity-preserving reconciliation and external effects are explained through to their limits. No recovery-history premise survives only in a timeline.

### capacity

Pass. Connections, occupied borrowers, execution and queues have distinct meanings. The arrival-rate arithmetic states its assumptions; rollout budgets, poolers, retry load and admission limits connect those quantities to useful completions. The reader need not infer a capacity model from a chart.

### cluster-change

Pass. Snapshot and update boundaries, learner catch-up, old and new voter sets, the split-majority counterexample and joint rules all have textual premises and outcomes. Movement rates, failure-domain margins and decommission acceptance explain when a membership operation is safe, rather than merely describing its stages.

### distributed-commit

Pass. The order and stock owners, prepared state and durable decision are introduced before their failure cases. The blocking histories and replicated decision quorum supply enough information to distinguish atomic outcomes, visibility and request recovery. Participant and quorum scope remain explicit.

### distributed-snapshots

Pass. Timestamp 35/40/45, clock uncertainty, safe closure and applied history are defined before use. History-interval intersection explains the common read view; staleness bounds and the stock-authority example prevent a snapshot guarantee from being mistaken for permission to allocate.

### distribution

Pass. Ownership, replicas, routing and co-location are distinguished before range/hash and fan-out examples. Constraint scope, the current-term replication case and cross-owner commit/read boundaries explain the practical consequences. The reader receives the relevant model assumptions without relying on the ownership diagrams.

### failover

Pass. History H, update U, commit C and candidate copies are established in text. Detection, fencing, surviving history, promotion, stale connections and the returning former writer form one causal explanation. The reader can distinguish a reachable server from enforced write authority and account for potential loss.

### incidents

Pass. The 600/300/100 request stages and lock holder H are supplied in prose. Queueing, blocking chains, expensive versus repeated work and storage delay lead to bounded interventions and useful-recovery checks. The diagnostic argument does not depend on a dashboard’s visible state.

### indexes

Pass. The tree and row-location setup, twelve-order comparison, composite key direction, selectivity, physical page work, coverage, partial populations and write costs are independently explained. Exact native counts retain their stated scope. Removing the pictures leaves the access-path comparison and its limits intact.

### locks

Pass. The last-mug decision and empty payment set motivate the common order-row authority. A later Read Committed statement, the unchanged-row Repeatable Read caveat, deadlock cycles and acquisition order are explained causally. NOWAIT, SKIP LOCKED and timeouts retain their different business consequences.

### outboxes-jobs

Pass. Logical work identity, atomic intention, receiver acceptance and the crash gap establish the delivery problem. Lease/generation checks, lock-then-clock completion and stale-worker limits explain which effects the database can reject and where receiver cooperation is needed. Replay and ordering have explicit limits.

### pagination

Pass. The five-order starting set, tied orders 201/202 and insert/delete variants make offset and keyset outcomes reproducible from the text. Mixed directions, nulls, previous pages, token authority and precision are explained. Current lists and retained export snapshots remain distinct promises with stated costs.

### partitioning

Pass. The separate reporting copy declares its weaker pair identity. Half-open bounds, pruning, retained line work, references, lifecycle cutoffs and detach-versus-delete explain what partitions change and what they do not. Native work counts have sufficient textual context and qualified limits.

### placement

Pass. Origins, leaders and voters are introduced separately. Regional replica counts and the quorum rule explain both healthy and degraded cases; 40/90 ms network contributions are explicit model premises. Local orders and remote stock/payment participants make the request’s actual communication boundary understandable.

### query-execution

Pass. The five-line report establishes the result grain before operator work. Scans, pages, joins, estimates and the explicit correlation model connect to the measured full-year/October examples. Results, alternative plans and work counts are interpreted in prose with their timing limits; no plan diagram is required.

### replicas

Pass. H/U/C, receive, durable storage, replay and read snapshots are defined independently. The acknowledgement contract, routing promises, lag/drain arithmetic and retention obligations explain which replica can serve which read. Failover qualification prevents progress on one history from being mistaken for the accepted history.

### retry-outcomes

Pass. A known abort is separated from an uncertain commit before the caller-scoped key and canonical result protocol are introduced. Atomic result storage, the unique gate, separate statement snapshot, savepoint undo, mismatch checks and retention limits explain why one logical request is recovered rather than repeated.

### schema-change

Pass. The exact 20.00→2000 conversion, domain limits and NaN exception precede migration. The old-writer and stale-backfill counterexamples establish why guarded transformation and a closed write path matter. Cursor exceptions, convergence checks, return windows and old NOT NULL retirement make acceptance and contraction actionable.

### storage-durability

Pass. The separate P7 experiment preserves order 103’s agreed price. Pages, versions, dirty buffers, WAL ordering and commit durability connect to the crash outcomes. Group-commit arithmetic, checkpoint work, retained history and backup limits are explicit, with model inputs distinguished from observed execution.

### transactions

Pass. Purchase facts and stock outcomes are complete before the guarded-update race. Statement and transaction snapshots lead naturally to the 29.00/40.00 payment anomaly, Serializable retries and common-lock alternative. The text explains both the isolation guarantee and its inability to identify a duplicated request.

### writes

Pass. P7/P11 authority and the immutable four-row B17 source are established before validation and application. Upsert assignment versus deltas, duplicate keys, atomic chunk progress, partial publication, resume and reconciliation have explicit outcomes. COPY transport and uncertain-commit limits remain separate from importer correctness.

## Version record

| Article | Source SHA-256 |
| --- | --- |
| access-control | `04febd699b0830918df14f3054e12e22d15fd4e8dbb6055ecd8b763c3ba27396` |
| aggregation | `680fd5e8b312d7d96194e3f694da767f1ca28c4d744710d7f844c25849fdd045` |
| application-sql | `65a2486549b4a5d29d95088fa9f5f995d946fa471727f475976279fe935c2e36` |
| backups | `bc3827c97b36c19eb68a6544052178ab2d050c194bd9315665216f846d55b0ea` |
| capacity | `de60e090ad11f652bfbc4a3a8a63df67c4f07069fac642524ced1e9542106c0a` |
| cluster-change | `8b6fe58f0ece49aff2e0383e59583b1f9b780fb2c13f6141790b0a77037b2db1` |
| distributed-commit | `ff85beb3e363cd8cb2818a6d28eb63882f50c234ac21d80cb3c730cad72d3196` |
| distributed-snapshots | `86c14a843e8dee124c7dcb22361805404b7402c107a564531791798063bcd9c7` |
| distribution | `72f1e893988cbbb2520969fd93375679ecfad08e1d2865486fa370e4014e3e6b` |
| failover | `afa0ef98fcde8f3f007c18e247497e832f6f4a2e202df26937b94a7d891d222d` |
| incidents | `6b59562dd103630c210fd63f92da26f66311efc85e8ac7647802955d0f800e8e` |
| indexes | `d19c4b3cf22afd74f8fef15e6b0d8d01bf48451abc18e21ba3e0e1dcc620628f` |
| locks | `98c88ebbe7f3ea3677777db5ed6dd2d9cc50e86aa401abda04bc4f350d61bf36` |
| outboxes-jobs | `cdeb1cd4d621f325e7a266a364274ff7e44bffa0811cd3683260c4c6f0dca7e8` |
| pagination | `72841b5aa3678714cfa6e7ffdeb033d70322b84d76dbc2496eb2bd6f84065f2a` |
| partitioning | `e4c528784d14fefbaf3501f5d74587bf1a628ce35c2030d82c72879550f597d2` |
| placement | `adf19a136e51228b6fc5efa957d82ea6546cfb888bbc91a5462219ce55c1e237` |
| query-execution | `01eb5a3d0fff3f87f57cd5bdbb50923a8a8d81471936d1497bb749ebd8890247` |
| replicas | `50f0ec53fbf13d497534b7adf2cc986d70d1961849cf299ee1b0cd86c51e0e7f` |
| retry-outcomes | `08b642468a9f66883bb63340eb52082a31fce9072677a73561faa763256911a5` |
| schema-change | `1984b475bf92e91acb6619643ca0dd4c250f014d670a72c7fe372cd116947ff3` |
| storage-durability | `0c242500ace2ae15d4d6fb5a0d2c6a3acbeefc349c5a67eb49abff9a67f3958f` |
| transactions | `160399514e3a0dbd2742ff05c10bae1f669dd6289b5fe7e1ba1b68e60f1476dd` |
| writes | `b5885cb1075c9cdeea0579dd1777337f649841e2195ed3b32915a3dbb98dbee1` |

## Limits

This confirms the explanatory meaning, continuity and readability of the built prose after media removal. It does not replace the coordinator’s rendered-visual/control review or the existing technical execution evidence. I ran no build, SQL experiment or performance test, made no source changes, and commissioned no agents. Existing technical evidence and its stated limits were retained; no new measurement is claimed. No actionable optional-polish item arose that warrants reopening these articles.
