# r14 author record

Written as the first piece in the fresh r14/r16/r17 assignment, 24 October 2026. Complete text calibration before design: sequences1–6, indexes1–7, storage1–6, separately delivered with END markers. Rendered all13+11+10 reference drawings at4350 in an owned background tab; surrounding explanations read; viewport/theme unchanged; tab closed. Root acknowledged19/19 and34 drawings before source. Applied current write, figures and continuity skills supplied in this workspace. No old article or feedback inspected.

## Teaching and author reread

The article develops one distinction: a turn at an authority is useful only with the right state to decide from. It starts at a familiar row, exposes the empty-child-lock failure, then develops S501's guard with fresh Read Committed counts, the lock-only Repeatable Read failure, a changed-guard retry and Serializable. The drawing keeps guard ownership, committed bookings and Tariq's snapshot separate. Contention grows out of that authority; the two-product cycle makes deadlock different from waiting. Reread complete prose, code, captions, all15 model states and later uses against the references. Changed an early “Counts0” panel to “Ready to count” so it no longer runs ahead of the explanation. Defined “guard” at first use. Added phone-direction arrows to the static cycle. No fixed heading/template/figure recipe supplied by root.

## Continuity

S501 starts empty with capacity1. B201 is Mina/customer1; B202 is Tariq/customer2. The protected histories admit only B201. The two-booking histories are explicitly unsafe alternatives. sessions/bookings are article-owned schemas accepted by root; guard_epoch is a non-business conflict marker and does not change capacity. Product locks P3/P7 appear in a separate schedule without claiming any new shop order or stock history. No instructor/customer roles are confused. Guard, snapshot and complete retry precede their use in r16/r17. SQL fragments show application decisions explicitly and are not presented as complete checkout programs.

## Native evidence

`evidence/native.json` records PostgreSQL18.6 Homebrew on aarch64-apple-darwin25.6.0. Download `run-locks.py` is the exact standard-library verifier. Its private cluster starts from explicit sessions/bookings and products schemas and rows. It clears inherited PG settings, starts initdb with an owned temporary data path and Unix socket, checks SHOW data_directory on every connection, uses observed blocking PIDs to coordinate waits and stops/removes its cluster in finally. First run passed (~1.1s process execution); after adding the consistent-order counterpoint the final run passed (~1.0s process execution). No latency is taught from those wall times. Native checks cover the counterexamples and protections, Serializable, chosen deadlock, consistent ordering and lock timeout. No other engine, real load, geographic or power-failure execution claimed.

## Rendered checks

Root first preview4400 returned six structural errors for figure h4 panel labels; changed them to styled p labels. At1280×720 and375×812 inspected both figures in light/dark, all3 protocol options, all5 states, Next/Back/Reset/Play/Pause and keyboard Enter. Back/Next endpoint aria-disabled verified; CUA declines clicking an endpoint. Text alternatives expanded. At375px document overflow0; figure widths343px, no overflow. Recorded screenshots and control states in evidence. Responsive cycle arrow direction corrected after that first preview. Computed foreground/secondary/accent colours recorded in contrast.json; text>=4.5:1 and graphics>=3:1. Actual original viewport1280×720 restored via reset; original System choice restored (resolved dark).

Initial rendered download href has no trailing slash on the immutable export. The first default-sandbox HTTP byte check was denied local socket access; no bytes were fetched in that attempt. Final source added an ordered-lock check afterwards, so final immutable byte equality is still to be checked after consolidated resync. Browser save/download behaviour is unverified by root's tool constraint; no event/path wait used.

## Delivery limits

Root owns build/route integration and structural checks. Final resync requested after ordinary finishing; no independent review, build, commit, push or publication by writer. source-hashes.json records final authored files at resync request. No broader example/tree changes proposed beyond accepted explanatory schemas.

## Late process exposure

After all three article sources and ordinary author finishing were complete, the writer mistakenly called the agent inventory while awaiting root's final snapshot. It returned names and unrelated historical completion summaries. No links were followed, no old article/source/review was read, and no article changes followed or were derived from that exposure. Root was informed. This records the operational boundary accurately rather than claiming no inventory was ever seen.

First late-exposure record timestamp: 2026-10-24T01:53:39.381990+00:00 UTC. The inventory call immediately preceded that note; no exact call-time clock was sampled. `evidence/late-inventory-exposure.json` preserves that time bound and all already-finished source hashes, which still match.

## Final first-return confirmation

Immutable4406 contains the exact final sources. Root reports zero structural issues at01:54:29UTC. Final rendered download URLs were enumerated from the three owned article pages: r14 has1, r16 has2 and r17 has1 (four total). Each bounded HTTP response is byte-identical to its supplied file; hashes and timestamps are in download-check-final.json. The final inbox passage and corrected failover link were confirmed on4406; unchanged14/16 final geometry/control checks from4404 still apply. All pending author checks above are now closed, except actual browser save behaviour, which remains explicitly unverified. Original actual1280×720 and System preference restored. source-hashes.json still matches, with no article edits after the late inventory exposure. Returned for root first-return freezing and independent review.
