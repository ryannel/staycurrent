# Candidate B — stable substantive acceptance

21 October 2026. Policy-only candidate prepared for experiment B; not installed.
Preparation timestamp: 20:48:28 UTC. Static validation completed at 20:48:49 UTC.

## Assignment and inputs

Change acceptance independently of review overhead, writing guidance and the later recheck experiment. Inputs read: Skill Creator, [protocol](protocol.md), [proposal](../proposal.md), candidate A's relevant skill files and unchanged current skill policy. No article content or review reports/findings were read. No team was arranged.

The changed-file overlay is [candidates/b/.agents/skills](candidates/b/.agents/skills/). Compose the effective set in this order: current `.agents/skills`, candidate A overlay, candidate B overlay. B contains only two full replacement files:

- [staycurrent-review/SKILL.md](candidates/b/.agents/skills/staycurrent-review/SKILL.md)
- [staycurrent-orchestrate/SKILL.md](candidates/b/.agents/skills/staycurrent-orchestrate/SKILL.md)

All other effective files remain as supplied by A or the unchanged current set. The overlay is not a standalone installation.

## Precise changes from A

- Remove the round-dependent repair floor and its rationale. Every accepted critical or medium finding is substantive and requires repair regardless of its discovery round. The existing severity definitions remain byte-for-byte unchanged.
- Treat concrete failures of coherence, prerequisite order, practical judgement and usable teaching media as substantive, including passages that read as accumulated patches. Technical falsity is not a prerequisite for acceptance.
- Keep low findings optional, including equivalent wording preferences and minor polish. They may join a repair batch but cannot block completion.
- Require the coordinator to identify the reader effect at its location, against the commissioned reader's starting knowledge and the piece's promise. Misunderstanding, inability to follow or use something, supplying missing preparation and effort without useful return establish reader harm; a preferred equivalent phrasing does not. Disputed decisions need reasons.
- Consolidate accepted observations of one problem into one repair while preserving their labels and evidence. Forbid using elapsed time, round number or a convenient medium-to-low reclassification to finish.
- Preserve the maximum of three full rounds and the existing post-third mechanism: fresh reviewers from the finding's perspective read the repaired passage and surrounding sections in the whole piece. Extend that mechanism from critical repairs to every substantive repair, including newly found substantive defects, until the check passes. No earlier focused-check substitution or separate final-reader stage is introduced.
- Preserve the perspective schedule, replacing only its floor-dependent trigger with the absence of accepted substantive defects. Article practitioner and teaching still run every round; editorial and visual still run in round 1 and again before completion. All perspectives still run every round in other modes.
- Require a final-version completion record containing scheduled coverage, substantive repairs and their confirmation, optional work left open and verification limits. The coordinator explicitly judges the promise and coherence. An unfinished repair or check means incomplete review, including after round 3; review completion does not authorise publication.
- Replace orchestrate's directly conflicting reference to a severity floor with a reference to the review skill's acceptance rule. Its other wording is unchanged.

The review skill's inputs, independent perspectives, fresh assignments, report format, severity definitions and full-review instructions are unchanged. No overhead or writing guidance was edited.

## Validation and limits

Skill Creator's `quick_validate.py` passed for both changed skills. Static comparisons confirmed unchanged severity text, unchanged review text before the replaced acceptance block and unchanged concluding full-review instructions. Every relative Markdown link in the two files resolves in the effective current → A → B composition. The diff was inspected for scope.

SHA-256 of the saved files:

| File | SHA-256 |
| --- | --- |
| review | `bf0c4f13e0e78a350ae0ed7e9073c79e65979e884c1201d9f4ad83db45259774` |
| orchestrate | `5492aa0d47e913b8ebf8f2eba3673595f83c11c8d8bae351b10d709a52d73463` |

This validates structure and isolation, not behavioural quality. No article test, edit, build, server, commit or push was performed.

One inherited scheduling ambiguity remains deliberately unexpanded: the existing rule requires a final editorial/visual review but expresses its trigger as a round without required findings. It does not explicitly place those final full perspectives when round 3 still requires repairs and then enters targeted checks. B preserves that schedule and the three-full-round cap; its completion record cannot claim a pass while scheduled perspectives remain unfinished. The coordinator must record the actual coverage and any unresolved conflict rather than silently treating targeted checks as a new full round. Resolving review scope belongs to a separately identified policy decision, not an unrecorded B change.

The reader-harm decision also remains judgement-based; this patch supplies criteria and traceable reasons rather than a mechanical threshold. Evidence of how consistently coordinators apply it must come from the acceptance experiment.
