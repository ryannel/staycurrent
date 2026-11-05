# Voice

The reader should feel that someone who understands the subject is helping them see it.
Plain language can carry difficult reasoning, and it keeps the reader's effort on the
idea rather than on the prose.

## Anchors

The style is anchored in Sam Who's animated explainers, such as
[Memory Allocation](https://samwho.dev/memory-allocation/) and
[Load Balancing](https://samwho.dev/load-balancing/), and in Bartosz Ciechanowski's
development of an idea, as in [Gears](https://ciechanow.ski/gears/). The owner loves Sam
Who's approach and likes Ciechanowski's explanations, though not his introductions. The
owner does not want Julia Evans's tone, and finds Ilya Grigorik's long sentences hard to
read. Learn the structure from these pieces, not their sentences: no personas, dialogue,
exclamation marks or borrowed metaphors.

## Structure

- One running model carries the page, and each section changes one thing in it.
- The reader sees the behaviour first; the term arrives as the name for what they saw.
- A simple version fails, a fix follows, and then the fix's own cost.
- Put a mechanism in words, then a formula if it needs one, then what the formula means.
- An opening gives the reader's interest substance: what the thing is, what it is for,
  and why the next question matters.
- A section ends when its point is made, and the next one opens from where the reader
  now is. Headings use the field's own terms, because readers also skim.
- Verdicts are plain.

## Rhythm

Vary sentence length. The reference articles average 27–28 words a sentence; a run of
uniform 15-word declaratives, each followed by a qualification, reads as monotone and
cautious. Clear is not the same as short: a missing step costs the reader more than the
sentence that would have supplied it.

## Weak and strong

Weak, a hedge where a number would teach:

> Thirty seconds is arithmetic under fixed rates, not a recovery guarantee.

Strong, from the reference Storage article:

> Replaying that log took 3.35 seconds, about 169 MiB a second.

Weak, a comparison without magnitude:

> Ten million narrow rows take fewer pages than ten million wide ones.

Strong:

> With 100 bytes of data a row takes 128 bytes, plus a 4-byte pointer: 132 in all. So 61
> rows fit.

Weak, a deferral where the reader needed an answer:

> Freshness and invalidation owns that allowance.

Strong: answer in one sentence here, then point to the article that develops it.

Strong, a distinction an expert relies on, stated exactly:

> Cancellation being requested is different from the source confirming it has stopped.
