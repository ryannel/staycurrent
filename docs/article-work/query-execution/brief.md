# How a query runs

Commissioned 15 October 2026 as part of access and persistence batch 1.

Reader: an engineer who understands tables, keys, SQL joins and grouping, including the worked receipt in Querying your data. A direct entrant gets a self-contained report and dataset description.

Opening: explain the difference between a SQL result and the operations that produce it, why alternative plans can do different amounts of work, and how estimates and execution measurements help investigate that choice. Introduce the shop report only after establishing these ideas.

Question: why can the same report shape call for a different execution strategy as its selected input grows, and how can we tell what the chosen plan actually did?

Useful stopping point: trace scans, joins, aggregation and sorting through one report; distinguish input work from output cardinality, multiply repeated operation counts, recognise where a plan must wait for more input, and test a concrete estimate error without assuming an algorithm is inherently good or bad.

Distinct investigation: the parent establishes result meaning and traces a tiny receipt. This page uses a deterministic larger shop, compares naturally selected narrow and broad plans, reproduces a correlated-predicate estimate error and repair, and observes a sort spill. Merge joining is an explicitly forced diagnostic alternative, not presented as the natural choice.

Execution: one SQL editor or psql connection to a fresh practice PostgreSQL 18 database. Isolated generated fixture; no shared shop prerequisites. Ordinary reads and explicitly bounded diagnostic transactions. PGlite validates SQL and plan structure; no timing or storage-hardware benchmark.

Media: a paired flow diagram exposes the change in intermediate work and aggregation; a precise merge walk shows why sorted input avoids starting over. Static figures are appropriate: switching a simulated algorithm would repeat the parent's experiment and conceal the actual engine evidence.

Read original reference: Sam Who, Load Balancing, opening through When round robin doesn't cut it, 15 October 2026. Applied the development of a strategy by changing the workload; no borrowed wording.

Review: root coordinator commissions independent technical/editorial and uncued sequential reading, then records repairs. Author self-check and executable fixture are supporting evidence, not independent review.
