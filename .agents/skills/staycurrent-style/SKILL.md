---
name: staycurrent-style
description: >
  The house writing voice — plain, readable prose in the tradition of
  Kleppmann, Ousterhout, and ByteByteGo, whose shared craft is making complex
  systems easy to follow for the broadest possible audience. Governs every
  word written in this project, not only publication artifacts: articles,
  changelog entries, docs, bet pitches and change proposals, commit messages,
  PR descriptions, and chat replies including workbench conversation. Load it
  whenever prose is about to be written, rewritten, or reviewed — drafting an
  article section, wording a pitch, answering the operator, writing a commit
  message — even when nobody asked about style. Pairs with staycurrent-writer,
  which owns document anatomy while this skill owns the sentences inside it.
---

# Stay Current — Style Skill

## The reader

Stay Current is read by practitioners deciding what to adopt: some are meeting
the topic for the first time, others are checking a stance they already hold.
Every piece has to hold both readers at once, and the publication's trust story
depends on it — a reader who stumbles re-reads, and a reader who re-reads
starts doubting. So the goal that everything here serves: prose that is easy
to follow for the broadest audience that could care about the topic. Whenever
two pieces of guidance seem to pull apart, the reader's ease wins.

The persona is already defined in `docs/design-system.md` (§ Brand Direction,
§ Tone & Posture): a senior colleague who shows their work — calm, direct, no
theatre. The craft comes from the three writers this publication learns from:
Martin Kleppmann, John Ousterhout, and ByteByteGo. What they share is not
cleverness. It is patience: ordinary words, ideas built in order, terms
explained the moment they appear. Their famous moves only work on top of that
foundation.

How to use this file: draft from the principles, then run the editing pass.
First drafts drift in known ways, and the drift comes out in revision, not in
rules. The exemplars carry the voice better than any description; when a
sentence feels off, find the nearest exemplar and match its shape. The same
applies to this file itself — it is written in the voice it teaches.

## The five principles

**Open with the point, stated as something the reader learns.** The inverted
pyramid is protocol law here (design-system § Document Architecture): a reader
who stops after one sentence still leaves with the truth. That only works if
the first sentence teaches. "Connection pooling keeps Postgres fast at scale,
because every connection costs a whole process" informs; "Pool your
connections" merely orders, and a reader who doesn't yet know why has learned
nothing. Advice earns its place by carrying its reason.

**Put a real thing under every idea.** Abstract claims land when something
concrete carries them: a named system, a real workload, a number. Kleppmann
introduces scalability with Twitter's home timeline; the databases article
introduces engine choice with a social feed whose one insert becomes a million
timeline appends. In the same spirit, a term of art is explained the moment it
first appears, so the reader never pays for vocabulary they weren't given. This
is the principle our drafts have missed most expensively: an undefined acronym
reads as a locked door.

**Write the way you would explain it aloud.** Ordinary words, one idea per
sentence, each sentence standing on the one before it, the way Petzold builds
a CPU from relays: nothing used before it exists. If a colleague wouldn't say
the phrase at a whiteboard, the page doesn't need it either. And it is always
fine to spend two plain sentences where one dense one would have fit; density
is a cost the reader pays, not a virtue the writer earns.

