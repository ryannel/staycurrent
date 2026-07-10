"""Bet-progress test — Slice 10: render-hardening (service: core)
Bet: first-living-topic  |  Parent milestone: published-trust

This test is RED by design. It proves the vertical capability this slice contributes
toward Milestone published-trust. Tests are bounded by — not duplicates of — the parent
milestone tests.

Run './dev test bet first-living-topic' to see it fail; it will pass when this slice is merged.
"""

import json
import subprocess
import tempfile
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
CORE_INDEX_URI = (REPO_ROOT / "core" / "dist" / "index.js").as_uri()


def _run_node(script: str, timeout: int = 30) -> subprocess.CompletedProcess:
    """Run an ESM one-liner against the real @staycurrent/core build — the module
    exercised exactly as site/CI exercise it, never a Python re-implementation."""
    return subprocess.run(
        ["node", "--input-type=module", "-e", script],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        timeout=timeout,
    )


# ---------------------------------------------------------------------------
# Slice capability proof (core service)
# ---------------------------------------------------------------------------
# Slice 3.1 proves the two hardening seams close in core, where every surface
# inherits them (01-render-hardening.md): renderMarkdown emits no href/src whose
# protocol is outside {http, https, mailto} — relative paths and fragment anchors
# pass untouched, hostile schemes (javascript:, data:, vbscript:) are stripped
# with text preserved (maturity G7) — and validateTopicFrontmatter rejects empty/
# whitespace-only title and stance with a ContentValidationError naming the field
# (maturity G8), while the repository's own topics/databases/ passes unchanged.


def test_render_markdown_strips_hostile_protocols_and_keeps_safe_urls():
    script = f"""
import {{ renderMarkdown }} from {json.dumps(CORE_INDEX_URI)};
const body = [
  '[hostile](javascript:alert(1))',
  '',
  '![img](data:image/svg+xml,<svg/>)',
  '',
  '[ok](https://example.com/x)',
  '',
  '[rel](./sibling)',
  '',
  '[frag](#anchor)',
].join('\\n');
const doc = renderMarkdown(body);
console.log(JSON.stringify({{ html: doc.html }}));
"""
    result = _run_node(script)
    assert result.returncode == 0, f"renderMarkdown failed: {result.stderr}"
    html = json.loads(result.stdout.strip().splitlines()[-1])["html"]

    assert "javascript:" not in html, (
        "expected the javascript: href stripped from RenderedDoc.html (G7 — the "
        "protocol allowlist {http, https, mailto})"
    )
    assert "data:image" not in html, "expected the data: image src stripped (G7)"
    assert "hostile" in html, "expected the hostile link's text content preserved"
    assert 'href="https://example.com/x"' in html, "expected the https link untouched"
    assert 'href="./sibling"' in html, "expected the relative link untouched"
    assert 'href="#anchor"' in html, "expected the fragment anchor untouched"


def test_blank_stance_fails_validation_naming_the_field():
    with tempfile.TemporaryDirectory(prefix="staycurrent-slice10-") as tmp:
        topic_dir = Path(tmp) / "topics" / "blank-stance"
        topic_dir.mkdir(parents=True)
        (topic_dir / "article.md").write_text(
            "---\n"
            "topic: blank-stance\n"
            "title: Blank Stance Fixture\n"
            'stance: "   "\n'
            "version: 1\n"
            "status: current\n"
            "cadence: 90d\n"
            "last_researched: 2026-01-15\n"
            "---\n\n"
            "# Blank Stance Fixture\n\nBody.\n"
        )
        script = f"""
import {{ loadTopic, listTopics, ContentValidationError }} from {json.dumps(CORE_INDEX_URI)};
const root = {json.dumps(tmp)};
let threw = null;
try {{ loadTopic(root, 'blank-stance'); }} catch (err) {{
  threw = {{ isValidation: err instanceof ContentValidationError, message: String(err.message) }};
}}
const sweep = listTopics(root);
console.log(JSON.stringify({{ threw, sweepErrors: sweep.errors.map(e => e.message) }}));
"""
        result = _run_node(script)
        assert result.returncode == 0, f"node run failed: {result.stderr}"
        out = json.loads(result.stdout.strip().splitlines()[-1])

        assert out["threw"] is not None, (
            "expected loadTopic to throw for a whitespace-only stance (G8 — blank "
            "title/stance must fail validation)"
        )
        assert out["threw"]["isValidation"], "expected a ContentValidationError, not a generic throw"
        assert "stance" in out["threw"]["message"], "expected the error to name the 'stance' field"
        assert any("stance" in m for m in out["sweepErrors"]), (
            "expected the listTopics sweep to report the blank-stance topic as a TopicError"
        )


def test_repository_content_passes_the_tightened_validation():
    script = f"""
import {{ listTopics }} from {json.dumps(CORE_INDEX_URI)};
const sweep = listTopics({json.dumps(str(REPO_ROOT))});
console.log(JSON.stringify({{ topics: sweep.topics.map(t => t.topic), errors: sweep.errors }}));
"""
    result = _run_node(script)
    assert result.returncode == 0, f"node run failed: {result.stderr}"
    out = json.loads(result.stdout.strip().splitlines()[-1])
    assert "databases" in out["topics"], "expected the real databases topic to keep validating"
    assert out["errors"] == [], f"hardening must not break shipped content: {out['errors']}"
