import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { FreshnessCorrection } from './freshness-correction';

const { usePathnameMock } = vi.hoisted(() => ({
  usePathnameMock: vi.fn(() => '/'),
}));

vi.mock('next/navigation', () => ({
  usePathname: usePathnameMock,
}));

describe('FreshnessCorrection', () => {
  beforeEach(() => {
    usePathnameMock.mockReturnValue('/');
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-09T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('hides a build-time-fresh dot whose cut date has since aged out of the window', () => {
    document.body.innerHTML =
      '<span class="freshness-dot" data-cut-date="2026-06-01"></span>'; // 38 days old — stale now
    render(<FreshnessCorrection />);

    expect((document.querySelector('.freshness-dot') as HTMLElement).hidden).toBe(true);
  });

  it('keeps a dot visible whose cut date is still within the window', () => {
    document.body.innerHTML = '<span class="freshness-dot" data-cut-date="2026-07-05" hidden></span>';
    render(<FreshnessCorrection />);

    expect((document.querySelector('.freshness-dot') as HTMLElement).hidden).toBe(false);
  });

  it('ignores elements with no data-cut-date attribute', () => {
    document.body.innerHTML = '<span class="freshness-dot"></span>';
    expect(() => render(<FreshnessCorrection />)).not.toThrow();
  });

  it('re-runs the correction when the pathname changes (client-side navigation)', () => {
    document.body.innerHTML = '<span class="freshness-dot" data-cut-date="2026-06-01" hidden></span>';
    const { rerender } = render(<FreshnessCorrection />);
    expect((document.querySelector('.freshness-dot') as HTMLElement).hidden).toBe(true);

    // Simulate navigating to a new article page that renders a fresh dot at
    // build time, with the layout (and this component) persisting.
    document.body.innerHTML = '<span class="freshness-dot" data-cut-date="2026-07-08" hidden></span>';
    usePathnameMock.mockReturnValue('/databases/');
    rerender(<FreshnessCorrection />);

    expect((document.querySelector('.freshness-dot') as HTMLElement).hidden).toBe(false);
  });
});
