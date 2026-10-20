# Practitioner review — b27

## a25 — Choosing indexes for a workload

**Verdict: REPAIR.** One required model-narration correction, a25-P1, below. The complete prose, SQL/native evidence, model data and remaining semantics pass this review. No optional changes requested.

Read the complete frozen article, supplied context/family plans, relevant actual a05 parent and a24 sibling, source ledger, writer handoff, native worksheet and retained output, five model builders and renderer. Reviewed against the original relational-practice goal. The parent retains its complete workload/measurement decision; this article adds candidate design, access bounds, ordering, coverage, eligibility and write obligations. It leaves full plan diagnosis to a26, concurrency/capacity to a28, physical-layout cleanup to a24, and deployment/maintenance procedures to their owners. The short JSON access-method contrast is justified by the operator/eligibility decision. There is sufficient practical depth without turning this into an access-method catalogue.

### Required repair

**a25-P1 — Explain range exhaustion when pending-only returns one row.** Location: `src/components/relational-next/a25/model.mjs:35`, Figure 2, **Tenant, status, date · pending only**, final state (4 / 4).

The model correctly returns only O8: tenant 42's pending O8 is dated 8 January; its other pending order O2 is dated 2 January and fails the since-5-January condition. However, the shared endpoint title and note still read:

> Stop when the first page is complete
>
> The two answers arrived newest first. LIMIT stops this request without reading the rest of the tenant’s history.

The same displayed endpoint correctly says `Return O8 · no sort in this baseline model`. I reproduced this contradiction in the immutable browser preview after selecting the pending-only option and pressing End. There is one answer, and this request reaches the end of its qualifying range before filling its two-row maximum. LIMIT did not stop it after two rows. This is consequential to the article's explanation of bounded first-page work.

Make the final title and note conditional on the actual result/stop condition. For this branch, explain that the qualifying range has ended, only O8 matches, and LIMIT is a maximum. For example: **“Reach the end of the qualifying range”**, followed by **“Only O8 matches the pending/date conditions. Return one result; LIMIT is a maximum, not a requirement to find two.”** Preserve the invented rows, traversal/result boards, SQL, native evidence and correct two-answer explanations in the other branches.

Acceptance implication: with that narrow title/note repair checked in source and rendered output, all unaffected technical/native checks below can be retained; a new database run is unnecessary. Until then this is a repair verdict rather than a complete article pass.

I checked all 14 available choices and 63 model/rendered states for other zero/one-result branches inheriting two-result or LIMIT-stop narration. This is the only such branch. The all-status/history/date endpoints return O11 and O8; status-all explains sorting three qualifying rows before returning two. Both traversal choices have their declared four/eight rows; all coverage choices use the same two identities. The subset comparison concerns eligibility rather than a result-count claim, and the write comparison concerns one changed row without borrowing the page-completion narration.

### Independent native verification

Inspected and ran a temporary copy of the complete worksheet with pinned pg 8.23.1 against native PostgreSQL 18.6. Only the database-name prefix was changed to isolate reviewer ownership. Own results and summary are `/private/tmp/rel3-prac-a25-1792465001/raw-results.json` and `summary.json`. Database `rel3_prac_a25_run1792454170708` was closed and dropped successfully (`cleaned: true`). Retained source/evidence files were not overwritten; there were no shared-server configuration changes, global resets, cache flushes or restarts.

The worksheet captures plans/results; successful exit alone was not treated as a semantic pass. I independently checked result identities/order, important plan nodes and predicates, loop multiplication, visibility counters, sizes, expression rejection and write evidence. All passed:

