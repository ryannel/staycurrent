# Misses and memory: collection polish

29 October 2026. Scope: `cache-misses.astro`, `cache-memory.astro`, their new story scenes, and the memory replay. Shared player, article layout, other articles and the approved introduction are coordinated separately.

## Reader problems addressed

The earlier figures made the reader operate a sequence of steps, then repeated those steps in prose. Product codes and loader IDs added work without helping readers distinguish the underlying choices. Several figures were dashboards of boxes rather than readable causal drawings.

The revised figures play once on visibility and settle. Timelines expose the distinction between waiting and work without a long button sequence. Familiar App, Server, Cache and Database roles return where request routing matters. The memory replay keeps policy, budget and entry-size choices because those choices answer useful questions; changing an option replays the same workload from empty. Pause and replay remain available through the common player. Each scene has dedicated landscape and portrait geometry and text alternatives.

Prose now develops the implication of the drawing: why latency increases duplicate work, why cancellation cannot free occupied capacity, why a queue can outlive its usefulness, why old popularity can prevent adaptation. Detailed model inputs live beside the experiment under an expandable explanation. The native Redis example and operational qualifications remain.

## Reference and continuity pass

Read the updated write, figures, continuity and revise skills. Read all bounded reference parts separately using `scripts/read-writing-reference.py`, confirming each END marker: Sequence diagrams 1–6, Indexes 1–7, Storage and durability 1–6. Recovered any clipped article source reads separately. Read both complete assigned articles, their relevant coverage briefs, the shared example and the approved introduction and bounce implementation before changing them.

Reference lessons applied: stable roles before extra machinery, one question per drawing, comparisons at a common scale, and controls which expose a substantive choice rather than require page-by-page operation. Full reference browser inspection and final rendered checks belong to the coordinator's shared browser session.

Reread the repaired sections with their downstream policy tables, source budgets and native experiment. Product names stand for the fixed complete answer identity; product IDs remain in the actual Redis key where relevant. The coordinator approved and owns the shared mapping: P7 Mug, P3 Jug, P8 Spoon, P9 Bowl, P40 Vase, Q Catalogue. The pre-existing replay's sizes and costs are unchanged. These are a scoped memory experiment, not a claim that real product cards have equal sizes. Server A/B replace App A/B for distinct backend instances. Redis is introduced as one concrete implementation.

## Scene inventory

- `capacity/burst`: four arrivals, independent versus shared source work, plus faster-source case. Source-read and waiting counts come from the existing event model.
- `capacity/waiting`: caller lifetimes above the shared read; the first deadline does not release its source slot.
- `capacity/lease`: aligned owner and source-work timelines; old work overlaps a new owner.
- `capacity/refresh`: old serving boundary survives a failed refresh; success is a useful alternate case.
- `capacity/admission`: two source slots, two queue places, faster and slower source cases; caller deadlines leave occupied slots accounted.
- `capacity/working`: mug and jug requests follow App → Server → Cache and, for misses, Database; later requests reuse the two entries.
- `capacity/bytes`: charged value, key, bookkeeping and allocation gap grow into one proportional byte bar.
- `capacity/expiry`: eviction ends reuse before the TTL boundary; expiry ends the remaining copy's usable lifetime.
- `memory/Replay.astro`: the unchanged 18-request model now plays as a request stream and proportionally sized resident cache. Meaningful policy, budget and maximum-entry controls remain. Removed entries leave; admitted entries settle into the budget. It exposes misses, hits and source work saved.

## Verification

- Existing `misses/model.test.mjs`: all five tests pass (burst timing, coalescing, overlapping work, distinct-key admission, deadline accounting).
- Sampled all 12 story variants at 101 frames each: each returns two finite SVGs; no NaN, undefined or Infinity.
- Sampled the memory renderer for all 24 policy/budget/entry-limit combinations at 101 frames each; finite SVG output throughout.
- Checked each replay state: resident bytes do not exceed capacity; hits + reads equal requests served; saved work + performed work equal the trace's uncached cost to that point.
- Default replay remains 10 hits, 8 misses, 50 saved work units. At 3 KiB with a 1 KiB entry limit, LRU/LFU/second-request totals remain 54/12/36 saved units.
- Actual example key is 29 UTF-8 bytes. Other Figure 2 byte components are explicitly illustrative.
- Root owns build, dense-prose output and browser confirmation, including alternate controls and reduced motion. Those are pending at this handoff, not claimed by this record.

Primary-source checks during this repair: [Go singleflight](https://pkg.go.dev/golang.org/x/sync/singleflight), [Memcached early recache](https://docs.memcached.org/protocols/meta/#early-recache), [Caffeine eviction](https://github.com/ben-manes/caffeine/wiki/Eviction), [Redis key eviction](https://redis.io/docs/latest/develop/reference/eviction/). Redis documentation retrieved through its indexed official page after the direct-open tool failed. The native OOM experiment is unchanged and retains its existing evidence in `../evidence/native-redis.json` and `../evidence/native-redis.md`; no new native sizing or eviction-quality claims were introduced, and the native lab was not rerun.

Scoped independent review caught a visual timing mismatch: burst fills were drawn after the existing model marked them complete, and refresh success was labelled before its return/fill motion ended. Corrected choreography to finish each burst fill exactly at its model completion event, before same-time hits, and finish refresh return/fill exactly at 26 seconds before changing the copy label. No model timing changed. Moved the burst cache lower on phones to separate its label from the title. Coordinator owns rendered confirmation.
