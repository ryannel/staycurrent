"""Skill Install Page interface tests (01-ui-design.md) — Slice 3.3
(distribution, bet first-living-topic).

The bet-progress suite already proves the artifact-level contract (rss.xml,
the skill payload tree/zip, the raw canonical one-liner in the built HTML —
tests/bets/first-living-topic/test_slice_12_site_distribution.py); these
permanent tests pin the same route as a real, navigable, accessible screen —
the class of coverage routes.json's generic render-smoke/a11y/token/layout
gates already sweep (registered there as `/databases/skill/`), plus the two
behaviours specific to this page: the sidebar's Skill face link now lands on
a real route instead of the designed 404 test_not_found.py used to pin it
against (see that file's own Slice 3.3 update), and the copy affordance's
click-driven confirmation.
"""

import re

from playwright.sync_api import Page, expect

from pages.base_page import BasePage
from pages.topic_skill_page import TopicSkillPage
from topic_state import live_topic_version

SLUG = "databases"


def test_install_page_shows_the_one_liner_version_binding_and_placeholder_label(
    cluster, site_page: Page, surfaces
):
    skill = TopicSkillPage(site_page, surfaces["site"]["reach"])
    skill.goto(f"/{SLUG}/skill/").expect_one_liner(SLUG).expect_version_binding(
        live_topic_version(SLUG)
    ).expect_placeholder_labelled()


def test_install_skill_button_and_ghost_copy_icon_both_confirm_the_copy(cluster, site_page: Page, surfaces):
    skill = TopicSkillPage(site_page, surfaces["site"]["reach"])
    skill.goto(f"/{SLUG}/skill/")

    skill.click_ghost_copy().expect_copied_confirmation()

    # A fresh navigation resets the component's copied state before the
    # second affordance (the "Install skill" CTA) is exercised.
    skill.goto(f"/{SLUG}/skill/")
    skill.click_install_skill().expect_copied_confirmation()


def test_back_to_the_article_link_returns_to_the_live_article(cluster, site_page: Page, surfaces):
    skill = TopicSkillPage(site_page, surfaces["site"]["reach"])
    skill.goto(f"/{SLUG}/skill/").expect_back_to_article_link(SLUG)

    site_page.locator(f"a[href='/{SLUG}/']", has_text="Back to the article").click()
    expect(site_page).to_have_url(re.compile(rf"/{SLUG}/?$"))


def test_ghost_copy_icon_is_keyboard_activatable(cluster, site_page: Page, surfaces):
    """Keyboard-path entry (the same `.focus()`-then-Enter convention
    `test_topic_article_shell.py`'s theme toggle and `library_page.py`'s
    card focus use): the ghost copy affordance must be reachable and
    activatable without a mouse, not just clickable."""
    skill = TopicSkillPage(site_page, surfaces["site"]["reach"])
    skill.goto(f"/{SLUG}/skill/")

    site_page.locator(".install-copy-btn").focus()
    site_page.keyboard.press("Enter")

    skill.expect_copied_confirmation()


def test_sidebar_skill_face_link_now_navigates_to_the_real_route(cluster, site_page: Page, surfaces):
    """Mirrors test_topic_trust_routes.py's identical sidebar-navigation
    convention for the changelog/history faces — Skill is the last of the
    four topic faces to make this same transition, from the designed 404
    test_not_found.py pinned it against through Slice 3.2, to a real route."""
    site_page.set_viewport_size({"width": 1280, "height": 800})
    shell = BasePage(site_page, surfaces["site"]["reach"])

    shell.goto("/")
    shell.click_sidebar_face_link("Databases", "Skill")

    expect(site_page).to_have_url(re.compile(rf"/{SLUG}/skill/?$"))
    assert "This page doesn't exist." not in site_page.locator("body").inner_text()
