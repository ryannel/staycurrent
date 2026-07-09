"""Bet-progress test — Slice 2: publish-gate (service: core)
Bet: first-living-topic  |  Parent milestone: founding-cut

This test is RED by design. It proves the vertical capability this slice contributes
toward Milestone founding-cut. Tests are bounded by — not duplicates of — the parent
milestone tests.

Run './dev test bet first-living-topic' to see it fail; it will pass when this slice is merged.
"""

import datetime
import json
import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
CORE_INDEX_URI = (REPO_ROOT / "core" / "dist" / "index.js").as_uri()

SKILL_MD = (
    "---\n"
    "name: fixture-topic\n"
    "description: >\n"
    "  Use when evaluating the fixture topic for publish-gate testing purposes.\n"
    "article_version: 1\n"
    "---\n\n"
    "# Fixture Topic Skill\n\n"
    "Stance callout mirrored from the article.\n"
)


def _run_node(script: str, timeout: int = 30) -> subprocess.CompletedProcess:
    return subprocess.run(
        ["node", "--input-type=module", "-e", script],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        timeout=timeout,
    )


def _gate_script(dir_path: Path) -> str:
    template = (
        'import { runPublishGate } from "__CORE_URI__";\n'
        "const result = runPublishGate(__DIR_JSON__);\n"
        "process.stdout.write(JSON.stringify(result));\n"
    )
    return template.replace("__CORE_URI__", CORE_INDEX_URI).replace(
        "__DIR_JSON__", json.dumps(str(dir_path))
    )


def _iso_days_ago(days: int) -> str:
    return (datetime.date.today() - datetime.timedelta(days=days)).isoformat()


def _write_gate_fixture(
    topic_dir: Path,
    slug: str,
    *,
    omit_provenance: bool = False,
    changelog_heading: str = "## v1 — {date}",
    empty_provenance: bool = False,
) -> None:
    """Write a topic-shaped directory (basename == slug) at implementation fidelity
    against 04-data-design.md, complete and gate-passing unless a keyword deliberately
    breaks exactly one check."""
    cut_date = _iso_days_ago(30)
    last_researched = _iso_days_ago(10)

    topic_dir.mkdir(parents=True, exist_ok=True)
    article = (
        "---\n"
        f"topic: {slug}\n"
        "title: Fixture Topic\n"
        'stance: "A committed one-sentence position for gate testing."\n'
        "version: 1\n"
        "status: current\n"
        "cadence: 90d\n"
        f"last_researched: {last_researched}\n"
        "---\n\n"
        "# Fixture Topic\n\n"
        "A committed one-sentence position for gate testing.\n\n"
        "## Overview\n\nBody content.\n"
    )
    (topic_dir / "article.md").write_text(article)

    heading = changelog_heading.format(date=cut_date)
    changelog = (
        "# Fixture Topic — Changelog\n\n"
        f"{heading}\n\n"
        "The founding note: initial stance and what this topic covers.\n"
    )
    (topic_dir / "changelog.md").write_text(changelog)

    skill_dir = topic_dir / "skill"
    skill_dir.mkdir(parents=True, exist_ok=True)
    (skill_dir / "SKILL.md").write_text(SKILL_MD)

    versions_dir = topic_dir / "versions" / "v1"
    versions_dir.mkdir(parents=True, exist_ok=True)
    (versions_dir / "article.md").write_text(
        f"---\nversion: 1\ncut: {cut_date}\n---\n\n# Fixture Topic\n\nFrozen body.\n"
    )
    v1_skill_dir = versions_dir / "skill"
    v1_skill_dir.mkdir(parents=True, exist_ok=True)
    (v1_skill_dir / "SKILL.md").write_text(SKILL_MD)  # byte-identical to live skill/

    if not omit_provenance:
        if empty_provenance:
            provenance = "## Sources\n\n## Synthesis\n\n"
        else:
            provenance = (
                "## Sources\n\n"
                f"- [Example Source](https://example.com/fixture) — accessed {cut_date} "
                "— supports: the fixture's claim\n\n"
                "## Synthesis\n\n"
                "- A synthesized claim stated plainly.\n"
            )
        (versions_dir / "provenance.md").write_text(provenance)


