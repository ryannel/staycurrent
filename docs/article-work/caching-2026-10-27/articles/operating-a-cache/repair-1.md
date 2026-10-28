# Repair, round 1: Operating a cache

Source: `src/articles/caching/operating-a-cache.astro`; figures in `src/components/caching/operating-a-cache/`. Nothing committed. Shared toolkit not edited.

New evidence is under "Repair round 1" (RR1 to RR5) in `evidence/operating-a-cache.txt`. Redis 8.10.3 ran on 7111, 7181 (cluster-enabled) and 7182 (replica). All three were shut down and their data deleted. The dev server on 4421 has been stopped.

Screenshots of every figure (light and dark, 1280 and 375 px) are in `screens/`. Control states are in `screens/states/`: each Figure 2 limit and each Figure 3 strategy at 150 s, Figure 5 at 1 GB with two reserves, and Figure 1 at 50% and 99%. The model tests pass (8, up from 6).

Prose is 6,959 words against 6,938 before (excluding figure text), so about the same length. Cuts paid for the new material:

- the `FLUSHALL` internals paragraph;
- the duplicated Valkey default;
- the middle of Figure 1's follow-up;
- tightening throughout.

The new material:

- per-node monitoring;
- the ACL explanation;
- client buffers;
- the two-bound limit rule;
- dead hosts;
- Gutter.

## Teaching review

