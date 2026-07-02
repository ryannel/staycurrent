# Hand-off from product-brief

> Post-commit context drop from the phase that just committed. The next phase reads this file once at init and deletes it on its own commit. Distinct from `discovery-notes.md`, which captures in-conversation out-of-phase signals.

---

## Rejected Options

- Hosted autonomous research service — rejected twice over: subscription-pricing economics, and the operator wants the update to be a conversation that forces the stance to be argued, not an auto-refresh.
- Push delivery of skill updates to adopters' agents — rejected for now; the feed announces, the adopter pulls. Anything push-shaped is a later ambition, not a promise.
- Approval gate before publishing — rejected; the research conversation is where judgment happens, and the version history/changelog/provenance make unreviewed publishing safe.

---

## Deferred Decisions

- Portability beyond Claude Code — the brief names Claude Code as the operator surface; the conversational-update principle is the invariant, the host is not. Revisit if a builder wants to run the loop in another agent environment.
- Skill packaging/distribution format — how a topic's skill is packaged, versioned, and installed. Resolve in Architecture.

---

## User Instincts

- The GroundWork principles corpus (`~/Workspace/groundWork`, `src/docs/principles/`) is the reference shape for articles: TL;DR stance, why it matters, numbered principles with honest caveats, named anti-patterns, further reading. The design system should treat it as the article's content archetype.
- GroundWork's engineer skills are the reference shape for companion skills — the user pointed at that repo as "pretty close to what we'd need".
- Changelog entries as first-class writing: good enough that a familiar reader never rereads the article. Treat changelog design as a headline design problem, not a footer.
- "Building in the open" ethos for the framework — public and watchable matters more than adoption metrics.

---

## Context Drop

- Product name: Stay Current; domain staycurrent.dev.
- Day-one topic examples the user named: "cost engineering in cloud environments", "testing", "observability".
- The existing principles docs shipped into this repo's `docs/principles/` are candidate seed material for first articles.
