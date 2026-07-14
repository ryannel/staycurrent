# Slice 1.4 — workbench: Workbench CLI

**Owner service:** workbench

**Surface:** workbench

**Complexity:** M

**Prerequisite:** Slice 1.3 merged

## Scope

This slice builds `workbench/cli.mjs` — the operator's real front door onto the milestone's capabilities. It wires the seven-command contract onto Slice 1.2's `runPublishGate` and Slice 1.3's cut and session functions, owns the session-file lifecycle under `.staycurrent/sessions/`, and is the only place the git commits `cut(<slug>): v<N>` and `log(<slug>): no-cut` are constructed. Every subsequent slice in this milestone, and the milestone's headline proof, is driven through this CLI.

**Required Capabilities:**
- The command set `status | create <slug> --title <t> | convene <slug> | gate <slug> | cut <slug> | log <slug> --line <text>… | discard <slug>` exists at `workbench/cli.mjs`, each producing exactly the success-output string and exit code the command-contract table in `03-api-design.md` specifies — for example, `create` prints `Created staged topic ${slug} — draft at .staycurrent/staged/${slug}/. Session: .staycurrent/sessions/${slug}.md` and exits `0`, or `2` on a reserved, existing, or invalid slug.
- `gate <slug>` prints `PASS ${slug} v${N}` on a passing gate, or one `FAIL ${check-id}: ${message}` line per `GateFailure` on a failing one — never the halt template.
- `cut <slug>` renders the full `Blocked/Cause/State/Action` halt template on a gate failure; on success it prints the `Cut v<N> — …` line, each path from `CutReport.paths`, and the commit line `cut(<slug>): v<N>`; a re-run with nothing staged and a complete `topics/<slug>/` exits `0` with `Nothing to cut — v<N> is complete.`
- The CLI, not core, owns `.staycurrent/sessions/<slug>.md` creation and deletion, and is the only place the git commits `cut(<slug>): v<N>` and `log(<slug>): no-cut` are constructed — never a `topics/` write or a frontmatter edit of the CLI's own.

## Design

Implements the "workbench/cli.mjs — command contract" section of `technical-design/03-api-design.md` in full — the seven-command table, the per-command Request/Response/Exit-codes for `status`, `create`, `convene`, `gate`, `cut`, `log`, and `discard`, and the binding rules (only `cut` renders the halt template; only `cut` and `log` construct git commits) — calling Slice 1.3's `createTopic`/`stageCut`/`convene`/`executeCut`/`recordNoCut`/`discardSession`/`reconcile` and Slice 1.2's `runPublishGate` as its sole core dependencies, per the session-file-ownership split `technical-design/04-data-design.md`'s `.staycurrent/sessions/<slug>.md` entry fixes (core never reads or writes that path).

## Proof of work

**Proves:** An operator at a real shell can drive the CLI's full command surface and see exactly the output strings and exit codes the command contract specifies, with the session-file lifecycle observable on disk as it happens.

**How we prove it:** In a real shell against a real repository, run `create <slug> --title <t>` and observe the exact `Created staged topic…` line, with a session file appearing at `.staycurrent/sessions/<slug>.md`; run `gate <slug>` against the deliberately incomplete skeleton and observe `FAIL <check-id>: <message>` lines naming the missing artifacts; run `discard <slug>` and observe the exact `Discarded session for…` line and exit `0`, with `.staycurrent/staged/<slug>/` and `.staycurrent/sessions/<slug>.md` both gone from disk — for a staged-only founding draft the slug never appears in `status` at all, since `listTopics` sweeps `topics/` only, so the filesystem state and the exit codes are the observation; run `discard <slug>` a second time and observe exit `2` (nothing to discard). Every command is the real `workbench/cli.mjs` process, not a stub of it.

**Test file:** `tests/bets/first-living-topic/test_slice_4_workbench_workbench_cli.py` — generated red at Delivery start; traces to the `workbench/cli.mjs` command contract in `technical-design/03-api-design.md`.
