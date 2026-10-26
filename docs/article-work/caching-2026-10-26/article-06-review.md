# Article 6 — Cache failures and graceful degradation

Completed 26 October 2026. Sole-agent authorship and review, not independent review.

## Technical grounding

Six primary sources listed in article-06-plan.md were read. Distinct outcome types,
failed-fill vs failed-invalidation consequences, admission scope, cancellation,
retries and breaker recovery connect back to earlier articles. No untested client
API example. Connection and command timeout configuration deferred to article7.

Native failures.py executed against official Redis8.2.2. It creates a disposable
network-isolated container with no host ports/persistence and removes it in finally.
Evidence/failures.txt records: hit12, nil for absent, refused connection with nonzero
exit, delayedGET returning12 after caller timeout, delayedSET succeeding and later
GET confirming15. Python communicate timeout deliberately leaves the command alive;
not presented as a Redis-native timeout or cancellation API. CLIENT PAUSE is lab-only.
The INFO version read uses raw output because redis-cli special-cases INFO output.
No source throughput or source cancellation was measured.

Six invariant tests: accounting conservation across times and policies; bounded
source completion; recovery retains backlog; shared deadline and contiguous stages;
nested attempt count; open-circuit bypass and one outstanding half-open probe;
successful miss closes circuit without increasing source admission allowance.
All27 collection model tests passed before final publication changes.

## Teaching review

Opening is a falsifiable capacity experiment, not a list of resilience patterns.
Like Load Balancing, the same arrivals can be replayed with another policy and the
queue becomes visible. The accounting states exactly who got answers, who waits
and who was refused. Unlimited queues intentionally omit abandonment and slowdown;
fixed equal-cost capacity and externally supplied warming schedule are labelled.

Following the references' progression from one mechanism to the next, the deadline
strip turns time into a finite shared budget; retry branches show multiplied work;
breaker state highlights distinguish permission to call Redis from source admission.
The native worksheet adds observed semantics without pretending to benchmark them.
About ten minutes of connected prose develops operational and product consequences.

The circuit's batch allowance is explicitly a teaching device, not a rate limiter.
New bursts replace displayed callers but preserve an outstanding probe and report
its eventual result. Concurrency/fleet scope is handled in the prose and first
capacity figure. No universal timeout/threshold recommendations. Consequential
staleness and correctness decisions remain explicit instead of hidden in fallback.

## Browser verification

Desktop light/dark and390×844 light screenshots inspected for allfour figures.
Narrow layout width390 matched viewport390, with readable controls; circuit callers
wrap to3columns, counts wrap and timeline labels fit. Dark-theme regions/text and
focus outlines readable. No console errors in desktop or phone preview.

- Play advanced the one-second flow and stopped at20s: 11,500hits+1,900source
  answers+6,600waiting =20,000arrivals. Bounded replay:11,500+1,500+7,000refused.
- Preserved-data recovery reduced finalbacklog to3,850, without erasing it.
- Keyboard End/time and Home/timeout work. Two60ms cache waits plus20msbackoff
  leave60ms, correctly refusing90ms fallback.10ms retry setting finishes at130ms.
- Retry controls changed3x3 to1x3 and2x3 with matching visible source leaves.
- Failed burst sent5attempts then opened. Another burst bypassed. After cooldown,
  oneprobe raised totalto6. Furtherburst did not createanotherprobe. Successful
  miss closed the circuit and recorded refused fallback for the lateprobe.
- Reset restores default failing Redis outcome; native buttons/selects/checkboxes,
  range keyboard access, polite explanations, reduced-motion/manual paths.
- Browser viewport override reset. The override must be applied in the same tool
  call as screenshot/evaluation when doing further responsive checks.

Final production build passed all13site-check rules after manifest and previous-article link changes. Whitespace check passed. Reset was rechecked: it restores the failing outcome, and the next burst opens the circuit.
