# Commissioning review of the relational tree

Independent review, 4 October 2026. Reviewed `proposal.md` against the site direction, coverage structure, and the relational passage in the database field guide. Other reviews were not consulted. These are planning findings, not judgements about articles that have yet to be written.

The tree covers the intended territory and allows useful direct entry. Its chief weakness is that it gives nearly every subject an article title before deciding which titles earn separate arguments. Keep the coverage ambition; treat most leaves as questions awaiting a commission. Five material changes would make the plan easier to produce and maintain.

## 1. Give the introduction an outcome beyond introducing the collection

The field guide has already explained tables, relationships, constraints, transactions, and the attraction of this approach for orders and inventory. “Introduction and overview” could repeat that passage or expand into a miniature version of the whole tree. Neither outcome is specified yet.

Commission an introduction that follows a small order from stored facts through a query and a related update. Its useful result is a connected picture: what the application asks for, what the database guarantees, and which choices remain the engineer's responsibility. Stop before access structures, isolation levels, or product differences require their own explanations. The article can contain the compact reading map; an additional collection landing page has no demonstrated job.

Keep that map organised by reader questions: representing data, understanding an unexpected result, handling competing updates, investigating work, choosing an engine. The current group labels can remain editorial organisation. Their wording is a preference; making readers visit separate category pages would be a structural decision with a real navigation cost.

## 2. Resolve ownership across mechanism, practice, and PostgreSQL depth

The strongest overlap is among “How indexes work,” “Choosing indexes,” “From SQL to an execution plan,” “How joins work,” “Investigating a slow query,” and three PostgreSQL overview/query/index pieces. Separate articles can work, but their current descriptions do not establish distinct stopping points.

Start with one index article that explains enough of a lookup to justify a concrete index choice, including the added write work. Hold the general search-structure article until a separate question needs more depth. Make plan investigation own the practical reasoning from observed work to a hypothesis. A later join-mechanism article should explain why alternative ways of combining rows have different costs, without becoming another plan-reading tutorial.

Merge “PostgreSQL architecture — an overview” and “Following a query through PostgreSQL” into one candidate. A concrete query can provide the architecture tour. Keep PostgreSQL index depth conditional on a particular implementation choice that changes the reader's decision; “specialised access methods” alone is a catalogue-sized remit.

Keep the shared commit/recovery explanation and PostgreSQL WAL piece as separate possibilities, but commission one first. The second needs a consequence that the first cannot explain, rather than another traversal of the same write with more component names.

## 3. Rebuild the transaction boundaries around two independent reader problems

“What belongs in one transaction?” risks stopping before the competing request that makes its boundary consequential. Conversely, the last-item article will need enough transaction explanation to stand alone. “Waiting, deadlocks, and retries” also spans two distinct outcomes: successfully repeating a rejected attempt and deciding what happened when the application's answer is missing.

Combine transaction boundaries and competing changes for the initial article: which related changes must hold together, and what must the application do when two attempts conflict? Use the last-item example, stop after one complete and explicitly scoped solution, and give retries enough space to make that solution usable. Do not promise a survey of isolation behaviour here.

Keep “What can a transaction see?” as a separate explanation whose subject is observations over time. Retain waiting/deadlocks as later depth only if a particular problem warrants it. Add ambiguous outcomes to the scope notes for application integration: a retry article must distinguish a known failed attempt from an outcome the caller does not know. This is a missing boundary in the plan, not a reason to launch the parked distributed-systems programme.

## 4. Shrink the umbrella promises before increasing the article count

Several leaves contain enough material for a small collection. “Writing queries whose results you understand” promises filtering, joins, aggregation, duplicates, and missing values. Begin with one question, such as why a join changed the number being counted. Teach the required SQL locally; leave the wider list as coverage to revisit. “Testing a change before trusting it” should initially be a substantial part of a performance investigation, with a separate article earned by a distinct experimental problem.

“Controlling access and managing the data lifecycle” combines who may act now with where data remains over time. Separate those outcomes in the coverage map, without immediately commissioning two articles. Likewise, replace the future brief for “Keeping a database healthy over time” with a particular symptom or maintenance consequence before authoring it.

“When should you add another system?” should teach the cost of another copy and another operational responsibility through one bounded choice. Reporting on operational data is a good candidate for that choice; give the decision about a separate analytical store one home there. Leave documents, search, and vectors as possible future assessments rather than equal sections promised by one article. Schema-level decisions about embedded documents can remain in “Tables, documents, or both?”

## 5. Define the maintained comparison before committing to six PostgreSQL essays

Keep PostgreSQL, MySQL, and SQL Server together. A useful comparison asks the same small set of questions for stated application situations; it need not reproduce every dimension of the collection for each engine. Record engine versions and distinguish engine, edition, extension, and hosted service when those distinctions affect a claim. Durable articles should link to this maintained comparison instead of each carrying their own changing product summaries.

PostgreSQL depth should begin with the most revealing implementation consequence. “Row versions, transactions, and vacuum” has a clearer potential argument than the proposed architecture or extension surveys: connect what readers observe to the work required to preserve and clean up versions. This is a promising commission, not a claim that its unwritten explanation already succeeds. Defer “Extending PostgreSQL” until a specific extension choice needs explanation. Keep SQLite as a deployment decision that can be read directly; it need not become a fourth column in every comparison.

## A first useful collection

Commission five pieces, in two small batches:

1. **An order through a relational database:** the introduction described above, with a small reading map.
2. **Two buyers, one remaining item:** the transaction and conflict article, with an explicit application outcome.
3. **Row versions and cleanup in PostgreSQL:** implementation depth linked to the concurrency explanation, with its own local setup.
4. **Why did this join change the count?** A bounded practical query article.
5. **Choosing among PostgreSQL, MySQL, and SQL Server:** a researched comparison for stated situations, with links to available explanations.

Produce the first three before committing the remaining two. They test whether the introduction, shared teaching, and selective product depth have sufficiently different jobs. The next pair makes the collection useful both to someone debugging ordinary query behaviour and someone choosing a product. Schema design, indexing, and recovery remain visible planned coverage; their absence from this first slice does not make the collection claim to teach them already.

Use the shop example where it clarifies a relationship between these pieces. A transaction timeline or visible row versions may support the first batch, but media should follow each article's argument. There is no reason to assign an interaction to every title at planning time.

No finding requires wholesale reorganisation of the eight groups. The material work is to replace broad promises with bounded commissions, give repeated teaching a clear home, and let subsequent reader questions determine which remaining leaves become articles. This review authorises neither production nor publication.
