# a35 source and observation record

Checked 20 October 2026. Primary documentation was opened with the web tool. The article uses PostgreSQL 18 semantics, not portable SQL security syntax.

| Claim or procedure | Primary source | Use and limitation |
| --- | --- | --- |
| First matching admission rule; no fallback after failed authentication; TCP/TLS/local distinctions; database CONNECT | https://www.postgresql.org/docs/18/auth-pg-hba-conf.html | Real loopback plaintext/password/CONNECT failures also observed. No remote firewall or provider endpoint check. |
| Role INHERIT, SET and ADMIN options; indirect membership | https://www.postgresql.org/docs/18/role-membership.html | Actual app inheritance; explicit migrator SET ROLE; app owner/delegation rejection. |
| Ownership versus object grants; PUBLIC defaults | https://www.postgresql.org/docs/18/ddl-priv.html | Actual DDL rejection and ineffective app GRANT, with resultant privilege checked. An ordinary GRANT can warn without granting, so command success alone is insufficient. |
| Creator-specific defaults and new objects | https://www.postgresql.org/docs/18/sql-alterdefaultprivileges.html | Actual new table owner and readable table; default PUBLIC function EXECUTE removed before creating routine; app call rejected. |
| Writable searched namespaces and resolution | https://www.postgresql.org/docs/18/ddl-schemas.html | Guidance only beyond actual denied public-schema CREATE. No adversarial search-path exploit executed. |
| SECURITY DEFINER and safe search path, pg_temp last | https://www.postgresql.org/docs/18/sql-createfunction.html | Describes production acceptance needed; fixture routine is ordinary, not definer. |
| RLS owner/admin bypass | https://www.postgresql.org/docs/18/ddl-rowsecurity.html | Documented conditional guidance. No RLS fixture; projection view is tested instead. |
| libpq verification and server reload | https://www.postgresql.org/docs/18/libpq-ssl.html and https://www.postgresql.org/docs/18/ssl-tcp.html | Actual psql verify-full accepted correct name and rejected wrong name. Server certificate/key switched to another lab CA by reload. |
| node-postgres ssl options; connection-string overwrite | https://node-postgres.com/features/ssl | Actual pg 8.23.1 strict CA/name checks; no connection-string TLS options used. |
| LOGIN and password validity semantics | https://www.postgresql.org/docs/18/sql-createrole.html and https://www.postgresql.org/docs/18/sql-alterrole.html | Password rotation, expiry and NOLOGIN independently checked against new and existing connections. Password expiry is not universal authentication/session expiry. |
| Backend termination and timeout | https://www.postgresql.org/docs/18/functions-admin.html | Actual selected-PID pg_terminate_backend(pid,2000) true; subsequent activity count zero. No in-flight long statement or privileged SET ROLE session case claimed. |
| Connection/DDL logging and data exposure | https://www.postgresql.org/docs/18/runtime-config-logging.html | Actual connection, rejection, TLS, termination and dummy DDL log records retained. No complete read audit claimed. |
| Filesystem/block encryption | https://www.postgresql.org/docs/18/encryption-options.html | No local at-rest encryption test or claim. |
| RDS coverage, KMS availability and restrictions | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html and https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL.Concepts.General.SSL.html | Documented service comparison; no hosted acceptance. Exports explicitly need destination checks. |
| Secret-store rotation versus consumer adoption | https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html | The service updates secret and target; the article requires separate consumer reconnection evidence. No AWS call executed. |

## Native environment and retained evidence

Final complete observation: `evidence/native-run4.json`. Earlier runs 1–3 are retained transparently. Run 1 stopped at the NOLOGIN assertion because password expiry was still active and therefore masked that test; its cluster was stopped and removed. Run 2 passed 32 application-driver cases. Runs 3 and 4 added explicit membership delegation, migrator pre-SET denial and libpq checks. Run 4 strengthened the assertion helper so a missing expected rejection cannot pass. All 36 final checks passed. The current worksheet additionally verifies pg's installed package version before creating a cluster; that package-path/version check was inspected separately after the final database run.

