# Site consolidation — 4 October 2026

The operator asked to retain the Databases and storage field guide and all its
nested reading, and remove the rest of the website.

The retained tree includes the directly linked technology-family articles, the
relational collection and its planned outlines, the linked checkout example,
and the Postgres vector assessment linked in the guide's further reading.
Column stores was also linked, so its essay and four experiments were kept and
moved to `/learn/databases/column-stores/`. The normalisation redirect remains a
compatibility route within the relational collection.

The homepage now redirects to the field guide. Shared navigation and footer links
lead into the retained reading. Removed pages are the separate field directories,
Explore database overview, About, Updates and RSS. Their unused components and
metadata were removed. Mermaid rendering and its dependency were unused in the
retained articles; RSS and marked dependencies were also removed. The outdated
prose-metrics script did not reflect the current writing skill and was removed.

The retired project's `core`, `services` and `tests` directories contained generated
output, dependency installs and caches rather than source. They were removed along
with empty old topic directories and the old Nx cache. Current interactive-model
tests remain beside their source. Authoring skills, editorial source images,
research, review records and planned coverage were retained. Runtime caches are
ignored. Historical site direction was moved under `docs/history/`, and the current
README, agent instructions and site direction now describe this structure.

Dependencies and CI use pnpm 11.4.0. The project records permission for the esbuild
and sharp installation scripts required by its tooling, using pnpm's
[build settings](https://pnpm.io/settings). Frozen-lockfile installation and the
final `pnpm build` passed; 49 pages were generated. A built-output check found all
613 internal links and their target anchors/files, confirmed removed routes were
absent, and confirmed the new column-store destination exists.

Browser checks verified the homepage redirect, desktop and phone navigation, and
the moved essay. All four experiment components and their controls loaded, images
had no failed loads, and the scan switched to columns with the expected four of
twelve pages read. The surrounding article content and teaching models were not
rewritten. The existing local development server remains available on port 4321.

The screenshot `field-guide-entry.png` shows the new entry point. A temporary
source backup was made before consolidation at
`/private/tmp/staycurrent-before-consolidation.tar.gz`; removed generated skill
exports were also backed up under `/private/tmp`. No commit or deployment was made.
