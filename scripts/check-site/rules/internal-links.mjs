// Links to pages on this site, and to #anchors on them, must resolve in the build.
function targetFile(path) {
  if (path.endsWith('/')) return path;
  if (/\.[a-z0-9]+$/i.test(path.split('/').pop())) return path;
  return `${path}/`;
}

export default {
  id: 'internal-links',
  why: 'A renamed page or heading silently breaks every link that pointed at it.',
  kinds: 'all',
  check(page, site, options = {}) {
    const ignore = options.ignorePrefixes ?? [];
    const issues = [];
    const seen = new Set();
    for (const a of page.root.querySelectorAll('a[href]')) {
      const href = a.getAttribute('href');
      if (!href || seen.has(href)) continue;
      seen.add(href);
      if (!href.startsWith('/') && !href.startsWith('#') && !href.startsWith('?')) continue;
      if (href.startsWith('//') || ignore.some((p) => href.startsWith(p))) continue;
      const [beforeHash, hash] = href.split('#');
      const path = beforeHash.split('?')[0];
      const url = path ? targetFile(path) : page.url;
      if (path && !site.files.has(url)) { issues.push({ message: `no page at ${href}` }); continue; }
      if (!hash) continue;
      const target = site.byUrl.get(url);
      if (target && !target.ids.has(decodeURIComponent(hash))) issues.push({ message: `no #${hash} on ${url === page.url ? 'this page' : url}` });
    }
    return issues;
  },
};
