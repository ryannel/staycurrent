"""Bet-progress test — Milestone 2: article-readable
Bet: first-living-topic

This test is RED by design. It defines the target state for Milestone 2.
Run './dev test bet first-living-topic' to see it fail; it will pass when Delivery is complete.
"""

import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = REPO_ROOT / "services" / "site" / "out"
SLUG = "databases"


# ---------------------------------------------------------------------------
# Front door (a reader, in a browser — proven here against the real built static
# export the browser would be served, `pnpm build` -> out/)
# ---------------------------------------------------------------------------
# Front door: a reader driving the built static export sees the databases article
# render completely — trust header, stance callout, and diagrams — with the topic
# library listing it and /about/ present. Traces to
# decomposition/02-article-readable/index.md's Proof of work. Deliberately NOT
# skipped when out/ is absent: a missing export is exactly the not-yet-built target
# state RED exists to name.


def test_topic_library_lists_the_databases_card():
    index_path = OUT_DIR / "index.html"
    assert index_path.exists(), (
        f"{index_path.relative_to(REPO_ROOT)} does not exist yet — run `pnpm build` in services/site"
    )
    html = index_path.read_text()
    assert "databases" in html.lower(), "expected the databases topic card on the library page"


def test_databases_article_renders_trust_header_stance_and_diagrams():
    article_path = OUT_DIR / SLUG / "index.html"
    assert article_path.exists(), (
        f"{article_path.relative_to(REPO_ROOT)} does not exist yet — the /{SLUG}/ route is not built"
    )
    html = article_path.read_text()
    assert "v1" in html, "expected the trust header to state the live version"
    assert re.search(r"\d{4}-\d{2}-\d{2}", html), "expected a last-researched date in the trust header"
    assert "stance" in html.lower(), "expected the stance callout to render"
    assert "mermaid" in html.lower(), "expected a mermaid diagram container with reserved space"


def test_about_page_exists():
    about_path = OUT_DIR / "about" / "index.html"
    assert about_path.exists(), (
        f"{about_path.relative_to(REPO_ROOT)} does not exist yet — the /about/ route is not built"
    )
