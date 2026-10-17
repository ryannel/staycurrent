// Loads the built site into a form the rules can query.
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { parse } from 'node-html-parser';

/** Every element in document order, so rules can ask which of two came first. */
function documentOrder(root) {
  const order = new Map();
  let i = 0;
  const walk = (node) => {
    order.set(node, i++);
    for (const child of node.childNodes) if (child.nodeType === 1) walk(child);
  };
  walk(root);
  return order;
}

/** The page kind the layout gives search: Article, Guide or Playground. */
function pageKind(root) {
  const meta = root.querySelectorAll('meta').find((m) => m.getAttribute('data-pagefind-meta') === 'kind[content]');
  return meta?.getAttribute('content') ?? null;
}

export function makePage(url, html, file = null) {
  const root = parse(html, { comment: false });
  const main = root.querySelector('main') ?? root;
  const article = main.querySelector('article') ?? main;
  const ids = new Map();
  for (const el of root.querySelectorAll('[id]')) {
    const id = el.getAttribute('id');
    ids.set(id, (ids.get(id) ?? 0) + 1);
  }
  for (const el of root.querySelectorAll('a[name]')) ids.set(el.getAttribute('name'), (ids.get(el.getAttribute('name')) ?? 0) + 1);
  return { url, file, root, main, article, kind: pageKind(root), ids, order: documentOrder(root) };
}

/** True when element a comes before element b in the page. */
export const before = (page, a, b) => page.order.get(a) < page.order.get(b);

/** Whether an element sits inside a figure: a <figure> or anything whose class names a figure. */
export function insideFigure(el) {
  for (let node = el.parentNode; node && node.tagName; node = node.parentNode) {
    if (node.tagName === 'FIGURE') return true;
    const classes = (node.getAttribute?.('class') ?? '').split(/\s+/);
    if (classes.some((c) => c === 'figure' || c.endsWith('-figure'))) return true;
  }
  return false;
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

function urlFor(dist, file) {
  const rel = '/' + relative(dist, file).split(sep).join('/');
  return rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel;
}

/** Every built HTML page, plus the set of every built file for link checks. */
export async function loadSite(dist, { skip = [] } = {}) {
  const pages = [];
  const files = new Set();
  for await (const file of walk(dist)) {
    const url = urlFor(dist, file);
    files.add(url);
    if (!file.endsWith('.html') || skip.some((prefix) => url.startsWith(prefix))) continue;
    const html = await readFile(file, 'utf8');
    // Route aliases are redirect stubs: links to them resolve, but they aren't pages to check.
    if (/<meta http-equiv="refresh"/i.test(html)) continue;
    pages.push(makePage(url, html, file));
  }
  const byUrl = new Map(pages.map((p) => [p.url, p]));
  return { dist, pages, files, byUrl };
}

/** A site built from in-memory pages, for tests. */
export function siteFrom(pages, files = []) {
  const byUrl = new Map(pages.map((p) => [p.url, p]));
  return { dist: null, pages, files: new Set([...pages.map((p) => p.url), ...files]), byUrl };
}
