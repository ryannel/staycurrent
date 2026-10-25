# Scenario continuity

- Purchase replay starts before103 exists. P3/P7/P9 stock12/1/4. Successful103: Mina1, timestamp2026-10-20 10:15UTC, pending, P7×1 at20.00 and P3×2 at4.50, line value29.00, no payment, stock10/0/4.
- Rollback scenario stops after the mug and restores starting facts. Distinct from success.
- Stock race: Mina103 wins, Tariq104 loses with a guarded update at PostgreSQL Read Committed. Unsafe counterexample permits both. The drawing includes only the mug operations, not a new basket definition for104.
- Report comparison resets before purchase103, reads stock before commit, asks for order after commit, re-reads stock. RC yields1/existing/0; RR yields1/absent/1. Query after BEGIN establishes RR view.
- Payment scenario independently starts after103 exists, no payments, fixed line value29.00. Payment601 and602 each attempt20.00. Coordinator approved these IDs;504 remains reserved for the separate10.00 partial-payment scenario. RR both commit=>40; Serializable depiction chooses A as winner, B fresh attempt reads20 and refuses20. No payment is added to core starting rows.
- Common order authority figure is conceptual; a lock does not automatically lock child rows or refresh an old snapshot. No complete explicit-lock protocol is claimed.
- Locks child owns acquisition, scope, snapshot protocol and wait diagnosis. Retry child owns logical request identity and recovery after missing commit replies. Storage owns physical versions and logs. No unavailable child is promised as finished reading.
