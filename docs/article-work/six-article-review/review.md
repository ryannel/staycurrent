# Six relational articles · review and repair

15 October 2026. Scope follows the user's screenshot: Designing your data,
Constraints in depth, Tables and JSON, Querying your data, How a query runs, and
Pagination and large results. This follows the earlier
[opening revisions](../access-and-persistence/opening-hardening/review.md) to
How a query runs and Storage and durability.

## Skill direction

The user asked for context, goals and good examples that leave the author room to
choose an approach. The final style and authoring guidance describes the reader's
starting point and the understanding the opening should make possible. The revised
Indexes passage appears in `docs/writing-style.md`, alongside the user's actual
response and the reason the example works. The review guidance values evidence of
what a passage taught at the time it was read. It no longer prescribes a drafting
order or a separate pass/fail gate for an opening.

The skills were exercised in this review and in an isolated new
[partitioning excerpt](partitioning-test.md). An independent reader found that
excerpt explained grouping, pruning, maintenance and workload dependence before
introducing key choice. This is a useful example of behaviour under the final
guidance, not a reliability score. Earlier tests used an earlier skill candidate;
their scope remains explicit in the opening-hardening record. All three edited
skill entrypoints passed metadata validation.

## Independent readings and repairs

The [sequential reader](first-reader.md) followed all six articles, preserving
questions and predictions before reading optional disclosures. The
[editor](editor.md) assessed both understanding and the flow of the prose, then
reread all six after repairs. The [technical reviewer](technical.md) checked the
sources, diagrams, models and executable examples, then reviewed the changed
passages and verification code.

The original extracted reading is preserved in [default text](initial-reading.txt)
and [optional text](initial-optional.txt), with chunk hashes. These are assembled
HTML extracts, not browser screenshots. Reviewers recorded that limitation.
The [final manifest](final-reading-manifest.json) and
[source hashes](reviewed-source-hashes.json) identify the revision checked.

| Article | Editorial decision |
| --- | --- |
| Designing your data | Removed repeated abstract conclusions after complete examples and an unnecessary admonition about timestamp names. Renamed the table-splitting figure to describe the comparison. Retained the dependency, history, type and constraint reasoning. |
| Constraints in depth | Put the subject definition before the competing-request example. Removed the repeated design prelude and brought concurrent writes directly after uniqueness. Supplied SKU starting values before the inserts. Used a hypothetical empty O14 to explain a composite reference without undoing the earlier successful O12 insert. Preserved the old section anchor. |
| Tables and JSON | Removed repeated supplier-reference and final-design explanations. Made the index paragraph more direct while preserving the conversion, workload and maintenance conditions. |
| Querying your data | Full review and rereading supported keeping its current prose. The receipt, missing-match and inflated-total examples continue to supply the reasoning needed for execution. |
| How a query runs | Retained the revised opening and body. The small/broad report, statistics and memory examples add useful depth beyond the parent. |
| Pagination and large results | Clarified that paging order identities and joining their lines can be stages of one statement. Removed a redundant performance disclaimer while keeping concrete causes of additional work. |

The editor found the original Constraints return to the opening problem too slow.
The sequential reader found that repetition useful for direct entrants and did not
identify a comprehension failure. The chosen repair is smaller than the editor's
initial reorder proposal: it preserves the value/key explanations before the
concurrent-write example. Both reviewers found the resulting sequence complete.

## Verification and rendered inspection

The technical review found stale verification rather than an article SQL error.
The JSON harness expected an old capacity update and expression index. It now runs
the actual migration, checks the hybrid result, tests ten input cases and verifies
rollback preserves source data after rejection. The evidence note now distinguishes
historical probes from the current workflow. Three companion verifiers now use the
installed dependency instead of an expired temporary runtime.

Rerunning pagination verification also exposed a generator that omitted a newer
download example and its script-mode instructions. The generator now preserves
both and asserts that a page of two orders returns all three associated lines.

Checks completed:

- The current article SQL verifier passed 110 statements on PostgreSQL 18.3 in
  PGlite 0.5.8, including migration success and rollback cases.
- Design-rule verification passed 192 combinations and five object cases.
- Query verification passed eight worked results, the receipt plan/download and
  nine model input combinations. Pagination verification passed 28 outcomes.
- The technical reviewer separately reproduced the six execution-plan/statistics/
  spill scenarios and checked the displayed examples against primary documentation.
- The site built all 56 pages. The local link audit checked 1,308 internal links
  without errors. `git diff --check` passed.

The in-app browser inspection covered desktop and 390-pixel phone layouts in the
current dark appearance. The six pages had no page-width overflow at phone width.
Screenshots were inspected for the schema diagram, shared rules, concurrent writes,
JSON exercise/stale writes, join experiment, execution plans/merge and pagination/
export diagrams. The revised Constraints page was explicitly reloaded after build
to avoid a cached earlier version.

Interactive checks observed copied names temporarily disagreeing, a shared customer
name updating both orders, and the agreed purchase price surviving a catalogue
change. Constraint controls distinguished a zero quantity and SQL NULL with and
without the relevant rules. JSON controls distinguished string, missing key, JSON
null and SQL NULL. The join model returned the same six lines while changing from
1,200 comparisons to 200 lookup entries and six probes. Pagination displayed the
expected insertion, deletion and moved-order results, including the missed unread
order after its sort value crossed the saved boundary.

No CSS or interaction code changed. Existing light-theme captures were consulted
for the unchanged visual styles; this pass did not recreate every earlier light/
dark capture. The SQL tests do not establish server performance or multi-session
concurrency behaviour, and agent reading does not establish novice comprehension.
Those limits remain explicit rather than being treated as failed editorial checks.

All consequential findings from this review are resolved. The six pages remain
working drafts; no commit, push or publication was performed.
