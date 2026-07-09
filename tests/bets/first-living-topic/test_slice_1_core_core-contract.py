"""Bet-progress test — Slice 1: core-contract (service: core)
Bet: first-living-topic  |  Parent milestone: founding-cut

This test is RED by design. It proves the vertical capability this slice contributes
toward Milestone founding-cut. Tests are bounded by — not duplicates of — the parent
milestone tests.

Run './dev test bet first-living-topic' to see it fail; it will pass when this slice is merged.
"""

import json
import subprocess
from pathlib import Path

# tests/bets/first-living-topic/test_x.py -> parents[3] == repo root
REPO_ROOT = Path(__file__).resolve().parents[3]
CORE_INDEX_URI = (REPO_ROOT / "core" / "dist" / "index.js").as_uri()


def _run_node(script: str, timeout: int = 30) -> subprocess.CompletedProcess:
    """Run an ESM one-liner against the real @staycurrent/core build.

    No Python import of application code: the module is exercised exactly as
    site/workbench/CI would exercise it, in-process, from the outside.
    """
    return subprocess.run(
        ["node", "--input-type=module", "-e", script],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        timeout=timeout,
    )


def _write_topic_fixture(root: Path, dirname: str, *, topic_field: str) -> None:
    """Write a topics/<dirname>/article.md fixture shaped per 04-data-design.md."""
    topic_dir = root / "topics" / dirname
    topic_dir.mkdir(parents=True, exist_ok=True)
    frontmatter = (
        "---\n"
        f"topic: {topic_field}\n"
        "title: Fixture Topic\n"
        'stance: "A committed one-sentence position for testing purposes."\n'
        "version: 1\n"
        "status: current\n"
        "cadence: 90d\n"
        "last_researched: 2026-01-15\n"
        "---\n"
    )
    body = (
        "# Fixture Topic\n\n"
        "A committed one-sentence position for testing purposes.\n\n"
        "## Overview\n\n"
        "Body content used to exercise the loading API against a real fixture file.\n"
    )
    (topic_dir / "article.md").write_text(frontmatter + body)


# ---------------------------------------------------------------------------
# Slice capability proof (core service)
# ---------------------------------------------------------------------------
# Slice capability: @staycurrent/core's read side — listTopics/loadTopic turn a real
# topics/ tree on disk into typed shapes, and name the exact problem (rather than
# crash or silently drop the topic) when a fixture is malformed; renderMarkdown turns
# a real markdown body into { html, toc } and rewrites a mermaid fence for client
# render while keeping the fenced source readable. Traces to the "Loading API" section
# of technical-design/03-api-design.md (Slice 1.1's Proof of work).
#
# No fixtures, mocks, or stand-ins for the parser/renderer: every call below runs the
# real core/dist/index.js build (once it exists) against real files this test writes.


def test_list_topics_round_trips_frontmatter_and_reports_malformed_topics(tmp_path):
    root = tmp_path / "instance"
    valid_slug = "fixture-topic"
    broken_slug = "broken-topic"
    _write_topic_fixture(root, valid_slug, topic_field=valid_slug)
    # frontmatter.topic deliberately does not match its directory name — the exact
    # violation 03-api-design.md's listTopics Errors section names as sweep-reported.
    _write_topic_fixture(root, broken_slug, topic_field="not-broken-topic")

    template = (
        'import { listTopics, loadTopic } from "__CORE_URI__";\n'
        "const root = __ROOT_JSON__;\n"
        "const sweep = listTopics(root);\n"
        "let loadThrew = null;\n"
        "try {\n"
        "  loadTopic(root, __BROKEN_SLUG_JSON__);\n"
        "} catch (e) {\n"
        "  loadThrew = { name: e && e.constructor ? e.constructor.name : null, message: e && e.message };\n"
        "}\n"
        "process.stdout.write(JSON.stringify({ sweep, loadThrew }));\n"
    )
    script = (
        template.replace("__CORE_URI__", CORE_INDEX_URI)
        .replace("__ROOT_JSON__", json.dumps(str(root)))
        .replace("__BROKEN_SLUG_JSON__", json.dumps(broken_slug))
    )

    result = _run_node(script)
    assert result.returncode == 0, (
        "expected `listTopics`/`loadTopic` to run cleanly against core/dist/index.js; "
        f"got exit {result.returncode}.\nstderr:\n{result.stderr}"
    )
    data = json.loads(result.stdout)
    sweep = data["sweep"]

    topics_by_slug = {t["topic"]: t for t in sweep["topics"]}
    assert valid_slug in topics_by_slug, f"{valid_slug} missing from TopicSweep.topics: {sweep}"
    fm = topics_by_slug[valid_slug]
    assert fm["title"] == "Fixture Topic"
    assert fm["stance"] == "A committed one-sentence position for testing purposes."
    assert fm["version"] == 1
    assert fm["status"] == "current"
    assert fm["cadence"] == "90d"
    assert fm["last_researched"] == "2026-01-15"

    error_slugs = {e["slug"] for e in sweep["errors"]}
    assert broken_slug in error_slugs, (
        f"expected {broken_slug} (topic field mismatched its directory name) to appear "
        f"in TopicSweep.errors, not to be silently dropped or to throw: {sweep['errors']}"
    )

    assert data["loadThrew"] is not None, "loadTopic(root, broken_slug) should throw, not return"
    assert data["loadThrew"]["name"] == "ContentValidationError"


def test_render_markdown_returns_html_and_toc_with_mermaid_fence_transformed(tmp_path):
    md = (
        "# Fixture Doc\n\n"
        "## Overview\n\n"
        "Some prose the parser must render.\n\n"
        "```mermaid\n"
        "graph TD; A-->B;\n"
        "```\n"
    )
    template = (
        'import { renderMarkdown } from "__CORE_URI__";\n'
        "const rendered = renderMarkdown(__MD_JSON__);\n"
        "process.stdout.write(JSON.stringify(rendered));\n"
    )
    script = template.replace("__CORE_URI__", CORE_INDEX_URI).replace(
        "__MD_JSON__", json.dumps(md)
    )

    result = _run_node(script)
    assert result.returncode == 0, (
        "expected `renderMarkdown` to run cleanly against core/dist/index.js; "
        f"got exit {result.returncode}.\nstderr:\n{result.stderr}"
    )
    data = json.loads(result.stdout)

    toc_texts = [entry["text"] for entry in data["toc"]]
    assert "Overview" in toc_texts, f"expected an 'Overview' heading in toc: {data['toc']}"

    html = data["html"]
    assert "```" not in html, "raw markdown fence syntax should not leak into rendered html"
    assert "mermaid" in html.lower(), (
        "the ```mermaid fence should be rewritten into the client-rendered diagram marker"
    )
    assert "A-->B" in html or "A--&gt;B" in html, (
        "the fenced mermaid source should stay readable in the output for no-JS readers"
    )
