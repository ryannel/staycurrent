import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// jsdom doesn't implement matchMedia — next-themes (system-preference
// resolution) and any prefers-color-scheme/prefers-reduced-motion check need
// it to exist at all, even though no test asserts a particular OS preference.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList;
}

// jsdom has no IntersectionObserver either — the TOC rail's scroll-spy uses
// one. A no-op stub is enough: no test in this suite asserts scroll-triggered
// highlighting (that behaviour is proven end-to-end by the Playwright
// interface test against a real browser); component tests only need the
// constructor to exist so mounting doesn't throw.
if (typeof window !== "undefined" && !("IntersectionObserver" in window)) {
  class NoopIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  // @ts-expect-error — partial stub, sufficient for jsdom component tests.
  window.IntersectionObserver = NoopIntersectionObserver;
}

afterEach(() => {
  cleanup();
});
