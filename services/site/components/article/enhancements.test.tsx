import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { ArticleEnhancements } from './enhancements';

const { mermaidRenderMock, mermaidInitializeMock } = vi.hoisted(() => ({
  mermaidRenderMock: vi.fn(),
  mermaidInitializeMock: vi.fn(),
}));

vi.mock('mermaid', () => ({
  default: {
    initialize: mermaidInitializeMock,
    render: mermaidRenderMock,
  },
}));

function renderEnhancements() {
  return render(
    <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem storageKey="theme">
      <ArticleEnhancements />
    </ThemeProvider>
  );
}

describe('ArticleEnhancements — copy affordance', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div class="article-body"><pre>const x = 1;</pre></div>';
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('copies exactly the code text (no button icon leaks in) and reverts feedback after 1500ms', async () => {
    vi.useFakeTimers();
    renderEnhancements();

    const button = document.querySelector('.code-copy-btn') as HTMLButtonElement;
    expect(button).not.toBeNull();
    expect(button).toHaveAttribute('aria-label', 'Copy code');

    fireEvent.click(button);

    // The captured code text only — the pre-fix bug appended the button's own
    // glyph/label because it read `pre.textContent` after the button was
    // already a child of `pre`.
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('const x = 1;');
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);

    expect(button).toHaveAttribute('aria-label', 'Copied');
    expect(button.classList.contains('is-copied')).toBe(true);

    vi.advanceTimersByTime(1500);

    expect(button).toHaveAttribute('aria-label', 'Copy code');
    expect(button.classList.contains('is-copied')).toBe(false);
  });

  it('never lets the copy affordance icon end up inside the copied clipboard text', async () => {
    renderEnhancements();
    const button = document.querySelector('.code-copy-btn') as HTMLButtonElement;

    fireEvent.click(button);

    const [copied] = (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(copied).not.toContain('svg');
    expect(copied.trim()).toBe('const x = 1;');
  });
});

describe('ArticleEnhancements — scrollable-region keyboard access', () => {
  function mockOverflow(el: Element, scrollWidth: number, clientWidth: number) {
    Object.defineProperty(el, 'scrollWidth', { value: scrollWidth, configurable: true });
    Object.defineProperty(el, 'clientWidth', { value: clientWidth, configurable: true });
  }

  it('gives a genuinely overflowing table tabindex/role/aria-label (axe scrollable-region-focusable)', async () => {
    document.body.innerHTML = '<div class="article-body"><table><tr><td>wide</td></tr></table></div>';
    const table = document.querySelector('table') as HTMLElement;
    mockOverflow(table, 900, 600);

    renderEnhancements();

    expect(table).toHaveAttribute('tabindex', '0');
    expect(table).toHaveAttribute('role', 'region');
    expect(table).toHaveAttribute('aria-label');
  });

  it('leaves a table that does not overflow untouched', async () => {
    document.body.innerHTML = '<div class="article-body"><table><tr><td>narrow</td></tr></table></div>';
    const table = document.querySelector('table') as HTMLElement;
    mockOverflow(table, 400, 600);

    renderEnhancements();

    expect(table).not.toHaveAttribute('tabindex');
    expect(table).not.toHaveAttribute('role');
  });

  it('re-evaluates on resize', async () => {
    document.body.innerHTML = '<div class="article-body"><table><tr><td>resizable</td></tr></table></div>';
    const table = document.querySelector('table') as HTMLElement;
    mockOverflow(table, 400, 600); // starts non-overflowing

    renderEnhancements();
    expect(table).not.toHaveAttribute('tabindex');

    mockOverflow(table, 900, 600); // now overflows, e.g. after a viewport resize
    window.dispatchEvent(new Event('resize'));

    expect(table).toHaveAttribute('tabindex', '0');
  });
});

describe('ArticleEnhancements — mermaid render failure', () => {
  beforeEach(() => {
    mermaidRenderMock.mockReset().mockRejectedValue(new Error('mock parse failure'));
    mermaidInitializeMock.mockReset();
    document.body.innerHTML =
      '<div class="article-body">' +
      '<div class="mermaid-figure" data-mermaid="graph TD; A --> B">' +
      '<pre class="mermaid-source">graph TD; A --&gt; B</pre>' +
      '</div>' +
      '</div>';
  });

  it('leaves the fenced source visible and adds no rendered/error element when mermaid.render rejects', async () => {
    renderEnhancements();

    await waitFor(() => expect(mermaidRenderMock).toHaveBeenCalled());

    const sourceEl = document.querySelector('.mermaid-source') as HTMLElement;
    expect(sourceEl).not.toBeNull();
    expect(sourceEl.style.display).not.toBe('none');
    expect(document.querySelector('.mermaid-rendered')).toBeNull();
  });

  it('sets suppressErrorRendering so mermaid never deposits an error SVG itself', async () => {
    renderEnhancements();

    await waitFor(() => expect(mermaidInitializeMock).toHaveBeenCalled());

    expect(mermaidInitializeMock).toHaveBeenCalledWith(
      expect.objectContaining({ suppressErrorRendering: true })
    );
  });
});
