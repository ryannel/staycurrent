"""Archived Version + Version History permanent coverage that the real
content tree cannot exercise — Slice 3.2 (trust-routes, bet
first-living-topic).

The repository's own `databases` topic is single-version (v1 is current), so
its `/databases/v/1/` route only ever exercises the current-version redirect
stub (proven in `test_topic_trust_routes.py` against the real served build).
The archived render, the superseded banner, the superseded-skill pointer, and
the Version History table's superseded row are only reachable through a
fixture topic with >= 2 versions — built via `STAYCURRENT_REPO_ROOT`
(`services/site/lib/content.ts`'s override), the same mechanism
`test_slice_10_core_render-hardening.py`'s site-build proof uses, and never
touching the repository's own `topics/`.

`services/site/out/` gets rewritten by the fixture `pnpm build` (module scope:
one build, several assertions) and is snapshotted aside first and restored
in a `finally`, so the real served build other tests in this suite expect is
left intact regardless of outcome.
"""

import json
import os
import shutil
import subprocess
import tempfile
import zipfile
from pathlib import Path

import pytest
from playwright.sync_api import Page, expect

from pages.topic_history_page import TopicHistoryPage
from pages.topic_version_page import TopicVersionPage

REPO_ROOT = Path(__file__).resolve().parents[2]
SITE_DIR = REPO_ROOT / "services" / "site"
OUT_DIR = SITE_DIR / "out"
PUBLIC_DIR = SITE_DIR / "public"
RSS_PATH = PUBLIC_DIR / "rss.xml"
SKILLS_DIR = PUBLIC_DIR / "skills"
SLUG = "widgets"

# A DISTINCTIVE origin — deliberately not staycurrent.dev (the repo's own
# site.config.json) and not any string the engine ever hardcoded — so a page
# or feed carrying it proves site.config.json's OWN value flowed through the
# build, closing the "indistinguishable from a hardcoded fallback" oracle gap
# now that services/site fails closed on a missing config (RC1) rather than
# degrading to one.
FIXTURE_SITE_CONFIG = {
    "name": "Fixture Site",
    "url": "https://fixture.example.test",
    "description": "A fixture site.config.json proving config-driven origin flows through the build.",
    "author": "fixture author",
}

ARTICLE_MD = """---
topic: widgets
title: Widgets
stance: A fixture stance for testing archived versions and history.
version: 2
status: current
cadence: 90d
last_researched: 2026-06-20
---

# Widgets

> A fixture stance for testing archived versions and history.

## Overview

Live v2 body content — the current essay text.
"""

CHANGELOG_MD = """# Widgets — Changelog

## v2 — 2026-06-20

**What moved:** the fixture stance evolved.

**What it means:** fixture prose describing the change.

**Stance:** held — the stance held from v1 to v2.

## v1 — 2026-01-10

Founding note fixture — the initial widgets stance.
"""


def _write_version(versions_dir: Path, n: int, cut: str, body: str, source_label: str) -> None:
    version_dir = versions_dir / f"v{n}"
    version_dir.mkdir(parents=True)
    (version_dir / "article.md").write_text(f"---\nversion: {n}\ncut: {cut}\n---\n\n# Widgets\n\n{body}\n")
    (version_dir / "provenance.md").write_text(
        f"## Sources\n\n- [{source_label}](https://example.com/{source_label.lower().replace(' ', '-')})"
        f" — accessed {cut} — supports: the v{n} fixture claim.\n\n"
        f"## Synthesis\n\n- The v{n} fixture synthesis claim.\n"
    )


def _skill_md(article_version: int) -> str:
    return (
        "---\n"
        f"name: {SLUG}\n"
        "description: >\n"
        "  Fixture companion skill for the widgets topic — Slice 3.2's\n"
        "  2-version fixture tree (test_topic_versions_fixture.py).\n"
        f"article_version: {article_version}\n"
        "---\n\n"
        "# Widgets — Companion Skill (fixture)\n\n"
        "Fixture payload; not a real companion skill.\n"
    )


def _write_skill(skill_dir: Path, article_version: int, content: str | None = None) -> str:
    """Writes `skill_dir/SKILL.md`, returning the exact text written so a
    caller can hand it to a later `_write_skill` call for a byte-identical
    copy (`runPublishGate`'s `skill-byte-identical` check)."""
    skill_dir.mkdir(parents=True, exist_ok=True)
    md = content if content is not None else _skill_md(article_version)
    (skill_dir / "SKILL.md").write_text(md)
    return md


