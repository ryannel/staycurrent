# Sequence diagram syntax: Mermaid, PlantUML and others (Companion)

Plan source: `docs/article-work/sequences/coverage-map-2026-10-17.md`, breakout B2 and
sections 3.16 and 7. File: `src/pages/learn/drawing-systems/sequence-syntax.astro`.
Companion to Sequence diagrams (`sequences.astro`).

## Reader and job

A working engineer who already knows what a sequence diagram says and needs the text
that draws it, or has been handed the other tool's source. They look things up:
"how do I draw an async arrow, an alt block, an activation, a timeout note in Mermaid
and in PlantUML", "what can't Mermaid draw", "where will this render". They should
leave able to translate a diagram between the two tools without changing its meaning,
and to choose a tool for the place the diagram will be read.

Stopping point: the reader can write each construct from the parent in both tools,
knows the three arrows that change meaning, knows which constructs need the other tool,
and knows how to check the renderer's version.

## Topic tree (built before drafting)

1. Opening: the page's job, the two tools, versions and date.
2. One booking in both syntaxes (the parent's async email plus the timeout note).
   - Participant declaration order of id and label; call and async arrows; wrappers.
3. Constructs side by side (meaning in the parent's vocabulary, link to its section)
   - Participants, notes and text: participant, actor, database/queue, box, self-message,
     notes over/beside/on a message, line breaks, comments; the `#` and `;` traps.
   - Activation, creation and numbering: `+`/`-` vs `++`/`--`, activate, return,
     autoactivate, create, destroy (position differs), autonumber.
   - Frames: alt, opt, loop, par (`and` vs `else`), break, critical (`option` vs
     `else`), ref, group, rect.
4. Arrows that change meaning between tools: the table, three traps, strictuml.
5. What each tool can't draw
   - Mermaid: ref, found messages, lost circle, delay and divider, `&` simultaneous
     messages, duration markers, message notes, return, autoactivate; silent
     misparses create stray participants.
   - PlantUML: `rect` background, link menus; needs Java or a server.
6. Where each one renders: GitHub, GitLab, Docusaurus, Material for MkDocs, Sphinx,
   Asciidoctor, Kroki; how to check the renderer's Mermaid version.
   - Mermaid syntax by version (table with release, source, rendered check); the
     PlantUML removal and teoz note.
7. D2 and drawing by hand.
8. Sources and further reading (last).

## Decisions

- Tables over prose; the first column is the construct's meaning with a link to the
  parent's section, so the page extends the parent's vocabulary instead of restating it.
- Companion shell: `DrawingArticle` with `type="Companion"`. The title line's companion
  lookup (`TitleLine.astro`) only knows the relational collection, so the coordinator
  must give the drawing collection a group naming Sequence diagrams (see the handback).
- Tables are plain `<table>`: `.drawing-article table` is `display: block` with
  `overflow-x: auto`. `.table-scroll` is a relational-design class and does nothing here.
- Out of scope: half arrows and central connections syntax (not used by the parent;
  noted in the version table), PlantUML skinparam styling, Mermaid configuration and
  theming, the other Mermaid diagram types.
- No claim about draw.io's handling of sequence diagrams, Excalidraw, or
  sequencediagram.org; not checked.

## Overlap to resolve

The parent still has "Mermaid syntax reference" and "Other tools, and what Mermaid
can't draw" sections (per coverage map 3.16). The plan moves the full tables here and
keeps a short in-article summary linking to this page.
