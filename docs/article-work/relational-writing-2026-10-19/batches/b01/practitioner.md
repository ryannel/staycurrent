# b01 — independent practitioner review

Reviewed 19 October 2026 under `staycurrent-review`, practitioner perspective.
Assessed every assigned article against the original relational-practice goal,
its supplied plan and family boundaries. Read the actual a00/a01/a02 drafts and
used the previously reviewed, unchanged a14 as the available SQL child. No old
relational corpus, other perspective's review or teaching-reference articles
were read. No article, component, retained evidence, commit or publication state
was changed.

| ID | Practitioner verdict | Required practitioner repairs |
| --- | --- | --- |
| a00 | Pass | None |
| a01 | Pass | None |
| a02 | Pass | None |

These verdicts cover correctness, practical depth and family boundaries. Root
separately reports a shared-build failure for four internal a00 figure headings;
that recorded structural repair and the final build remain delivery gates. This
review does not override them or certify the separate teaching/layout review.

## a00 — Relational databases

**Pass.** The orientation supplies a coherent first answer before routing to
depth. The shop example connects identities, relationships, row meaning,
atomicity, isolation, application ownership, physical work, compatible change,
recovery and candidate selection. It does not imply that transactions invent
business rules, atomically cover a payment provider or preserve acknowledged
work under every failure arrangement.

