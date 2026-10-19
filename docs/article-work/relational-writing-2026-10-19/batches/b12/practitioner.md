# b12 — independent practitioner review

Reviewed 20 October 2026 using `staycurrent-review`, practitioner perspective.
a12 and a39 are narrow model-repair rechecks retaining their unaffected b11/b10
technical and native passes. a13 receives a full initial review against the
original relational-practice goal, actual a02 parent, available a14/a15 siblings
and a09/a10 contracts, and its supplied family plan. No other perspective's
report, teaching-reference articles or old relational corpus was read.

| ID | Practitioner verdict | Required repairs | Optional advice |
| --- | --- | --- | --- |
| a12 | Pass, narrow recheck | None; selected-account repair resolved | None new |
| a13 | Pass | None | None |
| a39 | Pass, narrow recheck | None; a39-P1 resolved | None new |

## a12 — Modelling history and data lifecycles

**Pass.** At the final correction step, the effective card now follows the selected
recorded account. The earlier cutoff displays €20 from 1 November onwards and
identifies the old assertion and its recording period. The later cutoff displays
€20 until 10 November and €22 thereafter, with the replacement recording period.
Both agree with their €20/€22 query result. The preceding correction stage still
shows the current replacement and both retained recording periods, appropriately.

Inspected the changed source and added display-state assertions; the 56-state
verifier passes. In fixed preview 4439, advanced Figure 4 and switched both cutoffs
at the final step. Both cards, recording selection and result agree; the step
remains fixed. Prose, SQL and player hashes are unchanged from b11. Retain b11's
native boundary/reference/removal and family assessments; no native rerun needed.

## a39 — Backing up and restoring relational data

**Pass; a39-P1 resolved.** Missing-WAL narration now distinguishes the source's
marker from a target this restore cannot reach. At deletion it supplies no
accepted earlier state; at the final order it explicitly cannot supply the
missing facts. The complete-archive path retains the recovered-101 versus
excluded-104 trade-off.

Independently checked the marker/deletion/final source branches and stepped the
missing-WAL path in fixed 4439, then switched to the complete path at the same
final step. Every blocked panel and narration agree; no recovered target is
implied for incomplete history. Prose, visible data, player and native harness
hashes are unchanged. Retain b10's independently executed full/target recovery,
manifest, checksum, missing-WAL and cleanup evidence. No repeated restore needed.

## a13 — Getting SQL values right

**Pass.** The article supplies useful expression depth after the parent's staged
report. It reuses that report's actual five candidates, amounts and placement
order, adding explicit proposed fee and label inputs. It does not substitute the
join sibling's customer-level payment facts. Expected values and selected IDs
precede execution, with zero, credit and unknown exclusions retained as checks.

Null logic preserves the distinction between a predicate's UNKNOWN and WHERE's
decision to discard it. Negation does not recover unknowns; explicit missingness
and null-safe distinctness implement different stated policies. Only absent
receipt totals justify zero here. CASE states, compatible result types, empty
labels and NULLIF guards preserve business meaning. Boolean reordering, constant
folding and aggregate evaluation correctly limit conditional-guard claims.

Arithmetic separates operand types, intermediate loss/overflow, approximation
and contractual rounding. Casting an already truncated or overflowing result
cannot repair the earlier operation. Per-line versus final rounding, negative
ties and zero denominators make the decisions observable. The article does not
confuse printed precision with storage or business policy.

Text equality, declared ICU search and LIKE syntax remain different contracts.
The literal-search recipe escapes its escape character before percent/underscore;
binding values does not remove wildcard semantics. C/ICU, canonical Unicode forms,
padding and provider/version dependence are qualified. A forgiving match does
not establish customer identity. Conversion syntax/type inference is separated
from already typed text and from domain validation; syntax-valid exponent input
does not satisfy the stated fixed-point import contract automatically.

Time examples derive two local midnights separately and compare resolved instants
half-open. Both transition days, exact bounds and fractional seconds are covered.
Interpretation versus display directions of AT TIME ZONE, ignored offset on plain
TIMESTAMP, automatic ambiguous/nonexistent resolution and the application's
stricter input policy are accurately separated. Calendar days, elapsed hours,
month clamping and transaction/statement/wall clocks answer distinct requirements.
This is sufficient ordinary reporting depth without a general calendar branch.

