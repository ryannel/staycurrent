# Skill refinement after the caching visual iterations

Read OpenAI’s [Rethinking skills and prompts for GPT-6 Astra](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra)
and the installed Skill Creator guidance. Applied their preference for focused
scope, decision criteria and relevant supporting material instead of accumulating
a recipe for each correction. The existing skill descriptions already have clear
boundaries; planning and orchestration did not need changes for these findings.

The conversation exposed gaps in otherwise useful instructions:

- “Playful” did not distinguish a clear, watchable explanation from a complicated
  interface. Figures now favour visible cause and consequence, with interaction
  when it reveals a relationship and motion that directs attention.
- Repeated figures lost familiar context or appeared to generate work themselves.
  Continuity now covers visual roles, relationships and the origin of work, with
  omission allowed when the causal path remains clear.
- Traffic and answer counts created activity without exposing the benefit under
  discussion. Figures now call for example variation and measurements that reveal
  the relevant mechanism.
- Product codes, byte inventories and narration made the prose repeat the drawing.
  Writing now assigns prose the reasoning and implications; continuity favours
  understandable names when identification is needed. Codes still belong where
  identity is the subject. Accessible text alternatives remain necessary.
- Layout and playback problems survived checks. Existing visual and editorial
  review criteria now cover comparison separation, unobscured labels, the whole
  sequence, and prose that adds to the figure.

These changes do not prescribe bouncing balls, mugs, fixed colours, stacked
panels, a load balancer in every drawing, or a mandatory slider. Those were local
design decisions. The existing guidance on implementation examples, the prose
linter and proportionate review remains in place. No new review stage or tool
dependency was added.

Checked the changed instructions against the conversation and their surrounding
skills for scope and consistency. Skill Creator’s validator passes for writing,
figures, continuity and review; `git diff --check` passes. These are instruction
and structural checks, not evidence that a future article will meet the standard.
No new article was generated as part of this scoped update.
