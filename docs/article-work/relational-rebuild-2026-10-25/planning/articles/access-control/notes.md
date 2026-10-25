# Planning notes

Read the supplied commission, article, neighbours, incoming ownership, reading links and shop record. This is a detailed outline within the accepted tree; no ownership changes or new children are proposed. The existing PostgreSQL and CockroachDB articles are contextual specialist destinations, not new nested articles under access-control. Application SQL retains parameter binding and connection mechanics; this article uses those concepts only to explain authority and its tests.

## Reference exposure

Read sequences 1–6, indexes 1–7 and storage 1–6 separately using the supplied reader; every END marker was present. Studied the root-owned finished previews in one owned IAB tab at current settings, without viewport/theme changes, then closed it. In particular: Sequences' trust-boundary drawing names who holds each part of the flow; Indexes' composite comparison keeps the same rows while one choice changes; Storage's WAL drawing separates the application reply from what actually crossed a boundary. Follow these teaching moves: a concrete lookup first, one changed assumption at a time, and evidence matched to the exact promise. Visual form remains the writer's choice. Needed visibility is the person/service/tenant trust path, the authority of three tasks, and the difference between table privilege, row access and row integrity.

## Example proposal for the coordinator

Reuse the accepted tenant-integrity scenario: tenant 10 contains customers 1–3 and the starting orders; tenant 20 has customer 4, Rowan Vale. Customer IDs stay globally unique. No extra order, payment, product, staff person or changed starting row is needed. Reuse (10, 4) only as an invalid attempted reference.

Propose logical identities `shop_runtime`, `shop_migrate` and `shop_support` for this independent access scenario. They label tasks, not people. Runtime serves authorised tenant requests; migration changes schema with separately held authority; support's example task is a tenant-scoped read of selected customer/order details, with no payment-changing or schema-changing task. Specific native grants remain for the implementation writers. The central record should agree these names/tasks before their use. A request authorised for tenant 10 attempts to select tenant 20 or customer 4; no customer is recast as a staff member. Tenant-level access does not imply that every customer may read every other customer's data within that tenant.

## Primary sources checked on 25 October 2026

- [OWASP Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html), Introduction and Recommendations: authentication versus authority; derive permissions from tasks/resources, deny by default, test and revisit permissions.
- [OWASP Database Security](https://cheatsheetseries.owasp.org/cheatsheets/Database_Security_Cheat_Sheet.html), Creating Secure Permissions: separate service credentials, minimal object access and avoiding runtime administration/ownership. Used for design guidance, not a universal list of required grants.
- [OWASP Multi Tenant Security](https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html), tenant context and database isolation: verify client tenant selection, establish context per transaction, test bypass and reuse paths. Its strategy comparison supports the design choices; native SQL examples are not prescribed here.
- [PostgreSQL 18 Privileges](https://www.postgresql.org/docs/18/ddl-priv.html): actions differ by object; ownership, public grants and grant options contribute authority. A task may require several privileges; this outline does not imply UPDATE alone suffices for a real guarded update.
- [PostgreSQL 18 Role Membership](https://www.postgresql.org/docs/18/role-membership.html): inherited privileges and role assumption are distinct routes to effective authority. Detailed native treatment remains with pg-access.
- [PostgreSQL 18 Row Security Policies](https://www.postgresql.org/docs/18/ddl-rowsecurity.html): row policies supplement object grants, distinguish visible/existing and proposed rows, and have privileged bypass cases. Do not generalise PostgreSQL's defaults or syntax to other engines.
- [PostgreSQL 18 SET](https://www.postgresql.org/docs/18/sql-set.html): session state can persist after commit; transaction-local state ends at commit/rollback. This grounds the pool reuse risk, not a complete pool configuration recipe.
- [PostgreSQL 18 ALTER DEFAULT PRIVILEGES](https://www.postgresql.org/docs/18/sql-alterdefaultprivileges.html): future objects have a separate privilege lifecycle; native creator/default rules belong in pg-access.

## Boundaries and continuity

No native execution was performed. The writer must label any visual access model as illustrative and verify any claimed SQL outcomes through the coordinator's owned disposable runtime. Keep restricted views/routines conceptual here: whether their underlying access, caller rights or ownership makes them safe requires native checks. No generic promise that row security stops a compromised service which can choose its own trusted tenant context.

Outline continuity pass complete: identity precedes privileges, table grants precede row scope, row scope precedes trust and write checks, and these establish the tests. The separate reference-integrity failure does not masquerade as an access failure. Pending coordinator agreement is limited to the proposed logical identities/tasks; no accepted tree boundary is unresolved.
