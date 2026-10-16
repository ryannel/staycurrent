# Writing skills audit and plan

16 October 2026. Revised after two independent reviews and two trial readings,
summarised at the end.

## The problem

The drawing-systems collection passed planning review, an editorial review, a
blind sequential reading and browser checks. The editorial review called the
prose strong. The user finds the whiteboarding article full of the faults the
skills were meant to prevent: odd headings, sections that begin without telling
the reader where they are, and a register that sounds machine-made.

This has happened before. `docs/writing-style.md` records the Indexes opening
being rejected twice, and notes that "the guidance existed but was not applied".
So the question for this audit is why guidance that already exists isn't
reaching the page, rather than which guidance is missing.

## The reader

The user's words, 16 October 2026:

> We want to cater to a technical ordience who is skimming for terms they might
> know.

Asked how articles should use worked examples, they chose "Terms first, short
examples": each section names and defines its term up front, and a short example
follows to show it. There's no long running story to follow from the top.
Offered fixed page templates, they replied:

> This feels too rigid. We need flexibility to write in the best way possible. A
> cookie cutter template isn't how we should do this.

None of this is in `docs/product-brief.md` or `docs/site-direction.md` yet. It
changes what the whiteboarding article should have been. It was written as a
staged meeting to follow from the start, where this reader wants to find
"sequence diagram" or "swimlane" in a heading and get the point in the first
sentence.

## What goes wrong in the whiteboarding article

**The example starts three times.** The introduction says whiteboarding is "a
way to think with other people" and announces a staged conversation. "The first
five minutes" then gives a five-step method that draws Browser UI, Repair API and
Repair DB before anyone in the meeting has mentioned them. "Compose a small scene
with plain shapes" goes back to lettering and spacing and redraws the first
arrow. The conversation finally begins at "Hear the account", with "A coordinator
begins:", and the same three boxes go up a third time.

**The headings summarise advice.** "Compose a small scene with plain shapes",
"Hear the account, then choose the view", "Correct an arrow without losing the
conversation", "Finish with a board someone can read back". Each compresses its
section into an instruction, and several don't match what the section contains.
"Use colour to distinguish evidence and proposals" contains no evidence;
"Finish with a board someone can read back" also holds the advice on remote
boards. Other articles in the collection use the same form: "Choose a question
before a zoom", "Review meaning before appearance".

**Sections begin cold.** "Start with the words." "When you are working alone,
supply the account before reaching for shapes." "For this collection, we use five
pens". "Drawing from memory" leaves the meeting the article has been following,
and the next section returns to it without saying so.

**The register.** One reviewer, reading only the article, counted about 40
instances of seven habits:

- paragraphs ending on a maxim: "A correction is part of the work." "Words are
  part of the drawing." "Repair the drawing before decorating it.";
- denials of things nobody claimed: "The timing is a way to begin, not a speed
  test." "These are our conventions, not universal meanings of the colours.";
- abstractions given intentions: "Familiar infrastructure icons should not
  invent components on the speaker's behalf." "the layout or label may still be
  fighting the meaning";
- hedges that change nothing the reader would predict: "assuming the group
  confirms it", "A box can have slightly uneven corners and still do its job.";
- lists of things the reader won't use next, as in the final caption's "named
  parts, labelled operations, an explicit external provider, a numbered trace, an
  unresolved question and a separate proposal";
- promises the reader can't decode yet: "By the end they will be visibly
  different kinds of information.";
- words the reader was never given: "account" for "what someone told you" (about
  12 times), "view", "status", "scene", "an open gesture", "five pens".

**The article follows a topic list.** The collection plan's brief for it read:
"beginning with a question, extracting nouns/verbs/events, choosing and changing
views; drawing from conversation or memory; a staged worked meeting;
disagreement, uncertainty, facilitation, space, remote boards, stopping and
capturing. A concrete first-five-minutes method." Nearly every item became a
section or a paragraph, in roughly that order.

## Why the skills don't prevent it

### The user's corrections get rewritten into hedged lessons

