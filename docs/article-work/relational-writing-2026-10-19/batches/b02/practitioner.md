# b02 — independent practitioner review

Reviewed 19 October 2026 using `staycurrent-review`, practitioner perspective.
a00–a02 are narrow repair rechecks retaining b01's unchanged findings. a03 is an
initial full review against the original relational-practice goal, supplied
parent/sibling/child plans and available family drafts. No other perspective's
report, teaching-reference articles or old relational corpus was read. No
article, component, retained engine evidence, commit or publication state was
changed.

| ID | Practitioner verdict | Required repairs |
| --- | --- | --- |
| a00 | Pass | None; retain b01 correctness and scope pass |
| a01 | Pass | None; new key/reference decisions agree with SQL |
| a02 | Pass | None; new stages and boundary semantics agree with SQL |
| a03 | Repair | One worksheet boundary/expectation inconsistency, a03-P1 |

## a00 — Relational databases

**Pass, narrow recheck.** Article snapshot, SQL, model and verifier hashes are
unchanged from b01. The changed component labels/pacing/focus do not alter the
mechanism or output semantics previously verified. The internal figure headings
are now labels, resolving the recorded structural issue; root reports the full
build/audit passes. Retain the b01 practitioner pass without rerunning its
unchanged native suite. Playback, focus and mobile presentation remain with the
independent teaching recheck.

## a01 — Designing relational data

**Pass.** The new key model correctly separates row identity from business
uniqueness and a complete tenant-scoped reference. It shows the required
`(1,9)` separately from the available customer `(2,9)`, rather than allowing an
unscoped customer number to satisfy the reference. The authored order of checks
is explicitly labelled as explanatory, not PostgreSQL's enforcement order.

Read the new component and `verify-keys.sql`; independently loaded the unchanged
schema/fixture into a fresh native PostgreSQL 18.6 database and ran the new
checks. Original B11 was accepted; B99 failed business-key uniqueness with
23505; B14 failed the complete customer reference with 23503. The review database
was removed afterwards. In my own Chrome tab on fixed preview 4437, stepped all
three cases to their outcomes and compared the displayed full keys, rule results
and accepted/rejected decision with those SQL outcomes.

The added model deepens the parent's existing identity explanation without
taking conditional constraint design from a10 or query instruction from a02.
Schema, fixture and original verifier hashes remain unchanged; retain the rest
of b01's correctness/depth/boundary pass. No new optional practitioner advice.

## a02 — Working with SQL

**Pass.** The new report model keeps source line and receipt identities visible,
then separately reduces each detail set to one subtotal per order. It correctly
distinguishes a missing payment subtotal from a stored zero and leaves an absent
line subtotal unknown. Five candidate identities persist through balances;
settled rows are retained only as explicitly faint comparison rows at the final
filter. All four input choices agree with the actual report's contract.

Read the new report component, revised model, player, paging renderer and
verifier additions. Independently checked all new report choices and their
intermediate native values against `reportModel` in a fresh PostgreSQL 18.6
database, then removed it:

| Input choice | Final due values by retained order |
| --- | --- |
| Original | 101:15, 102:20, 106:NULL |
| Extra receipt 204 for 5 | 101:10, 102:20, 106:NULL |
| Extra receipt 204 for 15 | 102:20, 106:NULL; settled 101 removed |
| First line for 106, amount 10 | 101:15, 102:20, 106:10 |

On fixed preview 4437, stepped source → subtotal → balance → final stages and
changed each input at the balance stage. The visible values and final retained
orders matched those native results. The revised paging presentation correctly
keeps the saved boundary after `(10 Jan 09:00 UTC,101)` while showing row 102
moved to 5 January before it; the keyset page is then 105/106. The model's
pagination calculation is unchanged, so b01's eight verified SQL outcomes remain
applicable. This presentation does not imply that the cursor freezes the data.

