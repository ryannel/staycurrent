const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createRequire } = require('node:module');
const req = createRequire(path.join(process.cwd(), 'package.json'));
const { parse } = req('node-html-parser');
const out = '/tmp/staycurrent-rendered-prose';
fs.mkdirSync(out, { recursive: true });
const hash = text => crypto.createHash('sha256').update(text).digest('hex');
const entries = JSON.parse(fs.readFileSync('src/articles/relational-rebuild/collection.json')).entries
  .map(e => ({ family: 'relational', key: e.key, route: `/learn/databases/relational/${e.slug ? e.slug + '/' : ''}`, source: `src/articles/relational-rebuild/${e.key}.astro` }));
for (const name of fs.readdirSync('src/articles/application-caching').filter(n => n.endsWith('.astro'))) {
  const key = name.slice(0, -6);
  entries.push({ family: 'caching', key, route: `/learn/databases/application-caching/${key === 'index' ? '' : key + '/'}`, source: `src/articles/application-caching/${name}` });
}
const manifest = [];
for (const e of entries) {
  const built = path.join('dist', e.route, 'index.html');
  const html = fs.readFileSync(built, 'utf8');
  const doc = parse(html);
  const article = doc.querySelector('article');
  if (!article) throw new Error(`Missing article: ${built}`);
  const title = article.querySelector('h1')?.textContent || e.key;
  const root = parse(article.outerHTML);
  const removed = root.querySelectorAll('figure').length;
  const standaloneImages = root.querySelectorAll('[role="img"]').filter(n => !n.closest('figure')).length;
  for (const node of root.querySelectorAll('figure,[role="img"],svg,script,style,header,nav,.nested-reading')) node.remove();
  const sources = doc.querySelector('.source-content');
  if (sources) root.appendChild(parse(sources.outerHTML));
  const blocks = [];
  function walk(n) {
    if (/^(H[1-6]|P|PRE|TABLE|LI|SUMMARY)$/.test(n.tagName || '')) {
      blocks.push(n.tagName === 'PRE' ? n.textContent : n.textContent.replace(/\s+/g, ' ').trim());
      return;
    }
    for (const c of n.childNodes || []) walk(c);
  }
  walk(root);
  const text = `TITLE: ${title}\nROUTE: ${e.route}\n\n${blocks.join('\n\n')}\n\nEND ${e.family}/${e.key}; ${removed} figures and ${standaloneImages} standalone image containers removed; code and ordinary tables retained.\n`;
  const file = path.join(out, `${e.family}--${e.key}.txt`);
  fs.writeFileSync(file, text);
  manifest.push({ ...e, file, source_sha256: hash(fs.readFileSync(e.source)), rendered_sha256: hash(html), text_sha256: hash(text), removed_figures: removed, removed_standalone_images: standaloneImages });
}
fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`${manifest.length} rendered articles exported without ${manifest.reduce((sum, e) => sum + e.removed_figures, 0)} figures to ${out}`);
