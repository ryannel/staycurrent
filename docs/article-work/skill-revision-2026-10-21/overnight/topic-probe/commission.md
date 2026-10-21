# Latency percentiles: inferred commission

Status: proposed planning commission; no article or publication authorised.

Infer a useful treatment of the bare topic **Latency percentiles** for Stay Current: take an intelligent engineer with no statistical background from recognising “p99” to making sound performance decisions from latency distributions, in the least reader time and effort. The practical situation is a service owner comparing releases or investigating a slow tail while a dashboard's average still looks healthy.

The reader should finish able to:

- Explain what a percentile says about a defined set of request durations, including what it leaves unknown.
- Choose the request boundary, population, time window and percentile for the decision; distinguish request experience from user experience.
- Evaluate a latency budget using the fraction of eligible requests that succeed within it, without concealing failed or timed-out attempts.
- Reject averages of instance or interval percentiles and calculate a service-wide result from the combined observations or a suitable distribution representation.
- Recognise inadequate request counts, changes in workload mix, measurement omissions and approximation error before trusting a claimed improvement.
- Specify and inspect an implementable measurement path, and decide whether evidence supports accepting a change, investigating it or collecting better data.

Propose one conceptual and decision-making root, with one contextual child on constructing trustworthy measurements across a service. Two articles are justified by the different work involved in interpreting evidence and producing it; two is an experiment ceiling, not an article quota. The child remains an unplanned stub until the coordinator settles the root example and commissions its headings.

Assumptions resolved without asking the user: use a fictional shop's order-history service to connect to available database reading; do not require reading that collection. Introduce all statistics needed here. Use Prometheus as a concrete worked measurement implementation in the child, while keeping the root useful with other tools. Treat numerical targets as invented teaching choices. Do not turn the topic into a general observability course, a statistics survey, a database tuning guide or the parked distributed-systems programme.

The publication context permits subjects beyond databases, but does not imply an observability field launch. Existing performance articles motivate this subject and own resource diagnosis; this commission owns the meaning and trustworthiness of the reported latency evidence. No navigation, available-reading entry, public route, service execution or publication is included.

Inputs: frozen archive `/private/tmp/staycurrent-skills-night-topic/`; installed orchestration, breakdown and continuity skills there; source checks and continuity decisions in [planning-record.md](planning-record.md). Proposed canonical data and notation are in [example-proposal.md](example-proposal.md).
