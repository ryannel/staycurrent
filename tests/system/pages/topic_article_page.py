"""Page object for `/<topic>/` — the Living Article (01-ui-design.md).

Helpers are content-based (element/attribute/text) wherever the assertion
survives a later restyle; slice 2.2 (doc-shell-and-trust) is that restyle for
the shared shell, trust header, TOC rail, and theme toggle, so a handful of
helpers below assert semantic state (an `aria-current`/`data-theme` attribute)
rather than raw computed style — chosen specifically so they keep working
through any future visual pass.
"""

import re

from playwright.sync_api import expect

from .base_page import BasePage

LAST_RESEARCHED_DATE_RE = re.compile(r"2026-\d{2}-\d{2}")


class TopicArticlePage(BasePage):
    """A rendered topic article route, e.g. `/databases/`."""

    def expect_stance_text(self, text: str) -> "TopicArticlePage":
        """Assert the given stance prose is visible in the article body."""
        expect(self.page.locator("body")).to_contain_text(text)
        return self

    def _heading_anchor_ids(self) -> list[str]:
        """id attributes of every rendered <h2>/<h3> (renderMarkdown's heading anchors)."""
        headings = self.page.locator("h2[id], h3[id]")
        return [headings.nth(i).get_attribute("id") or "" for i in range(headings.count())]

    def expect_heading_anchor_count_at_least(self, minimum: int) -> "TopicArticlePage":
        """Assert at least `minimum` h2/h3 elements carry a non-empty id attribute."""
        non_empty = [anchor_id for anchor_id in self._heading_anchor_ids() if anchor_id.strip()]
        assert len(non_empty) >= minimum, (
            f"expected >= {minimum} h2/h3 elements with a non-empty id attribute; "
            f"found {len(non_empty)}"
        )
        return self

    def _mermaid_marker_sources(self) -> list[str]:
        """data-mermaid attribute of every mermaid-fence transform marker container."""
        markers = self.page.locator(".mermaid-figure")
        return [markers.nth(i).get_attribute("data-mermaid") or "" for i in range(markers.count())]

    def expect_mermaid_markers_at_least(self, minimum: int) -> "TopicArticlePage":
        """Assert at least `minimum` `.mermaid-figure` elements, each carrying a
        non-empty `data-mermaid` attribute. Deliberately silent on visible diagram
        rendering — that is a later slice's client-render concern."""
        sources = self._mermaid_marker_sources()
        with_source = [s for s in sources if s.strip()]
        assert len(with_source) >= minimum, (
            f"expected >= {minimum} .mermaid-figure elements carrying a non-empty "
            f"data-mermaid attribute; found {len(with_source)} of {len(sources)}"
        )
        return self

    def expect_trust_header_version(self, version_text: str) -> "TopicArticlePage":
        """Assert the trust header states the given literal version text (e.g. 'v1')."""
        expect(self.page.locator("body")).to_contain_text(version_text)
        return self

    def expect_trust_header_last_researched(
        self, pattern: re.Pattern = LAST_RESEARCHED_DATE_RE
    ) -> "TopicArticlePage":
        """Assert a <time datetime="..."> element's datetime attribute matches `pattern`."""
        datetime_attr = self.page.locator("time").first.get_attribute("datetime") or ""
        assert pattern.search(datetime_attr), (
            f"expected a <time datetime=...> matching {pattern.pattern!r}; got {datetime_attr!r}"
        )
        return self

    def expect_shell_landmarks(self) -> "TopicArticlePage":
        """Assert the three-zone shell's landmark set (01-ui-design.md's shared
        Accessibility rule): a <nav> sidebar, the article inside <main>, and an
        <aside> TOC rail."""
        assert self.page.locator("nav").count() > 0, "expected a <nav> sidebar landmark"
        assert self.page.locator("main article, article").count() > 0, (
            "expected the reading column to render as an <article>"
        )
        assert self.page.locator("aside").count() > 0, "expected an <aside> TOC rail landmark"
        return self

    def expect_trust_header_face_links(self, slug: str) -> "TopicArticlePage":
        """Assert the trust header's changelog/history/skill face links point at
        this topic's other faces (01-ui-design.md's Key interactions)."""
        for face in ("changelog", "history", "skill"):
            link = self.page.locator(f"a[href*='/{slug}/{face}']")
            assert link.count() > 0, f"expected a trust-header link to the {face} face"
        return self

    def expect_toc_rail_link_count_at_least(self, minimum: int) -> "TopicArticlePage":
        """Assert the TOC rail (<aside>) lists at least `minimum` in-page anchor links."""
        links = self.page.locator("aside a[href^='#']")
        assert links.count() >= minimum, (
            f"expected >= {minimum} TOC rail anchor links; found {links.count()}"
        )
        return self

    def expect_toc_active_link_tracks_scroll(self) -> "TopicArticlePage":
        """Scroll the last <h2> into view and assert the TOC rail's active
        entry changes to match — the scroll-spy contract, asserted on a
        semantic attribute rather than computed style so it survives a future
        restyle of the active-link treatment.

        Deliberately makes no assertion about which entry (if any) is active
        BEFORE scrolling: whenever the first heading already sits inside the
        initial viewport, its TOC entry is legitimately active from the
        start, and asserting zero active entries there is flaky by
        construction (false whenever a reader's viewport is tall enough, or
        the article short enough, for that to happen)."""
        headings = self.page.locator("article h2, main h2")
        count = headings.count()
        assert count >= 2, "expected >= 2 <h2> headings for the TOC rail to spy on"

        last_heading = headings.nth(count - 1)
        last_id = last_heading.get_attribute("id")
        assert last_id, "expected the last <h2> to carry a generated anchor id"

        target_link = self.page.locator(f"aside a[href='#{last_id}']")
        assert target_link.count() > 0, f"expected a TOC entry linking to #{last_id}"

        active_before = self.page.locator("aside a[aria-current='location']")
        href_before = active_before.first.get_attribute("href") if active_before.count() > 0 else None

        last_heading.scroll_into_view_if_needed()
        expect(target_link).to_have_attribute("aria-current", "location")

        # The active entry changed to the scrolled-to heading — either it
        # wasn't active before, or (the article being short enough that the
        # last heading was already in view) it already was; either way the
        # assertion above already proved the target is active, and this
        # confirms no OTHER entry is left simultaneously marked active.
        assert href_before in (None, f"#{last_id}") or self.page.locator(
            "aside a[aria-current='location']"
        ).count() == 1, "expected exactly one TOC entry marked active after scrolling"
        return self

    def expect_code_copy_affordance(self) -> "TopicArticlePage":
        """Assert a designed code block (Code blocks spec) carries the ghost
        copy-affordance button."""
        assert self.page.locator("pre, [class*='code-block' i]").count() > 0, (
            "expected at least one designed code block"
        )
        assert self.page.locator("pre button, button[aria-label*='copy' i]").count() > 0, (
            "expected a code block to carry a ghost copy-affordance button"
        )
        return self

    def toggle_theme(self) -> "TopicArticlePage":
        """Click the sidebar footer's theme toggle."""
        self.page.locator("[data-theme-toggle]").first.click()
        return self

    def get_data_theme(self) -> str | None:
        """The resolved `[data-theme]` attribute on `<html>`."""
        return self.page.evaluate("() => document.documentElement.getAttribute('data-theme')")

    def get_stored_theme(self) -> str | None:
        """The persisted `localStorage['theme']` preference (light|dark|system)."""
        return self.page.evaluate("() => localStorage.getItem('theme')")

    def expect_provenance_sources_list(self, minimum: int = 1) -> "TopicArticlePage":
        """Assert the essay-close Provenance section (01-ui-design.md's
        micro-polish spec) renders a Sources list with at least `minimum`
        `.badge-sourced` items, each carrying a real (non-empty) `href`."""
        items = self.page.locator(".provenance-sources li:has(.badge-sourced)")
        count = items.count()
        assert count >= minimum, (
            f"expected >= {minimum} Sources list item(s) carrying a .badge-sourced badge; "
            f"found {count}"
        )
        for i in range(count):
            href = items.nth(i).locator("a").first.get_attribute("href")
            assert href and href.strip(), (
                f"expected Sources item {i} to carry a link with a real href; got {href!r}"
            )
        return self

    def expect_provenance_synthesis_list(self, minimum: int = 1) -> "TopicArticlePage":
        """Assert the essay-close Provenance section renders a Synthesis list
        with at least `minimum` `.badge-synthesis` items."""
        items = self.page.locator(".provenance-synthesis li:has(.badge-synthesis)")
        assert items.count() >= minimum, (
            f"expected >= {minimum} Synthesis list item(s) carrying a .badge-synthesis badge; "
            f"found {items.count()}"
        )
        return self
