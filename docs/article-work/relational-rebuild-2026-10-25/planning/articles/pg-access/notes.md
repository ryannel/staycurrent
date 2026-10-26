# Planning notes

## Inputs and reference exposure

Read the complete isolated commission, article, neighbours, incoming ownership, reading-link index and shared shop record. Applied the current `staycurrent-breakdown` skill, its `staycurrent-write` reference-reading procedure and the continuity pass. No target body, previous outline, review or feedback was read.

Read all 19 bounded parts separately through `scripts/read-writing-reference.py`: sequences 1–6, indexes 1–7 and storage 1–6. Every END marker was delivered. Studied finished figures at port 4584, including Sequence diagrams’ waiting/activation explanation, Indexes’ composite-key comparison and Storage and durability’s WAL layers, state labels and controls. Their useful pattern is a concrete path, a controlled change and an explained consequence. The plan identifies understanding and what needs exposing; the writer chooses figures, interactions, paragraph development and final wording.

Read the complete available replacement-preview bodies at these exact translated links:

- [Database access and least privilege](http://127.0.0.1:4606/review/relational-rebuild/access-control/)
- [Constraints and data integrity](http://127.0.0.1:4606/review/relational-rebuild/constraints/)
- [Inside PostgreSQL](http://127.0.0.1:4606/review/relational-rebuild/postgresql/architecture/)

The first already teaches transferable task-derived privileges, tenant context, the empty session baseline and tests as deployed identities. Develop their native mechanics here rather than repeating that whole explanation. The architecture parent supplies connections, backends and query stages. Constraints owns the complete composite-reference design. Extensions remains a planned neighbour, so its accepted brief supplies the boundary. All four owned IAB tabs were closed; viewport and theme settings were unchanged.

## Example and evidence decisions

Reuse the independent access scenario: tenant 10 has the existing shop; tenant 20 has customer 4, Rowan Vale. Keep `shop_runtime`, `shop_migrate` and `shop_support` as task identities. Support reads tenant/customer IDs and customer names, and tenant/order/customer IDs plus order status. It has no payment-changing, order-changing or schema-changing task. Preserve the original three orders, their statuses and payments; cross-tenant writes are attempts in disposable data or rolled-back transactions, not new business events.

Use a trusted application setting transaction-local tenant context as the main model, with an empty session baseline. State its limitation at the point of use: a freely settable context protects against an omitted SQL condition when supplied correctly, but cannot authenticate the tenant against that same SQL caller. Missing, reset and empty values must deny access or raise an explicit error. A local value can restore an unsafe session value afterwards; test both commit and rollback. Avoid inventing a new identity provider or signed-assertion scheme.

Local roles for object ownership or a narrow function, schema names and function names are implementation assumptions the writer may choose and label. A privileged support lookup must keep the same tenant and column contract and state how it authorises scope; accepting a tenant argument is insufficient. Prefer static SQL for that case. If dynamic names are introduced, correct quoting does not grant the caller authority over the named object.

The central things needing to be visible are effective authority through memberships and objects, existing-versus-resulting-row checks, and the object a privileged name actually resolves to. No visual layout is prescribed. The eventual writer should verify consequential native examples on an owned PostgreSQL 18 fixture through real login connections, recording version, role options, ownership, grants, policies and statement outcomes. Catalogue checks support but do not replace exercised allow/deny paths. No native execution or observed result is claimed by this plan.

## Primary sources checked

Checked PostgreSQL 18 documentation on 26 October 2026. Use versioned links even if a newer major exists.

- [Role membership](https://www.postgresql.org/docs/18/role-membership.html), [Role attributes](https://www.postgresql.org/docs/18/role-attributes.html) and [GRANT](https://www.postgresql.org/docs/18/sql-grant.html): INHERIT, SET and ADMIN are separate; inherited owner privileges can undermine a seemingly restricted membership. Table grants do not automatically grant sequence access.
- [Privileges](https://www.postgresql.org/docs/18/ddl-priv.html) and [ALTER DEFAULT PRIVILEGES](https://www.postgresql.org/docs/18/sql-alterdefaultprivileges.html): ownership is stronger than ordinary grants; defaults apply to future objects created by the current role, not existing objects or inherited creators’ defaults.
- [System information functions](https://www.postgresql.org/docs/18/functions-info.html) and [SET ROLE](https://www.postgresql.org/docs/18/sql-set-role.html): distinguish session and effective identities. SET ROLE does not apply the target role’s login configuration defaults.
- [Row security policies](https://www.postgresql.org/docs/18/ddl-rowsecurity.html): enablement/default denial, owner and privileged bypass, FORCE, whole-table operations, integrity checks and possible information leaks. `row_security = off` raises errors where filtering would occur; it is not a bypass switch. Policies consulting changing external rows can introduce snapshot races; keep the worked tenant predicate local to its row and supplied context.
- [CREATE POLICY](https://www.postgresql.org/docs/18/sql-createpolicy.html): USING, WITH CHECK and permissive/restrictive composition. A restrictive policy alone supplies no positive allowance. Real UPDATE/RETURNING and upsert paths can require several policy checks; verify statements actually shown rather than implying a read policy covers every write.
- [CREATE VIEW](https://www.postgresql.org/docs/18/sql-createview.html): default base-table privilege/RLS checks use the view owner; security_invoker uses the invoker. This is not identical to changing current_user inside a SECURITY DEFINER function. If a filtered view is presented as its own security boundary, consider security_barrier and its documented limits separately.
- [CREATE FUNCTION: safe SECURITY DEFINER functions](https://www.postgresql.org/docs/18/sql-createfunction.html#SQL-CREATEFUNCTION-SECURITY): trusted search path, explicit pg_temp placement and restricted EXECUTE in the creation transaction. Use a minimally privileged owner and prevent untrusted replacement of its code and dependencies.
- [Schemas](https://www.postgresql.org/docs/18/ddl-schemas.html): placing a writable schema in search_path trusts its creators. Inspect the actual public-schema grants on upgraded databases instead of assuming fresh-install defaults.
- [Customised options](https://www.postgresql.org/docs/18/runtime-config-custom.html), [SET](https://www.postgresql.org/docs/18/sql-set.html) and [configuration functions](https://www.postgresql.org/docs/18/functions-admin.html#FUNCTIONS-ADMIN-SET): custom placeholders, transaction lifetime, restoration and missing-setting behaviour underpin the context model. The authorisation limitation above is an inference from caller-controlled configuration.
- [PL/pgSQL dynamic commands](https://www.postgresql.org/docs/18/plpgsql-statements.html#PLPGSQL-STATEMENTS-EXECUTING-DYN): values can use USING; identifiers require safe construction and a separate authority decision.

## Boundaries and continuity

Keep this as one article: roles, policies, views and privileged functions are successive authority paths for the same task, not separate deeper outcomes requiring new pages. No ownership change or contextual child is proposed. Authentication configuration, TLS, credential operation, monitoring roles and incident intervention belong with PostgreSQL operation; extension installation and lifecycle privileges stay with pg-extensions. Do not turn support into an administrator or treat Mina/Rowan as database staff roles.

The plan’s continuity pass checked prerequisite order, the exact task/column contract, unchanged shop facts, the tenant/context trust distinction, and the difference between row access and referential integrity. No unresolved shared-fact or ownership proposal remains. Delivery is plan and notes only; root owns preview, implementation, integration and acceptance.
