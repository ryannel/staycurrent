"""Bet-progress test — Milestone 4: loop-closes
Bet: first-living-topic

This test is RED by design. It defines the target state for Milestone 4.
Run './dev test bet first-living-topic' to see it fail; it will pass when Delivery is complete.
"""

import re
import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
SLUG = "databases"


def _git_log_grep(pattern: str) -> list:
    result = subprocess.run(
        ["git", "log", "--oneline", "--fixed-strings", f"--grep={pattern}"],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
    )
    return [line for line in result.stdout.splitlines() if line.strip()]


# ---------------------------------------------------------------------------
# Front door (the operator, via workbench/cli.mjs, and the returning reader via the
# changelog)
# ---------------------------------------------------------------------------
# Front door: a real research run against the live v1 databases topic resolves — cut
# to v2, or an honest no-cut — through the same gate and cut mechanics Milestone 1
# proved, with zero hand-edits outside the workbench machinery; plus the loop's
# supporting artifacts (STAYCURRENT.md, the research/writer workbench skills) exist.
# Traces to decomposition/04-loop-closes/index.md's Proof of work.


def test_research_run_resolves_to_a_v2_cut_or_an_honest_no_cut():
    topic_dir = REPO_ROOT / "topics" / SLUG
    changelog_path = topic_dir / "changelog.md"
    research_log_path = topic_dir / "research-log.md"
    v2_dir = topic_dir / "versions" / "v2"

    cut_v2_commits = _git_log_grep(f"cut({SLUG}): v2")
    has_v2_changelog = changelog_path.exists() and bool(
        re.search(r"(?m)^## v2 — \d{4}-\d{2}-\d{2}", changelog_path.read_text())
    )
    cut_resolution = has_v2_changelog and v2_dir.is_dir() and len(cut_v2_commits) == 1

    no_cut_commits = _git_log_grep(f"log({SLUG}): no-cut")
    has_no_cut_entry = research_log_path.exists() and bool(
        re.search(r"(?m)^## \d{4}-\d{2}-\d{2} — no-cut", research_log_path.read_text())
    )
    no_cut_resolution = has_no_cut_entry and len(no_cut_commits) == 1

    assert cut_resolution or no_cut_resolution, (
        "expected either a v2 cut (changelog '## v2' entry + versions/v2/ + exactly one "
        f"'cut({SLUG}): v2' commit) or an honest no-cut (research-log 'no-cut' entry + "
        f"exactly one 'log({SLUG}): no-cut' commit); found cut commits={cut_v2_commits}, "
        f"no-cut commits={no_cut_commits}"
    )


def test_staycurrent_doc_and_workbench_skills_exist():
    staycurrent_path = REPO_ROOT / "STAYCURRENT.md"
    assert staycurrent_path.exists(), "STAYCURRENT.md is missing at the repo root"
    line_count = len(staycurrent_path.read_text().splitlines())
    assert line_count <= 150, f"STAYCURRENT.md has {line_count} lines, expected <= 150"

    skills_dir = REPO_ROOT / ".agents" / "skills"
    names = {p.name for p in skills_dir.iterdir()} if skills_dir.exists() else set()
    assert any("research" in name for name in names), (
        f"expected a research workbench skill under {skills_dir.relative_to(REPO_ROOT)}"
    )
    assert any("writ" in name for name in names), (
        f"expected a writer workbench skill under {skills_dir.relative_to(REPO_ROOT)}"
    )
