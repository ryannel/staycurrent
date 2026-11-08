# Source and model checks

The new figures draw the existing article's claims and invented shop facts; they do not
introduce new observed executions. Its recorded PostgreSQL, Redis and simulation results
remain the evidence for those numbers. The prose is unchanged after removing figure
invocations and numbering from both versions.

Primary sources revisited during the repair:

- [Vattani et al., XFetch](https://www.vldb.org/pvldb/vol8/p886-vattani.pdf), section 5:
  selection uses the previous computation time and a fresh random draw on each request.
  For 150 ms and beta 1, the chance with one second remaining is
  `exp(-1 / 0.15) = 0.0012726`, about 0.13%. The two selected requests in the new timeline
  are an illustrative pair, not a new simulation or the predicted number of attempts.
- [Netflix concurrency-limits](https://github.com/Netflix/concurrency-limits), background:
  in-progress work relates to average rate and average latency. The comparison deliberately
  uses constant durations: `40 / .02 = 2,000`, `40 / .2 = 200`, and `2,000 × .2 = 400`.
  Connection capacity is separately `20 × 50 = 1,000`; the database may refuse earlier.
- [Google SRE, Addressing Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/),
  retries and deadlines: retry layers multiply attempts, shared retry budgets constrain
  amplification, and request deadlines do not establish that downstream work has ended.
  The diagram's three attempts at each of three layers give `3 × 3 × 3 = 27` source
  attempts, distinct from the illustrative incident's mean of 2.7.
- [Slack's 22 February 2022 incident](https://slack.engineering/slacks-incident-on-2-22-22/):
  the existing article's recovery example is retained; it does not supply measured
  values for our shop or a promise about its recovery time.

The 1,000/50,000 key share is 2%; its roughly two-thirds request share is the existing
popularity assumption. Existing recovery samples are retained, and the prewarm line
remains a calculated expectation for an order independent of popularity. The source
allowance is shared by demand and warming. Coordination bars compare total source-work
time, not elapsed response time: about 100 ms for five cheap reads versus 3,000 ms for
twenty long computations. Fleet scaling redistributes forty places as `20 × 1 + 10 × 2`.
