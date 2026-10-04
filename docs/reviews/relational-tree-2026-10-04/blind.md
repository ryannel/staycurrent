# Fresh-reader review of the relational collection

I read the proposal as an engineer who can build an application but may not know how databases arrange or protect its data. This review concerns the titles, descriptions, and navigation promises in the tree. It makes no judgement about articles that have not been written.

I expect the collection to teach me how to put application data into a relational database, ask useful questions of it, make changes safely, and keep it working as the application grows. I also expect to learn enough of the machinery to explain a slow query or an unexpected transaction result. “Inside PostgreSQL” promises a closer look at one implementation after those shared ideas make sense.

For a first visit, I would open “Relational databases — introduction and overview,” then “Turning application data into tables.” The latter gives me something concrete to work with. I would not naturally read the whole tree from top to bottom: the storage and execution material arrives before I have written my first query.

## Three questions I would bring

| Reader question | Where I would go | What I would need from the route |
| --- | --- | --- |
| How should I store orders when a customer's address or a product's price can change? | “Turning application data into tables” → “Normalisation and deliberate duplication” → “Keeping invalid data out” | The description's “historical snapshots” is an excellent signal. I can see where a purchase's recorded price might differ from a product's current price. |
| How do I stop two customers buying the last item? | “When two requests change the same data” → “What belongs in one transaction?” → “What can a transaction see?” → “Waiting, deadlocks, and retries” | The last-item example makes the entry unmistakable. I need the first article to tell me which of the other three explains the next part of my problem. |
| Why did the dashboard make checkout slow? | “Reporting on operational data” → “Understanding the database work behind a request” or “Investigating a slow query” → “When the database is waiting” | I can find the workload conflict, but I cannot yet tell how to choose between investigating an individual query, repeated queries, and resource contention. |

## Five findings that would change navigation

1. **The collection needs visible starting routes.** “Designing your data” makes a natural beginning, but “How the database works” then presents five mechanism articles before “Writing queries whose results you understand.” That ordering could suggest that pages, indexes, plans, joins, and crash recovery are prerequisites to using SQL. The closing promise that readers can arrive at practical questions helps, but the tree itself does not show how. The overview should offer a short first-application route and direct entrances for incorrect results, slow requests, and operating a live database. These routes can reuse the articles already listed.

2. **Two different kinds of waiting need clearer entrances.** “Waiting, deadlocks, and retries” and “When the database is waiting” both sound right when checkout hangs, and both descriptions implicate locks. I infer that the former teaches how an application handles blocked or aborted transactions, while the latter diagnoses why work is stalled. That is a useful distinction, but the titles leave me to supply it. Wording such as “Handling transaction waits, deadlocks, and retries” and “Finding what the database is waiting for” would make the different jobs easier to see. Each should point to the other when the reader's question changes from finding the cause to handling its consequences.

3. **The boundary between valid data and safe concurrent changes needs an explicit bridge.** “Keeping invalid data out” promises constraints and application validation. “What belongs in one transaction?” promises invariants, a term a newer reader may not recognise. For a rule such as “stock must never fall below zero,” I could reasonably start in either place. The last-item article is well labelled, but it does not by itself tell me whether I need validation, a constraint, or a transaction. The descriptions should connect these articles through a concrete rule and explain which question each answers. This is a navigation problem, not a reason to combine all three.

4. **The PostgreSQL branch needs a sign explaining when to enter it.** I can confidently distinguish “How indexes work” from “Choosing indexes for your queries”: one explains the structure, the other helps me choose. “Indexes in PostgreSQL” adds a third destination, and the same pattern appears in “From SQL to an execution plan” versus “Following a query through PostgreSQL,” and “What happens when a write commits?” versus “WAL, checkpoints, and recovery.” The descriptions justify these separate articles. What is missing is a route for someone already using PostgreSQL: should I begin with the shared explanation, or does the PostgreSQL article supply it? A short introduction to this branch and direct links between each pair would resolve that uncertainty without adding more coverage.

5. **I cannot find the application question “Did my write succeed?”** “What happens when a write commits?” names memory, logging, persistence, and crash recovery. “Waiting, deadlocks, and retries” covers work that cannot proceed. Neither description clearly covers a request whose connection disappears before the application receives its answer. As a reader asked to implement retries, I would want to know where to learn whether retrying could repeat a completed operation. This may belong within an existing article; the tree need only make that destination visible. It does not require another broad branch.

## What already works

The titles repeatedly give me a recognisable situation: changing a schema while the application runs, investigating a slow query, recovering from a backup, and two requests changing the same data. The descriptions supply enough detail to distinguish several neighbouring articles without assuming specialist vocabulary.

“Normalisation and deliberate duplication” is especially inviting because its description makes room for historical facts, rather than presenting table design as a rule to obey. “Understanding the database work behind a request” also earns its place beside “Investigating a slow query”: a request can do too much work even when no single query looks alarming. “Testing a change before trusting it” gives performance work a destination beyond making a plausible adjustment.

## Recommendation

Keep this as the coverage map. Before turning it into reader-facing navigation, add a few short routes and clarify the handoffs above. Most of the uncertainty concerns choosing the next article, rather than missing subject areas. I would start with a small connected route through table design, query results, and transactions, while keeping the broader map visible as proposed coverage.
