"""Bet-progress test — Slice 3: cut-mechanics (service: core)
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


def _run_node(script: str, timeout: int = 30) -> subprocess.CompletedProcess:
    return subprocess.run(
        ["node", "--input-type=module", "-e", script],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        timeout=timeout,
    )


def _git_init(root: Path) -> None:
    root.mkdir(parents=True, exist_ok=True)
    subprocess.run(["git", "init", "-q"], cwd=root, check=True)
    subprocess.run(["git", "config", "user.email", "bet-progress@example.com"], cwd=root, check=True)
    subprocess.run(["git", "config", "user.name", "Bet Progress Test"], cwd=root, check=True)


def _iso_days_ago(days: int) -> str:
    return (datetime.date.today() - datetime.timedelta(days=days)).isoformat()


def _skill_md(slug: str) -> str:
    return (
        "---\n"
        f"name: {slug}\n"
        "description: >\n"
        "  Use when evaluating this fixture topic for cut-mechanics testing purposes.\n"
        "article_version: 1\n"
        "---\n\n"
        f"# {slug} Skill\n\nStance callout mirrored from the article.\n"
    )


def _write_complete_topic(root: Path, slug: str) -> None:
    """Seed an already-"committed" (on disk, not through core — core doesn't exist
    yet) gate-passing v1 topic at root/topics/<slug>/, per 04-data-design.md, so
    stageCut has something real to copy forward."""
    topic_dir = root / "topics" / slug
    topic_dir.mkdir(parents=True, exist_ok=True)
    cut_date = _iso_days_ago(30)
    last_researched = _iso_days_ago(10)
    skill_md = _skill_md(slug)

    (topic_dir / "article.md").write_text(
        "---\n"
        f"topic: {slug}\n"
        "title: Fixture Existing Topic\n"
        'stance: "A committed one-sentence position for cut-mechanics testing."\n'
        "version: 1\n"
        "status: current\n"
        "cadence: 90d\n"
        f"last_researched: {last_researched}\n"
        "---\n\n"
        "# Fixture Existing Topic\n\nStance restated here.\n\n## Overview\n\nBody content.\n"
    )
    (topic_dir / "changelog.md").write_text(
        f"# Fixture Existing Topic — Changelog\n\n## v1 — {cut_date}\n\n"
        "The founding note: initial stance and what this topic covers.\n"
    )
    (topic_dir / "research-log.md").write_text("# Fixture Existing Topic — Research Log\n\n")

    skill_dir = topic_dir / "skill"
    skill_dir.mkdir(parents=True, exist_ok=True)
    (skill_dir / "SKILL.md").write_text(skill_md)

    v1_dir = topic_dir / "versions" / "v1"
    v1_dir.mkdir(parents=True, exist_ok=True)
    (v1_dir / "article.md").write_text(
        f"---\nversion: 1\ncut: {cut_date}\n---\n\n# Fixture Existing Topic\n\nFrozen body.\n"
    )
    v1_skill_dir = v1_dir / "skill"
    v1_skill_dir.mkdir(parents=True, exist_ok=True)
    (v1_skill_dir / "SKILL.md").write_text(skill_md)
    (v1_dir / "provenance.md").write_text(
        "## Sources\n\n"
        f"- [Example Source](https://example.com/fixture) — accessed {cut_date} "
        "— supports: the fixture's claim\n\n"
        "## Synthesis\n\n- A synthesized claim stated plainly.\n"
    )


# ---------------------------------------------------------------------------
# Slice capability proof (core service)
# ---------------------------------------------------------------------------
# Slice capability: the staged-tree lifecycle — seed, gate-gated commit — moves a
# topic between .staycurrent/staged/ and topics/ only ever through a passing gate,
# and never partially. Traces to the Cut mechanics functions (createTopic, stageCut,
# executeCut) in technical-design/03-api-design.md (Slice 1.3's Proof of work).


def test_create_topic_seeds_a_gate_failing_founding_skeleton(tmp_path):
    root = tmp_path / "instance"
    _git_init(root)
    slug = "fixture-founding"

    template = (
        'import { createTopic, runPublishGate } from "__CORE_URI__";\n'
        "const staged = createTopic(__ROOT_JSON__, __SLUG_JSON__, { title: \"Fixture Founding\" });\n"
        "const gate = runPublishGate(staged.dir);\n"
        "process.stdout.write(JSON.stringify({ staged, gate }));\n"
    )
    script = (
        template.replace("__CORE_URI__", CORE_INDEX_URI)
        .replace("__ROOT_JSON__", json.dumps(str(root)))
        .replace("__SLUG_JSON__", json.dumps(slug))
    )

    result = _run_node(script)
    assert result.returncode == 0, (
        "expected `createTopic`/`runPublishGate` to run cleanly against core/dist/index.js; "
        f"got exit {result.returncode}.\nstderr:\n{result.stderr}"
    )
    data = json.loads(result.stdout)
    assert data["staged"]["topic"] == slug
    assert data["staged"]["version"] == 1
    assert data["gate"]["ok"] is False, "a freshly created skeleton must fail the gate until authored"
    checks = {f["check"] for f in data["gate"]["failures"]}
    assert "provenance-non-empty" in checks, (
        f"expected the seeded skeleton's empty provenance to fail the gate, got: {data['gate']['failures']}"
    )


def test_execute_cut_refuses_a_non_passing_gate_result(tmp_path):
    root = tmp_path / "instance"
    _git_init(root)
    slug = "fixture-refused"

    template = (
        'import { executeCut } from "__CORE_URI__";\n'
        'import { existsSync } from "node:fs";\n'
        'import { join } from "node:path";\n'
        "let threw = null;\n"
        "try {\n"
        "  executeCut(__ROOT_JSON__, __SLUG_JSON__, { ok: false, failures: [] });\n"
        "} catch (e) {\n"
        "  threw = { name: e && e.constructor ? e.constructor.name : null };\n"
        "}\n"
        "const topicsExists = existsSync(join(__ROOT_JSON__, 'topics', __SLUG_JSON__));\n"
        "process.stdout.write(JSON.stringify({ threw, topicsExists }));\n"
    )
    script = (
        template.replace("__CORE_URI__", CORE_INDEX_URI)
        .replace("__ROOT_JSON__", json.dumps(str(root)))
        .replace("__SLUG_JSON__", json.dumps(slug))
    )

    result = _run_node(script)
    assert result.returncode == 0, (
        "expected `executeCut` to run cleanly against core/dist/index.js; "
        f"got exit {result.returncode}.\nstderr:\n{result.stderr}"
    )
    data = json.loads(result.stdout)
    assert data["threw"] is not None, "executeCut(root, slug, { ok: false, ... }) must throw before touching topics/"
    assert data["threw"]["name"] == "GateNotPassedError"
    assert data["topicsExists"] is False, "nothing may be written under topics/ when the gate has not passed"


def test_stage_cut_copies_the_committed_tree_forward(tmp_path):
    root = tmp_path / "instance"
    _git_init(root)
    slug = "fixture-existing"
    _write_complete_topic(root, slug)

    template = (
        'import { stageCut } from "__CORE_URI__";\n'
        "const staged = stageCut(__ROOT_JSON__, __SLUG_JSON__);\n"
        "process.stdout.write(JSON.stringify({ staged }));\n"
    )
    script = (
        template.replace("__CORE_URI__", CORE_INDEX_URI)
        .replace("__ROOT_JSON__", json.dumps(str(root)))
        .replace("__SLUG_JSON__", json.dumps(slug))
    )

    result = _run_node(script)
    assert result.returncode == 0, (
        "expected `stageCut` to run cleanly against core/dist/index.js; "
        f"got exit {result.returncode}.\nstderr:\n{result.stderr}"
    )
    data = json.loads(result.stdout)
    assert data["staged"]["version"] == 2, "stageCut's version must be the live version (1) + 1"

    staged_dir = Path(data["staged"]["dir"])
    live_article = (root / "topics" / slug / "article.md").read_bytes()
    staged_article = (staged_dir / "article.md").read_bytes()
    assert staged_article == live_article, "stageCut must copy the committed tree forward byte-identically"


def test_execute_cut_lands_a_passing_staged_set_byte_identically(tmp_path):
    root = tmp_path / "instance"
    _git_init(root)
    slug = "fixture-cut"

    create_template = (
        'import { createTopic } from "__CORE_URI__";\n'
        "const staged = createTopic(__ROOT_JSON__, __SLUG_JSON__, { title: \"Fixture Cut\" });\n"
        "process.stdout.write(JSON.stringify(staged));\n"
    )
    create_script = (
        create_template.replace("__CORE_URI__", CORE_INDEX_URI)
        .replace("__ROOT_JSON__", json.dumps(str(root)))
        .replace("__SLUG_JSON__", json.dumps(slug))
    )
    create_result = _run_node(create_script)
    assert create_result.returncode == 0, (
        "expected `createTopic` to run cleanly against core/dist/index.js; "
        f"got exit {create_result.returncode}.\nstderr:\n{create_result.stderr}"
    )
    staged_dir = Path(json.loads(create_result.stdout)["dir"])

    # Author real content into the staged tree — what the writer skill does in
    # Slices 1.5/1.6, not core's job — so the seeded skeleton can pass the gate.
    skill_md = _skill_md(slug)
    (staged_dir / "skill" / "SKILL.md").write_text(skill_md)
    (staged_dir / "versions" / "v1" / "skill" / "SKILL.md").write_text(skill_md)  # byte-identical
    (staged_dir / "versions" / "v1" / "provenance.md").write_text(
        "## Sources\n\n"
        f"- [Example Source](https://example.com/fixture) — accessed {_iso_days_ago(5)} "
        "— supports: the fixture's claim\n\n"
        "## Synthesis\n\n- A synthesized claim stated plainly.\n"
    )

    cut_template = (
        'import { runPublishGate, executeCut } from "__CORE_URI__";\n'
        "const gate = runPublishGate(__STAGED_DIR_JSON__);\n"
        "let report = null;\n"
        "if (gate.ok) {\n"
        "  report = executeCut(__ROOT_JSON__, __SLUG_JSON__, gate);\n"
        "}\n"
        "process.stdout.write(JSON.stringify({ gate, report }));\n"
    )
    cut_script = (
        cut_template.replace("__CORE_URI__", CORE_INDEX_URI)
        .replace("__STAGED_DIR_JSON__", json.dumps(str(staged_dir)))
        .replace("__ROOT_JSON__", json.dumps(str(root)))
        .replace("__SLUG_JSON__", json.dumps(slug))
    )
    cut_result = _run_node(cut_script)
    assert cut_result.returncode == 0, (
        "expected `runPublishGate`/`executeCut` to run cleanly against core/dist/index.js; "
        f"got exit {cut_result.returncode}.\nstderr:\n{cut_result.stderr}"
    )
    data = json.loads(cut_result.stdout)
    assert data["gate"]["ok"] is True, (
        f"expected the authored staged tree to pass the gate: {data['gate']['failures']}"
    )
    report = data["report"]
    assert report is not None
    assert report["version"] == 1
    assert report["paths"], "CutReport.paths must name every artifact written"

    live_article = root / "topics" / slug / "article.md"
    assert live_article.exists(), "executeCut must land the staged article into topics/<slug>/"
    assert live_article.read_bytes() == (staged_dir / "article.md").read_bytes(), (
        "the staged set must land in topics/<slug>/ byte-identically"
    )
