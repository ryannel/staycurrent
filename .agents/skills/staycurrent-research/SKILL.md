---
name: staycurrent-research
description: >
  Use when running or resuming a Stay Current research run — convening a
  topic, reporting research progress, presenting the ranked findings digest,
  and stating the cut/no-cut verdict. Loaded for the `convene <slug>`
  choreography; pairs with staycurrent-writer, which authors the cut's
  artifacts once the verdict is a cut.
---

# Stay Current — Research Skill

Encodes the run choreography from `docs/design-system.md` § Agentic Protocol and
`docs/bets/first-living-topic/technical-design/01-ui-design.md` § workbench (Convene,
Research Progress & Findings Digest, Verdict). The microcopy quoted below is verbatim
and normative — no paraphrase, no synonym for the closed status vocabulary
(`current`, `due`, `in-research`, `superseded`, `cut`, `no-cut`, `sourced`,
`synthesis`). Conversational prose between these templates — progress lines, digest
framing, the argument — is written in the staycurrent-style voice; the templates
themselves stay verbatim.

## Preconditions

Before convening, check `.staycurrent/sessions/<slug>.md`. If it exists, the run is
resumed or discarded — never silently restarted. `node workbench/cli.mjs convene
<slug>` refuses (exit 2) exactly this case, naming the file.

## Convene

Fresh convene (no open session):
```
Convening <topic> against v<N> (last researched <date>). Sources first, digest when I have it.
```

Resume case (a session file already exists for the topic):
```
<topic> has an open session from <date>, phase: <phase>. Resume it or discard it?
```
A bounded prompt — resuming vs. discarding is a genuinely open editorial choice the
filesystem alone cannot settle.

## Research progress

Report completed facts only, never activity narration:
```
12 sources examined; 3 findings of consequence.
```
Never "let me now look at…" — the operator sees what is done, not what is happening.

**Degraded-source rule:** a fetch or search that fails retries 3× (1s/2s/4s backoff,
`recoverable` severity) — silent unless it exhausts. If it exhausts, continue without
that source and record the gap in the cut's `provenance.md` as a `## Synthesis`
bullet in its one legal form — the parser rejects everything else:
```
- Research gap — <source> unreachable after bounded retries; would have supported <claim>.
```
Surface exactly one factual digest line naming it. No halt.

## Findings digest

When research completes, present the ranked digest: a table of *finding · source ·
consequence for the stance*, ranked by consequence. No fixed microcopy beyond the
table shape itself — the table is the artifact.

## Verdict

State a position, never an open question — the system holds an informed view and
invites pushback, it does not defer.

Cut:
```
Verdict: cut. <finding count> findings, <n> touch the stance — <one-line reason>. Draft entry below; argue or approve.
```
The draft changelog entry and every other prospective artifact are authored — by this
skill and staycurrent-writer — directly into the staged tree
`.staycurrent/staged/<slug>/`, which `cut <slug>` will gate. `topics/` itself is
mutated only through `workbench/cli.mjs` — `create`, `convene`, `cut`, and `log`
mutate it (and `discard` mutates session state); `gate` is a read-only dry-run.
Hand-editing `topics/` outside this contract is a `violation` — a hard stop, never
overridable in-session.

No-cut:
```
Verdict: no-cut. What moved doesn't touch the claims or the stance — logging the run. Overrule if you read it differently.
```

The operator's explicit go resolves it — the one authority rule with no exception:
`cut <slug>` on approval, `log <slug> --line <text>…` on confirmed no-cut, `discard
<slug>` to abandon. Two exceptions to that default no-cut route: a founding run (the
topic was `create`d but never founded — no `topics/<slug>/article.md` yet) resolves
no-cut via `discard`, never `log` — `recordNoCut` requires the live article, which a
founding draft has not landed. An orphaned `in-research` stamp (a stamp with no
session file) resolves via `status` first — its reconciliation reverts the stamp to
`current` — before convening fresh.

## Editorial pass

When the verdict is a cut and the staged artifacts are authored, invoke
staycurrent-editor before requesting the operator's go: an isolated
fresh-context subagent receiving only the slug, the mode `staged`, and at most
one line of context — never this conversation, whose knowledge of intent is
exactly what the review must not inherit. Relay the returned verdict and
findings to the operator verbatim. On `REVISE`, apply the findings through
staycurrent-writer and staycurrent-style — never freehand — and re-invoke
once, fresh again; a second `REVISE` goes to the operator with the findings
attached. The operator's explicit go resolves it either way — the one
authority rule with no exception — so the go is requested only once the
editor's report sits in front of the operator: the argue-or-approve window in
the Verdict template now carries that report inside it.

## Session-file phases and write duty

`workbench/cli.mjs` writes only the session file's frontmatter (`create`/`convene`
seed it; `log`/`discard` delete it) — every body section is this skill's write duty,
never the CLI's. A session left un-narrated cannot be resumed, only reread:
- As each source is examined, append its finding to `## Findings` immediately —
  never batched for the end of the run.
- When the digest is presented, record the argument under `## Argument` and advance
  the session file's `phase:` frontmatter from `researching` to `arguing`.
- When the verdict is stated, advance `phase:` to `deciding` and write `## Draft`:
  the proposed changelog entry text plus a one-paragraph rationale.
- When the editorial pass returns, record its verdict and findings verbatim under
  `## Editorial` — `phase:` stays `deciding`; the operator's go is what moves it.

Resume re-enters from exactly these sections, never from memory: the session file is
the RESUME source; the staged tree is the ARTIFACT source, authored by this skill and
staycurrent-writer.

## Escalation

Two `blocking`/`violation` halts in one session → recommend closing it: "Session
paused twice on blocking issues — the session file preserves everything; resume in
fresh context." Nothing published self-repairs; only bounded, transient research I/O
retries.

## Staged-tree surface

Draft artifacts — the article rewrite, `versions/vN/`, the changelog entry,
`provenance.md`, skill deltas — are authored directly into
`.staycurrent/staged/<slug>/` (seeded by `create`/`convene`). `topics/` stays
untouched by hand; only `cut <slug>` lands it, through the gate. See
staycurrent-writer for the artifact rules themselves.
