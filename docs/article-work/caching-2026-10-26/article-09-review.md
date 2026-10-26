# Article 9 — Redis memory and performance

27 October 2026. Sole-agent authorship/review, not independent review.

## Evidence and boundaries

Primary MEMORY USAGE, INFO, memory optimisation, eviction, persistence, SCAN,
HGETALL, KEYS and UNLINK documentation checked. Redis 8.2.2 lazyfree.c inspected
locally from official release source: freeObjAsync estimates free effort and may
free small objects synchronously. No claim that every UNLINK always defers every
allocation. Current docs include later features; no Redis8.10 compact-hash feature
assumed for this baseline.

Native lab repeated successfully with Redis8.2.2, node-redis6.3.0, Node24.16.0,
macOS arm64, 64-bit libc. Exact string/key/encoding measurements repeated. Hash
512/listpack7200bytes to513/hashtable37008bytes reproduced. The figure's samples
match the evidence, not a general sizing formula. The lab verifies configured
thresholds, HSCAN COUNT1 returning512fields, SCAN empty batches until cursor0,
HGET vs HGETALL result sizes, SLOWLOG inclusion and immediate absence after UNLINK.
Byte counts and command durations are observations, not performance promises.

Runner owns a private Unix-socket process, no Redis TCP port or persistence;
cleanup removes its process and temporary directory. It never connects to an
existing service. Documentation, source, pinned package and lock form the public
five-file zip. Full nested sampling occurs only on the small lab hash. No native
snapshot or COW benchmark claimed. COW is a sourced, explicitly simplified model.

## Teaching review against Gears and Load Balancing

Begins with a surprising measured change, then exposes the representation rather
than simply reporting the result. A compact-sequence vs bucket/entry schematic
accompanies the allocation bar, labelled as schematic rather than a byte-level
implementation diagram. Toggling compares recorded states, not a supposed reverse
encoding conversion on deleting a field.

Capacity keeps two boundaries visible on one scale: satisfying maxmemory does
not satisfy the host budget. Its inputs are explicitly disjoint and invented;
real INFO views overlap. Readers change snapshot copies independently from cache
allocation and observe the consequence before prose explains operational margin.

The page grid preserves physical-page identity. Repeated writes to one page
create one old/new pair; spreading writes creates more pairs. This applies the
reference articles' stable visual identities and one-cause-at-a-time progression.
The maintenance timeline conserves execution work and shows how changing operation
boundaries changes waiting, with its priority rule and missing network cost stated.

Connected prose translates these mechanisms into object boundaries, measuring
encodings, capacity headroom, command selection, bounded maintenance and workload
verification. Around ten minutes, four experiments and a native lab. It refers
back to working sets/client behaviour and leaves recovery guarantees to article10.

## Functional and rendered checks

Four model tests cover disjoint capacity arithmetic across limits/COW settings,
page-sharing/copy/release invariants, work conservation and non-overlapping
scheduling, and reader latency under two chunk sizes. All43collection tests pass.

- Desktop dark encoding and budget figures inspected. 513fields→37008bytes.
- COW: start12pages, two writes to page1→13pages, write every page→24, finish→12.
- Budget: maxmemory1024/COW1024→2560required vs2048host, unchanged counted1024.
  Lowering maxmemory512 yields2048required and no remaining headroom. Exact-limit
  wording adjusted so it does not describe a zero margin as below the limit.
- Maintenance chunk3 yields1ms waiting for each read; total execution remains15ms.
- Phone390×844 light: every figure rendered, page width390 with no horizontal
  overflow. Native range Home/End and page-button Enter tested. Metrics table
  changed to stacked definitions on phone to avoid breaking long metric names.
  Measured-object table remains readable. Encoding stats use three explicit
  columns; final schematic/labels inspected at actual390px width.
- No browser consoleerrors. Reduced-motion disables the allocation-bar transition;
  other figures are manually stepped. Temporary phone tabs closed/viewport reset.

Final build after manifest/previous-link and responsive fixes passes all13site
rules; git diff whitespace check passes. Article8 links to this article. Publication
of each finished article is explicitly authorised; commit/push/deployment next.
