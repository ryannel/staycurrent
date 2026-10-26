# Blind initial reader notes — crdb-locality v01

Recorded before consulting plans, example facts, author evidence or verdicts. Fresh combined first reader; article at the fixed 4606 draft route, with bounded calibration against Indexes / Composite indexes, Storage and durability / Write-ahead log and Sequence diagrams / Trust boundaries (including rendered figures).

## Figures first

The five illustrations form a useful progression: gateway is not home; logical regional partitions include the history index; a nearby order still shares a transaction with remote stock; GLOBAL pays at writes for nearby current reads; failure tolerance depends on surviving voters rather than surviving copies. Figure 1's North/West route and Figure 5's zone/region selectors make their respective differences visible. Figure 2 keeps the same three orders and their lines recognisable. Figure 3 does the most important practical work: the stock guard prevents inferring that a regional order makes a purchase local.

Figure 4 is the least explanatory mechanically: it shows the write cost above the three regional results rather than exposing timestamp progression. It nevertheless supports this article's stated access-pattern decision; detailed protocol teaching would need a different scope. Labels explicitly qualify healthy/converged behaviour and distinguish models from traces.

## Body and writing

The body develops that sequence coherently. The opening names locality versus survival before applying either. Headings such as “Regional by row”, “Choosing a row's home region” and “Checking policy and placement” are direct and searchable, comparable to the references' bounded section names. The explicit North assignment of 101/103 and West assignment of 102 explains the picture; the later reset to before purchase 103 is stated before using it. The ordinary foreign-key versus explicit region assignment discussion is a useful awkward case rather than a detached warning.

The section on globally meaningful order identity is denser than its neighbours, but earns its place: the duplicate-103 statement immediately makes the consequence checkable. The final distinction between requested policy, converged placement and complete application behaviour is clear. No substantive blind teaching/editorial issue identified from the first reading. Later evidence checks still need to establish correctness and intended coverage.

## Rendered observations so far

Article actual viewport verified as 1280×720, System rendering dark. Inspected all five drawings; Figure 1 North step 2 and West step 3, Figure 5 West-region loss under zone and region survival. The changed labels and counts agree with the selected states. Boxes, captions and code remain readable. Phone, explicit light/dark, remaining representative controls and provenance are pending.
