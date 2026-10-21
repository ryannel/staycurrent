---
name: staycurrent-review
description: Arrange independent reviews of a breakdown, article tree, written article or corpus, or carry out one assigned review perspective.
---

Independent reviewers catch what an author cannot see in their own work. Each perspective looks for a different kind of failure, so each gets its own subagent, its own inputs and its own report. The perspectives, their checks and the report format are fixed so that every run reviews the same ground and runs can be compared. Judge everything against the commission: take an intelligent newcomer to expert practitioner in the commissioned subject, in the least reader time and effort. A nested article contributes to that goal; it does not have to make the reader a specialist in its own topic.

## Which perspectives run

| Mode | Perspectives |
| --- | --- |
| Breakdown, or a batch of breakdowns | practitioner, value, teaching |
| Tree | practitioner, value, teaching |
| Article, or a batch of articles | practitioner, teaching, editorial, visual (which run in each round is below) |
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

Freeze the complete inputs and rendered preview before dispatch, with one preview/build owner, as [staycurrent-orchestrate](../staycurrent-orchestrate/SKILL.md) describes. Start ready commissioned perspectives as slots free up, scheduling long visual work early. Every assignment goes to a fresh reviewer that has not seen the piece, its earlier versions or any earlier report, including in a later round. A reviewer who has followed the rounds reads the page through its history: it sees repairs as fixes and stops noticing what has been there all along. In the 2026-10-20 skill trial, reviewers kept across three rounds passed a03; a fresh editorial reviewer then found five required problems, three of which had been on the page throughout. Runs stay comparable because the perspectives, checks and report format are fixed, not because the reviewer is. A reviewer assigned one perspective performs it directly and never arranges another team.

## The report

Reviewers report; they do not edit the work. Every report uses this shape, so findings can be compared across runs:

```markdown
# [Perspective] review · [mode] · [pieces] · [version]

Inputs read: [perspective-specific fixed input manifest or concise links; note omissions and anything withheld]
Highest severity: critical | medium | low | none

## Checks

| Check | Result | Note |
| --- | --- | --- |
| [each check from the perspective file, in order] | pass, finding or not applicable | [one line] |

## First reading

[Visual perspective only: what each figure, table and code example seemed to show before reading its prose, and where you were unsure]

## Findings

### [perspective]-[n] · critical | medium | low · [piece and location]

Problem: [what is wrong, as the reader meets it]
Effect: [what the reader loses or must do instead]
Suggestion: [one way to fix it; the writer chooses the repair]
Evidence: [specific observation, source or applicable mechanical receipt]

## Limits

[What this review could not check, and why]
```

Keep one line per check, with detail in findings rather than repeated inventories. Link applicable evidence instead of copying logs; state material limits. The coordinator maps duplicate observations to one canonical issue and records one repair decision without discarding observations. Number findings per perspective and keep counting across rounds of the same review: if the editorial findings in the first round end at editorial-13, the coordinator tells the next round's reviewer to start at editorial-14. Each observation label remains traceable to its canonical issue throughout the work record.

Editorial and teaching reviewers may read the step text of scripted figures from the built page rather than by playing them. Practitioner and visual reviewers may use identified evidence for unchanged mechanics where their prescribed inputs permit it. Check its source, data, environment and verifier still apply to the current version; otherwise rerun the affected verification or report the limit. Evidence reuse does not replace any perspective's checks or the visual reviewer's fresh rendered reading and use of controls.

## Severity

Rank each finding by what happens to the reader:

- **Critical:** the reader would come away believing or doing something wrong, cannot follow the argument past this point, or a figure contradicts its own text. A false sentence, a figure note that is wrong in some of its states, and a claim the evidence does not support are critical.
- **Medium:** the reader stalls, rereads or has to supply something themselves. A term used before it is explained, a passage that reads as a patch, a figure that is hard to follow, and a section that spends the reader's time without return are medium.
- **Low:** a change that would make reading a little easier, such as wording, a heading or a small layout point.

Length is not a finding by itself. A long article is right when every part earns its place; a part that does not is medium.

## Deciding and rechecking

The coordinator (the orchestrator, or whoever arranged the review) sets each finding's severity, starting from the reviewer's and recording the reason for any change, and decides which findings to accept, especially where perspectives disagree, for example practitioner coverage against value. A decision names the problem to solve, not the words to insert: a fresh writer repairs it with [staycurrent-revise](../staycurrent-revise/SKILL.md) so that the article still reads as one piece. Accepted findings for one piece go to its writer together. Findings on shared layout or site-wide text, which belongs to no writer, go to the coordinator to repair.

Each round repairs findings at or above that round's floor:

| Round | Repaired |
| --- | --- |
| 1 | critical, medium and low |
| 2 | critical and medium |
| 3 and later | critical |

A fresh reviewer reading a long piece always finds something, and every repair adds new text to find it in. In the 2026-10-21 skill trial, findings that had to be fixed fell from 16 to 7 to 5 over three full rounds but never reached zero, and two of the last five sat in text the previous repair had written. The early rounds therefore do the polishing and the later rounds guard correctness. Record findings below the floor with the decision "below this round's floor", so a later revision can take them up.

The review ends after a round that finds nothing at or above its floor. Critical findings are always repaired. Round 3 is the last full round: check a critical repair after it with a fresh reviewer of the perspective that found it, reading the repaired passages and the sections around them in the whole piece, and repeat that check until it passes.

In article mode, practitioner and teaching review every round. Editorial and visual review round 1, and review again before the review ends: when a round finds nothing at or above its floor without them, run them on that same version. In other modes every perspective runs each round.

Every round is a full review of the whole piece by fresh reviewers with every check, as in the first. The coordinator, not the reviewer, compares the new report with the accepted findings to confirm each was fixed. When a repair added passages or figures, the coordinator names them to the teaching reviewer, without the findings behind them, for its placement check.
