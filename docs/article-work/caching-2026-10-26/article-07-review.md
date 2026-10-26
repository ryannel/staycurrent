# Article 7 — Redis clients, latency and pipelining

Completed 27 October 2026. Sole-agent authorship and review; not independent review.

## Evidence and version boundaries

Primary Redis pipelining, node-redis pipeline/transaction, connection management and
SLOWLOG documentation read. Installed redis/@redis/client6.3.0 source inspected,
especially commandsToWrite removing timeout/abort listeners, unsent rejection,
waiting-for-reply accounting and explicit pipeline Promise.all rejection. API
examples were executed with the actual pinned package, not copied from older docs.

Native lab: official Redis8.2.2 source compiled locally with Node24.16.0 client.
Runner uses a private Unix socket, no Redis TCP listener, persistence disabled,
temporary directory, explicit process shutdown and cleanup. Two readiness tests
use a controlled localhost TCP peer without handshake responses; it does not execute
Redis commands. The article distinguishes these from the real server experiments.

Evidence/clients.txt records ordered pipeline replies; error followed by successful
later SET; sent SET pending after120ms despite40ms command timer, later successful;
unsent timeout vs offline-disabled rejection before GET reaches test peer; eight
pending commands plus ninth rejected by queue cap. These are fault assertions, not
latency measurements. A two-command cap initially failed during handshake, so the
article warns that setup work also needs queue capacity. The zip matches all five
source files byte-for-byte and passes archive integrity check. Dependencies pinned
by package-lock; no node_modules or native binaries included.

Docker became unavailable after a disk-space failure. No destructive Docker reset
or unrelated cleanup was performed. Task output/history checkout copies were
reduced; official Redis was built instead. This change does not reduce native
execution fidelity. Current lab requires macOS/Linux, Node24 and Redis8.2.2 binary.

## Teaching review against references

Opening begins with six visible independent reads. A fixed time scale makes the
serial wait disappear when batching changes, while execution remains twelve ms.
Like the reference Load Balancing experiments, callers and server work remain
accounted for. Like Gears, one mechanism is changed at a time before introducing
its limits: first round trips, then bytes versus execution, then command lifecycle.

The response model deliberately separates ordered-stream waiting from shared
execution. Independent stream transmission budgets are labelled; separate
connections are not promised an actual network speedup. Lifecycle exposes the
observer's extra server knowledge, preserving uncertainty from a caller's error.
Prose connects each effect to concrete batching, isolation, limits and measurement.
About nine minutes of prose, with one small API example and a runnable lab.

Six model tests cover batch-size/RTT/count combinations, non-overlapping execution,
fixed work totals, response ordering versus execution, unsent expiry, queue timer
removal, work after an abandoned wait, late outcomes and indistinguishable errors
with different server state. All33collection tests passed in the final check.

## Browser review

Desktop dark and390×844 light screenshots inspected for allthree figures. Phone
width390 equals viewport width390. Controls and labels wrap; lifecycle stage boxes
wrap to2columns, result text remains readable. Pipeline axis aligned with track
start. No consoleerrors. Viewport reset after checks.

- Pipeline Play advanced the cursor/status and finished6replies at132ms. Batch6
  reset schedule; Nextreply at22ms produced1reply, finalreply32ms. Range End on RTT
  produced50ms/62msfinalreply and52msfirstreply, with unchanged12msexecution.
- Response: large100KB reply gives smallreply112ms on shared stream; separated
  gives13ms. Expensive100msexecution gives112ms even when separated. ArrowRight
  increased execution to110ms and smallreply122ms. Captions state assumptions.
- Expirequeue timer removesunsentcommand, serverunchanged; actionbuttons disable.
- Send/endwait/execute/reply gives latesuccess and valuewritten. Connectionloss
  beforeexecution showsunchanged; afterexecution showsvaluewritten, sameerror.
- Native range keyboard controls, selection and disabled-state controls checked;
  live explanations, reduced-motion/manual control path and hidden-page stop built.

Final production build passed all13site-check rules before manifest/link update;
final post-update build, whitespace and33model-test results checked for publication.
