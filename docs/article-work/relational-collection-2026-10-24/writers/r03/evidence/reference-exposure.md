# Reference exposure

Completed before article/figure design. Actual completion checkpoint: 2026-10-24T00:04:30Z. The bounded reads ran in this writer turn; no invented per-part timings are claimed.

Text fetched one part per separate tool result, each capped at 6000 output tokens, with every END marker delivered:

- Sequence diagrams parts 1–6. SHA256 722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c.
- Indexes parts 1–7. SHA256 d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1.
- Storage and durability parts 1–6. SHA256 2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07.

Rendered study used three owned temporary IAB tabs opened directly at http://127.0.0.1:4350/review/examples/{sequences,indexes,storage}/. No inventory, other draft, viewport or theme changes. Tabs closed after study.

Sequence drawings 1–13: booking arrows; activation and waiting; synchronous email; outbox; crowded/focused diagrams; reorderable poll and 201; alt/opt; loop; parallel requests; TLS round trips; fork/stair; chatty calls; sign-in trust boxes. Read the lead-in, drawing/caption and subsequent explanation for each. Exercised step controls, including final states. Long sequence drawings required multiple screenshots across their height; screenshots remain in tool results rather than saved files.

Index drawings 1–11: sequential scan; building entries; B-tree descent; linked range; clustered lookup; selectivity; composite order; covering and visibility; write cost; splits; deletion/vacuum/reindex. Inspected the complete rendered shapes and counters in the accompanying explanation, including end steps.

Storage drawings 1–10: page fill; buffer reads/eviction; old row versions; hypothetical lost commit without a log; WAL; dirty-page writers; group commit; crash recovery; flush layers; asynchronous commit. Inspected shapes, controls and explanatory text, stepping through them. Some screenshots captured autoplay intermediate states; observations describe conceptual behaviour and no native execution.

Supplied finished-reading r00/r01/r02 read completely as prerequisite context. The supplied current write, figures, continuity skills and figure implementation/render/native-verification references were read. Repository AGENTS, README and current site direction supplied context only. No old article, old feedback, history, unrelated draft or original repository inspected.
