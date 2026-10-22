# Writer record

## Timing and scope

- Date: 22 October 2026; times below are UTC.
- Initial reading began before the first clock receipt, 19:11:59. No more precise start time was captured.
- Complete first source was handed to the coordinator before their successful 19:15:12 build.
- At 19:15:53, the writer had corrected a rendered table-sizing issue and requested a second preview.
- Final rendered checks and record completed at 19:18:27 UTC.
- Commission: an introduction and first section only. No publication, route, shared-file, server, build, commit, push or reviewer work was undertaken by this writer.

## Inputs and reference use

Read the assignment and its factual extract, AGENTS.md, README.md, docs/site-direction.md and the current write, figures and continuity skills. Also read the figures skill's database-verification guidance. No earlier drafts, feedback, historical skills, sibling experiment records or other agents' records were opened.

Read all three finished references at port 4350 in a dedicated Chrome tab. The rendered article text was read in full, in chunks where necessary; the working figures and controls were inspected. Representative interactions were Next on Indexes' sequential scan, Next on Storage's page-filling figure, and the 3 s option plus Next on Sequence diagrams' waiting figure. This was reference study, not a complete regression test of those articles.

The closest teaching passage is **Sequence diagrams, “Lifelines and messages”, including Figure 1**: establish the vocabulary, give a small complete example, then read the example in a definite direction and explain the meaning of its values. The first table establishes row and column through Mina's actual entry. The second adds only the values needed to follow an order to that customer. Like that reference's first figure, neither table needs playback. Every displayed value is available as native HTML text, with column headings and a table caption.

**Indexes, “Sequential scan”** informed keeping all example entries small enough to inspect, and explicitly distinguishing invented data from observed execution. **Storage and durability, “Pages”** informed introducing the representation before interpreting its consequence, keeping the running example stable and explaining what a figure leaves out. Their later interactive figures were studied to judge whether a control would reduce this reader's work. For six rows of data, a control would add work.

Shared infrastructure consulted: the reference Astro imports and static clustered-index figure, ArticleBody, and the site's theme tokens. File discovery incidentally returned names of other component directories; their contents were not opened.

## Primary sources

Checked 22 October 2026:

- [PostgreSQL 18, Concepts](https://www.postgresql.org/docs/18/tutorial-concepts.html): a table's named rows and columns, and absence of promised row ordering.
- [PostgreSQL 18, Table Basics](https://www.postgresql.org/docs/18/ddl-basics.html): columns, data types, row ordering and the fact that identifiers are not supplied to every row automatically.
- [PostgreSQL 18, Joins Between Tables](https://www.postgresql.org/docs/18/tutorial-join.html): combining rows by a matching-value condition. The sample does not yet introduce SQL or claim a physical execution route.
- [PostgreSQL 18, What Is PostgreSQL?](https://www.postgresql.org/docs/18/intro-whatis.html): background check on relational database capabilities; not an additional claim made in the sample.

The shop tables are conceptual illustrations built from the permitted facts. No engine run, query result, performance figure or database protection is claimed; an execution experiment was therefore not required.

## Continuity pass

Read the complete opening, tables, headings and captions from a newcomer's starting point. The introduction establishes the need to keep facts and answer questions before the first section defines tables. The first table establishes customers, rows, columns and customer identifiers before the order table uses them. The trace of order 103 goes through customer_id 1 to Mina Shah; 101 also goes to Mina, 102 to Tariq, and Edda has no referring order. Names and identifiers match the supplied extract. The hypothetical name change adds no stored fact. No additional example facts or central-record extensions were needed.

The sample ends at reading and connecting rows. It does not teach schema design, constraints, queries, transactions or operation. No dependency on an unwritten later explanation is needed for the two commissioned outcomes.

## Rendered checks

First preview: http://127.0.0.1:4354/review/relational-table-test/ . The coordinator reported a successful build and all 13 site rules passing. At the default desktop viewport (1488 × 917), the writer found inherited display:block styling on the tables. The component now explicitly sets display:table; the coordinator was asked for a fresh immutable preview.

The coordinator's r02 build completed at 19:16:27 and replaced the preview at the same URL. The writer reloaded it and verified the corrected display:table rule in the rendered DOM. Both figures were inspected at 1488 × 917 and at 375 × 812, in light and dark. Captions, column headings, all six data rows and the surrounding prose remained readable. At 375 px the page width was exactly 375 px and both tables were 326.61 px wide; neither the page nor the tables required horizontal scrolling.

Compared the sample with the chosen reference's first section and static figure at desktop size. Both establish the terms, show the complete small representation and then read concrete values from it. The sample's table labels stay at a readable size at 375 px. The figures contain no playback, options or other controls to test. Native text and tables supply the text alternative directly. The source links were also checked for keyboard access: Tab moved from Concepts to Table Basics and displayed the shared visible 2 px focus outline. No screen-reader session or automated accessibility audit was run.

Rendered colours were read from the DOM and WCAG contrast ratios calculated from their sRGB values:

| Element | Light | Dark |
| --- | ---: | ---: |
| Table text on its panel | 13.73:1 | 10.89:1 |
| Secondary colour on panel (also its border/rules) | 6.05:1 | 6.15:1 |
| Caption on page | 6.61:1 | 6.83:1 |

The minimum measured text contrast exceeds 4.5:1; panel borders and row rules exceed 3:1. Colours use the site's theme tokens. There is no colour-only encoding.

Screenshots alongside this record:

- desktop-light.jpg — first table, light, desktop.
- customers-desktop-dark.jpg — first table, dark, desktop.
- orders-desktop-light.jpg and orders-desktop-dark.jpg — second table and its reading, desktop.
- customers-375-light.jpg and customers-375-dark.jpg — first table at 375 px.
- orders-375-light.jpg and orders-375-dark.jpg — second table and trace at 375 px.
- reference-lifelines-desktop-light.jpg — the chosen reference passage and figure.

Restored the default 1488 × 917 viewport and the original System theme on both preview origins. The 375 px override was cleared. Final checks required no further source changes. Build and site-check results remain the coordinator's evidence, not a test run by this writer. Independent review was outside this partial commission.
