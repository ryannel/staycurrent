# Cache memory and eviction — writer record

Completed draft, 28 October 2026. Owns `cache-memory.astro`, its metadata,
`src/components/application-caching/memory/`, and `evidence/memory-model.json`.
No publication or commit performed. Coordinator owns build, density, rendered
checks and independent first reviews.

## Reference reading and teaching choices

Read all 19 fixed reference parts separately through
`python3 scripts/read-writing-reference.py`, with 5,000 output tokens per result;
all END markers received: sequences 1–6, indexes 1–7, storage 1–6.
Inspected coordinator captures of Storage figures 1 and 2 and Indexes figure 3.
The article follows the buffer-slot example's resident/source accounting and
Indexes' same-input comparisons: establish a small count, change one condition,
keep the resulting work visible, then separate the model from implementation.
Read write, figures and continuity skills and figures' stepper/render/database
references. Read commission, frozen memory plan, canonical collection context
and shared example.

Four figures: initial requests with residents; proportional invented byte bill
inside process/host budgets; two expiry/eviction histories; interactive full
trace with LRU, non-decaying LFU and bounded second-request admission. The final
sizing table is generated from the same model as the replay. All changing text
has data-live; controls use the shared stepper. Text versions include the full
default trace and exact alternative rules.

Applied user's animation steering: resident cards visibly enter from the source
side, depart when evicted, move when neighbours change, and pulse on hits. Q
occupies three charged units. Animations are bounded transitions via Web
Animations and skipped when reduced motion is requested. Narrow cards display
ID and bytes; readable resident histories sit below them rather than being
compressed into narrow columns. Desktop/375 px, both-theme, keyboard and all
control inspection remains with coordinator.

## Evidence and limits

Primary docs checked via web on 28 October 2026: Redis eviction, MEMORY USAGE,
INFO; Caffeine Eviction and Design; Memcached performance/efficiency. Source
links are in the article. Avoided Memcached documentation's older assertion
that assigned slab pages never move; article uses only size-class allocation.
No native byte values or policy performance are claimed.

Reused native-redis.json / native-redis.md evidence for the OOM branch only:
Redis 8.10.3, owned Unix-socket instance, persistence/TCP disabled; noeviction
and maxmemory 1 reject a new SET EX 30 while the dictionary source retains P7
revision 2. Exact source provenance remains in that existing evidence. Did not
modify or rerun its helper or evidence.

Model checks run in Node against all 24 combinations (4 capacities × 3 policies
× 2 entry limits), checking every state for capacity, key uniqueness,
hits+misses, and saved+remaining source work. Independently expected scenarios
check Q displacing both initial cards, the size limit preserving both, the LFU
shift failing, second-request admission delaying the first useful hit, and
per-product work totals. All passed. `evidence/memory-model.json` records results.
The 18 requests require 94 source-work units uncached. Default: 10 hits, 44 work
remaining, 50 saved. With 1 KiB entry limit and 3 KiB LRU: 12 hits, 40 remaining,
54 saved; the larger 5 and 8 KiB budgets save no further work. Byte arithmetic:
900 + 29 + 71 + 24 = 1,024; only the 29-byte UTF-8 key is an actual encoding count.

A standalone Astro compiler import was unavailable at the repository root
(`@astrojs/compiler` is not directly resolvable); no compilation result claimed.
No server or whole build was started, per coordinator ownership. Actual Astro
build and dense-prose check are pending coordinator integration.

## Continuity pass

Reread complete article, captions, controls and generated outcomes against the
intended reader path. Distinguishes catalogue, interval working set and actual
residents before using them. Bytes precede capacity, expiry precedes eviction
policy, admission precedes reuse filtering. P7 remains north/en-GB/GBP, GBP 20.00
except the explicitly labelled native rejection using revision 2 (GBP 22.00).
Complete key is used in memory commands; v1 is not repurposed as data revision.
The 30-second TTL starts on insertion and promises neither residency nor
unconditional source age. Copy loss remains distinct from authoritative state.
Q is a labelled invented catalogue-list result, requested once; P3/P8/P9/P40
are other products. Sizes and work costs remain invented throughout, with
P9's unequal cost explicitly shown. No source failure becomes cached absence.

Scope stays with allocation, retention and evaluation. Cache admission is
explicitly distinguished from source-work admission; freshness, bounded misses,
complete Redis client code and operating procedures link to their owners.
Only open dependencies are coordinator's build/density/render checks and the
commissioned reviews; no shared-example change is required for these local
illustrative trace facts.
