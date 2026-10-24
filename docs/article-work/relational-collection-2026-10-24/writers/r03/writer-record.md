# r03 writer record

## Assignment and scope

Fresh article: Constraints and tenant boundaries, in `/private/tmp/staycurrent-relational-20261024-r03` only. Read supplied brief, shared facts, links, finished-reading r00/r01/r02, current write/figures/continuity skills and their figure guides. No previous article, review feedback, other agent/chat/history or original repository accessed. Root owns integration, routes, servers, builds and the independent review schedule. This writer did not delegate, serve, build, commit, push or publish.

The source was designed only after root verified all 19 public reference outputs and acknowledged delivery. Reference study is recorded in `evidence/reference-exposure.md`. All temporary reference tabs were closed.

## Teaching and source choices

The article develops the difference between a row condition, an identity and a reference, follows parent changes into deletion policy, then makes tenant scope part of identity. The main drawing makes one line's shop ID participate in two parent lookups, so the reader can see why finding a product cannot compensate for an absent same-shop order. It uses the shared stepper, with provenance in `src/components/figures/stepper.mjs`, rather than inventing another playback clock. The figure's matching is a conceptual lookup, not PostgreSQL execution order. The concurrent-key schedule is an explanatory table, with the separate native mechanism check described precisely in prose.

Primary sources checked on 24 October 2026:

- https://www.postgresql.org/docs/18/ddl-constraints.html — CHECK and NULL, composite uniqueness/identity/references, action policies, composite NULL matching, child-side index caveat, limits of checks and supported alternatives.
- https://www.postgresql.org/docs/18/index-unique-checks.html — unique insertion waits for an uncommitted conflict and rechecks its outcome.
- https://www.postgresql.org/docs/18/sql-createtable.html — declaration and deferrability details.
- https://www.postgresql.org/docs/18/sql-set-constraints.html — forced immediate checks and which constraints can be deferred.
- https://www.postgresql.org/docs/18/ddl-rowsecurity.html — distinction between referential integrity and runtime row access; policy implementation is linked to its owning neighbour.
- https://www.postgresql.org/docs/18/errcodes-appendix.html — SQLSTATE and separate constraint fields.
- https://www.postgresql.org/docs/18/tutorial-transactions.html — explicit transaction failure and savepoint recovery.

No copied quotations; original explanation developed from the fixed shop and native tests. Specific product capabilities are scoped to PostgreSQL 18.

## Continuity pass

Reread against the supplied entrance knowledge: keys, composite identities, NOT NULL, three-valued comparisons, transactions and the introductory stock race are established. The article explains constraint enforcement without re-teaching normalisation or implementing the neighbour's capacity protocol. A tenant means a shop; Mina remains a customer. Order 103's mug line remains shop 10's Blue mug at20.00. Shop20's accepted P7 is Copper mug at18.00; no currency introduced. Core rows are imported for the figure, and SQL seed rows are generated from core.json. Other core rows and report totals are unchanged.

The tenant variant is announced before use. The attempted `(20,103,1,'P7',1,18.00)` is invalid input, not a committed history. Root explicitly acknowledged this use and the anonymous MATCH SIMPLE/FULL scratch examples. The figure's shop10 case follows an existing stored line and claims only satisfaction of its two references, avoiding a claim that inserting a duplicate line would succeed. The shop20 case must fail on `(20,103)` despite its product existing. Deletion cascade and deferred references are separate scratch/definition variants; no core order or product is removed. P404 and anonymous999 are deliberately missing attempted values, not new shared facts.

No extension to the central facts or schema is requested. Parent customers and payments need the same scope, stated in prose; customer references appear in the worksheet. Access-control policy tests and aggregate capacity protocols remain with their neighbours.

## Verification

`prepare-worksheet.py` derives the repeated seed rows from authoritative core data. `downloads/constraints.sql` is the exact reader-facing single-session worksheet: temporary objects, expected failures caught and checked by SQLSTATE, final rollback. It checks a CHECK-only NULL counterexample, required/positive quantities, duplicate identity, nonexistent product, parent deletion/key changes, cascade, composite tenant references, absent same-shop order with existing product, a missing product value, MATCH SIMPLE/FULL and deferred integrity. The tenant counterexample removes just the order foreign key and admits the otherwise invalid line before restoring that rule.

`verify-native.py` starts an owned PostgreSQL18.6 cluster under a unique `/private/tmp/staycurrent-r03-owned-*` directory. It removes inherited PG* settings, explicitly fixes socket/port/user/database, disables TCP listening, and verifies current_user/database/data_directory before any data changes. Native escalation was granted; there was no automatic approval rejection. It runs the exact download, then a two-writer immediate-key conflict: second writer observed at `Lock:transactionid`, first commits, second gets duplicate-key refusal, final count1. The absent-key counterexample has two empty prechecks and final count2. Native output and actual timing/cleanup are in `evidence/native-results.json` and `worksheet-output.txt`; elapsed time is verification bookkeeping, not a performance claim. All owned server/data cleanup completed.

`verify-model.mjs` checks all eight illustrative figure states against core P7 plus the declared tenant variant. Mechanical checks establish model transitions and native constraint behaviour, not prose/teaching quality or a production authorisation guarantee.

Rendered author finishing is complete. Root's ordinary structural diagnostic identified parent labels implemented as headings; they now use non-heading labels. Author inspection removed inherited section margins, strengthened essential record/control borders and wrapped displayed SQL after observing actual phone overflow. Root's final exact article sync preserves SQL semantics, and the reader-facing worksheet and native evidence remain unchanged.

Full and isolated previews were inspected at desktop1280×720 and375×812, light/dark, with all eight option/step states, keyboard selection/Next/Back/Reset, Tab focus order, settled autoplay, replay/pause and the text alternative. Phone document width375, figure width/scroll343 and all six SQL block client/scroll widths343 were observed after the final wrap. Text and essential graphical contrast exceed the skill thresholds (`evidence/contrast.json`). `evidence/render-qa.json` records observations and limits. Screenshots remain in the public tool log; no local PNG file is claimed. System theme was restored (resolved dark), viewport.reset was called, all three owned QA tabs closed and the QA lease released to root before records. The tab still reported375 immediately after reset; root was told that exact limit.

`evidence/source-hashes.json` freezes this final source/dependency set. Root's exact structural/build receipt is in `evidence/structure-check.json`; the author did not run a build. This source is a draft, with gated worksheet links and no public download write. No independent review verdict is claimed.

## Return

Final author source hash for r03.astro: `54542157012ccb0bb551ed85e15c480a15b9804bd09fafa2a1c5dc011d8a3247`. Root acknowledged exact build/structural check at 2026-10-24T00:25:31UTC with no r03 or shared issues. No article changes followed that check. Final source hashes and native evidence hashes were checked for equality before return. Root retains route, build, review and publication ownership.
