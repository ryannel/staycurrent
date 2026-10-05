# Isolated reading: JsonStaleWrite

I read only the component's markup and styles, with the independent-reader voice reference. I treated the figure's labels, numbered events, comparison, and caption as the complete explanation. I did not read the surrounding article or review history.

## What happens

Two people, A and B, read the same stored object before either makes a change. A changes its finish from gloss to matte and commits. B later changes material in the copy B saved earlier, then submits that entire copy. B's copy still says gloss, so B's successful write leaves the stored object with stoneware and gloss. A's committed finish change has disappeared.

The numbered events make the sequence clear. The title points me toward the age of B's object, and the caption makes clear that the writes do not overlap. I do not read this as two writes colliding at the same instant.

## Which values each person has

| Moment | A's information or submitted values | B's information or submitted values | Stored object |
| --- | --- | --- | --- |
| Both read | material ceramic, finish gloss | material ceramic, finish gloss | material ceramic, finish gloss |
| A commits | A has changed finish to matte | B still has the earlier ceramic/gloss copy | material ceramic, finish matte |
| B prepares and submits its edit | No further action from A is shown | material stoneware, finish gloss | A's ceramic/matte object until B's write takes effect |
| B commits | No new read by A is shown | B has submitted stoneware/gloss | material stoneware, finish gloss |

The figure does not show what either person's local copy contains after B commits. Its final claim concerns the stored object.

## What causes the outcome

B intends to change material, but sends a replacement containing both fields. The finish field in that replacement comes from B's early read. The row lock makes the writes take turns; it does not refresh the values inside B's submitted object. The old gloss value therefore replaces the committed matte value.

The distinction between intention and submitted data is understandable without surrounding prose: the third event names B's one edit and also prints the whole object that B sends.

## Comparison and assumptions

The comparison changes how B writes. Instead of sending the saved object as a replacement, B uses a `jsonb_set` expression to change only material in the current stored object. The stated outcome is stoneware and matte. I understand this as preserving A's finish because B's operation leaves that field alone.

The stated setting is PostgreSQL Read Committed. Both early reads precede A's change; A commits before B writes; neither writer waits in this schedule. The example starts independently with P7 at ceramic/gloss. It shows no conflict detection, retry, third writer, or additional changes.

## What a reader must supply

The figure assumes some familiarity with a commit, a row lock, and PostgreSQL Read Committed. It names these concepts but does not explain them. I can follow the stale-copy outcome without knowing the isolation level, although I cannot explain from the figure alone why the named level is relevant.

The comparison names `jsonb_set` without showing an expression or explaining how it refers to the current stored object. I can understand the claimed result, but I could not implement the alternative from this figure alone. A beginner also has to infer that P7 identifies the thing whose object is stored; the label's meaning is not supplied.

## Material ambiguity or inaccuracy

I found no material ambiguity in the displayed values, event order, or cause of the lost finish change. The figure clearly limits its claim to the shown sequence.

The main explanatory gap is in the alternative: the prose says that B changes the current object, but supplies only the function name. The figure does not let me distinguish an expression applied to the stored value from a similar operation applied to B's saved copy. Showing the input to the expression would make that distinction independently checkable. This is an observation about what the figure establishes, not a claim that its stated outcome is inaccurate.