When the user rejects a passage, the agent records the episode in
`docs/writing-style.md` and generalises it. The record then qualifies the lesson
until little of it binds: "These revisions are candidates for the user's reading,
not proof", "It does not make the exact wording a template", "Adding a phrase
blacklist, a prose score, or another automatic approval would not establish that
the writing works." The skills summarise those records again, one step further
from what the user said. This is the main reason existing guidance doesn't get
applied: by the time it reaches a writer, it has been turned into the same
register that produced the fault.

### The guidance is written in the register it's meant to prevent

A model picks up the voice of its instructions. The style skill says "Judge the
cumulative effect in context; none of these is a banned construction" and
"there is no prose score, prescribed sentence length or vocabulary list". The
authoring skill opens by saying its references "are not an article template or a
sequence to reproduce". The five skills and their references contain about 80
"not a", "rather than", "does not" and "cannot" constructions in 12,200 words.

### The guidance is long and arrives as database case histories

Most lessons are stories about past database articles: the Indexes opening, the
pagination draft, the positional INSERT. A writer drawing a whiteboard has to
work out what "SQL needs someone to send it" asks of them. The instruction that
covers the drawing articles' section openings ("give a sequence of worked cases a
clear purpose and an introduction where the reader enters it") is one clause in
a 25-line paragraph about headings.

### Briefs list topics, so articles list topics

Planning and authoring ask for coverage: "what explanations this audience would
reasonably expect", "essential coverage and deliberate boundaries". Review checks
coverage against the brief. Nothing asks for the line of thought: what the reader
is wondering at each point, and how the next section answers it. A topic-list
brief and a coverage check together reward an article that touches every item.

### Review asks about everything except how the prose sounds

The review skill is mostly method: blindness, chunked delivery, heading-tree
extraction, image loading, practice files. Its writing judgement is one
paragraph. The drawing editorial review covered figures and coverage thoroughly
and gave prose one paragraph of praise.

