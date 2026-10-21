---
name: staycurrent-revise
description: Repair a written article from accepted review findings so that it reads as if it had been written that way, with the same standard and proportionate verification.
---

Review findings arrive one problem at a time, so the easy repair is local: add the missing sentence, qualify the claim, append the case. Each such patch is correct, and together they make a worse article. Qualifications stack, asides answer the reviewer rather than the reader, and the argument loses its line. In the 2026-10-20 skill trial, "Making concurrent changes correct" grew from 4,925 to 6,112 words over two repair rounds. Teaching judged every addition to belong in the article, yet two passages still read as accumulated fixes: a closing sentence about a vendor import tool carried four conditions, and a paragraph about `FOR UPDATE` had to be read twice. Length is not the problem. A repaired article must meet the same standard as a first draft, with every affected claim and figure verified.

## Read the finding as a reader's problem

You are usually not the article's original writer. Read the whole article before the findings, with the relevant plan context and current decisions and evidence from its work record, so you know the argument you are repairing. Follow links into earlier history only where needed to understand the problem.

A finding says where the reader stalls or is misled. Its suggested repair is one way to fix that, and the coordinator's decision records which problems to fix, not the wording. Before changing anything, reread the whole section the finding sits in and ask what the reader there needs.

Keep the change in proportion to the problem. A low or medium finding is repaired where it sits, with the smallest change that leaves the section reading well. Restructure a section only when a critical finding cannot be fixed without it. Every passage you rewrite is new text that the next fresh reviewer has to check, and in the 2026-10-21 trial repairs that rebuilt more than their findings needed caused most of the later rounds' problems.

Then choose the change that leaves the section clearest. Usually that means reshaping what is already there, not appending to it:

- **Reword or reorder** when the idea is present but arrives in the wrong place or form.
- **Cut** when a claim cannot be made true without a pile of conditions. Say the plain true thing, and move the edge cases to the article that owns them or to Sources.
- **Move** a passage that belongs in another article, and link to it.
- **Add** when the reader genuinely lacks something. Rewrite the surrounding paragraph so that the new point is part of the argument, rather than a sentence attached at its end.

A correctness repair follows the same rule. State what is true as simply as the evidence allows, and put any condition that changes the reader's decision where they will act on it.

## Finish as a first draft finishes

After the findings are repaired:

1. Reread the complete article as a reader would, including its contents list, captions and controls, against the standard of the three reference articles named in [staycurrent-write](../staycurrent-write/SKILL.md). Revisit relevant reference passages or figures when calibration is needed; every repair need not reload all three in full. Revise any passage that now reads as a patch: a paragraph that answers an objection the reader never had, a sentence with more than one "unless" or "provided", or an aside that interrupts the point.
2. Run the [staycurrent-continuity](../staycurrent-continuity/SKILL.md) pass. Repairs are where terms most often arrive before their explanation.
3. Recheck every claim, term, example and figure affected by the repair, including downstream uses. Use [staycurrent-figures](../staycurrent-figures/SKILL.md) for changed figures and request needed builds from the preview/build owner. Reuse verification only while its relevant source, data, environment and verifier remain applicable; otherwise rerun affected checks. Prose changes can alter technical meaning, layout or playback timing. Add a verification case only when the repair changes what a figure or listing claims.

Update the canonical work record with each finding's repair and verification links; do not copy unchanged evidence or the continuity ledger. Name every passage restructured beyond the finding and the dependencies or overall argument affected, so the coordinator can widen confirmation under [staycurrent-review](../staycurrent-review/SKILL.md). Return the repaired version and applicable verification evidence for fresh checking; your whole-article reread does not replace the independent final complete reading.

Anyone who changes an article's prose uses this skill, including a coordinator making a one-phrase fix.
