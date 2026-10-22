# Inferred commission: latency percentiles

Status: provisional planning input for the root coordinator, inferred from the bare topic. Planning only; no article prose, implementation or publication is authorised by this record.

Take an intelligent newcomer to expert practitioner in using latency percentiles to judge a service and obtain trustworthy evidence, optimising useful understanding against reader time and effort. The reader can follow a request through application code and understands percentages, but need not know statistics, monitoring systems or database internals.

The concrete situation is an engineer deciding whether a workshop booking service has become slower, whether a latency objective is being met, and what to measure next. Existing database reading already discusses request boundaries, overload and observed median/p95 results. This commission supplies the meaning and measurement discipline behind those numbers. It remains useful independently of that earlier reading.

By the end of the collection the reader should be able to:

- Define a latency observation and its population, compute and interpret a sample percentile, and explain what p50, p95 and p99 leave unseen.
- Choose percentiles and explicit threshold counts for an operational question; interpret them alongside traffic, errors, deadlines and distribution shape.
- Distinguish a changed workload mix or measurement boundary from a changed operation, and avoid treating a request percentile as a guarantee to every user.
- Explain why averaging worker/window percentiles, weighting them by request count, or adding stage percentiles does not recover the desired whole-request percentile.
- Collect and combine compatible distributions; make a concrete, source-backed choice of representation, resolution, grouping and window, with a Prometheus example rather than an entire monitoring-platform tutorial.
- Recognise limited sample support, estimation error, selective sampling, unfinished work and load-generator feedback; decide which additional evidence is needed before accepting a performance claim.
- Use distributions to identify affected work and paired request evidence to investigate causes, then compare a proposed change under comparable conditions.

Defaults: British English; service-level latency with a database-backed example; arithmetic, ordered observations and simple probability only where they reduce misunderstanding; invented data labelled throughout; no assumption of a particular percentile estimator. The teaching example declares its nearest-rank convention. No desired conclusion, tool or mathematical treatment was supplied.

A provisional two-article boundary separates interpretation and operational judgement from the instrumenting/combining/testing workflow. This is a justified boundary, not a quota: the first article should leave a reader able to question a dashboard; the continuation should leave them able to produce and audit its evidence. The ceiling is two articles including the root. Do not create grandchildren to relocate difficult material. The coordinator may merge the continuation if planning shows it is more efficient as sections.

Out of scope: a general observability collection; a statistics textbook or proofs of estimator properties; implementation of quantile sketches; a monitoring product survey; queueing theory, database tuning, retry algorithms or distributed-system tail mitigation as separate subjects; a hosted benchmark or a production latency promise. Explain relevant mechanisms far enough to identify the next measurement, then use existing published database reading for diagnosis and capacity. Scope exclusions do not remove the obligation to teach the commissioned decisions to expert-practitioner standard.

Context used: the isolated archive's README, site direction, relational collection index and published RL76, RL102 and RL103. The current site has planned observability coverage but no commission to launch that field. Navigation, route assignment, publication state and the canonical example remain coordinator decisions.


Settled centrally for the F-02 planning replay at the timestamp in root-manifest.json. No scope, outcomes, numerical treatment or article count added by coordinator. Publication remains unauthorised.
