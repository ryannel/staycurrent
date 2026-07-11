"""Page object for `/<topic>/skill/` — Skill Install Page (01-ui-design.md)."""

from playwright.sync_api import expect

from .base_page import BasePage


class TopicSkillPage(BasePage):
    """The install page: canonical one-liner, version binding, honest
    placeholder label, and the "Install skill" primary CTA."""

    def expect_one_liner(self, slug: str) -> "TopicSkillPage":
        # The full exact canonical command, not three independent substrings
        # — a mutant that scrambled the string between the three checked
        # fragments (e.g. swapped the destination path or dropped a flag)
        # could previously still satisfy all three `to_contain_text` calls.
        code = self.page.locator(".install-block-code")
        expected = (
            f"curl -fsSL https://staycurrent.dev/skills/{slug}.zip -o /tmp/{slug}-skill.zip"
            f" && unzip -o /tmp/{slug}-skill.zip -d ~/.claude/skills/"
        )
        expect(code).to_have_text(expected)
        return self

    def expect_version_binding(self, version: int) -> "TopicSkillPage":
        expect(self.page.locator(".skill-version-binding")).to_contain_text(f"v{version}")
        return self

    def expect_placeholder_labelled(self) -> "TopicSkillPage":
        expect(self.page.locator(".skill-placeholder-note")).to_contain_text("not yet authored")
        return self

    def click_ghost_copy(self) -> "TopicSkillPage":
        self.page.locator(".install-copy-btn").click()
        return self

    def click_install_skill(self) -> "TopicSkillPage":
        self.page.get_by_role("button", name="Install skill").click()
        return self

    def expect_copied_confirmation(self) -> "TopicSkillPage":
        expect(self.page.locator(".install-copy-btn")).to_have_attribute("aria-label", "Copied")
        return self

    def expect_back_to_article_link(self, slug: str) -> "TopicSkillPage":
        expect(self.page.locator(f"a[href='/{slug}/']", has_text="Back to the article")).to_be_visible()
        return self
