# Primary sources and native evidence

Checked26October2026. Official CockroachDB v26.2 pages:
- https://docs.cockroachlabs.com/docs/v26.2/backup — BACKUP INTO/INTO LATEST, explicit revision_history option. Current option reference says defaulttrue; contradicted by unqualified chain behaviour on pinnedbinary below. Article states observed discrepancy and requests true explicitly.
- https://docs.cockroachlabs.com/docs/v26.2/show-backup — SHOW BACKUPS paths, SHOW BACKUP scope/type/start/end metadata/check_files.
- https://docs.cockroachlabs.com/docs/v26.2/take-full-and-incremental-backups — collection/full/increment dependencies and latest path.
- https://docs.cockroachlabs.com/docs/v26.2/take-backups-with-revision-history-and-restore-from-a-point-in-time — full retained history; increment bounded history; sourceGC vs capturedhistory; restoredstate lacks historicalversions.
- https://docs.cockroachlabs.com/docs/v26.2/restore — ASOF/new_db_name, defaultownership/GRANTS/dependencies/skip_missing_foreign_keys, fullcluster clean destination, same/nextmajor restore rule, regions, keys and access.
- https://docs.cockroachlabs.com/docs/v26.2/backup-validation — filepresence, schemaonly, schema+data checksums/discard vs complete restore.
- https://docs.cockroachlabs.com/docs/v26.2/backup-and-restore-monitoring — job observability; lastcompleted rather than merelystarted.

Native1: evidence/native-verifier.py SHA256ae5da6cef6c6e0e08ed5ac031b17203e3bd73cc4cc80183b20a2a09bfc5892d5, results native-results.json, rootexecution stdout/stderr. Exact input/native-runtime.json preserved. Full+increment unqualified and explicitfalse chains succeeded, SHOW metadata/files succeeded, explicitfalse interiorrestore failed as expected, unqualified interior schema+checksumrestore also failed lackingrevision_history. No candidate/repair executed in this run. Projection named order_lines. Fixture removed byroot.

Native2: native-history-supplement-01/verifier.py SHA256a13486ead04fb8222e7e962805b71d3ed3c1299571abc1bc304c9341b6744906, own runtime/results/rootexecution evidence. Both full and increment explicitly revision_history=true. Interior schema+checksum, interior candidate and latest restores succeeded. Candidate20/pending29/no504, stock10/0/4, validated order_items constraints. Latest2.20plus504. Payment504+mapping transaction succeeded, exactrepeat mapping read, blindduplicate23505, final exactlyonepayment10, pending29, stock10/0/4. Payload mismatch refusal is verifier-side equality, not an engineconstraint. No provider call. Fixture removed byroot.

Both pinned officialv26.2.8 digest1ad58b6a69928691e0c9289b847dcb35ac25108c6ead23fcabf47e37b9195e9a. Single-node network-none, nodelocal-only, fixtureadmin. Actual logicalcut retained in native-summary.json. Root guards exactimage/CID/network/noports plus script guards UUID/database/user/version beforemutation. No production recoverytiming, cloudcredentials, encryption/KMS, distributedsurvival or production runtimeidentity tested. Article SQL genericstorage/path/timestamp require environment-specific substitution; no runnable download promised.
