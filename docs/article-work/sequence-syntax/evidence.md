# Evidence: sequence diagram syntax

Checked 17 October 2026. Everything below was run or read on that date.

## Tools and versions

- Mermaid 12.2.0 (npm `latest`, published 2026-10-13) through `@mermaid-js/mermaid-cli`
  12.0.0 with Chrome as the browser. Older releases rendered with mermaid-cli 11.12.0 and
  `mermaid` overridden to 11.17.2, 11.16.0, 11.15.0, 11.14.0, 11.13.0, 11.12.3, 11.12.2,
  11.4.0, 11.1.0. Releases 11.0.0 and 10.9.8 would not start under that CLI, so they say
  nothing about syntax.
- PlantUML 1.2026.9 (GitHub release v1.2026.9, 2026-10-17), the GPL jar, run on
  Temurin JRE 21.0.12 downloaded to a scratch directory. No Graphviz was installed;
  sequence diagrams did not need it. A diagram error was detected from the
  `Error line N` message on stderr, because PlantUML still writes an image of the error.
- D2 0.9.0 (release 2026-09-07), macOS arm64 binary.
- Test sources and renders are in the session scratchpad, not kept. The listings on the
  page are the ones that were rendered; the booking was viewed as an image in
  Mermaid, PlantUML and D2 and each shows the same lifelines, call, async message, reply
  and note.

## Mermaid: what parsed in 12.2.0 (and what did not)

