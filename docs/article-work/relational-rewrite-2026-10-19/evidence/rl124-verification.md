# RL124: native verification

19 October2026. The final CockroachDB worksheet completed with exit0. The canonical
record is `cockroach-observed.json`; `rl124-observed.json` extracts this page's
labels. Commands and exact stdout/stderr are retained. Run
`python3 lab/cockroach_scenarios.py --bin <25.4.17-binary> --old-bin <25.3.7-binary> --phase native`
from this work directory to recreate the temporary TLS cluster and seeded rows.
`finally` stops owned processes and removes temporary data and keys.

All servers are loopback processes on one macOSARM64 host. Region labels do not
create geographical independence or latency. No power-loss or production-load
claim follows. macOSARM64 is an experimental CockroachDB platform. Exact
historical values and SQLSTATE40001 are native observations; the drawn internal
transaction and majority stages are teaching models, not internal traces.
