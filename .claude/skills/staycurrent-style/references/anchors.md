# Style anchors — methods and sources

SKILL.md carries the rules; this file carries the methods behind them. Load it
when authoring a full article section, or when a passage needs more than a rule —
a way of structuring the explanation itself. Techniques are described, never
excerpted at length: emulate the method, not the sentences.

One thing before the methods. What these three share is a plain foundation:
ordinary words, short sentences, terms defined as they appear, ideas built in
order, and no hurry. The famous moves below — the concrete opening, the named
red flag, the diagram walkthrough — only work on top of that foundation.
Emulating the moves without the plainness produces showy, hard-to-follow prose,
which is the opposite of what any of them write.

## Martin Kleppmann — *Designing Data-Intensive Applications*

The modern benchmark for making deep systems material readable. Reviewers credit
the book's clarity to first-principles buildup that always ties back to real,
named systems — theory is never left hanging.

His method:

1. **The running scenario.** Load and scalability enter the book as Twitter's
   home-timeline fan-out — real workload, real numbers — and only then become
   principles. Open the hard topic with a scenario the reader can picture;
   let the abstraction condense out of it.
2. **Layer-by-layer from first principles.** Each chapter starts at the
   foundation and builds one layer at a time, separating fundamentals that
   outlive software versions from the version-specific detail.
3. **Every abstraction grounded in a named system.** The concept and the system
   that embodies it arrive together: how Postgres does it, how Kafka does it,
   how Cassandra differs. A paragraph of pure category talk is a smell.
4. **Trade-offs side by side, never advocacy.** Advantages and taxes are
   presented together; "different use cases require different solutions" is the
   posture, and it is what makes the eventual recommendation trustworthy.
5. **No hand-waving.** If a mechanism cannot be explained plainly, the thinking
   is not done — research until it can be. (The aphorism he works under —
   "writing is nature's way of letting you know how sloppy your thinking is" —
   is a Guindon cartoon caption Leslie Lamport made famous; DDIA is what taking
   it seriously looks like.)
6. **Summaries that consolidate.** Chapters end by restating the argument in
   compressed form, so the reader leaves with the shape, not just the parts.

Reach for this method when: the topic is genuinely deep (storage engines,
replication, consistency) and the reader must come out with a working model, not
a glossary.

Sources: https://martin.kleppmann.com/2014/09/15/writing-a-book.html ·
https://dataintensive.net/ ·
https://www.ybrikman.com/blog/2017/07/20/designing-data-intensive-applications/

## John Ousterhout — *A Philosophy of Software Design*

Plainspoken, opinionated, short. The book's meta-principle — code should be
obvious to the reader, not the writer — is visibly applied to its own prose.

His method:

1. **A fixed template per principle.** Problem and motivation → the principle,
   named → the dangers of the alternative → red flags to spot it → a "taking it
   too far" caveat. The repetition is the point: structure the reader never has
   to think about.
2. **Named red flags.** Shallow Module, Information Leakage, Temporal
   Decomposition — a spotting vocabulary that lets readers find the problem in
   their own work. Naming the anti-pattern is half of teaching it.
3. **Coined handles.** "Deep modules", "define errors out of existence",
   "complexity is incremental" — compact, evocative names that make an abstract
   idea portable. Coin sparingly; reuse exactly.
4. **Contrarian clarity.** He challenges received wisdom by name — short-method
   dogma, comment-averse Clean Code — instead of hedging toward balance. A
   stated stance beats a survey.
5. **Before/after worked examples.** Concrete code pairs ground every principle,
   and he shows the alternatives he rejected ("design it twice"), which teaches
   the judgment, not just the verdict.
6. **The caveat as credibility.** Every strong claim carries its overuse
   warning. The reader trusts the confidence because the limits are named.

Reach for this method when: arguing a position — a stance section, a verdict, a
pitch — or when a recurring mistake deserves a name the team can use.

Sources: https://web.stanford.edu/~ouster/cgi-bin/aposd.php ·
https://johz.bearblog.dev/book-review-philosophy-software-design/ ·
https://newsletter.pragmaticengineer.com/p/the-philosophy-of-software-design

## ByteByteGo — Alex Xu and Sahn Lam

*System Design Interview* volumes and the ByteByteGo newsletter: the reference
for making system design digestible without dumbing it down. Famously visual —
150-plus diagrams per ~300-page volume — with a scaffold so consistent the
structure costs the reader nothing.

Their method:

1. **Visual first; prose annotates.** The diagram carries the explanation;
   sentences label and walk it. Sketch the picture first, then write the prose
   that traces it — never the reverse.
2. **Naive design, then one bottleneck at a time.** Start with the single server
   that works. Add the cache when reads saturate it, the replica when it fails,
   the shard when it fills. The reader sees why each component exists because
   they watched its problem arrive first.
3. **One scaffold, repeated.** Scope the problem → high-level design → deep
   dive → wrap-up, every time. Predictable structure spends zero reader
   attention on navigation.
4. **Plain short sentences; terms defined at first use.** Deliberately readable
   at every experience level, and never at the cost of precision.
5. **Numbered walkthroughs matched to numbered arrows.** One request traced
   through the system, step 1 to step n, prose steps matching diagram arrows
   one to one.
6. **Trade-off tables with real numbers.** QPS, storage envelopes, latency
   budgets — and the standing frame that there is no perfect design, only
   trade-offs fitting requirements.

The newsletter's issue shape, reusable for any explainer: the problem and why it
matters → a sequence of annotated diagrams, each step small → a short takeaway.

Reach for this method when: explaining an architecture or a flow, or when the
audience spans experience levels and the material must stay accessible without
losing rigor.

Sources: https://blog.bytebytego.com/ ·
https://blog.pragmaticengineer.com/system-design-interview-an-insiders-guide-review/ ·
https://dev.to/somadevtoo/is-system-design-interview-book-by-alex-xu-worth-reading-review-11gm

## The wider canon — techniques worth stealing

Not anchors, but the cross-cutting moves the whole clear-writing canon shares:

- **War-story openings** — Nygard's *Release It!* opens chapters inside real
  outages; stakes first, lesson second.
- **Buildup from primitives** — Petzold's *Code* assembles a CPU from relays;
  nothing used before it is built.
- **Aphorism-sized tips** — *The Pragmatic Programmer*'s numbered tips (DRY,
  broken windows): compress a practice into a sentence that survives being
  quoted.
- **Evocative naming** — Fowler's bliki on Neologism: a well-coined term does a
  paragraph's work. https://martinfowler.com/bliki/Neologism.html
- **Quantified claims** — McConnell's *Code Complete* cites evidence where
  others assert; numbers age better than adjectives.
- **Diagram plus walkthrough** — Crockford's railroad diagrams for JSON:
  the picture defines, the prose confirms.
