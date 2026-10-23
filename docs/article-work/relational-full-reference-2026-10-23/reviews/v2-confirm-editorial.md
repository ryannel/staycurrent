# Editorial review · focused repair confirmation · complete introduction · frozen v2 / r07

Inputs read: AGENTS.md; README.md and docs/site-direction.md for repository context; staycurrent-review and only its editorial perspective; staycurrent-write for the fixed reference locations; review-audience.md; confirmation-scope-v2.md; frozen-v2.json; the current complete rendered article at http://127.0.0.1:4362/review/relational-full-reference/; both expanded race histories; mechanical-receipt-v2.md for provenance and its explicitly bounded mechanical claims. No plans, author/repair notes, earlier approvals, decision history or other review reports were read.

Reference calibration: exact rendered-text exports with provenance in reference-reading/manifest.json, read in bounded untruncated portions: Indexes lines 1–84 (opening, first scan, index entries and row locations, first B-tree explanation); Sequence diagrams lines 1–47 and 102–160 (opening, first drawing, outbox and follow-on boundary explanation); Storage and durability lines 145–185 (dirty pages, hypothetical design and WAL explanation/caption). Inspected the finished Sequence diagrams Figure 1 and Storage and durability Figure 5 in the browser. These are the relevant reference passages for this focused confirmation; this is not a fresh full-reference reading.

Highest severity: none

## Scope and version

This is informed, focused confirmation, not an independent first reading or the later complete editorial assessment. I read the complete current rendered main article once for surrounding argument and downstream terminology, then examined all changed/restructured reader-facing locations named in confirmation-scope-v2.md in place. These include the first table and its prompt/interpretation, the identifier path and accompanying definitions, Edda, the purchase rewind, the race caption/buyer labels/numbering, the commit caption/numbering, and the revised read-boundary and rollout paragraphs. I followed their dependencies through the history query, both race histories, commit, lost replies, outbox, distribution and choice sections.

The introduction and four changed figure-component source hashes match frozen-v2.json. The r07 built article file matches the recorded rendered hash. Browser reading used port 4362. A separate shell-level byte check of the served HTTP response was unavailable under the local network restriction; the browser preview itself was accessible.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass within scope | Changed figure labels remain understandable, with captions numbered 1–4 and matching prose references. Current rendered figures contain no heading elements. Section headings give reader-facing subjects. |
| 2. Plain sentences | pass within scope | The new first-table and matching-value explanations give concrete actions and named values. The read-boundary paragraph explains the consequence of substituting a customer number before introducing query parameters. No compressed late checklist remains. |
| 3. Terms | pass within scope | Row/column precede the relationship path; keys, line numbers, schema, offered/agreed prices and the rewind are consistent with later uses. Query parameters are explained as values sent separately from statement text; the deeper route then names parameter binding. The connection route points to a request's connection rather than assuming unexplained borrowing mechanics. |
| 4. Openings | pass within scope | The first table establishes the after-purchase moment before use. The purchase section explicitly rewinds before stock 1/12 or missing order 103 is needed. “The application boundary matters on a read too” recalls the earlier history query and extends the responsibility argument after the outbox. |
| 5. Reader-facing text only | pass within scope | Race caption uses “stepped illustration”, states that the page runs no database, and says outcomes were reproduced in PostgreSQL 18. It contains no unexplained production terminology. The ordinary sources/evidence disclosure remains distinct from the explanation. |
| 6. Captions and labels | pass within scope | Table captions name the selected columns/rows and after-purchase state. Identifier transitions name both column and matching values. Race protocol and buyer labels say what is compared; the caption supplies isolation, order, model/execution distinction and commit boundary. Commit caption retains its conceptual limits. |
| 7. One piece | pass within scope | The repaired passages continue the shop's explanation without rebuttal-like asides or detached duties. Application identity/permissions and parameter separation follow from a concrete read; rollout is introduced through coexisting versions and routed to its deeper owner. No changed passage reads as an awkward repair. |

## Accepted problems

- **D3: pass.** The earlier SQL query supplies the read example. Substituting 2 for Mina's 1 demonstrates why a database can return a technically correct but unauthorised result. The application must establish the caller and access rights; parameter separation is then explained in ordinary language. The route paragraph names the deeper treatment of binding and the connection, while old/new versions sharing the changing tables explains the reason for compatible rollout. This is enough for the introductory promise without making the newcomer supply the missing causal argument. Surrounding lost-reply and outbox passages, and downstream replica/shard/arrangement uses, remain coherent.
- **D4: pass.** “Both outcomes were also reproduced in PostgreSQL 18” is intelligible to the reader. Together with “A stepped illustration” and “It runs no database in this page”, it retains the distinction between the page's model and actual execution without production shorthand.
- **Other changed text, D1/D2 dependencies: editorial pass.** A visible product row and stock column now precede relationships. The named identifier path supports subsequent key and join explanations. Pending/unpaid order 103, after-purchase stock 10/0/4, and the explicit rewind to 1/12 form intelligible moments; both histories and later commit/request uses continue them. The narrower selected Figure 2 no longer leaves Edda's mention dependent on an unseen row: prose introduces her as a customer who can register without purchasing.
- **D5: editorial pass.** Labels/numbering/cross-references remain clear; the rendered figures contain no headings. Structural conformance beyond this observed DOM fact belongs to the owner's required checks.

## Findings

No new editorial findings. The next available finding number remains editorial-3.

## Limits

This does not certify whole-article quality as a blind final reader. The unchanged sections were read for context and affected dependencies, not subjected to a newly commissioned complete editorial assessment. Only the listed relevant reference portions were recalibrated; the three references were not reread in full.

Rendered visual inspection used the existing IAB viewport and resolved System appearance; Chrome, viewport and theme settings were left untouched. I inspected current ProductTable, ShopFacts, the race's initial presentation and caption, plus the revised request paragraphs; I read both full race histories as text. I did not replay all animation states, run a theme/viewport/accessibility matrix, repeat visual measurements, or verify native technical behaviour. The independent practitioner and visual checks retain those responsibilities. No builds, tests, source edits, extra agents, commits or publication were performed. Only this report was written.
