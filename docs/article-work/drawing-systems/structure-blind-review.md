# First reading of the drawing-systems structure

I read the proposed structure and the supplied blind-review voice reference only. The interpretation below records what I understood before the critique.

## What I expect to learn

This collection will teach me to use drawings to work out and explain a system with other people. It promises both a choice of views and the physical practice of making a drawing legible. I expect to leave able to choose a view for a question, draw a useful first version, recognise what that drawing leaves unresolved, and preserve it when the conversation ends.

The main conceptual progression is from structure to process, interaction, concepts and lifecycle. Articles 7–9 then teach the act of drawing and facilitating; article 10 carries a drawing into team documentation. I read these as two connected strands, rather than a sequence everyone must finish in order. The repair service should help me see how the views describe the same situation without suggesting that any one view describes everything.

The explicit distinctions are helpful: a domain model is different from a database schema, deployment is different from logical structure, and a state is different from an activity. The opening distinction between family, notation, tool and style also makes me expect permission to use a simple drawing without learning a complete modelling language first.

I would take these routes:

- For a meeting tomorrow, I would want the short choice of views in article 1, followed immediately by the first-five-minutes method in article 7. I would use articles 8 and 9 as references while practising.
- For an architecture review, I would start with article 2 and follow the question into sequence, domain or lifecycle views. I would need the relevant part of article 10 before sharing the result.
- For an unfamiliar business process, I would use articles 3 and 7 together: one supplies the representation, the other supplies a way to discover what should go into it.
- For maintaining team documentation, I would enter at article 10 and return to whichever view reveals the gap in an existing diagram.

## Where the structure needs a clearer promise

### Teach readers to test a drawing against a situation

Observation: the proposal includes exercises, limitations, disagreement and review for false guarantees. Those are promising, but I cannot yet see a recurring method for checking whether a plausible-looking drawing actually explains the situation. The individual views could become separate notation lessons despite the shared example. For instance, a process can allow cancellation while its lifecycle drawing offers no way to cancel; an interaction can require a participant that the architecture drawing never identifies.

Suggested repair: give the introduction one small example of testing a drawing by walking a concrete case through it. Repeat that move in the relevant articles, including one failure or disputed case. Near the end, compare a few views of the repair service and resolve a deliberate contradiction. This would make the shared example do teaching work without requiring another article. It would also teach that agreement between drawings is useful evidence, but does not establish that the real process works that way.

### Narrow the centre of article 5

Observation: “Domains and data relationships” has a coherent core in shared terms, identity, cardinality and optionality. A data-flow view and a trust boundary introduce a different question about movement and crossing boundaries. The references to event discovery and service blueprints add further branches. I am unsure which drawing I should be able to make by the end of this article, and which of these topics receives a worked example rather than a signpost.

Suggested repair: make the main outcome explicit: build a conceptual model and distinguish it from a storage schema. Use one brief contrast to show when that model cannot answer where information travels or where it crosses a trust boundary, then point to the broader map. If practical data-flow drawing is intended to be a full learning outcome, identify what will be removed to give it space. Do not let the title promise one coherent lesson while the body delivers several abbreviated ones.

### Make the meeting route usable before four articles are read

Observation: the audience includes people drawing while others talk, but the stated first-meeting route contains four complete articles. The concrete method is in article 7, and the visual reference is in article 8. A nervous first-time reader might reasonably infer that choosing a family, learning shapes and learning colour are prerequisites to starting.

Suggested repair: put a short route at the beginning of the introduction that leads directly to the first-five-minutes method. Let that method begin with labelled boxes, people and arrows, and link to the shape sheet and layout advice at the moment they help. Keep the fuller four-article route as a route for practice. Each direct entrant should be able to start with a small useful drawing before meeting the full vocabulary.

### Keep visual familiarity separate from meaning

Observation: article 1 distinguishes notation from visual style, and article 8 promises three personalities with identical semantics. That is a useful intention. But a library containing services, workers, queues and topics could still teach readers to infer more from a recognisable icon than its author meant. The same risk applies to colours and different kinds of boundary across the collection.

Suggested repair: include a small worked misunderstanding: two people read the same symbol or arrow differently, then repair it with a label, a key or a more appropriate view. Carry that rule through the printable sheet and the colour examples. The practical lesson is how to make the intended meaning recoverable; drawing a distinctive icon is an aid to that lesson.

## Overlap worth managing

Articles 7, 8 and 9 can be distinct. Article 7 should teach how to decide what to draw while listening, article 8 how to produce a small vocabulary fluently, and article 9 how to organise the resulting marks so another person can read them. Their exercises should expose different failures. A meeting exercise can fail because the group never resolves a disputed handoff even when the drawing looks tidy; a layout exercise can begin with agreed content that is difficult to follow.

Article 10 also touches the tool distinctions introduced in article 1 and the handoff introduced in article 7. That overlap is useful if article 1 supplies enough orientation to begin, article 7 captures the outcome of a conversation, and article 10 asks what deserves maintenance and who will do it. The final repair should require a decision about what to retain, split or discard, rather than merely a cleaner redraw.

Mermaid appears explicitly in sequence diagrams and tool selection. I read that as a worked source example, not a commitment to teach the collection through Mermaid. Make that scope clear so readers do not mistake learning syntax for the entry requirement, or assume that every view has an equivalent source format supplied here.

## Does ten articles earn its length?

Provisionally, yes. The five view-focused articles answer different questions, and the practical work of listening, drawing, arranging and maintaining deserves more than an appendix. Ten is defensible as a browsable collection with short entry routes. It would be harder to justify as a required course before a reader can use a whiteboard.

The greatest risk is breadth within articles rather than the count itself: all four C4 levels, a bounded BPMN subset, domain modelling plus data flows, and three shape personalities could each consume the space intended for interpretation and practice. Keep the advanced edges subordinate to a clear task. For example, selecting a useful architecture zoom matters more to this audience than giving every zoom equal treatment. In the shape article, one reliable vocabulary should be sufficient for completing the exercise; the other personalities can be optional variants on the reference sheet.

I would retain the ten-part structure, narrow article 5, establish the short meeting route, and specify the recurring case walkthrough before commissioning the articles. I would not add a separate article for every family mentioned in the broader map. The collection earns its scope by helping readers recognise the question their current drawing cannot answer and choose the next useful view.
