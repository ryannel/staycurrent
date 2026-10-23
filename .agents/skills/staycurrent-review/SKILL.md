---
name: staycurrent-review
description: Arrange independent reviews of a breakdown, article tree, written article or corpus, or carry out one assigned review perspective.
---

Judge against the commission: take an intelligent newcomer to expert practitioner in the commissioned subject, in the least reader time and effort. Each article contributes without setting its own specialist target. Each perspective has its own fresh subagent, permitted inputs and report; reviewers report without editing.

| Mode | Perspectives |
| --- | --- |
| Breakdown, including batches | practitioner, value, teaching |
| Tree | practitioner, value, teaching |
| Article, including batches | practitioner, teaching, editorial, visual (schedule below) |
| Corpus | practitioner, value, teaching, editorial |

The fixed checks and inputs are in [practitioner](perspectives/practitioner.md), [value](perspectives/value.md), [teaching](perspectives/teaching.md), [editorial](perspectives/editorial.md) and [visual](perspectives/visual.md). Assigned reviewers read only their own perspective file. Plans receive no wording/visual review; teaching checks how briefs propose to show hard parts.

## Assignment and evidence

Give each reviewer exactly one perspective, mode, pieces, fixed version and only that perspective's listed inputs. Every assignment, including repairs, confirmations and final readings, uses a fresh subagent. Full-perspective reviewers and final readers have seen neither the piece, earlier versions nor reports. Repair checkers receive accepted problems and pass conditions: informed confirmation, not an independent first reading. Assigned reviewers perform their check directly without arranging teams.

Freeze complete inputs and preview with one preview/build owner under [staycurrent-orchestrate](../staycurrent-orchestrate/SKILL.md). Start ready commissioned perspectives as slots free up, long visual work early.

Focused confirmations consult the reference passages needed to judge their affected checks; they need not reload all three articles. Full perspectives and final complete readings retain their prescribed reference inputs. Widen calibration when the assignment needs a whole-article judgement.

Editorial/teaching may read scripted step text from the built page without playing it. Practitioner/visual may reuse identified evidence for unchanged mechanics where their permitted inputs allow. Relevant source, data, environment and verifier must still apply to the current version; otherwise rerun affected verification or report the limit. Mechanical receipts contain provenance and relevant mechanical records only, excluding author teaching notes, earlier quality verdicts and review findings; extract these from mixed writing records. Reuse replaces no perspective check and no fresh visual reading/use of controls. Editorial receives no plan, earlier approval, repair history or writer's notes.

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

Full perspectives cover every listed check. Confirmations declare scope, applied checks, each problem's result and what was not rechecked. Final editorial readers use editorial checks plus the whole-article judgement below. Keep detail in findings; link evidence without copying logs. Continue each perspective's finding numbers across rounds; the coordinator supplies the next number without prior findings. Map duplicate observations to one canonical issue/decision, retaining reports and label traceability.

## Severity and decisions

- **Critical:** the reader would come away believing or doing something wrong, cannot follow the argument past this point, or a figure contradicts its own text. A false sentence, a figure note that is wrong in some of its states, and a claim the evidence does not support are critical.
- **Medium:** the reader stalls, rereads or has to supply something themselves. A term used before it is explained, a passage that reads as a patch, a figure that is hard to follow, and a section that spends the reader's time without return are medium.
- **Low:** a change that would make reading a little easier, such as minor local wording or spacing.

Length alone is not a finding: every part must earn its place; a part that does not is medium.

The coordinator sets severity from the reviewer's proposal, recording reasons for changes, and resolves acceptance/conflicts against the commission. Identify the concrete reader effect at the reported location against the audience's starting knowledge and the piece's promise: misunderstanding, inability to follow/use, unprepared prerequisites or effort without useful return. Accept/reject the problem on that basis, explaining disputed effects; prefer a coherent explanation over preferred phrasing. Decisions name problems, not replacement wording. Consolidate duplicate problems without losing evidence/labels.

Repair every accepted critical/medium defect whenever found, including poor coherence, patch-like prose, missing prerequisites and unreadable/unusable media. Technical truth alone does not make editorial or visual problems optional. Low polish is optional and may join a repair batch. Do not downgrade substantive defects to finish or let round number, a rising floor, elapsed time or a cap waive repair. Send each piece's accepted problems together to a fresh writer using [staycurrent-revise](../staycurrent-revise/SKILL.md); shared layout/site-wide text without a writer goes to the coordinator.

