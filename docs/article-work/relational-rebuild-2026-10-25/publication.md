# Relational replacement publication, 26 October 2026

The user authorised full publication of the completed 59-article collection and removal of superseded relational content. The new collection now supplies the normal `/learn/databases/relational/` routes, article directory, full-text search, navigation and public downloads.

## Published material

All 59 accepted article bodies and their interactive components are retained without editorial changes. The foundation pager follows the accepted 30-article path; optional and implementation articles return to their parent subject. The tree marks the current article, subject groups begin closed, and sources remain closed at the absolute bottom. Published pages have no draft label or noindex restriction.

The 25 downloads are copied byte-for-byte from the reviewed staged files to `/learn/databases/relational/downloads/`. Historical article slugs redirect directly to their canonical replacements. Eleven section bookmarks used by retained reading and tools resolve at the relevant new passages without changing the reviewed bodies.

Superseded relational article collections, trial figures, review experiments, obsolete layouts/registries and old public evidence endpoints are removed. Git history and the work records under docs retain the research and review history. The fixed teaching references remain intact. The older checkout tour redirects to the new introduction. The SQL sandbox and local practice remain separate tools; the practice guide now points to the new collection’s own examples and states their fixture requirements.

## Validation

- `pnpm build`: all 13 site rules pass, including internal links and fragments.
- `pnpm test`: all 23 tests pass.
- [Publication inventory](publication/local-check.json): all 59 routes have indexable article bodies, directory links and no draft status; all 25 downloads match their source bytes; all reviewed source hashes are unchanged.
- Browser smoke check: published introduction, collapsed/current-article tree, first animation advancing to its next step, and the new migration article as the first search result.
- Existing article and assembled reviews are retained. Publication does not add another editorial review round.

A push to origin/main runs the repository’s Publish workflow and deploys to https://staycurrent.dev. Deployment and live-route verification follow the push.
