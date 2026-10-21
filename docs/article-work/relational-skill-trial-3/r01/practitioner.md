# Practitioner review · ARTICLE · a00 Relational databases; a03 Making concurrent changes correct · 80276a4

Inputs read: the complete `src/articles/relational-trial-3/a00.astro` and `a03.astro`; their current article-specific component/model and verifier sources; a03's worksheet archive; `docs/coverage/relational-2026-10-19.yaml` (root and transaction outcomes and ownership); `docs/article-work/relational-writing-2026-10-19/registry.json` (parent, sibling and child plans); `docs/coverage/relational-example.md` (canonical shop and class fixture); all supplied a00/a03 native evidence records; the commission in this assignment; the assigned review skill and practitioner perspective. The two assigned built pages were fetched as text. Primary sources and fresh-run commands are listed in [practitioner-evidence.md](practitioner-evidence.md). Earlier article versions, earlier reports/decisions/results, trial-3 brief/run.md and other perspectives' reports were withheld. Optional writing notes and unrelated article prose were not read.

Highest severity: none

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass | a00's schema, query multiplicity, complete reservation, recovery distinctions and conditional shortlist are sound at their stated scope; a03's single-row, uniqueness, multirow, snapshot, waiting, abort and durability arguments agree with primary documentation and fresh PostgreSQL 18.6 runs. |
| Evidence | pass | Models and native observations are distinguished; commands, versions and assumptions are inspectable. Both fresh successful runs match the claimed outcomes. Initial environment failures are preserved as failures. No production, crash, restore or alternative-engine execution is claimed. |
| Coverage | pass | a00 gives the intended first working model and task entrances; a03 teaches a complete protected one-row booking, an all-writers multirow Serializable repair, fresh decision retry, deadlines, lock ordering and the uncertain-commit/external-effect boundaries. |
| Depth, both ways | pass | No necessary outcome is missing for either article's place in the collection. No unnecessary mechanism depth found: a00 stops at useful boundaries; a03 gives enough engine detail to justify its protocols without a lock catalogue, storage internals or application-recovery implementation. |
| Ownership | pass | a00 supplies a useful high-level answer before routing to the deeper branches. a03 owns concurrency reasoning and full decision restart; detailed lock protocols and isolation histories remain with a18/a19, and request recovery, external delivery and operational restoration retain their own owners. Necessary recaps do not become duplicate full treatments. |

## Findings

None. This is a whole-piece assessment of both fixed drafts; there is no finding quota.

## Limits

Browser panes were kept hidden as instructed. HTTP text and the complete figure models were checked, but rendered visual layout and control execution were not assessed. The native evidence covers selected schedules, not proof that every production writer participates; both articles correctly require the protocol argument alongside the observations. No power-cut, storage-loss, replication, restore or production-throughput experiment was run. MySQL and SQLite were checked against their primary documentation, without native runs. The controlled trial and planned children were assessed as drafts and plans; this review does not authorise publication.

Fresh native evidence: [a00, 22 passing checks](practitioner-a00-native-56223.json) and [a03, all counterexamples and repairs passed](practitioner-a03-native-56222.json). Each successful invocation owned its own cluster/database on a unique port; all started sessions and servers stopped, and both temporary cluster directories were independently confirmed removed. The initial sandbox-limited attempts on ports 56220 and 56221 also left no running server or directory.

Assignment timing: UTC start 2026-10-21 19:24:06; UTC end 2026-10-21 19:27:50; elapsed 224.6 seconds. No article edits, commit or push.
