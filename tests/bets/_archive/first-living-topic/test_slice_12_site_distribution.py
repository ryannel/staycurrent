"""Bet-progress test — Slice 12: distribution (service: site)
Bet: first-living-topic  |  Parent milestone: published-trust

This test is RED by design. It proves the vertical capability this slice contributes
toward Milestone published-trust. Tests are bounded by — not duplicates of — the parent
milestone tests.

Run './dev test bet first-living-topic' to see it fail; it will pass when this slice is merged.
"""

import io
import json
import urllib.request
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = REPO_ROOT / "services" / "site" / "out"
SLUG = "databases"
SITE_ORIGIN = "http://localhost:4173"


# ---------------------------------------------------------------------------
# Slice capability proof (site service)
# ---------------------------------------------------------------------------
# Slice 3.3 proves the adopter's path (03-distribution.md): the prebuild writes
# rss.xml (buildRss — every ChangelogEntry site-wide, newest first, cap 50) and
# materializes the skill payloads (browsable tree at /skills/<slug>/, current
# zip at /skills/<slug>.zip, each zip a single top-level <slug>/ directory) per
# 03-api-design.md's distribution contract; /[topic]/skill/ renders the
# canonical install one-liner with its origin from site.config.json's url and
# the placeholder honestly labelled (change-proposal-2); the artifacts ride the
# static export and the one-liner's fetch-and-unpack works against the served
# origin. Static assertions read services/site/out/; the fetch test uses the
# cluster-gated served origin.


def test_rss_feed_rides_the_export_and_validates():
    feed_path = OUT_DIR / "rss.xml"
    assert feed_path.exists(), (
        f"{feed_path.relative_to(REPO_ROOT)} does not exist — the prebuild has not "
        "written the feed into the export yet"
    )
    root = ET.fromstring(feed_path.read_text())
    assert root.tag == "rss", "expected an <rss> document root"
    channel = root.find("channel")
    assert channel is not None, "expected an rss <channel>"
    items = channel.findall("item")
    assert len(items) >= 1, "expected at least the databases v1 founding entry as an item"
    titles = " ".join((i.findtext("title") or "") + (i.findtext("description") or "") for i in items)
    assert "atabases" in titles or "v1" in titles, (
        "expected the databases founding entry represented in the feed"
    )


def test_skill_payload_tree_and_zip_ride_the_export():
    tree_skill_md = OUT_DIR / "skills" / SLUG / "SKILL.md"
    assert tree_skill_md.exists(), (
        f"{tree_skill_md.relative_to(REPO_ROOT)} does not exist — the browsable "
        "payload tree is not in the export yet"
    )
    zip_path = OUT_DIR / "skills" / f"{SLUG}.zip"
    assert zip_path.exists(), (
        f"{zip_path.relative_to(REPO_ROOT)} does not exist — the current-version "
        "zip is not in the export yet"
    )
    with zipfile.ZipFile(zip_path) as zf:
        names = zf.namelist()
        assert all(n.startswith(f"{SLUG}/") for n in names), (
            "expected a single top-level <slug>/ directory in the zip — never loose "
            "files at the archive root (03-api-design.md's distribution contract)"
        )
        skill_md = zf.read(f"{SLUG}/SKILL.md").decode()
    assert "article_version: 1" in skill_md, (
        "expected the payload's SKILL.md to carry the article_version: 1 binding"
    )
    assert "not yet authored" in skill_md.lower() or "placeholder" in skill_md.lower(), (
        "expected the honest placeholder labelling inside the payload (change-proposal-2)"
    )


def test_install_page_shows_the_canonical_one_liner_and_placeholder_label():
    page_path = OUT_DIR / SLUG / "skill" / "index.html"
    assert page_path.exists(), (
        f"{page_path.relative_to(REPO_ROOT)} does not exist — /[topic]/skill/ is "
        "not in the export yet"
    )
    html = page_path.read_text()
    assert f"https://staycurrent.dev/skills/{SLUG}.zip" in html, (
        "expected the canonical one-liner's origin resolved from site.config.json's "
        "url (03-api-design.md states the exact command)"
    )
    assert "curl -fsSL" in html and "unzip -o" in html, (
        "expected the canonical install one-liner verbatim"
    )
    assert "~/.claude/skills/" in html, "expected the one-liner's install destination"
    lowered = html.lower()
    assert "not yet authored" in lowered or "placeholder" in lowered, (
        "expected the placeholder honestly labelled on the install page "
        "(change-proposal-2)"
    )


def test_one_liner_fetch_and_unpack_works_against_the_served_origin(cluster):
    with urllib.request.urlopen(f"{SITE_ORIGIN}/skills/{SLUG}.zip", timeout=15) as resp:
        payload = resp.read()
    with zipfile.ZipFile(io.BytesIO(payload)) as zf:
        skill_md = zf.read(f"{SLUG}/SKILL.md").decode()
    assert "article_version: 1" in skill_md, (
        "expected the served zip to unpack to <slug>/SKILL.md with the version binding — "
        "the fetch half of the canonical one-liner against the real origin"
    )


def test_sidebar_footer_carries_the_rss_glyph_link():
    article = OUT_DIR / SLUG / "index.html"
    assert article.exists(), "expected the article page in the export"
    html = article.read_text()
    assert 'href="/rss.xml"' in html, (
        "expected the sidebar footer's RSS glyph link (deferred from Milestone 2's "
        "footer cluster) pointing at /rss.xml"
    )