### Independent native and model checks

Read both native scripts and the owned SQL strings, model and renderer before
execution. Ran `nodes/a13/verify.sql` followed by `assert.sql` in separate sessions
on one fresh own native PostgreSQL 18.6 database, UTF8/C, UTC/ISO DMY baseline.
No retained output was overwritten. Independent results include:

- Exact report rows 101/Mina/charged/16.01, 102/Mina/waived/20.00,
  106/Edda_100%/undecided/NULL; unfiltered amounts also retain 100=0 and 103=−2.
  Handwritten EXCEPT ALL comparisons, ordered identities, rounding and guarded
  division assertions passed.
- All null-policy truth values and fee states agree. Integer division gives
  2/−2, decimal division 2.50, per-line/per-order rounding 0.02/0.01, negative
  tie −1.01, truncation −1.00 and widened product 2,500,000,000.
- Exactly six deliberate failures occurred: two integer overflows, invalid
  numeric text, missing text=integer operator, unused constant division by zero,
  and numeric/text CASE conversion. No additional error was accepted as expected.
- C/ICU comparisons returned false/true/false/true; text/padded-char comparison
  false/true. ICU provider, `und-u-ks-level1`, nondeterminism and collation version
  153.136 match the retained evidence. Name/pattern selections are A; A+B; C+D; C.
- Numeric cast/truncation and DMY/MDY conversions agree. Row-dependent syntax
  validation returns unavailable for `twenty` while accepting `1e2` as syntax,
  without claiming that input satisfies the fee policy.
- Spring bounds select 202/203; autumn selects 202/203/205 and its fixed-24-hour
  comparison misses 203/205. Gap/repeated readings resolve to the stated UTC
  instants. Explicit autumn offsets differ by one hour. Calendar next-noon takes
  23/25 elapsed hours; 24-hour arithmetic displays 13:00/11:00. January month-end
  and reference-clock observations agree.

Independent outputs remain under
`/private/tmp/rel3_prac_a13_1792450058384507000-verify.txt` and `-assert.txt`.
The fresh database was dropped after both sessions, removing its local collation;
the shared server and configuration were not altered.

Ran the model's 51-frame and truth-table checks. In an own Chrome tab on fixed
4439, stepped all six figures to their result and changed all seventeen choices
there. Predicate values/retention, invented defaults, arithmetic intermediates,
matching identities, UTC-boundary inclusions and calendar lanes agree with native
observations and the stated contract. Choice changes preserve the step. The
models are calculation explanations, not physical SQL execution traces.

Primary checks included PostgreSQL 18's
[expression evaluation](https://www.postgresql.org/docs/18/sql-expressions.html#SYNTAX-EXPRESS-EVAL),
[conditional expressions](https://www.postgresql.org/docs/18/functions-conditional.html),
[common result types](https://www.postgresql.org/docs/18/typeconv-union-case.html),
[arithmetic](https://www.postgresql.org/docs/18/functions-math.html),
[collations](https://www.postgresql.org/docs/18/collation.html),
[pattern matching](https://www.postgresql.org/docs/18/functions-matching.html),
[input validity](https://www.postgresql.org/docs/18/functions-info.html#FUNCTIONS-INFO-VALIDITY),
[date/time operations](https://www.postgresql.org/docs/18/functions-datetime.html)
and [transition resolution](https://www.postgresql.org/docs/18/datetime-invalid-input.html).

a09 retains stored representation, a10 enforcement, a14 joins/aggregation,
a15 membership/composition, a04 actual driver/binding behaviour, and performance
the plan/workload questions. The article deepens the parent's checked stage
without requiring those other specialist walkthroughs or duplicating their work.
No scope repair or new child is needed.

## Scope and handoff

All three snapshots match rendered sources and all thirteen manifest hashes
remain unchanged. No article/component edits, build, commit, retained-evidence
overwrite or shared-server changes were performed. No download link was clicked.
The own browser tab is closed and preview 4439 is released. All three articles
pass the practitioner gate; no repair recheck is requested.
