"""Page object for `/about/` — About (01-ui-design.md)."""

from playwright.sync_api import expect

from .base_page import BasePage

# The seven vocabulary terms app/about/page.tsx <strong>-tags, in the order
# they first appear — the capability's core promise, per the article's own
# copy: a topic has one current article, stating a stance; a cut publishes a
# new version; a changelog and a provenance trail record each cut.
VOCABULARY_TERMS = ("topic", "article", "stance", "version", "cut", "changelog", "provenance")


class AboutPage(BasePage):
    """The one place a curious reader learns how a living article works."""

    def expect_how_it_works_prose(self) -> "AboutPage":
        expect(self.page.locator("h1")).to_have_text("About Stay Current")
        expect(self.page.locator("body")).to_contain_text("How a living article works")

        # Pin the seven defined terms themselves, not the surrounding copy —
        # that copy is free to be rewritten as long as every term the
        # capability promises to explain still renders as one.
        strong_texts = self.page.locator("article strong").all_text_contents()
        for term in VOCABULARY_TERMS:
            assert term in strong_texts, (
                f"expected the About page to define {term!r} (<strong>{term}</strong>); "
                f"found <strong> terms: {strong_texts!r}"
            )
        return self
