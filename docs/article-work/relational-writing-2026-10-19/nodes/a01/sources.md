# a01 — sources and execution evidence

Checked 19 October 2026. This is evidence for the staged draft, not an approval or publication record.

## Primary documentation

- [PostgreSQL 18: Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html): primary-key uniqueness and required values; row checks and their null result; composite foreign keys; required versus optional references; independent parent existence; RESTRICT deletion; the limit of CHECK for other-row state. The article keeps capacity explicitly outside its schema's enforcement.
- [PostgreSQL 18: Numeric Types](https://www.postgresql.org/docs/18/datatype-numeric.html): numeric precision/scale, rounding on assignment, NaN and infinity. The article's bound `fee_eur < 1000000` rejects NaN as well as enforcing the business range. Fractional-cent input still needs a policy before scale coercion.
- [PostgreSQL 18: Date/Time Types](https://www.postgresql.org/docs/18/datatype-datetime.html): `timestamptz` represents an instant, converts explicit offsets, does not retain a named input zone, and renders in the session zone.
- [PostgreSQL 18: Table Expressions](https://www.postgresql.org/docs/18/queries-table-expressions.html): multiplicity of joins, left-join unmatched rows, and placing the booking-status predicate in ON.
- [PostgreSQL 18: Aggregate Functions](https://www.postgresql.org/docs/18/functions-aggregate.html): `count(expression)` counts non-null inputs, so an unmatched left-joined session counts zero bookings.

The booking contract, functional-dependency reasoning and lifecycle examples are an invented design and explicit consequences of its requirements. They are not claimed as engine observations or a universal schema. The two-request capacity sequence is labelled illustrative; no concurrent test or protection protocol is claimed here.

## Native execution

Used only database `rel3_a01_run1` on the orchestrator-owned disposable server at `127.0.0.1:57319`. No shared server settings were changed; no session overrides were applied. Each `psql` process exited.

Observed runtime: PostgreSQL 18.6 (Homebrew), aarch64-apple-darwin25.6.0, compiled by Apple clang 21.0.0, 64-bit. Session TimeZone: UTC. `pg_database.datcollate` and `datctype`: C.

Retained reproducible inputs:

- `src/components/relational-next/a01/schema.sql` — exactly the schema displayed in the article, imported as raw text.
- `src/components/relational-next/a01/fixture.sql` — exactly the collapsed fixture displayed in the article.
- `src/components/relational-next/a01/verify.sql` — rejected changes, assertions, a rolled-back over-capacity counterexample and the three final changes.

In a fresh disposable database, run the files in that order with psql `--no-psqlrc` and `-v ON_ERROR_STOP=1`. The verification mutates its own fixture into the final state; it is not intended to rerun against an already-mutated fixture.

| Check | Observed result |
| --- | --- |
| Four tables and fixture load | Accepted |
| Same member code in two tenants | Accepted by fixture |
| Same member code within one tenant | Rejected, 23505 |
| New booking ID for existing customer/session pair | Rejected, 23505 |
| Missing customer | Rejected, 23503 |
| Tenant 1 booking referencing tenant 2 customer 9 | Rejected, 23503 |
| Tenant 2 customer referencing tenant 1 session 21 | Rejected, 23503 |
| Null booking customer | Rejected, 23502 |
| Zero capacity / missing capacity | Rejected, 23514 / 23502 |
| Negative fee / NaN fee | Rejected, 23514 / 23514 |
| Infinite session start | Rejected, 23514 |
| Unknown booking status | Rejected, 23514 |
| Merge customer 8 into 7 while both have S21 records | Rejected, 23505, including the cancelled record |
| Delete referenced customer / session with RESTRICT | Rejected, 23001 / 23001 |
| Baseline S21 roster | One row: B11, Mina Shah, 20.00 |
| Baseline per-session occupied-place counts | S21=1, S22=1, S23=0 |
| Customer with no bookings | Accepted |
| Reactivate Jon and add third booked customer to capacity-two S21 | Accepted, count=3; proves this schema does not enforce capacity. Rolled back. |
| Assign 20.005 to numeric(8,2) | 20.01 |
| Correct customer, raise offer, cancel B11 | Three successful updates |
| Final B11 | Mina Patel; cancelled; agreed=20.00; current offer=22.00 |
| Final S21 active roster / occupied count | Empty / zero |

During instrumentation, `SHOW lc_collate` failed because PostgreSQL 18 does not expose that setting; changed to the database catalogue query above. The initial test expectation for RESTRICT used the generic foreign-key code 23503; the native operation reported restrict violation 23001, and the retained test was corrected. The final complete verification execution exited zero with every assertion passing. These were evidence-script repairs, with no schema or prose claim changed to fit a failure.

## Initial draft model and rendering

Read all three fixed reference articles in full, including the figure descriptions and listings: Sequence diagrams, Indexes, and Storage and durability. Inspected their reference previews and screenshots at the lifelines, composite-index and WAL sections. Used their concrete running case, prediction/change/observation pattern, theme variables and explicit boundary between models and execution evidence.

The a01 ownership figure models the same four sequential states in two designs: copied current names versus a name owned once on the customer; then a changed session offer and a cancellation. It is labelled as an illustrative model. It runs no SQL and offers no concurrency evidence.

Astro compiler transformed the staged article and owned component with zero diagnostics. The article was promoted for preview by the orchestrator, not by this worker. Browser preview at `/review/relational-next/data-design/` loaded the schema imports and interactive component. Browser actions confirmed copied B11/B12 disagreement after the correction; selecting owned storage at that step moved the name to C7; the next step changed current fee to 22.00 and kept agreed fee 20.00; the last step cancelled B11 and retained its agreement. Focus remained on Next at the final endpoint after the control changed to aria-disabled. Timed playback changed Play to Pause, advanced through cancellation, stopped at the final state and restored Play changes while retaining focus on that button. Figure headings were replaced with styled paragraphs in response to integration inspection, and inherited section margins were overridden after screenshot inspection. Full build, narrow-screen checks and independent review are orchestrator responsibilities.

## B01 teaching-review repairs

Applied the updated staycurrent-write skill and required a01 findings in `batches/b01/teaching.md`. The practitioner review passed and no specialist scope or schema was expanded.

Added `src/components/relational-next/a01/KeysFigure.astro` before the DDL, in the identity/scope explanation. It keeps the customer, candidate booking and session rows visible, with complete tuple keys and individual check results. The original B11 is considered before any booking exists. The other cases start with B11 stored. B99 changes its row identifier but repeats the business key; B14 requires customer (1,9) while the displayed existing customer is (2,9). The illustrated check sequence is explicitly explanatory, not a claim about engine constraint order.

Retained `verify-keys.sql` in the owned component directory. Ran it with psql `ON_ERROR_STOP=1` against `rel3_a01_run1`, using the unchanged schema. The transaction temporarily removes that database's three booking rows, inserts original B11, checks the failures, then rolls back to the previous fixture state. Result: B11 accepted; B99 rejected with 23505; B14 rejected with 23503, with assertions confirming that (2,9) exists and (1,9) does not. Script exited zero. No session or server settings changed.

Ownership is now Figure 2. It retains two columns at 390px, uses compact labels, replaces the long step list with a step counter, and places transport directly below narration and the facts. Nonessential instructions are collapsed. This is a layout change, not a different ownership or history model.

Chrome browser checks on the root-promoted repair preview at 4337:

- All three key-model decisions matched the executed checks, including intermediate duplicate-business-key and cross-tenant-reference explanations. Final Next check retained focus.
- At 390 × 844, the ownership figure measured 596px rather than the review's approximately 1,095px. At copied-name correction, both booking cards occupied y211–317, narration y327–394 and controls y405–443. Both conflicting names, narration and transport were visible together.
- At the owned final state, customer/session cards, both bookings, narration and transport were also visible together. Enter on final Next retained focus on Next. Offer was €22.00, B11's agreement €20.00 and status cancelled.
- The compact new key figure measured 747px at that width. Page horizontal overflow was zero.
- Playback now uses recursive timeouts, with each hold `max(7500, 3500 + narration_words * 300)` milliseconds. The fixed 1.8-second interval was removed. Manual stepping and changing storage stop playback; changing storage preserves the current step.
- One timed attempt was interrupted/reset by shared development HMR while other writers edited components. A subsequent copied replay was still on its initial explanation after approximately 6.9 seconds and on the corrected-name step, still playing, after approximately 13.7 seconds. Later browser inspection showed final cancellation with Play restored. This confirms slower progression, but a complete isolated timing matrix for both storage choices is left to the root's fixed-preview independent recheck, as instructed by the orchestrator.
- Screenshots checked the compact phone comparison in the system's dark theme. The browser was returned to System theme and its normal viewport after testing. A light-theme switch was restored; its screenshot was at the page header, so it is not claimed as new light-theme figure evidence.

The staged article and both owned Astro figure files transformed with zero diagnostics after the repair. Root owns the full build, fixed preview and independent recheck. No new primary-source claim or schema change required re-running the original unrelated fixture matrix.
