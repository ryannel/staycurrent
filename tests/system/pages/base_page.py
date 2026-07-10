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

    def click_sidebar_face_link(self, title: str, face_name: str) -> None:
        """Expand the sidebar's topic-tree `<details>` disclosure for the
        topic titled `title` and click its named face link (e.g.
        'Changelog') — scoped to `.sidebar .topic-faces` so it can't collide
        with the trust header's identically-labelled links on an article
        page. Lives here rather than on a single page object because the
        sidebar is the shared shell, present on every page. This navigates
        away, so — like LibraryPage.click_topic_card — it does not return
        self."""
        disclosure = self.page.locator(".sidebar .topic-disclosure").filter(
            has=self.page.get_by_text(title, exact=True)
        )
        disclosure.locator("summary").click()
        disclosure.locator(".topic-faces a", has_text=face_name).click()
