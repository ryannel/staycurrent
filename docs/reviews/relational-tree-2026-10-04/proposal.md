# Relational collection: proposal under review

Snapshot of the tree presented in conversation, 4 October 2026. These are proposed
articles. Group labels organise reading and do not necessarily need landing pages.
The audience is intelligent but not necessarily familiar with database technology.

```text
Relational databases — introduction and overview
│
├── Designing your data
│   ├── Turning application data into tables
│   │   Identity, keys, relationships, and cardinality
│   ├── Normalisation and deliberate duplication
│   │   Shared facts, historical snapshots, and update problems
│   ├── Keeping invalid data out
│   │   Constraints, missing values, and application validation
│   └── Tables, documents, or both?
│       Where structured columns and embedded data fit together
│
├── How the database works
│   ├── How records are stored and retrieved
│   │   Pages, row layouts, memory, and the cost of accessing data
│   ├── How indexes work
│   │   Search structures, lookup paths, and maintenance costs
│   ├── From SQL to an execution plan
│   │   How the database chooses and executes a way to answer
│   ├── How joins work
│   │   Different ways to combine records and the work they require
│   └── What happens when a write commits?
│       Changes in memory, logging, persistence, and crash recovery
│
├── Querying and indexing
│   ├── Writing queries whose results you understand
│   │   Filtering, joins, aggregation, duplicates, and missing values
│   ├── Choosing indexes for your queries
│   │   Access patterns, column order, coverage, and write costs
│   ├── Working through large result sets
│   │   Ordering, pagination, batching, and changing data
│   └── Reporting on operational data
│       Aggregation, precomputed results, and competing workloads
│
├── Transactions and concurrent work
│   ├── What belongs in one transaction?
│   │   Related changes, invariants, and transaction boundaries
│   ├── When two requests change the same data
│   │   Races, conflicting updates, and the last-item example
│   ├── What can a transaction see?
│   │   Isolation, snapshots, and surprising observations
│   └── Waiting, deadlocks, and retries
│       What the application must do when work cannot proceed
│
├── Understanding performance
│   ├── Investigating a slow query
│   │   Plans, measurements, estimates, and actual work
│   ├── Understanding the database work behind a request
│   │   ORMs, repeated queries, round trips, and batching
│   ├── When the database is waiting
│   │   Connections, locks, storage, and resource contention
│   └── Testing a change before trusting it
│       Representative data, workloads, measurements, and regressions
│
├── Running and evolving the database
│   ├── Changing a schema while the application runs
│   │   Compatibility, migrations, backfills, and index creation
│   ├── Keeping a database healthy over time
│   │   Maintenance, statistics, growth, and signs of trouble
│   ├── Backups you can actually recover from
│   │   Restore procedures, recovery objectives, and verification
│   ├── Replicas and failover
│   │   Read scaling, lag, availability, and recovery limits
│   └── Controlling access and managing the data lifecycle
│       Privileges, retention, deletion, and copies of sensitive data
│
├── Choosing products and recognising limits
│   ├── PostgreSQL, MySQL, and SQL Server
│   │   Important differences and the situations where they matter
│   ├── When an embedded database fits
│   │   SQLite and the choice of where the database runs
│   └── When should you add another system?
│       Documents, search, vectors, analytics, and the cost of separation
│
└── Inside PostgreSQL
    ├── PostgreSQL architecture — an overview
    │   Connect the major components to a concrete read and write
    ├── Following a query through PostgreSQL
    │   Planning, execution, buffers, and access paths
    ├── Row versions, transactions, and vacuum
    │   Visibility, cleanup, and why old work can affect new work
    ├── Indexes in PostgreSQL
    │   Implementation choices and specialised access methods
    ├── WAL, checkpoints, and recovery
    │   Follow a committed change through a crash
    └── Extending PostgreSQL
        Core capabilities, extensions, and their operating consequences
```

Each article introduces its prerequisites briefly and links to deeper explanations.
Readers can arrive directly at a practical question. General mechanism explanations
and practical decision articles have different jobs; product depth should show how
one implementation realises the shared ideas. Current suitability questions sit
alongside this collection as dated assessments. This is a proposed coverage
destination to develop in small groups, with article boundaries open to revision.
