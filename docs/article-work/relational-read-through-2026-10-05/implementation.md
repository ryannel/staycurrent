# Relational collection: implemented improvements

Implemented on 5 October 2026 after the user authorised the
[read-through plan](improvement-plan.md). Status: ready as working drafts after
independent review. The initial audit and its skill changes remain separate;
this follow-up changes the articles, their aids and practice downloads.

## What changed

All four prioritised repairs are complete, along with the retry reference:

- Schema design explains the receipt query’s short table names, qualified fields,
  calculated output and ordering. Constraints names the columns in multi-column
  inserts, explains the value mapping, and explains the NaN exclusion syntax.
  JSON introduces its temporary sample rows and cast notation before the probe.
- Tables and JSON finishes the capacity decision. Its intermediate number check
  remains visibly incomplete; the worked final design validates whole JSON numbers
  in the positive integer range, moves P7’s capacity into `mug_details`, removes
  the JSON copy atomically, and queries/indexes the typed value. A result table
  covers missing, null, string, fraction, nonpositive and overflowing inputs.
  It distinguishes input rejection from integer storage and required details from
  the still-unimplemented product-kind rule.
- Example resets are visible in the main pagination and transaction narratives.
  The introduction’s C4 index entries now locate O12 (€36) and O13 (€44), matching
  schema design. Other index-only orders use O21–O23, avoiding collisions with
  the later teaching schedules.
- A four-event static figure shows a stale whole-object replacement losing a
  committed edit, then compares an expression using the current stored object.
  It uses finish and material rather than capacity because the final catalogue
  has moved capacity out of JSON. Independent readings prompted an explicit
  current-column argument inside the figure; the article explains the path and
  JSON-string arguments beside the runnable update.
- The retry article ends with a six-case reference mapping evidence to knowledge
  and action. Pending outcomes and the original operation identity remain explicit.
  A subsequent fresh reading also prompted `BEGIN ISOLATION LEVEL READ COMMITTED`
  before the first claim, so copying it cannot autocommit a provisional order.

Selected optional repairs are complete: agreed prices stay visible in the third
normal form figure; the composite-reference paragraph names its two-order source
and a crossed pair; the missing-value wording identifies a row value; an optional
pagination query selects two headers before retrieving their three lines; the
checkout tour is available in the switcher/map and labels its simpler independent
schema; its stock-one lookup explicitly returns to before Alice’s purchase; and
Tables and JSON offers Queries and joins as the next reading. The JSON fallback
now prints the actual `->` and `->>` operators.

The download and practice instructions now prescribe individual statements or
SQL script mode. A technical check found that sending the pagination file as one
server query changes its transaction boundaries and fails a later isolation start.
The review skill’s protocol reference records this execution distinction and the
need to put transaction starts before their first copied writes. Its Claude mirror
matches, and the skill validator passes.

## Scope decisions

The optional product-kind conditional schema and further partial-fulfilment SQL
remain deferred. The former would extend the catalogue model beyond the capacity
choice; the latter would extend the existing application-decision example rather
than repair a demonstrated gap. Isolation’s shared-control-row table already
answers the Repeatable Read question. No further widget or paired schedule was
needed. Planned articles remain planned outlines.

## Evidence and independent challenge

- [Sequential reader](implementation-first-reader.md): all eleven substantive
  pages, in order, with questions preserved and final bounded rereads. The report
  identifies the build timing boundary and distinguishes HTML extraction from
  live browser evidence. No material concern remains after repair.
- [Editorial review](implementation-editorial.md): complete JSON argument and
  other changed passages; its path/value and composite-example findings are resolved.
- [Isolated figure reading](implementation-stale-media.md) and
  [fresh figure recheck](implementation-stale-figure-recheck.md): the causal
  sequence and current-object alternative are now followable independently.
- [Capacity evidence](implementation-capacity-evidence.md) and
  [final technical review](implementation-capacity-final-review.md): 28 input
  probes, exact article execution, 19 migration cases, 19 intermediate-check cases,
  failed-migration rollback, compatible query/index declarations, and both sequential
  lost-edit alternatives. Numeric fractions can round during direct integer input;
  the explicit input policy rejects them before conversion.
- [Other SQL evidence](implementation-other-sql-evidence.md): 25 checks covering
  named constraint writes, the €36 receipt, orders/lines pagination and retry
  branches; targeted final claim execution separately verifies fresh success,
  insufficient-stock rollback and duplicate recovery with the source’s own BEGIN.
  Executable scripts and JSON results accompany those records. The runtime was
  PostgreSQL 18.3 in PGlite 0.5.8. This is single-session execution, not a reproduced
  multi-session lock wait or performance measurement.
- [Browser inspection](implementation-browser.md): themes, responsive layouts,
  JSON diagnostic states, navigation and keyboard scrolling.
- [Built-link check](implementation-built-links.json): all 371 internal links
  across eleven pages resolve, including fragment targets and downloads.

The final `pnpm build` produced 50 pages. `git diff --check` passed. Draft/noindex
status is retained. No commit or deployment was made.
