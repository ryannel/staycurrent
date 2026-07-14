"""Bet-progress test — Slice 8: doc-shell-and-trust (service: site)
Bet: first-living-topic  |  Parent milestone: article-readable

This test is RED by design. It proves the vertical capability this slice contributes
toward Milestone article-readable. Tests are bounded by — not duplicates of — the parent
milestone tests.

Run './dev test bet first-living-topic' to see it fail; it will pass when this slice is merged.
"""

import re

import pytest
from playwright.sync_api import Page
from playwright.sync_api import TimeoutError as PlaywrightTimeoutError

SLUG = "databases"
ARTICLE_PATH = f"/{SLUG}/"


# ---------------------------------------------------------------------------
# Slice capability proof (site service)
# ---------------------------------------------------------------------------
# Slice 2.2 proves the design system is the running app, not a styled-later
# placeholder: the three-zone shell (nav/sidebar, main/article, TOC aside — the
# landmark set 01-ui-design.md's shared Accessibility rule commits), the trust
# header, the stance callout, a scroll-spied TOC rail, a persisted theme toggle, a
# designed code block's copy affordance, and full no-JS readability all have to hold
# on /databases/ against the built static export. Narrower than the milestone test's
# front door (which only checks the trust-header/stance/diagram strings appear
# somewhere in the HTML): this slice drives a real browser and asserts the
# interactive behaviours 01-ui-design.md's /[topic]/ view and shared shell rules
# commit. Uses the `cluster`-gated `site_page` fixture (tests/conftest.py) — the
# runner serves services/site/out/ at http://localhost:4173; a down server makes
# these tests skip, not error (cluster's normal gating).


def test_three_zone_shell_renders_around_the_article(cluster, site_page: Page):
    site_page.goto(ARTICLE_PATH, wait_until="load")

    sidebar = site_page.locator("nav")
    assert sidebar.count() > 0, (
        "expected a <nav> landmark for the 280px sidebar per the shared Accessibility "
        "rule ('<nav>/<main>/<article>/<aside> landmarks')"
    )

    article = site_page.locator("main article, article")
    assert article.count() > 0, (
        "expected the reading column to render as an <article> inside <main>"
    )

    toc = site_page.locator("aside")
    assert toc.count() > 0, "expected an <aside> landmark for the TOC rail"


def test_trust_header_renders_version_researched_date_and_face_links(cluster, site_page: Page):
    site_page.goto(ARTICLE_PATH, wait_until="load")

    badge = site_page.locator(".badge", has_text="v1")
    assert badge.count() > 0, "expected the trust header's version chip (.badge, v1)"

    body_text = site_page.locator("body").inner_text()
    assert re.search(r"2026-\d{2}-\d{2}", body_text) or "2026" in body_text, (
        "expected the trust header to state the researched date"
    )

    for face in ("changelog", "history", "skill"):
        link = site_page.locator(f"a[href*='/{SLUG}/{face}']")
        assert link.count() > 0, f"expected a trust-header link to the {face} face"


def test_stance_callout_renders_before_the_first_h2(cluster, site_page: Page):
    site_page.goto(ARTICLE_PATH, wait_until="load")

    order = site_page.evaluate(
        """() => {
            const h2 = document.querySelector('article h2, main h2');
            if (!h2) return null;
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            let node;
            while ((node = walker.nextNode())) {
                if (node.textContent.includes('general-purpose relational database')) {
                    const pos = node.compareDocumentPosition(h2);
                    return Boolean(pos & Node.DOCUMENT_POSITION_FOLLOWING);
                }
            }
            return null;
        }"""
    )
    assert order is True, (
        "expected a stance callout (carrying the article's committed stance text) to "
        "render before the article's first <h2>"
    )


def test_toc_rail_lists_the_articles_headings(cluster, site_page: Page):
    site_page.goto(ARTICLE_PATH, wait_until="load")

    headings = site_page.locator("article h2, main h2")
    assert headings.count() >= 2, "expected the article to render at least 2 <h2> headings"

    toc_links = site_page.locator("aside a[href^='#']")
    assert toc_links.count() >= 2, (
        "expected the TOC rail (aside) to list at least 2 in-page heading anchor links"
    )


