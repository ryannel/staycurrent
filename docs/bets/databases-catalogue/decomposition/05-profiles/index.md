# Milestone 5: Seven comparable engine profiles, core trio first

**Type:** surface (site)

**Consumer:** a reader on the deployed site — they open the Profiles group (7), see the ★ core trio (Relational, Key-Value, Columnar) badged and listed first, open any profile, and read a coordinate-scored entry that links into the foundations instead of re-teaching them.

**Demonstrable goal:** All seven profiles cut and live: `relational-database`, `key-value-database`, `columnar-database` (core), then `document-database`, `column-family-database`, `vector-database`, `graph-database`. Each carries `axes` frontmatter with its eight canonical coordinates and an article body following the profile skeleton (coordinates + links to foundations + the teachable quadruple — never re-taught mechanism). The relational profile links into the Operations foundations for operational depth exactly as every profile links into the machinery foundations — depth lives in the practice pieces, never re-taught in a profile.

**Sequencing rationale:** Profiles cite foundations for every mechanism claim, so they can only land after the foundations exist to link to (no dead links). The core trio lands first because the hub matrix and the library both feature it. Slices are authored on arrival.

**Acceptance criteria (agreed front-door cases):**
- [ ] Profiles (7) in the sidebar and library, ★ trio first, `[core]` badge on exactly three.
- [ ] Every mechanism reference in every profile links to a live foundation; no profile re-teaches a mechanism (spot-audited against the profile-skeleton convention).
- [ ] Each profile's frontmatter carries the eight `axes` keys with non-empty values.

## Proof of work

**Proves:** The comparable-periphery register works: seven entries a reader can diff, each thin where the foundations are deep.

**How we prove it:** Drive the library and one core + one non-core profile on the served build; verify badges, ordering, axes frontmatter presence (build-time check), and that a sampled set of mechanism links resolves to live foundations.

**Test file:** `tests/bets/databases-catalogue/test_milestone_5_profiles.py` — generated red on arrival.

## Slices

Authored on arrival at Milestone 4's postmortem. Expected shape: seven content slices, research-register (labs only where a measurement is news).
