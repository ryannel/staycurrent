---
name: staycurrent-review
description: Arrange independent reviews of a breakdown, article tree, written article or corpus, or carry out one assigned review perspective.
---

Independent reviewers catch what an author cannot see in their own work. Each perspective looks for a different kind of failure, so each gets its own subagent, its own inputs and its own verdict. The perspectives, their checks and the report format are fixed so that every run reviews the same ground and runs can be compared. Judge everything against the commission: take an intelligent newcomer to expert practitioner in the commissioned subject, in the least reader time and effort. A nested article contributes to that goal; it does not have to make the reader a specialist in its own topic.

## Which perspectives run

| Mode | Perspectives |
| --- | --- |
| Breakdown, or a batch of breakdowns | practitioner, value, teaching |
| Tree | practitioner, value, teaching |
| Article, or a batch of articles | practitioner, teaching, editorial, visual |
| Corpus | practitioner, value, teaching, editorial |

Each perspective has one file that states its purpose, its inputs and its checks:

- [Practitioner](perspectives/practitioner.md): correctness, evidence, coverage and depth.
- [Value](perspectives/value.md): whether each article and section earns the reader's time.
- [Teaching](perspectives/teaching.md): how a newcomer builds understanding, and where showing beats telling.
- [Editorial](perspectives/editorial.md): the words on the page, read as a reader meets them.
- [Visual](perspectives/visual.md): everything the reader looks at rather than reads: figures, tables, code, diagrams and interactive tools.

Plans are not reviewed for wording or visuals, because the writer replaces the plan's wording and builds the visuals later. A plan's teaching review still checks that each brief says how its hard parts will be shown.

## Assigning a perspective

Give each reviewer exactly one perspective, its mode, the pieces, a fixed version of them, and the inputs its file lists:

> Apply the [perspective] perspective of [staycurrent-review](SKILL.md) in [mode] mode to [pieces] at [version].

Every assignment goes to a fresh reviewer that has not seen the piece, its earlier versions or any earlier report, including in a later round. A reviewer who has followed the rounds reads the page through its history: it sees repairs as fixes and stops noticing what has been there all along. In the 2026-10-20 skill trial, reviewers kept across three rounds passed a03; a fresh editorial reviewer then found five required problems, three of which had been on the page throughout. Runs stay comparable because the perspectives, checks and report format are fixed, not because the reviewer is. A reviewer assigned one perspective performs it directly and never arranges another team.

## The report

Reviewers report; they do not edit the work. Every report uses this shape, so findings can be compared across runs:

```markdown
# [Perspective] review · [mode] · [pieces] · [version]

Inputs read: [each input, and anything withheld]
Verdict: pass | repairs required

## Checks

| Check | Result | Note |
| --- | --- | --- |
| [each check from the perspective file, in order] | pass, finding or not applicable | [one line] |

## First reading

[Visual perspective only: what each figure, table and code example seemed to show before reading its prose, and where you were unsure]

## Findings

### [perspective]-[n] · required | optional · [piece and location]

Problem: [what is wrong, as the reader meets it]
Effect: [what the reader loses or must do instead]
Suggestion: [one way to fix it; the writer chooses the repair]

## Limits

[What this review could not check, and why]
```

Number findings per perspective and keep counting across rounds of the same review: if the editorial findings in the first round end at editorial-13, the coordinator tells the next round's reviewer to start at editorial-14. Each label then means one problem throughout the work record.

Editorial and teaching reviewers may read the step text of scripted figures from the built page rather than by playing them.

A finding is required when the piece falls short of the goal without the repair, and optional when the repair would only reduce reader effort. The verdict is "repairs required" when any required finding remains.

## Deciding and rechecking

The coordinator (the orchestrator, or whoever arranged the review) decides which findings to accept and records the reason, especially where perspectives disagree, for example practitioner coverage against value. A decision names the problem to solve, not the words to insert: a fresh writer repairs it with [staycurrent-revise](../staycurrent-revise/SKILL.md) so that the article still reads as one piece. Accepted findings for one piece go to its writer together. Findings on shared layout or site-wide text, which belongs to no writer, go to the coordinator to repair.

After repair, the affected perspectives review the whole piece again, with fresh reviewers and every check, exactly as in the first round. Editorial always runs again, because any repair changes the words. The coordinator, not the reviewer, compares the new report with the accepted findings to confirm each was fixed. When a repair added passages or figures, the coordinator names them to the teaching reviewer, without the findings behind them, for its placement check.
