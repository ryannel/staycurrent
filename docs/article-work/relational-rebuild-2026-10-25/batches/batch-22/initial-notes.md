# First blind reader notes — pg-vacuum v01

Read the frozen rendered article at port 4606 before consulting its plan, intended outcomes, example facts, author notes or verdicts. Read the illustration labels/captions and stepped Figures 1 and 3, then the article body; compared bounded reference opening/development passages from all three fixed references and the rendered Storage row-version figure.

The argument is coherent: retained → eligible → reclaimed is distinct from file compaction, while a table with no obsolete tuple still has an age obligation. The P7 replay supplies the first distinction, Figure 2 supplies the file-size distinction, and Figure 3 shows an unchanged price while transaction age changes. Diagnostic queries appear after the mechanism that makes their evidence useful. The final action table gives an operational acceptance condition for each cause.

One concrete apparent problem: Figure 1, Only report R, step 4/6. R is Finished / Snapshot released, the explanation says the tuple is now eligible for cleanup, but the old tuple's status remains “Replaced, still retained”. That label is identical to step 3 while R still requires it. It blurs precisely the required/eligible distinction the subsequent paragraph teaches. Confirm after initial notes, but likely medium.

The introduction's sentence about Order 103 being pending/no payment/29.00 feels like example bookkeeping: none of those facts is used to explain vacuum. Optional editorial trim, not a delivery blocker by itself.

The prose and headings otherwise read plainly and develop concrete causes before operational advice. E.g. “A clear bit means there is no such proof” prevents the common false inversion of the visibility bit, and the threshold arithmetic explicitly distinguishes eligibility from a predicted start time. These qualifications change decisions rather than merely accumulating caveats.

Checks still to finish: Figure 2 rendering; explicit light/dark and phone, playback/pause and keyboard edges; brief/ownership teaching coverage. No technical source audit or live PostgreSQL execution has been performed by this reader.
