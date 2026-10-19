# Publication navigation review

Reviewed 19 October 2026. Scope: public routes, collection navigation, search discovery, evidence downloads and retained reading paths. This is an integration review of the completed collection, not another technical or prose review of its 54 articles.

## Evidence checked

- `relational-collection.ts`, `relational-journeys.ts`, `reading.ts`, `collection-order.ts`, the public article routes, `RelationalArticle`, `RelationalReadingMap`, `RelationalFurtherReading` and the public evidence endpoint.
- The retained checkout, practice and SQL sandbox routes, lesson `articleHref` values and incoming links from drawing and object-storage pages.
- The first public build's HTML: all 54 publication IDs have distinct routes and rendered pages; all have Pagefind body/title metadata; none contain review links or a draft banner. The evidence endpoint produces 158 distinct filenames without collisions.
- Generated link fragments, including incoming references to retired routes, checked against destination IDs. This found 21 obsolete fragment links in the initial integration build. Root is repairing their source links and the introduction's legacy anchor placement.

## Findings and repairs

1. **Practice setup no longer matched the articles.** The retained guide loaded the old shop tables and told readers to continue with articles now using independent workshop fixtures. A reader following it would encounter different columns and records. Replaced `practice.astro` with a short guide using the existing Docker 18 start/readiness commands, fresh named databases for each article, a database-name check and the current fixture notes. Two-client examples explicitly share one article database. Product operating experiments link to their isolated worksheets rather than claiming to run in the practice container. The browser sandbox and optional checkout remain separate examples. Root independently read the repair and found the setup commands and fixture boundaries sound; rendered verification remains with the coordinator.
2. **Retired routes could discharge the wrong teaching promise.** `adding-another-system` initially redirected to the introduction, while object-storage pages linked it for outbox delivery. Root is redirecting it to the owner of durable follow-up work and updating incoming links. Other old lesson destinations and fragments are being replaced with current owning sections.
3. **Legacy introduction anchors did not reach their assigned sections.** The first layout inserted every old ID above the article, ignoring the mapping's destinations. Root is moving aliases to the corresponding sections.
4. **A surviving fragment can still land on the wrong explanation.** The drawing article’s locking-read link initially landed on a lost-update section, and the sandbox’s local-partition and shard-cutover lessons landed on general distribution summaries. Recommended direct destinations: `locks-and-deadlocks`, `partitioning` and `rebalancing`, respectively. Root owns these final source-link repairs.
5. **Navigation metadata needed small updates.** The introduction’s reading title has been updated; its pager title and the practice search description still used the former title or shop fixture. These are consistency repairs rather than route blockers.

The new subject groups give every rewritten article a place. Task paths resolve to actual publication IDs, and both product branches are reachable from the collection entrance and article switcher. The four retained PostgreSQL specialist articles remain available as further reading; the sandbox and checkout retain independent fixtures. No public route collision or missing publication ID was found.

## Verification still owned by the coordinator

Rebuild after the integration repairs, repeat the fragment check and inspect the practice guide, collection entrance, search and representative article navigation in the browser. The initial build evidence above predates the final support-page repairs. Publication is authorised by the user's explicit instruction to push and publish after the fixes.
