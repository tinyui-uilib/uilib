import "@testing-library/jest-dom";

// Radix uses ResizeObserver internally for positioning calculations.
// jsdom doesn't implement it — mock it so tests don't crash.
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Radix reads matchMedia for reduced-motion preferences.
// jsdom doesn't implement window.matchMedia.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
