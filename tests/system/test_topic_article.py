"""Topic Article interface test, one test per user-observable behaviour this bet's
site content-pipeline slice (Slice 2.1, first-living-topic) delivered.

Mirrors the render-smoke/a11y-smoke system tests' conventions: driven off the
`cluster`-gated `site_page` fixture (tests/conftest.py) against the built static
export the runner serves at http://localhost:4173, automatically parametrized over
chromium via `site_page`'s dependency on pytest-playwright's `browser` fixture.
Skips cleanly when the site surface isn't reachable (`cluster`'s normal gating).

All assertions are content-based (element/attribute/text), never style-based, so
they survive Milestone 3's later restyle of the shell around this content-bearing
core — see `pages/topic_article_page.py`.
"""

from playwright.sync_api import Page

from pages.topic_article_page import TopicArticlePage

SLUG = "databases"
ARTICLE_PATH = f"/{SLUG}/"


def test_databases_article_serves_the_real_stance_text(cluster, site_page: Page, surfaces):
    """/databases/ serves the real, gate-cut article — not a fixture."""
    article = TopicArticlePage(site_page, surfaces["site"]["reach"])
    article.goto(ARTICLE_PATH).expect_stance_text("general-purpose relational database")


def test_databases_article_has_heading_anchor_ids(cluster, site_page: Page, surfaces):
    """renderMarkdown's RenderedDoc.toc entries render as working heading-anchor ids."""
    article = TopicArticlePage(site_page, surfaces["site"]["reach"])
    article.goto(ARTICLE_PATH).expect_heading_anchor_count_at_least(2)


def test_databases_article_has_mermaid_marker_containers(cluster, site_page: Page, surfaces):
    """The mermaid-fence transform's marker containers carry their fenced source as
    data-mermaid. Deliberately silent on visible diagram rendering — that's a later
    slice's client-render concern."""
    article = TopicArticlePage(site_page, surfaces["site"]["reach"])
    article.goto(ARTICLE_PATH).expect_mermaid_markers_at_least(2)


def test_databases_article_trust_header_states_currency(cluster, site_page: Page, surfaces):
    """The trust header states the live version and a last-researched date —
    "currency is never guessed" (loadTopic's ContentValidationError propagates when
    a topic cannot state either)."""
    article = TopicArticlePage(site_page, surfaces["site"]["reach"])
    article.goto(ARTICLE_PATH).expect_trust_header_version("v1").expect_trust_header_last_researched()
