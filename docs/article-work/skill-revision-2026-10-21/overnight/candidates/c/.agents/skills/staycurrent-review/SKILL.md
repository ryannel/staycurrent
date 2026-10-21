---
name: staycurrent-review
description: Arrange independent reviews of a breakdown, article tree, written article or corpus, or carry out one assigned review perspective.
---

Independent reviewers catch what an author cannot see in their own work. Each perspective looks for a different kind of failure, so each gets its own subagent, its own inputs and its own report. Full reviews use the fixed perspectives, checks and report format so their coverage can be compared; repair confirmations declare their narrower scope. Judge everything against the commission: take an intelligent newcomer to expert practitioner in the commissioned subject, in the least reader time and effort. A nested article contributes to that goal; it does not have to make the reader a specialist in its own topic.

## Which perspectives run

| Mode | Perspectives |
| --- | --- |
| Breakdown, or a batch of breakdowns | practitioner, value, teaching |
| Tree | practitioner, value, teaching |
| Article, or a batch of articles | practitioner, teaching, editorial, visual (all four on the first pass; rechecks below) |
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

Freeze the complete inputs and rendered preview before dispatch, with one preview/build owner, as [staycurrent-orchestrate](../staycurrent-orchestrate/SKILL.md) describes. Start ready commissioned perspectives as slots free up, scheduling long visual work early. Every assignment goes to a fresh reviewer, including repair confirmations and final readings. Full-perspective reviewers and final readers must not have seen the piece, earlier versions or reports. Repair checkers receive the accepted problem and pass condition: their task is informed confirmation, not an independent first reading. A reviewer assigned one perspective or check performs it directly and never arranges another team.

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

Full-perspective reviews cover every listed check. Repair confirmations state their scope, the checks applied and the result for each problem; identify what they did not recheck. Final readings use the editorial checks plus the whole-article judgement described below. Keep detail in findings rather than repeated inventories. Link applicable evidence instead of copying logs; state material limits. The coordinator maps duplicate observations to one canonical issue and records one repair decision without discarding observations. Number findings per perspective and keep counting across rounds of the same review: if the editorial findings in the first round end at editorial-13, the coordinator tells the next round's reviewer to start at editorial-14. Each observation label remains traceable to its canonical issue throughout the work record.

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

## Article review schedule

1. **First coverage.** Run all four independent article perspectives on the same frozen complete draft, with every prescribed check and input. Consolidate findings before assigning repair. This coverage is required even when an early perspective finds no substantive defect.
2. **Repair confirmation.** Give accepted problems together to a fresh writer. Then assign fresh checkers from the relevant perspectives the repaired version, problems, pass conditions and their perspective's permitted context and evidence. They read the repair, surrounding explanation and affected dependencies, including downstream uses; they do not inspect changed lines alone. Widen the assignment to every area whose earlier judgement the change invalidates. Give the teaching checker every added or restructured passage and figure for its placement check. Changes to the overall argument or reading order require complete teaching/editorial assessment; changes to claims, examples, figures or shared components require the corresponding practitioner/visual checks across affected material and articles.
3. **Final complete reading.** After substantive repairs and their specialist checks, give one fresh independent reader the complete current rendered article, intended audience and the editorial perspective's reference inputs. Withhold plans, findings, decisions, repair history and writer's notes. Ask them to apply the editorial checks and judge the explanation's coherence, prerequisite order, examples, teaching and promised practical judgement, looking for new defects as well as awkward repairs. This is a complete reading, not a repair checklist. Route any substantive technical or visual concern to fresh relevant specialists; this reader does not replace expert or media checks.

Repair and confirm substantive findings from any stage. A local repair after the final reading needs fresh confirmation of the problem, surroundings and dependencies; it does not automatically restart four full perspectives or the complete reading. Repeat a fresh complete reading when later changes invalidate the previous whole-article coherence or teaching judgement, particularly restructuring of the overall argument. Widen specialist checks whenever their earlier coverage is invalidated, whether or not a complete reading repeats. Changed visual areas require current rendered inspection and control use with the applicable visual checks; changed technical claims or examples require appropriate primary-source and native verification under the practitioner and figures requirements. Unchanged evidence remains reusable only under the evidence rule above.

This schedule replaces article rounds 2 and 3 and the inherited trigger to rerun full editorial and visual perspectives at the end. The old three-full-round limit does not govern article rechecks or waive required final reading or specialist confirmation. No round or time cap turns an unresolved substantive defect into a pass. Optional polish does not restart review; assess any change actually made for invalidated evidence or judgement just as for a substantive repair.

## Other modes and completion

In breakdown, tree and corpus modes, every listed perspective reviews the complete piece with every check in each round. The coordinator compares reports with accepted findings and names added passages or figures to teaching reviewers without disclosing earlier findings. Round 3 is the last full round in these modes; after it, fresh relevant-perspective checkers verify substantive repairs, surroundings and affected dependencies until they pass. New substantive defects also require repair and confirmation. There is no separate final-reader stage in these modes.

Complete review only when the required coverage and confirmations apply to the final version, no accepted substantive defect remains unresolved, and the coordinator judges that the piece fulfils its promise and reads coherently. For articles, the fresh complete reading must have occurred and its judgement must remain applicable after any later local repairs. Record the final version, coverage and widened checks, each substantive problem's repair and confirmation, optional improvements left open, reused evidence and verification limits. If a required repair or check is unfinished, record the review as incomplete with the outstanding work. Review completion is a judgement within the checked scope, not publication authorisation.
