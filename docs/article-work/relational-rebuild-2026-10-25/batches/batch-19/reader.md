# Reader review — Transactions across partitions

**Version:** distributed-commit v01, fixed batch-19 manifest. The six current article/component hashes match `review-source.json`. Review preview: `http://127.0.0.1:4606/review/relational-rebuild/distributed-transactions/`.

**Finding:** no substantive reader, editorial or rendered-media problem found. The article fulfils its bounded promise for application engineers following the prerequisites.

## Reader judgement

The figure sequence teaches the main argument before the prose supplies its qualifications. Figure 1 preserves the two owners and concrete stock changes while showing both incomplete local-commit outcomes. Figure 2 separates working, durable preparation, the recorded outcome and each participant learning it; its refusal path returns the shop to the stated starting rows. Figure 3 makes the difficult recovery distinction visible: exchanging prepared states is not learning an outcome; recovering authority preserves COMMIT; an older reachable copy cannot disprove it. Figure 4 correctly expands the audit from tables to required rule work.

The prose earns those conclusions. “P must still be able to supply the mug” explains why preparing needs retained protection. The two histories compatible with “we both prepared” explain classic blocking rather than simply naming it. Reading A before the purchase and P afterwards gives a concrete limit to atomic commit. The final request-recovery and external-delivery paragraphs are proportionate handoffs to their existing owners.

The title and headings name the actual questions plainly. Terms enter with explanations and the argument stays with purchase 103. Calibrated against the fixed references: Sequence diagrams’ lifelines/messages and waiting explanation, Indexes’ entries-to-row-locations passage and drawing, and Storage and durability’s crash-recovery passage and three-moment figure. This article likewise lets the important state change carry the explanation, then develops the practical implication. Its narrower scope supports its shorter treatment. It could sit beside those references without a prose or teaching rewrite.

After saving `initial-notes.md`, I checked the intended understanding, plan, neighbouring ownership and example facts. The delivered scope covers preparation, recording-before-notification, blocking, replicated recovery, visibility/cleanup, complete participant scope, dependent waits and caller uncertainty. Native CockroachDB mechanics, common snapshots, full retry protocol and external effects stay with their owners. No continuity change is needed.

## Rendered coverage and limits

Owned IAB tabs; actual widths confirmed at 1280×720 and 375×812. Inspected all four figures, current light/dark examples, commit and refusal paths, all three recovery cases, both expanded text alternatives, play/pause/reset and stepping. Keyboard focus remained on Back at the first state and Next at the final state. At phone width the message walk is tall, but labels remain readable, current records/explanation stay together near controls, and the page has no horizontal overflow. Recovery cards and Figure 4’s rule boundary remain understandable. No new visual repair is warranted.

Retained the v01 contrast receipt (body/secondary/owner-label text meets 4.5:1) and finite-model receipt after matching source hashes; these are supporting mechanical evidence. I did not repeat a full timing, contrast or viewport matrix. Playback was observed to advance and pause; exact dwell timing was not independently measured in the background browser. No native distributed database execution or liveness claim was tested. Primary-source spot checks: PostgreSQL 18’s [PREPARE TRANSACTION](https://www.postgresql.org/docs/18/sql-prepare-transaction.html) for durable prepared state/retained locks, and Gray–Lamport’s [Consensus on Transaction Commit](https://lamport.azurewebsites.net/video/consensus-on-transaction-commit.pdf) for the all-participant and classic blocking account. The separately assigned practitioner review owns the broader technical audit.

The initial accessibility inventory incidentally exposed body text; intentional reading followed figure labels/captions/controls, then body. Blind notes were saved before plans, facts, author evidence or verdicts. No previous manuscripts/reviews or author quality verdicts were read. Main restored to System/1280×720, article players reset (zero Pause buttons), owned tabs closed, viewport override reset. No article edits or publication.
