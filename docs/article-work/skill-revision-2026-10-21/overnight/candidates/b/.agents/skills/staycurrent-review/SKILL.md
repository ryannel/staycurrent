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

Repair every accepted substantive defect, regardless of the round in which it is found. Accepted critical and medium findings are substantive: they materially impair the reader's understanding, the coherence of the explanation, the promised practical judgement or the use of teaching media. This includes missing prerequisites, passages that read as accumulated patches and unreadable or unusable figures and controls; a problem need not be technically false to require repair. Low findings are optional improvements, including equivalent wording preferences and minor polish, and do not block completion. The coordinator may include them in a repair batch.

For each decision, identify the concrete reader effect at the reported location: what the commissioned reader would misunderstand, be unable to follow or use, have to supply without preparation, or spend effort on without a useful return. Judge that effect against the reader's stated starting knowledge and the piece's promise. Prefer one coherent explanation over a reviewer's preferred phrasing. Accept or reject the problem on that basis, with a reason where the effect is disputed; do not treat an editorial or visual problem as optional merely because its claims are true. Preserve the severity definitions above: do not relabel a medium finding as low to finish, and do not let elapsed time or the round number decide acceptance. Consolidate accepted observations of the same problem into one repair, retaining their evidence and labels.

The review ends when the scheduled perspectives have run, no accepted substantive defect remains unresolved, and the coordinator has confirmed the repairs. Round 3 is the last full round: check every substantive repair after it with a fresh reviewer of the perspective that found it, reading the repaired passages and the sections around them in the whole piece, and repeat that check until it passes. Newly found substantive defects in those checks also require repair and rechecking. These post-third checks verify repairs; they do not replace the earlier full rounds or introduce a separate final-reader stage.

In article mode, practitioner and teaching review every round. Editorial and visual review round 1, and review again before the review ends: when a round finds no accepted substantive defects without them, run them on that same version. In other modes every perspective runs each round.

Record completion against the final version: which scheduled perspectives ran, each accepted substantive problem's repair and confirmation, optional improvements left open, and verification limits. Explicitly judge whether the piece fulfils its promise and reads coherently with no known substantive defects. If a required repair or check remains unfinished, record the review as incomplete with the outstanding work; reaching round 3 or stopping work is not a pass. Review completion is a judgement within the checked scope, not publication authorisation.

Every round is a full review of the whole piece by fresh reviewers with every check, as in the first. The coordinator, not the reviewer, compares the new report with the accepted findings to confirm each was fixed. When a repair added passages or figures, the coordinator names them to the teaching reviewer, without the findings behind them, for its placement check.
