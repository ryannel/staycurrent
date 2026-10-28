// Each rule against a small page that passes it and one that doesn't.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makePage, siteFrom } from '../site.mjs';
import { rules } from '../rules/index.mjs';
import config from '../config.mjs';

const rule = (id) => rules.find((r) => r.id === id);
const kind = (k) => `<meta data-pagefind-meta="kind[content]" content="${k}">`;

/** A page shaped like the house article: title line, opening, contents, sections, sources. */
function article({ meta = '<span>Deep dive</span><span>About 16 minutes</span>', contents = 'after', sections = ['One', 'Two', 'Sources and further reading'], body = '' } = {}) {
  const nav = `<nav aria-label="In this article"><ol>${sections.map((s) => `<li>${s}</li>`).join('')}</ol></nav>`;
  return `<html><head>${kind('Article')}</head><body><main><article>
    <header><h1>Indexes</h1><div class="essay-meta">${meta}</div></header>
    ${contents === 'before' ? nav : ''}<p>An index lets a database find rows.</p>${contents === 'after' ? nav : ''}
    ${body}${sections.map((s, i) => `<section id="s${i}"><h2>${s}</h2><p>Text.</p></section>`).join('')}
  </article></main></body></html>`;
}
const run = (id, html, { url = '/a/', others = [], files = [], options } = {}) => {
  const page = makePage(url, html);
  const site = siteFrom([page, ...others], files);
  const entry = config.rules[id];
  return rule(id).check(page, site, options ?? (Array.isArray(entry) ? entry[1] : {}));
};

test('every rule explains itself and has a level in the config', () => {
  for (const r of rules) {
    assert.ok(r.id && r.why, `${r.id} needs an id and a why`);
    assert.ok(r.id in config.rules, `${r.id} has no level in config.mjs`);
  }
});

test('the house article shape passes every page rule', () => {
  for (const r of rules.filter((r) => !r.source)) assert.deepEqual(run(r.id, article()), [], r.id);
});

test('single-h1', () => {
  assert.equal(run('single-h1', '<main><h1>A</h1><h1>B</h1></main>').length, 1);
});

test('heading-levels', () => {
  assert.equal(run('heading-levels', '<main><h1>A</h1><h2>B</h2><h4>C</h4></main>').length, 1);
  assert.deepEqual(run('heading-levels', '<main><h1>A</h1><h2>B</h2><h3>C</h3><h2>D</h2></main>'), []);
});

test('duplicate-ids', () => {
  assert.equal(run('duplicate-ids', '<main><p id="x"></p><p id="x"></p></main>').length, 1);
});

test('image-alt', () => {
  assert.equal(run('image-alt', '<main><img src="a.png"><img src="b.png" alt=""></main>').length, 1);
});

test('internal-links: missing pages and anchors', () => {
  const other = makePage('/b/', '<main><h2 id="here">B</h2></main>');
  const html = '<main><a href="/b/#here">ok</a><a href="/b/#gone">bad anchor</a><a href="/c/">bad page</a><a href="#top">bad local</a><a href="https://x.dev/">external</a><a href="/file.sql">file</a></main>';
  const issues = run('internal-links', html, { others: [other], files: ['/file.sql'] });
  assert.deepEqual(issues.map((i) => i.message), ['no #gone on /b/', 'no page at /c/', 'no #top on this page']);
});

test('no-heading-in-figure', () => {
  assert.equal(run('no-heading-in-figure', '<main><figure><h3>Title</h3></figure><div class="sf-figure"><h3>T</h3></div></main>').length, 2);
  assert.deepEqual(run('no-heading-in-figure', '<main><figure><p class="title">Title</p></figure></main>'), []);
});

test('title-line', () => {
  assert.equal(run('title-line', article({ meta: '<span>Deep dive</span><span>16 min read</span>' })).length, 2);
  assert.equal(run('title-line', article({ meta: 'Deep dive' })).length, 1);
  assert.deepEqual(run('title-line', article({ meta: 'Deep dive · About 17 minutes · Mermaid 11' })), []);
  assert.deepEqual(run('title-line', article({ meta: '<span>Companion to <a href="/x/">Querying</a></span><span>About 9 minutes</span>' })), []);
  assert.deepEqual(run('title-line', article({ meta: 'Relational deep dive · About 9 minutes' })).map((i) => i.message), ['"Relational deep dive" isn\'t an article type (Introduction, Deep dive, Companion, Worked example, Assessment)']);
});

test('contents-after-opening', () => {
  assert.deepEqual(run('contents-after-opening', article({ contents: 'before' })).map((i) => i.message), ['the contents list comes before the opening']);
  assert.equal(run('contents-after-opening', article({ contents: 'none' })).length, 1);
  assert.deepEqual(run('contents-after-opening', article({ contents: 'none', sections: ['One', 'Sources and further reading'] })), []);
});

