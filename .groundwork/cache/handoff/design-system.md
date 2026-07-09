# Hand-off from design-system

> Post-commit context drop from the phase that just committed. The next phase reads this file once at init and deletes it on its own commit.

---

## Rejected Options

- Topic hub page with links to its faces — rejected; the topic page IS the article, the trust header carries the links.
- Weighted 200/300ms motion profile — declined for snappy 120/180ms; stillness is the premium.
- Search / command palette at MVP — the sidebar is the index; escalation trigger is ~25+ topics.
- Skeleton loading states — the site is static; content arrives with the page.
- Parallel state registry for topics — frontmatter is the only stored state; cross-topic views are derived by sweep.
- Bespoke skill token budget — skill-creator conventions carry the discipline instead.

## Deferred Decisions

- Root instruction file name and agent wiring — the agent-wiring convention owns it — resolve in Architecture.
- Instance-repo vs framework-package boundary — the design system specifies the instance's content contract; where the engine lives is open — resolve in Architecture.
- Skill packaging/distribution — skills are portable markdown payloads; how adopters fetch/install them (and how `/[topic]/skill` binds skill version to article version mechanically) — resolve in Architecture.
- Visual version diff — reader-facing diff between versions — revisit when returning readers ask for more than the changelog entry.

## User Instincts

- The GroundWork principles corpus is the article archetype; `groundwork-writer` and skill-authoring conventions in ~/Workspace/groundWork are reference shapes for the publication's writer skill — treat as the writer skill's content source, not as committed design.
- "Building in the open" ethos — the framework and the first site are one story; friction the operator hits is a framework gap by definition.
- Changelog entries are a headline design problem — entry quality is product quality; the design system committed the anatomy, delivery should protect the bar.

## Context Drop

- Machine form of the visual system: `.groundwork/config/brand-tokens.json` (`visual` block) — projected from docs/design-system.md § Graphical UI; both must stay in agreement.
- The publish gate is specified as a mechanical check against the staged prospective tree — architecture should make it a deterministic script so CI and the workbench run the identical gate.
- Mermaid diagrams render through a house theme generated from the tokens; both themes ship; diagrams are the site's only imagery.
- The site build must fail if any article page cannot state its version and last-researched date — currency is never guessed.
