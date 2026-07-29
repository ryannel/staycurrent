"""Milestone 2 (a reader sees the catalogue take shape) — front-door
bet-progress test. Traces to the milestone's own Acceptance criteria and
Proof of work
(docs/bets/databases-catalogue/decomposition/02-pilot-catalogue-live/index.md):
drives the library, sidebar, hub-rollup, and reading-rail views in
01-ui-design.md over the contract Milestone 1 proved, against the real
`topics/` tree — `databases` (v5, the hub) and `query-execution` (v1, the
pilot foundation), a genuine cut through create/gate/cut, never a fixture
standing in for it.

Driven off the `cluster`-gated `site_page` fixture (tests/conftest.py)
against the built static export the runner serves at http://localhost:4173,
same convention as `test_topic_article.py`/`test_topic_library.py`. Assertions
read live state from `topics/` (via `topic_state.py` and the helpers below)
rather than pinning today's numbers, so this test tracks the real tree
instead of going stale the moment either topic cuts again.
"""

from __future__ import annotations

import re
from pathlib import Path

import yaml
from playwright.sync_api import Page, expect

from pages.topic_version_page import TopicVersionPage
from topic_state import live_topic_version, topic_frontmatter

REPO_ROOT = Path(__file__).resolve().parents[2]
FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n", re.DOTALL)

HUB_SLUG = "databases"
PILOT_SLUG = "query-execution"

MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def _current_cut_date(slug: str) -> str:
    """The CURRENT version's `cut` date (ISO `YYYY-MM-DD`) for `slug` — read
    from `topics/<slug>/versions/v<N>/article.md`, the same source
    `getTopicCutDate` reads, never `last_researched`. Normalized to a plain
    string regardless of whether PyYAML resolves the bare scalar to a
    `datetime.date` (its default behaviour) or leaves it a string."""
    version = topic_frontmatter(slug)["version"]
    text = (REPO_ROOT / "topics" / slug / "versions" / f"v{version}" / "article.md").read_text()
    m = FRONTMATTER_RE.match(text)
    assert m, f"topics/{slug}/versions/v{version}/article.md has no frontmatter block"
    data = yaml.safe_load(m.group(1)) or {}
    cut = data["cut"]
    return cut.isoformat() if hasattr(cut, "isoformat") else str(cut)


def _format_display_date(iso_date: str) -> str:
    """Mirrors `lib/format-date.ts`'s `formatDisplayDate` exactly: "2026-07-29" -> "29 Jul 2026"."""
    year, month, day = (int(part) for part in iso_date.split("-"))
    return f"{day} {MONTHS[month - 1]} {year}"


def _most_recently_cut() -> dict:
    """Mirrors `summarizeCatalogueFreshness`'s own tie-break (latest
    `cutDate`, ties broken by slug ascending) over the area's two live
    members — computed dynamically so this assertion tracks whichever topic
    is genuinely most recent, rather than pinning today's answer as a
    literal that goes stale the next time either topic cuts."""
    candidates = [
        {"slug": HUB_SLUG, "title": "Databases", "cut_date": _current_cut_date(HUB_SLUG)},
        {"slug": PILOT_SLUG, "title": "Query Execution", "cut_date": _current_cut_date(PILOT_SLUG)},
    ]
    winner = candidates[0]
    for candidate in candidates[1:]:
        if candidate["cut_date"] > winner["cut_date"]:
            winner = candidate
        elif candidate["cut_date"] == winner["cut_date"] and candidate["slug"] < winner["slug"]:
            winner = candidate
    return {**winner, "display_date": _format_display_date(winner["cut_date"])}


# --- (a) `/` — grouped library and sidebar --------------------------------


def test_library_shows_the_databases_area_heading_hub_card_and_foundations_group(
    cluster, site_page: Page, surfaces
):
    """01-ui-design.md, "Topic Library and Sidebar — Databases-Area
    Grouping": the "Databases" area heading, the hub card standalone ahead
    of the registers, and a Foundations group whose one live card is Query
    Execution."""
    site_page.goto("/", wait_until="load")

    # The area heading — the first h2 this page has ever carried.
    expect(site_page.get_by_role("heading", level=2, name="Databases")).to_be_visible()

    # The hub, standalone, its own card ahead of both registers.
    hub_card = site_page.locator(".topic-card").filter(has=site_page.get_by_text("Databases", exact=True))
    expect(hub_card).to_be_visible()
    expect(hub_card.get_by_role("heading", level=3, name="Databases")).to_be_visible()

    # The Foundations register group and its one live member.
    foundations_group = site_page.locator(".library-register-group").filter(
        has=site_page.get_by_text("Foundations", exact=True)
    )
    expect(foundations_group).to_be_visible()
    expect(
        foundations_group.locator(".topic-card").get_by_role("heading", level=3, name="Query Execution")
    ).to_be_visible()

    # No Profiles register has cut yet — absence is the resting state, no
    # empty "Profiles" placeholder.
    expect(site_page.get_by_text("Profiles", exact=True)).to_have_count(0)


