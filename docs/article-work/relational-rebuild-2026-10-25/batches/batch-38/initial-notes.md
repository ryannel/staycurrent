# Blind reader notes — pg-upgrades v01

Recorded before consulting the plan, example facts, author notes, earlier verdicts or sibling reports. Audience: intelligent application engineers following the prerequisites. Reviewed the finished article at `http://127.0.0.1:4606/review/relational-rebuild/postgresql/upgrades/`, fixed by `review-source.json`.

## Initial understanding

Read the labelled figure sequence and meaningful branches first, then the complete rendered body. Figure 1 makes the choice operational: a logical stream moves bulk copying before the pause but leaves final apply and acceptance inside it. Figure 2 distinguishes old-file usability from keeping accepted business history: copy preserves separate files, while link-mode startup already removes the old cluster as a usable fallback. Figure 3 follows the same source and candidate through draining, final applied history, acceptance, transfer of authority and the target-only 22.00 change. Its alternative import-worker branch makes a momentary match visibly insufficient. I can explain the principal migration decisions without supplying an omitted causal step.

The body develops those distinctions coherently. The opening establishes the shop's post-103 state; the inventory expands acceptance beyond rows; the sequence counterexample makes a usable allocator a separate obligation; the final SQL distinguishes catalogue price from the 29.00 agreed order and its absent payment. The copy/link paragraphs and the return section keep the two different return boundaries distinct. The account of a bounded local rehearsal gives useful evidence without claiming production fencing or duration.

## Reference calibration and initial judgement

Compared bounded finished examples: Storage and durability's `fsync`/drive-cache passage and figure; Indexes' index-entry/row-location passage and building-an-index figure; Sequence diagrams' lifelines/messages figure and surrounding explanation. The references use one concrete change, named entities and a visible consequence, then explain what it means. This article follows that teaching pattern with source/target price and authority changes. Its panels are simpler than the physical page/log drawings, but the work map, shared-file labels and paired price states expose the relationships this operational article asks readers to judge. The prose is plain and connected; headings such as “Rehearse pg_upgrade” and “Accept the target before admitting writers” accurately name the task they teach. “Close the source history” is more abstract, but its immediately following definition and stale-worker example make its meaning clear.

No substantive teaching or editorial finding identified in this blind reading. No optional wording change appears necessary to complete the article.

## Rendered observations so far

Owned IAB tabs only. Desktop observed at 1280×720 in System (dark appearance). Independently verified the phone tab at `innerWidth=375`, `innerHeight=720`, document width 375 after applying the override to that fresh tab. Phone light and dark screenshots show reflowed method rows, vertically stacked source/relation/target panels, readable captions, controls and result summaries. Current checks include copy transfer/startup, link sharing/startup, safe handover through 6/6 and stale-writer failure states. No clipping, overlapping text or misleading price/result state seen. Remaining bounded work: playback/pause, clone representation, desktop light, accessible text, intended-understanding/ownership check, then restoration and tab cleanup. This is a reader/rendered review; native fixture execution and complete mechanical coverage remain with their owners.