We tried asking the question directly. Two fresh reviewers read the
whiteboarding article. One loaded the style and review skills; the other loaded
nothing and was asked to find machine-written prose. Both said it needed repair,
so a direct question matters a great deal. The skill-guided reviewer was good on
structure. On register it named five maxim endings and then excused them ("Each
is fine alone"), echoing the style skill, and it praised the opening sentence the
user objects to. The unguided reviewer found the 40 instances listed above. This
is one comparison, and the unguided reviewer was told what to look for, so it
shows that the skills can make a reviewer tolerant of the register. It doesn't
measure by how much.

Review also feeds the register. Each reviewer's objection tends to come back as
an appended qualification, and "assuming the group confirms it" reads like one.

### The user sees the work too late

Nine articles of about 2,000 words were written in one push, one author wrote
three, and the user's first read came after publication. The point where a
weird title is cheapest to catch, before drafting, has no human in it.

### A limit on this evidence

The latest heading guidance was committed at 02:39 and 02:54 on 16 October, and
the drawing collection at 03:33. The articles were probably drafted under the
earlier skills. That weakens the whiteboarding article as evidence against the
current heading guidance specifically. It doesn't affect the other causes, which
are older.

## What the user asked for before

`docs/writing-style.md` records the user's earlier direction for the skills:
"lead with context, goals and good examples, and trust the agent to find an
approach suited to the writing". The plan keeps that for the writer. The writer
gets context, the reader's situation and good passages, and no list of banned
habits; showing a model bad examples tends to make it produce them, and banning a
form invites a substitute ("instead of" for "not X but Y"). The firm checks go to
a separate line editor who doesn't write the article. The user should confirm
that division (decision 1 below).

## The plan

The plan starts with a small trial and changes the skills only if the trial
works. Earlier rounds rewrote the skills first and found out afterwards.

### Stage 1: trial on a new subject

Pick a short article on a subject the site hasn't covered, so no before/after
pair in the new guidance can serve as its answer key. Write it twice, by two
fresh authors: one with the current skills, one with the trial kit below. Then
run the comparison in stage 2.

The trial kit has three parts, kept outside the live skills until they prove
themselves.

**A short positive style guide**, about 1,000 words, written the way we want
articles to read. It describes what the benchmark chapters (see "The
benchmark") do for a reader who is skimming. These are descriptions, not a page
template:

- **Headings are the field's terms**, spelled the way the field spells them:
  "Three-Way Handshake", "Head-of-Line Blocking", "Streams, Messages, and
  Frames". Some name an operation ("Tuning Application Behavior") or make a
  short claim that starts with the term ("Packet Loss Is OK"). None gives advice
  in general words.
- **The first sentence does one of three things.** It defines the term ("Flow
  control is a mechanism to prevent the sender from overwhelming the
  receiver"), sets it against what the reader already knows ("With HTTP/1.x, if
  the client wants to make multiple parallel requests…"), or follows from the
  previous section ("Once an HTTP message can be split into many individual
  frames…").
- **New things are explained against familiar ones.** HTTP/2 is taught as the
  HTTP/1.x baseline, its limit, then the change. "Do the above requirements
  remind you of TCP flow control? They should."
- **Terms are glossed where they appear**, with the acronym: "receive window
  (rwnd)". A small group of related terms can be a short definition list.
- **Examples are short and come after the term.** One sentence ("the user has
  paused the video"), or a few stated parameters ending in one number ("264 ms
  to transfer a 64 KB file").
- **Numbers and sources are exact and dated:** "65,535 bytes", "RFC 2581
  updated this value to 4 segments in April 1999".
- **History explains why a mechanism exists**, and trivia goes in a sidebar.
- **Sidebars hold the extras:** tuning commands, extensions, the obvious
  objection, the same idea at another scale. The main text stays on the term.
- **Section length follows the weight of the mechanism.** Binary framing gets
  three short paragraphs and slow-start about fifteen.
- **Judgement is plain and backed:** "the single most important enhancement of
  HTTP/2", followed by the evidence.
- **Sections connect through the shared mechanism**, not a story: "With the new
  binary framing mechanism in place…", "first recall that…".

The guide also names what the benchmark gets wrong, so the writer doesn't copy
it. Terms sometimes arrive late: "head-of-line blocking" is only named at the end
of its section's third paragraph, and HTTP/2's first defined term comes after
about 200 lines of history. There's some throat-clearing ("It is important to
recognize", "Needless to say"), promotional tone ("killer feature") and about a
dozen exclamation marks.

The writer reads the two benchmark chapters before drafting.

**A term map in the brief.** Before drafting, the brief lists the terms this
reader might skim for, the ones the article will cover, in the order they build
on each other, with one plain sentence each saying what the section tells the
reader about that term. The title, the description and the heading list come from
it, so headings use the names people already search for (C4, sequence diagram,
swimlane, BPMN gateway) rather than advice. Topics that don't belong to a listed
term go to another article or are cut. Each section's first sentence has to do
what its map sentence says, and the line editor checks that it does. Section
length follows the term: a paragraph for some, pages for others.

**A line editor.** A fresh subagent that gets the article, the term map and the
habit list, and does nothing else. The habit list is the one above, worded
narrowly enough to leave good prose alone (see "Habit definitions"). The line
editor quotes each hit and writes the replacement itself, so the author model
doesn't regenerate the register while repairing it. A second fresh reader checks
that the replacements haven't brought in new habits. Two rounds at most; anything
still disputed goes to the user rather than into another round.

### Stage 2: check the trial honestly

1. **False positives first.** Run the line editor over both benchmark chapters.
   If it flags anything an editor wouldn't act on, tighten the definition before
   going further.
2. **Blind comparison.** Two fresh readers get the two trial articles,
   unlabelled, and the benchmark chapters. Each is given three or four terms to
   look for and skims both articles for them. They report how quickly they found
   each term, whether the first sentence gave them the point, and where each
   article falls short of the benchmark.
3. **The user reads both.** Their reaction decides whether stage 3 happens.
   Their words go into `docs/writing-style.md` verbatim, with the date and the
   passage, and no agent commentary.

If the user still rejects the trial output, the next step is to remove guidance,
not add another case history.

### Stage 3: adopt what worked

Only after the user accepts a trial article:

- Record the reader in `docs/product-brief.md` and `docs/site-direction.md`:
  a working engineer skimming for terms they might know, terms first and short
  examples, no fixed page template.
- Replace the style skill with the trial style guide. Move the database case
  histories into `docs/writing-style.md` as background.
- Add the term map to the planning and authoring skills, and the line editor to the
  review skill. Move the review method (blindness, chunking, extraction) into
  `references/protocol.md`, so the skill itself holds only the coordinator's
  decisions.
- Add a user checkpoint before drafting each batch: the title, description,
  heading list and term map for its first article. That takes a couple of minutes
  and catches the faults where they start. It changes the line in `CLAUDE.md`
  that "agent review can complete a draft without routine human editing", so it
  needs the user's agreement (decision 2).
- Add a rule for recording feedback: the user's words go in unedited and
  ungeneralised. A lesson drawn from them is labelled as the agent's reading.
- Repairs replace text instead of adding to it, and a repair round that makes
  the article longer needs a stated reason.

### Stage 4: the drawing collection and tidying

Rewrite the whiteboarding article with the adopted skills and give it to the
user. If it works, take the rest of the drawing collection one article at a
time. Separately, make `.agents/skills/` a generated copy of `.claude/skills/`
with a check that they match, since today it is a full duplicate that can drift.

## Habit definitions

These are tuned against the Grigorik benchmark. On the two chapters, the
previous wording produced only a handful of real hits (a slogan restated at the
end of a list, a promise the chapter never keeps, "And much more…"). It also
misfired on term headings, on sections that open by defining their term, and on
lists of protocol names. The wording below fixes those misfires, and drops the
exceptions written for Nystrom's narrative style, which hide the term from a
skimmer. Each definition still catches the whiteboarding examples in "What goes
wrong".

The reader is a working software engineer.

- **Maxim ending.** A paragraph's last sentence restates it as a general truth,
  or repeats a consequence the page has already given, and adds no number,
  mechanism, condition or new consequence. It's fine when the next sentence or
  paragraph applies it to a specific case, or when it's a heuristic of the form
  "when you see X, do Y". Judge by how many accumulate across the page.
- **Denial of an unheld view.** "Not X" where nothing on the page, in a paired
  term or in common belief would lead the reader to X. Countering a common belief
  or a misleading word is fine: "a transport preference, not a requirement".
- **Abstraction with intentions.** An object is given judgement, desire or
  social action, so the reader can't tell who decides or what happens: "icons
  should not invent components". Fine: field idioms (an algorithm "takes over"),
  protocol actors (client, server, browser) that prefer and decide, and "should"
  for a requirement.
- **Protective hedge.** A qualification that changes nothing the reader would
  predict or do: "And much more…", "not outside the realm of possibility". A
  note on what's left out is fine when it gives a reason or a pointer, and one
  line setting the reader's assumed level is fine.
- **Idle list.** A list in the main text that the reader is asked to hold and
  won't use next. Fine: field terms listed for search when the sentence says what
  they share or that the reader needn't hold them; a preview whose items become
  headings; the parameters of a worked example.
- **Undecodable promise.** A forward reference the reader can't decode until
  after unrelated material has come in between, or that the page never keeps. A
  promise kept by the next sentence, section or heading is fine.
- **Ungiven word.** A house coinage, or an everyday word used as a term ("the
  account", "view", "scene", "five pens"), before it's defined. Field terms the
  reader already uses are fine undefined. A new field term is fine when it's
  glossed in the same sentence, by what it does or with its acronym.
- **Advice heading.** A heading that gives advice or a verdict in general words
  instead of the field's name for the thing, or whose wording doesn't match its
  section. Fine: the term or terms the section covers, an operation named by its
  term, a short claim that starts with the term, a comparison ("X and Y"), or a
  question a reader would search for. Page titles and descriptions take the same
  test.
- **Cold opening.** A section whose first sentence neither names or defines its
  heading's term, nor sets it against something the reader knows, nor follows
  from the previous section. A house convention isn't a definition. A section
  that leaves an example, or comes back to one, says so.

## The benchmark

The benchmark is a human-written reference book for working engineers, not the
site's own approved articles. The user named *Designing Data-Intensive
Applications* as the kind of book they mean. That isn't freely available, so
the benchmark is the closest book that is: Ilya Grigorik's *High Performance
Browser Networking* (O'Reilly, 2013). It uses two chapters:

- "Building Blocks of TCP". Mechanisms under the field's own names: three-way
  handshake, flow control, slow-start, bandwidth-delay product, head-of-line
  blocking.
- "HTTP/2". A new protocol explained against the one the reader knows.

The book's text is on GitHub and licensed CC BY-NC-ND 4.0, so we read it from a
pinned clone and quote it briefly, without copying the chapters into this
repository. `benchmark.md` beside this plan gives the commit, files and
commands. If the user supplies chapters of *Designing Data-Intensive
Applications*, they become the primary benchmark, read locally and never
committed.

The benchmark has three uses:

1. **False-positive baseline.** Before every change to the habit list, the line
   editor runs over both chapters. Any flag an editor wouldn't act on means the
   definition is too broad.
2. **Source for the style guide.** The positive guide describes what these
   chapters do, quoted briefly.
3. **Anchor for comparisons.** Readers judging a trial article say where it
   falls short of the benchmark, and how, as well as comparing it with its
   rival.

Sam Who, Ciechanowski and Julia Evans, the references the site already names,
would make useful additions. Their sites are blocked by this environment's
network policy (`samwho.dev`, `ciechanow.ski`, `jvns.ca`). They can join the
benchmark if those domains are allowed in the environment's network settings.

## Decisions for the user

1. **Firm checks with a separate line editor.** You earlier asked the skills to
   lead with context and good examples and to trust the agent. The plan keeps
   that for the writer and adds a line editor who checks a list of habits and
   rewrites the hits. Is that acceptable?
2. **A two-minute review before drafting.** You'd read the title, heading list
   and term map before a batch is written. Is that acceptable?
3. **The trial subject.** Choose a short new article (a candidate from planned
   coverage), or let the trial author pick one.
4. **The drawing collection.** It can stay published as it is until stage 4, or
   be withdrawn until it's rewritten.

## Review record

- **Skill-guided editorial reading of whiteboarding.md.** It followed the current
  style and review skills, reached "repair required", and was strong on
  structure. It excused the maxim endings and praised the opening.
- **Unguided editor reading of whiteboarding.md.** It reached "would not
  publish" and counted about 40 register hits across seven habits. Its counts
  are used above.
- **False-positive test against the site's own writing.** It ran the first
  habit list over the column-store essay and found most hits were legitimate.
  The user then asked for a benchmark of best-in-class human writing instead of
  approved site articles, so this test has been replaced.
- **Benchmark tests, one per Nystrom chapter.** Each ran the second habit list
  over a chapter and treated every hit as presumed false. *A Map of the
  Territory* produced only false positives. *State* produced about 20, with
  one borderline clause. The user then judged Nystrom the wrong reference, since
  the reader is "a technical ordience who is skimming for terms they might
  know", so these results have been replaced.
- **Benchmark tests, one per Grigorik chapter.** Each ran the third habit list
  over a chapter, treating every hit as presumed false. Between them they found
  six minor real faults and a set of misfires on term headings, term-defining
  openings and protocol-name lists. The rewordings fix those misfires, and each
  reader confirmed the new wording still catches the whiteboarding examples.
  Their accounts of how the chapters serve a skimmer became the style guide's
  contents, including what not to copy.
- **Sceptical review of the first draft.** It confirmed most of the diagnosis
  and corrected the construction count to about 80. It identified the
  rewritten-feedback cause, the timing confound and the user's earlier
  direction. It argued for the following changes, all adopted:
  - trial first, on a new subject;
  - the habit list goes to the line editor only;
  - the line editor writes its own rewrites, which are rechecked, with two
    rounds at most;
  - four to seven spine sentences, tied to section openings (now a term map, after the user described the reader);
  - a user checkpoint before drafting;
  - a false-positive baseline on human prose;
  - a stop rule;
  - page titles and descriptions brought into scope.

  It also quoted the first draft committing several of the habits. This
  revision removes them.
