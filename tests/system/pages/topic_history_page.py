"""Page object for `/<topic>/history/` — Version History."""

from playwright.sync_api import expect

from .base_page import BasePage


class TopicHistoryPage(BasePage):
    """The full version ledger, one row per cut."""

    def _row(self, version_text: str):
        """The `<tr>` whose version chip is exactly `version_text` (e.g. 'v1')."""
        return self.page.locator("tr").filter(has=self.page.get_by_role("link", name=version_text, exact=True))

    def expect_current_row(self, version_text: str) -> "TopicHistoryPage":
        """Assert the row for the live version is labelled `current`."""
        row = self._row(version_text)
        expect(row).to_contain_text("current")
        return self

    def expect_superseded_row(self, version_text: str) -> "TopicHistoryPage":
        """Assert a superseded row is labelled `archived` — the text label
        that pairs with the chip's accent so the state never rides on colour
        alone."""
        row = self._row(version_text)
        expect(row).to_contain_text("archived")
        return self
