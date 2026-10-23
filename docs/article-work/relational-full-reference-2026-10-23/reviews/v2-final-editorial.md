# Editorial review · final complete article · Relational databases · v2 / r07

Inputs read: the final-editorial-v2 assignment; AGENTS.md; staycurrent-review and its editorial perspective only; review-audience.md; frozen-v2.json for version identification; the complete current rendered article at <http://127.0.0.1:4362/review/relational-full-reference/>, including both expanded purchase histories, captions, control labels, tables, SQL, sources and surrounding site text. Read all three unabridged original reference exports in reference-reading-clean/ in bounded sections and inspected all 13 Sequence diagrams, 11 Indexes and 10 Storage and durability figures on the original rendered reference routes at port 4350. Reference drawings were inspected in their rendered default states and selected completed states, rather than as a complete control-state test matrix.

Withheld inputs were not read: plans, prior versions or verdicts, findings, decisions, writer/repair notes, evidence or experiment results, confirmation/history records, and other-agent status. No article source was consulted. No edits, builds, commits, publication or additional agents were performed.

Highest severity: low

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The title names the subject; section headings name the reader’s question or the distinction developed below them. The contents list accurately previews the route. |
| 2. Plain sentences | pass | Prose is connected and precise. The shop supplies concrete subjects and consequences for the explanations of row meaning, conflicting purchases, uncertain replies and recovery. I found no passage requiring the reader to decode decorative or compressed language. |
| 3. Terms | finding | Tables, rows, columns, keys, schema, constraints, SQL, transactions, atomicity, isolation, snapshots, locks, plans, indexes, pages, durability, WAL, outboxes, replicas, partitioning and recovery objectives receive usable local explanations. One incidental retry term lacks a local gloss: editorial-3. |
| 4. Openings | pass | The opening establishes what a database contributes and why its boundaries matter. Each section provides its immediate problem before explaining its mechanism; the explicit rewind before the purchase prevents confusion with the earlier accepted-order tables. |
| 5. Reader-facing text only | pass | The article body contains explanation and relevant provenance, with no repair narrative or author instructions. The preview’s clearly separated “SKILL EXPERIMENT · DRAFT FOR REVIEW” header identifies the review surface; I have not treated that intentional preview label as publication prose. |
| 6. Captions and labels | pass | Figure 1 identifies row and column readings; Figure 2 names the column matched at each step; Figure 3 names its protocol choice and supplies both complete histories; Figure 4 identifies its conceptual ordering and limits. Table captions say what their rows compare. Controls and explanatory text give a clear reading task. |
| 7. One piece | pass | The running purchase and its identifiers remain stable. Necessary qualifications accompany the reasoning they change: atomicity versus isolation, index work versus lock waits, local durability versus storage loss, and outbox intent versus external delivery. The shift to the history query for execution work is explicit, and the commit section clearly resumes the purchase. I found no interrupting repair passage or stacked objection that damages the argument. |

## Whole-article judgement

**Coherence:** pass. The opening promises an explanation of shared facts, queries, competing purchases, commit and failure, then delivers that progression. The later discussion of deployment arrangements draws on the distinctions already established rather than introducing an unrelated comparison. The repeated deeper-reading links have a recognisable purpose: they identify where the current example continues.

**Prerequisite order:** pass with the low terminology note below. Row and column meaning precede matching identifiers; matching precedes SQL joins; all-or-nothing changes precede the concurrency counterexample; page caching precedes WAL and recovery. Copies precede failover, and workload and failure boundaries precede the shortlist of arrangements. The article does not require a reader to know SQL in advance to understand its worked query or conditional update.

**Examples:** pass. Mina, order 103, P7 and P3 do explanatory work throughout. The four-row history makes the distinction between an order and a result row concrete; the two buyers show why a non-negative stock constraint is insufficient; the lost commit reply motivates a stable request identity. The stock figures before and after the explicit rewind agree in the reader’s account. The modelling discussion also gives a useful counterexample to indiscriminate deduplication through the offered and agreed prices.

**Teaching:** pass. The article asks readers to look at specific values, states or consequences and explains what follows. The table and relationship figures establish the basic visual vocabulary before the animated race. Later mechanisms receive less space than those foundations, but the prose gives enough causal explanation to understand the practical distinction being introduced. It does not ask the introduction to serve as a complete operational procedure.

**Promised practical judgement:** pass. A newcomer leaves with usable questions: what a result row represents, which protocol protects a concurrent decision, whether a slow request is doing work or waiting, what the configured commit promises, how a retry preserves purchase identity, how fresh a replica read may be, and which failure calls for restart, failover or restore. The final shortlist supplies starting candidates and evidence that could overturn them, then asks for a representative trial of outcomes as well as performance. It earns the introduction’s promise while directing implementation detail to deeper articles.

No critical or medium editorial defect was found in this fresh complete reading. No new substantive technical or visual concern arose that needed referral to a specialist.

## Findings

### editorial-3 · low · “A committed order and a successful request are different”, paragraph beginning “A confirmed transaction abort is a different case”

Problem: “A retry after a deadlock or serialisation failure must rerun the reads as well as the writes” introduces **serialisation failure** without explaining what that database error means. The earlier section explains a deadlock in ordinary words through its deeper-reading link, but gives no corresponding explanation of this term.

Effect: A newcomer can follow the paragraph’s instruction to retry the whole decision, so the argument does not stall. They nevertheless have to treat one of its named retry triggers as an unexplained label or leave the article to identify it.

Suggestion: Give the term a brief local gloss when naming it; keep the detailed isolation and retry treatment in the linked article.

Evidence: The complete current rendered text uses “serialisation failure” only at this location. The earlier purchase section mentions “stronger isolation and retries” without identifying this failure category. The current paragraph makes the action clear but does not explain the term itself.

## Limits

- This is a blind editorial and whole-article teaching judgement, not a technical re-verification. I did not consult primary-source links, run SQL, inspect source, certify the claimed PostgreSQL reproductions, or read specialist receipts.
- All four current figures were inspected as rendered, and every reader-facing history supplied by the animated race was read through its disclosure. I did not replay the current animation or certify its control mechanics, every visual state, accessibility or responsive/theme behaviour; those require the corresponding specialist coverage.
- The complete reference texts and all rendered reference drawings were used for calibration. Their underlying mechanics and every alternate state were not audited.
- I did not open the linked deeper articles. The judgement concerns whether this introduction stands on its own and signposts further work; it does not establish the availability or quality of the destination articles.
- No viewport, theme or shared browser preference was changed. Only dedicated review tabs were used.
