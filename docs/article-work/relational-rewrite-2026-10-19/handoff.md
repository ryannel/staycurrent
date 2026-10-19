# Relational replacement collection: final handoff

19 October 2026. **All 54 articles are ready as drafts**: 31 family and
distributed investigations, 13 PostgreSQL articles and ten CockroachDB articles.
The commission covers writing, practical work and review. Publication remains a
separate decision; the existing published collection is still the live reading.

Open <http://127.0.0.1:4323/review/relational/> with the preview server described
in [the work directory](README.md). Start from a reader task or use the complete
shelf. The directory presents implementation choices where the route branches;
a reader does not need to read all 54 pages to finish one task.

## What changed

The revised coverage allocation now has article bodies, worked examples, figures,
native worksheets and retained observations. The running booking identifiers
connect the explanations without implying that each independent fixture extends
the last. General mechanisms distinguish their PostgreSQL examples from engine
differences that change a decision. Product branches carry their own operational
and failure cases.

Writing and assembled-collection review exposed one missing full home: native
index maintenance. RL119 now covers measurement, reusable space, concurrent
rebuild costs, failed-copy cleanup and safe removal under foreground work. This
expanded an existing article; the allocation remains 54 pages. RL111 retains
heap horizons and freeze, and RL112 retains access methods and operators.

Other consequential repairs included a real two-range transaction fault exercise,
a failed secure join and identity-retirement exercise, a separate CockroachDB
restore destination, and reconciliation that preserves both accepted bookings
and remaining capacity. PostgreSQL major upgrade now has an executed 17.6 to
18.6 rehearsal. Earlier author handoffs retain the limitations known when they
were written; these later observations supersede their pending-work notes.

The shared FD04/FD05/FD06 investigations remain planned. Necessary relational
cases are taught locally, and no link to a planned page is used to discharge a
teaching obligation. The general distributed-systems programme remains parked.

## Review and acceptance

Independent readers covered the four writing groups. Their first readings and
resolution notes remain in `review/`. A separate collection reviewer derived
practitioner abilities before seeing the map, then followed the assembled
reading paths and rechecked the repairs. Fresh readings covered the substantially
rebuilt recovery and index-lifecycle explanations.

Findings remain visible, including the original failed versions. The final
registry records each article's status, review record and source SHA-256. The
ready label means the commissioned explanation, repairs and verification are
complete as a draft. It does not certify every possible deployment or authorise
publication. [Verification](verification.md) records what actually ran.

## Practical limits

Native server processes and their failures shared one host. They establish the
recorded SQL outcomes and controlled failure boundaries, rather than geographical
latency, host power-loss survival or production capacity. The CockroachDB macOS
ARM binaries are experimental; the worksheets name their release and temporary
cluster conditions. Certificate retirement checks new connections, not termination
of established pools. Upgrade fixtures do not establish arbitrary extension or
client compatibility.

All disposable native clusters were stopped and their stores and private keys
cleaned up. The retained evidence contains commands and observations, with no
private key material. The normal build excludes the review routes and evidence
endpoints. Saving and pushing these drafts leaves published article routes,
reading status and navigation intact.

## Delivery

Checkpoint `6143d1c` saved and pushed the full drafts, worksheets, evidence and
reviews. The closing checkpoint adds ready status, final source hashes, browser
records and this handoff. Both target `origin/main` under the repository's delivery
instructions, with the review routes excluded from the normal deployment.
