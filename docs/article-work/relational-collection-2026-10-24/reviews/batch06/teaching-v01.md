# Teaching review · article mode · r15, r18, r19, r20, r21 · batch06-v01

Inputs read: [fixed manifest](v01/manifest.json), teaching restrictions and identity; frozen `context/briefs.json`; each bounded individual plan RL92, RL95, RL96, RL97 and RL98 in full, with child stubs and neighbour boundaries (and RL94 sibling plan). Commission and canonical example are byte-identical to those already read in batch05, confirmed by the two manifest hashes. Full rendered articles at http://127.0.0.1:4440/review/relational-collection/{storage,crash-recovery,backup-and-restore,replicas-and-read-routing,failover}/, with every explanatory disclosure and final Sources.

Highest severity: none

## Calibration


This coherent 25-piece assignment calibrated once against all three fixed references in full. The helper `scripts/read-writing-reference.py` delivered exactly 19 separate bounded text outputs: sequences 1–6, indexes 1–7, storage 1–6. Every individual call had a 5,000-token output budget and its END marker was read; none was clipped. Complete-text SHA256: sequences `722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c`; indexes `d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1`; storage `2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07`.

Separate rendered study at http://127.0.0.1:4350/review/examples/ covered all 34 drawings and their explanations: sequences figures 1–13, indexes 1–11, storage 1–10. Actual changing/completed states were inspected. A mispositioned tall screenshot crop was recovered with bounded crops; the long crowded sequence drawing's lower portion was read separately. No global viewport or theme changes. Root received the complete calibration report for public-output audit. The comparison standard is explanatory progression through concrete changing state, controlled variations and awkward cases, and practical judgement supported by the mechanism, with illustrative/observed boundaries explicit.

## r15 · Row versions, storage and cleanup

Entry: Transactions and index entries.

Whole article: The price/snapshot distinction leads naturally to physical layout, retained history, space reuse and maintenance judgement. It earns the distinction between a larger file and a cleanup problem.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Heap, snapshot, ctid, TOAST, vacuum, HOT and fillfactor are explained locally; the chosen isolation level is explicit. |
| 2. Order | pass | Visibility comes before cleanup; pages before addresses; reuse before rewrite; write costs before diagnosis. The retained-snapshot difficulty gets the most help. |
| 3. Examples | pass | One scratch P7 price change carries old/new readers and cleanup; anonymous space fixture is explicitly separate and explained. |
| 4. Showing | pass | Six-step version disclosure, physical address observation, engine comparison and measured delete/vacuum/rewrite table show state and consequences. |
| 5. Judgement | pass | Reader can distinguish live growth, retained versions and reusable gaps, decide whether a rewrite earns its lock/space cost, and investigate a retaining snapshot. |
| 6. Gradual exposure | pass | High-level storage explanation stands on its own; PostgreSQL page/process and vacuum-age mechanisms are handed to named owners. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial version. |

Findings: none.

## r18 · Write-ahead logs and crash recovery

Entry: Atomic transactions, row versions and pages.

Whole article: A coherent durability argument separates recoverability, data-page writes, client knowledge and the limits of a local restart. The last section turns mechanism into an outage/recovery decision.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Dirty pages, WAL, durable flush, checkpoint and LSN are introduced through their jobs; unfinished-transaction visibility follows the stated storage entry. |
| 2. Order | pass | Write-ahead ordering precedes crash cuts, flush contract, replay boundary and weaker acknowledgements; uncertainty is explained at the reply boundary. |
| 3. Examples | pass | The complete purchase 103 carries both multi-row recovery and uncertain reply, with an uncommitted scratch control. |
| 4. Showing | pass | Three conceptual cuts and complete outcome disclosure expose surviving evidence; durability table and observed complete-purchase acceptance make the differences inspectable. |
| 5. Judgement | pass | Reader can choose acknowledgement from loss consequence, distinguish asynchronous commit from disabled safeguards, and specify a meaningful recovery drill. |
| 6. Gradual exposure | pass | General ordering and checkpoint trade-off are answered before handing product settings and backup procedures to children. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial version. |

