# Relational introduction: evidence

Research notes, accessed 4 October 2026. These support the commissioned
introduction in `docs/relational-collection-plan.md`; they are not publication
entries or a product comparison. Sources are official documentation. PostgreSQL
examples use the version 18 manual, not a moving `current` URL. No benchmarks
were run or performance conclusions established.

## Question and example

What does the relational approach give an application that needs several answers
about the same customers, orders, and products?

The editorial example has customer C4, Ada; products P7, blue mug, and P8, bowl;
order O12 belonging to C4; and two order lines: O12/P7, quantity 2, price paid 18
per item, and O12/P8, quantity 1, price paid 24 per item. Their line totals are
36 and 24; their combined goods total is 60. These are invented teaching data,
not observations from a shop. State the currency if displaying a currency symbol;
the commission does not specify one. Taxes, delivery, discounts, and refunds are
outside this arithmetic example.

## Claim-to-source record

### Tables, rows, and columns

**Source:** [PostgreSQL 18, 5.1 Table Basics](https://www.postgresql.org/docs/18/ddl-basics.html),
opening three paragraphs. Accessed 2026-10-04.

**Observed:** Tables have named columns and variable numbers of rows. A column's
type constrains its values and operations. SQL does not guarantee row order
without explicit sorting and does not automatically give every row a unique
identifier.

**Use and limit:** A row represents one customer, product, order, or order line
in this model. That division is our design, not a rule that every table represents
a physical object. A displayed table is a logical view, not a disk diagram. Use
`ORDER BY` if an example promises a particular result order. Avoid describing
primary keys as something SQL silently adds for us.

### Keys and declared rules

**Source:** [PostgreSQL 18, 5.5 Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html),
sections 5.5.1, 5.5.2, 5.5.4, and 5.5.5. Accessed 2026-10-04.

**Observed:** A primary key identifies rows through unique, non-null values and
can span columns. A foreign key requires matching referenced values, subject to
null handling; it can reference qualifying unique columns, not only a primary
key. `NOT NULL` prevents nulls. `CHECK` accepts true or null, so positivity alone
does not make a value required. PostgreSQL does not support checks against other
table rows. Declaring a foreign key does not automatically index its referencing
columns. Delete behaviour depends on the declared action.

**Use and limit:** C4 identifies Ada; `orders.customer_id` references that identity.
Use `NOT NULL` for required references and `quantity integer NOT NULL CHECK
(quantity > 0)` for positive whole quantities. These rules cannot establish that
an address is real, a price is commercially correct, or an order has a line.
The last requires additional design. Do not equate matching identifier values,
a declared constraint, and the query that retrieves related facts.

### What a foreign-key failure demonstrates

**Source:** [PostgreSQL 18, 3.3 Foreign Keys](https://www.postgresql.org/docs/18/tutorial-fk.html),
worked cities/weather example. Accessed 2026-10-04.

**Observed:** The tutorial inserts a weather row whose city has no referenced
city row; PostgreSQL rejects it with a foreign-key violation. The rule requires
the reference to remain valid as data changes.

**Use and limit:** An attempted order for nonexistent C99 is a faithful adaptation
when `orders.customer_id` has the declared constraint. A line referencing an
existing order does not conversely require every order to have a line. Avoid
borrowing a source's loose wording in ways that suggest that converse guarantee.

### Joining the records

**Source:** [PostgreSQL 18, 2.6 Joins Between Tables](https://www.postgresql.org/docs/18/tutorial-join.html),
opening example and footnote 4. Accessed 2026-10-04.

**Observed:** A join pairs rows according to an expression and combines their
columns. Inner joins omit unmatched rows. The tutorial explicitly distinguishes
its conceptual comparison of pairs from the engine's actual execution.

**Use and limit:** Joining O12 to C4 and its two lines, then each line to its
product, produces two result rows with Ada's name repeated. This follows from
the supplied data and chosen predicates; it is not measured behaviour. Show
the desired answer before syntax. Matching values explain the result; arrows
between keys do not represent disk pointers or assert a particular join algorithm.
A join does not require a previously declared foreign key, and a foreign key
does not itself retrieve a product's name.

### Coordinated changes and atomicity

**Source:** [PostgreSQL 18, 3.4 Transactions](https://www.postgresql.org/docs/18/tutorial-transactions.html),
opening transfer example and `BEGIN`/`COMMIT`/`ROLLBACK` explanation. Accessed 2026-10-04.

**Observed:** A transaction groups database changes into an all-or-nothing unit.
PostgreSQL allows explicit transaction blocks, and rollback cancels their changes.
Other transactions do not observe its uncommitted intermediate changes.

**Use and limit:** Insert O12 and both intended lines in one transaction. On
rollback, none of those inserts remain. On successful commit, the intended
changes take effect together. This is our shop adaptation. The application must
include all intended operations and handle errors; the database cannot infer
that a programmer forgot the bowl. Keep the promise scoped to these database
changes, not an external payment, email, or shipment. Detailed durability and
recovery configuration are outside this introduction.

### Atomicity does not settle concurrent decisions

**Source:** [PostgreSQL 18, 13.2 Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html),
Table 13.1 and section 13.2.1. Accessed 2026-10-04.

**Observed:** Isolation levels permit different anomalies. PostgreSQL defaults
to Read Committed: successive ordinary selects in one transaction may observe
different committed data. Serializable has stronger guarantees; the chapter
discusses failures and retries required by stricter modes.

**Use and limit:** A transaction block alone is not a complete explanation of
whether two checkouts can both act on stock they read earlier. That needs the
chosen statements, constraints, isolation, and conflict handling. Introduce
atomicity here and link the concurrent-checkout question to separate reading.
Do not say all transactions execute one at a time or that `BEGIN` prevents
every race. Sequences have special non-rollback behaviour, so avoid broad claims
that rollback reverses every observable effect.

### Physical layout is an implementation choice

**Sources:** [PostgreSQL 18, 66.1 Database File Layout](https://www.postgresql.org/docs/18/storage-file-layout.html),
paragraph beginning with the built-in heap qualification;
[MySQL 8.4, 17.6.2.1 Clustered and Secondary Indexes](https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html),
opening and primary-key bullets. Both accessed 2026-10-04.

**Observed:** PostgreSQL's described built-in heap and index access methods keep
table and index files separately, with additional forks and possible segments;
other access methods may differ. InnoDB stores row data in a clustered index and
uses a declared primary key for it. It has fallback choices when no primary key
is declared.

**Use and limit:** These are contrasting implementation examples, not instructions
to teach storage internals in the introduction. They support separating logical
identity from physical arrangement. Avoid saying a primary key never affects
storage, every relational engine stores tables identically, or a table always
equals one file. Neither source establishes relative speed for our workload.

### Relational tables do not dictate a server deployment

**Sources:** [PostgreSQL 18, 1.2 Architectural Fundamentals](https://www.postgresql.org/docs/18/tutorial-arch.html),
client/server explanation; [About SQLite](https://www.sqlite.org/about.html),
opening prose under Executive Summary. Both accessed 2026-10-04. SQLite's page
is an unversioned project overview.

**Observed:** PostgreSQL uses a client/server model; client and server can be on
different hosts. SQLite implements a SQL engine as an in-process library without
a separate server process.

**Use and limit:** This contrast is enough to show that tables and SQL do not
prescribe where the engine runs. It does not establish hosting costs, replication
behaviour, capacity limits, or which product to choose. Do not turn SQLite's
promotional performance statements into evidence for the article.

## Editorial inferences and open boundaries

Keeping a current product price and the price paid on an order line records two
different facts. If P7's current price changes, O12's agreed price can remain 18.
This is a modelling inference from the shop's historical-record requirement,
not a feature that relational databases automatically supply. The application
must store the agreed value and protect any required immutability. Product names
and addresses also change; a receipt needing historical versions must model
those separately. The proposed name join retrieves the name stored now.

For this small example, `(order_id, product_id)` could identify each line only if
the shop allows one line per product per order. Separate line identifiers or
line numbers permit repeated products. The article should either state that
simplification or avoid silently imposing it.

The shop is a plausible fit because it benefits from related records, several
queries over those facts, enforceable rules, and grouped updates. That conclusion
follows from the demonstrated capabilities. It does not prove a product choice,
scaling threshold, universal query cost, or that another data model cannot offer
constraints or transactions. Large scans and contention are questions to investigate
in an implementation, not disqualifications established by the relational model.

## Useful further reading

- [Table Basics](https://www.postgresql.org/docs/18/ddl-basics.html): a short next
  step for readers who want to create the tables and choose column types.
- [Joins Between Tables](https://www.postgresql.org/docs/18/tutorial-join.html):
  develops matching rows, missing matches, and explicit output columns.
- [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html): the
  reference for deciding which declared rule expresses a particular requirement.
- [Transactions](https://www.postgresql.org/docs/18/tutorial-transactions.html):
  a concrete introduction to grouping changes and undoing incomplete work.
- [Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html):
  deeper reading for the separate question of simultaneous requests; it should
  not be a prerequisite for understanding this introduction.

Storage and architecture references above are evidence for scope boundaries.
They need not all appear in the article's compact reader-facing list.

## Revised introduction and additional evidence

The user rejected the worked-order structure. That draft and its query are retained
in `superseded/`; the current introduction has a simple product table and an existing
relationships sketch. The query execution record applies to the retired example,
not a code example in the current page. The revised brief supersedes the initial
narrative framing above. Prices/stock in the table are illustrative current values,
not a before/after checkout simulation.

Additional primary sources opened on 4 October 2026:

- PostgreSQL18 [page layout](https://www.postgresql.org/docs/18/storage-page-layout.html),
  opening and table-row layout: the built-in heap uses pages and row tuples. Footnote
  explicitly limits the format to relevant access methods. This supports the concrete
  row-store description, not a universal layout for every relational engine; large
  values may be stored separately (TOAST). No page-size claim is made.
- PostgreSQL18 [internals overview](https://www.postgresql.org/docs/18/overview.html):
  parsing, planning/optimisation and execution support distinguishing the query from
  its chosen execution strategy. No plan/timing for this illustrative table is claimed.
- PostgreSQL18 [index introduction](https://www.postgresql.org/docs/18/indexes-intro.html):
  matching record lookup, maintenance costs, and conditional index usage.
- PostgreSQL18 [explicit locking](https://www.postgresql.org/docs/18/explicit-locking.html),
  row locks: conflicting writers wait; lock modes differ and ordinary reads are not
  all blocked. The overview says a write lock can make another writer wait, not that
  locks serialize all access or automatically prevent every race.
- PostgreSQL18 [MVCC introduction](https://www.postgresql.org/docs/18/mvcc-intro.html):
  multiple versions and snapshots support ordinary readers alongside writers. Combined
  with the isolation reference above, supports overview of visibility and conflicts.
- PostgreSQL18 [relational concepts](https://www.postgresql.org/docs/18/tutorial-concepts.html):
  named tables, common columns and data types; relation is mathematical term for table.
- SQLite [serverless](https://www.sqlite.org/serverless.html): distinguishes in-process
  engine deployment from a separate server and the cloud-service use of serverless.
- PostgreSQL18 [JSON types](https://www.postgresql.org/docs/18/datatype-json.html),
  [text search introduction](https://www.postgresql.org/docs/18/textsearch-intro.html),
  and [pgvector's own project documentation](https://github.com/pgvector/pgvector):
  examples of overlapping document/search/vector facilities. pgvector is an extension,
  not a core PostgreSQL feature. These support the existence of overlap, not performance,
  production-readiness or equivalence to a specialist system.

## Continuity revision, 4 October 2026

Opened PostgreSQL 18 explicit-locking section 13.3.2, tutorial-transactions, and
wal-intro for the revised prose. The locking example is bounded to PostgreSQL's
default behaviour: competing locking reads wait, then return the updated row.
The application must check it after obtaining the lock and hold the lock through
the change; delayed writes alone do not repair an earlier stale decision.
Durability is conditional on setup and failure scope, with no blanket loss-survival
promise. These are documented explanations, not executed database tests.

The join result Blue mug, 2 follows directly from P7 and quantity 2 in the existing
illustration. No SQL execution, extra stored result, or historical price is claimed.
The index example distinguishes orders.customer_id from the customers primary key;
no exact performance or physical lookup count is claimed.

## Whole-page polish: current examples and additional evidence

4 October 2026. Earlier multi-line order examples above describe superseded drafts.
The current SQL aid uses one line for O12: P7, quantity 2; P7's name is Blue mug.
Its displayed SELECT/JOIN/WHERE query was extracted from the component and executed
in Python's SQLite 3.53.1 against an in-memory fixture. Extra P8 and O13 rows checked
that the join and order filter select the expected row. Observed result:
`[('Blue mug', 2)]`. No PostgreSQL execution or benchmark was performed.

The index aid adds independent invented orders O12/C4/€36, O13/C8/€24,
O14/C4/€60, O15/C2/€18 and O16/C9/€40. Its question needs totals that are absent
from the index. Order IDs label logical destinations, not universal physical
pointers. Phone stacking preserves those labels while omitting cramped arrows.
The locking aid is a schematic sequence with one available item, not a continuation
of the five-item product table or a measured timing trace.

The independent technical reviewer opened and checked these primary sources:

- [PostgreSQL 18 index types](https://www.postgresql.org/docs/18/indexes-types.html)
  and [ordered indexes](https://www.postgresql.org/docs/18/indexes-ordering.html):
  equality/range access and ordered entries support the qualified common-index
  explanation. No universal claim that all indexes sort, or a speedup estimate.
- [PostgreSQL 18 Read Committed](https://www.postgresql.org/docs/18/transaction-iso.html#XACT-READ-COMMITTED):
  ordinary reads use committed data as of query start; locking reads can wait and
  return an updated row. The prose explicitly distinguishes those cases.
- [PostgreSQL WAL](https://www.postgresql.org/docs/18/wal-intro.html) and
  [InnoDB redo](https://dev.mysql.com/doc/refman/8.4/en/innodb-redo-log.html):
  persistent logs are a common recovery mechanism, with engine/settings/storage
  qualifications retained. Logging does not establish protection from loss of all
  stored copies.

Full technical conditions and repair PT4 are in polish-technical.md. Final prose
and media review is recorded separately from engine execution.
