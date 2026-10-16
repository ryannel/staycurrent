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
benchmark") do:

- the example comes before the idea. *State* has the reader write the
  heroine's jump code, find the bug, add a flag, find the next bug, and only then
  names a finite state machine: "Congratulations, you've just created a *finite
  state machine*";
- the example grows one change at a time, and each change breaks something or
  costs something, which is why the next section exists;
- each section opens from where the last one left the reader: "The next step
  is **parsing**." "We have finally hammered the user's program into a form that
  we can execute.";
- a term arrives in bold, defined in the same sentence, with its synonyms and
  the one the author will use;
- the author is a person in the text: "Confession time: I went a little
  overboard", "I like 'lexing' because it sounds like something an evil
  supervillain would do, but I'll use 'scanning'";
- the reader is given things to do and questions they'd actually ask: "Spot the
  bug?", "Are they local variables? Global?";
- tangents, etymology and history go into asides, so the main line stays on
  the example;
- headings are either the plain names of the parts ("Scanning", "Parsing") or
  spoken beats of the story ("We've All Been There", "What's the Catch?").
  Neither kind states the section's advice.

The writer reads the two benchmark chapters before drafting. The current skills
tell the writer not to adopt an author's identity; the guide should instead say
plainly that a first-person voice with opinions is wanted.

**A spine in the brief.** Four to seven plain sentences, one per section, that
read in order as a story: what the reader is wondering at that point and what
the section shows them. The title, the description and the heading list come from
the spine. Topics that don't fit go to another article or are cut. Each
section's opening has to carry its spine sentence, and the line editor checks
that it does.

**A line editor.** A fresh subagent that gets the article, the spine and the
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
   unlabelled, and the benchmark chapters. They say which trial article reads
   more like a person explaining something, and where each falls short of the
   benchmark.
3. **The user reads both.** Their reaction decides whether stage 3 happens.
   Their words go into `docs/writing-style.md` verbatim, with the date and the
   passage, and no agent commentary.

If the user still rejects the trial output, the next step is to remove guidance,
not add another case history.

### Stage 3: adopt what worked

Only after the user accepts a trial article:

- Replace the style skill with the trial style guide. Move the database case
  histories into `docs/writing-style.md` as background.
- Add the spine to the planning and authoring skills, and the line editor to the
  review skill. Move the review method (blindness, chunking, extraction) into
  `references/protocol.md`, so the skill itself holds only the coordinator's
  decisions.
- Add a user checkpoint before drafting each batch: the title, description,
  heading list and spine for its first article. That takes a couple of minutes
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

These are tuned against the benchmark. The second version flagged about 20
passages in *State* and several in *A Map of the Territory*, and an editor would
have cut at most one clause. The wording below narrows each habit to the line
where Nystrom's prose stays clear of it and the whiteboarding article doesn't.
The whiteboarding examples in "What goes wrong" are still caught.

- **Maxim ending.** A paragraph's last sentence restates it as a general truth
  and adds no number, mechanism, condition or consequence. It's fine when the
  next sentence or paragraph applies it to the example, or when it's a
  heuristic of the form "when you see X, do Y". Judge by how many accumulate
  across the page.
- **Denial of an unheld view.** "Not X" where nothing on the page, in a paired
  term or in common belief would lead the reader to X. Answering the reader's
  likely reaction is fine: "This seems trivial, but it's a real improvement".
- **Abstraction with intentions.** An object is given judgement, desire or
  social action, so the reader can't tell who decides or what happens: "icons
  should not invent components". Field idioms (a parser "reports", a chip
  "speaks" an instruction set) are fine, and so is "should" for a requirement
  or invariant.
- **Protective hedge.** A qualification that changes nothing the reader would
  predict or do. A note on what's left out is fine when it gives a reason or a
  pointer, or when the reader would otherwise act on the gap (report a bug that
  isn't one). One line setting the reader's assumed level is fine.
- **Idle list.** A list in the main argument that the reader is asked to hold
  and won't use next. Fine: a preview whose items become this page's headings,
  search terms in an aside, and a few familiar instances anchoring a category.
- **Undecodable promise.** A forward reference the reader can't decode until
  after unrelated material has come in between. A promise kept by the next
  sentence, section or heading is fine.
- **Ungiven word.** A term the argument depends on, or a house coinage, used
  before it's defined. Fine: names given only for orientation or colour, terms
  the stated audience already uses, a synonym placed beside the term it renames,
  and a link to the term's own page.
- **Advice heading.** A heading that states the section's advice or judgement
  ("Review meaning before appearance", "Compose a small scene with plain
  shapes"). Fine: the plain name of a part, a spoken story beat or question,
  and an imperative naming the next step of a running build ("Delegate to the
  state"). Page titles and descriptions take the same test.
- **Cold opening.** A section whose first sentences don't connect it to where
  the reader is. One clause is often enough. The first section may open straight
  into the running example without naming the topic, because that scene is
  where the reader is.

## The benchmark

The benchmark is human prose that has been widely praised over many years, not
the site's own approved articles. Two chapters by Bob Nystrom:

- *Crafting Interpreters*, "A Map of the Territory". An overview that walks one
  line of code through every stage of a language implementation. It's the
  closest match to our collection introductions and explanations.
- *Game Programming Patterns*, "State". It teaches a modelling idea by growing
  one example until the idea is unavoidable. It's the closest match to the
  drawing-systems articles, and especially to the one on lifecycles.

Both books' source is public on GitHub. The prose is licensed CC BY-NC-ND 4.0,
so we read it from a pinned clone and quote it briefly, without copying the
chapters into this repository. `benchmark.md` beside this plan gives the
commits, files and commands.

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
   and spine before a batch is written. Is that acceptable?
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
  one borderline clause. Their rewordings are folded into the habit definitions
  above. Their accounts of what the chapters do became the style guide's
  contents.
- **Sceptical review of the first draft.** It confirmed most of the diagnosis
  and corrected the construction count to about 80. It identified the
  rewritten-feedback cause, the timing confound and the user's earlier
  direction. It argued for the following changes, all adopted:
  - trial first, on a new subject;
  - the habit list goes to the line editor only;
  - the line editor writes its own rewrites, which are rechecked, with two
    rounds at most;
  - four to seven spine sentences, tied to section openings;
  - a user checkpoint before drafting;
  - a false-positive baseline on human prose;
  - a stop rule;
  - page titles and descriptions brought into scope.

  It also quoted the first draft committing several of the habits. This
  revision removes them.
