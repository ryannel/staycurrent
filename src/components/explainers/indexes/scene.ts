// Drawing for the Indexes figures. A table is a grid with one row per heap
// page; an index is a grid with one row per leaf page, optionally with the
// root and branch pages of its B-tree drawn sideways to its left.

import { svg, place } from './player';
import { orders, root, branches, type Order, PAGES, PAGE_ROWS } from './model';

export const G = { cw: 37, ch: 32, gx: 3, gy: 7, head: 26, rootW: 34, branchW: 46, treeGap: 6, pageLabel: 44 };
export const gridWidth = PAGE_ROWS * G.cw + (PAGE_ROWS - 1) * G.gx;
export const gridHeight = PAGES * G.ch + (PAGES - 1) * G.gy;
export const treeWidth = G.rootW + G.treeGap + G.branchW + G.treeGap;
export const panelHeight = G.head + gridHeight;

export type CellState = '' | 'reading' | 'match' | 'reject' | 'fetch' | 'found' | 'dim' | 'new' | 'hidden';

export interface Cell { g: SVGGElement; mark: SVGTextElement; key: SVGTextElement; sub: SVGTextElement; x: number; y: number }

export function cell(parent: SVGElement, key: string, sub: string, extraClass = ''): Cell {
  const g = svg('g', { class: `ix-cell ${extraClass}`.trim(), 'data-state': '' }) as SVGGElement;
  g.append(svg('rect', { x: 0, y: 0, width: G.cw, height: G.ch, rx: 2 }));
  const keyText = svg('text', { x: G.cw / 2, y: 14, class: 'ix-key', 'text-anchor': 'middle' }, key) as SVGTextElement;
  const subText = svg('text', { x: G.cw / 2, y: 26.5, class: 'ix-sub', 'text-anchor': 'middle' }, sub) as SVGTextElement;
  const mark = svg('text', { x: G.cw - 3.5, y: 9, class: 'ix-mark', 'text-anchor': 'end' }, '') as SVGTextElement;
  g.append(keyText, subText, mark);
  parent.append(g);
  return { g, mark, key: keyText, sub: subText, x: 0, y: 0 };
}

const marks: Partial<Record<CellState, string>> = { match: '✓', reject: '×', found: '✓', new: '+' };

export function setCell(c: Cell | undefined, state: CellState) {
  if (!c) return;
  if (c.g.getAttribute('data-state') !== state) c.g.setAttribute('data-state', state);
  const mark = marks[state] ?? '';
  if (c.mark.textContent !== mark) c.mark.textContent = mark;
}

export function moveCell(c: Cell, x: number, y: number) {
  c.x = x; c.y = y;
  place(c.g, x, y);
}

export const cellX = (col: number) => col * (G.cw + G.gx);
export const cellY = (row: number) => G.head + row * (G.ch + G.gy);

export function title(parent: SVGElement, x: number, y: number, text: string, anchor = 'start') {
  const t = svg('text', { x, y, class: 'ix-title', 'text-anchor': anchor }, text);
  parent.append(t);
  return t;
}

export interface HeapPanel { cells: Map<number, Cell>; pages: SVGGElement[]; origin: [number, number]; vm: SVGGElement[] }

/** The table: one row per heap page, six rows per page. */
export function heapPanel(parent: SVGElement, ox: number, oy: number, opts: { title?: string; sub?: (o: Order) => string; vm?: boolean } = {}): HeapPanel {
  const group = svg('g', { class: 'ix-heap' }) as SVGGElement;
  place(group, ox, oy);
  parent.append(group);
  title(group, 0, 15, opts.title ?? 'Table: orders (heap)');
  const pages: SVGGElement[] = [];
  const vm: SVGGElement[] = [];
  for (let p = 0; p < PAGES; p++) {
    const label = svg('g', { class: 'ix-page-label', 'data-state': '' }) as SVGGElement;
    label.append(svg('rect', { x: -2, y: cellY(p) - 2, width: G.pageLabel - 4, height: G.ch + 4, rx: 3 }));
    label.append(svg('text', { x: 4, y: cellY(p) + 13 }, 'page'));
    label.append(svg('text', { x: 4, y: cellY(p) + 26, class: 'ix-page-no' }, String(p)));
    if (opts.vm) {
      const bit = svg('g', { class: 'ix-vm', 'data-state': '' }) as SVGGElement;
      bit.append(svg('rect', { x: 23, y: cellY(p) + 17, width: 13, height: 12, rx: 2 }));
      bit.append(svg('text', { x: 29.5, y: cellY(p) + 26.5, 'text-anchor': 'middle' }, ''));
      label.append(bit);
      vm.push(bit);
    }
    group.append(label);
    pages.push(label);
  }
  const cells = new Map<number, Cell>();
  for (const o of orders) {
    const c = cell(group, String(o.customer), opts.sub ? opts.sub(o) : `#${o.id}`, 'ix-row');
    moveCell(c, G.pageLabel + cellX(o.slot - 1), cellY(o.page));
    cells.set(o.id, c);
  }
  return { cells, pages, origin: [ox, oy], vm };
}

export const heapWidth = G.pageLabel + gridWidth;

