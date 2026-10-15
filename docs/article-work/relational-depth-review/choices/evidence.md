# Focused repairs to access and product choices

15 October 2026. Initial independent decisions for all twelve assigned articles
are retained in `../review/operations-initial.md`. Root commissioned these three
repairs after that review. Other article sources, the registry and shared lesson
imports are outside this author's edit ownership.

## Reader and bounded outcomes

The reader understands ordinary SQL and has followed the existing page, but
should not have to supply an administrator's or distributed-systems engineer's
missing reasoning.

- **Controlling access:** derive the result when a second row policy is added;
  repair accidental widening and preserve the existing column boundary.
- **Adding another system:** locate the source application, delivery worker and
  destination operation; explain which durable state survives each interruption
  and why a repeated delivery cannot undo the withdrawal.
- **Product comparison:** derive the two-read result under explicit settings,
  distinguish an observed run from a documented expectation, and understand why
  an old SQLite reader cannot simply retry a failed write in the same snapshot.

These are repairs inside existing articles, not a general queue implementation,
an RLS security handbook or a multi-product performance benchmark. No new
article routes were needed.

## Implemented examples

`src/lib/sql-lessons/relational-depth-choices.ts` exports
`relationalDepthChoicesTutorials` with two independent fixtures:

- `policy-composition`, six steps. Three records establish tenant and status
  independently. The initial tenant policy returns IDs 1 and 3. A second
  permissive readiness policy returns 1, 2 and 3. The restrictive replacement
  returns only 1. Email remains forbidden with SQLSTATE 42501. Removing the
  permissive policy returns nothing, and restoring it returns 1. The packed
  variation returns only 3. Setup and finishing steps restore the effective
  administrator role.
- `outbox-delivery`, seven steps. Rolling back changes neither the source nor
  outbox. Committing leaves source version 2 and a pending complete-state
  event. Destination application leaves the source event pending, explicitly
  modelling the gap before acknowledgement. Equal-version replay updates no
  destination row, after which the source event is marked delivered. A late
  active version 1 cannot replace inactive version 2.

The outbox fixture uses separate runs in one physical database. It has one
sequential worker, no network, no parallel worker claim protocol and no
exactly-once transport claim. Its immutable per-product version is the event's
identity; it is not a timestamp or a global event order. Code and prose name
the real separation between destination and source calls.

The access article's truth table derives every row of both policy combinations.
The added outbox figure follows source commit → destination apply → source
delivery mark, with the pending-event state visible after destination success.
It is responsive HTML, using the existing light/dark theme tokens and unique
`outbox-` classes. Captions identify the interruption point.

## Executed evidence

`verify-lessons.mjs` executed every new lesson step on PostgreSQL 18.6 and
PGlite, asserting selected semantic results rather than merely accepting valid
SQL. `lessons-observed.json` stores engine versions, result rows and SQLSTATEs.
The restrictive packed-status variation also passed on both engines.

Native execution uses only `sc_depth_choices` in root's isolated cluster at
`/private/tmp/staycurrent-relational-depth/socket`, port 55439, with the scoped
nonlogin role `depth_shipping`. It does not use or change another database's
tables or roles. PGlite uses an independent in-memory database.

`compare-reads.mjs` used two native PostgreSQL connections and waited for B's
insert to commit before A's second count. Read Committed produced 1 → 2;
Repeatable Read produced 1 → 1. A new transaction counted 2 in both cases.
`postgresql-reads-observed.json` records these observations.

`compare-sqlite.py` created a private temporary SQLite 3.54.0 file with WAL mode,
separate non-shared-cache connections and explicit transaction boundaries.
The same schedule produced 1 → 1. A write attempted by the older reader failed
with extended code 517 / SQLITE_BUSY_SNAPSHOT. After rollback, a new count was
2. `sqlite-reads-observed.json` preserves this evidence. The temporary database
was removed after closing both connections.

MySQL and SQL Server were **not executed**. Their table entries are explicit
documented expectations for this ordered schedule; no throughput or capacity
comparison is inferred from any of these tiny fixtures.

