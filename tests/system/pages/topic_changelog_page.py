"""Page object for `/<topic>/changelog/` — Changelog (01-ui-design.md)."""

from playwright.sync_api import expect

from .base_page import BasePage


class TopicChangelogPage(BasePage):
    """A topic's append-only changelog timeline."""

    def expect_entry_permalink(self, version: int) -> "TopicChangelogPage":
        """Assert the entry's `#vN` permalink anchor (its `<h2 id="vN">`) exists."""
        expect(self.page.locator(f"h2#v{version}")).to_be_visible()
        return self

    def expect_entry_prose(self, text: str) -> "TopicChangelogPage":
        """Assert the entry's rendered prose is visible somewhere on the page."""
        expect(self.page.locator("body")).to_contain_text(text)
        return self

    def click_entry_permalink(self, version: int) -> "TopicChangelogPage":
        """Click the quiet `#vN` anchor at the entry heading's right edge
        (the permalink affordance)."""
        self.page.get_by_role("link", name=f"Permalink to v{version}").click()
        return self