def test_sidebar_shows_the_grouped_tree_with_the_single_node_movement_divider_and_count(
    cluster, site_page: Page, surfaces
):
    """Same view, the sidebar tree half: two-level grouping (area -> register
    -> movement), the SINGLE NODE movement divider (CSS-uppercased; the
    frontmatter-authored text is "Single Node"), and the Foundations group's
    trailing "(1)" count — one live foundation."""
    site_page.goto("/", wait_until="load")

    sidebar = site_page.locator(".sidebar")

    # The area label — the catalogue's own `area` string, not a hardcoded "Topics".
    expect(sidebar.get_by_text("databases", exact=True)).to_be_visible()

    # The Foundations register group and its trailing mono count.
    foundations_group = sidebar.locator(".register-group-disclosure").filter(
        has=site_page.get_by_text("Foundations", exact=True)
    )
    expect(foundations_group).to_be_visible()
    expect(foundations_group.locator(".register-group-count")).to_have_text("(1)")

    # The movement divider, sidebar-only, non-interactive but not hidden
    # from assistive tech.
    divider = foundations_group.locator(".movement-divider")
    expect(divider).to_have_text("Single Node")
    expect(divider).not_to_have_attribute("aria-hidden", "true")

    # The one live foundation itself, nested inside the movement.
    expect(foundations_group.get_by_text("Query Execution", exact=True)).to_be_visible()

    # No Profiles group has cut yet.
    expect(sidebar.get_by_text("Profiles", exact=True)).to_have_count(0)


# --- (b) `/query-execution/` — the reading-order rail ----------------------


def test_query_execution_reading_rail_states_derived_position_with_no_read_first_line(
    cluster, site_page: Page, surfaces
):
    """01-ui-design.md, "Foundation Reading-Order and Prereqs": the header
    rail states movement, position in the full path, and position within
    the movement — derived from the live sweep at catalogue-of-one scale
    ("piece 1 of 1 · 1st of 1 in this movement"), never authored. No "Read
    first" line, since query-execution authors no prereqs yet — absence,
    not a placeholder."""
    site_page.goto(f"/{PILOT_SLUG}/", wait_until="load")

    rail_header = site_page.get_by_role("navigation", name="Reading path position")
    expect(rail_header).to_be_visible()
    expect(rail_header).to_contain_text("Single Node")
    expect(rail_header).to_contain_text("piece 1 of 1")
    expect(rail_header).to_contain_text("1st of 1 in this movement")

    expect(rail_header.get_by_text("Read first", exact=False)).to_have_count(0)


def test_query_execution_reading_rail_footer_continues_back_to_the_hub(cluster, site_page: Page, surfaces):
    """The footer "Continue" pointer — resolved header-and-footer,
    unconditionally (01-ui-design.md). There is no second foundation on the
    path yet, so `next` is null and the pointer redirects to the hub rather
    than disappearing, exactly the "last piece" behaviour at catalogue-of-one
    scale."""
    site_page.goto(f"/{PILOT_SLUG}/", wait_until="load")

    rail_footer = site_page.get_by_role("navigation", name="Continue reading")
    expect(rail_footer).to_be_visible()

    continue_link = rail_footer.get_by_role("link", name=re.compile("back to the chooser and map"))
    expect(continue_link).to_be_visible()
    expect(continue_link).to_have_attribute("href", f"/{HUB_SLUG}/")


# --- (c) `/databases/` — the freshness rollup band --------------------------


def test_databases_rollup_band_shows_the_true_live_count_and_most_recent_cut(cluster, site_page: Page, surfaces):
    """01-ui-design.md, "The `/databases` Hub — Chooser and Map": the
    Catalogue Freshness Rollup states the area's true live count — 2 pieces,
    the hub plus the one pilot foundation, never a hardcoded total — and
    names whichever topic genuinely cut most recently, read dynamically from
    the real tree so this assertion survives either topic's next cut."""
    site_page.goto(f"/{HUB_SLUG}/", wait_until="load")

    rollup = site_page.locator(".instrumentation-strip").filter(has_text="Across the catalogue")
    expect(rollup).to_be_visible()
    expect(rollup).to_contain_text("2 pieces")

    most_recent = _most_recently_cut()
    expect(rollup.get_by_role("link", name=most_recent["title"])).to_be_visible()
    expect(rollup).to_contain_text(most_recent["display_date"])


# --- (d) `/databases/v/4/` — archived v4, live v5 standing current ---------


def test_databases_v4_still_renders_archived_with_the_live_version_standing_current(
    cluster, site_page: Page, surfaces
):
    """Retro item R3 (pitch.md), closed at the first opportunity per the
    milestone: after the `databases` v5 metadata cut (this program's first
    cut), `/databases/v/4/` still renders the frozen v4 snapshot — never a
    redirect, never silently missing — with the archived banner naming both
    v4 and the live current version."""
    current_version = live_topic_version(HUB_SLUG)
    assert current_version > 4, (
        f"expected the live {HUB_SLUG} version to be > 4 so /{HUB_SLUG}/v/4/ is "
        f"a genuinely ARCHIVED route rather than the current-version redirect "
        f"stub; got v{current_version}"
    )

    version_page = TopicVersionPage(site_page, surfaces["site"]["reach"])
    version_page.goto(f"/{HUB_SLUG}/v/4/").expect_archived_banner(4, current_version).expect_frozen_article_text(
        "a data structure you rent over a network"
    )
