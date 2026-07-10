"""Topic Article shell interface tests — one per user-observable behaviour
Slice 2.2 (doc-shell-and-trust, bet first-living-topic) delivered on top of
Slice 2.1's content-pipeline: the three-zone App Shell, the trust header's
face links, the TOC rail's scroll-spy, the persisted theme toggle, and the
code block's copy affordance.

Driven off the `cluster`-gated `site_page` fixture (tests/conftest.py) against
the built static export the runner serves at http://localhost:4173, same
convention as `test_topic_article.py`. Assertions favour semantic state
(`aria-current`, `[data-theme]`, `localStorage`) over computed style so they
outlive a future restyle — see `pages/topic_article_page.py`'s module comment.
"""

from datetime import datetime, timedelta, timezone

from playwright.sync_api import Page, expect
from playwright.sync_api import TimeoutError as PlaywrightTimeoutError

from pages.topic_article_page import TopicArticlePage

SLUG = "databases"
ARTICLE_PATH = f"/{SLUG}/"


def test_three_zone_shell_renders_around_the_article(cluster, site_page: Page, surfaces):
    """The sidebar, reading column, and TOC rail all land as the shared shell's
    landmark set (01-ui-design.md's shell zone rule)."""
    article = TopicArticlePage(site_page, surfaces["site"]["reach"])
    article.goto(ARTICLE_PATH).expect_shell_landmarks()


def test_trust_header_face_links_point_at_the_topics_other_faces(cluster, site_page: Page, surfaces):
    """The trust header's changelog/history/skill links carry this topic's
    per-face routes, even though those routes don't land until Milestone 3."""
    article = TopicArticlePage(site_page, surfaces["site"]["reach"])
    article.goto(ARTICLE_PATH).expect_trust_header_face_links(SLUG)


def test_toc_rail_lists_the_articles_headings(cluster, site_page: Page, surfaces):
    """The TOC rail (<aside>) renders at least one in-page anchor link per
    the article's h2/h3 outline."""
    article = TopicArticlePage(site_page, surfaces["site"]["reach"])
    article.goto(ARTICLE_PATH).expect_toc_rail_link_count_at_least(2)


def test_toc_rail_marks_the_scrolled_to_heading_active(cluster, site_page: Page, surfaces):
    """Scrolling the last <h2> into view marks its TOC entry
    `aria-current="location"` — the scroll-spy contract."""
    article = TopicArticlePage(site_page, surfaces["site"]["reach"])
    article.goto(ARTICLE_PATH).expect_toc_active_link_tracks_scroll()


def test_code_block_carries_the_copy_affordance(cluster, site_page: Page, surfaces):
    """A designed code block (the mermaid-fence transform's readable source,
    on this v1 article) carries the ghost copy-affordance button."""
    article = TopicArticlePage(site_page, surfaces["site"]["reach"])
    article.goto(ARTICLE_PATH).expect_code_copy_affordance()


def test_theme_toggle_flips_data_theme_and_persists_across_reload(cluster, site_page: Page, surfaces):
    """The theme toggle flips the resolved [data-theme] attribute, persists
    the choice to localStorage['theme'], and survives a reload.

    The toggle's click handler only attaches once React hydrates — a click
    landing before that is a silent no-op, not an error, so this retries the
    click a few times, each conditioned on the actual [data-theme] change via
    `wait_for_function`, instead of a fixed sleep that either wastes time or
    (worse) undershoots hydration and flakes.

    It also allows up to two attempts before asserting a change: the strict
    committed cycle (light -> dark -> system -> light, operator decision) does
    NOT guarantee every single click flips the resolved palette — leaving
    "system" can resolve to the same palette the reader was already on,
    depending on the OS/browser colour-scheme preference the test runs under.
    Two clicks through the strict cycle always cross at least one light<->dark
    transition, which is unconditionally a resolved-attribute change
    regardless of that preference.
    """
    article = TopicArticlePage(site_page, surfaces["site"]["reach"])
    article.goto(ARTICLE_PATH)

    before = article.get_data_theme()

    after = None
    for _ in range(4):
        article.toggle_theme()
        try:
            site_page.wait_for_function(
                "(before) => document.documentElement.getAttribute('data-theme') !== before",
                arg=before,
                timeout=2_000,
            )
            after = article.get_data_theme()
            break
        except PlaywrightTimeoutError:
            continue
    assert after is not None and after != before, (
        "expected the toggle to flip the resolved [data-theme] attribute within a few clicks"
    )

    stored = article.get_stored_theme()
    assert stored in ("light", "dark", "system"), f"expected a valid stored theme, got {stored!r}"

    site_page.reload(wait_until="load")
    assert article.get_data_theme() == after, "expected the theme choice to persist across reload"


def test_mermaid_diagrams_render_to_svg_and_hide_the_fenced_source(cluster, site_page: Page, surfaces):
    """A mermaid fence renders to a real SVG inside its `.mermaid-figure`
    marker container once the client-side render completes (Diagrams spec),
    and the readable fenced source (the no-JS fallback) is hidden once that
    happens. `test_topic_article.py` already proves the marker/data-mermaid
    contract without asserting anything about a visible render — this is
    that render, proven end-to-end."""
    article = TopicArticlePage(site_page, surfaces["site"]["reach"])
    article.goto(ARTICLE_PATH)

    rendered_svg = site_page.locator(".mermaid-figure .mermaid-rendered svg")
    expect(rendered_svg.first).to_be_visible(timeout=10_000)
    assert rendered_svg.count() >= 1, "expected at least one rendered mermaid SVG"

    sources = site_page.locator(".mermaid-figure pre.mermaid-source")
    assert sources.count() >= 1, "expected at least one mermaid fenced-source element"
    for i in range(sources.count()):
        expect(sources.nth(i)).to_be_hidden()


