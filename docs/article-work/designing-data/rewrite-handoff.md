# Schema-design rewrite · 4 October 2026

The user rejected the first modelling article after its independent reviews. It
explained an already-chosen shop design without sufficiently introducing schema
design or teaching how to produce a normalised schema. The earlier readiness
verdicts are historical evidence, not approval of that article's teaching approach.

The rewrite introduces schema versus data and the purpose and appearance of a
normalised design before using the shop. The constructive path establishes row
meaning, identities and dependencies, then actually separates repeated entries,
partial-key facts and product/customer facts. It covers anomalies, lossless
reconstruction, history, arbitrary fragmentation and deliberate denormalisation.
The receipt SQL and shared practice schema are unchanged.

Seven new static illustrations supplement the existing relationship map and
name/price experiment. Exact tables, labels and connections are code-native so
their mappings remain readable and responsive in both themes. Each diagram shows
a change or relationship; pictures are visually distinct from controls.

## Review and repairs

- An independent informed review assessed technical correctness and the reader's
  ability to apply the design process, rather than just fidelity to the commission.
  See `rewrite-review.md`. The meaningful finding was that O13's identical
  quantities hid the bad-join example. Different agreed prices now expose it,
  supported by a new join diagram. The reviewer checked that repair.
- A fresh reviewer saw the first six new figures in isolation, then the whole
  article. They correctly identified their transformations. Their two initial
  uncertainties concerned whether underlines represented a composite key and
  where agreed prices went. The prose already explained both; the diagrams now
  also state those facts directly. They exercised the name/price experiment and
  found no substantive remaining comprehension failure.
- A separate reader saw only the new join figure, without the article or intent.
  They read the two correct matches and four ambiguous order-only matches as
  intended. They noted that the lines float between the aligned records; this
  was not a misunderstanding and the geometry was retained.
- The formal overlapping-key definition of 3NF remains available in a disclosure
  after the worked explanation. No essential step depends on reading it.
- Browser inspection corrected mobile labels that ran words together when line
  breaks were hidden, and added an explicit scrolling hint for wide small-screen
  tables. Keyboard ArrowRight advances the table's labelled region.

## Evidence

Final `pnpm build`: 54 pages. The article has no duplicate IDs, and its 13 local
links resolve. The existing exact-source SQL runner passed 38 statements/probes
after the rewrite. Two additional real PostgreSQL queries confirmed two complete-key
matches versus four order-only matches; results are in `rejoin-results.json`.

The rendered article and diagrams were inspected on desktop and in 320px built-page
fixtures with both light and dark styles. Neither theme produced page-wide
horizontal overflow. Wider tables scroll within focusable regions (observed
scrollLeft 0 → 40). Responsive figures stack their panels. Screenshots are in
`screenshots/normalisation-overview.png` and `screenshots/rejoining-records-dark.png`.

The independent reviews support handing this revision back as a working draft.
They do not establish that the user has accepted it as a benchmark. The writing
reference now records the rejected approach and the reasoning behind this revision
so future commissions can learn from the actual feedback.

## Illustration style pass

The user noticed that the rewrite had lost the agreed restrained technical sketch
style. Exact data did not require abandoning that direction. The eight static
figures now use drawn sheet outlines, lightly hatched edges, muted washes and
pencil-like connectors. Text and tables remain native HTML. `SketchSheet` and
`SketchArrow` provide reusable drawing elements; the article's paper treatment
has light and dark variants. Interactive controls retain their existing treatment.

An independent reader inspected the normalisation overview, partial dependency,
relationship map and join diagram without the intended interpretations. They
correctly described all four and found no consequential clarity or style issues
in either theme. They noted the relationship map's straighter connectors but
judged them coherent with the sheets. This is review evidence, not user approval
of the finished style.

Phone inspection kept table headings outside their scrolling regions and repaired
wrapping and spacing in the join diagram. The 320px layout contained all eight
figures without page overflow; keyboard scrolling still revealed wider tables.
Desktop and 390px views were also inspected. The build produced 54 pages.
`screenshots/sketch-normalisation-light.png` and its dark counterpart record this
pass. The article's argument, SQL examples and interactive behaviour were not
changed.

## Teaching data types before constraints

The user noticed that the Constraints opening relied on data types without the
series having properly taught them. The former “Making the fields precise” section
now introduces types through their values and operations, then develops choices
among integers, exact decimals, floating point, text, booleans, dates and timestamps.
Units and missing values connect representation to the rules taught next. The
Constraints opening gives a short reminder and links back to `modelling/#types`.

The new sketch compares ordering the same visible digits as integers and as text
under PostgreSQL's C collation. A blind reader correctly described both orders and
the shared-prefix comparison. Their suggestion to name the character-by-character
comparison directly was added beside the text values. An independent editorial
review found no consequential error and prompted a plain explanation of UTC and
the database connection's display time zone.

Primary PostgreSQL 18 numeric, character, boolean, date/time and collation docs
were consulted. Six executed examples cover both sorting orders, decimal rounding,
leading zeroes, equivalent timestamp instants and a negative integer; results are
in `type-examples-results.json`. Light/dark desktop and 320px render checks cover
the new diagram; an inherited section margin was removed so its panels stay close
to their headings. This remains a working draft, not a new benchmark approval.

## Prerequisite audit after the data-types omission

Two independent readers examined the introduction and all three design articles,
without earlier reviews or the author's intended findings. One followed conceptual
prerequisites; the other assessed whether readers could finish the practical designs.
The coordinator checked the findings against the source. No article changes were
made during this audit. The following repairs remain open:

- **Reading writes:** Constraints explains the rules but assumes readers can map
  positional INSERT values to columns. Introduce an explicit column list and explain
  one insertion. The introduction already explains SELECT, ON and WHERE; a claim
  that SQL is entirely untaught would be wrong.
- **Normalisation to JSON:** Explain why independently identified purchase lines
  became rows while descriptive product attributes can be deliberately bundled.
  Connect the access and validation consequences, without suggesting all JSON
  designs satisfy the normal forms or requiring a detour through further theory.
- **Stale object writes:** Show how two earlier reads followed by sequential writes
  can lose a change even when row locks serialize the writes. The existing warning
  and field-update expression need the intervening causal step.
- **Completing validation examples:** The JSON article correctly warns that its
  number-type check still permits values rejected by the integer query and index.
  Complete one dependable representation/query path so the lesson reaches a usable
  result. A short conditional constraint example would also connect the series'
  recurring discussion of valid combinations, including missing values. This does
  not require implementing an entire product-category hierarchy.

An optional practice-setup link would help readers who do not yet know where to run
the downloadable SQL. This is a practical access issue rather than a prerequisite
for understanding the prose. Full isolation behaviour, query plans, migrations and
advanced normal forms can remain with their planned articles.

The evidence suggests we confused coverage with explanation: types were named in
the commission and used correctly in examples. Existing review guidance already
asked for prerequisites and transfer; repeating that advice or adding reviewer
counts would not address the failure. Authoring and review guidance now records
this case and asks agents to distinguish reasoning supported by actual passages
from understanding supplied by their expertise. Earlier review approvals remain
historical evidence, not a claim that these newly identified gaps are resolved.
