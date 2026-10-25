# Writes planning notes

## Inputs and reference exposure

Read only the assigned commission, node, neighbouring ownership and shared shop record, plus supplied current breakdown, write and continuity skills. No old body, outline, feedback or main-repository material was consulted. No delegation, planning review, implementation or runtime verification was performed.

Read all 19 bounded text parts separately with their END markers: sequences1–6, indexes1–7, storage1–6. Reading export SHA256 values: sequences `722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c`; indexes `d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1`; storage `2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07`.

Studied finished sequence figure4 (stored booking/job, later worker), index figure9 (one insert's table/index work) and storage figure8 (commit/reply/recovered-state distinction) at the supplied port4584 previews. Followed their initial, intermediate and final states with controls and screenshots. Used three owned temporary tabs, closed afterwards; no viewport, theme or user-tab changes. The background visibility option was unsupported in this subagent context; no global visibility change was made.

Teaching borrowed: preserve one recognisable record while changing one decision; show which facts a result does and does not establish; put the failure beside the successful path; keep a small invented model distinct from observed execution. The writer retains prose, figure and control design. What must become visible is predicate eligibility versus outcome, competing conflict meanings, and each input row's disposition across commit boundaries.

## Shared scenario approved by the coordinator

The price correction can reuse the existing independent modelling scenario: P7 catalogue price 20.00 becomes 22.00, while order103's agreed unit price stays 20.00 and order total 29.00. Use schema column `price`, not the storage reference's `current_price`. No purchase or stock decrement is needed here.

Approved independent catalogue feed B17 has four immutable rows, keyed for provenance by `(batch_id,row_no)`: 1 P7 Blue mug 22.00; 2 new P11 Tea strainer 8.00; 3 P3 Green tea, 50 g -4.50; 4 P9 Teapot 36.00. This feed owns product names and catalogue prices. New products start stock 0; updates never overwrite existing stock. Preserve current stock from whichever explicitly labelled shared starting snapshot is used. The negative P3 row is rejected. P7 and P11 commit in one chunk with applied records; work stops before P9's chunk starts. Resume leaves the rejection intact and applies P9, ending with three applied and one rejected. No prices or stock from this exploration become global starting facts.

The approved separate duplicate-key variation (two P7 prices 22.00/23.00) exposes ambiguous source ownership without making the main batch larger. A corrected rejected row belongs to a separately identified input revision, linked to its original row; do not silently change B17's bytes. The coordinator approved these facts and will add them centrally. This deliberately known stop before the next chunk starts does not treat an uncertain commit as a known failure.

Keep the worked loader single-owner, with no competing writer to the feed-owned catalogue fields and no overlapping newer batch. Otherwise old-file replay can overwrite newer work even when the assignment is idempotent in isolation. State this assumption rather than expanding into source-version ordering or live migration protocols.

## Ownership and continuity

The introduction gives a sufficient guarded-change overview and routes readers here. This article fully owns conditional write mechanics, affected rows, upsert meaning, staging, rejection, chunk progress, replay and reconciliation. No new child is justified: the deeper neighbouring outcomes already have accepted owners. Therefore the YAML intentionally has no `nested_article` entries and changes no parentage.

Transactions and isolation owns concurrent one-row stock and multi-row invariant protocols; this article only establishes statement eligibility and the atomic import/progress boundary needed to explain chunks. Retries and uncertain commit outcomes owns known abort versus unknown commit, stable logical request identity, payload agreement and recorded-result recovery; here only identify the limitation and route there. Application SQL owns connections, parameters, errors and cancellation. Live schema changes owns backfill convergence with active callers. Index and storage owners retain tuning and operating procedures. MERGE remains a short local choice, not a new child or a concurrency treatment.

Continuity pass: the route starts from keys, predicates and constraints; introduces outcomes before conflict handling, source identity before replay, and commit boundaries before partial progress. New transaction vocabulary needs a short local explanation because transactions is a later route. Validation must not imply a guarantee against later changes; target constraints remain active. Do not delete rejected staging evidence in the introductory DELETE example. Treat deletion of a referenced P7 as a refused attempted operation, not a new committed shop state.

## Primary-source checks for the writer

Checked PostgreSQL 18 documentation on 25 October 2026. No engine outputs are claimed as observed. Root reports owned native PostgreSQL 18.6 is available for the writer's subsequent verification.

- [UPDATE](https://www.postgresql.org/docs/18/sql-update.html): SET can use old values; RETURNING describes updated rows; count includes unchanged matched rows and can be affected by triggers; zero is not an error. UPDATE FROM needs at most one source match per target. Keep SQL result examples free of triggers, row security and inheritance unless explicitly introduced.
- [INSERT](https://www.postgresql.org/docs/18/sql-insert.html): ON CONFLICT chooses a key conflict response; `excluded` supplies proposed values. DO UPDATE's atomic insert/update guarantee has independent-error and condition qualifications. Duplicate proposed keys can produce a cardinality error. RETURNING omits rows not inserted or updated. Neither a uniqueness conflict nor DO NOTHING proves equal payloads.
- [COPY](https://www.postgresql.org/docs/18/sql-copy.html): server filename access differs from STDIN/client transfer. Default errors stop the command. ON_ERROR ignore handles input type-conversion errors, not general invalid business rows; constraints and triggers still apply. A failed COPY's invisible physical leftovers are not partial committed import progress. Raw text staging preserves invalid values for explicit decisions, but cannot fix malformed CSV automatically.
- [Transactions](https://www.postgresql.org/docs/18/tutorial-transactions.html): one transaction supplies the atomic boundary for target changes plus applied records. Separately committed chunks deliberately expose partial completion.
- [MERGE](https://www.postgresql.org/docs/18/sql-merge.html) and [Transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html): source matching and ordered actions differ from conflict arbitration; concurrent insert behaviour differs from ON CONFLICT. Duplicate source matches are not a safe selection rule. A complete-source deletion policy needs a complete, scoped source; the proposed feed is partial.
- [DELETE](https://www.postgresql.org/docs/18/sql-delete.html): WHERE scopes deletion and RETURNING reports deleted rows. No WHERE means every row.
- [Populating a database](https://www.postgresql.org/docs/18/populate.html): COPY reduces loading overhead and batching reduces per-commit work. Initial-load index advice is context-sensitive; retain active-table correctness checks rather than recommending blanket removal. Collect statistics after substantial loads when needed; detailed tuning stays elsewhere.

The writer should verify actual counts, returned rows, rejected-row classification and durable chunk/progress behaviour on the owned disposable engine before labelling these as execution results. The outline's four-row arithmetic is illustrative, with no measured throughput or universal chunk size. No ownership boundary remains unresolved; central adoption of the approved example extension is owned by the coordinator.