## Primary references and reasoning

- [PostgreSQL 18 row security](https://www.postgresql.org/docs/18/ddl-rowsecurity.html)
  and [CREATE POLICY](https://www.postgresql.org/docs/18/sql-createpolicy.html),
  checked 15 October 2026: permissive policies OR together, restrictive policies
  must all pass, and permissive access is required. The lesson's result table
  follows directly from those conditions and was executed independently.
- [PostgreSQL data-modifying WITH](https://www.postgresql.org/docs/18/queries-with.html#QUERIES-WITH-MODIFYING):
  RETURNING supplies the rows consumed by the outbox INSERT. The example copies
  the updated state, rather than an application snapshot predating the UPDATE.
- [PostgreSQL INSERT](https://www.postgresql.org/docs/18/sql-insert.html):
  ON CONFLICT's condition controls whether an existing destination is updated.
  Equal or older version payloads have no state effect in this complete-state
  protocol. This is not a safe rule for arbitrary deltas.
- [Transactional outbox pattern](https://microservices.io/patterns/data/transactional-outbox):
  source changes and outgoing events are saved together, with repeated delivery
  possible when the relay fails after publication. The example is a local
  demonstration of that invariant, not a packaged production relay.
- [PostgreSQL 18 isolation](https://www.postgresql.org/docs/18/transaction-iso.html),
  [MySQL 8.4 InnoDB isolation](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html),
  [SQL Server isolation](https://learn.microsoft.com/en-us/sql/t-sql/statements/set-transaction-isolation-level-transact-sql?view=sql-server-ver17),
  and [SQLite isolation](https://www.sqlite.org/isolation.html): exact ordinary
  read modes and reader-to-writer behaviour. The comparison deliberately
  requires B's commit to finish before A's second statement, so it does not
  confuse blocking with a different snapshot result.

## Author reading and remaining verification

The access addition retains the initial shipping lesson and clearly resets to
three new records before comparing policies. The outbox section follows the
already explained destination version guard, supplying the previously missing
source transaction and caller sequence. The comparison supplies the exact
records before its output table. No existing successful explanation was
rewritten solely to increase length.

SQL and source checks pass. Root owns the full build, shared lesson integration
and collection browser run. The independent foundation reviewer found no
source repair needed; its judgement is retained in
`../review/choices-technical.md`.

`capture.mjs` checked all three pages in the assembled production preview at
390 and 1280 pixels, in light and dark. All twelve page states returned 200,
had no page JavaScript errors and had no document-width overflow. The
`layout-observed.json` record and twelve crops under `visual/` preserve the
check. I inspected every crop at native size: the outbox labels and directional
arrows remain separate on desktop and stack in order on the phone; both tables
keep every heading and result readable in both themes. The product-comparison
table becomes tall on the phone because the explicit read modes wrap, but its
counts and evidence remain aligned and none are clipped.

Root's continuous reader and integrated lesson/browser checks remain the
final collection review; this self-check does not replace them.

## Final reader clarification: conversion

The sequential reader found that “type affinity” and “SQL mode” named mechanisms
without explaining their effects. A separate SQLite 3.54.0 in-memory experiment
created `inputs(quantity INTEGER)`, inserted text '12' and 'many', and queried both
value and `typeof(quantity)`. It returned integer 12/integer and 'many'/text. The
same inserts into a STRICT table converted '12' and rejected 'many' with extended
error 3091. `sqlite-affinity-observed.json` preserves those observations. The final
article now derives the difference from those values.

MySQL 8.4's SQL-mode documentation explicitly demonstrates the non-strict 'abc'
integer insertion becoming 0 with a warning, versus strict rejection. The article
labels this as documented, not an executed MySQL trial. Sources checked 16 October:
https://www.sqlite.org/datatype3.html, https://www.sqlite.org/stricttables.html and
https://dev.mysql.com/doc/refman/8.4/en/sql-mode.html.