**b01 optional a02-O1 resolved:** the check section now explicitly separates
`pg_typeof` from the EXCEPT ALL value/multiplicity comparison and explains
compatible-type conversion. This matches the previously checked
[PostgreSQL type-resolution contract](https://www.postgresql.org/docs/18/typeconv-union-case.html).
The complete report SQL is byte-for-byte unchanged. Parent/child responsibilities
remain sound, including a14's small-WITH prerequisite. No new optional advice.

## a03 — Making concurrent changes correct

**Repair.** The principal reservation SQL, concurrency explanation and failure
distinctions are sound. One reader worksheet needs its enforcement boundary made
as explicit as the prose's all-writers argument.

### Required a03-P1 — State or repair the invalid state left by the uniqueness case

Locations: snapshot `a03.astro:144–148`; `verify.py`, case “uniqueness covers two
initially absent rows”; source record's corresponding observation row.

The “Initially absent identity” worksheet resets the exercise, then has A insert
a reservation and commit without decrementing its class counter. B's duplicate
is correctly rejected, but A's accepted insert leaves class 21 with
`remaining=1, reserved=1, capacity=1, agrees=false`. I independently executed that
successful-A end state on native PostgreSQL 18.6 and observed:

```text
place_id | remaining | reserved | capacity | agrees
21       | 1         | 1        | 1        | false
22       | 1         | 0        | 1        | true
```

The source notes explicitly call this an isolated uniqueness test that does not
maintain the counter. That qualification is absent from the reader's worksheet,
immediately before the instruction to check the full invariant after each
reservation case. Only the stale-overwrite case is explicitly presented there
as leaving an invalid state. The verifier asserts one request identity, rather
than checking or labelling this additional failed counter invariant.

Either make both uniqueness attempts follow the complete reservation protocol
(decrement each attempt's class within its transaction, insert the shared
request identity, roll B back after rejection, and assert both final class
invariants), or label the existing worksheet row explicitly as an isolated
constraint test that deliberately bypasses the counter protocol and state its
expected `agrees=false` outcome. Align the following checking instruction and
retained evidence with the chosen boundary. No new lesson or general constraint
tutorial is needed. This repair prevents readers confusing successful
uniqueness enforcement with a valid reservation change.

### Correctness, depth and boundaries otherwise pass

The article states the full counter/ownership invariant and enumerates the
writers before choosing protection. It demonstrates why atomicity and
non-negative row checks leave stale decisions uncovered, then provides a complete
guarded UPDATE-result-to-INSERT operation with meaningful success, zero-row and
abort outcomes. It correctly makes cancellation, moves, capacity edits and staff
tools part of the coverage argument. Its stable-row discussion specifically
requires a following Read Committed statement for the fresh count, rather than
claiming lock acquisition refreshes every isolation snapshot.

The staffing example is a useful distinct multirow dependency. Stable snapshots
and distinct written rows do not suffice; the serial-equivalence argument
requires correct individual transactions and relevant writers participating.
Neither a fixed victim nor a fixed error point is promised. Version visibility,
write arbitration and nonblocking Serializable predicate-dependency detection
are accurately separated. Checked against
[PostgreSQL isolation](https://www.postgresql.org/docs/18/transaction-iso.html),
[locking](https://www.postgresql.org/docs/18/explicit-locking.html) and
[complete-transaction retry guidance](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html).

Known abort, business refusal and uncertain commit are usefully distinct. The
withheld-reply experiment establishes a committed case the client cannot infer
from its connection failure; it is not claimed as a server crash. The durable
log and provider panels are explicitly models of contracts not observed crash
or payment results. The outbox claim covers recorded intent while retaining
delivery uncertainty. Checked primary sources included
[connection status](https://www.postgresql.org/docs/18/libpq-status.html),
[protocol flow](https://www.postgresql.org/docs/18/protocol-flow.html),
[data-modifying WITH](https://www.postgresql.org/docs/18/queries-with.html#QUERIES-WITH-MODIFYING),
[WAL settings](https://www.postgresql.org/docs/18/runtime-config-wal.html) and the
pattern author's [transactional outbox](https://microservices.io/patterns/data/transactional-outbox.html).

Actual a00's orientation and a01's deliberately unenforced capacity boundary now
have a substantive transaction owner. a02 supplies the needed statement and CTE
notation; a03 names data-changing WITH/RETURNING at first use. The class exercise
is explicitly smaller than a01's booking schema. a18 retains detailed lock
protocol construction and acquisition procedures; a19 retains deeper isolation
and cross-engine comparison. Client retry machinery, request identity semantics
and delivery/reconciliation remain a04; operational recovery remains a07. The
parent supplies a complete ordinary reservation path before those links, and
does not expand into the parked distributed-systems programme. No further branch
is justified.

### Independent a03 evidence

Read the complete snapshot, full own plan, a18/a19 plans, available parent/design/
SQL drafts, source record, writer report, setup, session coordinator, retained
observations and all three figure components. Ran the complete owned coordinator
in a new `rel3_a03_runN` native PostgreSQL 18.6 database. All its asserted
observations passed, including displayed WITH SQL, rollback/visibility, stale
overwrite, guarded contention, observed lock checkpoints followed by fresh count,
concurrent uniqueness, both staffing levels, repeated reads, deadlock and the
completed COMMIT reply deliberately withheld. My deadlock victim was A rather
than the retained transcript's B, consistent with the article's stated limits.
The proxy closed and all sessions ended; removed only that review database.
The additional invariant probe above isolates the missing worksheet expectation.

In my Chrome tab on fixed preview 4437, checked the stale endpoint 0+2 against
capacity 1, switched to the guarded endpoint 0+1 at the same step, and inspected
B waiting while A records ownership. The staffing endpoint switches from both
unavailable to Tariq available and a new count of one. All four commit/provider
failure points distinguish stored state from application knowledge as described.
Those displayed model outcomes agree with the selected native cases and stated
contract boundaries. No new optional practitioner advice beyond a03-P1.

## Review scope and handoff

All four article snapshots matched their rendered source fragments; every
component hash matched the b02 manifest. Browser work used only the stable built
preview on 4437, in my own tab. Unchanged b01 SQL suites and the whole-site build
were not rerun. Presentation, pacing, keyboard and mobile quality belong to the
independent teaching review. A narrow a03-P1 recheck is sufficient after repair;
the unaffected SQL, model and family assessments need no repeat full review.
