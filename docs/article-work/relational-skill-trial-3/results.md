# Relational skill trial 3 results

Review ended after round 3 with **no critical findings**. Four medium and six low finding groups remain below the applicable floors, including two low findings retained from round 2. This is a policy-complete run, not a full quality pass. No content was published or pushed.

Skills match commit `005ab6f`; setup and isolation rules are in [brief.md](brief.md). Every writer, repair and review assignment used a fresh subagent, with no history supplied to reviewers. The coordinator matched findings, assigned severity and recorded decisions, without editing article prose.

## Findings and repairs

Counts below are report labels at coordinator severity, rather than unique issues across rounds.

| Round | Repair floor | Critical | Medium | Low | Outcome |
| --- | --- | ---: | ---: | ---: | --- |
| 1 | low | 2 | 3 | 3 | All accepted and repaired; two critical labels described one figure defect. |
| 2 | medium | 0 | 2 | 3 | Two medium repairs; three low findings retained. |
| 3 | critical | 0 | 4 | 4 | No repairs; review ends. |

Round 1 repaired explicit SQL column mapping, the worked snapshot-after-lock-wait explanation, a premature reservation aside, a false R10/R11 lane attribution, ownership language in handoffs, directive openings and phone scrolling cues. The two critical labels were the same contradiction between a figure lane and its described request. Details and every severity decision: [round 1](r01/decisions.md).

Round 2 clarified the application-library value-preservation check and bounded the rollback exceptions to operations added beyond the booking example. The latter repair clarified scope but did not fully solve flow: round-3 editorial-8 repeats editorial-5. The distributed-service wording remained below the floor and recurred as editorial-11. Details: [round 2](r02/decisions.md), [round 3](r03/decisions.md).

The final four medium groups concern the rollback detour, conflicting reading-order guidance in the copied shared shell, unexplained terms, and phone playback controls far below changing request lanes. The six low groups concern distributed-service wording, the serial-baseline phrase, the restart opening, an identity reminder, phone relationship wrapping and small phone table text. Every reported label, including below-floor findings, has a recorded decision in each round’s findings.json and decisions.md.

## Length

These are whitespace source words, matching trial 2’s metric. They include Astro markup and exclude component text; they are not total rendered reading lengths.

| State | a00 | a03 | Combined |
| --- | ---: | ---: | ---: |
| Initial draft | 3,752 | 3,917 | 7,669 |
| After round 1 | 3,796 | 4,140 | 7,936 |
| After round 2 | 3,816 | 4,149 | 7,965 |
| After round 3 / final | 3,816 | 4,149 | 7,965 |

Repairs added 296 source words (3.9%). Machine-readable counts: [measurements.json](measurements.json).

## Time and verification

First recorded setup timestamp: **19:07:45 UTC**. Final records prepared: **20:20:12 UTC**, about **72 minutes** later; this slightly understates setup before the first timestamp and excludes the final commit’s few seconds. Drafting took approximately 14 minutes in parallel. Full assignment timings, including withdrawn assignments and report transcription, are in [timings.md](timings.md) and [timings.json](timings.json). Their summed intervals are 114.1 minutes and overlap.

Most elapsed time went into four-perspective review, browser inspection/recovery, repeated native verification and records. A premature freeze required withdrawing two reviews; a concurrent build collided in generated output and was rerun serially. Both costs are included. The user twice flagged the disproportionate delay. This process was too expensive for two articles, even though it completed the requested experiment.

Native checks used a new disposable PostgreSQL 18.6 cluster/database and distinct port on every invocation: 16 invocations, 11 successful executions, five environment failures before startup. All 16 cluster directories were independently confirmed removed. Final round-2 build passed all 13 site-check rules; round 3 changed no article/component source. The preview stopped at 20:15:38 UTC. See [cleanup-audit.json](cleanup-audit.json) and individual verification records. Browser review tabs were closed by reviewers; two coordinator preview tabs were retained as deliverables with cached final pages, and reload requires restarting the stopped preview.

## Comparison with trial 2

[Trial 2 results](../relational-skill-trial-2026-10-21/results.md) report final source counts of 6,732 / 8,812 (15,544 combined). Trial 3 is **43.3% shorter for a00, 52.9% shorter for a03 and 48.8% shorter combined**. Trial 2 grew from 14,411 to 15,544 words during repairs; trial 3 grew from 7,669 to 7,965.

Trial 2’s initial-draft commit to final-record commit spans 2 h 11 m 22 s, excluding its drafting. Trial 3’s recorded setup-to-results window is about 72 minutes including drafting. This is a useful observed comparison, not equal timing boundaries; trial 2 lacks complete assignment timings. Trial 2 used required/optional findings and stopped at its three-round limit without a full pass; this trial used three severity levels and a rising floor, also ending with outstanding findings. Severity totals are therefore not directly comparable. Different generated drafts and independent reviewers prevent attributing differences solely to the skills.

## Quality judgement

The introduction has a coherent path from relationships and join multiplication to concurrency and deployment evidence. The concurrency article’s concrete schedules, worked snapshot cases and native checks make its causal explanation useful. The shorter length is a substantial improvement in reader cost over trial 2.

Neither article yet has the reference articles’ fluency. The rollback aside still feels patched in; a few terms and navigation instructions impose avoidable interpretation. The phone interactions require too much scrolling between controls and changing information. These are useful, technically checked drafts with strong examples, but the stopping rule leaves real editorial and interaction work outstanding. No critical finding is a narrower claim than publication readiness.

## Delivery

Local commits: initial drafts `80276a4`; round-1 repairs/records `14e4f89`; round-2 repairs/records `26811e2`; final round-3 records/results committed after this file is written. No push. Article and component paths remain isolated under relational-trial-3; screenshots of the final pages are in r03/.
