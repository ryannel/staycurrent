# Author teaching notes

This note records teaching choices separately from the rendered mechanical receipt. It is not an independent article review or a claim of expert-practitioner completion from one introduction.

The article begins with a reason to care: accepting one purchase changes several shared facts. It then earns that example's vocabulary by making one row, one identifier and one reference concrete. The offered/agreed price distinction makes fact meaning visible before discussing the value of separating data.

The history query reuses those same rows and returns four lines for two orders. That result supplies the first useful SQL reading and the warning about counting the wrong thing. The payments paragraph extends the same reasoning to two independent one-to-many relationships, while leaving working query depth to the finished children.

The stock counterexample is deliberately more revealing than a negative count: two stale reads followed by two writes of zero satisfy the simple stock constraint while accepting too many orders. The alternative combines test and change, then shows the waiting/recheck/result-handling steps rather than attributing the outcome to the word transaction. Full multi-row invariants and engine comparisons remain with deeper reading.

The next distinction is the work behind the statement. The article introduces index access, bulk scanning, pages, memory and the difference between execution work and waiting, without asking a newcomer to read an unexplained query plan. It returns to the actual commit to explain why pages can lag a durable log, then separates that committed fact from the application's knowledge after a lost reply.

The final sections turn the same purchase into service decisions: copies can be stale, partitions need routing and coordination, and recovery depends on whether the incident destroyed a process, write authority or the desired history. The first shortlist follows those requirements, adds analytical/mixed work, and ends with evidence that should decide the next step.

The fixed references led the prose/figure rhythm: establish the mechanism, tell the reader what to watch, show it, explain the consequence, and link the working depth. Only one figure needs controls because it has a meaningful alternative protocol. The relationship tables and commit ordering are directly readable without playback.

No older draft, previous feedback or outcome was used. Any evaluation beyond the author's continuity and rendered checks belongs to the coordinator's fresh commissioned review.
