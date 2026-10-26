# Primary-source check

Checked2026-10-26, CockroachDB v26.2 documentation. URLs appear in reader sources and near consequential claims.

- https://docs.cockroachlabs.com/docs/v26.2/online-schema-changes — notice/job separation, capacity, single schema change, lack of general multi-statement DDL atomicity, autocommit_before_ddl and documented exceptions. Read transaction limitation and automatic-commit sections, rather than inferring PostgreSQL semantics.
- https://www.cockroachlabs.com/blog/how-online-schema-changes-are-possible-in-cockroachdb/ — delete then write then backfill then read capability; schema propagation rationale. Used as high-level model, not current internal stage names.
- https://www.cockroachlabs.com/blog/bulk-ingestion-and-index-backfills/ — descriptor versions, concurrent mutations, timestamped historical index backfills and bulk ingestion. Internal merging deliberately omitted from model and disclosed.
- https://docs.cockroachlabs.com/docs/v26.2/show-jobs — job identity, status, phase, fraction,error,execution errors and retained listing. Status overrides ambiguous phase prose. Actual observations include fraction0 across phases and failed/all-stages-completed.
- https://docs.cockroachlabs.com/docs/v26.2/pause-job — pause/resume control, protected timestamps, accumulation and monitoring while paused.
- https://docs.cockroachlabs.com/docs/v26.2/cancel-job — operation restrictions, e.g. drops/renames; never universal undo. Model includes reversion/GC distinction; native terminal cancellation was not observed.
- https://docs.cockroachlabs.com/docs/v26.2/create-index — all builds concurrent, CONCURRENTLY is no-op; UNIQUE checks existing data and later writes.
- https://docs.cockroachlabs.com/docs/v26.2/unique — non-null uniqueness, NULL allowed repeatedly; explicit intended business policy.
- https://docs.cockroachlabs.com/docs/v26.2/drop-index — later schema removal, dependencies and RESTRICT default. No destructive reader SQL supplied.

RESUME JOB direct fetch failed through web cache; PAUSE JOB manual explicitly establishes resume control. The source link is retained as further reading; no new behaviour was inferred from inaccessible page.

# Native evidence

Root-guarded v26.2.8 pinned official digest and exact runtime identity in input/native-runtime.json and evidence/native-execution.json. Executed verifier SHA256e03ab7423dcdb2a95907dcc3314b1b334064f8061b64a3aabcea854eaeaff0d9; stable executed source preserved as evidence/native-verifier.cjs. Root owns execution and cleanup; native-cleanup.txt records stopped/removed fixture.

Results in native-results.json/stdout and later root native-jobs.txt. Verifier exit1: cancellation bound closed its DDL client; subsequent final index query was skipped because it reused that closed client. Preceding SQL probes completed: nullable column, price bridge/backfill/zero checks, wrong-unit counterexample, failed duplicate build23505 plus absent candidate, successful fresh uniqueness, caller accepted/rejected codes, completed40k online index and changed rows/totals. Root final job snapshot still showed cancellation reverting and GC waiting for MVCC GC. No successful whole-verifier exit, completed cancellation, pause/resume, cluster survival, regional timing or reclamation measurement claimed.
