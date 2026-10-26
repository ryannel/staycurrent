# Example facts and continuity

The article uses the access variation: tenant 10 customers 1 Mina Shah, 2 Tariq Aziz, 3 Edda Berg; tenant 20 customer 4 Rowan Vale. Customer IDs remain globally unique. Orders 101/102/103 retain customers, timestamps and paid/paid/pending statuses. No new business rows or committed changes. No new payment/stock/line claims.

Local implementation assumptions, not shared business-fact changes:

- shop schema owns the illustrative base tables; shop_migrate owns the schema/tables and changes them.
- shop_deploy is a separate deployment LOGIN, not a person/customer; its membership allows deliberate SET ROLE shop_migrate without automatic inheritance. Runtime/support have no migration membership.
- shop_reader is an inheritable non-login grant group, with runtime SET and ADMIN false.
- First interface: trusted application supplies transaction-local shop.tenant_id; empty baseline; missing/empty context yields no rows, malformed integer errors. Freely setting 20 exposes Rowan, explicitly described.
- Diagnostic UPDATE(name) privilege lets runtime attempt name=name on customer 4. It is a harmless fixture probe, not additional support work. UPDATE 1 without RLS distinguishes UPDATE 0 under context10; move-order103 proposal fails WITH CHECK before integrity checks. The proposal does not become a stored state.
- Alternative support customer interface removes raw customer grants AND previous example views. shop_private.support_scope maps the actual shop_support login to tenant10. This is protected authorisation data, not caller context or a business customer fact.
- shop_lookup owns only its function and has narrowly selected column reads, no login/superuser/BYPASSRLS/base-table ownership. Its SELECT policy permits candidate rows; the function’s qualified protected-mapping join supplies the tenant boundary.
- Unsafe definer version resolves an unqualified support_scope to the caller’s fake temporary table, with caller-supplied SELECT grant to lookup. Secure version uses qualified names and fixed trusted path, pg_temp last. Separate illustration, no malicious changes to real/shared data.
- Native verifier substitutes sc_access_verify/sc_access_private for article shop/shop_private to identify its owned namespace. Both have identical relevant columns, grants, policies and query predicates. Native actual logins are required for session_user mapping evidence.

Continuity reread: introductory authority distinctions flow into roles, object checks, context, row checks, indirect paths and application-identity verification. Owner/FORCE caveat remains next to bypass and views. Tenant integrity is linked to its owner. Extension lifecycle is linked without being redeveloped. Support routine is explicitly a different trust arrangement and removes earlier reading paths. Within-tenant person permissions remain an application concern; tenant access never silently establishes them.
