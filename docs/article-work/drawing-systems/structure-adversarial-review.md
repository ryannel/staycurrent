# Adversarial structure review: Drawing systems and processes

## Expected teaching, recorded before reading the proposal

The title promises a way to turn an engineering conversation into a drawing other people can follow. For engineers and collaborators without notation or drawing training, that includes choosing what to show, deciding what each shape and connection means, arranging the page, and checking the drawing with the people in the room.

The commission adds two substantial promises. Readers should understand when process maps, sequence diagrams, architecture views and swimlanes answer different questions, including the roles of Blueworks, Mermaid and C4. They should also be able to draw during a live discussion, using quick, recognisable shapes with a consistent personal character and five pen colours.

I would expect a complete worked drawing that grows as a conversation reveals participants, actions, boundaries, handoffs, exceptions and unanswered questions. It should show the author making and revising choices, including a wrong turn, rather than only revealing a finished diagram. A reader needs to see how a useful meeting sketch becomes a durable explanation for someone who was absent.

The drawing instruction owes the reader more than an icon sheet. Shapes need construction steps, relative scale, labels, connectors, spacing and examples of combining them. Colour needs a stated meaning that remains legible when colours are hard to distinguish. Personality should make a drawing approachable without changing its semantics or making quick drawing depend on decoration.

The scope can remain introductory. It does not owe a full BPMN course, every C4 view, exhaustive Mermaid syntax, or professional illustration training. It does owe explicit boundaries between informal sketches, diagram types, notation systems and software used to produce them. A reader should leave able to choose a first view, make it with other people, and explain what it asserts and leaves unresolved.

## Assessment after reading the proposal

**Repair required before article commissioning.** The ten proposed articles can fulfil the commission without adding another page. The outline already includes most of the expected subjects: choosing by question, live facilitation, construction steps, labels, exceptions, capture and upkeep. The consequential gaps are in how those subjects become one practical skill. These are risks in a proposal, not findings that finished explanations are absent; no article body or completed figure was supplied.

The titles are mostly useful landmarks. Architecture, processes, sequence, domain relationships and states identify recognisable subjects. The first-meeting path makes the drawing articles reachable without requiring the whole collection. The staged meeting, timed practice, annotated before/after and final repair are promising choices. They need a clearer relationship so they cannot be fulfilled by four unrelated demonstrations.

## Smallest structural corrections

### 1. Make a complete live drawing the shared practical lesson

**Expected understanding:** turn speech into a drawing while checking meaning with the speaker, then leave a usable record. The commission's emphasis on live whiteboarding makes this essential.

**Checked:** article 7 promises a staged meeting; article 8 promises shapes and a timed drawing; article 9 promises an annotated before/after; article 10 promises a final repair. None yet requires those demonstrations to show the same developing drawing. A learner could finish each lesson and still have to invent the connection between listening, choosing a view, drawing shapes and placing them.

**Repair:** give articles 7–9 one continuous board example. Begin with an actual short conversation and a blank board. Show what is added after each exchange, why it is placed there, what the facilitator asks, and what must be moved or erased. Include a correction from a participant, one unclear responsibility and one change of view. Article 8 should construct several of the objects and their connections from that board; article 9 should improve its layout while preserving its meaning. Article 10 can capture the result, including unresolved questions. Each article still needs enough local setup for direct entry.

No fixed number of panels is necessary. The reader needs to see a decision being made, a mark following that decision, and someone checking what the mark now says. Do not let the first-five-minutes method become five abstract instructions followed by a finished board.

### 2. Teach composition before offering three visual styles

**Expected understanding:** quickly draw a small, coherent scene. Distinctive shapes and personality are part of the request, but a sheet of recognisable objects does not establish this skill.

**Checked:** article 8 lists fourteen kinds of objects, boundaries, three personality options, connectors and labels. That is enough inventory to crowd out construction. Article 9 owns much of the composition instruction a novice needs while using article 8.

**Repair:** start article 8 with a small usable scene built from a few primitives: person, labelled box, boundary and arrow. Show label space, consistent sizes, connector attachment points and the drawing order before expanding the vocabulary. Then adapt the same scene into spare, rounded and lightly expressive variants. Keep the larger vocabulary on the printable sheet and teach harder shapes through a few worked examples. Include a practice prompt that requires choosing and combining shapes from an unfamiliar description, with more than one acceptable answer.

The three styles should preserve containment, arrowheads and line meanings. A face, curl or rounded corner can add character; readers should not need decorative details to recognise a worker or decide whether a connection carries a request. A polished SVG approximation is not sufficient evidence that a novice can make the mark quickly. Demonstrations should visibly retain plausible stroke order and show what can be omitted under time pressure. A timed exercise should invite practice, not promise a completion speed that has not been tried.

### 3. Separate Blueworks discovery from the process diagram it produces

**Expected understanding:** choose and build a process map, then understand what extra information a more formal process diagram adds. The user specifically named Blueworks process maps.

