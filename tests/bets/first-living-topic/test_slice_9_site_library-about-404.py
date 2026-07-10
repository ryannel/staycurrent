"""Bet-progress test — Slice 9: library-about-404 (service: site)
Bet: first-living-topic  |  Parent milestone: article-readable

This test is RED by design. It proves the vertical capability this slice contributes
toward Milestone article-readable. Tests are bounded by — not duplicates of — the parent
milestone tests.

Run './dev test bet first-living-topic' to see it fail; it will pass when this slice is merged.
"""

import re
from pathlib import Path

from playwright.sync_api import Page

REPO_ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = REPO_ROOT / "services" / "site" / "out"
SLUG = "databases"


# ---------------------------------------------------------------------------
# Slice capability proof (site service)
# ---------------------------------------------------------------------------
# Slice 2.3 proves the milestone's route set closes around the article: `/` lists
# the databases card (title, stance one-liner, version badge, researched date —
# listTopics' TopicSummary sweep, 03-api-design.md), `/about/` renders the "How a
# living article works" prose, and every miss — an unmatched route, plus the
# changelog/history/skill face links whose real routes arrive in Milestone 3 (the
# accepted mid-ladder state the milestone index records) — lands on the designed
# 404, never a bare host-default error page. Narrower than the milestone test's
# front door (which only checks `/` mentions "databases" and `/about/` exists):
# this slice asserts the card's actual fields and the 404's exact designed content.
# Static assertions read services/site/out/ directly; browser assertions use the
# `cluster`-gated `site_page` fixture (tests/conftest.py) — a down runner makes the
# browser tests skip, not error.


def test_topic_library_card_renders_title_stance_badge_and_date(cluster, site_page: Page):
    site_page.goto("/", wait_until="load")

    body_text = site_page.locator("body").inner_text()
    assert "Databases" in body_text, "expected the databases topic card's serif title on the library page"
    assert "general-purpose relational database" in body_text, (
        "expected the databases card's stance one-liner on the library page"
    )

    badge = site_page.locator(".badge", has_text="v1")
    assert badge.count() > 0, "expected the databases card's version badge (.badge, v1)"

    assert re.search(r"2026-\d{2}-\d{2}", body_text) or "2026" in body_text, (
        "expected the databases card's researched date on the library page"
    )


def test_about_page_renders_the_how_it_works_prose(cluster, site_page: Page):
    site_page.goto("/about/", wait_until="load")

    body_text = site_page.locator("body").inner_text()
    assert "how a living article works" in body_text.lower(), (
        "expected /about/ to render the 'How a living article works' prose"
    )


def test_static_404_export_renders_the_designed_dead_end():
    """Any unmatched route under the static export must render the designed 404 —
    never a bare host-default error page (01-ui-design.md's 404 — Not Found view)."""
    candidates = [OUT_DIR / "404" / "index.html", OUT_DIR / "404.html"]
    path = next((p for p in candidates if p.exists()), None)
    assert path is not None, (
        "expected a static 404 export at "
        f"{candidates[0].relative_to(REPO_ROOT)} or {candidates[1].relative_to(REPO_ROOT)}"
    )

    html = path.read_text()
    assert "This page doesn&#x27;t exist." in html or "This page doesn't exist." in html, (
        "expected the designed 404's display-serif headline \"This page doesn't exist.\""
    )
    assert SLUG in html, "expected the inline topic tree (naming the databases topic) on the 404 page"


def test_browser_nonexistent_route_renders_the_designed_404(cluster, site_page: Page):
    site_page.goto("/this-topic-does-not-exist/", wait_until="load")

    body_text = site_page.locator("body").inner_text()
    assert "This page doesn't exist." in body_text, (
        "expected a nonexistent route to render the designed 404, not a host-default error page"
    )
    assert SLUG in body_text, "expected the designed 404 to render the topic tree inline"


def test_face_link_to_a_milestone_3_route_reaches_the_designed_404(cluster, site_page: Page):
    """changelog/history/skill face routes are Milestone 3 scope; until then they must
    reach the designed 404 — the accepted mid-ladder state. The slice prose scopes this
    "until Milestone 3 lands them": slice 3.2 landed changelog/history, so the one face
    still mid-ladder is skill (lands in slice 3.3) — the target moved with the ladder,
    recorded in slice 3.2's delivery commit."""
    site_page.goto(f"/{SLUG}/skill/", wait_until="load")

    body_text = site_page.locator("body").inner_text()
    assert "This page doesn't exist." in body_text, (
        f"expected /{SLUG}/skill/ (not yet a real route — slice 3.3 lands it) to "
        "reach the designed 404"
    )