@pytest.fixture(scope="module")
def widgets_fixture_build():
    """Builds a 2-version fixture topic via STAYCURRENT_REPO_ROOT, backing up
    and restoring services/site/out/ around the build (test_slice_10's
    pattern) — one build shared by every test below."""
    with tempfile.TemporaryDirectory(prefix="staycurrent-slice11-fixture-") as tmp:
        tmp_path = Path(tmp)
        fixture_root = tmp_path / "fixture-root"
        topic_dir = fixture_root / "topics" / SLUG
        topic_dir.mkdir(parents=True)
        (fixture_root / "site.config.json").write_text(json.dumps(FIXTURE_SITE_CONFIG))
        (topic_dir / "article.md").write_text(ARTICLE_MD)
        (topic_dir / "changelog.md").write_text(CHANGELOG_MD)
        versions_dir = topic_dir / "versions"
        _write_version(versions_dir, 1, "2026-01-10", "Archived v1 body content — the frozen text.", "Fixture Source V1")
        _write_version(versions_dir, 2, "2026-06-20", "Live v2 body content — the current essay text.", "Fixture Source V2")

        # Gate-plausible skill payloads: the live skill/SKILL.md at the
        # current article_version (2), byte-identical to versions/v2/skill/
        # (runPublishGate's skill-byte-identical check only ever compares the
        # live payload against the CURRENT version's frozen copy) plus v1's
        # own frozen snapshot (checked for mere existence by
        # snapshot-complete, never byte-compared since it isn't the current
        # version). Without these, `runPublishGate(topic_dir)` would fail —
        # and Slice 3.3's site build is expected to read skill payloads for
        # every topic, which would otherwise break this fixture once it lands.
        live_skill_md = _write_skill(topic_dir / "skill", 2)
        _write_skill(versions_dir / "v2" / "skill", 2, content=live_skill_md)
        _write_skill(versions_dir / "v1" / "skill", 1)

        out_existed_before = OUT_DIR.exists()
        out_backup = tmp_path / "out-backup"
        if out_existed_before:
            shutil.copytree(OUT_DIR, out_backup)

        # The prebuild script rmSync's and rewrites the REAL
        # services/site/public/rss.xml + public/skills/ on every `pnpm build`
        # (CONFIRMED pollution: left unrestored, the fixture's rss.xml/skill
        # payloads sit in public/ — and get picked up by the NEXT real
        # build's output — until a real build overwrites them again). Back
        # these up and restore them exactly like out/ above.
        rss_existed_before = RSS_PATH.exists()
        rss_backup = tmp_path / "rss-backup.xml"
        if rss_existed_before:
            shutil.copy2(RSS_PATH, rss_backup)

        skills_existed_before = SKILLS_DIR.exists()
        skills_backup = tmp_path / "skills-backup"
        if skills_existed_before:
            shutil.copytree(SKILLS_DIR, skills_backup)

        try:
            # Turbopack's persistent cache (services/site/.next/) does not
            # treat STAYCURRENT_REPO_ROOT as a cache key: a prior build against
            # a DIFFERENT root (the real topics/ tree, or an earlier fixture)
            # can get reused wholesale for a route Turbopack believes is
            # unchanged, silently shipping stale HTML/CSS for this fixture
            # instead of a fresh build (CONFIRMED — a stale cache reused an
            # older `.archived-banner.is-condensed` rule under fix 6c's own
            # measurement test). A clean cache makes this build deterministic.
            shutil.rmtree(SITE_DIR / ".next", ignore_errors=True)
            env = {**os.environ, "STAYCURRENT_REPO_ROOT": str(fixture_root)}
            result = subprocess.run(
                ["pnpm", "build"], cwd=SITE_DIR, env=env, capture_output=True, text=True, timeout=180
            )
            assert result.returncode == 0, (
                f"expected `pnpm build` to succeed against the 2-version widgets fixture root.\n"
                f"{result.stdout}\n{result.stderr}"
            )
            yield OUT_DIR
        finally:
            if out_existed_before:
                shutil.rmtree(OUT_DIR, ignore_errors=True)
                shutil.copytree(out_backup, OUT_DIR)
            else:
                # No real build pre-existed at out/ — leaving the fixture's
                # build sitting there would plant fixture content as if it
                # were a real build for every OTHER test that reads out/.
                shutil.rmtree(OUT_DIR, ignore_errors=True)

            if rss_existed_before:
                shutil.copy2(rss_backup, RSS_PATH)
            else:
                RSS_PATH.unlink(missing_ok=True)

            if skills_existed_before:
                shutil.rmtree(SKILLS_DIR, ignore_errors=True)
                shutil.copytree(skills_backup, SKILLS_DIR)
            else:
                shutil.rmtree(SKILLS_DIR, ignore_errors=True)


