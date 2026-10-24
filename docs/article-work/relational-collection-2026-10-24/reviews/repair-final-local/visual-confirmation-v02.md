# Visual review · focused repair confirmation · r05, r20, r42 and changed context · v02

Inputs read: [fixed manifest](v02/manifest.json), SHA-256 `1aef05969d6a80c22dbf2c11b43ab6c9900364d373f06ad40318ba25d7b1f1db` (171 inputs); current rendered routes at `http://127.0.0.1:4560/review/relational-collection/`; relevant rendered fixed-reference figures (Indexes figure 2; Storage and durability figure 9); AGENTS.md, README/site direction, review skill and visual perspective only, figures skill and its rendered-check/database-verification instructions. Mechanical inputs consulted: r42 native results and original source hashes; r20 execution provenance and native result. No author notes, plans, earlier reviews, decisions or history were read.

Highest severity: low

This is an informed, focused confirmation. It provides neither blind corpus coverage nor complete final-article credit. The confirmed repairs pass; there is no substantive visual finding.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. First reading alone | pass within confirmation scope | Considered r05 append SQL/result comparison and r20/r42 figures before deliberately reading their surrounding explanations. Used all five r20 states and both five-state r42 branches. First-reading observations below. |
| 2. Form fits the content | pass | r05's small comparison table suits two ordered result sequences; its nearby identity tuples make projected-row equality concrete. r20 separates receive, flush and replay. r42 gives the two real relations separate tables with actual column headings and explicit selection labels. |
| 3. Readable at a glance | finding, low | Repaired text, tables, tuple examples and notes are legible. A few unchanged r20 text-alternative items omit spaces around code numbers; see r20 visual-10. |
| 4. Interaction | pass | Meaningful Next/Back/Reset, Play/Pause/Replay and text disclosures used; r42 radio branches alter identity, selected relation, policy explanation and returned price. Endpoint keyboard focus retained. Playback observed with page timers, with pause available. |
| 5. Themes and phones | pass | Actual 1280×720 and 375×812, explicit Light/Dark, current screenshots and computed contrast checked. No page-level horizontal overflow. Phone controls retain the changing result/explanation above them. Narrow SQL scrolls within its focusable code region. |

## First reading

- **r05 append SQL and result comparison:** two compatible customer-ID queries feed one combined answer, sorted by the final `ORDER BY`. The comparison shows `1, 1, 2` versus `1, 2`; the extra `1` is the visible distinction. After reading in place, the paid/pending contributions, Mina's repeated ID, `(1, 101)`, `(1, 103)` and `(2, 102)` explain both the duplicate and why retaining order identity preserves all three tuples. Compatible column counts/types/meanings and the final sort are stated together. The anchor's initial viewport included adjacent prose; the initial observation was on the SQL and table before deliberately reading those paragraphs.
- **r20 Progress:** four labelled progress tracks can reach different positions. The fresh-query result remains “No order 103” through flush and becomes “Order 103 present” only after replay. The full text alternative makes the conditional process-crash durability claim explicit at state four. No uncertainty remains about durable history versus fresh-query visibility; the conceptual-position note also separates the drawing from the native observation.
- **r42 NameLookup:** the original session stays fixed while the effective identity changes. The caller's counterfeit table and `shop.products` remain separate objects with distinct stored prices. The unsafe branch selects the counterfeit table and returns 999; the limited, qualified branch selects the real table and returns 20.00. The figure-level “enabled, without FORCE” note applies throughout both branches. The expanded alternative repeats that boundary and explicitly says the safe prices are checked again after FORCE is restored. These are lookups, not edits to either stored catalogue.
- **r08/r34/r54 changed context only:** r08's four-paragraph snapshot explanation concerns publisher sequencing and does not change the version-arrival figure's model. r34's short reminder establishes counter scope without a hypothetical result table; its remaining prepared-plan figure still describes observed native routes. r54's added recap distinguishes appending contributions from joining pairs and remains consistent with the following observed Append/foreign-scan paragraph. None of these context changes invalidates the existing media reading or calls for a new figure.

## Repair results and affected surroundings

| Piece | Result |
| --- | --- |
| r05 `#appending-results` | Pass. The SQL, visible comparison, contribution explanation, projected identity pairs, compatible inputs and final ordering form one coherent worked example. Both outcomes remain legible on the phone. A short comparison of sequences is sufficient here; a further animation would add little. |
| r20 Progress, complete current five-state figure and surrounding explanation | Pass. The revised fourth full-text state says a replica process crash can be survived provided storage honours the flush contract; replay remains at zero and fresh queries still lack 103. The current drawn states, native-observation paragraph and old-snapshot qualification agree. Optional list-spacing polish below does not affect this repair. |
| r42 NameLookup, both complete five-state branches and surrounding explanation | Pass. Both unsafe tests explicitly return to enabled/unforced row security; the prose says owner execution does not itself escape forced row security. The figure's note applies to all states. The safe branch's limited role, original-session policy and qualified object explain the real returned price; the alternative records rechecking after FORCE. |
| r08 snapshot passage | Pass for changed context. Separate guard acquisition and later Read Committed snapshots are explicit; the existing incoming-version figure makes no competing snapshot claim. |
| r34 counter reminder/table removal | Pass for changed context. No illustrative counter table remains to be mistaken for execution evidence; the scoped reminder and buffer-category paragraphs lead coherently into the remaining examples. |
| r54 UNION ALL recap | Pass for changed context. The recap prepares the observed Append paragraph, preserving shop identity and compatible contributions. |

## Findings

### r20 visual-10 · low · Progress, expanded “All progress states as text”, items 1–3 and 5

Problem: Some unchanged inline-code numbers touch their surrounding words: for example “purchase103”, “position2” and “through2”. The repaired fourth item has proper spacing.

Effect: The reader encounters a small reading stumble in the otherwise useful static alternative, especially in the wrapped phone list. The meaning remains recoverable and the repaired durability claim is clear.

Suggestion: Add literal spaces around these inline code elements, retaining the current text and values.

Evidence: Current rendered alternative at 375×812 in both themes and 1280×720; [mechanical observation notes](visual-notes/v02-observations.md).

## Limits

- No product source, build, database process or downloadable experiment was executed or changed. Native receipts were consulted as mechanical context; their results were not recertified as an independent practitioner check.
- All changed principal media received current rendered reading and actual control use. r08 VersionFlow, r34 Prepared and r54's unchanged interactive tools were not given blanket state/theme reruns: their changed prose does not invalidate those mechanics or visual judgements.
- Playback ran in a background IAB tab. Page-clock observations, rather than screenshot frame timing, showed r20 progressing through the five states with approximately seven-second holds, and r42 holding state three before progressing to four. Pause was actually used in both. This is no claim about real replication or execution timing.
- Contrast measurements covered rendered text colours against their composed backgrounds, including muted notes and status labels. The important graphical states also have explicit words/checkmarks/dashes rather than colour alone. Decorative container edges were not treated as data marks.
- Relevant fixed-reference calibration was focused on identity-preserving entries and the process-crash/flush boundary. It was not a complete rereading of all reference articles.
- Restored System theme, reset the viewport override, verified actual 1280×720 with resolved dark theme, then closed the owned IAB tab. No Chrome or global OS settings were changed; the IAB3 QA lease is released.