- The no-index, tenant, date-first and history candidates return the same ordered ten rows. Top-level shared hits/reads were respectively 613/0, 300/2, 13/5 and 10/2. The history route removes the sort. The tenant route tests 300 rows and rejects 130; the plain path rejects 29,830. These are buffer accesses and plan-node output/filter counts, not leaf-entry counts or device I/O.
- Related rows use the order-history route and the order-line prefix. The inner plan emits three rows over ten loops, returning 30 lines; the full plan uses 62 hits. The history index-only node has ten heap fetches with visibility bits clear, correctly distinguished from coverage of the separate line request.
- Pending filtering through history and the status-first candidate preserves the same eight qualifying answers. The latter's all-status request needs a sort across status runs; fixing status permits the useful pending range. Casting the tenant column to text loses the demonstrated integer-key route and returns the same results through the scan. No forced-index setting conceals the route choice.
- Included-value coverage gives ten heap fetches before vacuum, zero after vacuum, and one after an unrelated row on a relevant heap page changes. Top-level buffer accesses become 3 after vacuum and 4 after that change. Including all projected values is therefore not confused with proof of visibility. The script retains the small WAL record produced during the final read; the article does not claim that a read can never perform cleanup work.
- The pending partial index serves the known literal and custom plan. The generic prepared plan cannot assume its status parameter is pending, uses the full-table route and still returns the same eight answers. The session plan-cache overrides and regular fixture do not establish what the application's automatic preparation will choose.
- Direct `timestamptz::date` index creation fails with SQLSTATE 42P17. The fixed-UTC expression index works and returns count 1,440 using its matching expression; the session-zone cast returns the same count in this UTC run through the unindexed route. Their equivalence is not assumed in other time zones. The matched expression uses 33 top-level buffer accesses versus 613 for the mismatch.
- In the separate bounded write pair, the key-only and included-total definitions generate 191,024 and 333,584 WAL bytes for 1,000 updates. The history/covering allocations both happen to be 1,228,800 bytes. Neither coincidence is promoted to a universal size or write multiplier, and the evidence does not claim measured throughput or a HOT percentage.

The source fixture, table-local autovacuum/fillfactor choices, sequential capture order, UTC session and lack of concurrent traffic are explicit. The recommendation is a candidate for the parent's workload comparison, rather than production acceptance based on incidental execution timing.

### Sources and working figures

Checked consequential claims against PostgreSQL 18 [multicolumn bounds and skip scan](https://www.postgresql.org/docs/18/indexes-multicolumn.html), [ordering](https://www.postgresql.org/docs/18/indexes-ordering.html), [bitmap combinations](https://www.postgresql.org/docs/18/indexes-bitmap-scans.html), [index-only scans](https://www.postgresql.org/docs/18/indexes-index-only-scans.html), [partial indexes](https://www.postgresql.org/docs/18/indexes-partial.html), [expressions](https://www.postgresql.org/docs/18/indexes-expressional.html), [CREATE INDEX](https://www.postgresql.org/docs/18/sql-createindex.html), [PREPARE](https://www.postgresql.org/docs/18/sql-prepare.html), [operator classes](https://www.postgresql.org/docs/18/indexes-opclass.html), [collations](https://www.postgresql.org/docs/18/indexes-collations.html) and [JSON indexing](https://www.postgresql.org/docs/18/datatype-json.html#JSON-INDEXING). The existing primary-source/native checks for HOT's ordinary-index qualification, PostgreSQL constraint-index ownership and the documentation-based InnoDB clustered-key locator also apply. The article correctly avoids an absolute leftmost-prefix prohibition, parameter-blind partial-index advice, cross-engine locator equivalence and treating INCLUDE as a search/uniqueness key.

Independently enumerated the actual five pure builders: 14 choices, 63 complete states. Checked sorted entry order and row identity, matching versus rejected entries, model page/row counts, relevant heap-page visibility, partial-predicate proof and same-page/non-HOT conditions. Then exercised every state through the immutable 4439 browser controls and compared displayed titles, results and notes, including all endpoints. Initial selected options agree with the model (coverage starts at bits set); Next/End, comparison changes, range navigation, Reset and Play/Pause work. Inspected the pending endpoint visually in article context. Apart from a25-P1, rendered meanings and source/native boundaries agree. Invented entry/page counts are clearly separate from captured native plans.

Snapshot and rendered article bytes match (SHA256 `fce4db372e4fb1a2d95cef4fc7f9051e7655f2635ebe977e5ce8651507063fd6`); both component hashes still match the b27 manifest. No article/component/evidence edits, build or download UI interaction occurred. Review tab closed and preview released.
