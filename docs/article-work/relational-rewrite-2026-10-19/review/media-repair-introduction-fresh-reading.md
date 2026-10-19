# Introduction transaction aid: fresh reading

The aid makes a useful distinction visible: statements can have run without their changes becoming the final facts, and commit can preserve an incomplete application operation. Both of my predictions matched the observed outcomes. This judgement rests on the contrast between the starting, working and final tables, especially the incomplete commit; a working slider alone would not establish it.

## Scope and independence

I took the role of an application engineer new to databases. Before the isolated aid I read only the assigned first-reading and blind-review voice references. I did not read technical source, model code, briefs, author notes, other review reports or sibling review folders. I read the actual rendered DOM, screenshots and control choices supplied under `/private/tmp/staycurrent-media-review/intro/`.

The coordinator operated the native browser controls because browser access was unavailable in this child session. The coordinator reported resetting between cases and checking the requested control values. I independently selected the changes, saved predictions before outcomes, and interpreted the returned DOM and pixels. I could not independently verify browser operation. This is an agent first reading, not an observed human learner session.

The initial record is `intro/initial-reading.md`; predictions are `intro/cases.json`; the outcome record made before article context is `intro/outcome-reading.md`. The permanent report preserves their consequential findings below. After those records, I received `intro/article.txt` and `intro/article-context.jpg`. The DOM packet contained the whole article at once; I read the opening through the aid in order, but headings and bodies arrived together, so the context judgement is retrospective rather than a section-by-section blinded delivery. I did not use later implementation guidance or external technical sources to judge the aid.

## Isolated first reading

“One decision over two stored facts” led me to expect a final choice affecting both a place count and an order. The starting facts were tenant t4, session s7 with 2 places, and no order r81. I could change the number of completed statements from 0 to 2 and choose open, commit or rollback. I could reset the example. I could not change the starting count, condition, statement order, tenant or request.

The caption supplied the main rule before interaction: commit publishes the statements that ran; rollback publishes none; the application must include both writes in that decision. I could therefore predict more than the intended successful outcome. I could ask whether committing after the decrement would preserve a consumed place with no order.

The stable starting table saved me from remembering earlier values while inspecting rollback. The work and final tables let me distinguish work performed from facts retained. The desktop layout requires an upper-left, upper-right, lower-left reading path, but the values remain close enough to compare in the supplied screenshots. No colour distinction is needed to identify the count, presence of the order or completed statement.

On the isolated packet I supplied the ordinary meaning of decrement and assumed it succeeded here. Its predicate and amount were not explained. I also inferred a reservation workflow from “places” and “order”; the isolated aid did not establish why those facts should agree. I recorded those as questions for context rather than defects established in the article.

## Predictions and observed outcomes

| Case | Changes selected before seeing the result | Prediction | Observed result |
| --- | --- | --- | --- |
| rl76-1 | `rdt-booking-2-step = 1`; `rdt-booking-2-decision = commit` | Starting facts stay 2/absent. Work and final facts become 1/absent. Commit does not perform the omitted insertion. | Starting facts 2/absent; work and final facts 1/absent. Only Conditional decrement is checked. The result says the application committed before inserting the order. |
| rl76-2 | `rdt-booking-2-step = 2`; `rdt-booking-2-decision = rollback` | Starting and final facts stay 2/absent. Work before the decision retains 1/present as a record of what ran. | Starting and final facts 2/absent; work before the decision 1/present. Both statements are checked. The result says all attempted changes rolled back. |

The first result carries the strongest lesson. The reader can connect the missing insert checkmark to the absent order and the application's early commit. The database is not depicted as inventing an omitted application operation. This is a practical distinction an application engineer needs.

In the second result the retained order in the work table could briefly raise the question whether it still exists. “Work before the decision” and “After decision” answer that question in the display itself. I did not have to supply an implementation story to reconcile the two tables. Keeping the work visible gives the rollback comparison something to explain.

## Reading the aid in the article

The opening promises two capabilities: combine table facts and protect related changes. At its end I could explain that a booking refers to a session and customer, and that accepting it may require both consuming a place and creating an order. I had a reason to care about agreement between those writes before reaching the aid.

“Follow one booking through the tables” supplies the identities t4, customer 42 and s7. Its figure and query show how the booking uses those identities to recover Ada and Repair basics without copying that detail into the booking. The following section, “Make acceptance one database decision,” then turns the same session into a write problem. Its opening names both unwanted partial outcomes: an order without a consumed place and a consumed place without an order. This answers my isolated question about why the two stored facts must agree.

The SQL supplies the missing decrement detail before the aid: subtract one, only where the tenant and session match and remaining is positive. The prose tells the application to inspect the affected-row result and roll back if no row changed. It also identifies r81 as the stable purchase request identity. The aid's two statements now map to visible SQL rather than requiring the reader to infer their meaning from labels. My isolated assumptions about decrement are supported by the article at the point they matter.

The paragraph immediately before the aid explains the separate danger of computing a new count from an old read. It explicitly says a transaction alone does not fix every such history. The aid does not simulate competing buyers, zero affected rows or retry handling. It should be credited for the commit/rollback boundary it shows, not for demonstrating those adjacent claims. I could understand its two tested outcomes without following the linked articles.

The opening's phrase “commit both, or leave neither” initially sounds stronger than the incomplete-commit case. The later instruction to put both writes inside one transaction, the displayed SQL and the aid's caption supply the necessary condition. This is a resolved qualification, not an observed failure to follow the final explanation. A small useful improvement would be to attach that condition at the first promise: both writes must be included before the application commits. A repeat first reading should check whether a new reader can predict the one-statement commit without treating it as the model contradicting the introduction.

The model does not make the surrounding prose expendable. The prose supplies the business requirement and actual predicate; the aid makes the difference between attempted work and retained facts inspectable. Its extra value is the ability to stop after one write and see a concrete incomplete commit alongside an unchanged starting state. I would keep that case and the stable starting table.

## Judgement and limits

I found no blocking comprehension gap in the two tested cases in context. The article answers the two substantive questions left by the isolated aid, and the aid supports its narrow lesson with concrete contrasts the reader can trace. The useful small repair is to make the inclusion condition explicit at the opening promise, where “commit both” first appears.

I did not open the closed “What this model represents” material. I did not treat its contents as default explanation or assume they resolve anything. The dark article-context screenshot establishes that this initial state is legible in that supplied capture; it does not establish a full theme or responsive audit. I did not test other combinations, reset behaviour, keyboard interaction, screen readers, mobile layouts, crash recovery or concurrency. None of those unrun checks is an observed failure. This report is about what this aid taught through the supplied first reading and two recorded predictions.

## Editorial recheck after the opening change

I reread the revised opening and its route through the tested aid in `src/drafts/relational/rl76.md`. This was a source-based editorial recheck after the independent reading, not another first reading or interaction run.

“The application puts both writes in one transaction so they commit together or leave neither” resolves my qualification. It gives the application responsibility for including both writes at the first promise. The later SQL shows that intended sequence, while the aid's incomplete commit now illustrates departing from it. The following warning about constraints and concurrency control still leaves room for the conditional update and competing requests; the opening does not promise that grouping statements alone makes every booking correct. The change reads naturally between the concrete booking example and the paragraph connecting tables with transactions. No further change is needed for this finding.
