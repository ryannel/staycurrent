---
name: staycurrent-figures
description: Design and build the figures, tables, code listings and interactive tools in an article, and check them on the rendered page before returning.
---

Figures carry the explanations a reader would otherwise have to hold in their head: state that changes, rows that connect, two outcomes side by side. A good figure lets the reader change a cause and watch the result. A bad one looks accurate and still has to be decoded. This skill covers choosing, building and checking them. The figures in [Sequence diagrams](../../../src/reference-articles/sequences.astro), [Indexes](../../../src/reference-articles/indexes.astro) and [Storage and durability](../../../src/reference-articles/storage.astro) are the standard.

## Choose the form

Start from the reader's real question at that point in the article and the state they would otherwise have to picture alone. Then pick the form that shows that content most directly:

- **A static table or listing** when the reader needs to see data or code as it is. Most examples are this.
- **A stepped figure** when the point is a sequence: what happens first, what changes, and what the reader sees after each step.
- **A figure with options** when the point is a comparison: the same steps under two choices, such as separate commits against one transaction.

Interaction must earn its place. If a static example teaches as well, use it.

## Show example data as the reader will meet it

- Rows sit under their real column headings, one small table per relation. Never pack a relation's columns into one cell as `name = value` lists.
- Each column holds one kind of value. If a reader has to decode a cell, the form is wrong.
- Mark primary and foreign keys, and draw relationships rather than describe them.
- Keep the running example consistent from figure to figure and from article to article. Take its people, rows, keys and values from the collection's example record ([staycurrent-continuity](../staycurrent-continuity/SKILL.md)), keep them in one model file that every figure imports, and make sure a column named in a caption exists in the tables.

## Build stepped figures on the shared stepper

Use [stepper.mjs](../../../src/components/figures/stepper.mjs) for any figure with Play, Back and Next. Give it the figure's root element, a `steps()` function and a `draw(step)` function; call the returned `render` when an option changes. The markup it expects:

| Attribute | Element |
| --- | --- |
| `data-play`, `data-back`, `data-next`, `data-reset` | The four buttons |
| `data-step` | The "2 / 5" counter |
| `data-hold` | The hold bar, containing one `span` |
| `data-live` | Every part whose text changes between steps |
| `data-explanation` | The sentence that says what this step shows, with `aria-live="polite"` |

The stepper handles timing and keyboard use:

- **Timing.** While playing, each step is held long enough to read the text that changed at that step, not all the text on screen. The reader can pause at any time and step by hand. Mark every changing part with `data-live` so the timing sees it.
- **Keyboard.** Back and Next use `aria-disabled` at the ends rather than `disabled`, so focus stays on the button the reader was using.
- **Reduced motion.** The hold bar does not animate when the reader asks for reduced motion.

Each step should show something new. End on the step that shows the outcome, not on a step that repeats the one before. Mark values that changed at a step, and let step labels follow the option the reader chose.

## Make it readable everywhere

- **Phones.** Check at 375 px. Side-by-side comparisons stack, column headings do not break inside a name, and nothing overflows the article column.
- **Prose tables.** A table whose cells are sentences fits only about three columns in the article column. With more, show each row as a labelled card at every width; a table that stacks only on phones still clips on a desktop once its text grows, as the trial's "Choosing a protection" table did.
- **Themes.** Use the site's colour tokens; the build rejects raw colour values. Check light and dark themes.
- **Contrast.** Body text needs at least 4.5:1 against its background, and large text and graphics at least 3:1. Warnings, NULL markers and dimmed rows count as body text.
- **Text alternative.** Give each interactive figure a "Read this figure as text" summary that states the outcomes.

## Say what the figure is

Label each figure as an illustrative model or as results observed from a real system, in its caption and in a boundary note that says what it leaves out. Never present an unrun command as observed.

When a figure shows database behaviour, keep its data and outcomes in a model file and check them against a real database with a verification script, as the relational introduction does in [verify.mjs](../../../src/components/relational-next/a00/verify.mjs). Run it against a disposable local server, and record the version and command in the work record.

A script passes easily when the example data cannot show the failure. In the 2026-10-20 trial, both verification scripts passed while a move listing could still overbook and a `FOR UPDATE` claim was false, because the example data happened to hide both failures. For each protection a figure or listing claims, include a case that would fail if the protection were missing, with data chosen so that the failure is visible, such as a capacity where a missed recheck overbooks.

## Check before returning

Open the built page in a visible browser window. In a hidden pane, animation runs at about one frame a second and screenshots can be stale; if you cannot see the window, check timing from the page's timers and say so. Then:

1. Look at each figure before reading its prose, and note what it seems to show. Fix anything that does not stand on its own.
2. Play each stepped figure through every option, and step through it by keyboard.
3. Check it at 375 px and in both themes.
4. Read every caption and label against what the figure shows.