def test_config_driven_origin_flows_into_the_install_one_liner_and_the_rss_feed(widgets_fixture_build):
    """Now that services/site fails closed on a missing site.config.json
    (RC1: "no instance value is hardcoded in services/site") instead of
    degrading to a hardcoded default, a page or feed carrying the fixture's
    OWN url proves the config actually flowed through the build — not merely
    that the build produced SOME url, which a reintroduced hardcoded default
    would also satisfy indistinguishably."""
    skill_html = (widgets_fixture_build / SLUG / "skill" / "index.html").read_text()
    assert f"{FIXTURE_SITE_CONFIG['url']}/skills/{SLUG}.zip" in skill_html, (
        "expected the install one-liner to be built from this fixture's OWN "
        "site.config.json url, not a hardcoded engine default"
    )

    rss_xml = (widgets_fixture_build / "rss.xml").read_text()
    assert FIXTURE_SITE_CONFIG["url"] in rss_xml, (
        "expected rss.xml's channel/item links to carry this fixture's OWN "
        "site.config.json url, not a hardcoded engine default"
    )


def test_archived_version_renders_the_frozen_snapshot_with_superseded_banner_and_skill_pointer(
    widgets_fixture_build,
):
    html = (widgets_fixture_build / SLUG / "v" / "1" / "index.html").read_text()

    assert "Archived v1 body content" in html, "expected the frozen v1 article text, not the live v2 body"
    assert "Live v2 body content" not in html, "the archived v1 page must not render the live v2 text"

    # Archived banner: "You're reading v1 ... current version is v2".
    assert "You&#x27;re reading" in html or "You're reading" in html
    assert "v1" in html and "v2" in html

    # Superseded-skill pointer, the honesty-state copy verbatim.
    assert "Install the current version instead" in html
    assert "/skills/widgets/v/1/" in html
    assert "/widgets/skill/" in html

    # The archived snapshot's OWN provenance (v1's claim), not the live v2's.
    assert "v1 fixture claim" in html
    assert "v2 fixture claim" not in html


def test_current_version_route_is_the_redirect_stub_for_a_multi_version_topic(widgets_fixture_build):
    html = (widgets_fixture_build / SLUG / "v" / "2" / "index.html").read_text()

    assert 'http-equiv="refresh"' in html
    assert 'content="0; url=/widgets/"' in html
    assert "v2 is the current version" in html
    assert 'href="/widgets/"' in html


def test_history_table_marks_the_current_row_and_the_superseded_row_distinctly(widgets_fixture_build):
    html = (widgets_fixture_build / SLUG / "history" / "index.html").read_text()

    assert "v2" in html and "v1" in html
    assert "current" in html.lower()
    assert "archived" in html.lower()
    assert "/widgets/skill/" in html, "expected the current row's skill link straight to /[topic]/skill/"
    assert "/skills/widgets/v/1/" in html, "expected the superseded row's archived-payload link"
    assert "held" in html, "expected the v2 row's stance (held, from the changelog) in the ledger"


def test_changelog_page_lists_both_versions_newest_first(widgets_fixture_build):
    html = (widgets_fixture_build / SLUG / "changelog" / "index.html").read_text()

    assert 'id="v2"' in html and 'id="v1"' in html
    assert html.index('id="v2"') < html.index('id="v1"'), "expected v2 (newest) before v1 in document order"
    assert "the fixture stance evolved" in html
    assert "Founding note fixture" in html

    # The TOC rail's own href="#vN" entries must resolve to these same
    # <h2 id="vN"> anchors — test_topic_trust_routes.py's changelog test pins
    # this for the real (single-version) databases tree's #v1 alone; this
    # multi-version fixture is what proves the v2 -> v1 correspondence holds.
    assert 'href="#v2"' in html
    assert 'href="#v1"' in html


def test_archived_version_page_is_axe_clean(widgets_fixture_build, cluster, site_page: Page):
    """The archived banner + superseded-skill pointer are new structural
    surfaces this slice introduces — swept here (routes.json can't carry the
    fixture-only /widgets/v/1/ path, and the real single-version /databases/
    tree never reaches this state)."""
    site_page.goto(f"/{SLUG}/v/1/", wait_until="load")

    AXE_CDN_URL = "https://cdn.jsdelivr.net/npm/axe-core@4.10.2/axe.min.js"
    try:
        site_page.add_script_tag(url=AXE_CDN_URL)
    except Exception as exc:  # noqa: BLE001 — any injection failure means no scan
        pytest.skip(f"axe-core CDN unreachable, a11y scan skipped: {exc}")

    results = site_page.evaluate("() => axe.run(document, { resultTypes: ['violations'] })")
    critical = [v for v in results.get("violations", []) if v.get("impact") == "critical"]
    assert not critical, (
        "axe-core found CRITICAL accessibility violations on the archived version page:\n  "
        + "\n  ".join(f"{v['id']}: {v['help']}" for v in critical)
    )


