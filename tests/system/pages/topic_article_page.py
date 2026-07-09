"""Page object for `/<topic>/` — the Living Article (01-ui-design.md).

Helpers are content-based (element/attribute/text), never style-based, so they
keep working across Milestone 3's restyle of the shell around this
content-bearing core (the same content that renders today under a bare shell).
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
