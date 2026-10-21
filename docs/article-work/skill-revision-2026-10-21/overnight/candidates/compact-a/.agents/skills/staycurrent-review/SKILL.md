---
name: staycurrent-review
description: Arrange independent reviews of a breakdown, article tree, written article or corpus, or carry out one assigned review perspective.
---

Judge against the commission: take an intelligent newcomer to expert practitioner in the commissioned subject, in the least reader time and effort. Each article contributes without setting its own specialist target. Each perspective has its own fresh subagent, permitted inputs and report; reviewers report without editing.

| Mode | Perspectives |
| --- | --- |
| Breakdown, including batches | practitioner, value, teaching |
| Tree | practitioner, value, teaching |
| Article, including batches | practitioner, teaching, editorial, visual (round schedule below) |
| Corpus | practitioner, value, teaching, editorial |

Use the fixed checks and inputs in [practitioner](perspectives/practitioner.md), [value](perspectives/value.md), [teaching](perspectives/teaching.md), [editorial](perspectives/editorial.md) and [visual](perspectives/visual.md). Plans receive no wording/visual review; teaching checks how briefs propose to show hard parts.

## Assignment and evidence

Give each reviewer exactly one perspective, mode, pieces, fixed version and only that perspective's listed inputs. Every assignment, including later rounds, uses a reviewer who has seen neither the piece, earlier versions nor prior reports. Assigned reviewers perform the perspective directly without arranging teams.

Freeze complete inputs and preview with one preview/build owner under [staycurrent-orchestrate](../staycurrent-orchestrate/SKILL.md). Start ready commissioned perspectives as slots free up, long visual work early.

Editorial/teaching may read scripted step text from the built page without playing it. Practitioner/visual may reuse identified evidence for unchanged mechanics where their permitted inputs allow. Relevant source, data, environment and verifier must still apply to the current version; otherwise rerun affected verification or report the limit. Mechanical receipts contain provenance and relevant mechanical records only, excluding author teaching notes, earlier quality verdicts and review findings. Extract these from mixed writing records. Reuse replaces no perspective check and no fresh visual reading/use of controls. Editorial receives no plan, earlier approval or writer's notes.

## Report

```markdown
# [Perspective] review · [mode] · [pieces] · [version]

Inputs read: [fixed input manifest or concise links; omissions and withheld inputs]
Highest severity: critical | medium | low | none

## Checks

| Check | Result | Note |
| --- | --- | --- |
| [each perspective check, in order] | pass, finding or not applicable | [one line] |

## First reading

[Visual only: what each figure, table and code example seemed to show before prose; uncertainties]

## Findings

### [perspective]-[n] · critical | medium | low · [piece and location]

Problem: [what is wrong as the reader meets it]
Effect: [what the reader loses or must do instead]
Suggestion: [one possible repair; writer chooses]
Evidence: [observation, source or applicable mechanical receipt]

## Limits

[What could not be checked, and why]
```

Keep one line per check and detail in findings. Link evidence without copying logs and state material limits. Continue each perspective's finding numbers across rounds; the coordinator supplies the next number without prior findings. Map duplicate observations to one canonical issue and repair decision, retaining each report and label's traceability.

## Severity

- **Critical:** the reader would come away believing or doing something wrong, cannot follow the argument past this point, or a figure contradicts its own text. A false sentence, a figure note that is wrong in some of its states, and a claim the evidence does not support are critical.
- **Medium:** the reader stalls, rereads or has to supply something themselves. A term used before it is explained, a passage that reads as a patch, a figure that is hard to follow, and a section that spends the reader's time without return are medium.
- **Low:** a change that would make reading a little easier, such as wording, a heading or a small layout point.

Length alone is not a finding: every part must earn its place; a part that does not is medium.

## Decisions and rounds

The coordinator sets severity from the reviewer's proposal, recording reasons for changes, and decides acceptance/conflicts against the commission. Accepted decisions state problems rather than replacement wording. Send each piece's accepted findings together to a fresh writer using [staycurrent-revise](../staycurrent-revise/SKILL.md). Shared layout/site-wide text without a writer goes to the coordinator.

| Round | Repair floor |
| --- | --- |
| 1 | critical, medium and low |
| 2 | critical and medium |
| 3 and later | critical |

Record lower findings as “below this round's floor”. End after a round finding nothing at or above its floor; always repair critical findings. Round 3 is the last full round. After it, have a fresh reviewer of the finding's perspective check each critical repair, reading repaired passages and surrounding sections in the whole piece; repeat until it passes.

Article mode runs practitioner/teaching every round, editorial/visual in round 1 and again before ending: when a round clears its floor without them, run them on that same version. Other modes run every listed perspective each round.

Every round fully reviews the whole piece with fresh reviewers and every check, except the post-round-3 critical rechecks just described. The coordinator compares reports with accepted findings to confirm repairs. Name added passages/figures to teaching for its placement check, without the findings behind them.
