# Teaching review · article · a00 Relational databases · c03

Inputs read: the c03 rendered page (`c03-site/review/relational-next/index.html`), checked for the repaired passages; the frozen source `c03/article.astro` and `c03/components/`, each diffed against c02; my c02 report. As in this round's request, the reference articles, child plans and commission were not re-read; my c01 reading of them still applies. Withheld and not read: other perspectives' reports, repair records, writer notes and `c03/manifest.json`.
Verdict: pass

This is a narrow recheck. It covers only the checks this round touched: the three c02 findings, the order 103 listing now ending at `RETURNING`, the rewritten upkeep paragraph, and wording repairs that affect teaching.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Starting point | pass | teaching-6 is fixed: "lock" is defined where the reader has just watched the wait. "Sessions" is now glossed at first use. The upkeep paragraph now explains the old row versions it previously only named. |
| Order | not applicable | No section or idea moved this round. |
| Examples | pass | teaching-8 is fixed: the order numbers stay consistent with Figure 3, and the purchase-attempt column is introduced before Figure 4 relies on it. |
| Showing | pass | The order 103 listing now stops at `RETURNING`, and the commit-or-roll-back decision follows in prose straight after it. Figure 3's rows now name the lock. Figures 2 and 4–7 changed only in caption wording and styling, and none loses a teaching state. |
| Judgement | not applicable | The decision passages were not changed. |
| Gradual exposure | pass | teaching-7 is fixed: all three follow-up links now come after their main article's link, introduced as "Its follow-up". |

## Confirmation of c02 findings

| c02 finding | Status | Evidence at c03 |
| --- | --- | --- |
| teaching-6 · optional · "lock" never introduced | fixed | Right after Figure 3, a new paragraph says Mina's `UPDATE` "takes a **lock** on that row: a claim that stops other transactions changing it until hers commits or rolls back. Arun's `UPDATE` waits for that lock." Figure 3's rows now say "the row is now locked" and "reaches the locked MUG row". The Read Committed recheck is now a separate paragraph, so the lock wait and the isolation-level behaviour are no longer run together. The later uses of "lock" in sections 4–7 now point back to this definition. The schema-change sentence is plainer: "a lock that blocks all other use of the table". |
| teaching-7 · optional · follow-up links ahead of their main articles | fixed | "Managing connections and transaction lifetimes" now follows the link to "Building applications around a relational database", and "Maintaining and upgrading a relational service" now follows the link to "Running a relational service". Both are introduced as "Its follow-up". The schema-change link already followed this pattern. |
| teaching-8 · optional · order 104 reused and an unseen purchase-attempt column | fixed | Figure 5 keeps orders 101–103 from the earlier figures and has no order 104. Its caption and opening narration say this is because Figure 3 refused Arun's attempt. Figure 6's new orders are renumbered to 114 and 115, so they cannot clash. Section 5 now says that "The shop adds a `purchase_attempt` column to `orders` with a unique constraint", and Figure 4's caption matches. |

## Effect of the other changes

- **Order 103 listing ends at `RETURNING`.** This is a gain. The ending depends on whether a row comes back, so a fixed `COMMIT` in the listing would show only one branch. The paragraph after the listing now gives both branches, adding that `ROLLBACK` makes the order and item disappear too. The listing's new label, "order, item and reservation", matches the payment paragraph, which now says that the same transaction also inserts the payment request. The reader is never told the transaction holds only three statements.
- **Upkeep paragraph.** This is a gain for the starting point. The paragraph now says why old versions remain: transactions already running may still read them. It also explains what `VACUUM` and `ANALYZE` each do and why an open transaction holds cleanup back. It is about two sentences longer and names autovacuum. That is still in proportion for one paragraph that ends at a follow-up link.
- **Wording repairs.** The Figure 6 options and stage labels now name application versions rather than "writers", matching the prose, and the change does not alter the figure's states. The legends for Figures 2 and 4 now say what the accent and red outlines mean. The sources note now lists which figures were run on PostgreSQL 18.6, still separating the models from that execution.
- **Proportion.** The rendered estimate is about 20 minutes, up from about 19. The minute comes from the lock paragraph and the upkeep explanation, both of which reduce reader effort elsewhere.

## Findings

None.

## Limits

I read the rendered HTML and the frozen source, and diffed each changed file against c02. I did not operate the controls in a browser, so Figure 3's variant switch and the stepped figures were judged from their scripts and model text. I examined only what this round changed, so passages unchanged since c02 keep their c02 assessment. Technical correctness, wording and visual design are left to the other perspectives.