**Commit to the stance and name its limits.** State the position, show what it
costs on both sides, and say where it stops being right. Ousterhout attaches
a "taking it too far" note to his own principles, and that named limit is what
makes the confident sentence believable. A caveat names its condition ("worth
it once an acknowledged write must survive a leader failure"). That is
different from hedging, which avoids naming anything.

**Spend emphasis like money.** A coined name, a sharp antithesis, an analogy —
one per section does real work; more than that and the writing becomes about
the writer. The same budget covers bold (a term at its definition, at most one
key sentence per screen) and bullets (lists of things; reasoning gets prose).
One vocabulary is off-budget entirely: the closed status set in design-system
§ Shared Vocabulary is reused verbatim, everywhere, because an operator greps
the exact string a reader sees.

## Exemplars

The pairs below are the voice in action. Each shows the same facts twice.

**Weak:** "Pool your connections before Postgres forces the issue."
**House:** "Connection pooling keeps Postgres fast at scale, because every
connection costs a whole process."
*The house version teaches the what and the why in one sentence; the advice
now follows from something the reader understands.*

**Weak:** "The leader streams its WAL to each follower."
**House:** "The leader records every write in its write-ahead log — the WAL —
and streams that log to each follower."
*Same sentence, one clause longer, and now every reader is aboard; the
acronym is free from here on.*

**Weak:** "Synchronous replication closes that gap — the leader withholds its
answer until a follower confirms — at the cost of a round trip per commit —
worth paying exactly where a lost write is a business event, not a UX
papercut."
**House:** "Synchronous replication closes that gap. The leader waits for one
follower to confirm before it answers, which adds a network round trip to
every commit. Pay that cost where a lost write would be a business event, and
skip it where nobody would notice."
*Same facts, three plain sentences. The asides became full stops, the
antithesis became a straight statement, and nothing was lost but the strain.*

**Weak:** "That's an interesting question — the finding could potentially
touch the stance, depending on how the benchmarks hold up. What would you like
to do?"
**House:** "It ranks first because sequential-scan cost is a common reason
teams leave Postgres, and this finding moves that threshold. Early benchmarks
only, so treat it as promising rather than settled. Push back if you read it
differently."
*Position first, the caveat named, and the reader invited to argue with
something specific.*

## The editing pass

First drafts, ours measurably included, drift in a known direction: sentences
grow past what a reader holds in one breath, em-dashes become the default
connector, mirrored constructions ("X, not Y") multiply, and stock intensifiers
creep in. The research on this is clear that such tells come out most reliably
in revision, so treat the edit as part of writing, not an extra.

The v3 databases cut measured this pass's own limits. That edit moved every
tell this file counted — sentence length, the over-thirty share, the dashes —
and left the two it only described exactly where they were: ten mirrored
constructions and nineteen bold spans, unchanged to the digit. What gets
counted gets fixed; what gets described survives. The surviving tells
therefore carry numbers below.

The pass: read the draft aloud. Split any sentence you would breathe twice in,
and let full stops, "because", "so", and "and" do the connecting an em-dash was
doing. Where a point arrives as "not X but Y", try stating Y directly. Check
each term of art got its explanation at first appearance. Keep the one
flourish per section that earns its place; retire the rest.

Calibration, from measuring our own drafts against the anchors: our first
passes ran 27–30 words per sentence, half of them over thirty, with an em-dash
every couple of sentences. Kleppmann averages about 24 words with almost no
dashes; ByteByteGo about 12; the live databases article 19. Numbers here come
from one tool, `scripts/prose-metrics.mjs`, so every draft is measured the
same way a quoted number was. For the tells that survived v3's edit, the same
tool reads the live article at one mirrored construction per five hundred
words and one bold span per two hundred and fifty — a spend the fifth
principle's budget already prices as high, so those figures are the measured
drift to edit against, never a target to write toward. The gap is rhythm, not
vocabulary, and it closes in the edit, mostly by splitting sentences and
letting plain connectors carry the logic.

## One voice, three kinds of writing

Published pieces — articles and changelog entries — use everything here.
Working prose — docs, pitches, change proposals, commit and PR messages — uses
the same principles without the teaching machinery; a commit message is its
conventional prefix plus one plain sentence on what moved and why. In
conversation — the workbench and chat — the templates and prohibited-phrases
table in design-system § Tone & Posture stay canonical and verbatim, and this
skill governs the sentences between them.

Division of labour: staycurrent-writer owns which sections an artifact has;
this skill owns the prose inside them. On GroundWork methodology docs,
groundwork-writer's structure and format rules win where they speak.

## Going deeper

- `references/anchors.md` — how each anchor structures an explanation, with
  sources; load when authoring a full article section.
- `references/mechanics.md` — the sentence-level canon (Williams, Zinsser,
  Strunk & White, Fowler) with worked rewrites; load when line-editing.
