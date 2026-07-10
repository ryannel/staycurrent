"""Page object for the designed 404 — Not Found (01-ui-design.md).

"The dead end contains the map" (Error & honesty choreography) — every
unmatched route under the static export lands here, the inline topic tree
rendered as page content.
"""

from playwright.sync_api import expect

from .base_page import BasePage


class NotFoundPage(BasePage):
    def expect_designed_dead_end(self) -> "NotFoundPage":
        expect(self.page.locator("h1.not-found-title")).to_have_text("This page doesn't exist.")
        expect(self.page.locator("body")).to_contain_text("It may have moved when a topic was renamed.")
        return self

    def expect_topic_tree_link(self, slug: str) -> "NotFoundPage":
        link = self.page.locator(f".not-found-topics a[href='/{slug}/']")
        expect(link).to_be_visible()
        return self
