# b09 — independent practitioner repair recheck

Reviewed 20 October 2026 using `staycurrent-review`, practitioner perspective.
This is the assigned source-semantic and hash recheck of the two presentation
repairs. Retain the full b08 correctness, native execution, working-model and
family-boundary assessments.

| ID | Practitioner verdict | Required repairs | Optional advice |
| --- | --- | --- | --- |
| a10 | Pass, narrow recheck | None | None new |
| a11 | Pass, narrow recheck | None | None new |

## a10 — Expressing rules with constraints

**Pass.** Playback now counts the rendered `.board.innerText` and current
narration, using 180 words per minute plus three seconds and a six-second minimum.
The board includes the current cards, visible interval comparison, gates and
result. Its existence and rendering precede scheduling. Reading this text changes
the timeout only; it does not change frame calculation, state transitions,
parameters, constraint semantics, displayed outcomes or evidence claims.

Reversing precisely this text-count and timeout edit reproduces the b08 component
hash. The model and all SQL files retain their accepted b08 hashes. The article
snapshot is byte-identical to b08 and matches its rendered source. Retain the b08
native matrix, failed-COMMIT assertion, temporal-key checks and 88-state assessment;
no SQL or model rerun is warranted by this change. Actual playback acceptance
remains with the teaching perspective.

## a11 — Normalisation and deliberate redundancy

**Pass.** The only component change is explicit `margin: 0` on `.fact-box` sections.
It changes layout spacing without modifying fact ownership, rows, comparisons,
subtotal values, reconstruction, enforcement, playback logic or model boundaries.
Removing that declaration reproduces the accepted b08 component hash.

The model, 80-state verifier and both SQL files retain their accepted b08 hashes.
The article snapshot is byte-identical to b08 and matches its rendered source.
Retain the full b08 native reconstruction, local-enforcement counterexample,
empty-set, subtotal-drift and refresh checks. No new practitioner finding or
technical rerun is needed.

## Scope and handoff

All 15 b09 manifest hashes match the files on disk. The two changed components
contain exactly the assigned repairs; every other listed file is unchanged from
b08. No other perspective's report was read. No article/component/evidence edits,
native database operations, build or commit were performed. No browser tab was
opened for this source-only recheck; preview 4437 is released. Both articles pass
the practitioner gate.
