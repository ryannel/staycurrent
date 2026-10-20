# Teaching review · article · a00 Relational databases · c02

Inputs read: the repaired piece as rendered (`c02-site/review/relational-next/index.html`, read as extracted page text), with its frozen source `c02/article.astro` and components `c02/components/` (ShopTables, RowsFigure, OrderFigure, RaceFigure, DecisionFigure, models.mjs, scenes.mjs, queries.mjs) for figure states and controls; for comparison, the c01 source and rendered page and my c01 report; the inputs read at c01, which were not re-read: the three reference articles, the a00 brief and a01–a08 child plans in `context.yaml`, and the commission. Withheld and not read: other perspectives' reports, repair records and writer notes, `c02/manifest.json` and `c02/RelationalNext.astro`.
Verdict: pass

This is a recheck after repair. All five c01 findings are fixed. The new findings are all optional: teaching-6 to teaching-8 cover side effects of the repairs made for other perspectives.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Starting point | finding | c01 teaching-2 and teaching-5 are fixed: `SET` and `RETURNING` are explained, and indexes are glossed with a forward link. "Lock" is still never introduced, and the added sentences in sections 5, 6 and 7 now depend on it more (teaching-6). |
| Order | pass | The hardest part now gets the most help: a full listing, a schedule figure and a mechanism paragraph. The checkout listing shows the conditional `UPDATE` before the race explains why it is needed, but the race paragraph then sends the reader back to compare against it, so the order holds. |
| Examples | finding | The shop now reaches every awkward case concretely: the race, a declined or lost payment, a retry under R103 and both schema-change rejections. Figure 5 mostly uses the shop's own customers and order numbers, but two small slips break that continuity (teaching-8). |
| Showing | pass | c01 teaching-1, teaching-2 and teaching-4 are fixed. The race schedule shows both buyers' steps and committed stock side by side. The shop-tables figure and the first query's result table let the reader check each result against visible rows. Figure 4 ends with the retry. |
| Judgement | pass | c01 teaching-3 is fixed: the payment thread now ends in a named action for a decline and for a lost reply. Selection, diagnosis, live-change and recovery decisions are unchanged and remain usable. |
| Gradual exposure | finding | Each section still answers before linking its child. Two new links send the reader to shorter follow-ups ahead of the main article that the reading contract says to read first (teaching-7). |

## Confirmation of c01 findings

| c01 finding | Status | Evidence at c02 |
| --- | --- | --- |
| teaching-1 · required · two-buyer race shown only in prose | fixed | Figure 3, "Two buyers, one mug", is a four-step schedule with lanes for Mina and Arun and a column for committed stock. It has two variants: read then write, and the conditional `UPDATE`, where Arun waits, rechecks and is refused. Its caption labels the figure illustrative and says both schedules were run on PostgreSQL 18.6. The Read Committed paragraph narrates the same steps. |
| teaching-2 · optional · data-changing SQL never shown | fixed | The order 103 transaction is listed in full, with `BEGIN`, both `INSERT`s, the `UPDATE … RETURNING`, and comments saying when to commit or roll back. A paragraph explains `SET`, the guarding `WHERE` and `RETURNING`. The SQL section now points ahead to the read-then-write race as its example of a successful statement making the wrong change. |
| teaching-3 · optional · payment thread left open | fixed | Section 1 names `pending_payment`. The end of the transactions section commits order 103 with the mug reserved and a stored payment request. It defines a background worker and names both next actions: cancel and return stock on a decline, and ask the provider using the payment-request identifier on a lost reply. |
| teaching-4 · optional · Figure 3 (now 4) stopped before the retry | fixed | The final stage is "Retry with R103". On the after-commit path the unique constraint refuses a second R103 and the application returns order 103; on the before-commit path the order is stored once. The paragraph after the figure makes the overlap case concrete: the retry's insert waits for the open attempt, and the constraint lets only one commit. |
| teaching-5 · optional · index and pages used before definition | fixed | Section 2 now says "the extra lookup structures called indexes that help it find them", links forward to "The work behind a query", and no longer mentions pages. |

## Effect of the other changes

