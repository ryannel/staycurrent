# Expert dossier

The dossier records what an expert in the subject knows that a competent engineer does
not. Write it as short entries, each with a source link and, where it helps, one line on
why it matters to a decision. Mark anything checked by execution as observed, and give
the version and setup.

## Sections

- **Decisions.** The choices practitioners make in this subject, and the signals that
  drive each one.
- **Vocabulary.** The names practitioners search for and use in design reviews:
  patterns, algorithms, failure modes. Include the standard name even when the
  articles introduce the idea before naming it.
- **Canonical sources.** Papers, specifications, books and standard posts that an expert
  would expect to see cited. Say what each establishes.
- **Magnitudes and defaults.** Orders of magnitude and default settings that change a
  decision: latencies, throughputs, sizes, per-item overheads, limits, timeouts. Give the
  source or the measurement conditions.
- **Tools and output.** The commands, views, metrics and logs a practitioner reads, with
  a sample of what the output looks like.
- **Failures and incidents.** How things go wrong in production: the patterns and, where
  public, real incidents with links. Note how each shows up in the output above.
- **Misconceptions.** What newcomers commonly believe that leads to a wrong decision.
- **Boundary.** Neighbouring subjects an expert here does not need, and which other
  collection owns them.

## Ownership

End with a table that maps each item to the article that owns it, or to "omitted" with a
reason. A planner who cannot place an item has found either a missing article or a
subject boundary. Say which.

## Example entries

> **Probabilistic early expiration (XFetch).** Refresh before expiry with a probability
> that rises as expiry nears, scaled by the cost of recomputation. It spreads refreshes
> without a coordination service. Vattani, Chierichetti and Lowenstein, "Optimal
> Probabilistic Cache Stampede Prevention", VLDB 2015. Owner: Handling cache misses.

> **Per-entry memory overhead (Redis).** 100,000 entries with 500-byte values took
> 59 MiB, about 120 bytes per entry above the value. Observed: Redis 7.0.15, loopback,
> 5 November 2026. Decides whether caching a whole catalogue is cheap. Owner: Cache memory.
