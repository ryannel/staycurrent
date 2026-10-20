# Repair decisions · skill trial · d03

Version reviewed: 5a49e8c. Reports in this folder. Every d02 finding is confirmed fixed except visual-16 (partly).

| Perspective | a00 | a03 |
| --- | --- | --- |
| Practitioner | pass | pass, 1 optional |
| Teaching | pass | pass, 3 optional |
| Editorial | pass, 1 optional | pass, 1 optional |
| Visual | pass | 1 required, 1 optional |

## Applied by the coordinator

All remaining findings change a phrase or a style rule, so the coordinator applied them directly and checked them in the browser rather than run a fourth round.

| Finding | Change |
| --- | --- |
| practitioner-13, teaching-12, editorial-28 | The vendor-tool sentence now says running at Serializable is what protects the rule; a tool that cannot retry still keeps the rule but its refused runs must be rerun by hand; a tool that sets its own isolation level overrides the role default. |
| teaching-13 | The FOR UPDATE overbooking case explains that the count was one statement started before the first booking committed, so the wait refreshed only R7. |
| teaching-14 | "Lock the rows you counted" now says the loser "waits, then rechecks only the rows it locked". |
| editorial-20 leftover | a00's commit paragraph says "copies the changes into the table files", so "pages" is no longer used before it is explained. |
| visual-18 (required) | The "Choosing a protection" table is shown as labelled cards at every width; five prose columns do not fit a 640 px column. Checked at 1280 px and 375 px: no sideways scrolling. |
| visual-19 | The capacity-check result table uses a smaller font, and its headers may break only at underscores. Checked at 375 px: every header reads in full and nothing scrolls. |

Final build passes. The trial is complete.
