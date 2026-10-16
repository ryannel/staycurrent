# Heading review, 16 October 2026

The user identified “Start with the rule” as an unhelpful label in Transactions
and concurrency, while accepting “Commit and rollback” as a heading that describes
its section. This feedback follows earlier heading failures recorded in
`docs/writing-style.md`; previous agent approval did not establish an acceptable
heading here either.

The section explains why a purchase's order, line and stock reduction belong in
one transaction. Its new heading is “Choosing the transaction boundary.” The body
and stable `choosing-the-boundary` anchor remain unchanged. The contents link,
“Choose what must succeed together,” identifies the same decision.

## Guidance change

The style skill now distinguishes anticipating a section from inferring an author's
intention afterwards. The authoring skill asks writers to revisit working headings
against the finished argument. The review skill and its context-free first-reading
reference ask for the expectation before reading the body, followed by comparison
with the actual explanation. A comprehensible body does not establish a useful
label. Good headings should survive, and this is not a lexical check or a ban on
imperatives, questions or the word “rule.” The detailed example lives in the writing
reference; the blind-reading guidance contains no case-specific answer.

The earlier relational foundation review retained this article for its substantive
mechanisms and application examples. That record supplies no specific evidence
that “Start with the rule” helped a reader anticipate the section. We cannot infer
the previous reviewer's internal reasoning; the observable gap is the missing
heading-to-section judgment.

## Independent behavior checks

A reviewer received only the revised context-free guidance and the original
rendered opening/two-section extraction, without this feedback or the proposed fix.
It retained “Commit and rollback,” identified the ambiguity in “rule” and proposed
“Which changes belong in one transaction?” It also disclosed that it read the
whole chunk before reconstructing expectations. That is useful semantic feedback,
but it does not validate the intended before-and-after reading procedure.

A second independent reviewer received the material in three separate deliveries:
opening plus first heading; first body plus second heading; second body. Each
observation was returned before the next delivery. Its observations were:

- Before the first body: expected a worked purchase and an account of keeping or
  discarding changes. Afterwards: the explanatory presentation fulfilled the heading;
  the anticipated worked example was a reasonable expectation, not an unmet promise.
- Before the second body: expected a condition for a complete purchase, but could
  not identify what “rule” referred to from the heading.
- Afterwards: the body explains the grouping well, but the heading becomes clear
  retrospectively and could suggest a database constraint. Suggested “Which changes
  belong together?” and retained “Commit and rollback.”

Both alternatives support the same diagnosis as the chosen repair: identify the
transaction-grouping decision. These bounded checks preserve a valid heading and
identify the reported failure; they do not establish a site-wide heading audit or
prove that future reviews will catch every mismatch. The separate deliveries also
matter: an instruction to remember a first impression cannot undo seeing the body.

## Verification

The three changed skills pass `quick_validate.py`; Claude mirrors match. The site
build passes with 77 pages. Built HTML has “Commit and rollback” followed by
“Choosing the transaction boundary.” The existing section anchor is preserved.
No example behavior changed, so no SQL or model tests were added or rerun.
