# Technical sources and native evidence

Primary sources consulted on26 October2026:

| Consequential claim | Source |
| --- | --- |
| Intent provisional value / native transaction identity; lazy transaction record; state-dependent resolution; refreshing; v26.2 explicit Serializable write buffering and one-phase opportunity | https://www.cockroachlabs.com/docs/v26.2/architecture/transaction-layer |
| Parallel Commits staging plus successful listed writes; reply before cleanup; recovery and late-write prevention | Above, Parallel Commits sections; https://github.com/cockroachdb/cockroach/blob/master/docs/RFCS/20180324_parallel_commit.md |
|40001 versus40003; single-statement/batch automatic retry and result-streaming boundary | https://www.cockroachlabs.com/docs/v26.2/transactions |
| Client intervention, complete retries and diagnostic distinction | https://www.cockroachlabs.com/docs/v26.2/transaction-retry-error-reference |
| Bounded retry/backoff and injected errors | https://www.cockroachlabs.com/docs/v26.2/transaction-retry-error-example |
| Outermost cockroach_restart before data work; rollback replay; RELEASE commits and may raise40001; finalCOMMIT clears connection | https://www.cockroachlabs.com/docs/v26.2/advanced-client-side-transaction-retries |

The RFC uses earlier STAGED terminology; the manuscript explicitly uses the current documented STAGING name. The RFC was read as design explanation, not a measured current trace. Attempts to fetch guessed/tagged RFC/source-code URLs did not return source and were not used as evidence. The actual master RFC above was returned and read. No secondary source was used for a technical assertion.

Versioned Transactions docs state a16KiB result-buffer default. The owned v26.2.8 session reports results_buffer_size524288. The article therefore describes the configurable limit without repeating that universal default. It explicitly separates client result buffering from gateway write buffering. Native session defaults: Serializable, explicit buffered writes on, implicit buffered writes off.

## Owned native run

Root provisioned and executed the bounded verifier; the writer provisioned/installed nothing. See `root-runtime.json`, `root-fixture.json`, `native-execution.json`, `native-results.json` and `native-cleanup.txt`.

- Official pinned image: cockroachdb/cockroach@sha256:1ad58b6a69928691e0c9289b847dcb35ac25108c6ead23fcabf47e37b9195e9a.
- Actual version: CCLv26.2.8, aarch64 Linux, built2026/10/14 21:48:18, go1.25.13.
- Exact owned database sc_crdb_transactions; user sc_crdb_transactions_writer; SQL exposed only on127.0.0.1:61508; clusterUUID806df612-25ba-4db2-8356-7044303e957a; fixture marker staycurrent-crdb-transactions-20261025.
- Node client pg8.23.1 from root's existing isolated runtime. Every connection sets explicit host/port/db/user/password/ssl/application/connection timeout/query timeout and checks version/database/current_user/clusterUUID/marker before article mutations. allow_unsafe_internals is explicitly set for the guarded cluster-ID diagnostic. No ambient/default database is used.
- Verifier `native-verify.mjs` SHA256b9428e8334e65de2433f0888761402aae9ddaf58e478ee35f7b983baf4d1c425 was unchanged before/after root's execution. Exit0 in3.21s. The fixture was stopped/removed afterwards. No fixture resources remain owned by the writer.

Assertions passed: injected40001 after tea work → rollback restores12/1/4 and removes claim; fresh full attempt → accepted103; same key → identical retained result and identical state; changed payload → mismatch with unchanged state; wrong new key → false refusal for the already accepted logical purchase; shortage savepoint rollback versus omitted rollback; retry savepoint rollback/replay, with successful RELEASE visible to independently guarded observer before finalCOMMIT; actual ordered two-session conflict → native WriteTooOld40001.

Limits: no observed40003, lost commit/API reply, distributed intent trace, replica survival, quorum recovery, latency or throughput. Missing-reply and Parallel Commits statements are documented protocol reasoning. The figures' symbolic IDs/times are not extracted from runtime internals. PGlite/PostgreSQL/WASM establishes none of this article's CockroachDB semantics and was not used. No runnable reader download is promised.