## Article schedule

1. **First coverage:** all four independent perspectives on the same frozen complete draft, with every prescribed check/input, even if an early perspective finds no substantive defect. Consolidate findings before repair.
2. **Repair confirmation:** fresh relevant-perspective checkers receive the repaired version, problems, pass conditions and their perspective's permitted context/evidence. Read repairs, surrounding explanation and affected dependencies, including downstream uses. Widen to every area whose earlier judgement is invalidated, across affected articles. Give teaching every added/restructured passage and figure for placement checking. Overall argument/reading-order changes require complete teaching/editorial assessment; changed claims/examples or media/shared components require corresponding practitioner/visual checks.
3. **Final complete checks:** after substantive repairs and specialist checks, a fresh practitioner reviews the complete current article with all practitioner checks and permitted inputs, without earlier versions, findings, decisions or repair history. This is a new technical challenge, not repair confirmation. A separate fresh blind reader receives the complete current rendered article, intended audience and editorial reference inputs, withholding plans, findings, decisions, repair history and writer's notes. Apply editorial checks and judge coherence, prerequisite order, examples, teaching and promised practical judgement; find new defects as well as awkward repairs. Route substantive technical/visual concerns to fresh relevant specialists. This complete reading replaces neither expert nor media checks.

Repair and confirm substantive findings from every stage. Later local repairs need fresh confirmation of problems, surroundings and dependencies; repeat a fresh complete reading when changes invalidate its whole-article coherence/teaching judgement, especially overall restructuring. Widen specialist checks whenever invalidated, regardless of the final reader's view. Changed visual areas need current rendered inspection/control use and applicable visual checks; changed technical claims/examples need appropriate primary-source and native verification under practitioner/figures requirements. Reuse unchanged evidence only under the evidence rule above.

This is the complete article schedule: no automatic later full rounds or blanket final editorial/visual repeats. No round/time cap waives required confirmation or final reading. Optional polish does not restart review, but assess edits actually made for invalidated evidence/judgement.

## Plans, corpus and completion

For breakdown/tree, run every mode perspective once on the complete frozen plan. Repair accepted substantive problems with a fresh planner, then fresh relevant-perspective checkers confirm problems, surroundings and dependencies. Widen to complete assessment when changed scope, examples, prerequisites or reading order invalidate it. Give teaching all added/restructured explanations and proposed media for placement checking. Orchestrated provisional nodes need no separate review gate before this whole-tree coverage unless an unresolved decision warrants early review.

After those checks, a fresh practitioner reviews the complete current plan with all practitioner checks and permitted inputs, without earlier versions, findings, decisions or repair history. A separate fresh blind teaching reader receives the complete current plan, commission and teaching perspective's permitted context, withholding earlier versions, findings, decisions and repair history. Apply all teaching checks and judge the whole learning journey, including promised practical judgement and article boundaries. Find new defects too; route substantive technical/value concerns to fresh relevant specialists. Repair and confirm them. Repeat the complete reading when later changes invalidate its overall judgement. A clean first batch still receives this complete reading.

A final complete assignment may also supply its corpus perspective only when the complete collection, frozen version, permitted inputs and every required check coincide, including cross-article checks. Record both coverage roles; otherwise commission the missing corpus coverage. Never count an informed repair confirmation as an independent complete check.

Corpus retains every listed perspective on the complete piece with every check each round. Compare reports with accepted problems; name additions to teaching without prior findings. In corpus mode, round3 is the last full round, then fresh relevant checkers confirm substantive repairs, surroundings and dependencies until they pass. Repair and confirm new substantive defects too; round/time limits waive nothing.

Complete only when required coverage/confirmations apply to the final version, no accepted substantive defect remains, and the coordinator judges the piece fulfils its promise and reads coherently. Articles and plans require their independent complete checks to remain applicable after later repairs. Record final version, coverage/widened checks, repairs/confirmations, open optional improvements, reused evidence and limits. Missing required repair/check means incomplete review. Completion does not authorise publication.
