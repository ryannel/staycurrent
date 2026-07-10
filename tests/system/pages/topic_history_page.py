"""Page object for `/<topic>/history/` — Version History (01-ui-design.md)."""

from playwright.sync_api import expect

from .base_page import BasePage


class TopicHistoryPage(BasePage):
    """The full version ledger, one row per cut."""

    def _row(self, version_text: str):
        """The `<tr>` whose version chip is exactly `version_text` (e.g. 'v1')."""
        return self.page.locator("tr").filter(has=self.page.get_by_role("link", name=version_text, exact=True))

    def expect_current_row(self, version_text: str, slug: str) -> "TopicHistoryPage":
        """Assert the current row is labelled as such and its skill link points
        straight at `/[topic]/skill/` (not an archived payload)."""
        row = self._row(version_text)
        expect(row).to_contain_text("current")
        expect(row.locator(f"a[href*='/{slug}/skill/']")).to_be_visible()
        return self

    def expect_superseded_row(self, version_text: str, slug: str, version: int) -> "TopicHistoryPage":
        """Assert a superseded row carries the honesty microcopy and links the
        archived skill payload at `/skills/<slug>/v/<n>/`."""
        row = self._row(version_text)
        expect(row).to_contain_text("archived")
        expect(row).to_contain_text(f"renders v{version}")
        expect(row.locator(f"a[href='/skills/{slug}/v/{version}/']")).to_be_visible()
        return self
