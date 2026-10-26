# Article 6 — Cache failures and graceful degradation

Audience has read cache-aside, identity, freshness, invalidation and stampedes.
Teaching objective: design a bounded failure path that preserves useful source
capacity, including the awkward period after Redis becomes reachable again.
Work alone; this is a sole-agent design and review.

## Causal sequence

1. Losing reuse changes source demand. A 1000/s homogeneous workload with 95% hits
   needs50loads/s; at0% it needs1000/s. A source budget of100/s cannot absorb that.
   Interactive one-second flow model: warm, unavailable, cold and warming phases;
   compare unlimited queue with bounded admission. Show conserved requests, old
   backlog after recovery, and controlled refusals rather than imply all survive.
   Fixed service budget is deliberately optimistic, not a real overload curve.
2. Deadline waterfall: fixed200ms request, adjustable cache wait, optional retry
   and backoff, then80ms source plus10ms response. Shared deadline prevents a fresh
   full budget at every stage. A response timeout does not prove cancellation.
3. Retry expansion: two nested layers,1–3attempts each; visible branching and leaf
   operations. Worst case all attempts fail, no early successes/cancellation;
   distinguish attempts from retries. Jitter changes timing, not leaf count.
4. Circuit breaker with five-call bursts: closed permits allfive concurrently,
   failure opens after completion; open bypasses; after cooldown half-open admits
   one probe, even while another burst arrives. A successful miss proves access,
   closes the breaker, but still needs source admission. Source budget two loads
   per demonstration batch stays independent. Threshold/timing are illustrative.

## Prose decisions

Treat GET nil, connection error and timeout as different outcomes. Returning a
cached absence after a failed source lookup is forbidden. Fill failure can be
optional while failed invalidation has correctness consequences (article4).
Bound concurrency AND queues; release permits when operation actually stops,
not merely caller timeout. Per-process limits sum over autoscaling; do not put
sole fallback admission enforcement in the unavailable Redis instance. Priority,
preapproved staleness and cheap degradation are product decisions; stale data in
unreachable Redis is not a usable fallback. Avoid retries on optional cache read
when a bounded fallback is more useful. Fit all work within remaining deadline.
Recovery: connectivity, cache warmth and source spare capacity are three signals.

## Primary sources read 26 October 2026

- https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/
  Timeouts, uncertain side effects, retries at layers, backoff/jitter. No copied
  numeric example; our independent two-layer model uses attempts precisely.
- https://sre.google/sre-book/handling-overload/
  Variable cost of queries, degradation and resource-based limits.
- https://sre.google/sre-book/addressing-cascading-failures/
  Queue feedback, useful-work loss, deadline propagation and tested degradation.
- https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker
  Closed/open/half-open state and limited probes. Not a Redis built-in feature.
- https://redis.io/docs/latest/develop/clients/nodejs/produsage/
  Connection vs command timeout, offline queue; API snippets are version-sensitive.
  No untested node-redis API snippet will be included here; clients article follows.
- https://redis.io/docs/latest/commands/client-pause/
  ALL pauses pending processing; resumes queued commands after timeout. Lab only.

## Native exercise and evidence

Disposable Redis8.2.2 with no ports/network/persistence. Python3 standard library
orchestrates redis-cli. Assert hit, nil and connection refusal are distinct.
Pause command processing and let caller waiting deadline expire without cancelling
its child; observe a later successful result. Repeat with SET to demonstrate that
abandoning a wait does not revoke work. Do not call subprocess timeout a native
Redis command timeout or use Docker timings as performance guidance. Always reap
children and remove container. This is fault semantics, not a load benchmark.

## Required gate

Model invariants and native assertions; connected prose; genuine controls that
expose causal differences; desktop light/dark and phone screenshots, keyboard and
console; production build; manifest flag only at completion; publish and livecheck.
