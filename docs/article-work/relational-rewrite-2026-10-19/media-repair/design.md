# Design and query learning media repair

19 October 2026. Scope: RL76–RL89, excluding retired RL88. Implementation is
complete for independent review; this note does not accept the collection or
change its publication state. The coordinator owns renderer integration, full
builds and independent rendered review.

The review began with the three house reference articles, their figure
components and the reopened learning-tools finding. The useful pattern was
persistent represented facts with a changed relationship: entries beside rows,
old versions beside their readers, and messages beside participants. The new
tools therefore retain source records and computed results together. A control
changes a consequential input, rather than selecting an authored explanation.

## Decisions across every owned page

| Page | Reader work and media decision | Later cases and limits |
| --- | --- | --- |
| RL76, introduction | Keep the small customer/session/booking records and exact join result. Replace the transaction text stepper with `Booking` (Figure 2), showing starting facts, work inside the transaction and published facts concurrently. Vary completed statements and commit/rollback. | The architecture comparison is a decision table, not a computable product ranking. External effects and missing replies remain linked to their owners. The model refuses to illustrate a partial commit as accepted booking success. |
| RL77, relations and normalisation | Replace the three fixed cards with `Facts` (Figure 1). Copied rooms, a separate session and references remain visible as copies change and bookings disappear. Catalogue price can change beside the fixed agreed price. | The dependency discussion needs the declared business rule, not a simulated discovery from sample values. Native schema and price SQL remain. The final derived-total discussion states the owner and reconciliation obligation; no additional control would establish either. |
| RL78, values | Keep exact numeric expressions, the repeated-clock static timeline, collation output and truth table. Add `Nulls` (Figure 2) at NOT IN: each input contributes a visible comparison, combined truth and retained-row decision beside NOT EXISTS. | Vary mixed, known, only-NULL and empty input. This makes the late failure case inspectable. Recurrence policy, currency and canonical identity are application decisions, so the existing examples explain them directly. |
| RL79, constraints | Replace the ownership cards with `Constraints` (Figure 1). Existing composite keys, proposed booking and independent reference/CHECK/NOT NULL gates stay visible. Vary tenant, session, seat value and enforcement scope. | The capacity SQL already shows one plus two reserved against capacity two. It is a concrete counterexample to row constraints; concurrency protocols belong in RL90/91. Deferral and NOT VALID timing remain prose, with their native mechanisms and onward links. The tool does not claim these three gates establish all integrity or access. |
| RL80, history | Replace the belief stepper with `History` (Figure 1). All four versions remain in effective-time spans, while the two query dates select exactly one stored version. | Add static Figure 2 for deletion's primary, downstream and restore destinations. No arbitrary deletion simulation: retention is a policy, while the figure makes its copy and restore boundaries visible. Native bitemporal query and immutable agreement remain. |
| RL81, joins | Replace the fan-out cards with `JoinPairs` (Figure 1): source children, pair grid and repeated sum. Vary zero/one/two payments and summaries before the join. Add `OuterJoin` (Figure 2) at the later predicate-placement section. It retains constructed rows and marks those removed by WHERE. | The cancelled s8 case is exposed alongside the no-booking case and ON/WHERE/OR alternatives. EXISTS and set operators retain concise SQL; they do not need another paced reveal. Grouped zero-payment output keeps purchased €45 and paid €0, matching the repaired LEFT JOIN query. |
| RL82, aggregates and windows | Replace the grouping/window stepper with `Windows` (Figure 1). Keep all four inputs beside the two grouped rows; vary current row, timestamp peer, ROWS prefix, previous/current pair and customer partition. The current row and contributing rows are named. | The later frame-boundary issue is included in the model. Ranking has a small explicit tied-rank example, and last_value states its precise frame change; neither benefits from an extra control here. Native output remains authoritative for syntax and engine rules. |
| RL83, pagination | Replace fixed cursor cards with `Pagination` (Figure 1). Retain first page/cursor, changed live sequence, selected source and next-page rows. Vary insertion, deletion, changed sort key and changed amount; compare full cursor, timestamp-only and offset. | The same tool reaches the later export decision: fresh reads, one established snapshot, captured IDs or captured values. The native two-session snapshot and cursor examples remain. Durable progress and chunk replay are protocol obligations, not inferred from the browser model. |
| RL84, writes/imports | Replace fixed batch counts with `Imports` (Figure 1). Show every source identity, payload, revision and disposition beside final destination. Repair the revision-nine contradiction and vary the destination revision to see the winning candidate change. | The tool includes stale, applied, duplicate, malformed, contradictory, superseded, equal-current and equal-version payload disagreement outcomes. Native mutation and RETURNING examples already expose the precondition directly. Concurrency classification remains an explicit later protocol, excluded from this single-writer model. |
| RL85, application boundary | Add `Boundary` (Figure 1) near N+1. Command tiles accumulate in parallel lazy/batch panels as parent count changes, with explicit assumed exchange arithmetic. Retain the static acquire/work/release flow, renumbered Figure 2. | The native cursor-close error makes lifetime failure exact. Timeout and uncertain commit link to the replay protocol owner. The command model does not pretend fewer commands imply a faster query or cheaper joined result. |
| RL86, indexes | Audit and retain its eleven existing Indexes models, including composite order, visibility, write cost, splits and deleted-page occupancy. No source changes needed. These are already persistent visual/causal models rather than generic text steps. | The late index-family map retains its static postings/intersection example (Figure 12). Maintenance and key-width decisions retain concrete comparisons and links. Existing models intentionally preserve their measured single-tenant fixture and the article says how tenant keys extend it. |
| RL87, execution/plans | Replace the two verbal plan cards with `QueryWork` (Figure 1). Keep actual matching events and delivery input beside the chosen route; vary estimate independently from actual input and expose repeated probes or retained hash keys. | The memory-key budget introduces schematic batching, while native spill evidence remains separately labelled. The model's estimate threshold and operation counts are invented teaching rules, stated plainly in its scope; it makes no PostgreSQL cost, page, work_mem or timing prediction. Native before/after plans retain the real 120,723/1,565 accesses. Later skew and prepared-plan cases need actual parameter/plan evidence, not a universal planner simulator. |
| RL89, partitioning | Replace fixed pruning cards with `Partitions` (Figure 1). Physical tables remain visible as query bounds, missing December and detached October change routing and parent membership. | The model reaches later missing-boundary and detach cases, preserving s7 in the detached table. A date at 1 November routes to November. Key uniqueness and attach/locking obligations remain concrete prose and native SQL; the aid assumes those prerequisites were met and does not suggest detach is free. |

