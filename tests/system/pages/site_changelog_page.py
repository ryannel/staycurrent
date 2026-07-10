"""Page object for `/changelog/` — Site-Wide Changelog (01-ui-design.md)."""

from playwright.sync_api import expect

from .base_page import BasePage


class SiteChangelogPage(BasePage):
    """The cross-topic feed, every topic's entries merged newest-first."""

    def expect_topic_entry(self, topic_title: str) -> "SiteChangelogPage":
        expect(self.page.locator(".changelog-card", has_text=topic_title)).to_be_visible()
        return self

    def expect_read_entry_link(self, slug: str, version: int) -> "SiteChangelogPage":
        """Assert a "Read entry →" link points into the topic's own changelog
        permalink — in the page content, not the sidebar."""
        # Anchor-exact (`$=`, "ends with") rather than a bare substring
        # (`*=`) match on 'v{version}': a substring match on e.g. 'v1' would
        # also satisfy an href ending in 'v10', 'v11', etc. — anchoring on
        # the full '#vN' permalink suffix is what actually pins the version.
        link = self.page.locator(f"main a[href*='/{slug}/changelog/'][href$='#v{version}']")
        expect(link).to_be_visible()
        return self
