"""Trust-routes interface tests — one per user-observable behaviour Slice 3.2
(trust-routes, bet first-living-topic) delivered on top of Slice 3.1's
hardened render pipeline: the per-topic changelog and history faces, the
current-version redirect, and the site-wide changelog.

Driven off the `cluster`-gated `site_page` fixture against the built static
export the runner serves at http://localhost:4173, same convention as
`test_topic_article.py`/`test_topic_article_shell.py`. Version-sensitive
assertions read the live version from `topics/` (topic_state.py) rather than
pinning the founding-era v1; the archived-render and superseded-banner states
are additionally proven version-independently through a 2-version fixture
topic — see `test_topic_versions_fixture.py`.
"""

import re

from playwright.sync_api import Page, expect

from pages.base_page import BasePage
from pages.site_changelog_page import SiteChangelogPage
from pages.topic_changelog_page import TopicChangelogPage
from pages.topic_history_page import TopicHistoryPage
from pages.topic_version_page import TopicVersionPage
from topic_state import live_topic_version

SLUG = "databases"


def test_topic_changelog_renders_the_founding_entry_with_its_permalink(cluster, site_page: Page, surfaces):
    changelog = TopicChangelogPage(site_page, surfaces["site"]["reach"])
    changelog.goto(f"/{SLUG}/changelog/").expect_entry_permalink(1).expect_entry_prose("Founding cut")
    # The TOC rail's own href="#vN" entry must resolve to the hand-authored
    # <h2 id="vN"> anchor it names — the founding entry's #v1 anchor is
    # permanent whatever the live version is; the multi-version ordering case
    # is pinned against the widgets fixture in
    # test_topic_versions_fixture.py's test_changelog_page_lists_both_versions_newest_first.
    expect(site_page.locator(".toc-rail a[href='#v1']")).to_be_visible()

    # The entry heading's own quiet permalink affordance (its right-edge
    # `#vN` anchor) must actually navigate the URL hash, not just render.
    changelog.click_entry_permalink(1)
    expect(site_page).to_have_url(re.compile(r"#v1$"))


def test_topic_history_marks_the_live_version_current_with_a_real_skill_link(cluster, site_page: Page, surfaces):
    history = TopicHistoryPage(site_page, surfaces["site"]["reach"])
    n = live_topic_version(SLUG)
    history.goto(f"/{SLUG}/history/").expect_current_row(f"v{n}", SLUG)
    if n > 1:
        history.expect_superseded_row("v1", SLUG, 1)


def test_current_version_url_redirects_to_the_live_article(cluster, site_page: Page, surfaces):
    version_page = TopicVersionPage(site_page, surfaces["site"]["reach"])
    version_page.goto(f"/{SLUG}/v/{live_topic_version(SLUG)}/").expect_redirected_to_live_article(f"/{SLUG}/")
    expect(site_page.locator("h1")).to_contain_text("Databases")


def test_site_wide_changelog_lists_the_databases_entry_and_links_its_own_changelog(
    cluster, site_page: Page, surfaces
):
    site_changelog = SiteChangelogPage(site_page, surfaces["site"]["reach"])
    site_changelog.goto("/changelog/").expect_topic_entry("Databases").expect_read_entry_link(
        SLUG, live_topic_version(SLUG)
    )


def test_sidebar_changelog_and_history_faces_navigate_to_the_real_routes(cluster, site_page: Page, surfaces):
    """Unlike the bet-progress proof, this walks the real click path (not a
    direct `goto()`) for both faces the sidebar's topic-tree carries —
    mirroring test_not_found.py's identical navigation-path convention."""
    site_page.set_viewport_size({"width": 1280, "height": 800})
    shell = BasePage(site_page, surfaces["site"]["reach"])

    shell.goto("/")
    shell.click_sidebar_face_link("Databases", "Changelog")
    expect(site_page).to_have_url(re.compile(rf"/{SLUG}/changelog/?$"))
    assert "This page doesn't exist." not in site_page.locator("body").inner_text()

    shell.goto("/")
    shell.click_sidebar_face_link("Databases", "History")
    expect(site_page).to_have_url(re.compile(rf"/{SLUG}/history/?$"))
    assert "This page doesn't exist." not in site_page.locator("body").inner_text()
