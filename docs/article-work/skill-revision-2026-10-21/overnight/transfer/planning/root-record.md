# Root planning record

- Start UTC: 2026-10-21 21:13:21.
- Planning, source checks and continuity audit end UTC: 2026-10-21 21:17:28.
- Status: draft root breakdown for orchestrator-managed review; no independent
  review claimed. Article first-draft time does not apply to this planning task.
- Source root: `/private/tmp/staycurrent-skills-night-d`; used its installed
  breakdown and continuity skills. Read the raw transfer commission, README and
  site direction, and the headings/scope of nearby published drawing pages.
  Those pages teach diagram choices and presentation, not editor geometry; they
  supply no prerequisite or added commission scope.

## Decisions

Propose two articles: a complete root explanation and one deeper implementation
of gesture invariants. The root covers all commissioned mathematics and the
browser input bridge; the child earns its page through state updates, transformed
dragging and gesture lifecycle. It has only a contextual stub, with no headings.
No third article is currently justified. The [example proposal](example-proposal.md)
gives one card in one rotated group, exact worked snapshots and separately labelled
extensions. The orchestrator must settle it before child planning.

The root's principal manipulation compares transform orders. Other proposed media
serve specific spatial difficulties: named-space routing, points versus steps,
rotation pivots, basis/offset, reverse mapping and collapse. Media scope and final
wording remain reviewable; this is not a figure implementation commission.

## Primary-source checks and limits

- [SVG 2 coordinate systems, §§8.2–8.6](https://www.w3.org/TR/SVG2/coords.html):
  initial right/down axes and the viewBox mapping support the stated convention
  and the half-size SVG example. V is root user space, not automatically pixels.
- [CSS Transforms, §§3, 9–10 and 14](https://www.w3.org/TR/css-transforms-1/):
  supports multiplication order, pivot translation, six-coefficient layout and
  clockwise positive quarter-turns. §10 also warns that singular transformed
  elements are not rendered; the collapse figure must depict a mathematical
  trace rather than claim observed SVG painting.
- [SVGGraphicsElement, §4.4.2](https://www.w3.org/TR/SVG2/types.html#InterfaceSVGGraphicsElement):
  the getScreenCTM algorithm maps local space to the document viewport, includes
  the SVG/browser bridge and may return null. Its historical name must not lead
  the writer to use screenX/screenY.
- [Geometry Interfaces, §§2.1 and 6](https://www.w3.org/TR/geometry-1/):
  checks DOMPoint multiplication, DOMMatrix composition and inverse behaviour.
  Failed inversion produces NaN values; do not rely on an exception. This source
  is a Candidate Recommendation Draft, not browser-execution evidence.
- [CSSOM View, §§2.1 and 10](https://drafts.csswg.org/cssom-view/):
  clientX/clientY use the viewport and CSS pixels. This editor's zoom differs
  from browser page/pinch zoom. The linked source is an editor's draft.
- [Pointer Events 3](https://www.w3.org/TR/pointerevents3/): confirms the relevant
  event family and capture/cancellation facilities for the proposed child;
  child planning must check the specific lifecycle decisions it adopts.

Quarter-turn forward, composed and inverse calculations agree by manual scalar
substitution. Zoom and drag snapshots preserve the recorded grab point. Collapse
maps two distinct points to one position. The near-collapse warning follows from
input error being divided by a small scale; it is not a general numerical
condition estimate or a universal determinant cutoff. No browser, compatibility,
rendered-control or executable-model result is claimed. Writers still need those
checks where appropriate.

## Continuity pass

Audited the whole planned reading order and example extensions. The root assumes
no previous graphics article. Spaces precede cross-space operations; displacement
precedes its matrix representation; turned unit steps precede trigonometry;
scalar equations precede matrix notation and multiplication; undoing precedes
inverse notation; a required non-zero denominator precedes division. Browser
client coordinates and units are explained before the input recipe. Fixed the
recipe brief so rejection behaviour is introduced there rather than relying on a
later explanation. Qualified line/parallelism preservation for collapsed mappings.

Names, units, baseline values and labelled extensions agree across the outline
and proposal. The child explicitly builds on the root and must remind/link its
prior terms. Final captions, control labels and step text do not exist yet, so
their complete first-use and consistency audit remains required during writing.
YAML parsing and structure checks passed: required root fields, recursive singular
heading lists, and exactly one child stub containing only topic/title/brief.
