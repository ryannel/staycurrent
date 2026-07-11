import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render } from '@testing-library/react';
import { InstallBlock } from './install-block';

const COMMAND =
  'curl -fsSL https://staycurrent.dev/skills/databases.zip -o /tmp/databases-skill.zip ' +
  '&& unzip -o /tmp/databases-skill.zip -d ~/.claude/skills/';

describe('InstallBlock', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the one-liner verbatim as an ordinary JSX text child', () => {
    // A plain text child, not `dangerouslySetInnerHTML` — React's server
    // renderer HTML-escapes it in the real static export (` && ` becomes
    // `&amp;&amp;`), which is the correct, safe behavior for real markup.
    // test_milestone_3_published-trust.py's real-build proof now
    // parses/unescapes the served HTML before checking for the one-liner
    // rather than grepping raw bytes for it (see that test's own comment).
    const { container } = render(<InstallBlock command={COMMAND} />);
    const pre = container.querySelector('.install-block-code');
    expect(pre?.textContent).toBe(COMMAND);
  });

  it('copies the exact command and confirms on a successful clipboard write, then reverts after 1500ms', async () => {
    vi.useFakeTimers();
    const { container } = render(<InstallBlock command={COMMAND} />);

    const button = container.querySelector('.install-copy-btn') as HTMLButtonElement;
    expect(button).toHaveAttribute('aria-label', 'Copy code');

    await act(async () => {
      fireEvent.click(button);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(COMMAND);
    expect(button).toHaveAttribute('aria-label', 'Copied');
    expect(button.classList.contains('is-copied')).toBe(true);

    // The timer callback triggers a real React state update (unlike
    // enhancements.tsx's vanilla-DOM copy button) — `act` flushes it
    // synchronously so the assertion below observes the post-revert DOM.
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });

    expect(button).toHaveAttribute('aria-label', 'Copy code');
    expect(button.classList.contains('is-copied')).toBe(false);
  });

  // Fix: the confirmation must be gated on actual clipboard success, not
  // fired optimistically before the write settles.
  it('does not confirm when the clipboard write rejects', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
      configurable: true,
    });
    const { container } = render(<InstallBlock command={COMMAND} />);
    const button = container.querySelector('.install-copy-btn') as HTMLButtonElement;

    await act(async () => {
      fireEvent.click(button);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(COMMAND);
    expect(button).toHaveAttribute('aria-label', 'Copy code');
    expect(button.classList.contains('is-copied')).toBe(false);
  });

  // An absent Clipboard API (e.g. an insecure context) must not throw and
  // must not report a confirmation it never delivered.
  it('does not confirm and does not throw when the Clipboard API is absent', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
    const { container } = render(<InstallBlock command={COMMAND} />);
    const button = container.querySelector('.install-copy-btn') as HTMLButtonElement;

    expect(() => fireEvent.click(button)).not.toThrow();
    await act(async () => {});

    expect(button).toHaveAttribute('aria-label', 'Copy code');
    expect(button.classList.contains('is-copied')).toBe(false);
  });

  // The timer id lives in a ref, cleared before re-arming: a rapid
  // double-click must not let the FIRST click's timer revert the SECOND
  // click's confirmation early.
  it('re-arms the revert timer on a rapid second click instead of truncating it', async () => {
    vi.useFakeTimers();
    const { container } = render(<InstallBlock command={COMMAND} />);
    const button = container.querySelector('.install-copy-btn') as HTMLButtonElement;

    await act(async () => {
      fireEvent.click(button);
    });
    expect(button).toHaveAttribute('aria-label', 'Copied');

    // 1000ms after the first click (500ms shy of its own revert) — a second
    // click here must push the revert out another full 1500ms rather than
    // leaving the first click's timer to fire 500ms from now.
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    await act(async () => {
      fireEvent.click(button);
    });
    expect(button).toHaveAttribute('aria-label', 'Copied');

    // 1000ms after the SECOND click (2000ms after the first) — still
    // confirmed, proving the first click's timer was cleared, not left to
    // fire at the 1500ms-after-first-click mark.
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(button).toHaveAttribute('aria-label', 'Copied');

    // 1500ms after the second click — now it reverts.
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(button).toHaveAttribute('aria-label', 'Copy code');
  });

  it("clicking 'Install skill' performs the same copy action and confirmation", async () => {
    vi.useFakeTimers();
    const { getByRole, container } = render(<InstallBlock command={COMMAND} />);

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Install skill' }));
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(COMMAND);
    const copyBtn = container.querySelector('.install-copy-btn') as HTMLButtonElement;
    expect(copyBtn).toHaveAttribute('aria-label', 'Copied');
  });

  it('the install command region is keyboard-focusable (axe scrollable-region-focusable)', () => {
    const { container } = render(<InstallBlock command={COMMAND} />);
    const pre = container.querySelector('.install-block-code');
    expect(pre).toHaveAttribute('tabindex', '0');
    expect(pre).toHaveAttribute('role', 'region');
    expect(pre).toHaveAttribute('aria-label');
  });
});
