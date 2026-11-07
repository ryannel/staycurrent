---
name: staycurrent-orchestrate
description: Run a commissioned Stay Current collection from plan to delivery. Use when a commission covers more than one article; a single article uses plan, write and review directly.
---

# Run a collection

The commission names the subject, the stages wanted and any stopping point. The aim
does not change: take an intelligent newcomer to expert practitioner at the least cost
in reading time and effort.

## Order of work

1. **Plan** with [staycurrent-plan](../staycurrent-plan/SKILL.md): the expert dossier,
   the article tree, the running example and each article's exit questions. Review the
   whole plan once with [staycurrent-review](../staycurrent-review/SKILL.md) before
   writing.
2. **Write** each article with [staycurrent-write](../staycurrent-write/SKILL.md). Give
   the writer the article's brief and exit questions, the neighbouring scopes, the
   relevant finished articles and the example record.
3. **Review** each finished article with the four lenses in staycurrent-review, then
   repair accepted findings and confirm them.
4. **Review the assembled collection** once, for coverage, ownership, duplication and
   reading order. Reuse the article reviews rather than repeating them.
5. **Deliver** (below).

Independent assignments run in parallel. Every assignment, including a repair or a
confirmation, goes to a fresh agent. Agents carry out their own assignment and do not
commission others, except where a review lens says to.

## What the orchestrator owns

The dossier, tree and example record in `docs/coverage/`; acceptance of findings; scope
changes between articles; one build and preview for the commission; the work record; and
delivery. Writers propose changes to the tree or the shared example; the orchestrator
decides and updates the record.

First reader-lens reviews start without inherited author conversation and receive only
the article's prose, audience and [first-reading instructions](../staycurrent-review/lenses/first-reading.md).
Save the unaided reading before sending the voice guide for the rest of that
lens. Do not send plans, exit questions, author notes or earlier verdicts. The practitioner
and teach-back lenses get the inputs their lens files list.

Give the separate visual reader only the figures-only preview, audience and
[first visual reading](../staycurrent-review/lenses/first-visual-reading.md) initially.
Save its account before sending the article, learning goals and informed visual checks.
The write skill's figure guide specifies the isolated preview; check that browser
snapshots cannot reveal the surrounding prose or long explanatory alternatives.

## Done

The collection is done when:

- every article passes its teach-back check;
- each visual sequence passes independent comprehension and coverage review;
- every accepted critical or medium finding is repaired and confirmed;
- `pnpm build` passes, and every new or changed figure has passed the checks in the
  write skill's figure guide;
- the collection review has run once and its accepted findings are resolved;
- the work record is current.

Carry the work through to that point. Stop early only where the commission says so, or
for a decision that belongs to the owner, such as a change of scope or publication.

## Work record

Keep one README per commission in `docs/article-work/<commission>/`. It holds the
commission, links to the dossier and tree, one findings table (finding, decision, where
fixed, confirmed by) and any limits on the evidence. Keep the evidence that supports a
claim in an article. Do not write pass-by-pass reports. Earlier records under
`docs/article-work/` and `docs/history/` are history, not instructions.

## Publication

Drafts stay off `main` until the owner authorises publication. The publication steps are
under Delivery in `AGENTS.md`.
