interface SearchPassage { title: string; url: string; excerpt: string; }
interface SearchResult extends SearchPassage {
  meta: { title: string; description?: string; subject?: string; kind?: string };
  sub_results?: SearchPassage[];
}
interface SearchHit { data(): Promise<SearchResult>; }
interface SearchIndex {
  search(query: string | null, options: { filters: Record<string, string> }): Promise<{ results: SearchHit[] }>;
}
interface RecentSearch { query: string; kind: string; }
const historyKey = 'staycurrent-search-history';
let index: Promise<SearchIndex> | undefined;

function loadIndex() {
  const bundle = `${import.meta.env.BASE_URL}pagefind/pagefind.js`;
  return index ??= import(/* @vite-ignore */ bundle).catch(error => {
    index = undefined;
    throw error;
  });
}

function recentSearches(): RecentSearch[] {
  try {
    const saved = JSON.parse(localStorage.getItem(historyKey) ?? '[]');
    return Array.isArray(saved) ? saved.filter(item => typeof item?.query === 'string' &&
      ['', 'Article', 'Guide', 'Playground'].includes(item.kind)).slice(0, 4) : [];
  } catch { return []; }
}

function setupSearch(panel: HTMLElement) {
  const query = <T extends HTMLElement>(selector: string) => panel.querySelector<T>(selector)!;
  const input = query<HTMLInputElement>('[data-query]');
  const form = query<HTMLFormElement>('form');
  const clear = query<HTMLButtonElement>('[data-clear]');
  const start = query('[data-start]');
  const status = query('[data-status]');
  const heading = query('[data-results-heading]');
  const ranking = query('[data-ranking]');
  const output = query('[data-output]');
  const results = query<HTMLOListElement>('[data-results]');
  const empty = query('[data-empty]');
  const resetFilters = query<HTMLButtonElement>('[data-reset-filters]');
  const more = query<HTMLButtonElement>('[data-more]');
  const modal = panel.dataset.modal === 'true';
  const kindButtons = [...panel.querySelectorAll<HTMLButtonElement>('[data-kind]')];
  let kind = '';
  let legacySubject = '';
  let hits: SearchHit[] = [];
  let shown = 0;
  let revision = 0;
  let timer: ReturnType<typeof setTimeout>;

  function searchURL() {
    const url = new URL(`${import.meta.env.BASE_URL}search/`, location.origin);
    if (input.value.trim()) url.searchParams.set('q', input.value.trim());
    if (kind) url.searchParams.set('kind', kind);
    if (legacySubject) url.searchParams.set('subject', legacySubject);
    return url;
  }

  function saveQuery() {
    if (modal) return;
    const url = new URL(location.href);
    for (const [key, value] of [['q', input.value.trim()], ['kind', kind], ['subject', legacySubject]]) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    history.replaceState(null, '', url);
  }

  function remember() {
    const text = input.value.trim();
    if (!text) return;
    try {
      const saved = recentSearches().filter(item => item.query !== text || item.kind !== kind);
      localStorage.setItem(historyKey, JSON.stringify([{ query: text, kind }, ...saved].slice(0, 4)));
    } catch { /* Search also works when browser storage is unavailable. */ }
  }

  function renderRecents() {
    const saved = recentSearches();
    query('[data-recents]').hidden = !saved.length;
    query('[data-recent-list]').replaceChildren(...saved.map(item => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = item.query;
      button.addEventListener('click', () => {
        input.value = item.query;
        kind = item.kind;
        legacySubject = '';
        schedule();
        input.focus();
      });
      return button;
    }));
  }

  function resultElement(result: SearchResult) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.className = 'search-hit';
    link.href = result.url;
    link.dataset.hit = '';
    const icon = document.createElement('span');
    icon.className = 'search-hit-icon';
    const glyph = result.meta.kind === 'Playground'
      ? '<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-12-2 18"/>'
      : result.meta.kind === 'Guide'
        ? '<path d="M12 5v15M3 4c4-1 6 0 9 1 3-1 5-2 9-1v15c-4-1-6 0-9 1-3-1-5-2-9-1V4Z"/>'
        : '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Zm0 0v6h6M8 13h8M8 17h5"/>';
    icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${glyph}</svg>`;
    const copy = document.createElement('div');
    copy.className = 'search-hit-copy';
    const title = document.createElement('h2');
    title.textContent = result.meta.title;
    const meta = document.createElement('div');
    meta.className = 'search-hit-meta';
    const badge = document.createElement('span');
    badge.className = 'search-hit-kind';
    badge.textContent = result.meta.kind ?? 'Article';
    const subject = document.createElement('span');
    subject.textContent = result.meta.subject ?? '';
    meta.append(badge, subject);
    const excerpt = document.createElement('p');
    // Pagefind escapes source HTML before adding its <mark> highlights.
    excerpt.innerHTML = result.excerpt;
    copy.append(title, meta, excerpt);
    const arrow = document.createElement('span');
    arrow.className = 'search-hit-arrow';
    arrow.ariaHidden = 'true';
    arrow.textContent = '↗';
    link.append(icon, copy, arrow);
    item.append(link);
    const passage = result.sub_results?.find(section => section.url.includes('#'));
    if (passage) {
      const section = document.createElement('a');
      section.className = 'search-hit-section';
      section.href = passage.url;
      section.textContent = `↳ ${passage.title}`;
      item.append(section);
    }
    return item;
  }

  function reportError() {
    const reload = document.createElement('a');
    reload.href = searchURL().href;
    reload.textContent = 'Reload to try again';
    heading.hidden = false;
    ranking.hidden = true;
    status.replaceChildren('Search couldn’t load. ', reload, '.');
  }

  async function showNext(current: number, focus = false) {
    const next = await Promise.all(hits.slice(shown, shown + 8).map(hit => hit.data()));
    if (current !== revision) return;
    const items = next.map(resultElement);
    results.append(...items);
    shown += next.length;
    more.hidden = shown >= hits.length;
    more.disabled = false;
    empty.hidden = hits.length > 0;
    resetFilters.hidden = !kind && !legacySubject;
    ranking.hidden = !hits.length;
    status.textContent = `${hits.length} ${hits.length === 1 ? 'result' : 'results'}${shown < hits.length ? ` · showing ${shown}` : ''}`;
    if (focus) items[0]?.querySelector<HTMLAnchorElement>('[data-hit]')?.focus();
  }

  async function search(current: number, openFirst: boolean) {
    const text = input.value.trim();
    const selected = kind;
    const subject = legacySubject;
    try {
      const pagefind = await loadIndex();
      if (current !== revision) return;
      const found = await pagefind.search(text || null, { filters: {
        ...(selected ? { Kind: selected } : {}), ...(subject ? { Subject: subject } : {}),
      } });
      if (current !== revision) return;
      hits = found.results;
      shown = 0;
      await showNext(current);
      if (openFirst && current === revision) results.querySelector<HTMLAnchorElement>('[data-hit]')?.click();
    } catch {
      if (current === revision) reportError();
    } finally {
      if (current === revision) output.setAttribute('aria-busy', 'false');
    }
  }

  function schedule(delay = 0, openFirst = false) {
    clearTimeout(timer);
    const current = ++revision;
    const active = Boolean(input.value.trim() || kind || legacySubject);
    kindButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.kind === kind)));
    clear.hidden = !input.value;
    start.hidden = active;
    heading.hidden = !active;
    ranking.hidden = true;
    empty.hidden = true;
    results.replaceChildren();
    hits = [];
    shown = 0;
    more.hidden = true;
    more.disabled = false;
    status.textContent = active ? 'Searching…' : '';
    output.setAttribute('aria-busy', String(active));
    saveQuery();
    const fullSearch = panel.querySelector<HTMLAnchorElement>('[data-full-search]');
    if (fullSearch) fullSearch.href = searchURL().href;
    if (active) timer = setTimeout(() => { void search(current, openFirst); }, delay);
    else renderRecents();
  }

  function restoreQuery() {
    if (modal) return;
    const params = new URLSearchParams(location.search);
    input.value = params.get('q') ?? '';
    kind = params.get('kind') ?? '';
    if (!kindButtons.some(button => button.dataset.kind === kind)) kind = '';
    legacySubject = params.get('subject') ?? '';
  }

  input.addEventListener('input', event => { if (!(event as InputEvent).isComposing) schedule(140); });
  input.addEventListener('compositionend', () => schedule(140));
  input.addEventListener('focus', () => { void loadIndex().catch(() => {}); }, { once: true });
  clear.addEventListener('click', () => { input.value = ''; schedule(); input.focus(); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const first = results.querySelector<HTMLAnchorElement>('[data-hit]');
    if (first) first.click();
    else schedule(0, true);
  });
  kindButtons.forEach(button => button.addEventListener('click', () => {
    kind = button.dataset.kind ?? '';
    legacySubject = '';
    schedule();
  }));
  resetFilters.addEventListener('click', () => { kind = ''; legacySubject = ''; schedule(); input.focus(); });
  panel.querySelectorAll<HTMLAnchorElement>('[data-suggestion]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    input.value = link.dataset.suggestion ?? '';
    schedule();
    input.focus();
  }));
  query('[data-forget]').addEventListener('click', () => {
    try { localStorage.removeItem(historyKey); } catch {}
    renderRecents();
    input.focus();
  });
  results.addEventListener('click', event => {
    if ((event.target as Element).closest('a')) remember();
  });
  panel.addEventListener('keydown', event => {
    if (event.isComposing || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const links = [...results.querySelectorAll<HTMLAnchorElement>('[data-hit]')];
    if (!links.length) return;
    const active = document.activeElement;
    if (active !== input && !links.includes(active as HTMLAnchorElement)) return;
    event.preventDefault();
    const position = links.indexOf(active as HTMLAnchorElement);
    if (active === input) {
      links[event.key === 'ArrowDown' ? 0 : links.length - 1]?.focus();
      return;
    }
    const next = event.key === 'ArrowDown' ? position + 1 : position - 1;
    if (next < 0) input.focus();
    else links[next % links.length]?.focus();
  });
  more.addEventListener('click', async () => {
    const current = revision;
    more.disabled = true;
    output.setAttribute('aria-busy', 'true');
    try { await showNext(current, true); }
    catch { if (current === revision) reportError(); }
    finally {
      if (current === revision) {
        more.disabled = false;
        output.setAttribute('aria-busy', 'false');
      }
    }
  });
  window.addEventListener('popstate', () => { if (!modal) { restoreQuery(); schedule(); } });
  panel.addEventListener('search-open', () => { renderRecents(); input.focus(); });
  restoreQuery();
  schedule();
}

document.querySelectorAll<HTMLElement>('search-panel').forEach(setupSearch);
const dialog = document.querySelector<HTMLDialogElement>('#global-search');
let opener: HTMLElement | null = null;
function openSearch(trigger?: HTMLElement) {
  if (!dialog) {
    document.querySelector<HTMLInputElement>('search-panel [data-query]')?.focus();
    return;
  }
  opener = trigger ?? (document.activeElement as HTMLElement);
  if (!dialog.open) dialog.showModal();
  dialog.querySelector('search-panel')?.dispatchEvent(new Event('search-open'));
}
document.querySelectorAll<HTMLAnchorElement>('[data-open-search]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    openSearch(link);
  });
});
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (dialog?.open) dialog.close();
    else openSearch();
  }
});
dialog?.querySelector('[data-close]')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !event.isComposing) {
    event.preventDefault();
    dialog.close();
  }
});
dialog?.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog?.addEventListener('close', () => opener?.focus());
document.querySelectorAll('[data-search-shortcut]').forEach(label => {
  label.textContent = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K';
});
