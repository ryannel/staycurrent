"""Bet-progress test — Slice 11: trust-routes (service: site)
Bet: first-living-topic  |  Parent milestone: published-trust

This test is RED by design. It proves the vertical capability this slice contributes
toward Milestone published-trust. Tests are bounded by — not duplicates of — the parent
milestone tests.

Run './dev test bet first-living-topic' to see it fail; it will pass when this slice is merged.
"""

import re
from pathlib import Path

from playwright.sync_api import Page, expect

REPO_ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = REPO_ROOT / "services" / "site" / "out"
SLUG = "databases"


# ---------------------------------------------------------------------------
# Slice capability proof (site service)
# ---------------------------------------------------------------------------
# Slice 3.2 proves the topic's remaining faces and the site-wide timeline render
# from the real content tree on the built export (02-trust-routes.md):
# /databases/changelog/ renders loadChangelog's entries as mini-essays with #vN
# permalink anchors; /databases/history/ renders the version ledger with the
# current row marked and its skill link pointing at /[topic]/skill/; /databases/
# v/1/ (v1 is current) folds into the live article instead of duplicating it —
# the Site Build Data Flow's build-time redirect; /changelog/ merges every
# topic's entries newest-first, labelled, linking /[topic]/changelog/#vN.
# The archived-render + superseded-banner path is exercised by the slice's own
# permanent tests through fixture topics via STAYCURRENT_REPO_ROOT — here the
# real repository's single-version topic proves the redirect half.
# Static assertions read services/site/out/; browser assertions use the
# cluster-gated site_page fixture (tests/conftest.py).


def test_topic_changelog_renders_the_founding_entry_with_permalink():
    page_path = OUT_DIR / SLUG / "changelog" / "index.html"
    assert page_path.exists(), (
        f"{page_path.relative_to(REPO_ROOT)} does not exist — /[topic]/changelog/ "
        "is not in the export yet"
    )
    html = page_path.read_text()
    assert re.search(r'id="v1"', html), "expected the founding entry's #v1 permalink anchor id"
    assert "v1" in html and re.search(r"2026-\d{2}-\d{2}|\d{1,2} [A-Z][a-z]{2} 2026", html), (
        "expected the founding entry's version and date"
    )
    assert "founding" in html.lower() or "Postgres" in html, (
        "expected the v1 founding entry's rendered body prose, not an empty timeline"
    )


def test_topic_history_lists_the_v1_row_marked_current():
    page_path = OUT_DIR / SLUG / "history" / "index.html"
    assert page_path.exists(), (
        f"{page_path.relative_to(REPO_ROOT)} does not exist — /[topic]/history/ "
        "is not in the export yet"
    )
    html = page_path.read_text()
    assert "v1" in html, "expected the v1 row in the version ledger"
    assert "current" in html.lower(), "expected the current version marked as such"
    assert f"/{SLUG}/skill/" in html, (
        "expected the current row's skill link to point at /[topic]/skill/ per the "
        "Version History view (superseded rows link archived payloads)"
    )


def test_current_version_url_folds_into_the_live_article(cluster, site_page: Page):
    site_page.goto(f"/{SLUG}/v/1/", wait_until="load")
    expect(site_page).to_have_url(re.compile(rf"/{SLUG}/?$"), timeout=10_000)
    expect(site_page.locator("h1", has_text="Databases")).to_be_visible()


def test_site_wide_changelog_merges_topic_entries(cluster, site_page: Page):
    site_page.goto("/changelog/", wait_until="load")
    body_text = site_page.locator("body").inner_text()
    assert "This page doesn't exist." not in body_text, (
        "/changelog/ still serves the designed 404 — the site-wide changelog route "
        "is not in the export yet"
    )
    assert "Databases" in body_text, "expected the entry labelled with its topic"
    read_entry = site_page.locator(f"main a[href*='/{SLUG}/changelog/']")
    assert read_entry.count() > 0, (
        "expected the entry's read link (in the page content, not the sidebar) to "
        "point into the topic's own changelog"
    )


def test_sidebar_changelog_and_history_faces_land_on_real_routes(cluster, site_page: Page):
    site_page.goto(f"/{SLUG}/", wait_until="load")
    for face in ("changelog", "history"):
        face_link = site_page.locator(f".sidebar a[href*='/{SLUG}/{face}']").first
        assert face_link.count() > 0, f"expected the sidebar's {face} face link"
    site_page.goto(f"/{SLUG}/changelog/", wait_until="load")
    assert "This page doesn't exist." not in site_page.locator("body").inner_text(), (
        "the changelog face must land on the real route, not the designed 404 — "
        "the mid-ladder state closes in this slice"
    )