# ---------------------------------------------------------------------------
# Slice capability proof (core service)
# ---------------------------------------------------------------------------
# Slice capability: runPublishGate tells the truth about whether a topic-shaped
# directory is internally consistent across the nine checks, naming the exact
# offending artifact when it is not, and reports ok:true with empty failures for a
# complete fixture. Traces to `runPublishGate` and the Publish gate table in
# technical-design/03-api-design.md (Slice 1.2's Proof of work). Each fixture below is
# a real directory this test writes and the gate actually reads — no mocked result.


def test_gate_fails_snapshot_complete_on_a_missing_artifact(tmp_path):
    topic_dir = tmp_path / "fixture-topic"
    _write_gate_fixture(topic_dir, "fixture-topic", omit_provenance=True)

    result = _run_node(_gate_script(topic_dir))
    assert result.returncode == 0, (
        "expected `runPublishGate` to run cleanly against core/dist/index.js; "
        f"got exit {result.returncode}.\nstderr:\n{result.stderr}"
    )
    gate = json.loads(result.stdout)
    assert gate["ok"] is False
    match = next((f for f in gate["failures"] if f["check"] == "snapshot-complete"), None)
    assert match is not None, f"expected a snapshot-complete failure, got: {gate['failures']}"
    assert match["message"] == "missing required artifact: versions/v1/provenance.md"


def test_gate_fails_changelog_top_entry_on_a_version_mismatch(tmp_path):
    topic_dir = tmp_path / "fixture-topic"
    _write_gate_fixture(topic_dir, "fixture-topic", changelog_heading="## v2 — {date}")

    result = _run_node(_gate_script(topic_dir))
    assert result.returncode == 0, (
        "expected `runPublishGate` to run cleanly against core/dist/index.js; "
        f"got exit {result.returncode}.\nstderr:\n{result.stderr}"
    )
    gate = json.loads(result.stdout)
    assert gate["ok"] is False
    match = next((f for f in gate["failures"] if f["check"] == "changelog-top-entry"), None)
    assert match is not None, f"expected a changelog-top-entry failure, got: {gate['failures']}"
    assert match["message"] == "changelog.md top entry is '## v2', expected '## v1'"


def test_gate_fails_provenance_non_empty_on_an_empty_provenance_file(tmp_path):
    topic_dir = tmp_path / "fixture-topic"
    _write_gate_fixture(topic_dir, "fixture-topic", empty_provenance=True)

    result = _run_node(_gate_script(topic_dir))
    assert result.returncode == 0, (
        "expected `runPublishGate` to run cleanly against core/dist/index.js; "
        f"got exit {result.returncode}.\nstderr:\n{result.stderr}"
    )
    gate = json.loads(result.stdout)
    assert gate["ok"] is False
    match = next((f for f in gate["failures"] if f["check"] == "provenance-non-empty"), None)
    assert match is not None, f"expected a provenance-non-empty failure, got: {gate['failures']}"
    assert match["message"] == "versions/v1/provenance.md has no entries in Sources or Synthesis"


def test_gate_passes_on_a_complete_internally_consistent_fixture(tmp_path):
    topic_dir = tmp_path / "fixture-topic"
    _write_gate_fixture(topic_dir, "fixture-topic")

    result = _run_node(_gate_script(topic_dir))
    assert result.returncode == 0, (
        "expected `runPublishGate` to run cleanly against core/dist/index.js; "
        f"got exit {result.returncode}.\nstderr:\n{result.stderr}"
    )
    gate = json.loads(result.stdout)
    assert gate["ok"] is True, f"expected a complete fixture to pass the gate: {gate['failures']}"
    assert gate["failures"] == []
