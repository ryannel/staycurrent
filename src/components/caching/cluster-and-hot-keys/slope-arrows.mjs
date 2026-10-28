// Redraws chosen arrows of a shared sequence diagram as sloping lines, so a message
// that leaves one lane early and arrives late can be seen being overtaken. A step with
// `departs: i` leaves its sender at the row of step i and arrives at its own row.
// The shared sequence.mjs draws only level arrows, so this adjusts its drawing after
// each render (a local extension; reported as a toolkit gap). Only attributes change,
// so the observer below never triggers itself.

const NUM = /-?\d+(?:\.\d+)?/g;

function slope(svg, spec) {
  const groups = [...svg.querySelectorAll('g.cache-message')];
  const sloped = [];
  groups.forEach((g, i) => {
    const step = spec.steps[i];
    if (!step || step.departs === undefined || !groups[step.departs] || g.dataset.sloped) return;
    const arrow = g.querySelector('.cache-arrow'), head = g.querySelector('.cache-arrowhead');
    const origin = groups[step.departs].querySelector('.cache-arrow');
    if (!arrow || !head || !origin) return;
    const [x0, y1, x1] = (arrow.getAttribute('d').match(NUM) ?? []).map(Number);
    const y0 = Number((origin.getAttribute('d').match(NUM) ?? [])[1]);
    if (![x0, y1, x1, y0].every(Number.isFinite)) return;
    g.dataset.sloped = '1';
    arrow.setAttribute('d', `M${x0} ${y0}L${x1} ${y1}`);
    sloped.push({ x0, y0, x1, y1 });
    // An arrowhead pointing along the slope.
    const len = Math.hypot(x1 - x0, y1 - y0) || 1;
    const ux = (x1 - x0) / len, uy = (y1 - y0) / len;
    const bx = x1 - ux * 7, by = y1 - uy * 7;
    head.setAttribute('d', `M${x1} ${y1}L${bx - uy * 4.5} ${by + ux * 4.5}L${bx + uy * 4.5} ${by - ux * 4.5}z`);
    // Label just above the line's first third, on the side the line descends away from,
    // so it stays clear of the line and of the level arrows' labels.
    const label = g.querySelector('.cache-message-label');
    if (label) {
      const px = x0 + (x1 - x0) * 0.3, py = y0 + (y1 - y0) * 0.3;
      const leftward = x1 < x0;
      label.setAttribute('x', String(px + (leftward ? -6 : 6)));
      label.setAttribute('y', String(py - 4));
      label.setAttribute('text-anchor', leftward ? 'end' : 'start');
    }
  });
  // A level arrow that a sloping arrow crosses keeps its label on the longer side of the
  // crossing, against the end of its arrow, so the slope does not run through the words.
  groups.forEach(g => {
    if (g.dataset.sloped) return;
    const arrow = g.querySelector('.cache-arrow'), label = g.querySelector('.cache-message-label');
    if (!arrow || !label) return;
    const [xa, y, xb] = (arrow.getAttribute('d').match(NUM) ?? []).map(Number);
    if (![xa, y, xb].every(Number.isFinite)) return;
    const lo = Math.min(xa, xb), hi = Math.max(xa, xb);
    for (const l of sloped) {
      if (!((l.y0 < y && y < l.y1) || (l.y1 < y && y < l.y0))) continue;
      const xi = l.x0 + (l.x1 - l.x0) * (y - l.y0) / (l.y1 - l.y0);
      if (xi < lo || xi > hi) continue;
      const right = hi - xi >= xi - lo;
      const room = (right ? hi - xi : xi - lo) - 10;
      const width = label.getBBox?.().width ?? 0;
      if (width > room) {
        // Too narrow to fit beside the crossing: start the label just past it and let it run
        // over the lane line rather than under the slope.
        label.setAttribute('x', String(right ? xi + 16 : xi - 16));
      } else {
        label.setAttribute('x', String(right ? hi - 6 : lo + 6));
      }
      label.setAttribute('text-anchor', right ? (width > room ? 'start' : 'end') : (width > room ? 'end' : 'start'));
    }
  });
}

/** Keeps the arrows of `spec` (read afresh on each draw) sloped in the figure `root`. */
export function slopeArrows(root, spec) {
  const container = root.querySelector('[data-scene]');
  if (!container || typeof MutationObserver === 'undefined') return;
  const apply = () => { const svg = container.querySelector('svg'); if (svg) slope(svg, spec()); };
  new MutationObserver(apply).observe(container, { childList: true, subtree: true });
  apply();
}
