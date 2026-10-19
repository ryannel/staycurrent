# RL119: lifecycle review and resolution

19 October 2026. This follows the intact uncued reading in `lifecycle-first-reading.md`. The subsequent pass read the full review and style skills, RL119 brief, RL119 coverage card, lifecycle runner/transcript/verification and the extracted original RL119 native record. No other draft or live teaching page was opened. No build, SQL rehearsal, subagent, commit, push or publication was performed by this reviewer.

## Revision and status

Article SHA-256: `91516db10a96198992c4b10038468a0fc6f3025377ef17e20b8c9af9809be40d`.

At this revision, the article's technical explanation and writing are **ready as a draft** within this review's scope. The page remains `status: drafting`. Rendered figures, controls, light/dark/phone layout and whole-site checks remain with root. This is not publication approval.

The reproduction runner's shutdown finding below is resolved in the current sealed source. No outstanding technical/editorial repair remains from this pass. Its captured native observations remain unchanged; no rerun was needed for the final source check.

Sealed runner checked finally: SHA-256 `e40db15d384b1c5ef87c9120d355aff49464d983458d770c576b9651ce66be2c`.

Native transcript checked: SHA-256 `95e92a3e0ff9363c5e30a1cb7489b9adb1a1224d8aa22f760c6652c3773bfe54`.

## Findings and repairs

1. **The reuse boundary was unnamed.** “The supplement advances beyond the deletion boundary” left a first reader unable to explain what advanced. The runner explicitly allocates/completes another XID, then vacuums before inserting later IDs. The body now names that operation and explains that an older scan may still reference a deleted page. PostgreSQL's [18 B-tree implementation notes](https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/access/nbtree/README), section “Placing deleted pages in the FSM,” support the snapshot/XID safety condition. The new source entry makes that implementation claim inspectable. This is a lab schedule, not advice that a single extra transaction unblocks every production reuse horizon.

2. **The backfill changed the nullable input boundary without saying so.** `change_lab.code` starts nullable. The trigger turns null integer into null text; the final check rejects that text. No native null case was run. The body now explicitly says this fixture requires a code and tells a reader whose old contract allows missing codes to preserve that case in the invariant. SQL and evidence remain unchanged. The reasoning follows the shown trigger and PostgreSQL's documented [check/null rules](https://www.postgresql.org/docs/18/ddl-constraints.html). Recheck by tracing null through the trigger: it cannot be mistaken for a supported successful legacy input in this fixture.

3. **The catalogue join was described too broadly as ownership.** A `conindid` join may return foreign-key dependencies as well as index-owning constraints. The body now tells readers to inspect constraint type and separates primary/unique/exclusion ownership from a foreign key's referenced index; standalone uniqueness remains independently checked. The [constraint catalogue](https://www.postgresql.org/docs/18/catalog-pg-constraint.html) includes all four constraint types in `conindid`. The existing native fixture demonstrates its own child/parent and identity dependencies; no additional catalogue scenario was manufactured.

4. **Evidence chronology was overstated.** The transcript's before/rebuild acceptance query already returns status. The body no longer calls status a newly introduced request at replacement time: the decision is to cover status as well as price. The opening now attributes the complete set of cases jointly to the core lab and lifecycle supplement rather than suggesting the old core lab contains the newly commissioned lifecycle.

5. **Runner cleanup after failed shutdown — resolved during sealing, outside article edit scope.** The first source read showed a `pg_ctl` exception recording `shutdown_error` without changing `ok`, which could allow successful-body cleanup after shutdown failure. Root requested a recheck because the source was still being sealed. The final runner now sets `ok=False` in that exception, reports `success=false` and skips `shutil.rmtree(ROOT)`. `command()` raises on a nonzero shutdown exit, so this covers both rejected exits and subprocess exceptions. The first hash I recorded was already this corrected sealed version, not the earlier unhashed reading. No remaining finding, native rerun or evidence edit was needed. The captured transcript's successful shutdown remains its actual result. I have not edited code or verification.

