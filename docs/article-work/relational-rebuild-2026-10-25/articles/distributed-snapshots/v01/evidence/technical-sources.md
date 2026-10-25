# Primary-source verification

Checked25 October2026 using external web reads. Consequential facts and primary sources:

- Lamport1978 https://lamport.azurewebsites.net/pubs/time-clocks.pdf : happened-before partial order; logical clock send/receive rules; clock condition is one way, timestamps alone do not prove causation.
- Kulkarni et al https://cse.buffalo.edu/tech-reports/2014-04.pdf : HLC physical/logical parts, receive update, lexicographic order; independent numeric trace uses their event-clock rules.
- Spanner2012 sections3–4 https://www.usenix.org/system/files/conference/osdi12/osdi12-final-16.pdf : TrueTime bounded intervals, commit wait earliest beyond timestamp, safe-time replication/prepared-transaction limits. Google archive PDF URL failed; recovered exact paper at USENIX. https://docs.cloud.google.com/spanner/docs/true-time-external-consistency confirms current external consistency and version timestamp reasoning; https://docs.cloud.google.com/spanner/docs/reads confirms exact/stale/strong contracts and consistent multiple calls in a read-only transaction.
- https://docs.cockroachlabs.com/docs/stable/architecture/transaction-layer : HLC; clock assumptions; uncertainty conflict moves timestamp and refresh/retry; closed timestamp promise tied to applied Raft position; unresolved intents consult transaction status. Kept engine details short and native behaviour with crdb-reads.
- https://docs.cockroachlabs.com/docs/stable/follower-reads : exact historical transaction scope, bounded staleness/availability and native restrictions. No broad bounded-staleness SQL support claimed here.
- https://docs.cockroachlabs.com/docs/stable/architecture/storage-layer : MVCC timestamped versions and collection.

All cluster drawings are explanatory models; no Spanner or CockroachDB system was run. Timestamp intervals are illustrative serviceable ranges rather than native universal definitions. SQL execution evidence is limited to the displayed one-row guard, observed in the supplied PGlite0.5.8 PostgreSQL18.3/WASM runtime. The script also demonstrates why an unguarded absolute write using an earlier1 can succeed after stock reached0. No concurrent scheduling or distributed behaviour inferred from PGlite.
