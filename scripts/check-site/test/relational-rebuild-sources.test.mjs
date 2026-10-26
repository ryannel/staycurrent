import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitRelationalRebuildSources } from '../../../src/lib/relational-rebuild-sources.ts';
import { makePage } from '../site.mjs';

function preview({ body, heading, sources, id }) {
  return `<html><body><a href="#main">Skip to content</a><main id="main"><div class="relational-rebuild">
    <article><div class="article-body">${body}</div><nav id="collection-navigation">Collection</nav></article>
    <nav id="collection-pager">Next</nav><details class="article-sources"${id ? ` id="${id}"` : ''}>
    <summary>${heading}</summary><div class="source-content">${sources}</div></details>
  </div></main></body></html>`;
}

test('sources in a final section preserve the outer article wrapper, assets and main anchor', () => {
  const opening = '<div class="relational-design"><section><h2 id="topic">Topic</h2><p>Text.</p></section>';
  const heading = '<h2 id="sources" data-astro-cid-example>Sources and further reading</h2>';
  const sources = '<p><a href="https://example.com/">Primary source</a></p>';
  const assets = '<style>.relational-design .scene{display:grid}</style><script>window.example = "<section>";</script>';
  const split = splitRelationalRebuildSources(`${opening}<section aria-labelledby="sources">${heading}${sources}</section></div>${assets}`);
  assert.equal(split.body, `${opening}</div>${assets}`);
  assert.equal(split.heading, heading);
  assert.equal(split.sources, sources);

  const page = makePage('/review/example/', preview(split));
  assert.equal(page.ids.get('main'), 1);
  assert.equal(page.ids.get('sources'), 1);
  assert.ok(page.main.querySelector('article .article-body .relational-design #topic'));
  assert.ok(page.main.querySelector('article #collection-navigation'));
  assert.ok(page.main.querySelector('#collection-pager'));
  assert.ok(page.main.querySelector('details.article-sources .source-content a'));
  assert.equal(page.article.querySelectorAll('style').length, 1);
  assert.equal(page.article.querySelectorAll('script').length, 1);
  assert.equal(page.root.querySelector('details style, details script'), null);
});

test('unwrapped sources preserve a parent closing tag and trailing article assets', () => {
  const split = splitRelationalRebuildSources('<div class="article"><p>Opening.</p><h2>Sources and further reading</h2><ul><li>Source</li></ul></div><style>.article{display:block}</style>');
  assert.equal(split.body, '<div class="article"><p>Opening.</p></div><style>.article{display:block}</style>');
  assert.equal(split.heading, '<h2 id="sources-and-further-reading">Sources and further reading</h2>');
  assert.equal(split.sources, '<ul><li>Source</li></ul>');
  assert.equal(makePage('/review/example/', preview(split)).ids.get('main'), 1);
});

test('ordinary section and heading anchors retain their existing split', () => {
  const split = splitRelationalRebuildSources('<p>Opening.</p><section id="references"><h2 id="sources">Sources and further reading</h2><p>Source</p></section>');
  assert.deepEqual(split, { body: '<p>Opening.</p>', heading: '<h2 id="sources">Sources and further reading</h2>', sources: '<p>Source</p>', id: 'references' });
  assert.equal(splitRelationalRebuildSources('<section id="sources"><h2 id="sources">Sources and further reading</h2><p>Source</p></section>').id, undefined);
});

test('content without a sources heading is returned byte for byte', () => {
  const html = '<div><h2 id="topic">Topic</h2><svg viewBox="0 0 10 10"><path d="M0 0"/></svg></div>';
  assert.deepEqual(splitRelationalRebuildSources(html), { body: html, heading: '', sources: '' });
});
