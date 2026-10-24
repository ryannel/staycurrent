# Primary-source check · 24 October 2026

The only added technical exposition is r49's operational orientation. Checked the pinned CockroachDB 25.4 documentation:

- https://docs.cockroachlabs.com/docs/v25.4/architecture/distribution-layer — a range covers a contiguous interval of the ordered keyspace.
- https://docs.cockroachlabs.com/docs/v25.4/architecture/replication-layer — lease authority and voting agreement are separate roles; lease movement selects an existing replica; replica repair/rebalancing copies range data; allocator placement respects constraints and eligible capacity (Leases, Leaseholder rebalancing, Membership changes: rebalance/repair).
- https://docs.cockroachlabs.com/docs/v25.4/cockroach-node — drain is for process termination; decommission is permanent removal. The existing article's distinction remains unchanged.
- https://docs.cockroachlabs.com/docs/v25.4/architecture/overview — running nodes are CockroachDB processes and SQL work becomes replicated KV work.

The added r49 Sources entry points to Replication Layer. No new observed behaviour or execution result is introduced. Existing native evidence is retained only for its original bounded mechanism claims, as qualified in repair-record.md and evidence-applicability.json.
