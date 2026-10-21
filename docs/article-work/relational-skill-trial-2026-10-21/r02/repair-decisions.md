# Repair decisions · skill trial 2 · r02

Version reviewed: a6e6a33. Four new reviewers, none of whom saw r01 or any earlier version.

| Perspective | a00 | a03 |
| --- | --- | --- |
| Practitioner | 1 required, 2 optional | 1 required, 1 optional |
| Teaching | 1 required, 4 optional | pass, 3 optional |
| Editorial | 1 required, 5 optional | 1 required, 8 optional |
| Visual | 2 required, 2 optional | pass, 4 optional |

Distinct required problems: a00 5 (r01: 5), a03 2 (r01: 10). Of a00's five, three sit in passages the r01 repair added or rebuilt: the trimming note before the first plan, the in-flight paragraph after Figure 5, and the step explanation separated from the controls in the rebuilt history figures.

This is the last repair before the final round, so the decisions favour the smallest change that solves each problem. Optional findings in passages being repaired anyway are accepted; standalone polish elsewhere is declined to avoid new churn, and is listed below.

## Accepted · a00

| Findings | Decision |
| --- | --- |
| editorial-17, teaching-11, editorial-18 | Required. The indexes section opens on a list of omissions in terms not yet explained. Set up the experiment first; say what a plan leaves out only once the reader has seen one, and explain each idea the plan-reading paragraph relies on. |
| teaching-9, practitioner-17 | Required. The in-flight paragraph after Figure 5 teaches a03's mechanism without a figure. Keep a00 at the high-level answer (a lost reply leaves the outcome unknown; look the order up before acting) and hand the in-flight case to a03 at that point. |
| practitioner-15, teaching-12, editorial-20 | Required. The schema change's lock waits behind open transactions and queues every later read and write; say so with the bounded-wait remedy, beside the rows it explains, and keep the "contract" example to one change. |
| visual-14, visual-18 | Required. Each step's explanation must sit with the controls the reader is using, as a03 and the reference figures do. Where the history figures are rebuilt for this, follow a03's conventions for waits, changed values and option controls, so the collection uses one notation. a03's committed components (src/components/relational-trial-2/a03/) may be read for that. |
| visual-15 | Required. Figure 4's mug lines must include order 102's line, and its count must agree. |
| practitioner-19 | Accepted. The Repeatable Read snapshot is taken at the first statement, not when the transaction begins. |
| teaching-10, teaching-13, editorial-19, editorial-21, editorial-22, visual-17 | Accepted; each is a phrase or sentence. "serializably" undefined; the costs of a distributed database named; the paragraph after Figure 4; the paragraph after Figure 6 opens with its point; the final section's claim about "contracts"; identifiers not broken mid-word at 375 px. |

## Accepted · a03

| Findings | Decision |
| --- | --- |
| editorial-23 | Required. Every reference to another article names it by its title and links to it, as a00 does. |
| practitioner-16, editorial-28 | Required. The guard-row protection relies on Read Committed taking a fresh snapshot after the wait; at Repeatable Read it fails silently (reproduced). Say so where the reader chooses, and keep the paragraph on one rule. |
| practitioner-18 | Accepted. An abandoned open attempt blocks every booking for the class; name the server-side time limits briefly and leave detail to the article that owns it. |
| editorial-25 | Accepted. The paragraph before Figure 2 must not contradict its caption. |
| teaching-14 | Accepted. The wait example must agree with Figure 1 on whether R10 and R11 share a session. |
| teaching-15, editorial-30, visual-19 | Accepted. Figure 5: the prose says which options take the place before recording R8, the option labels say what is lost, and every step shows something new. |

## Declined

| Findings | Reason |
| --- | --- |
| editorial-32 | Anchors come from the registry so that links across the collection keep working. Renaming them is a registry change for the whole collection, outside this trial. |
| editorial-24 | Reorganising a03's heading hierarchy is a large structural change for an optional finding in the last repair. Recorded for a later revision. |
| visual-16 | r01 turned these prose tables into cards at the figures skill's guidance. The reviewer's point is that their content is now short values; worth a later look, but reversing it now would churn. |
| editorial-26, editorial-27, editorial-29, editorial-31, teaching-16, visual-20 | Standalone polish outside the passages being repaired. Recorded for a later revision. |
