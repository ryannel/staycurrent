"""Bet-progress test — Slice 10: render-hardening (service: core)
Bet: first-living-topic  |  Parent milestone: published-trust

This test is RED by design. It proves the vertical capability this slice contributes
toward Milestone published-trust. Tests are bounded by — not duplicates of — the parent
milestone tests.

Run './dev test bet first-living-topic' to see it fail; it will pass when this slice is merged.
"""

import json
import os
import shutil
import subprocess
import tempfile
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
CORE_INDEX_URI = (REPO_ROOT / "core" / "dist" / "index.js").as_uri()
SITE_DIR = REPO_ROOT / "services" / "site"
OUT_DIR = SITE_DIR / "out"
PUBLIC_DIR = SITE_DIR / "public"
RSS_PATH = PUBLIC_DIR / "rss.xml"
SKILLS_DIR = PUBLIC_DIR / "skills"


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


def test_site_build_strips_a_hostile_link_from_the_exported_article_html():
    """The slice's site-build half: renderMarkdown's protocol allowlist (G7) must
    hold through the REAL site pipeline, not just core's unit tests. A fixture
    copy of the gate-cut topics/databases/ tree gets a hostile javascript: link
    injected into the article body; `pnpm build` runs against it via
    STAYCURRENT_REPO_ROOT (services/site/lib/content.ts's override — same
    mechanism slice 7's fail-closed test uses) and must still succeed (the
    sanitizer strips the href; it does not fail the build), with the exported
    HTML carrying no `javascript:`. The repository's own topics/ is never
    touched — only a tmp_path copy is modified.

    A successful build against the fixture root DOES rewrite services/site/out/
    (unlike slice 7's failing-build case, which never reaches the write) — so
    out/ is snapshotted aside first and restored in a `finally`, keeping the
    sibling tests' (slice 7's) already-built artifact intact regardless of
    this test's outcome.
    """
    with tempfile.TemporaryDirectory(prefix="staycurrent-slice10-build-") as tmp:
        tmp_path = Path(tmp)
        fixture_root = tmp_path / "fixture-root"
        fixture_topic_dir = fixture_root / "topics" / "databases"
        shutil.copytree(REPO_ROOT / "topics" / "databases", fixture_topic_dir)
        # Fail-closed since RC1 (services/site/lib/content.ts's getSiteConfig
        # no longer degrades a missing file to a hardcoded default) — every
        # STAYCURRENT_REPO_ROOT-pointed build must now stage its own
        # site.config.json. The real one is copied verbatim; this test's own
        # proof is about the sanitizer, not about config content.
        shutil.copy2(REPO_ROOT / "site.config.json", fixture_root / "site.config.json")

        article = fixture_topic_dir / "article.md"
        original = article.read_text()
        article.write_text(original + "\n[hostile](javascript:alert(1))\n")

        out_existed_before = OUT_DIR.exists()
        out_backup = tmp_path / "out-backup"
        if out_existed_before:
            shutil.copytree(OUT_DIR, out_backup)

        # The prebuild script rmSync's and rewrites the REAL
        # services/site/public/rss.xml + public/skills/ on every `pnpm
        # build` this fixture now successfully completes (same pollution
        # test_topic_versions_fixture.py's harness backs up) — restore them
        # alongside out/ in the `finally` below.
        rss_existed_before = RSS_PATH.exists()
        rss_backup = tmp_path / "rss-backup.xml"
        if rss_existed_before:
            shutil.copy2(RSS_PATH, rss_backup)

        skills_existed_before = SKILLS_DIR.exists()
        skills_backup = tmp_path / "skills-backup"
        if skills_existed_before:
            shutil.copytree(SKILLS_DIR, skills_backup)

        try:
            env = {**os.environ, "STAYCURRENT_REPO_ROOT": str(fixture_root)}
            result = subprocess.run(
                ["pnpm", "build"],
                cwd=SITE_DIR,
                env=env,
                capture_output=True,
                text=True,
                timeout=180,
            )
            combined = result.stdout + result.stderr
            assert result.returncode == 0, (
                "expected `pnpm build` to succeed against a fixture root carrying a "
                "hostile javascript: link in the article body — the sanitizer strips "
                f"the href, it must not fail the build.\n{combined}"
            )

            article_html = OUT_DIR / "databases" / "index.html"
            assert article_html.exists(), (
                f"{article_html.relative_to(REPO_ROOT)} does not exist after the fixture build"
            )
            html = article_html.read_text()
            assert "javascript:" not in html, (
                "expected the injected javascript: href stripped from the exported "
                "article HTML — the hardening must survive the full site build, not "
                "just core's unit tests"
            )
        finally:
            if out_existed_before:
                shutil.rmtree(OUT_DIR, ignore_errors=True)
                shutil.copytree(out_backup, OUT_DIR)

            if rss_existed_before:
                shutil.copy2(rss_backup, RSS_PATH)
            else:
                RSS_PATH.unlink(missing_ok=True)

            if skills_existed_before:
                shutil.rmtree(SKILLS_DIR, ignore_errors=True)
                shutil.copytree(skills_backup, SKILLS_DIR)
            else:
                shutil.rmtree(SKILLS_DIR, ignore_errors=True)

        # The repository's own content tree is never touched by this proof.
        real_article = (REPO_ROOT / "topics" / "databases" / "article.md").read_text()
        assert "javascript:" not in real_article, (
            "the repository's own topics/databases/article.md was modified by this test"
        )
