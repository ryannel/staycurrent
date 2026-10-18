# Shared notation across the sequence-diagram articles, 17 October 2026

The two reviews of 17 October (`review-2026-10-17-trio-technical.md`, `review-2026-10-17-trio-first-reading.md`) found the three articles disagreeing on shared notation. These decisions hold for Sequence diagrams, Drawing asynchronous and event-driven interactions, and Sequence diagram syntax. One article owns each explanation; the others use it and link.

- **critical.** UML 2.5.1: a region whose steps other traces cannot interleave with; UML gives it no fallback meaning (it does not restrict critical to one operand, so do not say "UML has no option sections"). Mermaid's `critical … option` is Mermaid's own reading. The parent owns this and must not show a listing that does what its prose warns against. The syntax companion's row uses the parent's meaning.
- **The cross (`-x`, `--x`, PlantUML `->x`).** Means a lost message, only. A delivered rejection (409, Declined) is an ordinary reply arrow with the error in its label. The syntax companion says "lost" not "lost or failed".
- **Mermaid's arrows.** Mermaid's docs label `-)` async; don't say Mermaid gives its arrows no meaning. Say what Mermaid states and what it leaves to the reader.
- **Starting a flow with no caller.** The parent owns it: when to use a found message, a note, or a scheduler/clock lifeline. It defines "found message" where first used. The async article uses that definition and links.
- **Timing and delay notes; order vs time.** The parent owns the two ordering rules and the delay-note advice, stated once. The async article links to them and adds only what is new for async (per-key ordering, overtaking).
- **A late reply to a caller that has left.** Drawn so it visibly does not reach a waiting caller (ends at a lifeline whose activation has ended, with a note), not as a normal received reply. Applies to parent Figure 2 and Figure 5's slow case.
- **Asynchronous messages and timeouts.** No "no reply within …" note on a message nobody waits for.
- **What Mermaid can't draw, PlantUML examples, version details.** The syntax companion owns them. The parent keeps one or two sentences and a link; release numbers and parse results don't interrupt the parent's teaching.
- **Broker semantics.** The async article doesn't state broker behaviour as general fact. Where a drawing depends on it (durable vs non-durable subscription, push vs pull, at-least-once duplicates without failure), the drawing must state the assumption, and the text says so.
- **Participant names.** One name per participant across views and articles. No unexplained abbreviations ("GW"); if space is short at phone width, solve it in layout.
- **Running example ids.** A5 is one kind of thing (an appointment) everywhere.
