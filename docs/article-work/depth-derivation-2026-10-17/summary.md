# What the new method derives for the three reference subjects

On 17 October 2026 the planning and authoring skills were rewritten around one aim: an
expert practitioner's understanding at the least cost in reading time. To see what depth
that method derives on its own, two planners per subject worked from `kit.md`, a copy of
the method with our own calibration cases removed, and without seeing the site. A third
reviewer per subject merged the two plans against evidence, gave every part a layer
(`consolidate.md`), saved that plan, and only then compared it with the existing articles.

| Subject | Existing | Planner A | Planner B | Consolidated | Verdict |
|---|---|---|---|---|---|
| Sequence diagrams | 3 articles, 67 min | 2, 40 min | 2, 36 min | 2, 39 min | Restructure, targeted cuts and additions |
| Storage and durability | 3 articles, 91 min | 4, 63 min | 3, 54 min | 3, 57 min | Restructure the set; targeted repairs to the deep dive |
| Indexes | 3 articles, 92 min | 2, 53 min | 2, 50 min | 2, 48 min | Restructure, targeted cuts and additions (60 to 70 min after repair) |

## Findings

- **The method is stable.** Independent planners agreed on shape and came within about
  15% of each other on reading time for every subject.
- **The existing sets are 1.6 to 2.2 times the derived plans.** The excess repeats in
  each: the same explanation told on two or three pages, neighbours re-taught, detail
  that only applies to PostgreSQL inside general articles, and, for sequence diagrams,
  code listings that repeat the figures and overlapping checklists.
- **The gaps are real too.** No opening states the model the plan says layer 1 must give.
  SQL Server is largely absent from the relational articles although the collection names
  it. Each subject also misses specific expert material: judging a design from its
  sequence diagram; a condition checked inside an index without narrowing the scan, and
  the ORDER BY with LIMIT trap; row cost across engines and large values in storage.
- **The mechanism teaching is good.** All three reviewers found the core explanations
  accurate and well taught, which is why none recommends a rewrite.

## Accuracy findings, checked against the page text

- Storage: "an update changes … the indexes whose columns it changes" is wrong for
  PostgreSQL, where an update that isn't HOT adds an entry to every index.
- Storage: PostgreSQL unlogged tables are emptied after a crash or unclean shutdown, not
  after every restart.
- Indexes: an "Index Cond" entry in a plan doesn't always mean the condition narrowed the
  scan; the article's own example shows this.
- Indexes: the NULL rule for unique indexes holds for PostgreSQL, InnoDB and SQLite, but
  SQL Server allows only one NULL.
- Sequence diagrams: "the call to the broker is synchronous" is overstated; publisher
  confirms and producer acknowledgements are often asynchronous.

Per-subject files are in `derived/`: each planner's plan, the consolidated plan with its
layer column and layer-1 statement, and the comparison.
