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
 * Reads one non-colour design token's live computed value off `<html>` (e.g.
 * `--font-sans`) — the house theme is generated from the tokens at render
 * time, never a hardcoded approximation, so it tracks whichever palette is
 * currently active (`[data-theme]`) without the caller branching on
 * light/dark itself. Falls back to `fallback` only if the token is somehow
 * unset (e.g. a test environment with no stylesheet loaded) — production
 * always has the real value.
 */
function readDesignToken(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/**
 * Reads a COLOUR token's live computed value, normalized to plain 8-bit
 * `rgb()`/`rgba()` — the format every colour library (including mermaid's
 * own, `khroma`) understands. `getComputedStyle(...).getPropertyValue(...)`
 * on this project's `oklch()`-declared tokens comes back as a `lab(...)`
 * string on this browser (CONFIRMED live) rather than the literal `oklch()`
 * source or a plain `rgb()`; `khroma` can't parse either exotic form, which
 * silently failed every diagram render (caught by the try/catch below, so it
 * read as the designed "leave the fenced source visible" failure state
 * rather than a visible error). Even setting an actual CSS *property* (e.g.
 * `color`) and reading its resolved value back doesn't help — CSS Color 4
 * browsers now preserve the source colour space there too instead of
 * downgrading to `rgb()`.
 *
 * Painting the token onto a 1x1 canvas and reading the pixel back via
 * `getImageData` sidesteps all of that: canvas 2D accepts any CSS `<color>`
 * syntax as `fillStyle` (so the OKLCH value paints correctly), but a filled
 * pixel is always plain 8-bit sRGB once rasterized — there's no colour-space
 * string serialization to disagree about.
 */
function readColorToken(name: string, fallback: string): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!raw) return fallback;

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return fallback;

  ctx.fillStyle = raw;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return a === 255 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;
}

const DEFAULT_DIAGRAM_LABEL = 'Diagram';

/**
 * Interim accessible name for a rendered diagram (mermaid's own SVG output
 * carries `role="graphics-document"` with no name of its own). Derived from
 * the nearest preceding heading in the article — e.g. a diagram under
 * "## The storage-layer trade" is labelled "Diagram: The storage-layer
 * trade" — rather than a dedicated caption field, since none exists yet.
 * This is a stand-in pending the caption channel the content contract will
 * add (recorded discovery-note item); once articles can author a real
 * per-figure caption, that should replace this heuristic.
 */
function describeDiagramFigure(figure: HTMLElement): string {
  const articleBody = figure.closest('.article-body');
  if (!articleBody) return DEFAULT_DIAGRAM_LABEL;

  const nodes = Array.from(
    articleBody.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6, .mermaid-figure')
  );
  const index = nodes.indexOf(figure);
  for (let i = index - 1; i >= 0; i--) {
    const node = nodes[i];
    if (/^H[1-6]$/.test(node.tagName)) {
      const text = node.textContent?.trim();
      if (text) return `${DEFAULT_DIAGRAM_LABEL}: ${text}`;
      break;
    }
  }
  return DEFAULT_DIAGRAM_LABEL;
}

/**
 * Renders every `.mermaid-figure`'s `data-mermaid` source in-theme (Diagrams
 * spec: house theme built from the tokens — surfaces `--color-surface-alt`,
 * strokes `--color-rule-strong`, text `--text-ui-small` body ink — both
 * palettes ship, diagrams re-render on theme switch). Colours and the font
 * family are read live via `getComputedStyle` (see `readColorToken`/
 * `readDesignToken` above) rather than hardcoded hex approximations of the
 * OKLCH tokens: every other element on the site renders in one of the three
 * committed families, and mermaid's own default (Trebuchet MS) was the one
 * exception before this. The re-render this component already triggers on
 * every theme flip (below) means these reads naturally track the active
 * palette; no separate light/dark branch is needed here.
 *
 * The reserved `min-height: 320px` slice 2.1 already stamped onto the
 * container absorbs the initial layout; a successful render may still extend
 * beyond it (diagram growth beyond the reservation is accepted — see
 * `lib/content.ts`), so a real render can grow the page without ever
 * shifting *already-settled* text. A failed render (Diagram render failure,
 * Error & Honesty Choreography) leaves the fenced source visible rather than
 * force a broken result — the no-JS fallback and the render-failure fallback
 * are the same DOM state by construction.
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

  // Fallbacks mirror the previous hardcoded palette — only ever used if a
  // token is somehow missing from the stylesheet.
  const surfaceAlt = readColorToken('--color-surface-alt', isDark ? '#242019' : '#f1eee8');
  const ruleStrong = readColorToken('--color-rule-strong', isDark ? '#4c473f' : '#c9c4ba');
  const textBody = readColorToken('--color-text-body', isDark ? '#dcd7cc' : '#3a332c');
  const fontSans = readDesignToken('--font-sans', 'ui-sans-serif, system-ui, sans-serif');

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
      primaryColor: surfaceAlt,
      primaryTextColor: textBody,
      primaryBorderColor: ruleStrong,
      lineColor: ruleStrong,
      secondaryColor: surfaceAlt,
      tertiaryColor: surfaceAlt,
      textColor: textBody,
      // `--text-ui-small`'s size (0.8125rem/13px, Type Scale) — the diagram
      // label register matches the site's smallest UI text, not the essay
      // body copy the figure sits inside.
      fontSize: '13px',
      fontFamily: fontSans,
    },
  });

  await Promise.all(
    figures.map(async (figure, index) => {
      const source = figure.getAttribute('data-mermaid');
      if (!source) return;

      // Interim accessible name for the rendered SVG (`role="graphics-document"`
      // ships with no name of its own) — derived from the nearest preceding
      // heading in the article rather than a dedicated caption field, pending
      // the caption channel the content contract will add (recorded
      // discovery-note item).
      const ariaLabel = describeDiagramFigure(figure);

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

        const svgEl = rendered.querySelector('svg');
        if (svgEl) svgEl.setAttribute('aria-label', ariaLabel);

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
