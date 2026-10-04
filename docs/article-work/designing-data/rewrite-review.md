# Schema article rewrite: independent substantive review

Reviewed 4 October 2026, against the rewritten `modelling.astro` and the source
for SchemaAnatomy, NormalisationOverview, NormalisationSteps, SchemaTradeoffs and
NormalisationTable. This is an informed technical and editorial reading, not a
blind interpretation or rendered-browser check. The reviewer did not author or
edit the article or its aids. Root is checking the rendered page separately.

## Reader promise

The rewrite now introduces the subject before asking readers to follow the shop.
It distinguishes schema from records, shows the destination of normalisation,
then develops row meaning, identity and functional dependencies before the
normal-form transformations. This is a substantial repair of the earlier
example-first treatment. A reader can explain why a field moves, rather than
only recognise the finished four-table answer.

The strongest passages distinguish repeated references from repeated facts,
dependencies from coincidences in sample data, and current prices from agreed
purchase prices. The discussion of table boundaries also answers the user's
concern about taking separation too far without claiming that more tables
necessarily mean greater normalisation. Derived summaries have an explicit
authority and maintenance policy.

The new aids have explanatory jobs: schema versus instance; copies versus a
shared fact; rows for repeated entries; partial and transitive dependency
splits; and unnecessary one-to-one fragmentation. Their highlighted columns,
retained IDs and before/after arrangements carry information beyond their
captions. This is materially more useful than adding decorative illustrations.

## Consequential repairs

1. **Make the failed-join example expose an actual wrong answer.** The lossless
   decomposition paragraph separates O13's quantities, but both quantities are
   one. Its claim that a quantity can be paired with the wrong product is a
   valid general warning that this particular sample does not demonstrate.
   Use O13's agreed prices instead: separating €20 and €24 from the lines while
   retaining only `order_id` gives four product/price matches, including P7 at
   €24 and P8 at €20. Keeping `(order_id, line_no)` preserves the intended two
   associations. This uses existing data and makes the failure inspectable.
   Root repaired the prose and added `RejoinRecords.astro`. A bounded source
   recheck confirms the diagram retains `(O13, 1)` and `(O13, 2)` on both sides
   for two correct matches, then drops line numbers to show all four matches
   on O13 alone. Dashed crossed edges identify P7/€24 and P8/€20 as invented
   pairs. Its caption also explains that a lossless split is not necessarily a
   useful split. This finding is resolved; rendering remains root's check.

2. **Repair the malformed practice-file link.** The opening anchor lacked its
   closing `>` before the link text. Root confirmed repair during this review.

No further blocking technical or editorial findings in the reviewed source.
The advanced formal 3NF paragraph is denser than its surroundings; the ordinary
case already stands on its own. A disclosure or further-reading treatment would
be a reasonable editorial choice, but it is not required for correctness.

## Technical evidence

Reopened [UC Berkeley CS186's database-design notes](https://cs186berkeley.net/notes/note13/)
for keys, functional dependencies, anomaly motivation and the lossless split
condition. The article's retained determinant keys make the demonstrated splits
lossless under the stated dependencies. The practical caveat about preserving
the entire line identity is appropriate; the concrete counterexample needs the
repair above.

Reopened [RPI's normalisation lecture](https://www.cs.rpi.edu/~sibel/csci4380/fall2026/lecture_notes/lecture5.html)
for the formal 3NF definition. The article preserves the candidate-key-attribute
exception and does not incorrectly equate 3NF with BCNF. Its second-normal-form
example removes order-level fields depending on one part of the composite key;
the third-normal-form product example removes current catalogue facts depending
on a non-key product reference. Fixed scalar product slots are correctly
distinguished from a first-normal-form violation. Historical prices are correctly
treated as distinct facts rather than performance duplication.

For editorial judgement, reread the house writing references and Julia Evans's
[discussion of teaching with cartoons](https://jvns.ca/teach-tech-with-cartoons/).
The article's diagrams now stage the transformations readers need to understand.
Its prose remains independently understandable without running the existing
name/price experiment.

## Handoff

Ready for draft handoff once root's rendered checks and build pass. The
failed-join example repair is checked. No concurrency, SQL, accessibility or browser
execution claim is made by this review. Agent review does not authorise
publication.
