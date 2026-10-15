# Choices: final continuous editorial reread

Read the complete assembled access-control, adding-another-system and product-comparison articles in Chrome at `http://127.0.0.1:4330` on 15 October 2026. This follows the independent technical review, but asks a different question: whether the finished articles carry a reader through a coherent explanation. I did not read the fresh-reader log. No source changes or build were made in this pass.

## Controlling access

The article has a clear destination before it introduces the machinery: the shipping worker must pack its tenant's orders without seeing email or deleting an order. That promise holds the middle together. Schema USAGE, column SELECT, UPDATE and the tenant policy are introduced when the worker needs them, rather than as a list of PostgreSQL features. The sentence explaining that the update must read order_id is particularly useful: it resolves an ordinary surprise from the statement the reader has just seen.

The strongest stretch is the sequence of allowed update, invisible target and forbidden delete. It gives three different outcomes their own meanings. The handler's empty result matters as much as the permission error, and the later rollback explanation follows a real failure the reader has already encountered. The new policy-composition section extends that same teaching method. Its three rows make an unexpectedly broader permission visible before the article names the repaired combination. The explicit new fixture prevents the earlier packed order from silently becoming ready again.

The densest paragraph remains the one about owners, superusers, BYPASSRLS, FORCE ROW LEVEL SECURITY and constraint disclosures. It briefly changes pace from the worker's action to several limits. Those limits matter to the exact boundary being taught, and the following paragraph returns immediately to the practical danger of testing as owner. I would retain it rather than grow another subsection. The final default-privilege and audit material also broadens the lens, but the shipping-role example keeps the grant advice concrete and the conclusion returns to its original promise.

The voice is direct and explanatory. The new section does not sound like an appended checklist. No editorial repair is required.

## When should you add another data system?

The opening establishes an engineering choice with a cost: search and reports need new work, while another store needs facts delivered and recovered. The article then earns that cost through one product's changing state. It is strongest when it distinguishes a stale positive from a missing new product, and later when physically deleting the destination record would remove the version needed to reject an old replay. Those are consequences a reader can derive from the example, rather than general warnings about distributed systems.

The new interruption section supplies the missing operational ending. A product update produces an event from its returned values; the destination accepts it; the worker stops before acknowledgement; the same immutable payload is sent again. The successful no-op versus missing response paragraph is especially good. It tells the caller what to do under two easily confused observations without collapsing them into “retry safely.” The short worker-scope paragraph is justified here because the displayed pending-event query might otherwise be mistaken for a complete queue implementation.

There is one small interruption in the flow. The final paragraph of “Deliver changes without forgetting them” introduces log-based change capture immediately before the article returns to its outbox walkthrough. The paragraph itself is useful, but placing it after the completed interruption example would keep the outbox argument continuous and make change capture a natural bridge to rebuilding the copy. This is an optional paragraph move, not missing depth or a publication blocker. Root has been told the exact move; this review makes no source edit.

The two successive delivery sections repeat the version rule, but they do different work: the first establishes why complete-state versions are safe to supersede, and the second follows the durable obligation through failure. The repetition is earned. The conclusion returns to relevance, resource contention and operating cost without trying to teach every search product or queue protocol. No further expansion is warranted.

## Choosing a relational database

The article now reads as a method for making a choice, with actual differences to investigate. The offline notebook, shared order service and existing reporting estate give deployment a human scale. SQLite's single writer is connected to the duration of real edits rather than presented as a slogan. That makes the later comparison more useful than a product ranking.

The repaired isolation passage is the centre of the article. One order, a first count, a completed insert and a second count give the reader a stable situation before the engine-specific names arrive. The table is dense, but its repeated 1s and 2s are easy to interpret because the schedule precedes it. Ending the transaction and seeing 2 prevents an older view being mistaken for lost data. SQLite's failed transition to writing then turns the observation into an application consequence. This is the kind of depth requested: the reader can explain why apparently interchangeable transaction support changes a program.

The move from isolation to data conversion is explicit and works. The price 18.005 becoming 18.01 shows why successful storage is not always the desired input contract. Later physical layouts are necessarily less developed than the isolation example, but each is attached to a concrete consequence such as a second lookup or wider secondary entries. Links lead to the deeper implementation rather than trying to fit four engine manuals into one comparison.

The broadest and least vivid passage is the operations section's succession of editions, recovery, failover, schema evolution and cost. It is still bounded: each paragraph names an operation to rehearse or an actual constraint to verify. It does not undo the worked middle by ending in unsupported rankings. The final return to the three application shapes makes the decision feel complete. I would retain it without another example or checklist.

## Recovery boundary figure: isolated reading, then context

I first inspected a browser crop containing only the figure and its caption, then a larger crop containing the physical-experiment heading, source-history table, restore-point explanation, figure and beginning of the downloadable-experiment paragraph. I had already reviewed the source technically, so this is an independent visual/editorial reading, not an uncued first encounter with the subject.

The isolated figure communicates four distinguishable states in ordinary reading order: the first purchase belongs to the base, the second arrives through later WAL, the named boundary leaves 101 and 102 recovered, and the remaining history includes both the deletion and the good €12 purchase. The green rule gives the stopping state emphasis. The excluded history is visibly quieter but its words remain readable. Most importantly, “Delete 101; then add 103” puts the good and bad later actions in one excluded area, and the caption says why. The picture does not imply recovery selectively removes a bad transaction.

In context, the table establishes the source sequence before the diagram compresses it. The restore-point paragraph explains that the marker is not another backup, so the figure's “Stop” label has a clear meaning. The figure then gives the reader a useful visual pause before tool requirements and recovery settings. Its slight repetition of the table is productive: one shows source state after each action, the other shows what the recovered target includes.

The desktop two-column layout wraps labels cleanly and leaves the recovered IDs prominent. This pass did not test a phone-width layout, keyboard behaviour or every contrast ratio; those remain part of root's separate full-page responsive capture pass. There is no representation change required from this desktop review.

**Editorial disposition:** the assembled choices revisions meet the intended explanatory and writing standard. One optional paragraph move would improve the outbox section's continuity; no remaining doubt requires new subject matter. The recovery figure teaches its intended boundary clearly at the inspected size.

## Final recheck

Root moved the change-capture paragraph to the end of the completed outbox example. I reread that assembled transition in the rebuilt browser preview. It now follows the example's conclusion and introduces the initial-copy/replay responsibilities developed in “Rebuild and operate the copy.” The suggested flow improvement is resolved.

I also inspected root's 390-pixel light and dark recovery figure captures at `/private/tmp/relational-depth-revised-figures/backup-and-restore-0-390-{light,dark}.png`. Both use a clean single-column reading order: base, later WAL, stopping boundary, excluded history. The green rule retains the stopping emphasis; the excluded history's text and caption remain readable. There is no cropped label, horizontal overflow or ambiguous rearrangement in either figure. The “good €12 purchase” remains grouped with the excluded deletion. This closes the phone-width visual question for the figure; this is not a claim to have tested every page or keyboard interaction.

Root's source change that separates the restore-point function name from its argument removes the long inline expression. I suggested “creates the marker by calling … with the name …” to smooth a repeated “with”; this small phrasing adjustment does not change the explanation or figure.
