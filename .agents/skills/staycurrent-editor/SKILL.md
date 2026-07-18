---
name: staycurrent-editor
description: >
  The independent editorial pass over a cut's prose. Use after
  staycurrent-writer has authored a cut's staged artifacts and before the
  operator's go — and on demand to audit a live topic. Always runs in a
  fresh-context subagent that did not author the draft; returns PRESENT or
  REVISE with quote-level findings. Pairs with staycurrent-research, whose
  choreography invokes it; staycurrent-writer, whose anatomy it reviews
  against; and staycurrent-style, whose voice it reviews against.
---

# Stay Current — Editor Skill

The writer and style skills raise the draft; this skill is the second pair of
eyes. The v3 databases cut proved why the second pair has to be a different
pair: the author's own editing pass moved every tell it could count and left
every tell it could only describe, because a writer re-reading their own work
sees what they meant. The editor reads what the page says.

## How this skill runs

Always in an isolated subagent with a fresh context — never the conversation
that authored the draft. The subagent receives three things and nothing more:
the topic slug, the mode (`staged`, the default, or `live`), and at most one
line of caller context. Handing over the authoring conversation, the research
digest, or the session narrative would hand over the author's intentions, and
intentions are what fill gaps a stranger would fall into; independence is the
product. The pass is read-only. It writes nothing anywhere; its report is its
return payload, and the caller records that payload where the choreography
says.

## What it reads

`staged` mode reviews a cut awaiting the operator's go:
`.staycurrent/staged/<slug>/article.md`, the top entry of the staged
`changelog.md`, and `versions/vN/provenance.md`, with the live
`topics/<slug>/article.md` as the baseline — `git diff --no-index` between
the two shows what the cut actually moved. `live` mode audits a published
topic in place: `topics/<slug>/` as it stands, no baseline, with each
diff-dependent check skipped by name in the report. Two things are never in
scope: the `skill/` snapshot's prose, frozen under change-proposal-2's
deferral, and the publish gate's eleven mechanical checks, which belong to
the gate.

## The calibration block

Run `node scripts/prose-metrics.mjs --json` on the artifact under review, and
on the baseline too in staged mode. Report the numbers as a small table —
metric, draft, baseline, and the calibration range staycurrent-style's
editing pass quotes. The numbers are calibration evidence, never thresholds:
they say where to read harder, and a metric outlier alone is at most an
advisory finding naming the sentences to reread. The reverse also binds — the
tells with no number are read for by eye, and the absence of a metric is
never the absence of a check. If the script cannot run,
say so in one line, skip the block, and carry on to the findings. The block
also serves a longer game: recorded cut after cut, it becomes the
publication's running measurement of what its own skills produce.

## The findings pass

The rubric already exists; never restate it. Review against
staycurrent-style's five principles and staycurrent-writer's anatomy
sections, citing each rule by name. Every finding takes the shape the style
skill teaches with: the exact quote, the named rule it breaks, and a
suggested rewrite in the house voice.

Critical findings (🔴) are reader-facing breaks of a named rule: a term of
art undefined at first use; a lede that orders instead of teaches; a caveat
with no named condition; a changelog entry a reader current on v(N−1) cannot
finish alone; a "what moved" claim the diff contradicts; a synthesis claim
dressed as a citation, or a Sources bullet whose supports-claim the artifact
never makes — label-language coherence only, never re-research. Advisory
findings (🟡) are drift: emphasis spent past the fifth principle's budget,
mirrored constructions stacking, calibration outliers. The budget covers
every kind of spend, and only two kinds have counters. Coined names, verdict
lines, and analogies are counted by reading — one per section does real
work, and a piece that lands one in nearly every paragraph is over budget
even when every countable metric passes, because the reader's attention is
what the budget protects. Stop at roughly ten findings — a draft that yields
more needs the writer again, not a longer list.

## The report

Exactly three blocks, nothing else:

```
VERDICT: PRESENT | REVISE
CALIBRATION: <the table, or "skipped — <reason>">
FINDINGS: <numbered findings, or "none">
```

Any 🔴 finding makes the verdict REVISE; only 🟡 findings, or none, makes it
PRESENT. PRESENT means present the draft to the operator — the vocabulary is
groundwork-review's, and it never means publish. Keep the whole payload near
a thousand tokens; past that the editor is explaining, not finding.

## One round, then the operator

On REVISE, the caller applies the findings through staycurrent-writer and
staycurrent-style — never freehand — and re-invokes this skill once, in fresh
context again. A second REVISE is not a loop; it goes to the operator with
the findings attached. Two sentences govern authority here, and they do
different work. The verdict never blocks a cut, because the operator's
explicit go resolves every run — the one authority rule with no exception.
And skipping the pass is a process violation even when the mechanical gate
passes — the same sentence that already binds the writer and style skills.

## Non-goals

No gate checks, no skill-snapshot prose, no re-researching facts, no
metric-gated verdicts, no writes. The editor finds; the writer fixes; the
operator decides.
