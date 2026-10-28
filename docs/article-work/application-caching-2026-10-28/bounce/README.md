# Coloured requests and a database join

The user asked to replace mugs, built cards and parallel panels with one simple
scene: coloured request balls, a database joining tables on the first miss, and
the result ready in the cache afterwards. This prototype replaces the preview at
`/review/application-caching/rethink/`. Earlier sources remain recoverable.

The first coral ball follows browser → server → cache miss → server → database.
The two P7 rows feed a blue/gold joined-result symbol. The request returns via
the server, fills the cache, and replies. Eight later coloured balls use the cache. The
database stays still. Table rows and the cached result are retained when copied.
The source's result symbol is a visual explanation of the join, not another
persistent database cache. Colours distinguish requests; they all ask for the
same result. The source colours denote the two inputs, not query-plan operators.

## Example extension

This is an explicit relational decomposition of the existing north/P7 example:
Products supplies the English name and Prices supplies GBP 2000 pence. Joining
on shop and product id, filtered by locale/currency, yields the existing product
representation. No price, key, ownership or TTL fact changes. All requests are
within one cache lifetime without updates. The figure now uses generic App and Cache role labels; Redis remains one possible implementation.

`join-check.py` executes that query in an owned in-memory SQLite fixture, closes
it, and checks a wrong-shop counterexample. This establishes the example's data
relationship only, not Redis execution, PostgreSQL behaviour or real timing.
The animation is a simplified cache-aside illustration, not a query plan or
latency benchmark. It deliberately omits intermediate network packets.

## Visual direction

One quiet scene; no changing headings, steps, counters, card construction or mugs.
Larger coloured spheres have a small highlight, a soft contact shadow, short
direction trails and slight squash. Curved travel and small arrival rings supply
motion. The query's matching rows are the only database parts that wake up.
Phone layout has its own compact geometry and full-size labels, rather than a
shrunken desktop picture. Existing player retains automatic finite playback,
visibility/background suspension, reduced-motion final frame and pause/replay.

The prior controlled-comparison concept was rejected; its independent review is
not an aesthetic judgement of this version. Current rendered checks follow below.

A scoped independent Chrome review observed the first database response travelling
through the server into Redis, and a later request returning through the server
with a copy while Redis retained its own result. It flagged the source result
remaining after the first join: that transient glyph now clears when the first
request leaves the database (age 5.5). Source rows remain. The newer warm cadence
has eight overlapping later requests, each with its own colour and response copy.
Labels have a small paper-coloured outline so routes cannot cross their letters.

## Final checks

- SQLite 3.54.0 query check passed; north P7 returns Blue mug, 2000 pence, GBP.
  The missing-shop-join counterexample returns two rows, as expected.
- 511 rendered frame samples are finite in both layouts. Warm requests start
  after the first reply and cache fill; all nine requests finish within playback.
- Draft build passes all 14 error rules. The same 36 unrelated dense-prose
  warnings in 16 pages remain. The existing preview route/gate is unchanged;
  normal reading and publication state remain unchanged.
- Coordinator inspected 1280 × 720 and 375 × 900 in both themes. Phone geometry
  uses a 401 px-tall stage and has no horizontal overflow. Paused warm frames show
  two coloured requests, the retained Redis result, and an empty database join
  socket with unchanged rows. Thus the accepted source-result repair is confirmed.
- Keyboard pause and resume work; unchanged shared-player checks cover replay,
  reduced motion, visibility and cleanup. No new browser reduced-motion emulation.
  Original System theme and viewport were restored.
- Label correction: replaced North with App and Redis with Cache, removed the
  implementation logo, and aligned the caption, introduction and accessible
  description. Desktop and phone layouts checked; draft build passes with the
  same existing warnings. Data, motion and cache-aside behaviour are unchanged.
  The earlier Redis wording above records the original review. Current label
  proof is `screens/labels-desktop.jpg`.

Screenshots are in `screens/`. Aesthetic judgement remains with the user; neither
technical validation nor the scoped review claims that this is the final style.