The one-row conditional stock update is a sound high-level intervention. It
names PostgreSQL Read Committed, interprets zero returned rows as no reservation,
and requires the application to roll back the attempted order. It explicitly
limits the argument before multirow rules. The
[PostgreSQL isolation contract](https://www.postgresql.org/docs/18/transaction-iso.html#XACT-READ-COMMITTED)
supports its waiting and predicate-recheck account; independent native execution
reproduced one successful decrement and no row for the competing buyer.

The introduction distinguishes the durability setting from device loss, replica
freshness from acknowledgement and replication from earlier recoverable data.
Its performance and evolution sections offer actionable first reasoning without
claiming a benchmark, rollout, failover or restore was executed. Primary checks
included [asynchronous commit](https://www.postgresql.org/docs/18/wal-async-commit.html),
[EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html),
[PITR](https://www.postgresql.org/docs/18/continuous-archiving.html) and
[standby operation](https://www.postgresql.org/docs/18/warm-standby.html).

The parent-first route is explicit and matches the commissioned order: a02's
setup first, then a01 → a02 → a03 → a04, with separate task entrances for slow
work, service limits, live changes and adoption. Actual a01 and a02 develop the
promised design and SQL first cases. Detailed locks/isolation, connection and
request recovery, plan diagnosis, live-change procedures, restoration and
candidate evaluation remain with their planned owners. The conditional SQLite
and distributed-candidate entrances do not become a mandatory vendor sequence.

**Independent evidence:** ran the complete owned native verifier in a fresh
`rel3_a00_runN` review database. It passed SQL/model agreement, 36 and NULL order
totals, empty-match counts, null predicates, separate commits, rollback, commit
and two competing stock updates. Removed only that review database afterwards.
In my own Chrome tab, stepped the rendered join model to the inner and left
grouped results; checked the partial-commit state, uncommitted writer/reader
difference, rolled-back absence and successful stock-zero commit. Displayed
states agree with the stated model and checked SQL. The figure labels remain
illustrative; they are not presented as concurrent engine traces.

Optional advice: none needed for practitioner acceptance.

## a01 — Designing relational data

**Pass.** This is a complete first design, rather than links to design topics.
The one-place booking, retained customer–session record, tenant scope, current
profile, agreed fee and limited history requirements all have visible effects
on the schema. Surrogate identity does not replace business uniqueness; tenant
scope is present in references as well as identifiers. The treatment of merges,
reactivation and deletion follows those declared meanings.

The article accurately distinguishes required values, checks, identity and
references. It does not mistake a foreign key for a minimum-child rule or
schema validity for capacity enforcement. The enforcement table also exposes
agreed-price capture and amendment authority as remaining obligations. The
accepted overcapacity fixture is useful counterevidence, not hidden failure.
The [constraint documentation](https://www.postgresql.org/docs/18/ddl-constraints.html)
supports the null/check, composite-reference and deletion claims.

The numerical range and assignment-rounding warning are correct. Its upper
bound rejects numeric NaN, and the finite-instant check matches the stated
representation. The distinction between an instant and a recurring local
schedule is accurate; see [numeric types](https://www.postgresql.org/docs/18/datatype-numeric.html)
and [date/time types](https://www.postgresql.org/docs/18/datatype-datetime.html).
Current names and historical agreements are correctly separated; current status
is not sold as a complete change history.

Against the actual introduction and SQL sibling, the depth is appropriate.
Small roster/count queries test schema meaning without becoming a second SQL
tutorial. Value round trips and structured representations remain with a09;
conditional/timed constraints with a10; formal decomposition and maintained
derived copies with a11; version/history patterns with a12. Capacity protocols
remain with transactions, measurements with performance and removal/recovery
procedures with operations. No specialist modelling expansion is necessary.

**Independent evidence:** loaded the displayed schema and fixture in a new
`rel3_a01_runN` database, independently checked the full baseline roster value
`11, Mina Shah, 20.00`, then ran the owned verification SQL. All expected
rejections and assertions passed on native PostgreSQL 18.6, UTC, C/C: duplicate
booking/code, missing and cross-tenant references, missing/zero capacity, invalid
fees/status/start, merge collision and referenced deletion. Counts were 1/1/0;
the rolled-back overcapacity example was accepted as advertised; 20.005 rounded
to 20.01; final B11 was Mina Patel/cancelled/20.00 with current offer 22.00.
Removed only the review database. In my Chrome tab, compared the copied-name
disagreement with the single owned-name correction at the same step, then
confirmed the changed offer and cancelled booking retained its agreed fee.

Optional advice: none needed for practitioner acceptance.

## a02 — Working with SQL

**Pass.** The parent supplies sufficient syntax and reasoning to finish its
ordinary report, including a small complete WITH example before multiple named
stages. Selection, nulls, typed arithmetic, joins, grouping, EXISTS, windows,
pagination and changes are connected to observable decisions rather than
catalogued. Input row identity, result row meaning and independent subtotals are
consistent throughout. Exact numeric/Boolean types and current receipts for
January placements are explicit.

The missing-line policy and non-null payment amounts justify the asymmetric
defaults. Period endpoints, tied timestamps, conditional update counts and
rollback outcomes are correct. The pagination explanation accounts for inserts,
deletes and changed sort values, and does not promise a frozen result from a
cursor. The CTE account correctly separates statement scope from physical
materialisation; the window example correctly separates available input,
partition calculation and display order. Checked these against PostgreSQL's
[WITH](https://www.postgresql.org/docs/18/queries-with.html),
[window](https://www.postgresql.org/docs/18/tutorial-window.html),
[set-operation](https://www.postgresql.org/docs/18/queries-union.html) and
[UPDATE](https://www.postgresql.org/docs/18/sql-update.html) contracts, alongside
the query/type documentation already cited for the other batch articles.

The actual a14 now has its promised `#checkable-stages` prerequisite. a02 explains
the notation and first pre-aggregation repair while a14 deepens cardinality,
ON/WHERE, count/completeness and independent activity totals. The explicit
order-payment versus customer-payment distinction avoids a silent fixture
change. The parent leaves detailed membership/scalar/view/traversal decisions
with a15, further expression cases with a13, frames/ranking with a16 and richer
modification/conflict semantics with a17. Optional recursion is appropriately
motivated rather than imposed on ordinary query readers. Concurrency guarantees
and execution costs remain separate owners.

**Independent evidence:** ran every assertion in the owned native verifier in a
fresh `rel3_a02_runN` database, suppressing only its final write to the retained
`native-evidence.json`. The repository evidence stayed unchanged. All report,
types, intermediate results, changes, negative fixtures and pagination/model
checks passed on native PostgreSQL 18.6. Removed only the review database. In my
Chrome tab, inspected inner and left join rows and exercised every pagination
variant, obtaining:

| Between requests | Offset page | Keyset page |
| --- | --- | --- |
| None | 102, 105 | 102, 105 |
| Insert 107 | 101, 102 | 102, 105 |
| Delete 100 | 105, 106 | 102, 105 |
| Move 102 before cursor | 101, 105 | 105, 106 |

**Optional a02-O1:** at snapshot line 179, explicitly separate type checks from
the displayed EXCEPT ALL comparison. The native verifier already checks types
with `pg_typeof`, and the earlier prose introduces that function. A brief
reminder would help readers reproduce the same assurance: set operations can
coerce compatible differing types before comparing values, so an empty
difference alone does not prove the original output types. This is documented
in [type resolution](https://www.postgresql.org/docs/18/typeconv-union-case.html).
The article does not explicitly claim EXCEPT independently checks types, and
the actual evidence checks them separately, so this is not a blocker.

## Review boundaries and reproducibility

Read the original/writing commission, all three assigned article plans, supplied
family briefs/section boundaries, owned model/SQL/component/verifier sources,
source records and writer handoffs. All assigned snapshot bytes matched their
rendered source fragments. All fourteen component/evidence hashes matched the
b01 manifest after the independent executions.

No unchanged pilot SQL or whole-site build was rerun. Native review databases
were fresh, article-named and removed after each run; shared cluster settings,
other databases and the root-owned preview were left alone. No production,
hosted payment, failover, restore or performance test is inferred. Browser checks
above establish displayed mechanism/outcome agreement; mobile layout, keyboard
behaviour, playback quality and style-reference fidelity remain with the
independent teaching perspective.
