# Technical sources · checked25October2026

Primary-source checks:

- https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html — authentication versus authorisation; least privilege by task/resource/action; every-request checks; ID guessing does not confer authority; allow/deny tests. Article applies these to its own approved shop scenario.
- https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html — parameters separate values from SQL structure, not account authorisation; minimum database authority and restricted interfaces.
- https://www.postgresql.org/docs/18/ddl-priv.html — action and column grants, SELECT needed by ordinary guarded updates, ownership, PUBLIC and grant options. No claim that INSERT implies DELETE.
- https://www.postgresql.org/docs/18/role-membership.html — inherited authority and ability to assume group roles; effective access has multiple paths.
- https://www.postgresql.org/docs/18/ddl-rowsecurity.html — table grants alone permit all rows; RLS adds per-command/per-role rules; ordinary owner bypass and privileged bypass identities.
- https://www.postgresql.org/docs/18/sql-createpolicy.html — USING checks existing rows; WITH CHECK checks proposed rows; false/null hides existing rows versus rejects proposed rows; proposed-row checks occur before constraints.
- https://www.postgresql.org/docs/18/sql-set.html — LOCAL ends at commit or rollback and restores any session value. Figure3 explicitly assumes an empty baseline; this qualification is also in prose.
- https://www.postgresql.org/docs/18/sql-createfunction.html — security definer executes as owner; callable privileged code requires a secure implementation and restricted execution access. Native procedures deferred to pg-access.
- https://www.postgresql.org/docs/18/sql-alterdefaultprivileges.html — future-object privileges; existing objects unaffected. Article asks to review future defaults with migrations without teaching native syntax.
- https://www.postgresql.org/docs/18/ddl-constraints.html — a multicolumn foreign key must match an existing corresponding tuple. Constraints neighbour owns implementation.

Native evidence: native-access.mjs and native-results.json. Root inspected/executed the verifier on an explicitly owned native Linux PostgreSQL18.6 fixture (pinned official image, lifecycle evidence retained centrally). Endpoint, database, rootfixture identity, version, cluster and data directory asserted before DDL. Runtime/support/migration each used actual generated-credential login sessions, not merely SET ROLE in an owner connection.19checks passed. Credentials never printed or copied into evidence. Schema/logins/clients cleaned up; root subsequently removed fixture and base credentials.

Limits: narrow customer/order projection, no application sign-in or actual production pool, no purchase end-to-end privilege suite, no CockroachDB execution. Figures are conceptual models. No download offered. No PGlite execution is claimed: native verification supersedes WASM for these identity-dependent checks.
