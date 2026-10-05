# First-time reader session

This session is ready to run with a person who has not read the collection. No human observations have been collected yet. The independent agent readings are recorded separately.

## Before the session

Allow about 30 minutes. Choose someone comfortable using a computer who is new to relational databases. Ask what database or SQL experience they already have, and record it rather than deciding whether an answer is good from their job title.

Run `pnpm dev` in this repository and give the reader the local collection at <http://localhost:4321/learn/databases/relational/>. The pages are working drafts. For a remote participant, use an already authorised preview; this session does not require publication. Use the reader’s usual browser and screen size.

Give the reader the instructions below. Keep the facilitator notes and previous reviews out of their view. Do not ask them to read an answer before making their prediction.

## Instructions for the reader

We’re checking whether these articles help someone learn. Questions and hesitation tell us where to improve the material.

1. Start with the relational introduction, then follow the link to Designing a relational schema. Read in order. Say what you think each example is showing, and mention a word, jump or missing detail when it interrupts you. You can follow links and open illustrations as you normally would.
2. At “What survives a catalogue change?”, make a prediction and explain your reasoning before opening “Compare your reasoning”. Point to the passage or example you used. If you cannot work it out, say what information you need.
3. Open “Start the SQL practice” from the collection navigation. Read from the top. If Docker is already installed, use this guide to reach the first receipt and order count. If it is absent, follow the installation link only far enough to decide whether you know how to start; record that as a prerequisite rather than assuming the setup worked. Do not install software just to fit the session into 30 minutes.
4. At the end, explain in your own words what the shop example helped you understand. Tell us where you looked and whether anything remains uncertain.

Stop after 30 minutes even if you have not finished. Record where you stopped. The opening two articles and practice route are the session’s scope; the later exercises need their preceding articles and can be tried in a later session.

## Facilitator notes

Before reading begins, ask: “What have you used databases or SQL for, if anything?” During reading, use neutral prompts such as “What are you expecting here?” or “What made you choose that answer?” Avoid naming the concept you want them to notice. Record the first interpretation before explaining the intended one.

If the reader gets stuck, give them time to reread or follow a link. If help is needed to continue, record exactly what you supplied and mark the following result as assisted. Do not silently repair an environment or SQL command while counting the route as completed unaided.

The first exercise should expose whether the reader traces column origins rather than assuming all catalogue changes rewrite purchases. The practice checkpoint is the O12 receipt followed by a count of two orders. These are observation targets, not questions to reveal in advance.

Only after the reading, if the neutral teach-back leaves these questions unanswered, ask which record supplies a product’s current name, which supplies the agreed purchase price, and what information the shop would need to reproduce an old printed name. Preserve the unprompted explanation before these more specific questions.

Record enough evidence to distinguish a missing explanation, a navigation problem and an installation problem:

| Location | Reader’s words or action | Expected next step | Help supplied | Resolved later? | Proposed repair |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

Keep correct answers that come from prior knowledge separate from answers supported by the page. After the session, preserve consequential observations in `reader-session-results.md`, including the participant’s stated experience, device, pages actually read and unfinished steps. One participant provides useful evidence, not a measure of all readers. Feed concrete findings into the existing improvement plan and repair before another uncued reading.
