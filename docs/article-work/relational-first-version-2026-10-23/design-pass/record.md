# Navigation and end matter design pass

User commission: improve the awkward navigation, collection list, next link and sources presentation shown in four screenshots. This is a template/design change, preserving the first writer's article.

The shared reading navigation has quieter breadcrumbs, a compact disclosure, grouped relational links and a clear current-position badge. The current child's subject opens automatically inside the menu; other subjects remain closed. The bottom collection list uses compact rows with aligned article counts and consistent chevrons. A single next/previous link occupies the full available width without an empty column. Sources remain collapsed, after all reading navigation, and expand into narrower, smaller text. Header and end matter spacing is tighter, with fewer repeated separators.

Changed implementation: ReadingNavigation.astro, CollectionPager.astro, RelationalReadingMap.astro and SkillTrial.astro. No writing skill, article prose or article figure was changed. All nine frozen writer source hashes and all 40 earlier sample hashes still match. Expanded source text matches the preceding r05 preview; all seven source items and 14 links remain.

## Checks and evidence

- Final normal `pnpm build` passed all 13 site-check rules; log: `/private/tmp/staycurrent-design-pass-final-build.log`.
- Final r08 reference preview build passed; log: `/private/tmp/staycurrent-relational-first-version-r08-build.log`.
- `integration-check.json`: final r08 article passes the page rules, all 57 collection article entries remain, subjects and sources default closed, current child group opens correctly, and the single pager has no empty column.
- `layout-metrics.json`: measured 1488 × 973 and 375 × 812 viewports in both dark and light themes. No page-level horizontal overflow in any case. Minimum measured navigation text contrast is 5.24:1.
- Native keyboard activation and visible focus checked for menu, subject and sources disclosures. Root and published modelling child current-position markers checked.
- Final `final-menu-height.json`: r08 menu height refined so the root index fits the wide preview and has internal scrolling when required on narrow screens. The preceding r07 colour/spacing checks still apply; only the menu maximum height changed afterwards.
- `preview-navigation.png` and `preview-ending.png`: final r08 in the user's existing in-app browser. Other PNGs record wide/narrow, light/dark, expanded sources and current-child checks on r07.
- `git diff --check` passed.

This is visual and structural verification, not a new prose review or a screen-reader, physical-device or print audit. Temporary Chrome QA tabs were closed, its viewport override cleared and its original System theme restored. The user's preview remains at `http://127.0.0.1:4364/review/relational-first-version/`, serving `/private/tmp/staycurrent-relational-first-version-r08` (server session 59149). Nothing was published.