**Checked:** article 3 says “Blueworks-style milestones and lanes” and moves directly into BPMN distinctions. This could satisfy the reference with a superficial visual resemblance. IBM describes a process blueprint as a discovery map, process diagram and documentation. Its discovery view supports initial interviews through milestones and activities; the process diagram adds alternate paths and other detail. [IBM: Creating process blueprints](https://www.ibm.com/docs/en/blueworks-live?topic=documenting-creating-process-blueprints), [Creating discovery maps](https://www.ibm.com/docs/en/blueworks-live?topic=process-discovery-maps), [Creating process diagrams](https://www.ibm.com/docs/en/blueworks-live?topic=process-diagrams).

**Repair:** make a compact discovery-map-to-process-diagram progression explicit in article 3. Explain what was known at each stage, where responsibility and exceptions are introduced, and which added symbols change the meaning. Distinguish milestone phases, participant lanes and any BPMN pool boundaries. If the examples are recreated drawings rather than work performed in Blueworks, say so. Keep a hands-on product tutorial outside the promise unless it is actually commissioned and checked.

### 4. Carry arrow and boundary meaning through every view change

**Expected understanding:** explain what a connection or boundary asserts, and avoid carrying that meaning unchanged into a different diagram type. An audience without notation training cannot supply those conventions.

**Checked:** article 1 distinguishes families, notations, tools and styles; the focused articles name relationship labels, flow types and lifelines. That is a good foundation. The missing commitment is a worked comparison in which familiar objects remain while the meaning of the lines changes.

**Repair:** in the introduction's “same situation in several views,” ask one concrete question of each drawing and explicitly read one relationship aloud. Later examples should introduce their local line and boundary meanings before asking readers to interpret them. A final review can find a misleading arrow or enclosure and repair it. Do not create a universal arrow legend that treats architecture dependencies, process flow, messages, data movement and state transitions as interchangeable.

The Mermaid article needs a particularly clear separation between syntax that renders and a scenario that makes sense. Its documentation supplies several arrow forms and separate constructs for alternatives and parallel actions; drawing an accepted form alone does not verify the described system. [Mermaid: Sequence diagrams](https://mermaid.js.org/syntax/sequenceDiagram.html). Use source-to-figure checks, then separately ask what event order and outcome the figure claims. Keep timeout and retry here as bounded drawing examples; they should not silently open the parked distributed-systems programme.

### 5. Bound the overview and the crowded domain article

**Expected understanding:** choose the next useful view, without mistaking a catalogue for instruction. The collection's broad title warrants orientation to alternatives, but not a full course in each named method.

**Checked:** article 1 adds service blueprints, data flows, decision tables, causal loops and timelines. Article 5 combines domain concepts, identities, cardinality, database schemas, data flow, trust boundaries, event discovery and service blueprints. Article 2 lists all four C4 levels and a deployment contrast. The risk is compression into terminology before the central choices have been taught.

**Repair:** give each focused article a single primary outcome. For article 5, make it constructing and checking a small domain relationship model. Present data flow as a clearly separated comparison answering where information moves; either demonstrate that bounded question or point to explicitly future coverage. Keep event discovery and service blueprints as brief orientation with a concrete reason to investigate them. The overview's extra families need an example question and honest onward reading, not miniature tutorials.

For architecture, use context and container views as the main worked progression and make the component zoom depend on a question the larger view cannot answer. A short explanation of code views can complete the orientation. The C4 guidance itself says to use the levels that add value, with context and container often sufficient. [C4: Diagrams](https://c4model.com/diagrams). This is a depth allocation, not removal of requested C4 coverage. No extra article is necessary to repair these boundaries.

### 6. Make the five-colour method usable from the first meeting

**Expected understanding:** use the available pens consistently while drawing, and still understand the result in a photograph or monochrome copy.

**Checked:** article 9 promises black, blue, green, red and purple roles, accessibility and a monochrome fallback. Article 7 appears earlier in the practical path and is where readers first need to decide which pen to pick up. “Theme tokens” in the visual intent describe publication rendering, not physical pen use.

**Repair:** introduce a small example convention in article 7 and carry it into article 9's fuller teaching. Label it as a convention readers can adapt. Demonstrate a board where every colour's meaning also survives through words, symbols, enclosure or line treatment. Show how current/proposed status and an unanswered question remain distinct when colour disappears. The refined SVG and a realistic captured-board version should convey the same information. Five available colours do not require using all five in every drawing.

## Decision and boundaries

Keep the ten-article structure and its separate reading paths. Prioritise the integrated whiteboard example, composition before catalogue, and the Blueworks discovery progression before commissioning detailed prose. The remaining corrections can be small additions to article briefs rather than new pages.

A useful first production proof is the introduction's view comparison plus the live-board sequence across articles 7–9. That would test the collection's most distinctive promise before the broader notation coverage expands. It must include an unfamiliar practice case; otherwise the examples could demonstrate copying rather than choosing and drawing.

This review checked the proposal, house writing and illustration guidance, collection structure guidance, and the primary references linked above on 16 October 2026. It did not verify rendered media, physical drawing speed, executable Mermaid examples or completed article teaching. No publication decision follows from this review. The proposal was left unchanged.
