# Distributed and CockroachDB visuals — independent review

Reviewed 29 October 2026 against the updated `staycurrent-review` visual-teaching standard. Baseline supplied by the coordinator: `604e8c87`; relational content was unchanged during this review. No product files were edited.

## Scope and method

Reviewed the 63 rendered figures in the 14 articles below on the public `/learn/databases/relational/` routes at the coordinator's preview on port 4328. Read figure content and the surrounding explanation, inspected the displayed layouts, advanced stepped figures from their initial state to the end, and exercised meaningful alternatives. This was a visual-teaching review, not a fresh audit of every technical claim or native experiment.

Calibration: inspected the preserved Storage and durability reference, including its WAL update state. Its extra structure earns its place by showing which concrete copy changed and which part survives a crash. The criterion here is similarly whether the drawing reveals a relationship, change or comparison; it is not whether every article uses moving balls or fewer boxes.

Desktop, dark theme, approximately 1280 × 720 browser viewport. Manual stepping establishes state behaviour, not autoplay pacing. Mobile/light-theme coverage is left to the coordinator. Alternative selections below are representative, not an exhaustive cross-product of every control.

| Article key / public suffix | Figures | Meaningful checks and useful forms |
| --- | ---: | --- |
| `incidents` / `slow-queries/` | 4 | Full article context; request-span nesting, lock/pool sequence through release, free-space threshold, recovery chain. The nested duration bars and threshold chart are economical and worth retaining. |
| `schema-change` / `schema-changes/` | 3 | Expand-to-contract sequence; unsafe stale backfill versus guarded/current conversion; late insertion behind the cursor with old-only writer. Simultaneous worker and database values make the failure legible. |
| `capacity` / `connections-and-capacity/` | 4 | Pool/client/execution states through completion; Little's-law comparison; ten-instance rolling-deployment budget; bounded and unlimited queue cases. Counters distinguish occupied clients from executing work. |
| `access-control` / `access-control/` | 4 | Policy versus table grant, transaction context versus retained session context, access versus integrity. The wrong-tenant connection state is a useful concrete comparison. |
| `distribution` / `partitioning-and-sharding/` | 7 | Ownership matrix; history and purchase routing; range/hash distribution; Raft sequence; isolated-leader majority; transaction participants; common versus mixed snapshot. Keep matrices that show independent dimensions rather than drawing every network link. |
| `distributed-commit` / `distributed-transactions/` | 4 | Local-commit failure, complete successful prepare/commit sequence, abort branch selection, recovery variants including final no-quorum state, transaction boundary. Durable records and delivered messages serve different teaching purposes and should remain distinct. |
| `distributed-snapshots` / `distributed-reads/` | 5 | Mixed snapshot, logical/HLC traces, clock uncertainty, closed/applied sequence through readiness, requested time 55 and disjoint retained-history case. Interval overlap is the right form; see Low finding. |
| `placement` / `regional-placement/` | 4 | One voter per region with North lost; remote acknowledgement sequence through application/reply; optional third purchase owner through final state; nearby-read requirements. Region grouping and distinct durable/applied labels carry useful meaning. |
| `cluster-change` / `rebalancing/` | 4 | Base-copy and continuation sequence, unsafe split majorities, old/joint/new checkpoints with only R2+R3, growing backlog at 8 MiB/s through 90 seconds. Joint quorum's two counts and AND are particularly useful. |
| `crdb-architecture` / `cockroachdb/keys-and-ranges/` | 7 | Gateway routing, two-step secondary lookup, full agreement sequence, all four local-storage states, version/replica matrix, purchase keys, split/move/lease sequence with all demand on P7. See two Medium findings. |
| `crdb-transactions` / `cockroachdb/transactions/` | 4 | Native versus application records; Parallel Commits with coordinator disappearance through resolution; invalidated read refresh; retry through confirmed second commit. Preserve the difference between commitment evidence and later intent cleanup. |
| `crdb-reads` / `cockroachdb/follower-reads/` | 3 | Two-read schedule through Read Committed outcome, payment write-skew comparison, closed/applied safety sequence through ready. Keeping both read answers visible makes the isolation comparison easy. |
| `crdb-performance` / `cockroachdb/query-performance/` | 5 | Covering versus non-covering history lookup, remote KV/local SQL boundary, partial totals, whole-key versus customer-only hash, lock-holder/waiter example. Keep the covering selector and hash alternatives; they change actual work. See one Medium and one Low finding. |
| `crdb-locality` / `cockroachdb/locality/` | 5 | North versus West gateway, row-home partitions, cross-region purchase, global reference reads, West region lost under both survival goals. The survival comparison earns interaction; unavailable state needs a clearer visual treatment. |

The remaining five CockroachDB operations articles were reassigned to another reviewer and are outside this report.

## Findings

No Critical findings in this scope.

### Medium — the index lookup does not visually perform its lookup

**Where:** `cockroachdb/keys-and-ranges/`, Figure 2, “Mina's entries lead to two primary keys”. Entry point: `src/articles/relational-rebuild/crdb-architecture.astro:32`; implementation in `src/components/relational-rebuild-crdb-architecture/Figure.astro` and its models.

