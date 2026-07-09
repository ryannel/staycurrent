"""Bet-progress test — Slice 7: content-pipeline (service: site)
Bet: first-living-topic  |  Parent milestone: article-readable

This test is RED by design. It proves the vertical capability this slice contributes
toward Milestone article-readable. Tests are bounded by — not duplicates of — the parent
milestone tests.

Run './dev test bet first-living-topic' to see it fail; it will pass when this slice is merged.
"""

import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = REPO_ROOT / "services" / "site" / "out"
SLUG = "databases"


# ---------------------------------------------------------------------------
# Slice capability proof (site service)
# ---------------------------------------------------------------------------
# Slice 2.1 proves the site build turns the real, gate-cut topics/databases/ content
# into a static export: /databases/index.html carries the real v1 article body with
# working heading-anchor ids (renderMarkdown's RenderedDoc.toc, 03-api-design.md),
# >= 2 reserved-space mermaid marker containers carrying their fenced source
# untouched (the mermaid-fence transform, 02-data-flows.md's Site Build Data Flow),
# and the trust-header currency data (version + last_researched) — with no raw
# markdown leaking into visible text. The export also stays static-only (no api/
# route — `output: 'export'`). Narrower than the milestone test's front door (which
# only checks the article renders at all and mentions "mermaid"/"stance" loosely):
# this slice's proof is `pnpm build` against the real repository, so assertions read
# services/site/out/ directly — no server, no fixtures.


def _visible_text(html: str) -> str:
    """Strip <script>/<style> blocks and all tags — approximates what a reader (and
    the 'no raw markdown leaked' check below) actually sees."""
    html = re.sub(r"<script[\s\S]*?</script>", " ", html, flags=re.IGNORECASE)
    html = re.sub(r"<style[\s\S]*?</style>", " ", html, flags=re.IGNORECASE)
    return re.sub(r"<[^>]+>", " ", html)


def test_databases_article_renders_real_content_with_heading_anchors_and_diagrams():
    article_path = OUT_DIR / SLUG / "index.html"
    assert article_path.exists(), (
        f"{article_path.relative_to(REPO_ROOT)} does not exist yet — run `pnpm build` "
        "in services/site to render loadTopic('databases') through renderMarkdown"
    )
    html = article_path.read_text()

    # Real article prose from the v1 cut (topics/databases/article.md's frontmatter
    # `stance`), not a fixture — loadTopic reads the real repository tree.
    assert "general-purpose relational database" in html, (
        "expected the databases article's committed stance text in the rendered body"
    )

    # renderMarkdown's RenderedDoc.toc entries as working heading-anchor ids
    # ("the body.toc entries as working heading anchors whose generated ids appear
    # in the rendered HTML", 03-api-design.md).
    heading_ids = re.findall(r'<h[23]\b[^>]*\bid="[^"]+"', html, re.IGNORECASE)
    assert len(heading_ids) >= 2, (
        "expected >= 2 rendered <h2>/<h3> elements carrying a generated anchor id "
        f"(TocEntry.id); found {len(heading_ids)}"
    )

    # The mermaid-fence transform's marker container: the article has three
    # ```mermaid fences; >= 2 must arrive as a marker carrying the fenced source
    # untouched (readable without JS) AND explicit reserved layout space, so client
    # render never shifts settled text.
    mermaid_markers = re.findall(r"<[a-z0-9]+\b[^>]*\bmermaid\b[^>]*>", html, re.IGNORECASE)
    assert len(mermaid_markers) >= 2, (
        f"expected >= 2 mermaid marker containers in the rendered article; found {len(mermaid_markers)}"
    )
    reserved_space = [
        m
        for m in mermaid_markers
        if re.search(r'\b(?:style="[^"]*(?:min-height|height|width)\s*:|height="\d|width="\d)', m, re.IGNORECASE)
    ]
    assert len(reserved_space) >= 2, (
        "expected >= 2 mermaid marker containers to carry an explicit reserved-space "
        "attribute or style (min-height/height/width) so client render never shifts settled text"
    )
    # The fenced source itself stays readable without JavaScript — spot-check two of
    # the article's three distinct diagrams' literal source text survives untouched.
    assert "Incoming write" in html, (
        "expected the B-tree/LSM diagram's fenced mermaid source text to survive readable in the HTML"
    )
    assert "Document storage" in html, (
        "expected the convergence diagram's fenced mermaid source text to survive readable in the HTML"
    )

    # Trust-header currency data: live version and last-researched date — "currency
    # is never guessed" (loadTopic's ContentValidationError propagates when absent).
    assert "v1" in html, "expected the trust header to state the live version (v1)"
    assert re.search(r"2026-\d{2}-\d{2}", html), (
        "expected a last-researched date (2026-MM-DD) in the trust header"
    )

    # No raw unrendered markdown leaking into visible text — renderMarkdown's job,
    # not a passthrough. '## ' should exist only as source for an <h2>, never as text.
    assert "## " not in _visible_text(html), (
        "expected no literal '## ' markdown heading marker in the article's visible text"
    )


def test_static_export_carries_no_api_route():
    """`output: 'export'` (next.config.mjs) — the site build is a static export only,
    per the Site Build Data Flow's fail-closed rule; it never grows a server route."""
    assert OUT_DIR.exists(), (
        f"{OUT_DIR.relative_to(REPO_ROOT)} does not exist — run `pnpm build` in services/site"
    )
    assert not (OUT_DIR / "api").exists(), "expected no api/ directory in the static export"
