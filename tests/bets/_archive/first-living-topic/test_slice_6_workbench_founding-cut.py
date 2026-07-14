"""Bet-progress test — Slice 6: founding-cut (service: workbench)
Bet: first-living-topic  |  Parent milestone: founding-cut

This test is RED by design. It proves the vertical capability this slice contributes
toward Milestone founding-cut. Tests are bounded by — not duplicates of — the parent
milestone tests.

Run './dev test bet first-living-topic' to see it fail; it will pass when this slice is merged.
"""

import re
import subprocess
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parents[3]
SLUG = "databases"


def _run_cli(args: list, timeout: int = 30) -> subprocess.CompletedProcess:
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
# Slice capability proof (workbench service)
# ---------------------------------------------------------------------------
# Slice capability: the companion skill is authored to the article's stance, and the
# full five-artifact founding cut lands as exactly one `cut(databases): v1` commit,
# visible afterward in `status`. Traces to runPublishGate/executeCut and the
# workbench/cli.mjs gate/cut/status commands in technical-design/03-api-design.md,
# and the five-artifact atomic-cut invariant in technical-design/04-data-design.md
# (Slice 1.6's Proof of work — the milestone's headline proof run through this slice).


def test_v1_snapshot_trio_and_skill_binding_exist():
    topic_dir = REPO_ROOT / "topics" / SLUG
    v1_dir = topic_dir / "versions" / "v1"
    required = [v1_dir / "article.md", v1_dir / "skill" / "SKILL.md", v1_dir / "provenance.md"]
    missing = [str(p.relative_to(REPO_ROOT)) for p in required if not p.exists()]
    assert not missing, f"missing founding snapshot artifact(s): {missing}"

    live_skill_md = topic_dir / "skill" / "SKILL.md"
    assert live_skill_md.exists(), f"missing {live_skill_md.relative_to(REPO_ROOT)}"
    m = re.match(r"^---\n(.*?)\n---\n", live_skill_md.read_text(), re.DOTALL)
    assert m, "skill/SKILL.md must open with YAML frontmatter"
    frontmatter = yaml.safe_load(m.group(1)) or {}
    assert frontmatter.get("article_version") == 1
    description = frontmatter.get("description", "")
    assert isinstance(description, str) and len(description.strip()) > 20, (
        "description should be written as routing triggers (skill-creator convention), not left blank"
    )


def test_live_skill_is_byte_identical_to_the_v1_snapshot():
    topic_dir = REPO_ROOT / "topics" / SLUG
    live_skill_dir = topic_dir / "skill"
    snapshot_skill_dir = topic_dir / "versions" / "v1" / "skill"
    assert live_skill_dir.is_dir(), f"missing {live_skill_dir.relative_to(REPO_ROOT)}"
    assert snapshot_skill_dir.is_dir(), f"missing {snapshot_skill_dir.relative_to(REPO_ROOT)}"

    live_files = sorted(p.relative_to(live_skill_dir) for p in live_skill_dir.rglob("*") if p.is_file())
    snapshot_files = sorted(
        p.relative_to(snapshot_skill_dir) for p in snapshot_skill_dir.rglob("*") if p.is_file()
    )
    assert live_files == snapshot_files, (
        f"live skill/ and versions/v1/skill/ must hold the same file set: {live_files} vs {snapshot_files}"
    )
    for rel in live_files:
        assert (live_skill_dir / rel).read_bytes() == (snapshot_skill_dir / rel).read_bytes(), (
            f"skill/{rel} differs from versions/v1/skill/{rel}"
        )


def test_exactly_one_founding_cut_commit_landed():
    commits = _git_log_grep(f"cut({SLUG}): v1")
    assert len(commits) == 1, f"expected exactly one 'cut({SLUG}): v1' commit, found {len(commits)}: {commits}"


def test_status_reports_databases_at_v1_current():
    result = _run_cli(["status"])
    assert result.returncode == 0, (
        "expected `status` to exit 0 once the founding cut has landed; "
        f"got exit {result.returncode}.\nstdout:\n{result.stdout}\nstderr:\n{result.stderr}"
    )
    row = next((line for line in result.stdout.splitlines() if line.strip().startswith(SLUG)), None)
    assert row is not None, f"expected a '{SLUG}' row in `status` output:\n{result.stdout}"
    assert "v1" in row
    assert "current" in row
