# Teaching review · article · a00 Relational databases and a03 Making concurrent changes correct · 14e4f89

Inputs read: the complete `src/articles/relational-trial-3/a00.astro` and `a03.astro`, their rendered pages at `http://127.0.0.1:4333/review/relational-trial-3/` and `/transactions/`, and their current Shop, Race and TransactionFigure components and model text, including every scripted step and option. All reviewed article and figure/model files matched `docs/article-work/relational-skill-trial-3/versions/r01-output.json`; HEAD was `14e4f89b5beb91a4fe19631f10ac1c3c5bc14040`. Read all three reference articles in full: `src/reference-articles/sequences.astro`, `indexes.astro` and `storage.astro`, with the rendered figures at all three `/review/examples/` routes. Read the root, relevant parent/sibling/child plans in `docs/coverage/relational-2026-10-19.yaml`, and the a00–a08, a18 and a19 entries in `docs/article-work/relational-writing-2026-10-19/registry.json`. Read the commission, repository instructions, `README.md`, `docs/site-direction.md`, the review skill and teaching perspective; both skill files matched `005ab6f`. Withheld: writing/repair notes, the shared example record, run/brief/result records, prior article versions, reports and decisions, and other review perspectives. The supplied manifest was used only to verify the assigned version.

Highest severity: none

Timing: start **2026-10-21 19:45:21 UTC**; end **2026-10-21 19:48:29 UTC**; duration **00:03:08 (188 seconds)**. End marks completion of the review judgement; report transcription follows it.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | a00 introduces tables, keys, constraints, SQL and transaction boundaries before relying on them; a03 identifies its parent knowledge and establishes its invariant, fixture and statement boundary before explaining competing histories. |
| 2. Order | pass | a00 follows one order from representation to acceptance, request completion and recovery; a03 progresses from atomicity through a failed decision, a guarded change, visibility, locks and multi-row dependencies to restart and testing. |
| 3. Examples | pass | Mina’s order and the shop’s classes carry the argument; multiplicative joins, duplicate clicks, the last-place race, stale counts and instructor write skew expose distinct awkward cases. |
| 4. Showing | pass | Connected rows, multiplied intermediate rows, committed-state tables and scripted schedules externalise the changing state; the two-read and lock-wait tables make the relevant snapshot boundary explicit. |
| 5. Judgement | pass | a00 leaves a defensible provisional shortlist and rejection tests; a03 leaves a rule-to-protection argument, all-writer obligations, abort boundaries and a deterministic testing method. |
| 6. Gradual exposure | pass | Both pieces give a usable answer before handing over depth; a03’s complete serialisable instructor repair supports the contrast with coordination while the complete counted-reservation protocol stays with the locking child. |
| 7. Placement of additions | pass | Each named group has a teaching purpose at its current point; the individual ownership and placement judgements follow. |

### Placement of named additions

| Piece and supplied group | Ownership and placement judgement |
| --- | --- |
| a00 · task-path opening | Belongs in the root, which owns navigation from a first working model to a practical question. It follows the definition and concrete shop setup, before the walkthrough asks for sustained reading. The task outcomes let an incident reader select a branch without first learning the whole collection. |
| a00 · transaction lead-in (`INSERT`, `VALUES`, `RETURNING`) and explicit-column listing | Belongs here to make the claimed complete order path readable. It explains the new syntax immediately before its first substantial use and identifies application-controlled refusal branches. SQL fluency remains with a02; this is the minimum local explanation needed to follow what the transaction records. |
| a00 · Figure 1 caption and phone scrolling cues | Belong with this figure. The caption resolves the deliberately partial display of orders and payments and explains the relationship labels. The scrolling cues sit beside the potentially wider relations, where the reader needs to discover additional columns. These explain how to read the evidence rather than add a separate database topic. |
| a00 · live-change handoff | Belongs at root level as an application/database compatibility boundary, with a06 owning the full procedure. It follows request completion naturally: adding delivery country exposes why an existing schema and its live writers may temporarily disagree. The example and short sequence supply the high-level answer before the link. |
| a00 · shortlist opening | Belongs in the root’s choice synthesis. The three-host shop, operating capacity and absent multi-region requirement supply the assumptions before the alternatives are judged, so PostgreSQL is a reasoned provisional candidate rather than an unexplained preference. |
| a00 · added source links | Belong in the sources, grouped with the claims they support. The INSERT/returned-value links support the complete transaction listing without interrupting its explanation. They supplement the on-page teaching rather than substitute for missing definitions. |
| a03 · Figure 1 fixed request headings and step text | Belong in the atomicity example. Persistent R10/R11 identities distinguish the successful first request from the rejected second request while the counters change. The committed-state label and pending-work lane text explain why an uncommitted decrement is absent from the table. |
| a03 · Repeatable Read paragraph transition | Belongs in this parent’s minimum visibility model, before locking and write skew. It introduces snapshot lifetime and own-write visibility only after the reader has seen why a command’s starting view matters. The following comparison gives the transition a concrete result. |
| a03 · two-read/snapshot comparison table and interpretation | Belong immediately after the two read contracts. Holding the initial query and competing booking constant makes the setting the single changed variable. The interpretation explicitly distinguishes the earlier view from the now-full database and from ownership of a place; detailed isolation histories remain with a19. |
| a03 · coordination-row paragraph introducing capacity 2, R7, Mina/R13 and Edda/R14 | Belongs here as a bounded counterexample to locking the rows returned by a query. It states the altered representation and capacity before the new identities are used. The class is a stable meeting point after the reservation set has been shown insufficient. Complete protocols remain with a18. |
| a03 · combined locking/count SQL | Belongs with this particular command-boundary warning: it makes the tempting combination concrete before showing why waiting does not refresh its count. The surrounding prose states its purpose and starting state; it is not presented as the complete booking protocol. |
| a03 · four-event lock-wait count-history table | Belongs directly after that command. It separates command start, waiting, lock acquisition and the next command, showing both committed reservations and the count the waiter actually receives. This supplies the hard part of the local argument instead of leaving the reader to animate it mentally. |
| a03 · concluding interpretation of that history | Belongs immediately after the table. It connects the observed stale count to the earlier distinction between a snapshot and protection, and explains the separate-command requirement before handing the full protocol to the locking article. |
| a03 · request-recovery handoff | Belongs at the boundary after known abort handling. The missing commit reply changes what the application knows, so the short stable-identity example is needed here. Pending work, payload matching, retained results and connection handling are then handed to their application owners. |

## Findings

None. No critical, medium or low teaching findings. Finding number `teaching-3` remains unused.

## Limits

This is a teaching review of the two assigned pieces, not a native-execution or source-verification audit. I read the complete scripted step text and both alternatives for each trial figure rather than exhaustively operating every control. The reference articles were read in full, with their rendered figure content and explanatory alternatives; this was not a fresh visual or browser-compatibility audit of those references. The phone scrolling cues were assessed for teaching ownership and placement from their source and surrounding figure; no narrow-viewport interaction test was performed. Deeper article ownership was judged from the supplied plans, without reading their prose. I reused the existing port-4333 preview, started no server, ran no build and changed no article files.