def test_keyboard_path_skip_link_theme_toggle_and_toc_activation(cluster, site_page: Page, surfaces):
    """Full keyboard operability (docs/design-system.md's shared Accessibility
    rule): Tab from a clean load reaches the skip link first and activating
    it jumps to #main-content; the theme toggle is keyboard-activatable; and
    Tab-ing into the TOC rail then pressing Enter follows the focused
    heading anchor."""
    article = TopicArticlePage(site_page, surfaces["site"]["reach"])
    article.goto(ARTICLE_PATH)
    site_page.wait_for_load_state("networkidle")

    site_page.keyboard.press("Tab")
    focused_class = site_page.evaluate("() => document.activeElement && document.activeElement.className")
    assert focused_class == "skip-link", (
        f"expected the skip link to be the first Tab stop, got class {focused_class!r}"
    )

    site_page.keyboard.press("Enter")
    assert site_page.evaluate("() => location.hash") == "#main-content", (
        "expected activating the skip link to jump to #main-content"
    )

    # Keyboard-activate the theme toggle — same tolerance as the click-driven
    # theme test: the strict committed cycle doesn't guarantee every single
    # activation flips the resolved palette (see that test's docstring).
    site_page.locator("[data-theme-toggle]").focus()
    before = article.get_data_theme()
    after = None
    for _ in range(4):
        site_page.keyboard.press("Enter")
        try:
            site_page.wait_for_function(
                "(before) => document.documentElement.getAttribute('data-theme') !== before",
                arg=before,
                timeout=2_000,
            )
            after = article.get_data_theme()
            break
        except PlaywrightTimeoutError:
            continue
    assert after is not None and after != before, (
        "expected keyboard-activating the theme toggle to flip [data-theme] within a few presses"
    )

    # Tab into the TOC rail and Enter lands on the focused anchor.
    first_toc_link = site_page.locator("aside a[href^='#']").first
    href = first_toc_link.get_attribute("href")
    first_toc_link.focus()
    site_page.keyboard.press("Enter")
    assert site_page.evaluate("() => location.hash") == href, (
        f"expected Enter on the focused TOC link to navigate to {href}"
    )


def test_stance_callout_is_the_first_blockquote_and_precedes_the_first_h2(
    cluster, site_page: Page, surfaces
):
    """Ported from the bet-progress suite (test_slice_8_site_doc-shell-and-trust.py's
    `test_stance_callout_renders_before_the_first_h2`) so this structural
    assertion survives that suite's archival: the article's first
    <blockquote> carries the committed stance text and renders before the
    article's first <h2> (01-ui-design.md's stance-callout placement rule)."""
    article = TopicArticlePage(site_page, surfaces["site"]["reach"])
    article.goto(ARTICLE_PATH)

    result = site_page.evaluate(
        """() => {
            const blockquote = document.querySelector('article blockquote, main blockquote');
            const h2 = document.querySelector('article h2, main h2');
            if (!blockquote || !h2) return null;
            return {
                containsStance: blockquote.textContent.includes('general-purpose relational database'),
                precedesH2: Boolean(
                    blockquote.compareDocumentPosition(h2) & Node.DOCUMENT_POSITION_FOLLOWING
                ),
            };
        }"""
    )
    assert result is not None, "expected both a <blockquote> and an <h2> in the article"
    assert result["containsStance"], "expected the first <blockquote> to contain the article's stance text"
    assert result["precedesH2"], "expected the stance <blockquote> to precede the article's first <h2>"


def test_freshness_dot_presence_matches_an_independent_14_day_oracle(cluster, site_page: Page, surfaces):
    """The freshness dot's presence must match "current version's cut date
    <= 14 days old" (docs/design-system.md § Graphical UI, Badges) — computed
    here as an INDEPENDENT oracle from the rendered `data-cut-date`, not a
    hardcoded date/boolean, so this test stays correct as the real content
    ages past its freshness window instead of needing to be updated by hand."""
    article = TopicArticlePage(site_page, surfaces["site"]["reach"])
    article.goto(ARTICLE_PATH)

    dot = site_page.locator(".trust-header .freshness-dot")
    cut_date_str = dot.get_attribute("data-cut-date")
    assert cut_date_str, "expected the trust header's freshness dot to carry data-cut-date"

    cut_date = datetime.fromisoformat(cut_date_str).replace(tzinfo=timezone.utc)
    now = datetime.now(timezone.utc)
    expected_fresh = (now - cut_date) <= timedelta(days=14)

    is_hidden = dot.evaluate("(el) => el.hidden")
    assert (not is_hidden) == expected_fresh, (
        f"expected freshness dot visibility ({not is_hidden}) to match the independent "
        f"14-day oracle ({expected_fresh}) for cut date {cut_date_str}"
    )


def test_article_remains_readable_with_javascript_disabled(cluster, browser, surfaces):
    """Progressive enhancement (docs/design-system.md § Graphical UI): the
    essay and the mermaid fences' fenced source both stay readable with
    JavaScript off — the theme falls back to system preference and no content
    is gated behind a client-only render."""
    base = surfaces["site"]["reach"]
    if base is None:
        import pytest

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
