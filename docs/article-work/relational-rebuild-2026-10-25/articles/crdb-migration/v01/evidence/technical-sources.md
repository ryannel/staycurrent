# Primary sources and native evidence

Checked26 October2026 using primary web documentation:
- https://docs.cockroachlabs.com/docs/v26.2/postgresql-compatibility — pgwire3, SQL differences, integer division; note default64-bit INT versus PostgreSQL32-bit.
- https://www.postgresql.org/docs/18/datatype-numeric.html — INTEGER range−2147483648…2147483647; numeric/decimal types.
- https://www.postgresql.org/docs/18/functions-math.html — integral division truncates towards zero.
- https://www.postgresql.org/docs/18/transaction-iso.html — established Repeatable Read snapshot.
- https://www.postgresql.org/docs/18/sql-copy.html — STDIN/STDOUT client transfer, explicit column lists, CSV formats/nulls.
- https://docs.cockroachlabs.com/docs/v26.2/copy — COPY TO STDOUT CSV explicitly demonstrated; FROM CSV HEADER; administrative privilege required. These paths were then observed natively, not inferred from PostgreSQL syntax.
- https://docs.cockroachlabs.com/docs/v26.2/transactions — Serializable default;40001 versus40003; complete transaction handling.
- https://docs.cockroachlabs.com/docs/v26.2/revoke — native privilege controls and role inheritance considerations.
- https://docs.cockroachlabs.com/docs/molt/migrate-to-cockroachdb — bulk load, coordinated load/replicate and failback choices; no MOLT runtime experiment.

Direct int reference retrieval failed; width acceptance/refusal was verified natively and default64-bit is also stated in compatibility documentation. No unsupported extension catalogue reproduced.

Root executed exact evidence/verify.cjs, copied as evidence/native-executed-verifier.cjs. SHA256 both dbf7cd8f10296072ce3ab6a9f24d5aa3216df173c45473505af67dc324b128a3. Root reports exit0; evidence/native-results.json retains exact version/database/principal/cluster identities and allowlisted results. source-native-runtime.json/native-runtime.json record pinned images, owned fixture identity and limits. Root guarded Docker identity, network and image without retaining Config.Env. The generated PostgreSQL password was read only at execution from the referenced private connection_file; no credential in article/work evidence.

Native outcomes: consistent seven-table forward CSV and exact row comparison; source runtime permitted/refused paths; snapshot versus later commit; equal-count candidate corruption; target initial exclusion, purchase103, repeat, changed payload rejection, shortage rollback; source stale; already connected target runtime refused after closure; full CSV reverse transfer to fresh PostgreSQL DB; actual return runtime duplicate claim inserts0 and reads same result/acknowledgement. Actual SQL privilege identities use PG container-local Unix-socket trust and CRDB fixture-only insecure login selection. This is not production authentication/fencing evidence.

Arithmetic result PG6, CRDB6.6666666666666666667. INT accepts2147483648 on target; targetINT4 and sourceINTEGER both22003. No runtime observation of external delivery, natural retries/40003, controller recovery, cluster failure survival or production duration. Displayed inspection summary SELECT is documentation-based over the verified state and was not executed verbatim; article states this limit. COPY statements/columns are aligned with the exact exercised verifier, omitting fixture schema prefixes in reader form.

Root reports both containers and private runtime credential directory cleaned successfully. Do not recreate for optional checks. No runnable download is promised to the reader; verifier and copied data remain work evidence.