## Consequential evidence checks

The final transcript's `success` is true and its owned `pg_ctl` shutdown returned zero. The script assertions and captured results support the numbers and identities used in the page:

- Initial history index: 12,427,264 bytes, 1,507 leaves, 89.88% density. Vacuumed survivors: same bytes/leaves, 9.30% density, no empty/deleted pages. Fresh identical survivor index: 1,253,376 bytes, 151 leaves, 89.71%. These support sparse active-tree cost rather than mere file-size alarm.
- Retention index: 5,627,904 bytes after deleting old ranges, 69 leaves, 615 deleted pages. Later inserts after the recorded XID/vacuum schedule produce 5,636,096 bytes, exactly 8,192 more. This is actual reuse in the lab, not evidence that all emptied pages are immediately reusable.
- Successful concurrent rebuild: 1,261,568 bytes, 152 leaves, both validity flags true. Captured overlap includes caller progress while the operation is active and `waiting for old snapshots`. The transcript records 1,352,336 interval WAL bytes. The page accurately includes caller work and does not label it a REINDEX-only byte total.
- Range result remains 5,048.50 over 247 rows using the history index. Buffer-access totals are 19, eight and seven; heap-fetch counts are zero, 100 and one before, immediately after and after vacuum. The article discloses changed visibility and does not turn this into a clean speed benchmark.
- Timeout leaves valid/ready original plus invalid/ready `_ccnew`; cleanup leaves the original only. Explicit-transaction concurrent reindex is rejected. The documented `_ccold` possibility is not falsely described as another executed result.
- Defined usage interval records six replacement scans and zero note/primary/request-index scans. Reset markers match, but the page correctly requires longer production coverage, relevant replicas, index OIDs and per-index reset/recreate accounting. The short interval proves only its named requests.
- Concurrent drop overlaps committed callers. After drop, the ten ordered records match the earlier result, a customer lookup uses the replacement, referenced-customer deletion and duplicate order/request inserts fail, and tenant t4/t5 order81 prices remain 20.00/90.00. The price-only history index is deliberately retained.
- The original extracted native record supports the ALTER timeout/retry, early false/false index failure and true/true repair, two-row backfill, validated final check, simultaneous old/new caller forms and zero mismatches. This review did not rerun that record.

