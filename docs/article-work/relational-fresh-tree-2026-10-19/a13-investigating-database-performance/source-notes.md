# Planning source checks

Checked 19 October 2026. These sources ground tool boundaries in the plan; no database
experiment or observed performance result has been produced in this planning assignment.
The writer must verify exact PostgreSQL 18 instrumentation against versioned documentation.

- [PostgreSQL 18: Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html):
  execution-measuring plans execute the statement and add overhead; client output and
  transmission differ from ordinary execution. Supports the bounded-tool subsection.
- [PostgreSQL 18: Cumulative statistics](https://www.postgresql.org/docs/18/monitoring-stats.html):
  activity/wait fields and cumulative resource statistics have distinct meanings and collection
  boundaries. Supports aligned counter windows and combining waits with resource evidence.
- [PostgreSQL 18: EXPLAIN](https://www.postgresql.org/docs/18/sql-explain.html):
  distinguish estimated planning from ANALYZE execution, and document measurement options.

The workload, comparison table and capacity curve are proposed teaching devices. They
must be labelled illustrative unless backed by a saved reproducible execution record.
