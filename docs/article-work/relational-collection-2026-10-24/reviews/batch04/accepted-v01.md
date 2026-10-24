# Accepted problems · batch04-v01 → v02

All four initial independent perspectives cover the complete r14/r16/r17 first versions on4408. Practitioner established one critical defect with an independent owned PostgreSQL18.6 reproduction. Other substantive checks passed; no automatic whole-review repeat is commissioned.

## B04-P17 · critical · uncertain claim ownership

Origin practitioner-v01 r17 practitioner-1. Accept: the article's fresh locking lookup treats an unexpired matching returned claim_token as proof that an uncertain claim committed for this worker. The transactional increment can be rolled back and reused. A returned token1, disconnected before commit; the row rolled back to0; B committed another token1; A's stated lookup then matched B's active lease. Waiting and a fresh snapshot expose current state but do not identify A's discarded attempt. The same alias undermines token-only renewal/completion if A acts on that false ownership.

Pass: every path that authorises acting, renewing or completing distinguishes the worker's actual committed claim from another attempt after an abort. Resolve uncertainty honestly. Event/effect identity stays stable across claims; ordered generations used for fencing must retain their stated scope. A separately retained attempt identity, non-reusing allocation protocol, or a complete bounded contract that abandons an uncertain claim rather than asserting ownership may be appropriate. The repair writer chooses the smallest coherent correct protocol; no new field or wording is prescribed.

Verify both aborted-then-reclaimed and committed-but-reply-lost claim histories, including the exact false-match schedule, and affected renewal/completion/receiver reasoning. Record controlled fault injection as such, with private endpoint/ownership/cleanup and exact source/data/environment/verifier. Preserve the existing legitimate claim/expiry/worker recovery, atomic intention, deduplication, inbox and fencing distinctions. Do not broaden this into a general broker survey.

## Optional wording folded into this coherent repair

Editorial-v01 r16 editorial-1 and r17 editorial-1 identify “explanation-owned” as a production label without a reader-facing schema meaning. Accept as low polish and fix both local introductions while reading the two complete related pieces. State what the example's table means in ordinary language; do not imply a new access-control or transaction authority. No r14 change is needed. No new specific skill rules are authorised.

## Confirmation scope

Fresh practitioner on changed ownership/uncertainty protocol, native counterexamples, surrounding lease/renewal/completion and downstream receiver/fencing assumptions. Teaching every added/restructured passage/table/figure and its placement/surroundings/downstream uses. Visual all changed code/fields/media and affected layout/controls, with unchanged mechanics reused only where applicable. Focused editorial on the changed paragraphs and two wording repairs, widening if argument/order changes. Remaining complete independent practitioner/blind editorial checks stay required on exact58-piece corpus underD028. No accepted substantive defect can remain open.
