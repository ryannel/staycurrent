/**
 * The committed Lucide icon stroke weight, site-wide (Iconography spec,
 * docs/design-system.md § Graphical UI: "16px, stroke 1.5") — every icon in
 * the product shares this one weight, whether it's a real `lucide-react`
 * component (sidebar, theme toggle, install block) or a hand-inlined SVG
 * string injected outside React (`components/article/enhancements.tsx`'s
 * DOM-appended copy button, which can't import the React icon components).
 * A single shared constant so the weight can't quietly drift between the two
 * call shapes.
 */
export const ICON_STROKE_WIDTH = 1.5;
