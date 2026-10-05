# Practice: independent agent first reading

This is an agent reading, not the commissioned real human reader session. I read the built practice HTML from top to bottom and the supplied blind-review voice reference. I did not read source, earlier reviews or author rationale, run Docker, install software, or execute SQL. My reading uses the rendered document text and its disclosure boundaries; it does not test browser layout or whether the downloads work.

## Questions in reading order

1. At “a separate practice database when that state changes,” I wondered whether every article needs another Docker container. Later, “another empty database in the same container” resolves that: one running container holds several article databases.
2. At “Have Docker installed and running first,” I needed to know where to do that. The macOS/Windows instruction names Docker Desktop and waiting for its engine, and links the installation guide; Linux names a running Docker Engine. I would need the linked guide if Docker were absent. Opening the computer's terminal is assumed.
3. At “a disposable database called staycurrent-practice,” I treated that as the database name. Later commands create `shop_design`, and “same container” clarifies that `staycurrent-practice` names the container. The early use of “database” makes the nesting less clear than the later instructions do.
4. After the detached Docker command, I wondered how to know that PostgreSQL was ready. The next passage gives `pg_isready`, its successful response, the two wait-and-repeat responses, and the Docker-engine error. This is resolved before the next action.
5. At the downloads, I wondered whether a file on my computer would be accessible to PostgreSQL in Docker. The following passage answers this directly: change to the browser's download folder, copy with `docker cp`, and use the container's `/tmp/…` paths. It also explains changed filenames after repeated downloads.
6. At the block containing four copy commands, I wondered whether I must download all four now. The comment says “Copy the other files when you reach their articles,” and the following paragraph says the extension copies can wait. The visible route therefore needs only `designing-data.sql` initially.
7. At `psql -X -U postgres -d shop_design`, I wondered where the following commands belonged. The changed `shop_design=#` prompt and “Enter the following there” settle that. The explanation distinguishes backslash commands without semicolons from SQL with semicolons.
8. At `\i`, I wondered whether the file only creates records or also queries them. The next paragraph says it prints the O12 receipt and gives the expected contents. The count of two orders gives a second checkpoint. I can reach a receipt without composing SQL myself.
9. At “paste individual SQL statements from the article,” I wondered what to do if a deliberately rejected write appeared to break the session. The same paragraph distinguishes an error outside a transaction from one inside a transaction, and gives `ROLLBACK;` for the latter. “Transaction” is not defined here; I rely on the relevant article to identify when its example is inside one.
10. At the new-article command block, I wondered whether `\q` and `docker exec` could all be pasted in psql. The prose says `\q` leaves psql; the inline comment then marks the terminal commands. That resolves the locations, but a beginner copying the entire block at once could still paste shell commands before they have returned to the terminal.
11. After loading `query-results.sql`, I wondered whether I could close psql and come back tomorrow. The next paragraph names the temporary tables, says they disappear on reconnect, and directs me to rerun only the linked filter setup. It explicitly says not to reload the extension and duplicate records. This resolves the temporary-table case.
12. At the article database table, I wondered how to start an article without a downloadable extension. “Article's stock setup” and similar entries direct me back to that article, and the later passage explains two terminals connected to the same database. The table provides names rather than a complete recipe for these articles; I would use the demonstrated `createdb`/`psql` pattern and load the base once.
13. At the optional JSON instructions, I wondered whether loading the whole extension would leave the data at the article's beginning. The disclosure says its final output is stoneware with capacity 350 and earlier ceramic filters ran before that update. It explains the final state, but does not explicitly say how to follow the article interactively from its beginning after running the complete extension.
14. At “Finish the practice,” I wondered which data survives. The visible passage says stopping removes the container and practice databases, while downloaded SQL files remain. Starting again means creating another instance and reloading the files. Resolved.

## The route I can reconstruct

I install and start Docker using the named application or engine and linked guide. In my computer's terminal I run the given `docker run`, then repeat the readiness check until it accepts connections. I download `designing-data.sql`, change to its download folder, and copy it into the container as `/tmp/designing-data.sql`.

Still in the terminal, I create `shop_design` and start the given psql command. At `shop_design=#` I enter `\i /tmp/designing-data.sql`, which creates the four shop tables, inserts the sample records and runs the receipt query. I set the NULL display and run the order count. I expect Blue mug, quantity 2, agreed price 18.00, total 36.00, and two orders. I can then copy an individual variation from the schema or constraints article.