| Finding | What I did |
| --- | --- |
| R1 Figure 1 slopes | Fixed by the shared clipping change; no local workaround. Checked at every stop: the dashed line crosses 300 at 300, and the solid line crosses at C ÷ (1 − h). I added a test that runs `loadLines` through the shared `clipPath` and checks both crossings at all five stops. |
| R2 Figure 3 overshoot | The chart now plots queries the database **finishes** each second, not queries admitted. It stays at 300 (±4 from one-second bucketing) and never shows 355. The axis, label, caption and text alternative now say "finished". |
| R3 Figure 5 markers through text | Values now sit on their own line above thin bars, so no bar edge crosses a number. Checked in both themes and at both widths. |
| R4 Two sizing rules | Reconciled into one rule with two bounds (`#limit`). The lower bound is the queries the database can usefully run at once, or it idles. The upper bound is capacity × time allowed (Little's law, 60), or admitted queries miss their deadline. A pool enforces this with pool size equal to the running bound, plus a wait short enough to keep inside the 0.2 s budget. The model's database now runs 8 workers of 27 ms each (still 300 a second), so the figure shows the lower bound too. |
| R5 Per-shard monitoring | New h3 "Watching every node" (`#per-node`, about 150 words). It covers `INFO` from every node, alerting on the worst node and the total, `CLUSTER INFO` `cluster_state` and `cluster_slots_fail` (fields checked, RR3), sizing for the largest shard, and an ArticleRef to cluster-and-hot-keys#finding-hot-keys for `CLUSTER SLOT-STATS` and `HOTKEYS`. The alert-table intro says "read from every node", and a closing bullet says "worst node as well as the total". |
| R6 Two demonstrations | **Limit size:** Figure 2's choice is now no limit / 4 / 60 / 300 / 600. At 4 the database answers 14% during the outage and refuses about 2% even before it; 60 gives 30%; 300 gives 18% with 3,800 wasted; 600 gives about 0% but recovers within 3 s. The prose and text alternative walk through them. **Memory outside `maxmemory`:** Figure 5's first row is now a stacked bar of the node. It shows `maxmemory` (cached data plus a striped client-buffer sliver labelled "counted inside maxmemory"), then fragmentation, replica and AOF buffers, and copy-on-write, split according to the reserve choice, with amounts in a key. The caption says the split and the sliver are illustrative. |
| R7 Slogans and long sentence | ElastiCache lede: now "On ElastiCache, `maxmemory` is the node's memory minus its 25% reserve…". "Busy all the time…": deleted. Heading: now "Failure testing" (`id="testing"` kept). The 110-word sentence is now a four-item list, with the stacked bar carrying the picture. |
| S1 Circuit-breaker figure | Skipped, as the orchestrator directed. It would add a figure without replacing prose of similar length. |
| S2 Dead versus hung timeline | Skipped for the same reason. The prose now adds the dead-host and dropped-packet case instead (technical S4). |
| S3 Pacing | The prose now says "Press Skip ahead until Redis is back at 40 s, then keep skipping." |
| S4 Comparison | Once a limit is chosen, Figure 2 draws the no-limit run as a faint dashed line. It is computed once, when the browser is idle. |
| S5 Figure 3 hit ratio | Added a second small chart of the new cache's hit ratio, with an 80% rule. The prose points to it for the 30 s, 70 s and 25 s results. Ghosts of the other strategies were not added. |
| S6, S7 Figure 4 caption | The caption now says each recording starts empty, which is why since-start is lower. It also says the 10-second window spreads a burst, and that the 6 MB run evicted about 10,000 keys within two seconds. |
| S8 Figure 1 labels | New title "…, with and without the cache". Added a "Safe either way" band. The caption and prose name the numbers as Bronson and colleagues' example. |
| S9 Metastable | Now defined at first use. |
| S10 Replica lag, latencystats | Replica lag (`master_repl_offset` minus each replica's `offset`) and `INFO latencystats` (Redis 7+) added to the alert table. Fields checked in RR3. |
| S11 Gutter | One sentence added in `#refused`. |
| S12 "queries" | Figure 5 and the prose now say "database queries a second". |
| S13 Phone ticks | Figures 2 and 3 use a 40 s tick step when the figure is narrower than 480 px. Chosen at load, so it is not responsive to later resizes. |
| Density cuts | The `FLUSHALL` paragraph is now two sentences (ASYNC; blocks only its caller since 7.4, but everyone inside a transaction or script). Valkey defaults now appear only in the services section. Figure 1's follow-up paragraphs are trimmed. |

## Technical review

| Finding | What I did |
| --- | --- |
| R1 Client buffers | Moved inside `maxmemory` in the prose list, Figure 5 and the alert table (`mem_clients_normal`, `client-output-buffer-limit normal`). Includes the measured slow-reader eviction, re-run in RR4: 24 MB buffer, three quarters of a 30 MB cache evicted. |
| R2 Fragmentation figure | Now presented as "twice `used_memory` on my laptop's libc build, while Linux builds with jemalloc return freed pages gradually; check `mem_fragmentation_ratio` after a large delete." |
| R3 ACL | Now `+@read +@write +@connection +@transaction +@scripting -@dangerous`. Tested as a normal client (RR1): PING, SELECT, CLIENT SETINFO/SETNAME, WATCH, MULTI/EXEC and EVAL on own keys succeed; other keys, FLUSHALL, INFO, KEYS, CLIENT LIST and CLIENT KILL are refused. The prose names `+cluster|slots` for cluster clients and says to test with the real client library and exporter and read `ACL LOG`. |
| R4 CONFIG SET | Now version-scoped: before 7.0 versus protected `dir` and `dbfilename` since 7.0 while `enable-protected-configs` is `no`. Re-checked in RR2. `evict.c` and the protected-configs note added to Sources. |
| S1 | `statement_timeout` is said to be off by default, set on the application's role just above the deadline. Pool defaults are given (HikariCP and SQLAlchemy 30 s; node-postgres waits for ever); I re-fetched HikariCP, node-postgres and the PostgreSQL docs. "In its default parameter groups" added for `volatile-lru`. |
| S2 | HikariCP's 250 ms minimum and the semaphore alternative added. Reconciled with R4. |
| S3 | Replacement procedure reordered: allow writes on the replica, switch clients, then `REPLICAOF NO ONE` once the old server has no queries. |
| S4 | Dead host or dropped packets: only the connect timeout ends the wait; rehearse it with a firewall drop rule. |
| S5 | The prose now says the 2,130 bytes a key is libc and that jemalloc rounds differently. |
| S6 | Bystander cost: kept to one number (about 130 ms inside a transaction or script) because the paragraph was cut on density grounds. Scripts are now named. |
| S7 | "A restart without persistence". |
| S8 | ElastiCache wording corrected as suggested. |
| S9 | `expired_time_cap_reached_count` explained in the table: the time budget, about a quarter of the main thread at `hz 10`; latency, and lingering expired keys. |
| S10, S11 | No change needed. |
| S12 | Figure 4 caption now says macOS, libc malloc, and that keys per MB depend on the allocator. |
| S13 | Metrics user narrowed to `slowlog|get|len` and `latency|latest|history`; RESET refused (RR1). The prose says to test the exporter. |
| Minor | "Writes count nothing" became "A plain `SET` counts nothing". The benchmark wording is unchanged. |

## Choices where findings met

- I added a parallel database (8 workers) rather than only qualifying "too low". It shows both bounds, and Figure 2's headline numbers barely moved: the first second went from 42% to 41%; 70 s, 144 s and about 40,000 are unchanged. Figure 3's ramp peak is now about 210 (was 220).
- For the client-buffer sliver in Figure 5, I did not subtract it from products held, so that the tested numbers stay the same. The key and caption say it is drawn small, as it normally is.

## For the orchestrator

- I regenerated `screens/` and removed the writer's earlier captures, because disk space is tight. The writer's `screens/states/` captures were replaced by this round's states.
- During exercising, the page hot-reloaded twice from other agents' edits. Both affected runs were repeated.
- `pnpm check` reports internal-link errors only in `designing-a-cache` (another agent's article). `raw-colour` and the CSS rules pass.
