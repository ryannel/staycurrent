"""Bet-progress test — Slice 15: loop-rehearsal (service: workbench)
Bet: first-living-topic  |  Parent milestone: loop-closes

This test is RED by design. It proves the vertical capability this slice contributes
toward Milestone loop-closes. Tests are bounded by — not duplicates of — the parent
milestone tests.

Run './dev test bet first-living-topic' to see it fail; it will pass when this slice is merged.
"""

import subprocess
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[3]
SLUG = "databases"


# ---------------------------------------------------------------------------
# Slice capability proof (workbench service)
# ---------------------------------------------------------------------------
# Slice 4.2 proves the loop's machinery closes end to end before the operator's
# live run (02-loop-rehearsal.md): against a git-initialized fixture copy of the
# real topics/databases/ tree (the repo's own workbench/cli.mjs subprocessed
# with cwd at the fixture root — the CLI resolves its root as process.cwd()),
# the cut path yields exactly one `cut(databases): v2` commit whose tree passes
# the ten-check gate and whose site build (STAYCURRENT_REPO_ROOT) renders v2's
# changelog entry standing alone with v1 archived; the no-cut path yields one
# `log(databases): no-cut` commit, a dated research-log entry, and no new
# version; the discard path yields zero commits and zero trace. Every changed
# path in each fixture diff belongs to the machinery's contract — the
# mechanical form of "zero hand-edits". The repository's own topics/ is never
# touched.
#
# The slice-worker replaces these red placeholders with the real three-path
# rehearsal harness (fixture builder + CLI subprocess driver) when the slice
# is delivered — each placeholder names the falsifiable outcome it must
# assert, traced to the slice's Required Capabilities.


def test_cut_path_lands_one_machinery_commit_and_the_site_renders_v2():
    pytest.fail(
        "loop-rehearsal not yet implemented — drive convene -> staged v2 authoring "
        "-> ten-check gate PASS -> `cut(databases): v2` as exactly one commit on the "
        "fixture repo (frontmatter back to current at version 2, versions/v2/ "
        "complete, git status clean), then build the site from the fixture root and "
        "assert v2's changelog entry stands alone with /databases/v/1/ archived"
    )


def test_no_cut_path_logs_the_run_without_cutting():
    pytest.fail(
        "loop-rehearsal not yet implemented — drive convene -> `log databases --line "
        "...` on the fixture repo and assert exactly one `log(databases): no-cut` "
        "commit, a `## <date> — no-cut` research-log entry, last_researched updated, "
        "and no version increment or changelog entry"
    )


def test_discard_path_leaves_zero_trace():
    pytest.fail(
        "loop-rehearsal not yet implemented — drive convene -> `discard databases` "
        "on the fixture repo and assert zero commits beyond the baseline, no session "
        "file, frontmatter reverted to current, git status clean, and research-log.md "
        "unchanged"
    )


def test_every_fixture_mutation_belongs_to_the_machinery():
    pytest.fail(
        "loop-rehearsal not yet implemented — diff each fixture run against its "
        "baseline and assert every changed path is one the session, gate, and cut "
        "mechanics own (topics/databases/**, .staycurrent/**) — the mechanical form "
        "of the zero-hand-edits invariant"
    )


def _unused_reference():  # keeps subprocess/REPO_ROOT/SLUG referenced until the harness lands
    return subprocess, REPO_ROOT, SLUG