Parsed and drawn: `->`, `-->`, `->>`, `-->>`, `-)`, `--)`, `-x`, `--x`, `<<->>`,
`<<-->>`, half arrows (`-|\`, `--|/`), central connection `->>()`, `activate`/`deactivate`,
`+`/`-`, participant types `@{ "type": ... } as Name`, `actor`, `create`/`destroy`,
`alt`/`opt`/`loop`/`par ... and`/`critical ... option`/`break`, `box`, `rect`,
`Note over/right of/left of`, `<br/>`, `%%` comments, `autonumber`, `autonumber 10 5`,
`link A: label @ url`, `title`.

Parse errors in 12.2.0 and 11.17.2: `ref over A,B: x`; a line of `...`; `== Phase ==`;
`return`; `autoactivate on`; `par ... else`; `group Label`; `|||`; `hnote over A`;
`x; y` (an unescaped semicolon in a label).

Accepted but misread (silent): `[->>A: found` draws a participant named `[`;
`A->>oB: x` draws a participant `oB`; a line starting `& A->>B: y` draws a participant
`& A`. `ticket #42` is cut to "ticket"; `ticket #35;42` keeps the label; `#59;` gives a
semicolon. The docs warn that the word "end" can break a diagram; a message containing
"the end" and a note containing "end" both rendered in 12.2.0, so the page does not
repeat that warning.

## Mermaid: version boundaries (rendered, and release notes)

Sources: GitHub releases of mermaid-js/mermaid (`mermaid@11.11.0`, `11.13.0`, `11.15.0`)
and the sequence page, https://mermaid.js.org/syntax/sequenceDiagram.html (docs
version at the time of the check: 12.2.0).

| Syntax | Docs say | Release notes | Rendered |
| --- | --- | --- | --- |
| `create` / `destroy` | 10.3.0+ | not checked | ok in 11.1.0 and later; 10.9.8 could not be run |
| `<<->>` | 11.0.0+ | not checked | ok from 11.1.0 (11.0.0 could not be run) |
| `participant X@{"type":...}` | no version | 11.11.0, "new participant types" (#6704) | rejected by 11.4.0 and 11.1.0; ok in 11.12.2, 11.12.3 |
| `@{...} as Name` | no version | 11.13.0, "alias support for new participant syntax" (#7136) | rejected by 11.12.3; ok in 11.13.0 |
| half arrows | 11.12.3+ | 11.13.0, "half-arrowheads (solid & stick) and central connection support" (#6789) | rejected by 11.12.3, 11.12.2, 11.4.0, 11.1.0; ok in 11.13.0 |
| central connection `()` | 11.12.3+ | 11.13.0 (#6789) | parsed in older releases but drawn as a participant named `()John`; correct from 11.13.0 |
| `autonumber 1.5 0.5` | 11.15.0+ | 11.15.0, "decimal start and increment" (#7174) | rejected by 11.14.0; ok in 11.15.0. `autonumber 10 5` ok from 11.1.0 |
| default theme `redux-color` and look `neo` | 12.0.0+ | 12.0.0 | not checked |

So the sequence page's 11.12.3 tag for half arrows and central connections is a release
early: the notes and the renders both put them in 11.13.0. The sequence page was also
not ahead of release notes for the others. A participant's `@{...}` with a space
before it (`participant X @{...}`) was fixed in 12.1.0 (#8259); the page's listing writes
it without a space.

Mermaid latest is 12.2.0 (12.0.0 on 2026-09-10). The parent's meta line says Mermaid 11
and the GitLab page says Mermaid 11; neither is wrong for what they describe, but the
parent will need updating when it is next reviewed.

## PlantUML 1.2026.9: what parsed

Parsed and drawn: `->`, `-->`, `->>`, `-->>`, `->x`, `-->x`, `->o`, `<->`, `[->`, `->]`,
`[o->`, `->?`; `++`/`--` shorthand; `activate`/`deactivate`; `return`;
`autoactivate on`; `create`; `destroy`; `autonumber 10 5`; `alt/else`, `opt`, `loop`,
`par ... else`, `break`, `critical ... else`, `group Label [secondary]`; `ref over A, B`;
`...`; `== x ==`; `|||` and `||20||`; `note over/left of/right of`; `note across`;
a note after a message; `box "t" #color ... end box`; `database`, `queue` and other
participant shapes; `title`; `skinparam style strictuml` (triangle heads); `&` and
`{start} <-> {end}` anchors.

Errors: `par ... and`; `critical ... option`; `rect ... end`.

Teoz: the documentation shows `!pragma teoz true` for `&`, anchors and nested boxes. In
1.2026.9, `&` and the anchor duration drew identically with and without the pragma.
Documentation also states that since 1.2025.5 `skinparam lifelineStrategy solid` no
longer works (https://plantuml.com/sequence-diagram).

Arrow semantics were confirmed from rendered images: `->` solid sharp head, `-->`
dotted head, `->>` thin head, `->x` cross, `->o` filled circle. Mermaid: `->` and `-->`
no head, `->>` filled triangle, `-)` open head, `-x` cross.

## Where each renders

- GitHub: https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams
  lists four syntaxes (mermaid, GeoJSON, TopoJSON, ASCII STL) in issues, discussions,
  pull requests, wikis and Markdown files, and tells readers to put `info` alone in a
  mermaid block to see the Mermaid version. No version number is published. PlantUML
  is not among them. (The PlantUML site advertises a browser extension for GitHub;
  not tested, not mentioned on the page.)
- GitLab: https://docs.gitlab.com/user/markdown/ says "GitLab supports Mermaid
  version 11" and "PlantUML integration is enabled on GitLab.com"; a self-managed
  instance needs an administrator
  (https://docs.gitlab.com/administration/integration/plantuml/ describes the PlantUML
  server). With it enabled, a `plantuml` block does not need `@startuml`/`@enduml`.
- Docusaurus: https://docusaurus.io/docs/markdown-features/diagrams, Mermaid only
  (`@docusaurus/theme-mermaid`, `markdown.mermaid: true`).
- Material for MkDocs: https://squidfunk.github.io/mkdocs-material/reference/diagrams/,
  Mermaid through a superfences custom fence.
- Sphinx: sphinxcontrib-mermaid listed on Mermaid's community integrations page;
  sphinxcontrib-plantuml README (https://github.com/sphinx-contrib/plantuml)
  configures `plantuml = 'java -jar /path/to/plantuml.jar'`.
- Asciidoctor Diagram 3.0.1 lists Mermaid, PlantUML and D2 among its diagram types
  (https://docs.asciidoctor.org/diagram-extension/latest/); Kroki lists the same
  (https://kroki.io/).

## D2

https://d2lang.com/tour/sequence-diagrams/ (checked 17 October 2026): `shape:
sequence_diagram`, definition order is display order, children share scope, groups are
containers with connections or objects inside, spans are nested objects connected to
each other, notes are nested objects with no connections. Rendered the booking with D2
0.9.0 and viewed it: three lifelines, solid arrows, the dashed reply from
`style.stroke-dash: 3`, and the note. A first attempt that nested a connection inside a
span-like object drew a self-message instead; the page's listing does not use spans.
D2 has no `alt` or `loop` operators in that page; the page says a frame is a labelled
group.

## Not verified

- draw.io: its documentation describes inserting Mermaid source (Arrange > Insert >
  Mermaid); whether sequence diagrams convert was not tested, and the page says so.
- Excalidraw, sequencediagram.org: not checked, not mentioned.
- The Mermaid version GitHub runs today (not published; needs a rendered `info`
  block on GitHub itself, which needs a GitHub account).
- Mermaid 10.3.0 for create/destroy and 11.0.0 for `<<->>`: taken from the docs only.
- OMG UML 2.5.1 chapter 17 was not read directly; the page's UML claims (lost message
  as a circle, async open head) come from the parent article and agree with PlantUML's
  own arrow set.

## What would change this page

A Mermaid release that adds `ref`, found messages or delays; a PlantUML release
that changes arrowhead defaults; GitHub or GitLab publishing their Mermaid version;
GitHub rendering PlantUML.

## Revision after the trio reviews (17 October 2026)

- Opening example's note changed to "Nobody waits for this reply" (Mermaid, PlantUML, D2); only note text changed, so the earlier renders still apply.
- Releases tried for the version table: 11.1.0, 11.4.0, 11.4.1 (added; participant types rejected, same as 11.4.0), 11.12.2, 11.12.3, 11.13.0 to 11.17.2, 12.2.0.
- Notion: Mermaid's integrations page (https://mermaid.js.org/ecosystem/integrations-community.html) marks it supported; Notion's code-blocks help page has no mention of Mermaid. Confluence: Atlassian Marketplace search shows third-party Mermaid apps (Mermaid Chart for Confluence and others); no Atlassian documentation of built-in support was found. Google Docs: the integrations page lists a third-party add-on; no built-in support found. PlantUML in all three: not checked.
- Not checked: ZenUML, sequencediagram.org.
