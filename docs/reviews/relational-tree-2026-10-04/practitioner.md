# Practitioner review of the relational collection

Reviewed the proposal independently on 4 October 2026. This is a review of planned coverage and article boundaries; it does not assess unwritten explanations. I read the proposal and the Stay Current style guidance, without consulting other reviews.

The tree covers most of the questions an application engineer eventually brings to a database. Its main weakness is that several important decisions fall between articles. Adding many more titles would make that harder to see. I would first give those decisions clear homes and make the assumptions behind the general mechanism articles explicit.

## 1. Put the system's shape near the entrance

The overview needs to separate the relational model, the SQL interface, physical storage, and deployment. Otherwise, “How the database works” can quietly establish a single-machine row store as the meaning of relational, with SQLite and other arrangements arriving much later as exceptions. The proposal's pages, row layouts, logging, and recovery form a useful concrete example, but the collection should identify the system being followed.

Give the overview a short map of these independent choices. Explain where the database runs, where authoritative data lives, and which work crosses a process or machine boundary. Keep the map small enough that a reader can use it to locate the examples that follow. A reader should leave knowing that choosing a relational database has not, by itself, settled these implementation choices.

In the mechanism articles, label the example architecture and carry it consistently through reads and writes. Rename “How records are stored and retrieved” to “What it costs to read data,” or explicitly subtitle it as a page-based row-store example. Reserve detailed alternatives for the places where they change a decision. Necessary discussion of replicated or partitioned databases fits here without reopening the parked distributed-systems programme.

## 2. Give the meaning of stored values a home

The design branch names identity, relationships, normalisation, constraints, and missing values. It does not yet assign responsibility for choosing what a value means: money and precision, instants and local times, units, text equality, and the representation of state. These choices connect modelling to everyday query correctness. They are also a useful place to make product differences concrete.

Add “types, units, precision, and time” to the commission for “Turning application data into tables.” Let “Keeping invalid data out” own which of those meanings the database can enforce. This need not become a catalogue of SQL types or a new article immediately. One example where two reasonable representations answer different questions will do more work than a list of supported types.

Keep logical query meaning in “Writing queries whose results you understand”: what one output row represents, how a join can multiply rows, what an aggregate counts, and what ordering promises. Then “How joins work” can stay about execution strategies. That boundary protects the reader from learning a fast way to obtain the wrong answer.

## 3. Treat transaction outcomes as an application responsibility

The transaction branch has a good progression from invariants to concurrent observations and waiting. Its weakest seam is the transition from a database operation to an application workflow. “Retries” could end up teaching only what to do after a deadlock, while leaving unclear what to do when a request times out and the application does not know whether its change committed.

Give “Waiting, deadlocks, and retries” explicit ownership of three cases: the database rejected the transaction, it completed, or the caller cannot determine the outcome. Its practical question should be “What can I safely try again?” Include the scope of the retry and how the application recognises an operation it has already performed.

Give “What belongs in one transaction?” responsibility for identifying effects outside the transaction, such as sending a message or calling a payment service. It should establish the boundary of the database guarantee and point to a bounded application pattern when the example needs one. This is necessary database use, not a requirement to teach a general theory of distributed workflows.

## 4. Make recovery, replication, and migrations meet at a concrete promise

The operations branch contains the right topics. Their commissions should share an application-level test: after a failure or a rollout, which acknowledged changes must remain, what can the application serve, and how does the operator establish that the result is correct?

“Backups you can actually recover from” should own restoring data to a chosen point and checking that the application can use it. “Replicas and failover” should own the application's read and write behaviour during lag and promotion, including the limits of the selected configuration. “Changing a schema while the application runs” should own compatibility across application versions, resumable backfills, and what happens if deployment stops halfway through. Link them through one failure or rollout example rather than repeating generic advice to test procedures.

Keep “Controlling access and managing the data lifecycle” bounded. Least privilege and the fate of deleted data across copies are both useful, but each could swallow the article. State the application engineer's decisions first; deeper administration can remain linked reference material.

## 5. Use product differences to resolve decisions throughout the collection

The product comparison and PostgreSQL branch risk becoming two final laps through material already explained. A broad PostgreSQL/MySQL/SQL Server comparison can also become a feature inventory with little connection to the reader's current problem.

Give the comparison article a handful of decisions inherited from the collection: transaction behaviour, schema changes, access paths, deployment, and operational responsibility. Bring short product-specific qualifications into the practical articles when they affect the advice. The comparison can then collect those differences and help a reader investigate a candidate; it need not teach every engine.

Commission each PostgreSQL article only when it adds an explanation the shared treatment cannot provide. For example, the shared commit article establishes the durability promise and the simplified recovery mechanism; the PostgreSQL article follows the actual components and configuration choices that realise it. “Following a query through PostgreSQL” should connect already familiar steps to PostgreSQL evidence and tools. If a proposed depth article cannot name that additional payoff, merge or defer it.

## A useful first slice

Start with a short overview and three articles around a small ticket-booking application:

1. **Turning application data into tables.** Model performances, seats, and bookings. Establish identity, relationships, the meaning of one row, and where price and time belong. Introduce the essential constraints where the example needs them.
2. **Writing queries whose results you understand.** Retrieve bookings and count booked seats. Make joins, duplicates, missing values, and ordering visible in the returned rows.
3. **When two requests change the same data.** Try to book the same seat twice. State the invariant, show the race, make the transaction boundary explicit, and explain the caller's response to a failed or uncertain attempt.

Use PostgreSQL for runnable examples and label that choice. Briefly explain prerequisites inside each article; do not require the reader to wait for the rest of the tree. This slice reaches a useful result: an engineer can model a small problem, ask questions without miscounting, and protect its central invariant under concurrent use. The next slice can investigate the cost of those queries through plans and indexes.

Keep the rest as planned coverage. A useful publication sequence does not require every group to have an article before the first group is ready.
