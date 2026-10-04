# Index illustration: intended lesson

The question is “Which orders belong to customer C4?” The illustration separates
the orders table from an additional index on its customer ID. C4 occurs twice
in the index, leading to the same two orders that a table scan would find.
Repeated customer IDs are deliberate: this index is not a unique customer key.

The orders are O12/C4, O13/C8, O14/C4, O15/C2 and O16/C9. The index arranges the
same associations by customer ID. O12 and O14 have muted shading and a margin
stroke in both structures. On wide screens, two fine paths connect the index
entries to those destinations. On phones, the two labelled tables stack; the
explicit order IDs and answer preserve the mapping without cramped arrows.

The diagram teaches an alternative access route. It does not claim that a real
engine stores an index as a flat table, that order IDs are always its physical
locators, that looking through an index is free, or that indexing always beats a
scan. The caption states these limits. No timing, page count, or speedup is
invented. The answer paragraph also reminds the reader that this is information
the engine must maintain when orders change.

This is a static code-native drawing because exact associations matter. Its
plain ruled tables, thin paths, and muted marks use the shared theme-aware paper
tokens. There are no raised cards, buttons, hover states, or controls. Type sizes
are at least 13px at the usual 16px root size, and the narrow layout preserves
that size rather than shrinking the figure.

Implementation: `src/components/explainers/RelationalIndexLookup.astro`. The parent
coordinator integrates and checks the assembled page. This component has not
been accepted solely from a source inspection; check paths against row centres,
light and dark contrast, and the transition to the stacked phone layout in the
browser. Changes in text size must not misalign the paths or clip content.

Revision after isolated reading: the question now asks for C4's orders **and their
totals**. O12 totals €36; O14 totals €60. The totals appear only in the orders table,
so following the index to the records supplies information absent from the index.
The first draft asked only for order IDs, which were already present in the index;
its arrows therefore suggested an unnecessary lookup. Three fresh interpretations
of the repaired version are recorded in polish-aids-d/e/f.md.
