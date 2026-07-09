import type { Element, Root } from 'hast';
import { visit } from 'unist-util-visit';
import type { TocEntry } from '../types.js';
import { hastToText, slugify } from './text.js';

const HEADING_TAG_RE = /^h([1-6])$/;

/**
 * Mutates `tree` in place: assigns a deduped, prefixed `id` to every heading
 * element and appends one `TocEntry` per heading to `toc`, in document order.
 *
 * Dedup tracks the set of ids actually emitted, not just base-slug counters —
 * headings "Overview", "Overview", "Overview 1" must yield three distinct ids
 * (overview, overview-1, overview-1-1), never a collision between a suffixed
 * duplicate and a heading whose own text slugifies to that suffixed form.
 */
export function assignHeadingIds(tree: Root, prefix: string, toc: TocEntry[]): void {
  const emitted = new Set<string>();

  visit(tree, 'element', (node: Element) => {
    const match = HEADING_TAG_RE.exec(node.tagName);
    if (!match) return;

    const depth = Number(match[1]);
    const text = hastToText(node).trim();
    const base = slugify(text) || 'section';

    let id = `${prefix}${base}`;
    if (emitted.has(id)) {
      let n = 1;
      while (emitted.has(`${prefix}${base}-${n}`)) n++;
      id = `${prefix}${base}-${n}`;
    }
    emitted.add(id);

    node.properties = { ...(node.properties ?? {}), id };
    toc.push({ depth, text, id });
  });
}
