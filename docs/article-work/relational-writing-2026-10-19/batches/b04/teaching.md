# B04 independent writing and teaching review

**Verdict: a04 passes its narrow recheck; a05 needs three local figure repairs.** The prose and overall teaching approach support continued writing under the existing skill. No further skill rewrite is indicated.

Used the three fixed examples previously read in full, including figure implementations. Rechecked a04's required B03 findings without repeating its unchanged prose/scenes. Read a05's full article and figure implementation, its own/parent/sibling/child plans, and the available family context already reviewed. Component hashes matched the manifest. Used a separate Chrome tab on fixed built preview **4437**, operating all five a05 figures and all 14 cases, manual Next/Back, Play/Pause and text alternatives; checked desktop, 390 × 844, and light/dark views. Restored System theme and the normal viewport. Native correctness and build verification remain with their separate reviewers.

## a04 — Building applications around a relational database: pass

Both required B03 findings are resolved. Independently exercised all ten paths through both endpoints: all **20 endpoint transitions moved focus to Play**, rather than BODY. Source inspection and actual playback confirm that each hold now includes narration and both state fields at 180 words per minute plus comparison time, with a six-second minimum. Manual controls and comparison choices still stop playback. The longer recovery explanation remains available for reading alongside its two states.

The reduced phone event minimum also removes unnecessary empty space while preserving readable states and transport. Article and scene content are unchanged; their B03 teaching assessment stands.

**Required:** none remaining. **Optional:** B03's persistent pool-slot and original-identifier enhancements remain optional, not conditions of this pass.

## a05 — Understanding and improving database performance: repair

### Prose, gradual exposure and complete diagnosis

The article completes the parent's promised investigation. It starts with useful workload budgets and measurement boundaries, introduces page work before access paths, supplies reporting units before interpreting the plan, finds the consequential 18-versus-8,000 estimate, predicts reduced repeated work, tests targeted statistics refresh, verifies result meaning, and accepts the remedy against reports, lookups and changes. The reader can finish that loop here. The opening and contextual links explicitly make the four children optional investigations, rather than prerequisites for the conclusion.

The shop remains recognisable across the history lookup, report and changes. Numerical examples earn the definitions: repeated lookup work explains why ten returned rows do not imply a small execution; warm buffer hits remain work; lower estimated cost is not treated as measured speed. The final comparison records its narrow conditions and closed-loop limitation beside the result. These qualifications serve the judgement being taught rather than interrupting it with an unrelated catalogue.

Storage lifetime, covering-index visibility, index maintenance and per-operation memory receive usable high-level explanations. Their deeper physical, traversal and workload mechanisms belong to a24–a28. The short composite history-key example is sufficient here; a second B-tree lesson would duplicate its child. The plan legend is dense but purposeful, followed immediately by one compact plan and explicit `10 × 8,000` arithmetic. Preserve this prose and scope.

### What the actual figures teach

- **Figure 1:** proportional bars keep the same 160ms total while moving the dominant delay between acquisition, execution and transfer/application work. This materially reduces the temptation to infer database execution time from request latency.
- **Figure 2:** a real page map distinguishes four scattered matches touching four pages, four nearby matches touching one, and a broad request reaching all six. Matching cells and page borders make locality visible; the invented model is labelled separately from observations.
- **Figure 3:** the three cases keep the same report and expose underestimated customers, 8,000 repeated ten-row probes, then the changed scan/hash route and buffer/temporary-work counts. It is a compact textual diagram rather than an animated operator execution, but the stages reinforce the plan explanation without pretending to be a trace.
- **Figure 4:** explicit application/database queue counts preserve the six-tick final completion when admission alone changes, then reduce it to three ticks when actual work halves. The small arithmetic establishes this bounded point; a full concurrency simulator is unnecessary.
- **Figure 5:** keeps all operation classes in view within each run, but hides every baseline metric when After is chosen. This weakens the article's central acceptance comparison and needs the repair below.

All 14 case choices displayed their stated values. Buttons, selected-case indicators and text were legible in both themes. Phone views wrap the bars, page map and paths without page overflow. After positioning the figure, the changing map/path, explanation and transport can be read together; no additional required phone layout repair was identified. The measured metric cards are readable individually, but their comparison problem persists on both phone and desktop.

### Required

1. **Preserve endpoint focus — `a05/PerformanceFigure.astro:62`.** Enter on final Next and first Back moved focus to BODY in all five figures. Transfer focus to an available control before disabling the active button, or use a properly guarded accessible endpoint. Recheck both ends of each scene; the a04 repair supplies an already-verified pattern.
2. **Budget case playback for reading and comparison — `PerformanceFigure.astro:65`.** A fixed 6.5-second interval replaces panels containing several path/count or metric lines plus narration. Figure 3 requires reading customer estimates, per-loop work, total rows and buffers; Figure 5 adds four ranges with different units. Observed Play advances automatically through these dense panels. Use a hold based on the complete visible panel with comparison time, retaining pause/manual selection. Recheck the longer cases on phone and desktop. A slower state change is useful here; decorative travelling animation is not required.
3. **Keep the measured before/after evidence together — comparison data at `PerformanceFigure.astro:27–30`, rendering at `:42`.** Selecting After replaces all four baseline cards: report p95, lookup p95, change p95 and completion rate. The reader must remember several decimal ranges to evaluate “report improves while short requests remain similar”. The following prose supplies both report ranges but leaves that whole-workload comparison largely asserted. Retain baseline and after ranges together for each class, using a compact table, paired range marks or a persistent baseline beside the selected case. Keep milliseconds distinct from completions/second, preserve the three-run ranges and bounded-instance provenance, and keep it usable at 390px. The interaction may highlight a class or phase; no new figure is necessary. This is the evidence on which the parent accepts its remedy, so reducing comparison effort matters.

### Optional

Figure 3 could retain an estimate beside its observation while highlighting the repeated inner probe and subsequent sort; Figure 4 could draw six persistent jobs across application queue, bottleneck and completion positions. These would strengthen the spatial teaching, but the present compact counts and surrounding explanations establish their local decisions. They are not additional required mechanisms or a figure quota.

## Limits and scale decision

Reduced-motion emulation is unavailable in this browser interface. These figures use explicit-start timed panel/state changes without CSS travelling, fading or keyframe animation; manual controls and full text alternatives remain available. This was not a screen-reader audit or a production benchmark review.

Repair a05's shared player and final comparison, then recheck those changes narrowly. The recurring focus/timer implementation defects call for applying the existing readable-playback and keyboard guidance, which a04 now demonstrates successfully. Preserve the coherent diagnosis and ordinary-case completion rather than expanding the article or skill.
