# SQL sandbox UX pass

15 October 2026. The user found the sandbox confusing and requested a full UX
pass with screenshots. The starting version was commit `ad25dcd`.

## What made it hard to use

The opening offered a thirty-option selector, a separate Start action and a
second, complete lesson catalogue. All of that remained present during a lesson.
Instructions, expected answers, navigation, editor guidance, table samples and
response history competed in one vertical column. A person had to scroll between
the task, its SQL and its answer, then distinguish two different Next controls.
Loading a later step could leave the previous step's result looking current.

Screenshots made the scale visible. In the first lesson after its first run, at
1440 × 1000 pixels, Run started 1,603 pixels down the document and the page was
5,697 pixels tall. At 390 × 1000, Run started at 2,248 pixels and the page was
9,205 pixels tall. Passing overflow and SQL checks had not established a coherent
learning experience.

## Changes

- The entrance offers a recommended first lesson and free exploration. A
  searchable, subject-filtered chooser holds all 29 lessons. It also lets someone
  leave a lesson for free exploration.
- Article links open their chosen lesson directly. The active workspace names
  the lesson and separates Change lesson from Restart lesson.
- Desktop instructions sit beside the editor; phone instructions precede it.
  Advanced session details and the step outline remain available in disclosures.
  The full article switcher is omitted on this playground; breadcrumbs and the
  lesson's article link retain the reading context.
- Each step has one forward route after execution. Unexpected SQL errors prevent
  advancement; an expected SQLSTATE from the unchanged lesson example permits it.
  Edited examples are identified explicitly, rather than treated as graded answers.
- Results show the current run, followed by its explanation and the next action.
  Moving to another step clears the current result area. Up to four previous
  runs remain in a separate collapsed history, for five retained runs overall.
- Result focus and an Edit SQL action connect the editor and answer on a phone.
  Completion is explicit. Restart returns to the beginning with fresh data;
  changing a step preserves the database.
- Edited SQL and existing work retain confirmation on replacement. A running
  editor is read-only, stopping explicitly discards the database, and Restart
  remains available after cancellation or worker failure.
- The native lesson dialog supports keyboard focus containment, Escape and
  focus return. Escape closes it even when the search input contains text.

The revised first-result page is 1,443 pixels tall on desktop and 1,975 on phone.
Run begins at 550 and 1,024 pixels respectively, and starting a session moves to
the workspace. Running SQL brings the result and next action into view. These
measurements describe this example, not a target that every lesson must meet.

## Screenshots

| View | Before | After |
| --- | --- | --- |
| Desktop lesson and result | [Before](screenshots/before-desktop.png) | [After](screenshots/after-desktop.png) |
| Phone lesson and result | [Before](screenshots/before-phone.png) | [After](screenshots/after-phone.png) |

Additional captures: [entrance](screenshots/entry-desktop.png),
[phone result](screenshots/after-phone-result.png),
[phone lesson chooser](screenshots/lesson-chooser-phone.png),
[dark theme](screenshots/after-desktop-dark.png),
[expected error](screenshots/expected-error.png),
[completion](screenshots/complete.png), and
[free exploration](screenshots/free-exploration.png).

## Verification

The production build passes for all 57 pages. All 29 lessons and 152 steps ran
through the revised browser interface, including their expected errors and final
completion states. `verify-browser.mjs` and `browser-verification.json` preserve
the full run and interaction checks.

Additional checks cover current versus historical results, bounded history,
search and subject filtering, no matches, dialog dismissal and focus return,
cancelled lesson changes, unexpected errors, edited SQL, failed transactions,
restart confirmation, stopping, keyboard execution, literal HTML, SQL NULL,
result limits, empty results, and old catalogue/unknown-lesson links. Loading
cancellation, restarting after it, and Edit SQL focus were checked separately.

Both themes were checked at widths 320, 390, 640 and 1440 with no page or chooser
overflow. The result receives focus and fits within the phone viewport for the
first query. Screenshots were inspected as entry, working and result states,
including error and completion. The initial test caught Escape being consumed
by the search field; the repaired behaviour passed the rerun.

This is an interface and interaction review in desktop Chromium with responsive
viewports. It does not substitute for observing new learners, testing a physical
phone keyboard or conducting a screen-reader audit. SQL lesson content and the
database worker were kept intact.
