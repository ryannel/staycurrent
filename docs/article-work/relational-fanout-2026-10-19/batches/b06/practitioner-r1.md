# Practitioner review — b06, round 1

Reviewed a17–a20 and their supplied contexts against the original relational-practice goal. No other review report was read. Findings concern planned scope, decisions and boundaries; worksheets and driver-specific procedures remain to be executed and reviewed when written.

## a17 — Changing data with SQL

**Pass. No required repair.** Target keys and postconditions provide the right continuation beyond the parent's first modification. The plan covers ambiguous source matches, zero affected rows, generated identifiers, constraint errors and direct-versus-dependent effects without confusing previewed rows with concurrency protection. The single conflict-policy comparison avoids teaching superficially similar statements as interchangeable guarantees. Its transaction, retry and live-correction hand-offs preserve the global division of work. No further SQL-modification branch is necessary.

## a18 — Designing changes that coordinate with locks

**Pass. No required repair.** The stable-row protocol includes the often-missed visibility obligation after waiting, rather than assuming mutual exclusion refreshes an earlier snapshot. Empty results, absent coordination identities, capacity changes and administrative writers are part of the coverage argument. The canonical acquisition procedure is distinguished from mere result ordering, and the optional skip example teaches only the changed guarantee. These are justified practitioner details. Protocol construction remains distinct from isolation-contract interpretation and client retry machinery; the terminal boundary is sound.

## a19 — Reading and testing isolation guarantees

**Pass. No required repair.** The plan extracts obligations from exact engine settings and statement forms rather than assigning guarantees by level name. Mixed read/update state, multirow dependencies and whole-transaction abort handling support concrete choices; the staffing case earns its additional example by exposing a failure the reservation case alone might hide. Real-time ordering is kept to a bounded contract distinction. Visible session checkpoints, version-matched documentation and an explicit statement of what selected runs cannot prove provide suitable evidence discipline. No further isolation or distributed-theory branch is needed.

## a20 — Managing connections and transaction lifetimes

**Pass. No required repair.** Lease ownership, cleanup completion and safe reuse are treated as observable state transitions, with late acquisition, streaming, failed rollback and shutdown included. Cancellation mechanics have a clear owner here while business outcome and retry decisions are delegated. Aggregate connection allowances include overlapping deployments and proxy/backend distinctions, preventing pool tuning from becoming an isolated-client exercise.

The cited source choices are appropriate: [node-postgres transactions](https://node-postgres.com/features/transactions) documents same-client transaction use; [PostgreSQL cancellation](https://www.postgresql.org/docs/18/libpq-cancel.html) distinguishes dispatched cancellation from an effective cancellation; and [PgBouncer's feature map](https://www.pgbouncer.org/features.html) distinguishes protocol preparation from SQL PREPARE support. I checked those pages. They support the planned distinctions, while the eventual chosen driver still needs its own executable lifecycle checks. No driver/protocol specialist child is required.

## Batch verdict

All four plans pass. No required repair or additional article is identified.