- PostgreSQL: 18.6 Homebrew, server_version reported aarch64-apple-darwin25.6.0, Apple clang 21.0.0, 64 bit.
- Binaries: `/opt/homebrew/Cellar/postgresql@18/18.6_1/bin`.
- Node.js: v24.16.0. Application driver: pg 8.23.1, imported from the root-owned isolated driver directory documented in runtime.md; no dependency installed or modified by this worker.
- OpenSSL: 4.0.3, 29 September 2026.
- Fixture: fresh private mkdtemp directory, fresh kernel-selected loopback port; IPv4 listener only; private Unix socket permits only the dummy provisioner with trust. Other local users rejected; selected TCP logins require TLS and SCRAM; non-TLS and other TCP paths rejected.
- Role names are confined to that new cluster: drill, shop_owner, order_work, report_work, app_old, app_new, reporter, migrator, outsider. One dummy database shop, one known order 101, no real personal data.
- Two dummy two-day CAs and signed localhost server certificates were created only inside each fixture. No OS trust store, global network or shared database settings were touched.
- Bounded operations: 12 server connections, 32 MB shared buffers, 5-second server and driver statement limits, 4-second connection limit, 30-second child command limits, 15-second start/stop limits, bounded certificate-reload observation loop. Default durability safeguards retained.
- TLS observation: TLSv1.3 / TLS_AES_256_GCM_SHA384. This is an observed negotiation, not a required cipher recommendation.
- Each run records its actual generated port in configuration. Treat that JSON as authoritative; ports are not reusable fixture addresses.

## Outcomes

Allowed app UPDATE and reporter projection returned 101/packed. Reporter raw read failed at schema permission; app DDL failed ownership; app SET owner and role delegation failed. App's GRANT did not create effective outsider SELECT authority. Migrator CREATE failed before explicit SET ROLE, then created new table owned by shop_owner. Its owner defaults made the table readable and removed public execution of the new ordinary routine. A valid-password outsider was refused database CONNECT. Plaintext TCP, wrong password, bad server name and untrusted issuer each failed at the intended client boundary.

Old password failed fresh authentication after replacement. The pre-existing app session still read 101 after password replacement, password expiry and NOLOGIN. Expiry was reset before the independent NOLOGIN case. Committed membership revocation removed subsequent table access while leaving the connection open. New login worked. Targeted old-backend termination returned true and the PID disappeared. This does not establish cancellation of earlier running work or every SET ROLE state.

After supported certificate reload, old-root-only fresh clients failed; overlap-root and new-root clients passed; a TLS session established under the old certificate remained usable. Actual libpq correct-name success and wrong-name rejection are retained. Certificate expiry, CRL/OCSP, client certificates, proxy behaviour and cloud renewal were not executed.

Server log contains connections, SCRAM identity, TLS, failures, disconnections and selected termination. Separate queries with log_statement=ddl generated CREATE/DROP audit_marker records; the first multi-statement attempt in run 2 did not log those events and was corrected before the final evidence. Successful ordinary reads are not a complete logged ledger under this configuration.

All four runs record stopped=true and removed=true. They remove their own entire cluster, including DBs, roles, certificates, socket and logs, after retaining JSON. Shared cluster 57319 and root-owned driver dependencies were not changed. Only isolated browser QA HTML/server remained briefly for model checks; both were removed at handoff.

## What remains a deployment acceptance task

Representative allowed/forbidden network origins; provider IAM and console/API paths; backup retrieval/deletion and key rights; at-rest coverage; protected log export and retention; complete sensitive-read auditing; emergency identity activation/retirement; production driver/pool/proxy configuration; RLS or privileged routines if adopted. No table in the article turns these untested tasks into observed results. The five interactive figures are deterministic explanatory models.