The primary-document pass checked [CREATE INDEX](https://www.postgresql.org/docs/18/sql-createindex.html) for phased concurrent behavior, invalid leftovers and uniqueness consequences; [REINDEX](https://www.postgresql.org/docs/18/sql-reindex.html) for supported targets, locks, temporary-copy phases and recovery; and [DROP INDEX](https://www.postgresql.org/docs/18/sql-dropindex.html) for transaction, dependency and partition restrictions. The observed states fit those contracts.

[ALTER TABLE](https://www.postgresql.org/docs/18/sql-altertable.html) supports non-volatile defaults without rewrite and the enforced-future/validated-existing distinction. [Explicit locking](https://www.postgresql.org/docs/18/explicit-locking.html) supports the held-read/Access Exclusive conflict. [Progress reporting](https://www.postgresql.org/docs/18/progress-reporting.html) supplies the actual phase view. [pgstattuple](https://www.postgresql.org/docs/18/pgstattuple.html) supports pagewise inspection and its restricted privileges; [amcheck](https://www.postgresql.org/docs/18/amcheck.html) supports the selected function's read-level locks and narrower check coverage.

[Statistics](https://www.postgresql.org/docs/18/monitoring-stats.html) supports delayed/cached counters and reset boundaries. [Resource consumption](https://www.postgresql.org/docs/18/runtime-config-resource.html) supplies maintenance-memory context. [Multicolumn indexes](https://www.postgresql.org/docs/18/indexes-multicolumn.html) and [index ordering](https://www.postgresql.org/docs/18/indexes-ordering.html) support the prefix/order comparisons; the page does not assert that a non-leading column can never be used. [Logical replication restrictions](https://www.postgresql.org/docs/18/logical-replication-restrictions.html) supports the distinction between a physical rebuild's WAL and subscriber schema/index responsibilities. These sources were browsed during this review, after the first reading.

## Actual capability homes and boundaries

| Capability | Actual home in RL119 | What is taught here |
| --- | --- | --- |
| Bound and diagnose a lock-sensitive ALTER | A short operation can wait a long time | Two connections, retained read lock, observed timeout/retry, queue effect, blocker query, separate lock/statement budgets |
| Distinguish rewrite and validation | Inspect rewrite and validation requirements | Missing-value default mechanism, command/version sensitivity, NOT VALID future enforcement and separate validation |
| Recover a failed concurrent unique build | A failed concurrent index can remain | Duplicate cause, catalogue flags, business-correct repair, explicit drop/rebuild |
| Decide whether size is waste or reusable capacity | Measure an index before rebuilding it | Equivalent native baseline, density/leaf evidence, physical-inspection cost, range deletion and actual refill reuse |
| Execute and accept a resource-bounded rebuild | Rebuild within a resource and recovery budget | Disk/memory/sort/WAL/replica costs, actual REINDEX, old-snapshot wait, caller progress, result/validity/amcheck acceptance |
| Recover concurrent rebuild remnants | Recover the failed rebuild's copy | Executed timeout and `_ccnew` cleanup; documented `_ccold` distinction and supported-target limits |
| Decide whether an index may be removed | Remove an index only after accounting for its duties | Representative observation rules, reset/object identity, uniqueness/FK duties, full-definition/prefix comparisons |
| Replace and remove an access path | Build, verify, then drop | Concurrent replacement, request plan, permitted drops with real callers, acceptance and reconstruction budget |
| Keep old/new callers correct during backfill | Expand before changing readers; Backfill in bounded transactions and prove completion | Integer authority, maintained trigger, bounded locks, SKIP LOCKED limit, full predicate plus validated rule and concurrent client acceptance |
| Retire the old contract safely | Contract only after the old contract ends | Exclude old callers and rollback packages, define representable inputs, stage-dependent reversibility |

The map's RL119/RL63 obligations have substantive homes here. The new lifecycle is coherent within this same product procedure and does not need a new page merely because it is longer. RL111 is linked for heap-version cleanup eligibility, RL112 for operator contracts, and RL120 for wider diagnosis; their actual bodies were outside this commission and were not reverified. The local lesson does not rely on following those links to interpret its central native outcomes. Generic expand/contract remains a neighbouring general topic, while the native mechanisms and commands are taught here.

## Assembled editorial reread and remaining limits

After repairs, I reread the complete source in sequence, with its unchanged opening mechanisms and original backfill sections as well as the expanded lifecycle. The lifecycle stays contiguous: failed creation → measurement → justified rebuild → failed-copy recovery → safe replacement/removal. Its bridge to representation coexistence makes the return to the earlier code fixture intelligible. No fix introduced another section or a competing running example.

This is a substantial article. Its longest stretches carry operating distinctions rather than restating the same conclusion. The size table, reused small model, observed wait and failed-copy comparison provide distinct teaching work. The reset/definition paragraphs are dense but have concrete consequences nearby. I found no section whose removal would leave the same usable understanding at lower cost. Headings give direct entrances for measurement, rebuild and removal, while their first fixture paragraphs explain when the setup changes. A reader entering midway still needs the named local table/index definitions, rather than unrelated earlier article history.

Figure 1's source states convey existence versus validity and repair. Figure 3's source states convey coexistence versus reconstructive rollback after drop. Figure 2's source is a component placeholder: I cannot certify its visible states or correspondence from this reading. Root must inspect all figure states, including the post-vacuum contrast, and the page's controls/layout. No human comprehension session or actual production workload was observed. Exact SQL behaviors are supported by the retained native record and primary references, not a new execution by this reviewer.
