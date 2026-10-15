# PostgreSQL independent review

Root read all four complete articles and all lesson SQL independently of the author
on 15 October 2026. The separate collection reader is also following the assembled
pages in order before publication.

Architecture connects one application session, planned lookup, heap visibility,
conditional stock update, log and later maintenance. The ordinary heap fetch is
justified by fields absent from the primary-key index. Physical locations are not
application identity; buffer reads are not asserted to be physical disk reads.
The stock-only exercise states its narrower transaction boundary than real checkout.

Access methods develops what each structure stores before making a choice. B-tree
ordering, hashed path/value GIN candidates and lossy BRIN ranges are distinguishable.
Operator-class support, expression mismatch, correlation and summarisation explain
why an index may not help. Root requested an explicit DROP INDEX before the BRIN
snippet; the author added it. The teaching setting pages_per_range=4 is scoped.

Row versions connects tuple locations and creator IDs to visibility without claiming
that comparing IDs implements visibility. The two-session retained-snapshot schedule
is a documented server procedure, not a browser observation. The covering field's
HOT cost is explained, as are conservative visibility-map bits and the difference
between space reuse and a smaller file. Root found that the update and plan in one
browser block were described as a post-commit read. Author split the update and
subsequent plan into separate runs and reverified all 22 steps and variations.

Recovery distinguishes insertion, flush, commit acknowledgement and data-page writes.
The WAL-after-rollback experiment demonstrates physical logging without a committed
logical effect. Exact bytes are qualified, shared stream advancement is not attributed
solely to one statement, and PGlite fsync=off is disclosed. Checkpoint redo boundaries,
full-page images, async commit and loss of the entire storage each retain their
relevant conditions. There is no claim that these lessons executed a power-loss test.

Writing judgment: each opening introduces the mechanism before the example, headings
form a usable argument, and operational details stay attached to consequences for
that example. Access-method and checkpoint sections introduce specialised vocabulary
where it explains an observed difference. No unresolved material teaching or factual
finding remained after the two bounded repairs. Rendered checks cover each page in
both themes at phone and desktop sizes; source/verification evidence is retained.