def test_widgets_fixture_pages_exercise_the_shared_page_object_and_stay_console_clean(
    widgets_fixture_build, cluster, site_page: Page, surfaces
):
    """Drives `/widgets/v/1/` and `/widgets/history/` through the four
    page-object methods no other test exercises yet
    (`TopicVersionPage.expect_archived_banner` / `expect_frozen_article_text` /
    `expect_superseded_skill_pointer`, `TopicHistoryPage.expect_superseded_row`),
    with the console-error capture convention `test_a11y_smoke.py` uses:
    severe console errors and uncaught page errors both fail the test."""
    console_errors: list[str] = []
    site_page.on(
        "console",
        lambda msg: console_errors.append(msg.text) if msg.type == "error" else None,
    )
    site_page.on("pageerror", lambda exc: console_errors.append(f"pageerror: {exc}"))

    version_page = TopicVersionPage(site_page, surfaces["site"]["reach"])
    version_page.goto(f"/{SLUG}/v/1/").expect_archived_banner(1, 2).expect_frozen_article_text(
        "Archived v1 body content"
    ).expect_superseded_skill_pointer(SLUG, 1)

    history_page = TopicHistoryPage(site_page, surfaces["site"]["reach"])
    history_page.goto(f"/{SLUG}/history/").expect_superseded_row("v1", SLUG, 1)

    assert not console_errors, (
        "widgets fixture pages emitted severe console errors:\n  " + "\n  ".join(console_errors)
    )


def test_archived_banner_condenses_to_exactly_32px_tall(widgets_fixture_build, cluster, site_page: Page, surfaces):
    """Fix 6c (doc-shell.css): the Archived Version micro-polish spec commits
    "32px tall" for the condensed banner twice — pin the real rendered height
    against the actual mono webfont's metrics, not a padding/line-height
    calculation on paper."""
    # A short viewport so the fixture's fairly brief archived-version content
    # genuinely exceeds one viewport height — the condense threshold compares
    # actual scrollY against actual innerHeight, so scrollTo can't fake past
    # it on a page that never grows scrollable at a tall viewport.
    site_page.set_viewport_size({"width": 1280, "height": 400})
    version_page = TopicVersionPage(site_page, surfaces["site"]["reach"])
    version_page.goto(f"/{SLUG}/v/1/")
    site_page.wait_for_load_state("networkidle")

    site_page.evaluate("window.scrollTo(0, window.innerHeight + 200)")
    banner = site_page.locator(".archived-banner.is-condensed")
    expect(banner).to_be_visible()
    # Auto-retrying (not a single bounding_box() snapshot): the class swap
    # lands via a React state update off a scroll event, so a one-shot
    # measurement can transiently race a re-render — to_have_css polls the
    # resolved style until it settles or the default timeout elapses, which
    # is what actually makes this deterministic.
    expect(banner).to_have_css("height", "32px")


def test_archived_skill_payload_tree_and_zip_are_byte_identical_and_carry_the_version_binding(
    widgets_fixture_build,
):
    """The distribution contract's archived half (03-api-design.md): every
    version below the live one gets its own browsable tree AND zip under
    `public/skills/<slug>/v/<n>/`. The repository's own single-version
    `databases` topic never exercises this archived branch of
    `scripts/prebuild.mjs`'s materialization loop at all — only a >= 2-version
    fixture does."""
    tree_skill_md_path = widgets_fixture_build / "skills" / SLUG / "v" / "1" / "SKILL.md"
    assert tree_skill_md_path.exists(), (
        f"expected the browsable archived skill tree at {tree_skill_md_path}"
    )
    tree_skill_md = tree_skill_md_path.read_text()
    assert "article_version: 1" in tree_skill_md

    zip_path = widgets_fixture_build / "skills" / SLUG / "v" / "1.zip"
    assert zip_path.exists(), f"expected the archived skill zip at {zip_path}"
    with zipfile.ZipFile(zip_path) as zf:
        names = zf.namelist()
        assert all(n.startswith(f"{SLUG}/") for n in names), (
            "expected a single top-level <slug>/ directory in the archived zip too — "
            "never loose files at the archive root"
        )
        zip_skill_md = zf.read(f"{SLUG}/SKILL.md").decode()

    assert zip_skill_md == tree_skill_md, (
        "expected the browsable v/1 tree's SKILL.md bytes to equal the zip's — both "
        "sourced directly from the same gate-validated versions/v1/skill/ snapshot, "
        "never re-derived"
    )
