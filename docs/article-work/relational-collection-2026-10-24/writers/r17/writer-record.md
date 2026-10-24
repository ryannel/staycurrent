# r17 author record

Third complete article in the fresh r14/r16/r17 assignment, written on 24 October 2026 after developing its two prerequisites. Full fixed-reference calibration applied to this complete assignment: 19 exact bounded text parts delivered separately with END markers, all 34 finished drawings inspected with their explanations, root acknowledgement before design. Current supplied writing, figures and continuity skills applied. No old article source or feedback inspected.

## Teaching and author reread

The article establishes the boundary an outbox closes before introducing worker ownership. Figure 1 encloses stock, order/lines and event in one commit and places the receiver outside it. The claim develops from row locks into a committed lease; the stale-worker chronology then gives a reason for receiver deduplication. Only after those meanings are established does fencing distinguish obsolete ownership from repeated intention. Two static figures serve these comparisons; there is no interactive model or article-owned control to exercise. Reread the complete article, SQL, fields table, numbered failure schedule and source descriptions against the references. Clarified how to re-establish a returned claim token after a missing claim-commit reply, corrected the boundary arrow for stacked phone layout, and made the concrete inbox store/compare payload under an explicit Read Committed protocol. A same-identity changed-payload replay is refused rather than silently skipped.

## Continuity

Order 103 remains Mina's pending order, two lines, total 29.00, P3 10/P7 0 after commit. order-103-created is an accepted illustrative event identity, not an observed delivery. purchase-mina-103 stays the logical purchase key; the event and purpose-scoped receiver identity order-103-created:confirmation are distinct. Tokens 1 and 2 order claims of this event only, not every event against a resource. Receiver acceptance is explicitly different from end-user email receipt. No payment/provider result is introduced into the core history. Article-owned outbox fields and schemas were accepted by root. The native boundary fixture has only an order identity and outbox; it explicitly does not re-enact the full stock purchase.

## Native verification

`evidence/native.json` records the owned PostgreSQL 18.6 Homebrew run. `run-outbox.py` is the exact standard-library verifier. It inherits the owned psql-session harness authored for r14, adapted to its own unique temporary prefix, socket and port. It clears PG environment settings, verifies data_directory on every connection, owns every process and removes data/socket after shutdown in finally. It uses a separate receiver database on the same server, an honest transaction boundary without pretending there is an independent machine/provider.

Checks: order committed before event leaves1/0; combined transaction client loss leaves0/0; combined commit leaves1/1. Unguarded workers both select the same event. Under row lock, the second skips it; an active committed lease excludes it. A matching unexpired token renews; expiry is injected by moving the database deadline into the past, after which renewal fails. Recovery obtains token2. Stable receiver identity gives one keyed effect for two deliveries; an unprotected log gets two. Without the completion token predicate an old worker could mark token2 complete (counterexample rolled back); guarded token1 completion affects0 and token2 affects1. Receiver fence accepts2 and refuses1 for the same event. Combined inbox receipt+effect rollback leaves0/0 and committed replay leaves1/1; stored inbox payload accepts the matching replay and refuses changed input; separately committed receipt leaves1/0 when its effect is omitted. Final payload-aware inbox run passed in about0.84s process wall time; no performance inference. No actual provider call, network failure, real five-minute passage, independent server crash or broker execution claimed.

## Author rendered checks

Root first integrated preview4404 reported one broken neighbour URL; corrected failover-and-fencing/ to the supplied failover/ destination. At measured1280×720 and375×812 inspected both static figures and the fields table in light/dark, with document overflow0 and both figures343px on phone. All displayed text remains legible at native phone size; phone flow arrow points down. Chronology remains a semantic ordered list and static text provides its accessible explanation. Source disclosure expanded in final confirmation. Screenshots saved in evidence. Original measured1280×720 viewport and System theme restored (resolveddark).

Final exact-source root snapshot and bounded HTTP byte match remain to be recorded. Browser save behaviour is unverified: root prohibited hanging download-event/path APIs; none used. No article control states exist beyond ordinary links and shared page controls.

## Authority and limits

Root owns all builds, routes and immutable previews. No writer build, delegation, independent review, commit, push or publication. Static figures were authored for their explanations; no imported old illustration or old article reused. The complete three-article continuity route is guard/snapshot/order → request identity/uncertain outcome → committed intention/claim/receiver authority. No changes to shared business facts or other source namespaces.

## Late process exposure

After all three article sources and ordinary author finishing were complete, the writer mistakenly called the agent inventory while awaiting root's final snapshot. It returned names and unrelated historical completion summaries. No links were followed, no old article/source/review was read, and no article changes followed or were derived from that exposure. Root was informed. This records the operational boundary accurately rather than claiming no inventory was ever seen.

First late-exposure record timestamp: 2026-10-24T01:53:39.503152+00:00 UTC. The inventory call immediately preceded that note; no exact call-time clock was sampled. `evidence/late-inventory-exposure.json` preserves that time bound and all already-finished source hashes, which still match.

## Final first-return confirmation

Immutable4406 contains the exact final sources. Root reports zero structural issues at01:54:29UTC. Final rendered download URLs were enumerated from the three owned article pages: r14 has1, r16 has2 and r17 has1 (four total). Each bounded HTTP response is byte-identical to its supplied file; hashes and timestamps are in download-check-final.json. The final inbox passage and corrected failover link were confirmed on4406; unchanged14/16 final geometry/control checks from4404 still apply. All pending author checks above are now closed, except actual browser save behaviour, which remains explicitly unverified. Original actual1280×720 and System preference restored. source-hashes.json still matches, with no article edits after the late inventory exposure. Returned for root first-return freezing and independent review.
