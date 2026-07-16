"""Topic Library interface tests (01-ui-design.md, `/` — Topic Library) —
Slice 2.3 (library-about-404, bet first-living-topic).

Driven off the `cluster`-gated `site_page` fixture against the built static
export the runner serves at http://localhost:4173, same convention as
`test_topic_article.py`/`test_topic_article_shell.py`.

The first-run empty state (zero topics) is deliberately NOT proven here via a
real `next build`: Next.js 16's `output: 'export'` hard-fails the whole build
when a dynamic route's `generateStaticParams()` returns zero entries (`Page
"/[topic]" is missing "generateStaticParams()"`, confirmed empirically against
this exact Next version) — a genuinely empty `topics/` tree cannot reach a
served page at all, so there is no live route to drive a browser against. The
empty-state RENDER itself is proven at the component level instead
(`components/library/topic-library.test.tsx`, cards=[]) plus the data layer's
zero-topic sweep (`lib/content.test.ts`).
"""

from playwright.sync_api import Page, expect

from pages.library_page import LibraryPage
from topic_state import live_topic_version

SLUG = "databases"


def test_library_renders_the_databases_card(cluster, site_page: Page, surfaces):
    """The card states title, stance one-liner, and version badge —
    `listTopics`' `TopicSummary` sweep (03-api-design.md). The badge asserts
    the live version read from `topics/`, not a founding-era constant."""
    library = LibraryPage(site_page, surfaces["site"]["reach"])
    library.goto("/").expect_topic_card(
        "Databases", "general-purpose relational database", f"v{live_topic_version(SLUG)}"
    )


def test_clicking_a_card_navigates_to_the_topic_article(cluster, site_page: Page, surfaces):
    """Click a card -> navigates to /[topic]/ (Key interactions). The Enter
    (keyboard) path is proven separately by
    test_pressing_enter_on_a_focused_card_navigates_to_the_topic_article."""
    library = LibraryPage(site_page, surfaces["site"]["reach"])
    library.goto("/").click_topic_card("Databases")
    # expect(...).to_have_url polls/retries, unlike a one-shot wait_for_load_state
    # right after click() — the navigation triggered by the click is async and a
    # single load-state check can win the race against it.
    expect(site_page).to_have_url(f"{surfaces['site']['reach']}/{SLUG}/")


def test_pressing_enter_on_a_focused_card_navigates_to_the_topic_article(cluster, site_page: Page, surfaces):
    """Enter on a focused card also navigates to /[topic]/ (Key
    interactions) — the card renders as a real <a>, so it is a native
    keyboard-activatable hit target, not just a mouse one."""
    library = LibraryPage(site_page, surfaces["site"]["reach"])
    library.goto("/").focus_topic_card("Databases")
    site_page.keyboard.press("Enter")
    expect(site_page).to_have_url(f"{surfaces['site']['reach']}/{SLUG}/")
