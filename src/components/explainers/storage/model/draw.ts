/*
 * Small drawing kit for the storage animations.
 *
 * A scene describes each frame as a flat list of keyed SVG items. `reconcile`
 * keeps elements whose key survives between frames and only changes their
 * position, class and text, so CSS transitions move them smoothly. New items
 * fade in (optionally from another position) and missing items fade out.
 */

export type Item = {
  key: string;
  tag: 'rect' | 'text' | 'line' | 'path' | 'circle';
  x: number;
  y: number;
  cls?: string;
  attrs?: Record<string, string | number>;
  text?: string;
  /** Where a newly created element starts before moving to x, y. */
  from?: { x: number; y: number };
  opacity?: number;
  delay?: number;
};

export type Frame = { items: Item[]; height: number };

export const rect = (key: string, x: number, y: number, w: number, h: number, cls: string, extra: Partial<Item> = {}): Item => ({
  key, tag: 'rect', x, y, cls, ...extra,
  attrs: { width: Math.max(0, w), height: Math.max(0, h), ...(extra.attrs ?? {}) },
});

export const text = (key: string, x: number, y: number, value: string, cls = 'sf-t', extra: Partial<Item> = {}): Item => ({
  key, tag: 'text', x, y, cls, text: value, ...extra,
});

export const line = (key: string, x: number, y: number, x2: number, y2: number, cls: string, extra: Partial<Item> = {}): Item => ({
  key, tag: 'line', x, y, cls, ...extra,
  attrs: { x1: 0, y1: 0, x2: x2 - x, y2: y2 - y, ...(extra.attrs ?? {}) },
});

/** Move an item by dx, dy, for items that travel with a card. */
export const shift = (item: Item, dx: number, dy: number): Item => ({ ...item, x: item.x + dx, y: item.y + dy });

const NS = 'http://www.w3.org/2000/svg';
const LEAVE_MS = 420;

export function reconcile(layer: SVGGElement, items: Item[]) {
  const existing = new Map<string, SVGElement>();
  for (const child of Array.from(layer.children) as SVGElement[]) {
    const key = child.dataset.key;
    if (key) existing.set(key, child);
  }
  const entering: { el: SVGElement; item: Item }[] = [];
  const seen = new Set<string>();
  let previous: Element | null = null;

  for (const item of items) {
    if (seen.has(item.key)) continue;
    seen.add(item.key);
    let el = existing.get(item.key);
    if (el && el.tagName !== item.tag) { el.remove(); el = undefined; }
    if (!el) {
      el = document.createElementNS(NS, item.tag) as SVGElement;
      el.dataset.key = item.key;
      const start = item.from ?? { x: item.x, y: item.y };
      el.style.transform = `translate(${start.x}px, ${start.y}px)`;
      el.style.opacity = '0';
      layer.insertBefore(el, previous ? previous.nextSibling : layer.firstChild);
      entering.push({ el, item });
    } else if (el.dataset.leaving) {
      delete el.dataset.leaving;
    }
    apply(el, item, !entering.some(entry => entry.el === el));
    previous = el;
  }

  for (const [key, el] of existing) {
    if (seen.has(key) || el.dataset.leaving) continue;
    el.dataset.leaving = '1';
    el.style.transitionDelay = '0ms';
    el.style.opacity = '0';
    window.setTimeout(() => { if (el.dataset.leaving) el.remove(); }, LEAVE_MS);
  }

  if (entering.length) {
    // Commit the starting position before moving to the target.
    void layer.getBoundingClientRect();
    for (const { el, item } of entering) place(el, item);
  }
}

function apply(el: SVGElement, item: Item, placeNow: boolean) {
  el.setAttribute('class', item.cls ?? '');
  for (const [name, value] of Object.entries(item.attrs ?? {})) el.setAttribute(name, String(value));
  if (item.tag === 'text' && el.textContent !== (item.text ?? '')) el.textContent = item.text ?? '';
  el.style.transitionDelay = item.delay ? `${item.delay}ms` : '0ms';
  if (placeNow) place(el, item);
}

function place(el: SVGElement, item: Item) {
  el.style.transform = `translate(${item.x}px, ${item.y}px)`;
  el.style.opacity = String(item.opacity ?? 1);
}
