# PGschema45 v01 — blind reader notes

Saved before consulting briefs, plans, example-fact records, author notes, mechanical receipts or any review verdict. Read the fixed 4606 rendering, following figures 1–5 and their labels/captions first, then the body. The complete accessibility tree necessarily exposed surrounding body text during figure navigation; I deliberately followed the figures before assessing that prose.

## Figure-first understanding

- Figure 1 makes the counterintuitive case intelligible: A has finished a SELECT but retains its transaction lock; B waits for a conflicting table lock; C cannot pass B. Both timeout and earlier-commit endings make the release boundary explicit. The small arrow sentence supplies the connection between the three persistent cards.
- Figure 2 distinguishes a populated destination from a correct conversion, new-write enforcement from checking old rows, and repairing data from recording validation. P7 22.00/2000 → 22.00/2200 carries the distinction without a new scenario.
- Figure 3 separates definition, write readiness and query validity. The intermediate scan and old-snapshot stages explain why a completed scan is insufficient evidence of completion.
- Figure 4's before/after comparison makes the working versus failed/obsolete copy legible. Exact names and the caption's warning prevent treating a suffix as enough evidence to delete an object.
- Figure 5 actually represents different work: sparse leaf boxes collapse, a pending gift entry moves to the main structure, and an absent BRIN summary becomes a useful day range. This is a modest mechanism schematic rather than measured activity, and the caption says so.

## First prose reading

The article's main organising distinction—lock permission, physical work, established usable state—survives the whole piece. The initial shop recap and prerequisite link give sufficient orientation. The bounded lock attempt comes before a large backfill or validation budget, and the text explains why those budgets differ. The current-row backfill follows a concrete stale assignment failure before showing SQL. The ending's acceptance conditions follow directly from the earlier distinctions.

The article is dense in operational caveats, but they generally change an action rather than introduce unrelated objections: rollback after failed explicit transactions, zero missing versus unequal prices, uniqueness beginning before validity, and suffixes not establishing a safe drop target. No definite substantive reader stall identified in the blind reading.

Headings are mostly clear but several are less directly searchable than the references' conventional names: “Enforce the rule, then prove the old rows” concerns constraint installation and validation; “Recover the state a failed build left behind” concerns failed concurrent builds and reindexing. This is a possible low-level naming improvement, not yet a substantive finding.

## Reference calibration so far

Bounded rendered passages and drawings checked: Sequences “Replies and activation bars” / “Who is waiting”; Indexes opening and sequential-scan/index-entry teaching plus “Write cost and upkeep” / its page diagram; Storage opening, “Pages” and page-filling drawing. The references place explicit changes and consequences beside their drawings; this draft's first three state-card sequences do the same. The maintenance drawing is simpler but the visible structure changes support its narrower purpose.

## Remaining checks

Inspect intended coverage after these notes; representative phone layout and both themes; keyboard focus at player boundaries; sampled playback dwell/pause/reset; static maintenance and failure drawings at phone width. Technical correctness is assigned independently; these notes do not certify the execution claims.
