# Performance completion

Commissioned 15 October 2026 as part of the authorised relational completion.

The main article helps an engineer diagnose a slow application request. Its useful
stopping point is a reasoned experiment: identify whether requests are waiting for
a connection, repeating queries, doing excessive execution work, or waiting inside
the server; then check a change under the workload that caused the problem.

The request-cost child follows one order-list response through application query
generation, batching, join fan-out and connection ownership. It should let a reader
predict the work of an ORM access pattern and preserve response semantics while
changing it. It does not repeat the pagination or transaction tutorials.

The reporting child starts with the meaning and grain of a report, follows repeated
aggregation into a stored result, then explains refresh and the evidence for moving
analytical work elsewhere. Freshness and correction handling belong in that decision.

Three independent browser lessons use perf_, request_ and report_ tables. SQL setup
is the first step, and each lesson includes predictions, result interpretation,
variation and restart instructions. PGlite observations establish SQL behaviour,
not server networking, concurrent waiting or storage performance. Source and
verification notes are recorded beside this brief. Independent review and rendered
page checks are coordinated by the parent agent before publication.
