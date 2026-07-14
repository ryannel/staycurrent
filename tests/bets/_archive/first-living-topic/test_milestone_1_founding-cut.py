"""Bet-progress test — Milestone 1: founding-cut
Bet: first-living-topic

This test is RED by design. It defines the target state for Milestone 1.
Run './dev test bet first-living-topic' to see it fail; it will pass when Delivery is complete.
"""

import re
import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
SLUG = "databases"


def _run_cli(args: list, timeout: int = 30) -> subprocess.CompletedProcess:
    """The milestone's consumer is the operator at workbench/cli.mjs (index.md's
    Consumer line) — drive the real front door, no stub."""
    return subprocess.run(
        ["node", "workbench/cli.mjs", *args],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        timeout=timeout,
    )


def _git_log_grep(pattern: str) -> list:
    result = subprocess.run(
        ["git", "log", "--oneline", "--fixed-strings", f"--grep={pattern}"],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
    )
    return [line for line in result.stdout.splitlines() if line.strip()]


# ---------------------------------------------------------------------------
# Front door (the operator, via workbench/cli.mjs)
# ---------------------------------------------------------------------------
# Front door: the operator takes topics/databases/ from nothing to a gate-passing v1
# — article, skill, founding changelog entry, and provenance landed together — by
# exactly one `cut(databases): v1` commit, and sees that state confirmed by `status`.
# Traces to decomposition/01-founding-cut/index.md's Proof of work — the milestone's
# headline proof, driven against the real repository with no stubbed gate result.


def test_founding_cut_lands_the_five_artifact_v1_set():
    topic_dir = REPO_ROOT / "topics" / SLUG
    required = [
        topic_dir / "article.md",
        topic_dir / "changelog.md",
        topic_dir / "versions" / "v1" / "article.md",
        topic_dir / "versions" / "v1" / "skill" / "SKILL.md",
        topic_dir / "versions" / "v1" / "provenance.md",
    ]
    missing = [str(p.relative_to(REPO_ROOT)) for p in required if not p.exists()]
    assert not missing, f"founding cut artifact(s) missing: {missing}"

    changelog_text = (topic_dir / "changelog.md").read_text()
    assert re.search(r"(?m)^## v1 — \d{4}-\d{2}-\d{2}", changelog_text), (
        "changelog.md must carry the '## v1' founding entry atop the timeline"
    )

    commits = _git_log_grep(f"cut({SLUG}): v1")
    assert len(commits) == 1, f"expected exactly one 'cut({SLUG}): v1' commit, found {len(commits)}: {commits}"


def test_status_shows_the_v1_current_row_and_a_recut_is_idempotent():
    status = _run_cli(["status"])
    assert status.returncode == 0, (
        f"expected `status` to exit 0; got {status.returncode}.\n"
        f"stdout:\n{status.stdout}\nstderr:\n{status.stderr}"
    )
    row = next((line for line in status.stdout.splitlines() if line.strip().startswith(SLUG)), None)
    assert row is not None and "v1" in row and "current" in row, (
        f"expected a '{SLUG} ... v1 ... current' row in `status` output:\n{status.stdout}"
    )

    recut = _run_cli(["cut", SLUG])
    assert recut.returncode == 0, (
        f"expected a re-run of `cut {SLUG}` after v1 is complete to exit 0; "
        f"got {recut.returncode}.\nstdout:\n{recut.stdout}\nstderr:\n{recut.stderr}"
    )
    assert "Nothing to cut — v1 is complete." in recut.stdout
