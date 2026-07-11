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

import warnings

import pytest
from playwright.sync_api import Page

from pages.not_found_page import NotFoundPage

AXE_CDN_URL = "https://cdn.jsdelivr.net/npm/axe-core@4.10.2/axe.min.js"


def test_unmatched_route_reaches_the_designed_404(cluster, site_page: Page, surfaces):
    not_found = NotFoundPage(site_page, surfaces["site"]["reach"])
    not_found.goto("/this-topic-does-not-exist/").expect_designed_dead_end().expect_topic_tree_link(
        "databases"
    )


def test_face_shaped_miss_reaches_the_designed_404(cluster, site_page: Page, surfaces):
    """Slice 3.3 (distribution) landed the last mid-ladder face — `skill` —
    as a real route (see
    tests/bets/first-living-topic/test_slice_12_site_distribution.py), so
    every face the sidebar's topic-tree lists (article/changelog/history/
    skill) is now real. `/databases/research-log/` is a plausible-looking
    topic sub-path with real backing content (`research-log.md` exists) but
    no route ever built for it in this bet's decomposition — a permanently
    mid-ladder path, keeping the designed-404 class pinned to something this
    static export genuinely never generates."""
    not_found = NotFoundPage(site_page, surfaces["site"]["reach"])
    not_found.goto("/databases/research-log/").expect_designed_dead_end()


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
