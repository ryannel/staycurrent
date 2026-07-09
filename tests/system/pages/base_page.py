"""Minimal page-object base for graphical-ui system tests.

Subclass per screen and add intent-named methods (e.g. submit_login) on top of
the shared navigation/assertion helpers here. Each graphical surface's base URL
comes from the conftest `surfaces` fixture (slug -> reach).
"""

from playwright.sync_api import Page, expect


class BasePage:
    """Holds the Playwright page plus the frontend base URL.

    Helpers return self so page interactions chain:
        HomePage(page, surfaces["site"]["reach"]).goto("/").expect_visible("main")
    """

    def __init__(self, page: Page, base_url: str):
        self.page = page
        self.base_url = base_url.rstrip("/")

    def goto(self, path: str = "/") -> "BasePage":
        """Navigate to a path under the frontend base URL and wait for load."""
        self.page.goto(f"{self.base_url}{path}", wait_until="load")
        return self

    def expect_visible(self, selector: str, timeout_ms: float = 10_000) -> "BasePage":
        """Assert the first element matching the selector is visible."""
        expect(self.page.locator(selector).first).to_be_visible(timeout=timeout_ms)
        return self
