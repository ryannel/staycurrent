# Design System — Downstream Context

### Key Decisions

- Brand: engineering press; ink-on-paper neutrals; one accent (current green) spent on trust apparatus.
- Typography: Literata essays, Inter chrome, JetBrains Mono code and trust instrumentation.
- Website is static-first: doc-site shell — sidebar, 72ch reading column, TOC rail.
- Routes: `/`, `/[topic]`, `/[topic]/changelog|history|v/[n]|skill`, `/changelog`, `/about`.
- Print-flat surfaces; shadows only on drawer and popovers.
- Motion: 120/180ms, one curve; freshness dot is the only self-initiated motion.
- `topics/<slug>/` is the unit: article.md, changelog.md, skill/, versions/vN/, research-log.md.
- Topic state lives in article.md frontmatter; `due` and `superseded` always derived.
- Closed status vocabulary; grep string equals rendered string on every surface.
- Publish gate is mechanical, fail-closed, run pre-commit against the staged tree.
- Companion skills: skill-creator anatomy, `article_version` binding, portable markdown-only payloads.
- Every cut's prose is authored through the writer skill.
- Workbench action contract: stage → validate → commit; rollback is git revert.

### Binding Constraints

- WCAG 2.1 AA; body text ≥7:1; JavaScript is progressive enhancement.
- Article text visible <1.5s median mobile; CLS <0.02.
- No accounts, sessions, search, or real-time; RSS is the only push channel.
- Agent cold-start ≤3 file reads; root instruction file ≤150 lines.
- Nothing touching `topics/` self-repairs; interrupted runs never mutate published content.

### Deferred Questions

- Root instruction file name and agent wiring — resolved in architecture.
- Instance-repo vs framework-package boundary — resolved in architecture.
- Skill packaging/distribution format — resolved in architecture.

### Out of Scope

- Search/command palette (revisit ~25 topics), visual version diff, skeletons, onboarding flows.
- Comments, accounts, multi-author workflow, per-topic RSS feeds.
