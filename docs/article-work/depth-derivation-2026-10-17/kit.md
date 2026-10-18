# Deriving a subject's depth: clean-room method

This is the method from the Stay Current planning and authoring skills of 17 October
2026, with one change. The skills illustrate depth with cases from the three articles
being tested here, so those cases are replaced by neutral ones from outside the site.
Everything else is the skills' own reasoning.

Work only from this file and from external evidence. Don't open anything else in the
repository: not the articles, their work notes, the skills, `docs/` or the built site.
Those would tell you what the existing articles decided, and the point of this exercise
is to find out what the method decides on its own.

## The aim

Stay Current helps engineers understand the choices in their field. Each collection
should take an intelligent reader who is new to its subject to the understanding of an
expert practitioner, at the least cost in reading time and effort. Planning is the
optimisation of that route. Leave out something an expert relies on, and the reader
will make the mistakes an expert avoids. Include something an expert doesn't need, or
teach it in a slower form than it needs, and the reader spends time that buys them
nothing. The best plan is the shortest route that actually arrives.

An expert practitioner handles the subject's tasks and decisions well, including the
awkward cases. They understand the inner workings wherever the work depends on them, and
they know where the subject ends. That bar sets each subject's depth. An expert in TLS
reasons about the handshake, certificate validation and what each failure means, so
teaching TLS takes real mechanism. An expert in writing commit messages knows a handful
of conventions and the cases where they matter, which a short article of examples can
teach. A shallow subject simply runs out sooner. Stay inside the subject, too: an expert
at configuring TLS for a web server need not know how the cipher's mathematics works.

The cost is more than word count. A reader also pays for holding several things in mind
at once, for rereading an unclear passage, and for leaving the page to learn a
prerequisite. Quick is not the same as compressed: a clear explanation read once costs
less than a terse one read twice, and a missing step costs more than the sentence that
would have supplied it.

## Breaking the subject down

Start from what an expert can do, then ask what each of those abilities needs, until
every part is something a sentence, a section or an article can teach. "A sentence" and
"leave it out" are ordinary answers.

The subject sets the depth, not the article type or the length of neighbouring sections.
A mechanism usually needs explanation, a figure and its consequences. A practice is
usually learned fastest from worked examples, the common cases and the corner cases,
each with a short note on why. Attention should be even across the subject; length
shouldn't. One part may need a paragraph and its neighbour several subsections.

Give each part exactly one home: an article and section, or an explicit status such as a
sentence where it's used, a link to a neighbouring article, a link to another field,
parked, or left out for a stated reason. One home means one place that teaches the part
fully; another article can still give its reader the sentence of reminder they need and
link to the home. Note roughly what each part needs, such as a mechanism with figures, a
set of worked examples or a sentence.

A part earns an article of its own when that serves readers better than a section would:
it needs an investigation of its own, many readers would come looking for it directly,
or it would bury its parent's argument. Another article costs readers a page to find and
a new context to enter, so weigh that too.

## Anchor the expert in evidence

Don't rely only on your own sense of what an expert knows. Check it against evidence:
standard texts and primary documentation for the subject, what practitioners are
expected to do in real work, and how the systems actually behave. Use web search and
fetch where a depth judgement depends on a fact. Name the sources that shaped your
judgement.

## What to produce

Write your result to the file path you were given, in this shape:

1. **The expert's abilities.** What an expert practitioner in this subject can do, with
   the evidence behind the list.
2. **Coverage map.** Each part, its home or status, what it needs (mechanism with
   figures, worked examples, a paragraph, a sentence) and a rough word count.
3. **Articles.** How many, each one's title and role (a deep dive is the full explanation
   of one subject; a companion goes further into part of a deep dive), and an estimated
   reading time at about 250 words a minute plus time for figures and examples.
4. **Boundaries.** What you send to neighbouring articles or other fields, and why.
5. **Left out.** What you deliberately excluded, and why the expert doesn't need it.
6. **Uncertainty.** Where your judgement was least sure, and what evidence would settle it.

Keep it to what someone needs to compare your plan with another; about 1,500 to 2,500
words.
