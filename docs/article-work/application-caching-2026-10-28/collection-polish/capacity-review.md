# Independent review: misses and memory

Reviewed the complete current `cache-misses.astro`, `cache-memory.astro`, `stories/capacity.mjs` and `memory/Replay.astro` on 29 October 2026. Also inspected the unchanged misses and memory model functions to distinguish their events from the new animation. Scope is reader/technical interpretation and source-derived animation causality. The coordinator owns rendered layout and controls. No colleague implementation files were edited.

## Findings

**Medium — burst shows a filled cache before the drawn fill arrives.** In `capacity.mjs`'s `burst`, `burstTrace` switches `cached` at `loader.end`, but the new motion returns Database → Server during `end..end+12` and fills Server → Cache during `end+12..end+20`. In the fast variant, the third request is already a hit at 40 ms even though the first drawn fill reaches the cache at 60 ms. The reader cannot consistently follow the same ball and state. Choose one completion event for both the retained numerical model and the drawn arrival; do not change its two/four/one source-read conclusions accidentally.

**Medium — successful refresh appears before its fill returns.** `refresh` sets `refreshed` at 26 s and immediately labels the cache “new copy” and the footer “A replacement is ready”. The result is still travelling Database → Server from 26 to 26.35 and Server → Cache until 26.7. Establish the replacement only when it arrives, with prose/alt and chosen event times kept aligned. The failed-refresh deadline reasoning is correct.

**Medium — memory replay borrows network motion that reverses source ownership.** `renderReplay` sends a request from the cache directly to “Source” and returns an answer straight to the cache. Unlike the preceding App/Server/Cache drawings, there is no server to own that read, so a newcomer can infer that the store retrieves its own missing products. This replay is about admission and retention; it can instead explicitly show a close-up of completed answers arriving for admission, without implying a request topology. Alternatively retain the application owner of the source work. The underlying sequential policy model is consistent.

## Coverage and verdict

The prose pair is coherent and preserves practical depth. It separates coalescing from cross-key admission, waiting deadlines from actual source completion, and lease permission from source execution. The memory article separates admission/eviction/expiry, charged entry bytes from process memory, and hit count from saved work. Ordinary product names remove the previous inventory of IDs while exact commands and implementation keys remain precise.

The visual revisions need the bounded causal repairs above, rather than a broader prose rewrite. No additional substantive technical/prose finding was identified. The memory replay's controls compare meaningful alternatives on one fixed trace, with assumptions available beneath it. The figure's complete baseline and accessible summary do not require exercising every option to learn the main lesson.

Checked arithmetic directly against the model: the default replay has 10 hits and saves 50 of 94 source-work units. With a 1 KiB admission limit, budgets 2/3/5/8 save 50/54/54/54; LRU/LFU/Second request at budget 3 save 54/12/36. The burst model starts four independent slow reads, one shared read or two fast reads. Byte parts sum to 1,024. Lease overlap and waiting examples preserve the stated resource ownership.

A deterministic sweep rendered every capacity scene and exposed variant at seven time points in both layouts, plus all replay policies/budgets/entry limits at six points. It found no undefined, NaN or Infinity. This is not rendered QA and does not settle the motion findings.

## Sources and retained evidence

Rechecked [singleflight](https://pkg.go.dev/golang.org/x/sync/singleflight) for per-group duplicate suppression/result sharing, [Redis lock guidance](https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/) for expiring ownership and atomic unique-token release, and [Redis eviction](https://redis.io/docs/latest/develop/reference/eviction/) for sampling, frequency decay and memory-limit behaviour. The articles correctly distinguish their simplified policies from native Redis behaviour. Other unchanged implementation and native lab facts retain the existing collection evidence. No new native sizing, throughput or production-cancellation observation was claimed or rerun.

## Bounded repairs and source-level confirmation

The capacity author repaired the three accepted medium findings without changing the native models or their event outcomes:

- Burst return and fill choreography now finishes at `loader.end`. The cache state and the same-time fast-hit decision therefore agree with the arrival of the drawn fill. The database return runs during `end−20..end−8`; cache insertion during `end−8..end`.
- Successful refresh return/fill now runs during 25.3–26 seconds. The cache becomes the new copy at 26 seconds, at completion of that movement.
- The memory replay is now explicitly a close-up of retention. Removed the cache-to-Source-to-cache ball route and Source destination entirely. Hits highlight the existing entry; admission and eviction animate only the resident entries inside the byte budget. Heading, caption and accessible summary establish that the server has already obtained a missed answer. No second source owner is implied.

The coordinator's phone review also identified source paths crossing Server labels. Capacity server labels now sit above their nodes, with extra clearance over the burst's waiting balls. The burst cache label was moved lower to separate it from the title.

A repeated deterministic check samples all 24 replay configurations and all scene variants at 101 frames: finite SVG output throughout, and no Source destination remains in the close-up. This is bounded source-level confirmation; the coordinator retains rendered confirmation of the affected geometry and motion.
