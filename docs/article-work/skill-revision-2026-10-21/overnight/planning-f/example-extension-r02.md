# Proposed example extension: W-mix

Status: delta proposal for central settlement under F-02 / F-PLAN-01. Add only this independent fixture to [the canonical example](/private/tmp/staycurrent-skills-night-f/docs/coverage/latency-flow-example.md). No canonical file has been edited. All values are invented arithmetic, with no service, instrument or query execution claimed.

## W-mix: the same class timings, a different mixture

Keep the workshop booking-status read, tenant `t4`, customer 42/Ada, booking `b17` and session `s7`. Define two request classes by what is requested before timing them: **status only** and **status with session details**. Both are read variants of the same booking-status operation. They do not change a booking, consume seats or create orders. These are not classes selected from fast or slow observations, worker groups, new metric labels or explanations of an engine cause.

Use two adjacent five-minute windows on an independent relative fixture clock: **W-mix-before** `[0, 300,000)` ms and **W-mix-after** `[300,000, 600,000)` ms. Each contains 1,000 caller operations, each with exactly one attempt, all starting and completing successfully inside its own window. No retries, errors, timeouts, opening/closing in-flight work or missing observations are stipulated. Caller start to complete reply is timed on one elapsed-time clock in milliseconds in both windows. No arrival order or queue behaviour is specified.

Identities are `mix-before-op0001`–`mix-before-op1000` and `mix-after-op0001`–`mix-after-op1000`. In the before window, identities 0001–0990 request status only and 0991–1000 request status with session details. In the after window, identities 0001–0900 request status only and 0901–1000 request status with session details. They are not W0's `q` identities or additional W0 observations.

The named **W-mix before-and-after class table** must show counts and within-class results beside the pooled result. Each status-only observation is exactly 40 ms in both windows; each status-with-session-details observation is exactly 400 ms in both windows. These stipulated values are not inferred from the class name.

| Request class | Every caller duration, both windows | Before count | Before exact p99 | After count | After exact p99 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Status only | 40 ms | 990 | 40 ms | 900 | 40 ms |
| Status with session details | 400 ms | 10 | 400 ms | 100 | 400 ms |
| Pooled booking-status reads | Both class values above | 1,000 | 40 ms | 1,000 | 400 ms |

Use the root's declared exact nearest-rank rule throughout. Pooled rank is `ceil(0.99 × 1,000) = 990` in both windows. Before, ordered positions 1–990 are 40 ms and 991–1,000 are 400 ms, so p99 is 40 ms. After, positions 1–900 are 40 ms and 901–1,000 are 400 ms, so p99 is 400 ms. The second class's share changes from `10/1,000 = 1%` to `100/1,000 = 10%`; each window has the same total operation count and five-minute window length. Within-class p99s remain 40 and 400 ms because all of each class's values are unchanged. The before window still contains ten 400 ms reads: p99 does not mean none took longer.

The worked judgement asks whether either read variant became slower. In this finite invented fixture neither did: only the mixture changed, and more requests now receive the slower variant. A pooled rise alone cannot establish a within-class slowdown. It still describes a changed overall request experience; do not dismiss that change or treat a request-weighted result as every user's experience. The next dashboard view to inspect is **duration distributions, counts and errors separated by these predefined request classes over matched windows**. In real evidence, use that view to check whether class timings also changed before investigating their causes; matching class p99s alone would not establish unchanged full distributions. The stipulated fixed values here support no future guarantee or claim that the changed mix cannot affect a real service's timings.

## Placement and continuity

The root owns this worked table and decision in “Compare the same work over the same interval”, after the distinct W0 worker-pooling demonstration and before histogram retention. Explain request class before the table or any selector uses it; use the same class names in prose, caption and any later controls. No new term from the child, such as cohort or terminal-event policy, is needed here. The child only reminds and links this root comparison in its final evidence worksheet.

W0, worker A/B, W-retry, W-timeout, W-edge, W-stages, W-arrivals, the sampling illustration and the metric/audit worksheet remain unchanged. No histogram, query, new instrumentation label, third article or executable shared data module is proposed. A later commissioned implementation should retain these fixture values in the same centrally owned shared data module as the other examples.
