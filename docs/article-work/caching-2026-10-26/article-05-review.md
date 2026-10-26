# Article 5 — Cache stampedes

Completed 26 October 2026. Sole-agent authorship and review; not independent review.

## Technical evidence

Primary sources read: Go singleflight API, Redis single-instance lease pattern,
RFC5861 stale controls and Amazon caching challenges. All linked in the article.
This is an application adaptation of stale-while-revalidate, not an HTTP cache
implementation. Single-primary cache-fill leases are not Redlock, a general
correctness lock, exactly-once execution or a substitute for generation checks.

Native stampedes.sh was executed against official Redis8.2.2. SET NX PX acquisition
succeeds for A, fails for B; after explicit expiry B acquires. A's token-checked
release and fill are rejected, B's atomic fill/release succeeds, and unconditional
DEL demonstrates removal of a successor lease. Evidence in evidence/stampedes.txt.
The lease was shortened with PEXPIRE to reproduce the schedule quickly; no source
operation was executed or measured. Disposable isolated container removed by trap.

Six model tests verify duplicate work by scope, queue/completion accounting,
jitter's maximum lifetime and entry conservation, overlap after lease expiry,
late-owner rejection, coalesced refresh, failure retaining age/deadline, stale
result discard and caller timeout not cancelling shared work. Fixed-duration FIFO
jobs are labelled illustrative and do not claim a real overload curve.

## Teaching judgement against references

The opening makes repeated work visible before describing singleflight. Stable
caller groups and source slots are replayed under different coordination scopes,
following Load Balancing's resource/queue experiments. Animation exposes progress
within a job; Next completion and time scrubbing support precise inspection.

Following the Gears style of changing one assumption at a time, the lease figure
separates permission from work already in motion. The jitter figure changes the
number of keys rather than pretending to solve one-key duplication. The age-band
figure separates refresh eligibility from permission to serve, then introduces
failure and delayed completion. Clear captions keep idealised models distinct
from the native Redis worksheet. Prose links these visible effects to bounded
waiters, cancellation, admission and the subsequent failure-handling article.

Four distinct central arguments, about ten minutes of prose. No command catalogue
or universal TTL recommendations. Per-key coordination is explicitly insufficient
for aggregate cold-load capacity. Observation-time accounting preserves article3's
freshness reasoning; ownership validation preserves article4's separate generation
boundary. Assumptions around source freshness and lease loss remain explicit.

## Browser verification

Desktop dark and 390×844 light screenshots inspected. All four figures fit with
readable controls; source slots/process groups wrap to two columns. Page width
390 equals viewport width. No browser console errors. Viewport reset afterwards.

- Play advances job bars and time, completes 12 callers in the model's 1500ms,
  then stops. Animation clock accumulates elapsed time independently of range-step
  rounding, avoiding a high-refresh-rate stall. Hidden-page stop and reduced-motion
  disable are implemented; manual scrub and next controls remain available.
- Six processes/local coalescing: 6 jobs; at 500ms 8 callers done, 2 loads active,
  final completion1000ms. Shared mode: 1 load, all12 done at500ms.
- Keyboard End on jitter gives 40–60s range and peak8; Home restores one60-key
  group at60s. Vertical scale stays60, avoiding a misleading auto-scaled comparison.
- Lease step3 shows A and B loading while owner is B. Safe finish saves£15.
  Disabling A's check produces the old£12 and prevents B's guarded fill; Back works.
- At10s two reads share one refresh and return£12. Failure preserves observed0.
  At20s read waits; End waiting request reports unavailable while load remains.
- Refresh started10, finished15 retains observation10 and shows age5; advancing
  to20 gives age10, not an age reset at completion.
- Labels, keyboard range controls and Enter-compatible buttons, live explanations.
  Historical response includes its response time so it is not mistaken for the
  current cache value. Native worksheet link is present.

Final production build passed all 13 site-check rules; all 21 collection model tests passed. Git diff whitespace check passed. Publication follows these checks.