export function setVm(bit: SVGGElement, on: boolean) {
  bit.setAttribute('data-state', on ? 'on' : '');
  bit.querySelector('text')!.textContent = on ? '✓' : '';
}

export interface IndexPanel {
  cells: Map<number, Cell>;
  origin: [number, number];
  gridX: number;
  rootSlots: SVGGElement[];
  branchSlots: SVGGElement[][];
  leafRows: SVGRectElement[];
  position: (i: number) => [number, number];
  group: SVGGElement;
}

/** An index: entries in order, six to a leaf page. */
export function indexPanel(
  parent: SVGElement, ox: number, oy: number, entries: Order[],
  opts: { title: string; key?: (o: Order) => string; sub?: (o: Order) => string; tree?: boolean; rows?: number },
): IndexPanel {
  const group = svg('g', { class: 'ix-index' }) as SVGGElement;
  place(group, ox, oy);
  parent.append(group);
  const rows = opts.rows ?? PAGES;
  const gridX = opts.tree ? treeWidth : 0;
  const heading = title(group, gridX, 15, opts.title);
  if (opts.tree) heading.setAttribute('class', 'ix-tree-head');
  const leafRows: SVGRectElement[] = [];
  for (let r = 0; r < rows; r++) {
    const rect = svg('rect', { class: 'ix-leaf', x: gridX - 3, y: cellY(r) - 3, width: gridWidth + 6, height: G.ch + 6, rx: 3, 'data-state': '' }) as SVGRectElement;
    group.append(rect);
    leafRows.push(rect);
  }
  const rootSlots: SVGGElement[] = [];
  const branchSlots: SVGGElement[][] = [];
  if (opts.tree) {
    const rowsH = (from: number, to: number) => cellY(to) + G.ch - cellY(from);
    // Root: two slots, each spanning the three leaves below one branch.
    const rootX = 0;
    const branchX = G.rootW + G.treeGap;
    group.append(svg('text', { x: rootX + G.rootW / 2, y: 15, class: 'ix-tree-head', 'text-anchor': 'middle' }, 'root'));
    group.append(svg('text', { x: branchX + G.branchW / 2, y: 15, class: 'ix-tree-head', 'text-anchor': 'middle' }, 'branch'));
    root.forEach((slot, i) => {
      const g = svg('g', { class: 'ix-slot', 'data-state': '' }) as SVGGElement;
      const y = cellY(i * 3);
      const h = rowsH(i * 3, i * 3 + 2);
      g.append(svg('rect', { x: rootX, y, width: G.rootW, height: h, rx: 2 }));
      g.append(svg('text', { x: rootX + G.rootW / 2, y: y + h / 2 + 4, 'text-anchor': 'middle' }, slot.label));
      group.append(g);
      rootSlots.push(g);
    });
    branches.forEach((slots, b) => {
      const list: SVGGElement[] = [];
      slots.forEach((slot) => {
        const g = svg('g', { class: 'ix-slot', 'data-state': '' }) as SVGGElement;
        const y = cellY(slot.child);
        g.append(svg('rect', { x: branchX, y, width: G.branchW, height: G.ch, rx: 2 }));
        g.append(svg('text', { x: branchX + G.branchW / 2, y: y + G.ch / 2 + 4, 'text-anchor': 'middle' }, slot.label));
        g.append(svg('path', { class: 'ix-downlink', d: `M ${branchX + G.branchW} ${y + G.ch / 2} H ${gridX - 3}` }));
        group.append(g);
        list.push(g);
      });
      branchSlots.push(list);
    });
  }
  const position = (i: number): [number, number] => [gridX + cellX(i % PAGE_ROWS), cellY(Math.floor(i / PAGE_ROWS))];
  const cells = new Map<number, Cell>();
  entries.forEach((o, i) => {
    const c = cell(group, opts.key ? opts.key(o) : String(o.customer), opts.sub ? opts.sub(o) : `(${o.page},${o.slot})`, 'ix-entry');
    const [x, y] = position(i);
    moveCell(c, x, y);
    cells.set(o.id, c);
  });
  return { cells, origin: [ox, oy], gridX, rootSlots, branchSlots, leafRows, position, group };
}

export const indexWidth = (tree: boolean) => (tree ? treeWidth : 0) + gridWidth;

/** Absolute centre of a cell within the SVG. */
export function centre(panelOrigin: [number, number], c: Cell): [number, number] {
  return [panelOrigin[0] + c.x + G.cw / 2, panelOrigin[1] + c.y + G.ch / 2];
}

/** A pointer from an index entry to a table row. */
export function pointer(parent: SVGElement, from: [number, number], to: [number, number], vertical: boolean) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  let d: string;
  if (vertical) {
    const sy = y1 + G.ch / 2;
    const ey = y2 - G.ch / 2;
    const mid = (sy + ey) / 2;
    d = `M ${x1} ${sy} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${ey}`;
  } else {
    const sx = x1 + G.cw / 2;
    const ex = x2 - G.cw / 2;
    const mid = (sx + ex) / 2;
    d = `M ${sx} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${ex} ${y2}`;
  }
  const path = svg('path', { class: 'ix-pointer', d, pathLength: 1 });
  parent.append(path);
  return path;
}
