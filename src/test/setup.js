import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Polyfill window.matchMedia if not available in jsdom
if (typeof window !== 'undefined') {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });

  // Mock window.scrollTo to prevent jsdom "Not implemented" warnings
  window.scrollTo = vi.fn();
}
