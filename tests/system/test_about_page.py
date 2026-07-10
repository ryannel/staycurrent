"""About interface test (01-ui-design.md, `/about/` — About) — Slice 2.3
(library-about-404, bet first-living-topic).

`/about/` has no interactive behaviour beyond standard in-body link hover
(shared rules) and no data dependency (Static state, always) — a11y/render/
layout/token coverage comes for free via `tests/system/routes.json` (this
slice registers `/about/`); this pins the one page-specific behaviour those
generic gates don't: the actual prose renders.
"""

from playwright.sync_api import Page

from pages.about_page import AboutPage


def test_about_page_renders_how_a_living_article_works(cluster, site_page: Page, surfaces):
    about = AboutPage(site_page, surfaces["site"]["reach"])
    about.goto("/about/").expect_how_it_works_prose()