The computer holds the downloaded SQL files. Docker holds the running PostgreSQL environment and psql. The container holds the copied `/tmp/` SQL files and the article databases. Each article database contains its tables and records. The psql session connects to one chosen database; temporary tables belong to that session and vanish when it reconnects. The page supplies all of these relationships, though the first reference to the container as a “database” briefly obscures the distinction.

For Queries and joins, I first copy its extension file if I have not already done so. I leave psql with `\q`, create `shop_queries` in the terminal, connect, load the base, set NULL display, and load its extension. I keep this session open for the temporary-table filter exercise. If I reconnect, I rerun only that exercise's setup using the supplied link. For another attempt I choose another database name and load the base once. For overlap exercises I use two terminals connected to the same named article database.

A rejected statement can be an expected lesson result. I can continue directly if it was outside a transaction; inside a failed transaction I enter `ROLLBACK;`. I must inspect returned rows before pasting subsequent steps when the article asks me to. The guide does not teach how to recognise transaction status from a psql prompt; following the article's explicit `BEGIN`/end sequence supplies that context.

## Visible route and optional disclosures

The visible route supplies Docker startup, readiness, download/copy locations, database creation, psql entry, receipt and count checkpoints, deliberate-error handling, fresh article databases, temporary-table recovery, two-session guidance and cleanup. I do not need an optional disclosure to reach the receipt or start Queries and joins.

The collection navigation, JSON recipe, pagination recipe and existing-PostgreSQL alternative are disclosures. The JSON and pagination disclosures add final-state explanations; pagination also warns against wrapping the file in an extra transaction. The installed-PostgreSQL alternative assumes installation-specific authentication and connection knowledge, and says that explicitly. A newcomer can stay with the complete Docker route.

## Prior knowledge I supplied

I know how to open a terminal, enter a command, recognise a shell comment and continuation backslash, download a browser file, and find my Downloads folder. I recognise that terminal and psql are different command interpreters once the guide names them. I supplied no knowledge of the shop's schema or receipt SQL: the downloadable script runs that query and the guide states its answer. For deliberate transaction errors I supplied the broad idea that `BEGIN` starts a transaction; this page gives recovery commands but leaves the concept to the articles.

## Material gaps and suggested repairs

- **The container is initially named as a database.** Observation: “a disposable database called staycurrent-practice” led me to expect that as the database name before I encountered `shop_design`. Suggested repair: call it a PostgreSQL container there, and say it will contain the separate article databases.
- **A whole extension finishes an article before the instruction to experiment with article statements.** Observation: the JSON disclosure describes its final mutated state, while the general route says I can paste article SQL. I cannot tell from this guide alone which setup or modifying snippets to skip after loading the whole extension, or how to reproduce an earlier result without duplicate tables or altered state. Suggested repair: distinguish “run the complete worked script” from “follow the article one statement at a time,” and identify how to initialise the second route. This is especially relevant to the ceramic-to-stoneware example; it is not a failure of the receipt route.

The mixed `\q`/shell block is a smaller usability concern. Its locations are explained, but separate psql and terminal blocks would make copy-and-paste behaviour easier to predict.

## Separate reading of the three isolated variations

After saving the practice reading, I read each named exercise from its corresponding built HTML. The following judgments use the exercise's prompt and disclosed answer, without importing the surrounding article as supplied evidence. Referencing an earlier query or protocol is acceptable in an article, but it means the exercise is not independently specified when isolated.

### Modelling: `#receipt-variation`

Questions before the disclosure:

- Which columns does “the receipt query above” read? Does it obtain the name from the current catalogue or a stored purchase name?
- Does the schema retain any historical product name elsewhere? The prompt says not to change the order line, but does not show its fields or rule out a history table.

My prediction from the stated facts alone is quantity 2, agreed unit price €18 and total €36, provided the receipt reads the unchanged line's agreed values. I cannot determine its name column from this isolated prompt. Both “Sea-blue mug” and a retained “Blue mug” are possible query results with the facts given.

The answer reveals that the join reads the current product name and the line supplies quantity and agreed price. With that additional fact, Sea-blue mug / 2 / €18 / €36 follows. The answer also reveals that the schema lacks a recoverable original name. Its historical-receipt conclusion follows from that added schema fact, but the prompt alone does not establish it.

Actionable gap if the exercise must stand alone: show the small receipt query, or state that it reads the name from the current product row and that no purchased-name history is stored. As a contextual article exercise, “above” visibly marks the dependency; I have not judged whether the surrounding article supplies it clearly.

### Queries and joins: `#join-variation`

Questions before the disclosure:

- How many shipments are in “a fresh copy of the query example” before S3 is added? Naming the new shipment S3 suggests two predecessors, but does not establish their existence or order IDs.
- Do the existing €20 and €24 descriptions mean complete line amounts? The wording calls them lines and gives the new quantity explicitly, so I tentatively treat them as amounts, but a displayed quantity for all three would remove the inference.
- Does “their line amounts” mean summing every pair's line amount? That is the natural reading, and the question's duplication concern makes it likely.

I can derive three lines with amounts €20, €24 and €20, a goods total of €64, and a DISTINCT sum of €44. If the final shipment count is `s`, joining by this order ID gives `3 × s` pairs and a joined sum of `€64 × s`. The isolated prompt does not establish `s = 3`.

The disclosure supplies three shipments. With that supplied count, nine pairs and €192 follow directly, as do separate summaries of €64 and three shipments. The DISTINCT explanation is strong: two different purchase lines legitimately have the same €20 amount, so discarding an equal value loses goods. The last sentence clarifies that shipment records do not identify individual lines; that fact explains why the order-ID join cannot reveal which item travelled in which shipment.

Actionable gap if the exercise must stand alone: explicitly name the two existing shipments S1 and S2 for O13 before adding S3. A three-row line-amount list would also make the starting facts unambiguous. I did not infer two existing shipments merely from the name S3.

### Conflicts and retries: `#recovery-variation`

Questions before the disclosure:

- What does K14 identify, and what protects that identity from being claimed twice?
- What is the “claim protocol” that recovery is supposed to resume? The question does not state it.
- What does a “known deadlock rejection” guarantee about the attempted transaction, and what exactly is safe to repeat?

The prompt does establish that an empty lookup is inconclusive because the first transaction may still be active. I would keep the outcome pending and continue recovery with the same identity K14. Declaring final failure would go beyond the evidence. Using K15 sounds like a different operation and therefore risks duplicating the two-mug purchase, but that interpretation depends on treating the keys as operation identities.

The disclosure explains the missing mechanism: uniqueness coordinates a repeat claim with the first attempt; a commit permits recovering its complete purchase, while rollback permits the new claim to proceed. That reasoning is coherent with a unique operation key, but the unique-key/claim guarantees are additional facts rather than facts supplied in the isolated question. The disclosure also supplies the crucial deadlock fact: the rejected attempt cannot commit. Rollback and a bounded whole-transaction retry then follow, with fresh decisions and the same intent/key. I would need the article's protocol to implement those steps; this is a reasoning exercise, not a runnable recipe.

Actionable gap if the exercise must stand alone: identify K14 as a unique operation key and briefly state what reentering the claim does when a competing attempt is active. Also say that a known deadlock rejection guarantees this attempt cannot commit, if the goal is to reason from given evidence rather than recall the earlier lesson. As a contextual recall exercise, the unanswered protocol questions may be intentional; an isolated read cannot verify that earlier teaching.

## Addendum: the variations in their article context

At the coordinator's request, I subsequently read the preceding teaching in the three built articles. The exercises assess transfer from that teaching. All of the facts I found missing in isolation are supplied before their questions; the isolated findings above are dependencies, not consequential article gaps.

- **Receipt:** “Trying the design” shows the exact SELECT and explains `p.name`, `l.quantity`, `l.unit_price` and the multiplication. It explicitly says the result uses today's name and identifies the original printed name as a missing historical fact. I can therefore predict Sea-blue mug / 2 / €18 / €36 and explain why the original name cannot be recovered. No needed fact arrives only in the disclosure.
- **Join:** “When a join inflates a total” explicitly supplies S1 and S2 for O13. Its diagram labels the existing line amounts €20 and €24, shows all four pairs, and explains that shipment rows describe the order rather than particular lines. It then teaches the separate summaries and the failure of DISTINCT with two separate €20 lines. Adding one line and S3 gives nine pairs, €192 when summing the joined rows, €64 and three shipments separately, and €44 with DISTINCT. The question specifies the change adequately, and the answer follows it.
- **Recovery:** The article first identifies K14 as Ada's persistent purchase intent, distinguishes it from order IDs, and supplies the unique operation-key column and both claim branches. “Recover before creating another operation” explains authoritative lookup, why absence can be inconclusive, the uniqueness wait, and both commit/rollback outcomes. Earlier sections say a deadlock rejection aborts an attempt that cannot commit, requires cleanup, and calls for a bounded retry of the complete transaction with fresh decisions. Those passages supply every distinction requested by the variation. Its answer correctly applies them.

I found no consequential gap in these three contextual exercises. Repeating all the preceding facts inside each question is unnecessary for their stated teaching role. This addendum remains an agent comprehension review, not the commissioned human-reader session or an execution check.
