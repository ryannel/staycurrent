"""404 — Not Found interface tests (01-ui-design.md) — Slice 2.3
(library-about-404, bet first-living-topic).

The bet-progress suite already proved navigation lands on the designed 404
for an unmatched route and for a Milestone-3 face link
(tests/bets/first-living-topic/test_slice_9_site_library-about-404.py,
archived at bet close); these permanent tests pin the same contract via the
page object plus the accessibility sweep the generic routes.json gates can't
cover — a 404 path can't sit in routes.json because render-smoke asserts
every swept route responds < 400 (a 404 response would fail that gate for
every OTHER route too).
"""

import re
import warnings

import pytest
from playwright.sync_api import Page, expect

from pages.base_page import BasePage
from pages.not_found_page import NotFoundPage

AXE_CDN_URL = "https://cdn.jsdelivr.net/npm/axe-core@4.10.2/axe.min.js"


def test_unmatched_route_reaches_the_designed_404(cluster, site_page: Page, surfaces):
    not_found = NotFoundPage(site_page, surfaces["site"]["reach"])
    not_found.goto("/this-topic-does-not-exist/").expect_designed_dead_end().expect_topic_tree_link(
        "databases"
    )


def test_milestone_3_face_link_reaches_the_designed_404(cluster, site_page: Page, surfaces):
    """changelog/history/skill face routes are Milestone 3 scope; until then
    they reach the designed 404 — the accepted mid-ladder state."""
    not_found = NotFoundPage(site_page, surfaces["site"]["reach"])
    not_found.goto("/databases/changelog/").expect_designed_dead_end()


def test_sidebar_face_link_reaches_the_designed_404(cluster, site_page: Page, surfaces):
    """The test above proves the route itself dead-ends correctly, but
    reaches it by typing the URL directly — it would stay green even if the
    sidebar's own topic-faces list pointed somewhere else entirely. This
    walks the real navigation path instead: expand the databases entry in
    the sidebar and follow its Changelog face link.

    Desktop viewport (matching test_visual_regression.py's DESKTOP
    convention) keeps the sidebar in its sticky, always-visible mode rather
    than the closed overlay drawer, so the click is deterministic.
    """
    site_page.set_viewport_size({"width": 1280, "height": 800})
    shell = BasePage(site_page, surfaces["site"]["reach"])
    shell.goto("/")
    shell.click_sidebar_face_link("Databases", "Changelog")

    # The link's own href carries the trailing slash (`/databases/changelog/`,
    # confirmed against the rendered DOM), but Next's client-side router
    # deterministically drops it from the address bar when a soft navigation
    # resolves to the not-found boundary for a route this static export never
    # generates — reproduced consistently against the served build, unlike a
    # direct `goto()` (test_milestone_3_face_link_reaches_the_designed_404),
    # which preserves whatever was typed. The optional trailing slash below
    # tolerates that real client-router quirk without cementing it as pass/fail
    # signal — the load-bearing assertion is landing on /databases/changelog,
    # which expect_designed_dead_end() below confirms is the real 404.
    expect(site_page).to_have_url(re.compile(r"/databases/changelog/?$"))
    NotFoundPage(site_page, surfaces["site"]["reach"]).expect_designed_dead_end()


def test_404_is_axe_clean(cluster, site_page: Page, surfaces):
    """routes.json can't carry a 404 path (see module docstring) — scan it
    here instead, same critical-only bar as test_a11y_smoke.py."""
    not_found = NotFoundPage(site_page, surfaces["site"]["reach"])
    not_found.goto("/this-topic-does-not-exist/")

    try:
        site_page.add_script_tag(url=AXE_CDN_URL)
    except Exception as exc:  # noqa: BLE001 — any injection failure means no scan
        pytest.skip(f"axe-core CDN unreachable, a11y scan skipped: {exc}")

    results = site_page.evaluate("() => axe.run(document, { resultTypes: ['violations'] })")
    violations = results.get("violations", [])

    non_critical = [v for v in violations if v.get("impact") != "critical"]
    if non_critical:
        summary = ", ".join(f"{v['id']} ({v.get('impact')})" for v in non_critical)
        warnings.warn(f"non-critical a11y violations on 404: {summary}")

    critical = [v for v in violations if v.get("impact") == "critical"]
    assert not critical, (
        "axe-core found CRITICAL accessibility violations on 404:\n  "
        + "\n  ".join(f"{v['id']}: {v['help']} ({len(v.get('nodes', []))} node(s))" for v in critical)
    )
