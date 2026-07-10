import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'next-themes';
import { ThemeToggle } from './theme-toggle';

/**
 * Theme Coverage (testing.md): rendered and verified across the states the
 * design commits to — light, dark, system — not just the default. The cycle
 * itself is the STRICT committed cycle (operator decision): light -> dark ->
 * system -> light, always, regardless of what the OS currently resolves
 * "system" to. Every click still gets visible feedback because the icon
 * tracks the CHOSEN mode, not the resolved palette (sun/moon/monitor for
 * light/dark/system) — asserted below via Lucide's own `lucide-<name>` class.
 */
function renderToggle(defaultTheme: 'light' | 'dark' | 'system' = 'system') {
  return render(
    <ThemeProvider attribute="data-theme" defaultTheme={defaultTheme} enableSystem storageKey="theme">
      <ThemeToggle />
    </ThemeProvider>
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

describe('ThemeToggle', () => {
  it('renders an accessible control naming "theme" once mounted', async () => {
    renderToggle();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /theme/i })).toBeInTheDocument();
    });
  });

  it('carries the data-theme-toggle marker the interface test locates it by', async () => {
    renderToggle();
    await waitFor(() => {
      expect(document.querySelector('[data-theme-toggle]')).not.toBeNull();
    });
  });

  it.each([
    ['light', 'dark'],
    ['dark', 'system'],
    ['system', 'light'],
  ] as const)('advances from %s to %s — the strict committed cycle', async (from, to) => {
    const user = userEvent.setup();
    renderToggle(from);
    const button = await screen.findByRole('button', { name: /theme/i });

    await user.click(button);

    await waitFor(() => expect(localStorage.getItem('theme')).toBe(to));
  });

  it('cycles through all three stored values in order across three clicks, never repeating early', async () => {
    const user = userEvent.setup();
    renderToggle('light');
    const button = await screen.findByRole('button', { name: /theme/i });

    const seen: string[] = [];
    for (let i = 0; i < 3; i++) {
      await user.click(button);
      const stored = await waitFor(() => {
        const value = localStorage.getItem('theme');
        expect(value).not.toBeNull();
        return value as string;
      });
      seen.push(stored);
    }

    expect(seen).toEqual(['dark', 'system', 'light']);
  });

  // "Every click has visible feedback" (operator decision): the icon tracks
  // the CHOSEN mode, so it changes on every single click even where the
  // resolved [data-theme] palette wouldn't (e.g. leaving "system" when the
  // mocked OS preference already resolved it to the same palette "light"
  // states next).
  it.each([
    ['light', 'lucide-sun'],
    ['dark', 'lucide-moon'],
    ['system', 'lucide-monitor'],
  ] as const)('shows the %s icon for the %s mode', async (mode, iconClass) => {
    renderToggle(mode);
    await waitFor(() => {
      expect(document.querySelector(`[data-theme-toggle] svg.${iconClass}`)).not.toBeNull();
    });
  });

  it('changes the icon on every click through the full light -> dark -> system -> light cycle', async () => {
    const user = userEvent.setup();
    renderToggle('light');
    const button = await screen.findByRole('button', { name: /theme/i });

    await waitFor(() => expect(button.querySelector('svg.lucide-sun')).not.toBeNull());

    await user.click(button);
    await waitFor(() => expect(button.querySelector('svg.lucide-moon')).not.toBeNull());

    await user.click(button);
    await waitFor(() => expect(button.querySelector('svg.lucide-monitor')).not.toBeNull());

    await user.click(button);
    await waitFor(() => expect(button.querySelector('svg.lucide-sun')).not.toBeNull());
  });
});
