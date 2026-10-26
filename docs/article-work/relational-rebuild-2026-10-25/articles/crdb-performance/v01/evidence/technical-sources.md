# Primary technical sources

Checked26October2026, versioned v26.2 official CockroachDB documentation:
- /explain-analyze: real execution, local SQL versus remote KV, per-operator and statement counters, SQL/KV CPU and waits; verbose and DistSQL modes.
- /explain: proposal without execution.
- /indexes: secondary data, STORING values, covering and index joins, write maintenance.
- /joins: lookup joins using indexed right input.
- /hash-sharded-indexes: full-key default, four-bucket example syntax, v26.2 shard_columns leading-prefix constraint, cross-bucket read combination and count tradeoff.
- /understand-hotspots: moving index edge, random primary plus sequential secondary, row hotspots and node/range distinctions.
- /show-ranges: bounds, identity, replicas and lease owner with DETAILS; placement evidence rather than demand measurement.
- /load-based-splitting: useful load separation and splitting.
- /monitor-and-analyze-transaction-contention: native blocker/waiter/key evidence and lock durations versus Serializable conflict counts.

All URLs are https://www.cockroachlabs.com/docs/v26.2 followed by the path above. Hot Ranges page v26.2 could not be opened by web tool; article avoids its exact averaging interval or privilege claims. The interface is referenced as a way to locate native range-demand evidence, with explicit instruction to record the actual window. No invented native QPS is reported.

Models infer consequences from stated roles and key ordering; no topology, request count, balancing success or performance gain is treated as observed without corresponding owned native evidence.

CREATE INDEX v26.2: https://www.cockroachlabs.com/docs/v26.2/create-index. Its syntax SVG was inspected directly in an owned browser tab from the actual page image src (the web parser's reordered signed query did not fetch). Confirmed key list → USING HASH → STORING/COVERING/INCLUDE → optional partition → WITH(storage parameters). Corrected the initial misplaced STORING clause in the verifier and displayed article declarations before any successful observation. The tab was closed.

Native revision4 succeeded (exit0,20.84s), with unchanged source hash3947412670c12ac297e41fa6d9822e363432edf5224520a9a4f91eedcb61c67b. The256MiB SQL/1536MiB container/2CPU profile is recorded in root-native-v4-fixture.json; exact successful observations are native-v4-results.json. Native output distinguishes DistSQL network usage, latch waits and transaction lock-table waits. This required narrowing the earlier generic contention explanation. Confirmed latch/request versus lock/transaction distinction in official v26.2 architecture/transaction-layer#latch-manager. The optional hot_ranges relation is absent; no range-demand measurement is claimed.
