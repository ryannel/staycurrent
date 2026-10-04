# Learning design review

The proposal is a strong coverage map. Its practical questions give an unfamiliar engineer reasons to enter, and the separation between shared ideas and PostgreSQL gives the collection room to teach beyond one product. It is not yet a learning plan: the tree says what the publication might cover, but rarely says what readers should be able to explain, predict, or choose after reading.

That distinction matters at this stage. There are no article drafts here. The concerns below are gaps in the plan, not evidence that the eventual explanations would fail. The proposal explicitly allows direct entry, brief prerequisite explanations, and revised article boundaries; those are useful commitments to build on.

## 1. Give the collection a few ideas readers can carry between products

The branches organise work well, but the transferable ideas sit inside topic lists. An unfamiliar reader could leave knowing that databases have indexes, transactions, and logs without understanding how these change an engineering choice.

Add a short statement of the collection's intended understanding. For example, readers should come to see how representing a fact once affects updates; how specifying a result leaves the database several ways to compute it; how avoiding reads creates additional work during writes; and how concurrent requests can violate a rule even when each request looks correct on its own. Persistence after a crash can follow as another distinct promise.

Map proposed articles to these ideas in the editorial plan. Do not turn them into abstract vocabulary that readers must learn first. Each article should establish one idea through a concrete problem, then show where it applies again. “Inside PostgreSQL” becomes especially valuable when it lets a reader recognise an idea in a particular implementation and notice where that implementation changes their options.

## 2. Replace the blanket prerequisite promise with local, explicit dependencies

“Each article introduces its prerequisites briefly” is a good intention, but it does not identify what those prerequisites are or whether a brief introduction is plausible. An explanation of join algorithms assumes the reader already understands which joined rows belong in the answer. Index column order assumes some understanding of ordering and the lookup being attempted. Neither dependency is visible in the tree.

For each early commission, name the smallest thing the reader must understand on arrival, the example that will supply it if needed, and the deeper explanation to link. Keep that record editorial; the reader usually needs a small table or worked step, not a prerequisites panel.

The introduction also needs a defined job after the field-guide paragraph. Use a tiny application to connect a stored fact, a requested result, and a change to the data. That gives the tree something concrete to refer to without making the introduction compulsory or asking it to summarise every branch.

## 3. Specify where a mechanism becomes a usable choice

Separating “How indexes work” from “Choosing indexes for your queries,” and execution plans from slow-query investigation, can support different reading depths. It can also strand the explanation in one article and its purpose in another. The proposal does not yet establish the boundary.

Give each mechanism article one practical consequence that it fully explains. Give each practical article enough of the mechanism to justify its decision. For indexes, a reader should see both the work a lookup avoids and the additional structure a write must maintain, then use that understanding to compare two plausible choices. A deeper article can explore structure and implementation without making that first decision depend on it.

For the first release, allow a single bounded article to serve both jobs where this makes the explanation stronger. Split it only when there are two worthwhile reader questions, not simply because the tree has two categories.

## 4. Connect data rules to concurrent work before readers mistake a schema for the whole solution

The tree places constraints under data design and invariants under transactions. This is sensible organisation, but the plan does not show how readers discover the boundary between them. Someone entering through “Keeping invalid data out” needs to understand which example rules the database can enforce directly and why another rule may require coordinating several changes.

Make this a deliberate cross-link through a shared example: a booking or stock change whose rule must still hold when two requests overlap. Establish the rule first, show the interleaving, and explain a bounded remedy and its assumptions. This connects tables, constraints, and transactions without requiring readers to complete a separate concurrency course. It does not require expanding into the parked distributed-systems collection.

## 5. Commission a few optional journeys and aids that test understanding

The final paragraph permits direct arrival but supplies no first journeys. With this many plausible articles, newcomers may have difficulty choosing a useful next step. Add two or three short routes with concrete destinations, such as “design a small feature's data,” “understand why a lookup gets expensive,” and “keep a rule true when requests overlap.” Let readers enter at any stop and leave when their question is answered. These are recommendations, not a numbered syllabus.

Attach teaching aids to the uncertain step in each route. Small before-and-after tables can expose an update problem; highlighted output rows can explain join multiplication; a page-access comparison can make index costs visible; a two-request timeline can expose a race. Use interaction when changing an input makes a consequence easier to discover. The prose must still explain the result.

Include a small transfer prompt near the end of an article: change the query, the update pattern, or the business rule and invite a prediction before explaining it. A second domain is useful occasionally: understanding an inventory example should help with a booking example. These prompts give the reader and reviewer evidence of learning without turning the collection into coursework. No aid has been proposed yet, so this is a commissioning opportunity rather than a finding about absent or ineffective media.

## A first set that can demonstrate learning value

Start with a compact orientation and five bounded articles. This revises some proposed boundaries for the pilot rather than adding five more titles:

1. **Turning application data into tables.** Establish facts, identity, and relationships with a small feature. Finish by explaining one consequence of storing the same mutable fact twice; leave wider normalisation coverage for later.
2. **Writing queries whose results you understand.** Use a tiny dataset to explain filtering and one join, including why the join can return more rows than the reader expected. Defer a complete SQL survey.
3. **Keeping invalid data out.** Show how a few constraints protect specific rules, then identify a rule that needs the next article's treatment.
4. **What happens when two requests reserve the last item?** Combine the initial transaction-boundary and race material around one rule, one failing schedule, and one justified approach. Link future isolation and retry depth as planned coverage.
5. **How an index changes the work of a query.** Combine the first mechanism and choice explanation: compare a scan with a suitable index for a query the reader understands, then change the query or write frequency to reveal a limit.

The first two can lead toward either data correctness through articles three and four, or query work through article five. Every article should also work for a direct arrival. Use one familiar application where continuity reduces setup, but restate the relevant facts locally so the sequence never becomes mandatory.

Review this set by asking whether a reader can predict a changed result, explain an avoided or added cost, and justify a choice in a second small example. A reader test would provide stronger evidence than editorial judgement alone; the proposal gives no such evidence yet. Product comparisons and deep PostgreSQL coverage can follow once the initial set establishes shared ideas that those articles can use.