- **Shop tables figure.** This is a clear teaching gain. Every later query and figure starts from rows the reader can see, with PK and FK tags and arrows between matching values. The first query now has a visible result, so the reader can check `WHERE customer_id = 1` against the `orders` rows. Arun's draft order is introduced before Figure 1 relies on it.
- **Figure 2.** The mismatch flag and the highlighting of changed values make the half-finished state easier to spot. The caption now hands the second buyer on to Figure 3.
- **Figure 5.** It now searches for customer 1's orders, the same question as the first query, so the access-path lesson stays on the running example. It still has two small continuity slips (teaching-8).
- **Figure 6.** It now shows both rejections. In the early path, a first attempt fails and a hypothetical second attempt follows, so that one option holds two scenarios. The narration handles this, but the reader has to follow a "suppose instead" mid-figure. This is acceptable, and not a finding.
- **Added technical sentences.** These are the InnoDB default isolation level, `idle_in_transaction_session_timeout`, the lock-wait limit for schema changes, and the upkeep paragraph on `VACUUM` and statistics. Each is one or two sentences, gives a practical consequence and ends at a child link, so none turns into a lesson on its own mechanism. Three of them rest on locks, which the article never explains (teaching-6). "Repeatable Read" and "old versions" arrive as bare names. That is tolerable, because the sentences only warn that behaviour differs or that cleanup is needed.
- **Proportion.** The rendered estimate rose from about 16 to about 19 minutes. Most of the growth is the tables figure, the transaction listing and the race figure, which serve the article's hardest idea and its running example. Elsewhere the additions are single sentences. The introduction stays in proportion.

## Findings

### teaching-6 · optional · a00, "Transactions and competing buyers", Read Committed paragraph, and later uses in "From a request to a committed order", "The work behind a query" and "Changing a live database"

Problem: The article explains the wait in Figure 3 only as "waits until her transaction ends" and never calls it a lock. Locks are first named in passing ("using constraints, locks or a stricter isolation level"). Later sentences then rely on the idea: "An open transaction keeps its locks until it ends, so one checkout stalled inside a transaction can block every later buyer", Figure 4's "until then it keeps its locks", "waiting for a lock" in the diagnosis paragraph, and "a strong lock on the table" with a lock-wait limit in the schema-change paragraph.
Effect: The reader has to work out that Figure 3's wait and these locks are the same thing. Without that link, the warnings about stalled transactions and schema-change queues read as unexplained rules.
Repair: Name the mechanism once, where the reader has just watched it. For example: "Arun's `UPDATE` waits because Mina's change holds a **lock** on the mug row, which other writers must wait for until her transaction commits or rolls back." The later sentences then read as consequences of Figure 3.

### teaching-7 · optional · a00, "From a request to a committed order", connection-pool paragraph, and "Running and recovering the database", upkeep paragraph

Problem: Two new links send the reader to shorter follow-up articles before the main article for that section: "Managing connections and transaction lifetimes" ahead of "Building applications around a relational database", and "Maintaining and upgrading a relational service" ahead of "Running a relational service". The article's own contract says "Read a longer article's worked example before its shorter follow-ups". The schema-change follow-up, by contrast, is introduced correctly as "Its follow-up" after its main article.
Effect: A newcomer who follows the earlier link meets a follow-up without the worked case it builds on. This contradicts the reading order the introduction has just set out.
Repair: Introduce both links as follow-ups of their main article, as the schema-change link does. Alternatively, move them into or after the section's closing sentence that links the main article.

### teaching-8 · optional · a00, Figure 5 and Figure 4's caption

Problem: Figure 5's invented orders give order 104 to Arun. In Figure 3 order 104 was Arun's refused order under the conditional `UPDATE`, which the article recommends. Figure 4's caption says "The orders table stores each order's purchase-attempt identifier under a unique constraint", but the shop tables figure has no such column.
Effect: These are small stalls for an attentive reader who checks back against earlier state, which the figures otherwise encourage. A refused order seems to exist, and a column is said to exist that the tables never showed.
Repair: Use order numbers in Figure 5 that cannot clash with the race, for example starting after 104, or say in the caption that these are later orders. In section 5, say that the shop adds a `purchase_attempt` column with a unique constraint, or word the caption as "would store".

## Limits

I read the rendered HTML as extracted text and the component source. I did not operate the controls in a browser, so playback, the hold indicator, the highlighting of changed values and the race figure's variant switch were judged from scripts and model text rather than observed. I did not re-read the reference articles, child plans or commission at c02. My c01 reading of them still applies, because the repair changed only the piece. As at c01, technical correctness, wording and visual design are left to the practitioner, editorial and visual perspectives. The technical additions were judged only for their teaching effect.