**Observed:** At both 1/2 and 2/2, the same two secondary entries are outlined. On the second step the primary rows 101, 102 and 103 retain the same unselected appearance. The central label changes to “Look up primary keys 101 and 103 for status”, but no connector or emphasis actually maps each selected secondary entry to its primary row. The reader must mentally match the IDs; the animation's useful change is largely its prose.

**Repair direction:** Show the two mappings directly, keeping 102 visibly outside the lookup. A compact static pair of links may teach the whole point without playback controls. If motion is retained, let it reveal those two links/targets automatically and finish on the readable relationship. Preserve the distinction between a logical primary key and a physical storage address.

### Medium — four storage steps narrate flush and compaction instead of depicting them

**Where:** `cockroachdb/keys-and-ranges/`, Figure 4, “Replicated history and local recovery have different jobs”. Entry point: `src/articles/relational-rebuild/crdb-architecture.astro:62`; same figure component.

**Observed:** The diagram shows abstract classes (“Raft history”, “MVCC data”, “Memtable”, “Pebble WAL”, “Sorted files”). The write step swaps in “New storage writes”; the flush step changes the SST box to “Earlier files + new sorted file”; the compaction step changes it to “Replacement sorted files”. Borders move, but the reader never sees a record arriving in a file, two files being read, or a replacement appearing. The statements beneath the boxes do almost all the explaining. The stable Raft/MVCC header also occupies substantial space throughout this separate local-storage sequence.

**Repair direction:** Choose the teaching job. For the distinction between two logs, a static layered diagram can suffice. To teach the later flush/compaction work, show a few recognisable key/version marks in memory and files, then their changed location or replacement. Keep that local sequence small and separate from the replicated-history distinction. Do not add a full native persistence trace or imply a file per range.

### Medium — the contention figure is a boxed paragraph sequence

**Where:** `cockroachdb/query-performance/`, Figure 5, “One P7 decision is still one P7 decision”; `src/articles/relational-rebuild/crdb-performance.astro:168`.

**Observed:** Four stacked boxes contain numbered prose: A locks, B attempts and waits, A ends, and a paragraph about hashing. Nothing on the drawing itself shows A holding the key while B waits, or the period during which B cannot progress. It takes roughly half a desktop screen to repeat a short sequence the reader still has to read sentence by sentence.

**Repair direction:** Either use a short ordinary numbered explanation, or earn the figure with two aligned transaction lanes and one shared P7 lock. Make the holder's span and the waiter's blocked span visible, ending at the release. No elaborate controls are needed. Keep the lock-only holder separate from a complete purchase transaction.

### Low — selected snapshot time is not plotted

**Where:** `distributed-reads/`, Figure 5; entry point `src/articles/relational-rebuild/distributed-snapshots.astro:57`.

**Observed:** Selecting 55 changes the explanatory message, but the chart still shows only A's 20–60, P's 30–50 and their common 30–50 interval. There is no 55 marker, so the useful comparison between the requested snapshot and P's frontier happens in the reader's arithmetic rather than on the chart.

**Repair direction:** Keep the interval form and add one labelled requested-time marker crossing the shared scale. Its position should make “inside both”, “too new” and “too old” immediately visible. No additional controls are needed.

### Low — covering-index comparison has more framing than it needs

**Where:** `cockroachdb/query-performance/`, Figure 1; `src/components/relational-rebuild-crdb-performance/History.astro`.

**Observed:** The useful pair of index contents sits between a large requested-result box, several prose arrows/status lines, another result box, a narration paragraph and four playback buttons. At this desktop size the whole figure cannot be seen together. The covering selector makes a real difference, but the stage progression mainly moves an outline around already-visible content.

**Repair direction:** Retain the selector and visible disappearance of primary-fetch work. Reduce the gateway/request and result framing to compact labels, and directly connect selected entries to returned status. This can be a readable static comparison per selection rather than a four-step tour. The architecture Figure 2 repair should establish the simpler access-path language first.

### Low — lost voters still look active

**Where:** `cockroachdb/locality/`, Figure 5; `src/components/relational-rebuild-crdb-locality/Survival.astro`.

**Observed:** With West region unavailable, its voters retain the same green outline as surviving voters. The enclosing region is dashed and the text says “unavailable”, so the result is understandable, but counting survivors requires reading each label. The earlier general regional-placement figure crosses out failed voters, which communicates the change faster.

**Repair direction:** Dim or cross out unavailable voters consistently with the earlier diagram; keep non-voter styling separately recognisable. Preserve the correct surviving-vote count and survival-goal selector.

### Low — duplicated authority summary in access control

**Where:** `access-control/`, Figure 1; `src/components/relational-rebuild-access-control/Boundary.astro`.

**Observed:** The actor boxes carry explanatory sentences, then a lower chain restates request → checked application authority → SQL/context → database authorisation → result. Both describe the same handoff. The drawing is intelligible, but its extra text does not reveal another relationship.

**Repair direction:** Keep the actors, the two distinct authority checks and one labelled transfer of SQL plus context. Remove the duplicate chain or move its useful labels onto that transfer. Do not collapse authentication, application authorisation and database permissions into one check.

## Overall disposition

Repair the three Medium cases before treating this subset as meeting the new visual standard. The Low items are focused polish, not grounds to redesign every article. Many existing matrices, interval charts, quorum comparisons and concrete state sequences already teach more directly than a decorative traffic animation would. Keep those forms and improve only where the visible relationship is currently delegated to narration.
