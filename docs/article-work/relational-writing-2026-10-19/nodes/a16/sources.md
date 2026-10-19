# a16 sources and observation record

Checked 20 October 2026. Draft: `article.astro`. Intended route:
`/review/relational-next/window-functions/`.

## Primary sources

- PostgreSQL 18, [Window Functions tutorial](https://www.postgresql.org/docs/18/tutorial-window.html):
  input rows, partitions, window versus presentation ordering, calculations after
  grouping, filtering a calculated result through a containing query.
- PostgreSQL 18, [Window Functions reference](https://www.postgresql.org/docs/18/functions-window.html):
  row_number, rank, dense_rank, LAG's absent-row default, peers and PostgreSQL's
  lack of IGNORE NULLS. Ranking and LAG depend on partition/order; aggregates use
  a frame. The article deliberately does not tour unrelated functions.
- PostgreSQL 18, [Window Function Calls](https://www.postgresql.org/docs/18/sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS):
  ordered default frame through the current peer group; explicit ROWS frame;
  datetime RANGE interval offsets and exactly one ordering expression; permitted
  SELECT/ORDER BY call positions. Used for the two visible frame contrasts.
- PostgreSQL 18, [SELECT](https://www.postgresql.org/docs/18/sql-select.html):
  logical clause semantics and PostgreSQL's syntax, which has no QUALIFY clause.
- PostgreSQL 18, [Sorting Rows](https://www.postgresql.org/docs/18/queries-order.html):
  explicit final ordering and PostgreSQL's descending-null-first default.
- PostgreSQL 18, [Aggregate Functions](https://www.postgresql.org/docs/18/functions-aggregate.html):
  SUM of non-null amounts, COUNT(*) versus COUNT(amount), and partial known totals.
- PostgreSQL 18, [Conditional Expressions](https://www.postgresql.org/docs/18/functions-conditional.html):
  NULLIF guards the zero denominator without declaring a zero percentage.
- Google BigQuery, [QUALIFY clause](https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax#qualify_clause):
  documentation-only comparison of a dialect spelling. BigQuery was not run.

All links were opened through the web tool during writing. No vendor other than
PostgreSQL is claimed as measured. No external prose was quoted.

## Native evidence

`verify.mjs` creates `rel3_a16_run1` on the authorised shared loopback server,
creates temporary fixtures, executes checks, and drops only that database in a
finally block. It does not change shared configuration or server state.

Observed server: PostgreSQL 18.6 (Homebrew), server_version_num 180006,
aarch64-apple-darwin25.6.0, 64 bit. Role staycurrent, host 127.0.0.1, port 57319.
Session time zone UTC; database locale C; read committed. No other session
overrides beyond setup's SET TIME ZONE UTC. Native observations are in
`native-results.txt`; success summary in `verification.txt`.

Seventeen result sets were checked against independent expected values, then
rerun after reversing insertion order in both fixtures. Results include:

- All six detail rows and account totals 25/7; latest events 5 and 6.
- Row positions 1,2,3,4; ranks 1,1,3,4; dense ranks 1,1,2,3 for North.
- Whole shop-day denominators 110 and zero; percentages 36.36,36.36,18.18,9.09
  and NULL; denominator changes 40,80,100,110 under item ordering.
- Explicit event totals 10,10,30,25,25; timestamp-peer totals 10,30,30,25,25.
- Moving row totals 10,30,70,110 versus date totals 10,30,60,90.
- Preserved-history report 25/25 versus prematurely cut input -5/-5.
- Latest-then-positive event 6 versus latest-among-positive events 3 and 6.
- LAG identity/value/default distinctions and changes NULL,NULL,NULL,-25,5.
- Combined final report North A:40/110/36.36/60, North B:40/110/36.36/40,
  South E:0/0/NULL/0.
- Missing-date predecessor, recorded versus zero-filled mean 45/30, missing
  contribution counts 0,1,1,1,1 and whole-group share invariants. Computed
  unrounded percentage sum agrees with 100 within 1e-12 percentage points;
  rounded percentages total 99.99.

The tiny fixtures establish answers, not physical plans or performance.

## Figures and teaching reference

The three fixed reference articles were read in full, including their figure
panels and transcripts at the reference preview on port 4337. The draft follows
their one-fixture progression, prediction before inspection, prose that names
the observed change, parameter changes that alter a result, and explicit
model/observation distinction. The actual parent a02 and siblings a13/a14/a15
were read to preserve the established prerequisites and scope boundaries.

The seven `WindowFigure` scenes use JavaScript models, not an embedded database.
All 78 scene/option/step states are checked for complete table shape and rendering;
native/model comparisons cover totals, ranks, shares, both running frames, every
moving step, LAG and filtering. Playback budgets count all visible rule text,
column labels, table cells, result and narration at 200 words/minute plus two
seconds of inspection. Controls stay in place across renders. Back/Next use
aria-disabled at endpoints to retain keyboard focus. No nested article section
elements are used inside the figures.

Standalone Astro compiler checks passed for the article and figure (zero
diagnostics). Root owns final placement, full build, browser visual proof and
independent review. No build output or shared files were changed by this worker.
