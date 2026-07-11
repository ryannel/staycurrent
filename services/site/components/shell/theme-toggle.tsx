'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Monitor, Moon, Sun } from 'lucide-react';
import { ICON_STROKE_WIDTH } from '@/lib/icons';

type StoredTheme = 'light' | 'dark' | 'system';

const NOOP_SUBSCRIBE = () => () => {};

/**
 * True only once the client has mounted — the standard `useSyncExternalStore`
 * hydration-safe-flag idiom (no store ever changes, so `subscribe` is a
 * no-op): the server snapshot is always `false`, the client's real snapshot
 * is always `true`, so React renders `false` for hydration's matching pass
 * and flips to `true` right after, without a `setState` call inside an
 * effect (react-hooks/set-state-in-effect).
 */
function useHasMounted(): boolean {
  return useSyncExternalStore(
    NOOP_SUBSCRIBE,
    () => true,
    () => false
  );
}

/**
 * The strict committed cycle (operator decision, docs/design-system.md's
 * shared light/dark rule): light -> dark -> system -> light, always, with no
 * adaptive deviation based on the resolved palette. `theme` (the STORED
 * preference), not `resolvedTheme`, drives the transition — "system" always
 * advances to "light" regardless of what the OS currently resolves it to.
 */
function nextTheme(theme: string | undefined): StoredTheme {
  if (theme === 'light') return 'dark';
  if (theme === 'dark') return 'system';
  return 'light';
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useHasMounted();

  const current = ((mounted ? theme : undefined) ?? 'system') as StoredTheme;
  const upcoming = nextTheme(mounted ? theme : undefined);

  return (
    <button
      type="button"
      className="btn-ghost theme-toggle"
      data-theme-toggle
      aria-label={`Theme: ${current}. Activate to switch to ${upcoming}.`}
      onClick={() => setTheme(nextTheme(theme))}
    >
      {/* Icon reflects the CHOSEN mode (sun/moon/monitor for light/dark/
          system), not the resolved palette — every click gets visible
          feedback (the icon itself changes) even on a click where the
          resolved [data-theme] doesn't (e.g. "system" resolving to the same
          palette "light" already showed). Rendered as direct conditional
          JSX, not a component reference assigned to a variable, so React
          never treats the icon as newly created on every render
          (react-hooks/static-components). */}
      {current === 'light' && <Sun size={16} strokeWidth={ICON_STROKE_WIDTH} aria-hidden="true" />}
      {current === 'dark' && <Moon size={16} strokeWidth={ICON_STROKE_WIDTH} aria-hidden="true" />}
      {current === 'system' && <Monitor size={16} strokeWidth={ICON_STROKE_WIDTH} aria-hidden="true" />}
    </button>
  );
}
