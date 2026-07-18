# STAYCURRENT.md — Operator Session Contract

The root instruction file (design system, Agentic Protocol: ≤150 lines — names the
topology, the vocabulary, and the routes to the workbench skills; methodology lives in
the skills below, never here).

## Session opening

Every session starts with `node workbench/cli.mjs status` (`--json` for the typed
form) — the filesystem-derived state block. Render it verbatim, then open with a
proposal, never an open question:

```
observability      v5   researched 12 Jun 2026   current — next run 10 Sep
testing            v3   researched 28 Jun 2026   current — next run 26 Sep
cost-engineering   v2   researched 01 Mar 2026   due — 35 days over
```
…followed immediately by e.g. "cost-engineering is furthest over — convene it?"

Zero topics: the boot opening REPLACES the state block (there is nothing yet to
render) — the CLI's `No topics.` becomes "No topics yet. Name a practice area and
I'll create the first one — topic, cadence, and the initial research run."

`status` also reconciles: a topic stamped `in-research` with no matching
`.staycurrent/sessions/<slug>.md` reverts to `current` automatically and prints
`reconciled <slug>: in-research had no session file — status reverted to current` —
report that line; never re-derive it from memory.

## Status vocabulary — closed set, no synonyms

`current` (topic/version) · `due` (topic, derived) · `in-research` (topic) ·
`superseded` (version, derived) · `cut` (run outcome) · `no-cut` (run outcome) ·
`sourced` (provenance claim) · `synthesis` (provenance claim). Never "stale",
"published", or "outdated": match the operator's own status word against this closed
set — it is exhaustive, never a paraphrase target.

## The CLI — seven commands, no others

| Command | Does | Exit |
|---|---|---|
| `status` | Prints the state block, or `No topics.`; a created-but-not-yet-founded slug prints `<slug> — founding draft in progress (…)` | 0; 1 if any topic malformed |
| `create <slug> --title <t>` | Seeds a staged founding topic | 0; 2 invalid/exists/reserved |
| `convene <slug>` | Seeds `.staycurrent/staged/<slug>/`, then stamps `in-research` | 0; 2 already in-research / unknown slug |
| `gate <slug>` | Dry-runs the publish gate against the staged tree (`PASS <slug> vN` / `FAIL <check>: <msg>` lines) | 0 pass; 1 fail; 2 nothing staged |
| `cut <slug>` | Stage → gate → commit the sanctioned cut | 0 committed or idempotent no-op; 1 gate failure, or a passing-gate halt (e.g. the staged tree would not advance the version); 2 unknown slug |
| `log <slug> --line <text>…` | Reverts `in-research` to `current`, updates `last_researched`, appends the research-log entry, then deletes the session file and the staged tree | 0; 1 validation failure; 2 no open session |
| `discard <slug>` | Abandons the run — zero trace | 0; 2 nothing to discard |

`convene` refuses (exit 2) whenever a session file exists at
`.staycurrent/sessions/<slug>.md` **or** the topic's frontmatter already reads
`in-research` — including the orphaned-stamp case (a stamp with no session file). Run
`status` first in that case: its reconciliation reverts the orphan to `current`, then
convene fresh.

Exit-code classes: `0` success (including an idempotent no-op); `2` a usage/state
error, always a plain one-liner. `1`'s shape is command-specific, never uniform:
`cut` alone renders the halt template below; `gate` prints `FAIL` lines; `status`
prints the state block plus one `malformed <slug>: …` line per broken topic; `log`
prints a plain one-liner.

## Authority — the one rule with no exception

The system researches, drafts, and recommends; the operator argues the stance and
owns the significance decision. **The system never cuts without the operator's
explicit go.** Within a sanctioned cut it executes the mechanics autonomously — that
is execution, not a second decision.

## Halt template

Every `blocking`/`violation` failure in conversation renders this. At the CLI it
belongs to `cut` alone — `gate` prints `FAIL` lines, and usage/state errors are plain
one-liners:

```
Blocked: <what stopped, one line>
Cause:   <why — the file, the value, the check that failed>
State:   <topic, phase, last durable step — what is safely on disk>
Action:  <the one thing the operator should do>
```

Severity ladder (design system § Severity levels): `recoverable` — transient research
I/O only, retries 3× then degrades silently, surfaced as one digest line if it
exhausts. `blocking` — the session cannot proceed (a schema violation, unresolvable
state): halt, full diagnostic, no workaround attempted. `violation` — the publish
gate fails, or an operation would mutate `topics/` outside the action contract: a
hard stop, never overridable in-session.

Two `blocking`/`violation` halts in one session → recommend closing it: the session
file preserves everything; resume in fresh context.

## Resume & reconciliation

An open `.staycurrent/sessions/<slug>.md` for an `in-research` topic offers resume or
discard — `convene` refuses (exit 2) rather than silently restarting in-flight work.
No session file for an `in-research` topic → filesystem wins: silent revert to
`current`, reported once as a reconciliation line. Never resolve state from memory —
the filesystem is the shared ground truth both operator and agent read.

## Skills

- `.agents/skills/staycurrent-research/` — the run choreography: convene, research
  progress, the findings digest, the cut/no-cut verdict.
- `.agents/skills/staycurrent-writer/` — what a cut's staged artifacts must be: the
  article rewrite, the changelog entry, provenance, the skill snapshot.
- `.agents/skills/staycurrent-editor/` — the independent editorial pass: after the
  writer stages a cut and before the operator's go, a fresh-context review of the
  staged artifacts returns `PRESENT` or `REVISE` with quote-level findings.
- `.agents/skills/staycurrent-style/` — the house voice: sentence-level tone and
  craft for every prose surface, workbench conversation included. Not phase-bound —
  in force whenever words are written.

Load the skill for the phase in flight; this file carries no methodology of its own.