Findings: none.

## r19 · Backup, restore and reconciliation

Entry: Crash recovery, history and transaction boundaries.

Whole article: The error and later valid purchase supply an intelligible reason for each stage. Chain, target, fence and complete-operation reconciliation form one recovery argument rather than a list of tools.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | RPO/RTO, logical/physical backup, increment, PITR and fencing receive explanations before use in the procedure. |
| 2. Order | pass | Failure/objective → saved dependencies → verified target → closed source → reconciliation → whole-route drill. The fence race and complete invariant receive concrete help. |
| 3. Examples | pass | Bad deletion of 103 and valid Edda purchase 107 carry both target exclusion and once-only stock reconciliation; scenario time versus actual native target is explicit. |
| 4. Showing | pass | Chain table, stated before/after queries, six-state recovery disclosure and repeated identity outcomes show what recovery retains and loses. |
| 5. Judgement | pass | Reader can choose a restorable history and target, close accepted source work, reconcile full purchase/external authorities and judge whether a drill proves the required failure. |
| 6. Gradual exposure | pass | General recovery is answered here; executable PostgreSQL and CockroachDB target/dependency procedures are handed onward. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial version. |

Findings: none.

## r20 · Replicas, lag and read routing

Entry: Commit durability and application ownership; preceding crash-recovery understanding.

Whole article: The received/durable/replayed distinction earns the read-routing advice. The old snapshot counterexample prevents a progress token from being mistaken for a visibility guarantee.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Physical replication and three progress terms are defined; LSN understanding is supplied by the stated preceding crash-recovery entry, and lineage is restated. |
| 2. Order | pass | Progress before synchronous acknowledgement; read promises before barrier protocol; snapshot order before replay-load and retained-log costs. |
| 3. Examples | pass | Purchase 103 carries paused replay, fresh and retained snapshots, confirmation routing and stock-authority contrast. |
| 4. Showing | pass | Five progress states, acknowledgement/read-route tables and concrete paused/restarted observations show bytes versus visible rows; full alternative read. |
| 5. Judgement | pass | Reader can assign read promises, bound barrier waits and fallback, avoid unrelated-history comparisons and choose retention/report trade-offs. |
| 6. Gradual exposure | pass | Primary/standby answer comes first; native physical operation, promotion and distributed snapshots retain their neighbouring scopes. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial version. |

Findings: none.

## r21 · Failover and fencing

Entry: Replication progress and commit durability.

Whole article: Suspicion, exclusion, chosen history, reconciliation, traffic and restored redundancy follow causally. The stopped-candidate example supports the loss argument without pretending replay pause proves absence.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Failover/promotion, fence and timeline have local definitions; replication progress is appropriately drawn from the entry. |
| 2. Order | pass | Failure suspicion → enforcement → candidate history → missing purchase → acceptance/traffic → rejoin. The dangerous dual-writer state and isolated reconciliation get most help. |
| 3. Examples | pass | Existing-client scratch counterexample is separated from purchase 103 loss/reconciliation and fresh-base return; awkward unknown/in-flight outcomes are addressed. |
| 4. Showing | pass | Two-protocol drawing/disclosure and closed-source/candidate/accepted-result table expose both authority and full purchase state. |
| 5. Judgement | pass | Reader can distinguish routing from a fence, choose a candidate against loss policy, keep reconciliation isolated and return a former writer as a copy. |
| 6. Gradual exposure | pass | General transfer is complete before native commands, quorum placement and restore procedures are handed to their owners. |
| 7. Placement of additions | not applicable | No coordinator-named additions in this initial version. |

Findings: none.

## Limits

Fresh independent initial teaching perspective only, for the exact first-return versions named above. This is not corpus, final complete or any other perspective coverage. Source, mechanical/native receipts, writer notes, earlier reports/decisions and later versions were withheld. No builds, article edits, downloads or publication. Complete rendered text, all explanatory disclosures and final Sources outside the article were read. No claim of independent native execution or production verification. No global viewport/theme changes.