test('sources-section: optional, but named and last when present', () => {
  assert.deepEqual(run('sources-section', article({ sections: ['One', 'Two', 'Try the idea'] })), []);
  assert.equal(run('sources-section', article({ sections: ['One', 'Further reading'] })).length, 1);
  assert.equal(run('sources-section', article({ sections: ['One', 'Sources & notes'] })).length, 1);
  assert.equal(run('sources-section', article({ sections: ['One', 'Sources and further reading', 'Try the idea'] })).length, 1);
  assert.deepEqual(run('sources-section', article({ sections: ['References and deletion', 'Two'] })), []);
});

test('figure-labels: one word, numbered in page order', () => {
  const figs = (...labels) => article({ body: labels.map((l) => `<figure><div class="kicker">${l}</div><p>Title</p></figure>`).join('') });
  assert.deepEqual(run('figure-labels', figs('Figure 1', 'Figure 2')), []);
  assert.equal(run('figure-labels', figs('Figure 1', 'Animation 2')).length, 1);
  assert.equal(run('figure-labels', figs('Figure 1', 'Figure 3')).length, 1);
  // Prose that mentions a figure isn't a label.
  assert.deepEqual(run('figure-labels', article({ body: '<p>Figure 4 shows the scan.</p>' })), []);
});

test('raw-colour: literals in rules, not in custom properties', () => {
  const file = { path: 'x.css', text: ':root { --ink: #222; } .a { color: #222; } .b { color: var(--ink); } #fade:hover { opacity: 1; }' };
  assert.deepEqual(rule('raw-colour').check(file).map((i) => i.message), ['color: #222']);
  const astro = { path: 'X.astro', text: '<div style="color:#fff"></div><style>.a { fill: rgb(1,2,3); }</style>' };
  assert.equal(rule('raw-colour').check(astro).length, 1);
  const shadows = { path: 'x.css', text: '.a { box-shadow: 0 2px 8px rgb(0 0 0 / .35); } .b { text-shadow: 0 0 2px rgba(255,255,255,.4); } .c { box-shadow: 0 0 0 2px #c33; } .d { stroke: rgba(0,0,0,.4); }' };
  assert.deepEqual(rule('raw-colour').check(shadows).map((i) => i.message), ['box-shadow: 0 0 0 2px #c33', 'stroke: rgba(0,0,0,.4)']);
});

test('viewport-width', () => {
  assert.equal(rule('viewport-width').check({ path: 'x.css', text: '.a { width: 100vw; } .b { margin-left: calc(50% - 100vw / 2); }' }).length, 2);
  assert.deepEqual(rule('viewport-width').check({ path: 'x.css', text: '.a { width: min(1000px, calc(100vw - 3rem)); }' }), []);
});

test('css-balanced', () => {
  assert.deepEqual(rule('css-balanced').check({ path: 'x.css', text: '.a:not(.b) { color: red; } .c { content: "(" }' }), []);
  assert.equal(rule('css-balanced').check({ path: 'x.css', text: '.a:not(.b .c { color: red; }' }).length, 1);
  assert.equal(rule('css-balanced').check({ path: 'x.css', text: '@media print { .a { color: red; }' }).length, 1);
});


test('figure-labels: long captions count beside short figure labels', () => {
  const caption = 'The retained rows show which records can be read while the concurrent transaction changes their current values. ';
  const body = `<figure><figcaption>Figure 1. ${caption}</figcaption></figure><figure><span>Figure 2</span><figcaption>Figure 2. ${caption}</figcaption></figure><figure><figcaption>Figure 3. ${caption}</figcaption></figure>`;
  assert.deepEqual(run('figure-labels', article({ body })), []);
  assert.equal(run('figure-labels', article({ body: body.replace('Figure 3.', 'Figure 4.') })).length, 1);
});

test('dense-prose: caveat-stacked sentences, not plain ones or code', () => {
  const dense = '<p>The first is easy to measure and easy to guess wrongly, since every key carries overhead beyond its value (How Redis works). For a product cache, I wrote 20,000 keys with 2,000-byte values and a TTL and watched <code>used_memory</code> grow: 2,130 bytes a key, about 6% above the key and value, with my laptop’s libc allocator. For small values the overhead is a much larger share, and jemalloc on Linux rounds sizes differently, so measure a sample of your real values on your production build.</p>';
  const plain = '<p>Don’t guess the first number; measure it. Every key costs more than its value, because Redis also stores the key and some bookkeeping of its own. When I did this with 20,000 products of 2,000 bytes each, every key took about 2,130 bytes, 6% more than the key and value alone. Small values carry a much bigger share of overhead.</p>';
  const code = '<p>Run <code>SET product:42 "{\\"name\\": \\"mug\\", \\"price\\": 20, \\"stock\\": 3, \\"tags\\": [1, 2, 3]}" EX 300</code> to store it.</p>';
  assert.deepEqual(run('dense-prose', article({ body: plain + code })), []);
  const found = run('dense-prose', article({ body: dense }));
  assert.ok(found.some((i) => i.message.startsWith('sentence') && i.message.includes('For a product cache')));
  assert.ok(found.some((i) => i.message.startsWith('paragraph')));
  // Figures and sources are not running prose.
  assert.deepEqual(run('dense-prose', article({ body: `<figure>${dense}</figure><section class="essay-sources">${dense}</section>` })), []);
});