## Integration and model verification

All new files are under
`src/components/explainers/relational-design-tools/`. Thin named Astro wrappers
select a local shared model shell. `model.mjs` holds computed relationships;
`views.mjs` renders their records and comparisons. The same default render runs on
the server, so an initial aid remains readable with JavaScript disabled. Controls
start disabled and are enabled only after the client listener is installed. Each
figure also includes a noscript equivalent and its bounded scope.

The CSS is scoped under `.rdt`. Tables have semantic captions and row/column
headers; scroll regions are labelled and keyboard focusable. Controls have native
labels, focus rings and no animation. Meaning uses exact values, ticks, crosses,
arrows, borders and words. Site colour tokens provide the light/dark treatment.
Narrow layouts stack panels and the effective-time lanes. Internal panel margins
explicitly override the article's large section gaps.

`node --test src/components/explainers/relational-design-tools/model.test.mjs`
passed 11 tests. The checks cover:

- fan-out with zero, one and two payments, including the LEFT JOIN summary boundary;
- cancelled outer matches and the non-equivalence of WHERE OR NULL;
- FALSE versus UNKNOWN and empty NOT IN input;
- timestamp peers, deterministic ROWS and the previous/current frame;
- both bitemporal boundaries and exactly one selected version for all 400 date pairs;
- offset repeats/skips, timestamp-only lost ties, moving rows and ID/value captures;
- composite tenant identity and independent CHECK/NOT NULL acceptance;
- every import row's outcome, contradiction repair and equal-version disagreement;
- partition boundary, absent destination and detached-table retention;
- schematic join probes, one-pass input and memory batches;
- server-rendered initial output for every new aid, without undefined/NaN values.

Initial model outputs agree with the existing workshop fixture: fan-out sums €90
against €45 stored purchases; ON retains s8 with NULL, WHERE loses it; NOT IN loses
o82 against an unknown ID; the first peer total is €60 versus ROWS €40; effective
9 October yields €20 known on 12 October and €22 known on 16 October; keyset after
the new o86 returns o83/o82; initial import applies b18 and retains b17 revision 8;
an ID-only partition lookup may visit both attached months.

## Review still required

The coordinator has exercised the early rendered join model and supplied two
layout repairs: replace headings inside figures with paragraph labels, and remove
inherited section gaps between internal panels. Both are applied. The author
opened a separate Chrome tab and confirmed the join's accessibility structure and
initial records, then closed that tab; stale browser contexts prevented reliable
screenshots/interaction checks in that session. This is not a rendered sign-off.

The coordinator still needs the full build, independent isolated-aid operation
before surrounding prose, assembled-page reading and the light/dark desktop/phone
visual matrix. No draft was marked ready, no status/registry/live-page file was
edited, and no commit or push was made. No coverage-map changes or new native
product claims were introduced.