def test_toc_rail_scroll_spy_highlights_the_active_heading(cluster, site_page: Page):
    site_page.goto(ARTICLE_PATH, wait_until="load")

    headings = site_page.locator("article h2, main h2")
    heading_count = headings.count()
    assert heading_count >= 2, "expected >= 2 <h2> headings for the TOC rail to spy on"

    last_heading = headings.nth(heading_count - 1)
    last_id = last_heading.get_attribute("id")
    assert last_id, "expected the last <h2> to carry a generated anchor id the TOC rail links to"

    active_link = site_page.locator(f"aside a[href='#{last_id}']")
    assert active_link.count() > 0, f"expected a TOC entry linking to #{last_id}"

    toc_links = site_page.locator("aside a[href^='#']")
    other_link = toc_links.first

    def _style(locator):
        return locator.evaluate(
            "el => { const cs = getComputedStyle(el); return cs.color + '|' + cs.fontWeight; }"
        )

    before = _style(active_link.first)
    last_heading.scroll_into_view_if_needed()
    site_page.wait_for_timeout(400)
    after = _style(active_link.first)
    sibling_after = _style(other_link)

    assert after != before or after != sibling_after, (
        "expected the TOC entry for the scrolled-to heading to visibly change (scroll-spy "
        "active state) once that heading is scrolled into view"
    )


def test_theme_toggle_flips_data_theme_and_persists_across_reload(cluster, site_page: Page):
    site_page.goto(ARTICLE_PATH, wait_until="load")

    toggle = site_page.locator(
        "[data-theme-toggle], button[aria-label*='theme' i], "
        "button[aria-label*='light' i], button[aria-label*='dark' i]"
    )
    assert toggle.count() > 0, (
        "expected a theme toggle control in the sidebar footer cluster "
        "(icon button with an accessible name naming theme/light/dark)"
    )

    before = site_page.evaluate("() => document.documentElement.getAttribute('data-theme')")

    # The toggle's click handler only attaches once React hydrates — a click
    # landing before that is a silent no-op. Retry a few times, each
    # conditioned on the actual [data-theme] change via `wait_for_function`,
    # instead of a fixed sleep. Also allow more than one click: the strict
    # committed cycle (light -> dark -> system -> light) doesn't guarantee
    # every single click flips the resolved palette (leaving "system" can
    # resolve to the same palette already showing, depending on the
    # OS/browser colour-scheme preference the test runs under) — two clicks
    # always cross a light<->dark transition, which unconditionally changes.
    after = None
    for _ in range(4):
        toggle.first.click()
        try:
            site_page.wait_for_function(
                "(before) => document.documentElement.getAttribute('data-theme') !== before",
                arg=before,
                timeout=2_000,
            )
            after = site_page.evaluate("() => document.documentElement.getAttribute('data-theme')")
            break
        except PlaywrightTimeoutError:
            continue
    assert after is not None and after != before, (
        "expected clicking the theme toggle to flip [data-theme] on <html> within a few clicks"
    )

    stored = site_page.evaluate("() => localStorage.getItem('theme')")
    assert stored in ("light", "dark", "system"), (
        f"expected localStorage['theme'] to hold light|dark|system, got {stored!r}"
    )

    site_page.reload(wait_until="load")
    reloaded = site_page.evaluate("() => document.documentElement.getAttribute('data-theme')")
    assert reloaded == after, "expected the theme choice to persist across reload"


def test_code_blocks_carry_the_copy_affordance(cluster, site_page: Page):
    """Code blocks spec (design-system.md § Code blocks): 'a designed object... with
    the ghost copy affordance.' The mermaid marker's fenced source is the one
    guaranteed code-block-shaped element on /databases/ in the v1 content (the
    article has no other fenced block)."""
    site_page.goto(ARTICLE_PATH, wait_until="load")

    code_blocks = site_page.locator("pre, [class*='code-block' i]")
    assert code_blocks.count() > 0, "expected at least one designed code block on the article page"

    copy_btn = site_page.locator(
        "pre button, [class*='code' i] button, button[aria-label*='copy' i]"
    )
    assert copy_btn.count() > 0, "expected a code block to carry a ghost copy-affordance button"


def test_article_and_mermaid_source_remain_readable_with_js_disabled(cluster, browser, surfaces):
    base = surfaces["site"]["reach"]
    if base is None:
        pytest.skip("surface 'site' has no reachable base URL")

    context = browser.new_context(base_url=base, java_script_enabled=False)
    try:
        page = context.new_page()
        page.goto(ARTICLE_PATH, wait_until="load")
        body_text = page.locator("body").inner_text()
        assert "general-purpose relational database" in body_text, (
            "expected the article's stance prose to remain readable with JavaScript disabled"
        )
        assert "graph TD" in body_text or "graph LR" in body_text, (
            "expected a mermaid fence's fenced source to remain readable with JavaScript disabled"
        )
    finally:
        context.close()
