# Primary technical sources

Checked 26 October 2026 against PostgreSQL 18 documentation via web tool. No third-party technical sources.

| Claims | Primary source |
| --- | --- |
| INHERIT/SET chains, separate ownership, special attributes | https://www.postgresql.org/docs/18/role-membership.html |
| LOGIN, NOINHERIT membership default, BYPASSRLS | https://www.postgresql.org/docs/18/role-attributes.html |
| GRANT options, column grants, sequence separation and additive paths | https://www.postgresql.org/docs/18/sql-grant.html |
| Ownership/inherited owner powers, SELECT/UPDATE needs, PUBLIC defaults | https://www.postgresql.org/docs/18/ddl-priv.html |
| Cluster roles, schema USAGE/CREATE, search_path and public schema upgrade defaults | https://www.postgresql.org/docs/18/ddl-schemas.html |
| Current-role creator defaults, existing-object distinction, per-schema cannot subtract global PUBLIC execute | https://www.postgresql.org/docs/18/sql-alterdefaultprivileges.html |
| LOCAL commit/rollback lifetime and prior session baseline | https://www.postgresql.org/docs/18/sql-set.html |
| current_setting missing_ok and set_config local argument | https://www.postgresql.org/docs/18/functions-admin.html#FUNCTIONS-ADMIN-SET |
| session_user/current_user and privilege inquiry | https://www.postgresql.org/docs/18/functions-info.html |
| SET ROLE vs authentication and session variables | https://www.postgresql.org/docs/18/sql-set-role.html |
| RLS enable/default deny, owner/superuser/bypass/FORCE, integrity information channels, TRUNCATE outside policy | https://www.postgresql.org/docs/18/ddl-rowsecurity.html |
| USING/CHECK timing, omitted CHECK reuse, policy OR/AND/applicability | https://www.postgresql.org/docs/18/sql-createpolicy.html |
| Default vs security_invoker views, policy authority, current_user unchanged, function rules | https://www.postgresql.org/docs/18/sql-createview.html |
| View security barriers and evaluation leaks | https://www.postgresql.org/docs/18/rules-privileges.html |
| Definer defaults, search_path, pg_temp last, PUBLIC revoke in creation transaction | https://www.postgresql.org/docs/18/sql-createfunction.html#SQL-CREATEFUNCTION-SECURITY |

Consequential SQL checks: pglite-access-verifier.mjs/results.json checks ordinary statements in owned in-memory PGlite0.5.8 PostgreSQL18.3/WASM, closed in finally. It uses SET ROLE; it is not evidence of actual client logins. An initial attempt to simulate repeated psql identities with SET SESSION AUTHORIZATION did not restore the original PGlite identity as expected; retained pglite-session-simulation-limit.json records that failed approach, which is not cited as successful evidence. The simpler ordinary-SQL run passes. Coordinator-run native assertions passed (exit0; ALL ASSERTIONS PASSED), with actual LOGIN reconnects over local Unix trust. Exact native verifier SHA256 5be4b0319a24f561923238edc6f96b6b5b52730dc784941038e1d48a98ec3129 before and after execution. Retained native-results.txt/native-stderr.txt/native-execution.json/native-fixture.json/native-executed-verifier.sql establish source, actual18.6 Debian aarch64 runtime and pinned official image digest edb0c08dc33befd0262ab3b5cf1c4f3f8cfd8b09e88c05b45adee29d6761ddb6. No network/host ports. Fixture stopped/removed; cleanup exit0. Results show4 customers and3 orders unchanged. Reader-facing observations checked against result and assertions; no network/password authentication, deployed sign-in or production-pool evidence claimed.
