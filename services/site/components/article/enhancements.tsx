'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

const COPY_LABEL = 'Copy code';
const COPIED_LABEL = 'Copied';

// Inlined Lucide `Copy`/`Check` icon markup (lucide-react's own path data,
// stroke conventions: viewBox 0 0 24 24, stroke=currentColor, stroke-width 2,
// round caps/joins) — the copy button is DOM-injected here, outside React,
// so importing the React icon components isn't an option (Iconography spec,
// docs/design-system.md § Graphical UI: every icon in the product is Lucide,
// never a text glyph).
const COPY_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>' +
  '<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>' +
  '</svg>';
const CHECK_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M20 6 9 17l-5-5"/>' +
  '</svg>';

/**
 * Progressively enhances every `pre` in `.article-body` with the ghost copy
 * affordance (Code blocks spec, docs/design-system.md): visible always (not
 * hover-revealed), icon swaps to a check for 1500ms on copy. Runs once — the
 * mermaid-fence transform's readable `<pre class="mermaid-source">` is the one
 * guaranteed code-block-shaped element on a v1 article, but any real fenced
 * code block a future article adds gets the same affordance for free.
 */
function enhanceCodeBlocks(): () => void {
  const blocks = Array.from(document.querySelectorAll<HTMLPreElement>('.article-body pre'));
  const cleanups: Array<() => void> = [];

  for (const pre of blocks) {
    if (pre.querySelector('.code-copy-btn')) continue;

    // Captured BEFORE the button is appended below — `pre.textContent` reads
    // every descendant text node, so reading it any later would include the
    // button's own glyph/label text in the copied string (every copy ending
    // with the icon's accessible text, the confirmed live bug).
    const codeText = pre.textContent ?? '';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-copy-btn';
    button.setAttribute('aria-label', COPY_LABEL);
    button.innerHTML = COPY_ICON_SVG;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const onClick = () => {
      void navigator.clipboard?.writeText(codeText).catch(() => {});
      button.innerHTML = CHECK_ICON_SVG;
      button.classList.add('is-copied');
      button.setAttribute('aria-label', COPIED_LABEL);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        button.innerHTML = COPY_ICON_SVG;
        button.classList.remove('is-copied');
        button.setAttribute('aria-label', COPY_LABEL);
      }, 1500);
    };

    button.addEventListener('click', onClick);
    pre.appendChild(button);
    cleanups.push(() => {
      if (timer) clearTimeout(timer);
      button.removeEventListener('click', onClick);
      button.remove();
    });
  }

  return () => cleanups.forEach((cleanup) => cleanup());
}

/**
 * Renders every `.mermaid-figure`'s `data-mermaid` source in-theme (Diagrams
 * spec: house theme built from the tokens, both palettes ship, diagrams
 * re-render on theme switch). The reserved `min-height: 320px` slice 2.1
 * already stamped onto the container absorbs the initial layout; a
 * successful render may still extend beyond it (diagram growth beyond the
 * reservation is accepted — see `lib/content.ts`), so a real render can grow
 * the page without ever shifting *already-settled* text. A failed render
 * (Diagram render failure, Error & Honesty Choreography) leaves the fenced
 * source visible rather than force a broken result — the no-JS fallback and
 * the render-failure fallback are the same DOM state by construction.
 *
 * `isStale` is checked right before each figure's result is applied to the
 * DOM: `resolvedTheme` flipping again while a render is still in flight must
 * not let that now-superseded call's (possibly wrong-palette) result land
 * after the newer call's — this is the overlapping-run guard, not a
 * cancellation of the in-flight `mermaid.render()` call itself.
 */
async function renderMermaidDiagrams(isDark: boolean, isStale: () => boolean): Promise<void> {
  const figures = Array.from(document.querySelectorAll<HTMLElement>('.mermaid-figure'));
  if (figures.length === 0) return;

  const mermaidModule = await import('mermaid');
  const mermaid = mermaidModule.default;

  const palette = isDark
    ? { bg: '#242019', border: '#4c473f', ink: '#dcd7cc' }
    : { bg: '#f1eee8', border: '#c9c4ba', ink: '#3a332c' };

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'base',
    // A parse/render failure otherwise deposits a visible "Syntax error"
    // diagram SVG at the end of <body> (one per failed render attempt,
    // confirmed live) — suppressed here; the catch below keeps the fenced
    // source visible instead, which is the designed failure state.
    suppressErrorRendering: true,
    themeVariables: {
      background: 'transparent',
      primaryColor: palette.bg,
      primaryTextColor: palette.ink,
      primaryBorderColor: palette.border,
      lineColor: palette.border,
      secondaryColor: palette.bg,
      tertiaryColor: palette.bg,
      textColor: palette.ink,
      fontSize: '13px',
    },
  });

  await Promise.all(
    figures.map(async (figure, index) => {
      const source = figure.getAttribute('data-mermaid');
      if (!source) return;

      const renderId = `mermaid-diagram-${index}-${Math.random().toString(36).slice(2)}`;
      try {
        const { svg } = await mermaid.render(renderId, source);
        if (isStale()) return; // a newer theme flip started — discard this palette

        let rendered = figure.querySelector<HTMLElement>('.mermaid-rendered');
        if (!rendered) {
          rendered = document.createElement('div');
          rendered.className = 'mermaid-rendered';
          figure.insertBefore(rendered, figure.firstChild);
        }
        rendered.innerHTML = svg;

        const sourceEl = figure.querySelector('.mermaid-source');
        if (sourceEl instanceof HTMLElement) sourceEl.style.display = 'none';
      } catch {
        // Leave the fenced source visible — the designed failure state, not
        // a broken-image glyph.
      }
    })
  );
}

/**
 * Gives keyboard scroll access to any horizontally-overflowing structural
 * element in the article. Tables, code blocks, and mermaid diagrams are
 * deliberately allowed to extend to `min(88ch, 100%)` — wider than the 72ch
 * reading column (docs/design-system.md's Reading column spec) — which means
 * they can genuinely overflow and, without this, become mouse/trackpad-only
 * scrollable regions (axe-core's `scrollable-region-focusable`, CONFIRMED
 * live on a wide table). Re-evaluated on resize since whether an element
 * actually overflows is viewport-dependent.
 */
function enhanceScrollableRegions(): () => void {
  const candidates = Array.from(
    document.querySelectorAll<HTMLElement>('.article-body table, .article-body pre, .mermaid-figure')
  );
  if (candidates.length === 0) return () => {};

  const sync = () => {
    for (const el of candidates) {
      if (el.scrollWidth > el.clientWidth) {
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'region');
        if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', 'Scrollable content');
      } else {
        el.removeAttribute('tabindex');
        el.removeAttribute('role');
        el.removeAttribute('aria-label');
      }
    }
  };

  sync();
  window.addEventListener('resize', sync);
  return () => window.removeEventListener('resize', sync);
}

/** Mounted once per article page; renders nothing itself. */
export function ArticleEnhancements() {
  const { resolvedTheme } = useTheme();
  // Generation counter: each theme flip's render pass checks, right before
  // touching the DOM, whether a later pass has already started — guards
  // against rapid theme flips interleaving palettes if an older `Promise.all`
  // resolves after a newer one starts.
  const generationRef = useRef(0);

  useEffect(() => enhanceCodeBlocks(), []);
  useEffect(() => enhanceScrollableRegions(), []);

  useEffect(() => {
    const generation = ++generationRef.current;
    void renderMermaidDiagrams(resolvedTheme === 'dark', () => generationRef.current !== generation);
  }, [resolvedTheme]);

  return null;
}
