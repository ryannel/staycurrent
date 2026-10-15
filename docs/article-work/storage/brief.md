# Storage and durability

Commissioned 15 October 2026 as part of relational batch 1: access and persistence.

The reader understands tables, a simple query and the purpose of a transaction.
They want to know what happens to a row below that interface and what a successful
commit preserves. The useful stopping point is being able to distinguish buffered
state, durable log records, table-file contents, transaction visibility and an
application's knowledge of commit success. They should also be able to explain why
updates create cleanup work and why local crash recovery cannot replace a backup.

Opening: distinguish the logical table from its physical storage, explain why memory-only changes are vulnerable, and define durability through persistent information and recovery. Establish these ideas before the P7 price-change example.

Implementation: `src/pages/learn/databases/relational/storage.astro`, with three static
figures in `src/components/explainers/storage/`. Existing `commit-and-recovery`
alias is the coordinator's integration responsibility. Keep `noindex` and working
draft status; this commission does not authorise publication.

Follow a single illustrative price change for P7, from 20.00 to 22.00, in ordinary
logged PostgreSQL 18 heap tables. State synchronous local commit, reliable storage,
fsync and full-page-write assumptions. Exclude failover protocols, backup commands,
vacuum tuning and a full physical file-format reference. Link their next reading
where available and label the planned backup guide explicitly.

The page-read illustration makes the page/row distinction visible. The crash
histories hold database state constant between successful-reply and lost-reply
cases. They are exact illustrative states, not a crash simulation or test record.
No interaction was required to compare these three small histories.
A compact ordering figure also shows a valid WAL-flush/reply/table-write history.
Its caption distinguishes this example from the actual write-ahead ordering rule,
which also permits precommit data-file writeback after the relevant WAL flush.

Style reference read in the original: Sam Who's Load Balancing, opening through
“When round robin doesn't cut it,” https://samwho.dev/load-balancing/ . Use the
causal progression of a running system, without borrowing its wording.

Root coordinator owns independent review, repair coordination, assembled-page
browser verification and the final build. Author's evidence and limited executable
example verification are recorded separately.
