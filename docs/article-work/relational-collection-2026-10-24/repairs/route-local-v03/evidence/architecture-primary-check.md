# Changed architecture claims · P1

Checked 24 October 2026 against CockroachDB25.4 primary documentation:

- https://docs.cockroachlabs.com/docs/v25.4/architecture/distribution-layer : Overview (ordered KV map divided into contiguous ranges), Using the monolithic sorted map and DistSender (routing requests to range replicas; leaseholder first where needed).
- https://docs.cockroachlabs.com/docs/v25.4/architecture/replication-layer : Overview/Raft/Leases (per-range replicated group, voting agreement, leaseholder coordinates ordinary current access; gateway is distinct).
- https://docs.cockroachlabs.com/docs/v25.4/architecture/sql-layer : Overview, Physical planning, Query execution (node receiving SQL acts as gateway; SQL operators may execute across nodes and request underlying KV data).

Official SQL page was retrieved through the www.cockroachlabs.com URL after the docs host returned a cache miss; it redirected to the same versioned official document. Article source lists link these documents. The new paragraphs describe the documented architecture. They add no native observation, timing, placement or failure test. Existing SQL/downloads/data/models/measurements stay unchanged.
