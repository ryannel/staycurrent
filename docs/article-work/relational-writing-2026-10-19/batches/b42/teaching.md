# a35 — focused teaching repair recheck

Reviewed 20 October 2026 against the b42 manifest and frozen `http://127.0.0.1:4438/review/relational-next/security/` preview.

**Pass. Required b40 finding T1 is resolved. No required teaching findings remain.**

I read all twelve rendered admission states (three choices × four steps) in a new independent Chrome tab using documented CUA APIs. The successful path now says the listener was reached, then reporter was authenticated, then distinguishes the permitted view from the forbidden raw-table query. The wrong-password path says no reporter session was established and neither SQL request can run; its final narration explicitly says neither query was sent. The blocked-route path says authentication was never attempted, no reporter session exists and neither query was sent. Each narrative agrees with its displayed panels.

At both paused 3/4 and paused 4/4, I switched the choice through allowed → wrong password → forbidden route → wrong password → allowed. Every change kept the same step and paused Play state, immediately replaced the narration with the corresponding result and left no stale successful-session or SQL claim on a rejected path.

This was a narrow repair recheck. The orchestrator's byte-exact change proof bounds the repair to the admission explanation assignment. Carry forward the b40 full-article, parent/scope, reference-reading, all-58-state, light/dark phone, keyboard endpoint, control/replay and reading-time findings for unchanged work; also retain the separate runtime and source passes. The b40 optional suggestions remain optional and are not reopening acceptance.

No article/component source was inspected or edited during this recheck. No build, Git, native run or download action was performed. I left theme and viewport unchanged and closed my review tab. Preview 4438 is released.
