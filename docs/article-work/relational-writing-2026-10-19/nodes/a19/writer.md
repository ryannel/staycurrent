# a19 writer handoff

Ready for central review. Staged `article.astro`, own `src/components/relational-next/a19/` only; no final article/shared edits, Git staging, commit or push.

Read all three fixed reference articles in full, including their figure instructions, with the SequencePlayer, Storage StepFigure and Index scan implementation as concrete teaching examples. Read the actual a03 parent and a18 sibling. All seven supplied heading anchors retained; no tree change proposed.

The article extends the parent's class-21 and staffing cases with exact snapshot boundaries, current locking operations versus ordinary views, conflicting-row recheck/abort behaviour, dependency cycles involving different rows and future inserts, complete retry, and the distinction between serial order and real-time order. It leaves explicit locking protocol construction to a18, request retry machinery/unknown outcomes to applications, physical retained-version costs to a24 and replica read paths to a38. Contextual and final continuation links are present.

Five interactive comparisons carry the mechanisms: statement/transaction/late-first-read snapshot; four locking/current-view variants; staffing dependency cycle and rejection; empty-predicate inserts; hypothetical real-time ordering contract. No autoplay. Slow playback budgets all panel text plus narration at 180 words/minute plus 3 seconds, minimum 6.5 seconds. All controls stay in place, endpoint buttons retain focus through aria-disabled, phone cards use divs with zero margins, and reduced-motion removes arrivals. Static rendering gives the completed default state. Independent browser review is still required after root promotes/builds.

Native PostgreSQL 18.6 worksheet passed 36 assertions / 133 command records, with real concurrent open transactions and observed lock waits, not guessed sleeps. Own three sessions/database removed; shared runtime untouched. Reproducible downloadable Python worksheet; no browser download action performed. MySQL 8.4 comparisons are explicitly documentation-only; real-time figure is hypothetical rather than a claimed PostgreSQL anomaly.

56 model frames and selected native-result consistency checks pass. Both Astro fragments compile without diagnostics. Sources and expected-vs-observed table in sources.md. Root owns the full build, immutable preview and two independent article reviews.
